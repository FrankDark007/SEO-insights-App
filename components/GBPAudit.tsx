import React, { useState } from 'react';
import { runGBPAudit } from '../services/gbpAuditService';
import { GBPAuditResult } from '../types';
import GBPScoreCard from './GBPScoreCard';
import ReviewVelocityChart from './ReviewVelocityChart';
import { 
  MapPin, 
  Store, 
  Loader2, 
  Star, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Award,
  Zap,
  Tag
} from 'lucide-react';

const GBPAudit: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    keyword: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GBPAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.keyword) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await runGBPAudit(formData.businessName, formData.keyword, formData.location);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Audit failed to run.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">GBP Audit Module</h2>
          <p className="text-gray-400">Deep dive into Map Pack performance and optimization gaps.</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Business Name (GBP)</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Joe's Restoration"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Primary Keyword</label>
            <input
              type="text"
              name="keyword"
              value={formData.keyword}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. water damage"
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
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
            Run Audit
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
          
          {/* Column 1: Map Pack & Rank */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Map Pack Snapshot */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Map Pack Snapshot
                </h3>
                <span className={`text-xs px-2 py-1 rounded font-bold ${result.yourPosition && result.yourPosition <= 3 ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' : 'bg-gray-800 text-gray-400'}`}>
                  {result.yourPosition ? `You rank #${result.yourPosition}` : 'Not in Map Pack'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900 text-xs text-gray-400 uppercase">
                    <tr>
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Business</th>
                      <th className="px-4 py-3 text-center">Rating</th>
                      <th className="px-4 py-3 text-center">Reviews</th>
                      <th className="px-4 py-3">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm">
                    {result.mapPackSnapshot.map((entry, i) => (
                      <tr key={i} className={entry.isYou ? 'bg-indigo-900/10' : ''}>
                        <td className="px-4 py-3 font-bold text-gray-300">{entry.rank}</td>
                        <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                          {entry.businessName}
                          {entry.isYou && <span className="text-xs bg-indigo-500 text-white px-1.5 rounded">You</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-amber-400">
                                <span className="text-white">{entry.rating}</span> <Star className="w-3 h-3 fill-amber-400" />
                            </div>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-300">{entry.reviewCount}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[150px]">{entry.primaryCategory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Review Analysis */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
               <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Review Intelligence
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Total Reviews</p>
                      <p className="text-xl font-bold text-white">{result.reviewAnalysis.totalReviews.you}</p>
                      <p className={`text-xs ${result.reviewAnalysis.totalReviews.gap < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {result.reviewAnalysis.totalReviews.gap > 0 ? '+' : ''}{result.reviewAnalysis.totalReviews.gap} vs avg
                      </p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Avg Rating</p>
                      <p className="text-xl font-bold text-white">{result.reviewAnalysis.avgRating.you}</p>
                      <p className={`text-xs ${result.reviewAnalysis.avgRating.gap < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {result.reviewAnalysis.avgRating.gap > 0 ? '+' : ''}{result.reviewAnalysis.avgRating.gap.toFixed(1)} vs avg
                      </p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Est. Velocity</p>
                      <p className="text-xl font-bold text-white">{result.reviewAnalysis.velocity.you}<span className="text-xs text-gray-500 font-normal">/mo</span></p>
                      <p className={`text-xs ${result.reviewAnalysis.velocity.gap < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {result.reviewAnalysis.velocity.gap > 0 ? '+' : ''}{result.reviewAnalysis.velocity.gap}/mo vs avg
                      </p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Response Rate</p>
                      <p className="text-xl font-bold text-white">{result.reviewAnalysis.responseRate.you}%</p>
                      <p className={`text-xs ${result.reviewAnalysis.responseRate.gap < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {result.reviewAnalysis.responseRate.gap > 0 ? '+' : ''}{result.reviewAnalysis.responseRate.gap}% vs avg
                      </p>
                  </div>
               </div>
               <ReviewVelocityChart data={result.reviewHistory} />
            </div>

            {/* Keyword Presence & Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-cyan-400" />
                        Keyword Presence
                    </h3>
                    <div className="space-y-3">
                        {result.keywordPresence.map((kp, i) => (
                            <div key={i} className="flex items-center justify-between text-sm border-b border-gray-800 pb-2 last:border-0">
                                <span className="text-gray-300 font-medium">"{kp.keyword}"</span>
                                <div className="flex gap-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${kp.inDescription ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800' : 'bg-gray-800 text-gray-500 line-through opacity-50'}`}>Desc</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${kp.inServices ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800' : 'bg-gray-800 text-gray-500 line-through opacity-50'}`}>Svc</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${kp.inPosts ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800' : 'bg-gray-800 text-gray-500 line-through opacity-50'}`}>Post</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-violet-400" />
                        Categories
                    </h3>
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Your Primary</p>
                            <p className="text-white font-medium">{result.categoryComparison.you.primary}</p>
                        </div>
                        <div>
                             <p className="text-gray-500 text-xs uppercase mb-1">Recommended Additions</p>
                             <div className="flex flex-wrap gap-2">
                                 {result.categoryComparison.recommended.map((cat, i) => (
                                     <span key={i} className="bg-violet-900/20 text-violet-300 border border-violet-800/50 px-2 py-1 rounded text-xs flex items-center gap-1">
                                         <Zap className="w-3 h-3" /> {cat}
                                     </span>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>

          </div>

          {/* Column 2: Scorecard & Actions */}
          <div className="space-y-6">
            <GBPScoreCard metrics={result.profileCompleteness} />

            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-400" />
                    Action Items
                </h3>
                <div className="space-y-3">
                    {result.actionItems.map((action, i) => (
                        <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                             <div className="flex items-center gap-2 mb-1">
                                 <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                     action.priority === 'high' ? 'bg-rose-900/30 text-rose-400 border border-rose-800' :
                                     action.priority === 'medium' ? 'bg-amber-900/30 text-amber-400 border border-amber-800' :
                                     'bg-blue-900/30 text-blue-400 border border-blue-800'
                                 }`}>
                                     {action.priority}
                                 </span>
                                 <span className="text-xs text-gray-500">{action.impact} impact</span>
                             </div>
                             <p className="text-sm text-gray-200 font-medium mb-1">{action.action}</p>
                             <p className="text-xs text-gray-500 italic">Why: {action.reason}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/30 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-300" />
                    Quick Wins
                </h3>
                <ul className="space-y-2">
                    {result.quickWins.map((win, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-indigo-100">
                            <span className="text-amber-400 mt-1">✦</span>
                            {win}
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GBPAudit;