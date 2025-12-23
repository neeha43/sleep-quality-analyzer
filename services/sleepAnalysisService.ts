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
  if (data.blueLightExposure > 1) recommendations.push("Put your phone away 1 hour before bed. The bright screen tricks your brain into thinking it is daytime.");
  if (data.environment.temperature !== 'optimal') recommendations.push(`Try to make your room a bit cooler. Your body sleeps much better when you aren't feeling too warm.`);
  if (data.caffeineIntake === 'moderate' || data.caffeineIntake === 'high') recommendations.push("Try to stop drinking coffee or tea after lunch. Caffeine stays in your body much longer than you think.");
  if (data.latency > 30) recommendations.push("If you can't fall asleep, try simple deep breathing. It tells your body it is safe to relax and drift off.");
  if (data.duration < 7) recommendations.push("Try to get to bed just 20 minutes earlier tonight. Even a small increase in sleep time makes a big difference.");

  // Simple Human Insights
  const scientificInsights: string[] = [
    `Your stress level of ${data.stressLevel}/10 means your brain is staying on 'high alert,' making it harder for you to fall into a deep, restful sleep.`,
    `Since it takes you ${data.latency} minutes to fall asleep, your body might still be too active from ${data.blueLightExposure > 1 ? 'screen use' : 'daily activities'} when you hit the pillow.`,
    `The noise level in your room (${data.environment.noise}/10) might be waking you up for split seconds throughout the night, leaving you feeling tired even if you don't remember waking up.`
  ];

  const summaryPillars = {
    efficiency: "how well you actually sleep while in bed",
    consistency: "how regular your sleep routine is",
    environment: "how comfortable your bedroom is",
    lifestyle: "how your daily habits affect your rest"
  };

  const weakestAreaKey = Object.entries(finalBreakdown).sort((a,b) => a[1]-b[1])[0][0] as keyof typeof summaryPillars;

  return {
    score: totalScore,
    qualityLabel: label,
    breakdown: finalBreakdown,
    summary: `Your sleep is rated as ${label}. Right now, the biggest thing holding you back is ${summaryPillars[weakestAreaKey]}. Improving this will help you wake up feeling much more refreshed.`,
    recommendations: recommendations.slice(0, 4),
    scientificInsights
  };
};