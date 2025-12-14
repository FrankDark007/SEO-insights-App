import React, { useState } from "react";
import { TrackedKeyword } from "../types";

interface KeywordTableProps {
  keywords: TrackedKeyword[];
  filterCity?: string;
}

const KeywordTable: React.FC<KeywordTableProps> = ({ keywords, filterCity }) => {
  const [sortBy, setSortBy] = useState<"volume" | "priority" | "rank">("priority");
  const [filterStatus, setFilterStatus] = useState<"all" | "ranking" | "notRanking">("all");

  const filteredKeywords = keywords
    .filter((kw) => !filterCity || kw.city === filterCity)
    .filter((kw) => {
      if (filterStatus === "ranking") return kw.yourRank !== null;
      if (filterStatus === "notRanking") return kw.yourRank === null;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "volume") return b.monthlyVolume - a.monthlyVolume;
      if (sortBy === "rank") {
        if (a.yourRank === null) return 1;
        if (b.yourRank === null) return -1;
        return a.yourRank - b.yourRank;
      }
      // priority
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-rose-500/20 text-rose-400",
      high: "bg-orange-500/20 text-orange-400",
      medium: "bg-amber-500/20 text-amber-400",
      low: "bg-blue-500/20 text-blue-400",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${colors[priority]}`}>
        {priority}
      </span>
    );
  };

  const getTrendIcon = (trend: string, percent: number) => {
    if (trend === "rising") {
      return <span className="text-emerald-400">↑ +{percent}%</span>;
    }
    if (trend === "declining") {
      return <span className="text-rose-400">↓ {percent}%</span>;
    }
    return <span className="text-gray-400">→ {percent}%</span>;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors: Record<string, string> = {
      low: "text-emerald-400",
      medium: "text-amber-400",
      high: "text-rose-400",
    };
    return <span className={colors[difficulty]}>{difficulty}</span>;
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-white">
          📊 Keyword Opportunities ({filteredKeywords.length})
        </h3>

        <div className="flex gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Keywords</option>
            <option value="ranking">Ranking</option>
            <option value="notRanking">Not Ranking</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="priority">Sort: Priority</option>
            <option value="volume">Sort: Volume</option>
            <option value="rank">Sort: Rank</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/50">
              <th className="py-3 px-3 text-gray-400 font-medium">Keyword</th>
              <th className="py-3 px-3 text-gray-400 font-medium">City</th>
              <th className="text-right py-3 px-3 text-gray-400 font-medium">Volume</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Trend</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Difficulty</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Your Rank</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Has Page</th>
              <th className="text-center py-3 px-3 text-gray-400 font-medium">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredKeywords.slice(0, 50).map((kw, index) => (
              <tr
                key={index}
                className="hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3 px-3">
                  <p className="text-white font-medium">{kw.keyword}</p>
                  <p className="text-gray-500 text-xs">{kw.seasonality}</p>
                </td>
                <td className="py-3 px-3 text-gray-300">{kw.city}</td>
                <td className="py-3 px-3 text-right text-white font-medium">
                  {kw.monthlyVolume.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-center text-sm">
                  {getTrendIcon(kw.volumeTrend, kw.trendPercent)}
                </td>
                <td className="py-3 px-3 text-center capitalize">
                  {getDifficultyBadge(kw.difficulty)}
                </td>
                <td className="py-3 px-3 text-center">
                  {kw.yourRank ? (
                    <span
                      className={`font-medium ${
                        kw.yourRank <= 3
                          ? "text-emerald-400"
                          : kw.yourRank <= 10
                            ? "text-amber-400"
                            : "text-gray-400"
                      }`}
                    >
                      #{kw.yourRank}
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  {kw.hasPage ? (
                    <span className="text-emerald-400 font-bold">✓</span>
                  ) : (
                    <span className="text-rose-400 font-bold">✗</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  {getPriorityBadge(kw.priority)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredKeywords.length > 50 && (
        <p className="text-gray-500 text-sm text-center mt-4">
          Showing 50 of {filteredKeywords.length} keywords
        </p>
      )}
    </div>
  );
};

export default KeywordTable;