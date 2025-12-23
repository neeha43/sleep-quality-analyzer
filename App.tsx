
import React, { useState, useEffect } from 'react';
import { SleepData, AnalysisResponse } from './types';
import SleepForm from './components/SleepForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeSleepQuality } from './services/geminiService';
import { Icons } from './constants';
import { PrivacyPolicy, TermsOfService, AboutUs, ContactUs } from './components/LegalContent';

type ViewState = 'home' | 'privacy' | 'terms' | 'about' | 'contact';

// Define AIStudio interface to match the environment's global type
interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  interface Window {
    // Fixed: All declarations of 'aistudio' must have identical modifiers (readonly, optional) and types
    readonly aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShowCookieBanner(true);

    const checkKey = async () => {
      // API Key check logic following the guideline hierarchy
      if (process.env.API_KEY) {
        setHasApiKey(true);
      } else if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowCookieBanner(false);
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success as per guidelines to avoid race condition:
      // "A race condition can occur where hasSelectedApiKey() may not immediately return true...
      // you MUST assume the key selection was successful after triggering openSelectKey() and proceed"
      setHasApiKey(true);
    }
  };

  const handleFormSubmit = async (data: SleepData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeSleepQuality(data);
      setAnalysis(result);
    } catch (err: any) {
      console.error("Assessment Error:", err);
      // Fixed: Handle "Requested entity was not found" error by resetting selection state as per guidelines
      if (err?.message?.includes("API Key") || err?.message?.includes("Requested entity was not found.")) {
        setHasApiKey(false);
        setError("API Key verification failed. Please ensure you have selected a valid key from a paid GCP project.");
      } else {
        setError("Unable to reach the analysis engine. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setAnalysis(null);
    setError(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHome = () => {
    if (hasApiKey === false) {
      return (
        <div className="max-w-xl mx-auto py-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Icons.Zap />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-display font-black text-slate-900">API Connection Required</h2>
            <p className="text-slate-600 leading-relaxed">
              To process your sleep data using Gemini AI, you need to connect an API key from a paid Google Cloud project.
            </p>
            <p className="text-xs text-slate-400">
              Visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">billing documentation</a> for setup instructions.
            </p>
          </div>
          <button 
            onClick={handleSelectKey}
            className="px-10 py-4 bg-[#4f46e5] text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-[#4338ca] transition-all uppercase tracking-widest text-sm"
          >
            Connect Gemini API
          </button>
        </div>
      );
    }

    return !analysis ? (
      <section className="space-y-12">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 leading-tight">
            Unlock Your Best Night's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Sleep.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Advanced AI-powered analysis to decode your sleep patterns and provide actionable scientific insights for restorative rest.
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-rose-600 font-bold text-center max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4">
            <p>{error}</p>
          </div>
        )}

        <SleepForm onSubmit={handleFormSubmit} isLoading={isLoading} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <article className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 mb-4" aria-hidden="true"><Icons.Zap /></div>
            <h2 className="text-slate-900 font-bold text-lg mb-2">Instant AI Analysis</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Get immediate feedback on your sleep efficiency using deep-reasoning biological modeling specifically tuned for human sleep architecture.</p>
          </article>
          <article className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-purple-600 mb-4" aria-hidden="true"><Icons.CheckCircle /></div>
            <h2 className="text-slate-900 font-bold text-lg mb-2">Scientific Advice</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Receive personalized behavioral adjustments based on your specific caffeine intake, blue light exposure, and daily stress levels.</p>
          </article>
          <article className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-emerald-600 mb-4" aria-hidden="true"><Icons.Info /></div>
            <h2 className="text-slate-900 font-bold text-lg mb-2">Sleep Science Data</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Our insights are grounded in modern chronobiology research and clinical sleep studies to help you optimize your recovery phase.</p>
          </article>
        </div>
      </section>
    ) : (
      <AnalysisDisplay analysis={analysis} onReset={resetApp} />
    );
  };

  const renderContent = () => {
    switch (view) {
      case 'privacy': return <PrivacyPolicy />;
      case 'terms': return <TermsOfService />;
      case 'about': return <AboutUs />;
      case 'contact': return <ContactUs />;
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button 
            onClick={() => {setView('home'); setAnalysis(null);}} 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Icons.Moon />
            </div>
            <span className="text-xl font-display font-extrabold tracking-tight text-slate-900">
              REST<span className="text-indigo-600">PULSE</span>
            </span>
          </button>
          <nav className="hidden md:flex gap-8">
            <button onClick={() => setView('home')} className={`text-sm font-semibold transition-colors ${view === 'home' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Assessment</button>
            <button onClick={() => setView('about')} className={`text-sm font-semibold transition-colors ${view === 'about' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Sleep Science</button>
            <button onClick={() => setView('contact')} className={`text-sm font-semibold transition-colors ${view === 'contact' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Support</button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10 flex-grow w-full">
        {renderContent()}
      </main>

      <footer className="py-16 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white scale-75">
                <Icons.Moon />
              </div>
              <span className="font-display font-black text-slate-900">RESTPULSE</span>
            </div>
            <p className="text-slate-500 leading-relaxed">Advanced Sleep Hygiene Assessment. Empowering individuals with AI-driven biological insights.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Platform</h3>
            <ul className="space-y-2">
              <li><button onClick={() => setView('about')} className="text-slate-500 hover:text-indigo-600 transition-colors">About Our Science</button></li>
              <li><button onClick={() => setView('contact')} className="text-slate-500 hover:text-indigo-600 transition-colors">Contact Support</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Legal</h3>
            <ul className="space-y-2">
              <li><button onClick={() => setView('privacy')} className="text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setView('terms')} className="text-slate-500 hover:text-indigo-600 transition-colors">Terms of Service</button></li>
            </ul>
          </div>
          <div>
             <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Methodology</h3>
             <p className="text-slate-400 text-xs">Our Sleep Quality Index (SQI) algorithm uses Generative AI to map behavioral data to known sleep wellness patterns.</p>
          </div>
        </div>
      </footer>

      {showCookieBanner && (
        <div className="fixed bottom-0 inset-x-0 z-[100] p-4 animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200">
            <div className="flex-1">
              <h4 className="font-display font-black text-slate-900 mb-1">Privacy & Cookies</h4>
              <p className="text-slate-600 text-sm">We use cookies to enhance your experience. See our <button onClick={() => setView('privacy')} className="underline font-bold text-indigo-600">Privacy Policy</button>.</p>
            </div>
            <button onClick={handleCookieAccept} className="px-8 py-3 bg-[#4f46e5] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-200">Accept All</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
