import React from 'react';
import { QuickWin } from '../types';
import { Zap, ArrowRight, Star } from 'lucide-react';

interface QuickWinsPanelProps {
  wins: QuickWin[];
}

const QuickWinsPanel: React.FC<QuickWinsPanelProps> = ({ wins }) => {
  if (!wins || wins.length === 0) return (
      <div className="p-8 text-center text-gray-500 bg-[#161b22] rounded-xl border border-gray-800">
          No immediate quick wins detected. Check configuration.
      </div>
  );

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-violet-900/20 border border-indigo-500/30 rounded-xl p-6 shadow-lg">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-400" /> Quick Win Opportunities
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wins.map((win, i) => (
          <div key={i} className="bg-[#161b22]/80 border border-gray-700 p-4 rounded-xl hover:border-indigo-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                    Priority {win.priorityScore}
                </span>
                <span className="text-xs text-gray-500">Rank #{win.yourPosition}</span>
            </div>
            
            <h4 className="font-bold text-white text-sm mb-1 truncate" title={win.yourPage}>{win.yourPage}</h4>
            <p className="text-xs text-gray-400 mb-3">"{win.keyword}"</p>
            
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-rose-400">Missing:</span> 
                    <span className="font-medium text-white">{win.missingFeature}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>Competitor at #{win.competitorWithFeature.position} has it</span>
                </div>
            </div>
            
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors opacity-90 group-hover:opacity-100">
                Generate Schema
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickWinsPanel;