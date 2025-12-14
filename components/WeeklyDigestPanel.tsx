import React from "react";
import { WeeklyDigest } from "../types";

interface WeeklyDigestPanelProps {
  digest: WeeklyDigest;
}

const WeeklyDigestPanel: React.FC<WeeklyDigestPanelProps> = ({ digest }) => {
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          📧 Weekly Digest
        </h3>
        <span className="text-gray-400 text-sm">Week of {digest.weekOf}</span>
      </div>

      {/* Health Change */}
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Overall Health Change</p>
          <p className={`text-4xl font-bold ${digest.overallHealthChange >= 0 ? "text-green-400" : "text-red-400"}`}>
            {digest.overallHealthChange >= 0 ? "+" : ""}{digest.overallHealthChange}
          </p>
        </div>
      </div>

      {/* Highlights, Concerns, Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/10 rounded-lg p-4">
          <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
            ✅ Highlights
          </h4>
          <ul className="space-y-1">
            {digest.highlights.map((h, i) => (
              <li key={i} className="text-gray-300 text-sm">• {h}</li>
            ))}
          </ul>
        </div>

        <div className="bg-red-500/10 rounded-lg p-4">
          <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
            ⚠️ Concerns
          </h4>
          <ul className="space-y-1">
            {digest.concerns.map((c, i) => (
              <li key={i} className="text-gray-300 text-sm">• {c}</li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-500/10 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
            💡 Opportunities
          </h4>
          <ul className="space-y-1">
            {digest.opportunities.map((o, i) => (
              <li key={i} className="text-gray-300 text-sm">• {o}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs">Rankings</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-green-400">↑{digest.rankingsSummary.improved}</span>
            <span className="text-gray-500">/</span>
            <span className="text-red-400">↓{digest.rankingsSummary.declined}</span>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs">Traffic</p>
          <p className={`text-xl font-bold ${digest.trafficSummary.change >= 0 ? "text-green-400" : "text-red-400"}`}>
            {digest.trafficSummary.change >= 0 ? "+" : ""}{digest.trafficSummary.change}%
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs">Backlinks</p>
          <p className={`text-xl font-bold ${digest.backlinkSummary.netChange >= 0 ? "text-green-400" : "text-red-400"}`}>
            {digest.backlinkSummary.netChange >= 0 ? "+" : ""}{digest.backlinkSummary.netChange}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs">Sessions</p>
          <p className="text-xl font-bold text-white">
            {digest.trafficSummary.totalSessions.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Competitor Summary */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">🎯 Competitor Summary</h4>
        <p className="text-gray-300 text-sm">{digest.competitorSummary}</p>
      </div>
    </div>
  );
};

export default WeeklyDigestPanel;