import React, { useState } from 'react';
import { CompetitorRichResult } from '../types';
import { Star, HelpCircle, Code, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface CompetitorResultsTableProps {
  results: CompetitorRichResult[];
}

const CompetitorResultsTable: React.FC<CompetitorResultsTableProps> = ({ results }) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const copySchema = (code: object, index: number) => {
    navigator.clipboard.writeText(JSON.stringify(code, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!results || results.length === 0) return null;

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
              <th className="p-4 font-semibold">Domain</th>
              <th className="p-4 font-semibold">Keyword / City</th>
              <th className="p-4 font-semibold text-center">Rank</th>
              <th className="p-4 font-semibold">Rich Results</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {results.map((result, i) => (
              <React.Fragment key={i}>
                <tr className="hover:bg-gray-800/30 transition-colors cursor-pointer" onClick={() => toggleRow(i)}>
                  <td className="p-4 font-medium text-white">{result.domain}</td>
                  <td className="p-4">
                    <p className="text-sm text-gray-300">{result.keyword}</p>
                    <p className="text-xs text-gray-500">{result.city}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-xs font-bold text-gray-300 border border-gray-700">
                        {result.position}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {result.richResults.map((rr, j) => (
                            <span key={j} className="text-xs bg-indigo-900/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 flex items-center gap-1">
                                {rr.type.includes('Star') ? <Star className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                                {rr.type}
                            </span>
                        ))}
                        {result.richResults.length === 0 && <span className="text-gray-500 text-xs">-</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right text-gray-500">
                      {expandedRow === i ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                  </td>
                </tr>
                
                {expandedRow === i && (
                    <tr className="bg-gray-900/30">
                        <td colSpan={5} className="p-0">
                            <div className="p-6 border-t border-gray-800 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                            <Code className="w-4 h-4 text-emerald-400" /> Detected Schema
                                        </h4>
                                        <div className="flex gap-2">
                                            {result.schemaFound.map((schema, k) => (
                                                <span key={k} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">
                                                    {schema.type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <a href={result.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">View Page ↗</a>
                                </div>

                                <div className="bg-[#0d1117] rounded-lg border border-gray-800 p-4 relative group">
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); copySchema(result.schemaFound[0]?.code || {}, i); }}
                                            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded border border-gray-700 transition-colors"
                                        >
                                            {copiedIndex === i ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                    <pre className="text-xs text-gray-400 font-mono overflow-x-auto max-h-60 custom-scrollbar">
                                        {result.schemaFound.length > 0 
                                            ? JSON.stringify(result.schemaFound[0].code, null, 2) 
                                            : '// No structured data found'}
                                    </pre>
                                </div>

                                <div>
                                    <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Analysis</h5>
                                    <ul className="space-y-1">
                                        {result.analysisNotes.map((note, k) => (
                                            <li key={k} className="text-sm text-gray-300 flex items-start gap-2">
                                                <span className="text-indigo-500 mt-1">•</span> {note}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetitorResultsTable;