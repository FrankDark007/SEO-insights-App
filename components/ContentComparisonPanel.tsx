import React, { useState } from "react";
import { ContentComparison } from "../types";

interface ContentComparisonPanelProps {
  comparisons: ContentComparison[];
}

const ContentComparisonPanel: React.FC<ContentComparisonPanelProps> = ({
  comparisons,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (comparisons.length === 0) return null;

  const comparison = comparisons[activeIndex];

  const getWinnerBadge = (winner: string) => {
    if (winner === "you") {
      return <span className="text-green-400 font-medium">✓ You</span>;
    }
    if (winner === "them") {
      return <span className="text-red-400 font-medium">✗ Them</span>;
    }
    return <span className="text-gray-400">Tie</span>;
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "border-l-red-500";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-yellow-500";
      default:
        return "border-l-blue-500";
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        📊 Content Structure Comparison
      </h3>

      {/* Keyword Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {comparisons.map((comp, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              activeIndex === index
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {comp.keyword}
          </button>
        ))}
      </div>

      {/* Comparison URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Your Page</p>
          <p className="text-blue-400 font-mono text-sm truncate">
            {comparison.yourUrl || "No page targeting this keyword"}
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Top Competitor</p>
          <p className="text-orange-400 font-mono text-sm truncate">
            {comparison.topCompetitorUrl}
          </p>
        </div>
      </div>

      {/* Metrics Comparison */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Metrics Comparison</h4>
        <div className="space-y-2">
          {comparison.metrics.map((metric, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 bg-gray-700/30 rounded border-l-4 ${getImportanceColor(metric.importance)}`}
            >
              <span className="text-gray-300">{metric.metric}</span>
              <div className="flex items-center gap-4">
                <span
                  className={
                    metric.winner === "you" ? "text-green-400" : "text-gray-400"
                  }
                >
                  {metric.yours}
                </span>
                <span className="text-gray-600">vs</span>
                <span
                  className={
                    metric.winner === "them" ? "text-red-400" : "text-gray-400"
                  }
                >
                  {metric.theirs}
                </span>
                {getWinnerBadge(metric.winner)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <h4 className="text-red-400 font-medium mb-2">Missing Topics</h4>
          <ul className="space-y-1">
            {comparison.missingTopics.map((topic, i) => (
              <li key={i} className="text-red-200 text-sm flex items-center gap-2">
                <span className="text-red-400">•</span> {topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <h4 className="text-orange-400 font-medium mb-2">Missing Schema</h4>
          <ul className="space-y-1">
            {comparison.missingSchema.map((schema, i) => (
              <li key={i} className="text-orange-200 text-sm flex items-center gap-2">
                <span className="text-orange-400">•</span> {schema}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentComparisonPanel;