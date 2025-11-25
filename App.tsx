import React, { useState, useEffect } from 'react';
import { ViewState, DrinkEntry } from './types';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import AddDrink from './components/AddDrink';
import CalendarView from './components/CalendarView';
import InsightsView from './components/InsightsView';
import { getLogs, saveLog } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [logs, setLogs] = useState<DrinkEntry[]>([]);

  useEffect(() => {
    // Load logs on mount
    setLogs(getLogs());
  }, []);

  const handleSaveDrink = (entry: DrinkEntry) => {
    const updatedLogs = saveLog(entry);
    setLogs(updatedLogs);
    setView('dashboard');
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard logs={logs} />;
      case 'calendar':
        return <CalendarView logs={logs} />;
      case 'insights':
        return <InsightsView logs={logs} />;
      case 'add':
        return <AddDrink onSave={handleSaveDrink} onCancel={() => setView('dashboard')} />;
      default:
        return <Dashboard logs={logs} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 relative">
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
      
      {view !== 'add' && (
        <div className="sticky bottom-0 w-full z-50">
           <NavBar currentView={view} setView={setView} />
        </div>
      )}
    </div>
  );
};

export default App;
