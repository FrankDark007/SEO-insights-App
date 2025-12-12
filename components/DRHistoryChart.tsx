import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AhrefsDRHistory } from '../types';

interface DRHistoryChartProps {
  data: AhrefsDRHistory[];
}

const DRHistoryChart: React.FC<DRHistoryChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg h-[300px]">
      <h3 className="text-sm font-bold text-white mb-4 ml-2">Domain Rating (12 Months)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="date" stroke="#9ca3af" tick={{fontSize: 11}} />
          <YAxis stroke="#9ca3af" tick={{fontSize: 11}} domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
            itemStyle={{ color: '#fbbf24' }}
          />
          <Area type="monotone" dataKey="dr" stroke="#f59e0b" fillOpacity={1} fill="url(#colorDr)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DRHistoryChart;