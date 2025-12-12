import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { getTriggerConfiguration, saveTriggerConfiguration } from '../services/weatherTriggerService';
import { TriggerConfig } from '../types';

interface TriggerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TriggerConfigModal: React.FC<TriggerConfigModalProps> = ({ isOpen, onClose }) => {
  const [triggers, setTriggers] = useState<TriggerConfig[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTriggers(getTriggerConfiguration());
    }
  }, [isOpen]);

  const handleSave = () => {
    saveTriggerConfiguration(triggers);
    onClose();
  };

  const handleToggle = (id: string) => {
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161b22] border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Trigger Configuration</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
            <div className="overflow-hidden rounded-xl border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-900 text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="p-4 font-semibold">Trigger Name</th>
                            <th className="p-4 font-semibold">Condition</th>
                            <th className="p-4 font-semibold">Risk Level</th>
                            <th className="p-4 font-semibold text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-[#0d1117]">
                        {triggers.map((trigger) => (
                            <tr key={trigger.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="p-4 font-medium text-white">{trigger.type}</td>
                                <td className="p-4 text-sm text-gray-400">{trigger.condition}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                                        trigger.riskLevel === 'critical' ? 'bg-rose-900/30 text-rose-400' :
                                        trigger.riskLevel === 'high' ? 'bg-orange-900/30 text-orange-400' :
                                        'bg-yellow-900/30 text-yellow-400'
                                    }`}>
                                        {trigger.riskLevel}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleToggle(trigger.id)}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${trigger.enabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${trigger.enabled ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriggerConfigModal;