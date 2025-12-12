import React from 'react';
import { KeywordVariation } from '../types';

interface KeywordVariationTableProps {
  variations: KeywordVariation[];
}

const KeywordVariationTable: React.FC<KeywordVariationTableProps> = ({ variations }) => {
  if (!variations || variations.length === 0) return null;

  // Extract all unique cities from the first variation to build columns
  const cities = variations[0].variations.map(v => v.city);

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
              <th className="p-4 font-semibold border-b border-gray-800 sticky left-0 bg-gray-900 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">Base Keyword</th>
              {cities.map((city, i) => (
                <th key={i} className="p-4 font-semibold border-b border-gray-800 min-w-[200px]">{city} Variation</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {variations.map((row, i) => (
              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 font-medium text-indigo-300 border-r border-gray-800 sticky left-0 bg-[#161b22] z-10">
                    {row.baseKeyword}
                </td>
                {row.variations.map((v, j) => (
                  <td key={j} className="p-4">
                    <p className="text-sm text-white mb-1">"{v.variation}"</p>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        v.volume === 'high' ? 'bg-emerald-900/30 text-emerald-400' :
                        v.volume === 'medium' ? 'bg-blue-900/30 text-blue-400' :
                        'bg-gray-800 text-gray-500'
                    }`}>
                        {v.volume} Vol
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordVariationTable;