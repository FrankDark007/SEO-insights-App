import React, { useState } from 'react';
import { analyzeCompetitorReviews } from '../services/reviewAnalyzerService';
import { ReviewAnalysis } from '../types';
import SentimentChart from './SentimentChart';
import ThemeTable from './ThemeTable';
import { 
  Search, 
  Loader2, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp, 
  AlertCircle,
  Megaphone,
  MessageCircle,
  User,
  Zap
} from 'lucide-react';

const ReviewAnalyzer: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReviewAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.location) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCompetitorReviews(formData.businessName, formData.location);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Competitor Review Analyzer</h2>
          <p className="text-gray-400">Mine competitor reviews for insights and marketing ammunition.</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Competitor Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. ServPro of Austin"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Austin, TX"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 h-[42px]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Analyze Reviews
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Overview & Stats */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Overview Card */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" /> Review Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <p className="text-xs text-gray-400">Total Reviews</p>
                        <p className="text-xl font-bold text-white">{result.overview.totalReviews}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <p className="text-xs text-gray-400">Avg Rating</p>
                        <p className="text-xl font-bold text-white">{result.overview.averageRating.toFixed(1)}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <p className="text-xs text-gray-400">Velocity</p>
                        <p className="text-xl font-bold text-white">{result.overview.velocity}<span className="text-xs font-normal text-gray-500">/mo</span></p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <p className="text-xs text-gray-400">5-Star</p>
                        <p className="text-xl font-bold text-emerald-400">{result.overview.fiveStarPercent}%</p>
                    </div>
                </div>
            </div>

            {/* Sentiment Chart */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
                <SentimentChart data={result.sentimentBreakdown} />
            </div>

            {/* Response Analysis */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-cyan-400" /> Response Strategy
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">Response Rate</span>
                            <span className="text-white font-bold">{result.responseAnalysis.responseRate}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                                className="bg-cyan-500 h-2 rounded-full" 
                                style={{ width: `${result.responseAnalysis.responseRate}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                             <p className="text-xs text-gray-400">Avg Time</p>
                             <p className="text-sm font-semibold text-white">{result.responseAnalysis.avgResponseTime}</p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                             <p className="text-xs text-gray-400">Quality</p>
                             <p className="text-sm font-semibold text-white capitalize">{result.responseAnalysis.quality}</p>
                        </div>
                    </div>
                </div>
            </div>

             {/* Keywords Cloud */}
             <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4 text-violet-400" /> Customer Language
                </h3>
                <div className="flex flex-wrap gap-2">
                    {result.customerKeywords.map((kw, i) => (
                        <div key={i} className="group relative cursor-default">
                             <span className="px-2 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded text-xs hover:border-violet-500 hover:text-white transition-colors">
                                {kw.term} <span className="text-gray-500 text-[10px]">({kw.frequency})</span>
                             </span>
                             {/* Tooltip */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-900 text-xs text-gray-300 p-2 rounded border border-gray-700 shadow-xl z-10 pointer-events-none">
                                {kw.context}
                             </div>
                        </div>
                    ))}
                </div>
             </div>

          </div>

          {/* Middle Column: Themes */}
          <div className="lg:col-span-1 space-y-6">
             <ThemeTable 
                title="Positive Themes" 
                themes={result.positiveThemes} 
                type="positive" 
             />
             <ThemeTable 
                title="Negative Themes" 
                themes={result.negativeThemes} 
                type="negative" 
             />
          </div>

          {/* Right Column: Opportunities & Service Breakdown */}
          <div className="lg:col-span-1 space-y-6">
             
             {/* Marketing Ammo */}
             <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/30 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" /> Marketing Ammunition
                </h3>
                <p className="text-xs text-gray-400 mb-4">Use these messages to exploit their weaknesses:</p>
                <div className="space-y-3">
                    {result.marketingAmmo.map((msg, i) => (
                        <div key={i} className="bg-[#161b22]/80 p-3 rounded-lg border border-indigo-500/20 flex gap-3">
                            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-indigo-100 font-medium">"{msg}"</p>
                        </div>
                    ))}
                </div>
             </div>

             {/* Service Sentiment */}
             <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" /> Service Sentiment
                </h3>
                <div className="space-y-4">
                    {result.serviceMentions.map((svc, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-300">{svc.service}</span>
                                <span className={`text-xs font-bold ${
                                    svc.netSentiment > 0 ? 'text-emerald-400' : 
                                    svc.netSentiment < 0 ? 'text-rose-400' : 'text-gray-400'
                                }`}>
                                    {svc.netSentiment > 0 ? '+' : ''}{svc.netSentiment} Net
                                </span>
                            </div>
                            <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
                                <div 
                                    className="bg-emerald-500" 
                                    style={{ width: `${(svc.positive / (svc.positive + svc.negative)) * 100}%` }}
                                ></div>
                                <div 
                                    className="bg-rose-500" 
                                    style={{ width: `${(svc.negative / (svc.positive + svc.negative)) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                <span>{svc.positive} Pos</span>
                                <span>{svc.negative} Neg</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default ReviewAnalyzer;