import React, { useState } from 'react';
import { spyOnAds } from '../services/googleAdsSpyService';
import { AdsSpyResult } from '../types';
import AdCopyCard from './AdCopyCard';
import SwipeFileTable from './SwipeFileTable';
import AdCopyGenerator from './AdCopyGenerator';
import { 
  ScanSearch, 
  Loader2, 
  AlertCircle, 
  Search,
  BadgeDollarSign,
  MousePointer2,
  Megaphone,
  Layout,
  Target,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Copy
} from 'lucide-react';

const GoogleAdsSpy: React.FC = () => {
  const [keyword, setKeyword] = useState('water damage restoration arlington va');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdsSpyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ads' | 'swipe' | 'generator' | 'landing'>('ads');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await spyOnAds(keyword);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Ads analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Google Ads Spy
            <span className="text-sm bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30 font-normal">
                PPC Intelligence
            </span>
          </h2>
          <p className="text-gray-400">Reverse engineer competitor ad copy, landing pages, and offers.</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Target Keyword</label>
            <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                    placeholder="e.g. emergency plumber dallas"
                    required
                />
            </div>
          </div>
          <div className="flex items-end">
            <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 h-[52px]"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ScanSearch className="w-5 h-5" />}
                Spy on Ads
            </button>
          </div>
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
            
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Ads Found</p>
                    <p className="text-2xl font-bold text-white">{result.overview.totalAds}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Unique Advertisers</p>
                    <p className="text-2xl font-bold text-indigo-400">{result.overview.uniqueAdvertisers}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Avg Position</p>
                    <p className="text-2xl font-bold text-white">{result.overview.avgPosition}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">LSAs Present</p>
                    <p className={`text-2xl font-bold ${result.overview.lsaPresent ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {result.overview.lsaPresent ? `Yes (${result.overview.lsaCount})` : 'No'}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-800 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('ads')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'ads' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <Megaphone className="w-4 h-4" /> Live Ads
                </button>
                <button 
                    onClick={() => setActiveTab('swipe')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'swipe' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <Copy className="w-4 h-4" /> Swipe File
                </button>
                <button 
                    onClick={() => setActiveTab('landing')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'landing' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <Layout className="w-4 h-4" /> Landing Pages
                </button>
                <button 
                    onClick={() => setActiveTab('generator')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'generator' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <Zap className="w-4 h-4" /> AI Generator
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'ads' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {result.ads.map((ad, i) => (
                                <AdCopyCard key={i} ad={ad} />
                            ))}
                        </div>

                        {/* LSA Analysis */}
                        {result.lsaAnalysis && result.lsaAnalysis.length > 0 && (
                            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg mt-8">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" /> Local Service Ads
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {result.lsaAnalysis.map((lsa, i) => (
                                        <div key={i} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-white">{lsa.businessName}</h4>
                                                <span className="text-amber-400 font-bold text-sm flex items-center gap-1">
                                                    {lsa.rating} <span className="text-gray-500 text-xs font-normal">({lsa.reviewCount})</span>
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-xs text-gray-400">
                                                <p className="flex items-center gap-1">
                                                    <BadgeDollarSign className="w-3 h-3" /> Response: {lsa.responseTime}
                                                </p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {lsa.badges.map((badge, j) => (
                                                        <span key={j} className="bg-emerald-900/30 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/50">
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'swipe' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SwipeFileTable items={result.headlines} type="Headline" />
                        <SwipeFileTable items={result.descriptions} type="Description" />
                        
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Themes */}
                            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-violet-400" /> Common Angles
                                </h3>
                                <div className="space-y-3">
                                    {result.themes.map((theme, i) => (
                                        <div key={i} className="flex items-center justify-between bg-gray-900/50 p-2 rounded border border-gray-800">
                                            <div>
                                                <p className="text-sm text-gray-200">{theme.theme}</p>
                                                <p className="text-[10px] text-indigo-400">{theme.yourOpportunity}</p>
                                            </div>
                                            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">
                                                {theme.frequency} / {theme.totalAds}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Missing Angles */}
                            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-400" /> Untapped Opportunities
                                </h3>
                                <div className="space-y-3">
                                    {result.missingAngles.map((opp, i) => (
                                        <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 flex items-start gap-2">
                                            <div className="mt-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{opp.angle}</p>
                                                <p className="text-xs text-gray-400">{opp.whyItMatters}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'landing' && (
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
                                        <th className="p-4 font-semibold">Competitor</th>
                                        <th className="p-4 font-semibold text-center">Page Speed</th>
                                        <th className="p-4 font-semibold text-center">Mobile</th>
                                        <th className="p-4 font-semibold">CTA Location</th>
                                        <th className="p-4 font-semibold text-center">Forms</th>
                                        <th className="p-4 font-semibold text-center">Trust</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {result.landingPages.map((page, i) => (
                                        <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4">
                                                <a href={page.url} target="_blank" rel="noreferrer" className="text-white font-medium hover:underline text-sm block max-w-[150px] truncate">
                                                    {page.competitor}
                                                </a>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold ${
                                                    page.pageSpeed === 'fast' ? 'bg-emerald-900/30 text-emerald-400' :
                                                    page.pageSpeed === 'medium' ? 'bg-amber-900/30 text-amber-400' :
                                                    'bg-rose-900/30 text-rose-400'
                                                }`}>
                                                    {page.pageSpeed}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold ${
                                                    page.mobileExperience === 'good' ? 'bg-emerald-900/30 text-emerald-400' :
                                                    'bg-gray-800 text-gray-400'
                                                }`}>
                                                    {page.mobileExperience}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-300 capitalize">
                                                {page.ctaVisibility.replace('_', ' ')}
                                            </td>
                                            <td className="p-4 text-center text-sm text-white">
                                                {page.formFields}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-bold text-white">{page.trustSignalCount}</span>
                                                    <span className="text-[10px] text-gray-500 truncate max-w-[100px]">{page.trustSignals.slice(0, 2).join(', ')}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'generator' && (
                    <AdCopyGenerator data={result.generatedAds} />
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAdsSpy;