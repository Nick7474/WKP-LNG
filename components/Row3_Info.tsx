import React from 'react';
import { Wind, Droplets, Thermometer, CloudRain, AlertTriangle, Phone } from 'lucide-react';
import { EventData, ContactData } from '../types';

const events: EventData[] = [
  { equipment: '화재감지기 101', location: '14F', event: '화재 감지', status: '미완료', time: '1h 10m ago', level: 'danger' },
  { equipment: '비상벨 13', location: 'B2F', event: '비상벨 작동', status: '완료', time: '2h 20m ago', level: 'warning' },
  { equipment: 'AHU-3 팬 정지', location: '7F', event: '밸브 개방 감지', status: '완료', time: '3h 45m ago', level: 'danger' },
  { equipment: 'CO2 농도 상승', location: '7F', event: 'CO2 농도 상승', status: '완료', time: '3h 45m ago', level: 'warning' },
  { equipment: '출입통제 12', location: 'B3F', event: '강제개방', status: '완료', time: '3h 45m ago', level: 'danger' },
];

const contacts: ContactData[] = [
  { role: '정관리', name: '시설장', phone: '010-1234-5678' },
  { role: '정관리', name: '시설장', phone: '010-9876-5432' },
];

const Row3_Info: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 h-[240px]">
      
      {/* Weather & Env */}
      <div className="col-span-3 bg-[#1a1b23] rounded-lg p-5 border border-gray-800 flex flex-col">
        <div className="border-l-4 border-[#00aaff] pl-3 mb-3">
            <h2 className="text-white font-bold text-base leading-none">실시간 기상 및 환경 현황</h2>
        </div>
        <div className="flex flex-1 items-center gap-2">
           {/* Wind Rose Section */}
           <div className="flex flex-col items-center justify-center w-[110px]">
             <div className="w-[100px] h-[100px] relative border rounded-full border-gray-600 flex items-center justify-center bg-[#0f1115] mb-2">
                <div className="absolute text-[10px] top-1 text-gray-400">N</div>
                <div className="absolute text-[10px] bottom-1 text-gray-400">S</div>
                <div className="absolute text-[10px] left-1 text-gray-400">W</div>
                <div className="absolute text-[10px] right-1 text-gray-400">E</div>
                <div className="w-[60px] h-[60px] rounded-full border border-gray-700/50"></div>
                {/* Arrow */}
                <div className="absolute w-1 h-[40px] bg-cyan-500 origin-bottom bottom-1/2 transform rotate-12" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
             </div>
             {/* Text Below Compass */}
             <div className="flex flex-col items-center">
                <div className="text-sm text-cyan-400 font-bold">북서풍</div>
                <div className="text-xs text-gray-500">5.2 m/s</div>
             </div>
           </div>

           {/* Stats */}
           <div className="flex-1 space-y-2 text-sm">
             <div className="flex items-center gap-2 bg-[#252530] p-1.5 rounded border border-gray-700">
               <Thermometer size={14} className="text-cyan-400" />
               <span className="text-gray-400 text-xs">대기 온도:</span>
               <span className="font-bold">24.5 °C</span>
             </div>
             <div className="flex items-center gap-2 bg-[#252530] p-1.5 rounded border border-gray-700">
               <Droplets size={14} className="text-blue-400" />
               <span className="text-gray-400 text-xs">상한 습도:</span>
               <span className="font-bold">45 %</span>
             </div>
             <div className="flex items-center gap-2 bg-[#252530] p-1.5 rounded border border-gray-700">
               <CloudRain size={14} className="text-blue-300" />
               <span className="text-gray-400 text-xs">강수량:</span>
               <span className="font-bold">0.0 mm</span>
             </div>
             <div className="flex items-center gap-2 bg-[#252530] p-1.5 rounded border border-gray-700">
               <Wind size={14} className="text-gray-300" />
               <span className="text-gray-400 text-xs">미세먼지:</span>
               <span className="font-bold text-green-400">좋음 (35)</span>
             </div>
           </div>
        </div>
      </div>

      {/* Events List */}
      <div className="col-span-6 bg-[#1a1b23] rounded-lg p-5 border border-gray-800 flex flex-col">
         <div className="border-l-4 border-[#00aaff] pl-3 mb-3">
            <h2 className="text-white font-bold text-base leading-none">이벤트 현황</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-xs text-gray-400">
                <th className="py-2 pl-2 font-medium">장비명</th>
                <th className="py-2 font-medium">위치</th>
                <th className="py-2 font-medium">이벤트명</th>
                <th className="py-2 font-medium">완료</th>
                <th className="py-2 font-medium">시간</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {events.map((ev, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-white/5">
                  <td className="py-2 pl-2 text-gray-300">{ev.equipment}</td>
                  <td className="py-2 text-gray-400">{ev.location}</td>
                  <td className={`py-2 font-bold ${ev.level === 'danger' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {ev.event}
                  </td>
                  <td className="py-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${ev.status === '미완료' ? 'bg-gray-700 text-gray-300' : 'text-gray-500'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500 text-xs">{ev.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contacts */}
      <div className="col-span-3 bg-[#1a1b23] rounded-lg p-5 border border-gray-800 flex flex-col">
        <div className="border-l-4 border-[#00aaff] pl-3 mb-3">
            <h2 className="text-white font-bold text-base leading-none">담당자 및 유관기관</h2>
        </div>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
          {contacts.map((contact, idx) => (
             <div key={idx} className="bg-[#252530] border border-gray-700 p-3 rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-300 font-bold">
                     {contact.role.charAt(0)}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-200">{contact.role}</span>
                      <span className="text-xs text-gray-500">{contact.name}</span>
                   </div>
                </div>
                <button className="w-8 h-8 rounded-full border border-cyan-800 text-cyan-500 flex items-center justify-center hover:bg-cyan-900/30 transition-colors">
                   <Phone size={14} />
                </button>
             </div>
          ))}
           <div className="bg-[#252530] border border-gray-700 p-3 rounded flex items-center justify-between opacity-50">
             <span className="text-xs text-gray-500 text-center w-full">More...</span>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Row3_Info;