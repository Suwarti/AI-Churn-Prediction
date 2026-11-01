import React from 'react';
import { 
  Activity, 
  Users, 
  GitBranch, 
  SlidersHorizontal, 
  Calculator, 
  Sparkles, 
  Server, 
  RefreshCw, 
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { NavigationTab } from '../../types';

interface HeaderProps {
  onOpenModelModal: () => void;
}

const TAB_META: Record<NavigationTab, { title: string; subtitle: string; icon: React.ElementType }> = {
  'prediction': {
    title: 'Customer Churn Prediction',
    subtitle: 'Evaluate single-subscriber churn risk with the trained Logistic Regression + SMOTE pipeline',
    icon: Activity,
  },
  'customer-value': {
    title: 'Customer Value Analytics',
    subtitle: 'Segment subscriber value tiers and analyze estimated historical revenue proxies',
    icon: Users,
  },
  'decision-framework': {
    title: 'Retention Decision Framework',
    subtitle: 'Strategic 2×2 action matrix matching Churn Risk against Customer Value tiers',
    icon: GitBranch,
  },
  'scenario-view': {
    title: 'What-If Scenario Simulator',
    subtitle: 'Test model sensitivity by modifying subscriber characteristics against the trained ML pipeline',
    icon: SlidersHorizontal,
  },
  'roi-calculation': {
    title: 'Campaign ROI Calculator',
    subtitle: 'Simulate campaign economics, estimated retained revenue, and net return on investment',
    icon: Calculator,
  },
  'generate-insight': {
    title: 'Executive Business Insights',
    subtitle: 'AI-assisted executive summaries, risk breakdowns, and strategic operational priorities',
    icon: Sparkles,
  },
};

export const Header: React.FC<HeaderProps> = ({ onOpenModelModal }) => {
  const { activeTab, apiStatus, checkApiStatus, predictionResult } = useCustomer();
  const current = TAB_META[activeTab];
  const Icon = current.icon;

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {current.title}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
              <Building2 className="w-3 h-3 text-amber-400" />
              Indosat Ooredoo Hutchison
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* ML Status Pill */}
        <button
          onClick={onOpenModelModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            apiStatus.connected
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-300 hover:bg-amber-950/50'
          }`}
          title="Click to inspect Python Model Service connection details"
        >
          {apiStatus.connected ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span className="font-mono text-[11px]">
            {apiStatus.connected ? 'Model: Online' : 'Model: Disconnected'}
          </span>
          <span className="text-[10px] text-slate-400 border-l border-slate-700/60 pl-1.5">
            Config
          </span>
        </button>

        {/* Prediction Status Badge */}
        {predictionResult && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Current Score:</span>
            <span className={`font-mono font-bold ${
              predictionResult.risk_level === 'High' ? 'text-red-400' :
              predictionResult.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {(predictionResult.churn_probability * 100).toFixed(1)}%
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
              predictionResult.risk_level === 'High' ? 'bg-red-500/20 text-red-300' :
              predictionResult.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {predictionResult.risk_level}
            </span>
          </div>
        )}

        {/* Currency badge */}
        <div className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hidden sm:block">
          Currency: <strong className="text-amber-400">IDR (Rp)</strong>
        </div>
      </div>
    </header>
  );
};
