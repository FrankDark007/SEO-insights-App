import React from 'react';
import { SeasonalData } from '../types';
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

interface SeasonalTrendChartProps {
  data: SeasonalData[];
}

const colors = [
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#fbbf24', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f472b6', // Pink
];

const SeasonalTrendChart: React.FC<SeasonalTrendChartProps> = ({ data }) => {
  // Transform data for Recharts: [{ month: 'Jan', CityA: 50, CityB: 60 }, ...]
  const chartData = data[0].monthlyTrend.map((item, index) => {
    const point: any = { month: item.month };
    data.forEach(cityData => {
      point[cityData.city] = cityData.monthlyTrend[index].interest;
    });
    return point;
  });

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg h-[350px]">
      <h3 className="text-sm font-bold text-white mb-4 ml-2">Seasonal Search Interest</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          {data.map((cityData, index) => (
            <Line
              key={cityData.city}
              type="monotone"
              dataKey={cityData.city}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeasonalTrendChart;