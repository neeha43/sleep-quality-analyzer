
import React, { useState } from 'react';
import { SleepData, AnalysisResponse } from './types';
import SleepForm from './components/SleepForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeSleepQuality } from './services/geminiService';
import { Icons } from './constants';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: SleepData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeSleepQuality(data);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate report. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-50">
      {/* Background Decorative Elements - Refined for Light Mode */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/40 blur-[120px] rounded-full pointer-events-none" />
      
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Icons.Moon />
            </div>
            <h1 className="text-xl font-display font-extrabold tracking-tight text-slate-900">
              SOMNUS<span className="text-indigo-600">AI</span>
            </h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-semibold">Assessment</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-semibold">Sleep Science</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-semibold">Library</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {!analysis ? (
          <section className="space-y-12">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 leading-tight">
                Unlock Your Best Night's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Sleep.</span>
              </h2>
              <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Advanced AI-powered analysis to decode your sleep patterns and provide actionable scientific insights for restorative rest.
              </p>
            </div>

            {error && (
              <div role="alert" className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-600 font-medium text-center max-w-lg mx-auto">
                {error}
              </div>
            )}

            <SleepForm onSubmit={handleFormSubmit} isLoading={isLoading} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
              <article className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-indigo-600 mb-4"><Icons.Zap /></div>
                <h3 className="text-slate-900 font-bold text-lg mb-2">Instant Analysis</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Get immediate feedback on your sleep efficiency using deep-reasoning biological modeling.</p>
              </article>
              <article className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-purple-600 mb-4"><Icons.CheckCircle /></div>
                <h3 className="text-slate-900 font-bold text-lg mb-2">Tailored Advice</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Personalized behavioral adjustments based on your caffeine, blue light, and stress levels.</p>
              </article>
              <article className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-emerald-600 mb-4"><Icons.Info /></div>
                <h3 className="text-slate-900 font-bold text-lg mb-2">Scientific Basis</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Insights backed by modern chronobiology and sleep architecture research data.</p>
              </article>
            </div>
          </section>
        ) : (
          <AnalysisDisplay analysis={analysis} onReset={resetApp} />
        )}
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-medium">© 2024 SomnusAI. Non-diagnostic educational tool.</p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-wider">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-wider">Terms</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-wider">Sources</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
