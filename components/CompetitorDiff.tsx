import React from 'react';
import { Alert } from '../types';
import { ArrowRight, FileDiff } from 'lucide-react';

interface CompetitorDiffProps {
  alert: Alert;
}

const CompetitorDiff: React.FC<CompetitorDiffProps> = ({ alert }) => {
  if (!alert.details.oldValue && !alert.details.newValue) return null;

  return (
    <div className="mt-3 bg-gray-900/50 rounded-lg border border-gray-700 p-3 text-sm">
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">
        <FileDiff className="w-3 h-3" />
        Change Detected
      </div>
      
      {/* Title / Meta Changes */}
      {(alert.type === 'title_change' || alert.type === 'meta_change') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <span className="text-xs text-rose-400 bg-rose-900/20 px-1.5 py-0.5 rounded">Before</span>
                <p className="text-gray-400 line-through decoration-rose-500/50">{alert.details.oldValue || '(None)'}</p>
            </div>
            <div className="space-y-1 relative">
                <div className="hidden md:block absolute -left-5 top-1/2 -translate-y-1/2 text-gray-600">
                    <ArrowRight className="w-4 h-4" />
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded">After</span>
                <p className="text-white">{alert.details.newValue}</p>
            </div>
        </div>
      )}

      {/* Metric Changes (Reviews, Ratings) */}
      {(alert.type === 'review_change' || alert.type === 'rating_change' || alert.type === 'new_backlink') && (
         <div className="flex items-center gap-3">
             <div className="text-gray-400">
                 Previous: <span className="font-mono text-white">{alert.details.oldValue || 0}</span>
             </div>
             <ArrowRight className="w-4 h-4 text-gray-600" />
             <div className="text-white font-bold">
                 Current: <span className="font-mono text-emerald-400">{alert.details.newValue}</span>
             </div>
             {alert.details.change && (
                 <span className={`text-xs px-2 py-0.5 rounded ${
                     alert.details.change > 0 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'
                 }`}>
                     {alert.details.change > 0 ? '+' : ''}{alert.details.change}
                 </span>
             )}
         </div>
      )}

      {/* New Page */}
      {alert.type === 'new_page' && (
          <div>
              <span className="text-xs text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded mb-1 inline-block">New URL</span>
              <a href={alert.details.url} target="_blank" rel="noreferrer" className="block text-indigo-400 hover:underline break-all">
                  {alert.details.url}
              </a>
          </div>
      )}
    </div>
  );
};

export default CompetitorDiff;