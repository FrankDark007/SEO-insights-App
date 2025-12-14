import React from "react";
import { CompetitorMovement } from "../types";

interface CompetitorThreatPanelProps {
  competitors: CompetitorMovement[];
}

const CompetitorThreatPanel: React.FC<CompetitorThreatPanelProps> = ({
  competitors,
}) => {
  const getThreatBadge = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "new_content":
        return "📝";
      case "ranking_change":
        return "📊";
      case "new_backlinks":
        return "🔗";
      case "technical_update":
        return "🔧";
      default:
        return "📌";
    }
  };

  const sortedCompetitors = [...competitors].sort((a, b) => {
    const threatOrder = { high: 0, medium: 1, low: 2 };
    return threatOrder[a.threatLevel] - threatOrder[b.threatLevel];
  });

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        ⚔️ Competitor Activity
      </h3>

      <div className="space-y-4">
        {sortedCompetitors.map((competitor, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              competitor.threatLevel === "high"
                ? "border-red-500/30 bg-red-500/5"
                : "border-gray-700 bg-gray-700/30"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{competitor.domain}</span>
                <span className={`px-2 py-0.5 rounded text-xs border ${getThreatBadge(competitor.threatLevel)}`}>
                  {competitor.threatLevel} threat
                </span>
              </div>
            </div>

            {competitor.changes.length > 0 && (
              <div className="space-y-2 mb-3">
                {competitor.changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span>{getChangeIcon(change.type)}</span>
                    <span className="text-gray-300">{change.description}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      change.impact === "high" ? "bg-red-500/20 text-red-400" :
                      change.impact === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-gray-600 text-gray-400"
                    }`}>
                      {change.impact}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              {competitor.keywordsGained.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Keywords Gained</p>
                  <div className="flex flex-wrap gap-1">
                    {competitor.keywordsGained.map((kw, i) => (
                      <span key={i} className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {competitor.keywordsLost.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Keywords Lost</p>
                  <div className="flex flex-wrap gap-1">
                    {competitor.keywordsLost.map((kw, i) => (
                      <span key={i} className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorThreatPanel;