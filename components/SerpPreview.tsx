import React from 'react';
import { GroundingChunk } from '../types';
import { ExternalLink, Globe, Search } from 'lucide-react';

interface SerpPreviewProps {
  chunks: GroundingChunk[] | undefined | null;
  keywords: string;
}

const SerpPreview: React.FC<SerpPreviewProps> = ({ chunks, keywords }) => {
  if (!chunks || chunks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50">
        <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300">No SERP Data Available</h3>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          The analysis didn't return direct search sources. Try running the analysis again with broader keywords.
        </p>
      </div>
    );
  }

  // Deduplicate sources
  const uniqueSources: GroundingChunk[] = Array.from(
    new Map<string, GroundingChunk>(
      chunks
        .filter((c) => c.web?.uri && c.web?.title)
        .map((c): [string, GroundingChunk] => [c.web!.uri, c])
    ).values()
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6 p-4 bg-[#1f2937]/50 rounded-xl border border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-300">
           <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
              <Search className="w-5 h-5" />
           </div>
           <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Target Query</p>
              <p className="font-medium text-white">"{keywords}"</p>
           </div>
        </div>
        <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-white">{uniqueSources.length}</p>
            <p className="text-xs text-gray-500">Live Results Found</p>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {uniqueSources.map((chunk, index) => {
           const hostname = new URL(chunk.web!.uri).hostname;
           return (
            <div key={index} className="bg-[#1f2937] p-5 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/10 p-1 rounded-full">
                         <img 
                            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`} 
                            alt="" 
                            className="w-4 h-4"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/16?text=W";
                            }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-300">{hostname}</span>
                        <span className="text-xs text-gray-500 truncate max-w-[250px]">{chunk.web?.uri}</span>
                    </div>
                </div>
                
                <a 
                    href={chunk.web?.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group-hover:underline decoration-indigo-400 underline-offset-2"
                >
                    <h3 className="text-xl text-indigo-400 font-medium mb-1 group-hover:text-indigo-300">
                        {chunk.web?.title}
                    </h3>
                </a>
                
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                    {/* Since grounding metadata doesn't always provide the snippet, we display a context message */}
                    Source identified in live search analysis. This page currently ranks for your target keywords and was analyzed for the report.
                </p>
                
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded border border-gray-600">Organic Result</span>
                </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};

export default SerpPreview;