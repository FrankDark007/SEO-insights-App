import React, { useState } from "react";
import { LinkBuildingStrategy } from "../types";

interface LinkBuildingStrategiesProps {
  strategies: LinkBuildingStrategy[];
}

const LinkBuildingStrategies: React.FC<LinkBuildingStrategiesProps> = ({
  strategies,
}) => {
  const [expandedStrategy, setExpandedStrategy] = useState<number | null>(0);

  const getStrategyIcon = (type: string) => {
    const icons: Record<string, string> = {
      "guest-post": "✍️",
      "resource-page": "📚",
      "broken-link": "🔗",
      "skyscraper": "🏗️",
      "digital-pr": "📰",
      "local-citation": "📍",
      "partnership": "🤝",
    };
    return icons[type] || "🔗";
  };

  const getEffortBadge = (effort: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-500/20 text-green-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      high: "bg-red-500/20 text-red-400",
    };
    return colors[effort] || colors.medium;
  };

  const getImpactBadge = (impact: string) => {
    const colors: Record<string, string> = {
      high: "bg-green-500/20 text-green-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      low: "bg-gray-500/20 text-gray-400",
    };
    return colors[impact] || colors.medium;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        📋 Link Building Strategies
      </h3>

      <div className="space-y-3">
        {strategies.map((strategy, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-700 bg-gray-700/30 overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-700/50"
              onClick={() => setExpandedStrategy(expandedStrategy === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStrategyIcon(strategy.strategyType)}</span>
                  <div>
                    <p className="text-white font-medium capitalize">
                      {strategy.strategyType.replace(/-/g, " ")}
                    </p>
                    <p className="text-gray-400 text-sm">{strategy.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Effort</p>
                    <span className={`px-2 py-0.5 rounded text-xs ${getEffortBadge(strategy.estimatedEffort)}`}>
                      {strategy.estimatedEffort}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Impact</p>
                    <span className={`px-2 py-0.5 rounded text-xs ${getImpactBadge(strategy.estimatedImpact)}`}>
                      {strategy.estimatedImpact}
                    </span>
                  </div>
                  <span className={`transform transition-transform ${expandedStrategy === index ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {expandedStrategy === index && (
              <div className="px-4 pb-4 border-t border-gray-700 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Target Sites</p>
                    <div className="flex flex-wrap gap-2">
                      {strategy.targets.map((target, i) => (
                        <span key={i} className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                          {target}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Timeframe</p>
                    <p className="text-white">{strategy.timeframe}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-xs mb-2">Implementation Steps</p>
                  <ol className="space-y-2">
                    {strategy.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkBuildingStrategies;