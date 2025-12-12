import React, { useState, useEffect } from 'react';
import { auditGSCProperties } from '../services/searchConsoleService';
import { GSCAuditResult } from '../types';
import { Loader2, Globe, AlertCircle, Link as LinkIcon, FileText } from 'lucide-react';

const SearchConsoleAudit: React.FC = () => {
  const [result, setResult] = useState<GSCAuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    try {
      const data = await auditGSCProperties();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-400">Auditing Search Console Properties...</p>
          </div>
      );
  }

  if (!result) return null;

  return (
    <div className="space-y-8 animate-fade-in">
        
        {/* Properties Table */}
        <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" /> Verified Properties
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900 text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="p-4">Property</th>
                            <th className="p-4">Type</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Sitemaps</th>
                            <th className="p-4">Issues</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {result.properties.map((prop, i) => (
                            <tr key={i}>
                                <td className="p-4 font-medium text-white">{prop.siteUrl}</td>
                                <td className="p-4 text-gray-400 capitalize">{prop.type.replace('_', ' ')}</td>
                                <td className="p-4 text-center">
                                    {prop.verified ? (
                                        <span className="text-emerald-400 text-xs font-bold">Verified</span>
                                    ) : (
                                        <span className="text-rose-400 text-xs font-bold bg-rose-900/20 px-2 py-1 rounded">Unverified</span>
                                    )}
                                </td>
                                <td className="p-4 text-center text-gray-300">
                                    {prop.sitemaps.length > 0 ? (
                                        <div className="flex flex-col items-center">
                                            <span>{prop.sitemaps.length}</span>
                                            {prop.sitemaps.some(s => s.status === 'has_errors') && <span className="text-[10px] text-rose-400">Has Errors</span>}
                                        </div>
                                    ) : <span className="text-gray-600">-</span>}
                                </td>
                                <td className="p-4">
                                    {prop.coverageIssues.length > 0 ? (
                                        <span className="text-amber-400 text-xs">{prop.coverageIssues.length} issue types</span>
                                    ) : (
                                        <span className="text-emerald-500 text-xs">Clean</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Linking & Issues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-indigo-400" /> GA4 Association
                </h3>
                <div className="space-y-3">
                    {result.linkingStatus.map((link, i) => (
                        <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${link.linked ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'}`}>
                                    {link.linked ? 'Linked' : 'Not Linked'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-1">GA: <span className="text-white">{link.gaProperty}</span></p>
                            <p className="text-xs text-gray-400">GSC: <span className="text-white">{link.gscProperty}</span></p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400" /> Critical Findings
                </h3>
                {result.sitemapIssues.length > 0 ? (
                    <ul className="space-y-2">
                        {result.sitemapIssues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-rose-900/10 p-2 rounded border border-rose-900/30">
                                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                {issue}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-sm">No critical sitemap issues found.</p>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Total Coverage Issues</span>
                        <span className="text-xl font-bold text-white">{result.totalCoverageIssues}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SearchConsoleAudit;