import React from 'react';
import { Lead } from '../types';
import { Edit2, Trash2 } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete }) => {
  const getStatusBadge = (status: string) => {
      switch (status) {
          case 'won': return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold uppercase">Won</span>;
          case 'lost': return <span className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded text-xs font-bold uppercase">Lost</span>;
          case 'quoted': return <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs font-bold uppercase">Quoted</span>;
          case 'contacted': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold uppercase">Contacted</span>;
          default: return <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded text-xs font-bold uppercase">New</span>;
      }
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Service</th>
              <th className="p-4 font-semibold">Source</th>
              <th className="p-4 font-semibold">Value</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 text-gray-400 text-sm whitespace-nowrap">
                    {new Date(lead.dateTime).toLocaleDateString()}
                    <span className="block text-xs opacity-50">{new Date(lead.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </td>
                <td className="p-4 text-white font-medium">
                    {lead.contactName}
                    <span className="block text-xs text-gray-500">{lead.city}</span>
                </td>
                <td className="p-4 text-gray-300 text-sm">{lead.serviceNeeded}</td>
                <td className="p-4 text-gray-300 text-sm">
                    {lead.source}
                    {lead.landingPage && <span className="block text-xs text-indigo-400 truncate max-w-[150px]">{lead.landingPage}</span>}
                </td>
                <td className="p-4 text-white font-mono">${lead.leadValue.toLocaleString()}</td>
                <td className="p-4 text-center">{getStatusBadge(lead.status)}</td>
                <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => onEdit(lead)}
                            className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => onDelete(lead.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-red-900/20 rounded transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
                <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                        No leads recorded yet.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
