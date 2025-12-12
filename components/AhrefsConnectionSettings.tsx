import React, { useState, useEffect } from 'react';
import { getAhrefsConfig, saveAhrefsConfig, testConnection } from '../services/ahrefsService';
import { normalizeUrl } from '../services/utils';
import { AhrefsConfig, AhrefsConnectionStatus } from '../types';
import { Save, Link, CheckCircle2, AlertCircle, Loader2, Unplug } from 'lucide-react';

const AhrefsConnectionSettings: React.FC = () => {
  const [config, setConfig] = useState<AhrefsConfig>({ apiToken: '', primaryDomain: '', competitors: [] });
  const [status, setStatus] = useState<AhrefsConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [competitorInput, setCompetitorInput] = useState('');

  useEffect(() => {
    const loaded = getAhrefsConfig();
    setConfig(loaded);
    if (loaded.apiToken) {
        checkConnection(loaded.apiToken);
    }
  }, []);

  const checkConnection = async (token: string) => {
      try {
          const res = await testConnection(token);
          setStatus(res);
          setError(null);
      } catch (e) {
          setStatus(null);
      }
  };

  const handleSave = async () => {
      setLoading(true);
      try {
          await testConnection(config.apiToken);
          
          const normalizedConfig = {
              ...config,
              primaryDomain: normalizeUrl(config.primaryDomain)
          };
          
          saveAhrefsConfig(normalizedConfig);
          setConfig(normalizedConfig); // Update local state with normalized
          
          await checkConnection(config.apiToken);
          setError(null);
      } catch (err: any) {
          setError(err.message || "Invalid API Token");
      } finally {
          setLoading(false);
      }
  };

  const addCompetitor = () => {
      if (competitorInput) {
          const normalized = normalizeUrl(competitorInput);
          if (!config.competitors.includes(normalized)) {
              setConfig(prev => ({ ...prev, competitors: [...prev.competitors, normalized] }));
              setCompetitorInput('');
          }
      }
  };

  const removeCompetitor = (comp: string) => {
      setConfig(prev => ({ ...prev, competitors: prev.competitors.filter(c => c !== comp) }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Connection Card */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Link className="w-5 h-5 text-indigo-400" /> API Connection
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">API Token</label>
                        <input 
                            type="password" 
                            value={config.apiToken}
                            onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your Ahrefs API Token"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Go to Ahrefs Account Settings → API to generate a token.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {status && (
                        <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                                <CheckCircle2 className="w-5 h-5" /> Connected
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                                <div>
                                    <span className="block text-gray-500">Plan</span>
                                    <span className="text-white">{status.plan}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">Credits Used</span>
                                    <span className="text-white">{status.creditsUsed.toLocaleString()} / {status.creditsLimit.toLocaleString()}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-gray-500">Last Verified</span>
                                    <span className="text-white">{new Date(status.lastVerified).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                            {status ? 'Update Connection' : 'Connect'}
                        </button>
                        {status && (
                            <button 
                                onClick={() => { setConfig({...config, apiToken: ''}); setStatus(null); }}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                            >
                                <Unplug className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Domain Config */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Project Settings</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Primary Domain</label>
                        <input 
                            type="text" 
                            value={config.primaryDomain}
                            onChange={(e) => setConfig({ ...config, primaryDomain: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Competitors</label>
                        <div className="flex gap-2 mb-2">
                            <input 
                                type="text" 
                                value={competitorInput}
                                onChange={(e) => setCompetitorInput(e.target.value)}
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                                placeholder="competitor.com"
                            />
                            <button 
                                onClick={addCompetitor}
                                className="bg-gray-800 hover:bg-gray-700 text-white px-4 rounded-lg border border-gray-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {config.competitors.map((comp, i) => (
                                <span key={i} className="bg-gray-800 text-gray-300 text-sm px-2 py-1 rounded border border-gray-700 flex items-center gap-2">
                                    {comp}
                                    <button onClick={() => removeCompetitor(comp)} className="text-gray-500 hover:text-red-400">×</button>
                                </span>
                            ))}
                            {config.competitors.length === 0 && <span className="text-gray-500 text-sm italic">No competitors added</span>}
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all border border-gray-700 mt-2"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AhrefsConnectionSettings;