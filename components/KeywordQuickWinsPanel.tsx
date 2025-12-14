import React from "react";

interface QuickWin {
  keyword: string;
  city: string;
  currentRank: number;
  volume: number;
  action: string;
}

interface KeywordQuickWinsPanelProps {
  quickWins: QuickWin[];
}

const KeywordQuickWinsPanel: React.FC<KeywordQuickWinsPanelProps> = ({
  quickWins,
}) => {
  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        ⚡ Quick Wins
        <span className="text-sm font-normal text-gray-400">
          (Pages ranking #4-10 with easy improvements)
        </span>
      </h3>

      <div className="space-y-3">
        {quickWins.map((win, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-emerald-900/10 to-transparent rounded-lg border border-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-medium">{win.keyword}</p>
                <p className="text-gray-400 text-sm">{win.city}</p>
              </div>
              <div className="text-right">
                <p className="text-amber-400 font-semibold">#{win.currentRank}</p>
                <p className="text-gray-500 text-xs">{win.volume} vol/mo</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400">→</span>
              <p className="text-emerald-300">{win.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordQuickWinsPanel;