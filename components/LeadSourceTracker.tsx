import React, { useState, useEffect } from 'react';
import { getLeads, addLead, updateLead, deleteLead, calculateStats, getSettings } from '../services/leadTrackerService';
import { Lead, LeadStats, LeadSettings } from '../types';
import LeadSummaryCards from './LeadSummaryCards';
import LeadSourceChart from './LeadSourceChart';
import MonthlyTrendChart from './MonthlyTrendChart';
import LeadTable from './LeadTable';
import LeadForm from './LeadForm';
import LeadTimeline from './LeadTimeline';
import { 
  Users, 
  Plus, 
  Filter, 
  Download, 
  BarChart2, 
  List, 
  Activity,
  Target
} from 'lucide-react';

const LeadSourceTracker: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [settings, setSettings] = useState<LeadSettings | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'list' | 'timeline'>('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedLeads = getLeads();
    const loadedSettings = getSettings();
    setLeads(loadedLeads);
    setStats(calculateStats(loadedLeads));
    setSettings(loadedSettings);
  };

  const handleAddLead = (leadData: any) => {
    addLead(leadData);
    loadData();
  };

  const handleUpdateLead = (leadData: any) => {
    if (editingLead) {
        updateLead(editingLead.id, leadData);
        loadData();
        setEditingLead(null);
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Delete this lead?')) {
        deleteLead(id);
        loadData();
    }
  };

  const handleEditClick = (lead: Lead) => {
      setEditingLead(lead);
      setIsFormOpen(true);
  };

  const handleFormClose = () => {
      setIsFormOpen(false);
      setEditingLead(null);
  };

  if (!stats || !settings) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Lead Source Tracker
            <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30 font-normal">
                ROI Attribution
            </span>
          </h2>
          <p className="text-gray-400">Connect SEO traffic to real revenue and business growth.</p>
        </div>
        <div className="flex gap-3">
            <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
                <button onClick={() => setViewMode('dashboard')} className={`p-2 rounded ${viewMode === 'dashboard' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}><Activity className="w-4 h-4"/></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}><List className="w-4 h-4"/></button>
                <button onClick={() => setViewMode('timeline')} className={`p-2 rounded ${viewMode === 'timeline' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}><BarChart2 className="w-4 h-4"/></button>
            </div>
            <button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
                <Plus className="w-4 h-4"/> Add Lead
            </button>
        </div>
      </div>

      <LeadSummaryCards summary={stats.summary} />

      {viewMode === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadSourceChart data={stats.bySource} />
              <MonthlyTrendChart data={stats.monthlyTrend} />
              
              {/* Top Pages Table */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-400" /> Top Converting Pages
                  </h3>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                          <thead>
                              <tr className="text-gray-500 border-b border-gray-800">
                                  <th className="pb-2">Page</th>
                                  <th className="pb-2 text-center">Leads</th>
                                  <th className="pb-2 text-center">Conv. Rate</th>
                                  <th className="pb-2 text-right">Revenue</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                              {stats.byPage.map((page, i) => (
                                  <tr key={i}>
                                      <td className="py-3 text-white truncate max-w-[200px]">{page.page}</td>
                                      <td className="py-3 text-center text-gray-300">{page.leads}</td>
                                      <td className="py-3 text-center text-emerald-400">{page.conversionRate}%</td>
                                      <td className="py-3 text-right text-gray-300">${page.revenue.toLocaleString()}</td>
                                  </tr>
                              ))}
                              {stats.byPage.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-500">No page data yet</td></tr>}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* By Service Table */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" /> Performance by Service
                  </h3>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                          <thead>
                              <tr className="text-gray-500 border-b border-gray-800">
                                  <th className="pb-2">Service</th>
                                  <th className="pb-2 text-center">Leads</th>
                                  <th className="pb-2 text-center">Avg Value</th>
                                  <th className="pb-2 text-right">Revenue</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                              {stats.byService.map((svc, i) => (
                                  <tr key={i}>
                                      <td className="py-3 text-white">{svc.service}</td>
                                      <td className="py-3 text-center text-gray-300">{svc.leads}</td>
                                      <td className="py-3 text-center text-gray-300">${svc.avgValue.toLocaleString()}</td>
                                      <td className="py-3 text-right text-emerald-400">${svc.totalRevenue.toLocaleString()}</td>
                                  </tr>
                              ))}
                              {stats.byService.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-500">No service data yet</td></tr>}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {viewMode === 'list' && (
          <LeadTable leads={leads} onEdit={handleEditClick} onDelete={handleDeleteLead} />
      )}

      {viewMode === 'timeline' && (
          <div className="max-w-3xl mx-auto">
              <LeadTimeline leads={leads} onEdit={handleEditClick} />
          </div>
      )}

      <LeadForm 
        isOpen={isFormOpen} 
        onClose={handleFormClose} 
        onSubmit={editingLead ? handleUpdateLead : handleAddLead}
        initialData={editingLead}
        settings={settings}
      />
    </div>
  );
};

export default LeadSourceTracker;
