import React, { useState, useEffect } from 'react';
import { generateSchemas } from '../services/schemaService';
import { BusinessProfile, ServiceItem, FaqItem } from '../types';
import { 
  Code, 
  Copy, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

const SchemaGenerator: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile>({
    businessName: '',
    type: 'Water Damage Restoration',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
    email: '',
    hours247: true,
    serviceArea: '',
    priceRange: '$$',
    yearEstablished: '',
    description: '',
    logoUrl: '',
    imageUrl: '',
    services: [],
    faqs: []
  });

  const [activeTab, setActiveTab] = useState<'local' | 'services' | 'faq' | 'combined'>('local');
  const [output, setOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOutput(generateSchemas(profile));
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setProfile({ ...profile, [e.target.name]: value });
  };

  // Service Management
  const addService = () => {
    setProfile(prev => ({
        ...prev,
        services: [...prev.services, { name: '', description: '', url: '' }]
    }));
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const newServices = [...profile.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setProfile({ ...profile, services: newServices });
  };

  const removeService = (index: number) => {
    setProfile(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
  };

  // FAQ Management
  const addFaq = () => {
    setProfile(prev => ({
        ...prev,
        faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const newFaqs = [...profile.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setProfile({ ...profile, faqs: newFaqs });
  };

  const removeFaq = (index: number) => {
    setProfile(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  const getCodeToDisplay = () => {
    if (!output) return '';
    switch (activeTab) {
        case 'local': return JSON.stringify(output.localBusiness, null, 2);
        case 'services': return JSON.stringify(output.services, null, 2);
        case 'faq': return output.faq ? JSON.stringify(output.faq, null, 2) : '// No FAQs added';
        case 'combined': return output.combined;
        default: return '';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCodeToDisplay());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in h-[calc(100vh-140px)]">
      {/* Left: Input Form - Scrollable */}
      <div className="overflow-y-auto pr-2 custom-scrollbar space-y-8 pb-20">
         <div className="mb-6">
             <h2 className="text-2xl font-bold text-white mb-2">Schema Generator</h2>
             <p className="text-gray-400 text-sm">Create valid JSON-LD markup without coding.</p>
         </div>

         {/* Business Info */}
         <section className="bg-[#161b22] border border-gray-800 rounded-xl p-5 space-y-4">
             <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Business Profile</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" name="businessName" placeholder="Business Name" value={profile.businessName} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                 <input type="text" name="type" placeholder="Business Type (e.g. Plumber)" value={profile.type} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                 <input type="text" name="phone" placeholder="Phone Number" value={profile.phone} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                 <input type="text" name="website" placeholder="Website URL (e.g. example.com)" value={profile.website} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                 <input type="text" name="address" placeholder="Street Address" value={profile.address} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all md:col-span-2" />
                 <input type="text" name="city" placeholder="City" value={profile.city} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                 <div className="grid grid-cols-2 gap-2">
                     <input type="text" name="state" placeholder="State" value={profile.state} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                     <input type="text" name="zip" placeholder="Zip" value={profile.zip} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                 </div>
                 <input type="text" name="logoUrl" placeholder="Logo Image URL" value={profile.logoUrl} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                 <input type="text" name="imageUrl" placeholder="Feature Image URL" value={profile.imageUrl} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                 <textarea name="description" placeholder="Business Description" value={profile.description} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all md:col-span-2 h-20" />
                 <input type="text" name="serviceArea" placeholder="Service Areas (comma separated)" value={profile.serviceArea} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all md:col-span-2" />
                 <div className="flex items-center gap-2 mt-2">
                     <input type="checkbox" name="hours247" id="hours247" checked={profile.hours247} onChange={(e) => setProfile({...profile, hours247: e.target.checked})} className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-indigo-600 focus:ring-indigo-500" />
                     <label htmlFor="hours247" className="text-gray-300 text-sm">Open 24/7</label>
                 </div>
             </div>
         </section>

         {/* Services */}
         <section className="bg-[#161b22] border border-gray-800 rounded-xl p-5 space-y-4">
             <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                 <h3 className="text-lg font-semibold text-white">Services</h3>
                 <button onClick={addService} className="text-xs flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded transition-colors"><Plus className="w-3 h-3"/> Add</button>
             </div>
             {profile.services.map((service, i) => (
                 <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 space-y-3 relative group">
                     <button onClick={() => removeService(i)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                     <input type="text" placeholder="Service Name" value={service.name} onChange={(e) => updateService(i, 'name', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all w-full" />
                     <input type="text" placeholder="Service URL" value={service.url} onChange={(e) => updateService(i, 'url', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all w-full" />
                     <textarea placeholder="Brief Description" value={service.description} onChange={(e) => updateService(i, 'description', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all w-full h-16" />
                 </div>
             ))}
             {profile.services.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">No services added yet.</p>}
         </section>

         {/* FAQs */}
         <section className="bg-[#161b22] border border-gray-800 rounded-xl p-5 space-y-4">
             <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                 <h3 className="text-lg font-semibold text-white">FAQs</h3>
                 <button onClick={addFaq} className="text-xs flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded transition-colors"><Plus className="w-3 h-3"/> Add</button>
             </div>
             {profile.faqs.map((faq, i) => (
                 <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 space-y-3 relative group">
                     <button onClick={() => removeFaq(i)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                     <input type="text" placeholder="Question" value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all w-full" />
                     <textarea placeholder="Answer" value={faq.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all w-full h-20" />
                 </div>
             ))}
             {profile.faqs.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">No FAQs added yet.</p>}
         </section>
      </div>

      {/* Right: Preview & Validation - Fixed/Scrollable */}
      <div className="flex flex-col h-full bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
         {/* Tabs */}
         <div className="flex border-b border-gray-800 bg-[#161b22]">
             {(['local', 'services', 'faq', 'combined'] as const).map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors capitalize ${
                        activeTab === tab 
                        ? 'border-indigo-500 text-white bg-gray-800/50' 
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                 >
                    {tab}
                 </button>
             ))}
         </div>

         {/* Toolbar */}
         <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-[#161b22]/50">
             <div className="flex items-center gap-2">
                 {output?.errors.length > 0 ? (
                     <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                         <AlertCircle className="w-4 h-4" />
                         {output.errors.length} Error{output.errors.length > 1 ? 's' : ''}
                     </div>
                 ) : output?.warnings.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                         <AlertTriangle className="w-4 h-4" />
                         {output.warnings.length} Warning{output.warnings.length > 1 ? 's' : ''}
                     </div>
                 ) : (
                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                         <CheckCircle className="w-4 h-4" />
                         Valid Schema
                     </div>
                 )}
             </div>
             <div className="flex gap-2">
                 <a 
                    href="https://search.google.com/test/rich-results" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded border border-gray-700 transition-colors"
                 >
                     <ExternalLink className="w-3 h-3" /> Test
                 </a>
                 <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded transition-colors"
                 >
                     {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                     {copied ? 'Copied' : 'Copy Code'}
                 </button>
             </div>
         </div>

         {/* Code Area */}
         <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#0d1117]">
             <pre className="text-xs md:text-sm font-mono text-gray-300 whitespace-pre-wrap break-all">
                 {getCodeToDisplay()}
             </pre>
         </div>

         {/* Validation Messages Footer */}
         {(output?.errors.length > 0 || output?.warnings.length > 0) && (
             <div className="p-4 border-t border-gray-800 bg-[#161b22] max-h-40 overflow-y-auto">
                 {output.errors.map((err: string, i: number) => (
                     <p key={`err-${i}`} className="text-red-400 text-xs flex items-center gap-2 mb-1">
                         <AlertCircle className="w-3 h-3 shrink-0" /> {err}
                     </p>
                 ))}
                 {output.warnings.map((warn: string, i: number) => (
                     <p key={`warn-${i}`} className="text-amber-400 text-xs flex items-center gap-2 mb-1">
                         <AlertTriangle className="w-3 h-3 shrink-0" /> {warn}
                     </p>
                 ))}
             </div>
         )}
      </div>
    </div>
  );
};

export default SchemaGenerator;