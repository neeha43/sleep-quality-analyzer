import { SleepData, AnalysisResponse } from "../types";

export const analyzeSleepQualityLocal = (data: SleepData): AnalysisResponse => {
  // 1. Calculate Individual Pillar Scores (0-100)
  
  // EFFICIENCY: Based on duration and latency
  let efficiency = 100;
  if (data.duration < 7) efficiency -= (7 - data.duration) * 15;
  if (data.duration > 9) efficiency -= (data.duration - 9) * 10;
  efficiency -= (data.latency > 20 ? (data.latency - 20) / 2 : 0);
  efficiency -= (data.awakenings * 8);
  
  // CONSISTENCY: Directly from user input + stress penalty
  let consistency = data.consistency * 10;
  if (data.stressLevel > 7) consistency -= 10;

  // ENVIRONMENT: Light, Noise, Temperature
  let envScore = 100;
  envScore -= (data.environment.noise - 1) * 8;
  envScore -= (data.environment.light - 1) * 8;
  if (data.environment.temperature !== 'optimal') envScore -= 15;

  // LIFESTYLE: Caffeine, Blue Light, Stress
  let lifestyle = 100;
  const caffeineMap = { none: 0, low: 10, moderate: 25, high: 40 };
  lifestyle -= caffeineMap[data.caffeineIntake];
  lifestyle -= (data.blueLightExposure * 12);
  lifestyle -= (data.stressLevel * 4);

  // Normalize scores to 0-100 range
  const normalize = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
  
  const finalBreakdown = {
    efficiency: normalize(efficiency),
    consistency: normalize(consistency),
    environment: normalize(envScore),
    lifestyle: normalize(lifestyle)
  };

  // 2. Final Weighted Score
  const totalScore = normalize(
    (finalBreakdown.efficiency * 0.4) + 
    (finalBreakdown.consistency * 0.2) + 
    (finalBreakdown.environment * 0.2) + 
    (finalBreakdown.lifestyle * 0.2)
  );

  // 3. Labels and Insights
  let label: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical' = 'Fair';
  if (totalScore >= 85) label = 'Excellent';
  else if (totalScore >= 70) label = 'Good';
  else if (totalScore >= 50) label = 'Fair';
  else if (totalScore >= 30) label = 'Poor';
  else label = 'Critical';

  const recommendations: string[] = [];
  if (data.blueLightExposure > 1) recommendations.push("Enable 'Night Shift' or stop screen use 90 mins before bed to protect melatonin production.");
  if (data.environment.temperature !== 'optimal') recommendations.push(`Your room is ${data.environment.temperature}; aim for 65°F (18°C) for core temperature drop.`);
  if (data.caffeineIntake === 'moderate' || data.caffeineIntake === 'high') recommendations.push("Caffeine has a 6-hour half-life; try a strict 'No Caffeine after 2 PM' rule.");
  if (data.latency > 30) recommendations.push("Try the 4-7-8 breathing technique or Progressive Muscle Relaxation to reduce sleep latency.");
  if (data.duration < 7) recommendations.push("Prioritize a 'Sleep Buffer' by getting into bed 30 minutes earlier than your goal time.");

  const scientificInsights: string[] = [
    `With a stress level of ${data.stressLevel}/10, your cortisol levels may be inhibiting the transition into deep REM cycles.`,
    `A latency of ${data.latency} mins suggests your ${data.blueLightExposure > 1 ? 'circadian rhythm is delayed by blue light' : 'nervous system may be in a state of hyperarousal'}.`,
    `Your environment noise level (${data.environment.noise}) might be causing 'micro-awakenings' that fragment your sleep architecture without you noticing.`
  ];

  return {
    score: totalScore,
    qualityLabel: label,
    breakdown: finalBreakdown,
    summary: `Your sleep is currently rated as ${label}. Your primary area for improvement is ${
      Object.entries(finalBreakdown).sort((a,b) => a[1]-b[1])[0][0]
    }, which is significantly impacting your restorative recovery.`,
    recommendations: recommendations.slice(0, 4),
    scientificInsights
  };
};
