import React from 'react';
import { CitationIssue } from '../types';
import { AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';

interface IssueCardProps {
  issue: CitationIssue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-3 last:mb-0 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-white text-sm uppercase">{issue.source} — {issue.field} Mismatch</h4>
          </div>
          {issue.fixUrl && (
              <a href={issue.fixUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  Fix Now <ExternalLink className="w-3 h-3" />
              </a>
          )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 text-sm">
          <div className="bg-rose-900/10 border border-rose-900/30 p-2 rounded">
              <span className="text-xs text-rose-400 font-bold block mb-1">Found Value (Incorrect)</span>
              <p className="text-gray-300 break-words">{issue.current}</p>
          </div>
          <div className="bg-emerald-900/10 border border-emerald-900/30 p-2 rounded relative">
              <div className="hidden md:block absolute -left-5 top-1/2 -translate-y-1/2 text-gray-600">
                  <ArrowRight className="w-4 h-4" />
              </div>
              <span className="text-xs text-emerald-400 font-bold block mb-1">Expected Value</span>
              <p className="text-white break-words">{issue.shouldBe}</p>
          </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
          <span className="font-bold text-gray-400">Impact:</span> {issue.impact}
      </div>
    </div>
  );
};

export default IssueCard;