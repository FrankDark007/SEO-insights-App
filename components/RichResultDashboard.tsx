import React from 'react';
import { FeatureOverview } from '../types';
import { Star, HelpCircle, Link2, Image, List, AlertTriangle } from 'lucide-react';

interface RichResultDashboardProps {
  overview: FeatureOverview[];
}

const RichResultDashboard: React.FC<RichResultDashboardProps> = ({ overview }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Review Stars': return <Star className="w-5 h-5 text-amber-400" />;
      case 'FAQ Dropdowns': return <HelpCircle className="w-5 h-5 text-indigo-400" />;
      case 'Sitelinks': return <Link2 className="w-5 h-5 text-blue-400" />;
      case 'Image Thumbnails': return <Image className="w-5 h-5 text-emerald-400" />;
      case 'Breadcrumbs': return <List className="w-5 h-5 text-gray-400" />;
      default: return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {overview.map((item, index) => (
        <div key={index} className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col justify-between h-full hover:border-gray-700 transition-colors">
          <div>
            <div className="flex justify-between items-start mb-3">
                <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-800">
                    {getIcon(item.featureType)}
                </div>
                {item.quickWinCount > 0 && (
                    <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-900/50 flex items-center gap-1 font-bold">
                        +{item.quickWinCount} Wins
                    </span>
                )}
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{item.featureType}</h3>
            
            <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Competitors:</span>
                    <span className="text-white font-mono">{item.competitorsWithFeature}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">You Have:</span>
                    <span className={`font-mono font-bold ${item.youHaveCount > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {item.youHaveCount}
                    </span>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                    <div 
                        className="bg-indigo-500 h-1.5 rounded-full" 
                        style={{ width: `${item.gap > 0 ? Math.min((item.youHaveCount / (item.competitorsWithFeature || 1)) * 100, 100) : 0}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-gray-500 text-right mt-1">{item.gap} gap to close</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RichResultDashboard;