import React from 'react';
import { GeneratedContent } from '../types';
import { CheckCircle2, XCircle, AlertCircle, BarChart2, ListChecks } from 'lucide-react';

interface ContentAnalysisSidebarProps {
  data: GeneratedContent;
}

const ContentAnalysisSidebar: React.FC<ContentAnalysisSidebarProps> = ({ data }) => {
  const { analysis, seoChecklist, metaData } = data;

  const MetricRow = ({ label, value, target, unit = '' }: { label: string, value: number, target: number, unit?: string }) => (
      <div className="flex justify-between items-center text-sm py-1 border-b border-gray-800 last:border-0">
          <span className="text-gray-400">{label}</span>
          <div className="flex items-center gap-2">
              <span className="text-white font-mono">{value}{unit}</span>
              {value >= target ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                  <AlertCircle className="w-3 h-3 text-amber-500" />
              )}
          </div>
      </div>
  );

  return (
    <div className="space-y-6">
      {/* Metrics Card */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" /> Content Metrics
          </h3>
          <div className="space-y-1">
              <MetricRow label="Word Count" value={analysis.wordCount} target={800} />
              <MetricRow label="Primary Keyword" value={analysis.primaryKeywordCount} target={3} />
              <MetricRow label="H2 Headings" value={analysis.h2Count} target={4} />
              <MetricRow label="H3 Headings" value={analysis.h3Count} target={3} />
              <MetricRow label="Internal Links" value={analysis.internalLinkOpportunities.length} target={3} />
              <MetricRow label="Reading Level" value={analysis.readingLevel} target={6} />
              <MetricRow label="Local Mentions" value={analysis.localMentions} target={3} />
          </div>
      </div>

      {/* SEO Checklist */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-emerald-400" /> SEO Checklist
          </h3>
          <div className="space-y-2">
              {seoChecklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                      {item.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <span className={item.passed ? "text-gray-300" : "text-gray-400"}>{item.item}</span>
                  </div>
              ))}
          </div>
      </div>

      {/* Metadata Preview */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3">Snippet Preview</h3>
          <div className="space-y-3">
              <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Title Tag ({metaData.titleLength} chars)</p>
                  <p className="text-sm text-indigo-400 font-medium hover:underline cursor-pointer line-clamp-2">
                      {metaData.titleTag}
                  </p>
              </div>
              <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Meta Description ({metaData.metaLength} chars)</p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                      {metaData.metaDescription}
                  </p>
              </div>
              <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">URL Slug</p>
                  <p className="text-xs text-emerald-400 font-mono bg-emerald-900/20 px-2 py-1 rounded inline-block">
                      {metaData.urlSlug}
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ContentAnalysisSidebar;