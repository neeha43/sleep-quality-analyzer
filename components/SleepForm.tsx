
import React, { useState } from 'react';
import { SleepData } from '../types';
import { Icons } from '../constants';

interface SleepFormProps {
  onSubmit: (data: SleepData) => void;
  isLoading: boolean;
}

const SleepForm: React.FC<SleepFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SleepData>({
    duration: 7,
    latency: 15,
    awakenings: 0,
    stressLevel: 3,
    caffeineIntake: 'none',
    blueLightExposure: 1,
    consistency: 7,
    environment: {
      noise: 2,
      light: 1,
      temperature: 'optimal'
    }
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const progress = (step / 3) * 100;

  return (
    <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 transition-all duration-500 max-w-2xl mx-auto">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display font-extrabold text-slate-900">Assessment Form</h2>
          <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Step {step} of 3</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Icons.Moon /></span> 
              Core Sleep Metrics
            </h3>
            
            <div className="space-y-4">
              <label className="block text-slate-700 text-sm font-bold">Sleep Duration</label>
              <input 
                type="range" min="3" max="14" step="0.5"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium">Target: 7-9h</span>
                <span className="text-indigo-600 font-black text-2xl">{formData.duration}<small className="text-sm font-bold text-slate-400 ml-1">hrs</small></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-slate-700 text-sm font-bold">Latency (Mins to sleep)</label>
                <input 
                  type="number" min="0" max="300"
                  value={formData.latency}
                  onChange={(e) => setFormData({...formData, latency: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 text-sm font-bold">Nightly Awakenings</label>
                <input 
                  type="number" min="0" max="20"
                  value={formData.awakenings}
                  onChange={(e) => setFormData({...formData, awakenings: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Icons.Zap /></span>
              Habits & Lifestyle
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-slate-700 text-sm font-bold">Stress Level (1-10)</label>
                <select 
                  value={formData.stressLevel}
                  onChange={(e) => setFormData({...formData, stressLevel: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} - {i < 3 ? 'Relaxed' : i < 7 ? 'Moderate' : 'High'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 text-sm font-bold">Caffeine Intake</label>
                <select 
                  value={formData.caffeineIntake}
                  onChange={(e) => setFormData({...formData, caffeineIntake: e.target.value as any})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="none">Zero</option>
                  <option value="low">Low (1 Cup)</option>
                  <option value="moderate">Moderate (2-3 Cups)</option>
                  <option value="high">High (4+ Cups)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-700 text-sm font-bold">Blue Light (Hrs before bed)</label>
              <input 
                type="number" min="0" max="8" step="0.5"
                value={formData.blueLightExposure}
                onChange={(e) => setFormData({...formData, blueLightExposure: parseFloat(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Icons.Thermometer /></span>
              Sleep Environment
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 text-sm font-bold mb-3">Temperature</label>
                <div className="flex gap-3">
                  {['cold', 'optimal', 'hot'].map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setFormData({...formData, environment: {...formData.environment, temperature: temp as any}})}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 capitalize font-bold transition-all ${
                        formData.environment.temperature === temp 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-slate-700 text-sm font-bold">Noise Level</label>
                <input 
                  type="range" min="1" max="10"
                  value={formData.environment.noise}
                  onChange={(e) => setFormData({...formData, environment: {...formData.environment, noise: parseInt(e.target.value)}})}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  <span>Silent</span>
                  <span className="text-indigo-600">Level {formData.environment.noise}</span>
                  <span>Loud</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-slate-700 text-sm font-bold">Light Exposure</label>
                <input 
                  type="range" min="1" max="10"
                  value={formData.environment.light}
                  onChange={(e) => setFormData({...formData, environment: {...formData.environment, light: parseInt(e.target.value)}})}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  <span>Pitch Dark</span>
                  <span className="text-indigo-600">Level {formData.environment.light}</span>
                  <span>Bright</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-[2] py-4 px-6 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-[2] py-4 px-6 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 ${
                isLoading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Generate Insights'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SleepForm;
