import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { NavigationTab } from '../../types';

export const MODULE_ORDER: { id: NavigationTab; title: string }[] = [
  { id: 'prediction', title: 'Churn Prediction' },
  { id: 'customer-value', title: 'Customer Value' },
  { id: 'decision-framework', title: 'Decision Framework' },
  { id: 'scenario-view', title: 'Scenario View' },
  { id: 'roi-calculation', title: 'ROI Calculation' },
  { id: 'generate-insight', title: 'Generate Insight' },
];

export interface ModuleNavigationControlsProps {
  currentTab: NavigationTab;
  position: 'top' | 'bottom';
  className?: string;
  isCompletedOverride?: boolean;
}

export const ModuleNavigationControls: React.FC<ModuleNavigationControlsProps> = ({
  currentTab,
  position,
  className = '',
  isCompletedOverride,
}) => {
  const {
    setActiveTab,
    completeModule,
    predictionResult,
    predictionLoading,
    customerValueAiAssessment,
    customerValueAiLoading,
    completedModules,
    finalDecisionAnalysis,
    finalDecisionLoading,
    scenarioRecommendations,
    scenarioRecommendationsLoading,
    automatedRoiAnalysis,
    automatedRoiLoading,
  } = useCustomer();

  const currentIndex = MODULE_ORDER.findIndex(m => m.id === currentTab);
  const currentModule = MODULE_ORDER[currentIndex] || MODULE_ORDER[0];

  const hasPrevious = currentIndex > 0;
  const prevModule = hasPrevious ? MODULE_ORDER[currentIndex - 1] : null;

  const hasNext = currentIndex < MODULE_ORDER.length - 1;
  const nextModule = hasNext ? MODULE_ORDER[currentIndex + 1] : null;

  // Determine if the current module has completed its required analysis
  let isCurrentModuleComplete = false;
  if (typeof isCompletedOverride === 'boolean') {
    isCurrentModuleComplete = isCompletedOverride;
  } else {
    switch (currentTab) {
      case 'prediction':
        isCurrentModuleComplete = !!predictionResult && !predictionLoading;
        break;
      case 'customer-value':
        isCurrentModuleComplete =
          (!!customerValueAiAssessment || completedModules['customer-value']) &&
          !customerValueAiLoading;
        break;
      case 'decision-framework':
        isCurrentModuleComplete =
          (!!finalDecisionAnalysis || completedModules['decision-framework']) &&
          !finalDecisionLoading;
        break;
      case 'scenario-view':
        isCurrentModuleComplete =
          (!!scenarioRecommendations || completedModules['scenario-view']) &&
          !scenarioRecommendationsLoading;
        break;
      case 'roi-calculation':
        isCurrentModuleComplete =
          (!!automatedRoiAnalysis || completedModules['roi-calculation']) &&
          !automatedRoiLoading;
        break;
      case 'generate-insight':
        isCurrentModuleComplete = completedModules['generate-insight'];
        break;
    }
  }

  const handlePrevious = () => {
    if (!prevModule) return;
    setActiveTab(prevModule.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceed = () => {
    if (!hasNext || !nextModule || !isCurrentModuleComplete) return;
    completeModule(currentTab, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      data-testid={`module-nav-${position}-${currentTab}`}
      className={`w-full flex items-center justify-between gap-3 py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm print:hidden ${className}`}
    >
      {/* Previous Button (Hidden on first module) */}
      <div className="flex-1 flex justify-start">
        {hasPrevious && prevModule ? (
          <button
            type="button"
            onClick={handlePrevious}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Previous</span>
            <span className="hidden md:inline text-slate-400 font-normal">
              &bull; {prevModule.title}
            </span>
          </button>
        ) : (
          <div className="w-2" />
        )}
      </div>

      {/* Center indicator: Module context without Step numbers */}
      <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
        <span
          className={`w-2 h-2 rounded-full ${
            isCurrentModuleComplete ? 'bg-emerald-400' : 'bg-orange-400 animate-pulse'
          }`}
        />
        <span className="text-slate-200 font-semibold">{currentModule.title}</span>
      </div>

      {/* Proceed to Next Step Button (Hidden on final module) */}
      <div className="flex-1 flex justify-end">
        {hasNext && nextModule ? (
          <button
            type="button"
            onClick={handleProceed}
            disabled={!isCurrentModuleComplete}
            title={
              !isCurrentModuleComplete
                ? `Please complete required analysis in ${currentModule.title} before proceeding.`
                : `Proceed to ${nextModule.title}`
            }
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isCurrentModuleComplete
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 cursor-pointer shadow-lg shadow-orange-500/20 ring-1 ring-orange-400/40 group'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800/80 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Proceed to Next Step</span>
            <span className="hidden md:inline font-medium opacity-90">
              &bull; {nextModule.title}
            </span>
            <ArrowRight
              className={`w-4 h-4 ${
                isCurrentModuleComplete
                  ? 'group-hover:translate-x-0.5 transition-transform text-slate-950'
                  : 'text-slate-600'
              }`}
            />
          </button>
        ) : (
          <div className="w-2" />
        )}
      </div>
    </div>
  );
};
