import React from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Users, 
  Clock, 
  Info, 
  RotateCcw, 
  ArrowUpRight, 
  Bookmark,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const RoiCalculationTab: React.FC = () => {
  const { 
    roiAssumptions, 
    updateRoiAssumptions, 
    roiResults,
    isTabUnlocked,
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
  if (!isTabUnlocked('roi-calculation')) {
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
            Please complete Scenario View first
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The ROI Calculation model requires at least one completed what-if scenario analysis to assess potential churn reduction before modeling campaign economics.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('scenario-view')}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>Go to Scenario View</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const CAMPAIGN_PRESETS = [
    {
      id: 'digital-bill-rebate',
      name: 'Digital Bill Rebate & Vouchers',
      description: 'Automated SMS/app push with 15% discount for 3 months to high-risk month-to-month subscribers.',
      targetCustomers: 8000,
      successRate: 24,
      avgMonthly: 380000,
      lifetimeMonths: 10,
      costPerCustomer: 45000,
    },
    {
      id: 'vip-call-concierge',
      name: 'Dedicated VIP Retention Concierge',
      description: 'Personalized outbound phone calls and dedicated contract renegotiation for high-value accounts.',
      targetCustomers: 2500,
      successRate: 42,
      avgMonthly: 750000,
      lifetimeMonths: 18,
      costPerCustomer: 150000,
    },
    {
      id: 'fiber-speed-boost',
      name: 'Fiber Speed Boost Incentive',
      description: 'Free 3-month bandwidth upgrade with annual contract renewal commitment.',
      targetCustomers: 5000,
      successRate: 35,
      avgMonthly: 520000,
      lifetimeMonths: 14,
      costPerCustomer: 90000,
    },
    {
      id: 'triple-play-bundle',
      name: 'Triple-Play Protection Package',
      description: 'Bundle mobile voice + home fiber with loyalty lock-in rewards.',
      targetCustomers: 6500,
      successRate: 29,
      avgMonthly: 610000,
      lifetimeMonths: 12,
      costPerCustomer: 75000,
    },
  ];

  const applyPreset = (preset: typeof CAMPAIGN_PRESETS[0]) => {
    updateRoiAssumptions({
      targetedCustomers: preset.targetCustomers,
      retentionSuccessRate: preset.successRate,
      avgMonthlyCharges: preset.avgMonthly,
      retainedLifetimeMonths: preset.lifetimeMonths,
      costPerCustomer: preset.costPerCustomer,
    });
  };

  const resetDefaults = () => {
    updateRoiAssumptions({
      targetedCustomers: 5000,
      retentionSuccessRate: 28,
      avgMonthlyCharges: 445000,
      retainedLifetimeMonths: 12,
      costPerCustomer: 85000,
    });
  };

  const handleCompleteAndProceed = () => {
    completeModule('roi-calculation', true);
  };

  const sensitivitySuccessRates = [15, 20, 25, 30, 35, 40, 45];

  return (
    <div className="space-y-6">
      {/* Step Completion & Proceed Action Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Step 5: Retention Campaign ROI Calculation
              </h3>
              {completedModules['roi-calculation'] && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Confirm campaign economics and net benefit to unlock AI Executive Business Insights.
            </p>
          </div>
        </div>

        <button
          onClick={handleCompleteAndProceed}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20 shrink-0"
        >
          <span>Confirm ROI Model &amp; Proceed to Insights</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Assumptions Disclosure Notice */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <span>Customer Retention Campaign ROI Calculator</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20 font-mono">
              Business Assumptions
            </span>
          </div>
          <p className="leading-relaxed">
            All input parameters below represent <strong className="text-white">business planning assumptions</strong>, not actual observed outcomes. The model estimates the financial return of targeted retention campaigns based on retention success rates and incremental subscriber lifetime.
          </p>
        </div>
      </div>

      {/* Preset Strategy Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-orange-400" />
            Preset Retention Campaign Scenarios
          </span>
          <button
            onClick={resetDefaults}
            className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            Reset Default Values
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CAMPAIGN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-left transition-all group space-y-2 cursor-pointer"
            >
              <div className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                {preset.name}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {preset.description}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                <span>{preset.targetCustomers.toLocaleString()} users</span>
                <span className="text-orange-400 font-bold">{preset.successRate}% rate</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Revenue Retained */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Revenue Retained
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
            {formatIDR(roiResults.estimatedRevenueRetained)}
          </div>
          <div className="text-[11px] text-slate-400">
            {Math.round(roiAssumptions.targetedCustomers * (roiAssumptions.retentionSuccessRate / 100)).toLocaleString()} retained subscribers &bull; {roiAssumptions.retainedLifetimeMonths} mo
          </div>
        </div>

        {/* Metric 2: Campaign Cost */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Campaign Cost
            </span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-red-400 tracking-tight">
            {formatIDR(roiResults.totalCampaignCost)}
          </div>
          <div className="text-[11px] text-slate-400">
            {formatIDR(roiAssumptions.costPerCustomer)} per customer targeted
          </div>
        </div>

        {/* Metric 3: Net Benefit */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Net Financial Benefit
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono tracking-tight ${
            roiResults.netBenefit >= 0 ? 'text-white' : 'text-red-400'
          }`}>
            {formatIDR(roiResults.netBenefit)}
          </div>
          <div className="text-[11px] text-slate-400">
            Revenue Retained minus Campaign Cost
          </div>
        </div>

        {/* Metric 4: ROI Percentage */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Campaign ROI (%)
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-orange-400 tracking-tight">
            {roiResults.roiPercentage.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400">
            (Net Benefit / Campaign Cost) &times; 100
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs (5 items) and Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Assumptions (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">
                Campaign Input Parameters
              </h4>
              <p className="text-xs text-slate-400">
                Adjust business assumptions to evaluate campaign economics
              </p>
            </div>
            <span className="text-[10px] font-mono text-orange-400 font-bold">5 Assumptions</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Number of targeted customers */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <label className="text-slate-300">1. Number of Targeted Customers</label>
                <span className="font-mono text-orange-400">
                  {roiAssumptions.targetedCustomers.toLocaleString()} subscribers
                </span>
              </div>
              <input
                type="number"
                min={100}
                max={500000}
                step={500}
                value={roiAssumptions.targetedCustomers}
                onChange={(e) => updateRoiAssumptions({ targetedCustomers: Math.max(1, Number(e.target.value)) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* 2. Expected retention success rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <label className="text-slate-300">2. Expected Retention Success Rate (%)</label>
                <span className="font-mono text-orange-400">{roiAssumptions.retentionSuccessRate}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={90}
                step={1}
                value={roiAssumptions.retentionSuccessRate}
                onChange={(e) => updateRoiAssumptions({ retentionSuccessRate: Number(e.target.value) })}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1% (Conservative)</span>
                <span>50%</span>
                <span>90% (Aggressive)</span>
              </div>
            </div>

            {/* 3. Average monthly charges */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <label className="text-slate-300">3. Average Monthly Charges (IDR)</label>
                <span className="font-mono text-orange-400">{formatIDR(roiAssumptions.avgMonthlyCharges)}</span>
              </div>
              <input
                type="number"
                min={100000}
                max={1500000}
                step={10000}
                value={roiAssumptions.avgMonthlyCharges}
                onChange={(e) => updateRoiAssumptions({ avgMonthlyCharges: Math.max(0, Number(e.target.value)) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* 4. Estimated additional retention months */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <label className="text-slate-300">4. Estimated Additional Retention Months</label>
                <span className="font-mono text-orange-400">{roiAssumptions.retainedLifetimeMonths} Months</span>
              </div>
              <input
                type="number"
                min={1}
                max={48}
                value={roiAssumptions.retainedLifetimeMonths}
                onChange={(e) => updateRoiAssumptions({ retainedLifetimeMonths: Math.max(1, Number(e.target.value)) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* 5. Campaign cost per customer */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <label className="text-slate-300">5. Campaign Cost Per Customer (IDR)</label>
                <span className="font-mono text-orange-400">{formatIDR(roiAssumptions.costPerCustomer)}</span>
              </div>
              <input
                type="number"
                min={0}
                max={1000000}
                step={5000}
                value={roiAssumptions.costPerCustomer}
                onChange={(e) => updateRoiAssumptions({ costPerCustomer: Math.max(0, Number(e.target.value)) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Set to 0 for zero-cost automated digital campaigns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Revenue vs Cost Comparison Chart & Formulas (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">
                Revenue vs Cost Comparison
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Financial Balance</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Revenue Retained</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatIDR(roiResults.estimatedRevenueRetained)}
                  </span>
                </div>
                <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Campaign Cost</span>
                  <span className="font-mono font-bold text-red-400">
                    {formatIDR(roiResults.totalCampaignCost)}
                  </span>
                </div>
                <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        roiResults.estimatedRevenueRetained > 0
                          ? Math.min(100, Math.max(2, (roiResults.totalCampaignCost / roiResults.estimatedRevenueRetained) * 100))
                          : 100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Cost Share:</span>
                  <span className="font-mono">
                    {roiResults.estimatedRevenueRetained > 0
                      ? `${((roiResults.totalCampaignCost / roiResults.estimatedRevenueRetained) * 100).toFixed(1)}% of retained revenue`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1.5 font-mono">
              <div className="font-bold text-orange-400 uppercase tracking-wider text-[10px] font-sans">
                Formulas Applied:
              </div>
              <div className="text-[10px] text-slate-400 space-y-1">
                <div>&bull; Revenue Retained = Targeted Customers &times; Retention Success Rate &times; Monthly Charges &times; Additional Retention Months</div>
                <div>&bull; Campaign Cost = Targeted Customers &times; Campaign Cost Per Customer</div>
                <div>&bull; Net Benefit = Revenue Retained - Campaign Cost</div>
                <div>&bull; ROI (%) = (Net Benefit / Campaign Cost) &times; 100</div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Investment Assessment:</span>
            </div>
            <p className="text-[11px] text-slate-400">
              For every <strong className="text-white">Rp 100.000</strong> invested, the business estimates recovering{' '}
              <strong className="text-emerald-400 font-mono">
                {roiResults.totalCampaignCost > 0
                  ? formatIDR((roiResults.estimatedRevenueRetained / roiResults.totalCampaignCost) * 100000)
                  : 'Infinite'}
              </strong>{' '}
              in retained telecom subscriber cash flow.
            </p>
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">
              Success Rate Sensitivity Analysis Matrix
            </h4>
            <p className="text-xs text-slate-400">
              Evaluates how variations in retention success rates impact Net Benefit and ROI%
            </p>
          </div>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
            Campaign Cost: {formatIDR(roiResults.totalCampaignCost)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Success Rate</th>
                <th className="py-3 px-4">Retained Subscribers</th>
                <th className="py-3 px-4">Revenue Retained</th>
                <th className="py-3 px-4">Campaign Cost</th>
                <th className="py-3 px-4">Net Benefit</th>
                <th className="py-3 px-4">ROI %</th>
                <th className="py-3 px-4">Financial Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sensitivitySuccessRates.map((rate) => {
                const fraction = rate / 100;
                const usersRetained = Math.round(roiAssumptions.targetedCustomers * fraction);
                const revenueRetained = usersRetained * roiAssumptions.avgMonthlyCharges * roiAssumptions.retainedLifetimeMonths;
                const cost = roiResults.totalCampaignCost;
                const net = revenueRetained - cost;
                const roi = cost > 0 ? (net / cost) * 100 : 0;
                const isCurrent = Math.abs(rate - roiAssumptions.retentionSuccessRate) < 2.5;

                return (
                  <tr
                    key={rate}
                    className={`transition-colors ${
                      isCurrent ? 'bg-orange-500/10 font-bold border-l-2 border-orange-500' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans text-white flex items-center gap-1.5">
                      <span>{rate}%</span>
                      {isCurrent && (
                        <span className="text-[9px] bg-orange-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                          CURRENT
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {usersRetained.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400">
                      {formatIDR(revenueRetained)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {formatIDR(cost)}
                    </td>
                    <td className={`py-3.5 px-4 ${net >= 0 ? 'text-white' : 'text-red-400'}`}>
                      {formatIDR(net)}
                    </td>
                    <td className="py-3.5 px-4 text-orange-400 font-bold">
                      {roi.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        net > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {net > 0 ? 'Profitable' : 'Loss'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
