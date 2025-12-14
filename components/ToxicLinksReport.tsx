import React, { useState } from "react";
import { ToxicLinkReport } from "../types";
import { AlertTriangle, Copy, Check, Eye, EyeOff, FileText, Download } from 'lucide-react';

interface ToxicLinksReportProps {
  report: ToxicLinkReport;
}

const ToxicLinksReport: React.FC<ToxicLinksReportProps> = ({ report }) => {
  const [showDisavow, setShowDisavow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyDisavowFile = () => {
    navigator.clipboard.writeText(report.disavowFileContent.replace(/\\n/g, "\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDisavowFile = () => {
      const element = document.createElement("a");
      const file = new Blob([report.disavowFileContent.replace(/\\n/g, "\n")], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "disavow_file.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
  };

  const getRiskBadge = (risk: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-900/30 text-green-400 border-green-800",
      medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
      high: "bg-orange-900/30 text-orange-400 border-orange-800",
      critical: "bg-red-900/30 text-red-400 border-red-800",
    };
    return colors[risk] || colors.medium;
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" /> Toxic Links Report
        </h3>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase ${getRiskBadge(report.riskLevel)}`}>
            {report.riskLevel} RISK
          </span>
          <span className="text-red-400 font-bold text-lg">
            {report.totalToxicLinks} <span className="text-sm font-normal text-gray-500">Toxic Links</span>
          </span>
        </div>
      </div>

      {/* Toxic Domains List */}
      <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar">
        {report.toxicDomains.map((domain, index) => (
          <div
            key={index}
            className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-red-300 font-mono font-bold text-sm">{domain.domain}</span>
                <span className="text-gray-400 text-xs">({domain.linkCount} links found)</span>
              </div>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-bold border border-red-500/30">
                Spam Score: {domain.spamScore}%
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {domain.toxicSignals.map((signal, i) => (
                <span key={i} className="text-[10px] bg-red-950 text-red-200 px-2 py-1 rounded border border-red-900/50">
                  {signal}
                </span>
              ))}
            </div>
            <p className="text-gray-400 text-xs flex items-center gap-2 mt-2 bg-black/20 p-2 rounded">
              <span className="text-indigo-400 font-bold uppercase text-[10px]">Action</span> {domain.recommendation}
            </p>
          </div>
        ))}
      </div>

      {/* Disavow File */}
      <div className="border-t border-gray-800 pt-5 mt-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowDisavow(!showDisavow)}
            className="text-gray-300 text-sm hover:text-white flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded border border-gray-700 transition-colors"
          >
            {showDisavow ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>} 
            {showDisavow ? "Hide" : "Preview"} Disavow File
          </button>
          <div className="flex gap-2">
            <button
                onClick={copyDisavowFile}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded border border-gray-700 transition-colors"
            >
                {copied ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
                {copied ? "Copied" : "Copy"}
            </button>
            <button
                onClick={downloadDisavowFile}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded transition-colors font-medium"
            >
                <Download className="w-4 h-4" /> Download .txt
            </button>
          </div>
        </div>

        {showDisavow && (
          <div className="relative">
            <pre className="bg-[#0d1117] p-4 rounded-lg text-gray-400 text-xs font-mono whitespace-pre-wrap overflow-x-auto border border-gray-800 max-h-60 custom-scrollbar">
                {report.disavowFileContent.replace(/\\n/g, "\n")}
            </pre>
            <div className="absolute top-2 right-2 text-[10px] text-gray-600 font-mono">disavow.txt</div>
          </div>
        )}

        <div className="mt-4 flex items-start gap-3 bg-indigo-900/10 p-3 rounded-lg border border-indigo-500/20">
            <FileText className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
                <p className="text-sm font-bold text-white mb-1">How to use this file</p>
                <p className="text-gray-400 text-xs">
                    Upload this file to Google Search Console's Disavow Tool to prevent these bad links from hurting your rankings. Only do this if you have a manual action or see a significant number of spammy links.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ToxicLinksReport;
