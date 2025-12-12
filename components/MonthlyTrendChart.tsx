import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { LeadStats } from '../types';

interface MonthlyTrendChartProps {
  data: LeadStats['monthlyTrend'];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg h-[300px]">
      <h3 className="text-sm font-bold text-white mb-2 ml-2">Monthly Performance</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af" 
            tick={{fontSize: 11}} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            yAxisId="left"
            stroke="#9ca3af" 
            tick={{fontSize: 11}} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#9ca3af" 
            tick={{fontSize: 11}} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${val/1000}k`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar yAxisId="left" dataKey="totalLeads" name="Total Leads" fill="#6366f1" barSize={20} radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} dot={{r: 4}} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;
