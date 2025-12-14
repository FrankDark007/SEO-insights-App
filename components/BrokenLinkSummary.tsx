import React from "react";

interface BrokenLinkSummaryProps {
  summary: {
    totalLinksChecked: number;
    brokenInternalLinks: number;
    brokenExternalLinks: number;
    redirectChains: number;
    orphanPages: number;
    linkBuildingOpportunities: number;
    citationIssues: number;
    healthScore: number;
  };
}

const BrokenLinkSummary: React.FC<BrokenLinkSummaryProps> = ({ summary }) => {
  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    if (score >= 50) return "text-orange-400";
    return "text-rose-400";
  };

  const getHealthBg = (score: number) => {
    if (score >= 90) return "from-emerald-600";
    if (score >= 70) return "from-amber-600";
    if (score >= 50) return "from-orange-600";
    return "from-rose-600";
  };

  const stats = [
    {
      label: "Links Checked",
      value: summary.totalLinksChecked,
      color: "text-blue-400",
      icon: "🔗",
    },
    {
      label: "Broken Internal",
      value: summary.brokenInternalLinks,
      color: summary.brokenInternalLinks > 0 ? "text-rose-400" : "text-emerald-400",
      icon: "🔴",
    },
    {
      label: "Broken External",
      value: summary.brokenExternalLinks,
      color: summary.brokenExternalLinks > 0 ? "text-orange-400" : "text-emerald-400",
      icon: "🟠",
    },
    {
      label: "Redirect Chains",
      value: summary.redirectChains,
      color: summary.redirectChains > 0 ? "text-amber-400" : "text-emerald-400",
      icon: "🔀",
    },
    {
      label: "Orphan Pages",
      value: summary.orphanPages,
      color: summary.orphanPages > 0 ? "text-violet-400" : "text-emerald-400",
      icon: "👻",
    },
    {
      label: "Link Opportunities",
      value: summary.linkBuildingOpportunities,
      color: "text-emerald-400",
      icon: "🎯",
    },
  ];

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Link Health Overview</h3>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Health Score</span>
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getHealthBg(summary.healthScore)} to-transparent flex items-center justify-center border-2 border-gray-700/50`}
          >
            <span className={`text-2xl font-bold ${getHealthColor(summary.healthScore)}`}>
              {summary.healthScore}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-800"
          >
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrokenLinkSummary;