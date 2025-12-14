import React, { useState } from "react";
import { LinkBuildingOpportunity } from "../types";
import { Check, Copy, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

interface LinkBuildingOpportunitiesProps {
  opportunities: LinkBuildingOpportunity[];
}

const LinkBuildingOpportunities: React.FC<LinkBuildingOpportunitiesProps> = ({
  opportunities,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-emerald-500 bg-emerald-900/10";
      case "medium":
        return "border-amber-500 bg-amber-900/10";
      case "low":
        return "border-blue-500 bg-blue-900/10";
      default:
        return "border-gray-500";
    }
  };

  const copyTemplate = (template: string, index: number) => {
    navigator.clipboard.writeText(template.replace(/\\n/g, "\n"));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🎯 Link Building Opportunities
          <span className="text-sm font-normal px-2 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-800 rounded">
            {opportunities.length} found
          </span>
        </h3>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        These are broken pages on competitor sites that have backlinks. Create similar content and reach out to capture these links.
      </p>

      <div className="space-y-4">
        {sortedOpportunities.map((opp, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 bg-[#0d1117] hover:bg-[#1f242c] transition-colors ${getPriorityColor(opp.priority)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                      opp.priority === "high"
                        ? "bg-emerald-900/30 text-emerald-400 border-emerald-800"
                        : opp.priority === "medium"
                          ? "bg-amber-900/30 text-amber-400 border-amber-800"
                          : "bg-blue-900/30 text-blue-400 border-blue-800"
                    }`}
                  >
                    {opp.priority} priority
                  </span>
                  <span className="text-gray-500 text-xs">
                    {opp.linkingPages} linking pages • DA {opp.domainAuthority}
                  </span>
                </div>

                <h4 className="text-white font-medium mb-1 text-base">{opp.originalTopic}</h4>
                
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Broken URL:</span>
                    <a href={opp.brokenUrl} target="_blank" rel="noreferrer" className="text-rose-400 font-mono text-xs truncate hover:underline flex items-center gap-1">
                        {opp.brokenUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                <p className="text-gray-300 text-sm bg-gray-800/50 p-2 rounded border border-gray-700/50">
                    💡 {opp.suggestedContent}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-gray-500 text-xs uppercase mb-1">Potential Links</p>
                <p className="text-emerald-400 font-bold text-2xl">
                  +{opp.linkingPages}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700/50">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
              >
                {expandedIndex === index ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>} 
                {expandedIndex === index ? 'Hide Template' : 'View Outreach Template'}
              </button>

              {expandedIndex === index && (
                <div className="mt-3 p-4 bg-[#010409] border border-gray-700 rounded-lg relative group">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {opp.outreachTemplate.replace(/\\n/g, "\n")}
                  </pre>
                  <div className="absolute top-2 right-2">
                      <button
                        onClick={() => copyTemplate(opp.outreachTemplate, index)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 transition-colors flex items-center gap-1.5"
                      >
                        {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-400"/> : <Copy className="w-3 h-3"/>}
                        {copiedIndex === index ? "Copied!" : "Copy"}
                      </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkBuildingOpportunities;