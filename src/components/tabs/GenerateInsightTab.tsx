import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Printer, 
  FileDown, 
  Download, 
  AlertCircle, 
  Building2, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Info
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
          tenureMonths: scenarioProfile.tenureMonths,
          monthlyCharges: scenarioProfile.monthlyCharges,
          contractType: scenarioProfile.contractType,
          internetService: scenarioProfile.hasInternetService,
          paymentMethod: scenarioProfile.paymentMethod,
          interactions: scenarioProfile.total_support_interactions,
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
        throw new Error(data.details || data.error || 'Failed to generate insights');
      }

      setInsights(data.insights);
    } catch (err: any) {
      setError(err.message || 'Error communicating with server-side Gemini API');
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

  return (
    <div className="space-y-6">
      {/* Informative Gemini Role Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3.5 print:hidden">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-white flex items-center gap-2">
            <span>Executive Strategic Intelligence Engine (Powered by Gemini)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              Server-Side GenAI
            </span>
          </div>
          <p className="leading-relaxed">
            Gemini synthesizes the active analytical session—combining customer risk predictions, economic value tiers, sensitivity simulations, and campaign ROI—into an executive-ready strategic briefing for Indosat decision-makers. <strong className="text-amber-300">Gemini does not predict churn probabilities; all inference stems directly from the trained ML model.</strong>
          </p>
        </div>
      </div>

      {/* Control Action Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Executive Business Insight Generator</span>
            {insights && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Report Generated
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-400">
            Produces Executive Summary, Key Findings, Business Implications, and Recommended Actions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {insights && (
            <>
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                {copied ? 'Copied' : 'Copy Insights'}
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Export / Print PDF</span>
              </button>
            </>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-500/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Synthesizing Insights...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{insights ? 'REGENERATE INSIGHTS' : 'GENERATE BUSINESS INSIGHTS'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-white">Insight Generation Error</div>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main Report Document Area */}
      {insights ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-slate-100 print:bg-white print:text-black print:border-none print:p-0">
          {/* Executive Document Letterhead */}
          <div className="pb-6 border-b border-slate-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 print:border-black print:text-black">
                  INDOSAT OOREDOO HUTCHISON
                </span>
                <span className="text-xs text-slate-400 font-mono">CONFIDENTIAL EXECUTIVE REPORT</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight print:text-black">
                Customer Churn Intelligence Strategic Briefing
              </h3>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Prepared by Analytics Lead &bull; {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Quick Context Summary Tag */}
            <div className="text-right text-xs font-mono space-y-0.5 bg-slate-950/60 print:bg-slate-100 p-3 rounded-xl border border-slate-800 print:border-slate-300">
              <div className="text-slate-400 print:text-slate-600 text-[10px]">Active Customer In Focus:</div>
              <div className="font-bold text-amber-300 print:text-black">{formatIDR(customerProfile.monthlyCharges)}/mo &bull; {customerProfile.tenureMonths} mo</div>
              <div className="text-slate-400 print:text-slate-600 text-[10px]">
                Model Risk: {predictionResult ? `${predictionResult.risk_level} (${(predictionResult.churn_probability * 100).toFixed(1)}%)` : 'Not evaluated'}
              </div>
            </div>
          </div>

          {/* Formatted Markdown Content */}
          <div className="prose prose-invert print:prose max-w-none space-y-6 text-sm leading-relaxed">
            {insights.split(/(?=### )/).map((section, idx) => {
              const lines = section.trim().split('\n');
              const heading = lines[0].replace('###', '').trim();
              const content = lines.slice(1).join('\n').trim();

              return (
                <div key={idx} className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 print:bg-transparent print:border-b print:border-slate-200 print:p-0 space-y-3">
                  <h4 className="text-base font-bold text-amber-400 print:text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{heading}</span>
                  </h4>
                  <div className="text-xs text-slate-300 print:text-slate-700 leading-relaxed whitespace-pre-line space-y-2 font-sans">
                    {content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Footer / Signature */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-xs text-slate-500 print:text-slate-600">
            <div>
              Platform: Indosat Customer Churn Intelligence &bull; Algorithm: Logistic Regression + SMOTE
            </div>
            <div className="font-mono text-[11px]">
              AI Strategic Formulation: Gemini 3.8 Flash
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h5 className="text-base font-bold text-white">
              Ready to Generate Executive Strategic Insights
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click <strong className="text-amber-400">GENERATE BUSINESS INSIGHTS</strong> above to synthesize your current customer churn predictions, value segmentation, decision framework strategies, and campaign ROI models.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Insights...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>GENERATE BUSINESS INSIGHTS</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Context Chips */}
          <div className="pt-6 border-t border-slate-800/80 max-w-lg mx-auto flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              Customer: {formatIDR(customerProfile.monthlyCharges)} &bull; {customerProfile.tenureMonths} mo
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
