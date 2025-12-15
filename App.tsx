import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Row1_Status from './components/Row1_Status';
import Row2_SOP from './components/Row2_SOP';
import Row3_Info from './components/Row3_Info';
import HomeDashboard from './components/HomeDashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'sop'>('home');

  return (
    <div className="flex w-screen h-screen bg-[#111118] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onMenuClick={setCurrentView} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        {/* Dashboard Content Grid */}
        <div className="flex-1 p-6 flex flex-col gap-[10px] overflow-y-auto custom-scrollbar relative">
          
          {currentView === 'home' ? (
            // Home Dashboard View
            <HomeDashboard />
          ) : (
            // SOP View
            <>
              {/* Row 1: Charts & Status (220px) */}
              <div className="flex-none">
                <Row1_Status />
              </div>

              {/* Row 2: SOP Cards (Flexible/Fixed height) */}
              <div className="flex-none mt-[6px]">
                 <Row2_SOP />
              </div>

              {/* Row 3: Bottom Info (Remaining) */}
              <div className="flex-none">
                <Row3_Info />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;