import { GoogleGenAI, Type } from "@google/genai";
import { SleepData, AnalysisResponse } from "../types";

/**
 * Robustly extracts JSON from a string, handling markdown wrappers if present.
 */
const parseJSONResponse = (text: string) => {
  try {
    // Attempt direct parse first
    return JSON.parse(text);
  } catch (e) {
    // If it fails, try to find a JSON block between curly braces
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        console.error("Failed to parse JSON even after extraction:", innerError);
      }
    }
    throw new Error("Invalid response format from AI. Could not find valid JSON.");
  }
};

export const analyzeSleepQuality = async (data: SleepData): Promise<AnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure your environment is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze this sleep data and provide a comprehensive evaluation in JSON format only.
    
    Data:
    - Sleep Duration: ${data.duration} hours
    - Time to fall asleep: ${data.latency} minutes
    - Nightly awakenings: ${data.awakenings}
    - Stress level: ${data.stressLevel}/10
    - Caffeine intake: ${data.caffeineIntake}
    - Blue light before bed: ${data.blueLightExposure} hours
    - Sleep consistency: ${data.consistency}/10
    - Noise level: ${data.environment.noise}/10
    - Light level: ${data.environment.light}/10
    - Temperature: ${data.environment.temperature}
    
    Instructions:
    1. Calculate a Sleep Quality Index (SQI) score from 0-100.
    2. Provide 4 breakdown scores (efficiency, consistency, environment, lifestyle).
    3. Generate 3-4 actionable recommendations.
    4. Provide 2-3 scientific insights explaining the biological impact of their specific data points.
    5. Return ONLY a valid JSON object matching the requested schema. Do not include any introductory text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Overall score 0-100" },
            qualityLabel: { type: Type.STRING, description: "Excellent, Good, Fair, Poor, or Critical" },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                efficiency: { type: Type.NUMBER },
                consistency: { type: Type.NUMBER },
                environment: { type: Type.NUMBER },
                lifestyle: { type: Type.NUMBER },
              },
              required: ["efficiency", "consistency", "environment", "lifestyle"]
            },
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            scientificInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["score", "qualityLabel", "breakdown", "summary", "recommendations", "scientificInsights"],
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI services.");
    }

    return parseJSONResponse(text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};