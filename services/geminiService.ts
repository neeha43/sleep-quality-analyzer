
import { GoogleGenAI, Type } from "@google/genai";
import { SleepData, AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeSleepQuality = async (data: SleepData): Promise<AnalysisResponse> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze the following sleep data for a single night/pattern and provide a comprehensive evaluation:
    - Sleep Duration: ${data.duration} hours
    - Time to fall asleep: ${data.latency} minutes
    - Number of awakenings: ${data.awakenings}
    - Stress Level (1-10): ${data.stressLevel}
    - Caffeine Intake: ${data.caffeineIntake}
    - Blue light exposure: ${data.blueLightExposure} hours before bed
    - Consistency: ${data.consistency}/10
    - Environment: Noise level ${data.environment.noise}/10, Light level ${data.environment.light}/10, Temperature: ${data.environment.temperature}
    
    Provide a professional, medically-informed (but non-diagnostic) analysis.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Overall sleep quality score from 0 to 100" },
          qualityLabel: { type: Type.STRING, description: "One of: Excellent, Good, Fair, Poor, Critical" },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              efficiency: { type: Type.NUMBER, description: "Score 0-100" },
              consistency: { type: Type.NUMBER, description: "Score 0-100" },
              environment: { type: Type.NUMBER, description: "Score 0-100" },
              lifestyle: { type: Type.NUMBER, description: "Score 0-100" },
            },
            required: ["efficiency", "consistency", "environment", "lifestyle"]
          },
          summary: { type: Type.STRING, description: "A brief 2-3 sentence summary of the sleep quality" },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable tips for improvement"
          },
          scientificInsights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Interesting scientific facts relevant to the user's specific data"
          }
        },
        required: ["score", "qualityLabel", "breakdown", "summary", "recommendations", "scientificInsights"],
      }
    }
  });

  const result = JSON.parse(response.text);
  return result as AnalysisResponse;
};
