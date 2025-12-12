import React, { useState } from 'react';
import { SwipeFileItem } from '../types';
import { Copy, Check } from 'lucide-react';

interface SwipeFileTableProps {
  items: SwipeFileItem[];
  type: 'Headline' | 'Description';
}

const SwipeFileTable: React.FC<SwipeFileTableProps> = ({ items, type }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 bg-gray-900/50 border-b border-gray-800">
          <h3 className="text-sm font-bold text-white">{type} Swipe File</h3>
      </div>
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase sticky top-0 z-10">
              <th className="p-3 font-semibold w-2/3">{type} Text</th>
              <th className="p-3 font-semibold text-center">Chars</th>
              <th className="p-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                <td className="p-3 text-sm text-gray-300">
                    "{item.text}"
                    <div className="mt-1 flex flex-wrap gap-1">
                        {item.usedBy.slice(0, 3).map((user, j) => (
                            <span key={j} className="text-[10px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">
                                {user}
                            </span>
                        ))}
                        {item.usedBy.length > 3 && <span className="text-[10px] text-gray-500">+{item.usedBy.length - 3}</span>}
                    </div>
                </td>
                <td className="p-3 text-center">
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                        (type === 'Headline' && item.characterCount > 30) || (type === 'Description' && item.characterCount > 90)
                        ? 'bg-rose-900/20 text-rose-400' 
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                        {item.characterCount}
                    </span>
                </td>
                <td className="p-3 text-right">
                    <button 
                        onClick={() => copyText(item.text, i)}
                        className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                        title="Copy to clipboard"
                    >
                        {copiedIndex === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SwipeFileTable;