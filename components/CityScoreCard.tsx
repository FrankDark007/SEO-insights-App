import React from "react";
import { CityPerformance } from "../types";

interface CityScoreCardProps {
  city: CityPerformance;
  onClick: () => void;
  isSelected: boolean;
}

const CityScoreCard: React.FC<CityScoreCardProps> = ({
  city,
  onClick,
  isSelected,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-400";
    return "text-rose-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-emerald-600/20 to-emerald-600/5";
    if (score >= 60) return "from-amber-600/20 to-amber-600/5";
    if (score >= 40) return "from-orange-600/20 to-orange-600/5";
    return "from-rose-600/20 to-rose-600/5";
  };

  const captureRate = city.totalVolume > 0 
    ? Math.round((city.capturedVolume / city.totalVolume) * 100) 
    : 0;

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${getScoreBg(city.score)} rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] border-2 ${
        isSelected ? "border-violet-500" : "border-transparent"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-white font-semibold">{city.city}</h4>
          <p className="text-gray-400 text-xs truncate max-w-[150px]">
            {city.subdomain}
          </p>
        </div>
        <div
          className={`text-2xl font-bold ${getScoreColor(city.score)}`}
        >
          {city.score}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-gray-500">Keywords</p>
          <p className="text-white font-medium">{city.totalKeywords}</p>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-gray-500">Ranking</p>
          <p className="text-emerald-400 font-medium">
            {city.ranking}/{city.totalKeywords}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-gray-500">Volume</p>
          <p className="text-white font-medium">
            {city.totalVolume.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-gray-500">Captured</p>
          <p className="text-cyan-400 font-medium">{captureRate}%</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-gray-500 text-xs">Top Opportunity:</p>
        <p className="text-violet-400 text-sm truncate">{city.topOpportunity}</p>
      </div>
    </div>
  );
};

export default CityScoreCard;