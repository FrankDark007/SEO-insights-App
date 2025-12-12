import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SentimentChartProps {
  data: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Positive', value: data.positive, color: '#34d399' }, // Emerald 400
    { name: 'Neutral', value: data.neutral, color: '#9ca3af' },  // Gray 400
    { name: 'Negative', value: data.negative, color: '#f43f5e' }, // Rose 500
  ];

  // If no data, show placeholder
  if (data.positive === 0 && data.neutral === 0 && data.negative === 0) {
      return <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">No sentiment data available</div>;
  }

  return (
    <div className="w-full h-[300px] bg-[#161b22] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider text-center">Sentiment Breakdown</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
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
            formatter={(value, entry: any) => <span className="text-gray-300 ml-1 text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;