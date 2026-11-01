import React, { useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Percent, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  Layers, 
  Award, 
  Info,
  ShieldCheck,
  Target,
  Coins
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { ModuleNavigationControls } from '../common/ModuleNavigationControls';

export const RoiCalculationTab: React.FC = () => {
  const { 
    customerProfile,
    predictionResult,
    customerValueFinancials,
    customerValueSegment,
    finalDecisionAnalysis,
    scenarioRecommendations,
    automatedRoiAnalysis,
    automatedRoiLoading,
    automatedRoiError,
    calculateAutomatedRoi,
    isTabUnlocked,
    completedModules,
    completeModule,
    setActiveTab
  } = useCustomer();

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Automatically calculate ROI when tab is entered and upstream data is available
  useEffect(() => {
    if (
      predictionResult && 
      (completedModules['scenario-view'] || scenarioRecommendations) && 
      !automatedRoiAnalysis && 
      !automatedRoiLoading
    ) {
      calculateAutomatedRoi();
    }
  }, [
    predictionResult, 
    completedModules, 
    scenarioRecommendations, 
    automatedRoiAnalysis, 
    automatedRoiLoading, 
    calculateAutomatedRoi
  ]);

  // Guard 1: Churn Prediction prerequisite
  if (!predictionResult) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto space-y-4 my-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block">
            PREREQUISITE REQUIRED
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Please complete Churn Prediction first.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            This module requires completing Churn Prediction before proceeding.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('prediction')}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>GO TO CHURN PREDICTION →</span>
          </button>
        </div>
      </div>
    );
  }

  // Guard 2: Customer Value prerequisite
  if (!completedModules['customer-value'] && !customerValueFinancials) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto space-y-4 my-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block">
            PREREQUISITE REQUIRED
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Please complete Customer Value first.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            ROI Calculation requires completing Customer Value analysis first.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('customer-value')}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>GO TO CUSTOMER VALUE →</span>
          </button>
        </div>
      </div>
    );
  }

  // Guard 3: Decision Framework prerequisite
  if (!completedModules['decision-framework'] && !finalDecisionAnalysis) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto space-y-4 my-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block">
            PREREQUISITE REQUIRED
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Please complete Decision Framework first.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            ROI Calculation requires completing Decision Framework analysis first.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('decision-framework')}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>GO TO DECISION FRAMEWORK →</span>
          </button>
        </div>
      </div>
    );
  }

  // Guard 4: Scenario View prerequisite
  if (!completedModules['scenario-view'] && !scenarioRecommendations && !isTabUnlocked('roi-calculation')) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto space-y-4 my-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block">
            PREREQUISITE REQUIRED
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Please complete Scenario View first.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The automated ROI Calculation module requires completed retention scenario recommendations before computing campaign economics.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('scenario-view')}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>GO TO SCENARIO VIEW →</span>
          </button>
        </div>
      </div>
    );
  }

  const handleCompleteAndProceed = () => {
    completeModule('roi-calculation', true);
  };

  const recFin = automatedRoiAnalysis?.recommendedFinancials;
  const scenarios = automatedRoiAnalysis?.scenariosFinancials;
  const recScenarioId = automatedRoiAnalysis?.recommendedScenarioId || 'base-case';

  return (
    <div className="space-y-6">
      {/* Top Module Navigation Controls (Previous / Proceed) */}
      <ModuleNavigationControls currentTab="roi-calculation" position="top" />

      {/* Step Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Automated Retention ROI Calculation
              </h3>
              {completedModules['roi-calculation'] && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Evaluates one customer at a time. All financial outcomes are automatically derived from upstream models.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => calculateAutomatedRoi()}
            disabled={automatedRoiLoading}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 disabled:opacity-50"
            title="Refresh Automated ROI Calculation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${automatedRoiLoading ? 'animate-spin text-orange-400' : 'text-slate-400'}`} />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* Upstream Sync Notification Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            Synchronized with <strong className="text-white">Churn Prediction</strong>, <strong className="text-white">Customer Value</strong>, and <strong className="text-white">Scenario View</strong>.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span>Charges: <strong className="text-white">{formatIDR(Number(customerProfile.monthlyCharges) || 0)}/mo</strong></span>
          <span>&bull;</span>
          <span>Risk: <strong className={predictionResult.risk_level === 'High' ? 'text-rose-400' : 'text-emerald-400'}>{predictionResult.risk_level} ({Math.round(predictionResult.churn_probability * 100)}%)</strong></span>
          <span>&bull;</span>
          <span>Segment: <strong className="text-orange-400">{customerValueSegment}</strong></span>
          <span>&bull;</span>
          <span>Strategy: <strong className="text-cyan-400">{finalDecisionAnalysis?.finalDecision || 'Standard Engagement'}</strong></span>
        </div>
      </div>

      {/* Loading State */}
      {automatedRoiLoading && !automatedRoiAnalysis && (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-inner">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 animate-pulse">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">
              Evaluating Financial Retention Economics...
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Analyzing customer lifetime value, scenario success projections, cost allocations, and net financial returns via Gemini AI.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {automatedRoiError && !automatedRoiLoading && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{automatedRoiError}</span>
          </div>
          <button
            onClick={() => calculateAutomatedRoi()}
            className="px-3 py-1 bg-rose-500 text-white rounded font-bold hover:bg-rose-600 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {automatedRoiAnalysis && recFin && (
        <>
          {/* SECTION A: FINANCIAL OVERVIEW (5 Prominent KPI Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-orange-400" />
                  Financial Overview &bull; Recommended Scenario ({automatedRoiAnalysis.recommendedScenarioName})
                </h4>
                <p className="text-[11px] text-slate-400">
                  Core economic indicators for this individual account under the recommended retention strategy
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Single Customer Scope
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Card 1: Estimated Customer Value */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Estimated Customer Value
                  </span>
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-lg xl:text-xl font-bold font-mono text-white tracking-tight">
                    {formatIDR(automatedRoiAnalysis.estimatedCustomerValue)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {automatedRoiAnalysis.expectedRemainingMonths} mo &times; {formatIDR(automatedRoiAnalysis.monthlyCharges)}
                  </div>
                </div>
              </div>

              {/* Card 2: Expected Retained Value */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    Expected Retained Value
                  </span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-lg xl:text-xl font-bold font-mono text-emerald-400 tracking-tight">
                    {formatIDR(recFin.expectedRetainedValue)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {recFin.assumedSuccessRate}% retention success rate
                  </div>
                </div>
              </div>

              {/* Card 3: Estimated Retention Cost */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                    Estimated Retention Cost
                  </span>
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-lg xl:text-xl font-bold font-mono text-amber-400 tracking-tight">
                    {formatIDR(recFin.estimatedRetentionCost)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {recFin.costPercentage}% of customer value
                  </div>
                </div>
              </div>

              {/* Card 4: Expected Net Gain */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                    Expected Net Gain
                  </span>
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className={`text-lg xl:text-xl font-bold font-mono tracking-tight ${recFin.expectedNetGain >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                    {formatIDR(recFin.expectedNetGain)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Retained Value - Retention Cost
                  </div>
                </div>
              </div>

              {/* Card 5: Estimated ROI (%) */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1.5 flex flex-col justify-between ring-1 ring-orange-500/30">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400">
                    Estimated ROI (%)
                  </span>
                  <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                    <Percent className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-xl xl:text-2xl font-black font-mono text-orange-400 tracking-tight">
                    {recFin.estimatedRoiPercentage.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    (Net Gain / Retention Cost) &times; 100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: SCENARIO COMPARISON (Comparative Table & Grid) */}
          {scenarios && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-400" />
                    Automated Retention Scenario Financial Comparison
                  </h4>
                  <p className="text-xs text-slate-400">
                    Side-by-side financial evaluation across Conservative (20%), Base Case (35%), and Optimistic (50%) retention scenarios
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                  <span>Highlighted = Recommended Strategy</span>
                </div>
              </div>

              {/* Grid cards for responsive mobile / quick overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['conservative', 'base-case', 'optimistic'] as const).map((scKey) => {
                  const sc = scenarios[scKey];
                  const isRecommended = recScenarioId === scKey;

                  return (
                    <div
                      key={scKey}
                      className={`p-4 rounded-xl border transition-all space-y-3 relative ${
                        isRecommended
                          ? 'bg-slate-900/90 border-orange-500/60 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isRecommended && (
                        <div className="absolute -top-2.5 right-4 bg-orange-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 font-sans">
                          <Award className="w-2.5 h-2.5" />
                          Recommended
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>{sc.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {sc.assumedSuccessRate}% Success
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Retention Investment: <strong className="text-slate-300">{sc.costPercentage}%</strong> of Customer Value
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Retained Value:</span>
                          <span className="font-bold text-emerald-400">{formatIDR(sc.expectedRetainedValue)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Retention Cost:</span>
                          <span className="text-amber-400">{formatIDR(sc.estimatedRetentionCost)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Expected Net Gain:</span>
                          <span className={`font-bold ${sc.expectedNetGain >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                            {formatIDR(sc.expectedNetGain)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                          <span className="text-slate-300 font-sans font-semibold">Estimated ROI:</span>
                          <span className="text-base font-black text-orange-400">{sc.estimatedRoiPercentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Comparison Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-950/60">
                      <th className="py-3 px-4">Scenario</th>
                      <th className="py-3 px-4">Success Rate</th>
                      <th className="py-3 px-4">Cost Allocation</th>
                      <th className="py-3 px-4">Retention Cost (IDR)</th>
                      <th className="py-3 px-4">Retained Value (IDR)</th>
                      <th className="py-3 px-4">Net Gain (IDR)</th>
                      <th className="py-3 px-4">Estimated ROI</th>
                      <th className="py-3 px-4">Strategy Alignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {(['conservative', 'base-case', 'optimistic'] as const).map((scKey) => {
                      const sc = scenarios[scKey];
                      const isRecommended = recScenarioId === scKey;

                      return (
                        <tr
                          key={scKey}
                          className={`transition-colors ${
                            isRecommended
                              ? 'bg-orange-500/10 font-bold border-l-2 border-orange-500'
                              : 'hover:bg-slate-800/30'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-sans text-white flex items-center gap-2">
                            <span>{sc.name}</span>
                            {isRecommended && (
                              <span className="text-[9px] bg-orange-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                                RECOMMENDED
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {sc.assumedSuccessRate}%
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {sc.costPercentage}% of Value
                          </td>
                          <td className="py-3.5 px-4 text-amber-400">
                            {formatIDR(sc.estimatedRetentionCost)}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">
                            {formatIDR(sc.expectedRetainedValue)}
                          </td>
                          <td className={`py-3.5 px-4 ${sc.expectedNetGain >= 0 ? 'text-cyan-400 font-bold' : 'text-rose-400'}`}>
                            {formatIDR(sc.expectedNetGain)}
                          </td>
                          <td className="py-3.5 px-4 text-orange-400 font-black text-sm">
                            {sc.estimatedRoiPercentage.toFixed(1)}%
                          </td>
                          <td className="py-3.5 px-4 font-sans">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              isRecommended
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {isRecommended ? 'Selected Primary' : 'Reference Model'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION C: RECOMMENDED RETENTION INVESTMENT */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Recommended Retention Investment &amp; Resource Allocation
                  </h4>
                  <p className="text-xs text-slate-400">
                    Selected by Scenario View based on strategic customer classification
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                  {automatedRoiAnalysis.recommendedScenarioName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Target Retention Expenditure
                </span>
                <div className="text-xl font-bold font-mono text-amber-400">
                  {formatIDR(recFin.estimatedRetentionCost)}
                </div>
                <p className="text-[11px] text-slate-400">
                  Maximum recommended intervention budget for this subscriber ({recFin.costPercentage}% of estimated lifetime value).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Projected Gross Value Retained
                </span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {formatIDR(recFin.expectedRetainedValue)}
                </div>
                <p className="text-[11px] text-slate-400">
                  Expected recurring subscription revenue saved with {recFin.assumedSuccessRate}% retention probability.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Expected Return Per Rupiah Spent
                </span>
                <div className="text-xl font-bold font-mono text-orange-400">
                  {formatIDR(recFin.estimatedRetentionCost > 0 ? (recFin.expectedRetainedValue / recFin.estimatedRetentionCost) * 1000 : 0)}
                </div>
                <p className="text-[11px] text-slate-400">
                  Gross revenue recovered for every <strong className="text-slate-300">Rp 1.000</strong> invested in customer retention.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION D: AI BUSINESS INTERPRETATION & RATIONALE */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <h4 className="text-sm font-bold text-white">
                  Executive Business Interpretation &amp; Financial Rationale
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Gemini 3.8 Flash Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Financial Feasibility Assessment</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {automatedRoiAnalysis.businessInterpretation}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Strategic Investment Rationale</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {automatedRoiAnalysis.financialRationale}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION E: TRANSPARENCY NOTICE & PLANNING DISCLAIMER */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-2">
                <span>Methodology &amp; Planning Assumptions Notice</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Illustrative Framework
                </span>
              </div>
              <p className="leading-relaxed">
                All financial estimates, success probabilities (20% Conservative, 35% Base Case, 50% Optimistic), and retention cost allocations (5%, 10%, 15%) are standard telecommunications business planning assumptions designed for decision modeling. They represent expected statistical returns rather than guaranteed contract revenue. Individual customer renewal decisions depend on agent execution quality and competitor pricing dynamics.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Bottom Module Navigation Controls (Previous / Proceed) */}
      <ModuleNavigationControls currentTab="roi-calculation" position="bottom" />
    </div>
  );
};
