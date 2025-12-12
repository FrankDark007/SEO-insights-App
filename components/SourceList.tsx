import React from 'react';
import { GroundingChunk } from '../types';
import { ExternalLink, Globe } from 'lucide-react';

interface SourceListProps {
  chunks: GroundingChunk[] | undefined | null;
}

const SourceList: React.FC<SourceListProps> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;

  // Filter out chunks that don't have web data and deduplicate by URI
  const uniqueSources: GroundingChunk[] = Array.from(
    new Map<string, GroundingChunk>(
      chunks
        .filter((c) => c.web?.uri && c.web?.title)
        .map((c): [string, GroundingChunk] => [c.web!.uri, c])
    ).values()
  );

  if (uniqueSources.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Globe className="w-4 h-4" />
        Verified Sources & Search Data
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {uniqueSources.map((chunk, index) => (
          <a
            key={index}
            href={chunk.web?.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-indigo-500/50 transition-all duration-200 group"
          >
            <div className="mt-1 min-w-[16px]">
                <img 
                    src={`https://www.google.com/s2/favicons?domain=${new URL(chunk.web!.uri).hostname}&sz=32`} 
                    alt="favicon" 
                    className="w-4 h-4 opacity-70 group-hover:opacity-100"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/16?text=W";
                    }}
                />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate group-hover:text-indigo-300">
                {chunk.web?.title}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {new URL(chunk.web!.uri).hostname}
              </p>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-indigo-400" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceList;