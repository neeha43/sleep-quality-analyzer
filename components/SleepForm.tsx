import React, { useState, useEffect } from 'react';
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

  // Local state for the duration input to allow free typing (including clearing the field)
  const [durationInput, setDurationInput] = useState(formData.duration.toString());
  const [durationError, setDurationError] = useState<string | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3 && !isLoading) {
      onSubmit(formData);
    }
  };

  // Sync manual input when slider moves
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFormData({ ...formData, duration: val });
    setDurationInput(val.toString());
    setDurationError(null);
  };

  // Handle manual typing
  const handleManualDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setDurationInput(valStr);
    
    const valNum = parseFloat(valStr);
    if (isNaN(valNum)) {
      setDurationError("Please enter a number");
    } else if (valNum < 3) {
      setDurationError("Minimum hours should be 3");
    } else if (valNum > 14) {
      setDurationError("Maximum hours is 14");
    } else {
      setDurationError(null);
      setFormData({ ...formData, duration: valNum });
    }
  };

  // Enforce range on blur
  const handleDurationBlur = () => {
    let valNum = parseFloat(durationInput);
    if (isNaN(valNum) || valNum < 3) {
      valNum = 3;
      setDurationInput("3");
      setDurationError(null);
      setFormData({ ...formData, duration: 3 });
    } else if (valNum > 14) {
      valNum = 14;
      setDurationInput("14");
      setDurationError(null);
      setFormData({ ...formData, duration: 14 });
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 transition-all duration-500 max-w-2xl mx-auto">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display font-extrabold text-slate-900">Sleep Assessment</h2>
          <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Step {step} of 3</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Icons.Moon /></span> 
              Your Sleep Basics
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="block text-slate-700 text-sm font-bold">How many hours do you usually sleep?</label>
                <div className="flex flex-col items-end gap-1">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border transition-colors ${durationError ? 'bg-rose-50 border-rose-200' : 'bg-indigo-50 border-indigo-100'}`}>
                    <input 
                      type="text" 
                      value={durationInput}
                      onChange={handleManualDurationChange}
                      onBlur={handleDurationBlur}
                      className={`w-12 bg-transparent font-black text-lg focus:outline-none text-center ${durationError ? 'text-rose-600' : 'text-indigo-600'}`}
                    />
                    <span className={`font-bold text-xs uppercase ${durationError ? 'text-rose-400' : 'text-indigo-400'}`}>hrs</span>
                  </div>
                </div>
              </div>
              
              {durationError && (
                <p className="text-rose-500 text-xs font-bold animate-pulse">{durationError}</p>
              )}

              <div className="relative h-6 flex items-center group">
                {/* Visible track line */}
                <div className="absolute w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-indigo-100 transition-all" 
                    style={{ width: `${((formData.duration - 3) / 11) * 100}%` }}
                   />
                </div>
                <input 
                  type="range" min="3" max="14" step="0.5"
                  value={formData.duration}
                  onChange={handleSliderChange}
                  className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                    [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-indigo-200
                    [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 
                    [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:rounded-full 
                    [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white"
                />
              </div>
              <p className="text-slate-400 font-medium italic text-xs">Recommended: 7-9 hours for most adults.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-slate-700 text-sm font-bold">Minutes to fall asleep</label>
                <input 
                  type="number" min="0" max="300"
                  value={formData.latency}
                  onChange={(e) => setFormData({...formData, latency: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 text-sm font-bold">Times you wake up at night</label>
                <input 
                  type="number" min="0" max="20"
                  value={formData.awakenings}
                  onChange={(e) => setFormData({...formData, awakenings: parseInt(e.target.value) || 0})}
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
              Your Daily Habits
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-slate-700 text-sm font-bold">Daily Stress (1-10)</label>
                <select 
                  value={formData.stressLevel}
                  onChange={(e) => setFormData({...formData, stressLevel: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} - {i < 3 ? 'Calm' : i < 7 ? 'Busy' : 'Very Stressed'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 text-sm font-bold">Coffee / Tea Intake</label>
                <select 
                  value={formData.caffeineIntake}
                  onChange={(e) => setFormData({...formData, caffeineIntake: e.target.value as any})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="none">None</option>
                  <option value="low">1 Cup</option>
                  <option value="moderate">2-3 Cups</option>
                  <option value="high">4+ Cups</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-700 text-sm font-bold">Phone/TV use before bed (Hours)</label>
              <input 
                type="number" min="0" max="8" step="0.5"
                value={formData.blueLightExposure}
                onChange={(e) => setFormData({...formData, blueLightExposure: parseFloat(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Icons.Thermometer /></span>
              Bedroom Environment
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 text-sm font-bold mb-3">Room Temperature</label>
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
                <label className="block text-slate-700 text-sm font-bold">Room Noise Level</label>
                <div className="relative h-6 flex items-center">
                   <div className="absolute w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-100 transition-all" 
                        style={{ width: `${((formData.environment.noise - 1) / 9) * 100}%` }}
                      />
                   </div>
                   <input 
                    type="range" min="1" max="10"
                    value={formData.environment.noise}
                    onChange={(e) => setFormData({...formData, environment: {...formData.environment, noise: parseInt(e.target.value)}})}
                    className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                      [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                      [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-indigo-200"
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  <span>Quiet</span>
                  <span className="text-indigo-600">Level {formData.environment.noise}</span>
                  <span>Noisy</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-slate-700 text-sm font-bold">Room Light Level</label>
                <div className="relative h-6 flex items-center">
                  <div className="absolute w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-100 transition-all" 
                      style={{ width: `${((formData.environment.light - 1) / 9) * 100}%` }}
                    />
                  </div>
                  <input 
                    type="range" min="1" max="10"
                    value={formData.environment.light}
                    onChange={(e) => setFormData({...formData, environment: {...formData.environment, light: parseInt(e.target.value)}})}
                    className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                      [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                      [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-indigo-200"
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  <span>Dark</span>
                  <span className="text-indigo-600">Level {formData.environment.light}</span>
                  <span>Bright</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
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
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !!durationError}
              className={`flex-[2] py-5 px-6 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 ${
                (isLoading || !!durationError) ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <Icons.Zap />
                  Generate Insights
                </span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SleepForm;