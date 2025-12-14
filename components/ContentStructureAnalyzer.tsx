import React, { useState } from "react";
import { ContentStructureResult } from "../types";
import { analyzeContentStructure } from "../services/contentStructureService";
import ContentScoreComparison from "./ContentScoreComparison";
import HeadingStructureView from "./HeadingStructureView";
import ContentGapsList from "./ContentGapsList";
import TopicCoverageMatrix from "./TopicCoverageMatrix";
import ContentTemplateView from "./ContentTemplateView";
import QuickWinsPanel from "./QuickWinsPanel";
import { Loader2, FileText, Search, Layout, List, FileEdit, Zap, Target } from "lucide-react";

const ContentStructureAnalyzer: React.FC = () => {
  const [keyword, setKeyword] = useState("water damage restoration arlington va");
  const [yourUrl, setYourUrl] = useState("");
  const [competitorCount, setCompetitorCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContentStructureResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "structure" | "gaps" | "topics" | "template"
  >("overview");

  const handleAnalyze = async () => {
    if (!keyword.trim()) {
      setError("Please enter a target keyword");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeContentStructure(
        keyword.trim(),
        yourUrl.trim() || null,
        competitorCount
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze content");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "structure", label: "Structure", icon: List },
    { id: "gaps", label: "Content Gaps", icon: Search },
    { id: "topics", label: "Topics", icon: FileText },
    { id: "template", label: "Template", icon: FileEdit },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Content Structure Analyzer
            <span className="text-sm font-normal px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Deep Analysis
            </span>
          </h2>
          <p className="text-gray-400 mt-1">
            Reverse-engineer top-ranking content and identify optimization opportunities.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. water damage restoration arlington va"
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Page URL (optional)
            </label>
            <input
              type="text"
              value={yourUrl}
              onChange={(e) => setYourUrl(e.target.value)}
              placeholder="https://flooddoctorva.com/arlington"
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <p className="text-gray-500 text-xs mt-2 ml-1">
              Leave empty to generate a new content template
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Competitors to Analyze
            </label>
            <select
              value={competitorCount}
              onChange={(e) => setCompetitorCount(parseInt(e.target.value))}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            >
              <option value={3}>Top 3</option>
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
            </select>
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
                Analyzing Content...
                </>
            ) : (
                <>
                <Search className="w-5 h-5" />
                Analyze Structure
                </>
            )}
            </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
            <Target className="w-5 h-5 text-rose-500" />
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1 font-bold">Your Score</p>
              <p className={`text-3xl font-bold ${
                result.summary.yourScore >= 80 ? "text-emerald-400" :
                result.summary.yourScore >= 60 ? "text-amber-400" : "text-rose-400"
              }`}>
                {result.yourPage ? result.summary.yourScore : "N/A"}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1 font-bold">Avg Competitor</p>
              <p className="text-3xl font-bold text-blue-400">
                {result.summary.avgCompetitorScore}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1 font-bold">Avg Word Count</p>
              <p className="text-3xl font-bold text-white">
                {result.avgCompetitorWordCount.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1 font-bold">Content Gaps</p>
              <p className="text-3xl font-bold text-rose-400">
                {result.gaps.length}
              </p>
            </div>
          </div>

          {/* Priority Alert */}
          <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-5 flex items-start gap-4">
            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400 shrink-0">
                <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-indigo-400 font-bold text-sm uppercase mb-1">Top Priority Action</p>
              <p className="text-white font-medium">{result.summary.topPriority}</p>
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
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <ContentScoreComparison
                yourPage={result.yourPage}
                competitors={result.competitors}
                avgCompetitorScore={result.summary.avgCompetitorScore}
              />
              <QuickWinsPanel quickWins={result.quickWins} />
            </div>
          )}

          {/* Structure Tab */}
          {activeTab === "structure" && (
            <div className="animate-fade-in">
                <HeadingStructureView
                yourPage={result.yourPage}
                competitors={result.competitors}
                />
            </div>
          )}

          {/* Gaps Tab */}
          {activeTab === "gaps" && (
            <div className="animate-fade-in">
                <ContentGapsList gaps={result.gaps} />
            </div>
          )}

          {/* Topics Tab */}
          {activeTab === "topics" && (
            <div className="animate-fade-in">
                <TopicCoverageMatrix topics={result.topicCoverage} />
            </div>
          )}

          {/* Template Tab */}
          {activeTab === "template" && (
            <div className="animate-fade-in">
                <ContentTemplateView template={result.contentTemplate} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentStructureAnalyzer;