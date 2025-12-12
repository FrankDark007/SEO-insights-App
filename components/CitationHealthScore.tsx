import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface CitationHealthScoreProps {
  score: number;
  accuracy: number;
  coverage: number;
  consistency: number;
}

const CitationHealthScore: React.FC<CitationHealthScoreProps> = ({ score, accuracy, coverage, consistency }) => {
  const getScoreColor = (val: number) => {
    if (val >= 90) return 'text-emerald-400';
    if (val >= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getProgressBarColor = (val: number) => {
    if (val >= 90) return 'bg-emerald-500';
    if (val >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" /> Citation Health
            </h3>
            <p className="text-xs text-gray-400">Overall NAP consistency score</p>
        </div>
        <div className="text-right">
            <span className={`text-4xl font-black ${getScoreColor(score)}`}>{score}</span>
            <span className="text-gray-500 text-sm">/100</span>
        </div>
      </div>

      <div className="mb-6">
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(score)}`} 
                style={{ width: `${score}%` }}
              ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
              <span>0</span>
              <span>50</span>
              <span>100</span>
          </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-gray-800 pt-4">
          <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Accuracy</p>
              <p className={`text-lg font-bold ${getScoreColor(accuracy)}`}>{accuracy}%</p>
          </div>
          <div className="text-center border-l border-r border-gray-800">
              <p className="text-xs text-gray-400 mb-1">Coverage</p>
              <p className={`text-lg font-bold ${getScoreColor(coverage)}`}>{coverage}%</p>
          </div>
          <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Consistency</p>
              <p className={`text-lg font-bold ${getScoreColor(consistency)}`}>{consistency}%</p>
          </div>
      </div>
    </div>
  );
};

export default CitationHealthScore;