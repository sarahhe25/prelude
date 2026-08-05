CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS chunks (
    chunk_id text PRIMARY KEY,
    record_id text NOT NULL,
    source_id text NOT NULL,
    chunk_index integer NOT NULL,
    chunk_text text NOT NULL,
    role_family text NOT NULL,
    seniority text,
    topics text[] NOT NULL DEFAULT '{}',
    review_status text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    embedding_model text NOT NULL,
    content_hash text NOT NULL,
    embedding vector(1536) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chunks_role_status_idx
    ON chunks (role_family, review_status, active);

-- Exact search is sufficient for a tiny MVP corpus. Add HNSW when scale requires it:
-- CREATE INDEX chunks_embedding_hnsw_idx ON chunks USING hnsw (embedding vector_cosine_ops);

