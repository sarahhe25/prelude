# prelude

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

Generate embeddings
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