
import React from 'react';
import { SerpOverviewItem } from '../types';
import { Layout, HelpCircle, MapPin, Image, Video, FileText } from 'lucide-react';

interface FeatureOverviewCardsProps {
  overview: SerpOverviewItem[];
}

const FeatureOverviewCards: React.FC<FeatureOverviewCardsProps> = ({ overview }) => {
  const getIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'featured snippet': return <FileText className="w-5 h-5 text-amber-400" />;
      case 'people also ask': return <HelpCircle className="w-5 h-5 text-indigo-400" />;
      case 'local pack': return <MapPin className="w-5 h-5 text-emerald-400" />;
      case 'image pack': return <Image className="w-5 h-5 text-rose-400" />;
      case 'video carousel': return <Video className="w-5 h-5 text-red-500" />;
      default: return <Layout className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {overview.map((item, index) => (
        <div key={index} className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start mb-2">
                <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-800">
                    {getIcon(item.feature)}
                </div>
                <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded-full border border-gray-800">
                    {Math.round((item.keywordsWithFeature / item.totalKeywords) * 100)}% Coverage
                </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{item.feature}</h3>
            <p className="text-xs text-gray-400 mb-3">{item.keywordsWithFeature} of {item.totalKeywords} keywords</p>
          </div>
          
          <div className="pt-3 border-t border-gray-800">
              <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">You Own:</span>
                  <span className={`font-bold ${item.youOwn > 0 ? 'text-emerald-400' : 'text-gray-400'}`}>{item.youOwn}</span>
              </div>
              <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500">Competitors:</span>
                  <span className="text-white font-bold">{item.competitorsOwn}</span>
              </div>
              <p className="text-[10px] text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded border border-indigo-900/30 truncate" title={item.opportunity}>
                  ⚡ {item.opportunity}
              </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureOverviewCards;
