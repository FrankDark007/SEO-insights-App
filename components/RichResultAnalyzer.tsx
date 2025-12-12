import React, { useState, useEffect } from 'react';
import { analyzeSerps, getHistory, getAlerts, markAlertRead, initializeMockHistory } from '../services/richResultService';
import { normalizeUrl } from '../services/utils';
import { SerpAnalysisResult, RichResultHistoryEntry, RichResultAlert } from '../types';
import RichResultDashboard from './RichResultDashboard';
import CompetitorResultsTable from './CompetitorResultsTable';
import QuickWinsPanel from './QuickWinsPanel';
import PageEligibilityTable from './PageEligibilityTable';
import BulkSchemaGenerator from './BulkSchemaGenerator';
import HistoryDashboard from './HistoryDashboard';
import AlertCenter from './AlertCenter';
import { 
  Search, 
  Loader2, 
  Sparkles, 
  Layout, 
  List, 
  History, 
  Code,
  AlertCircle
} from 'lucide-react';

const RichResultAnalyzer: React.FC = () => {
  const [keywords, setKeywords] = useState('water damage restoration\nmold remediation\nflood cleanup');
  const [cities, setCities] = useState('Arlington, VA\nMcLean, VA');
  const [domain, setDomain] = useState('flood.doctor');
  const [pages, setPages] = useState('/water-damage-arlington\n/mold-remediation');
  
  const [result, setResult] = useState<SerpAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'competitors' | 'my-pages' | 'generate' | 'history'>('dashboard');
  
  const [history, setHistory] = useState<RichResultHistoryEntry[]>([]);
  const [alerts, setAlerts] = useState<RichResultAlert[]>([]);

  useEffect(() => {
    initializeMockHistory();
    setHistory(getHistory());
    setAlerts(getAlerts());
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const keywordList = keywords.split('\n').filter(k => k.trim());
      const cityList = cities.split('\n').filter(c => c.trim());
      const pageList = pages.split('\n').filter(p => p.trim());
      const normalizedDomain = normalizeUrl(domain);
      
      const data = await analyzeSerps(keywordList, cityList, normalizedDomain, pageList);
      setResult(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to analyze SERPs. Please check your API key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissAlert = (id: string) => {
      markAlertRead(id);
      setAlerts(getAlerts()); // Refresh
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Schema & Rich Results
            <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30 font-normal">
                SERP Dominance
            </span>
          </h2>
          <p className="text-gray-400">Reverse-engineer competitor schema and capture rich results.</p>
        </div>
      </div>

      <AlertCenter alerts={alerts} onDismiss={handleDismissAlert} />

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Keywords</label>
                  <textarea value={keywords} onChange={e => setKeywords(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-24" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Cities</label>
                  <textarea value={cities} onChange={e => setCities(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-24" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Your Pages</label>
                  <textarea value={pages} onChange={e => setPages(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-24" />
              </div>
              <div className="flex flex-col justify-end">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Domain</label>
                  <input type="text" value={domain} onChange={e => setDomain(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all mb-4" />
                  <button 
                    onClick={handleAnalyze} 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 h-[42px]"
                  >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                      Analyze SERPs
                  </button>
              </div>
          </div>
      </div>

      {result && (
          <div>
              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
                  {[
                      { id: 'dashboard', label: 'Overview', icon: Layout },
                      { id: 'competitors', label: 'Competitors', icon: Search },
                      { id: 'my-pages', label: 'My Pages', icon: List },
                      { id: 'generate', label: 'Generator', icon: Code },
                      { id: 'history', label: 'History', icon: History },
                  ].map((tab) => (
                      <button 
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                      >
                          <tab.icon className="w-4 h-4" /> {tab.label}
                      </button>
                  ))}
              </div>

              {/* Tab Content */}
              <div className="animate-fade-in min-h-[400px]">
                  {activeTab === 'dashboard' && (
                      <div className="space-y-8">
                          <RichResultDashboard overview={result.overview} />
                          <QuickWinsPanel wins={result.quickWins} />
                      </div>
                  )}

                  {activeTab === 'competitors' && (
                      <CompetitorResultsTable results={result.competitorResults} />
                  )}

                  {activeTab === 'my-pages' && (
                      <PageEligibilityTable pages={result.yourPagesEligibility} />
                  )}

                  {activeTab === 'generate' && (
                      <BulkSchemaGenerator />
                  )}

                  {activeTab === 'history' && (
                      <HistoryDashboard history={history} />
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default RichResultAnalyzer;