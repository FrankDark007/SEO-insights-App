import React, { useState } from 'react';
import { generateContentBrief } from '../services/contentBriefService';
import { ContentBrief } from '../types';
import { 
  FileText, 
  Loader2, 
  Check, 
  Copy, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Clock, 
  Hash, 
  List, 
  AlertCircle,
  BarChart2,
  HelpCircle,
  Layout
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ContentBriefGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    keyword: '',
    location: '',
    contentType: 'Service Page',
    existingUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContentBrief | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'serp' | 'keywords' | 'outline'>('summary');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keyword) return;

    setIsLoading(true);
    setResult(null);

    try {
      const data = await generateContentBrief(
        formData.keyword,
        formData.location,
        formData.contentType,
        formData.existingUrl
      );
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateMarkdownExport = () => {
    if (!result) return '';
    return `
# Content Brief: ${result.keyword}
**Intent:** ${result.searchIntent} | **Word Count:** ${result.recommendedWordCount}

## Outline
${result.suggestedOutline.map(s => `${'#'.repeat(s.tag === 'h1' ? 1 : s.tag === 'h2' ? 2 : 3)} ${s.text}\n${s.notes ? `*Note: ${s.notes}*\n` : ''}${s.bulletPoints?.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

## Requirements
${result.contentRequirements.map(r => `- [ ] ${r}`).join('\n')}

## Keywords
${result.keywordsToInclude.map(k => `- ${k.keyword} (${k.priority}) - ${k.whereToUse}`).join('\n')}
    `.trim();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Content Brief Generator</h2>
        <p className="text-gray-400">Generate data-backed content outlines to outrank competitors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Keyword</label>
                <input
                  type="text"
                  name="keyword"
                  value={formData.keyword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Dallas, TX"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content Type</label>
                <select
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Service Page</option>
                  <option>Location Page</option>
                  <option>Blog Post</option>
                  <option>FAQ Page</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Existing URL (Gap Analysis)</label>
                <input
                  type="url"
                  name="existingUrl"
                  value={formData.existingUrl}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 mt-2"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Generate Brief'}
              </button>
            </form>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3">
          {!result && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20 min-h-[400px]">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p>Enter a keyword to generate a brief.</p>
            </div>
          )}

          {isLoading && (
             <div className="h-full flex flex-col items-center justify-center text-indigo-400 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20 min-h-[400px]">
                <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                <p>Analyzing SERP and generating strategy...</p>
             </div>
          )}

          {result && (
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Header / Summary Card */}
              <div className="p-6 border-b border-gray-800 bg-gray-900/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                           {result.keyword}
                           <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30 uppercase tracking-wide">
                             {result.searchIntent}
                           </span>
                        </h3>
                    </div>
                    <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(generateMarkdownExport())}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded-lg border border-gray-700 transition-colors"
                        >
                           {copied ? <Check className="w-4 h-4 text-green-400"/> : <Copy className="w-4 h-4"/>}
                           {copied ? 'Copied' : 'Copy MD'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Target className="w-3 h-3"/> Difficulty</p>
                      <p className="text-xl font-bold text-white">{result.difficultyScore}/10</p>
                   </div>
                   <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Hash className="w-3 h-3"/> Word Count</p>
                      <p className="text-xl font-bold text-white">{result.recommendedWordCount}</p>
                   </div>
                   <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Est. Time</p>
                      <p className="text-xl font-bold text-white">{result.estimatedWriteTime}</p>
                   </div>
                   <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><BarChart2 className="w-3 h-3"/> Competitors</p>
                      <p className="text-xl font-bold text-white">5 Analyzed</p>
                   </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-800 bg-gray-900/30 px-6">
                {(['summary', 'serp', 'keywords', 'outline'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                            activeTab === tab 
                            ? 'border-indigo-500 text-white' 
                            : 'border-transparent text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'summary' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <List className="w-4 h-4 text-emerald-400"/> Required Sections
                                </h4>
                                <ul className="space-y-2">
                                    {result.requiredH2s.map((h2, i) => (
                                        <li key={i} className="text-sm text-gray-300 bg-emerald-900/10 border border-emerald-900/30 px-3 py-2 rounded flex items-center gap-2">
                                            <Check className="w-3 h-3 text-emerald-500"/> {h2}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-amber-400"/> Questions to Answer
                                </h4>
                                <ul className="space-y-2">
                                    {result.questionsToAnswer.map((q, i) => (
                                        <li key={i} className="text-sm text-gray-300 bg-amber-900/10 border border-amber-900/30 px-3 py-2 rounded">
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                         <div>
                            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-400"/> Competitor Gaps
                            </h4>
                            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                                <ul className="space-y-2">
                                    {result.competitorGaps.map((gap, i) => (
                                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                            <span className="text-rose-400 mt-1">•</span> {gap}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'serp' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase">
                                    <th className="py-3 px-2">Rank</th>
                                    <th className="py-3 px-2 w-1/3">Title / URL</th>
                                    <th className="py-3 px-2 text-center">Words</th>
                                    <th className="py-3 px-2 text-center">H2s</th>
                                    <th className="py-3 px-2 text-center">FAQ</th>
                                    <th className="py-3 px-2 text-center">Schema</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.serpAnalysis.map((site) => (
                                    <tr key={site.rank} className="border-b border-gray-800 hover:bg-gray-800/30">
                                        <td className="py-3 px-2 font-bold text-white">{site.rank}</td>
                                        <td className="py-3 px-2">
                                            <p className="text-indigo-400 font-medium truncate max-w-[250px]">{site.title}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[250px]">{site.url}</p>
                                        </td>
                                        <td className="py-3 px-2 text-center text-gray-300">{site.wordCount}</td>
                                        <td className="py-3 px-2 text-center text-gray-300">{site.h2Count}</td>
                                        <td className="py-3 px-2 text-center">
                                            {site.hasFaq ? <Check className="w-4 h-4 text-green-500 mx-auto"/> : <span className="text-gray-600">-</span>}
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            {site.hasSchema ? <Check className="w-4 h-4 text-green-500 mx-auto"/> : <span className="text-gray-600">-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'keywords' && (
                    <div className="space-y-6">
                        <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg">
                            <h4 className="text-indigo-300 font-bold mb-2">Primary Keyword Focus</h4>
                            <p className="text-2xl text-white font-bold">{result.keyword}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.keywordsToInclude.map((k, i) => (
                                <div key={i} className="bg-gray-900 border border-gray-700 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-medium">{k.keyword}</p>
                                        <p className="text-xs text-gray-500">{k.whereToUse}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded border capitalize ${
                                        k.priority === 'required' ? 'bg-rose-900/20 text-rose-300 border-rose-800' :
                                        k.priority === 'recommended' ? 'bg-emerald-900/20 text-emerald-300 border-emerald-800' :
                                        'bg-gray-800 text-gray-400 border-gray-600'
                                    }`}>
                                        {k.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'outline' && (
                    <div className="space-y-4">
                        {result.suggestedOutline.map((section, i) => (
                            <div key={i} className={`p-4 rounded-lg border ${
                                section.tag === 'h1' ? 'bg-indigo-900/20 border-indigo-500/50 mb-6' : 
                                'bg-gray-900/50 border-gray-800 ml-4'
                            }`}>
                                <div className="flex items-start gap-3">
                                    <span className={`text-xs font-bold uppercase mt-1 px-1.5 py-0.5 rounded ${
                                        section.tag === 'h1' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300'
                                    }`}>
                                        {section.tag}
                                    </span>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium text-lg">{section.text}</h4>
                                        {section.notes && <p className="text-sm text-indigo-300 italic mt-1">{section.notes}</p>}
                                        {section.bulletPoints && section.bulletPoints.length > 0 && (
                                            <ul className="mt-3 space-y-1">
                                                {section.bulletPoints.map((bp, j) => (
                                                    <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                                                        <span className="text-gray-600 mt-1.5 w-1 h-1 bg-gray-500 rounded-full"></span>
                                                        {bp}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentBriefGenerator;