import React from 'react';
import { LeadStats } from '../types';
import { Users, CheckCircle2, Clock, XCircle, DollarSign, TrendingUp } from 'lucide-react';

interface LeadSummaryCardsProps {
  summary: LeadStats['summary'];
}

const LeadSummaryCards: React.FC<LeadSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider">
            <Users className="w-4 h-4 text-indigo-400" /> Total Leads
        </div>
        <p className="text-2xl font-bold text-white">{summary.totalLeads}</p>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Won Leads
        </div>
        <p className="text-2xl font-bold text-emerald-400">{summary.wonLeads}</p>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-amber-400" /> Pending
        </div>
        <p className="text-2xl font-bold text-amber-400">{summary.pendingLeads}</p>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider">
            <XCircle className="w-4 h-4 text-rose-400" /> Lost
        </div>
        <p className="text-2xl font-bold text-rose-400">{summary.lostLeads}</p>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg col-span-2 md:col-span-1 lg:col-span-2">
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Revenue
        </div>
        <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-white">${summary.totalRevenue.toLocaleString()}</p>
            <span className="text-xs text-gray-500 mb-1">({summary.winRate}% Win Rate)</span>
        </div>
      </div>
    </div>
  );
};

export default LeadSummaryCards;
