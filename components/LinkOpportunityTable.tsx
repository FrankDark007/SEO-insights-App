import React from 'react';
import { LinkOpp } from '../types';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface LinkOpportunityTableProps {
  opportunities: LinkOpp[];
}

const LinkOpportunityTable: React.FC<LinkOpportunityTableProps> = ({ opportunities }) => {
  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
              <th className="p-4 font-semibold">Source Page</th>
              <th className="p-4 font-semibold">Target Page</th>
              <th className="p-4 font-semibold">Suggested Anchor</th>
              <th className="p-4 font-semibold text-center">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {opportunities.map((opp, i) => (
              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm truncate max-w-[200px]" title={opp.sourceTitle}>{opp.sourceTitle}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[200px]" title={opp.sourceUrl}>{opp.sourceUrl}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm truncate max-w-[200px]" title={opp.targetTitle}>{opp.targetTitle}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[200px]" title={opp.targetUrl}>{opp.targetUrl}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-400 font-medium bg-emerald-900/10 px-2 py-1 rounded border border-emerald-900/30">
                        {opp.suggestedAnchor}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{opp.reason}</p>
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

export default LinkOpportunityTable;