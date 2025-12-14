import React from "react";
import { RedirectChain } from "../types";
import { ArrowRight, AlertTriangle, GitMerge } from "lucide-react";

interface RedirectChainsTableProps {
  chains: RedirectChain[];
}

const RedirectChainsTable: React.FC<RedirectChainsTableProps> = ({ chains }) => {
  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <GitMerge className="w-5 h-5 text-amber-400" /> Redirect Chains ({chains.length})
      </h3>

      {chains.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-emerald-400 text-lg font-medium">✓ No redirect chains found!</p>
          <p className="text-gray-400 text-sm mt-1">Your redirects are clean and efficient.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chains.map((chain, index) => (
            <div
              key={index}
              className="p-4 bg-[#0d1117] rounded-lg border-l-4 border-amber-500 hover:bg-[#1f242c] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold bg-amber-900/20 px-2 py-0.5 rounded text-xs border border-amber-800">
                    {chain.totalHops} hops
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-500" /> {chain.issue}
                  </span>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2 mb-4 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                {chain.hops.map((hop, i) => (
                  <React.Fragment key={i}>
                    <span className={`text-xs font-mono px-2 py-1 rounded truncate max-w-[200px] border ${
                        i === 0 ? 'bg-rose-900/20 text-rose-300 border-rose-900/50' :
                        i === chain.hops.length - 1 ? 'bg-emerald-900/20 text-emerald-300 border-emerald-900/50' :
                        'bg-gray-800 text-gray-300 border-gray-700'
                    }`}>
                      {hop}
                    </span>
                    {i < chain.hops.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-gray-600" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm bg-emerald-900/10 p-2 rounded border border-emerald-900/20">
                <span className="text-emerald-400 font-bold text-xs uppercase">Recommendation:</span>
                <span className="text-emerald-100 text-xs">{chain.fix}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RedirectChainsTable;