import React, { useState, useEffect } from 'react';
import { Lead, LeadSettings } from '../types';
import { X, Save } from 'lucide-react';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: any) => void;
  initialData?: Lead | null;
  settings: LeadSettings;
}

const LeadForm: React.FC<LeadFormProps> = ({ isOpen, onClose, onSubmit, initialData, settings }) => {
  const [formData, setFormData] = useState<any>({
    dateTime: new Date().toISOString().slice(0, 16),
    leadType: 'phone',
    contactName: '',
    phoneNumber: '',
    serviceNeeded: settings.services[0],
    city: settings.cities[0],
    source: settings.sources[0],
    landingPage: '',
    keyword: '',
    leadValue: settings.defaultLeadValue,
    status: 'new',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
            ...initialData,
            dateTime: new Date(initialData.dateTime).toISOString().slice(0, 16)
        });
      } else {
        // Reset for new lead
        setFormData({
            dateTime: new Date().toISOString().slice(0, 16),
            leadType: 'phone',
            contactName: '',
            phoneNumber: '',
            serviceNeeded: settings.services[0],
            city: settings.cities[0],
            source: settings.sources[0],
            landingPage: '',
            keyword: '',
            leadValue: settings.defaultLeadValue,
            status: 'new',
            notes: ''
        });
      }
    }
  }, [isOpen, initialData, settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        ...formData,
        leadValue: Number(formData.leadValue)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161b22] border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-[#161b22] z-10">
          <h3 className="text-xl font-bold text-white">
            {initialData ? 'Edit Lead' : 'Add New Lead'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Date & Time</label>
                  <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Lead Type</label>
                  <select name="leadType" value={formData.leadType} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                      <option value="phone">Phone Call</option>
                      <option value="form">Form Submission</option>
                      <option value="chat">Chat</option>
                      <option value="email">Email</option>
                  </select>
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Contact Name</label>
                  <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                  <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Service Needed</label>
                  <select name="serviceNeeded" value={formData.serviceNeeded} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                      {settings.services.map(s => <option key={s} value={s}>{s}</option>)}
                      <option value="Other">Other</option>
                  </select>
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">City / Location</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" list="city-list" />
                  <datalist id="city-list">
                      {settings.cities.map(c => <option key={c} value={c} />)}
                  </datalist>
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Source</label>
                  <select name="source" value={formData.source} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                      {settings.sources.map(s => <option key={s} value={s}>{s}</option>)}
                      <option value="Other">Other</option>
                  </select>
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Lead Value ($)</label>
                  <input type="number" name="leadValue" value={formData.leadValue} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Landing Page URL (Optional)</label>
                  <input type="text" name="landingPage" value={formData.landingPage} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="/service-page" />
              </div>
              <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Keyword (Optional)</label>
                  <input type="text" name="keyword" value={formData.keyword} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="e.g. water damage arlington" />
              </div>
              <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-800 border-gray-600">
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                  </select>
              </div>
              <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-24 resize-none" />
              </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" /> Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;