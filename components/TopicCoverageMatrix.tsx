import React from "react";
import { TopicCoverage } from "../types";

interface TopicCoverageMatrixProps {
  topics: TopicCoverage[];
}

const TopicCoverageMatrix: React.FC<TopicCoverageMatrixProps> = ({ topics }) => {
  const getCoverageBadge = (coverage: string) => {
    switch (coverage) {
      case "full":
        return <span className="text-emerald-400 font-bold text-xs">✓ Full</span>;
      case "partial":
        return <span className="text-amber-400 font-bold text-xs">◐ Partial</span>;
      case "missing":
        return <span className="text-rose-400 font-bold text-xs">✗ Missing</span>;
      default:
        return null;
    }
  };

  const getImportanceBadge = (importance: string) => {
    const colors: Record<string, string> = {
      essential: "bg-rose-900/30 text-rose-400 border-rose-800",
      recommended: "bg-amber-900/30 text-amber-400 border-amber-800",
      optional: "bg-blue-900/30 text-blue-400 border-blue-800",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colors[importance]}`}>
        {importance}
      </span>
    );
  };

  const sortedTopics = [...topics].sort((a, b) => {
    const importanceOrder = { essential: 0, recommended: 1, optional: 2 };
    const coverageOrder = { missing: 0, partial: 1, full: 2 };
    const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
    if (importanceDiff !== 0) return importanceDiff;
    return coverageOrder[a.yourCoverage] - coverageOrder[b.yourCoverage];
  });

  const missingEssential = topics.filter(
    (t) => t.importance === "essential" && t.yourCoverage === "missing"
  ).length;

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          📋 Topic Coverage Matrix
        </h3>
        {missingEssential > 0 && (
          <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold border border-rose-500/30">
            {missingEssential} ESSENTIAL TOPICS MISSING
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
              <th className="p-4 font-semibold">Topic</th>
              <th className="p-4 font-semibold text-center">Your Coverage</th>
              <th className="p-4 font-semibold text-center">Competitors</th>
              <th className="p-4 font-semibold text-center">Importance</th>
              <th className="p-4 font-semibold text-right">Suggested Words</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedTopics.map((topic, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-800/30 transition-colors ${
                  topic.importance === "essential" && topic.yourCoverage === "missing"
                    ? "bg-rose-900/10"
                    : ""
                }`}
              >
                <td className="p-4 text-white font-medium">{topic.topic}</td>
                <td className="p-4 text-center">{getCoverageBadge(topic.yourCoverage)}</td>
                <td className="p-4 text-center">
                  <span className="text-gray-300 font-mono">{topic.competitorsCovering}/5</span>
                </td>
                <td className="p-4 text-center">{getImportanceBadge(topic.importance)}</td>
                <td className="p-4 text-right text-gray-300 font-mono">
                  {topic.yourCoverage !== "full" ? `+${topic.suggestedWordCount}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopicCoverageMatrix;