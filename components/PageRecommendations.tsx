import React from "react";
import { PageRecommendation } from "../types";

interface PageRecommendationsProps {
  recommendations: PageRecommendation[];
}

const PageRecommendations: React.FC<PageRecommendationsProps> = ({
  recommendations,
}) => {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "border-rose-500 bg-rose-900/10",
      high: "border-orange-500 bg-orange-900/10",
      medium: "border-amber-500 bg-amber-900/10",
      low: "border-blue-500 bg-blue-900/10",
    };
    return colors[priority] || "border-gray-500";
  };

  const sortedRecs = [...recommendations].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          📝 Pages to Create
          <span className="text-sm font-normal px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded">
            {recommendations.length} recommendations
          </span>
        </h3>
      </div>

      <div className="space-y-4">
        {sortedRecs.map((rec, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded border border-gray-700">
                    {rec.city}
                  </span>
                  <span className="text-xs text-gray-500">
                    {rec.estimatedVolume.toLocaleString()} monthly searches
                  </span>
                </div>

                <h4 className="text-white font-medium mb-1">{rec.suggestedTitle}</h4>
                <p className="text-violet-400 text-sm font-mono mb-2">
                  {rec.suggestedUrl}
                </p>
                <p className="text-gray-400 text-sm">{rec.reason}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-gray-500 text-xs">Projected Traffic</p>
                <p className="text-emerald-400 font-semibold text-lg">
                  +{rec.projectedTraffic}/mo
                </p>
                <p className="text-gray-500 text-xs mt-1">Difficulty</p>
                <p
                  className={`font-medium capitalize ${
                    rec.difficulty === "low"
                      ? "text-emerald-400"
                      : rec.difficulty === "medium"
                        ? "text-amber-400"
                        : "text-rose-400"
                  }`}
                >
                  {rec.difficulty}
                </p>
              </div>
            </div>

            {rec.competitorUrls.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <p className="text-gray-500 text-xs mb-1">Competitor examples:</p>
                <div className="flex flex-wrap gap-2">
                  {rec.competitorUrls.slice(0, 3).map((url, i) => (
                    <span
                      key={i}
                      className="text-xs text-indigo-400 bg-indigo-900/20 px-2 py-1 rounded truncate max-w-[200px] border border-indigo-900/30"
                    >
                      {url}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageRecommendations;