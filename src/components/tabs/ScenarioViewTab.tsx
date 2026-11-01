import React, { useEffect, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  Zap, 
  AlertTriangle, 
  DollarSign, 
  Calendar, 
  Info,
  CheckCircle,
  Star,
  Target,
  ArrowUpRight,
  BookmarkCheck,
  Check
} from 'lucide-react';
import { useCustomer, calculateCustomerValueFinancials, determineFinalDecision } from '../../context/CustomerContext';
import { RetentionScenarioItem } from '../../types';
import { ModuleNavigationControls } from '../common/ModuleNavigationControls';

export const ScenarioViewTab: React.FC = () => {
  const { 
    customerProfile, 
    predictionResult, 
    customerValueFinancials,
    customerValueAiAssessment,
    customerValueSegment,
    finalDecisionAnalysis,
    scenarioRecommendations,
    scenarioRecommendationsLoading,
    scenarioRecommendationsError,
    generateScenarioRecommendations,
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
  if (!completedModules['customer-value'] && !customerValueAiAssessment) {
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
            Scenario View requires completing Customer Value analysis first.
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
            The Decision Framework must establish the customer&apos;s overarching strategic decision before generating tailored retention scenarios.
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

  // Calculate upstream values
  const churnRiskCat: 'High' | 'Low' = 
    (predictionResult.risk_level === 'High' || predictionResult.churn_probability >= 0.50) ? 'High' : 'Low';
  
  const valueCat: 'High' | 'Low' = 
    (customerValueSegment === 'High Value' || (customerValueFinancials?.estimatedCustomerValue ?? 0) >= 10000000) ? 'High' : 'Low';

  const finalDecision = finalDecisionAnalysis?.finalDecision || determineFinalDecision(churnRiskCat, valueCat);
  const financials = customerValueFinancials || calculateCustomerValueFinancials(customerProfile);

  // Automatic scenario recommendations generation hook
  useEffect(() => {
    if (
      predictionResult &&
      !scenarioRecommendations &&
      !scenarioRecommendationsLoading &&
      !scenarioRecommendationsError
    ) {
      generateScenarioRecommendations();
    }
  }, [predictionResult, scenarioRecommendations, scenarioRecommendationsLoading, scenarioRecommendationsError]);

  const handleCompleteAndProceed = () => {
    completeModule('scenario-view', true);
  };

  // Default fallback scenarios if loading or during transition
  const displayScenarios: RetentionScenarioItem[] = useMemo(() => {
    if (scenarioRecommendations?.scenarios && scenarioRecommendations.scenarios.length === 3) {
      return scenarioRecommendations.scenarios;
    }
    return [
      {
        id: 'conservative',
        name: 'Conservative Scenario',
        interventionLevel: 'Low-Cost Digital Intervention',
        assumedSuccessRate: 20,
        assumedSuccessRateLabel: '20% (Assumed Retention Success Rate)',
        recommendedActions: [
          'Automated multi-channel push and SMS alerts highlighting current plan benefits.',
          'Targeted digital self-service contract renewal voucher (Rp 50,000 app credit).',
          'Streamlined 1-click in-app contract extension workflow with zero administrative friction.'
        ],
        expectedBusinessImpact: 'Maintains low marginal retention cost with an estimated 20% assumed renewal rate, preserving operational margins.',
        rationale: 'Establishes a cost-effective, automated safety net without deploying costly frontline personnel or substantial rate discounts.'
      },
      {
        id: 'base-case',
        name: 'Base Case Scenario',
        interventionLevel: 'Moderate Targeted Campaign',
        assumedSuccessRate: 35,
        assumedSuccessRateLabel: '35% (Assumed Retention Success Rate)',
        recommendedActions: [
          `Proactive customer care outreach offering a tailored 10% rate discount on a 12-month commitment.`,
          'Complimentary 3-month high-speed data tier upgrade to elevate perceived network utility.',
          'Dedicated onboarding re-engagement sequence addressing unresolved support feedback.'
        ],
        expectedBusinessImpact: 'Delivers a balanced trade-off between intervention expense and subscriber retention with an assumed 35% success probability.',
        rationale: 'Provides the standard enterprise planning benchmark, combining personalized human touch with moderate value incentives.'
      },
      {
        id: 'optimistic',
        name: 'Optimistic Scenario',
        interventionLevel: 'High-Touch Executive VIP Engagement',
        assumedSuccessRate: 50,
        assumedSuccessRateLabel: '50% (Assumed Retention Success Rate)',
        recommendedActions: [
          'Direct phone consultation by a Senior Customer Success Specialist with customized renewal terms.',
          'Full VIP loyalty bundle: 15% discount for 12 months, hardware router upgrade, and streaming package perk.',
          'Priority SLA guarantee with direct routing to senior technical tier for all future interactions.'
        ],
        expectedBusinessImpact: 'Maximizes customer retention probability (assumed 50% success) and protects high-value recurring revenue, justifying elevated intervention costs.',
        rationale: 'Aggressive retention investment designed to eliminate churn vulnerability for high-contribution accounts where defection creates severe financial impact.'
      }
    ];
  }, [scenarioRecommendations]);

  const recommendedId = scenarioRecommendations?.recommendedScenarioId || 'base-case';
  const recommendedName = scenarioRecommendations?.recommendedScenarioName || 'Base Case Scenario';
  const recommendationExplanation = scenarioRecommendations?.recommendationExplanation || 
    `Based on the customer's churn risk (${churnRiskCat}) and customer value tier (${valueCat}), the recommended scenario provides the most balanced economic trade-off, directly aligned with the ${finalDecision} decision.`;

  return (
    <div className="space-y-6">
      {/* Top Module Navigation Controls (Previous / Proceed) */}
      <ModuleNavigationControls currentTab="scenario-view" position="top" />

      {/* Step Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Automated Retention Strategy Scenarios
              </h3>
              <span className="text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                AI Generated
              </span>
              {completedModules['scenario-view'] && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Three comparative retention scenarios modeled automatically from Churn Prediction, Customer Value, and Decision Framework.
            </p>
          </div>
        </div>
      </div>

      {/* Upstream Synthesis Snapshot (Read-Only) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-orange-400" />
            Synthesized Upstream Context
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Read-Only &bull; No Manual Inputs Required
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
            <span className="text-slate-400">Churn Risk:</span>
            <strong className={churnRiskCat === 'High' ? 'text-red-400' : 'text-emerald-400'}>
              {churnRiskCat} ({(predictionResult.churn_probability * 100).toFixed(1)}%)
            </strong>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
            <span className="text-slate-400">Customer Value:</span>
            <strong className={valueCat === 'High' ? 'text-emerald-400' : 'text-slate-200'}>
              {valueCat} ({formatIDR(financials.estimatedCustomerValue)})
            </strong>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
            <span className="text-slate-400">Decision Framework:</span>
            <strong className="text-orange-400">
              {finalDecision}
            </strong>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
            <span className="text-slate-400">Monthly Billing:</span>
            <strong className="text-white">
              {formatIDR(financials.monthlyCharges)} ({customerProfile.contractType || 'contract'})
            </strong>
          </div>
        </div>
      </div>

      {/* Assumptions Labeling Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <span>Illustrative Scenario Planning Framework</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
              Planning Assumptions
            </span>
          </div>
          <p className="leading-relaxed text-slate-400">
            The reference values below (20%, 35%, and 50%) are clearly designated as <strong className="text-white">&ldquo;Assumed Retention Success Rates&rdquo;</strong> for business scenario planning and sensitivity modeling. They represent structured planning assumptions rather than empirical statistical certainty.
          </p>
        </div>
      </div>

      {/* Loading state during AI generation */}
      {scenarioRecommendationsLoading && (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <RefreshCw className="w-7 h-7 text-orange-400 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-white">
            Gemini AI is generating tailored retention scenarios...
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Structuring Conservative, Base Case, and Optimistic retention playbooks customized to the customer&apos;s risk drivers and decision framework directive.
          </p>
        </div>
      )}

      {/* 6. Three Scenario Recommendation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {displayScenarios.map((scenario) => {
          const isBaseCase = scenario.id === 'base-case';
          const isRecommended = scenario.id === recommendedId;

          return (
            <div
              key={scenario.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                isBaseCase
                  ? 'bg-slate-900 border-amber-500/50 ring-1 ring-amber-500/30 shadow-lg shadow-amber-950/20'
                  : scenario.id === 'optimistic'
                  ? 'bg-slate-900 border-emerald-500/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Top Banner Tag for Base Case (Primary Planning Scenario) */}
              {isBaseCase && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 text-[9px] font-black uppercase px-3 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  Primary Planning Scenario
                </div>
              )}

              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Scenario Tier
                    </span>
                    {isRecommended && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        Selected Best Fit
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-white tracking-tight">
                    {scenario.name}
                  </h4>
                  <div className="text-xs font-semibold text-orange-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{scenario.interventionLevel}</span>
                  </div>
                </div>

                {/* Assumed Retention Success Rate KPI Banner */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-between">
                    <span>Planning Metric:</span>
                    <span className="text-slate-500 font-sans italic text-[9px]">Illustrative Assumption</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-black font-mono text-white">
                      {scenario.assumedSuccessRate}%
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-medium">
                      Assumed Retention Success Rate
                    </span>
                  </div>
                </div>

                {/* Recommended Retention Actions */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Recommended Retention Actions
                  </span>
                  <div className="space-y-2">
                    {scenario.recommendedActions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Business Impact */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                    Expected Business Impact:
                  </span>
                  <p className="text-xs text-slate-300 leading-snug">
                    {scenario.expectedBusinessImpact}
                  </p>
                </div>

                {/* Rationale behind scenario */}
                <div className="text-[11px] text-slate-400 italic leading-relaxed pt-1 border-t border-slate-800/80">
                  <strong className="text-slate-300 font-semibold not-italic">Scenario Rationale:</strong> {scenario.rationale}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7. Highlighted Section: Recommended Retention Scenario */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-orange-950/20 to-slate-900 border border-orange-500/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-black shadow-inner shrink-0">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                Strategic Recommendation Selection
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Recommended Retention Scenario:</span>
                <span className="text-orange-400">{recommendedName}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
              Aligned with: <strong className="text-white">{finalDecision}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Why This Scenario Is Most Suitable For This Customer
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            {recommendationExplanation}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Intervention Level:</span>
            <strong className="text-white font-mono">
              {displayScenarios.find(s => s.id === recommendedId)?.interventionLevel || 'Tailored'}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Assumed Success Rate:</span>
            <strong className="text-orange-400 font-mono">
              {displayScenarios.find(s => s.id === recommendedId)?.assumedSuccessRate}%
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Economic Protection:</span>
            <strong className="text-emerald-400 font-mono">
              {formatIDR(financials.estimatedCustomerValue)}
            </strong>
          </div>
        </div>
      </div>

      {/* Bottom Module Navigation Controls (Previous / Proceed) */}
      <ModuleNavigationControls currentTab="scenario-view" position="bottom" />
    </div>
  );
};
