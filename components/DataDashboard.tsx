import React, { useState, useEffect } from 'react';
import { getTrafficData } from '../services/analyticsService';
import { getSearchPerformance } from '../services/searchConsoleService';
import { TrafficData, SearchData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Loader2, TrendingUp, Users, MousePointer2, Eye } from 'lucide-react';

const DataDashboard: React.FC = () => {
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [search, setSearch] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const tData = await getTrafficData();
      const sData = await getSearchPerformance();
      setTraffic(tData);
      setSearch(sData);
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
              <p className="text-gray-400">Loading metrics from Google...</p>
          </div>
      );
  }

  if (!traffic || !search) return null;

  return (
    <div className="space-y-8 animate-fade-in">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider">
                    <Users className="w-4 h-4 text-indigo-400" /> Users (28d)
                </div>
                <p className="text-2xl font-bold text-white">{traffic.summary.users.toLocaleString()}</p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider">
                    <MousePointer2 className="w-4 h-4 text-emerald-400" /> Search Clicks
                </div>
                <p className="text-2xl font-bold text-white">{search.summary.clicks.toLocaleString()}</p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider">
                    <Eye className="w-4 h-4 text-amber-400" /> Impressions
                </div>
                <p className="text-2xl font-bold text-white">{search.summary.impressions.toLocaleString()}</p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-rose-400" /> Avg Position
                </div>
                <p className="text-2xl font-bold text-white">{search.summary.avgPosition}</p>
            </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg h-[300px]">
                <h3 className="text-sm font-bold text-white mb-4 ml-2">Traffic Trend</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={traffic.trend}>
                        <defs>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="date" stroke="#9ca3af" tick={{fontSize: 11}} />
                        <YAxis stroke="#9ca3af" tick={{fontSize: 11}} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
                        <Area type="monotone" dataKey="sessions" stroke="#6366f1" fillOpacity={1} fill="url(#colorSessions)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg h-[300px]">
                <h3 className="text-sm font-bold text-white mb-4 ml-2">Ranking Distribution</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={search.positionDist}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="range" stroke="#9ca3af" tick={{fontSize: 11}} />
                        <YAxis stroke="#9ca3af" tick={{fontSize: 11}} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} cursor={{fill: '#374151', opacity: 0.2}} />
                        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Top Queries Table */}
        <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 bg-gray-900/50 border-b border-gray-800">
                <h3 className="font-bold text-white text-sm">Top Search Queries</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900 text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="p-3">Query</th>
                            <th className="p-3 text-right">Clicks</th>
                            <th className="p-3 text-right">Imp.</th>
                            <th className="p-3 text-center">Pos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {search.topQueries.map((q, i) => (
                            <tr key={i} className="hover:bg-gray-800/30">
                                <td className="p-3 font-medium text-white">{q.query}</td>
                                <td className="p-3 text-right text-gray-300">{q.clicks}</td>
                                <td className="p-3 text-right text-gray-400">{q.impressions}</td>
                                <td className="p-3 text-center">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${q.position <= 3 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-gray-800 text-gray-300'}`}>
                                        {q.position.toFixed(1)}
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

export default DataDashboard;