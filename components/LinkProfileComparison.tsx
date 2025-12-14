import React from "react";
import { CompetitorLinkProfile } from "../types";

interface LinkProfileComparisonProps {
  yourProfile: {
    totalBacklinks: number;
    referringDomains: number;
    domainAuthority: number;
    dofollowRatio: number;
    avgLinkAuthority: number;
  };
  competitors: CompetitorLinkProfile[];
}

const LinkProfileComparison: React.FC<LinkProfileComparisonProps> = ({
  yourProfile,
  competitors,
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const allProfiles = [
    { domain: "You", ...yourProfile, isYours: true },
    ...competitors.map((c) => ({
      domain: c.domain,
      totalBacklinks: c.totalBacklinks,
      referringDomains: c.referringDomains,
      domainAuthority: c.avgDomainAuthority,
      dofollowRatio: c.dofollowRatio,
      avgLinkAuthority: c.avgDomainAuthority,
      isYours: false,
    })),
  ];

  const maxDA = Math.max(...allProfiles.map((p) => p.domainAuthority));
  const maxRD = Math.max(...allProfiles.map((p) => p.referringDomains));

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        📊 Link Profile Comparison
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-3 text-gray-400 font-medium">Domain</th>
              <th className="text-right py-3 px-3 text-gray-400 font-medium">DA</th>
              <th className="text-right py-3 px-3 text-gray-400 font-medium">Backlinks</th>
              <th className="text-right py-3 px-3 text-gray-400 font-medium">Ref. Domains</th>
              <th className="text-right py-3 px-3 text-gray-400 font-medium">Dofollow %</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium">DA Bar</th>
            </tr>
          </thead>
          <tbody>
            {allProfiles.map((profile, index) => (
              <tr
                key={index}
                className={`border-b border-gray-700/50 ${
                  profile.isYours ? "bg-purple-500/10" : "hover:bg-gray-700/30"
                }`}
              >
                <td className="py-3 px-3">
                  <span className={`font-medium ${profile.isYours ? "text-purple-400" : "text-white"}`}>
                    {profile.domain}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className={`font-bold ${
                    profile.domainAuthority >= 50 ? "text-green-400" :
                    profile.domainAuthority >= 30 ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {profile.domainAuthority}
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-gray-300">
                  {formatNumber(profile.totalBacklinks)}
                </td>
                <td className="py-3 px-3 text-right text-gray-300">
                  {formatNumber(profile.referringDomains)}
                </td>
                <td className="py-3 px-3 text-right text-gray-300">
                  {profile.dofollowRatio}%
                </td>
                <td className="py-3 px-3 w-32">
                  <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full rounded-full ${
                        profile.isYours ? "bg-purple-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${(profile.domainAuthority / maxDA) * 100}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gap Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs">Your DA</p>
          <p className="text-2xl font-bold text-purple-400">{yourProfile.domainAuthority}</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs">Avg Competitor DA</p>
          <p className="text-2xl font-bold text-blue-400">
            {Math.round(competitors.reduce((sum, c) => sum + c.avgDomainAuthority, 0) / competitors.length)}
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs">Your Ref Domains</p>
          <p className="text-2xl font-bold text-purple-400">{formatNumber(yourProfile.referringDomains)}</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs">DA Gap</p>
          <p className="text-2xl font-bold text-red-400">
            -{Math.round(competitors.reduce((sum, c) => sum + c.avgDomainAuthority, 0) / competitors.length) - yourProfile.domainAuthority}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkProfileComparison;