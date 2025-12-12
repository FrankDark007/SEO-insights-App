import React, { useState } from 'react';
import { analyzeSeo } from './services/geminiService';
import AnalysisView from './components/AnalysisView';
import ServiceAreaBuilder from './components/ServiceAreaBuilder';
import ContentBriefGenerator from './components/ContentBriefGenerator';
import SchemaGenerator from './components/SchemaGenerator';
import RankTracker from './components/RankTracker';
import GBPAudit from './components/GBPAudit';
import ReviewAnalyzer from './components/ReviewAnalyzer';
import BacklinkGapFinder from './components/BacklinkGapFinder';
import ContentGapMatrix from './components/ContentGapMatrix';
import CompetitorAlerts from './components/CompetitorAlerts';
import InternalLinkOptimizer from './components/InternalLinkOptimizer';
import LocalKeywordIntel from './components/LocalKeywordIntel';
import WeatherTriggers from './components/WeatherTriggers';
import GoogleAdsSpy from './components/GoogleAdsSpy';
import SerpFeatureTracker from './components/SerpFeatureTracker';
import ContentWriter from './components/ContentWriter';
import CitationManager from './components/CitationManager';
import LeadSourceTracker from './components/LeadSourceTracker';
import RichResultAnalyzer from './components/RichResultAnalyzer';
import GoogleIntegration from './components/GoogleIntegration';
import AhrefsIntegration from './components/AhrefsIntegration';
import { normalizeUrl } from './services/utils';
import { AnalysisState, SeoFormData } from './types';
import { 
  Search, 
  Globe, 
  ArrowRight, 
  Loader2, 
  BarChart2, 
  Zap, 
  MapPin, 
  Layers, 
  FileText, 
  Code,
  TrendingUp,
  Store,
  MessageSquare,
  Link2,
  LayoutGrid,
  Bell,
  Network,
  Compass,
  CloudLightning,
  ScanSearch,
  LayoutDashboard,
  PenTool,
  Building2,
  Users,
  Sparkles,
  Database,
  BarChart3
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'builder' | 'brief' | 'schema' | 'ranks' | 'gbp' | 'reviews' | 'backlinks' | 'matrix' | 'alerts' | 'internal' | 'local' | 'weather' | 'ads' | 'serp' | 'writer' | 'citations' | 'leads' | 'rich-results' | 'integration' | 'ahrefs'>('analysis');
  const [formData, setFormData] = useState<SeoFormData>({
    url: '',
    keywords: '',
    businessType: '',
    location: ''
  });
  
  // Shared state to prepopulate content brief from rank tracker
  const [briefKeyword, setBriefKeyword] = useState<string>('');

  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    data: null,
    groundingMetadata: null,
    error: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url || !formData.keywords) return;

    setAnalysisState(prev => ({ ...prev, isLoading: true, error: null, data: null }));

    const normalizedUrl = normalizeUrl(formData.url);

    const result = await analyzeSeo(
      normalizedUrl, 
      formData.keywords, 
      formData.businessType,
      formData.location
    );
    
    setAnalysisState(prev => ({
      ...prev,
      ...result,
      isLoading: false
    }));
  };

  const handleOpenBrief = (keyword: string) => {
      setBriefKeyword(keyword);
      setActiveTab('brief');
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">SEO Insight<span className="text-indigo-500">Pro</span></span>
            <span className="font-bold text-xl tracking-tight text-white sm:hidden">SIP</span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-gray-900/50 p-1 rounded-xl border border-gray-800 overflow-x-auto max-w-[70vw]">
             <button
                onClick={() => setActiveTab('analysis')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'analysis' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Search className="w-4 h-4" />
                Audit
             </button>
             <button
                onClick={() => setActiveTab('integration')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'integration' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Database className="w-4 h-4" />
                Google
             </button>
             <button
                onClick={() => setActiveTab('ahrefs')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'ahrefs' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <BarChart3 className="w-4 h-4" />
                Ahrefs
             </button>
             <button
                onClick={() => setActiveTab('leads')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'leads' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Users className="w-4 h-4" />
                Leads
             </button>
             <button
                onClick={() => setActiveTab('writer')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'writer' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <PenTool className="w-4 h-4" />
                Writer
             </button>
             <button
                onClick={() => setActiveTab('citations')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'citations' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Building2 className="w-4 h-4" />
                Citations
             </button>
             <button
                onClick={() => setActiveTab('rich-results')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'rich-results' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Sparkles className="w-4 h-4" />
                Rich Results
             </button>
             <button
                onClick={() => setActiveTab('serp')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'serp' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <LayoutDashboard className="w-4 h-4" />
                SERP
             </button>
             <button
                onClick={() => setActiveTab('ads')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'ads' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <ScanSearch className="w-4 h-4" />
                Ads Spy
             </button>
             <button
                onClick={() => setActiveTab('weather')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'weather' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <CloudLightning className="w-4 h-4" />
                Weather
             </button>
             <button
                onClick={() => setActiveTab('local')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'local' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Compass className="w-4 h-4" />
                Local
             </button>
             <button
                onClick={() => setActiveTab('internal')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'internal' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Network className="w-4 h-4" />
                Links
             </button>
             <button
                onClick={() => setActiveTab('alerts')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'alerts' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Bell className="w-4 h-4" />
                Alerts
             </button>
             <button
                onClick={() => setActiveTab('gbp')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'gbp' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Store className="w-4 h-4" />
                GBP
             </button>
             <button
                onClick={() => setActiveTab('matrix')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'matrix' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <LayoutGrid className="w-4 h-4" />
                Matrix
             </button>
             <button
                onClick={() => setActiveTab('backlinks')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'backlinks' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Link2 className="w-4 h-4" />
                Links
             </button>
             <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'reviews' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <MessageSquare className="w-4 h-4" />
                Reviews
             </button>
             <button
                onClick={() => setActiveTab('builder')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'builder' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Layers className="w-4 h-4" />
                Locations
             </button>
             <button
                onClick={() => setActiveTab('ranks')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'ranks' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <TrendingUp className="w-4 h-4" />
                Tracker
             </button>
             <button
                onClick={() => setActiveTab('brief')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'brief' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <FileText className="w-4 h-4" />
                Briefs
             </button>
             <button
                onClick={() => setActiveTab('schema')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'schema' 
                    ? 'bg-gray-800 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
             >
                <Code className="w-4 h-4" />
                Schema
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {activeTab === 'analysis' && (
          <>
            {/* Hero Section */}
            {!analysisState.data && !analysisState.isLoading && (
                <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in print:hidden">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
                    Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">SEO Intelligence</span>
                </h1>
                <p className="text-base text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                    Analyze competitors, uncover keyword gaps, and get actionable optimization strategies powered by Gemini AI and live Google Search data.
                </p>
                </div>
            )}

            {/* Input Form - Hidden when printing */}
            <div className={`transition-all duration-500 ease-in-out ${analysisState.data ? 'mb-8' : 'mb-16'} print:hidden`}>
              <div className="bg-[#161b22] border border-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* URL Input */}
                    <div className="space-y-2">
                        <label htmlFor="url" className="text-sm font-medium text-gray-300 ml-1">Website URL</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Globe className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="url"
                                id="url"
                                required
                                placeholder="example.com"
                                value={formData.url}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Business Type Input */}
                     <div className="space-y-2">
                        <label htmlFor="businessType" className="text-sm font-medium text-gray-300 ml-1">Industry / Niche</label>
                        <div className="relative group">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Zap className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="businessType"
                                id="businessType"
                                placeholder="e.g. Local Bakery, SaaS, E-commerce"
                                value={formData.businessType}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Keywords Input */}
                    <div className="space-y-2">
                        <label htmlFor="keywords" className="text-sm font-medium text-gray-300 ml-1">Target Keywords</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="keywords"
                                id="keywords"
                                required
                                placeholder="e.g. water damage restoration"
                                value={formData.keywords}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Location Input */}
                    <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium text-gray-300 ml-1">Target Location</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                placeholder="e.g. Northern Virginia, Maryland"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={analysisState.isLoading}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-900/20 w-full md:w-auto"
                    >
                        {analysisState.isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Scanning Live Data...
                            </>
                        ) : (
                            <>
                                Generate Strategy
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Section */}
            {analysisState.isLoading && (
                 <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
                    <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="h-32 bg-gray-800 rounded-xl"></div>
                        <div className="h-32 bg-gray-800 rounded-xl"></div>
                        <div className="h-32 bg-gray-800 rounded-xl"></div>
                    </div>
                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-800 rounded w-4/6"></div>
                 </div>
            )}

            <div className="max-w-4xl mx-auto">
                <AnalysisView 
                  state={analysisState} 
                  analyzedUrl={formData.url} 
                  keywords={formData.keywords}
                />
            </div>
          </>
        )}
        
        {activeTab === 'builder' && <ServiceAreaBuilder />}
        
        {activeTab === 'brief' && (
            <ContentBriefGenerator /> 
        )}
        
        {activeTab === 'schema' && <SchemaGenerator />}

        {activeTab === 'ranks' && <RankTracker onOpenBrief={handleOpenBrief} />}

        {activeTab === 'gbp' && <GBPAudit />}

        {activeTab === 'reviews' && <ReviewAnalyzer />}

        {activeTab === 'backlinks' && <BacklinkGapFinder />}

        {activeTab === 'matrix' && <ContentGapMatrix />}

        {activeTab === 'alerts' && <CompetitorAlerts />}

        {activeTab === 'internal' && <InternalLinkOptimizer />}

        {activeTab === 'local' && <LocalKeywordIntel />}

        {activeTab === 'weather' && <WeatherTriggers />}

        {activeTab === 'ads' && <GoogleAdsSpy />}

        {activeTab === 'serp' && <SerpFeatureTracker />}

        {activeTab === 'writer' && <ContentWriter />}

        {activeTab === 'citations' && <CitationManager />}

        {activeTab === 'leads' && <LeadSourceTracker />}

        {activeTab === 'rich-results' && <RichResultAnalyzer />}

        {activeTab === 'integration' && <GoogleIntegration />}

        {activeTab === 'ahrefs' && <AhrefsIntegration />}
      </main>

       <footer className="border-t border-gray-800 mt-12 py-8 bg-[#0f1117] print:hidden">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} SEO Insight Pro. Powered by Gemini & Google Search.</p>
            </div>
       </footer>
    </div>
  );
};

export default App;
