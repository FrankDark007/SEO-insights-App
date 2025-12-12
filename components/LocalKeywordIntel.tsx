import React, { useState } from 'react';
import { analyzeLocalKeywords } from '../services/localKeywordService';
import { LocalKeywordIntel as LocalKeywordIntelType } from '../types';
import CityComparisonChart from './CityComparisonChart';
import SeasonalTrendChart from './SeasonalTrendChart';
import KeywordVariationTable from './KeywordVariationTable';
import CityStrategyCard from './CityStrategyCard';
import { 
  Map, 
  Loader2, 
  Target, 
  TrendingUp, 
  AlertCircle,
  Layout,
  BarChart2,
  List,
  Compass,
  Zap,
  Globe
} from 'lucide-react';

const LocalKeywordIntel: React.FC = () => {
  const [formData, setFormData] = useState({
    serviceType: 'Water Damage Restoration',
    cities: 'Arlington, Alexandria, McLean, Fairfax, Washington DC, Bethesda'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LocalKeywordIntelType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'strategy'>('overview');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceType || !formData.cities) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const cityList = formData.cities.split(',').map(c => c.trim()).filter(c => c.length > 0);

    try {
      const data = await analyzeLocalKeywords(formData.serviceType, cityList);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Local Keyword Intelligence</h2>
          <p className="text-gray-400">Decode search behavior differences between neighborhoods and cities.</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Service Type</label>
            <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
            >
                <option>Water Damage Restoration</option>
                <option>Mold Remediation</option>
                <option>Fire Damage Repair</option>
                <option>Plumbing Services</option>
                <option>HVAC Repair</option>
                <option>Roofing</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Cities to Analyze (Comma separated)</label>
            <input
              type="text"
              name="cities"
              value={formData.cities}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="City 1, City 2, City 3"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 h-[42px]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
            Analyze Behavior
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
            
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-800">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <BarChart2 className="w-4 h-4" /> Market Overview
                </button>
                <button 
                    onClick={() => setActiveTab('keywords')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'keywords' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <List className="w-4 h-4" /> Keywords & Trends
                </button>
                <button 
                    onClick={() => setActiveTab('strategy')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'strategy' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <Compass className="w-4 h-4" /> Content Strategy
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* City Comparison Table */}
                        <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
                                            <th className="p-4 font-semibold">City</th>
                                            <th className="p-4 font-semibold">Population</th>
                                            <th className="p-4 font-semibold">Avg Home Value</th>
                                            <th className="p-4 font-semibold">Primary Pattern</th>
                                            <th className="p-4 font-semibold text-center">Opp. Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {result.cityOverview.map((city, i) => (
                                            <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                                <td className="p-4 font-medium text-white">{city.city}</td>
                                                <td className="p-4 text-gray-300">{city.population.toLocaleString()}</td>
                                                <td className="p-4 text-gray-300">${(city.avgHomeValue / 1000).toFixed(0)}k</td>
                                                <td className="p-4 text-indigo-300 text-sm">{city.primarySearchPattern}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`text-sm font-bold ${
                                                        city.opportunityScore > 80 ? 'text-emerald-400' : 
                                                        city.opportunityScore > 60 ? 'text-amber-400' : 'text-gray-400'
                                                    }`}>
                                                        {city.opportunityScore}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Charts */}
                        <CityComparisonChart intentData={result.intentByCity} propertyData={result.propertyTypeDistribution} />
                    </div>
                )}

                {activeTab === 'keywords' && (
                    <div className="space-y-6">
                        <KeywordVariationTable variations={result.keywordVariationMatrix} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SeasonalTrendChart data={result.seasonalTrends} />
                            
                            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg h-[350px] overflow-y-auto custom-scrollbar">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Emerging Trends
                                </h3>
                                <div className="space-y-3">
                                    {result.emergingKeywords.map((trend, i) => (
                                        <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-bold text-white">"{trend.keyword}"</p>
                                                <span className="text-xs bg-emerald-900/30 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/50">
                                                    +{trend.growthPercent}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-2">Seen in: {trend.cities.join(', ')}</p>
                                            <div className="flex items-start gap-1 text-xs text-indigo-300 bg-indigo-900/10 p-2 rounded">
                                                <Zap className="w-3 h-3 mt-0.5 shrink-0" />
                                                {trend.recommendedAction}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Competitor Gaps */}
                        {result.competitorGapsByCity.length > 0 && (
                            <div className="bg-gradient-to-r from-rose-900/20 to-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-rose-400" /> Competitor Weak Spots
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {result.competitorGapsByCity.map((gap, i) => (
                                        <div key={i} className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">{gap.city}</p>
                                            <p className="text-white font-medium mb-2">"{gap.keywordGap}"</p>
                                            <p className="text-xs text-gray-400">Competitors rank in {gap.competitorRankingElsewhere} but miss this.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'strategy' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {result.contentStrategy.map((strategy, i) => (
                            <CityStrategyCard key={i} strategy={strategy} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default LocalKeywordIntel;