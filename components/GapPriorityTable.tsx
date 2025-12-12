import React from 'react';
import { GapOpportunity } from '../types';
import { TrendingUp, AlertCircle, BarChart2 } from 'lucide-react';

interface GapPriorityTableProps {
  gaps: GapOpportunity[];
}

const GapPriorityTable: React.FC<GapPriorityTableProps> = ({ gaps }) => {
  if (!gaps || gaps.length === 0) return (
      <div className="p-8 text-center text-gray-500 bg-[#161b22] rounded-xl border border-gray-800">
          No critical gaps found. Good job!
      </div>
  );

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
                        <th className="p-4 font-semibold">City</th>
                        <th className="p-4 font-semibold">Service</th>
                        <th className="p-4 font-semibold text-center">Competitors</th>
                        <th className="p-4 font-semibold text-center">Est. Volume</th>
                        <th className="p-4 font-semibold text-center">Priority</th>
                        <th className="p-4 font-semibold">Recommendation</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {gaps.map((gap, i) => (
                        <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                            <td className="p-4 font-medium text-white">{gap.city}</td>
                            <td className="p-4 text-gray-300">{gap.service}</td>
                            <td className="p-4 text-center">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-xs font-bold text-gray-300 border border-gray-700">
                                    {gap.competitorsCovering.length}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                                    gap.searchVolumeEstimate === 'high' ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-800' :
                                    gap.searchVolumeEstimate === 'medium' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' :
                                    'bg-gray-800 text-gray-500'
                                }`}>
                                    {gap.searchVolumeEstimate}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <div className="flex flex-col items-center">
                                    <span className={`text-sm font-bold ${
                                        gap.priorityScore > 80 ? 'text-rose-400' : 
                                        gap.priorityScore > 50 ? 'text-amber-400' : 'text-gray-400'
                                    }`}>
                                        {gap.priorityScore}
                                    </span>
                                    {gap.priorityScore > 80 && <AlertCircle className="w-3 h-3 text-rose-500 mt-1" />}
                                </div>
                            </td>
                            <td className="p-4 text-sm text-gray-400">
                                {gap.recommendedAction}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default GapPriorityTable;