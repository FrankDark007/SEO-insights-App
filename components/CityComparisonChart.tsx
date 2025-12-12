import React from 'react';
import { CityIntentBreakdown, PropertyTypes } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

interface CityComparisonChartProps {
  intentData: CityIntentBreakdown[];
  propertyData: PropertyTypes[];
}

const CityComparisonChart: React.FC<CityComparisonChartProps> = ({ intentData, propertyData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Intent Chart - Stacked Bar */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4 ml-2">Search Intent Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={intentData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="city" type="category" stroke="#9ca3af" tick={{ fontSize: 11 }} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                cursor={{fill: '#374151', opacity: 0.2}}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="emergency" name="Emergency" stackId="a" fill="#f43f5e" />
              <Bar dataKey="research" name="Research" stackId="a" fill="#3b82f6" />
              <Bar dataKey="costPrice" name="Cost/Price" stackId="a" fill="#fbbf24" />
              <Bar dataKey="brand" name="Brand" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property Types - Stacked Bar (Horizontal) */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4 ml-2">Dominant Property Types</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={propertyData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="city" type="category" stroke="#9ca3af" tick={{ fontSize: 11 }} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                cursor={{fill: '#374151', opacity: 0.2}}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="singleFamily" name="Single Family" stackId="a" fill="#818cf8" />
              <Bar dataKey="townhouse" name="Townhouse" stackId="a" fill="#c084fc" />
              <Bar dataKey="condo" name="Condo" stackId="a" fill="#22d3ee" />
              <Bar dataKey="commercial" name="Commercial" stackId="a" fill="#9ca3af" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CityComparisonChart;