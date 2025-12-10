
import { GoogleGenAI } from "@google/genai";
import { MANUAL_CONTEXT } from '../constants';

// ROBUST KEY HANDLING:
// 1. Checks `process.env.API_KEY` (Works in this AI Studio environment)
// 2. Checks `import.meta.env.VITE_API_KEY` (Works locally in VS Code with Vite)
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // @ts-ignore - import.meta is a Vite/ESM standard
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return undefined;
};

const apiKey = getApiKey();

export const generateManualResponse = async (userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. If running locally, please create a .env file with VITE_API_KEY=your_key.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: MANUAL_CONTEXT,
        temperature: 0.7,
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, I encountered an error while consulting the manual. Please try again later.";
  }
};
