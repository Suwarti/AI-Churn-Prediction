import React, { useEffect, useMemo } from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Info,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  Zap,
  Clock,
  Layers,
  Activity,
  CheckCircle,
  RefreshCw,
  Building,
  CreditCard,
  Wifi,
  Phone,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { useCustomer, calculateCustomerValueFinancials } from '../../context/CustomerContext';

export const CustomerValueTab: React.FC = () => {
  const { 
    customerProfile, 
    predictionResult,
    customerValueFinancials,
    customerValueAiAssessment,
    customerValueAiLoading,
    customerValueAiError,
    assessCustomerValue,
    completeModule,
    completedModules,
    setActiveTab 
  } = useCustomer();

  // Guard: Prerequisite check
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
            Customer Value assessment requires at least one completed churn prediction. All customer attributes are automatically transferred to evaluate forward customer economics.
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

  // Calculate financials from shared state
  const financials = useMemo(() => {
    return customerValueFinancials || calculateCustomerValueFinancials(customerProfile);
  }, [customerValueFinancials, customerProfile]);

  // Automatic assessment trigger on mount if not already cached
  useEffect(() => {
    if (predictionResult && !customerValueAiAssessment && !customerValueAiLoading && !customerValueAiError) {
      assessCustomerValue(customerProfile, predictionResult);
    }
  }, [predictionResult, customerValueAiAssessment, customerValueAiLoading, customerValueAiError]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCompleteAndProceed = () => {
    completeModule('customer-value', true);
  };

  // Portfolio cohort reference benchmarks (read-only distribution context)
  const portfolioDistribution = [
    {
      segment: 'High Value',
      share: '19.3%',
      revenueShare: '52.8%',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      description: 'Long-tenure subscribers on multi-play contracts with premium recurring ARPU.',
    },
    {
      segment: 'Medium Value',
      share: '42.4%',
      revenueShare: '35.4%',
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      description: 'Core subscriber base with steady recurring revenue and healthy expansion potential.',
    },
    {
      segment: 'Low Value',
      share: '38.3%',
      revenueShare: '11.8%',
      color: 'bg-slate-500',
      textColor: 'text-slate-300',
      description: 'Entry-level, single-play, or early-stage subscribers with modest forward contribution.',
    },
  ];

  const currentSegment = customerValueAiAssessment?.customer_value_segment || 'Medium Value';

  return (
    <div className="space-y-6">
      {/* Step Completion & Proceed Action Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Step 2: Automated Customer Value Assessment
              </h3>
              <span className="text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                AI Powered
              </span>
              {completedModules['customer-value'] && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Customer attributes ingested automatically from Churn Prediction. Evaluated using Gemini AI.
            </p>
          </div>
        </div>

        <button
          onClick={handleCompleteAndProceed}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20 shrink-0"
        >
          <span>Proceed to Decision Framework</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Shared Customer Profile Attributes Badge Matrix (Read-Only) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-orange-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Automatically Ingested Customer Profile (Churn Prediction)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Read-Only &bull; 13 Features Transferred
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
            <Calendar className="w-3 h-3 text-orange-400" />
            <span>Tenure:</span>
            <strong className="text-white">{customerProfile.tenureMonths || 0} mo</strong>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
            <DollarSign className="w-3 h-3 text-orange-400" />
            <span>Monthly:</span>
            <strong className="text-white">{formatIDR(Number(customerProfile.monthlyCharges) || 0)}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-blue-400" />
            <span>Contract:</span>
            <strong className="text-white">{customerProfile.contractType || 'N/A'}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>Internet:</span>
            <strong className="text-white">{customerProfile.hasInternetService || 'None'}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-purple-400" />
            <span>Phone:</span>
            <strong className="text-white">{customerProfile.hasPhoneService || 'No'}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <CreditCard className="w-3 h-3 text-amber-400" />
            <span>Payment:</span>
            <strong className="text-white">{customerProfile.paymentMethod || 'Manual'}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Building className="w-3 h-3 text-cyan-400" />
            <span>Region:</span>
            <strong className="text-white">{customerProfile.region || 'N/A'}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-red-400" />
            <span>Support Interactions:</span>
            <strong className="text-white">{customerProfile.total_support_interactions || 0}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
            <span>Age:</span>
            <strong className="text-white">{customerProfile.age || 'N/A'}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
            <span>Partner / Dependents:</span>
            <strong className="text-white">{customerProfile.partner}/{customerProfile.dependents}</strong>
          </div>

          {predictionResult && (
            <div className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center gap-1.5 font-mono font-bold">
              <span>Churn Risk:</span>
              <span>{(predictionResult.churn_probability * 100).toFixed(1)}% ({predictionResult.risk_level})</span>
            </div>
          )}
        </div>
      </div>

      {/* 5A. Customer Financial Overview (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. Monthly Charges */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Monthly Charges
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {formatIDR(financials.monthlyCharges)}
          </div>
          <div className="text-[11px] text-slate-400">
            Active recurring monthly billing (IDR)
          </div>
        </div>

        {/* 2. Customer Tenure */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Customer Tenure
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {financials.tenureMonths} Months
          </div>
          <div className="text-[11px] text-slate-400">
            Historical relationship duration
          </div>
        </div>

        {/* 3. Expected Remaining Months */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Expected Remaining Months
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-purple-400 tracking-tight">
            {financials.expectedRemainingMonths} Months
          </div>
          <div className="text-[11px] text-slate-400">
            Model forward-looking economic horizon
          </div>
        </div>

        {/* 4. Estimated Customer Value */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Estimated Customer Value
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
            {formatIDR(financials.estimatedCustomerValue)}
          </div>
          <div className="text-[11px] text-slate-400">
            Monthly Charges &times; {financials.expectedRemainingMonths} mo expected horizon
          </div>
        </div>
      </div>

      {/* Transparent Calculation Formula & Business Assumption Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-orange-400 shrink-0" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Transparent Economic Value Formula &amp; Assumptions
          </h4>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono space-y-1.5">
          <div className="text-orange-400 font-bold text-[13px]">
            Estimated Customer Value = Monthly Charges ({formatIDR(financials.monthlyCharges)}) &times; Expected Remaining Months ({financials.expectedRemainingMonths} mo) = <span className="text-emerald-400">{formatIDR(financials.estimatedCustomerValue)}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1 border-t border-slate-900">
            <strong>Business Estimation Logic:</strong> Expected Remaining Months is calculated using contractual commitment (Base: {financials.calculationBreakdown.baseContractMonths} mo for {customerProfile.contractType || 'contract'}) + tenure stability factor (+{financials.calculationBreakdown.tenureBonusMonths} mo for {financials.tenureMonths} mo tenure) + multi-service bundling (+{financials.calculationBreakdown.bundlingBonusMonths} mo).
          </div>
          <div className="text-[10px] text-slate-400 italic font-sans">
            * Note: This is an estimated economic projection for prioritization and retention decision support, not actual historical revenue or guaranteed future revenue.
          </div>
        </div>
      </div>

      {/* Loading state during initial automated assessment */}
      {customerValueAiLoading && (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <RefreshCw className="w-7 h-7 text-orange-400 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-white">
            Gemini AI is analyzing customer value profile...
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Evaluating multi-dimensional economics including recurring charges, tenure maturity, contract commitments, and retention opportunities.
          </p>
        </div>
      )}

      {/* 5B. AI Customer Value Classification Card */}
      {customerValueAiAssessment && (
        <div className={`p-6 rounded-2xl border shadow-lg space-y-5 ${
          currentSegment === 'High Value'
            ? 'bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-500/40 shadow-emerald-950/20'
            : currentSegment === 'Medium Value'
            ? 'bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/40 shadow-amber-950/20'
            : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-700 shadow-slate-950/20'
        }`}>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-inner shrink-0 ${
                currentSegment === 'High Value'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : currentSegment === 'Medium Value'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                  : 'bg-slate-700/30 border border-slate-600 text-slate-300'
              }`}>
                {currentSegment === 'High Value' ? (
                  <Award className="w-6 h-6" />
                ) : currentSegment === 'Medium Value' ? (
                  <Zap className="w-6 h-6" />
                ) : (
                  <Users className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  AI Customer Value Classification
                </span>
                <div className="flex items-center gap-2.5">
                  <h3 className={`text-2xl font-black tracking-tight ${
                    currentSegment === 'High Value'
                      ? 'text-emerald-400'
                      : currentSegment === 'Medium Value'
                      ? 'text-amber-400'
                      : 'text-slate-200'
                  }`}>
                    {currentSegment} Customer
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono border ${
                    currentSegment === 'High Value'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : currentSegment === 'Medium Value'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {currentSegment === 'High Value' ? 'Tier 1 Priority' : currentSegment === 'Medium Value' ? 'Tier 2 Core' : 'Tier 3 Baseline'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-[11px] font-mono text-slate-400">
                AI Engine: <strong className="text-white">{customerValueAiAssessment.engine || 'Gemini 3.8 Flash'}</strong>
              </span>
              {customerValueAiAssessment.cachedAt && (
                <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Cached: {customerValueAiAssessment.cachedAt}
                </span>
              )}
            </div>
          </div>

          {/* 5C. AI Assessment & Strategic Interpretation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>AI Value Assessment</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {customerValueAiAssessment.customer_value_assessment}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Business Interpretation &amp; Exposure</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {customerValueAiAssessment.business_interpretation}
              </p>
            </div>
          </div>

          {/* 5D. Key Value Drivers */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              Key Factors Influencing Customer Value
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {customerValueAiAssessment.key_value_drivers.map((driver, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-snug">
                    {driver}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5E. Retention Recommendations */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-900">
              <div>
                <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">
                  Recommended Retention Strategy
                </span>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  {customerValueAiAssessment.retention_strategy.tier_title}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Contextual Churn Risk:</span>
                <span className={`text-xs font-bold font-mono ml-1.5 ${
                  predictionResult.risk_level === 'High' ? 'text-red-400' :
                  predictionResult.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {(predictionResult.churn_probability * 100).toFixed(1)}% ({predictionResult.risk_level})
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300">
              <strong className="text-white">Primary Objective:</strong> {customerValueAiAssessment.retention_strategy.primary_objective}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {customerValueAiAssessment.retention_strategy.recommended_actions.map((action, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="text-[10px] font-mono font-bold text-orange-400 uppercase">
                    Action Step 0{idx + 1}
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

      {/* Portfolio Cohort Comparison (Read-Only Enterprise Perspective) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-white">
              Portfolio Value Distribution &amp; Cohort Reference
            </h4>
            <p className="text-xs text-slate-400">
              High-value subscribers typically generate the majority of enterprise margins in telecommunications.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            Current Subscriber Value: <strong className="text-white">{formatIDR(financials.estimatedCustomerValue)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {portfolioDistribution.map((tier) => {
            const isMatch = tier.segment === currentSegment;
            return (
              <div 
                key={tier.segment}
                className={`p-4 rounded-xl border transition-all ${
                  isMatch
                    ? 'bg-slate-950 border-orange-500/50 ring-1 ring-orange-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${tier.color}`} />
                    <span className="text-xs font-bold text-white">{tier.segment}</span>
                  </div>
                  {isMatch && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      Assigned Tier
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between text-xs font-mono py-1.5 border-y border-slate-900">
                  <span className="text-slate-400">Base Share:</span>
                  <span className="text-slate-200 font-bold">{tier.share}</span>
                </div>
                <div className="flex items-baseline justify-between text-xs font-mono py-1.5">
                  <span className="text-slate-400">Revenue Contribution:</span>
                  <span className="text-emerald-400 font-bold">{tier.revenueShare}</span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                  {tier.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
