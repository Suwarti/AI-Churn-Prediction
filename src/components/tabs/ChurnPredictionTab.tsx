import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw, 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  UserCheck, 
  Wifi, 
  CreditCard, 
  MapPin, 
  Users, 
  FileText,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { CustomerProfile } from '../../types';

interface ChurnPredictionTabProps {
  onOpenModelModal: () => void;
}

export const ChurnPredictionTab: React.FC<ChurnPredictionTabProps> = ({ onOpenModelModal }) => {
  const { 
    customerProfile, 
    updateCustomerField, 
    resetCustomerProfile, 
    predictCustomerChurn, 
    predictionResult, 
    predictionLoading, 
    predictionError, 
    apiStatus,
    setActiveTab 
  } = useCustomer();

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};
    if (customerProfile.tenureMonths < 1 || customerProfile.tenureMonths > 72) {
      errors.tenureMonths = 'Tenure must be between 1 and 72 months.';
    }
    if (customerProfile.monthlyCharges < 150000 || customerProfile.monthlyCharges > 1000000) {
      errors.monthlyCharges = 'Monthly charges must be between Rp 150.000 and Rp 1.000.000.';
    }
    if (customerProfile.age < 19 || customerProfile.age > 72) {
      errors.age = 'Age must be between 19 and 72 years.';
    }
    if (customerProfile.total_support_interactions < 0 || customerProfile.total_support_interactions > 2) {
      errors.total_support_interactions = 'Interactions must be between 0 and 2.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    await predictCustomerChurn();
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Exact 10 regions specified in model training
  const REGIONS: CustomerProfile['region'][] = [
    'Bandung',
    'JKT',
    'Jakarta',
    'Medan',
    'SBY',
    'Semarang',
    'Surabaya',
    'bandung',
    'bdg',
    'jakarta',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / System Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Primary Machine Learning Model
              <span className="text-[10px] bg-slate-800 text-amber-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                churn_logistic_regression_smote.pkl
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates 13 verified customer features using a preprocessed StandardScaler + OneHotEncoder + SMOTE pipeline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={resetCustomerProfile}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={onOpenModelModal}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              apiStatus.connected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${apiStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {apiStatus.connected ? 'Model Connected' : 'Model Disconnected'}
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left (8 cols) and Prediction Result on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <form onSubmit={handlePredict} className="space-y-6">
            {/* SECTION A: Customer Information */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">
                    A
                  </span>
                  <h4>Customer Information (Numerical Features)</h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">4 Features</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. tenureMonths */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      1. Tenure Months
                    </label>
                    <span className="text-[11px] font-mono text-amber-400">
                      {customerProfile.tenureMonths} mo
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={customerProfile.tenureMonths}
                    onChange={(e) => updateCustomerField('tenureMonths', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Min: 1 mo</span>
                    <span>Max: 72 mo</span>
                  </div>
                  {validationErrors.tenureMonths && (
                    <p className="text-[11px] text-red-400">{validationErrors.tenureMonths}</p>
                  )}
                </div>

                {/* 2. monthlyCharges */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      2. Monthly Charges (IDR)
                    </label>
                    <span className="text-[11px] font-mono text-amber-400">
                      {formatIDR(customerProfile.monthlyCharges)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={150000}
                    max={1000000}
                    step={5000}
                    value={customerProfile.monthlyCharges}
                    onChange={(e) => updateCustomerField('monthlyCharges', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Min: Rp 150.000</span>
                    <span>Max: Rp 1.000.000</span>
                  </div>
                  {validationErrors.monthlyCharges && (
                    <p className="text-[11px] text-red-400">{validationErrors.monthlyCharges}</p>
                  )}
                </div>

                {/* 3. age */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      3. Age
                    </label>
                    <span className="text-[11px] font-mono text-amber-400">
                      {customerProfile.age} yrs
                    </span>
                  </div>
                  <input
                    type="number"
                    min={19}
                    max={72}
                    value={customerProfile.age}
                    onChange={(e) => updateCustomerField('age', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Min: 19 yrs</span>
                    <span>Max: 72 yrs</span>
                  </div>
                  {validationErrors.age && (
                    <p className="text-[11px] text-red-400">{validationErrors.age}</p>
                  )}
                </div>

                {/* 4. total_support_interactions */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      4. Total Support Interactions
                    </label>
                    <span className="text-[11px] font-mono text-amber-400">
                      {customerProfile.total_support_interactions} ticket(s)
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={2}
                    value={customerProfile.total_support_interactions}
                    onChange={(e) => updateCustomerField('total_support_interactions', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Min: 0</span>
                    <span>Max: 2</span>
                  </div>
                  {validationErrors.total_support_interactions && (
                    <p className="text-[11px] text-red-400">{validationErrors.total_support_interactions}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION B: Service Information */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-mono">
                    B
                  </span>
                  <h4>Service Information (Categorical Features)</h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">6 Features</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 5. hasPhoneService */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    5. Has Phone Service
                  </label>
                  <select
                    value={customerProfile.hasPhoneService}
                    onChange={(e) => updateCustomerField('hasPhoneService', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* 6. hasInternetService */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    6. Has Internet Service
                  </label>
                  <select
                    value={customerProfile.hasInternetService}
                    onChange={(e) => updateCustomerField('hasInternetService', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="DSL">DSL</option>
                    <option value="Fiber optic">Fiber optic</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* 7. contractType */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    7. Contract Type
                  </label>
                  <select
                    value={customerProfile.contractType}
                    onChange={(e) => updateCustomerField('contractType', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Month-to-month">Month-to-month</option>
                    <option value="One year">One year</option>
                    <option value="Two year">Two year</option>
                  </select>
                </div>

                {/* 8. paperlessBilling */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    8. Paperless Billing
                  </label>
                  <select
                    value={customerProfile.paperlessBilling}
                    onChange={(e) => updateCustomerField('paperlessBilling', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* 9. paymentMethod */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    9. Payment Method
                  </label>
                  <select
                    value={customerProfile.paymentMethod}
                    onChange={(e) => updateCustomerField('paymentMethod', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                    <option value="Credit card (automatic)">Credit card (automatic)</option>
                    <option value="Electronic check">Electronic check</option>
                    <option value="Mailed check">Mailed check</option>
                  </select>
                </div>

                {/* 10. region */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      10. Region (Exact Training Casing)
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">10 categories</span>
                  </div>
                  <select
                    value={customerProfile.region}
                    onChange={(e) => updateCustomerField('region', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer font-mono"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION C: Customer Profile */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-mono">
                    C
                  </span>
                  <h4>Customer Profile (Demographics)</h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">3 Features</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 11. gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    11. Gender
                  </label>
                  <select
                    value={customerProfile.gender}
                    onChange={(e) => updateCustomerField('gender', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                {/* 12. partner */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    12. Partner
                  </label>
                  <select
                    value={customerProfile.partner}
                    onChange={(e) => updateCustomerField('partner', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* 13. dependents */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    13. Dependents
                  </label>
                  <select
                    value={customerProfile.dependents}
                    onChange={(e) => updateCustomerField('dependents', e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PREDICT BUTTON */}
            <div>
              <button
                type="submit"
                disabled={predictionLoading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {predictionLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                    <span>Inquiring Model Pipeline (POST /predict)...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5 text-slate-950" />
                    <span>PREDICT CUSTOMER CHURN</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Prediction Results & Model Response */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Prediction Results Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Model Prediction Results
                </h4>
                <p className="text-[11px] text-slate-400">
                  Logistic Regression + SMOTE
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Threshold: 0.50
              </span>
            </div>

            {/* Error / Disconnected State */}
            {predictionError && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Prediction Service Notice</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {predictionError}
                </p>
                <div className="pt-2">
                  <button
                    onClick={onOpenModelModal}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    View Setup Instructions & Endpoint URL
                  </button>
                </div>
              </div>
            )}

            {/* Active Prediction Available */}
            {predictionResult ? (
              <div className="space-y-5">
                {/* Probability Gauge / Circle */}
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center text-center">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Churn Probability
                  </div>

                  {/* Circular/Arc Gauge visual */}
                  <div className="relative w-40 h-40 flex items-center justify-center my-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#1e293b"
                        strokeWidth="10"
                      />
                      {/* Active progress stroke */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={
                          predictionResult.risk_level === 'High'
                            ? '#ef4444'
                            : predictionResult.risk_level === 'Medium'
                            ? '#f59e0b'
                            : '#10b981'
                        }
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={
                          2 * Math.PI * 40 * (1 - Math.min(1, Math.max(0, predictionResult.churn_probability)))
                        }
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black font-mono tracking-tight text-white">
                        {(predictionResult.churn_probability * 100).toFixed(1)}%
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">
                        Predicted
                      </span>
                    </div>
                  </div>

                  {/* Horizon tag */}
                  <div className="text-xs text-slate-400 mt-1">
                    Prediction Horizon:{' '}
                    <strong className="text-slate-200 font-semibold">
                      {predictionResult.prediction_horizon || '1 Month'}
                    </strong>
                  </div>
                </div>

                {/* KPI Metrics List */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Predicted Class */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Predicted Class
                    </div>
                    <div className={`text-base font-extrabold mt-1 ${
                      predictionResult.predicted_churn === 1 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {predictionResult.prediction_label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Threshold &ge; 0.50
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Risk Level
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        predictionResult.risk_level === 'High'
                          ? 'bg-red-500'
                          : predictionResult.risk_level === 'Medium'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`} />
                      <span className={`text-base font-extrabold ${
                        predictionResult.risk_level === 'High'
                          ? 'text-red-400'
                          : predictionResult.risk_level === 'Medium'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {predictionResult.risk_level} Risk
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {predictionResult.risk_level === 'Low' && '< 30%'}
                      {predictionResult.risk_level === 'Medium' && '30% - 69.9%'}
                      {predictionResult.risk_level === 'High' && '&ge; 70%'}
                    </div>
                  </div>
                </div>

                {/* Risk Classification Guide */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-2">
                  <div className="font-semibold text-slate-300">Model Risk Classification Rules:</div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Low Risk
                    </span>
                    <span className="font-mono">Below 30%</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Medium Risk
                    </span>
                    <span className="font-mono">30% to &lt; 70%</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 text-red-400">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      High Risk
                    </span>
                    <span className="font-mono">70% or higher</span>
                  </div>
                </div>

                {/* Next Steps Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => setActiveTab('decision-framework')}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View in Decision Framework Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('scenario-view')}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Simulate What-If Scenarios</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state before prediction */
              <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                  <Activity className="w-6 h-6 text-amber-400/80" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">
                    No Prediction Generated Yet
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Adjust the 13 customer features on the left and click{' '}
                    <strong className="text-amber-400">PREDICT CUSTOMER CHURN</strong> to query the ML model pipeline.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-slate-500">
                  All predictions are produced exclusively by the trained Logistic Regression + SMOTE model.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
