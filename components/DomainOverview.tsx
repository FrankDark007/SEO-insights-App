import React, { useState, useEffect } from 'react';
import { getAhrefsConfig, getDomainOverview, getDRHistory } from '../services/ahrefsService';
import { AhrefsDomainOverview, AhrefsDRHistory } from '../types';
import DRHistoryChart from './DRHistoryChart';
import { Shield, Link2, Users, Search, DollarSign, Loader2 } from 'lucide-react';

const DomainOverview: React.FC = () => {
  const [data, setData] = useState<AhrefsDomainOverview | null>(null);
  const [history, setHistory] = useState<AhrefsDRHistory[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
      const config = getAhrefsConfig();
      if (config.primaryDomain) {
          loadData(config.primaryDomain);
      }
  }, []);

  const loadData = async (domain: string) => {
      setLoading(true);
      try {
          const overview = await getDomainOverview(domain);
          const hist = await getDRHistory(domain);
          setData(overview);
          setHistory(hist);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  if (!getAhrefsConfig().primaryDomain) {
      return <div className="text-center py-10 text-gray-500">Please configure a primary domain in settings first.</div>;
  }

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-400">Fetching Ahrefs data...</p>
          </div>
      );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* DR Card */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield className="w-16 h-16 text-amber-500" />
                </div>
                <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Domain Rating</p>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">{data.domainRating}</span>
                    <span className="text-amber-500 text-sm mb-1 font-bold">DR</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${data.domainRating}%` }}></div>
                </div>
            </div>

            {/* Backlinks Card */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Link2 className="w-16 h-16 text-emerald-500" />
                </div>
                <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Backlinks</p>
                <p className="text-3xl font-bold text-white">{data.backlinks.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">from <span className="text-emerald-400 font-bold">{data.referringDomains.toLocaleString()}</span> domains</p>
            </div>

            {/* Traffic Card */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users className="w-16 h-16 text-cyan-500" />
                </div>
                <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Organic Traffic</p>
                <p className="text-3xl font-bold text-white">{data.organicTraffic.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">est. monthly visits</p>
            </div>

            {/* Keywords Card */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Search className="w-16 h-16 text-violet-500" />
                </div>
                <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Keywords</p>
                <p className="text-3xl font-bold text-white">{data.organicKeywords.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">ranking in top 100</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DRHistoryChart data={history} />
            
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-emerald-900/20 p-3 rounded-xl text-emerald-400">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Traffic Value</h3>
                        <p className="text-xs text-gray-400">Equivalent PPC Cost</p>
                    </div>
                </div>
                <div className="text-center">
                    <span className="text-5xl font-black text-emerald-400 tracking-tight">
                        ${data.trafficValue.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">/mo</span>
                </div>
                <p className="text-center text-gray-400 text-sm mt-4 px-8">
                    This is what you would have to pay in Google Ads to get the same amount of traffic your organic keywords bring in.
                </p>
            </div>
        </div>
    </div>
  );
};

export default DomainOverview;