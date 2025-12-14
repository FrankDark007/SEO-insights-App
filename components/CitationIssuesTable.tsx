import React from "react";
import { BrokenLinkCitationIssue } from "../types";
import { ExternalLink, AlertTriangle } from "lucide-react";

interface CitationIssuesTableProps {
  issues: BrokenLinkCitationIssue[];
}

const CitationIssuesTable: React.FC<CitationIssuesTableProps> = ({ issues }) => {
  const getIssueBadge = (issue: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      broken_link: { text: "Broken Link", color: "bg-rose-900/30 text-rose-400 border-rose-800" },
      wrong_url: { text: "Wrong URL", color: "bg-orange-900/30 text-orange-400 border-orange-800" },
      missing_link: { text: "Missing Link", color: "bg-amber-900/30 text-amber-400 border-amber-800" },
      redirect: { text: "Redirect", color: "bg-blue-900/30 text-blue-400 border-blue-800" },
      inconsistent: { text: "Inconsistent", color: "bg-violet-900/30 text-violet-400 border-violet-800" },
    };
    const config = labels[issue] || { text: issue, color: "bg-gray-800 text-gray-400 border-gray-700" };
    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getImpactBadge = (impact: string) => {
    const colors: Record<string, string> = {
      high: "text-rose-400",
      medium: "text-amber-400",
      low: "text-blue-400",
    };
    return <span className={`font-bold uppercase text-xs ${colors[impact]}`}>{impact}</span>;
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        📍 Citation Issues ({issues.length})
      </h3>

      {issues.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-emerald-400 text-lg font-medium">✓ No citation issues found!</p>
          <p className="text-gray-400 text-sm mt-1">Your business listings are consistent across the web.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="py-3 px-3 text-gray-400 font-medium">Platform</th>
                <th className="py-3 px-3 text-gray-400 font-medium">Issue</th>
                <th className="text-center py-3 px-3 text-gray-400 font-medium">Impact</th>
                <th className="py-3 px-3 text-gray-400 font-medium">Current</th>
                <th className="py-3 px-3 text-gray-400 font-medium">Expected</th>
                <th className="py-3 px-3 text-gray-400 font-medium">How to Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {issues.map((issue, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 px-3">
                    <p className="text-white font-medium">{issue.platform}</p>
                    <a
                      href={issue.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 text-xs hover:text-indigo-300 flex items-center gap-1 mt-1"
                    >
                      View Profile <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-3">{getIssueBadge(issue.issue)}</td>
                  <td className="py-3 px-3 text-center">
                    {getImpactBadge(issue.impact)}
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-rose-400 font-mono text-xs truncate max-w-[150px] bg-rose-900/10 px-1 py-0.5 rounded">
                      {issue.currentValue || "(empty)"}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-emerald-400 font-mono text-xs truncate max-w-[150px] bg-emerald-900/10 px-1 py-0.5 rounded">
                      {issue.expectedValue}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-gray-300 text-xs max-w-[200px] leading-snug">
                      {issue.howToFix}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CitationIssuesTable;