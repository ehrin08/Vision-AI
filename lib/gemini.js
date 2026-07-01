import * as FileSystem from 'expo-file-system/legacy';

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

export async function imageToBase64(uri) {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

export async function analyzeImage(base64Image, prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const json = await response.json();
  return json;
}

export const ANALYSIS_PROMPT = `
Analyze this image. Identify:
1. Objects - list the distinct physical objects you see
2. Context - briefly describe the setting or scene
3. Activities - what activity appears to be happening, if any
4. Recommendations - one practical suggestion based on the scene

Respond ONLY with valid JSON in this exact shape, no extra text, markdown code blocks, or formatting:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`;

export const PROMPTS = {
  academic: `Act as a university professor. Looking at this image, provide an academic-style analysis.
Respond ONLY with valid JSON in this exact shape, no extra text, markdown code blocks, or formatting:
{
  "objects": ["educational/study items identified"],
  "context": "a description of the educational or learning environment",
  "activities": "learning, teaching, or cognitive tasks happening in the scene",
  "recommendations": "one piece of constructive feedback to improve learning/work environment"
}`,

  safety: `Act as a workplace safety inspector. Looking at this image, identify any visible hazards, risks, or safety concerns.
Respond ONLY with valid JSON in this exact shape, no extra text, markdown code blocks, or formatting:
{
  "objects": ["hazards, cords, clutter, or sharp objects"],
  "context": "setting or room layout from a hazard perspective",
  "activities": "risky user behaviors or potential accident situations",
  "recommendations": "one actionable remedial task to make it safe"
}`,

  inventory: `Act as an asset management clerk. Looking at this image, list every visible physical asset.
Respond ONLY with valid JSON in this exact shape, no extra text, markdown code blocks, or formatting:
{
  "objects": ["all visible physical assets (computers, books, furniture)"],
  "context": "inventory classification/room setting description",
  "activities": "observed condition/state of assets (e.g. active, stored)",
  "recommendations": "one action item (e.g., maintenance check, restocking, asset cataloging)"
}`
};

