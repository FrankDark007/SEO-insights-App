import React from 'react';
import { ChecklistItem as ItemType } from '../types';
import { Check, Loader2, AlertCircle, PlayCircle, ExternalLink } from 'lucide-react';

interface ChecklistItemProps {
  item: ItemType;
  onVerify: (item: ItemType) => void;
  verifying: boolean;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onVerify, verifying }) => {
  const getStatusIcon = () => {
      switch (item.status) {
          case 'verified':
          case 'completed': return <Check className="w-5 h-5 text-emerald-500" />;
          case 'in_progress': return <Loader2 className="w-5 h-5 text-amber-500" />;
          case 'blocked': return <AlertCircle className="w-5 h-5 text-gray-500" />;
          default: return <div className="w-5 h-5 rounded border border-gray-600"></div>;
      }
  };

  const getPriorityColor = (p: string) => {
      switch (p) {
          case 'critical': return 'text-rose-400 border-rose-900/50 bg-rose-900/10';
          case 'high': return 'text-orange-400 border-orange-900/50 bg-orange-900/10';
          case 'medium': return 'text-yellow-400 border-yellow-900/50 bg-yellow-900/10';
          default: return 'text-blue-400 border-blue-900/50 bg-blue-900/10';
      }
  };

  return (
    <div className={`p-4 rounded-xl border transition-all ${
        item.status === 'verified' || item.status === 'completed' 
        ? 'bg-gray-900/30 border-gray-800 opacity-60' 
        : 'bg-[#161b22] border-gray-700 shadow-md hover:border-gray-600'
    }`}>
      <div className="flex items-start gap-4">
          <div className="mt-1">{getStatusIcon()}</div>
          <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-bold text-sm ${item.status === 'verified' ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {item.title}
                  </h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                  </span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{item.description}</p>
              
              {item.status !== 'verified' && item.status !== 'completed' && (
                  <div className="flex gap-3">
                      <button 
                        className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                        onClick={() => alert(item.instructions)}
                      >
                          <ExternalLink className="w-3 h-3" /> View Instructions
                      </button>
                      <button 
                        onClick={() => onVerify(item)}
                        disabled={verifying}
                        className="text-xs flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                      >
                          {verifying ? <Loader2 className="w-3 h-3 animate-spin"/> : <PlayCircle className="w-3 h-3"/>}
                          Verify Fix
                      </button>
                  </div>
              )}
              {item.status === 'verified' && (
                  <p className="text-xs text-emerald-500 flex items-center gap-1 mt-2">
                      <Check className="w-3 h-3" /> Verified {item.verifiedAt ? new Date(item.verifiedAt).toLocaleDateString() : ''}
                  </p>
              )}
          </div>
      </div>
    </div>
  );
};

export default ChecklistItem;