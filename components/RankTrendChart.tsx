import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface HistoryPoint {
  date: string;
  [key: string]: string | number | null;
}

interface RankTrendChartProps {
  data: HistoryPoint[];
  keywords: string[];
}

const colors = [
  '#818cf8', // Indigo 400
  '#34d399', // Emerald 400
  '#f472b6', // Pink 400
  '#fbbf24', // Amber 400
  '#22d3ee', // Cyan 400
  '#a78bfa', // Violet 400
];

const RankTrendChart: React.FC<RankTrendChartProps> = ({ data, keywords }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[300px] bg-[#161b22] p-4 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-sm font-semibold text-gray-400 mb-4 ml-2">Ranking History (Last 90 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af" 
            tick={{fontSize: 12}} 
            tickMargin={10}
            minTickGap={30}
          />
          <YAxis 
            stroke="#9ca3af" 
            tick={{fontSize: 12}} 
            reversed={true} 
            domain={[1, 'auto']} 
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
            itemStyle={{ color: '#e5e7eb' }}
            labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {keywords.map((keyword, index) => (
            <Line
              key={keyword}
              type="monotone"
              dataKey={keyword}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: colors[index % colors.length] }}
              activeDot={{ r: 5 }}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankTrendChart;