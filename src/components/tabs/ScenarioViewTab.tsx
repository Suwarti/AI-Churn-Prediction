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
  ShieldAlert, 
  Zap, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

interface ScenarioViewTabProps {
  onOpenModelModal: () => void;
}

export const ScenarioViewTab: React.FC<ScenarioViewTabProps> = ({ onOpenModelModal }) => {
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
    apiStatus 
  } = useCustomer();

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const originalProb = predictionResult ? predictionResult.churn_probability : null;
  const simulatedProb = scenarioPrediction ? scenarioPrediction.churn_probability : null;
  const probDiff = (originalProb !== null && simulatedProb !== null) ? (simulatedProb - originalProb) : null;

  return (
    <div className="space-y-6">
      {/* Disclaimer / Model Sensitivity Notice */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-white flex items-center gap-2">
            <span>What-If Scenario Simulator &bull; Model Sensitivity Analysis</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
              Non-Causal Sensitivity
            </span>
          </div>
          <p className="leading-relaxed">
            This module evaluates model sensitivity by altering subscriber features against the trained <code className="text-amber-300 font-mono">churn_logistic_regression_smote.pkl</code> pipeline.
            <strong className="text-slate-100"> Important Notice:</strong> This is a statistical model-based sensitivity simulation, not experimental proof that changing a feature will causally reduce customer churn in practice.
          </p>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Feature Sensitivity Testing
            </h4>
            <p className="text-xs text-slate-400">
              Modify contract, pricing, tenure, and service channels to assess probability shifts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={syncScenarioWithOriginal}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset to Original Profile
          </button>
          <button
            onClick={runScenarioSimulation}
            disabled={isScenarioSimulating}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-amber-500/20"
          >
            {isScenarioSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Model Inference...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>RUN SCENARIO SIMULATION</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Error Alert */}
      {scenarioError && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-white">Scenario Prediction Service Notice</div>
            <p>{scenarioError}</p>
            <button
              onClick={onOpenModelModal}
              className="text-[11px] underline text-amber-300 hover:text-white"
            >
              Open API Configuration &amp; Connection Status
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison: Original Profile vs Scenario Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Original Customer Profile */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Baseline Input
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
              <div className="text-sm font-bold text-amber-300 mt-0.5">{formatIDR(customerProfile.monthlyCharges)}</div>
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

          {/* Probability Progress Bar */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Original Churn Probability</span>
              <span className="font-mono text-white font-bold">
                {originalProb !== null ? `${(originalProb * 100).toFixed(1)}%` : 'Not run'}
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
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0%</span>
              <span>Threshold: 50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Scenario Customer Profile (Interactive Modifications) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400">
                What-If Modification
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
              <span className="text-[11px] text-amber-400 font-mono">
                Click Run to simulate
              </span>
            )}
          </div>

          {/* Interactive Scenario Controls (6 features allowed to modify) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* 1. Tenure Months */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-300">Tenure Months</label>
                <span className="font-mono text-amber-400">{scenarioProfile.tenureMonths} mo</span>
              </div>
              <input
                type="number"
                min={1}
                max={72}
                value={scenarioProfile.tenureMonths}
                onChange={(e) => updateScenarioField('tenureMonths', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
              />
            </div>

            {/* 2. Monthly Charges */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-300">Monthly Charges</label>
                <span className="font-mono text-amber-400">{formatIDR(scenarioProfile.monthlyCharges)}</span>
              </div>
              <input
                type="number"
                min={150000}
                max={1000000}
                step={10000}
                value={scenarioProfile.monthlyCharges}
                onChange={(e) => updateScenarioField('monthlyCharges', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
              />
            </div>

            {/* 3. Contract Type */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Contract Type</label>
              <select
                value={scenarioProfile.contractType}
                onChange={(e) => updateScenarioField('contractType', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white cursor-pointer"
              >
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">One year</option>
                <option value="Two year">Two year</option>
              </select>
            </div>

            {/* 4. Internet Service */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Internet Service</label>
              <select
                value={scenarioProfile.hasInternetService}
                onChange={(e) => updateScenarioField('hasInternetService', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white cursor-pointer"
              >
                <option value="DSL">DSL</option>
                <option value="Fiber optic">Fiber optic</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* 5. Payment Method */}
            <div className="space-y-1 sm:col-span-2">
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

            {/* 6. Total Support Interactions */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-300">Total Support Interactions</label>
                <span className="font-mono text-amber-400">{scenarioProfile.total_support_interactions} ticket(s)</span>
              </div>
              <input
                type="number"
                min={0}
                max={2}
                value={scenarioProfile.total_support_interactions}
                onChange={(e) => updateScenarioField('total_support_interactions', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
              />
            </div>
          </div>

          {/* Scenario Probability Bar */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Simulated Churn Probability</span>
              <span className="font-mono text-amber-400 font-bold">
                {simulatedProb !== null ? `${(simulatedProb * 100).toFixed(1)}%` : 'Run simulation to evaluate'}
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
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0%</span>
              <span>Threshold: 50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Probability Difference & Sensitivity Impact Comparison Card */}
      {probDiff !== null && scenarioPrediction && predictionResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Sensitivity Analysis Comparison</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-medium">
                Live Inference Delta
              </span>
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
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Simulated Churn Prob</div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {(scenarioPrediction.churn_probability * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{scenarioPrediction.risk_level} Risk</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Probability Difference</div>
              <div className={`text-2xl font-black font-mono mt-1 flex items-center justify-center gap-1 ${
                probDiff < 0 ? 'text-emerald-400' : probDiff > 0 ? 'text-red-400' : 'text-slate-300'
              }`}>
                {probDiff < 0 ? <TrendingDown className="w-5 h-5" /> : probDiff > 0 ? <TrendingUp className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                {probDiff > 0 ? '+' : ''}{(probDiff * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {probDiff < 0 ? 'Reduced churn propensity' : probDiff > 0 ? 'Elevated churn propensity' : 'No change'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Risk Classification Shift</div>
              <div className="text-sm font-bold text-white mt-2 flex items-center justify-center gap-1.5">
                <span className="text-slate-400">{predictionResult.risk_level}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span className={
                  scenarioPrediction.risk_level === 'High' ? 'text-red-400' :
                  scenarioPrediction.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                }>
                  {scenarioPrediction.risk_level}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {predictionResult.risk_level !== scenarioPrediction.risk_level ? 'Risk bracket migrated' : 'Remained in same bracket'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
