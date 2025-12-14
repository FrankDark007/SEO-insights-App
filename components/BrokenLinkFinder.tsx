import React, { useState } from "react";
import { BrokenLinkAuditResult } from "../types";
import { runBrokenLinkAudit } from "../services/brokenLinkService";
import BrokenLinkSummary from "./BrokenLinkSummary";
import BrokenLinksTable from "./BrokenLinksTable";
import LinkBuildingOpportunities from "./LinkBuildingOpportunities";
import CitationIssuesTable from "./CitationIssuesTable";
import RedirectChainsTable from "./RedirectChainsTable";
import PriorityActionsPanel from "./PriorityActionsPanel";
import { Link, Loader2, BarChart2, Unlink, Target, MapPin, GitMerge, AlertCircle, Ghost } from "lucide-react";

const BrokenLinkFinder: React.FC = () => {
  const [domain, setDomain] = useState("flooddoctorva.com");
  const [competitors, setCompetitors] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BrokenLinkAuditResult | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "broken" | "opportunities" | "citations" | "redirects">("overview");

  const handleAudit = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain to audit");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const competitorList = competitors
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean);

      const data = await runBrokenLinkAudit(domain.trim(), competitorList);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run audit");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "broken", label: "Broken Links", icon: Unlink },
    { id: "opportunities", label: "Link Building", icon: Target },
    { id: "citations", label: "Citations", icon: MapPin },
    { id: "redirects", label: "Redirects", icon: GitMerge },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Broken Link Finder
            <span className="text-sm font-normal px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30 flex items-center gap-1">
              <Unlink className="w-3 h-3" /> Link Health Audit
            </span>
          </h2>
          <p className="text-gray-400 mt-1">
            Find broken links, redirect chains, and link building opportunities to recover authority.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Domain
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Link className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Competitors (one per line, for link opportunities)
            </label>
            <textarea
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              placeholder="servpro.com&#10;puroclean.com&#10;servicemaster.com"
              rows={3}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
            <button
            onClick={handleAudit}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
            >
            {loading ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning for Broken Links...
                </>
            ) : (
                <>
                <Unlink className="w-5 h-5" />
                Start Link Audit
                </>
            )}
            </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8 animate-fade-in">
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
                {tab.id === "broken" && result.brokenLinks.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[10px] font-bold">
                    {result.brokenLinks.length}
                  </span>
                )}
                {tab.id === "opportunities" && result.linkBuildingOpportunities.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                    {result.linkBuildingOpportunities.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="space-y-8">
                <BrokenLinkSummary summary={result.summary} />
                <PriorityActionsPanel actions={result.priorityActions} />
                </div>
            )}

            {/* Broken Links Tab */}
            {activeTab === "broken" && (
                <BrokenLinksTable links={result.brokenLinks} />
            )}

            {/* Link Building Tab */}
            {activeTab === "opportunities" && (
                <LinkBuildingOpportunities opportunities={result.linkBuildingOpportunities} />
            )}

            {/* Citations Tab */}
            {activeTab === "citations" && (
                <CitationIssuesTable issues={result.citationIssues} />
            )}

            {/* Redirects Tab */}
            {activeTab === "redirects" && (
                <div className="space-y-8">
                <RedirectChainsTable chains={result.redirectChains} />
                
                {/* Orphan Pages */}
                {result.orphanPages.length > 0 && (
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Ghost className="w-5 h-5 text-violet-400" /> Orphan Pages ({result.orphanPages.length})
                    </h3>
                    <div className="space-y-4">
                        {result.orphanPages.map((page, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-violet-500 border-t border-r border-b border-gray-800"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-white font-medium">{page.title}</p>
                                <span className="text-[10px] text-gray-500">Last crawled: {page.lastCrawled}</span>
                            </div>
                            <p className="text-violet-400 font-mono text-sm mb-3">
                            {page.url}
                            </p>
                            <div className="flex items-center gap-2 text-sm bg-violet-900/10 p-2 rounded border border-violet-900/20">
                                <span className="text-violet-300 font-bold text-xs uppercase">Fix:</span>
                                <span className="text-violet-100 text-xs">{page.recommendation}</span>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                )}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokenLinkFinder;