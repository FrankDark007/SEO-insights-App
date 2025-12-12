import React from 'react';
import { VerificationResult, ChecklistItem } from '../types';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ChecklistItem | null;
  result: VerificationResult | null;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, item, result }) => {
  if (!isOpen || !item || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161b22] border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Verification Result</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
            <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Task</p>
                <p className="text-white text-sm">{item.title}</p>
            </div>

            <div className={`p-4 rounded-xl border mb-6 ${
                result.passed ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-rose-900/20 border-rose-500/30'
            }`}>
                <div className="flex items-center gap-3 mb-3">
                    {result.passed ? (
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    ) : (
                        <XCircle className="w-8 h-8 text-rose-500" />
                    )}
                    <div>
                        <h4 className={`text-lg font-bold ${result.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {result.passed ? 'PASSED' : 'FAILED'}
                        </h4>
                        <p className="text-xs text-gray-400">
                            {result.passed ? 'Fix verified successfully.' : 'Issue persists.'}
                        </p>
                    </div>
                </div>

                <div className="space-y-1 pl-11">
                    {result.details.map((detail, i) => (
                        <p key={i} className="text-sm text-gray-300">• {detail}</p>
                    ))}
                </div>
            </div>

            {!result.passed && result.diagnosis && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <h5 className="text-sm font-bold text-white mb-2">Diagnosis</h5>
                    <p className="text-sm text-gray-400 mb-4">{result.diagnosis}</p>
                    
                    <h5 className="text-sm font-bold text-white mb-2">Recommended Fix</h5>
                    <p className="text-sm text-indigo-300">{result.recommendedFix}</p>
                </div>
            )}
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;