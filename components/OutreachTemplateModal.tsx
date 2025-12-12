import React, { useState } from 'react';
import { LinkOpportunity } from '../types';
import { X, Copy, Check, Mail } from 'lucide-react';

interface OutreachTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: LinkOpportunity | null;
  yourDomain: string;
}

const OutreachTemplateModal: React.FC<OutreachTemplateModalProps> = ({ isOpen, onClose, opportunity, yourDomain }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !opportunity) return null;

  const getTemplate = () => {
    switch (opportunity.linkType) {
        case 'directory':
            return {
                subject: `Listing inquiry for ${yourDomain}`,
                body: `Hi there,\n\nI was browsing your directory at ${opportunity.linkingDomain} and noticed you have a comprehensive list of local businesses.\n\nI represent ${yourDomain}, a local restoration service provider. We aren't currently listed in your directory, although several of our competitors are.\n\nCould you let me know the process for getting our business added to your resource? We would love to ensure your visitors have access to our emergency services information.\n\nBest regards,\n[Your Name]`
            };
        case 'resource':
            return {
                subject: `Additional resource for your page`,
                body: `Hello,\n\nI've been reading through your resources on ${opportunity.linkingDomain} and found your guide very helpful. I noticed you link to a few restoration companies.\n\nWe recently published a comprehensive guide on water damage prevention that would be a great value-add for your readers. You can see it here: https://${yourDomain}/guide\n\nWould you be open to including it as an additional resource?\n\nThanks,\n[Your Name]`
            };
        case 'editorial':
        case 'news':
            return {
                subject: `Story idea / Local expert for ${opportunity.linkingDomain}`,
                body: `Hi [Editor Name],\n\nI'm reaching out from ${yourDomain}. I saw your recent piece covering local home maintenance issues.\n\nWith storm season approaching, I thought you might be interested in a local expert perspective on flood prevention. We've seen a 30% increase in basement flooding calls this year and have some unique data to share.\n\nWould you be interested in a brief interview or a guest contribution on this topic?\n\nBest,\n[Your Name]`
            };
        default:
            return {
                subject: `Partnership opportunity with ${yourDomain}`,
                body: `Hi,\n\nI'm reaching out from ${yourDomain}. We admire the work you do at ${opportunity.linkingDomain}.\n\nWe noticed you feature some of our peers in the industry. We'd love to explore how we might work together or be featured on your site.\n\nAre you open to a brief chat about partnership opportunities?\n\nBest,\n[Your Name]`
            };
    }
  };

  const template = getTemplate();

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161b22] border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" /> Outreach Template
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <p className="text-sm text-gray-500 mb-1 uppercase font-semibold">Target</p>
                <p className="text-white font-medium">{opportunity.linkingDomain} <span className="text-gray-500">({opportunity.linkType})</span></p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Subject Line</label>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm">
                    {template.subject}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Body</label>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-white text-sm whitespace-pre-wrap h-64 overflow-y-auto">
                    {template.body}
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
                Close
            </button>
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OutreachTemplateModal;