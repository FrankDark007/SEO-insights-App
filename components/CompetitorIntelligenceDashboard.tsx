import React, { useState } from "react";
import { CompetitorIntelligenceResult } from "../types";
import { analyzeCompetitors } from "../services/competitorIntelService";
import CompetitorScoreCard from "./CompetitorScoreCard";
import RecentChangesTimeline from "./RecentChangesTimeline";
import KeywordBattleTable from "./KeywordBattleTable";
import ContentComparisonPanel from "./ContentComparisonPanel";
import ActionChecklist from "./ActionChecklist";
import CorrelationInsights from "./CorrelationInsights";
import WeeklyDigestCard from "./WeeklyDigestCard";
import { Loader2, VenetianMask } from "lucide-react";

const DEFAULT_KEYWORDS = [
  "water damage restoration",
  "flood cleanup",
  "emergency water removal",
  "basement flooding",
  "mold remediation",
  "sewage cleanup",
  "burst pipe repair",
  "water extraction",
  "fire damage restoration",
  "storm damage repair",
];

const DEFAULT_COMPETITORS = [
  "servpro.com",
  "puroclean.com",
  "servicemaster.com",
  "belfor.com",
  "rainbowintl.com",
];

const CompetitorIntelligenceDashboard: React.FC = () => {
  const [yourDomain, setYourDomain] = useState("flooddoctorva.com");
  const [location, setLocation] = useState("Northern Virginia");
  const [competitors, setCompetitors] = useState(DEFAULT_COMPETITORS.join("\n"));
  const [keywords, setKeywords] = useState(DEFAULT_KEYWORDS.join("\n"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompetitorIntelligenceResult | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "digest" | "changes" | "battles" | "content" | "actions" | "insights"
  >("digest");

  const handleAnalyze = async () => {
    if (!yourDomain.trim()) {
      setError("Please enter your domain");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const competitorList = competitors
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean);
      const keywordList = keywords
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean);

      const data = await analyzeCompetitors(
        yourDomain.trim(),
        competitorList,
        keywordList,
        location
      );
      setResult(data);
      setSelectedCompetitor(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze competitors");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "digest", label: "Weekly Digest", icon: "📋" },
    { id: "changes", label: "Recent Changes", icon: "🔔" },
    { id: "battles", label: "Keyword Battles", icon: "⚔️" },
    { id: "content", label: "Content Analysis", icon: "📊" },
    { id: "actions", label: "Action Checklist", icon: "✅" },
    { id: "insights", label: "Correlations", icon: "🔬" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Competitor Intelligence
            <span className="text-sm font-normal px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30 flex items-center gap-1">
              <VenetianMask className="w-3 h-3" /> Reverse Engineering
            </span>
          </h2>
          <p className="text-gray-400 mt-1">
            Monitor competitors, detect changes, and get actionable recommendations
          </p>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Domain
            </label>
            <input
              type="text"
              value={yourDomain}
              onChange={(e) => setYourDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="w-full bg-gray-900 text-white pl-3 pr-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Northern Virginia"
              className="w-full bg-gray-900 text-white pl-3 pr-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Competitors (one per line)
            </label>
            <textarea
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              rows={4}
              placeholder="competitor1.com&#10;competitor2.com"
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Keywords (one per line)
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={4}
              placeholder="water damage restoration&#10;flood cleanup"
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
            <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
            >
            {loading ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Competitors...
                </>
            ) : (
                <>
                <VenetianMask className="w-5 h-5" />
                Reverse Engineer Competitors
                </>
            )}
            </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Competitor Cards */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              🎯 Tracked Competitors
              {selectedCompetitor && (
                <button
                  onClick={() => setSelectedCompetitor(null)}
                  className="ml-3 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700 hover:text-white"
                >
                  Clear Filter
                </button>
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {result.competitors.map((competitor, index) => (
                <CompetitorScoreCard
                  key={index}
                  competitor={competitor}
                  onClick={() =>
                    setSelectedCompetitor(
                      selectedCompetitor === competitor.domain
                        ? null
                        : competitor.domain
                    )
                  }
                  isSelected={selectedCompetitor === competitor.domain}
                />
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {/* Weekly Digest Tab */}
            {activeTab === "digest" && (
                <WeeklyDigestCard digest={result.weeklyDigest} />
            )}

            {/* Recent Changes Tab */}
            {activeTab === "changes" && (
                <RecentChangesTimeline
                changes={result.recentChanges}
                filterCompetitor={selectedCompetitor || undefined}
                />
            )}

            {/* Keyword Battles Tab */}
            {activeTab === "battles" && (
                <KeywordBattleTable battles={result.keywordBattles} />
            )}

            {/* Content Analysis Tab */}
            {activeTab === "content" && (
                <ContentComparisonPanel comparisons={result.contentComparisons} />
            )}

            {/* Action Checklist Tab */}
            {activeTab === "actions" && (
                <ActionChecklist actions={result.actionItems} />
            )}

            {/* Correlation Insights Tab */}
            {activeTab === "insights" && (
                <CorrelationInsights insights={result.correlationInsights} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorIntelligenceDashboard;