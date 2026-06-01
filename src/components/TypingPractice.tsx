import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { IoTimeOutline, IoRefreshOutline, IoWarning, IoSpeedometerOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { Keyboard } from 'lucide-react';
import { useTypingSound } from '@/hooks/useTypingSound';
import VirtualKeyboard from './VirtualKeyboard';
import { TelemetryPayload } from '@/types/lesson';
import { stringToKeys, buildCharMappings, validateInput, getNextHighlightKey, getCharColorStates } from '@/utils/vietnameseTyping';

export interface TypingTask {
  content: string;
  type: string;
  description: string;
  time_limit_seconds: number;
}

interface Props {
  task: TypingTask;
  onComplete: (telemetry: TelemetryPayload) => void;
  onStatsChange?: (stats: { wpm: number; accuracy: number; timeLeft: number; progressPercent: number; animal: string } | null) => void;
}

export default function TypingPractice({ task, onComplete, onStatsChange }: Props) {
  const [isForcedLayout, setIsForcedLayout] = useState<'telex' | 'vni' | null>(null);
  const [typingMethod, setTypingMethod] = useState<'telex' | 'vni'>(() => {
    if (typeof window !== 'undefined') {
      const savedRules = localStorage.getItem('viettyping_admin_rules');
      if (savedRules) {
        try {
          const parsed = JSON.parse(savedRules);
          if (parsed.forceLayout === 'telex' || parsed.forceLayout === 'vni') {
            return parsed.forceLayout;
          }
        } catch (e) {}
      }
      const saved = localStorage.getItem('typingMethod');
      if (saved === 'telex' || saved === 'vni') {
        return saved;
      }
    }
    return 'telex';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRules = localStorage.getItem('viettyping_admin_rules');
      if (savedRules) {
        try {
          const parsed = JSON.parse(savedRules);
          if (parsed.forceLayout === 'telex' || parsed.forceLayout === 'vni') {
            setIsForcedLayout(parsed.forceLayout);
            setTypingMethod(parsed.forceLayout);
          }
        } catch (e) {}
      }
    }
  }, []);

  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(task.time_limit_seconds || 60);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const wrongSoundTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { playCorrectSound, playWrongSound } = useTypingSound();

  // Tự động ẩn bàn phím ảo trên màn hình có chiều cao thấp
  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 700) {
        setShowKeyboard(false);
      } else {
        setShowKeyboard(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const targetKeys = useMemo(() => stringToKeys(task.content, typingMethod), [task.content, typingMethod]);
  const charMappings = useMemo(() => buildCharMappings(task.content, typingMethod), [task.content, typingMethod]);

  const validationResult = useMemo(() => validateInput(task.content, input, typingMethod), [task.content, input, typingMethod]);
  const firstErrorIndex = validationResult.firstErrorIndex;
  const currentProgressIndex = validationResult.currentProgressIndex;
  const charStates = useMemo(() => getCharColorStates(task.content, input, typingMethod), [task.content, input, typingMethod]);

  const calculateStats = useCallback((currentInput = input, currentStartTime = startTime) => {
    if (!currentStartTime) return { wpm: 0, accuracy: 0, incorrectCount: 0 };

    const timeInSeconds = (Date.now() - currentStartTime) / 1000;
    const timeInMinutes = Math.max(timeInSeconds, 3) / 60; // Giới hạn tối thiểu 3s để tránh nổ số WPM ban đầu

    const validation = validateInput(task.content, currentInput, typingMethod);
    const correctKeysCount = validation.currentProgressIndex;
    const currentKeysLength = stringToKeys(currentInput, typingMethod).length;
    const incorrectKeysCount = Math.max(0, currentKeysLength - correctKeysCount);

    const words = correctKeysCount / 5; // Standard WPM: 1 word = 5 keystrokes
    const wpm = Math.round(words / timeInMinutes);
    const accuracy = Math.round((correctKeysCount / Math.max(currentKeysLength, 1)) * 100) || 0;

    return { wpm, accuracy, incorrectCount: incorrectKeysCount };
  }, [task.content, typingMethod, input, startTime]);

  const completeLesson = useCallback((stats: { wpm: number; accuracy: number; incorrectCount: number }) => {
    setIsComplete(true);
    clearInterval(timerRef.current);
    
    const durationSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    
    onComplete({
      score: stats.accuracy,
      durationSeconds,
      metadata: {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        incorrectCount: stats.incorrectCount,
        typingMethod,
      },
    });
  }, [startTime, onComplete, typingMethod]);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const stats = calculateStats();
          completeLesson(stats);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [calculateStats, completeLesson]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;

    const oldValidation = validateInput(task.content, input, typingMethod);
    const oldFirstErrorIndex = oldValidation.firstErrorIndex;

    // Nếu đang có lỗi và người dùng gõ thêm (chiều dài tăng)
    if (oldFirstErrorIndex !== -1 && newInput.length > input.length) {
      playWrongSound();
      return;
    }

    let currentStartTime = startTime;
    if (!startTime) {
      const now = Date.now();
      setStartTime(now);
      currentStartTime = now;
      startTimer();
    }

    if (wrongSoundTimeoutRef.current) {
      clearTimeout(wrongSoundTimeoutRef.current);
      wrongSoundTimeoutRef.current = undefined;
    }

    const newValidation = validateInput(task.content, newInput, typingMethod);
    const newFirstErrorIndex = newValidation.firstErrorIndex;

    const isNewCorrect = newValidation.isValid;
    const isOldCorrect = oldFirstErrorIndex === -1;

    const oldInputKeysLength = stringToKeys(input, typingMethod).length;
    const newInputKeysLength = stringToKeys(newInput, typingMethod).length;

    if (newInputKeysLength > 0) {
      if (isNewCorrect && ((!isOldCorrect && newInputKeysLength >= oldInputKeysLength) || newInputKeysLength > oldInputKeysLength)) {
        playCorrectSound();
      } else if (!isNewCorrect && newInputKeysLength >= oldInputKeysLength) {
        wrongSoundTimeoutRef.current = setTimeout(() => {
          playWrongSound();
        }, 500);
      }
    }

    setInput(newInput);

    if (newInput === task.content || (isNewCorrect && newInputKeysLength === targetKeys.length)) {
      const stats = calculateStats(newInput, currentStartTime);
      completeLesson(stats);
    }
  };

  const handleRestart = useCallback(() => {
    setInput('');
    setStartTime(null);
    setIsComplete(false);
    setTimeLeft(task.time_limit_seconds || 60);
    clearInterval(timerRef.current);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [task.time_limit_seconds]);

  const handleTypingMethodChange = (method: 'telex' | 'vni') => {
    if (isForcedLayout) return;
    setTypingMethod(method);
    localStorage.setItem('typingMethod', method);
    handleRestart();
  };

  useEffect(() => {
    inputRef.current?.focus();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    handleRestart();
  }, [task, handleRestart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key.toLowerCase());
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const { wpm, accuracy } = calculateStats();
  const totalTimeLimit = task.time_limit_seconds || 60;
  const timeLeftPercent = (timeLeft / totalTimeLimit) * 100;

  const getTimerColor = () => {
    if (timeLeftPercent > 50) return 'text-blue-600 bg-blue-50 border-blue-100/50';
    if (timeLeftPercent > 20) return 'text-yellow-600 bg-yellow-50 border-yellow-100/50';
    return 'text-red-600 bg-red-50 border-red-100/50 animate-pulse';
  };

  const getAnimal = () => {
    if (wpm === 0) return '🐢';
    if (wpm < 10) return '🐢';
    if (wpm < 25) return '🐰';
    return '🐆';
  };

  const getSpeedLabel = () => {
    if (wpm === 0) return 'Đang đợi bé gõ phím...';
    if (wpm < 10) return 'Chậm rãi như Rùa 🐢';
    if (wpm < 25) return 'Nhịp nhàng như Thỏ 🐰';
    return 'Siêu tốc như Báo 🐆';
  };

  const getSpeedColor = () => {
    if (wpm === 0) return 'text-slate-400';
    if (wpm < 10) return 'text-orange-500';
    if (wpm < 25) return 'text-green-500';
    return 'text-amber-500 font-extrabold drop-shadow-sm';
  };

  const progressPercent = Math.min(100, Math.round((currentProgressIndex / targetKeys.length) * 100));

  // Gửi thông số gõ phím lên LessonCoordinator để hiển thị trên Header và ProgressBar
  useEffect(() => {
    if (onStatsChange) {
      onStatsChange({
        wpm,
        accuracy,
        timeLeft,
        progressPercent,
        animal: getAnimal()
      });
    }
    return () => {
      if (onStatsChange) onStatsChange(null);
    };
  }, [wpm, accuracy, timeLeft, progressPercent, onStatsChange]);

  return (
    <div className="w-full h-full flex flex-col">
      <style jsx>{`
        @keyframes blink {
          0%, 100% { background-color: rgb(96 165 250); }
          50% { background-color: transparent; }
        }
        .cursor-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>

      {/* Mobile Blocker */}
      <div className="md:hidden flex flex-col items-center justify-center h-full p-8 text-center bg-white/90 rounded-3xl shadow-lg border border-red-100">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <IoWarning size={48} />
        </div>
        <h2 className="text-2xl font-black text-red-600 mb-4">
          Cần bàn phím vật lý!
        </h2>
        <p className="text-gray-600 text-lg">
          Bài tập luyện gõ phím 10 ngón được thiết kế tối ưu nhất khi sử dụng máy tính (Desktop/Laptop). 
          <br/><br/>
          Bé hoặc phụ huynh hãy mở trên thiết bị có bàn phím vật lý để thực hành nhé!
        </p>
      </div>

      {/* Desktop/Tablet Content */}
      <div className="hidden md:flex flex-col w-full h-full min-h-0">
        
        {/* Compact Stats Bar */}
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-white/80 rounded-2xl border border-gray-100 mb-3 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 font-mono font-black text-sm px-3 py-1.5 rounded-xl border ${getTimerColor()}`}>
              <IoTimeOutline className="text-base" />
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <IoSpeedometerOutline className="text-base text-green-500" />
              <span>Tốc độ: <span className="font-extrabold text-green-600 text-sm">{wpm}</span> WPM <span className={`ml-1 font-bold ${getSpeedColor()}`}>{wpm > 0 ? `(${getSpeedLabel()})` : ''}</span></span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <IoCheckmarkCircleOutline className="text-base text-blue-500" />
              <span>Chính xác: <span className="font-extrabold text-blue-600 text-sm">{accuracy}%</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Kiểu gõ Telex / VNI */}
            {isForcedLayout ? (
              <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-black bg-indigo-50 border border-indigo-150 text-indigo-700 rounded-xl uppercase tracking-wider">
                🔒 KHÓA GÕ: {isForcedLayout}
              </span>
            ) : (
              <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
                <button
                  onClick={() => handleTypingMethodChange('telex')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    typingMethod === 'telex'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  TELEX
                </button>
                <button
                  onClick={() => handleTypingMethodChange('vni')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    typingMethod === 'vni'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  VNI
                </button>
              </div>
            )}

            <div className="h-4 w-px bg-gray-200" />

            <button
              onClick={() => setShowKeyboard(prev => !prev)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs border rounded-xl font-bold shadow-sm cursor-pointer transition-colors ${
                showKeyboard 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100" 
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
              title={showKeyboard ? "Ẩn bàn phím ảo" : "Hiện bàn phím ảo"}
            >
              <Keyboard size={14} className="shrink-0" />
              <span>{showKeyboard ? "Ẩn phím" : "Hiện phím"}</span>
            </button>
            
            <button
              onClick={handleRestart}
              className="flex items-center gap-1 px-4 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors font-bold shadow-sm cursor-pointer"
            >
              <IoRefreshOutline className="text-sm" />
              Làm lại
            </button>
          </div>
        </div>

        {/* Typing Display Area */}
        <div className="relative mb-3 p-6 bg-gradient-to-b from-blue-50/50 to-blue-50 rounded-3xl text-3xl font-mono leading-relaxed tracking-wide shadow-inner border-2 border-blue-100 flex flex-wrap content-center items-center justify-center text-center flex-1 min-h-0 overflow-y-auto">
          {/* Hidden input for focus */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            disabled={isComplete}
            className="absolute inset-0 opacity-0 cursor-default z-10"
            autoFocus
          />
          {charMappings.map((mapping, i) => {
            const state = charStates[i] || 'none';
            const isCorrect = state === 'correct';
            const isIncorrect = state === 'incorrect';
            const isCurrent = state === 'current';
              
            let colorClass = 'text-gray-400';
            let borderClass = '';
            
            if (isCorrect) {
              colorClass = 'text-green-600 font-extrabold drop-shadow-sm';
            } else if (isIncorrect) {
              return (
                <motion.span
                  key={i}
                  animate={{ x: [0, -3, 3, -3, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, repeatDelay: 1 }}
                  className="text-red-500 font-extrabold bg-red-100 rounded-md px-1.5 shadow-sm relative inline-block mx-0.5"
                >
                  {mapping.char === ' ' ? '\u00A0' : mapping.char}
                </motion.span>
              );
            } else if (isCurrent) {
              borderClass = 'cursor-blink border-b-4 border-blue-500 font-bold';
            }
            
            return (
              <span
                key={i}
                className={`${colorClass} ${borderClass} relative transition-all duration-150`}
              >
                {mapping.char === ' ' ? '\u00A0' : mapping.char}
              </span>
            );
          })}
        </div>

        {/* Alert Bar cố định hiển thị cảnh báo gõ sai */}
        {firstErrorIndex !== -1 && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-3 p-3.5 bg-red-50 border-2 border-dashed border-red-200 rounded-2xl text-center text-sm font-bold text-red-500 flex items-center justify-center gap-2 shadow-sm relative z-20"
          >
            <span className="text-lg animate-bounce">⚠️</span>
            <span>Bé gõ chưa đúng rồi! Hãy nhấn phím <b>Xóa (⌫)</b> màu tím để sửa lại nhé!</span>
          </motion.div>
        )}

        {/* Keyboard */}
        {showKeyboard && (
          <div className="shrink-0 animate-fade-in">
            <VirtualKeyboard
              pressedKey={pressedKey}
              highlightKey={getNextHighlightKey(task.content, input, typingMethod)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
