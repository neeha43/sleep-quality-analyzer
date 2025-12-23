import React, { useState } from 'react';
import { AnalysisResponse } from '../types';
import { Icons } from '../constants';

interface AnalysisDisplayProps {
  analysis: AnalysisResponse;
  onReset: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, onReset }) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const metrics = [
    { 
      key: 'efficiency', 
      label: 'Sleep Depth', 
      value: analysis.breakdown.efficiency, 
      desc: 'How well you actually rest while in bed.',
      detail: 'This counts how much of your night is spent in deep, restorative sleep rather than just lying awake or tossing and turning.',
      color: 'bg-blue-500'
    },
    { 
      key: 'consistency', 
      label: 'Your Routine', 
      value: analysis.breakdown.consistency, 
      desc: 'How steady your bedtime habits are.',
      detail: 'A regular routine trains your brain to start "shutting down" at the same time every night, making it easier to drift off.',
      color: 'bg-indigo-500'
    },
    { 
      key: 'environment', 
      label: 'Room Comfort', 
      value: analysis.breakdown.environment, 
      desc: 'How your bedroom helps you sleep.',
      detail: 'Things like bright lights, loud noises, or being too warm can secretly wake you up even if you don\'t remember it.',
      color: 'bg-emerald-500'
    },
    { 
      key: 'lifestyle', 
      label: 'Daily Habits', 
      value: analysis.breakdown.lifestyle, 
      desc: 'How your day affects your night.',
      detail: 'Caffeine, late-night snacking, or using your phone before bed can keep your brain over-active when it should be resting.',
      color: 'bg-purple-500'
    },
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
                stroke="white"
                strokeWidth="12"
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
              <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Sleep Index</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 bg-white border border-slate-200 ${getScoreColor(analysis.score)}`}>
                {analysis.qualityLabel} Quality
              </span>
              <h2 className="text-4xl font-display font-black text-slate-900 mb-4 leading-tight">Your Sleep Report</h2>
              <p className="text-slate-600 leading-relaxed text-xl font-medium">{analysis.summary}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Metrics Section */}
      <section className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-2xl font-display font-black text-slate-900 mb-2 flex items-center gap-3">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Icons.Zap /></span>
          Your Sleep Vitals
        </h3>
        <p className="text-slate-500 mb-8 font-medium">Hover over any bar to see what it means in simple terms.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((m) => (
            <div 
              key={m.key}
              onMouseEnter={() => setHoveredMetric(m.key)}
              onMouseLeave={() => setHoveredMetric(null)}
              className="relative p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all bg-slate-50/50 group cursor-help"
            >
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{m.label}</h4>
                  <p className="text-sm text-slate-500">{m.desc}</p>
                </div>
                <span className="text-2xl font-black text-slate-900">{m.value}%</span>
              </div>
              
              <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${m.color}`}
                  style={{ width: `${m.value}%` }}
                />
              </div>

              {/* Hover Details - Simple explanation */}
              <div className={`mt-4 overflow-hidden transition-all duration-300 ${hoveredMetric === m.key ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-sm text-indigo-600 font-bold leading-relaxed bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  {m.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simplified Recommendations */}
        <article className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
          <h3 className="text-xl font-display font-black text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Easy Changes to Try
          </h3>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex-shrink-0 mt-1 text-emerald-500">
                  <Icons.CheckCircle />
                </div>
                <p className="text-slate-700 font-bold text-sm leading-snug">{rec}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Why this happens */}
        <article className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
          <h3 className="text-xl font-display font-black text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
            What's Happening?
          </h3>
          <div className="space-y-4">
            {analysis.scientificInsights.map((insight, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-black text-sm">
                  {idx + 1}
                </div>
                <p className="text-slate-600 text-sm font-medium italic leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="flex justify-center pb-20">
        <button
          onClick={onReset}
          className="px-12 py-5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest text-sm"
        >
          Check Again
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;