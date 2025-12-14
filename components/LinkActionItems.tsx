import React from "react";
import { CheckSquare, AlertTriangle } from 'lucide-react';

interface ActionItem {
  priority: number;
  action: string;
  impact: string;
  effort: string;
  linksAffected: number;
}

interface TopIssue {
  issue: string;
  severity: string;
  affectedLinks: number;
  recommendation: string;
}

interface LinkActionItemsProps {
  actionItems: ActionItem[];
  topIssues: TopIssue[];
}

const LinkActionItems: React.FC<LinkActionItemsProps> = ({
  actionItems,
  topIssues,
}) => {
  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-900/30 text-red-400 border-red-800",
      high: "bg-orange-900/30 text-orange-400 border-orange-800",
      medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
      low: "bg-blue-900/30 text-blue-400 border-blue-800",
    };
    return colors[severity] || colors.medium;
  };

  const getEffortBadge = (effort: string) => {
    const colors: Record<string, string> = {
      low: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
      medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
      high: "bg-red-900/30 text-red-400 border-red-800",
    };
    return colors[effort] || colors.medium;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Top Issues */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Top Issues Identified
        </h3>
        <div className="space-y-3">
          {topIssues.map((issue, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 bg-gray-900/50 ${
                issue.severity === "critical"
                  ? "border-red-500"
                  : issue.severity === "high"
                    ? "border-orange-500"
                    : "border-yellow-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getSeverityBadge(issue.severity)}`}>
                    {issue.severity}
                  </span>
                </div>
                <span className="text-gray-500 text-xs">{issue.affectedLinks} links affected</span>
              </div>
              <p className="text-white font-medium text-sm mb-2">{issue.issue}</p>
              <div className="bg-gray-800/80 p-2 rounded text-xs text-indigo-300 flex gap-2">
                 <span className="font-bold">Fix:</span> {issue.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-500" /> Audit Action Plan
        </h3>
        <div className="space-y-3">
          {actionItems.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-900/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                  {item.priority}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm mb-2">{item.action}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                       <div className="text-xs bg-gray-800 p-1.5 rounded">
                           <span className="text-gray-500 block mb-0.5">Impact</span>
                           <span className="text-emerald-400 font-medium">{item.impact}</span>
                       </div>
                       <div className="text-xs bg-gray-800 p-1.5 rounded">
                           <span className="text-gray-500 block mb-0.5">Effort</span>
                           <span className={`font-bold px-1.5 py-0.5 rounded border inline-block ${getEffortBadge(item.effort)}`}>
                               {item.effort.toUpperCase()}
                           </span>
                       </div>
                  </div>

                  {item.linksAffected > 0 && (
                      <p className="text-xs text-gray-500 mt-2 text-right">Targeting {item.linksAffected} links</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkActionItems;
