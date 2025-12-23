import { SleepData, AnalysisResponse } from "../types";

export const analyzeSleepQualityLocal = (data: SleepData): AnalysisResponse => {
  // 1. Calculate Individual Pillar Scores (0-100)
  
  // EFFICIENCY: Based on duration and time to fall asleep
  let efficiency = 100;
  if (data.duration < 7) efficiency -= (7 - data.duration) * 15;
  if (data.duration > 9) efficiency -= (data.duration - 9) * 10;
  efficiency -= (data.latency > 20 ? (data.latency - 20) / 2 : 0);
  efficiency -= (data.awakenings * 8);
  
  // CONSISTENCY: How steady the routine is
  let consistency = data.consistency * 10;
  if (data.stressLevel > 7) consistency -= 10;

  // ENVIRONMENT: Light, Noise, Temperature
  let envScore = 100;
  envScore -= (data.environment.noise - 1) * 8;
  envScore -= (data.environment.light - 1) * 8;
  if (data.environment.temperature !== 'optimal') envScore -= 15;

  // LIFESTYLE: Caffeine, Screens, Stress
  let lifestyle = 100;
  const caffeineMap = { none: 0, low: 10, moderate: 25, high: 40 };
  lifestyle -= caffeineMap[data.caffeineIntake];
  lifestyle -= (data.blueLightExposure * 12);
  lifestyle -= (data.stressLevel * 4);

  const normalize = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
  
  const finalBreakdown = {
    efficiency: normalize(efficiency),
    consistency: normalize(consistency),
    environment: normalize(envScore),
    lifestyle: normalize(lifestyle)
  };

  const totalScore = normalize(
    (finalBreakdown.efficiency * 0.4) + 
    (finalBreakdown.consistency * 0.2) + 
    (finalBreakdown.environment * 0.2) + 
    (finalBreakdown.lifestyle * 0.2)
  );

  let label: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical' = 'Fair';
  if (totalScore >= 85) label = 'Excellent';
  else if (totalScore >= 70) label = 'Good';
  else if (totalScore >= 50) label = 'Fair';
  else if (totalScore >= 30) label = 'Poor';
  else label = 'Critical';

  // Plain English Recommendations
  const recommendations: string[] = [];
  if (data.blueLightExposure > 1) recommendations.push("Put your phone away 1 hour before bed. The bright light stops your brain from getting sleepy.");
  if (data.environment.temperature !== 'optimal') recommendations.push(`Cool your room down. Your body sleeps best when it's slightly chilly.`);
  if (data.caffeineIntake !== 'none') recommendations.push("Try to avoid coffee or tea after 2 PM. It stays in your system for many hours.");
  if (data.latency > 20) recommendations.push("Try a few deep breaths when you get into bed to help your body relax faster.");
  
  // Guarantee at least 2 recommendations
  if (recommendations.length < 2) {
    recommendations.push("Keep your wake-up time the same every day, even on weekends, to stay in a good rhythm.");
    recommendations.push("Try to get 15 minutes of natural sunlight every morning to help you sleep better at night.");
  }

  // Simple Human Insights
  const scientificInsights: string[] = [
    `Your stress level of ${data.stressLevel}/10 makes it hard for your brain to 'switch off' when you try to sleep.`,
    `Since it takes ${data.latency} minutes to fall asleep, your mind might still be thinking about the day's tasks.`,
    `The noise level (${data.environment.noise}/10) might be making your sleep lighter than it should be.`
  ];

  const summaryPillars = {
    efficiency: "your actual rest quality",
    consistency: "your sleep schedule",
    environment: "your bedroom comfort",
    lifestyle: "your daily habits"
  };

  const weakestAreaKey = Object.entries(finalBreakdown).sort((a,b) => a[1]-b[1])[0][0] as keyof typeof summaryPillars;

  return {
    score: totalScore,
    qualityLabel: label,
    breakdown: finalBreakdown,
    summary: `Your sleep is ${label}. Right now, ${summaryPillars[weakestAreaKey]} needs the most attention. Improving this will help you feel much better!`,
    recommendations: recommendations.slice(0, 4),
    scientificInsights
  };
};
