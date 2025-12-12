import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ReviewVelocityChartProps {
  data: { month: string; you: number; competitorAvg: number }[];
}

const ReviewVelocityChart: React.FC<ReviewVelocityChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[250px] bg-[#161b22] p-4 rounded-xl border border-gray-800 shadow-lg mt-4">
      <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Estimated Review Velocity (Last 6 Months)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af" 
            tick={{fontSize: 10}} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            tick={{fontSize: 10}} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{fill: '#374151', opacity: 0.2}}
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="you" name="You" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="competitorAvg" name="Competitor Avg" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReviewVelocityChart;