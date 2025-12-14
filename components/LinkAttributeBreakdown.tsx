import React from "react";
import { PieChart } from "lucide-react";

interface LinkAttributeBreakdownProps {
  attributeBreakdown: {
    dofollow: number;
    nofollow: number;
    ugc: number;
    sponsored: number;
  };
  domainAuthorityDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

const LinkAttributeBreakdown: React.FC<LinkAttributeBreakdownProps> = ({
  attributeBreakdown,
  domainAuthorityDistribution,
}) => {
  const total = attributeBreakdown.dofollow + attributeBreakdown.nofollow + 
    attributeBreakdown.ugc + attributeBreakdown.sponsored;

  const attributes = [
    { name: "Dofollow", value: attributeBreakdown.dofollow, color: "bg-emerald-500", textColor: "text-emerald-400", percentage: Math.round((attributeBreakdown.dofollow / total) * 100) },
    { name: "Nofollow", value: attributeBreakdown.nofollow, color: "bg-amber-500", textColor: "text-amber-400", percentage: Math.round((attributeBreakdown.nofollow / total) * 100) },
    { name: "UGC", value: attributeBreakdown.ugc, color: "bg-blue-500", textColor: "text-blue-400", percentage: Math.round((attributeBreakdown.ugc / total) * 100) },
    { name: "Sponsored", value: attributeBreakdown.sponsored, color: "bg-purple-500", textColor: "text-purple-400", percentage: Math.round((attributeBreakdown.sponsored / total) * 100) },
  ];

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-indigo-400" /> Link Profile Composition
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Attribute Breakdown */}
        <div>
          <h4 className="text-gray-400 text-xs uppercase font-bold mb-4">Link Attributes</h4>
          
          {/* Stacked Bar */}
          <div className="h-4 rounded-full overflow-hidden flex mb-6 bg-gray-800">
            {attributes.map((attr, index) => (
              <div
                key={index}
                className={`${attr.color} h-full`}
                style={{ width: `${attr.percentage}%` }}
                title={`${attr.name}: ${attr.percentage}%`}
              ></div>
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {attributes.map((attr, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800/50 p-2 rounded border border-gray-800">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${attr.color}`}></div>
                    <span className="text-gray-300 text-sm font-medium">{attr.name}</span>
                </div>
                <span className={`text-sm font-bold ${attr.textColor}`}>{attr.percentage}%</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-lg">
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">Dofollow Ratio Analysis</p>
            <div className="flex items-end gap-2">
                <p className={`text-2xl font-bold ${attributes[0].percentage >= 60 ? "text-emerald-400" : "text-amber-400"}`}>
                {attributes[0].percentage}%
                </p>
                <span className="text-gray-500 text-xs mb-1">Passing Link Equity</span>
            </div>
            <p className="text-gray-500 text-xs mt-2">
                Healthy range is typically 60-80%. {attributes[0].percentage >= 60 ? "Your ratio is healthy." : "Aim for more dofollow links."}
            </p>
          </div>
        </div>

        {/* DA Distribution */}
        <div className="border-l border-gray-800 pl-8 hidden md:block">
          <h4 className="text-gray-400 text-xs uppercase font-bold mb-4">Referring Domain Authority</h4>
          <div className="space-y-3">
            {domainAuthorityDistribution.map((range, index) => {
               // Calculate bar width logic
               const barWidth = Math.max(range.percentage, 2); // Ensure visible
               
               return (
                <div key={index} className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs w-8 text-right font-mono">{range.range}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${
                        parseInt(range.range) >= 50 ? "bg-emerald-500" :
                        parseInt(range.range) >= 30 ? "bg-blue-500" :
                        parseInt(range.range) >= 10 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${barWidth}%` }}
                    ></div>
                    </div>
                    <span className="text-gray-300 text-xs w-8 text-right">{range.count}</span>
                </div>
            )})}
          </div>
          <p className="text-xs text-gray-500 mt-4 italic text-center">
              Distribution of linking domains by Authority Score
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkAttributeBreakdown;
