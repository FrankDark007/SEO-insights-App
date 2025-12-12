import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisState, CompetitorMetric } from '../types';
import SourceList from './SourceList';
import SerpPreview from './SerpPreview';
import CompetitorChart from './CompetitorChart';
import { Sparkles, AlertCircle, BarChart3, ListChecks, Printer, FileText, Copy, Check, LayoutDashboard, Search as SearchIcon, Link as LinkIcon } from 'lucide-react';

interface AnalysisViewProps {
  state: AnalysisState;
  analyzedUrl?: string;
  keywords?: string;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ state, analyzedUrl, keywords }) => {
  const { data, groundingMetadata, error } = state;
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'serp'>('report');

  // Extract JSON data and Clean Markdown
  const { displayMarkdown, competitorData } = useMemo(() => {
    if (!data) return { displayMarkdown: '', competitorData: [] };

    // Regex to find JSON block between ```json and ```
    const jsonMatch = data.match(/```json\n([\s\S]*?)\n```/);
    let parsedData: CompetitorMetric[] = [];
    let cleanMarkdown = data;

    if (jsonMatch && jsonMatch[1]) {
        try {
            parsedData = JSON.parse(jsonMatch[1]);
            // Remove the JSON block from the display markdown to avoid duplication
            cleanMarkdown = data.replace(jsonMatch[0], '');
        } catch (e) {
            console.warn("Failed to parse competitor JSON", e);
        }
    }
    
    // Fallback: Remove Section 11 header and everything that follows it (instructions + JSON wrapper)
    // This ensures the raw "Competitor Metrics Data" section is hidden since it's visualized in the chart
    cleanMarkdown = cleanMarkdown.replace(/##\s*11\.\s*Competitor Metrics Data[\s\S]*/i, '');

    return { displayMarkdown: cleanMarkdown, competitorData: parsedData };
  }, [data]);

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-900/20 border border-red-500/50 text-red-200 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-lg">Analysis Failed</h3>
          <p className="mt-1 opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getSafeHostname = () => {
    try {
        if (!analyzedUrl) return 'seo-analysis';
        const urlToParse = analyzedUrl.startsWith('http') ? analyzedUrl : `https://${analyzedUrl}`;
        return new URL(urlToParse).hostname.replace(/[^a-z0-9]/gi, '-');
    } catch {
        return 'seo-analysis';
    }
  };

  const handleDownloadPdf = () => {
    const element = document.querySelector('.prose');
    if (!element) {
      alert('No report content to export');
      return;
    }
    
    const opt = {
      margin: 10,
      filename: `seo-report-${getSafeHostname()}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const handleDownloadMd = () => {
    const blob = new Blob([data], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${getSafeHostname()}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in space-y-6">
       {/* Top Controls: Tabs & Actions */}
       <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-800 no-print">
          <div className="flex bg-gray-800/50 p-1 rounded-xl border border-gray-700">
              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'report' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Strategy Report
              </button>
              <button
                onClick={() => setActiveTab('serp')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'serp' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <SearchIcon className="w-4 h-4" />
                Live SERP View
              </button>
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
             <button onClick={handleDownloadPdf} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-700 transition-colors text-sm font-medium">
                <Printer className="w-4 h-4" />
                Export PDF
             </button>
             <button onClick={handleDownloadMd} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-700 transition-colors text-sm font-medium">
                <FileText className="w-4 h-4" />
                Markdown
             </button>
             <button onClick={handleCopy} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-700 transition-colors text-sm font-medium min-w-[100px]">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
             </button>
          </div>
       </div>

       {/* REPORT TAB */}
       {activeTab === 'report' && (
         <div className="animate-fade-in space-y-8">
            {/* Print Only Cover Header */}
            <div className="hidden print:block mb-8 pb-8 border-b border-gray-200">
                <h1 className="text-4xl font-bold text-black mb-2">SEO Strategy Report</h1>
                <p className="text-gray-600 text-lg mb-4">Generated for: {analyzedUrl}</p>
                <div className="flex gap-8 text-sm text-gray-500">
                    <span>Target Keywords: {keywords}</span>
                    <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex flex-col items-center text-center print:border-gray-300 print:bg-white">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 print:bg-indigo-100 print:text-indigo-700">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-gray-400 text-sm font-medium print:text-gray-600">Trend Opportunity</h4>
                    <span className="text-2xl font-bold text-white mt-1 print:text-black">High</span>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex flex-col items-center text-center print:border-gray-300 print:bg-white">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 print:bg-emerald-100 print:text-emerald-700">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <h4 className="text-gray-400 text-sm font-medium print:text-gray-600">Competition Level</h4>
                    <span className="text-2xl font-bold text-white mt-1 print:text-black">Moderate</span>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex flex-col items-center text-center print:border-gray-300 print:bg-white">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 print:bg-amber-100 print:text-amber-700">
                        <ListChecks className="w-5 h-5" />
                    </div>
                    <h4 className="text-gray-400 text-sm font-medium print:text-gray-600">Action Items</h4>
                    <span className="text-2xl font-bold text-white mt-1 print:text-black">10+ Found</span>
                </div>
            </div>
            
            {/* Render Charts if data is available */}
            {competitorData.length > 0 && (
                <CompetitorChart data={competitorData} />
            )}

            <div className="prose prose-invert prose-indigo max-w-none bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50 shadow-sm print:bg-transparent print:border-none print:shadow-none print:p-0 print:prose-black">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-700 print:text-black print:border-gray-300" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-indigo-300 mt-8 mb-4 flex items-center gap-2 print:text-indigo-700 print:mt-6" {...props} />,
                        h3: ({node, ...props}) => {
                           const text = String(props.children);
                           const isBacklinkSection = text.toLowerCase().includes('backlink');
                           return (
                               <h3 className={`text-lg font-medium text-white mt-6 mb-2 print:text-black flex items-center gap-2 ${isBacklinkSection ? 'text-emerald-300' : ''}`} {...props}>
                                   {isBacklinkSection && <LinkIcon className="w-5 h-5 text-emerald-400" />}
                                   {props.children}
                               </h3>
                           );
                        },
                        ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 space-y-2 text-gray-300 print:text-black" {...props} />,
                        li: ({node, ...props}) => {
                           // Custom rendering for checklist items if they start with [ ] or [x]
                           const children = React.Children.toArray(props.children);
                           if (typeof children[0] === 'string' && (children[0].startsWith('[ ]') || children[0].startsWith('[x]'))) {
                               return <li className="list-none pl-0 -ml-4 flex items-start gap-2 print:text-black" {...props} />
                           }
                           return <li className="pl-1 print:text-black" {...props} />;
                        },
                        p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-4 print:text-gray-800" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-white font-semibold print:text-black" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-gray-800/50 rounded-r text-gray-400 italic print:bg-gray-50 print:text-gray-600 print:border-l-4 print:border-indigo-700" {...props} />,
                        table: ({node, ...props}) => <div className="overflow-x-auto my-6 print:overflow-visible"><table className="min-w-full divide-y divide-gray-700 border border-gray-700 rounded-lg overflow-hidden print:border-gray-300" {...props} /></div>,
                        thead: ({node, ...props}) => <thead className="bg-gray-800 print:bg-gray-100" {...props} />,
                        tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-700 bg-gray-900/50 print:bg-white print:divide-gray-200" {...props} />,
                        tr: ({node, ...props}) => <tr className="hover:bg-gray-800/50 transition-colors print:hover:bg-transparent" {...props} />,
                        th: ({node, ...props}) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider print:text-black print:font-bold" {...props} />,
                        td: ({node, ...props}) => <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap print:text-black print:whitespace-normal" {...props} />,
                    }}
                >
                {displayMarkdown}
                </ReactMarkdown>
            </div>
            
            <div className="print:hidden">
                <SourceList chunks={groundingMetadata?.groundingChunks} />
            </div>
         </div>
       )}

       {/* SERP TAB */}
       {activeTab === 'serp' && (
          <div className="animate-fade-in">
             <SerpPreview chunks={groundingMetadata?.groundingChunks} keywords={keywords || ''} />
          </div>
       )}
    </div>
  );
};

export default AnalysisView;