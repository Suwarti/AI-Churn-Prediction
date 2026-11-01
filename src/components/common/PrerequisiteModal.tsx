import React from 'react';
import { Lock, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const PrerequisiteModal: React.FC = () => {
  const { prerequisiteModal, closePrerequisiteModal, setActiveTab } = useCustomer();

  if (!prerequisiteModal) return null;

  const handleGoToRequired = () => {
    setActiveTab(prerequisiteModal.requiredTab);
    closePrerequisiteModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Close Button */}
        <button
          onClick={closePrerequisiteModal}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon */}
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
          <Lock className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            Prerequisite Required
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Please complete {prerequisiteModal.requiredTitle} first
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed px-2">
            {prerequisiteModal.reason}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleGoToRequired}
            className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <span>Go to {prerequisiteModal.requiredTitle}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={closePrerequisiteModal}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
          >
            Stay on Current Tab
          </button>
        </div>
      </div>
    </div>
  );
};
