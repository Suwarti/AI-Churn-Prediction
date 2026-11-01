import React, { useState } from 'react';
import { 
  X, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  FileCode2,
  Cpu
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

interface ModelStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelStatusModal: React.FC<ModelStatusModalProps> = ({ isOpen, onClose }) => {
  const { apiStatus, checkApiStatus, updateApiUrl } = useCustomer();
  const [inputUrl, setInputUrl] = useState(apiStatus.apiUrl);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    setIsUpdating(true);
    setFeedback(null);
    const res = await updateApiUrl(inputUrl);
    setIsUpdating(false);
    setFeedback({
      type: res.success ? 'success' : 'error',
      message: res.message,
    });
  };

  const pythonStarterCode = `# 1. Install dependencies in your terminal:
pip install fastapi uvicorn scikit-learn imbalanced-learn joblib pandas

# 2. Place your churn_logistic_regression_smote.pkl model file in model_server/
# 3. Start the prediction server:
python model_server/main.py
# or: uvicorn model_server.main:app --port 8000 --reload`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonStarterCode);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              apiStatus.connected 
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400' 
                : 'bg-amber-950/50 border-amber-500/40 text-amber-400'
            }`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Machine Learning Model Service
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                  apiStatus.connected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {apiStatus.connected ? 'Connected' : 'Disconnected'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Logistic Regression + SMOTE Pipeline Integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Status Alert Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            apiStatus.connected 
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
              : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
          }`}>
            {apiStatus.connected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-semibold text-white">
                {apiStatus.connected
                  ? 'Python Prediction API Connected & Ready'
                  : 'Prediction Service Not Connected'}
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {apiStatus.connected
                  ? `Successfully communicating with external FastAPI service at ${apiStatus.apiUrl}. Live inference will run on churn_logistic_regression_smote.pkl.`
                  : 'All predictions must originate from the actual trained model pipeline. The application does not fabricate fake predictions. Start your FastAPI service or update the endpoint URL below to connect.'}
              </p>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Last checked: {apiStatus.lastChecked || 'Just now'} &bull; Status: {apiStatus.statusMessage}
              </div>
            </div>
          </div>

          {/* Model Specification Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Model Artifact</div>
              <div className="text-xs font-mono font-medium text-amber-300 truncate mt-0.5" title="churn_logistic_regression_smote.pkl">
                churn_logistic...pkl
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Algorithm</div>
              <div className="text-xs font-medium text-slate-200 mt-0.5">
                Logistic Reg + SMOTE
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Feature Count</div>
              <div className="text-xs font-medium text-slate-200 mt-0.5">
                13 Features (4 num, 9 cat)
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Decision Cutoff</div>
              <div className="text-xs font-mono font-medium text-slate-200 mt-0.5">
                0.50 Probability
              </div>
            </div>
          </div>

          {/* API Configuration Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Python FastAPI Service URL (CHURN_API_URL)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleSaveAndTest}
                disabled={isUpdating}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
              >
                {isUpdating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                Save & Test Ping
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              The full-stack Express server routes <code className="text-amber-300 font-mono">/api/model/predict</code> directly to <code className="text-amber-300 font-mono">{inputUrl}/predict</code>.
            </p>
            {feedback && (
              <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                feedback.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/40 text-red-300 border border-red-500/30'
              }`}>
                {feedback.message}
              </div>
            )}
          </div>

          {/* Python Quickstart Code Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-amber-400" />
                How to Run the Python Model Backend Locally:
              </span>
              <button
                onClick={copyToClipboard}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCmd ? 'Copied' : 'Copy Commands'}
              </button>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
              {pythonStarterCode}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Python FastAPI backend with standard scikit-learn pipeline</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
