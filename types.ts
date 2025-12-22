
export interface SleepData {
  duration: number; // hours
  latency: number; // minutes
  awakenings: number;
  stressLevel: number; // 1-10
  caffeineIntake: 'none' | 'low' | 'moderate' | 'high';
  blueLightExposure: number; // hours before bed
  consistency: number; // 1-10 (how consistent sleep schedule is)
  environment: {
    noise: number; // 1-10
    light: number; // 1-10
    temperature: 'cold' | 'optimal' | 'hot';
  };
}

export interface AnalysisResponse {
  score: number;
  qualityLabel: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  breakdown: {
    efficiency: number;
    consistency: number;
    environment: number;
    lifestyle: number;
  };
  summary: string;
  recommendations: string[];
  scientificInsights: string[];
}
