import React from 'react';
import { Radio, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30 backdrop-blur-md bg-slate-950/90 shadow-md print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Application Logo, Title, Tagline & AI Powered Badge */}
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
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
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
      </div>
    </header>
  );
};
