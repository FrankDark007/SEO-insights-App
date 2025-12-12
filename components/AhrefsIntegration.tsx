import React, { useState } from 'react';
import AhrefsConnectionSettings from './AhrefsConnectionSettings';
import DomainOverview from './DomainOverview';
import BacklinkAnalysis from './BacklinkAnalysis';
import KeywordRankings from './KeywordRankings';
import CompetitorComparison from './CompetitorComparison';
import { getAhrefsConfig } from '../services/ahrefsService';
import { 
  Settings, 
  LayoutDashboard, 
  Link2, 
  Search, 
  Users,
  Database
} from 'lucide-react';

const AhrefsIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'overview' | 'backlinks' | 'keywords' | 'competitors'>('settings');
  const config = getAhrefsConfig();
  const isConnected = !!config.apiToken && !!config.primaryDomain;

  const tabs = [
    { id: 'settings', label: 'Settings', icon: Settings, enabled: true },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, enabled: isConnected },
    { id: 'backlinks', label: 'Backlinks', icon: Link2, enabled: isConnected },
    { id: 'keywords', label: 'Rankings', icon: Search, enabled: isConnected },
    { id: 'competitors', label: 'Comparison', icon: Users, enabled: isConnected },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Ahrefs Integration
            <span className="text-sm bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full border border-orange-500/30 font-normal flex items-center gap-1">
                <Database className="w-3 h-3" /> Verified Data
            </span>
          </h2>
          <p className="text-gray-400">Connect to industry-leading SEO data for accurate insights.</p>
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
                      ? 'border-orange-500 text-white' 
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
          {activeTab === 'settings' && <AhrefsConnectionSettings />}
          {activeTab === 'overview' && <DomainOverview />}
          {activeTab === 'backlinks' && <BacklinkAnalysis />}
          {activeTab === 'keywords' && <KeywordRankings />}
          {activeTab === 'competitors' && <CompetitorComparison />}
      </div>
    </div>
  );
};

export default AhrefsIntegration;