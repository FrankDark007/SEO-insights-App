import React from 'react';
import { ProfileMetric } from '../types';

interface GBPScoreCardProps {
  metrics: ProfileMetric[];
}

const GBPScoreCard: React.FC<GBPScoreCardProps> = ({ metrics }) => {
  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <span className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg text-sm">📊</span>
        Profile Completeness Scorecard
      </h3>
      
      <div className="space-y-6">
        {metrics.map((m, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-gray-300">{m.metric}</span>
              <div className="text-xs text-gray-500">
                Avg: <span className="text-gray-400">{m.competitorAvg}</span> | Leader: <span className="text-gray-400">{m.leader}</span>
              </div>
            </div>
            
            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
              {/* Competitor Average Marker (Background Bar) */}
              <div 
                className="absolute top-0 left-0 h-full bg-gray-700/50"
                style={{ width: `${Math.min((m.competitorAvg / m.max) * 100, 100)}%` }}
              ></div>
              
              {/* You (Foreground Bar) */}
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                    m.you >= m.competitorAvg ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min((m.you / m.max) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs mt-1">
              <span className={m.you >= m.competitorAvg ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                You: {m.you} {m.unit}
              </span>
              <span className="text-gray-600">Max: {m.max}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GBPScoreCard;