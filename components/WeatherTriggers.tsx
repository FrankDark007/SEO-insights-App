import React, { useState } from 'react';
import { checkWeatherConditions } from '../services/weatherTriggerService';
import { WeatherCheckResult } from '../types';
import WeatherAlertCard from './WeatherAlertCard';
import ForecastTimeline from './ForecastTimeline';
import TriggerConfigModal from './TriggerConfigModal';
import { 
  CloudLightning, 
  Loader2, 
  AlertOctagon, 
  Settings, 
  MapPin,
  Thermometer,
  Wind,
  Droplets,
  CheckCircle2,
  Bell
} from 'lucide-react';

const WeatherTriggers: React.FC = () => {
  const [cities, setCities] = useState(() => {
      // Default cities or load from local storage if we had persistence for inputs
      return 'Arlington, VA\nAlexandria, VA\nMcLean, VA\nFairfax, VA\nWashington, DC';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WeatherCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleCheck = async () => {
    if (!cities) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    const cityList = cities.split('\n').map(c => c.trim()).filter(c => c.length > 0);

    try {
      const data = await checkWeatherConditions(cityList);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Weather check failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
      switch (level) {
          case 'critical': return <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">CRITICAL</span>;
          case 'high': return <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">HIGH</span>;
          case 'medium': return <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">MEDIUM</span>;
          default: return <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded">LOW</span>;
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Weather Event Triggers
            <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30 font-normal">
                Proactive Response
            </span>
          </h2>
          <p className="text-gray-400">Monitor conditions, predict water damage risks, and launch campaigns before competitors.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setIsConfigOpen(true)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg border border-gray-700 transition-all"
            >
                <Settings className="w-4 h-4"/> Configure Triggers
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Panel: Inputs & Status */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Monitored Cities</label>
                  <textarea 
                      value={cities}
                      onChange={(e) => setCities(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white h-40 resize-none focus:ring-2 focus:ring-indigo-500 mb-4 text-sm"
                      placeholder="City, State..."
                  />
                  <button
                    onClick={handleCheck}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudLightning className="w-5 h-5" />}
                    Scan Conditions
                  </button>
              </div>

              {result && (
                  <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 shadow-lg overflow-hidden">
                      <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 ml-1">Current Status</h4>
                      <div className="space-y-3">
                          {result.currentConditions.map((city, i) => (
                              <div key={i} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                  <div>
                                      <p className="font-bold text-white text-sm">{city.city}</p>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <span className="flex items-center gap-1"><Thermometer className="w-3 h-3"/> {city.temperature}°F</span>
                                          <span className="flex items-center gap-1"><Droplets className="w-3 h-3"/> {city.humidity}%</span>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-xs text-gray-300 mb-1">{city.conditions}</p>
                                      {getRiskBadge(city.riskLevel)}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-3 space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
                  <AlertOctagon className="w-5 h-5" />
                  {error}
                </div>
              )}

              {!result && !isLoading && !error && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20 min-h-[400px]">
                      <CloudLightning className="w-16 h-16 mb-4 opacity-20" />
                      <p>Run a scan to see weather risks and alerts.</p>
                  </div>
              )}

              {result && (
                  <>
                      {/* Active Alerts Section */}
                      {result.activeAlerts.length > 0 ? (
                          <div className="space-y-4">
                              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                  <Bell className="w-5 h-5 text-rose-500 animate-pulse" /> Active Trigger Alerts
                              </h3>
                              {result.activeAlerts.map((alert) => (
                                  <WeatherAlertCard key={alert.id} alert={alert} />
                              ))}
                          </div>
                      ) : (
                          <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-xl flex items-center gap-4">
                              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                              <div>
                                  <h3 className="text-lg font-bold text-white">No Active Risks Detected</h3>
                                  <p className="text-gray-400">Current conditions are safe. Monitoring for future events.</p>
                              </div>
                          </div>
                      )}

                      {/* Forecast Timeline */}
                      <ForecastTimeline forecast={result.forecast} />
                  </>
              )}
          </div>
      </div>

      <TriggerConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
      />
    </div>
  );
};

export default WeatherTriggers;