import { GoogleGenAI, Type } from "@google/genai";
import { BotResponse } from "../types";

// Load API key from environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error(
    "⚠️ API_KEY environment variable not set. API calls will fail."
  );
}

// Initialize AI
const ai = new GoogleGenAI({ apiKey: API_KEY as string });

/**
 * 🌼 Best System Instruction for Krishna-inspired wisdom
 */
const systemInstruction = `
You are an empathetic and wise spiritual guide, inspired by Lord Krishna. 
Your purpose is to uplift, guide, and comfort the user with clarity and gentleness. 

You must ALWAYS respond ONLY in valid JSON following this format:

{
  "quote": "A direct or authentic quote attributed to Krishna (preferably from the Bhagavad Gita).",
  "source": "Exact scripture reference, e.g. 'Bhagavad Gita 2.47'.",
  "explanation": "A short, modern explanation of this teaching. Use warm, poetic yet simple language, avoiding difficult words.",
  "practice": "A brief, practical exercise for reflection, mindfulness, or gratitude. If none applies, use an empty string."
}

✨ Mandatory Rules:
- Return absolutely NOTHING outside the JSON object (no extra commentary, no markdown, no quotes, no apologies).
- Always provide ALL four fields: 'quote', 'source', 'explanation', 'practice'.
- Explanations must be encouraging, concise (2–4 sentences), and easy to understand.
- Keep tone timeless, gentle, reverent, and compassionate — never harsh or overly intellectual.
- Ensure practices are short and doable (e.g., breathing, gratitude, reflection, mindfulness). 
- If user input is vague or confusing, answer with a universal Krishna teaching (e.g., on detachment, selfless action, or inner peace).
- Never break character. Never say you're an AI. Speak only as Krishna’s guiding voice.
- Keep responses uplifting, reassuring, and filled with calm strength.
`;

/**
 * ✅ JSON Schema enforcement
 */
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    quote: { type: Type.STRING },
    source: { type: Type.STRING },
    explanation: { type: Type.STRING },
    practice: { type: Type.STRING },
  },
  required: ["quote", "source", "explanation", "practice"],
};

/**
 * 🌼 Fallback library of Krishna quotes
 * Used if Gemini encounters an error
 */
const fallbackWisdom: BotResponse[] = [
  {
    quote: "The soul is neither born, nor does it ever die.",
    source: "Bhagavad Gita 2.20",
    explanation:
      "This reminds us that our essence is eternal. Challenges are temporary, but your spirit is unchanging.",
    practice: "Take three slow breaths and feel the timeless stillness within.",
  },
  {
    quote: "You have the right to work, but never to the fruit of work.",
    source: "Bhagavad Gita 2.47",
    explanation:
      "Do your best, but release attachment to results. True peace comes from effort, not outcome.",
    practice:
      "Today, do one task wholeheartedly, without worrying about recognition.",
  },
  {
    quote:
      "When meditation is mastered, the mind is unwavering like a flame in a windless place.",
    source: "Bhagavad Gita 6.19",
    explanation:
      "Stillness comes through practice. A peaceful mind shines steadily amidst life’s winds.",
    practice: "Sit quietly for 2 minutes, focusing only on your breath.",
  },
];

/**
 * ✨ Main function to fetch Krishna wisdom
 */
export const getKrishnaWisdom = async (
  userInput: string
): Promise<BotResponse> => {
  if (!API_KEY) {
    return {
      quote: "An API key is a bridge between worlds.",
      source: "The Developer's Sutra",
      explanation:
        "It seems the API_KEY is missing. Please configure it to receive divine wisdom.",
      practice: "Take a moment to check your environment variables mindfully.",
    };
  }

  try {
    // Make API call
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: userInput }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.7,
      },
    });

    // Parse response safely
    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    if (
      parsedResponse.quote &&
      parsedResponse.source &&
      parsedResponse.explanation &&
      typeof parsedResponse.practice === "string"
    ) {
      return parsedResponse as BotResponse;
    } else {
      throw new Error("Invalid response structure from API");
    }
  } catch (error) {
    console.error("⚠️ Error fetching wisdom from Gemini API:", error);

    // Choose a random fallback wisdom
    const randomIndex = Math.floor(Math.random() * fallbackWisdom.length);
    return fallbackWisdom[randomIndex];
  }
};
