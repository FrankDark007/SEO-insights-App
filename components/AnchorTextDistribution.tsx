import React from "react";
import { AnchorTextAnalysis } from "../types";

interface AnchorTextDistributionProps {
  analysis: AnchorTextAnalysis;
}

const AnchorTextDistribution: React.FC<AnchorTextDistributionProps> = ({
  analysis,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      healthy: "text-green-400",
      warning: "text-yellow-400",
      danger: "text-red-400",
    };
    return colors[status] || "text-gray-400";
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          ⚓ Anchor Text Distribution
        </h3>
        <div className="flex items-center gap-2">
          {analysis.overOptimized && (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase border border-red-500/50">
              ⚠️ Over-Optimized
            </span>
          )}
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="space-y-4 mb-6">
        {analysis.distribution.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium capitalize text-sm">{item.type.replace(/-/g, " ")}</span>
                <span className={`text-[10px] uppercase font-bold ${getStatusBadge(item.status)}`}>
                  ({item.status})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">{item.count} links</span>
                <span className="text-white font-mono font-bold text-sm">{item.percentage}%</span>
              </div>
            </div>
            <div className="relative h-6 bg-gray-700 rounded-lg overflow-hidden">
              <div
                className={`absolute h-full ${getStatusColor(item.status)} rounded-lg transition-all`}
                style={{ width: `${item.percentage}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center px-2">
                <span className="text-xs text-white/90 truncate drop-shadow-md">
                  Examples: {item.examples.slice(0, 3).join(", ")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Branded Ratio</p>
          <div className="flex items-end gap-2">
            <p className={`text-2xl font-bold ${analysis.brandedRatio >= 30 ? "text-green-400" : "text-yellow-400"}`}>
                {analysis.brandedRatio}%
            </p>
            <p className="text-gray-500 text-xs mb-1">Target: 30-50%</p>
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Exact Match Ratio</p>
          <div className="flex items-end gap-2">
            <p className={`text-2xl font-bold ${analysis.exactMatchRatio <= 20 ? "text-green-400" : "text-red-400"}`}>
                {analysis.exactMatchRatio}%
            </p>
            <p className="text-gray-500 text-xs mb-1">Target: &lt;20%</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-lg">
        <p className="text-indigo-300 text-xs uppercase font-bold mb-2">Analysis Recommendations</p>
        <ul className="space-y-2">
          {analysis.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-indigo-400 mt-1">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnchorTextDistribution;
