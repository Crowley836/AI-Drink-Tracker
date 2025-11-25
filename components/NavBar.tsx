import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Calendar, LineChart, PlusCircle } from 'lucide-react';

interface NavBarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, setView }) => {
  const getButtonClass = (view: ViewState) => 
    `flex flex-col items-center justify-center w-full h-full transition-colors ${
      currentView === view ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
    }`;

  return (
    <div className="bg-white border-t border-gray-200 h-16 flex justify-around items-center px-2 pb-safe">
      <button onClick={() => setView('dashboard')} className={getButtonClass('dashboard')}>
        <LayoutDashboard size={24} />
        <span className="text-xs mt-1">Today</span>
      </button>
      
      <button onClick={() => setView('calendar')} className={getButtonClass('calendar')}>
        <Calendar size={24} />
        <span className="text-xs mt-1">History</span>
      </button>

      <button onClick={() => setView('add')} className="relative -top-5 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
        <PlusCircle size={32} />
      </button>

      <button onClick={() => setView('insights')} className={getButtonClass('insights')}>
        <LineChart size={24} />
        <span className="text-xs mt-1">Insights</span>
      </button>
    </div>
  );
};

export default NavBar;
