import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Printer, 
  AlertCircle, 
  BrainCircuit, 
  Info,
  CheckCircle2,
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const GenerateInsightTab: React.FC = () => {
  const { 
    customerProfile, 
    predictionResult, 
    estimatedHistoricalRevenue, 
    customerValueSegment,
    valueSettings,
    decisionThresholds,
    quadrantConfigs,
    activeQuadrantId,
    scenarioProfile,
    scenarioPrediction,
    roiAssumptions,
    roiResults,
    isTabUnlocked,
    completedModules,
    completeModule,
    setActiveTab
  } = useCustomer();

  const [insights, setInsights] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    const payload = {
      customerProfile,
      predictionResult,
      customerValueData: {
        estimatedRevenue: estimatedHistoricalRevenue,
        segment: customerValueSegment,
        highValueThreshold: valueSettings.highThreshold,
      },
      decisionFrameworkData: {
        quadrantTitle: quadrantConfigs[activeQuadrantId]?.title,
        priorityLevel: quadrantConfigs[activeQuadrantId]?.priorityLevel,
        recommendedStrategy: quadrantConfigs[activeQuadrantId]?.recommendedAction,
      },
      scenarioData: scenarioPrediction && predictionResult ? {
        simulated: true,
        originalProb: predictionResult.churn_probability,
        scenarioProb: scenarioPrediction.churn_probability,
        modifications: {
          contractType: scenarioProfile.contractType,
          monthlyCharges: scenarioProfile.monthlyCharges,
          interactions: scenarioProfile.total_support_interactions,
          tenure: scenarioProfile.tenureMonths,
        }
      } : { simulated: false },
      roiData: {
        targetedCustomers: roiAssumptions.targetedCustomers,
        retentionSuccessRate: roiAssumptions.retentionSuccessRate,
        avgMonthlyCharges: roiAssumptions.avgMonthlyCharges,
        retainedLifetimeMonths: roiAssumptions.retainedLifetimeMonths,
        costPerCustomer: roiAssumptions.costPerCustomer,
        totalCampaignCost: roiResults.totalCampaignCost,
        estimatedRevenueRetained: roiResults.estimatedRevenueRetained,
        netBenefit: roiResults.netBenefit,
        roiPercentage: roiResults.roiPercentage,
      }
    };

    try {
      const res = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate insights');
      }

      setInsights(data.insights);
      completeModule('generate-insight', false);
    } catch (err: any) {
      setError(err.message || 'Error communicating with Gemini server-side integration');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!insights) return;
    navigator.clipboard.writeText(insights);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Guard: Prerequisite check
  if (!isTabUnlocked('generate-insight')) {
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
            Please complete ROI Calculation first
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Executive strategic insights require a completed retention campaign ROI model to synthesize operational observations with financial justification.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('roi-calculation')}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>Go to ROI Calculation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3.5 print:hidden">
        <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <span>AI Executive Business Insights Engine</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              Google Gemini Powered
            </span>
          </div>
          <p className="leading-relaxed">
            Synthesizes current customer attributes, AI-estimated churn risk, value segments, what-if sensitivity simulations, and campaign ROI models into executive briefing notes. Does not invent historical metrics or claim unobserved data access.
          </p>
        </div>
      </div>

      {/* Control Action Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Executive Strategic Insight Generator</span>
            {insights && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Ready
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-400">
            Covers Risk Observations, Key Drivers, High-Value Opportunities, Campaign Suggestions, and Management Strategies.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {insights && (
            <>
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                {copied ? 'Copied' : 'Copy Insights'}
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Export / Print PDF</span>
              </button>
            </>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-500/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Synthesizing Insights...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{insights ? 'REGENERATE EXECUTIVE INSIGHTS' : 'GENERATE EXECUTIVE INSIGHTS'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Report Document */}
      {insights ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-slate-100 print:bg-white print:text-black print:border-none print:p-0">
          {/* Header Letterhead */}
          <div className="pb-6 border-b border-slate-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 print:border-black print:text-black">
                  AI CHURN PREDICTION PLATFORM
                </span>
                <span className="text-xs text-slate-400 font-mono">FOR SMARTER CUSTOMER RETENTION STRATEGIES</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight print:text-black">
                Customer Intelligence Executive Briefing
              </h3>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Prepared for Executive Leadership &bull; {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Quick Context Summary */}
            <div className="text-right text-xs font-mono space-y-0.5 bg-slate-950/60 print:bg-slate-100 p-3 rounded-xl border border-slate-800 print:border-slate-300">
              <div className="text-slate-400 print:text-slate-600 text-[10px]">Active Customer Profile:</div>
              <div className="font-bold text-orange-400 print:text-black">{formatIDR(Number(customerProfile.monthlyCharges) || 0)}/mo &bull; {Number(customerProfile.tenureMonths) || 0} mo</div>
              <div className="text-slate-400 print:text-slate-600 text-[10px]">
                AI Churn Risk: {predictionResult ? `${predictionResult.risk_level} (${(predictionResult.churn_probability * 100).toFixed(1)}%)` : 'Not run'}
              </div>
            </div>
          </div>

          {/* Formatted Sections */}
          <div className="prose prose-invert print:prose max-w-none space-y-6 text-sm leading-relaxed">
            {insights.split(/(?=### )/).map((section, idx) => {
              const lines = section.trim().split('\n');
              const heading = lines[0].replace('###', '').trim();
              const content = lines.slice(1).join('\n').trim();

              return (
                <div key={idx} className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 print:bg-transparent print:border-b print:border-slate-200 print:p-0 space-y-3">
                  <h4 className="text-base font-bold text-orange-400 print:text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>{heading}</span>
                  </h4>
                  <div className="text-xs text-slate-300 print:text-slate-700 leading-relaxed whitespace-pre-line space-y-2 font-sans">
                    {content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-xs text-slate-500 print:text-slate-600">
            <div>
              Platform: AI Churn Prediction &bull; Customer Retention Decision Support
            </div>
            <div className="font-mono text-[11px]">
              Powered by Google Gemini 3.8 Flash
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-400 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h5 className="text-base font-bold text-white">
              Ready to Generate Executive Business Insights
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click <strong className="text-orange-400">GENERATE EXECUTIVE INSIGHTS</strong> to synthesize your customer churn assessment, value segmentation, decision framework strategies, and campaign ROI models.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Insights...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>GENERATE EXECUTIVE INSIGHTS</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800/80 max-w-lg mx-auto flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              Customer: {formatIDR(Number(customerProfile.monthlyCharges) || 0)} &bull; {Number(customerProfile.tenureMonths) || 0} mo
            </span>
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              Quadrant: {quadrantConfigs[activeQuadrantId]?.title}
            </span>
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              ROI Model: {roiAssumptions.targetedCustomers.toLocaleString()} users &bull; {roiResults.roiPercentage.toFixed(0)}% ROI
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
