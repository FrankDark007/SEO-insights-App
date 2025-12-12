import React, { useState } from 'react';
import { generateContent, saveToLibrary } from '../services/contentWriterService';
import { GeneratedContent, SavedContent, ContentRequest } from '../types';
import ContentPreview from './ContentPreview';
import ContentAnalysisSidebar from './ContentAnalysisSidebar';
import SectionEditor from './SectionEditor';
import ContentLibrary from './ContentLibrary';
import { 
  PenTool, 
  Loader2, 
  Layout, 
  Save, 
  Download, 
  Settings, 
  AlertCircle,
  Library,
  FilePlus,
  Eye,
  Edit2
} from 'lucide-react';

const ContentWriter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'write' | 'library'>('write');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<ContentRequest>({
    keyword: '',
    contentType: 'service',
    location: '',
    wordCount: 1200,
    tone: 'professional',
    businessName: '',
    phoneNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestData.keyword || !requestData.businessName) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateContent(requestData);
      setResult(data);
      setViewMode('preview');
    } catch (err: any) {
      setError(err.message || "Failed to generate content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
        saveToLibrary(result, requestData);
        alert('Content saved to library!');
    }
  };

  const handleLoadFromLibrary = (saved: SavedContent) => {
      setResult(saved.data);
      setRequestData({
          ...requestData,
          keyword: saved.keyword,
          location: saved.location,
          contentType: saved.type as any
      });
      setActiveTab('write');
      setViewMode('preview');
  };

  const handleSectionUpdate = (id: string, newContent: string) => {
      if (!result) return;
      
      const newSections = result.sections.map(s => s.id === id ? { ...s, content: newContent } : s);
      const fullContent = newSections.map(s => s.content).join('\n\n');
      
      setResult({
          ...result,
          sections: newSections,
          content: fullContent
      });
  };

  const downloadMarkdown = () => {
      if (!result) return;
      const blob = new Blob([result.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.metaData.urlSlug || 'content'}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            AI Content Writer
            <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30 font-normal">
                SEO Optimized
            </span>
          </h2>
          <p className="text-gray-400">Generate, edit, and optimize full-page content drafts in seconds.</p>
        </div>
        <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-800">
            <button
                onClick={() => setActiveTab('write')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'write' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
                <PenTool className="w-4 h-4" /> Writer
            </button>
            <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'library' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
                <Library className="w-4 h-4" /> Library
            </button>
        </div>
      </div>

      {activeTab === 'library' && (
          <ContentLibrary onLoad={handleLoadFromLibrary} />
      )}

      {activeTab === 'write' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Column: Input or Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Generation Form */}
                <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 shadow-lg">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-400" /> Content Parameters
                    </h3>
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Target Keyword</label>
                            <input type="text" name="keyword" value={requestData.keyword} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Business Name</label>
                            <input type="text" name="businessName" value={requestData.businessName} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Type</label>
                                <select name="contentType" value={requestData.contentType} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                                    <option value="service">Service Page</option>
                                    <option value="location">Location Page</option>
                                    <option value="blog">Blog Post</option>
                                    <option value="faq">FAQ Page</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Tone</label>
                                <select name="tone" value={requestData.tone} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                                    <option value="professional">Professional</option>
                                    <option value="friendly">Friendly</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="educational">Educational</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Location</label>
                                <input type="text" name="location" value={requestData.location} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="Optional" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Word Count</label>
                                <select name="wordCount" value={requestData.wordCount} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                                    <option value="800">800</option>
                                    <option value="1200">1200</option>
                                    <option value="1500">1500</option>
                                    <option value="2000">2000</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Phone Number</label>
                            <input type="text" name="phoneNumber" value={requestData.phoneNumber} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 mt-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus className="w-4 h-4" />}
                            Generate Draft
                        </button>
                    </form>
                </div>

                {/* Analysis Sidebar (Only if result exists) */}
                {result && (
                    <ContentAnalysisSidebar data={result} />
                )}
            </div>

            {/* Right Column: Editor/Preview */}
            <div className="lg:col-span-3">
                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 mb-4">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {!result && !isLoading && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20 min-h-[500px]">
                        <PenTool className="w-16 h-16 mb-4 opacity-20" />
                        <p>Configure parameters and click Generate to start writing.</p>
                    </div>
                )}

                {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-indigo-400 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20 min-h-[500px]">
                        <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                        <p>AI is researching and writing your content...</p>
                    </div>
                )}

                {result && (
                    <div className="bg-[#161b22] border border-gray-800 rounded-2xl shadow-xl overflow-hidden min-h-[800px] flex flex-col">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
                                <button
                                    onClick={() => setViewMode('edit')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                        viewMode === 'edit' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Edit2 className="w-3 h-3" /> Sections
                                </button>
                                <button
                                    onClick={() => setViewMode('preview')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                        viewMode === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Eye className="w-3 h-3" /> Preview
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSave} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-700 transition-colors text-xs font-medium">
                                    <Save className="w-4 h-4" /> Save
                                </button>
                                <button onClick={downloadMarkdown} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-700 transition-colors text-xs font-medium">
                                    <Download className="w-4 h-4" /> Export MD
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117]">
                            {viewMode === 'edit' ? (
                                <div className="space-y-4">
                                    {result.sections.map((section) => (
                                        <SectionEditor 
                                            key={section.id} 
                                            section={section} 
                                            onUpdate={handleSectionUpdate} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <ContentPreview content={result.content} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default ContentWriter;