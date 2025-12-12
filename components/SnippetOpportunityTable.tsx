import React from 'react';
import { SnippetOpportunity } from '../types';
import { AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';

interface SnippetOpportunityTableProps {
  opportunities: SnippetOpportunity[];
}

const SnippetOpportunityTable: React.FC<SnippetOpportunityTableProps> = ({ opportunities }) => {
  if (!opportunities || opportunities.length === 0) return (
      <div className="p-8 text-center text-gray-500 bg-[#161b22] rounded-xl border border-gray-800">
          No featured snippet opportunities found for these keywords.
      </div>
  );

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
              <th className="p-4 font-semibold">Target Keyword</th>
              <th className="p-4 font-semibold">Current Owner</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Content Needed</th>
              <th className="p-4 font-semibold text-center">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {opportunities.map((opp, i) => (
              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4">
                    <p className="text-white font-medium text-sm">{opp.keyword}</p>
                    <p className="text-xs text-indigo-400 mt-1 truncate max-w-[200px]">{opp.targetPage}</p>
                </td>
                <td className="p-4 text-sm text-gray-400">
                    {opp.currentOwner}
                </td>
                <td className="p-4">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700 capitalize">
                        {opp.snippetType}
                    </span>
                </td>
                <td className="p-4 text-sm text-gray-300">
                    {opp.contentNeeded}
                </td>
                <td className="p-4 text-center">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                        opp.priority === 'high' ? 'bg-rose-900/30 text-rose-400 border border-rose-800' :
                        opp.priority === 'medium' ? 'bg-amber-900/30 text-amber-400 border border-amber-800' :
                        'bg-blue-900/30 text-blue-400 border border-blue-800'
                    }`}>
                        {opp.priority}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SnippetOpportunityTable;