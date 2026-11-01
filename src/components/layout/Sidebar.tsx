import React from 'react';
import { 
  Activity, 
  Users, 
  GitBranch, 
  SlidersHorizontal, 
  Calculator, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Server,
  Radio,
  CheckCircle2,
  AlertTriangle,
  User,
  ShieldCheck
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { NavigationTab } from '../../types';

interface SidebarProps {
  onOpenModelModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenModelModal }) => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed, 
    apiStatus,
    predictionResult 
  } = useCustomer();

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string }[] = [
    {
      id: 'prediction',
      label: 'Churn Prediction',
      icon: Activity,
      badge: predictionResult ? `${(predictionResult.churn_probability * 100).toFixed(0)}%` : undefined,
    },
    {
      id: 'customer-value',
      label: 'Customer Value',
      icon: Users,
    },
    {
      id: 'decision-framework',
      label: 'Decision Framework',
      icon: GitBranch,
    },
    {
      id: 'scenario-view',
      label: 'Scenario View',
      icon: SlidersHorizontal,
    },
    {
      id: 'roi-calculation',
      label: 'ROI Calculation',
      icon: Calculator,
    },
    {
      id: 'generate-insight',
      label: 'Generate Insight',
      icon: Sparkles,
      badge: 'AI',
    },
  ];

  return (
    <aside 
      className={`relative flex flex-col bg-slate-950 border-r border-slate-800/80 transition-all duration-300 z-30 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      } shrink-0 min-h-screen`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Indosat Yellow/Orange Accent Emblem */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 border border-amber-400/30">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  INDOSAT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v2.4</span>
              </div>
              <h1 className="text-sm font-bold text-white tracking-tight truncate">
                Customer Churn Intelligence
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                Customer Analytics Platform
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700/60"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Model Service Connection Badge */}
      <div className={`p-3 border-b border-slate-800/60 bg-slate-900/40 ${isSidebarCollapsed ? 'px-2' : 'px-4'}`}>
        <button
          onClick={onOpenModelModal}
          className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'} rounded-xl transition-all duration-200 border text-left ${
            apiStatus.connected
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50 hover:border-emerald-500/50'
              : 'bg-amber-950/20 border-amber-500/30 text-amber-300 hover:bg-amber-950/40 hover:border-amber-500/50'
          }`}
          title={`ML Model Service: ${apiStatus.connected ? 'Connected' : 'Disconnected'} (Click to configure)`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <Server className={`w-4 h-4 ${apiStatus.connected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
                apiStatus.connected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`} />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold flex items-center gap-1.5 truncate">
                  <span>ML Model API</span>
                  {apiStatus.connected ? (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono font-medium">ONLINE</span>
                  ) : (
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded font-mono font-medium">DISCONNECTED</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">
                  churn_logistic_smote.pkl
                </div>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <div className="text-[10px] text-slate-400 underline hover:text-white shrink-0 pl-1">
              Setup
            </div>
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className={`px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${isSidebarCollapsed ? 'text-center' : ''}`}>
          {isSidebarCollapsed ? 'MENU' : 'ANALYTICS MODULES'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-white border border-amber-500/30 shadow-sm shadow-amber-500/5 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
              } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-amber-400 to-orange-500 rounded-r-full" />
              )}

              <Icon 
                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                  isActive 
                    ? 'text-amber-400 scale-105' 
                    : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'
                }`} 
              />

              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                      item.badge === 'AI' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Model Spec Card (when expanded) */}
      {!isSidebarCollapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Trained Model Engine</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Algorithm:</span>
            <span className="text-slate-200 font-medium">Logistic Reg + SMOTE</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Features:</span>
            <span className="text-slate-200 font-medium">13 Features (4 num, 9 cat)</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Threshold:</span>
            <span className="text-slate-200 font-mono">0.50</span>
          </div>
        </div>
      )}

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs shadow-inner">
              SS
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>

          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">
                suwarti.shubuh@gmail.com
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Analytics Lead &bull; Indosat</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
