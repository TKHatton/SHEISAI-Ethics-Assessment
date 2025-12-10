-- Enable the pgvector extension for storing embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table to store manual content chunks with embeddings
CREATE TABLE IF NOT EXISTS manual_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 embedding size
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for vector similarity search (using cosine distance)
CREATE INDEX IF NOT EXISTS manual_embeddings_embedding_idx
ON manual_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for faster metadata queries
CREATE INDEX IF NOT EXISTS manual_embeddings_metadata_idx
ON manual_embeddings
USING gin (metadata);

-- Function to search for similar content
CREATE OR REPLACE FUNCTION match_manual_content(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    manual_embeddings.id,
    manual_embeddings.content,
    manual_embeddings.metadata,
    1 - (manual_embeddings.embedding <=> query_embedding) as similarity
  FROM manual_embeddings
  WHERE 1 - (manual_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY manual_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_manual_embeddings_updated_at
  BEFORE UPDATE ON manual_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE manual_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for the chat assistant)
CREATE POLICY "Allow public read access"
  ON manual_embeddings
  FOR SELECT
  TO public
  USING (true);

-- Restrict write access to authenticated users only
CREATE POLICY "Allow authenticated users to insert"
  ON manual_embeddings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update"
  ON manual_embeddings
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete"
  ON manual_embeddings
  FOR DELETE
  TO authenticated
  USING (true);

COMMENT ON TABLE manual_embeddings IS 'Stores ethics manual content chunks with vector embeddings for semantic search';
COMMENT ON COLUMN manual_embeddings.content IS 'Text content chunk from the manual';
COMMENT ON COLUMN manual_embeddings.embedding IS 'OpenAI text-embedding-ada-002 vector (1536 dimensions)';
COMMENT ON COLUMN manual_embeddings.metadata IS 'Additional metadata like section, page, title, etc.';
