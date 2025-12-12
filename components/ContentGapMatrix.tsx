import React, { useState } from 'react';
import { analyzeContentGap } from '../services/contentGapService';
import { normalizeUrl } from '../services/utils';
import { ContentGapResult } from '../types';
import CoverageMatrixGrid from './CoverageMatrixGrid';
import GapPriorityTable from './GapPriorityTable';
import { 
  LayoutGrid, 
  Loader2, 
  Shield, 
  AlertOctagon
} from 'lucide-react';

const ContentGapMatrix: React.FC = () => {
  const [formData, setFormData] = useState({
    yourDomain: '',
    competitors: '',
    services: [
      'Water Damage Restoration',
      'Flood Cleanup',
      'Mold Remediation',
      'Sewage Cleanup',
      'Basement Flooding',
      'Burst Pipe Repair',
      'Water Extraction',
      'Structural Drying'
    ].join('\n'),
    cities: [
      'Arlington, VA',
      'Alexandria, VA',
      'Fairfax, VA',
      'McLean, VA',
      'Bethesda, MD',
      'Silver Spring, MD',
      'Rockville, MD',
      'Washington, DC'
    ].join('\n')
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContentGapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'matrix' | 'priorities' | 'opportunities'>('matrix');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.yourDomain || !formData.services || !formData.cities) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const normalizedYourDomain = normalizeUrl(formData.yourDomain);
    const competitorList = formData.competitors.split('\n').map(c => normalizeUrl(c.trim())).filter(c => c.length > 0 && c !== 'https://');
    const serviceList = formData.services.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const cityList = formData.cities.split('\n').map(c => c.trim()).filter(c => c.length > 0);

    try {
      const data = await analyzeContentGap(normalizedYourDomain, competitorList, serviceList, cityList);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate matrix.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Content Gap Matrix</h2>
          <p className="text-gray-400">Visualize content coverage and identify missing service-city pages.</p>
        </div>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
             <div>
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
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Competitors (One/line)</label>
                <textarea
                  name="competitors"
                  value={formData.competitors}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                  placeholder="competitor1.com&#10;competitor2.com"
                />
             </div>
          </div>

          <div className="lg:col-span-1">
             <label className="block text-sm font-medium text-gray-300 mb-1">Services (One/line)</label>
             <textarea
               name="services"
               value={formData.services}
               onChange={handleInputChange}
               className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 h-[216px] resize-none"
               required
             />
          </div>

          <div className="lg:col-span-1">
             <label className="block text-sm font-medium text-gray-300 mb-1">Cities (One/line)</label>
             <textarea
               name="cities"
               value={formData.cities}
               onChange={handleInputChange}
               className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 h-[216px] resize-none"
               required
             />
          </div>

          <div className="lg:col-span-1 flex flex-col justify-end">
             <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-xl mb-4 text-xs text-indigo-300">
                <p className="mb-2 font-bold">Analysis Estimate:</p>
                <p>
                    {formData.services.split('\n').filter(s => s.trim()).length} Services × {formData.cities.split('\n').filter(c => c.trim()).length} Cities
                </p>
                <p className="mt-1 font-mono text-white">
                    = {formData.services.split('\n').filter(s => s.trim()).length * formData.cities.split('\n').filter(c => c.trim()).length} Cells
                </p>
             </div>
             <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LayoutGrid className="w-5 h-5" />}
                Analyze Coverage
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
           <AlertOctagon className="w-5 h-5" />
           {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Total Pages</p>
                    <p className="text-2xl font-bold text-white">{result.summary.totalPossible}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Your Coverage</p>
                    <p className="text-2xl font-bold text-emerald-400">{result.summary.yourPercent}%</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Comp. Avg</p>
                    <p className="text-2xl font-bold text-gray-300">{Math.round((result.summary.competitorAvgCoverage / result.summary.totalPossible) * 100)}%</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Critical Gaps</p>
                    <p className="text-2xl font-bold text-rose-400">{result.summary.gaps}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase">Opportunities</p>
                    <p className="text-2xl font-bold text-gray-400">{result.summary.opportunities}</p>
                </div>
            </div>

            <div className="flex gap-2 border-b border-gray-800 pb-2">
                <button 
                    onClick={() => setViewMode('matrix')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'matrix' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    Visual Matrix
                </button>
                <button 
                    onClick={() => setViewMode('priorities')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'priorities' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    Priority Gaps ({result.priorityGaps.length})
                </button>
                <button 
                    onClick={() => setViewMode('opportunities')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'opportunities' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    Low Hanging Fruit ({result.opportunities.length})
                </button>
            </div>

            {viewMode === 'matrix' && (
                <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg overflow-hidden">
                    <div className="mb-4 flex gap-4 text-xs">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500/20 border border-emerald-500/50 rounded"></span> You Own</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500/20 border border-amber-500/50 rounded"></span> Competitive</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-rose-500/20 border border-rose-500/50 rounded"></span> Gap (Priority)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-800 border border-gray-700 rounded"></span> Opportunity</div>
                    </div>
                    <CoverageMatrixGrid 
                        matrix={result.matrix} 
                        services={formData.services.split('\n').filter(s=>s.trim())}
                        cities={formData.cities.split('\n').filter(c=>c.trim())}
                    />
                </div>
            )}

            {viewMode === 'priorities' && (
                <GapPriorityTable gaps={result.priorityGaps} />
            )}

            {viewMode === 'opportunities' && (
                 <GapPriorityTable gaps={result.opportunities} />
            )}
            
            {result.yourStrengths.length > 0 && (
                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Your Competitive Moats
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.yourStrengths.slice(0, 6).map((item, i) => (
                            <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-emerald-500/10">
                                <p className="font-bold text-white text-sm">{item.city}</p>
                                <p className="text-xs text-gray-400 mb-2">{item.service}</p>
                                <p className="text-xs text-emerald-300">{item.action}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default ContentGapMatrix;