import React from 'react';
import { User, Bell, MapPin, Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="h-[60px] w-full bg-[#1a1b23] border-b border-gray-800 flex items-center justify-between px-6">
      <div className="text-lg font-bold text-gray-200 tracking-wide">
        서부발전 공주천연가스 발전소 대시보드
      </div>

      {/* Center Alert */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-3 px-6 py-1.5 rounded-full border border-red-600 bg-red-900/20 animate-alert-blink cursor-pointer">
          <img 
            src="https://cdn.imweb.me/upload/S20220215d5bc0d1f16d2a/d3dc9c2ed90c9.png" 
            alt="Fire Icon" 
            className="w-5 h-5 animate-pulse"
          />
          <span className="text-red-500 font-bold text-sm tracking-wider">화재감지 이벤트 : A2 2F 1Zone</span>
        </div>
      </div>

      {/* Right Info */}
      <div className="flex items-center gap-6 text-gray-400 text-sm">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>제2공장 통제실</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>오전 11:10:04</span>
        </div>
        <div className="h-4 w-[1px] bg-gray-600"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
             <User size={18} />
          </div>
          <span>Admin</span>
        </div>
        <div className="relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
      </div>
    </div>
  );
};

export default Header;