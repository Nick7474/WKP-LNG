import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// --- Images ---
const IMG_AHU = "https://cdn.imweb.me/upload/S20220215d5bc0d1f16d2a/0892bf483ca57.png";
const IMG_CHILLER = "https://cdn.imweb.me/upload/S20220215d5bc0d1f16d2a/176258d3cc352.png";
const IMG_PUMP = "https://cdn.imweb.me/upload/S20220215d5bc0d1f16d2a/2818c43e3939c.png";

// --- Mock Data ---

// 1. Event Status Data
const eventStatusData = [
  { name: '주의', value: 14, color: '#f59e0b' },    // Orange
  { name: '경보', value: 8, color: '#ef4444' },    // Red
  { name: '통신단절', value: 4, color: '#6b7280' }, // Gray
];

// 2. Fire Prevention History
const fireHistory = [
  { name: '화재감지기 101', loc: '14F', event: '화재 감지', status: '미완료', time: '1h 10m ago', type: 'danger' },
  { name: '비상벨 13', loc: 'B2F', event: '비상벨 작동', status: '완료', time: '2h 20m ago', type: 'warning' },
  { name: '스프링클러 12', loc: '7F', event: '밸브 개방 감지', status: '완료', time: '3h 45m ago', type: 'danger' },
  { name: '스프링클러 12', loc: '7F', event: '밸브 개방 감지', status: '완료', time: '3h 45m ago', type: 'danger' },
];

// 3. IAQ Data
const iaqHumidityData = [
  { time: '06:00', val: 30 }, { time: '08:00', val: 40 }, { time: '10:00', val: 55 },
  { time: '12:00', val: 45 }, { time: '14:00', val: 30 }, { time: '16:00', val: 40 }, { time: '18:00', val: 35 }
];
const iaqVocData = [
  { time: '06:00', val: 400 }, { time: '08:00', val: 600 }, { time: '10:00', val: 850 },
  { time: '12:00', val: 500 }, { time: '14:00', val: 400 }, { time: '16:00', val: 600 }, { time: '18:00', val: 450 }
];

// 4. Power Usage Data
const powerTrendData = [
  { time: '02:00', usage: 4000 }, { time: '04:00', usage: 7500 }, { time: '06:00', usage: 8000 },
  { time: '08:00', usage: 12000 }, { time: '10:00', usage: 13500 }, { time: '12:00', usage: 11000 },
  { time: '14:00', usage: 7000 }, { time: '16:00', usage: 4000 }, { time: '18:00', usage: 3800 },
  { time: '20:00', usage: 5500 }, { time: '22:00', usage: 7500 }, { time: '24:00', usage: 4000 },
];
const generateFloorData = () => {
  const floors = ['B7F', 'B6F', 'B5F', 'B4F', 'B3F', 'B2F', 'B1F', '1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F', '9F', '10F', '11F', '12F', '13F', '14F', '15F'];
  return floors.map(f => ({
    name: f,
    value: Math.floor(Math.random() * 400) + 300
  }));
};

// 5. Equipment Charts
const equipChartData1 = [{v:50},{v:60},{v:65},{v:80},{v:70},{v:60},{v:50},{v:55},{v:60},{v:50}];
const equipChartData2 = [{v:50},{v:55},{v:60},{v:70},{v:65},{v:50},{v:50},{v:55},{v:60},{v:55}];
const equipChartData3 = [{v:50},{v:60},{v:62},{v:75},{v:85},{v:70},{v:60},{v:50},{v:60},{v:65}];

// 6. Access Control
const accessControlData = [
  { name: '출입통제 1', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 2', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 3', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 4', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 5', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 6', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 7', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 8', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 9', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 10', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 11', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 12', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
  { name: '출입통제 13', open: 4, close: 8, forcedOpen: 6, forcedClose: 9 },
];

// 7. Peak Power
const peakPredictionData = [
  { time: '02:00', v: 1000 }, { time: '04:00', v: 1200 }, { time: '06:00', v: 1250 },
  { time: '08:00', v: 1550 }, { time: '10:00', v: 1350 }, { time: '12:00', v: 1050 },
  { time: '14:00', v: 1000 }, { time: '16:00', v: 1050 }, { time: '18:00', v: 1200 },
  { time: '20:00', v: 1250 }, { time: '22:00', v: 1000 }
];
const vibrationData = [
  { time: '04:00', val: 2.0 }, { time: '08:00', val: 2.6 }, { time: '12:00', val: 2.1 },
  { time: '16:00', val: 2.0 }, { time: '20:00', val: 2.3 },
];

const HomeDashboard: React.FC = () => {
  // Real-time animation for Floor Power Usage
  const [floorPower, setFloorPower] = useState(generateFloorData());

  useEffect(() => {
    const interval = setInterval(() => {
      setFloorPower(prev => prev.map(item => {
        const change = (Math.random() - 0.5) * 100;
        let newValue = item.value + change;
        
        // Emulate typical usage pattern
        if (item.name === '1F') newValue = Math.max(800, Math.min(1000, newValue));
        else if (item.name === '13F') newValue = Math.max(900, Math.min(1300, newValue));
        else newValue = Math.max(300, Math.min(700, newValue));
        
        return { ...item, value: newValue };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-2 rounded shadow-xl text-xs z-50">
          <p className="text-gray-300 font-bold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.fill || entry.stroke || entry.color }}>
              {entry.name}: {Math.round(entry.value).toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-12 gap-5 h-full pb-2">
      
      {/* --- COLUMN 1 (Left) --- */}
      <div className="col-span-3 flex flex-col gap-5">
        
        {/* A. Event Status */}
        <div className="bg-[#1a1b23] rounded-lg p-5 border border-gray-800 h-[280px] flex flex-col">
          <div className="border-l-4 border-[#00aaff] pl-3 mb-4">
            <h2 className="text-white font-bold text-base">이벤트 현황</h2>
          </div>
          <div className="flex-1 flex items-center">
            {/* Chart Left */}
            <div className="w-[140px] h-[140px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventStatusData}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none" 
                  >
                    {eventStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">26<span className="text-sm font-normal">건</span></span>
                <span className="text-xs text-gray-400">이벤트</span>
              </div>
            </div>
            
            {/* Legend & List Right */}
            <div className="flex-1 pl-4 flex flex-col justify-center">
               <div className="space-y-3 mb-4">
                  {eventStatusData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                          <span className="text-gray-300">{item.name}</span>
                       </div>
                       <span className="text-white font-bold text-lg">{item.value}<span className="text-sm font-normal text-gray-500 ml-0.5">건</span></span>
                    </div>
                  ))}
               </div>
               <div className="pt-3 border-t border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">TOP 3 이벤트 유형</div>
                  <div className="text-xs text-gray-300 space-y-1">
                     <div className="flex gap-2"><span className="bg-gray-700 w-4 h-4 flex items-center justify-center rounded text-[10px]">1</span> <span>미인가 출입 12건</span></div>
                     <div className="flex gap-2"><span className="bg-gray-700 w-4 h-4 flex items-center justify-center rounded text-[10px]">2</span> <span>장시간 문열림 8건</span></div>
                     <div className="flex gap-2"><span className="bg-gray-700 w-4 h-4 flex items-center justify-center rounded text-[10px]">3</span> <span>설비 이상 6건</span></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* B. Fire Prevention Status */}
        <div className="bg-[#1a1b23] rounded-lg p-5 border border-gray-800 h-[340px] flex flex-col">
           <div className="border-l-4 border-[#00aaff] pl-3 mb-4">
            <h2 className="text-white font-bold text-base">소방 방재 현황</h2>
          </div>
          {/* Top Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
             <div className="bg-[#0f2a20] border border-teal-800 rounded h-[60px] flex flex-col items-center justify-center relative">
                <span className="text-teal-400 text-xs mb-1">수신반 정상</span>
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
             </div>
             <div className="bg-[#3b1214] border border-[#ef4444] rounded h-[60px] flex flex-col items-center justify-center relative shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                <span className="text-gray-200 text-xs mb-1">스프링클러</span>
                <span className="text-red-500 font-bold flex items-center gap-1 text-sm"><div className="w-2 h-2 rounded-full bg-red-500"></div> 2건</span>
             </div>
             <div className="bg-[#0f2a20] border border-teal-800 rounded h-[60px] flex flex-col items-center justify-center relative">
                <span className="text-teal-400 text-xs mb-1">가스감지</span>
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
             </div>
             <div className="bg-[#0f2a20] border border-teal-800 rounded h-[60px] flex flex-col items-center justify-center relative">
                <span className="text-teal-400 text-xs mb-1">방재설비</span>
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
             </div>
             <div className="bg-[#362010] border border-[#f59e0b] rounded h-[60px] flex flex-col items-center justify-center relative shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                 <span className="text-gray-200 text-xs mb-1">경보 패널</span>
                 <span className="text-orange-500 font-bold flex items-center gap-1 text-sm"><div className="w-2 h-2 rounded-full bg-orange-500"></div> 2건</span>
             </div>
             <div className="bg-[#0f2a20] border border-teal-800 rounded h-[60px] flex flex-col items-center justify-center relative">
                <span className="text-teal-400 text-xs mb-1">소방펌프</span>
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
             </div>
          </div>
          {/* Bottom List */}
          <div className="flex-1 flex flex-col">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-300">최근 감지 이력</span>
                <div className="flex gap-2 text-[10px]">
                   <span className="flex items-center gap-1 text-orange-400"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>주의</span>
                   <span className="flex items-center gap-1 text-red-400"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>경보</span>
                </div>
             </div>
             <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                   <tbody className="text-gray-300">
                      {fireHistory.map((row, i) => (
                         <tr key={i} className="border-b border-gray-800/50 hover:bg-white/5">
                            <td className="py-1.5 pl-1">{row.name}</td>
                            <td className="py-1.5 text-center text-gray-500 w-[30px]">{row.loc}</td>
                            <td className={`py-1.5 font-bold ${row.type === 'danger' ? 'text-red-500' : 'text-orange-500'}`}>{row.event}</td>
                            <td className="py-1.5 text-right text-gray-400 w-[40px]">{row.status}</td>
                            <td className="py-1.5 text-right text-gray-500 w-[70px]">{row.time}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* C. IAQ */}
        <div className="bg-[#1a1b23] rounded-lg p-5 border border-gray-800 flex-1 flex flex-col">
           <div className="border-l-4 border-[#00aaff] pl-3 mb-2">
            <h2 className="text-white font-bold text-base">실내 공기질</h2>
          </div>
          <div className="flex items-center gap-2 flex-1">
             {/* Left Gauge */}
             <div className="relative w-[130px] h-[130px] flex items-center justify-center">
                <ResponsiveContainer>
                   <PieChart>
                     <Pie data={[{value: 92}, {value: 28}]} innerRadius={50} outerRadius={65} startAngle={200} endAngle={-20} dataKey="value" stroke="none">
                        <Cell fill="#00aaff" />
                        <Cell fill="#333" />
                     </Pie>
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                   <span className="text-xs text-gray-400 mb-0.5">IAQ</span>
                   <span className="text-3xl font-bold text-blue-400 leading-none">92<span className="text-sm">점</span></span>
                   <span className="text-[11px] bg-blue-500 text-white px-3 py-0.5 rounded-full mt-2">양호(Good)</span>
                </div>
             </div>
             
             {/* Right Charts */}
             <div className="flex-1 space-y-3">
                <div className="h-[60px]">
                   <div className="flex justify-between items-end mb-1">
                      <span className="text-xs text-gray-300">습도</span>
                      <div className="relative w-full h-[1px] bg-gray-700 mx-2 mb-1.5"></div>
                   </div>
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={iaqHumidityData}>
                         <defs>
                            <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#00aaff" stopOpacity={0.5}/>
                               <stop offset="95%" stopColor="#00aaff" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <Area type="monotone" dataKey="val" stroke="#00aaff" fill="url(#colorHum)" strokeWidth={2} activeDot={{r:4, fill: 'white'}} />
                         <Tooltip content={<CustomTooltip />} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
                <div className="h-[60px]">
                   <div className="flex justify-between items-end mb-1">
                      <span className="text-xs text-gray-300">VOC</span>
                      <div className="relative w-full h-[1px] bg-gray-700 mx-2 mb-1.5"></div>
                   </div>
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={iaqVocData}>
                         <defs>
                            <linearGradient id="colorVoc" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                               <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <Area type="monotone" dataKey="val" stroke="#10b981" fill="url(#colorVoc)" strokeWidth={2} activeDot={{r:4, fill: 'white'}} />
                         <Tooltip content={<CustomTooltip />} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* --- COLUMN 2 (Center - Wide) --- */}
      <div className="col-span-6 flex flex-col gap-5">
        
        {/* D. Total Building Power Usage */}
        <div className="bg-[#1a1b23] rounded-lg p-5 border border-gray-800 h-[400px] flex flex-col">
           <div className="border-l-4 border-[#00aaff] pl-3 mb-2">
            <h2 className="text-white font-bold text-base">전체 건물 전력 사용량</h2>
          </div>
          
          {/* Top: Trend Area Chart */}
          <div className="h-[180px] w-full mb-4">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={powerTrendData} margin={{top:10, right:0, left:-20, bottom:0}}>
                   <defs>
                      <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00aaff" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00aaff" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="time" tick={{fontSize: 11, fill: '#888'}} axisLine={false} tickLine={false} dy={10} />
                   <YAxis tick={{fontSize: 11, fill: '#888'}} axisLine={false} tickLine={false} domain={[0, 14000]} ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000, 14000]} />
                   <Tooltip content={<CustomTooltip />} />
                   <Area type="monotone" dataKey="usage" stroke="#00aaff" strokeWidth={2} fill="url(#colorPower)" activeDot={{r:5, fill:'#fff', stroke:'#00aaff'}} />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          {/* Bottom: Real-time Floor Bar Chart */}
          <div className="flex-1 w-full border-t border-gray-800 pt-4">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={floorPower} barCategoryGap="20%">
                   <XAxis dataKey="name" tick={{fontSize: 10, fill: '#888'}} axisLine={false} tickLine={false} interval={0} dy={5} />
                   <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                   
                   {/* Background Track Bar */}
                   <Bar dataKey="value" data={floorPower.map(d => ({...d, value: 1400}))} fill="#1f2937" radius={[2,2,0,0]} isAnimationActive={false} />
                   
                   {/* Foreground Value Bar */}
                   <Bar dataKey="value" radius={[2,2,0,0]} animationDuration={500}>
                      {floorPower.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.value > 1000 ? '#ef4444' : (entry.value > 800 ? '#f59e0b' : '#00aaff')} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* E. Major Equipment Status */}
        <div className="bg-[#1a1b23] rounded-lg p-5 border border-gray-800 h-[260px] flex flex-col">
           <div className="border-l-4 border-[#00aaff] pl-3 mb-4">
            <h2 className="text-white font-bold text-base">주요설비 운영현황</h2>
          </div>
          <div className="grid grid-cols-3 gap-0 flex-1 divide-x divide-gray-800">
             {/* AHU */}
             <div className="px-4 flex flex-col h-full relative group">
                <div className="flex items-center justify-center gap-4 mb-4">
                   <img src={IMG_AHU} alt="AHU" className="w-[100px] h-auto object-contain transform group-hover:scale-105 transition-transform" />
                   <div className="text-left">
                      <h3 className="text-white font-bold text-lg">AHU</h3>
                      <div className="text-xs text-gray-500 mt-1">가동대수 <span className="text-blue-400 font-bold">3</span> / 5</div>
                   </div>
                </div>
                <div className="mt-auto">
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-sm text-gray-300">AHU 03</span>
                      <span className="text-blue-400 font-bold text-sm">78% 가동</span>
                   </div>
                   <div className="h-[40px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={equipChartData1}>
                             <defs>
                                <linearGradient id="gradAHU" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="0%" stopColor="#00aaff" stopOpacity={0.3}/>
                                   <stop offset="100%" stopColor="#00aaff" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <Area type="monotone" dataKey="v" stroke="#00aaff" strokeWidth={2} fill="url(#gradAHU)" activeDot={{r:4, strokeWidth:0, fill:'white'}} />
                          </AreaChart>
                       </ResponsiveContainer>
                   </div>
                </div>
             </div>

             {/* Chiller */}
             <div className="px-4 flex flex-col h-full relative group">
                <div className="flex items-center justify-center gap-4 mb-4">
                   <img src={IMG_CHILLER} alt="Chiller" className="w-[100px] h-auto object-contain transform group-hover:scale-105 transition-transform" />
                   <div className="text-left">
                      <h3 className="text-white font-bold text-lg">냉동기</h3>
                      <div className="text-xs text-gray-500 mt-1">가동대수 <span className="text-blue-400 font-bold">6</span> / 9</div>
                   </div>
                </div>
                <div className="mt-auto">
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-sm text-gray-300">냉동기 02</span>
                      <span className="text-blue-400 font-bold text-sm">62% 부하감소</span>
                   </div>
                   <div className="h-[40px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={equipChartData2}>
                             <defs>
                                <linearGradient id="gradChiller" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3}/>
                                   <stop offset="100%" stopColor="#818cf8" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <Area type="monotone" dataKey="v" stroke="#818cf8" strokeWidth={2} fill="url(#gradChiller)" activeDot={{r:4, strokeWidth:0, fill:'white'}} />
                          </AreaChart>
                       </ResponsiveContainer>
                   </div>
                </div>
             </div>

             {/* Pump */}
             <div className="px-4 flex flex-col h-full relative group">
                <div className="flex items-center justify-center gap-4 mb-4">
                   <img src={IMG_PUMP} alt="Pump" className="w-[80px] h-auto object-contain transform group-hover:scale-105 transition-transform" />
                   <div className="text-left">
                      <h3 className="text-white font-bold text-lg">배수</h3>
                      <div className="text-xs text-gray-500 mt-1">가동대수 <span className="text-blue-400 font-bold">8</span> / 5</div>
                   </div>
                </div>
                <div className="mt-auto">
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-sm text-gray-300">배수14</span>
                      <span className="text-red-500 font-bold text-sm">91% 고부하</span>
                   </div>
                   <div className="h-[40px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={equipChartData3}>
                             <defs>
                                <linearGradient id="gradPump" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3}/>
                                   <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} fill="url(#gradPump)" activeDot={{r:4, strokeWidth:0, fill:'white'}} />
                          </AreaChart>
                       </ResponsiveContainer>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* F. Access Control Status */}
        <div className="bg-[#1a1b23] rounded-lg p-5 border border-gray-800 flex-1 flex flex-col">
           <div className="border-l-4 border-[#00aaff] pl-3 mb-2 flex justify-between items-center">
            <h2 className="text-white font-bold text-base">출입통제 현황</h2>
            <div className="flex gap-4 text-[11px] text-gray-400">
               <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>열림</span>
               <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>닫힘</span>
               <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>강제개방</span>
               <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div>강제닫힘</span>
            </div>
          </div>
          <div className="flex-1 w-full mt-2">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accessControlData} barGap={2}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="name" tick={{fontSize: 10, fill: '#888'}} axisLine={false} tickLine={false} dy={5} />
                   <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                   <Bar dataKey="open" fill="#10b981" barSize={6} radius={[2,2,0,0]} />
                   <Bar dataKey="close" fill="#6366f1" barSize={6} radius={[2,2,0,0]} />
                   <Bar dataKey="forcedOpen" fill="#ef4444" barSize={6} radius={[2,2,0,0]} />
                   <Bar dataKey="forcedClose" fill="#f59e0b" barSize={6} radius={[2,2,0,0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* --- COLUMN 3 (Right) --- */}
      <div className="col-span-3 flex flex-col gap-5">
         
         {/* Vibration Detection */}
         <div className="bg-[#1a1b23] rounded-lg p-5 border border-gray-800 h-[240px] flex flex-col">
           <div className="border-l-4 border-[#00aaff] pl-3 mb-2">
            <h2 className="text-white font-bold text-base">진동 / 이상 감지</h2>
           </div>
           <p className="text-xs text-gray-400 mb-2">진동 RMS</p>
          <div className="flex-1 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vibrationData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                   <defs>
                      <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
                   <YAxis domain={[0, 3.5]} tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
                   <Tooltip content={<CustomTooltip />} />
                   <Area type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={2} fill="url(#colorVib)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-2 border-t border-gray-800 pt-2">
             <span className="text-2xl font-bold text-white">3<span className="text-sm font-normal text-gray-400">건</span></span>
             <span className="bg-orange-900/50 text-orange-400 border border-orange-700 px-3 py-1 rounded-full text-xs font-bold">주의</span>
          </div>
         </div>

         {/* F. Peak Power Management */}
         <div className="bg-[#1a1b23] rounded-lg p-5 border border-gray-800 h-[260px] flex flex-col">
           <div className="border-l-4 border-[#00aaff] pl-3 mb-2">
            <h2 className="text-white font-bold text-base">피크 전력 관리</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
             <ResponsiveContainer width="100%" height={140}>
               <PieChart>
                 <Pie
                   data={[{value: 78}, {value: 22}]}
                   cx="50%"
                   cy="80%"
                   startAngle={180}
                   endAngle={0}
                   innerRadius={70}
                   outerRadius={95}
                   paddingAngle={0}
                   dataKey="value"
                   stroke="none"
                 >
                   <Cell fill="#00aaff" />
                   <Cell fill="#333" />
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-[50%] left-0 w-full text-center mt-4">
                <div className="text-3xl font-bold text-white">1,850<span className="text-sm font-normal text-gray-400">kW</span></div>
                <div className="text-xs text-gray-400">사용(78%)</div>
             </div>
          </div>
          <div className="h-[70px] w-full">
             <p className="text-xs text-gray-400 mb-1">실시간 전력수요 예측</p>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={peakPredictionData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                   <defs>
                      <linearGradient id="gradPeak" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#00aaff" stopOpacity={0.4}/>
                         <stop offset="100%" stopColor="#00aaff" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                   <YAxis tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                   <Tooltip content={<CustomTooltip />} />
                   <Area type="monotone" dataKey="v" stroke="#00aaff" fill="url(#gradPeak)" fillOpacity={1} strokeWidth={2} activeDot={{r:4, fill:'white'}}/>
                </AreaChart>
             </ResponsiveContainer>
          </div>
         </div>

         {/* Event Log (Table) */}
         <div className="bg-[#1a1b23] rounded-lg p-5 border border-gray-800 flex-1 flex flex-col">
            <div className="border-l-4 border-[#00aaff] pl-3 mb-2">
               <h2 className="text-white font-bold text-base">이벤트 로그</h2>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
               <table className="w-full text-left text-xs">
                  <thead className="text-gray-500 border-b border-gray-700">
                     <tr>
                        <th className="pb-2 font-normal">장비명</th>
                        <th className="pb-2 font-normal">위치</th>
                        <th className="pb-2 font-normal">이벤트명</th>
                        <th className="pb-2 font-normal">시간</th>
                     </tr>
                  </thead>
                  <tbody className="text-gray-300">
                     {[
                        {n:'화재감지기 101', l:'14F', e:'화재 감지', c:'text-red-500', t:'1h 10m'},
                        {n:'비상벨 13', l:'B2F', e:'비상벨 작동', c:'text-orange-500', t:'2h 20m'},
                        {n:'AHU-3 팬', l:'7F', e:'밸브 개방', c:'text-gray-300', t:'3h 45m'},
                        {n:'CO2 농도', l:'7F', e:'농도 상승', c:'text-orange-500', t:'3h 45m'},
                        {n:'출입통제 12', l:'B3F', e:'강제개방', c:'text-red-500', t:'3h 45m'},
                        {n:'화재감지기 56', l:'7F', e:'밸브 개방', c:'text-red-500', t:'3h 45m'},
                     ].map((row, i) => (
                        <tr key={i} className="border-b border-gray-800/50 hover:bg-white/5">
                           <td className="py-2">{row.n}</td>
                           <td className="py-2 text-gray-500">{row.l}</td>
                           <td className={`py-2 ${row.c}`}>{row.e}</td>
                           <td className="py-2 text-gray-500">{row.t}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="mt-2 flex justify-end gap-2 text-[10px] text-gray-500">
               <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>경보</span>
               <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>주의</span>
               <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>열림</span>
            </div>
         </div>

      </div>
    </div>
  );
};

export default HomeDashboard;