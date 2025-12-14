import React, { useState } from "react";
import { AuditedBacklink } from "../types";

interface BacklinkTableProps {
  backlinks: AuditedBacklink[];
}

const BacklinkTable: React.FC<BacklinkTableProps> = ({ backlinks }) => {
  const [filter, setFilter] = useState<"all" | "keep" | "monitor" | "disavow" | "fix">("all");
  const [sortBy, setSortBy] = useState<"quality" | "da" | "spam">("quality");
  const [expandedLink, setExpandedLink] = useState<string | null>(null);

  const filteredLinks = filter === "all" 
    ? backlinks 
    : backlinks.filter((b) => b.recommendation === filter);

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    switch (sortBy) {
      case "quality":
        return b.qualityScore - a.qualityScore;
      case "da":
        return b.domainAuthority - a.domainAuthority;
      case "spam":
        return b.spamScore - a.spamScore;
      default:
        return 0;
    }
  });

  const getRecommendationBadge = (rec: string) => {
    const colors: Record<string, string> = {
      keep: "bg-green-500/20 text-green-400 border-green-500/50",
      monitor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      disavow: "bg-red-500/20 text-red-400 border-red-500/50",
      fix: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    };
    return colors[rec] || "bg-gray-500/20 text-gray-400";
  };

  const getQualityColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    if (score >= 30) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          📋 Backlink Inventory
          <span className="text-sm font-normal text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
            {backlinks.length} links
          </span>
        </h3>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Links</option>
            <option value="keep">Keep ({backlinks.filter((b) => b.recommendation === "keep").length})</option>
            <option value="monitor">Monitor ({backlinks.filter((b) => b.recommendation === "monitor").length})</option>
            <option value="disavow">Disavow ({backlinks.filter((b) => b.recommendation === "disavow").length})</option>
            <option value="fix">Fix ({backlinks.filter((b) => b.recommendation === "fix").length})</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
          >
            <option value="quality">Sort by Quality</option>
            <option value="da">Sort by DA</option>
            <option value="spam">Sort by Spam Score</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
        {sortedLinks.map((link, index) => (
          <div
            key={index}
            className={`rounded-lg border transition-colors ${
              link.recommendation === "disavow"
                ? "border-red-500/30 bg-red-900/10"
                : link.recommendation === "keep"
                  ? "border-green-500/30 bg-green-900/10"
                  : "border-gray-700 bg-gray-800/50"
            }`}
          >
            <div
              className="p-3 cursor-pointer hover:bg-gray-700/30"
              onClick={() => setExpandedLink(expandedLink === link.sourceUrl ? null : link.sourceUrl)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border w-20 text-center ${getRecommendationBadge(link.recommendation)}`}>
                    {link.recommendation}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium truncate">{link.sourceDomain}</p>
                        {link.attributes.isNofollow && <span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 rounded border border-gray-600">NOFOLLOW</span>}
                        {link.attributes.isSponsored && <span className="text-[10px] bg-purple-900/30 text-purple-300 px-1.5 rounded border border-purple-800">SPONSORED</span>}
                    </div>
                    <p className="text-gray-500 text-xs truncate">Anchor: <span className="text-gray-300">"{link.anchorText}"</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center w-12">
                    <p className="text-gray-500 text-[10px] uppercase">DA</p>
                    <p className="text-white font-mono font-bold text-sm">{link.domainAuthority}</p>
                  </div>
                  <div className="text-center w-12">
                    <p className="text-gray-500 text-[10px] uppercase">Spam</p>
                    <p className={`font-mono font-bold text-sm ${link.spamScore > 30 ? "text-red-400" : "text-emerald-400"}`}>
                      {link.spamScore}%
                    </p>
                  </div>
                  <div className="text-center w-12">
                    <p className="text-gray-500 text-[10px] uppercase">Score</p>
                    <p className={`font-mono font-bold text-sm ${getQualityColor(link.qualityScore)}`}>
                      {link.qualityScore}
                    </p>
                  </div>
                  <span className={`transform transition-transform text-gray-500 ${expandedLink === link.sourceUrl ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {expandedLink === link.sourceUrl && (
              <div className="px-3 pb-3 border-t border-gray-700 pt-3 bg-gray-900/30 rounded-b-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Anchor Type</p>
                    <p className="text-white text-xs capitalize bg-gray-800 px-2 py-1 rounded inline-block border border-gray-700">{link.anchorType.replace(/-/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Placement</p>
                    <p className="text-white text-xs capitalize bg-gray-800 px-2 py-1 rounded inline-block border border-gray-700">{link.placement.replace(/-/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Link Attributes</p>
                    <div className="flex flex-wrap gap-1">
                        {link.attributes.isDofollow && <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded border border-green-800">Dofollow</span>}
                        {link.attributes.isNofollow && <span className="text-[10px] bg-yellow-900/30 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-800">Nofollow</span>}
                        {link.attributes.isUGC && <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800">UGC</span>}
                        {link.attributes.isSponsored && <span className="text-[10px] bg-purple-900/30 text-purple-400 px-1.5 py-0.5 rounded border border-purple-800">Sponsored</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Relevance</p>
                    <p className={`text-xs font-bold uppercase ${
                      link.topicalRelevance === "high" ? "text-green-400" :
                      link.topicalRelevance === "medium" ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {link.topicalRelevance}
                    </p>
                  </div>
                </div>

                {link.contextSnippet && (
                  <div className="mb-3">
                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Context Snippet</p>
                    <p className="text-gray-300 text-xs bg-gray-800 p-2 rounded italic border border-gray-700 leading-relaxed">
                      "...{link.contextSnippet}..."
                    </p>
                  </div>
                )}

                {link.issues.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Identified Issues</p>
                    <div className="flex flex-wrap gap-1">
                      {link.issues.map((issue, i) => (
                        <span key={i} className="text-xs bg-red-900/20 text-red-300 px-2 py-0.5 rounded border border-red-900/40">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-700 text-xs">
                    <span className="text-gray-500">Source URL: </span>
                    <a href={link.sourceUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline break-all">
                        {link.sourceUrl}
                    </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BacklinkTable;
