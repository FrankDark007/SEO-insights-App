import React, { useState } from "react";
import { LinkAttributeAuditResult } from "../types";
import { auditLinkAttributes } from "../services/linkAttributeService";
import LinkHealthScoreCard from "./LinkHealthScoreCard";
import AnchorTextDistribution from "./AnchorTextDistribution";
import BacklinkTable from "./BacklinkTable";
import ToxicLinksReport from "./ToxicLinksReport";
import LinkAttributeBreakdown from "./LinkAttributeBreakdown";
import LinkActionItems from "./LinkActionItems";
import { ShieldCheck, Loader2, Link as LinkIcon, Activity, List, Anchor, AlertTriangle, CheckSquare } from 'lucide-react';

const LinkAttributeAuditor: React.FC = () => {
  const [domain, setDomain] = useState("flooddoctorva.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LinkAttributeAuditResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "health" | "backlinks" | "anchors" | "toxic" | "actions"
  >("health");

  const handleAudit = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await auditLinkAttributes(domain.trim());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to audit links");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "health", label: "Health", icon: Activity },
    { id: "backlinks", label: "Backlinks", icon: List },
    { id: "anchors", label: "Anchors", icon: Anchor },
    { id: "toxic", label: "Toxic", icon: AlertTriangle },
    { id: "actions", label: "Actions", icon: CheckSquare },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Link Attribute Auditor
            <span className="text-sm font-normal px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Quality Control
            </span>
          </h2>
          <p className="text-gray-400 mt-1">
            Analyze link quality, detect spam signals, and optimize your backlink profile health.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Domain to Audit
            </label>
            <div className="relative">
                <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="yourdomain.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAudit}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 h-[46px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Auditing...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Start Audit
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
             <AlertTriangle className="w-5 h-5" />
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
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Total Backlinks</p>
              <p className="text-2xl font-bold text-white">
                {result.totalBacklinks.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Ref Domains</p>
              <p className="text-2xl font-bold text-blue-400">
                {result.totalReferringDomains}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Dofollow %</p>
              <p className="text-2xl font-bold text-emerald-400">
                {result.attributeBreakdown.dofollow}%
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Toxic Links</p>
              <p className="text-2xl font-bold text-rose-400">
                {result.toxicReport.totalToxicLinks}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Health Score</p>
              <p className={`text-2xl font-bold ${
                result.healthScore.overall >= 70 ? "text-emerald-400" :
                result.healthScore.overall >= 50 ? "text-amber-400" : "text-rose-400"
              }`}>
                {result.healthScore.overall}
              </p>
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

          {/* Tab Content */}
          <div className="min-h-[400px]">
              {activeTab === "health" && (
                <div className="space-y-8 animate-fade-in">
                  <LinkHealthScoreCard
                    healthScore={result.healthScore}
                    summary={result.summary}
                  />
                  <LinkAttributeBreakdown
                    attributeBreakdown={result.attributeBreakdown}
                    domainAuthorityDistribution={result.domainAuthorityDistribution}
                  />
                </div>
              )}

              {activeTab === "backlinks" && (
                <div className="animate-fade-in">
                    <BacklinkTable backlinks={result.backlinks} />
                </div>
              )}

              {activeTab === "anchors" && (
                <div className="animate-fade-in">
                    <AnchorTextDistribution analysis={result.anchorAnalysis} />
                </div>
              )}

              {activeTab === "toxic" && (
                <div className="animate-fade-in">
                    <ToxicLinksReport report={result.toxicReport} />
                </div>
              )}

              {activeTab === "actions" && (
                <div className="animate-fade-in">
                    <LinkActionItems
                    actionItems={result.actionItems}
                    topIssues={result.topIssues}
                    />
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkAttributeAuditor;
