import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Printer, 
  Download,
  AlertCircle, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Percent,
  CheckCircle2,
  Layers,
  Award,
  Info,
  Calendar,
  Tag,
  Building,
  Target,
  FileText,
  AlertTriangle,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useCustomer } from '../../context/CustomerContext';
import { ExecutiveReportSynthesis } from '../../types';

export const GenerateInsightTab: React.FC = () => {
  const { 
    customerProfile, 
    predictionResult, 
    customerValueSegment,
    customerValueFinancials,
    customerValueAiAssessment,
    finalDecisionAnalysis,
    scenarioRecommendations,
    automatedRoiAnalysis,
    isTabUnlocked,
    completedModules,
    completeModule,
    setActiveTab
  } = useCustomer();

  const [synthesis, setSynthesis] = useState<ExecutiveReportSynthesis | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const reportContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic Report ID and Generation Timestamp
  const reportId = useMemo(() => {
    const timeSuffix = Date.now().toString().slice(-6);
    const regCode = (customerProfile.region || 'JKT').slice(0, 3).toUpperCase();
    return `RPT-TELCO-${regCode}-${timeSuffix}`;
  }, [customerProfile.region]);

  const reportGenerationTime = useMemo(() => {
    return new Date().toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Check if any prerequisite is incomplete
  const missingPrerequisite = useMemo(() => {
    if (!predictionResult) {
      return { tab: 'prediction', title: 'Churn Prediction', msg: 'Run an initial Churn Prediction for the subscriber.' };
    }
    if (!completedModules['customer-value'] && !customerValueFinancials) {
      return { tab: 'customer-value', title: 'Customer Value', msg: 'Complete the automated Customer Value Assessment.' };
    }
    if (!completedModules['decision-framework'] && !finalDecisionAnalysis) {
      return { tab: 'decision-framework', title: 'Decision Framework', msg: 'Generate the final strategic retention decision.' };
    }
    if (!completedModules['scenario-view'] && !scenarioRecommendations) {
      return { tab: 'scenario-view', title: 'Scenario View', msg: 'Generate retention scenario recommendations.' };
    }
    if (!completedModules['roi-calculation'] && !automatedRoiAnalysis) {
      return { tab: 'roi-calculation', title: 'ROI Calculation', msg: 'Compute automated retention campaign economics.' };
    }
    return null;
  }, [
    predictionResult, 
    completedModules, 
    customerValueFinancials, 
    finalDecisionAnalysis, 
    scenarioRecommendations, 
    automatedRoiAnalysis
  ]);

  // Synthesis function calling the backend
  const handleSynthesizeReport = async () => {
    if (missingPrerequisite) return;

    setIsSynthesizing(true);
    setError(null);

    const payload = {
      customerProfile,
      predictionResult,
      customerValue: {
        customerValueSegment,
        estimatedCustomerValue: customerValueFinancials?.estimatedCustomerValue || 0,
        monthlyCharges: customerValueFinancials?.monthlyCharges || 0,
        expectedRemainingMonths: customerValueFinancials?.expectedRemainingMonths || 12,
      },
      decisionFramework: {
        finalDecision: finalDecisionAnalysis?.finalDecision || 'Cost-Efficient Retention',
        primaryRetentionStrategy: finalDecisionAnalysis?.primaryRetentionStrategy || '',
        businessInterpretation: finalDecisionAnalysis?.businessInterpretation || '',
      },
      scenarioView: {
        recommendedScenarioId: scenarioRecommendations?.recommendedScenarioId || 'base-case',
        recommendedScenarioName: scenarioRecommendations?.recommendedScenarioName || 'Base Case Scenario',
      },
      roiCalculation: automatedRoiAnalysis ? {
        recommendedFinancials: automatedRoiAnalysis.recommendedFinancials,
        scenariosFinancials: automatedRoiAnalysis.scenariosFinancials,
      } : null,
    };

    try {
      const res = await fetch('/api/report/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize executive report');
      }

      setSynthesis({
        executiveSummary: data.executiveSummary,
        strategicRecommendations: data.strategicRecommendations,
        engine: data.engine || 'gemini-3.8-flash',
        cachedAt: new Date().toLocaleTimeString(),
      });
      setIsSynthesizing(false);

      // Mark Module 6 complete
      completeModule('generate-insight', false);
    } catch (err: any) {
      setError(err.message || 'Report synthesis encountered an unexpected issue.');
      setIsSynthesizing(false);
    }
  };

  // Auto-synthesize on initial load if prerequisites are met and not yet generated
  useEffect(() => {
    if (!missingPrerequisite && !synthesis && !isSynthesizing) {
      handleSynthesizeReport();
    }
  }, [missingPrerequisite, synthesis, isSynthesizing]);

  // Export Action A: Copy Report text
  const handleCopyReport = async () => {
    if (!reportContainerRef.current) return;
    try {
      const text = reportContainerRef.current.innerText;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy report text', err);
    }
  };

  // Export Action B: Download PDF (A4 format)
  const handleDownloadPdf = async () => {
    const element = reportContainerRef.current;
    if (!element) return;

    setIsDownloadingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#020617', // Match dark slate-950 theme
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Customer_Churn_Retention_Report_${reportId}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Export Action C: Native Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Prerequisite Guard
  if (missingPrerequisite) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto space-y-4 my-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            Prerequisite Incomplete
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Please complete {missingPrerequisite.title} first
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {missingPrerequisite.msg} The final executive report requires actual analytical results from all six modules before generating a consolidated deliverable.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab(missingPrerequisite.tab as any)}
            className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>Go to {missingPrerequisite.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Derived financial & analytical variables for the report
  const recFin = automatedRoiAnalysis?.recommendedFinancials;
  const scenariosFin = automatedRoiAnalysis?.scenariosFinancials;
  const totalValue = customerValueFinancials?.estimatedCustomerValue || 0;
  const monthlyCharges = Number(customerProfile.monthlyCharges) || 0;
  const tenure = Number(customerProfile.tenureMonths) || 0;
  const remainingMonths = customerValueFinancials?.expectedRemainingMonths || 12;
  const churnProb = predictionResult ? (predictionResult.churn_probability * 100).toFixed(1) : '0';
  const riskLevel = predictionResult?.risk_level || 'Low';
  const finalDecision = finalDecisionAnalysis?.finalDecision || 'Cost-Efficient Retention';
  const recScenarioName = automatedRoiAnalysis?.recommendedScenarioName || scenarioRecommendations?.recommendedScenarioName || 'Base Case Scenario';

  return (
    <div className="space-y-6">
      {/* Top Action & Export Toolbar (Hidden in browser print mode) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Step 6: Executive Summary &amp; Exportable Business Report
              </h3>
              {completedModules['generate-insight'] && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Ready to Export
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Consolidates all 6 modules into a single, management-ready retention proposal.
            </p>
          </div>
        </div>

        {/* Action Buttons: Copy, PDF, Print, Refresh */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={handleCopyReport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            title="Copy full text of the report"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer disabled:opacity-50"
            title="Download formatted A4 PDF file"
          >
            <Download className={`w-3.5 h-3.5 ${isDownloadingPdf ? 'animate-bounce text-orange-400' : 'text-slate-400'}`} />
            <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            title="Open browser print dialog / Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={handleSynthesizeReport}
            disabled={isSynthesizing}
            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-orange-500/20 disabled:opacity-50"
            title="Re-synthesize executive analysis with Gemini AI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>{isSynthesizing ? 'Synthesizing...' : 'Re-Synthesize'}</span>
          </button>
        </div>
      </div>

      {/* Synthesis Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleSynthesizeReport}
            className="px-3 py-1 bg-rose-500 text-white rounded font-bold hover:bg-rose-600 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isSynthesizing && !synthesis && (
        <div className="p-16 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl print:hidden">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 animate-pulse">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">
              Synthesizing Executive Customer Intelligence Briefing...
            </h4>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              Consolidating churn factors, lifetime customer value, strategic matrix classification, retention scenarios, and financial impact into a management consulting deliverable via Gemini 3.8 Flash.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          THE EXECUTIVE REPORT DOCUMENT (Exportable, Printable, Complete 7 Sections)
          ========================================================================= */}
      <div 
        id="executive-report-document" 
        ref={reportContainerRef}
        className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none print:bg-slate-950 text-slate-100 font-sans"
      >
        {/* =======================================================================
            HEADER: EXECUTIVE REPORT COVER & METADATA BAR
            ======================================================================= */}
        <div className="border-b border-slate-800 pb-8 space-y-5">
          {/* Top Decorative Ribbon / Tag */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[11px] font-black uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>READY-TO-USE EXECUTIVE SUMMARY</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Analysis Complete
              </span>
            </div>
          </div>

          {/* Main Titles */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
              Customer Churn &amp; Retention Strategy Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              AI-Powered Customer Intelligence Assessment | Telecommunications Industry
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Report ID</span>
              <div className="font-mono font-bold text-slate-200">{reportId}</div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Generated Date</span>
              <div className="font-mono font-bold text-slate-200">{reportGenerationTime}</div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Customer Reference</span>
              <div className="font-mono font-bold text-slate-200">
                {customerProfile.region || 'Jakarta'} &bull; {customerProfile.contractType || 'Month-to-month'}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Monthly ARPU</span>
              <div className="font-mono font-bold text-orange-400">
                {formatIDR(monthlyCharges)}
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================================
            SECTION 1: EXECUTIVE SUMMARY
            ======================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
              <span>Executive Summary</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Management Synthesis</span>
          </div>

          {/* 4 Stat Callout Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Overall Churn Risk</span>
              <div className={`text-xl font-black font-mono ${riskLevel === 'High' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {riskLevel} ({churnProb}%)
              </div>
              <div className="text-[10px] text-slate-400">{predictionResult?.prediction_label} propensity</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Customer Value</span>
              <div className="text-xl font-black font-mono text-blue-400">
                {customerValueSegment}
              </div>
              <div className="text-[10px] text-slate-400">{formatIDR(totalValue)} est. value</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Final Decision</span>
              <div className="text-xl font-black text-orange-400 tracking-tight">
                {finalDecision}
              </div>
              <div className="text-[10px] text-slate-400">Strategic framework mandate</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Expected Net Gain</span>
              <div className="text-xl font-black font-mono text-emerald-400">
                {recFin ? formatIDR(recFin.expectedNetGain) : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-400">{recFin ? `${recFin.estimatedRoiPercentage.toFixed(1)}% ROI` : ''}</div>
            </div>
          </div>

          {/* Executive Narrative */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 leading-relaxed text-xs sm:text-sm text-slate-200">
            <p>
              {synthesis?.executiveSummary || 
                `This executive assessment evaluates an individual subscriber account exhibiting ${churnProb}% churn probability (${riskLevel} Risk) on a ${customerProfile.contractType || 'Month-to-month'} subscription plan with monthly charges of ${formatIDR(monthlyCharges)} in the ${customerProfile.region || 'Jakarta'} market. The subscriber has an estimated lifetime value of ${formatIDR(totalValue)} over an expected horizon of ${remainingMonths} remaining months, classifying them in the ${customerValueSegment} segment.`
              }
            </p>
          </div>
        </section>

        {/* =======================================================================
            SECTION 2: CUSTOMER CHURN PREDICTION
            ======================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
              <span>Customer Churn Prediction</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">AI Risk Classification</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Customer Profile Summary Table (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Customer Profile Attributes
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-sans">Tenure</span>
                  <span className="text-white font-bold">{tenure} Months</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-sans">Monthly Charges</span>
                  <span className="text-orange-400 font-bold">{formatIDR(monthlyCharges)}</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-sans">Contract Type</span>
                  <span className="text-white font-bold">{customerProfile.contractType || 'N/A'}</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-sans">Support Tickets</span>
                  <span className="text-white font-bold">{customerProfile.total_support_interactions || 0} issues</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-sans">Internet Service</span>
                  <span className="text-white font-bold">{customerProfile.hasInternetService || 'N/A'}</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-sans">Payment Method</span>
                  <span className="text-white font-bold truncate block">{customerProfile.paymentMethod || 'N/A'}</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-sans">Region</span>
                  <span className="text-white font-bold">{customerProfile.region || 'Jakarta'}</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-sans">Customer Age</span>
                  <span className="text-white font-bold">{customerProfile.age || 'N/A'} yrs</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-sans">Paperless Billing</span>
                  <span className="text-white font-bold">{customerProfile.paperlessBilling || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Churn Prediction Score & Key Risk Factors (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Risk Assessment
                  </span>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    riskLevel === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {riskLevel} Risk &bull; {churnProb}%
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold block">Key Churn Risk Factors:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {predictionResult?.key_risk_factors?.map((rf, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-orange-400 font-bold mt-0.5">&bull;</span>
                        <span>{rf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {predictionResult?.prediction_explanation && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">AI Explanation:</strong> {predictionResult.prediction_explanation}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================================
            SECTION 3: CUSTOMER VALUE ASSESSMENT
            ======================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
              <span>Customer Value Assessment</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Account Economics</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Monthly Charges</span>
              <div className="text-lg font-bold font-mono text-white">{formatIDR(monthlyCharges)}</div>
              <div className="text-[10px] text-slate-400">Recurring ARPU baseline</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Expected Remaining</span>
              <div className="text-lg font-bold font-mono text-white">{remainingMonths} Months</div>
              <div className="text-[10px] text-slate-400">Model contract horizon</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Estimated Customer Value</span>
              <div className="text-lg font-bold font-mono text-blue-400">{formatIDR(totalValue)}</div>
              <div className="text-[10px] text-slate-400">Monthly &times; Remaining Months</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Value Segment</span>
              <div className="text-lg font-bold text-orange-400">{customerValueSegment}</div>
              <div className="text-[10px] text-slate-400">Strategic value classification</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Key Value Drivers &amp; Account Interpretation
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Identified Value Drivers:</span>
                <ul className="space-y-1">
                  {customerValueAiAssessment?.key_value_drivers?.map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{driver}</span>
                    </li>
                  )) || (
                    <>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>Contract horizon: {customerProfile.contractType || 'Month-to-month'} baseline commitment</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>Subscriber loyalty tenure of {tenure} months</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block">Value Assessment Rationale:</span>
                <p>
                  {customerValueAiAssessment?.business_interpretation || 
                    `At ${formatIDR(monthlyCharges)} per month, this customer provides consistent subscription cash flow. With an expected remaining duration of ${remainingMonths} months, preserving this relationship ensures recurring ARPU contribution.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            SECTION 4: DECISION FRAMEWORK
            ======================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">4</span>
              <span>Decision Framework Classification</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Strategic Matrix Mandate</span>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Final Strategic Decision</span>
                <div className="text-2xl font-black text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-orange-400" />
                  <span>{finalDecision}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                  Risk: {riskLevel} &bull; Value: {customerValueSegment}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Business Interpretation</span>
                </div>
                <p>
                  {finalDecisionAnalysis?.businessInterpretation || 
                    `The customer falls squarely into the "${finalDecision}" category based on combining observed churn risk with account lifetime value. This classification mandates focused intervention designed to protect account revenue.`}
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-orange-400" />
                  <span>Primary Retention Priority &amp; Strategy</span>
                </div>
                <p>
                  {finalDecisionAnalysis?.primaryRetentionStrategy || 
                    `Execute targeted outreach focused on term extensions and addressing customer service issues to secure recurring subscription ARPU.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            SECTION 5: RETENTION SCENARIO ANALYSIS
            ======================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">5</span>
              <span>Retention Scenario Analysis</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Sensitivity &amp; Modeling</span>
          </div>

          {/* Scenario Comparison Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-950">
                  <th className="py-3 px-4">Scenario Name</th>
                  <th className="py-3 px-4">Success Rate</th>
                  <th className="py-3 px-4">Cost Allocation</th>
                  <th className="py-3 px-4">Retention Budget</th>
                  <th className="py-3 px-4">Expected Retained Value</th>
                  <th className="py-3 px-4">Expected Net Gain</th>
                  <th className="py-3 px-4">Estimated ROI</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {(['conservative', 'base-case', 'optimistic'] as const).map((scKey) => {
                  const sc = scenariosFin ? scenariosFin[scKey] : null;
                  const isRec = (automatedRoiAnalysis?.recommendedScenarioId || 'base-case') === scKey;

                  const defaultName = scKey === 'conservative' ? 'Conservative Scenario' : scKey === 'base-case' ? 'Base Case Scenario' : 'Optimistic Scenario';
                  const rate = scKey === 'conservative' ? 20 : scKey === 'base-case' ? 35 : 50;
                  const costPct = scKey === 'conservative' ? 5 : scKey === 'base-case' ? 10 : 15;
                  const cost = sc ? sc.estimatedRetentionCost : totalValue * (costPct / 100);
                  const retVal = sc ? sc.expectedRetainedValue : totalValue * (rate / 100);
                  const net = sc ? sc.expectedNetGain : retVal - cost;
                  const roi = sc ? sc.estimatedRoiPercentage : (net / cost) * 100;

                  return (
                    <tr 
                      key={scKey}
                      className={isRec ? 'bg-orange-500/10 font-bold border-l-2 border-orange-500' : 'hover:bg-slate-800/30'}
                    >
                      <td className="py-3 px-4 font-sans text-white">
                        <span>{defaultName}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{rate}%</td>
                      <td className="py-3 px-4 text-slate-300">{costPct}% of Value</td>
                      <td className="py-3 px-4 text-amber-400">{formatIDR(cost)}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{formatIDR(retVal)}</td>
                      <td className="py-3 px-4 text-cyan-400 font-bold">{formatIDR(net)}</td>
                      <td className="py-3 px-4 text-orange-400 font-black">{roi.toFixed(1)}%</td>
                      <td className="py-3 px-4 font-sans">
                        {isRec ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500 text-slate-950 font-black">
                            RECOMMENDED
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Reference</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Recommended Scenario Rationale: {recScenarioName}</span>
              <span className="text-[10px] font-mono text-orange-400 font-normal">Methodological Guidance</span>
            </div>
            <p className="leading-relaxed">
              {scenarioRecommendations?.recommendationExplanation || 
                `The ${recScenarioName} achieves the optimal trade-off between intervention expenditure and expected preserved revenue. While smaller interventions display higher percentage ROI, ${recScenarioName} secures significantly greater absolute recovered cash flow for the enterprise.`}
            </p>
          </div>
        </section>

        {/* =======================================================================
            SECTION 6: ROI & FINANCIAL IMPACT
            ======================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">6</span>
              <span>ROI &amp; Financial Impact</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Economic Projections</span>
          </div>

          {/* 5 Financial KPI Metric Cards (Exact match to ROI tab) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Customer Value</span>
              <div className="text-lg font-bold font-mono text-white">{formatIDR(totalValue)}</div>
              <div className="text-[10px] text-slate-400">{remainingMonths} mo &times; {formatIDR(monthlyCharges)}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-emerald-400">Retained Value</span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {recFin ? formatIDR(recFin.expectedRetainedValue) : formatIDR(totalValue * 0.35)}
              </div>
              <div className="text-[10px] text-slate-400">{recFin?.assumedSuccessRate || 35}% success rate</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-amber-400">Retention Cost</span>
              <div className="text-lg font-bold font-mono text-amber-400">
                {recFin ? formatIDR(recFin.estimatedRetentionCost) : formatIDR(totalValue * 0.10)}
              </div>
              <div className="text-[10px] text-slate-400">{recFin?.costPercentage || 10}% of customer value</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-cyan-400">Expected Net Gain</span>
              <div className="text-lg font-bold font-mono text-cyan-400">
                {recFin ? formatIDR(recFin.expectedNetGain) : formatIDR(totalValue * 0.25)}
              </div>
              <div className="text-[10px] text-slate-400">Retained - Retention Cost</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 ring-1 ring-orange-500/30">
              <span className="text-[10px] uppercase font-semibold text-orange-400">Estimated ROI</span>
              <div className="text-xl font-black font-mono text-orange-400">
                {recFin ? `${recFin.estimatedRoiPercentage.toFixed(1)}%` : '250.0%'}
              </div>
              <div className="text-[10px] text-slate-400">(Net / Cost) &times; 100</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Financial Feasibility &amp; ROI Rationale
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                Return per Rp 1.000 spent: {recFin && recFin.estimatedRetentionCost > 0 ? formatIDR((recFin.expectedRetainedValue / recFin.estimatedRetentionCost) * 1000) : 'Rp 3.500'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {automatedRoiAnalysis?.businessInterpretation || 
                `Investing ${recFin ? formatIDR(recFin.estimatedRetentionCost) : 'a targeted budget'} generates an expected gross retained value of ${recFin ? formatIDR(recFin.expectedRetainedValue) : 'substantial revenue'}, delivering an estimated net financial gain of ${recFin ? formatIDR(recFin.expectedNetGain) : 'positive cash flow'}. This return decisively justifies retention intervention over passive churn.`}
            </p>
          </div>
        </section>

        {/* =======================================================================
            SECTION 7: FINAL STRATEGIC RECOMMENDATIONS
            ======================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">7</span>
              <span>Final Strategic Recommendations</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Action Plan for Leadership</span>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-5">
            {/* Strategy & Priority Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Recommended Retention Strategy
                </span>
                <div className="text-xl font-bold text-white">
                  {finalDecisionAnalysis?.primaryRetentionStrategy || 'Targeted Retention Intervention & Plan Commitment'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                  {synthesis?.strategicRecommendations?.interventionPriority || 'High Priority (P1 - Within 5 Days)'}
                </span>
              </div>
            </div>

            {/* Engagement Approach */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Suggested Customer Engagement Approach
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {synthesis?.strategicRecommendations?.engagementApproach || 
                  `Deploy proactive digital-first engagement paired with automated account incentives. Initiate outreach 10 to 14 days prior to upcoming billing renewal cycle to preempt competitor switching behavior. For accounts with active support tickets, ensure senior technical resolution before introducing contract extension offers.`}
              </p>
            </div>

            {/* Tactical Action Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Recommended Action Plan
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(synthesis?.strategicRecommendations?.actionPlan || [
                  `Initiate ${finalDecision === 'Priority Retention' ? 'VIP executive care outreach' : 'automated digital loyalty notification'} via SMS and mobile app channels.`,
                  `Offer targeted contract commitment incentive aligned with ${recScenarioName} budget parameters.`,
                  `Address outstanding customer service issues and verify billing transparency to eliminate support friction points.`,
                  `Monitor subscriber usage patterns and engagement metrics post-intervention for 90 days to confirm retention stability.`
                ]).map((action, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Business Impact & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Expected Business Impact
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {synthesis?.strategicRecommendations?.expectedBusinessImpact || 
                    `Securing customer retention preserves recurring cash flow of ${formatIDR(monthlyCharges)} per month, contributing an estimated net economic gain of ${recFin ? formatIDR(recFin.expectedNetGain) : 'significant cash flow'} over the projected subscriber lifecycle.`}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  Important Risks &amp; Planning Limitations
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {synthesis?.strategicRecommendations?.risksAndLimitations || 
                    `Figures are derived from standard telecommunications business planning models and AI-assisted churn scoring rather than guaranteed commercial outcomes. Retention effectiveness depends on competitor pricing shifts and frontline agent execution fidelity.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            DOCUMENT FOOTER & SIGN-OFF BLOCK
            ======================================================================= */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>CONFIDENTIAL &bull; Telecommunications Enterprise Customer Retention Taskforce</span>
          </div>
          <div>
            Synthesized via Google Gemini 3.8 Flash &bull; Enterprise Decision Support
          </div>
        </div>
      </div>
    </div>
  );
};
