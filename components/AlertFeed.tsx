import React from 'react';
import { Alert } from '../types';
import CompetitorDiff from './CompetitorDiff';
import { 
  AlertCircle, 
  FilePlus, 
  Edit3, 
  Star, 
  MapPin, 
  Link2, 
  CheckCircle2, 
  Clock, 
  Zap,
  Globe,
  Code
} from 'lucide-react';

interface AlertFeedProps {
  alerts: Alert[];
  onMarkAddressed: (id: string) => void;
}

const AlertFeed: React.FC<AlertFeedProps> = ({ alerts, onMarkAddressed }) => {
  if (!alerts || alerts.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-[#161b22] border border-gray-800 rounded-xl">
            <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
            <p>No alerts detected yet.</p>
            <p className="text-sm">Add competitors to start monitoring.</p>
        </div>
    );
  }

  const getIcon = (type: Alert['type']) => {
      switch (type) {
          case 'new_page': return <FilePlus className="w-5 h-5 text-emerald-400" />;
          case 'title_change': return <Edit3 className="w-5 h-5 text-amber-400" />;
          case 'meta_change': return <Code className="w-5 h-5 text-indigo-400" />;
          case 'review_change': 
          case 'rating_change': return <Star className="w-5 h-5 text-yellow-400" />;
          case 'gbp_post': return <MapPin className="w-5 h-5 text-rose-400" />;
          case 'new_backlink': return <Link2 className="w-5 h-5 text-cyan-400" />;
          case 'baseline': return <Globe className="w-5 h-5 text-gray-400" />;
          default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
      }
  };

  const getTypeLabel = (type: Alert['type']) => {
      switch (type) {
          case 'new_page': return 'New Page Detected';
          case 'title_change': return 'Title Tag Changed';
          case 'meta_change': return 'Meta Description Changed';
          case 'review_change': return 'Review Milestone';
          case 'rating_change': return 'Rating Change';
          case 'gbp_post': return 'GBP Update';
          case 'new_backlink': return 'Backlink Activity';
          case 'baseline': return 'Monitoring Started';
          default: return 'Alert';
      }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div 
            key={alert.id} 
            className={`relative overflow-hidden rounded-xl border transition-all ${
                alert.addressed 
                ? 'bg-gray-900/30 border-gray-800 opacity-60 hover:opacity-100' 
                : 'bg-[#161b22] border-gray-700 shadow-lg'
            }`}
        >
            {/* Severity Indicator */}
            {!alert.addressed && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    alert.severity === 'high' ? 'bg-rose-500' : 
                    alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>
            )}

            <div className="p-5 pl-7">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${alert.addressed ? 'bg-gray-800' : 'bg-gray-800/80 border border-gray-700'}`}>
                            {getIcon(alert.type)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className={`font-bold ${alert.addressed ? 'text-gray-400' : 'text-white'}`}>
                                    {getTypeLabel(alert.type)}
                                </h4>
                                <span className="text-xs text-gray-500 font-normal px-2 py-0.5 bg-gray-800 rounded-full border border-gray-700">
                                    {alert.competitor}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {new Date(alert.detectedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    
                    {!alert.addressed ? (
                        <button 
                            onClick={() => onMarkAddressed(alert.id)}
                            className="flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-900/20 hover:bg-emerald-900/40 px-3 py-1.5 rounded-lg transition-colors border border-emerald-900/50"
                        >
                            <CheckCircle2 className="w-3 h-3" /> Mark Addressed
                        </button>
                    ) : (
                        <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-800 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Resolved
                        </span>
                    )}
                </div>

                <CompetitorDiff alert={alert} />

                {alert.recommendedResponse && (
                    <div className="mt-4 flex items-start gap-2 text-sm bg-indigo-900/10 border border-indigo-500/20 p-3 rounded-lg text-indigo-200">
                        <Zap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <p>{alert.recommendedResponse}</p>
                    </div>
                )}
            </div>
        </div>
      ))}
    </div>
  );
};

export default AlertFeed;