import React, { useState } from 'react';
import { GeneratedAdCopy } from '../types';
import { Sparkles, Copy, Check, Info } from 'lucide-react';

interface AdCopyGeneratorProps {
  data: GeneratedAdCopy;
}

const AdCopyGenerator: React.FC<AdCopyGeneratorProps> = ({ data }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-violet-900/20 border border-indigo-500/30 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-400" /> AI-Generated Ad Copy
      </h3>

      <div className="space-y-6">
          {/* Headlines */}
          <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Recommended Headlines (30 chars max)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.headlines.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                          <div className="bg-gray-900/80 border border-gray-700 rounded p-2.5 text-sm text-white flex-1 flex justify-between items-center">
                              <span>{hl.text}</span>
                              <span className={`text-[10px] font-mono ${hl.chars > 30 ? 'text-rose-400' : 'text-gray-500'}`}>{hl.chars}</span>
                          </div>
                          <button 
                            onClick={() => copyText(hl.text, `hl-${i}`)} 
                            className="text-gray-500 hover:text-white p-2 bg-gray-800/50 rounded hover:bg-gray-700 transition-colors"
                          >
                              {copied === `hl-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                      </div>
                  ))}
              </div>
          </div>

          {/* Descriptions */}
          <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Recommended Descriptions (90 chars max)</h4>
              <div className="space-y-3">
                  {data.descriptions.map((desc, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                          <div className="bg-gray-900/80 border border-gray-700 rounded p-3 text-sm text-gray-300 flex-1 flex justify-between items-start gap-4">
                              <span>{desc.text}</span>
                              <span className={`text-[10px] font-mono whitespace-nowrap mt-1 ${desc.chars > 90 ? 'text-rose-400' : 'text-gray-500'}`}>{desc.chars} / 90</span>
                          </div>
                          <button 
                            onClick={() => copyText(desc.text, `desc-${i}`)} 
                            className="text-gray-500 hover:text-white p-2 bg-gray-800/50 rounded hover:bg-gray-700 transition-colors"
                          >
                              {copied === `desc-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                      </div>
                  ))}
              </div>
          </div>

          {/* Strategy */}
          <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-4">
              <h4 className="text-xs font-bold text-indigo-300 uppercase mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Differentiation Strategy
              </h4>
              <ul className="space-y-1">
                  {data.differentiationStrategy.map((strat, i) => (
                      <li key={i} className="text-sm text-indigo-100 flex items-start gap-2">
                          <span className="text-indigo-400 mt-1.5 w-1 h-1 bg-indigo-400 rounded-full"></span>
                          {strat}
                      </li>
                  ))}
              </ul>
          </div>
      </div>
    </div>
  );
};

export default AdCopyGenerator;