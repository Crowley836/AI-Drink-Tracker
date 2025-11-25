import React from 'react';
import { DrinkEntry } from '../types';
import { Beer, Wine, Martini, HelpCircle, Droplets } from 'lucide-react';

interface DashboardProps {
  logs: DrinkEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  // Filter for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysLogs = logs.filter(log => new Date(log.timestamp).getTime() >= today.getTime());
  
  // Calculations
  const totalOz = todaysLogs.reduce((acc, log) => acc + log.volumeOz, 0);
  // Pure alcohol = vol * (abv/100)
  const totalPureAlcohol = todaysLogs.reduce((acc, log) => acc + (log.volumeOz * (log.abv / 100)), 0);
  
  // Avg ABV
  const avgAbv = todaysLogs.length > 0 
    ? (todaysLogs.reduce((acc, log) => acc + log.abv, 0) / todaysLogs.length) 
    : 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Beer': return <Beer size={20} className="text-amber-500" />;
      case 'Wine': return <Wine size={20} className="text-red-500" />;
      case 'Liquor': return <Martini size={20} className="text-blue-500" />;
      case 'Mixed Drink': return <Martini size={20} className="text-purple-500" />;
      default: return <HelpCircle size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 overflow-y-auto no-scrollbar">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900">Today's Intake</h1>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-indigo-600">
            <Beer size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider">Drinks</span>
          </div>
          <div className="text-2xl font-bold">{todaysLogs.length}</div>
          <div className="text-xs text-gray-400">Total items</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-teal-600">
            <Droplets size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Vol</span>
          </div>
          <div className="text-2xl font-bold">{totalOz.toFixed(1)} <span className="text-sm font-normal text-gray-400">oz</span></div>
          <div className="text-xs text-gray-400">Liquid volume</div>
        </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 col-span-2">
          <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2 text-rose-600">
                    <span className="text-xs font-semibold uppercase tracking-wider">Est. Pure Alcohol</span>
                </div>
                <div className="text-2xl font-bold">{totalPureAlcohol.toFixed(2)} <span className="text-sm font-normal text-gray-400">oz</span></div>
            </div>
            <div className="text-right">
                <div className="text-xs text-gray-400 mb-1">Avg ABV</div>
                <div className="text-lg font-semibold text-gray-700">{avgAbv.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent List */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Drinks</h2>
      {todaysLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <Beer size={48} className="mb-2 opacity-20" />
          <p>No drinks logged today yet.</p>
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          {todaysLogs.sort((a, b) => b.timestamp - a.timestamp).map((log) => (
            <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                   {getIcon(log.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{log.name}</h3>
                  <p className="text-xs text-gray-500">{log.volumeOz}oz • {log.abv}% ABV</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;