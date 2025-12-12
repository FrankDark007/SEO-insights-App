import React, { useState } from 'react';
import { MatrixCell } from '../types';
import { Info, ExternalLink } from 'lucide-react';

interface CoverageMatrixGridProps {
  matrix: MatrixCell[][];
  services: string[];
  cities: string[];
}

const CoverageMatrixGrid: React.FC<CoverageMatrixGridProps> = ({ matrix, services, cities }) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number, col: number } | null>(null);

  if (!matrix || matrix.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-4 custom-scrollbar">
      <table className="border-collapse w-full min-w-[1000px]">
        <thead>
          <tr>
            <th className="sticky left-0 z-20 bg-[#161b22] p-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-r border-gray-800 shadow-[2px_0_5px_rgba(0,0,0,0.3)] min-w-[150px]">
              City / Service
            </th>
            {services.map((service, i) => (
              <th key={i} className="bg-[#161b22] p-3 text-center text-xs font-medium text-gray-300 border-b border-gray-800 min-w-[120px]">
                <div className="flex flex-col items-center">
                   <span className="truncate max-w-[110px]" title={service}>{service}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-800/30">
              <td className="sticky left-0 z-10 bg-[#161b22] p-3 text-xs font-medium text-white border-r border-b border-gray-800 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                {cities[rowIndex]}
              </td>
              {row.map((cell, colIndex) => {
                 let bgColor = 'bg-gray-800/20'; // Opportunity (Gray)
                 let icon = null;
                 
                 if (cell.status === 'own') {
                     bgColor = 'bg-emerald-500/20 border border-emerald-500/30';
                 } else if (cell.status === 'competitive') {
                     bgColor = 'bg-amber-500/20 border border-amber-500/30';
                 } else if (cell.status === 'gap') {
                     bgColor = 'bg-rose-500/20 border border-rose-500/30';
                 } else {
                     bgColor = 'bg-gray-800/30 border border-gray-700/30';
                 }

                 return (
                    <td 
                        key={colIndex} 
                        className="p-1 border-b border-gray-800 relative"
                        onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                        onMouseLeave={() => setHoveredCell(null)}
                    >
                        <div className={`h-12 rounded-lg flex flex-col items-center justify-center cursor-help transition-all duration-200 ${bgColor} group`}>
                             {cell.status === 'own' && <span className="text-emerald-400 font-bold text-xs">OWN</span>}
                             {cell.status === 'competitive' && <span className="text-amber-400 font-bold text-xs">COMP</span>}
                             {cell.status === 'gap' && <span className="text-rose-400 font-bold text-xs">GAP</span>}
                             {cell.status === 'opportunity' && <span className="text-gray-500 text-[10px]">OPEN</span>}
                             
                             {/* Hover Tooltip */}
                             {hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex && (
                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3 z-50 pointer-events-none">
                                     <p className="text-xs font-bold text-white mb-1 border-b border-gray-700 pb-1">{cities[rowIndex]} + {services[colIndex]}</p>
                                     <div className="space-y-1">
                                         {cell.youHave && (
                                             <div className="flex items-center justify-between text-[10px] text-emerald-400">
                                                 <span>✓ You have coverage</span>
                                             </div>
                                         )}
                                         {!cell.youHave && (
                                             <div className="flex items-center justify-between text-[10px] text-rose-400">
                                                 <span>✗ Missing your page</span>
                                             </div>
                                         )}
                                         
                                         {cell.competitorsCovering.length > 0 ? (
                                            <div className="mt-2">
                                                <p className="text-[10px] text-gray-400 mb-1">Competitors covering:</p>
                                                {cell.competitorsCovering.map((comp, k) => (
                                                    <div key={k} className="flex items-center gap-1 text-[10px] text-gray-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                        {comp.domain}
                                                    </div>
                                                ))}
                                            </div>
                                         ) : (
                                            <p className="text-[10px] text-gray-500 mt-2">No competitors found</p>
                                         )}
                                         
                                         <div className="mt-2 pt-1 border-t border-gray-700 flex justify-between items-center">
                                             <span className="text-[10px] text-gray-400">Priority Score:</span>
                                             <span className={`text-xs font-bold ${
                                                 cell.priorityScore > 80 ? 'text-rose-400' : 
                                                 cell.priorityScore > 50 ? 'text-amber-400' : 'text-gray-400'
                                             }`}>{cell.priorityScore}</span>
                                         </div>
                                     </div>
                                 </div>
                             )}
                        </div>
                    </td>
                 );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoverageMatrixGrid;