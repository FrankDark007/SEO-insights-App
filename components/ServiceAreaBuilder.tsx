import React, { useState } from 'react';
import { generateServiceAreaPlan } from '../services/serviceAreaService';
import { LocationPagePlan } from '../types';
import { 
  MapPin, 
  FileText, 
  Copy, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Check, 
  Globe,
  LayoutTemplate,
  Code
} from 'lucide-react';

const ServiceAreaBuilder: React.FC = () => {
  const [formData, setFormData] = useState({
    areas: '',
    serviceType: 'Water Damage Restoration',
    businessName: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LocationPagePlan[] | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedSchemaIndex, setCopiedSchemaIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.areas || !formData.businessName) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Split areas by new line and filter empty strings
      const areaList = formData.areas.split('\n').map(a => a.trim()).filter(a => a.length > 0);
      
      if (areaList.length === 0) {
        throw new Error("Please enter at least one location.");
      }

      const plans = await generateServiceAreaPlan(
        areaList,
        formData.serviceType,
        formData.businessName,
        formData.phone
      );
      setResults(plans);
    } catch (err: any) {
      setError(err.message || "Failed to generate service area plans.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const copySchema = (schema: object, index: number) => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopiedSchemaIndex(index);
    setTimeout(() => setCopiedSchemaIndex(null), 2000);
  };

  const exportData = () => {
    if (!results) return;
    const jsonString = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service-area-plans-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Service Area Page Builder</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Scale your local SEO effortlessly. Generate comprehensive content plans, optimized metadata, and LocalBusiness schema for every city you serve.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Locations</label>
                <textarea
                  name="areas"
                  value={formData.areas}
                  onChange={handleInputChange}
                  placeholder="Arlington, VA&#10;Alexandria, VA&#10;Bethesda, MD"
                  className="w-full h-40 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm leading-relaxed"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Enter one city/area per line.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Service Type</label>
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Plans...
                  </>
                ) : (
                  <>
                    <LayoutTemplate className="w-5 h-5" />
                    Generate Page Plans
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-2">
          {error && (
             <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-red-500" />
               {error}
             </div>
          )}

          {!results && !isLoading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
              <MapPin className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">No plans generated yet</p>
              <p className="text-sm">Fill out the form to build your location strategy.</p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-800 rounded-xl w-full" />
                ))}
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  {results.length} Pages Generated
                </h3>
                <button 
                  onClick={exportData}
                  className="flex items-center gap-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg border border-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
              </div>

              {results.map((plan, index) => (
                <div 
                  key={index} 
                  className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className={`w-full flex items-center justify-between p-5 text-left hover:bg-gray-800/50 transition-colors ${expandedIndex === index ? 'bg-gray-800/50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{plan.city}, {plan.state}</h4>
                        <p className="text-sm text-gray-500">{plan.urlSlug}</p>
                      </div>
                    </div>
                    {expandedIndex === index ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>

                  {expandedIndex === index && (
                    <div className="p-6 border-t border-gray-800 space-y-8 bg-gray-900/30">
                      
                      {/* Meta Data */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Page Title</label>
                          <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-sm text-indigo-300 font-medium">
                            {plan.titleTag}
                          </div>
                          <p className="text-xs text-gray-600 text-right">{plan.titleTag.length} chars</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs uppercase font-semibold text-gray-500 tracking-wider">H1 Heading</label>
                          <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-sm text-white font-bold">
                            {plan.h1}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Meta Description</label>
                          <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-sm text-gray-300">
                            {plan.metaDescription}
                          </div>
                          <p className="text-xs text-gray-600 text-right">{plan.metaDescription.length} chars</p>
                      </div>

                      {/* Content Structure */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <h5 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                             <FileText className="w-4 h-4 text-emerald-500" />
                             Content Structure (H2s)
                           </h5>
                           <ul className="space-y-2">
                             {plan.h2Sections.map((h2, i) => (
                               <li key={i} className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded border border-gray-800 flex items-start gap-2">
                                 <span className="text-gray-600 text-xs mt-0.5">H2</span>
                                 {h2}
                               </li>
                             ))}
                           </ul>
                           <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">Target: {plan.wordCountTarget} words</span>
                           </div>
                        </div>

                        <div>
                           <h5 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                             <Globe className="w-4 h-4 text-cyan-500" />
                             Local Optimization
                           </h5>
                           <div className="space-y-4">
                             <div>
                               <p className="text-xs text-gray-500 mb-1">Local Keywords</p>
                               <div className="flex flex-wrap gap-1.5">
                                 {plan.localKeywords.slice(0, 6).map((kw, i) => (
                                   <span key={i} className="text-xs bg-cyan-900/30 text-cyan-200 px-2 py-1 rounded border border-cyan-900/50">{kw}</span>
                                 ))}
                                 {plan.localKeywords.length > 6 && <span className="text-xs text-gray-500 px-2 py-1">+{plan.localKeywords.length - 6} more</span>}
                               </div>
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 mb-1">Internal Linking Targets</p>
                               <div className="flex flex-wrap gap-1.5">
                                 {plan.internalLinks.map((link, i) => (
                                   <span key={i} className="text-xs bg-indigo-900/30 text-indigo-200 px-2 py-1 rounded border border-indigo-900/50">{link}</span>
                                 ))}
                               </div>
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 mb-1">Local Proof Points</p>
                               <div className="text-xs text-gray-400 italic">
                                 {plan.localProofPoints.join(', ')}
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* Schema Markup */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs uppercase font-semibold text-gray-500 tracking-wider flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            LocalBusiness Schema
                          </label>
                          <button 
                            onClick={() => copySchema(plan.schema, index)}
                            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            {copiedSchemaIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedSchemaIndex === index ? 'Copied!' : 'Copy Schema'}
                          </button>
                        </div>
                        <div className="relative group">
                          <pre className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 overflow-x-auto text-xs text-gray-300 font-mono">
                            {JSON.stringify(plan.schema, null, 2)}
                          </pre>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaBuilder;