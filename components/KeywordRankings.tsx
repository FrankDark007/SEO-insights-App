import React, { useState, useEffect } from 'react';
import { getAhrefsConfig, getOrganicKeywords } from '../services/ahrefsService';
import { AhrefsKeywordRanking } from '../types';
import KeywordRankHistoryChart from './KeywordRankHistoryChart';
import { Loader2, TrendingUp, TrendingDown, Minus, ExternalLink, Search } from 'lucide-react';

const KeywordRankings: React.FC = () => {
  const [keywords, setKeywords] = useState<AhrefsKeywordRanking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const config = getAhrefsConfig();
      if (config.primaryDomain) {
          loadData(config.primaryDomain);
      }
  }, []);

  const loadData = async (domain: string) => {
      setLoading(true);
      try {
          const kws = await getOrganicKeywords(domain);
          setKeywords(kws);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-400">Fetching keyword data...</p>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Keyword History Chart */}
        <KeywordRankHistoryChart keywords={keywords} />

        {/* Keywords Table */}
        <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-violet-400" /> Organic Rankings
                </h3>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">Top Performers</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900 text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="p-4">Keyword</th>
                            <th className="p-4 text-center">Rank</th>
                            <th className="p-4 text-center">Volume</th>
                            <th className="p-4 text-center">Traffic</th>
                            <th className="p-4 text-center">KD</th>
                            <th className="p-4 text-right">URL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {keywords.map((kw, i) => (
                            <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                <td className="p-4 font-medium text-white">{kw.keyword}</td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className={`font-bold w-6 h-6 flex items-center justify-center rounded ${
                                            kw.position <= 3 ? 'bg-emerald-500 text-black' : 
                                            kw.position <= 10 ? 'bg-gray-700 text-emerald-400 border border-emerald-500/50' : 
                                            'bg-gray-800 text-gray-400'
                                        }`}>
                                            {kw.position}
                                        </span>
                                        {kw.change ? (
                                            <span className={`text-[10px] flex items-center ${kw.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {kw.change > 0 ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                                                {Math.abs(kw.change)}
                                            </span>
                                        ) : <span className="w-3"></span>}
                                    </div>
                                </td>
                                <td className="p-4 text-center text-gray-300">{kw.volume.toLocaleString()}</td>
                                <td className="p-4 text-center text-white font-bold">{kw.traffic}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        kw.difficulty > 60 ? 'bg-rose-900/30 text-rose-400' :
                                        kw.difficulty > 30 ? 'bg-amber-900/30 text-amber-400' :
                                        'bg-emerald-900/30 text-emerald-400'
                                    }`}>
                                        {kw.difficulty}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <a href={kw.url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-indigo-400 transition-colors">
                                        <ExternalLink className="w-4 h-4 ml-auto" />
                                    </a>
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

export default KeywordRankings;