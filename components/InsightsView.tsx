import React from 'react';
import { DrinkEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface InsightsViewProps {
  logs: DrinkEntry[];
}

const InsightsView: React.FC<InsightsViewProps> = ({ logs }) => {
  const now = new Date();
  
  // Last 30 Days Range
  const last30Start = new Date();
  last30Start.setDate(now.getDate() - 30);
  
  // Previous 30 Days Range
  const prev30Start = new Date();
  prev30Start.setDate(now.getDate() - 60);
  const prev30End = new Date(last30Start); // Up to start of last 30

  const calculateTotalPureAlcohol = (entries: DrinkEntry[]) => {
    return entries.reduce((acc, log) => acc + (log.volumeOz * (log.abv / 100)), 0);
  };

  const logsLast30 = logs.filter(l => l.timestamp >= last30Start.getTime() && l.timestamp <= now.getTime());
  const logsPrev30 = logs.filter(l => l.timestamp >= prev30Start.getTime() && l.timestamp < prev30End.getTime());

  const totalLast30 = calculateTotalPureAlcohol(logsLast30);
  const totalPrev30 = calculateTotalPureAlcohol(logsPrev30);

  const diff = totalLast30 - totalPrev30;
  const percentChange = totalPrev30 > 0 ? ((diff / totalPrev30) * 100) : 0;

  // Prepare chart data (Group last 7 days for visibility)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });
      
      const dayLogs = logs.filter(l => {
          const lDate = new Date(l.timestamp);
          lDate.setHours(0,0,0,0);
          return lDate.getTime() === d.getTime();
      });
      
      const val = calculateTotalPureAlcohol(dayLogs);
      chartData.push({ name: dayLabel, value: val });
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 overflow-y-auto">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
      </header>

      {/* Comparison Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Last 30 Days vs Previous</h3>
        
        <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">{totalLast30.toFixed(1)}</span>
            <span className="text-sm text-gray-500 mb-1">oz Pure Alcohol</span>
        </div>

        <div className={`flex items-center gap-2 text-sm font-medium ${diff > 0 ? 'text-rose-500' : diff < 0 ? 'text-emerald-500' : 'text-gray-500'}`}>
            {diff > 0 ? <TrendingUp size={16} /> : diff < 0 ? <TrendingDown size={16} /> : <Minus size={16} />}
            <span>{Math.abs(percentChange).toFixed(1)}% {diff > 0 ? 'Increase' : diff < 0 ? 'Decrease' : 'No Change'}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Compared to {totalPrev30.toFixed(1)} oz in the prior 30 days.</p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 min-h-[300px] mb-20">
         <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Last 7 Days Activity</h3>
         <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                     <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis hide />
                     <Tooltip cursor={{fill: '#f3f4f6'}} />
                     <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 2 ? '#f43f5e' : '#6366f1'} />
                        ))}
                     </Bar>
                 </BarChart>
             </ResponsiveContainer>
         </div>
         <p className="text-xs text-center text-gray-400 mt-2">Bars show pure alcohol volume (oz).</p>
      </div>
    </div>
  );
};

export default InsightsView;
