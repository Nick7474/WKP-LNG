import React, { useState, useEffect, useRef } from 'react';
import { Flame, Thermometer, Radiation, X, Move, AlertTriangle, Check } from 'lucide-react';

// --- Draggable Modal Component ---
interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const DraggableModal: React.FC<DraggableModalProps> = ({ isOpen, onClose, imageUrl }) => {
  const [position, setPosition] = useState({ x: 300, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-[9999] bg-[#1f2937] border border-gray-600 rounded-lg shadow-2xl overflow-hidden flex flex-col"
      style={{ left: position.x, top: position.y, width: '510px', height: '690px' }}
    >
      {/* Draggable Header */}
      <div 
        className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-gray-200 font-bold text-sm">
          <Move size={14} />
          <span>상세 대응 절차도 (SOP Flowchart)</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-black overflow-auto p-2 relative group flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt="SOP Detail" 
          className="max-w-full h-auto object-contain"
        />
      </div>
      
      {/* Footer */}
      <div className="h-12 bg-gray-800 border-t border-gray-700 flex items-center justify-end px-4 gap-2">
         <button onClick={onClose} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold">
            확인 및 닫기
         </button>
      </div>
    </div>
  );
};

// --- Main Row Component ---

const Row1_Status: React.FC = () => {
  // 1. Timer Logic
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 2. Guide Logic
  const [activeGuide, setActiveGuide] = useState<'fire' | 'thermal' | 'radiation'>('fire');
  
  // Independent check states for each type
  const [fireChecks, setFireChecks] = useState({ item1: true, item2: false, item3: false });
  const [thermalChecks, setThermalChecks] = useState({ item1: false, item2: false, item3: false });
  const [radChecks, setRadChecks] = useState({ item1: false, item2: false, item3: false });

  const [showModal, setShowModal] = useState(false);

  // 3. Images
  const IMG_MINIMAP = "https://cdn.imweb.me/upload/S20220215d5bc0d1f16d2a/950b270712fe2.jpg";
  const IMG_CCTV = "https://cdn.imweb.me/upload/S20220215d5bc0d1f16d2a/ef5c7516c10a5.jpg"; // Thermal CCTV
  const IMG_SOP_DETAIL = "https://cdn.imweb.me/upload/S20220215d5bc0d1f16d2a/c16fa70c841c7.png"; // Updated Flowchart

  return (
    <div className="grid grid-cols-12 gap-4 h-[220px]">
      
      {/* Card 1: Situation & Time (Col 3) */}
      <div className="col-span-3 bg-[#1a1b23] rounded-lg p-4 border border-gray-800 flex flex-col h-full">
         <div className="border-l-4 border-[#00aaff] pl-3 mb-3">
            <h2 className="text-white font-bold text-base leading-none">상황 발생 및 시간 관리</h2>
         </div>
         
         <div className="flex-1 flex flex-col gap-3">
            {/* Countdown Box */}
            <div className="flex-1 bg-[#16171d] border border-gray-700 rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
               <div className="text-gray-400 text-xs font-medium mb-1">골든타임 카운트다운</div>
               <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[#ff3d3d] font-mono tracking-wider tabular-nums leading-none drop-shadow-[0_0_8px_rgba(255,61,61,0.5)]">
                     {formatTime(timeLeft)}
                  </span>
                  <span className="text-[#ff5e5e] text-lg font-bold">남음</span>
               </div>
            </div>

            {/* Info Box */}
            <div className="h-[70px] bg-[#16171d] border border-gray-700 rounded-lg flex flex-col justify-center px-5 space-y-1.5 shadow-inner">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">최초 발생 :</span>
                  <span className="text-gray-200 font-medium tracking-wide">2026. 10:09:55</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">현재 위기 단계 :</span>
                  <span className="text-[#ff3d3d] font-bold tracking-wide">심각(Critical)</span>
               </div>
            </div>
         </div>
      </div>

      {/* Wrapper for Equal Width Cards (Col 9 -> split into 2) */}
      <div className="col-span-9 grid grid-cols-2 gap-4 h-full">
         
         {/* Card 2: Disaster Response Guide */}
         <div className="bg-[#1a1b23] rounded-lg p-4 border border-gray-800 flex flex-col h-full">
            <div className="border-l-4 border-[#00aaff] pl-3 mb-3">
               <h2 className="text-white font-bold text-base leading-none">재난 유형별 대응 가이드</h2>
            </div>

            <div className="flex gap-4 h-full overflow-hidden">
               {/* Left: Type Selection Tabs */}
               <div className="flex flex-col gap-2 w-[140px]">
                  {/* Fire Tab */}
                  <button 
                     onClick={() => setActiveGuide('fire')}
                     className={`relative h-12 rounded flex items-center px-3 gap-2 transition-all duration-200 overflow-visible
                        ${activeGuide === 'fire' 
                          ? 'bg-[#5a1919] border border-[#ef4444] text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                          : 'bg-[#252530] border border-gray-700 text-gray-400 hover:bg-[#2f2f3d]'}
                     `}
                  >
                     <div className={`p-1.5 rounded-full ${activeGuide === 'fire' ? 'bg-[#ef4444]' : 'bg-gray-600'} flex items-center justify-center`}>
                        <Flame size={14} className="text-white" fill="currentColor" />
                     </div>
                     <span className="text-sm font-bold">화재감지</span>
                     {activeGuide === 'fire' && (
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-[#ef4444]"></div>
                     )}
                  </button>

                  {/* Thermal Tab */}
                  <button 
                     onClick={() => setActiveGuide('thermal')}
                     className={`relative h-12 rounded flex items-center px-3 gap-2 transition-all duration-200 overflow-visible
                        ${activeGuide === 'thermal' 
                          ? 'bg-[#432310] border border-[#f97316] text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]' 
                          : 'bg-[#252530] border border-gray-700 text-gray-400 hover:bg-[#2f2f3d]'}
                     `}
                  >
                     <div className={`p-1.5 rounded-full ${activeGuide === 'thermal' ? 'bg-[#f97316]' : 'bg-gray-600'} flex items-center justify-center`}>
                        <Thermometer size={14} className="text-white" />
                     </div>
                     <span className="text-sm font-bold">열화상</span>
                     {activeGuide === 'thermal' && (
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-[#f97316]"></div>
                     )}
                  </button>

                  {/* Radiation Tab */}
                  <button 
                     onClick={() => setActiveGuide('radiation')}
                     className={`relative h-12 rounded flex items-center px-3 gap-2 transition-all duration-200 overflow-visible
                        ${activeGuide === 'radiation' 
                          ? 'bg-[#0f3a30] border border-[#0d9488] text-white shadow-[0_0_10px_rgba(13,148,136,0.3)]' 
                          : 'bg-[#252530] border border-gray-700 text-gray-400 hover:bg-[#2f2f3d]'}
                     `}
                  >
                     <div className={`p-1.5 rounded-full ${activeGuide === 'radiation' ? 'bg-[#0d9488]' : 'bg-gray-600'} flex items-center justify-center`}>
                        <Radiation size={14} className="text-white" />
                     </div>
                     <span className="text-sm font-bold">방사선감지</span>
                     {activeGuide === 'radiation' && (
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-[#0d9488]"></div>
                     )}
                  </button>
               </div>

               {/* Right: Action Items */}
               <div className="flex-1 flex flex-col bg-[#16171d] border border-gray-700 rounded p-3 min-w-0">
                  <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-800">
                     <h3 className="text-sm font-bold flex items-center gap-2">
                        <span className={`${activeGuide === 'fire' ? 'text-[#ef4444]' : activeGuide === 'thermal' ? 'text-[#f97316]' : 'text-[#0d9488]'}`}>
                            [{activeGuide === 'fire' ? '화재감지' : activeGuide === 'thermal' ? '열화상 감지' : '방사선 감지'}]
                        </span>
                        <span className="text-gray-200">긴급 행동 요령</span>
                     </h3>
                  </div>
                  
                  <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                     {activeGuide === 'fire' && (
                        <>
                           <label className="flex items-start gap-2 cursor-pointer group">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${fireChecks.item1 ? 'bg-[#00aaff] border-[#00aaff]' : 'border-gray-600 bg-gray-800'}`}>
                                 {fireChecks.item1 && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <input type="checkbox" checked={fireChecks.item1} onChange={() => setFireChecks({...fireChecks, item1: !fireChecks.item1})} className="hidden" />
                              <span className={`text-xs ${fireChecks.item1 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                 <span className="text-[#00aaff] font-bold mr-1">[설비]</span> GT #1 긴급 정지 및 연료 차단 확인
                              </span>
                           </label>
                           <label className="flex items-start gap-2 cursor-pointer group">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${fireChecks.item2 ? 'bg-[#00aaff] border-[#00aaff]' : 'border-gray-600 bg-gray-800'}`}>
                                 {fireChecks.item2 && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <input type="checkbox" checked={fireChecks.item2} onChange={() => setFireChecks({...fireChecks, item2: !fireChecks.item2})} className="hidden" />
                              <span className={`text-xs ${fireChecks.item2 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                 <span className="text-[#00aaff] font-bold mr-1">[전파]</span> 종합방재센터 신고 및 대피 방송 실시
                              </span>
                           </label>
                           <label className="flex items-start gap-2 cursor-pointer group">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${fireChecks.item3 ? 'bg-[#00aaff] border-[#00aaff]' : 'border-gray-600 bg-gray-800'}`}>
                                 {fireChecks.item3 && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <input type="checkbox" checked={fireChecks.item3} onChange={() => setFireChecks({...fireChecks, item3: !fireChecks.item3})} className="hidden" />
                              <span className={`text-xs ${fireChecks.item3 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                 <span className="text-[#00aaff] font-bold mr-1">[소방]</span> Zone A 소화 설비(CO2) 수동 기동 준비
                              </span>
                           </label>
                        </>
                     )}
                     {activeGuide === 'thermal' && (
                        <>
                           <label className="flex items-start gap-2 cursor-pointer group">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${thermalChecks.item1 ? 'bg-[#00aaff] border-[#00aaff]' : 'border-gray-600 bg-gray-800'}`}>
                                 {thermalChecks.item1 && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <input type="checkbox" checked={thermalChecks.item1} onChange={() => setThermalChecks({...thermalChecks, item1: !thermalChecks.item1})} className="hidden" />
                              <span className={`text-xs ${thermalChecks.item1 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                 <span className="text-[#00aaff] font-bold mr-1">[설비]</span> 과열 설비 확인 및 냉각 시스템 가동 점검
                              </span>
                           </label>
                           <label className="flex items-start gap-2 cursor-pointer group">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${thermalChecks.item2 ? 'bg-[#00aaff] border-[#00aaff]' : 'border-gray-600 bg-gray-800'}`}>
                                 {thermalChecks.item2 && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <input type="checkbox" checked={thermalChecks.item2} onChange={() => setThermalChecks({...thermalChecks, item2: !thermalChecks.item2})} className="hidden" />
                              <span className={`text-xs ${thermalChecks.item2 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                 <span className="text-[#00aaff] font-bold mr-1">[전파]</span> 현장 운전원 및 정비팀에 이상 고온 알림
                              </span>
                           </label>
                           <label className="flex items-start gap-2 cursor-pointer group">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${thermalChecks.item3 ? 'bg-[#00aaff] border-[#00aaff]' : 'border-gray-600 bg-gray-800'}`}>
                                 {thermalChecks.item3 && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <input type="checkbox" checked={thermalChecks.item3} onChange={() => setThermalChecks({...thermalChecks, item3: !thermalChecks.item3})} className="hidden" />
                              <span className={`text-xs ${thermalChecks.item3 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                 <span className="text-[#00aaff] font-bold mr-1">[조치]</span> 부하 감발 및 필요시 설비 정지 준비
                              </span>
                           </label>
                        </>
                     )}
                     {activeGuide === 'radiation' && (
                        <>
                           <label className="flex items-start gap-2 cursor-pointer group">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${radChecks.item1 ? 'bg-[#00aaff] border-[#00aaff]' : 'border-gray-600 bg-gray-800'}`}>
                                 {radChecks.item1 && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <input type="checkbox" checked={radChecks.item1} onChange={() => setRadChecks({...radChecks, item1: !radChecks.item1})} className="hidden" />
                              <span className={`text-xs ${radChecks.item1 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                 <span className="text-[#00aaff] font-bold mr-1">[설비]</span> 방사선 모니터링 수치 재확인 및 구역 차단
                              </span>
                           </label>
                           <label className="flex items-start gap-2 cursor-pointer group">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${radChecks.item2 ? 'bg-[#00aaff] border-[#00aaff]' : 'border-gray-600 bg-gray-800'}`}>
                                 {radChecks.item2 && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <input type="checkbox" checked={radChecks.item2} onChange={() => setRadChecks({...radChecks, item2: !radChecks.item2})} className="hidden" />
                              <span className={`text-xs ${radChecks.item2 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                 <span className="text-[#00aaff] font-bold mr-1">[전파]</span> 방사선 안전관리자 호출 및 주변 인원 대피 방송
                              </span>
                           </label>
                           <label className="flex items-start gap-2 cursor-pointer group">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${radChecks.item3 ? 'bg-[#00aaff] border-[#00aaff]' : 'border-gray-600 bg-gray-800'}`}>
                                 {radChecks.item3 && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <input type="checkbox" checked={radChecks.item3} onChange={() => setRadChecks({...radChecks, item3: !radChecks.item3})} className="hidden" />
                              <span className={`text-xs ${radChecks.item3 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                 <span className="text-[#00aaff] font-bold mr-1">[조치]</span> 오염 확산 방지 차폐막 설치 및 제염 준비
                              </span>
                           </label>
                        </>
                     )}
                  </div>

                  <button 
                     onClick={() => setShowModal(true)}
                     className="w-full mt-2 bg-[#2d3b4e] hover:bg-[#3d4d63] border border-gray-600 text-gray-200 py-2 rounded text-xs font-bold transition-colors shadow-md"
                  >
                     상세 대응 절차도 보기
                  </button>
               </div>
            </div>
         </div>

         {/* Card 3: Minimap & CCTV */}
         <div className="bg-[#1a1b23] rounded-lg p-4 border border-gray-800 flex flex-col h-full">
            <div className="border-l-4 border-[#00aaff] pl-3 mb-3">
               <h2 className="text-white font-bold text-base leading-none">건물 미니맵 및 CCTV</h2>
            </div>
            <div className="flex-1 flex justify-center items-center gap-3 h-full overflow-hidden">
               {/* Minimap */}
               <div className="flex-1 h-full bg-[#0b0e14] border border-gray-800 rounded relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={IMG_MINIMAP} 
                    alt="Minimap" 
                    className="w-full h-full object-cover opacity-80" 
                  />
                  {/* Overlay Fire Icon */}
                  <div className="absolute top-[40%] left-[45%] flex flex-col items-center z-10">
                      <div className="w-8 h-8 rounded-full bg-red-600/30 flex items-center justify-center animate-pulse">
                          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_10px_#ef4444]">
                              <Flame size={14} className="text-white fill-white" />
                          </div>
                      </div>
                      <div className="mt-1 bg-black/70 border border-red-500/50 text-red-400 text-[10px] px-1.5 py-0.5 rounded shadow-lg backdrop-blur-sm">
                          A2 2F 1Zone
                      </div>
                  </div>
               </div>
               
               {/* CCTV */}
               <div className="flex-1 h-full bg-black border border-gray-800 rounded relative overflow-hidden flex items-center justify-center group">
                  <img 
                    src={IMG_CCTV} 
                    alt="CCTV" 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                  />
                  {/* Bottom Label Overlay */}
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-[2px] py-1 text-center border-t border-gray-700">
                      <span className="text-xs text-gray-300 font-medium">Camera 102 - BLDG Zone A</span>
                  </div>
                   {/* Bounding Box Simulation */}
                   <div className="absolute top-[40%] left-[20%] w-[30px] h-[50px] border border-yellow-400/70 box-border hidden group-hover:block">
                       <div className="absolute -top-3 left-0 bg-yellow-400/80 text-[8px] text-black px-1 font-bold">Person</div>
                   </div>
                   <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded text-[10px] text-red-400 border border-red-500/50">
                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                     LIVE
                  </div>
               </div>
            </div>
         </div>

      </div>

      {/* Draggable Modal Portal */}
      <DraggableModal 
         isOpen={showModal} 
         onClose={() => setShowModal(false)} 
         imageUrl={IMG_SOP_DETAIL} 
      />

    </div>
  );
};

export default Row1_Status;