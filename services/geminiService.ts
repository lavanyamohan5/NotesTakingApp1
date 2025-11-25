import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI Client
// We assume process.env.API_KEY is available as per environment configuration.
// If not available, the service will throw appropriate errors to be caught by the UI.
const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey: apiKey });
}

export const generateChatResponse = async (userMessage: string): Promise<string> => {
  if (!ai) {
    throw new Error("API_KEY_MISSING");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: "You are a helpful, friendly, and concise assistant embedded in a Note Taking App. Your goal is to help the user understand concepts, draft text, or explain things they might be taking notes on. Keep answers short and relevant to a note-taking context. If the user asks about the app itself, refer them to the app features like auto-save and image uploading.",
      }
    });

    return response.text || "I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("API_ERROR");
  }
};