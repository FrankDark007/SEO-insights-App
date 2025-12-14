import React, { useState } from "react";
import { BrokenLink } from "../types";

interface BrokenLinksTableProps {
  links: BrokenLink[];
}

const BrokenLinksTable: React.FC<BrokenLinksTableProps> = ({ links }) => {
  const [filterType, setFilterType] = useState<"all" | "internal" | "external">("all");
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "high" | "medium" | "low">("all");

  const filteredLinks = links
    .filter((link) => filterType === "all" || link.type === filterType)
    .filter((link) => filterSeverity === "all" || link.severity === filterSeverity);

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium uppercase border ${colors[severity]}`}>
        {severity}
      </span>
    );
  };

  const getStatusBadge = (code: number) => {
    if (code === 404) {
      return <span className="text-rose-400 font-mono font-bold">404</span>;
    }
    if (code >= 500) {
      return <span className="text-rose-400 font-mono font-bold">{code}</span>;
    }
    if (code >= 400) {
      return <span className="text-orange-400 font-mono font-bold">{code}</span>;
    }
    return <span className="text-gray-400 font-mono">{code}</span>;
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🔗 Broken Links ({filteredLinks.length})
        </h3>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="internal">Internal Only</option>
            <option value="external">External Only</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as typeof filterSeverity)}
            className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-emerald-400 text-lg font-medium">✓ No broken links found!</p>
          <p className="text-gray-400 text-sm mt-1">Your site's link health is excellent.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="py-3 px-3 text-gray-400 font-medium">Broken URL</th>
                <th className="py-3 px-3 text-gray-400 font-medium">Found On</th>
                <th className="text-center py-3 px-3 text-gray-400 font-medium">Status</th>
                <th className="text-center py-3 px-3 text-gray-400 font-medium">Type</th>
                <th className="text-center py-3 px-3 text-gray-400 font-medium">Severity</th>
                <th className="py-3 px-3 text-gray-400 font-medium">Suggested Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLinks.map((link, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 px-3">
                    <p className="text-rose-400 font-mono text-xs truncate max-w-[250px]" title={link.url}>
                      {link.url}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Anchor: <span className="text-gray-300">"{link.anchorText}"</span>
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-blue-400 font-mono text-xs truncate max-w-[200px]" title={link.sourceUrl}>
                      {link.sourceUrl}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(link.statusCode)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                        link.type === "internal"
                          ? "bg-violet-900/30 text-violet-400 border border-violet-800"
                          : "bg-blue-900/30 text-blue-400 border border-blue-800"
                      }`}
                    >
                      {link.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {getSeverityBadge(link.severity)}
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-emerald-400 text-xs max-w-[250px]">
                      {link.suggestedFix}
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

export default BrokenLinksTable;