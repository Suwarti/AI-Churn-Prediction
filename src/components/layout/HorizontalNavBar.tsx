import React from 'react';
import { 
  Activity, 
  Users, 
  GitBranch, 
  SlidersHorizontal, 
  Calculator, 
  Sparkles, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { NavigationTab } from '../../types';

export const HorizontalNavBar: React.FC = () => {
  const { 
    activeTab, 
    attemptNavigateToTab, 
    isTabUnlocked, 
    completedModules 
  } = useCustomer();

  const tabs: { id: NavigationTab; label: string; icon: React.ElementType; step: number }[] = [
    { id: 'prediction', label: 'Churn Prediction', icon: Activity, step: 1 },
    { id: 'customer-value', label: 'Customer Value', icon: Users, step: 2 },
    { id: 'decision-framework', label: 'Decision Framework', icon: GitBranch, step: 3 },
    { id: 'scenario-view', label: 'Scenario View', icon: SlidersHorizontal, step: 4 },
    { id: 'roi-calculation', label: 'ROI Calculation', icon: Calculator, step: 5 },
    { id: 'generate-insight', label: 'Generate Insight', icon: Sparkles, step: 6 },
  ];

  return (
    <nav className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-[73px] z-20 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none select-none flex-nowrap min-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const unlocked = isTabUnlocked(tab.id);
            const isCompleted = completedModules[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => attemptNavigateToTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 shrink-0 border whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/40'
                    : unlocked
                    ? isCompleted
                      ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-300 hover:bg-slate-800 hover:text-white hover:border-emerald-500/50'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700'
                    : 'bg-slate-950/60 border-slate-800/50 text-slate-500 hover:bg-slate-900/40 hover:text-slate-400 opacity-65'
                }`}
                title={unlocked ? `${tab.step}. ${tab.label}` : `${tab.step}. ${tab.label} (Locked: Complete prerequisite first)`}
              >
                {/* Status Indicator / Step Badge */}
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                  isActive
                    ? 'bg-slate-950 text-orange-400 font-black'
                    : isCompleted
                    ? 'text-emerald-400'
                    : unlocked
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}>
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  )}
                </span>

                {/* Tab Label */}
                <span className="tracking-tight">
                  {tab.label}
                </span>

                {/* Lock icon when prerequisite is incomplete */}
                {!unlocked && (
                  <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-0.5" />
                )}

                {/* Completed Checkmark next to label if active or completed */}
                {isCompleted && isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 shrink-0 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
