import React, { useState } from 'react';
import { WeatherAlert } from '../types';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Send, 
  Megaphone 
} from 'lucide-react';

interface WeatherAlertCardProps {
  alert: WeatherAlert;
}

const WeatherAlertCard: React.FC<WeatherAlertCardProps> = ({ alert }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'ads' | 'email' | 'social'>('checklist');
  const [copied, setCopied] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
      switch (severity) {
          case 'critical': return 'border-rose-500 bg-rose-900/10';
          case 'high': return 'border-orange-500 bg-orange-900/10';
          default: return 'border-yellow-500 bg-yellow-900/10';
      }
  };

  const getIconColor = (severity: string) => {
      switch (severity) {
          case 'critical': return 'text-rose-500';
          case 'high': return 'text-orange-500';
          default: return 'text-yellow-500';
      }
  };

  const copyToClipboard = (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={`border-l-4 rounded-r-xl overflow-hidden mb-4 transition-all duration-300 ${getSeverityColor(alert.severity)}`}>
      <div className="p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#161b22]">
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={`w-5 h-5 ${getIconColor(alert.severity)}`} />
                <h3 className="font-bold text-white text-lg">{alert.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    alert.severity === 'critical' ? 'bg-rose-500 text-white' : 
                    alert.severity === 'high' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-black'
                }`}>
                    {alert.severity} Risk
                </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{alert.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{alert.affectedCities.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.startTime} - {alert.endTime}</span>
                </div>
            </div>
        </div>
        
        <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors text-sm font-medium whitespace-nowrap"
        >
            {expanded ? 'Hide Actions' : 'Take Action'}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
          <div className="bg-[#0d1117] border-t border-gray-800 p-6">
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-800">
                  <button 
                    onClick={() => setActiveTab('checklist')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'checklist' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                      <CheckCircle2 className="w-4 h-4" /> Action Checklist
                  </button>
                  <button 
                    onClick={() => setActiveTab('ads')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'ads' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                      <Megaphone className="w-4 h-4" /> Google Ads
                  </button>
                  <button 
                    onClick={() => setActiveTab('email')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'email' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                      <Send className="w-4 h-4" /> Email Blast
                  </button>
                  <button 
                    onClick={() => setActiveTab('social')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'social' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                      <ShareIcon className="w-4 h-4" /> Social/Web
                  </button>
              </div>

              <div className="animate-fade-in">
                  {activeTab === 'checklist' && (
                      <div className="space-y-3">
                          {alert.recommendedActions.map((action, i) => (
                              <label key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors">
                                  <input type="checkbox" className="mt-1 w-4 h-4 rounded bg-gray-900 border-gray-700 text-indigo-600 focus:ring-indigo-500" />
                                  <span className="text-sm text-gray-300">{action}</span>
                              </label>
                          ))}
                      </div>
                  )}

                  {activeTab === 'ads' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-500 uppercase">Headlines</h4>
                              {alert.campaignTemplates.googleAds.headlines.map((headline, i) => (
                                  <div key={i} className="flex items-center gap-2 group">
                                      <div className="bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white flex-1">{headline}</div>
                                      <button onClick={() => copyToClipboard(headline, `hl-${i}`)} className="text-gray-500 hover:text-white p-1">
                                          {copied === `hl-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                      </button>
                                  </div>
                              ))}
                          </div>
                          <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-500 uppercase">Descriptions</h4>
                              {alert.campaignTemplates.googleAds.descriptions.map((desc, i) => (
                                  <div key={i} className="flex items-center gap-2 group">
                                      <div className="bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white flex-1">{desc}</div>
                                      <button onClick={() => copyToClipboard(desc, `desc-${i}`)} className="text-gray-500 hover:text-white p-1">
                                          {copied === `desc-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {activeTab === 'email' && (
                      <div className="space-y-4">
                          <div>
                              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Subject Lines</h4>
                              <div className="space-y-2">
                                  {alert.campaignTemplates.email.subjectLines.map((sl, i) => (
                                      <div key={i} className="flex items-center gap-2">
                                          <div className="bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white flex-1">{sl}</div>
                                          <button onClick={() => copyToClipboard(sl, `sl-${i}`)} className="text-gray-500 hover:text-white p-1">
                                              {copied === `sl-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-xs font-bold text-gray-500 uppercase">Email Body</h4>
                                  <button onClick={() => copyToClipboard(alert.campaignTemplates.email.bodyHtml, 'email-body')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                      {copied === 'email-body' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy Body
                                  </button>
                              </div>
                              <div className="bg-gray-900 border border-gray-700 rounded p-4 text-sm text-gray-300 whitespace-pre-wrap">
                                  {alert.campaignTemplates.email.bodyHtml}
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'social' && (
                      <div className="space-y-4">
                          <div>
                              <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-xs font-bold text-gray-500 uppercase">Google Business Profile Post</h4>
                                  <button onClick={() => copyToClipboard(alert.campaignTemplates.gbpPost, 'gbp')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                      {copied === 'gbp' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                                  </button>
                              </div>
                              <div className="bg-gray-900 border border-gray-700 rounded p-3 text-sm text-white">
                                  {alert.campaignTemplates.gbpPost}
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-xs font-bold text-gray-500 uppercase">Homepage Banner</h4>
                                  <button onClick={() => copyToClipboard(alert.campaignTemplates.homepageBanner, 'banner')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                      {copied === 'banner' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                                  </button>
                              </div>
                              <div className="bg-rose-900/30 border border-rose-500/50 rounded p-3 text-sm text-rose-100 text-center font-bold">
                                  {alert.campaignTemplates.homepageBanner}
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

// Helper icon since it's not imported above to avoid clutter
const ShareIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
);

export default WeatherAlertCard;