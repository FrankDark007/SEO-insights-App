import React, { useState } from "react";
import { OutreachTarget } from "../types";

interface OutreachTargetListProps {
  targets: OutreachTarget[];
}

const OutreachTargetList: React.FC<OutreachTargetListProps> = ({ targets }) => {
  const [expandedTarget, setExpandedTarget] = useState<number | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null);

  const copyTemplate = (template: string, index: number) => {
    navigator.clipboard.writeText(template.replace(/\\n/g, "\n"));
    setCopiedTemplate(index);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const getValueBadge = (value: string) => {
    const colors: Record<string, string> = {
      high: "bg-green-500/20 text-green-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      low: "bg-gray-500/20 text-gray-400",
    };
    return colors[value] || colors.low;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        🎯 Outreach Targets
        <span className="text-sm font-normal text-gray-400">
          (prioritized by value)
        </span>
      </h3>

      <div className="space-y-3">
        {targets.map((target, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-700 bg-gray-700/30 overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-700/50"
              onClick={() => setExpandedTarget(expandedTarget === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    #{target.priority}
                  </span>
                  <div>
                    <p className="text-white font-medium">{target.domain}</p>
                    <p className="text-gray-400 text-xs">DA {target.domainAuthority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-xs ${getValueBadge(target.potentialValue)}`}>
                    {target.potentialValue} value
                  </span>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Success Rate</p>
                    <p className="text-white font-medium">{target.estimatedSuccessRate}%</p>
                  </div>
                  <span className={`transform transition-transform ${expandedTarget === index ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {expandedTarget === index && (
              <div className="px-4 pb-4 border-t border-gray-700 pt-4 space-y-4">
                {/* Contact Info */}
                <div className="flex gap-4">
                  {target.contactEmail && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Email</p>
                      <a href={`mailto:${target.contactEmail}`} className="text-purple-400 text-sm hover:text-purple-300">
                        {target.contactEmail}
                      </a>
                    </div>
                  )}
                  {target.contactPage && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Contact Page</p>
                      <a href={target.contactPage} target="_blank" rel="noopener noreferrer" className="text-purple-400 text-sm hover:text-purple-300">
                        Visit →
                      </a>
                    </div>
                  )}
                </div>

                {/* Competitors Linking */}
                {target.linkingToCompetitors.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Already Linking To</p>
                    <div className="flex gap-2 flex-wrap">
                      {target.linkingToCompetitors.map((comp, i) => (
                        <span key={i} className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Angle */}
                <div>
                  <p className="text-gray-400 text-xs mb-1">Suggested Angle</p>
                  <p className="text-white text-sm">{target.suggestedAngle}</p>
                </div>

                {/* Outreach Template */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-xs">Outreach Template</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyTemplate(target.outreachTemplate, index);
                      }}
                      className="text-purple-400 text-xs hover:text-purple-300"
                    >
                      {copiedTemplate === index ? "✓ Copied!" : "Copy Template"}
                    </button>
                  </div>
                  <pre className="bg-gray-900 p-3 rounded text-gray-300 text-xs whitespace-pre-wrap font-mono">
                    {target.outreachTemplate.replace(/\\n/g, "\n")}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutreachTargetList;