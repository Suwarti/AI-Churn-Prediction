import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Sliders, 
  Info,
  Lock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const CustomerValueTab: React.FC = () => {
  const { 
    customerProfile, 
    predictionResult,
    valueSettings, 
    updateValueSettings, 
    estimatedHistoricalRevenue,
    customerValueSegment,
    completeModule,
    completedModules,
    setActiveTab 
  } = useCustomer();

  const [isEditingThresholds, setIsEditingThresholds] = useState(false);
  const [highThresholdInput, setHighThresholdInput] = useState(valueSettings.highThreshold);
  const [mediumThresholdInput, setMediumThresholdInput] = useState(valueSettings.mediumThreshold);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

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
            Customer Value analysis requires at least one successful customer churn prediction to contextualize customer economics against churn risk.
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

  const handleSaveThresholds = () => {
    updateValueSettings({
      highThreshold: Number(highThresholdInput),
      mediumThreshold: Number(mediumThresholdInput),
    });
    setIsEditingThresholds(false);
  };

  const handleCompleteAndProceed = () => {
    completeModule('customer-value', true);
  };

  const estimatedRemainingMonths = 18;
  const estimatedCustomerLifetimeValue = (Number(customerProfile.monthlyCharges) || 0) * ((Number(customerProfile.tenureMonths) || 0) + estimatedRemainingMonths);

  const cohortSegments = [
    {
      segment: 'High Value' as const,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgLight: 'bg-emerald-950/20',
      description: 'Long-tenure subscribers on premium fiber, multi-play bundling, and auto-pay.',
      subscribersCount: 145000,
      subscriberShare: 19.3,
      avgTenureMonths: 42,
      avgMonthlyCharges: 720000,
      avgHistoricalRevenue: 30240000,
      revenueContributionShare: 52.8,
    },
    {
      segment: 'Medium Value' as const,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgLight: 'bg-amber-950/20',
      description: 'Mid-tier dual-play subscribers with steady recurring revenue.',
      subscribersCount: 318000,
      subscriberShare: 42.4,
      avgTenureMonths: 22,
      avgMonthlyCharges: 460000,
      avgHistoricalRevenue: 10120000,
      revenueContributionShare: 35.4,
    },
    {
      segment: 'Low Value' as const,
      color: 'bg-slate-500',
      textColor: 'text-slate-300',
      borderColor: 'border-slate-700/60',
      bgLight: 'bg-slate-900/40',
      description: 'Entry-level single-service or recently acquired month-to-month subscribers.',
      subscribersCount: 287000,
      subscriberShare: 38.3,
      avgTenureMonths: 8,
      avgMonthlyCharges: 260000,
      avgHistoricalRevenue: 2080000,
      revenueContributionShare: 11.8,
    },
  ];

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
                Step 2: Customer Value Analysis
              </h3>
              {completedModules['customer-value'] && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Review subscriber value tier and confirm economics to unlock the Retention Decision Framework.
            </p>
          </div>
        </div>

        <button
          onClick={handleCompleteAndProceed}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20 shrink-0"
        >
          <span>Complete Value Analysis &amp; Proceed</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Assumptions Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <span>Customer Value Analytics &bull; Transparent Calculation Model</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20 font-mono">
              Modeled Projections
            </span>
          </div>
          <p className="leading-relaxed">
            Customer lifetime values and historical revenues are <strong className="text-white">modeled estimates</strong> derived from reported monthly charges and tenure. They serve as strategic decision-support proxies and are clearly distinguished from audited accounting ledger revenues.
          </p>
        </div>
      </div>

      {/* 4 Core Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. Monthly Charges */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Monthly Charges
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {formatIDR(Number(customerProfile.monthlyCharges) || 0)}
          </div>
          <div className="text-[11px] text-slate-400">
            Current active billing amount per month
          </div>
        </div>

        {/* 2. Customer Tenure */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Customer Tenure
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {Number(customerProfile.tenureMonths) || 0} Months
          </div>
          <div className="text-[11px] text-slate-400">
            Accumulated subscription duration
          </div>
        </div>

        {/* 3. Estimated Customer Lifetime Value */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Estimated Lifetime Value (CLV)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
            {formatIDR(estimatedCustomerLifetimeValue)}
          </div>
          <div className="text-[11px] text-slate-400">
            Tenure + {estimatedRemainingMonths} mo estimated horizon
          </div>
        </div>

        {/* 4. Customer Value Segment */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Customer Value Segment
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black tracking-tight ${
            customerValueSegment === 'High Value' ? 'text-emerald-400' :
            customerValueSegment === 'Medium Value' ? 'text-amber-400' : 'text-slate-300'
          }`}>
            {customerValueSegment}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Historical Proxy: {formatIDR(estimatedHistoricalRevenue)}
          </div>
        </div>
      </div>

      {/* Threshold Configuration Drawer */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-400" />
              Segmentation Criteria &amp; Thresholds
            </h4>
            <p className="text-xs text-slate-400">
              Define the boundary values for categorizing subscribers into High, Medium, and Low tiers.
            </p>
          </div>
          <button
            onClick={() => setIsEditingThresholds(!isEditingThresholds)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 self-start sm:self-center transition-colors cursor-pointer"
          >
            {isEditingThresholds ? 'Cancel' : 'Edit Thresholds'}
          </button>
        </div>

        {isEditingThresholds ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                High Value Threshold (IDR)
              </label>
              <input
                type="number"
                step={500000}
                value={highThresholdInput}
                onChange={(e) => setHighThresholdInput(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">
                Accounts with cumulative proxy &ge; {formatIDR(highThresholdInput)}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Medium Value Threshold (IDR)
              </label>
              <input
                type="number"
                step={500000}
                value={mediumThresholdInput}
                onChange={(e) => setMediumThresholdInput(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">
                Accounts between {formatIDR(mediumThresholdInput)} and {formatIDR(highThresholdInput)}
              </span>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={handleSaveThresholds}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Apply Thresholds
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400">High Value Tier</span>
                <div className="text-xs font-mono text-slate-200 font-semibold mt-0.5">
                  &ge; {formatIDR(valueSettings.highThreshold)}
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                Top Priority
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400">Medium Value Tier</span>
                <div className="text-xs font-mono text-slate-200 font-semibold mt-0.5">
                  {formatIDR(valueSettings.mediumThreshold)} - {formatIDR(valueSettings.highThreshold)}
                </div>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                Core Base
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300">Low Value Tier</span>
                <div className="text-xs font-mono text-slate-200 font-semibold mt-0.5">
                  &lt; {formatIDR(valueSettings.mediumThreshold)}
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                Baseline
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cohort Comparison & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">
                Customer Value Distribution &amp; Share
              </h4>
              <p className="text-xs text-slate-400">
                Segment proportions across active telecommunications subscriber base
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {cohortSegments.map((seg) => (
              <div key={seg.segment} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${seg.color}`} />
                    {seg.segment}
                  </span>
                  <div className="text-right font-mono">
                    <span className="text-white font-bold">{seg.subscribersCount.toLocaleString()}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({seg.subscriberShare}%)</span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full ${seg.color} transition-all duration-500`}
                    style={{ width: `${seg.subscriberShare}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Avg Tenure: {seg.avgTenureMonths} mo</span>
                  <span>Avg Monthly: {formatIDR(seg.avgMonthlyCharges)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Active Profile Under Evaluation:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-bold">{formatIDR(estimatedHistoricalRevenue)}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                customerValueSegment === 'High Value' ? 'bg-emerald-500/20 text-emerald-300' :
                customerValueSegment === 'Medium Value' ? 'bg-amber-500/20 text-amber-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                {customerValueSegment}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">
                Revenue Contribution by Segment
              </h4>
              <span className="text-[10px] font-mono text-orange-400 font-bold">Pareto Dynamic</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Share of cumulative revenue generated by each segment tier
            </p>
          </div>

          <div className="my-4 space-y-3">
            {cohortSegments.map((seg) => (
              <div key={seg.segment} className={`p-3.5 rounded-xl border ${seg.borderColor} ${seg.bgLight} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${seg.textColor}`}>
                    {seg.segment}
                  </span>
                  <span className="text-base font-black font-mono text-white">
                    {seg.revenueContributionShare}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${seg.color}`}
                    style={{ width: `${seg.revenueContributionShare}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {seg.description}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            Observation: High-value accounts represent 19.3% of the subscriber base but generate <strong className="text-white">52.8% of portfolio revenue</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
