import React, { useState } from 'react';
import { analyzeSerpFeatures } from '../services/serpFeatureService';
import { SerpFeatureAnalysis } from '../types';
import FeatureOverviewCards from './FeatureOverviewCards';
import SnippetOpportunityTable from './SnippetOpportunityTable';
import PAAList from './PAAList';
import { 
  ScanSearch, 
  Loader2, 
  AlertCircle, 
  MapPin,
  List,
  Image,
  Video,
  LayoutDashboard,
  CheckSquare
} from 'lucide-react';

const SerpFeatureTracker: React.FC = () => {
  const [formData, setFormData] = useState({
    keywords: [
      'water damage restoration',
      'mold remediation cost',
      'basement flooding cleanup',
      'emergency water removal',
      'sewage backup cleanup',
      'fire damage repair',
      'water damage insurance claim',
      'how to dry wet drywall'
    ].join('\n'),
    location: 'Arlington, VA'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SerpFeatureAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'snippets' | 'paa' | 'local' | 'visuals' | 'strategy'>('overview');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keywords) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const keywordList = formData.keywords.split('\n').map(k => k.trim()).filter(k => k.length > 0);

    try {
      const data = await analyzeSerpFeatures(keywordList, formData.location);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "SERP analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            SERP Feature Tracker
            <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30 font-normal">
                Zero-Click Strategy
            </span>
          </h2>
          <p className="text-gray-400">Capture traffic from Featured Snippets, PAA, Local Packs, and more.</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Target Keywords (One per line, max 20)</label>
            <textarea
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
              placeholder="keyword 1&#10;keyword 2"
              required
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location Context</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Chicago, IL"
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 mt-4"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ScanSearch className="w-5 h-5" />}
                Analyze Features
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
            
            {/* Overview Cards */}
            <FeatureOverviewCards overview={result.overview} />

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-800 overflow-x-auto">
                {[
                    { id: 'overview', label: 'Analysis', icon: LayoutDashboard },
                    { id: 'snippets', label: 'Snippets', icon: List },
                    { id: 'paa', label: 'People Also Ask', icon: CheckSquare },
                    { id: 'local', label: 'Local Pack', icon: MapPin },
                    { id: 'visuals', label: 'Images/Video', icon: Image },
                    { id: 'strategy', label: 'Strategy', icon: ScanSearch },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
                                        <th className="p-4 font-semibold">Keyword</th>
                                        <th className="p-4 font-semibold">Snippet</th>
                                        <th className="p-4 font-semibold text-center">Local Pack</th>
                                        <th className="p-4 font-semibold text-center">PAA</th>
                                        <th className="p-4 font-semibold text-center">Visuals</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {result.keywordAnalysis.map((kw, i) => (
                                        <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4 font-medium text-white">{kw.keyword}</td>
                                            <td className="p-4 text-sm">
                                                {kw.featuredSnippet ? (
                                                    <span className="text-amber-400 flex flex-col">
                                                        <span>{kw.featuredSnippet.type}</span>
                                                        <span className="text-xs text-gray-500 truncate max-w-[100px]">{kw.featuredSnippet.owner}</span>
                                                    </span>
                                                ) : <span className="text-gray-600">-</span>}
                                            </td>
                                            <td className="p-4 text-center">
                                                {kw.localPack ? (
                                                    <span className={`text-xs px-2 py-1 rounded font-bold ${kw.localPack.youAppear ? 'bg-emerald-900/30 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
                                                        {kw.localPack.youAppear ? 'Yes' : 'No'}
                                                    </span>
                                                ) : <span className="text-gray-600">-</span>}
                                            </td>
                                            <td className="p-4 text-center">
                                                {kw.paaQuestions.length > 0 ? (
                                                    <span className="text-indigo-400 font-bold">{kw.paaQuestions.length}</span>
                                                ) : <span className="text-gray-600">-</span>}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-1">
                                                    {kw.imagePackPresent && (
                                                        <span title="Image Pack">
                                                            <Image className="w-4 h-4 text-rose-400" />
                                                        </span>
                                                    )}
                                                    {kw.videoCarouselPresent && (
                                                        <span title="Video Carousel">
                                                            <Video className="w-4 h-4 text-red-500" />
                                                        </span>
                                                    )}
                                                    {!kw.imagePackPresent && !kw.videoCarouselPresent && <span className="text-gray-600">-</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'snippets' && (
                    <SnippetOpportunityTable opportunities={result.featuredSnippetOpportunities} />
                )}

                {activeTab === 'paa' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <PAAList questions={result.paaQuestions} />
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-5">
                                <h3 className="font-bold text-white mb-3">PAA Strategy</h3>
                                <ul className="space-y-3 text-sm text-indigo-200">
                                    {result.captureStrategy.paa.map((strat, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="mt-1 w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                            {strat}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'local' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.localPackAnalysis.map((pack, i) => (
                            <div key={i} className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-white text-sm">{pack.keyword}</h4>
                                    {pack.youAppear ? (
                                        <span className="bg-emerald-900/30 text-emerald-400 text-xs px-2 py-1 rounded">You Rank</span>
                                    ) : (
                                        <span className="bg-rose-900/30 text-rose-400 text-xs px-2 py-1 rounded">Missing</span>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {pack.businesses.map((biz, j) => (
                                        <div key={j} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 flex items-center justify-center bg-gray-800 text-gray-400 rounded-full text-xs font-bold">
                                                    {biz.position}
                                                </span>
                                                <div>
                                                    <p className="text-sm text-white font-medium">{biz.name}</p>
                                                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                                                        <span>{biz.rating}</span>
                                                        <span className="text-gray-500">({biz.reviews})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'visuals' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Image className="w-4 h-4 text-rose-400" /> Image Opportunities
                            </h3>
                            {result.imageOpportunities.map((opp, i) => (
                                <div key={i} className="bg-[#161b22] border border-gray-800 p-4 rounded-xl">
                                    <p className="text-white font-medium text-sm mb-1">{opp.keyword}</p>
                                    <p className="text-xs text-gray-500 mb-2">Sources: {opp.topSources.join(', ')}</p>
                                    <p className="text-sm text-rose-300 bg-rose-900/10 p-2 rounded border border-rose-900/30">
                                        💡 {opp.recommendation}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Video className="w-4 h-4 text-red-500" /> Video Opportunities
                            </h3>
                            {result.videoOpportunities.map((opp, i) => (
                                <div key={i} className="bg-[#161b22] border border-gray-800 p-4 rounded-xl">
                                    <p className="text-white font-medium text-sm mb-1">{opp.keyword}</p>
                                    <p className="text-xs text-gray-500 mb-2">Channels: {opp.topChannels.join(', ')}</p>
                                    <p className="text-sm text-red-300 bg-red-900/10 p-2 rounded border border-red-900/30">
                                        🎬 {opp.recommendation}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'strategy' && (
                    <div className="space-y-6">
                        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-4">Featured Snippet Capture Plan</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {result.captureStrategy.featuredSnippets.map((strat, i) => (
                                    <div key={i} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-amber-400 font-bold">{strat.keyword}</h4>
                                            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-600">{strat.type}</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Target Page</p>
                                                <p className="text-white">{strat.pageToOptimize}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Format Needed</p>
                                                <p className="text-white">{strat.formatNeeded}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-700">
                                            <p className="text-xs text-gray-500 mb-1 uppercase">Content Template</p>
                                            <code className="text-xs text-indigo-300 font-mono block bg-gray-900 p-2 rounded">
                                                {strat.contentTemplate}
                                            </code>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default SerpFeatureTracker;