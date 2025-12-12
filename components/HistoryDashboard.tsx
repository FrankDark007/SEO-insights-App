import React from 'react';
import { RichResultHistoryEntry } from '../types';
import { Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface HistoryDashboardProps {
  history: RichResultHistoryEntry[];
}

const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-400" /> Recent Changes
      </h3>
      <div className="space-y-4">
        {history.map((entry) => (
          <div key={entry.id} className="flex gap-4 p-3 rounded-lg hover:bg-gray-800/30 transition-colors border border-transparent hover:border-gray-800">
            <div className={`mt-1 p-1.5 rounded-full ${
                entry.changeType === 'gained' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'
            }`}>
                {entry.changeType === 'gained' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <p className="text-sm font-bold text-white">{entry.domain} {entry.changeType} {entry.featureType}</p>
                    <span className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    Keyword: <span className="text-indigo-300">{entry.keyword}</span> • {entry.details}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryDashboard;