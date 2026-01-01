import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction } from '../types';

interface TrendChartProps {
  data: Transaction[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  
  const chartData = useMemo(() => {
    // Sort transactions by date
    const sorted = [...data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    // Create running balance
    let balance = 0;
    const points = sorted.map(t => {
      if (t.type === 'income') balance += t.amount;
      else balance -= t.amount;
      return {
        date: new Date(t.created_at).toLocaleDateString(),
        value: balance
      };
    });
    
    // If not enough points, add a starting 0
    if (points.length === 0) return [{ value: 0 }, { value: 0 }];
    if (points.length === 1) return [{ value: 0 }, points[0]];
    
    // Take last 20 points for smoothness if too many
    return points.slice(-30);
  }, [data]);

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px' }}
            itemStyle={{ color: '#E4E4E7' }}
            cursor={{ stroke: '#52525B', strokeWidth: 1 }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;