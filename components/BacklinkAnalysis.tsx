import React, { useState, useEffect } from 'react';
import { getAhrefsConfig, getBacklinks, getAnchorTexts } from '../services/ahrefsService';
import { AhrefsBacklink, AhrefsAnchorText } from '../types';
import { Loader2, ExternalLink, Link2, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const BacklinkAnalysis: React.FC = () => {
  const [backlinks, setBacklinks] = useState<AhrefsBacklink[]>([]);
  const [anchors, setAnchors] = useState<AhrefsAnchorText[]>([]);
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
          const bl = await getBacklinks(domain);
          const an = await getAnchorTexts(domain);
          setBacklinks(bl);
          setAnchors(an);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const anchorData = anchors.map((a, i) => ({
      name: a.anchor,
      value: a.percentage,
      color: ['#34d399', '#818cf8', '#f472b6', '#fbbf24', '#9ca3af'][i % 5]
  }));

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-400">Analyzing backlinks...</p>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        
        {/* Top Section: Charts & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-indigo-400" /> Recent Backlinks
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-900 text-xs text-gray-400 uppercase">
                            <tr>
                                <th className="p-4">Referring Page</th>
                                <th className="p-4 text-center">DR</th>
                                <th className="p-4">Anchor & Target</th>
                                <th className="p-4 text-right">First Seen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {backlinks.map((link, i) => (
                                <tr key={i} className="hover:bg-gray-800/30">
                                    <td className="p-4 max-w-[250px]">
                                        <a href={link.urlFrom} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline truncate block font-medium">
                                            {new URL(link.urlFrom).hostname}
                                        </a>
                                        <p className="text-xs text-gray-500 truncate">{new URL(link.urlFrom).pathname}</p>
                                        <div className="mt-1">
                                            {!link.isDofollow && <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">NOFOLLOW</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`font-mono font-bold ${
                                            link.domainRating > 70 ? 'text-amber-400' :
                                            link.domainRating > 40 ? 'text-emerald-400' :
                                            'text-gray-400'
                                        }`}>
                                            {link.domainRating}
                                        </span>
                                    </td>
                                    <td className="p-4 max-w-[200px]">
                                        <div className="text-white text-xs bg-gray-800 px-2 py-1 rounded mb-1 inline-block border border-gray-700">
                                            "{link.anchor}"
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">To: {link.urlTo}</p>
                                    </td>
                                    <td className="p-4 text-right text-gray-400 text-xs font-mono">
                                        {link.firstSeen}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-emerald-400" /> Anchor Distribution
                </h3>
                <div className="flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={anchorData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {anchorData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                    {anchorData.map((a, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }}></div>
                                <span className="text-gray-300 truncate max-w-[150px]">{a.name}</span>
                            </div>
                            <span className="font-bold text-white">{a.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default BacklinkAnalysis;