import React from 'react';
import { CompetitorMetric } from '../types';
import { BarChart2, Shield, Link2, Users, Star, MessageSquare, MapPin } from 'lucide-react';

interface CompetitorChartProps {
  data: CompetitorMetric[];
}

const CompetitorChart: React.FC<CompetitorChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-[#161b22] p-6 rounded-2xl border border-gray-800 mb-8 shadow-xl print:bg-white print:border-gray-200 print:shadow-none print:break-inside-avoid">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400 print:bg-indigo-100 print:text-indigo-700">
                <BarChart2 className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white print:text-black">Competitor Intelligence</h3>
                <p className="text-xs text-gray-500 print:text-gray-600">Organic & Local Map Pack Metrics</p>
            </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 bg-gray-900/50 p-2 rounded-lg border border-gray-800 print:bg-gray-100 print:border-gray-200 print:text-gray-800">
            <div className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 print:bg-indigo-600"></div>
                 <span>Auth</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 print:bg-emerald-600"></div>
                 <span>Links</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-sm bg-cyan-500 print:bg-cyan-600"></div>
                 <span>Traffic</span>
             </div>
             <div className="w-px h-3 bg-gray-700 mx-1 hidden sm:block"></div>
             <div className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-sm bg-amber-500 print:bg-amber-600"></div>
                 <span>Reviews</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 print:bg-rose-600"></div>
                 <span>Rating</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-sm bg-violet-500 print:bg-violet-600"></div>
                 <span>Pages</span>
             </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {data.map((item, index) => (
          <div key={index} className="relative">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-white tracking-wide print:text-black">
                    {item.name}
                </span>
            </div>
            
            <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-800/50 print:bg-gray-50 print:border-gray-200">
                {/* Section 1: Traditional SEO Metrics */}
                <div className="space-y-3">
                    {/* Domain Authority Bar */}
                    <div className="flex items-center gap-4 group">
                        <div className="w-28 flex items-center gap-2 text-xs text-gray-400 font-medium print:text-gray-600">
                            <Shield className="w-3 h-3 text-indigo-400 print:text-indigo-600" />
                            Domain Auth
                        </div>
                        <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden print:bg-gray-200">
                            <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-400 print:bg-indigo-600 print:print-color-adjust-exact"
                                style={{ width: `${item.domain_authority}%` }}
                            ></div>
                        </div>
                        <div className="w-10 text-xs font-bold text-indigo-400 text-right print:text-indigo-700">{item.domain_authority}</div>
                    </div>

                    {/* Backlink Strength Bar */}
                    <div className="flex items-center gap-4 group">
                        <div className="w-28 flex items-center gap-2 text-xs text-gray-400 font-medium print:text-gray-600">
                            <Link2 className="w-3 h-3 text-emerald-400 print:text-emerald-600" />
                            Backlink Power
                        </div>
                        <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden print:bg-gray-200">
                            <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out delay-75 group-hover:bg-emerald-400 print:bg-emerald-600 print:print-color-adjust-exact"
                                style={{ width: `${item.backlink_strength}%` }}
                            ></div>
                        </div>
                        <div className="w-10 text-xs font-bold text-emerald-400 text-right print:text-emerald-700">{item.backlink_strength}</div>
                    </div>

                    {/* Estimated Traffic Bar */}
                    <div className="flex items-center gap-4 group">
                        <div className="w-28 flex items-center gap-2 text-xs text-gray-400 font-medium print:text-gray-600">
                            <Users className="w-3 h-3 text-cyan-400 print:text-cyan-600" />
                            Est. Traffic
                        </div>
                        <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden print:bg-gray-200">
                            <div 
                                className="h-full bg-cyan-500 rounded-full transition-all duration-1000 ease-out delay-150 group-hover:bg-cyan-400 print:bg-cyan-600 print:print-color-adjust-exact"
                                style={{ width: `${item.estimated_traffic}%` }}
                            ></div>
                        </div>
                        <div className="w-10 text-xs font-bold text-cyan-400 text-right print:text-cyan-700">{item.estimated_traffic}</div>
                    </div>
                </div>

                {/* Divider for Local Metrics */}
                {(item.gbp_review_count !== undefined || item.gbp_rating !== undefined || item.local_pages_count !== undefined) && (
                    <div className="my-4 border-t border-gray-800/50 print:border-gray-300"></div>
                )}

                {/* Section 2: Local & GBP Metrics */}
                <div className="space-y-3">
                    {/* GBP Reviews Bar (Scaled to 200) */}
                    {item.gbp_review_count !== undefined && (
                        <div className="flex items-center gap-4 group">
                            <div className="w-28 flex items-center gap-2 text-xs text-gray-400 font-medium print:text-gray-600">
                                <MessageSquare className="w-3 h-3 text-amber-400 print:text-amber-600" />
                                GBP Reviews
                            </div>
                            <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden print:bg-gray-200">
                                <div 
                                    className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out delay-200 group-hover:bg-amber-400 print:bg-amber-600 print:print-color-adjust-exact"
                                    style={{ width: `${Math.min((item.gbp_review_count / 200) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="w-10 text-xs font-bold text-amber-400 text-right print:text-amber-700">{item.gbp_review_count}</div>
                        </div>
                    )}

                    {/* GBP Rating Bar (Scaled to 50, displaying decimal) */}
                    {item.gbp_rating !== undefined && (
                        <div className="flex items-center gap-4 group">
                            <div className="w-28 flex items-center gap-2 text-xs text-gray-400 font-medium print:text-gray-600">
                                <Star className="w-3 h-3 text-rose-400 print:text-rose-600" />
                                GBP Rating
                            </div>
                            <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden print:bg-gray-200">
                                <div 
                                    className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out delay-300 group-hover:bg-rose-400 print:bg-rose-600 print:print-color-adjust-exact"
                                    style={{ width: `${(item.gbp_rating / 50) * 100}%` }}
                                ></div>
                            </div>
                            <div className="w-10 text-xs font-bold text-rose-400 text-right print:text-rose-700">
                                {(item.gbp_rating / 10).toFixed(1)}
                            </div>
                        </div>
                    )}

                    {/* Local Pages Count Bar (Scaled to 20) */}
                    {item.local_pages_count !== undefined && (
                        <div className="flex items-center gap-4 group">
                            <div className="w-28 flex items-center gap-2 text-xs text-gray-400 font-medium print:text-gray-600">
                                <MapPin className="w-3 h-3 text-violet-400 print:text-violet-600" />
                                Local Pages
                            </div>
                            <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden print:bg-gray-200">
                                <div 
                                    className="h-full bg-violet-500 rounded-full transition-all duration-1000 ease-out delay-500 group-hover:bg-violet-400 print:bg-violet-600 print:print-color-adjust-exact"
                                    style={{ width: `${Math.min((item.local_pages_count / 20) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="w-10 text-xs font-bold text-violet-400 text-right print:text-violet-700">{item.local_pages_count}</div>
                        </div>
                    )}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorChart;