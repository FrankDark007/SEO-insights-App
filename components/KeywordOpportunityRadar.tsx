import React, { useState } from "react";
import { KeywordRadarResult, CitySubdomain } from "../types";
import { scanKeywordOpportunities } from "../services/keywordRadarService";
import CityScoreCard from "./CityScoreCard";
import KeywordTable from "./KeywordTable";
import PageRecommendations from "./PageRecommendations";
import KeywordQuickWinsPanel from "./KeywordQuickWinsPanel";
import ClusterCoverage from "./ClusterCoverage";
import { Loader2, Radar, Target } from "lucide-react";

const DEFAULT_SERVICES = [
  "water damage restoration",
  "flood cleanup",
  "basement flooding",
  "mold remediation",
  "sewage cleanup",
  "burst pipe repair",
  "water extraction",
  "structural drying",
  "emergency water removal",
  "fire damage restoration",
];

const KeywordOpportunityRadar: React.FC = () => {
  const [mainDomain, setMainDomain] = useState("flooddoctorva.com");
  const [citiesInput, setCitiesInput] = useState(
    "Arlington, VA, arlington.flooddoctorva.com\nAlexandria, VA, alexandria.flooddoctorva.com\nFairfax, VA, fairfax.flooddoctorva.com\nMcLean, VA, mclean.flooddoctorva.com\nFalls Church, VA, fallschurch.flooddoctorva.com"
  );
  const [services, setServices] = useState(DEFAULT_SERVICES.join("\n"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordRadarResult | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "pages" | "clusters">("overview");

  const parseCities = (): CitySubdomain[] => {
    return citiesInput
      .split("\n")
      .map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 3) {
          return {
            city: parts[0],
            state: parts[1],
            subdomain: parts[2],
          };
        }
        return null;
      })
      .filter(Boolean) as CitySubdomain[];
  };

  const handleScan = async () => {
    const cities = parseCities();
    if (cities.length === 0) {
      setError("Please enter at least one city with subdomain");
      return;
    }

    const serviceList = services
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    setError(null);

    try {
      const data = await scanKeywordOpportunities(serviceList, cities, mainDomain);
      setResult(data);
      setSelectedCity(null);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to scan keywords");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "keywords", label: "All Keywords", icon: "🔑" },
    { id: "pages", label: "Pages to Create", icon: "📝" },
    { id: "clusters", label: "Topic Clusters", icon: "🎯" },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Keyword Opportunity Radar
            <span className="text-sm font-normal px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30">
              Multi-City Intelligence
            </span>
          </h2>
          <p className="text-gray-400 mt-1">
            Track keywords across all your city subdomains and find content gaps.
          </p>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Main Domain
            </label>
            <input
              type="text"
              value={mainDomain}
              onChange={(e) => setMainDomain(e.target.value)}
              placeholder="flooddoctorva.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City Subdomains (City, State, Subdomain per line)
            </label>
            <textarea
              value={citiesInput}
              onChange={(e) => setCitiesInput(e.target.value)}
              rows={4}
              placeholder="Arlington, VA, arlington.flooddoctorva.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Services to Track (one per line)
            </label>
            <textarea
              value={services}
              onChange={(e) => setServices(e.target.value)}
              rows={4}
              placeholder="water damage restoration&#10;flood cleanup"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
            <button
            onClick={handleScan}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
            >
            {loading ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning Keywords...
                </>
            ) : (
                <>
                <Radar className="w-5 h-5" />
                Scan Keyword Opportunities
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
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1">Cities</p>
              <p className="text-2xl font-bold text-white">
                {result.summary.totalCities}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1">Keywords</p>
              <p className="text-2xl font-bold text-white">
                {result.summary.totalKeywordsTracked}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-blue-400">
                {result.summary.totalMonthlyVolume.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1">Captured</p>
              <p className="text-2xl font-bold text-emerald-400">
                {result.summary.capturedVolume.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1">Missed</p>
              <p className="text-2xl font-bold text-rose-400">
                {result.summary.missedOpportunityVolume.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 text-center shadow-lg">
              <p className="text-gray-400 text-xs uppercase mb-1">Pages Needed</p>
              <p className="text-2xl font-bold text-violet-400">
                {result.summary.pagesNeeded}
              </p>
            </div>
          </div>

          {/* Alerts */}
          {result.summary.seasonalAlerts.length > 0 && (
            <div className="bg-amber-900/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <span className="text-amber-400 text-xl">📅</span>
              <div>
                <h4 className="text-amber-400 font-bold mb-1">Seasonal Alerts</h4>
                <ul className="space-y-1">
                    {result.summary.seasonalAlerts.map((alert, i) => (
                    <li key={i} className="text-amber-200/80 text-sm flex items-center gap-2">
                        <span>•</span> {alert}
                    </li>
                    ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-violet-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="space-y-8">
                {/* City Cards */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        🏙️ City Performance
                        {selectedCity && (
                            <button
                            onClick={() => setSelectedCity(null)}
                            className="ml-3 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700 hover:text-white"
                            >
                            Clear Filter
                            </button>
                        )}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {result.cities.map((city, index) => (
                        <CityScoreCard
                        key={index}
                        city={city}
                        onClick={() =>
                            setSelectedCity(selectedCity === city.city ? null : city.city)
                        }
                        isSelected={selectedCity === city.city}
                        />
                    ))}
                    </div>
                </div>

                {/* Quick Wins */}
                <KeywordQuickWinsPanel quickWins={result.quickWins} />

                {/* Rising Keywords */}
                {result.summary.topRisingKeywords.length > 0 && (
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4">
                        📈 Trending Keywords (Rising Volume)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {result.summary.topRisingKeywords.map((kw, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 bg-emerald-900/20 text-emerald-400 border border-emerald-900/30 rounded-lg text-sm font-medium"
                        >
                            ↑ {kw}
                        </span>
                        ))}
                    </div>
                    </div>
                )}
                </div>
            )}

            {/* Keywords Tab */}
            {activeTab === "keywords" && (
                <KeywordTable
                keywords={result.allKeywords}
                filterCity={selectedCity || undefined}
                />
            )}

            {/* Pages Tab */}
            {activeTab === "pages" && (
                <PageRecommendations recommendations={result.pageRecommendations} />
            )}

            {/* Clusters Tab */}
            {activeTab === "clusters" && (
                <ClusterCoverage clusters={result.clusters} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordOpportunityRadar;