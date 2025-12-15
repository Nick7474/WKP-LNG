import React from 'react';
import { Home, Settings, Activity, Cpu, Radio, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: 'home' | 'sop';
  onMenuClick: (view: 'home' | 'sop') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onMenuClick }) => {
  const menuItems = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'sop', icon: <Radio size={24} />, label: 'SOP' },
    { id: 'equip', icon: <Cpu size={24} />, label: '기계설비' }, // Placeholder
    { id: 'power', icon: <Zap size={24} />, label: '전력제어' }, // Placeholder
    { id: 'settings', icon: <Settings size={24} />, label: 'Settings' }, // Placeholder
  ];

  return (
    <div className="w-[100px] h-full bg-[#1a1b23] flex flex-col items-center border-r border-gray-800 z-50">
      <div 
        className="py-6 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onMenuClick('home')}
      >
        <img 
          src="https://cdn.imweb.me/upload/S20220215d5bc0d1f16d2a/d6a8399ed39bf.png" 
          alt="Logo" 
          className="w-16 h-auto object-contain"
        />
      </div>
      
      <div className="flex flex-col gap-8 w-full">
        {menuItems.map((item, index) => {
          const isActive = currentView === item.id || (item.id !== 'home' && item.id !== 'sop' && false);
          
          return (
            <button 
              key={index}
              onClick={() => {
                if (item.id === 'home' || item.id === 'sop') {
                  onMenuClick(item.id as 'home' | 'sop');
                }
              }}
              className={`w-full flex flex-col items-center gap-2 py-3 transition-colors duration-200 relative
                ${isActive 
                  ? 'text-[#00aaff] bg-[#00aaff]/10 border-l-4 border-[#00aaff]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;