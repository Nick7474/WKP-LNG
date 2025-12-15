import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Send, Activity, Radio, Zap, Check, AlertTriangle, HelpCircle } from 'lucide-react';
import { SOPStep } from '../types';

const sopSteps: SOPStep[] = [
  {
    id: 1,
    title: '화재 감지 인식',
    description: '화재수신반에서 화재를 감지하면 경보가 송출',
    checklist: [
      '화재수신반에서 화재를 감지하면 경보가 송출',
      '화재수신반을 통해 화재신호 위치를 확인'
    ]
  },
  {
    id: 2,
    title: '화재 상황 전파',
    description: '통합관제센터 상황 접수자는 무전기 및 구두로 관련 담당자에게 전파',
    checklist: [
      '통합관제센터 상황 접수자는 무전기 및 구두로 관련 담당자에게 전파 (센터장, 부속의원, 상위 선임자 등)',
      '통합관제센터 근무 인원은 정확한 화재 위치를 파악',
      '사외지역 거주자에게 휴대폰 메시지를 통해 화재 상황을 전파',
      '비상차량 출동 지시 : 소방차 및 구급차',
      '의료반은 화재 상황에 따라 화재 발생 층으로 이동한다.'
    ]
  },
  {
    id: 3,
    title: '현장 출동 확인',
    description: '통합관제센터는 방재요원 및 비상출동 인원을 현장으로 신속히 출동',
    checklist: [
      '통합관제센터는 방재요원 및 비상출동 인원을 현장으로 신속히 출동',
      '방재요원은 공기호흡기와 방화복을 착용하고 화재 진압 장비를 휴대',
      '현장 도착자는 즉시 상황실에 화재 상황을 보고',
      '현장에서 초기 화재 진압 및 인명 구조 활동을 실시'
    ]
  },
  {
    id: 4,
    title: '상황 판단',
    description: '현장지휘자는 화재 규모 및 유형을 신속히 파악',
    checklist: [
      '현장지휘자는 화재 규모 및 유형을 신속히 파악',
      '자체 진압이 불가능하다고 판단될 경우 소방서에 지원을 요청',
      '자위 소방대는 화재 진압 가능 여부를 판단 (C/D급 사고 구분)'
    ]
  },
  {
    id: 5,
    title: '상황 종료 및 보고',
    description: '잔불 정리 및 안전 조치',
    checklist: [
      '잔불 정리 및 안전 조치를 시행',
      '피해 규모 1차 집계 및 상부 보고',
      '사후 강평 및 보고서 작성'
    ]
  }
];

interface ModalProps {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  text: string;
  onConfirm?: () => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, type, text, onConfirm, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-6 w-[360px] shadow-2xl transform scale-100 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type === 'alert' ? 'bg-red-900/30 text-red-500' : 'bg-blue-900/30 text-blue-500'}`}>
            {type === 'alert' ? <AlertTriangle size={24} /> : <HelpCircle size={24} />}
          </div>
          <h3 className="text-white font-bold text-lg">{type === 'alert' ? '알림' : '확인'}</h3>
          <p className="text-gray-300 text-sm whitespace-pre-wrap">{text}</p>
          
          <div className="flex gap-3 w-full mt-2">
            {type === 'confirm' ? (
              <>
                <button onClick={onConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded text-sm font-bold transition-colors shadow-lg shadow-blue-900/20">확인</button>
                <button onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded text-sm font-bold transition-colors border border-gray-600">취소</button>
              </>
            ) : (
               <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded text-sm font-bold transition-colors shadow-lg shadow-blue-900/20">확인</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Row2_SOP: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(2); // Track the furthest step reached
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  // Use Ref to store the callback to avoid closure staleness or React functional update issues
  const pendingActionRef = useRef<(() => void) | null>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, type: 'alert' | 'confirm', text: string}>({
    isOpen: false,
    type: 'alert',
    text: ''
  });

  // Constants for slider
  const INACTIVE_WIDTH = 350;
  const ACTIVE_WIDTH = 550;
  const GAP = 24;
  const PADDING_X = 20;

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const activeIndex = activeStep - 1;
      const totalSteps = sopSteps.length;

      const currentCardsLeftWidth = activeIndex * (INACTIVE_WIDTH + GAP);
      const activeCardCenterOnTrack = currentCardsLeftWidth + (ACTIVE_WIDTH / 2);
      const minCenter = PADDING_X + ACTIVE_WIDTH / 2;
      const maxCenter = containerWidth - PADDING_X - ACTIVE_WIDTH / 2;
      const t = activeIndex / (totalSteps - 1);
      const targetViewportCenter = minCenter + (maxCenter - minCenter) * t;
      const offset = targetViewportCenter - activeCardCenterOnTrack;
      
      setTranslateX(offset);
    }
  }, [activeStep]);

  const handleStepClick = (id: number) => {
    // Allow viewing any step regardless of progress (Content Visibility)
    setActiveStep(id);
  };

  const advanceStep = () => {
    if (activeStep < sopSteps.length) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      // Only update maxReachedStep if we are advancing beyond current max
      if (nextStep > maxReachedStep) {
        setMaxReachedStep(nextStep);
      }
    }
  };

  const resetProcess = () => {
    // Reset to step 1 to simulate "Next SOP Event"
    setActiveStep(1);
    setMaxReachedStep(1);
    setCheckedItems(new Set());
  };

  const handleComplete = () => {
    // 1. If we are on a step that is already "completed" (less than maxReached), just move forward without checks
    if (activeStep < maxReachedStep) {
      setActiveStep(prev => prev + 1);
      return;
    }

    // 2. If it's the last step
    if (activeStep === sopSteps.length) {
      setModalConfig({
        isOpen: true,
        type: 'confirm',
        text: '화재감지 이벤트의 SOP 조치를 모두 완료 하겠습니까?'
      });
      pendingActionRef.current = resetProcess;
      return;
    }

    // 3. Normal validation for the current max step
    const currentStep = sopSteps.find(s => s.id === activeStep);
    const isFullyChecked = currentStep 
      ? currentStep.checklist.every((_, idx) => checkedItems.has(`${activeStep}-${idx}`))
      : false;

    if (!isFullyChecked) {
      setModalConfig({
        isOpen: true,
        type: 'confirm',
        text: '해당 스텝의 모든 조치를 완료 하시겠습니까?'
      });
      // Logic: Mark all items as checked if user confirms skipping checks
      pendingActionRef.current = () => {
        if (currentStep) {
          setCheckedItems(prev => {
            const newSet = new Set(prev);
            currentStep.checklist.forEach((_, idx) => {
              newSet.add(`${activeStep}-${idx}`);
            });
            return newSet;
          });
        }
        advanceStep();
      };
    } else {
      advanceStep();
    }
  };

  const handleHold = () => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      text: '현재 단계를 보류하시겠습니까?'
    });
    pendingActionRef.current = () => {}; // No-op
  };

  const handleModalClose = () => {
    setModalConfig(prev => ({...prev, isOpen: false}));
  };

  const handleModalConfirm = () => {
    if (pendingActionRef.current) {
      pendingActionRef.current();
    }
    handleModalClose();
  };

  const toggleCheckItem = (stepId: number, idx: number) => {
    // Allow checking items only if we are on a valid reachable step
    if (stepId > maxReachedStep) return;

    const key = `${stepId}-${idx}`;
    const newSet = new Set(checkedItems);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setCheckedItems(newSet);
  };

  return (
    <div className="flex flex-col h-[420px] relative">
      <Modal 
        isOpen={modalConfig.isOpen} 
        type={modalConfig.type} 
        text={modalConfig.text} 
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />

      {/* Cards Container with Slider Logic */}
      <div className="flex-1 overflow-hidden relative flex items-center" ref={containerRef}>
         <div 
           className="flex items-center h-full absolute top-0 left-0 transition-transform duration-500 ease-out pl-[20px]"
           style={{ transform: `translateX(${translateX}px)`, gap: `${GAP}px` }}
         >
          {sopSteps.map((step) => {
            const isActive = step.id === activeStep;
            // A step is considered visually completed if it's less than maxReachedStep
            // AND it's not the currently active step (unless active is also max, handled by isActive styling).
            const isCompleted = step.id < maxReachedStep && step.id !== activeStep;

            let cardStyle = "";
            let headerColor = "";

            if (isCompleted) {
              cardStyle = "border-green-800 bg-[#0f2a1d] opacity-80 scale-95";
              headerColor = "text-green-400";
            } else if (isActive) {
              cardStyle = "border-[#00aaff] bg-[#001e38] scale-100 z-10 shadow-[0_0_30px_rgba(0,170,255,0.2)] min-w-[550px]";
              headerColor = "text-white";
            } else {
              // Future steps
              cardStyle = "border-gray-700 bg-[#1f2029] opacity-70 scale-95";
              headerColor = "text-gray-400";
            }

            return (
              <div 
                key={step.id} 
                onClick={() => handleStepClick(step.id)}
                className={`
                  transition-all duration-500 ease-out cursor-pointer relative flex-shrink-0
                  border rounded-lg p-5 flex flex-col justify-between h-[320px]
                  ${isActive ? 'w-[550px]' : 'w-[350px] hover:opacity-100'}
                  ${cardStyle}
                `}
              >
                <div className="flex-1 min-h-0 flex flex-col">
                  <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-2 flex-none">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${isCompleted ? 'bg-green-700 text-white' : (isActive ? 'border border-blue-400 text-blue-400' : 'border border-gray-600 text-gray-500')}`}>
                      STEP 0{step.id}
                    </span>
                    <h3 className={`text-lg font-bold ${headerColor}`}>{step.title}</h3>
                  </div>

                  <div className={`overflow-y-auto custom-scrollbar pr-2 space-y-2 flex-1`}>
                    {step.checklist.map((item, idx) => {
                      const isChecked = checkedItems.has(`${step.id}-${idx}`);
                      
                      return (
                        <div 
                          key={idx} 
                          onClick={(e) => {
                            if (isActive) {
                              e.stopPropagation();
                              toggleCheckItem(step.id, idx);
                            }
                          }}
                          className={`
                            p-2 rounded border flex items-start gap-3 transition-colors 
                            ${isActive ? 'cursor-pointer' : ''}
                            ${isActive 
                               ? (isChecked ? 'bg-[#002b4d] border-blue-500' : 'bg-transparent border-white/10 hover:bg-white/5') 
                               : 'bg-transparent border-white/5'}
                          `}
                        >
                          <div className="mt-0.5 min-w-[20px]">
                            {isCompleted ? (
                              <CheckCircle size={20} className="text-green-500" />
                            ) : isActive ? (
                              isChecked ? (
                                <div className="w-5 h-5 bg-[#00aaff] rounded flex items-center justify-center">
                                   <Check size={16} className="text-white" strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-500 rounded"></div>
                              )
                            ) : (
                              <div className="w-5 h-5 border border-gray-600 rounded"></div>
                            )}
                          </div>
                          <span className={`text-sm leading-tight ${isCompleted ? 'text-green-100/70' : (isActive ? 'text-blue-50' : 'text-gray-500')}`}>
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {isActive && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex gap-2 flex-none">
                    {step.id <= maxReachedStep ? (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComplete();
                          }}
                          className="flex-1 bg-[#00aaff] hover:bg-[#0088cc] text-white py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          <Send size={14} />
                          조치완료
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHold();
                          }}
                          className="px-4 bg-[#2d3748] hover:bg-[#3d4a61] text-gray-300 rounded font-medium border border-gray-600 transition-colors text-sm"
                        >
                          보류
                        </button>
                      </>
                    ) : (
                      <div className="w-full py-2 text-center text-gray-500 text-sm bg-gray-800/30 rounded border border-gray-700 border-dashed cursor-not-allowed">
                        이전 단계 완료 후 조치 가능
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Timeline/Stepper */}
      <div className="h-[80px] w-full px-12 relative flex items-center justify-center mt-2">
        <div className="absolute top-[25px] left-20 right-20 h-1 bg-gray-700 -z-1">
           <div 
             className="h-full bg-gradient-to-r from-[#00c853] via-[#00aaff] to-gray-700 transition-all duration-500" 
             style={{ width: `${(activeStep / sopSteps.length) * 100}%` }}
           ></div>
        </div>

        <div className="flex justify-between w-full max-w-[1400px]">
          {sopSteps.map((step) => {
             const isActive = step.id === activeStep;
             const isCompleted = step.id < maxReachedStep && step.id !== activeStep;
             
             let iconColor = "text-gray-500 border-gray-600 bg-[#1a1b23]";
             if (isCompleted) iconColor = "text-green-500 border-green-500 bg-[#1a1b23] shadow-[0_0_10px_rgba(0,200,83,0.3)]";
             if (isActive) iconColor = "text-[#00aaff] border-[#00aaff] bg-[#1a1b23] shadow-[0_0_15px_rgba(0,170,255,0.5)] scale-125";

             return (
               <div 
                 key={step.id} 
                 className="flex flex-col items-center gap-2 cursor-pointer group"
                 onClick={() => handleStepClick(step.id)}
               >
                 <div className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300
                    ${iconColor}
                 `}>
                    {step.id === 1 && <Activity size={20} />}
                    {step.id === 2 && <Send size={20} />}
                    {step.id === 3 && <Radio size={20} />}
                    {step.id === 4 && <Zap size={20} />}
                    {step.id === 5 && <CheckCircle size={20} />}
                 </div>
                 <span className={`text-sm font-medium mt-[5px] transition-colors ${isActive ? 'text-[#00aaff]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                   {step.id}. {step.title}
                 </span>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default Row2_SOP;