import React, { useState } from 'react';
import { CompetitorAd } from '../types';
import { 
  ExternalLink, 
  MapPin, 
  Phone, 
  Link as LinkIcon, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Layout
} from 'lucide-react';

interface AdCopyCardProps {
  ad: CompetitorAd;
}

const AdCopyCard: React.FC<AdCopyCardProps> = ({ ad }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg transition-all hover:border-gray-700">
      <div className="p-4 flex items-center justify-between cursor-pointer bg-gray-900/50" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                ad.position === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' :
                'bg-gray-800 text-gray-400 border border-gray-700'
            }`}>
                {ad.position}
            </span>
            <div>
                <h4 className="font-bold text-white text-sm">{ad.advertiser}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    {ad.displayUrl}
                    {ad.adType === 'lsa' && <span className="ml-2 bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] border border-indigo-500/30">LSA</span>}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">Spend: {ad.estimatedMonthlySpend}</span>
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
          <div className="space-y-1 mb-4">
              {ad.headlines.map((hl, i) => (
                  <p key={i} className="text-lg font-medium text-indigo-400 leading-tight">
                      {hl} {i < ad.headlines.length - 1 && <span className="text-gray-600 font-normal">|</span>}
                  </p>
              ))}
          </div>
          <div className="space-y-1 mb-4">
              {ad.descriptions.map((desc, i) => (
                  <p key={i} className="text-sm text-gray-300">
                      {desc}
                  </p>
              ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
              {ad.extensions.call && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs text-gray-400">
                      <Phone className="w-3 h-3" /> Call Ext
                  </span>
              )}
              {ad.extensions.location && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" /> Location
                  </span>
              )}
              {ad.extensions.sitelinks > 0 && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs text-gray-400">
                      <LinkIcon className="w-3 h-3" /> {ad.extensions.sitelinks} Sitelinks
                  </span>
              )}
              {ad.extensions.callouts && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs text-gray-400">
                      <CheckCircle className="w-3 h-3" /> Callouts
                  </span>
              )}
          </div>

          {expanded && (
              <div className="mt-4 pt-4 border-t border-gray-800 bg-gray-900/30 -mx-4 -mb-4 p-4">
                  <div className="flex items-center justify-between mb-2">
                      <h5 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                          <Layout className="w-3 h-3" /> Landing Page
                      </h5>
                      <a 
                        href={ad.landingPage} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                          View Page <ExternalLink className="w-3 h-3" />
                      </a>
                  </div>
                  <p className="text-xs text-gray-400 break-all bg-gray-900 p-2 rounded border border-gray-800 font-mono">
                      {ad.landingPage}
                  </p>
              </div>
          )}
      </div>
    </div>
  );
};

export default AdCopyCard;