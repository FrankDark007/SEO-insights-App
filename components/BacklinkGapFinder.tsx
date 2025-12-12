import React, { useState } from 'react';
import { findBacklinkGap } from '../services/backlinkGapService';
import { normalizeUrl } from '../services/utils';
import { BacklinkGapResult, LinkOpportunity } from '../types';
import LinkTypeChart from './LinkTypeChart';
import OutreachTemplateModal from './OutreachTemplateModal';
import { 
  Link2, 
  Loader2, 
  Shield, 
  Target, 
  Zap, 
  Users,
  Mail,
  ExternalLink
} from 'lucide-react';

const BacklinkGapFinder: React.FC = () => {
  const [formData, setFormData] = useState({
    yourDomain: '',
    competitors: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BacklinkGapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'quickWins' | 'highValue' | 'common'>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<LinkOpportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.yourDomain || !formData.competitors) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const normalizedYourDomain = normalizeUrl(formData.yourDomain);
    const competitorList = formData.competitors.split('\n').map(c => normalizeUrl(c.trim())).filter(c => c.length > 0 && c !== 'https://');

    try {
      const data = await findBacklinkGap(normalizedYourDomain, competitorList);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze backlinks.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTemplate = (opp: LinkOpportunity) => {
      setSelectedOpportunity(opp);
      setIsModalOpen(true);
  };

  const getFilteredOpportunities = () => {
      if (!result) return [];
      switch (activeFilter) {
          case 'quickWins': return result.quickWins;
          case 'highValue': return result.highValueTargets;
          case 'common': 
             return result.gapOpportunities.filter(op => 
                 result.commonSources.some(cs => cs.domain === op.linkingDomain)
             );
          default: return result.gapOpportunities;
      }
  };

  const displayedOpportunities = getFilteredOpportunities();

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Backlink Gap Finder</h2>
          <p className="text-gray-400">Identify high-quality link opportunities your competitors have but you don't.</p>
        </div>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Your Domain</label>
            <input
              type="text"
              name="yourDomain"
              value={formData.yourDomain}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="example.com"
              required
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Competitor Domains (One per line)</label>
            <textarea
              name="competitors"
              value={formData.competitors}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 h-[42px] min-h-[42px] resize-none overflow-hidden hover:overflow-y-auto focus:h-24 transition-all z-10 relative"
              placeholder="competitor1.com&#10;competitor2.com"
              required
              style={{ lineHeight: '1.5' }}
            />
          </div>
          <div className="lg:col-span-1 flex items-end">
             <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 h-[42px]"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                Find Gap
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
           <Shield className="w-5 h-5" />
           {error}
        </div>
      )}

      {result && (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.overview.map((metric, i) => (
                    <div key={i} className={`bg-[#161b22] border rounded-xl p-4 shadow-lg ${metric.isYou ? 'border-indigo-500/50 bg-indigo-900/10' : 'border-gray-800'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white truncate max-w-[150px]" title={metric.domain}>{metric.domain}</h4>
                            {metric.isYou && <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">YOU</span>}
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">DA Score</span>
                                <span className="text-white font-mono">{metric.domainAuthority}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Ref. Domains</span>
                                <span className="text-white font-mono">{metric.referringDomains}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Backlinks</span>
                                <span className="text-white font-mono">{metric.totalBacklinks}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.linkTypeBreakdown.map((breakdown, i) => (
                    <LinkTypeChart key={i} data={breakdown} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-2">
                             <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                                    activeFilter === 'all' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                                }`}
                             >
                                 All Opportunities
                             </button>
                             <button
                                onClick={() => setActiveFilter('quickWins')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 border ${
                                    activeFilter === 'quickWins' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                                }`}
                             >
                                 <Zap className="w-3 h-3" /> Quick Wins
                             </button>
                             <button
                                onClick={() => setActiveFilter('highValue')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 border ${
                                    activeFilter === 'highValue' ? 'bg-amber-600 text-white border-amber-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                                }`}
                             >
                                 <Target className="w-3 h-3" /> High Value
                             </button>
                             <button
                                onClick={() => setActiveFilter('common')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 border ${
                                    activeFilter === 'common' ? 'bg-violet-600 text-white border-violet-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                                }`}
                             >
                                 <Users className="w-3 h-3" /> Common Sources
                             </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
                                        <th className="p-4 font-semibold">Linking Domain</th>
                                        <th className="p-4 font-semibold text-center">DA</th>
                                        <th className="p-4 font-semibold">Type</th>
                                        <th className="p-4 font-semibold">Difficulty</th>
                                        <th className="p-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {displayedOpportunities.map((opp, i) => (
                                        <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{opp.linkingDomain}</span>
                                                    <span className="text-xs text-gray-500 truncate max-w-[200px]">Links to: {opp.linksTo.join(', ')}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`font-mono font-bold ${
                                                    opp.domainAuthority > 60 ? 'text-amber-400' : 
                                                    opp.domainAuthority > 30 ? 'text-indigo-400' : 'text-gray-400'
                                                }`}>
                                                    {opp.domainAuthority}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded capitalize border border-gray-700">
                                                    {opp.linkType}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                 <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                                                     opp.acquisitionDifficulty === 'easy' ? 'text-emerald-400 bg-emerald-900/20' :
                                                     opp.acquisitionDifficulty === 'medium' ? 'text-amber-400 bg-amber-900/20' :
                                                     'text-rose-400 bg-rose-900/20'
                                                 }`}>
                                                     {opp.acquisitionDifficulty}
                                                 </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {opp.linkUrl && (
                                                        <a 
                                                            href={opp.linkUrl} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                                                            title="View Page"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => handleOpenTemplate(opp)}
                                                        className="p-1.5 text-indigo-400 hover:text-white bg-indigo-900/20 hover:bg-indigo-600 rounded transition-colors"
                                                        title="Generate Outreach Email"
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {displayedOpportunities.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                                No opportunities found for this filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-violet-400" /> Common Sources
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">Domains linking to multiple competitors are your highest probability targets.</p>
                        <div className="space-y-3">
                            {result.commonSources.slice(0, 5).map((src, i) => (
                                <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-white">{src.domain}</p>
                                        <p className="text-xs text-gray-500">{src.competitorCount} competitors linked</p>
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                        src.priority === 'critical' ? 'bg-rose-900/30 text-rose-400 border border-rose-800' : 'bg-amber-900/30 text-amber-400 border border-amber-800'
                                    }`}>
                                        {src.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                     <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-500/30 rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-white mb-4">Gap Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">Total Opportunities</span>
                                <span className="text-xl font-bold text-white">{result.gapOpportunities.length}</span>
                            </div>
                            <div className="w-full bg-gray-700 h-px"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300 flex items-center gap-2"><Zap className="w-3 h-3 text-emerald-400"/> Quick Wins</span>
                                <span className="text-lg font-bold text-emerald-400">{result.quickWins.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300 flex items-center gap-2"><Target className="w-3 h-3 text-amber-400"/> High Value</span>
                                <span className="text-lg font-bold text-amber-400">{result.highValueTargets.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
      )}
      
      <OutreachTemplateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        opportunity={selectedOpportunity} 
        yourDomain={formData.yourDomain}
      />
    </div>
  );
};

export default BacklinkGapFinder;