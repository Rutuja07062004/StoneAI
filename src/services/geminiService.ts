import { GoogleGenerativeAI } from '@google/generative-ai';

// ⚠️ IMPORTANT: Replace this with your real Gemini API key from https://aistudio.google.com/
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface GeminiMineralResult {
  name: string;
  formula: string;
  hardness: string;
  origin: string;
  structure: string;
  value: string;
  trend: string;
  description: string;
  uses: string[];
  properties: {
    color: string;
    lustre: string;
    transparency: string;
    streak: string;
  };
  confidence: string;
  isMineral: boolean;
}

const PROMPT = `You are a world-class expert geologist and mineralogist AI. Analyze this image of a rock or crystal.

Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with this exact structure:
{
  "isMineral": true,
  "name": "Full common name (e.g. Raw Amethyst Quartz)",
  "formula": "Chemical formula using subscripts where possible",
  "hardness": "Mohs scale value (e.g. 7.0 or 6.0 - 7.0)",
  "origin": "Typical geological origin country or region",
  "structure": "Crystal system (e.g. Hexagonal, Trigonal, Cubic)",
  "value": "Estimated market value range in USD (e.g. $45 - $120 per carat)",
  "trend": "Market value trend percentage (e.g. +5.2%)",
  "confidence": "Your AI confidence percentage (e.g. 94.1%)",
  "description": "2-3 sentence geological description of the specimen's formation and key characteristics",
  "uses": ["Use 1", "Use 2", "Use 3"],
  "properties": {
    "color": "Primary color description",
    "lustre": "Lustre type (e.g. Vitreous, Metallic, Resinous)",
    "transparency": "Transparency level (e.g. Transparent, Translucent, Opaque)",
    "streak": "Streak color on an unglazed porcelain plate"
  }
}

If the image is NOT a rock, crystal, or mineral, return:
{"isMineral": false, "name": "Unknown", "confidence": "0%", "formula": "", "hardness": "", "origin": "", "structure": "", "value": "", "trend": "", "description": "The image does not appear to contain a recognizable rock, mineral, or crystal specimen.", "uses": [], "properties": {"color": "", "lustre": "", "transparency": "", "streak": ""}}`;

export async function identifyMineral(base64Image: string): Promise<GeminiMineralResult> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 20) {
    throw new Error('API_KEY_NOT_SET');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: 'image/jpeg' as const,
    },
  };

  const result = await model.generateContent([PROMPT, imagePart]);
  const text = result.response.text().trim();

  // Robust JSON extraction: Find the first '{' and last '}'
  const startIdx = text.indexOf('{');
  const endIdx = text.lastIndexOf('}');

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('AI returned an invalid response format (No JSON found)');
  }

  const cleaned = text.substring(startIdx, endIdx + 1);

  try {
    const parsed: GeminiMineralResult = JSON.parse(cleaned);
    return parsed;
  } catch (e) {
    console.error('JSON Parse Error:', e, 'Cleaned Text:', cleaned);
    throw new Error('Failed to parse AI response');
  }
}
