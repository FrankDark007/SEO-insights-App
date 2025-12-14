import React from "react";
import { KeywordBattle } from "../types";

interface KeywordBattleTableProps {
  battles: KeywordBattle[];
}

const KeywordBattleTable: React.FC<KeywordBattleTableProps> = ({ battles }) => {
  const getDifficultyBadge = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: "bg-green-500/20 text-green-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      hard: "bg-red-500/20 text-red-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs ${colors[difficulty]}`}>
        {difficulty}
      </span>
    );
  };

  const getRankDisplay = (rank: number | null) => {
    if (rank === null) return <span className="text-gray-500">—</span>;
    if (rank <= 3) return <span className="text-green-400 font-bold">#{rank}</span>;
    if (rank <= 10) return <span className="text-yellow-400">#{rank}</span>;
    return <span className="text-gray-400">#{rank}</span>;
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <span className="text-green-400 text-xs">↑{change}</span>;
    if (change < 0) return <span className="text-red-400 text-xs">↓{Math.abs(change)}</span>;
    return <span className="text-gray-500 text-xs">—</span>;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        ⚔️ Keyword Battles
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-3 text-gray-400 font-medium">Keyword</th>
              <th className="text-right py-3 px-3 text-gray-400 font-medium">Volume</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">You</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">#1</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">#2</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">#3</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Gap</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {battles.map((battle, index) => (
              <tr
                key={index}
                className="border-b border-gray-700/50 hover:bg-gray-700/30"
              >
                <td className="py-3 px-3">
                  <p className="text-white font-medium">{battle.keyword}</p>
                  <p className="text-gray-500 text-xs truncate max-w-[250px]">
                    {battle.opportunity}
                  </p>
                </td>
                <td className="py-3 px-3 text-right text-gray-300">
                  {battle.monthlyVolume.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-center">
                  {getRankDisplay(battle.yourRank)}
                </td>
                {battle.competitors.slice(0, 3).map((comp, i) => (
                  <td key={i} className="py-3 px-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-white">#{comp.rank}</span>
                      <span className="text-gray-500 text-xs truncate max-w-[80px]">
                        {comp.domain.replace('www.', '').split('.')[0]}
                      </span>
                      {getChangeIndicator(comp.change)}
                    </div>
                  </td>
                ))}
                <td className="py-3 px-3 text-center">
                  {battle.yourRank ? (
                    <span className="text-orange-400 font-medium">
                      {battle.gap} behind
                    </span>
                  ) : (
                    <span className="text-red-400">Not ranking</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  {getDifficultyBadge(battle.difficulty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordBattleTable;