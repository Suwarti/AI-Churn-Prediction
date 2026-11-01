import React from 'react';
import { 
  Bot, 
  Radio, 
  Sparkles, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Coins 
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const Header: React.FC = () => {
  const { predictionResult } = useCustomer();

  return (
    <header className="w-full bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30 backdrop-blur-md bg-slate-950/90 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Application Logo, Title, and Tagline */}
        <div className="flex items-center gap-3.5">
          {/* Brand Logo / Icon */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20 shrink-0">
            <Radio className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                AI Churn Prediction
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                <Sparkles className="w-3 h-3" />
                AI Powered
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-snug">
              For Smarter Customer Retention Strategies
            </p>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              TELECOMMUNICATIONS INDUSTRY
            </div>
          </div>
        </div>

        {/* Right: Status Badges, Currency & Engine Indicators */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* AI Powered Badge for mobile (if hidden on left) */}
          <span className="sm:hidden inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <Sparkles className="w-3 h-3" />
            AI Powered
          </span>

          {/* Engine Status Indicator */}
          {predictionResult ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <span className="text-slate-400 text-[11px]">AI Estimate:</span>
              <span className={`font-mono font-bold ${
                predictionResult.risk_level === 'High' ? 'text-red-400' :
                predictionResult.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {(predictionResult.churn_probability * 100).toFixed(1)}%
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-black uppercase ${
                predictionResult.risk_level === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                predictionResult.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {predictionResult.risk_level}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span className="font-semibold text-[11px] text-slate-300">Engine Ready</span>
              <span className="text-[10px] font-mono text-slate-500 hidden lg:inline">Gemini 3.8</span>
            </div>
          )}

          {/* Currency Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-inner">
            <Coins className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-400 text-[11px]">Currency:</span>
            <span className="font-mono font-bold text-orange-400 text-[11px]">IDR (Rp)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
