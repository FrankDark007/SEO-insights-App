import React, { useState } from 'react';
import { PAAQuestion } from '../types';
import { Copy, Check, HelpCircle } from 'lucide-react';

interface PAAListProps {
  questions: PAAQuestion[];
}

const PAAList: React.FC<PAAListProps> = ({ questions }) => {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    const text = questions.map(q => q.question).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-indigo-900/10">
        <h3 className="font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            People Also Ask Mining
        </h3>
        <button 
            onClick={copyAll}
            className="flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-700 transition-colors"
        >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied All' : 'Copy Questions'}
        </button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-gray-800">
              {questions.map((q, i) => (
                  <div key={i} className="p-4 hover:bg-gray-800/30 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-white">{q.question}</p>
                          <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700 whitespace-nowrap ml-2">
                              {q.frequency} kw triggers
                          </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="text-gray-500">Answered by: <span className="text-gray-300">{q.currentSource}</span></span>
                          <span className="text-indigo-400">Target: {q.targetPage}</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default PAAList;