import React from 'react';
import { OrphanPage } from '../types';
import { AlertTriangle, Link, ArrowRight } from 'lucide-react';

interface OrphanPageCardProps {
  orphan: OrphanPage;
}

const OrphanPageCard: React.FC<OrphanPageCardProps> = ({ orphan }) => {
  return (
    <div className="bg-[#161b22] border border-rose-900/30 rounded-xl p-4 shadow-lg hover:border-rose-500/30 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h4 className="font-bold text-white text-sm truncate max-w-[200px]" title={orphan.title}>{orphan.title}</h4>
        </div>
        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700 uppercase">
            {orphan.pageType}
        </span>
      </div>
      
      <p className="text-xs text-rose-300 mb-3 truncate" title={orphan.url}>{orphan.url}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Suggested Fixes</p>
          <div className="space-y-2">
              {orphan.suggestedLinkSources.map((source, i) => (
                  <div key={i} className="text-xs">
                      <div className="flex items-center gap-2 text-gray-300 mb-0.5">
                          <Link className="w-3 h-3 text-indigo-400" />
                          <span className="font-medium">Link from:</span> 
                          <span className="truncate max-w-[150px] text-indigo-300" title={source.sourceUrl}>{source.sourceUrl}</span>
                      </div>
                      <div className="flex items-center gap-2 pl-5 text-gray-500">
                          <ArrowRight className="w-3 h-3" />
                          <span>Anchor: <span className="text-white bg-gray-800 px-1 rounded">"{source.suggestedAnchor}"</span></span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default OrphanPageCard;