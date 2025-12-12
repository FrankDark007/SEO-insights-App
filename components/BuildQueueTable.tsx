import React from 'react';
import { MissingCitation } from '../types';
import { ExternalLink, PlusCircle } from 'lucide-react';

interface BuildQueueTableProps {
  queue: MissingCitation[];
}

const BuildQueueTable: React.FC<BuildQueueTableProps> = ({ queue }) => {
  if (!queue || queue.length === 0) {
      return (
          <div className="p-8 text-center text-gray-500 bg-[#161b22] rounded-xl border border-gray-800">
              No missing major citations found. Excellent coverage!
          </div>
      );
  }

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-gray-800 bg-indigo-900/10 flex justify-between items-center">
          <h3 className="font-bold text-white">Missing Citations Queue</h3>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">{queue.length} Opportunities</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
              <th className="p-4 font-semibold">Source</th>
              <th className="p-4 font-semibold text-center">DA</th>
              <th className="p-4 font-semibold text-center">Priority</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Est. Time</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {queue.map((item, i) => (
              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 font-bold text-white">{item.source}</td>
                <td className="p-4 text-center text-gray-300 font-mono">{item.domainAuthority}</td>
                <td className="p-4 text-center">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                        item.priority === 'critical' ? 'bg-rose-900/30 text-rose-400 border border-rose-800' :
                        item.priority === 'high' ? 'bg-amber-900/30 text-amber-400 border border-amber-800' :
                        'bg-blue-900/30 text-blue-400 border border-blue-800'
                    }`}>
                        {item.priority}
                    </span>
                </td>
                <td className="p-4 text-sm text-gray-400">{item.category}</td>
                <td className="p-4 text-sm text-gray-500">{item.estimatedTime}</td>
                <td className="p-4 text-right">
                    <a 
                        href={item.buildUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded transition-colors"
                    >
                        <PlusCircle className="w-3 h-3" /> Build Now
                    </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuildQueueTable;