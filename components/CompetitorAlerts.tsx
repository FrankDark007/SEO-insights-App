
import React, { useState, useEffect } from 'react';
import { getStoredAlertData, runFullCheck, markAlertAddressed, addCompetitor, removeCompetitor, saveAlertData } from '../services/competitorAlertService';
import { StoredAlertData, Alert } from '../types';
import AlertFeed from './AlertFeed';
import AddCompetitorModal from './AddCompetitorModal';
import { 
  Bell, 
  Settings, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Activity, 
  ShieldAlert,
  Clock,
  Filter
} from 'lucide-react';

const CompetitorAlerts: React.FC = () => {
  const [data, setData] = useState<StoredAlertData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'unaddressed'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setData(getStoredAlertData());
  };

  const handleRunCheck = async () => {
    setIsLoading(true);
    try {
      await runFullCheck();
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCompetitor = (domain: string) => {
    addCompetitor(domain);
    loadData();
  };

  const handleRemoveCompetitor = (domain: string) => {
    if (confirm(`Stop monitoring ${domain}?`)) {
      removeCompetitor(domain);
      loadData();
    }
  };

  const handleMarkAddressed = (id: string) => {
    markAlertAddressed(id);
    loadData();
  };

  const togglePreference = (key: keyof StoredAlertData['preferences']) => {
      if (!data) return;
      const newData = {
          ...data,
          preferences: {
              ...data.preferences,
              [key]: !data.preferences[key]
          }
      };
      saveAlertData(newData);
      setData(newData);
  };

  if (!data) return null;

  const filteredAlerts = data.alerts.filter(a => {
      if (activeFilter === 'high') return a.severity === 'high';
      if (activeFilter === 'unaddressed') return !a.addressed;
      return true;
  });

  const unaddressedCount = data.alerts.filter(a => !a.addressed).length;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Competitor Watchtower
            {unaddressedCount > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    {unaddressedCount} New
                </span>
            )}
          </h2>
          <p className="text-gray-400">24/7 monitoring of competitor changes and market moves.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={handleRunCheck} 
                disabled={isLoading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
            >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Activity className="w-4 h-4"/>}
                {isLoading ? 'Scanning...' : 'Scan Now'}
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg border border-gray-700 transition-all"
            >
                <Plus className="w-4 h-4"/> Add Competitor
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Settings & Competitors */}
          <div className="lg:col-span-1 space-y-6">
              
              {/* Monitored List */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <ShieldAlert className="w-4 h-4 text-emerald-400" /> Monitored Targets
                  </h3>
                  <div className="space-y-2">
                      {data.competitors.length === 0 && (
                          <p className="text-sm text-gray-500 italic">No competitors added.</p>
                      )}
                      {data.competitors.map((comp, i) => (
                          <div key={i} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-800 group">
                              <div>
                                  <p className="text-sm font-medium text-white truncate max-w-[150px]">{comp.domain}</p>
                                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                  </p>
                              </div>
                              <button 
                                onClick={() => handleRemoveCompetitor(comp.domain)}
                                className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Configuration */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <Settings className="w-4 h-4 text-gray-400" /> Alert Config
                  </h3>
                  <div className="space-y-3">
                      {(Object.keys(data.preferences) as Array<keyof StoredAlertData['preferences']>).map((key) => (
                          <label key={key} className="flex items-center justify-between cursor-pointer group">
                              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                  {key.replace('monitor', '').replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <div className={`w-8 h-4 rounded-full relative transition-colors ${data.preferences[key] ? 'bg-indigo-600' : 'bg-gray-700'}`} onClick={() => togglePreference(key)}>
                                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${data.preferences[key] ? 'left-4.5' : 'left-0.5'}`}></div>
                              </div>
                          </label>
                      ))}
                  </div>
              </div>

              {/* Last Checked */}
              <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Clock className="w-3 h-3" />
                  Last Scan: {new Date(data.lastFullCheck).toLocaleString()}
              </div>
          </div>

          {/* Right Column: Alert Feed */}
          <div className="lg:col-span-3 space-y-4">
              {/* Filter Tabs */}
              <div className="flex gap-2 pb-2">
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${activeFilter === 'all' ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                      All Alerts
                  </button>
                  <button 
                    onClick={() => setActiveFilter('unaddressed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${activeFilter === 'unaddressed' ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                      Unaddressed
                  </button>
                  <button 
                    onClick={() => setActiveFilter('high')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${activeFilter === 'high' ? 'bg-rose-900/30 text-rose-400 border-rose-800' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                      High Priority
                  </button>
              </div>

              <AlertFeed alerts={filteredAlerts} onMarkAddressed={handleMarkAddressed} />
          </div>
      </div>

      <AddCompetitorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddCompetitor}
      />
    </div>
  );
};

export default CompetitorAlerts;
