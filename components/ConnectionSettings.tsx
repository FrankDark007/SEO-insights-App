import React, { useState, useEffect } from 'react';
import { initiateOAuth, disconnectService, getAuthState, refreshConnection } from '../services/googleAuthService';
import { GoogleAuthState } from '../types';
import { CheckCircle2, AlertCircle, RefreshCw, LogOut, Link } from 'lucide-react';

const ConnectionSettings: React.FC = () => {
  const [authState, setAuthState] = useState<GoogleAuthState>({ analytics: false, searchConsole: false });
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setAuthState(getAuthState());
  }, []);

  const handleConnect = async (service: 'analytics' | 'searchConsole') => {
    setLoading(service);
    await initiateOAuth(service);
    setAuthState(getAuthState());
    setLoading(null);
  };

  const handleDisconnect = async (service: 'analytics' | 'searchConsole') => {
    if (confirm(`Disconnect Google ${service === 'analytics' ? 'Analytics' : 'Search Console'}?`)) {
        setLoading(service);
        await disconnectService(service);
        setAuthState(getAuthState());
        setLoading(null);
    }
  };

  const handleRefresh = async (service: 'analytics' | 'searchConsole') => {
      setLoading(service);
      await refreshConnection(service);
      setAuthState(getAuthState());
      setLoading(null);
  }

  const ServiceCard = ({ 
      id, 
      name, 
      connected, 
      icon 
  }: { 
      id: 'analytics' | 'searchConsole', 
      name: string, 
      connected: boolean, 
      icon: React.ReactNode 
  }) => (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg text-gray-300">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-white text-lg">{name}</h3>
                {connected ? (
                    <p className="text-emerald-400 text-xs flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" /> Connected
                    </p>
                ) : (
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> Not Connected
                    </p>
                )}
            </div>
        </div>
        {connected && (
            <div className="text-right">
                <p className="text-xs text-gray-500">Account</p>
                <p className="text-sm text-white">{authState.accountEmail}</p>
            </div>
        )}
      </div>

      {connected ? (
          <div className="space-y-4">
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-xs text-gray-400">
                  Last Synced: {authState.lastSync ? new Date(authState.lastSync).toLocaleString() : 'Just now'}
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={() => handleRefresh(id)}
                    disabled={loading === id}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm border border-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                      {loading === id ? <RefreshCw className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>}
                      Sync Now
                  </button>
                  <button 
                    onClick={() => handleDisconnect(id)}
                    disabled={loading === id}
                    className="flex-1 bg-rose-900/20 hover:bg-rose-900/40 text-rose-400 py-2 rounded-lg text-sm border border-rose-900/50 transition-colors flex items-center justify-center gap-2"
                  >
                      <LogOut className="w-4 h-4"/> Disconnect
                  </button>
              </div>
          </div>
      ) : (
          <div className="mt-4">
              <p className="text-sm text-gray-400 mb-4">Connect to audit your properties, find issues, and see real traffic data.</p>
              <button 
                onClick={() => handleConnect(id)}
                disabled={loading === id}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                  {loading === id ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Link className="w-4 h-4"/>}
                  Connect Account
              </button>
          </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <ServiceCard 
            id="analytics" 
            name="Google Analytics 4" 
            connected={authState.analytics} 
            icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>} 
        />
        <ServiceCard 
            id="searchConsole" 
            name="Google Search Console" 
            connected={authState.searchConsole} 
            icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h2v2H6zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/></svg>} 
        />
    </div>
  );
};

export default ConnectionSettings;