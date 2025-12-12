import React, { useState } from 'react';
import { CitationStatus } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, Edit } from 'lucide-react';

interface CitationTableProps {
  citations: CitationStatus[];
}

const CitationTable: React.FC<CitationTableProps> = ({ citations }) => {
  const [filter, setFilter] = useState<'all' | 'verified' | 'issues'>('all');

  const filteredCitations = citations.filter(c => {
      if (filter === 'verified') return c.status === 'verified';
      if (filter === 'issues') return c.status === 'has_issues';
      return true;
  });

  const getStatusIcon = (status: string) => {
      switch (status) {
          case 'verified': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
          case 'has_issues': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
          case 'missing': return <XCircle className="w-4 h-4 text-rose-500" />;
          default: return null;
      }
  };

  const StatusCell = ({ match }: { match: boolean }) => (
      <div className="flex justify-center">
          {match ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
          ) : (
              <XCircle className="w-4 h-4 text-rose-500" />
          )}
      </div>
  );

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-gray-800 flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filter === 'all' ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-400 border-transparent hover:text-white'}`}
          >
              All Sources
          </button>
          <button 
            onClick={() => setFilter('issues')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filter === 'issues' ? 'bg-amber-900/20 text-amber-400 border-amber-800' : 'text-gray-400 border-transparent hover:text-white'}`}
          >
              Has Issues
          </button>
          <button 
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filter === 'verified' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'text-gray-400 border-transparent hover:text-white'}`}
          >
              Verified
          </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
              <th className="p-4 font-semibold">Source</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-center">Name</th>
              <th className="p-4 font-semibold text-center">Address</th>
              <th className="p-4 font-semibold text-center">Phone</th>
              <th className="p-4 font-semibold text-center">Website</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredCitations.map((citation, i) => (
              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4">
                    <div className="font-medium text-white">{citation.source}</div>
                    <div className="text-[10px] text-gray-500 uppercase">{citation.category}</div>
                </td>
                <td className="p-4 text-center">
                    <div className="flex justify-center">{getStatusIcon(citation.status)}</div>
                </td>
                <td className="p-4"><StatusCell match={citation.nameMatch} /></td>
                <td className="p-4"><StatusCell match={citation.addressMatch} /></td>
                <td className="p-4"><StatusCell match={citation.phoneMatch} /></td>
                <td className="p-4"><StatusCell match={citation.websiteMatch} /></td>
                <td className="p-4 text-right">
                    {citation.listingUrl && (
                        <a 
                            href={citation.listingUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-700 transition-colors"
                        >
                            View <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </td>
              </tr>
            ))}
            {filteredCitations.length === 0 && (
                <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                        No citations found matching this filter.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CitationTable;