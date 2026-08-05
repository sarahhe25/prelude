# prelude

## Backend Overview

The backend is a Python-based retrieval-augmented generation (RAG) system built with FastAPI, OpenAI, PostgreSQL, and pgvector.

Interview transcripts pass through a data pipeline that parses, validates, chunks, and tags the content before generating OpenAI embeddings and storing the results in PostgreSQL.

When a user asks a question, the backend generates an embedding for the question and uses pgvector cosine similarity to retrieve the most relevant approved interview chunks for the selected role. These chunks are provided as evidence to an OpenAI model, which generates a grounded response with source references.

The same retrieval logic powers both the search CLI and the `/chat` API endpoint.

## Run the search and chat backend

``` bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
set -a; source .env; set +a
```

Start PostgreSQL/pgvector (the schema is applied automatically on first start):
``` bash
docker compose up -d db
```

### Database

The application uses PostgreSQL with pgvector to store interview chunks, metadata, and OpenAI embeddings. Retrieval filters results by role and approval status, then ranks chunks by cosine similarity.


## Generate embeddings
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
```

Load embeddings to database
``` bash
python -m pipeline load --chunks build/proj-001/project_manager_chunks_fa6781a3.jsonl \
 --database-url "$DATABASE_URL"
```
Replace chunks file name as needed


After ingestion and loading the embedded chunks:

Inspect retrieval without generating an answer:
```bash
python search.py \
  "What tools does a project manager use?" \
  --role-family project_manager
```

Start the API
```bash
uvicorn app:app --reload --port 8000
```

Call `/chat`
```bash
curl http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What tools does a project manager use?",
    "role_family": "project_manager"
  }'
```

Run offline tests (no API key or database required):
``` bash
python -m unittest discover -s tests -v
```
