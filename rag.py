# Handles OpenAI embeddings, pgvector retrieval, and answer generation 

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any, Protocol, Sequence


DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small"
DEFAULT_ANSWER_MODEL = "gpt-4.1-mini"
INSUFFICIENT_ANSWER = (
    "The available interview evidence does not provide enough information to answer that question."
)


@dataclass(frozen=True)
class SearchResult:
    chunk_id: str
    source_id: str
    chunk_text: str
    role_family: str
    seniority: str | None
    topics: list[str]
    similarity: float

    def public_source(self) -> dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "source_id": self.source_id,
            "similarity": round(self.similarity, 4),
            "topics": self.topics,
            "text": self.chunk_text,
        }


class AIClient(Protocol):
    def embed(self, text: str) -> list[float]: ...
    def answer(self, question: str, evidence: Sequence[SearchResult]) -> dict[str, Any]: ...


class OpenAIClient:
    def __init__(self, embedding_model: str = DEFAULT_EMBEDDING_MODEL,
                 answer_model: str = DEFAULT_ANSWER_MODEL) -> None:
        try:
            from openai import OpenAI
        except ImportError as exc:
            raise RuntimeError("Install dependencies: pip install -r requirements.txt") from exc
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.embedding_model = embedding_model
        self.answer_model = answer_model

    def embed(self, text: str) -> list[float]:
        response = self.client.embeddings.create(
            model=self.embedding_model, input=text, encoding_format="float"
        )
        return response.data[0].embedding

    def answer(self, question: str, evidence: Sequence[SearchResult]) -> dict[str, Any]:
        blocks = "\n\n".join(f"[{r.chunk_id}]\n{r.chunk_text}" for r in evidence)
        instructions = (
            "You answer candidate questions using only the supplied approved interview evidence. "
            "Do not add general knowledge or unsupported claims. The evidence may be synthetic demo "
            "content, so never portray it as verified employee testimony. If it is insufficient, set "
            "insufficient_evidence to true and use the standard refusal. Return JSON with exactly: "
            "answer (string), citations (array of supporting chunk IDs), insufficient_evidence (boolean)."
        )
        response = self.client.responses.create(
            model=self.answer_model,
            instructions=instructions,
            input=f"Question:\n{question}\n\nApproved evidence:\n{blocks}",
            text={"format": {
                "type": "json_schema",
                "name": "grounded_answer",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "answer": {"type": "string"},
                        "citations": {"type": "array", "items": {"type": "string"}},
                        "insufficient_evidence": {"type": "boolean"},
                    },
                    "required": ["answer", "citations", "insufficient_evidence"],
                    "additionalProperties": False,
                },
            }},
        )
        try:
            value = json.loads(response.output_text)
        except (json.JSONDecodeError, TypeError) as exc:
            raise RuntimeError("Answer model returned invalid JSON") from exc
        return value


class PostgresRetriever:
    def __init__(self, database_url: str,
                 embedding_model: str = DEFAULT_EMBEDDING_MODEL) -> None:
        self.database_url = database_url
        self.embedding_model = embedding_model

    def search(self, vector: Sequence[float], role_family: str, limit: int,
               seniority: str | None = None) -> list[SearchResult]:
        try:
            import psycopg
        except ImportError as exc:
            raise RuntimeError("Install dependencies: pip install -r requirements.txt") from exc
        literal = "[" + ",".join(str(value) for value in vector) + "]"
        sql = """
            SELECT chunk_id, source_id, chunk_text, role_family, seniority, topics,
                1 - (embedding <=> %(embedding)s::vector) AS similarity
            FROM chunks
            WHERE role_family = %(role_family)s
            AND active = true
            AND review_status IN ('approved_for_demo', 'published')
            AND embedding_model = %(embedding_model)s
            ORDER BY embedding <=> %(embedding)s::vector
            LIMIT %(limit)s
        """

        params = {
            "embedding": literal,
            "role_family": role_family,
            "embedding_model": self.embedding_model,
            "limit": limit,
        }
        with psycopg.connect(self.database_url) as connection:
            with connection.cursor() as cursor:
                cursor.execute(sql, params)
                return [SearchResult(*row) for row in cursor.fetchall()]


class RAGService:
    def __init__(self, ai: AIClient, retriever: Any, *, threshold: float = 0.45,
                 top_k: int = 5) -> None:
        self.ai = ai
        self.retriever = retriever
        self.threshold = threshold
        self.top_k = top_k

    def search(self, question: str, role_family: str,
               seniority: str | None = None) -> list[SearchResult]:
        vector = self.ai.embed(question)
        return self.retriever.search(vector, role_family, self.top_k, seniority)

    def chat(self, question: str, role_family: str,
             seniority: str | None = None) -> dict[str, Any]:
        results = self.search(question, role_family, seniority)
        evidence = [r for r in results if r.similarity >= self.threshold]
        if not evidence:
            return {"answer": INSUFFICIENT_ANSWER, "citations": [],
                    "insufficient_evidence": True, "sources": []}

        generated = self.ai.answer(question, evidence)
        if generated.get("insufficient_evidence") is True:
            return {"answer": INSUFFICIENT_ANSWER, "citations": [],
                    "insufficient_evidence": True, "sources": []}
        allowed = {r.chunk_id: r for r in evidence}
        citations = generated.get("citations")
        if not isinstance(citations, list) or not citations or any(c not in allowed for c in citations):
            raise RuntimeError("Answer contained missing or invalid citations")
        return {
            "answer": str(generated.get("answer", "")).strip(),
            "citations": citations,
            "insufficient_evidence": False,
            "sources": [allowed[c].public_source() for c in citations],
        }


def service_from_env() -> RAGService:
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is required")
    threshold = float(os.environ.get("RAG_SIMILARITY_THRESHOLD", "0.45"))
    top_k = int(os.environ.get("RAG_TOP_K", "5"))
    embedding_model = os.environ.get("OPENAI_EMBEDDING_MODEL", DEFAULT_EMBEDDING_MODEL)
    return RAGService(
        OpenAIClient(embedding_model, os.environ.get("OPENAI_ANSWER_MODEL", DEFAULT_ANSWER_MODEL)),
        PostgresRetriever(database_url, embedding_model), threshold=threshold, top_k=top_k,
    )
