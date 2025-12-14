import React from "react";

interface WeeklyDigestProps {
  digest: {
    biggestThreats: string[];
    quickWins: string[];
    competitorWins: string[];
    yourWins: string[];
    trendingSummary: string;
  };
}

const WeeklyDigestCard: React.FC<WeeklyDigestProps> = ({ digest }) => {
  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30">
      <h3 className="text-lg font-semibold text-white mb-4">
        📋 Weekly Intelligence Digest
      </h3>

      <p className="text-gray-300 mb-4">{digest.trendingSummary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Threats */}
        <div className="bg-red-500/10 rounded-lg p-4">
          <h4 className="text-red-400 font-medium mb-2">🚨 Biggest Threats</h4>
          <ul className="space-y-1">
            {digest.biggestThreats.map((threat, i) => (
              <li key={i} className="text-red-200 text-sm flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                {threat}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Wins */}
        <div className="bg-green-500/10 rounded-lg p-4">
          <h4 className="text-green-400 font-medium mb-2">⚡ Quick Wins</h4>
          <ul className="space-y-1">
            {digest.quickWins.map((win, i) => (
              <li key={i} className="text-green-200 text-sm flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                {win}
              </li>
            ))}
          </ul>
        </div>

        {/* Competitor Wins */}
        <div className="bg-orange-500/10 rounded-lg p-4">
          <h4 className="text-orange-400 font-medium mb-2">📈 Competitor Wins</h4>
          <ul className="space-y-1">
            {digest.competitorWins.map((win, i) => (
              <li key={i} className="text-orange-200 text-sm flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                {win}
              </li>
            ))}
          </ul>
        </div>

        {/* Your Wins */}
        <div className="bg-blue-500/10 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2">🏆 Your Wins</h4>
          <ul className="space-y-1">
            {digest.yourWins.map((win, i) => (
              <li key={i} className="text-blue-200 text-sm flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                {win}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeeklyDigestCard;