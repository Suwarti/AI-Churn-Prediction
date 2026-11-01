import React, { useState } from 'react';
import { 
  GitBranch, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Edit3, 
  Save, 
  RotateCcw, 
  AlertCircle, 
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { DecisionQuadrantConfig } from '../../types';

export const DecisionFrameworkTab: React.FC = () => {
  const { 
    predictionResult, 
    estimatedHistoricalRevenue, 
    decisionThresholds, 
    updateDecisionThresholds,
    quadrantConfigs, 
    updateQuadrantConfig,
    activeQuadrantId,
    setActiveTab
  } = useCustomer();

  const [selectedQuadrantId, setSelectedQuadrantId] = useState<string>(activeQuadrantId);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    title: string;
    recommendedAction: string;
    priorityLevel: DecisionQuadrantConfig['priorityLevel'];
    businessExplanation: string;
    tacticsStr: string;
  }>({
    title: '',
    recommendedAction: '',
    priorityLevel: 'Immediate (P0)',
    businessExplanation: '',
    tacticsStr: '',
  });

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSelectQuadrant = (id: string) => {
    setSelectedQuadrantId(id);
    setIsEditing(false);
  };

  const startEditing = () => {
    const config = quadrantConfigs[selectedQuadrantId];
    setEditForm({
      title: config.title,
      recommendedAction: config.recommendedAction,
      priorityLevel: config.priorityLevel,
      businessExplanation: config.businessExplanation,
      tacticsStr: config.tactics.join('\n'),
    });
    setIsEditing(true);
  };

  const saveEdits = () => {
    const tactics = editForm.tacticsStr
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    updateQuadrantConfig(selectedQuadrantId, {
      title: editForm.title,
      recommendedAction: editForm.recommendedAction,
      priorityLevel: editForm.priorityLevel,
      businessExplanation: editForm.businessExplanation,
      tactics,
    });
    setIsEditing(false);
  };

  const activeConfig = quadrantConfigs[selectedQuadrantId];

  // Current customer placement coordinates
  const customerProb = predictionResult?.churn_probability ?? 0.50;
  const isHighRisk = customerProb >= decisionThresholds.riskThreshold;
  const isHighValue = estimatedHistoricalRevenue >= decisionThresholds.valueThreshold;

  return (
    <div className="space-y-6">
      {/* Informative Header / Concept Distinction Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3.5">
        <GitBranch className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-white flex items-center gap-2">
            <span>Customer Retention Strategic Decision Framework</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              Business Rules vs ML Predictions
            </span>
          </div>
          <p className="leading-relaxed">
            This framework bridges <strong className="text-amber-300">Machine Learning prediction</strong> (churn probability output by Logistic Regression + SMOTE) with <strong className="text-amber-300">strategic business rules</strong> (economic value tiers and intervention policies). Business analysts can tune risk thresholds, value cuts, and operational playbooks below.
          </p>
        </div>
      </div>

      {/* Threshold Sliders Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Interactive Decision Matrix Thresholds</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Drag sliders to re-segment customers across matrix boundaries
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Risk Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Churn Risk Decision Boundary (Probability Threshold)
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {(decisionThresholds.riskThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={decisionThresholds.riskThreshold}
              onChange={(e) => updateDecisionThresholds({ riskThreshold: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Low Risk (&lt; {(decisionThresholds.riskThreshold * 100).toFixed(0)}%)</span>
              <span>High Risk (&ge; {(decisionThresholds.riskThreshold * 100).toFixed(0)}%)</span>
            </div>
          </div>

          {/* Value Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Customer Value Boundary (Estimated Revenue Threshold)
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {formatIDR(decisionThresholds.valueThreshold)}
              </span>
            </div>
            <input
              type="range"
              min="2000000"
              max="25000000"
              step="1000000"
              value={decisionThresholds.valueThreshold}
              onChange={(e) => updateDecisionThresholds({ valueThreshold: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Low Value (&lt; {formatIDR(decisionThresholds.valueThreshold)})</span>
              <span>High Value (&ge; {formatIDR(decisionThresholds.valueThreshold)})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: 2x2 Interactive Decision Matrix & Strategy Playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2x2 Matrix Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>2×2 Customer Retention Decision Matrix</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Click a quadrant to inspect playbook</span>
          </div>

          {/* 2x2 Grid Container */}
          <div className="relative p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            {/* Axis Labels */}
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4">
              <span>Low Churn Risk</span>
              <span className="text-amber-400 font-mono">&larr; RISK AXIS &rarr;</span>
              <span>High Churn Risk (&ge;{(decisionThresholds.riskThreshold * 100).toFixed(0)}%)</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 min-h-[360px]">
              {/* TOP-LEFT: Low Risk + High Value -> Loyalty Program */}
              <div
                onClick={() => handleSelectQuadrant('low-risk-high-value')}
                className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  selectedQuadrantId === 'low-risk-high-value'
                    ? 'bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-blue-500/20 text-blue-300">
                      Low Risk &bull; High Value
                    </span>
                    <span className="text-[10px] text-slate-400">P2</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">
                    {quadrantConfigs['low-risk-high-value'].title}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {quadrantConfigs['low-risk-high-value'].recommendedAction}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-blue-400 font-medium">VIP Tier Retention</span>
                  {activeQuadrantId === 'low-risk-high-value' && (
                    <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded text-[9px]">
                      ACTIVE CUSTOMER
                    </span>
                  )}
                </div>
              </div>

              {/* TOP-RIGHT: High Risk + High Value -> Priority Retention */}
              <div
                onClick={() => handleSelectQuadrant('high-risk-high-value')}
                className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  selectedQuadrantId === 'high-risk-high-value'
                    ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/20 shadow-lg shadow-red-950/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-red-500/20 text-red-300">
                      High Risk &bull; High Value
                    </span>
                    <span className="text-[10px] text-red-400 font-bold">P0 Immediate</span>
                  </div>
                  <h5 className="text-sm font-bold text-red-300">
                    {quadrantConfigs['high-risk-high-value'].title}
                  </h5>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    {quadrantConfigs['high-risk-high-value'].recommendedAction}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-red-400 font-medium">Personalized High-Touch</span>
                  {activeQuadrantId === 'high-risk-high-value' && (
                    <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded text-[9px] animate-pulse">
                      ACTIVE CUSTOMER
                    </span>
                  )}
                </div>
              </div>

              {/* BOTTOM-LEFT: Low Risk + Low Value -> Standard Engagement */}
              <div
                onClick={() => handleSelectQuadrant('low-risk-low-value')}
                className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  selectedQuadrantId === 'low-risk-low-value'
                    ? 'bg-slate-900 border-slate-500 ring-2 ring-slate-500/20 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-slate-800 text-slate-300">
                      Low Risk &bull; Low Value
                    </span>
                    <span className="text-[10px] text-slate-500">P3</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">
                    {quadrantConfigs['low-risk-low-value'].title}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {quadrantConfigs['low-risk-low-value'].recommendedAction}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Automated Efficiency</span>
                  {activeQuadrantId === 'low-risk-low-value' && (
                    <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded text-[9px]">
                      ACTIVE CUSTOMER
                    </span>
                  )}
                </div>
              </div>

              {/* BOTTOM-RIGHT: High Risk + Low Value -> Cost-Efficient Retention */}
              <div
                onClick={() => handleSelectQuadrant('high-risk-low-value')}
                className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  selectedQuadrantId === 'high-risk-low-value'
                    ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-amber-500/20 text-amber-300">
                      High Risk &bull; Low Value
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold">P1 High</span>
                  </div>
                  <h5 className="text-sm font-bold text-amber-300">
                    {quadrantConfigs['high-risk-low-value'].title}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {quadrantConfigs['high-risk-low-value'].recommendedAction}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-amber-400 font-medium">Digital &amp; Automated</span>
                  {activeQuadrantId === 'high-risk-low-value' && (
                    <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded text-[9px]">
                      ACTIVE CUSTOMER
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Value Axis Label */}
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 pt-1">
              <span>Low Cumulative Value</span>
              <span className="text-amber-400 font-mono">&uarr; VALUE AXIS (&ge;{formatIDR(decisionThresholds.valueThreshold)}) &darr;</span>
              <span>High Cumulative Value</span>
            </div>
          </div>

          {/* Active Customer Positioning Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-semibold text-white flex items-center gap-2">
                <span>Active Customer Positioning:</span>
                <span className="text-amber-400 font-bold font-mono">
                  {quadrantConfigs[activeQuadrantId]?.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Model Churn Probability: <strong className="text-white">{(customerProb * 100).toFixed(1)}%</strong> &bull; Estimated Revenue: <strong className="text-white">{formatIDR(estimatedHistoricalRevenue)}</strong>
              </p>
            </div>
            <button
              onClick={() => setSelectedQuadrantId(activeQuadrantId)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 self-start sm:self-center transition-colors"
            >
              Focus Customer Quadrant
            </button>
          </div>
        </div>

        {/* Right: Strategy Playbook & Customization Drawer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Strategy Playbook
                </span>
                <h4 className="text-base font-bold text-white">
                  {activeConfig.title}
                </h4>
              </div>
              <button
                onClick={() => (isEditing ? saveEdits() : startEditing())}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save Playbook</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Strategy</span>
                  </>
                )}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Quadrant Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Priority Level</label>
                  <select
                    value={editForm.priorityLevel}
                    onChange={(e) => setEditForm(prev => ({ ...prev, priorityLevel: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="Immediate (P0)">Immediate (P0)</option>
                    <option value="High (P1)">High (P1)</option>
                    <option value="Medium (P2)">Medium (P2)</option>
                    <option value="Standard (P3)">Standard (P3)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Recommended Action Summary</label>
                  <textarea
                    rows={3}
                    value={editForm.recommendedAction}
                    onChange={(e) => setEditForm(prev => ({ ...prev, recommendedAction: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Strategic Business Rationale</label>
                  <textarea
                    rows={3}
                    value={editForm.businessExplanation}
                    onChange={(e) => setEditForm(prev => ({ ...prev, businessExplanation: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Operational Tactics (one per line)</label>
                  <textarea
                    rows={4}
                    value={editForm.tacticsStr}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tacticsStr: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Priority Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Intervention Priority:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                    activeConfig.priorityLevel.includes('P0') ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                    activeConfig.priorityLevel.includes('P1') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    activeConfig.priorityLevel.includes('P2') ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {activeConfig.priorityLevel}
                  </span>
                </div>

                {/* Recommended Action */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Recommended Action
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {activeConfig.recommendedAction}
                  </p>
                </div>

                {/* Business Explanation */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Business Rationale &amp; Economic Impact
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeConfig.businessExplanation}
                  </p>
                </div>

                {/* Operational Tactics */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Operational Tactics &amp; Channels
                  </span>
                  <div className="space-y-1.5">
                    {activeConfig.tactics.map((tactic, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{tactic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action: Calculate Campaign ROI */}
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('roi-calculation')}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Simulate Campaign ROI for This Segment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
