import React, { useState, useEffect } from 'react';
import { updateRankings, getStoredRankingData, clearRankingData } from '../services/rankTrackerService';
import { normalizeUrl } from '../services/utils';
import { RankingResult, StoredRankData } from '../types';
import RankTrendChart from './RankTrendChart';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw, 
  Download, 
  ExternalLink,
  FileText,
  Loader2
} from 'lucide-react';

interface RankTrackerProps {
    onOpenBrief: (keyword: string) => void;
}

const RankTracker: React.FC<RankTrackerProps> = ({ onOpenBrief }) => {
  const [formData, setFormData] = useState({
    keywords: '',
    location: '',
    domain: ''
  });
  const [rankings, setRankings] = useState<RankingResult[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [selectedKeywordsForChart, setSelectedKeywordsForChart] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stored = getStoredRankingData();
    if (stored) {
        setFormData({
            keywords: stored.keywords.join('\n'),
            location: stored.location,
            domain: stored.domain
        });
        setLastChecked(stored.lastChecked);
        
        const latestRankings: RankingResult[] = stored.keywords.map(kw => {
            const history = stored.history[kw] || [];
            const current = history.length > 0 ? history[history.length - 1] : null;
            const previous = history.length > 1 ? history[history.length - 2] : null;
            
            let change = null;
            if (current && previous && current.position && previous.position) {
                change = previous.position - current.position;
            }

            return {
                keyword: kw,
                currentRank: current?.position || null,
                previousRank: previous?.position || null,
                change: change,
                topCompetitor: null, 
                serp: [],
                checkedAt: stored.lastChecked
            };
        });
        setRankings(latestRankings);
        prepareChartData(stored);
        setSelectedKeywordsForChart(stored.keywords.slice(0, 5));
    }
  };

  const prepareChartData = (stored: StoredRankData) => {
      const dateMap: { [date: string]: any } = {};
      
      Object.keys(stored.history).forEach(keyword => {
          stored.history[keyword].forEach(entry => {
              if (!dateMap[entry.date]) dateMap[entry.date] = { date: entry.date };
              dateMap[entry.date][keyword] = entry.position;
          });
      });

      const chartData = Object.values(dateMap).sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setHistoryData(chartData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheck = async () => {
    if (!formData.keywords || !formData.domain) return;
    
    setIsLoading(true);
    setProgress({ current: 0, total: 0 });
    
    const keywordList = formData.keywords.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    const normalizedDomain = normalizeUrl(formData.domain);

    try {
        const results = await updateRankings(
            keywordList, 
            formData.location, 
            normalizedDomain,
            (curr, total) => setProgress({ current: curr, total })
        );
        setRankings(results);
        
        const stored = getStoredRankingData();
        if (stored) {
             prepareChartData(stored);
             setLastChecked(stored.lastChecked);
             if (selectedKeywordsForChart.length === 0) {
                 setSelectedKeywordsForChart(keywordList.slice(0, 5));
             }
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Keyword', 'Current Rank', 'Change', 'Check Date'];
    const csvContent = [
        headers.join(','),
        ...rankings.map(r => [
            `"${r.keyword}"`, 
            r.currentRank || '', 
            r.change || 0,
            r.checkedAt
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rankings.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalKeywords = rankings.length;
  const inTop3 = rankings.filter(r => r.currentRank && r.currentRank <= 3).length;
  const inTop10 = rankings.filter(r => r.currentRank && r.currentRank <= 10).length;
  const avgPos = rankings.reduce((acc, curr) => acc + (curr.currentRank || 100), 0) / (totalKeywords || 1);
  const biggestGainer = [...rankings].sort((a, b) => (b.change || 0) - (a.change || 0))[0];
  const biggestLoser = [...rankings].sort((a, b) => (a.change || 0) - (b.change || 0))[0];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Keyword Rank Tracker</h2>
          <p className="text-gray-400">Track your organic search performance over time.</p>
        </div>
        <div className="flex gap-2">
            {lastChecked && (
                <span className="text-xs text-gray-500 self-center mr-2">
                    Last updated: {new Date(lastChecked).toLocaleString()}
                </span>
            )}
            <button
                onClick={handleCheck}
                disabled={isLoading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>}
                {isLoading ? `Checking ${progress.current}/${progress.total}` : 'Check Rankings'}
            </button>
        </div>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-300 mb-1">Target Keywords (One per line)</label>
                 <textarea 
                    name="keywords" 
                    value={formData.keywords} 
                    onChange={handleInputChange} 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm h-32 resize-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="water damage restoration&#10;emergency plumber&#10;flood cleanup"
                 />
             </div>
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Your Domain</label>
                    <input 
                        type="text" 
                        name="domain" 
                        value={formData.domain} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500"
                        placeholder="example.com"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input 
                        type="text" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Chicago, IL"
                    />
                 </div>
             </div>
             <div className="flex flex-col justify-end gap-2">
                 <button onClick={handleExport} className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-4 rounded-lg border border-gray-700 transition-colors text-sm">
                     <Download className="w-4 h-4"/> Export CSV
                 </button>
                 <button onClick={() => { if(confirm('Clear all ranking history?')) { clearRankingData(); setRankings([]); setHistoryData([]); } }} className="flex items-center justify-center gap-2 text-red-400 hover:bg-red-900/20 py-2 px-4 rounded-lg transition-colors text-sm">
                     Clear History
                 </button>
             </div>
         </div>
      </div>

      {rankings.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400">Total Keywords</p>
                  <p className="text-2xl font-bold text-white">{totalKeywords}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400">Top 3</p>
                  <p className="text-2xl font-bold text-emerald-400">{inTop3}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400">Top 10</p>
                  <p className="text-2xl font-bold text-indigo-400">{inTop10}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400">Avg. Position</p>
                  <p className="text-2xl font-bold text-white">{avgPos < 100 ? avgPos.toFixed(1) : '-'}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400">Biggest Gainer</p>
                  {biggestGainer && biggestGainer.change && biggestGainer.change > 0 ? (
                      <div>
                        <p className="text-sm font-medium text-white truncate" title={biggestGainer.keyword}>{biggestGainer.keyword}</p>
                        <p className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3"/> +{biggestGainer.change}
                        </p>
                      </div>
                  ) : <p className="text-sm text-gray-500">-</p>}
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400">Biggest Drop</p>
                  {biggestLoser && biggestLoser.change && biggestLoser.change < 0 ? (
                      <div>
                        <p className="text-sm font-medium text-white truncate" title={biggestLoser.keyword}>{biggestLoser.keyword}</p>
                        <p className="text-rose-400 text-xs font-bold flex items-center gap-1">
                            <TrendingDown className="w-3 h-3"/> {biggestLoser.change}
                        </p>
                      </div>
                  ) : <p className="text-sm text-gray-500">-</p>}
              </div>
          </div>
      )}

      {historyData.length > 0 && (
          <RankTrendChart data={historyData} keywords={selectedKeywordsForChart} />
      )}

      {rankings.length > 0 && (
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-gray-900 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                              <th className="p-4 font-semibold">Keyword</th>
                              <th className="p-4 font-semibold text-center">Rank</th>
                              <th className="p-4 font-semibold text-center">Change</th>
                              <th className="p-4 font-semibold">Top Competitor</th>
                              <th className="p-4 font-semibold text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                          {rankings.map((r, idx) => (
                              <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                                  <td className="p-4">
                                      <p className="font-medium text-white">{r.keyword}</p>
                                  </td>
                                  <td className="p-4 text-center">
                                      {r.currentRank ? (
                                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold ${
                                              r.currentRank <= 3 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' :
                                              r.currentRank <= 10 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
                                              'bg-gray-700/50 text-gray-300'
                                          }`}>
                                              {r.currentRank}
                                          </span>
                                      ) : (
                                          <span className="text-gray-500 text-sm">100+</span>
                                      )}
                                  </td>
                                  <td className="p-4 text-center">
                                      {r.change !== null && r.change !== 0 ? (
                                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                                              r.change > 0 ? 'text-emerald-400' : 'text-rose-400'
                                          }`}>
                                              {r.change > 0 ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
                                              {Math.abs(r.change)}
                                          </span>
                                      ) : (
                                          <span className="text-gray-600"><Minus className="w-4 h-4 mx-auto"/></span>
                                      )}
                                  </td>
                                  <td className="p-4">
                                      {r.topCompetitor ? (
                                          <div className="max-w-[200px]">
                                              <p className="text-xs text-gray-400 truncate">{r.topCompetitor.domain}</p>
                                              <a href={r.topCompetitor.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline truncate block">
                                                  {r.topCompetitor.title}
                                              </a>
                                          </div>
                                      ) : <span className="text-gray-600 text-xs">-</span>}
                                  </td>
                                  <td className="p-4 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                          <button 
                                              onClick={() => onOpenBrief(r.keyword)}
                                              className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition-colors"
                                              title="Generate Content Brief"
                                          >
                                              <FileText className="w-4 h-4"/>
                                          </button>
                                          <a 
                                              href={`https://www.google.com/search?q=${encodeURIComponent(r.keyword + (formData.location ? ' ' + formData.location : ''))}`} 
                                              target="_blank" 
                                              rel="noreferrer"
                                              className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition-colors"
                                              title="View SERP"
                                          >
                                              <ExternalLink className="w-4 h-4"/>
                                          </a>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}
    </div>
  );
};

export default RankTracker;