# Interview RAG data pipeline

A small, rerunnable pipeline for turning structured interview transcripts into validated Q&A records and retrieval chunks. It is configured for one Project Manager role, but no code is hard-coded to that role.

## What it does

1. Parses `Interviewer:` / `Respondent:` turns from a text transcript.
2. Validates every Q&A pair.
3. Normalizes whitespace and controlled metadata.
4. Assigns stable IDs and SHA-256 content hashes.
5. Keeps one Q&A pair per retrieval chunk.
6. Writes JSONL outputs and a validation report.
7. Optionally creates OpenAI embeddings.
8. Optionally upserts the results into PostgreSQL + pgvector.

Seniority is optional. It is stored when known but is not required or used as a default retrieval filter.

## Quick start

Requires Python 3.11+.

```bash
python -m pipeline ingest \
  --input data/raw/project_manager_early_career.txt \
  --output build \
  --role-family project_manager \
  --role-title "Project Manager" \
  --interviewer-label Interviewer \
  --speaker-label PM \
  --seniority junior
```

```bash
python -m pipeline ingest \
 --input data/raw/ui_ux_designer.txt \
 --output build \
 --role-family ui_ux_designer \
 --role-title "UI UX Designer" \
 --interviewer-label "Priya" \
 --speaker-label "Jordan" \
 --seniority junior
```

With OpenAI embeddings
```bash
python -m pipeline ingest \
  --input data/raw/project_manager_early_career.txt \
  --output build/proj-001 \
  --source-id proj-001 \
  --role-family project_manager \
  --role-title "Project Manager" \
  --interviewer-label Interviewer \
  --speaker-label PM \
  --seniority junior \
  --embedding-model text-embedding-3-small


python -m pipeline ingest \
  --input data/raw/ui_ux_designer.txt \
  --output build/ui-ux-001 \
  --source-id ui-ux-001 \
  --role-family ui_ux_designer \
  --role-title "UI/UX Designer" \
  --interviewer-label "Priya" \
  --speaker-label Jordan \
  --seniority junior \
  --embedding-model text-embedding-3-small
```

Outputs:

- `build/<role_family>_records.jsonl`: normalized source records
- `build/<role_family>_chunks.jsonl`: retrieval units, with embeddings when enabled
- `build/<role_family>_validation_report.json`: counts, warnings, and failures

Run tests:

```bash
python -m unittest discover -s tests -v
```

## Add embeddings

Set `OPENAI_API_KEY`, then pass a model:

```bash
python -m pipeline ingest ... --embedding-model text-embedding-3-small
```

The API key is read only from the environment. Embeddings are requested in batches and saved with their model name and dimensions. Re-running with unchanged inputs produces the same IDs and hashes.

## Load PostgreSQL + pgvector

Create a database, then apply `sql/schema.sql`. Install the optional driver:

```bash
pip install 'psycopg[binary]>=3.2'
psql "$DATABASE_URL" -f sql/schema.sql
python -m pipeline load --chunks build/chunks.jsonl --database-url "$DATABASE_URL"
```

`load` requires chunks with embeddings. It upserts on stable `chunk_id` and updates changed content. The SQL schema uses `vector(1536)`, matching the default dimensions of `text-embedding-3-small`; change this in `schema.sql` if you deliberately choose another dimension.

Example retrieval SQL is in `sql/search.sql`. The default filter is role + published/active content. Seniority is only filtered when the product explicitly supplies it.

## Input convention

```text
Interview Transcript: Project Manager
Interviewer: What does a normal day look like?
PM: I start by checking the delivery board...
Interviewer: What tools do you use?
PM: Jira and Confluence...
```

Continuation lines are preserved. A new Q&A record begins at each `Interviewer:` line. Malformed or empty turns fail validation rather than being silently dropped.

## Data contract

Every record contains stable identifiers, source provenance, role metadata, optional seniority, question, answer, evidence/review states, topic suggestions, and a content hash. Topics are deliberately conservative and rule-based; review them before production use.

Synthetic content remains labeled `synthetic` and `approved_for_demo`. Replace these defaults when real, reviewed source material is introduced.
