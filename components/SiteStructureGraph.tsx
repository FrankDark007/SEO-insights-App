import React from 'react';
import { PageLinkData, SiloAnalysis } from '../types';

interface SiteStructureGraphProps {
  pages: PageLinkData[];
  silos: SiloAnalysis[];
}

const SiteStructureGraph: React.FC<SiteStructureGraphProps> = ({ pages, silos }) => {
  // Simplified visualization: Layered Tree
  // Level 0: Homepage
  // Level 1: Silo Hubs / Main Service Pages
  // Level 2: Spokes / Location Pages
  
  if (!pages || pages.length === 0) return null;

  const homepage = pages.find(p => p.pageType === 'homepage') || pages[0];
  const hubs = silos.map(s => pages.find(p => p.url === s.hubPage)).filter(Boolean) as PageLinkData[];
  // If no silos detected, use depth 1 pages as hubs
  const displayHubs = hubs.length > 0 ? hubs : pages.filter(p => p.depth === 1 && p.pageType !== 'homepage').slice(0, 5);
  
  const spokes = pages.filter(p => p.depth >= 2 && p.pageType !== 'blog').slice(0, 15);

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto">
      <h3 className="text-lg font-bold text-white mb-6">Page Authority Flow</h3>
      
      <div className="min-w-[600px] flex flex-col items-center gap-12 relative py-4">
        
        {/* Level 0: Homepage */}
        <div className="relative z-10">
            <div className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-indigo-600 border-4 border-indigo-900 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] z-20 relative transition-transform hover:scale-110">
                    <span className="text-2xl">🏠</span>
                </div>
                <div className="mt-2 bg-gray-900/80 px-3 py-1 rounded text-xs text-white border border-gray-700">
                    Homepage
                </div>
            </div>
        </div>

        {/* Connections Level 0 -> 1 */}
        <svg className="absolute top-[40px] left-0 w-full h-[100px] pointer-events-none z-0">
            {displayHubs.map((_, i) => {
                const startX = 50; // percent
                const endX = (i + 1) * (100 / (displayHubs.length + 1));
                return (
                    <path 
                        key={i}
                        d={`M ${startX}% 20 C ${startX}% 50, ${endX}% 50, ${endX}% 80`}
                        fill="none"
                        stroke="#4b5563"
                        strokeWidth="2"
                        className="opacity-50"
                    />
                );
            })}
        </svg>

        {/* Level 1: Hubs */}
        <div className="grid grid-flow-col gap-8 md:gap-16 z-10 w-full justify-center">
            {displayHubs.map((hub, i) => (
                <div key={i} className="flex flex-col items-center group">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 border-4 border-emerald-900 flex items-center justify-center shadow-lg z-20 relative transition-transform hover:scale-110 cursor-pointer" title={hub.url}>
                        <span className="text-lg">⚙️</span>
                    </div>
                    <div className="mt-2 bg-gray-900/80 px-2 py-1 rounded text-[10px] text-gray-300 border border-gray-700 max-w-[100px] truncate text-center">
                        {hub.title}
                    </div>
                    {/* Connections Level 1 -> 2 (Simplified: Just visual lines down if they have spokes) */}
                    <div className="h-8 w-0.5 bg-gray-700 mt-1"></div>
                </div>
            ))}
        </div>

        {/* Level 2: Spokes (Aggregated) */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl z-10 mt-[-10px]">
            {spokes.map((spoke, i) => (
                <div key={i} className="flex items-center gap-1 bg-gray-800/50 border border-gray-700 px-2 py-1 rounded-full text-xs text-gray-400 hover:text-white hover:border-gray-500 transition-colors cursor-default" title={spoke.url}>
                    <div className={`w-2 h-2 rounded-full ${spoke.internalLinksIn < 3 ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                    <span className="truncate max-w-[120px]">{spoke.title || spoke.url}</span>
                </div>
            ))}
            {pages.length > (displayHubs.length + spokes.length + 1) && (
                <div className="px-2 py-1 text-xs text-gray-500 italic">
                    + {pages.length - (displayHubs.length + spokes.length + 1)} more pages...
                </div>
            )}
        </div>

        {/* Legend */}
        <div className="absolute top-0 right-0 bg-gray-900/80 p-3 rounded-lg border border-gray-800 text-xs space-y-2">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400"></span> Homepage
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-400"></span> Hub Page
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Healthy Spoke
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span> Weak Spoke
            </div>
        </div>

      </div>
    </div>
  );
};

export default SiteStructureGraph;