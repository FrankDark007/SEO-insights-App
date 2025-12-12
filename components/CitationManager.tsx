import React, { useState } from 'react';
import { auditCitations } from '../services/citationService';
import { normalizeUrl } from '../services/utils';
import { BusinessNAP, CitationAuditResult } from '../types';
import CitationHealthScore from './CitationHealthScore';
import CitationTable from './CitationTable';
import IssueCard from './IssueCard';
import BuildQueueTable from './BuildQueueTable';
import { 
  Building2, 
  MapPin, 
  Loader2, 
  Search, 
  AlertOctagon, 
  CheckCircle, 
  Plus 
} from 'lucide-react';

const CitationManager: React.FC = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessNAP>({
    name: 'Flood Doctor',
    address: '123 Main St',
    city: 'Arlington',
    state: 'VA',
    zip: '22201',
    phone: '(703) 555-0123',
    website: 'https://flood.doctor'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CitationAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'issues' | 'build'>('audit');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessInfo({ ...businessInfo, [e.target.name]: e.target.value });
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const infoToSend = {
        ...businessInfo,
        website: normalizeUrl(businessInfo.website)
    };

    try {
      const data = await auditCitations(infoToSend);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Audit failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Citation Manager
            <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30 font-normal">
                NAP Consistency
            </span>
          </h2>
          <p className="text-gray-400">Audit, fix, and build business listings to boost local authority.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Business Info Input */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 shadow-lg">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" /> Business Profile
                  </h3>
                  <form onSubmit={handleAudit} className="space-y-3">
                      <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Business Name</label>
                          <input type="text" name="name" value={businessInfo.name} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Street Address</label>
                          <input type="text" name="address" value={businessInfo.address} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">City</label>
                              <input type="text" name="city" value={businessInfo.city} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">State</label>
                              <input type="text" name="state" value={businessInfo.state} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Zip</label>
                              <input type="text" name="zip" value={businessInfo.zip} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Phone</label>
                              <input type="text" name="phone" value={businessInfo.phone} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Website URL</label>
                          <input type="text" name="website" value={businessInfo.website} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                      </div>
                      
                      <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 mt-2"
                      >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          Run Audit
                      </button>
                  </form>
              </div>

              {result && (
                  <CitationHealthScore 
                      score={result.healthScore} 
                      accuracy={result.accuracy}
                      coverage={result.coverage}
                      consistency={result.consistency}
                  />
              )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-3">
              {error && (
                  <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 mb-4">
                      <AlertOctagon className="w-5 h-5" />
                      {error}
                  </div>
              )}

              {!result && !isLoading && !error && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20 min-h-[500px]">
                      <MapPin className="w-16 h-16 mb-4 opacity-20" />
                      <p>Enter business details to scan citation sources.</p>
                  </div>
              )}

              {result && (
                  <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
                              <span className="text-2xl font-bold text-white">{result.summary.verified}</span>
                              <span className="text-xs text-gray-400 uppercase">Verified</span>
                          </div>
                          <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center">
                              <AlertOctagon className="w-6 h-6 text-amber-500 mb-2" />
                              <span className="text-2xl font-bold text-white">{result.summary.hasIssues}</span>
                              <span className="text-xs text-gray-400 uppercase">Has Issues</span>
                          </div>
                          <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center">
                              <Plus className="w-6 h-6 text-blue-500 mb-2" />
                              <span className="text-2xl font-bold text-white">{result.summary.missing}</span>
                              <span className="text-xs text-gray-400 uppercase">Missing</span>
                          </div>
                      </div>

                      <div className="flex border-b border-gray-800">
                          <button 
                              onClick={() => setActiveTab('audit')}
                              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'audit' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                          >
                              Full Audit
                          </button>
                          <button 
                              onClick={() => setActiveTab('issues')}
                              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'issues' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                          >
                              Issues ({result.issues.length})
                          </button>
                          <button 
                              onClick={() => setActiveTab('build')}
                              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'build' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                          >
                              Build Queue
                          </button>
                      </div>

                      <div>
                          {activeTab === 'audit' && <CitationTable citations={result.citations} />}
                          
                          {activeTab === 'issues' && (
                              <div className="space-y-4">
                                  {result.issues.length === 0 ? (
                                      <div className="text-center py-12 text-gray-500">
                                          <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-30 text-emerald-500" />
                                          <p>No issues found! Your NAP is consistent.</p>
                                      </div>
                                  ) : (
                                      result.issues.map((issue, i) => (
                                          <IssueCard key={i} issue={issue} />
                                      ))
                                  )}
                              </div>
                          )}

                          {activeTab === 'build' && <BuildQueueTable queue={result.missingCitations} />}
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default CitationManager;