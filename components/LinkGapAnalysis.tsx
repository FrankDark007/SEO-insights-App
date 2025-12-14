import React, { useState } from "react";
import { LinkGap } from "../types";

interface LinkGapAnalysisProps {
  gaps: LinkGap[];
}

const LinkGapAnalysis: React.FC<LinkGapAnalysisProps> = ({ gaps }) => {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [expandedGap, setExpandedGap] = useState<string | null>(null);

  const filteredGaps = filter === "all" 
    ? gaps 
    : gaps.filter((g) => g.opportunity === filter);

  const getOpportunityBadge = (opp: string) => {
    const colors: Record<string, string> = {
      high: "bg-green-500/20 text-green-400 border-green-500/50",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      low: "bg-gray-500/20 text-gray-400 border-gray-500/50",
    };
    return colors[opp] || colors.low;
  };

  const sortedGaps = [...filteredGaps].sort((a, b) => {
    const oppOrder = { high: 0, medium: 1, low: 2 };
    const oppDiff = oppOrder[a.opportunity] - oppOrder[b.opportunity];
    if (oppDiff !== 0) return oppDiff;
    return b.domainAuthority - a.domainAuthority;
  });

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🔗 Link Gap Analysis
          <span className="text-sm font-normal px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
            {gaps.length} domains
          </span>
        </h3>
        <div className="flex gap-2">
          {["all", "high", "medium", "low"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {sortedGaps.map((gap, index) => (
          <div
            key={index}
            className={`rounded-lg border ${
              gap.opportunity === "high"
                ? "border-green-500/30 bg-green-500/5"
                : "border-gray-700 bg-gray-700/30"
            }`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedGap(expandedGap === gap.domain ? null : gap.domain)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${getOpportunityBadge(gap.opportunity)}`}>
                    DA {gap.domainAuthority}
                  </span>
                  <span className="text-white font-medium">{gap.domain}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Links to Competitors</p>
                    <p className="text-white font-medium">
                      {gap.linksToCompetitors.reduce((sum, c) => sum + c.count, 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Links to You</p>
                    <p className={`font-medium ${gap.linksToYou > 0 ? "text-green-400" : "text-red-400"}`}>
                      {gap.linksToYou}
                    </p>
                  </div>
                  <span className={`transform transition-transform ${expandedGap === gap.domain ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {expandedGap === gap.domain && (
              <div className="px-4 pb-4 border-t border-gray-700 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Linking to Competitors:</p>
                    <div className="space-y-1">
                      {gap.linksToCompetitors.map((comp, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{comp.competitor}</span>
                          <span className="text-blue-400">{comp.count} links</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Suggested Approach:</p>
                    <p className="text-white text-sm">{gap.suggestedApproach}</p>
                    {gap.contactInfo.contactPage && (
                      <a
                        href={gap.contactInfo.contactPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-purple-400 text-sm hover:text-purple-300"
                      >
                        → Contact Page
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkGapAnalysis;