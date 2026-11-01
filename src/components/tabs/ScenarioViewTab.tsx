import React from 'react';
import { 
  SlidersHorizontal, 
  ArrowRight, 
  RotateCcw, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Info, 
  Sparkles, 
  Lock,
  CheckCircle2,
  Lightbulb,
  Check
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { FormattedNumberInput } from '../common/FormattedNumberInput';

export const ScenarioViewTab: React.FC = () => {
  const { 
    customerProfile, 
    predictionResult, 
    scenarioProfile, 
    updateScenarioField, 
    scenarioPrediction, 
    isScenarioSimulating, 
    scenarioError, 
    runScenarioSimulation, 
    syncScenarioWithOriginal,
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

  // Guard: Prerequisite check
  if (!predictionResult || !completedModules['customer-value'] || !completedModules['decision-framework']) {
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
            Please complete Decision Framework first
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Scenario View simulator requires establishing the baseline churn prediction, value tier, and decision framework retention strategy before simulating what-if sensitivity.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('decision-framework')}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>Go to Decision Framework</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const originalProb = predictionResult ? predictionResult.churn_probability : null;
  const simulatedProb = scenarioPrediction ? scenarioPrediction.churn_probability : null;
  const probDiff = (originalProb !== null && simulatedProb !== null) ? (simulatedProb - originalProb) : null;

  return (
    <div className="space-y-6">
      {/* Step Completion & Proceed Action Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Step 4: What-If Scenario Simulator
              </h3>
              {scenarioPrediction && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Scenario Analyzed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Run at least one scenario simulation to unlock the Retention Campaign ROI Calculator.
            </p>
          </div>
        </div>

        {scenarioPrediction && (
          <button
            onClick={() => completeModule('scenario-view', true)}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20 shrink-0"
          >
            <span>Proceed to ROI Calculation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Disclaimer / Non-Causal AI Estimate Notice */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <span>What-If Scenario Simulator &bull; Non-Causal AI Sensitivity Analysis</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
              AI-Estimated Scenarios
            </span>
          </div>
          <p className="leading-relaxed">
            Modify subscriber characteristics below and trigger a new Gemini AI assessment to observe how directional shifts influence estimated churn propensity.
            <strong className="text-white"> Important Note:</strong> Scenario changes are AI-generated estimates based on customer attributes and business reasoning; they do not represent statistically proven causal effects.
          </p>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Attribute Sensitivity Testing
            </h4>
            <p className="text-xs text-slate-400">
              Modify contract terms, pricing, or support history to generate a new AI churn estimate.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={syncScenarioWithOriginal}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset to Original Profile
          </button>
          <button
            onClick={runScenarioSimulation}
            disabled={isScenarioSimulating}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-orange-500/20"
          >
            {isScenarioSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Gemini Re-Evaluating Scenario...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>GENERATE SCENARIO ESTIMATE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Error Alert */}
      {scenarioError && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 text-xs">
          {scenarioError}
        </div>
      )}

      {/* Side-by-Side Comparison: Original Profile vs Scenario Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Original Customer Profile */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Baseline Attributes
              </span>
              <h4 className="text-base font-bold text-white">
                Original Customer Profile
              </h4>
            </div>
            {predictionResult ? (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                predictionResult.risk_level === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                predictionResult.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {predictionResult.risk_level} Risk &bull; {(predictionResult.churn_probability * 100).toFixed(1)}%
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                Awaiting original prediction
              </span>
            )}
          </div>

          {/* Key Parameters List */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Tenure</span>
              <div className="text-sm font-bold text-white mt-0.5">{customerProfile.tenureMonths} Months</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Monthly Charges</span>
              <div className="text-sm font-bold text-orange-300 mt-0.5">{formatIDR(Number(customerProfile.monthlyCharges) || 0)}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Contract Type</span>
              <div className="text-sm font-bold text-white mt-0.5">{customerProfile.contractType}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Internet Service</span>
              <div className="text-sm font-bold text-white mt-0.5">{customerProfile.hasInternetService}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Payment Method</span>
              <div className="text-sm font-bold text-white mt-0.5 truncate">{customerProfile.paymentMethod}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Support Interactions</span>
              <div className="text-sm font-bold text-white mt-0.5">{customerProfile.total_support_interactions} ticket(s)</div>
            </div>
          </div>

          {/* Probability Bar */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Original Churn Probability</span>
              <span className="font-mono text-white font-bold">
                {originalProb !== null ? `${(originalProb * 100).toFixed(1)}%` : 'Not evaluated'}
              </span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  predictionResult?.risk_level === 'High' ? 'bg-red-500' :
                  predictionResult?.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${originalProb !== null ? (originalProb * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Scenario Customer Profile */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-orange-400 font-bold">
                Alternative Scenario
              </span>
              <h4 className="text-base font-bold text-white">
                Scenario Customer Profile
              </h4>
            </div>
            {scenarioPrediction ? (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                scenarioPrediction.risk_level === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                scenarioPrediction.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {scenarioPrediction.risk_level} Risk &bull; {(scenarioPrediction.churn_probability * 100).toFixed(1)}%
              </span>
            ) : (
              <span className="text-[11px] text-orange-400 font-mono">
                Click Generate to estimate
              </span>
            )}
          </div>

          {/* Interactive Modifiable Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* 1. Contract Type Modification */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-300">Contract Type Strategy</label>
                <span className="text-[10px] text-orange-400">e.g. Upgrade to 1 or 2 Year</span>
              </div>
              <select
                value={scenarioProfile.contractType}
                onChange={(e) => updateScenarioField('contractType', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white cursor-pointer font-medium"
              >
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">One year</option>
                <option value="Two year">Two year</option>
              </select>
            </div>

            {/* 2. Monthly Charges Modification */}
            <FormattedNumberInput
              label="Monthly Charges (IDR)"
              placeholder="e.g. 445,000"
              prefix="IDR"
              value={scenarioProfile.monthlyCharges}
              onChange={(val) => updateScenarioField('monthlyCharges', val)}
            />

            {/* 3. Support Interactions */}
            <FormattedNumberInput
              label="Support Interactions"
              placeholder="e.g. 2"
              unit="ticket(s)"
              value={scenarioProfile.total_support_interactions}
              onChange={(val) => updateScenarioField('total_support_interactions', val)}
            />

            {/* 4. Tenure Months */}
            <FormattedNumberInput
              label="Tenure Months"
              placeholder="e.g. 14"
              unit="mo"
              value={scenarioProfile.tenureMonths}
              onChange={(val) => updateScenarioField('tenureMonths', val)}
            />

            {/* 5. Payment Method */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Payment Method</label>
              <select
                value={scenarioProfile.paymentMethod}
                onChange={(e) => updateScenarioField('paymentMethod', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white cursor-pointer"
              >
                <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                <option value="Credit card (automatic)">Credit card (automatic)</option>
                <option value="Electronic check">Electronic check</option>
                <option value="Mailed check">Mailed check</option>
              </select>
            </div>
          </div>

          {/* Scenario Probability Bar */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Scenario Churn Probability</span>
              <span className="font-mono text-orange-400 font-bold">
                {simulatedProb !== null ? `${(simulatedProb * 100).toFixed(1)}%` : 'Run scenario to assess'}
              </span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  scenarioPrediction?.risk_level === 'High' ? 'bg-red-500' :
                  scenarioPrediction?.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${simulatedProb !== null ? (simulatedProb * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Probability Difference & Scenario Recommendations */}
      {probDiff !== null && scenarioPrediction && predictionResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Scenario Comparison &amp; AI Recommendations</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {predictionResult.risk_level} &rarr; {scenarioPrediction.risk_level}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Original Churn Prob</div>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {(predictionResult.churn_probability * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{predictionResult.risk_level} Risk</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Scenario Churn Prob</div>
              <div className="text-2xl font-black font-mono text-orange-400 mt-1">
                {(scenarioPrediction.churn_probability * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{scenarioPrediction.risk_level} Risk</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Difference (Percentage Points)</div>
              <div className={`text-2xl font-black font-mono mt-1 flex items-center justify-center gap-1 ${
                probDiff < 0 ? 'text-emerald-400' : probDiff > 0 ? 'text-red-400' : 'text-slate-300'
              }`}>
                {probDiff < 0 ? <TrendingDown className="w-5 h-5" /> : probDiff > 0 ? <TrendingUp className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                {probDiff > 0 ? '+' : ''}{(probDiff * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {probDiff < 0 ? 'Lower estimated churn' : probDiff > 0 ? 'Higher estimated churn' : 'No change'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Updated Risk Level</div>
              <div className="text-sm font-bold text-white mt-2 flex items-center justify-center gap-1.5">
                <span className="text-slate-400">{predictionResult.risk_level}</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                <span className={
                  scenarioPrediction.risk_level === 'High' ? 'text-red-400' :
                  scenarioPrediction.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                }>
                  {scenarioPrediction.risk_level}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {predictionResult.risk_level !== scenarioPrediction.risk_level ? 'Risk level migrated' : 'Remained in bracket'}
              </div>
            </div>
          </div>

          {/* Scenario Recommendations */}
          {scenarioPrediction.retention_recommendations?.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-orange-400" />
                <span>Scenario Recommendations (Gemini AI)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                {scenarioPrediction.retention_recommendations.map((rec, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
