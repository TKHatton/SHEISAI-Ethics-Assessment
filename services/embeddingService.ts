import OpenAI from 'openai';
import { supabase } from './supabase';

const getApiKey = () => {
  // For Node.js scripts, check process.env first
  if (typeof process !== 'undefined' && process.env) {
    // Check both VITE_OPENAI_API_KEY and OPENAI_API_KEY
    if (process.env.VITE_OPENAI_API_KEY) {
      return process.env.VITE_OPENAI_API_KEY;
    }
    if (process.env.OPENAI_API_KEY) {
      return process.env.OPENAI_API_KEY;
    }
  }

  // For browser environment
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_OPENAI_API_KEY;
  }

  return undefined;
};

let openai: OpenAI | null = null;

// Initialize OpenAI client lazily
function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI client not initialized. Check API key.');
    }
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return openai;
}

export interface DocumentChunk {
  content: string;
  metadata?: {
    section?: string;
    page?: number;
    title?: string;
    [key: string]: any;
  };
}

/**
 * Generate embedding for a given text using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const client = getOpenAIClient();
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 1536 // Match the vector size in database
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Store a document chunk with its embedding in Supabase
 */
export async function storeEmbedding(chunk: DocumentChunk): Promise<string> {
  try {
    // Generate embedding for the content
    const embedding = await generateEmbedding(chunk.content);

    // Store in Supabase
    const { data, error } = await supabase
      .from('manual_embeddings')
      .insert([
        {
          content: chunk.content,
          embedding: embedding,
          metadata: chunk.metadata || {}
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error storing embedding:', error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Error in storeEmbedding:', error);
    throw error;
  }
}

/**
 * Search for similar content in the manual using semantic search
 */
export async function searchSimilarContent(
  query: string,
  matchThreshold: number = 0.7,
  matchCount: number = 5
): Promise<Array<{ content: string; metadata: any; similarity: number }>> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search for similar content using the Supabase function
    const { data, error } = await supabase.rpc('match_manual_content', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount
    });

    if (error) {
      console.error('Error searching similar content:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchSimilarContent:', error);
    throw error;
  }
}

/**
 * Split text into chunks with overlap for better context preservation
 */
export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);
    chunks.push(chunk.trim());

    // Move forward, but with overlap
    startIndex += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Delete all existing embeddings (useful for refreshing the manual)
 */
export async function clearAllEmbeddings(): Promise<void> {
  try {
    const { error } = await supabase
      .from('manual_embeddings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (error) {
      console.error('Error clearing embeddings:', error);
      throw error;
    }

    console.log('All embeddings cleared successfully');
  } catch (error) {
    console.error('Error in clearAllEmbeddings:', error);
    throw error;
  }
}

/**
 * Process and store a complete document
 */
export async function processAndStoreDocument(
  content: string,
  metadata: { title?: string; [key: string]: any } = {}
): Promise<{ success: boolean; chunksProcessed: number }> {
  try {
    // Split content into chunks
    const chunks = chunkText(content);
    console.log(`Processing ${chunks.length} chunks...`);

    // Store each chunk with its embedding
    let processed = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunkMetadata = {
        ...metadata,
        chunkIndex: i,
        totalChunks: chunks.length
      };

      await storeEmbedding({
        content: chunks[i],
        metadata: chunkMetadata
      });

      processed++;
      if (processed % 10 === 0) {
        console.log(`Processed ${processed}/${chunks.length} chunks`);
      }
    }

    console.log(`Successfully processed and stored ${processed} chunks`);
    return { success: true, chunksProcessed: processed };
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}
