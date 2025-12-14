import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
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
import KeywordOpportunityRadar from './components/KeywordOpportunityRadar';
import BrokenLinkFinder from './components/BrokenLinkFinder';
import CompetitorIntelligenceDashboard from './components/CompetitorIntelligenceDashboard';
import ContentStructureAnalyzer from './components/ContentStructureAnalyzer';
import AuthorityLinkDashboard from './components/AuthorityLinkDashboard';
import LinkAttributeAuditor from './components/LinkAttributeAuditor';
import SEOHealthMonitor from './components/SEOHealthMonitor';
import { normalizeUrl } from './services/utils';
import { AnalysisState, SeoFormData } from './types';
import { 
  Search, 
  ArrowRight, 
  Loader2, 
  Globe, 
  Zap, 
  MapPin 
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monitor');
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

  const renderContent = () => {
    switch (activeTab) {
      case 'analysis':
        return (
          <div className="space-y-6">
             {/* Hero Section - Only show when no data */}
             {!analysisState.data && !analysisState.isLoading && (
                <div className="text-center mb-10 max-w-3xl mx-auto animate-fade-in print:hidden">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
                    AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Site Audit</span>
                </h1>
                <p className="text-base text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                    Instant comprehensive analysis of your site, competitors, and market opportunities using Google's Gemini 2.5 Flash model with live Search Grounding.
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
          </div>
        );
      case 'monitor': return <SEOHealthMonitor />;
      case 'radar': return <KeywordOpportunityRadar />;
      case 'intel': return <LocalKeywordIntel />;
      case 'matrix': return <ContentGapMatrix />;
      case 'competitor': return <CompetitorIntelligenceDashboard />;
      case 'alerts': return <CompetitorAlerts />;
      case 'serp': return <SerpFeatureTracker />;
      case 'ads': return <GoogleAdsSpy />;
      case 'writer': return <ContentWriter />;
      case 'brief': return <ContentBriefGenerator />;
      case 'structure': return <ContentStructureAnalyzer />;
      case 'builder': return <ServiceAreaBuilder />;
      case 'schema': return <SchemaGenerator />;
      case 'rich-results': return <RichResultAnalyzer />;
      case 'broken-links': return <BrokenLinkFinder />;
      case 'internal': return <InternalLinkOptimizer />;
      case 'backlinks': return <BacklinkGapFinder />;
      case 'authority': return <AuthorityLinkDashboard />;
      case 'linkaudit': return <LinkAttributeAuditor />;
      case 'gbp': return <GBPAudit />;
      case 'reviews': return <ReviewAnalyzer />;
      case 'citations': return <CitationManager />;
      case 'weather': return <WeatherTriggers />;
      case 'ranks': return <RankTracker onOpenBrief={handleOpenBrief} />;
      case 'leads': return <LeadSourceTracker />;
      case 'integration': return <GoogleIntegration />;
      case 'ahrefs': return <AhrefsIntegration />;
      default: return <SEOHealthMonitor />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AppLayout>
  );
};

export default App;