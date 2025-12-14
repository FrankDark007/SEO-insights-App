import React from "react";
import { KeywordCluster } from "../types";

interface ClusterCoverageProps {
  clusters: KeywordCluster[];
}

const ClusterCoverage: React.FC<ClusterCoverageProps> = ({ clusters }) => {
  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return "bg-emerald-500";
    if (coverage >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getCoverageTextColor = (coverage: number) => {
    if (coverage >= 80) return "text-emerald-400";
    if (coverage >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">
        🎯 Topic Clusters Coverage
      </h3>

      <div className="space-y-4">
        {clusters.map((cluster, index) => (
          <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-white font-medium">{cluster.name}</h4>
                <p className="text-gray-400 text-xs">
                  {cluster.keywords.length} keywords • {cluster.totalVolume.toLocaleString()} monthly volume
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Coverage</p>
                <p className={`text-lg font-bold ${getCoverageTextColor(cluster.coverage)}`}>
                  {cluster.coverage}%
                </p>
              </div>
            </div>

            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute h-full ${getCoverageColor(cluster.coverage)} rounded-full transition-all`}
                style={{ width: `${cluster.coverage}%` }}
              ></div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {cluster.keywords.slice(0, 5).map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded border border-gray-700"
                >
                  {kw}
                </span>
              ))}
              {cluster.keywords.length > 5 && (
                <span className="text-xs px-2 py-0.5 text-gray-500">
                  +{cluster.keywords.length - 5} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClusterCoverage;