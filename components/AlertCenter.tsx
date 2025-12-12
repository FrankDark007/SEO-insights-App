import React from 'react';
import { RichResultAlert } from '../types';
import { Bell, X } from 'lucide-react';

interface AlertCenterProps {
  alerts: RichResultAlert[];
  onDismiss: (id: string) => void;
}

const AlertCenter: React.FC<AlertCenterProps> = ({ alerts, onDismiss }) => {
  const unreadAlerts = alerts.filter(a => !a.read);
  
  if (unreadAlerts.length === 0) return null;

  return (
    <div className="mb-8 space-y-3">
        {unreadAlerts.map(alert => (
            <div key={alert.id} className="bg-gradient-to-r from-indigo-900/20 to-gray-900/20 border border-indigo-500/30 rounded-xl p-4 flex items-start gap-4 shadow-lg animate-fade-in">
                <div className="bg-indigo-500/20 p-2 rounded-full text-indigo-400 shrink-0">
                    <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-white mb-1">Alert: {alert.type.replace('_', ' ').toUpperCase()}</h4>
                    <p className="text-sm text-gray-300">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(alert.date).toLocaleString()}</p>
                </div>
                <button onClick={() => onDismiss(alert.id)} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        ))}
    </div>
  );
};

export default AlertCenter;