
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AnalysisResponse } from '../types';
import { Icons } from '../constants';

interface AnalysisDisplayProps {
  analysis: AnalysisResponse;
  onReset: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, onReset }) => {
  const chartData = [
    { subject: 'Efficiency', A: analysis.breakdown.efficiency, fullMark: 100 },
    { subject: 'Consistency', A: analysis.breakdown.consistency, fullMark: 100 },
    { subject: 'Environment', A: analysis.breakdown.environment, fullMark: 100 },
    { subject: 'Lifestyle', A: analysis.breakdown.lifestyle, fullMark: 100 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-emerald-50 border-emerald-100';
    if (score >= 70) return 'bg-blue-50 border-blue-100';
    if (score >= 50) return 'bg-amber-50 border-amber-100';
    return 'bg-rose-50 border-rose-100';
  };

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-700">
      {/* Hero Result Section */}
      <section className={`p-8 md:p-12 rounded-[2.5rem] border ${getScoreBg(analysis.score)} shadow-sm`}>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative flex-shrink-0">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96" cy="96" r="80"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-white"
              />
              <circle
                cx="96" cy="96" r="80"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={502.6}
                strokeDashoffset={502.6 - (502.6 * analysis.score) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${getScoreColor(analysis.score)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-6xl font-black font-display ${getScoreColor(analysis.score)}`}>{analysis.score}</span>
              <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Overall Score</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 bg-white border border-slate-200 ${getScoreColor(analysis.score)}`}>
                {analysis.qualityLabel} Quality
              </span>
              <h2 className="text-4xl font-display font-black text-slate-900 mb-4 leading-tight">Sleep Architecture Report</h2>
              <p className="text-slate-600 leading-relaxed text-xl font-medium">{analysis.summary}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Analysis Card */}
        <article className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
          <h3 className="text-xl font-display font-black text-slate-900 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Performance Metrics
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Quality"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Scientific Insights */}
        <article className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
          <h3 className="text-xl font-display font-black text-slate-900 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
            Biological Insights
          </h3>
          <div className="space-y-4">
            {analysis.scientificInsights.map((insight, idx) => (
              <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-black text-lg">{idx + 1}</span>
                </div>
                <p className="text-slate-600 text-sm italic font-medium leading-relaxed">"{insight}"</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* Plan Section */}
      <section className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-2xl font-display font-black text-slate-900 mb-8 flex items-center gap-4">
          <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Icons.CheckCircle /></span>
          Personalized Optimization Protocol
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="group flex items-start gap-5 p-6 rounded-3xl bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-default">
              <div className="mt-1 text-indigo-400 group-hover:text-indigo-600 transition-colors">
                <Icons.CheckCircle />
              </div>
              <p className="text-slate-700 font-bold leading-snug">{rec}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pb-20">
        <button
          onClick={onReset}
          className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest text-sm"
        >
          New Assessment
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
