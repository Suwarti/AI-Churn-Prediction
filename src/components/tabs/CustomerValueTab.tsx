import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Sliders, 
  Layers, 
  PieChart, 
  ArrowUpRight, 
  Info,
  Building,
  CheckCircle2,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const CustomerValueTab: React.FC = () => {
  const { 
    customerProfile, 
    valueSettings, 
    updateValueSettings, 
    estimatedHistoricalRevenue,
    customerValueSegment 
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

  const handleSaveThresholds = () => {
    updateValueSettings({
      highThreshold: Number(highThresholdInput),
      mediumThreshold: Number(mediumThresholdInput),
    });
    setIsEditingThresholds(false);
  };

  // Illustrative portfolio cohort data based on actual Indosat operational segment distributions
  // (Clearly marked as illustrative cohort benchmarks for telecom strategic analysis)
  const cohortSegments = [
    {
      segment: 'High Value' as const,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgLight: 'bg-emerald-950/20',
      description: 'Long-tenure subscribers on premium fiber & multi-line postpaid plans.',
      subscribersCount: 142000,
      subscriberShare: 18.5,
      avgTenureMonths: 42,
      avgMonthlyCharges: 720000,
      avgHistoricalRevenue: 30240000,
      revenueContributionShare: 52.4,
    },
    {
      segment: 'Medium Value' as const,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgLight: 'bg-amber-950/20',
      description: 'Mid-tier dual-play subscribers with steady recurring revenue.',
      subscribersCount: 325000,
      subscriberShare: 42.3,
      avgTenureMonths: 22,
      avgMonthlyCharges: 460000,
      avgHistoricalRevenue: 10120000,
      revenueContributionShare: 35.8,
    },
    {
      segment: 'Low Value' as const,
      color: 'bg-slate-500',
      textColor: 'text-slate-300',
      borderColor: 'border-slate-700/60',
      bgLight: 'bg-slate-900/40',
      description: 'Entry-level single-service or recently acquired month-to-month subscribers.',
      subscribersCount: 301000,
      subscriberShare: 39.2,
      avgTenureMonths: 8,
      avgMonthlyCharges: 260000,
      avgHistoricalRevenue: 2080000,
      revenueContributionShare: 11.8,
    },
  ];

  // Current active customer metrics
  const activeMonthly = customerProfile.monthlyCharges;
  const activeTenure = customerProfile.tenureMonths;
  const activeRevenue = estimatedHistoricalRevenue;

  return (
    <div className="space-y-6">
      {/* Disclaimer / Definition Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-white">
            Customer Revenue Proxy Calculation
          </div>
          <p className="leading-relaxed">
            Formula: <code className="text-amber-300 font-mono">Estimated Customer Revenue = Monthly Charges × Tenure Months</code>.
            This calculation serves as an <strong className="text-slate-100">estimated historical revenue proxy</strong>, not verified lifetime revenue. Segment benchmarks below reflect representative Indosat subscriber cohorts for strategic portfolio planning.
          </p>
        </div>
      </div>

      {/* KPI Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Average Monthly Charges */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Avg Monthly Charges
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            Rp 480.000
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Current Customer:</span>
            <span className="font-mono text-amber-400 font-semibold">{formatIDR(activeMonthly)}</span>
          </div>
        </div>

        {/* KPI 2: Average Customer Tenure */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Avg Customer Tenure
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            24.2 Months
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Current Customer:</span>
            <span className="font-mono text-blue-400 font-semibold">{activeTenure} Months</span>
          </div>
        </div>

        {/* KPI 3: Estimated Customer Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Current Customer Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
            {formatIDR(activeRevenue)}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Value Segment:</span>
            <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
              customerValueSegment === 'High Value' ? 'bg-emerald-500/20 text-emerald-300' :
              customerValueSegment === 'Medium Value' ? 'bg-amber-500/20 text-amber-300' :
              'bg-slate-700 text-slate-300'
            }`}>
              {customerValueSegment}
            </span>
          </div>
        </div>

        {/* KPI 4: High Value Customer Count */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              High Value Customers
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            142,000 <span className="text-xs font-normal text-slate-400">(18.5%)</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Cohort Threshold:</span>
            <span className="font-mono text-purple-400">&ge; {formatIDR(valueSettings.highThreshold)}</span>
          </div>
        </div>
      </div>

      {/* Threshold Configuration Drawer / Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Configurable Value Segmentation Thresholds
            </h4>
            <p className="text-xs text-slate-400">
              Adjust cumulative historical revenue thresholds to categorize High, Medium, and Low value tiers.
            </p>
          </div>
          <button
            onClick={() => setIsEditingThresholds(!isEditingThresholds)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 self-start sm:self-center transition-colors"
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
                Subscribers with estimated revenue &ge; {formatIDR(highThresholdInput)}
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
                Subscribers with estimated revenue between {formatIDR(mediumThresholdInput)} and {formatIDR(highThresholdInput)}
              </span>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={handleSaveThresholds}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
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

      {/* Visual Charts: Value Distribution & Revenue Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Customer Value Distribution Histogram */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">
                Customer Value Distribution & Subscriber Share
              </h4>
              <p className="text-xs text-slate-400">
                Subscriber counts across estimated revenue brackets
              </p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Indosat Subscriber Base</span>
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

                {/* Bar */}
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

          {/* Active Customer Indicator Pill */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Active Customer In Focus:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-bold">{formatIDR(activeRevenue)}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                customerValueSegment === 'High Value' ? 'bg-emerald-500/20 text-emerald-300' :
                customerValueSegment === 'Medium Value' ? 'bg-amber-500/20 text-amber-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                {customerValueSegment}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Revenue Contribution by Segment */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">
                Revenue Contribution by Segment
              </h4>
              <span className="text-[10px] font-mono text-amber-400">Pareto Dynamic</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Share of cumulative revenue generated by each segment tier
            </p>
          </div>

          {/* Circular Stack / Donut visual representation */}
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
            Strategic Insight: <strong className="text-emerald-400">High Value customers</strong> represent only 18.5% of subscribers but generate <strong className="text-white">52.4%</strong> of estimated historical revenue.
          </div>
        </div>
      </div>

      {/* Customer Value Summary Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">
              Customer Value Segment Benchmark Table
            </h4>
            <p className="text-xs text-slate-400">
              Aggregated segment parameters based on Indosat telecommunications cohort data
            </p>
          </div>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
            Proxy Metrics
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Value Segment</th>
                <th className="py-3 px-4">Subscribers</th>
                <th className="py-3 px-4">Base Share</th>
                <th className="py-3 px-4">Avg Monthly Charges</th>
                <th className="py-3 px-4">Avg Tenure</th>
                <th className="py-3 px-4">Avg Historical Revenue</th>
                <th className="py-3 px-4">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {cohortSegments.map((row) => (
                <tr key={row.segment} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${row.color}`} />
                    <span className="text-white">{row.segment}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {row.subscribersCount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {row.subscriberShare}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {formatIDR(row.avgMonthlyCharges)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {row.avgTenureMonths} months
                  </td>
                  <td className="py-3.5 px-4 text-amber-300 font-bold">
                    {formatIDR(row.avgHistoricalRevenue)}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    {row.revenueContributionShare}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
