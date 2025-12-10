import OpenAI from 'openai';
import { MANUAL_CONTEXT } from '../constants';
import { searchSimilarContent } from './embeddingService';

// ROBUST KEY HANDLING:
// 1. Checks `import.meta.env.VITE_OPENAI_API_KEY` (Works locally in VS Code with Vite)
// 2. Checks `process.env.OPENAI_API_KEY` (Works in Node environments)
const getApiKey = () => {
  // @ts-ignore - import.meta is a Vite/ESM standard
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_OPENAI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  return undefined;
};

const apiKey = getApiKey();

// Initialize OpenAI client
let openai: OpenAI | null = null;
if (apiKey) {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
  });
}

// Configuration for RAG
const USE_RAG = true; // Set to false to use static context only
const RAG_MATCH_COUNT = 5; // Number of relevant chunks to retrieve
const RAG_SIMILARITY_THRESHOLD = 0.7; // Minimum similarity score

/**
 * Enhanced system prompt for better, more contextual responses
 */
const ENHANCED_SYSTEM_PROMPT = `${MANUAL_CONTEXT}

RESPONSE GUIDELINES:
1. Be conversational yet professional - speak as a knowledgeable guide, not a formal document
2. Provide specific examples from the manual when relevant
3. Break down complex concepts into digestible parts
4. Acknowledge the user's question directly before providing the answer
5. Use relevant frameworks from the manual (e.g., the 8-point Decision Framework, TRUST model)
6. When discussing principles, explain both the "why" and the "how"
7. If a question touches multiple areas of the manual, make connections between them
8. End responses with a relevant follow-up question or invitation to explore deeper
9. Use formatting for clarity:
   - Use bullet points for lists
   - Use line breaks between major points
   - Bold key terms or principles when first introduced

IMPORTANT: If asked about something not in the manual, respond:
"That's a great question, but it falls outside the scope of our current Ethics Manual. However, I'd be happy to help you explore related topics that are covered in the manual, such as [suggest 1-2 relevant topics]."

Remember: You represent SHE IS AI's commitment to ethical AI leadership. Every response should empower the reader and reflect our core values.`;

export const generateManualResponse = async (userQuery: string): Promise<string> => {
  if (!apiKey || !openai) {
    return "API Key is missing. Please add your OpenAI API key to the .env file as VITE_OPENAI_API_KEY=your_key_here";
  }

  try {
    let systemPrompt = ENHANCED_SYSTEM_PROMPT;
    let augmentedQuery = userQuery;

    // Use RAG if enabled
    if (USE_RAG) {
      try {
        // Search for relevant content from the vector database
        const relevantChunks = await searchSimilarContent(
          userQuery,
          RAG_SIMILARITY_THRESHOLD,
          RAG_MATCH_COUNT
        );

        if (relevantChunks && relevantChunks.length > 0) {
          // Build context from retrieved chunks
          const retrievedContext = relevantChunks
            .map((chunk, index) => `\n[Reference ${index + 1}]:\n${chunk.content}`)
            .join('\n\n');

          // Enhance the system prompt with retrieved context
          systemPrompt = `${ENHANCED_SYSTEM_PROMPT}

---
RETRIEVED MANUAL SECTIONS (Use these as your primary source):
${retrievedContext}

When answering, prioritize information from the Retrieved Manual Sections above. These are the most relevant parts of the current manual for this query.`;

          console.log(`RAG: Retrieved ${relevantChunks.length} relevant chunks`);
        } else {
          console.log('RAG: No relevant chunks found, using base context');
        }
      } catch (ragError) {
        console.error('RAG search failed, falling back to base context:', ragError);
        // Continue with base context if RAG fails
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4 Optimized for better quality responses
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: augmentedQuery
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
    });

    return completion.choices[0]?.message?.content || "I couldn't generate a response at this time. Please try again.";
  } catch (error: any) {
    console.error("Error calling OpenAI API:", error);

    // Provide more specific error messages
    if (error.status === 401) {
      return "Authentication error: Please check that your OpenAI API key is valid and has the correct permissions.";
    } else if (error.status === 429) {
      return "I'm receiving too many requests right now. Please wait a moment and try again.";
    } else if (error.status === 500 || error.status === 503) {
      return "OpenAI's servers are experiencing issues. Please try again in a moment.";
    }

    return "I'm sorry, I encountered an error while consulting the manual. Please try again later.";
  }
};
