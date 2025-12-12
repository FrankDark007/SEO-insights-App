import React, { useState } from 'react';
import { normalizeUrl } from '../services/utils';
import { X, Plus, Globe } from 'lucide-react';

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (domain: string) => void;
}

const AddCompetitorModal: React.FC<AddCompetitorModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [domain, setDomain] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain) {
      onAdd(normalizeUrl(domain.trim()));
      setDomain('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161b22] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Monitor Competitor
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Competitor Domain</label>
            <div className="relative">
                <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="competitor.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
                required
                />
            </div>
            <p className="text-xs text-gray-500 mt-2">Enter the root domain. We'll crawl key pages automatically.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Start Monitoring
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompetitorModal;