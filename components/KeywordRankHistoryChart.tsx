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
import { AhrefsKeywordRanking } from '../types';

interface KeywordRankHistoryChartProps {
  keywords: AhrefsKeywordRanking[];
}

const colors = [
  '#34d399', // Emerald 400
  '#818cf8', // Indigo 400
  '#f472b6', // Pink 400
  '#fbbf24', // Amber 400
  '#22d3ee', // Cyan 400
];

const KeywordRankHistoryChart: React.FC<KeywordRankHistoryChartProps> = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  // Filter top 5 keywords that have history
  const displayKeywords = keywords.filter(k => k.history && k.history.length > 0).slice(0, 5);

  if (displayKeywords.length === 0) return null;

  // Transform data: Map to array of { date, 'keyword1': 1, 'keyword2': 5 }
  // Assume all histories have same dates for mock data simplicity
  const chartData = displayKeywords[0].history!.map((entry, index) => {
      const point: any = { date: entry.date };
      displayKeywords.forEach(k => {
          if (k.history && k.history[index]) {
              point[k.keyword] = k.history[index].position;
          }
      });
      return point;
  });

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg h-[350px] mb-6">
      <h3 className="text-sm font-bold text-white mb-4 ml-2">Top Keyword Ranking Trends (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af" 
            tick={{fontSize: 11}} 
            minTickGap={30}
          />
          <YAxis 
            stroke="#9ca3af" 
            tick={{fontSize: 11}} 
            reversed={true} 
            domain={[1, 'auto']} 
            allowDecimals={false}
            width={40}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
            itemStyle={{ fontSize: '12px' }}
            labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          {displayKeywords.map((kw, index) => (
            <Line
              key={kw.keyword}
              type="monotone"
              dataKey={kw.keyword}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeywordRankHistoryChart;