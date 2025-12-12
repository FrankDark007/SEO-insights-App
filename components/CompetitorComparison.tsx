import React, { useState, useEffect } from 'react';
import { getAhrefsConfig, getBacklinkGap, getKeywordGap } from '../services/ahrefsService';
import { AhrefsBacklinkGap, AhrefsKeywordGap } from '../types';
import { Loader2, Link2, Target, Check, X } from 'lucide-react';

const CompetitorComparison: React.FC = () => {
  const [backlinkGaps, setBacklinkGaps] = useState<AhrefsBacklinkGap[]>([]);
  const [keywordGaps, setKeywordGaps] = useState<AhrefsKeywordGap[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(getAhrefsConfig());

  useEffect(() => {
      const currentConfig = getAhrefsConfig();
      setConfig(currentConfig);
      if (currentConfig.primaryDomain && currentConfig.competitors.length > 0) {
          loadData(currentConfig.primaryDomain, currentConfig.competitors);
      }
  }, []);

  const loadData = async (domain: string, competitors: string[]) => {
      setLoading(true);
      try {
          const bg = await getBacklinkGap(domain, competitors);
          const kg = await getKeywordGap(domain, competitors);
          setBacklinkGaps(bg);
          setKeywordGaps(kg);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  if (config.competitors.length === 0) {
      return (
          <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
              Add competitors in the Settings tab to see comparison data.
          </div>
      );
  }

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-400">Comparing against competitors...</p>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-fade-in">
        
        {/* Keyword Gap */}
        <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-rose-400" /> Keyword Gaps
                </h3>
                <p className="text-xs text-gray-500 mt-1">Keywords your competitors rank for but you don't.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900 text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="p-4 w-1/3">Keyword</th>
                            <th className="p-4 text-center">Volume</th>
                            <th className="p-4 text-center">KD</th>
                            {config.competitors.map((c, i) => (
                                <th key={i} className="p-4 text-center truncate max-w-[100px]" title={c}>{c}</th>
                            ))}
                            <th className="p-4 text-center text-indigo-400">You</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {keywordGaps.map((gap, i) => (
                            <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                <td className="p-4 font-medium text-white">{gap.keyword}</td>
                                <td className="p-4 text-center text-gray-300">{gap.volume.toLocaleString()}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${gap.difficulty > 40 ? 'bg-amber-900/30 text-amber-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                                        {gap.difficulty}
                                    </span>
                                </td>
                                {config.competitors.map((comp, j) => {
                                    const rank = gap.competitorRankings.find(r => r.competitor === comp)?.position;
                                    return (
                                        <td key={j} className="p-4 text-center">
                                            {rank ? (
                                                <span className="font-bold text-white">{rank}</span>
                                            ) : <span className="text-gray-600">-</span>}
                                        </td>
                                    );
                                })}
                                <td className="p-4 text-center text-gray-500">-</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Backlink Gap */}
        <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-emerald-400" /> Backlink Gaps
                </h3>
                <p className="text-xs text-gray-500 mt-1">High authority domains linking to competitors but not you.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900 text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="p-4 w-1/3">Referring Domain</th>
                            <th className="p-4 text-center">DR</th>
                            {config.competitors.map((c, i) => (
                                <th key={i} className="p-4 text-center truncate max-w-[100px]" title={c}>{c}</th>
                            ))}
                            <th className="p-4 text-center text-indigo-400">You</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {backlinkGaps.map((gap, i) => (
                            <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                <td className="p-4 font-medium text-white">{gap.domain}</td>
                                <td className="p-4 text-center">
                                    <span className={`font-mono font-bold ${gap.domainRating > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {gap.domainRating}
                                    </span>
                                </td>
                                {config.competitors.map((comp, j) => {
                                    const link = gap.linksToCompetitors.find(l => l.competitor === comp);
                                    return (
                                        <td key={j} className="p-4 text-center">
                                            {link ? (
                                                <span className="inline-flex items-center justify-center w-5 h-5 bg-emerald-900/50 text-emerald-400 rounded-full text-xs">
                                                    <Check className="w-3 h-3" />
                                                </span>
                                            ) : <span className="text-gray-600">-</span>}
                                        </td>
                                    );
                                })}
                                <td className="p-4 text-center">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-rose-900/50 text-rose-400 rounded-full text-xs">
                                        <X className="w-3 h-3" />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default CompetitorComparison;