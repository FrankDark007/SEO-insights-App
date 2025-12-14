import React from "react";
import { LinkHealthScore } from "../types";

interface LinkHealthScoreCardProps {
  healthScore: LinkHealthScore;
  summary: {
    healthStatus: string;
    biggestIssue: string;
    topPriority: string;
    quickWin: string;
  };
}

const LinkHealthScoreCard: React.FC<LinkHealthScoreCardProps> = ({
  healthScore,
  summary,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-yellow-600";
    if (score >= 40) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      good: "bg-green-500/20 text-green-400",
      warning: "bg-yellow-500/20 text-yellow-400",
      critical: "bg-red-500/20 text-red-400",
    };
    return colors[status] || colors.warning;
  };

  const getHealthStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      healthy: "text-green-400",
      "needs-attention": "text-yellow-400",
      "at-risk": "text-orange-400",
      critical: "text-red-400",
    };
    return colors[status] || "text-gray-400";
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            🏥 Link Profile Health Score
          </h3>
          <p className={`text-sm mt-1 uppercase font-bold ${getHealthStatusColor(summary.healthStatus)}`}>
            Status: {summary.healthStatus.replace(/-/g, " ")}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-bold ${getScoreColor(healthScore.overall)}`}>
            {healthScore.overall}
          </div>
          <p className="text-gray-400 text-sm">out of 100</p>
        </div>
      </div>

      {/* Score Bar */}
      <div className="relative h-4 bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className={`absolute h-full bg-gradient-to-r ${getScoreGradient(healthScore.overall)} rounded-full transition-all duration-500`}
          style={{ width: `${healthScore.overall}%` }}
        ></div>
        <div className="absolute inset-0 flex">
          <div className="w-1/4 border-r border-gray-600"></div>
          <div className="w-1/4 border-r border-gray-600"></div>
          <div className="w-1/4 border-r border-gray-600"></div>
          <div className="w-1/4"></div>
        </div>
      </div>

      {/* Component Scores */}
      <div className="space-y-3 mb-6">
        {healthScore.components.map((component, index) => (
          <div key={index} className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-lg border border-gray-700/50">
            <div className="w-36 text-gray-300 text-sm font-medium">{component.name}</div>
            <div className="flex-1">
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full rounded-full ${
                    component.status === "good"
                      ? "bg-green-500"
                      : component.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${component.score}%` }}
                ></div>
              </div>
            </div>
            <div className={`w-10 text-right font-bold text-sm ${getScoreColor(component.score)}`}>
              {component.score}
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold w-20 text-center ${getStatusBadge(component.status)}`}>
              {component.status}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-xs mb-1 uppercase font-bold">⚠️ Biggest Issue</p>
          <p className="text-white text-sm">{summary.biggestIssue}</p>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-xs mb-1 uppercase font-bold">🎯 Top Priority</p>
          <p className="text-yellow-400 text-sm">{summary.topPriority}</p>
        </div>
        <div className="md:col-span-2 bg-emerald-900/10 p-3 rounded-lg border border-emerald-500/20">
          <p className="text-emerald-400/70 text-xs mb-1 uppercase font-bold">⚡ Quick Win</p>
          <p className="text-emerald-400 text-sm">{summary.quickWin}</p>
        </div>
      </div>
    </div>
  );
};

export default LinkHealthScoreCard;
