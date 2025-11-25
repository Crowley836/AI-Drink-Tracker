import React from 'react';
import { DrinkEntry } from '../types';
import { Beer, Wine, Martini, HelpCircle } from 'lucide-react';

interface CalendarViewProps {
  logs: DrinkEntry[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ logs }) => {
  // Group logs by date string YYYY-MM-DD
  const groupedLogs = logs.reduce((acc, log) => {
    const dateKey = new Date(log.timestamp).toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, DrinkEntry[]>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const getIcon = (type: string) => {
      switch (type) {
        case 'Beer': return <Beer size={16} className="text-amber-500" />;
        case 'Wine': return <Wine size={16} className="text-red-500" />;
        case 'Liquor': return <Martini size={16} className="text-blue-500" />;
        case 'Mixed Drink': return <Martini size={16} className="text-purple-500" />;
        default: return <HelpCircle size={16} className="text-gray-500" />;
      }
    };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 overflow-y-auto no-scrollbar">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
      </header>

      <div className="space-y-6 pb-20">
        {sortedDates.length === 0 ? (
           <div className="text-center text-gray-500 mt-10">No history available yet.</div>
        ) : (
          sortedDates.map(date => {
            const dayLogs = groupedLogs[date];
            const dayTotalPureAlcohol = dayLogs.reduce((acc, log) => acc + (log.volumeOz * (log.abv / 100)), 0);

            return (
              <div key={date}>
                <div className="flex justify-between items-end mb-2 px-1">
                    <h3 className="font-semibold text-gray-600">{date}</h3>
                    <span className="text-xs text-gray-400">Total Pure Alc: {dayTotalPureAlcohol.toFixed(2)}oz</span>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {dayLogs.map((log, idx) => (
                        <div key={log.id} className={`p-4 flex items-center justify-between ${idx !== dayLogs.length - 1 ? 'border-b border-gray-100' : ''}`}>
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-full">
                                    {getIcon(log.type)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{log.name}</div>
                                    <div className="text-xs text-gray-500">{log.volumeOz}oz • {log.abv}%</div>
                                </div>
                             </div>
                             {log.imageUrl && (
                                 <img src={log.imageUrl} alt="thumb" className="w-8 h-8 rounded object-cover border border-gray-200" />
                             )}
                        </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CalendarView;