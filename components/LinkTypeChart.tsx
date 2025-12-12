import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface LinkTypeChartProps {
  data: {
    domain: string;
    directory: number;
    editorial: number;
    resource: number;
    partnership: number;
    forum: number;
    other: number;
  };
}

const COLORS = {
  directory: '#34d399', // Emerald 400
  editorial: '#818cf8', // Indigo 400
  resource: '#fbbf24', // Amber 400
  partnership: '#f472b6', // Pink 400
  forum: '#22d3ee', // Cyan 400
  other: '#9ca3af', // Gray 400
};

const LinkTypeChart: React.FC<LinkTypeChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Directory', value: data.directory, color: COLORS.directory },
    { name: 'Editorial', value: data.editorial, color: COLORS.editorial },
    { name: 'Resource', value: data.resource, color: COLORS.resource },
    { name: 'Partner', value: data.partnership, color: COLORS.partnership },
    { name: 'Forum', value: data.forum, color: COLORS.forum },
    { name: 'Other', value: data.other, color: COLORS.other },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gray-300 mb-2 truncate max-w-full" title={data.domain}>{data.domain}</h3>
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
            >
                {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#e5e7eb' }}
                formatter={(val: number) => `${val}%`}
            />
            </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LinkTypeChart;