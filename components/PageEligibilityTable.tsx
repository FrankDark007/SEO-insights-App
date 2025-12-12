import React from 'react';
import { PageEligibility } from '../types';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface PageEligibilityTableProps {
  pages: PageEligibility[];
}

const PageEligibilityTable: React.FC<PageEligibilityTableProps> = ({ pages }) => {
  const getIcon = (eligible: boolean, reason?: string) => {
      if (eligible) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      if (reason && reason.includes('Missing')) return <XCircle className="w-4 h-4 text-rose-500" />;
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-xs text-gray-400 uppercase">
              <th className="p-4 font-semibold">Page URL</th>
              <th className="p-4 font-semibold">Current Schema</th>
              <th className="p-4 font-semibold text-center">Review Stars</th>
              <th className="p-4 font-semibold text-center">FAQ</th>
              <th className="p-4 font-semibold text-center">Breadcrumbs</th>
              <th className="p-4 font-semibold text-right">Issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {pages.map((page, i) => {
                const reviews = page.eligibility.find(e => e.featureType === 'Review Stars');
                const faq = page.eligibility.find(e => e.featureType === 'FAQ Dropdowns');
                const breadcrumbs = page.eligibility.find(e => e.featureType === 'Breadcrumbs');

                return (
                  <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                        <p className="text-sm font-medium text-white truncate max-w-[250px]">{page.page}</p>
                    </td>
                    <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                            {page.currentSchema.length > 0 ? page.currentSchema.map((s, j) => (
                                <span key={j} className="text-[10px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded border border-gray-700">
                                    {s}
                                </span>
                            )) : <span className="text-xs text-gray-500">None</span>}
                        </div>
                    </td>
                    <td className="p-4 text-center">
                        <div className="flex justify-center" title={reviews?.reason}>{getIcon(reviews?.eligible || false, reviews?.reason)}</div>
                    </td>
                    <td className="p-4 text-center">
                        <div className="flex justify-center" title={faq?.reason}>{getIcon(faq?.eligible || false, faq?.reason)}</div>
                    </td>
                    <td className="p-4 text-center">
                        <div className="flex justify-center" title={breadcrumbs?.reason}>{getIcon(breadcrumbs?.eligible || false, breadcrumbs?.reason)}</div>
                    </td>
                    <td className="p-4 text-right">
                        {page.issues.length > 0 ? (
                            <span className="text-xs text-rose-400 font-medium">{page.issues.length} Issues</span>
                        ) : (
                            <span className="text-xs text-emerald-500">Good</span>
                        )}
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageEligibilityTable;