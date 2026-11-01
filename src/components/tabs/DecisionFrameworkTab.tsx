import React, { useEffect, useMemo } from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Award, 
  Zap, 
  Users, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Layers, 
  FileText,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { useCustomer, determineFinalDecision, calculateCustomerValueFinancials } from '../../context/CustomerContext';
import { FinalDecisionLabel } from '../../types';
import { ModuleNavigationControls } from '../common/ModuleNavigationControls';

export const DecisionFrameworkTab: React.FC = () => {
  const { 
    customerProfile,
    predictionResult, 
    customerValueFinancials,
    customerValueAiAssessment,
    customerValueSegment,
    finalDecisionAnalysis,
    finalDecisionLoading,
    finalDecisionError,
    generateFinalDecision,
    completeModule,
    completedModules,
    setActiveTab
  } = useCustomer();

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Guard 1: Churn Prediction prerequisite
  if (!predictionResult) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto space-y-4 my-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            Prerequisite Required
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Please complete Churn Prediction first
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Decision Framework requires Churn Prediction results to determine the customer&apos;s risk level.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('prediction')}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>Go to Churn Prediction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Guard 2: Customer Value prerequisite
  if (!completedModules['customer-value'] && !customerValueAiAssessment) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto space-y-4 my-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            Prerequisite Required
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Please complete Customer Value analysis first
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Customer Value analysis must be completed to evaluate the customer&apos;s economic contribution before generating the final decision.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('customer-value')}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>Go to Customer Value</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Calculate upstream values deterministically
  const churnRiskCategory: 'High' | 'Low' = 
    (predictionResult.risk_level === 'High' || predictionResult.churn_probability >= 0.50) ? 'High' : 'Low';
  
  const valueCategory: 'High' | 'Low' = 
    (customerValueSegment === 'High Value' || (customerValueFinancials?.estimatedCustomerValue ?? 0) >= 10000000) ? 'High' : 'Low';

  const exactFinalDecision: FinalDecisionLabel = determineFinalDecision(churnRiskCategory, valueCategory);

  const financials = customerValueFinancials || calculateCustomerValueFinancials(customerProfile);

  // Automatic generation hook
  useEffect(() => {
    if (predictionResult && !finalDecisionAnalysis && !finalDecisionLoading && !finalDecisionError) {
      generateFinalDecision();
    }
  }, [predictionResult, finalDecisionAnalysis, finalDecisionLoading, finalDecisionError]);

  const handleCompleteAndProceed = () => {
    completeModule('decision-framework', true);
  };

  // Matrix cells for the visual overview indicator
  const matrixCells: Array<{
    risk: 'High' | 'Low';
    value: 'High' | 'Low';
    decision: FinalDecisionLabel;
    description: string;
  }> = [
    {
      risk: 'High',
      value: 'High',
      decision: 'Priority Retention',
      description: 'Personalized retention offers, loyalty incentives, and proactive customer engagement.',
    },
    {
      risk: 'High',
      value: 'Low',
      decision: 'Cost-Efficient Retention',
      description: 'Low-cost retention campaigns, automated engagement, and targeted promotions.',
    },
    {
      risk: 'Low',
      value: 'High',
      decision: 'Loyalty Enhancement',
      description: 'Loyalty benefits, premium customer experience, and long-term relationship development.',
    },
    {
      risk: 'Low',
      value: 'Low',
      decision: 'Standard Engagement',
      description: 'Cost-efficient standard engagement and regular communication.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Module Navigation Controls (Previous / Proceed) */}
      <ModuleNavigationControls currentTab="decision-framework" position="top" />

      {/* Step Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Strategic Decision Framework
              </h3>
              <span className="text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Target className="w-2.5 h-2.5" />
                ONE Final Decision
              </span>
              {completedModules['decision-framework'] && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Synthesizing Churn Risk and Customer Value into exactly ONE conclusive retention strategy.
            </p>
          </div>
        </div>
      </div>

      {/* 5A. Customer Assessment Summary (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. Churn Risk */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Churn Risk
            </span>
            <div className={`p-2 rounded-xl ${
              churnRiskCategory === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {churnRiskCategory === 'High' ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
          </div>
          <div className={`text-2xl font-black tracking-tight ${
            churnRiskCategory === 'High' ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {churnRiskCategory} Risk
          </div>
          <div className="text-[11px] text-slate-400">
            Assigned from Churn Prediction
          </div>
        </div>

        {/* 2. Customer Value Segment */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Customer Value Segment
            </span>
            <div className={`p-2 rounded-xl ${
              valueCategory === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/30 text-slate-300'
            }`}>
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black tracking-tight ${
            valueCategory === 'High' ? 'text-emerald-400' : 'text-slate-200'
          }`}>
            {valueCategory} Value
          </div>
          <div className="text-[11px] text-slate-400">
            Tier: {customerValueSegment}
          </div>
        </div>

        {/* 3. Churn Probability */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Churn Probability
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {(predictionResult.churn_probability * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400">
            Calculated AI estimate
          </div>
        </div>

        {/* 4. Estimated Customer Value */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Estimated Customer Value
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
            {formatIDR(financials.estimatedCustomerValue)}
          </div>
          <div className="text-[11px] text-slate-400">
            {financials.expectedRemainingMonths} mo expected horizon
          </div>
        </div>
      </div>

      {/* Decision Matrix Mapping Reference - Exactly ONE Active Cell Highlighted */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              Strategic Decision Matrix Mapping
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Combines Churn Risk ({churnRiskCategory}) and Customer Value ({valueCategory}) to produce exactly ONE final decision.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            Rule-Authoritative &bull; 4 Quadrants
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {matrixCells.map((cell) => {
            const isSelected = cell.decision === exactFinalDecision;
            return (
              <div
                key={cell.decision}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-950 border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/10 relative overflow-hidden'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-40'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Selected Decision
                  </div>
                )}

                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {cell.risk} Risk &times; {cell.value} Value
                </div>
                <div className={`text-sm font-bold mt-1 ${
                  isSelected ? 'text-white font-extrabold' : 'text-slate-400'
                }`}>
                  {cell.decision}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {cell.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading state during AI interpretation */}
      {finalDecisionLoading && (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <RefreshCw className="w-7 h-7 text-orange-400 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-white">
            Gemini AI is analyzing final strategic decision...
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Generating executive business interpretation, strategic rationale, and tailored retention recommendations for {exactFinalDecision}.
          </p>
        </div>
      )}

      {/* 5B. ONE Final Strategic Decision Hero Card */}
      {finalDecisionAnalysis && (
        <div className={`p-6 rounded-2xl border shadow-xl space-y-6 ${
          exactFinalDecision === 'Priority Retention'
            ? 'bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 border-red-500/40 shadow-red-950/30'
            : exactFinalDecision === 'Cost-Efficient Retention'
            ? 'bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/40 shadow-amber-950/30'
            : exactFinalDecision === 'Loyalty Enhancement'
            ? 'bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-500/40 shadow-emerald-950/30'
            : 'bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 border-blue-500/40 shadow-blue-950/30'
        }`}>
          {/* Hero Decision Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-inner shrink-0 ${
                exactFinalDecision === 'Priority Retention'
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                  : exactFinalDecision === 'Cost-Efficient Retention'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                  : exactFinalDecision === 'Loyalty Enhancement'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
              }`}>
                {exactFinalDecision === 'Priority Retention' ? (
                  <ShieldAlert className="w-8 h-8" />
                ) : exactFinalDecision === 'Cost-Efficient Retention' ? (
                  <Zap className="w-8 h-8" />
                ) : exactFinalDecision === 'Loyalty Enhancement' ? (
                  <Award className="w-8 h-8" />
                ) : (
                  <ShieldCheck className="w-8 h-8" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Final Strategic Customer Decision
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold uppercase">
                    Authoritative Output
                  </span>
                </div>
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  exactFinalDecision === 'Priority Retention'
                    ? 'text-red-400'
                    : exactFinalDecision === 'Cost-Efficient Retention'
                    ? 'text-amber-400'
                    : exactFinalDecision === 'Loyalty Enhancement'
                    ? 'text-emerald-400'
                    : 'text-blue-400'
                }`}>
                  {exactFinalDecision}
                </h2>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  Assigned from: <strong className="text-white">{churnRiskCategory} Churn Risk</strong> &amp; <strong className="text-white">{valueCategory} Customer Value</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-[11px] font-mono text-slate-400">
                Engine: <strong className="text-white">{finalDecisionAnalysis.engine || 'Gemini 3.8 Flash'}</strong>
              </span>
              {finalDecisionAnalysis.cachedAt && (
                <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  Cached: {finalDecisionAnalysis.cachedAt}
                </span>
              )}
            </div>
          </div>

          {/* Primary Strategy Objective Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
            <Target className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-bold">
                Primary Strategic Retention Objective
              </span>
              <p className="text-sm font-bold text-white leading-snug">
                {finalDecisionAnalysis.primaryRetentionStrategy}
              </p>
            </div>
          </div>

          {/* AI Business Interpretation & Strategic Rationale */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>AI Business Interpretation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {finalDecisionAnalysis.businessInterpretation}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Business Rationale</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {finalDecisionAnalysis.businessRationale}
              </p>
            </div>
          </div>

          {/* Supporting Recommended Actions */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                Supporting Recommended Actions
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Tailored to {customerProfile.contractType || 'contract'} &bull; {customerProfile.hasInternetService || 'Internet'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {finalDecisionAnalysis.recommendedActions.map((action, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-orange-400 uppercase">
                      Action 0{idx + 1}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Module Navigation Controls (Previous / Proceed) */}
      <ModuleNavigationControls currentTab="decision-framework" position="bottom" />
    </div>
  );
};
