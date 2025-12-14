import React, { useState } from "react";
import { SEOHealthMonitorResult, SEOAlert, ActionChecklist } from "../types";
import { runSEOHealthMonitor, MonitorConfig } from "../services/seoHealthMonitorService";
import HealthScoreDashboard from "./HealthScoreDashboard";
import AlertsPanel from "./AlertsPanel";
import RankingsTracker from "./RankingsTracker";
import ActionChecklistPanel from "./ActionChecklistPanel";
import WeeklyDigestPanel from "./WeeklyDigestPanel";
import CompetitorThreatPanel from "./CompetitorThreatPanel";

const DEFAULT_CONFIG: MonitorConfig = {
  domain: "flooddoctorva.com",
  competitors: ["servpro.com", "servicemaster.com", "puroclean.com", "belfor.com"],
  targetKeywords: [
    "water damage restoration arlington va",
    "flood cleanup fairfax va",
    "emergency water removal near me",
    "basement flooding alexandria va",
    "mold remediation mclean va",
  ],
  alertThresholds: {
    rankingDropAlert: 3,
    trafficDropAlert: 10,
    newCompetitorAlert: true,
  },
};

const SEOHealthMonitor: React.FC = () => {
  const [config, setConfig] = useState<MonitorConfig>(DEFAULT_CONFIG);
  const [keywordsText, setKeywordsText] = useState(DEFAULT_CONFIG.targetKeywords.join("\n"));
  const [competitorsText, setCompetitorsText] = useState(DEFAULT_CONFIG.competitors.join("\n"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SEOHealthMonitorResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "alerts" | "rankings" | "actions" | "competitors" | "digest"
  >("dashboard");

  const handleRunMonitor = async () => {
    const keywords = keywordsText.split("\n").map((k) => k.trim()).filter(Boolean);
    const competitors = competitorsText.split("\n").map((c) => c.trim()).filter(Boolean);

    if (keywords.length === 0) {
      setError("Please enter at least one target keyword");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await runSEOHealthMonitor({
        ...config,
        targetKeywords: keywords,
        competitors: competitors,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run health monitor");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAlertRead = (id: string) => {
    if (!result) return;
    setResult({
      ...result,
      alerts: result.alerts.map((a) =>
        a.id === id ? { ...a, isRead: true } : a
      ),
    });
  };

  const handleMarkAlertActioned = (id: string) => {
    if (!result) return;
    setResult({
      ...result,
      alerts: result.alerts.map((a) =>
        a.id === id ? { ...a, isActioned: true } : a
      ),
    });
  };

  const handleToggleActionComplete = (id: string) => {
    if (!result) return;
    setResult({
      ...result,
      actionChecklist: result.actionChecklist.map((a) =>
        a.id === id ? { ...a, isCompleted: !a.isCompleted } : a
      ),
    });
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "alerts", label: "Alerts", icon: "🔔", badge: result?.alerts.filter((a) => !a.isRead).length },
    { id: "rankings", label: "Rankings", icon: "📈" },
    { id: "actions", label: "Actions", icon: "✅", badge: result?.actionChecklist.filter((a) => !a.isCompleted).length },
    { id: "competitors", label: "Competitors", icon: "⚔️" },
    { id: "digest", label: "Weekly Digest", icon: "📧" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            SEO Health Monitor
            <span className="text-sm font-normal px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
              Command Center
            </span>
          </h2>
          <p className="text-gray-400 mt-1">
            Real-time monitoring of all SEO signals with automated alerts and action checklists
          </p>
        </div>
      </div>

      {/* Config Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Domain
            </label>
            <input
              type="text"
              value={config.domain}
              onChange={(e) => setConfig({ ...config, domain: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Keywords (one per line)
            </label>
            <textarea
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 outline-none resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Competitors (one per line)
            </label>
            <textarea
              value={competitorsText}
              onChange={(e) => setCompetitorsText(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 outline-none resize-none text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleRunMonitor}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Running Health Check...
              </>
            ) : (
              <>🔍 Run Health Check</>
            )}
          </button>

          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 text-gray-400">
              <span>Alert on rank drop &gt;</span>
              <input
                type="number"
                value={config.alertThresholds.rankingDropAlert}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    alertThresholds: {
                      ...config.alertThresholds,
                      rankingDropAlert: parseInt(e.target.value) || 3,
                    },
                  })
                }
                className="w-12 bg-gray-700 text-white px-2 py-1 rounded border border-gray-600"
              />
              <span>positions</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-700 pb-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {tab.icon} {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <HealthScoreDashboard
                overallScore={result.overallHealthScore}
                healthTrend={result.healthTrend}
                quickStats={result.quickStats}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AlertsPanel
                  alerts={result.alerts.slice(0, 5)}
                  onMarkRead={handleMarkAlertRead}
                  onMarkActioned={handleMarkAlertActioned}
                />
                <ActionChecklistPanel
                  actions={result.actionChecklist.slice(0, 4)}
                  onToggleComplete={handleToggleActionComplete}
                />
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === "alerts" && (
            <AlertsPanel
              alerts={result.alerts}
              onMarkRead={handleMarkAlertRead}
              onMarkActioned={handleMarkAlertActioned}
            />
          )}

          {/* Rankings Tab */}
          {activeTab === "rankings" && (
            <RankingsTracker rankings={result.rankings} />
          )}

          {/* Actions Tab */}
          {activeTab === "actions" && (
            <ActionChecklistPanel
              actions={result.actionChecklist}
              onToggleComplete={handleToggleActionComplete}
            />
          )}

          {/* Competitors Tab */}
          {activeTab === "competitors" && (
            <CompetitorThreatPanel competitors={result.competitors} />
          )}

          {/* Digest Tab */}
          {activeTab === "digest" && (
            <WeeklyDigestPanel digest={result.weeklyDigest} />
          )}
        </>
      )}
    </div>
  );
};

export default SEOHealthMonitor;