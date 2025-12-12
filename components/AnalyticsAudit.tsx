import React, { useState, useEffect } from 'react';
import { auditAllProperties } from '../services/analyticsService';
import { GAAuditResult } from '../types';
import { Loader2, AlertTriangle, CheckCircle, Activity, Tag, BarChart } from 'lucide-react';

const AnalyticsAudit: React.FC = () => {
  const [result, setResult] = useState<GAAuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    try {
      const data = await auditAllProperties();
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
              <p className="text-gray-400">Auditing Google Analytics Properties...</p>
          </div>
      );
  }

  if (!result) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase mb-1">Health Score</p>
              <div className="flex items-end gap-2">
                  <span className={`text-3xl font-bold ${result.overallHealthScore > 80 ? 'text-emerald-400' : result.overallHealthScore > 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {result.overallHealthScore}
                  </span>
                  <span className="text-sm text-gray-500 mb-1">/100</span>
              </div>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase mb-1">Properties</p>
              <span className="text-2xl font-bold text-white">{result.properties.length}</span>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase mb-1">Tracking Issues</p>
              <span className={`text-2xl font-bold ${result.trackingIssues.filter(i => i.issues.length > 0).length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.trackingIssues.filter(i => i.issues.length > 0).length}
              </span>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase mb-1">Duplicates</p>
              <span className={`text-2xl font-bold ${result.duplicates.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {result.duplicates.length}
              </span>
          </div>
      </div>

      {/* Property List */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-900/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-indigo-400" /> Property Overview
              </h3>
          </div>
          <table className="w-full text-left text-sm">
              <thead className="bg-gray-900 text-xs text-gray-400 uppercase">
                  <tr>
                      <th className="p-4">Property Name</th>
                      <th className="p-4">ID</th>
                      <th className="p-4 text-center">Streams</th>
                      <th className="p-4">Status</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                  {result.properties.map((prop) => (
                      <tr key={prop.propertyId}>
                          <td className="p-4 font-medium text-white">{prop.displayName}</td>
                          <td className="p-4 text-gray-400 font-mono text-xs">{prop.propertyId}</td>
                          <td className="p-4 text-center text-gray-300">{prop.dataStreams.length}</td>
                          <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                                  prop.status === 'active' ? 'bg-emerald-900/30 text-emerald-400' : 
                                  prop.status === 'duplicate' ? 'bg-amber-900/30 text-amber-400' : 'bg-gray-800 text-gray-400'
                              }`}>
                                  {prop.status}
                              </span>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* Issues Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-violet-400" /> Tracking Installation
              </h3>
              <div className="space-y-3">
                  {result.trackingIssues.map((issue, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                          <div>
                              <p className="text-white font-medium text-sm">{issue.domain}</p>
                              {issue.issues.length > 0 ? (
                                  <p className="text-xs text-rose-400 mt-1">{issue.issues.join(', ')}</p>
                              ) : (
                                  <p className="text-xs text-emerald-400 mt-1">Installed Correctly</p>
                              )}
                          </div>
                          {issue.hasTag ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-rose-500" />}
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" /> Conversion Tracking
              </h3>
              <div className="space-y-3">
                  {result.conversionIssues.map((conv, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                          <div>
                              <p className="text-white font-medium text-sm">{conv.name}</p>
                              <p className="text-xs text-gray-500 font-mono mt-1">{conv.event}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                              conv.status === 'working' ? 'bg-emerald-900/30 text-emerald-400' :
                              conv.status === 'misconfigured' ? 'bg-rose-900/30 text-rose-400' : 'bg-gray-800 text-gray-400'
                          }`}>
                              {conv.status}
                          </span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default AnalyticsAudit;