import React from 'react';
import { CityContentStrategy } from '../types';
import { MapPin, Target, PenTool, Home, DollarSign, Zap, CheckCircle2 } from 'lucide-react';

interface CityStrategyCardProps {
  strategy: CityContentStrategy;
}

const CityStrategyCard: React.FC<CityStrategyCardProps> = ({ strategy }) => {
  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg hover:border-indigo-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-4">
        <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
            <MapPin className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-white">{strategy.city}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{strategy.positioningAngle}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Home className="w-3 h-3"/> Property Focus</p>
                <p className="text-sm text-white font-medium">{strategy.propertyFocus}</p>
            </div>
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><DollarSign className="w-3 h-3"/> Pricing Angle</p>
                <p className="text-sm text-white font-medium">{strategy.pricingLanguage}</p>
            </div>
        </div>

        <div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><PenTool className="w-3 h-3"/> Recommended Modifiers</p>
            <div className="flex flex-wrap gap-2">
                {strategy.modifiersToUse.map((mod, i) => (
                    <span key={i} className="text-xs bg-indigo-900/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded">
                        {mod}
                    </span>
                ))}
            </div>
        </div>

        <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">Page Title Idea</p>
            <p className="text-sm text-emerald-400 font-medium truncate" title={strategy.recommendedPageTitle}>
                {strategy.recommendedPageTitle}
            </p>
        </div>

        <div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><Zap className="w-3 h-3"/> Unique Selling Points</p>
            <ul className="space-y-1">
                {strategy.uniqueSellingPoints.map((usp, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                        {usp}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default CityStrategyCard;