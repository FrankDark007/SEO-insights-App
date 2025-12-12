import React, { useState } from 'react';
import ConnectionSettings from './ConnectionSettings';
import AnalyticsAudit from './AnalyticsAudit';
import SearchConsoleAudit from './SearchConsoleAudit';
import CleanupChecklist from './CleanupChecklist';
import DataDashboard from './DataDashboard';
import { getAuthState } from '../services/googleAuthService';
import { 
  Settings, 
  Search, 
  BarChart2, 
  CheckSquare, 
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

const GoogleIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connect' | 'audit-ga' | 'audit-gsc' | 'checklist' | 'dashboard'>('connect');
  const authState = getAuthState();
  const isConnected = authState.analytics || authState.searchConsole;

  // Tabs configuration
  const tabs = [
    { id: 'connect', label: 'Connections', icon: Settings, enabled: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: isConnected },
    { id: 'audit-ga', label: 'GA Audit', icon: BarChart2, enabled: authState.analytics },
    { id: 'audit-gsc', label: 'GSC Audit', icon: Search, enabled: authState.searchConsole },
    { id: 'checklist', label: 'Cleanup', icon: CheckSquare, enabled: isConnected },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Google Integration
            <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30 font-normal flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Audit & Verify
            </span>
          </h2>
          <p className="text-gray-400">Connect Analytics and Search Console to validate data accuracy and see real performance.</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
          {tabs.map((tab) => (
              <button 
                  key={tab.id}
                  onClick={() => tab.enabled && setActiveTab(tab.id as any)}
                  disabled={!tab.enabled}
                  className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                      activeTab === tab.id 
                      ? 'border-indigo-500 text-white' 
                      : tab.enabled 
                        ? 'border-transparent text-gray-400 hover:text-white' 
                        : 'border-transparent text-gray-600 cursor-not-allowed'
                  }`}
              >
                  <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
          ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
          {activeTab === 'connect' && <ConnectionSettings />}
          {activeTab === 'dashboard' && <DataDashboard />}
          {activeTab === 'audit-ga' && <AnalyticsAudit />}
          {activeTab === 'audit-gsc' && <SearchConsoleAudit />}
          {activeTab === 'checklist' && <CleanupChecklist />}
      </div>
    </div>
  );
};

export default GoogleIntegration;