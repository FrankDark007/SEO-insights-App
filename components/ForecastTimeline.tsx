import React from 'react';
import { CityForecast } from '../types';
import { Cloud, CloudRain, Sun, Snowflake, CloudLightning, Wind, Droplets } from 'lucide-react';

interface ForecastTimelineProps {
  forecast: CityForecast[];
}

const ForecastTimeline: React.FC<ForecastTimelineProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  // Use the first city's forecast dates for the header
  const dates = forecast[0].daily.map(d => {
      const date = new Date(d.date);
      return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
          fullDate: d.date
      };
  });

  const getWeatherIcon = (condition: string) => {
      const c = condition.toLowerCase();
      if (c.includes('snow') || c.includes('ice') || c.includes('freeze')) return <Snowflake className="w-4 h-4 text-cyan-200" />;
      if (c.includes('rain') || c.includes('shower')) return <CloudRain className="w-4 h-4 text-blue-400" />;
      if (c.includes('storm') || c.includes('thunder')) return <CloudLightning className="w-4 h-4 text-amber-400" />;
      if (c.includes('cloud')) return <Cloud className="w-4 h-4 text-gray-400" />;
      if (c.includes('wind')) return <Wind className="w-4 h-4 text-gray-300" />;
      return <Sun className="w-4 h-4 text-yellow-400" />;
  };

  const getRiskColor = (level: string) => {
      switch (level) {
          case 'critical': return 'bg-rose-500 text-white';
          case 'high': return 'bg-orange-500 text-white';
          case 'medium': return 'bg-yellow-500 text-black';
          default: return 'bg-emerald-500/20 text-emerald-400';
      }
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Droplets className="w-5 h-5 text-blue-400" /> 7-Day Risk Forecast
      </h3>
      
      <div className="min-w-[800px]">
          <div className="grid grid-cols-[150px_repeat(7,1fr)] gap-2 mb-2">
              <div className="text-xs text-gray-500 font-bold uppercase self-end pb-2">City</div>
              {dates.map((d, i) => (
                  <div key={i} className="text-center pb-2 border-b border-gray-800">
                      <div className="text-sm font-bold text-white">{i === 0 ? 'Today' : d.day}</div>
                      <div className="text-[10px] text-gray-500">{d.date}</div>
                  </div>
              ))}
          </div>

          <div className="space-y-2">
              {forecast.map((cityData, i) => (
                  <div key={i} className="grid grid-cols-[150px_repeat(7,1fr)] gap-2 items-center hover:bg-gray-800/30 p-2 rounded-lg transition-colors">
                      <div className="font-medium text-white truncate pr-2">{cityData.city}</div>
                      {cityData.daily.map((day, j) => (
                          <div key={j} className="flex flex-col items-center justify-center p-2 rounded bg-gray-900/50 border border-gray-800 relative group">
                              <div className="mb-1">{getWeatherIcon(day.conditions)}</div>
                              <div className="text-xs font-bold text-gray-300">{day.high}°</div>
                              
                              {/* Risk Indicator */}
                              {day.riskLevel !== 'low' && (
                                  <div className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase w-full text-center truncate ${getRiskColor(day.riskLevel)}`}>
                                      {day.riskType || 'Risk'}
                                  </div>
                              )}

                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 bg-gray-900 text-xs text-gray-300 p-2 rounded border border-gray-700 shadow-xl z-10 pointer-events-none">
                                  <p className="font-bold text-white mb-1">{day.conditions}</p>
                                  <p>High: {day.high}° Low: {day.low}°</p>
                                  {day.precipChance > 0 && <p>Precip: {day.precipChance}%</p>}
                                  {day.riskLevel !== 'low' && <p className="text-rose-400 mt-1 font-bold">⚠️ {day.riskType}</p>}
                              </div>
                          </div>
                      ))}
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default ForecastTimeline;