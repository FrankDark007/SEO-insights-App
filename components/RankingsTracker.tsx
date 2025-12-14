import React from "react";
import { RankingSnapshot } from "../types";

interface RankingsTrackerProps {
  rankings: RankingSnapshot[];
}

const RankingsTracker: React.FC<RankingsTrackerProps> = ({ rankings }) => {
  const getTrendIcon = (trend: string, change: number) => {
    switch (trend) {
      case "up":
        return <span className="text-green-400">↑ {Math.abs(change)}</span>;
      case "down":
        return <span className="text-red-400">↓ {Math.abs(change)}</span>;
      case "stable":
        return <span className="text-gray-400">→ 0</span>;
      case "new":
        return <span className="text-blue-400">NEW</span>;
      case "lost":
        return <span className="text-red-400">LOST</span>;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number | null) => {
    if (rank === null) return "bg-gray-600 text-gray-400";
    if (rank <= 3) return "bg-green-500/20 text-green-400";
    if (rank <= 10) return "bg-blue-500/20 text-blue-400";
    if (rank <= 20) return "bg-yellow-500/20 text-yellow-400";
    return "bg-gray-600 text-gray-400";
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        📊 Ranking Tracker
      </h3>

      <div className="space-y-3">
        {rankings.map((ranking, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              ranking.trend === "down"
                ? "border-red-500/30 bg-red-500/5"
                : ranking.trend === "up"
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-gray-700 bg-gray-700/30"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <p className="text-white font-medium">{ranking.keyword}</p>
                <p className="text-gray-500 text-xs truncate">{ranking.url}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Volume</p>
                  <p className="text-gray-300">{ranking.searchVolume.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs">Change</p>
                  {getTrendIcon(ranking.trend, ranking.change)}
                </div>
                <div className={`px-4 py-2 rounded-lg ${getRankBadge(ranking.currentRank)}`}>
                  <p className="text-2xl font-bold">
                    {ranking.currentRank !== null ? `#${ranking.currentRank}` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Competitor mini rankings */}
            <div className="flex gap-2 mt-2">
              {ranking.competitors.slice(0, 4).map((comp, i) => (
                <div key={i} className="flex items-center gap-1 text-xs bg-gray-700/50 px-2 py-1 rounded">
                  <span className="text-gray-400 truncate max-w-20">{comp.domain.replace('.com', '')}</span>
                  <span className="text-white font-medium">#{comp.rank}</span>
                  {comp.change !== 0 && (
                    <span className={comp.change > 0 ? "text-red-400" : "text-green-400"}>
                      {comp.change > 0 ? `↓${comp.change}` : `↑${Math.abs(comp.change)}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingsTracker;