import React, { useState, useEffect } from 'react';
import { generateChecklist, verifyChecklistItem } from '../services/cleanupService';
import { auditAllProperties } from '../services/analyticsService';
import { auditGSCProperties } from '../services/searchConsoleService';
import { ChecklistItem as ChecklistItemType, VerificationResult } from '../types';
import ChecklistItem from './ChecklistItem';
import VerificationModal from './VerificationModal';
import { ListChecks, Loader2, CheckCircle2 } from 'lucide-react';

const CleanupChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [modalData, setModalData] = useState<{item: ChecklistItemType, result: VerificationResult} | null>(null);

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    try {
        const gaAudit = await auditAllProperties();
        const gscAudit = await auditGSCProperties();
        const list = generateChecklist(gaAudit, gscAudit);
        setItems(list);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleVerify = async (item: ChecklistItemType) => {
      setVerifyingId(item.id);
      try {
          const result = await verifyChecklistItem(item);
          setModalData({ item, result });
          
          if (result.passed) {
              setItems(prev => prev.map(i => i.id === item.id ? { 
                  ...i, 
                  status: 'verified', 
                  verifiedAt: new Date().toISOString() 
              } : i));
          } else {
              setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'in_progress' } : i));
          }
      } catch (e) {
          console.error(e);
      } finally {
          setVerifyingId(null);
      }
  };

  const completedCount = items.filter(i => i.status === 'verified' || i.status === 'completed').length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-400">Generating cleanup checklist...</p>
          </div>
      );
  }

  if (items.length === 0) {
      return (
          <div className="text-center py-20 bg-[#161b22] border border-gray-800 rounded-xl">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">All Clear!</h3>
              <p className="text-gray-400">No critical issues found in your Google setup.</p>
          </div>
      );
  }

  const groupedItems = {
      critical: items.filter(i => i.priority === 'critical'),
      high: items.filter(i => i.priority === 'high'),
      medium: items.filter(i => i.priority === 'medium'),
      low: items.filter(i => i.priority === 'low'),
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Progress Header */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-end mb-2">
              <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ListChecks className="w-5 h-5 text-indigo-400" /> Cleanup Checklist
                  </h3>
                  <p className="text-sm text-gray-400">Resolve these issues to ensure accurate data.</p>
              </div>
              <span className="text-2xl font-bold text-indigo-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
          </div>
      </div>

      <div className="space-y-6">
          {Object.entries(groupedItems).map(([priority, list]) => (
              list.length > 0 && (
                  <div key={priority}>
                      <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 ml-1">{priority} Priority</h4>
                      <div className="space-y-3">
                          {list.map(item => (
                              <ChecklistItem 
                                key={item.id} 
                                item={item} 
                                onVerify={handleVerify}
                                verifying={verifyingId === item.id}
                              />
                          ))}
                      </div>
                  </div>
              )
          ))}
      </div>

      <VerificationModal 
        isOpen={!!modalData} 
        onClose={() => setModalData(null)}
        item={modalData?.item || null}
        result={modalData?.result || null}
      />
    </div>
  );
};

export default CleanupChecklist;