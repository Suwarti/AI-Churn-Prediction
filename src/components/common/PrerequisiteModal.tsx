import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const PrerequisiteModal: React.FC = () => {
  const { prerequisiteModal, closePrerequisiteModal, setActiveTab } = useCustomer();

  if (!prerequisiteModal) return null;

  const handleGoToRequired = () => {
    setActiveTab(prerequisiteModal.requiredTab);
    closePrerequisiteModal();
  };

  const buttonLabel = prerequisiteModal.requiredTab === 'prediction'
    ? 'GO TO CHURN PREDICTION'
    : `GO TO ${prerequisiteModal.requiredTitle.toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 text-center">
        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block">
            Prerequisite Required
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Please complete {prerequisiteModal.requiredTitle} first
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed px-2">
            {prerequisiteModal.reason}
          </p>
        </div>

        {/* Single Primary Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGoToRequired}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/40"
          >
            <span>{buttonLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
