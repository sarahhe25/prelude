from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, Iterator, Sequence
from dotenv import load_dotenv

load_dotenv()  # load environment variables from .env file

ALLOWED_EVIDENCE = {"synthetic", "employee_sourced", "recruiter_approved"}
ALLOWED_REVIEW = {"draft", "approved_for_demo", "published", "retired"}
# Define topic rules: each topic maps to a tuple of keywords/phrases
TOPIC_RULES = {
    "day_in_the_life": ("day in the life", "typical day", "normal day"),
    "career_path": ("roadmap", "career path", "led you"),
    "tools": ("tools", "jira", "confluence", "asana"),
    "methodologies": ("methodology", "scrum", "kanban", "waterfall"),
    "conflict_management": ("conflict",),
    "performance_management": ("under-performing", "underperforming"),
    "deadlines_and_budget": ("deadline", "budget"),
    "escalations": ("escalation",),
    "delegation": ("delegate", "delegation"),
    "project_outcomes": ("successful project", "results of your last project"),
    "lessons_learned": ("pitfalls", "lessons"),
    "experience": ("what experience",),
}

TOPIC_RULES.update({
    "user_research": (
        "user research", "user interview", "survey", "persona",
        "customer research", "research findings",
    ),
    "accessibility": (
        "accessibility", "accessible", "wcag", "screen reader",
        "color contrast",
    ),
    "design_handoff": (
        "design handoff", "developer handoff", "handoff",
        "engineering handoff", "design specification",
    ),
    "design_systems": (
        "design system", "component library", "style guide",
        "design token",
    ),
    "usability_testing": (
        "usability test", "usability testing", "user testing",
        "prototype testing",
    ),
    "stakeholder_management": (
        "stakeholder", "product manager", "client feedback",
        "presenting designs",
    ),
    "prototyping": (
        "prototype", "prototyping", "wireframe", "wireframing",
        "mockup", "figma",
    ),
    "design_metrics": (
        "design metric", "success metric", "conversion rate",
        "task completion", "engagement", "analytics",
    ),
    "responsive_design": (
        "responsive design", "responsive", "mobile design",
        "tablet", "breakpoint",
    ),
})


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def slug(value: str) -> str:
    '''Convert a string to a URL-friendly slug'''
    result = re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")
    if not result:
        raise ValueError("value cannot produce an empty identifier")
    return result


def digest(value: str) -> str:
    '''Compute a SHA256 hash of a string and return the hex digest'''
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def infer_topics(question: str, answer: str) -> list[str]:
    '''
    Infer topics from a Q&A pair based on predefined rules. 
    Returns a list of topic names that match any of the terms in the question or answer.
    '''
    haystack = f"{question} {answer}".lower()
    return sorted(name for name, terms in TOPIC_RULES.items() if any(term in haystack for term in terms))
    

def parse_transcript(text: str, interviewer: str, respondent: str) -> list[tuple[str, str]]:
    '''
    Parse a transcript into a list of (question, answer) pairs based on speaker labels
    '''
    turn = re.compile(rf"^(?:{re.escape(interviewer)}|{re.escape(respondent)}):\s*", re.I)
    speaker = None
    buffer: list[str] = []
    turns: list[tuple[str, str]] = []
    for raw in text.splitlines():
        line = raw.strip()
        match = turn.match(line)
        if match:
            if speaker is not None:
                turns.append((speaker, clean_text(" ".join(buffer))))
            speaker = line[: line.index(":")].lower()
            buffer = [line[match.end():]]
        elif speaker is not None and line:
            buffer.append(line)
    if speaker is not None:
        turns.append((speaker, clean_text(" ".join(buffer))))

    expected_q, expected_a = interviewer.lower(), respondent.lower()
    pairs: list[tuple[str, str]] = []
    i = 0
    while i < len(turns):
        if turns[i][0] != expected_q:
            raise ValueError(f"Expected {interviewer} turn at turn {i + 1}; found {turns[i][0]}")
        if i + 1 >= len(turns) or turns[i + 1][0] != expected_a:
            raise ValueError(f"Question at turn {i + 1} has no {respondent} answer")
        pairs.append((turns[i][1], turns[i + 1][1]))
        i += 2
    if not pairs:
        raise ValueError("No Q&A pairs found")
    return pairs


@dataclass(frozen=True)
class Record:
    # fields for a single Q&A record
    record_id: str
    source_id: str
    source_name: str
    source_type: str
    role_family: str
    role_title: str
    seniority: str | None
    question: str
    answer: str
    topics: list[str]
    evidence_status: str
    review_status: str
    version: int
    content_hash: str


def make_records(pairs: Sequence[tuple[str, str]], args: argparse.Namespace, source_hash: str) -> list[Record]:
    '''Create a list of Record objects from Q&A pairs and command-line arguments'''
    source_id = args.source_id or f"{slug(args.role_family)}-{source_hash[:12]}"
    records: list[Record] = []
    seen: set[str] = set()
    for index, (question, answer) in enumerate(pairs, 1):
        if not question or not answer:
            raise ValueError(f"Q&A pair {index} contains empty text")
        content_hash = digest(f"{question}\n{answer}")
        if content_hash in seen:
            raise ValueError(f"Duplicate Q&A content at pair {index}")
        seen.add(content_hash)
        records.append(Record(
            record_id=f"{source_id}-q{index:03d}", source_id=source_id,
            source_name=args.input.name, source_type="interview_transcript",
            role_family=slug(args.role_family), role_title=clean_text(args.role_title),
            seniority=slug(args.seniority) if args.seniority else None,
            question=question, answer=answer, topics=infer_topics(question, answer),
            evidence_status=args.evidence_status, review_status=args.review_status,
            version=1, content_hash=content_hash,
        ))
    return records


def chunk_text(record: Record) -> str:
    '''Format a Record into a single string for embedding or storage'''
    fields = [f"Role: {record.role_title}"]
    if record.seniority:
        fields.append(f"Seniority: {record.seniority.replace('_', ' ').title()}")
    if record.topics:
        fields.append(f"Topics: {', '.join(record.topics)}")
    fields.extend([f"Question: {record.question}", f"Answer: {record.answer}"])
    return "\n".join(fields)


def batched(items: Sequence[str], size: int) -> Iterator[Sequence[str]]:
    '''Yield successive batches of a given size from a sequence of items'''
    for i in range(0, len(items), size):
        yield items[i:i + size]


def embed(texts: Sequence[str], model: str, batch_size: int = 64) -> list[list[float]]:
    '''Generate embeddings for a list of texts using the OpenAI API'''
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is required when --embedding-model is used")
    results: list[list[float]] = []
    for batch in batched(texts, batch_size):
        body = json.dumps({"model": model, "input": list(batch), "encoding_format": "float"}).encode()
        request = urllib.request.Request(
            "https://api.openai.com/v1/embeddings", data=body,
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                payload = json.load(response)
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Embedding request failed ({exc.code}): {detail}") from exc
        results.extend(item["embedding"] for item in sorted(payload["data"], key=lambda x: x["index"]))
    return results


def write_jsonl(path: Path, rows: Iterable[dict]) -> None:
    '''Write an iterable of dictionaries to a JSON Lines file'''
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")


def ingest(args: argparse.Namespace) -> int:
    '''Ingest a transcript file, parse it into records and chunks, 
    generate embeddings if requested, and write the results to output files'''
    if args.evidence_status not in ALLOWED_EVIDENCE:
        raise ValueError(f"Invalid evidence status: {args.evidence_status}")
    if args.review_status not in ALLOWED_REVIEW:
        raise ValueError(f"Invalid review status: {args.review_status}")
    raw = args.input.read_text(encoding="utf-8")
    source_hash = digest(raw)
    pairs = parse_transcript(raw, args.interviewer_label, args.speaker_label)
    records = make_records(pairs, args, source_hash)
    texts = [chunk_text(record) for record in records]
    vectors = embed(texts, args.embedding_model, args.batch_size) if args.embedding_model else [None] * len(texts)
    chunks = []
    for record, text, vector in zip(records, texts, vectors):
        chunk = {
            "chunk_id": f"{record.record_id}-c000", "record_id": record.record_id,
            "source_id": record.source_id, "chunk_index": 0, "chunk_text": text,
            "role_family": record.role_family, "seniority": record.seniority,
            "topics": record.topics, "review_status": record.review_status, "active": True,
            "embedding_model": args.embedding_model, "embedding_dimensions": len(vector) if vector else None,
            "embedding": vector, "content_hash": digest(text),
        }
        chunks.append(chunk)
    args.output.mkdir(parents=True, exist_ok=True)
    
    # records contains the original Q&A records
    # chunks contains the formatted chunks with embeddings
    records_path = args.output / f"{args.role_family}_records_{source_hash[:8]}.jsonl"
    chunks_path = args.output / f"{args.role_family}_chunks_{source_hash[:8]}.jsonl"
    write_jsonl(records_path, (asdict(row) for row in records))
    write_jsonl(chunks_path, chunks)
    
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(), "source": args.input.name,
        "source_hash": source_hash, "accepted_records": len(records), "rejected_records": 0,
        "chunks": len(chunks), "role_distribution": {slug(args.role_family): len(records)},
        "seniority_distribution": {records[0].seniority or "unspecified": len(records)},
        "embedding_model": args.embedding_model,
        "embedding_dimensions": chunks[0]["embedding_dimensions"] if chunks else None,
        "warnings": ["Content is synthetic and approved only for demo use"] if args.evidence_status == "synthetic" else [],
    }
    report_path = args.output / f"{args.role_family}_validation_report_{source_hash[:8]}.json"
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


def load_chunks(args: argparse.Namespace) -> int:
    '''Load chunk data from a JSON Lines file into a PostgreSQL database, 
    ensuring that all chunks have embeddings before insertion'''
    try:
        import psycopg
    except ImportError as exc:
        raise RuntimeError("Install psycopg first: pip install 'psycopg[binary]>=3.2'") from exc
    rows = [json.loads(line) for line in args.chunks.read_text(encoding="utf-8").splitlines() if line.strip()]
    if any(row.get("embedding") is None for row in rows):
        raise ValueError("All chunks must have embeddings before database load")
    sql = """
        INSERT INTO chunks (chunk_id, record_id, source_id, chunk_index, chunk_text, role_family,
          seniority, topics, review_status, active, embedding_model, content_hash, embedding)
        VALUES (%(chunk_id)s, %(record_id)s, %(source_id)s, %(chunk_index)s, %(chunk_text)s,
          %(role_family)s, %(seniority)s, %(topics)s, %(review_status)s, %(active)s,
          %(embedding_model)s, %(content_hash)s, %(embedding)s::vector)
        ON CONFLICT (chunk_id) DO UPDATE SET chunk_text=EXCLUDED.chunk_text, topics=EXCLUDED.topics,
          review_status=EXCLUDED.review_status, active=EXCLUDED.active,
          embedding_model=EXCLUDED.embedding_model, content_hash=EXCLUDED.content_hash,
          embedding=EXCLUDED.embedding, updated_at=now()
    """
    with psycopg.connect(args.database_url) as connection:
        with connection.cursor() as cursor:
            for row in rows:
                row["embedding"] = "[" + ",".join(map(str, row["embedding"])) + "]"
                cursor.execute(sql, row)
    print(f"Upserted {len(rows)} chunks")
    return 0


def parser() -> argparse.ArgumentParser:
    '''Command-line argument parser for the ingestion and loading pipeline'''
    root = argparse.ArgumentParser(description="Interview transcript RAG ingestion pipeline")
    commands = root.add_subparsers(dest="command", required=True)
    p = commands.add_parser("ingest")
    p.add_argument("--input", type=Path, required=True)
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--role-family", required=True)
    p.add_argument("--role-title", required=True)
    p.add_argument("--source-id")
    p.add_argument("--seniority")
    p.add_argument("--interviewer-label", default="Interviewer")
    p.add_argument("--speaker-label", default="PM")
    p.add_argument("--evidence-status", default="synthetic")
    p.add_argument("--review-status", default="approved_for_demo")
    p.add_argument("--embedding-model")
    p.add_argument("--batch-size", type=int, default=64)
    p.set_defaults(func=ingest)
    p = commands.add_parser("load")
    p.add_argument("--chunks", type=Path, required=True)
    p.add_argument("--database-url", required=True)
    p.set_defaults(func=load_chunks)
    return root


def main() -> int:
    try:
        args = parser().parse_args()
        return args.func(args)
    except (OSError, ValueError, RuntimeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
