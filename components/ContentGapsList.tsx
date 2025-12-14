import React from "react";
import { ContentGap } from "../types";

interface ContentGapsListProps {
  gaps: ContentGap[];
}

const ContentGapsList: React.FC<ContentGapsListProps> = ({ gaps }) => {
  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "bg-rose-900/30 text-rose-400 border-rose-800",
      high: "bg-orange-900/30 text-orange-400 border-orange-800",
      medium: "bg-amber-900/30 text-amber-400 border-amber-800",
      low: "bg-blue-900/30 text-blue-400 border-blue-800",
    };
    return colors[severity] || "bg-gray-800 text-gray-400";
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      missing_section: "📝",
      thin_content: "📏",
      missing_media: "🖼️",
      missing_schema: "🏷️",
      missing_faq: "❓",
      weak_heading: "📑",
    };
    return icons[type] || "⚠️";
  };

  const sortedGaps = [...gaps].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🔍 Content Gaps Identified
          <span className="text-sm font-normal px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded border border-rose-500/30">
            {gaps.length} gaps
          </span>
        </h3>
      </div>

      <div className="space-y-4">
        {sortedGaps.map((gap, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 bg-[#0d1117] ${
              gap.severity === "critical"
                ? "border-rose-500"
                : gap.severity === "high"
                  ? "border-orange-500"
                  : gap.severity === "medium"
                    ? "border-amber-500"
                    : "border-blue-500"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getTypeIcon(gap.type)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadge(gap.severity)}`}
                  >
                    {gap.severity}
                  </span>
                  <span className="text-gray-400 text-xs uppercase font-medium tracking-wide">
                    {gap.type.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="text-white font-medium mb-2">{gap.description}</p>

                <div className="bg-gray-800/50 rounded p-3 mb-3 border border-gray-700">
                  <p className="text-gray-500 text-xs mb-1 uppercase font-bold">Competitor Example</p>
                  <p className="text-gray-300 text-sm">{gap.competitorExample}</p>
                </div>

                <div className="flex items-start gap-2 bg-emerald-900/10 p-2 rounded border border-emerald-900/20">
                  <span className="text-emerald-400">→</span>
                  <div>
                    <p className="text-emerald-400 text-sm font-medium">
                      {gap.recommendation}
                    </p>
                    <p className="text-emerald-200/70 text-xs mt-1">
                      Estimated Impact: {gap.estimatedImpact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentGapsList;