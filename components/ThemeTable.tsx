import React, { useState } from 'react';
import { Theme, ThemeWithOpportunity } from '../types';
import { ChevronDown, ChevronUp, Quote } from 'lucide-react';

interface ThemeTableProps {
  title: string;
  themes: (Theme | ThemeWithOpportunity)[];
  type: 'positive' | 'negative';
}

const ThemeTable: React.FC<ThemeTableProps> = ({ title, themes, type }) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (!themes || themes.length === 0) return null;

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className={`px-6 py-4 border-b border-gray-800 flex items-center justify-between ${
          type === 'positive' ? 'bg-emerald-900/10' : 'bg-rose-900/10'
      }`}>
        <h3 className={`font-bold text-lg flex items-center gap-2 ${
            type === 'positive' ? 'text-emerald-400' : 'text-rose-400'
        }`}>
           {title}
        </h3>
        <span className="text-xs text-gray-500 font-medium bg-gray-900 px-2 py-1 rounded-full border border-gray-800">
            {themes.length} Themes
        </span>
      </div>
      
      <div className="divide-y divide-gray-800">
        {themes.map((theme, idx) => (
          <div key={idx} className="bg-transparent hover:bg-gray-800/30 transition-colors">
             <div 
                className="p-4 cursor-pointer flex items-start gap-4"
                onClick={() => setExpanded(expanded === idx ? null : idx)}
             >
                <div className={`mt-1 min-w-[24px] h-6 rounded flex items-center justify-center text-xs font-bold ${
                    type === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                    {theme.frequency}
                </div>
                
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h4 className="text-white font-medium">{theme.theme}</h4>
                        {expanded === idx ? <ChevronUp className="w-4 h-4 text-gray-500"/> : <ChevronDown className="w-4 h-4 text-gray-500"/>}
                    </div>
                    
                    {/* For negative themes, show opportunity preview if collapsed */}
                    {type === 'negative' && 'yourOpportunity' in theme && expanded !== idx && (
                         <p className="text-xs text-indigo-400 mt-1 truncate">
                            Opportunity: {(theme as ThemeWithOpportunity).yourOpportunity}
                         </p>
                    )}
                </div>
             </div>

             {/* Expanded Content */}
             {expanded === idx && (
                <div className="px-4 pb-4 pl-[56px] space-y-3">
                    <div className="relative pl-4 border-l-2 border-gray-700">
                        <Quote className="absolute -top-2 -left-3 w-4 h-4 text-gray-600 bg-[#161b22] p-0.5" />
                        <p className="text-sm text-gray-400 italic">"{theme.exampleQuote}"</p>
                    </div>
                    
                    {type === 'negative' && 'yourOpportunity' in theme && (
                        <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-lg">
                            <p className="text-xs text-indigo-300 font-bold uppercase mb-1">Marketing Opportunity</p>
                            <p className="text-sm text-indigo-100">{(theme as ThemeWithOpportunity).yourOpportunity}</p>
                        </div>
                    )}
                </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeTable;