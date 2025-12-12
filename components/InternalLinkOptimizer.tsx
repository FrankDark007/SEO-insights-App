import React, { useState } from 'react';
import { analyzeInternalLinks } from '../services/internalLinkService';
import { normalizeUrl } from '../services/utils';
import { InternalLinkAnalysis } from '../types';
import SiteStructureGraph from './SiteStructureGraph';
import OrphanPageCard from './OrphanPageCard';
import LinkOpportunityTable from './LinkOpportunityTable';
import { 
  Network, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Link as LinkIcon, 
  Layers, 
  List, 
  Anchor,
  GitMerge,
  ArrowRight
} from 'lucide-react';

const InternalLinkOptimizer: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [sitemap, setSitemap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InternalLinkAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'structure' | 'orphans' | 'opportunities' | 'anchors' | 'action'>('structure');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const normalizedDomain = normalizeUrl(domain);

    try {
      const data = await analyzeInternalLinks(normalizedDomain, sitemap);
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
          <h2 className="text-3xl font-bold text-white">Internal Link Optimizer</h2>
          <p className="text-gray-400">Visualize site structure, fix orphan pages, and boost page authority.</p>
        </div>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="example.com"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Sitemap URL (Optional)</label>
            <input
              type="url"
              value={sitemap}
              onChange={(e) => setSitemap(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/sitemap.xml"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 h-[42px]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
            Analyze Links
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Total Pages</p>
                    <p className="text-2xl font-bold text-white">{result.overview.totalPages}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Orphans</p>
                    <p className={`text-2xl font-bold ${result.overview.orphanPages > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {result.overview.orphanPages}
                    </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Thin Pages</p>
                    <p className="text-2xl font-bold text-amber-400">{result.overview.thinLinkPages}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Well Linked</p>
                    <p className="text-2xl font-bold text-emerald-400">{result.overview.wellLinkedPages}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Avg Links</p>
                    <p className="text-2xl font-bold text-white">{result.overview.avgLinksPerPage}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Max Depth</p>
                    <p className={`text-2xl font-bold ${result.overview.maxDepth > 3 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {result.overview.maxDepth}
                    </p>
                </div>
            </div>

            <div className="flex border-b border-gray-800 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('structure')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'structure' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <GitMerge className="w-4 h-4" /> Structure
                </button>
                <button 
                    onClick={() => setActiveTab('orphans')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'orphans' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <AlertTriangle className="w-4 h-4" /> Orphans ({result.orphans.length})
                </button>
                <button 
                    onClick={() => setActiveTab('opportunities')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'opportunities' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <LinkIcon className="w-4 h-4" /> Opportunities
                </button>
                <button 
                    onClick={() => setActiveTab('anchors')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'anchors' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <Anchor className="w-4 h-4" /> Anchor Text
                </button>
                <button 
                    onClick={() => setActiveTab('action')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'action' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <List className="w-4 h-4" /> Action Plan
                </button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'structure' && (
                    <div className="space-y-6">
                        <SiteStructureGraph pages={result.pages} silos={result.siloHealth} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-cyan-400" /> Click Depth
                                </h4>
                                <div className="space-y-3">
                                    {result.depthDistribution.map((depth, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <span className="w-16 text-gray-400">Depth {depth.depth}</span>
                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-cyan-500 rounded-full" 
                                                    style={{ width: `${(depth.pageCount / result.overview.totalPages) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-white font-mono">{depth.pageCount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Network className="w-4 h-4 text-violet-400" /> Silo Health
                                </h4>
                                <div className="space-y-3">
                                    {result.siloHealth.map((silo, i) => (
                                        <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex justify-between items-center">
                                            <div>
                                                <p className="text-white font-medium">{silo.siloName}</p>
                                                <p className="text-xs text-gray-500">{silo.spokePages.length} spokes</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                                                silo.health === 'good' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' :
                                                silo.health === 'needs_work' ? 'bg-amber-900/30 text-amber-400 border border-amber-800' :
                                                'bg-rose-900/30 text-rose-400 border border-rose-800'
                                            }`}>
                                                {silo.health.replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orphans' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.orphans.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-50" />
                                <p>No orphan pages found! Great job.</p>
                            </div>
                        ) : (
                            result.orphans.map((orphan, i) => (
                                <OrphanPageCard key={i} orphan={orphan} />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'opportunities' && (
                    <LinkOpportunityTable opportunities={result.opportunities} />
                )}

                {activeTab === 'anchors' && (
                    <div className="space-y-4">
                        {result.anchorAnalysis.map((item, i) => (
                            <div key={i} className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-white font-bold truncate max-w-md">{item.targetUrl}</h4>
                                        <p className="text-xs text-gray-500">{item.internalLinkCount} inbound links</p>
                                    </div>
                                    {item.issues.length > 0 && (
                                        <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-1 rounded border border-amber-800">
                                            {item.issues[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {item.anchors.map((anchor, j) => (
                                        <div key={j} className="flex items-center gap-3 text-sm">
                                            <div className="flex-1 bg-gray-800/50 p-2 rounded border border-gray-700 text-gray-300">
                                                "{anchor.text}"
                                            </div>
                                            <div className="w-24 text-right text-gray-500">
                                                {anchor.count} uses ({Math.round((anchor.count / item.internalLinkCount) * 100)}%)
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 text-xs text-indigo-300 bg-indigo-900/10 p-2 rounded border border-indigo-900/30">
                                    💡 {item.recommendation}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'action' && (
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden">
                        <div className="divide-y divide-gray-800">
                            {result.actionPlan.map((action, i) => (
                                <div key={i} className="p-4 flex items-start gap-4 hover:bg-gray-800/30 transition-colors">
                                    <div className="mt-1 bg-gray-800 text-gray-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-gray-700">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-white font-medium">{action.action}</h4>
                                            <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-bold ${
                                                action.priority === 1 ? 'bg-rose-500/20 text-rose-400' : 
                                                action.priority === 2 ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                P{action.priority}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                                            <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3"/> From: <span className="text-gray-300">{action.sourceUrl}</span></span>
                                            <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3"/> To: <span className="text-gray-300">{action.targetUrl}</span></span>
                                            <span className="flex items-center gap-1"><Anchor className="w-3 h-3"/> Anchor: <span className="text-indigo-300">"{action.anchor}"</span></span>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-white p-2">
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default InternalLinkOptimizer;