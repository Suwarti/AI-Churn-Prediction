import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  Info, 
  Lightbulb, 
  Check, 
  TrendingUp, 
  CreditCard, 
  Wifi, 
  Phone, 
  FileCheck 
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { CustomerProfile } from '../../types';
import { FormattedNumberInput } from '../common/FormattedNumberInput';

export const ChurnPredictionTab: React.FC = () => {
  const { 
    customerProfile, 
    updateCustomerField, 
    resetCustomerProfile, 
    predictCustomerChurn, 
    predictionResult, 
    predictionLoading, 
    predictionError, 
    setActiveTab 
  } = useCustomer();

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (predictionResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [predictionResult]);

  const handleFieldChange = (field: keyof CustomerProfile, val: any) => {
    updateCustomerField(field, val);

    // Immediate feedback for numerical fields: disallow 0
    if (
      field === 'tenureMonths' ||
      field === 'monthlyCharges' ||
      field === 'age' ||
      field === 'total_support_interactions'
    ) {
      if (val === 0) {
        const labels: Record<string, string> = {
          tenureMonths: 'Tenure Months',
          monthlyCharges: 'Monthly Charges',
          age: 'Customer Age',
          total_support_interactions: 'Support Interactions',
        };
        setValidationErrors(prev => ({
          ...prev,
          [field]: `${labels[field]} must be greater than 0 (zero is not allowed).`
        }));
        return;
      }
    }

    if (field === 'region') {
      if (typeof val === 'string' && val.trim().length > 0) {
        setValidationErrors(prev => {
          const next = { ...prev };
          delete next.region;
          return next;
        });
        return;
      }
    }

    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};

    // Numerical validation: strictly > 0 required, 0 is disallowed and fails validation
    if (customerProfile.tenureMonths === '' || customerProfile.tenureMonths === undefined || customerProfile.tenureMonths === null) {
      errors.tenureMonths = 'Tenure Months is required (e.g. 1).';
    } else if (Number(customerProfile.tenureMonths) === 0) {
      errors.tenureMonths = 'Tenure Months must be greater than 0 (zero is not allowed).';
    } else if (Number(customerProfile.tenureMonths) < 0) {
      errors.tenureMonths = 'Tenure Months must be greater than 0.';
    }

    if (customerProfile.monthlyCharges === '' || customerProfile.monthlyCharges === undefined || customerProfile.monthlyCharges === null) {
      errors.monthlyCharges = 'Monthly Charges is required (e.g. 100,000).';
    } else if (Number(customerProfile.monthlyCharges) === 0) {
      errors.monthlyCharges = 'Monthly Charges must be greater than 0 (zero is not allowed).';
    } else if (Number(customerProfile.monthlyCharges) < 0) {
      errors.monthlyCharges = 'Monthly Charges must be greater than 0.';
    }

    if (customerProfile.age === '' || customerProfile.age === undefined || customerProfile.age === null) {
      errors.age = 'Customer Age is required (e.g. 22).';
    } else if (Number(customerProfile.age) === 0) {
      errors.age = 'Customer Age must be greater than 0 (zero is not allowed).';
    } else if (Number(customerProfile.age) < 0) {
      errors.age = 'Customer Age must be greater than 0.';
    }

    if (customerProfile.total_support_interactions === '' || customerProfile.total_support_interactions === undefined || customerProfile.total_support_interactions === null) {
      errors.total_support_interactions = 'Support Interactions is required (e.g. 2).';
    } else if (Number(customerProfile.total_support_interactions) === 0) {
      errors.total_support_interactions = 'Support Interactions must be greater than 0 (zero is not allowed).';
    } else if (Number(customerProfile.total_support_interactions) < 0) {
      errors.total_support_interactions = 'Support Interactions must be greater than 0.';
    }

    // Categorical dropdown validation
    if (!customerProfile.hasPhoneService) {
      errors.hasPhoneService = 'Please select Has Phone Service (e.g. Yes).';
    }
    if (!customerProfile.hasInternetService) {
      errors.hasInternetService = 'Please select Has Internet Service (e.g. Fiber optic).';
    }
    if (!customerProfile.contractType) {
      errors.contractType = 'Please select Contract Type (e.g. Month-to-month).';
    }
    if (!customerProfile.paperlessBilling) {
      errors.paperlessBilling = 'Please select Paperless Billing (e.g. Yes).';
    }
    if (!customerProfile.paymentMethod) {
      errors.paymentMethod = 'Please select Payment Method (e.g. Electronic check).';
    }
    if (!customerProfile.gender) {
      errors.gender = 'Please select Gender (e.g. Female).';
    }
    if (!customerProfile.region || !customerProfile.region.trim()) {
      errors.region = 'Region is required (e.g. Jakarta).';
    }
    if (!customerProfile.partner) {
      errors.partner = 'Please select Partner (e.g. No).';
    }
    if (!customerProfile.dependents) {
      errors.dependents = 'Please select Dependents (e.g. No).';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    const trimmedRegion = customerProfile.region.trim();
    updateCustomerField('region', trimmedRegion);
    await predictCustomerChurn({
      ...customerProfile,
      region: trimmedRegion,
    });
  };

  const getSelectClass = (field: keyof CustomerProfile) => {
    const hasError = !!validationErrors[field];
    const isUnset = !customerProfile[field];
    return `w-full bg-slate-950 border rounded-xl px-3 py-2 text-sm cursor-pointer transition-colors focus:outline-none ${
      hasError 
        ? 'border-red-500/80 focus:border-red-400' 
        : 'border-slate-700/80 focus:border-orange-400'
    } ${
      isUnset 
        ? 'text-slate-400 font-normal' 
        : 'text-white font-medium'
    }`;
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* MANDATORY PREDICTION TRANSPARENCY NOTICE */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 shadow-sm">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 space-y-1">
          <div className="font-bold text-white uppercase tracking-wider text-[11px]">
            Prediction Transparency Notice
          </div>
          <p className="leading-relaxed font-medium">
            &ldquo;Predictions are AI-generated estimates based on customer attributes and business reasoning. They are not outputs from a statistically trained or validated churn prediction model.&rdquo;
          </p>
        </div>
      </div>

      {/* Full-Width Customer Input Form */}
      <form onSubmit={handlePredict} className="space-y-6 w-full">
        {/* SECTION A: Customer Details */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-slate-800/80">
            <h4 className="text-base font-bold text-white tracking-tight">Customer Details</h4>
            <p className="text-xs text-slate-400 mt-0.5">Tell us a little about the customer and their account.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. tenureMonths */}
            <FormattedNumberInput
              id="tenureMonths"
              label="Tenure Months"
              placeholder="e.g. 1"
              unit="mo"
              value={customerProfile.tenureMonths}
              onChange={(val) => handleFieldChange('tenureMonths', val)}
              error={validationErrors.tenureMonths}
            />

            {/* 2. monthlyCharges */}
            <FormattedNumberInput
              id="monthlyCharges"
              label="Monthly Charges (IDR)"
              placeholder="e.g. 100,000"
              prefix="IDR"
              value={customerProfile.monthlyCharges}
              onChange={(val) => handleFieldChange('monthlyCharges', val)}
              error={validationErrors.monthlyCharges}
            />

            {/* 3. age */}
            <FormattedNumberInput
              id="age"
              label="Customer Age"
              placeholder="e.g. 22"
              unit="yrs"
              value={customerProfile.age}
              onChange={(val) => handleFieldChange('age', val)}
              error={validationErrors.age}
            />

            {/* 4. total_support_interactions */}
            <FormattedNumberInput
              id="total_support_interactions"
              label="Support Interactions"
              placeholder="e.g. 2"
              unit="ticket(s)"
              value={customerProfile.total_support_interactions}
              onChange={(val) => handleFieldChange('total_support_interactions', val)}
              error={validationErrors.total_support_interactions}
            />
          </div>
        </div>

        {/* SECTION B: Subscription & Services */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-slate-800/80">
            <h4 className="text-base font-bold text-white tracking-tight">Subscription &amp; Services</h4>
            <p className="text-xs text-slate-400 mt-0.5">Provide details about the customer&apos;s subscribed services and payment preferences.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 5. hasPhoneService */}
            <div className="space-y-1.5">
              <label htmlFor="hasPhoneService" className="text-xs font-semibold text-slate-300">
                Has Phone Service
              </label>
              <select
                id="hasPhoneService"
                value={customerProfile.hasPhoneService}
                onChange={(e) => handleFieldChange('hasPhoneService', e.target.value as any)}
                className={getSelectClass('hasPhoneService')}
              >
                <option value="" disabled className="text-slate-500 bg-slate-900 font-normal">
                  e.g. Yes
                </option>
                <option value="No" className="text-white bg-slate-950 font-medium">No</option>
                <option value="Yes" className="text-white bg-slate-950 font-medium">Yes</option>
              </select>
              {validationErrors.hasPhoneService && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.hasPhoneService}</span>
                </p>
              )}
            </div>

            {/* 6. hasInternetService */}
            <div className="space-y-1.5">
              <label htmlFor="hasInternetService" className="text-xs font-semibold text-slate-300">
                Has Internet Service
              </label>
              <select
                id="hasInternetService"
                value={customerProfile.hasInternetService}
                onChange={(e) => handleFieldChange('hasInternetService', e.target.value as any)}
                className={getSelectClass('hasInternetService')}
              >
                <option value="" disabled className="text-slate-500 bg-slate-900 font-normal">
                  e.g. Fiber optic
                </option>
                <option value="DSL" className="text-white bg-slate-950 font-medium">DSL</option>
                <option value="Fiber optic" className="text-white bg-slate-950 font-medium">Fiber optic</option>
                <option value="No" className="text-white bg-slate-950 font-medium">No</option>
              </select>
              {validationErrors.hasInternetService && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.hasInternetService}</span>
                </p>
              )}
            </div>

            {/* 7. contractType */}
            <div className="space-y-1.5">
              <label htmlFor="contractType" className="text-xs font-semibold text-slate-300">
                Contract Type
              </label>
              <select
                id="contractType"
                value={customerProfile.contractType}
                onChange={(e) => handleFieldChange('contractType', e.target.value as any)}
                className={getSelectClass('contractType')}
              >
                <option value="" disabled className="text-slate-500 bg-slate-900 font-normal">
                  e.g. Month-to-month
                </option>
                <option value="Month-to-month" className="text-white bg-slate-950 font-medium">Month-to-month</option>
                <option value="One year" className="text-white bg-slate-950 font-medium">One year</option>
                <option value="Two year" className="text-white bg-slate-950 font-medium">Two year</option>
              </select>
              {validationErrors.contractType && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.contractType}</span>
                </p>
              )}
            </div>

            {/* 8. paperlessBilling */}
            <div className="space-y-1.5">
              <label htmlFor="paperlessBilling" className="text-xs font-semibold text-slate-300">
                Paperless Billing
              </label>
              <select
                id="paperlessBilling"
                value={customerProfile.paperlessBilling}
                onChange={(e) => handleFieldChange('paperlessBilling', e.target.value as any)}
                className={getSelectClass('paperlessBilling')}
              >
                <option value="" disabled className="text-slate-500 bg-slate-900 font-normal">
                  e.g. Yes
                </option>
                <option value="No" className="text-white bg-slate-950 font-medium">No</option>
                <option value="Yes" className="text-white bg-slate-950 font-medium">Yes</option>
              </select>
              {validationErrors.paperlessBilling && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.paperlessBilling}</span>
                </p>
              )}
            </div>

            {/* 9. paymentMethod */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="paymentMethod" className="text-xs font-semibold text-slate-300">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={customerProfile.paymentMethod}
                onChange={(e) => handleFieldChange('paymentMethod', e.target.value as any)}
                className={getSelectClass('paymentMethod')}
              >
                <option value="" disabled className="text-slate-500 bg-slate-900 font-normal">
                  e.g. Electronic check
                </option>
                <option value="Bank transfer (automatic)" className="text-white bg-slate-950 font-medium">
                  Bank transfer (automatic)
                </option>
                <option value="Credit card (automatic)" className="text-white bg-slate-950 font-medium">
                  Credit card (automatic)
                </option>
                <option value="Electronic check" className="text-white bg-slate-950 font-medium">
                  Electronic check
                </option>
                <option value="Mailed check" className="text-white bg-slate-950 font-medium">
                  Mailed check
                </option>
              </select>
              {validationErrors.paymentMethod && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.paymentMethod}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION C: Personal Information */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-slate-800/80">
            <h4 className="text-base font-bold text-white tracking-tight">Personal Information</h4>
            <p className="text-xs text-slate-400 mt-0.5">Share basic information about the customer&apos;s profile and location.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 10. gender */}
            <div className="space-y-1.5">
              <label htmlFor="gender" className="text-xs font-semibold text-slate-300">
                Gender
              </label>
              <select
                id="gender"
                value={customerProfile.gender}
                onChange={(e) => handleFieldChange('gender', e.target.value as any)}
                className={getSelectClass('gender')}
              >
                <option value="" disabled className="text-slate-500 bg-slate-900 font-normal">
                  e.g. Female
                </option>
                <option value="Female" className="text-white bg-slate-950 font-medium">Female</option>
                <option value="Male" className="text-white bg-slate-950 font-medium">Male</option>
              </select>
              {validationErrors.gender && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.gender}</span>
                </p>
              )}
            </div>

            {/* 11. region */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="region" className="text-xs font-semibold text-slate-300">
                  Region
                </label>
                <span className="text-[11px] font-mono text-orange-400 font-bold truncate max-w-[110px]">
                  {customerProfile.region ? customerProfile.region : <span className="text-slate-500 font-normal italic">Unset</span>}
                </span>
              </div>
              <div
                className={`flex items-center rounded-xl overflow-hidden border bg-slate-950 transition-colors shadow-inner focus-within:ring-1 focus-within:ring-orange-400/40 ${
                  validationErrors.region
                    ? 'border-red-500/80 focus-within:border-red-400'
                    : 'border-slate-700/80 focus-within:border-orange-400'
                }`}
              >
                <input
                  id="region"
                  type="text"
                  autoComplete="off"
                  value={customerProfile.region}
                  onChange={(e) => handleFieldChange('region', e.target.value)}
                  placeholder="e.g. Jakarta"
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              {validationErrors.region && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.region}</span>
                </p>
              )}
            </div>

            {/* 12. partner */}
            <div className="space-y-1.5">
              <label htmlFor="partner" className="text-xs font-semibold text-slate-300">
                Partner
              </label>
              <select
                id="partner"
                value={customerProfile.partner}
                onChange={(e) => handleFieldChange('partner', e.target.value as any)}
                className={getSelectClass('partner')}
              >
                <option value="" disabled className="text-slate-500 bg-slate-900 font-normal">
                  e.g. No
                </option>
                <option value="No" className="text-white bg-slate-950 font-medium">No</option>
                <option value="Yes" className="text-white bg-slate-950 font-medium">Yes</option>
              </select>
              {validationErrors.partner && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.partner}</span>
                </p>
              )}
            </div>

            {/* 13. dependents */}
            <div className="space-y-1.5">
              <label htmlFor="dependents" className="text-xs font-semibold text-slate-300">
                Dependents
              </label>
              <select
                id="dependents"
                value={customerProfile.dependents}
                onChange={(e) => handleFieldChange('dependents', e.target.value as any)}
                className={getSelectClass('dependents')}
              >
                <option value="" disabled className="text-slate-500 bg-slate-900 font-normal">
                  e.g. No
                </option>
                <option value="No" className="text-white bg-slate-950 font-medium">No</option>
                <option value="Yes" className="text-white bg-slate-950 font-medium">Yes</option>
              </select>
              {validationErrors.dependents && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.dependents}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Validation Alert Banner if errors exist */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Please complete all fields with valid information before running the prediction. Numerical values must be greater than 0.</span>
          </div>
        )}

        {/* Prediction Error Banner */}
        {predictionError && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 shadow-lg">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-300">Prediction Engine Notice:</div>
              <p className="mt-0.5">{predictionError}</p>
            </div>
          </div>
        )}

        {/* Form Action Buttons: Reset & Predict */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              resetCustomerProfile();
              setValidationErrors({});
            }}
            className="py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            disabled={predictionLoading}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {predictionLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Gemini AI Analyzing Customer Attributes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>PREDICT CHURN</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* DEDICATED PREDICTION RESULTS SECTION (Displayed ONLY after successful prediction) */}
      {predictionResult && (
        <div 
          ref={resultsRef} 
          className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800/90 shadow-2xl space-y-6 mt-8 animate-fadeIn"
        >
          {/* Result Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  AI Prediction Results &amp; Retention Assessment
                </h3>
                <span className="text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange-400" />
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Dynamic risk assessment and prescriptive retention strategy based on evaluated customer profile
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Analyzed at:</span>
                <div className="text-xs font-mono font-semibold text-slate-300">{predictionResult.timestamp}</div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('customer-value')}
                className="py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-500/20"
              >
                <span>Proceed to Step 2: Customer Value</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Content Grid: Gauge on Left (5 cols) | Insights & Recommendations on Right (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Probability Gauge, Risk Level & Classification Thresholds */}
            <div className="lg:col-span-5 space-y-5">
              {/* Circular Probability Gauge Card */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center text-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  AI-Estimated Churn Probability
                </div>

                <div className="relative w-44 h-44 flex items-center justify-center my-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#1e293b"
                      strokeWidth="10"
                    />
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
                    <span className="text-4xl font-black font-mono tracking-tight text-white">
                      {(predictionResult.churn_probability * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                      AI Estimate
                    </span>
                  </div>
                </div>

                {/* Risk Level Badge */}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    predictionResult.risk_level === 'High' ? 'bg-red-500 animate-pulse' :
                    predictionResult.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className={`text-base font-extrabold uppercase ${
                    predictionResult.risk_level === 'High' ? 'text-red-400' :
                    predictionResult.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {predictionResult.risk_level} Risk Level
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ({predictionResult.prediction_label})
                  </span>
                </div>
              </div>

              {/* Risk Classification Rules Reference */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Risk Classification Thresholds:
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                  <div className={`p-2 rounded-lg ${predictionResult.risk_level === 'Low' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'bg-slate-900 text-slate-400'}`}>
                    Low: &lt; 30%
                  </div>
                  <div className={`p-2 rounded-lg ${predictionResult.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'bg-slate-900 text-slate-400'}`}>
                    Med: 30–69.9%
                  </div>
                  <div className={`p-2 rounded-lg ${predictionResult.risk_level === 'High' ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30' : 'bg-slate-900 text-slate-400'}`}>
                    High: &ge; 70%
                  </div>
                </div>
              </div>

              {/* Prediction Explanation */}
              {predictionResult.prediction_explanation && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
                  &ldquo;{predictionResult.prediction_explanation}&rdquo;
                </div>
              )}
            </div>

            {/* Right Column: Key Risk Factors & Prescriptive Recommendations */}
            <div className="lg:col-span-7 space-y-5">
              {/* Key Risk Factors */}
              {predictionResult.key_risk_factors?.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                  <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span>Key Risk Factors (AI Analysis)</span>
                  </div>
                  <div className="space-y-2">
                    {predictionResult.key_risk_factors.map((factor, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Retention Recommendations */}
              {predictionResult.retention_recommendations?.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                  <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Prescriptive Retention Recommendations</span>
                  </div>
                  <div className="space-y-2">
                    {predictionResult.retention_recommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 leading-relaxed flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps Quick Links Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('customer-value')}
                  className="py-2.5 px-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Step 2: Customer Value</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('decision-framework')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Step 3: Decision Matrix</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('scenario-view')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Step 4: Test Scenarios</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
