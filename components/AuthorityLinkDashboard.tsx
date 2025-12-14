import React, { useState } from "react";
import { AuthorityLinkResult } from "../types";
import { analyzeAuthorityLinks } from "../services/authorityLinkService";
import LinkProfileComparison from "./LinkProfileComparison";
import LinkGapAnalysis from "./LinkGapAnalysis";
import OutreachTargetList from "./OutreachTargetList";
import LinkBuildingStrategies from "./LinkBuildingStrategies";
import { Loader2, Link2, AlertOctagon } from "lucide-react";

const DEFAULT_COMPETITORS = [
  "servpro.com",
  "servicemaster.com",
  "puroclean.com",
  "belfor.com",
];

const AuthorityLinkDashboard: React.FC = () => {
  const [yourDomain, setYourDomain] = useState("flooddoctorva.com");
  const [competitorsText, setCompetitorsText] = useState(DEFAULT_COMPETITORS.join("\n"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuthorityLinkResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "gaps" | "outreach" | "strategies"
  >("overview");

  const handleAnalyze = async () => {
    if (!yourDomain.trim()) {
      setError("Please enter your domain");
      return;
    }

    const competitors = competitorsText
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    if (competitors.length === 0) {
      setError("Please enter at least one competitor domain");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeAuthorityLinks(yourDomain.trim(), competitors);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze links");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "gaps", label: "Link Gaps", icon: "🔗" },
    { id: "outreach", label: "Outreach", icon: "🎯" },
    { id: "strategies", label: "Strategies", icon: "📋" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Authority Link Intelligence
            <span className="text-sm font-normal px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 flex items-center gap-1">
              <Link2 className="w-3 h-3" /> Ahrefs-Style Analysis
            </span>
          </h2>
          <p className="text-gray-400 mt-1">
            Discover high-authority link opportunities from competitor backlink profiles
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Domain
            </label>
            <input
              type="text"
              value={yourDomain}
              onChange={(e) => setYourDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Competitor Domains (one per line)
            </label>
            <textarea
              value={competitorsText}
              onChange={(e) => setCompetitorsText(e.target.value)}
              rows={4}
              placeholder="competitor1.com&#10;competitor2.com"
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 outline-none resize-none text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
            <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
            >
            {loading ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Backlinks...
                </>
            ) : (
                <>
                <Link2 className="w-5 h-5" />
                Analyze Authority Links
                </>
            )}
            </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Link Gap Domains</p>
              <p className="text-3xl font-bold text-blue-400">
                {result.quickStats.totalGapDomains}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">High-Value Opps</p>
              <p className="text-3xl font-bold text-emerald-400">
                {result.quickStats.highValueOpportunities}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Your DA</p>
              <p className="text-3xl font-bold text-purple-400">
                {result.yourProfile.domainAuthority}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Avg Competitor DA</p>
              <p className="text-3xl font-bold text-amber-400">
                {result.quickStats.avgCompetitorDA}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Links Needed</p>
              <p className="text-3xl font-bold text-rose-400">
                ~{result.quickStats.estimatedLinksNeeded}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5" /> Key Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/10">
                <p className="text-emerald-200/70 text-xs font-bold uppercase mb-1">Biggest Opportunity</p>
                <p className="text-white text-sm">{result.summary.biggestOpportunity}</p>
              </div>
              <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/10">
                <p className="text-emerald-200/70 text-xs font-bold uppercase mb-1">Top Priority</p>
                <p className="text-emerald-400 text-sm font-medium">{result.summary.topPriority}</p>
              </div>
              <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/10">
                <p className="text-emerald-200/70 text-xs font-bold uppercase mb-1">Competitor Advantage</p>
                <p className="text-white text-sm">{result.summary.competitorAdvantage}</p>
              </div>
              <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/10">
                <p className="text-emerald-200/70 text-xs font-bold uppercase mb-1">Recommended Focus</p>
                <p className="text-purple-400 text-sm">{result.summary.recommendedFocus}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "overview" && (
                <div className="animate-fade-in">
                    <LinkProfileComparison
                    yourProfile={result.yourProfile}
                    competitors={result.competitors}
                    />
                </div>
            )}

            {activeTab === "gaps" && (
                <div className="animate-fade-in">
                    <LinkGapAnalysis gaps={result.linkGaps} />
                </div>
            )}

            {activeTab === "outreach" && (
                <div className="animate-fade-in">
                    <OutreachTargetList targets={result.outreachTargets} />
                </div>
            )}

            {activeTab === "strategies" && (
                <div className="animate-fade-in">
                    <LinkBuildingStrategies strategies={result.strategies} />
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityLinkDashboard;