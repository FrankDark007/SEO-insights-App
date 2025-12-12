import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LeadStats } from '../types';

interface LeadSourceChartProps {
  data: LeadStats['bySource'];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#6b7280'];

const LeadSourceChart: React.FC<LeadSourceChartProps> = ({ data }) => {
  if (!data || data.length === 0) return (
      <div className="h-[300px] flex items-center justify-center text-gray-500 bg-[#161b22] rounded-xl border border-gray-800">
          No data available
      </div>
  );

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg h-[300px]">
      <h3 className="text-sm font-bold text-white mb-2 ml-2">Leads by Source</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="leads"
            nameKey="source"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px' }}
            itemStyle={{ color: '#e5e7eb' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value, entry: any) => <span className="text-gray-300 ml-1 text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadSourceChart;
