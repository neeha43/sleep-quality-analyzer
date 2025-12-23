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
      label: 'Sleep Power', 
      value: analysis.breakdown.efficiency, 
      desc: 'How well your body recharged.',
      detail: 'This shows if you actually slept well while in bed. Higher numbers mean you spent more time truly resting.',
      color: '#3b82f6' // Blue
    },
    { 
      key: 'consistency', 
      label: 'Your Rhythm', 
      value: analysis.breakdown.consistency, 
      desc: 'How steady your bedtime is.',
      detail: 'Keeping a steady schedule helps your body clock work perfectly so you fall asleep faster.',
      color: '#6366f1' // Indigo
    },
    { 
      key: 'environment', 
      label: 'Bedroom Peace', 
      value: analysis.breakdown.environment, 
      desc: 'How cozy your room is.',
      detail: 'A dark, quiet, and cool room helps you stay asleep longer without small wake-ups.',
      color: '#10b981' // Emerald
    },
    { 
      key: 'lifestyle', 
      label: 'Daily Choices', 
      value: analysis.breakdown.lifestyle, 
      desc: 'How your day affected your night.',
      detail: 'Choices like caffeine and late-night phone use can keep your brain too active at bedtime.',
      color: '#a855f7' // Purple
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
              <circle cx="96" cy="96" r="80" fill="transparent" stroke="white" strokeWidth="12" />
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
              <span className="text-slate-400 text-xs uppercase tracking-widest font-bold font-sans">Sleep Score</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 bg-white border border-slate-200 ${getScoreColor(analysis.score)}`}>
                {analysis.qualityLabel} Sleep
              </span>
              <h2 className="text-4xl font-display font-black text-slate-900 mb-4 leading-tight">Your Result</h2>
              <p className="text-slate-700 leading-relaxed text-xl font-medium max-w-xl">{analysis.summary}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Metrics Section */}
      <section className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-2xl font-display font-black text-slate-900 mb-2 flex items-center gap-3">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Icons.Info /></span>
          The Breakdown
        </h3>
        <p className="text-slate-500 mb-8 font-medium italic">Hover over each card for details.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((m) => (
            <div 
              key={m.key}
              onMouseEnter={() => setHoveredMetric(m.key)}
              onMouseLeave={() => setHoveredMetric(null)}
              className="relative p-6 rounded-3xl border border-slate-100 bg-slate-50/50 group cursor-help transition-all hover:border-indigo-400 hover:bg-white hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{m.label}</h4>
                  <p className="text-sm text-slate-500 font-medium">{m.desc}</p>
                </div>
                <div className="ml-4 font-black text-2xl text-slate-900 tracking-tighter">{m.value}%</div>
              </div>
              
              <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden mb-2 shadow-inner">
                <div 
                  className="h-full transition-all duration-1000 ease-out rounded-full shadow-md"
                  style={{ width: `${Math.max(5, m.value)}%`, backgroundColor: m.color }}
                />
              </div>

              {/* Hover Detail */}
              <div className={`transition-all duration-300 ease-in-out ${hoveredMetric === m.key ? 'mt-4 opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-sm text-slate-700 font-bold leading-relaxed shadow-sm">
                  {m.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simple To-Do List */}
        <article className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
          <h3 className="text-xl font-display font-black text-slate-900 mb-6 flex items-center gap-3">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Icons.CheckCircle /></span>
            Things to try tonight
          </h3>
          <div className="space-y-4">
            {analysis.recommendations && analysis.recommendations.length > 0 ? analysis.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                <div className="flex-shrink-0 mt-0.5 text-emerald-600">
                  <Icons.CheckCircle />
                </div>
                <p className="text-slate-800 font-bold text-sm leading-relaxed">{rec}</p>
              </div>
            )) : (
              <div className="p-4 rounded-2xl bg-slate-50 text-slate-500 font-medium italic text-center border border-dashed border-slate-200">
                Wait for tips...
              </div>
            )}
          </div>
        </article>

        {/* The Why */}
        <article className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
          <h3 className="text-xl font-display font-black text-slate-900 mb-6 flex items-center gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Icons.Zap /></span>
            What's going on?
          </h3>
          <div className="space-y-4">
            {analysis.scientificInsights.map((insight, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center flex-shrink-0 text-white font-black text-xs">
                  {idx + 1}
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed italic">{insight}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="flex justify-center pb-20 pt-10">
        <button
          onClick={onReset}
          className="px-14 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest text-sm flex items-center gap-3"
        >
          <Icons.Moon />
          Start a New Check
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;