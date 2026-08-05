-- Parameters: $1 query embedding, $2 role family.

SELECT
    chunk_id,
    source_id,
    chunk_text,
    seniority,
    topics,
    1 - (embedding <=> $1::vector) AS cosine_similarity
FROM chunks
WHERE role_family = $2
  AND active = true
  AND review_status IN ('approved_for_demo', 'published')
ORDER BY embedding <=> $1::vector
LIMIT 8;
