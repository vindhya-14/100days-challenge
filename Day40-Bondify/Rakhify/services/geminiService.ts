
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateMemoryTagline = async (memory: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. Please set the API_KEY environment variable.";
  }

  if (!memory.trim()) {
    return "Please enter a memory to get a tagline!";
  }

  try {
    const prompt = `Based on this sibling memory: "${memory}", create a short, poetic, and slightly funny tagline for it. The tagline should be a maximum of 10 words.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
          temperature: 0.8,
          topP: 0.9,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating tagline with Gemini API:", error);
    return "Couldn't create a tagline right now. Let's try again later!";
  }
};
