import React from "react";
import { TrackedCompetitor } from "../types";

interface CompetitorScoreCardProps {
  competitor: TrackedCompetitor;
  onClick: () => void;
  isSelected: boolean;
}

const CompetitorScoreCard: React.FC<CompetitorScoreCardProps> = ({
  competitor,
  onClick,
  isSelected,
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <span className="text-red-400">↑ Threat</span>;
      case "declining":
        return <span className="text-green-400">↓ Weakening</span>;
      default:
        return <span className="text-gray-400">→ Stable</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-red-400"; // High threat
    if (score >= 60) return "text-orange-400";
    if (score >= 40) return "text-yellow-400";
    return "text-green-400"; // Low threat
  };

  return (
    <div
      onClick={onClick}
      className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-750 border-2 ${
        isSelected ? "border-purple-500" : "border-transparent"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-white font-semibold">{competitor.name}</h4>
          <p className="text-gray-400 text-xs">{competitor.domain}</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${getScoreColor(competitor.overallScore)}`}>
            {competitor.overallScore}
          </p>
          <p className="text-gray-500 text-xs">Threat Score</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-gray-700/50 rounded p-2">
          <p className="text-gray-500">Avg Position</p>
          <p className="text-white font-medium">#{competitor.avgPosition.toFixed(1)}</p>
        </div>
        <div className="bg-gray-700/50 rounded p-2">
          <p className="text-gray-500">Est. Traffic</p>
          <p className="text-white font-medium">{competitor.totalTraffic.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Trend:</span>
          {getTrendIcon(competitor.trend)}
        </div>
        {competitor.recentChanges > 0 && (
          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs">
            {competitor.recentChanges} changes
          </span>
        )}
      </div>
    </div>
  );
};

export default CompetitorScoreCard;