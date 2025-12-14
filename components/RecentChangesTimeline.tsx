import React from "react";
import { CompetitorChange } from "../types";

interface RecentChangesTimelineProps {
  changes: CompetitorChange[];
  filterCompetitor?: string;
}

const RecentChangesTimeline: React.FC<RecentChangesTimelineProps> = ({
  changes,
  filterCompetitor,
}) => {
  const filteredChanges = filterCompetitor
    ? changes.filter((c) => c.competitor === filterCompetitor)
    : changes;

  const getChangeIcon = (type: string) => {
    const icons: Record<string, string> = {
      new_page: "📄",
      content_update: "✏️",
      backlink_gained: "🔗",
      schema_added: "📋",
      ranking_jump: "📈",
      new_feature: "⚡",
      speed_improvement: "🚀",
      design_change: "🎨",
    };
    return icons[type] || "📌";
  };

  const getImpactBadge = (impact: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-500/20 text-red-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      low: "bg-blue-500/20 text-blue-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[impact]}`}>
        {impact} impact
      </span>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        🔔 Recent Competitor Changes
        <span className="text-sm font-normal text-gray-400">
          ({filteredChanges.length} detected)
        </span>
      </h3>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {filteredChanges.map((change, index) => (
          <div
            key={index}
            className="relative pl-8 pb-4 border-l-2 border-gray-700 last:border-l-0"
          >
            <div className="absolute left-0 top-0 -translate-x-1/2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-sm">
              {getChangeIcon(change.changeType)}
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-white font-medium">{change.description}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {change.competitor} • {change.detectedDate}
                  </p>
                </div>
                {getImpactBadge(change.impact)}
              </div>

              {change.rankingEffect && (
                <p className="text-green-400 text-sm mb-2">
                  📈 Effect: {change.rankingEffect}
                </p>
              )}

              <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                <p className="text-purple-400 text-xs font-medium mb-1">Your Action:</p>
                <p className="text-purple-200 text-sm">{change.yourAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentChangesTimeline;