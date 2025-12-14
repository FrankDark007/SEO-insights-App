import React from "react";

interface HealthScoreDashboardProps {
  overallScore: number;
  healthTrend: string;
  quickStats: {
    rankingsUp: number;
    rankingsDown: number;
    newAlerts: number;
    criticalIssues: number;
    pendingActions: number;
    competitorThreats: number;
  };
}

const HealthScoreDashboard: React.FC<HealthScoreDashboardProps> = ({
  overallScore,
  healthTrend,
  quickStats,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-yellow-600";
    if (score >= 40) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <span className="text-green-400">↑ Improving</span>;
      case "declining":
        return <span className="text-red-400">↓ Declining</span>;
      default:
        return <span className="text-yellow-400">→ Stable</span>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">SEO Health Score</h3>
          <p className="text-gray-400 text-sm">{getTrendIcon(healthTrend)}</p>
        </div>
        <div className="text-right">
          <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}
          </div>
          <p className="text-gray-400 text-sm">out of 100</p>
        </div>
      </div>

      {/* Score Bar */}
      <div className="relative h-4 bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className={`absolute h-full bg-gradient-to-r ${getScoreGradient(overallScore)} rounded-full transition-all duration-1000`}
          style={{ width: `${overallScore}%` }}
        ></div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-green-400 text-2xl font-bold">{quickStats.rankingsUp}</p>
          <p className="text-gray-400 text-xs">Rankings Up</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-red-400 text-2xl font-bold">{quickStats.rankingsDown}</p>
          <p className="text-gray-400 text-xs">Rankings Down</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-blue-400 text-2xl font-bold">{quickStats.newAlerts}</p>
          <p className="text-gray-400 text-xs">New Alerts</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className={`text-2xl font-bold ${quickStats.criticalIssues > 0 ? "text-red-400" : "text-green-400"}`}>
            {quickStats.criticalIssues}
          </p>
          <p className="text-gray-400 text-xs">Critical Issues</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-purple-400 text-2xl font-bold">{quickStats.pendingActions}</p>
          <p className="text-gray-400 text-xs">Pending Actions</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className={`text-2xl font-bold ${quickStats.competitorThreats > 0 ? "text-orange-400" : "text-green-400"}`}>
            {quickStats.competitorThreats}
          </p>
          <p className="text-gray-400 text-xs">Competitor Threats</p>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreDashboard;