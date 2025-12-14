import React from "react";
import { Zap } from 'lucide-react';

interface QuickWin {
  action: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
}

interface QuickWinsPanelProps {
  quickWins: QuickWin[];
}

const QuickWinsPanel: React.FC<QuickWinsPanelProps> = ({ quickWins }) => {
  const getEffortBadge = (effort: string) => {
    const colors: Record<string, string> = {
      low: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
      medium: "bg-amber-900/30 text-amber-400 border-amber-800",
      high: "bg-rose-900/30 text-rose-400 border-rose-800",
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colors[effort]}`}>{effort}</span>;
  };

  const getImpactBadge = (impact: string) => {
    const colors: Record<string, string> = {
      high: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
      medium: "bg-amber-900/30 text-amber-400 border-amber-800",
      low: "bg-gray-800 text-gray-400 border-gray-700",
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colors[impact]}`}>{impact}</span>;
  };

  const getPriorityScore = (win: QuickWin) => {
    const effortScore = { low: 3, medium: 2, high: 1 };
    const impactScore = { high: 3, medium: 2, low: 1 };
    return effortScore[win.effort] * impactScore[win.impact];
  };

  const sortedWins = [...quickWins].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> Quick Wins
        <span className="text-xs font-normal text-gray-500 ml-2 bg-gray-900 px-2 py-1 rounded border border-gray-800">Sorted by Priority</span>
      </h3>

      <div className="space-y-3">
        {sortedWins.map((win, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 bg-[#0d1117] hover:bg-[#1f242c] transition-colors ${
              win.effort === "low" && win.impact === "high"
                ? "border-emerald-500"
                : "border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-bold font-mono text-sm">#{index + 1}</span>
                <p className="text-white font-medium text-sm">{win.action}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Effort</p>
                  {getEffortBadge(win.effort)}
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Impact</p>
                  {getImpactBadge(win.impact)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickWinsPanel;