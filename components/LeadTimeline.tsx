import React from 'react';
import { Lead } from '../types';
import { Phone, MessageSquare, Mail, FormInput, Edit2 } from 'lucide-react';

interface LeadTimelineProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({ leads, onEdit }) => {
  const getIcon = (type: string) => {
      switch (type) {
          case 'phone': return <Phone className="w-4 h-4" />;
          case 'chat': return <MessageSquare className="w-4 h-4" />;
          case 'email': return <Mail className="w-4 h-4" />;
          default: return <FormInput className="w-4 h-4" />;
      }
  };

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'won': return 'bg-emerald-500';
          case 'lost': return 'bg-rose-500';
          case 'quoted': return 'bg-amber-500';
          default: return 'bg-gray-500';
      }
  };

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getStatusColor(lead.status)} shadow-lg z-10`}>
                    {getIcon(lead.leadType)}
                </div>
                <div className="w-0.5 bg-gray-800 h-full -my-2"></div>
            </div>
            
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 flex-1 shadow-md mb-4 hover:border-gray-700 transition-colors relative">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-white">{lead.contactName}</h4>
                        <p className="text-xs text-gray-500">{new Date(lead.dateTime).toLocaleString()}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-gray-300">${lead.leadValue.toLocaleString()}</span>
                </div>
                
                <div className="text-sm text-gray-300 mb-2">
                    <span className="font-semibold text-indigo-400">{lead.serviceNeeded}</span> in <span className="text-gray-400">{lead.city}</span>
                </div>
                
                <div className="text-xs text-gray-500 bg-gray-900/50 p-2 rounded border border-gray-800">
                    <p>Source: <span className="text-gray-300">{lead.source}</span></p>
                    {lead.landingPage && <p className="truncate">Page: {lead.landingPage}</p>}
                    {lead.keyword && <p>Keyword: "{lead.keyword}"</p>}
                </div>

                <button 
                    onClick={() => onEdit(lead)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
            </div>
        </div>
      ))}
    </div>
  );
};

export default LeadTimeline;
