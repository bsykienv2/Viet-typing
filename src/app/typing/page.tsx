'use client';

import React, { useState, useEffect } from 'react';
import { lessons, Lesson } from '@/data/lessons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSound } from '@/contexts/SoundContext';
import { Be_Vietnam_Pro } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, BookOpen, Keyboard } from 'lucide-react';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900']
});

const levelNames: Record<string, { name: string; description: string; color: string; icon: string; bgClass: string; borderClass: string; accentColor: string }> = {
  basic: {
    name: 'Cấp Độ Sơ Cấp ⚡',
    description: 'Làm quen các hàng phím cơ bản và quy tắc gõ dấu tiếng Việt',
    color: 'from-cyan-400 to-blue-500',
    icon: '⚡',
    bgClass: 'bg-slate-900/60 backdrop-blur-md',
    borderClass: 'border-slate-800/80',
    accentColor: '#06b6d4',
  },
  intermediate: {
    name: 'Cấp Độ Trung Cấp 🚀',
    description: 'Thực hành gõ các từ ghép và câu văn ngắn tiếng Việt',
    color: 'from-indigo-400 to-purple-500',
    icon: '🚀',
    bgClass: 'bg-slate-900/60 backdrop-blur-md',
    borderClass: 'border-slate-800/80',
    accentColor: '#6366f1',
  },
  advanced: {
    name: 'Cấp Độ Cao Cấp 🔥',
    description: 'Chinh phục đoạn văn dài để rèn luyện tốc độ tối đa và độ chuẩn xác',
    color: 'from-fuchsia-400 to-pink-500',
    icon: '🔥',
    bgClass: 'bg-slate-900/60 backdrop-blur-md',
    borderClass: 'border-slate-800/80',
    accentColor: '#d946ef',
  }
};

export default function TypingPage() {
  const router = useRouter();
  const { playSound } = useSound();
  
  // States cho gamification
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [hoveredLessonId, setHoveredLessonId] = useState<string | null>(null);
  const [adminRules, setAdminRules] = useState<{ unlockRule: 'linear' | 'free'; forceLayout: 'both' | 'telex' | 'vni' } | null>(null);

  // Đọc dữ liệu từ localStorage sau khi component mount
  useEffect(() => {
    try {
      const completed = JSON.parse(localStorage.getItem('typing_completed_lessons') || '[]');
      const savedXp = parseInt(localStorage.getItem('typing_xp') || '0', 10);
      const savedStreak = parseInt(localStorage.getItem('typing_streak') || '0', 10);
      
      setCompletedLessons(completed);
      setXp(savedXp);
      setStreak(savedStreak);

      const savedRules = localStorage.getItem('viettyping_admin_rules');
      if (savedRules) {
        setAdminRules(JSON.parse(savedRules));
      }
    } catch (e) {
      console.error('Failed to load typing progress:', e);
    }
  }, []);

  const getLessonsForLevel = (level: string) => {
    return lessons.filter(lesson => lesson.level === level);
  };

  const handleResetProgress = () => {
    if (confirm('Bạn có muốn thiết lập lại toàn bộ tiến trình luyện tập của mình không? Mọi lịch sử và điểm số sẽ bị xóa.')) {
      try {
        localStorage.removeItem('typing_completed_lessons');
        localStorage.setItem('typing_xp', '0');
        localStorage.setItem('typing_streak', '0');
        
        setCompletedLessons([]);
        setXp(0);
        setStreak(0);
        playSound('tada');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Xác định bài học tiếp theo (bài đầu tiên chưa hoàn thành)
  const getNextLessonId = () => {
    const allLevels = ['basic', 'intermediate', 'advanced'];
    for (const lvl of allLevels) {
      const lvlLessons = getLessonsForLevel(lvl);
      for (const les of lvlLessons) {
        if (!completedLessons.includes(les.id)) {
          return les.id;
        }
      }
    }
    return lessons[0]?.id; // Mặc định là bài đầu tiên
  };

  const nextLessonId = getNextLessonId();

  // Tính phần trăm tiến trình tổng thể
  const totalLessonsCount = lessons.length;
  const completedCount = completedLessons.length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  const handleLessonClick = (lesson: Lesson) => {
    playSound('click');
    router.push(`/typing/${lesson.id}`);
  };

  return (
    <main className={`min-h-screen bg-[#0B0F19] text-slate-100 relative overflow-hidden pb-16 ${beVietnamPro.className}`}>
      
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link
              href="/"
              onClick={() => playSound('click')}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-xl font-bold border border-slate-800 transition-all shadow-md"
            >
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>📚 Học các môn</span>
            </Link>
            <button
              disabled
              className="flex items-center gap-2 px-5 py-3 bg-slate-850 text-cyan-400 rounded-xl font-bold border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] cursor-default"
            >
              <Keyboard className="w-5 h-5" />
              <span>⌨️ Luyện gõ phím</span>
            </button>
            <Link
              href="/admin"
              onClick={() => playSound('click')}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 rounded-xl font-bold border border-slate-800 transition-all shadow-md sm:ml-auto"
            >
              🔑 Quản trị & Giáo viên
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 tracking-wider">
            ⌨️ HỆ THỐNG LUYỆN GÕ PHÍM
          </h1>
        </div>

        {/* Banners for Forced Layouts */}
        {adminRules && adminRules.forceLayout && adminRules.forceLayout !== 'both' && (
          <div className="mb-6 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">YÊU CẦU TỪ GIÁO VIÊN</span>
                <span className="text-sm text-slate-300 font-bold">
                  Hệ thống bắt buộc luyện gõ bằng kiểu gõ: <strong className="text-slate-100 uppercase">{adminRules.forceLayout}</strong>
                </span>
              </div>
            </div>
            <span className="text-xs font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-xl">
              ENFORCED
            </span>
          </div>
        )}

        {/* Dashboard Thành Tích */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 mb-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 w-full md:w-auto">
            
            {/* Card XP */}
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl shadow-inner min-w-[140px]">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="text-3xl"
              >
                🏆
              </motion.div>
              <div>
                <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Tích lũy</div>
                <div className="text-2xl font-black text-amber-400">{xp} XP</div>
              </div>
            </div>

            {/* Card Streak */}
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl shadow-inner min-w-[140px]">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="text-3xl"
              >
                🔥
              </motion.div>
              <div>
                <div className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Chuỗi ngày</div>
                <div className="text-2xl font-black text-orange-400">{streak} ngày</div>
              </div>
            </div>

            {/* Card Progress */}
            <div className="flex flex-col bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl shadow-inner min-w-[220px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Tiến trình học</span>
                <span className="text-sm font-black text-cyan-400">{completedCount}/{totalLessonsCount} bài</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                <motion.div 
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-400 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 rounded-xl transition-all border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Thiết lập lại tiến trình
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto bg-slate-950/60 backdrop-blur-sm p-2 rounded-2xl border border-slate-800">
          {(['basic', 'intermediate', 'advanced'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            const tabInfo = levelNames[tab];
            
            return (
              <button
                key={tab}
                onClick={() => {
                  playSound('click');
                  setActiveTab(tab);
                }}
                className={`relative px-4 py-3.5 rounded-xl font-black text-sm md:text-base flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected 
                    ? `bg-gradient-to-r ${tabInfo.color} text-slate-950 font-black shadow-lg scale-102` 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className="text-xl md:text-2xl">{tabInfo.icon}</span>
                <span className={beVietnamPro.className}>{tab === 'basic' ? 'Sơ Cấp' : tab === 'intermediate' ? 'Trung Cấp' : 'Cao Cấp'}</span>
              </button>
            );
          })}
        </div>

        {/* Cấp độ đang chọn */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl p-6 md:p-8 border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl relative"
          >
            {/* Glow effect on active level panel */}
            <div className={`absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r ${levelNames[activeTab].color} opacity-40`} />

            {/* Banner level */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 text-center sm:text-left border-b border-slate-800 pb-6">
              <span className="text-5xl md:text-6xl p-4 bg-slate-950 rounded-2xl shadow-inner border border-slate-800">
                {levelNames[activeTab].icon}
              </span>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                  {levelNames[activeTab].name}
                </h2>
                <p className="text-slate-400 text-sm md:text-base mt-1 font-medium">
                  {levelNames[activeTab].description}
                </p>
              </div>
            </div>

            {/* Grid bài học */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {getLessonsForLevel(activeTab).map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isNext = lesson.id === nextLessonId;
                const isUnlockFree = adminRules?.unlockRule === 'free';
                const isLocked = !isUnlockFree && !isCompleted && !isNext && completedLessons.length < lessons.findIndex(l => l.id === lesson.id);

                let btnBgClass = 'bg-slate-950 border-slate-900 text-slate-700 cursor-not-allowed opacity-40';
                
                if (isCompleted) {
                  btnBgClass = 'bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:translate-y-[2px]';
                } else if (isNext) {
                  btnBgClass = 'bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-400/20 active:translate-y-[2px] ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-slate-900 animate-pulse';
                } else if (!isLocked) {
                  btnBgClass = 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100 active:translate-y-[2px]';
                }

                return (
                  <div key={lesson.id} className="relative flex flex-col items-center">
                    {/* Nút bài học 3D */}
                    <button
                      onClick={() => !isLocked && handleLessonClick(lesson)}
                      onMouseEnter={() => {
                        setHoveredLessonId(lesson.id);
                        if (!isLocked) playSound('click');
                      }}
                      onMouseLeave={() => setHoveredLessonId(null)}
                      disabled={isLocked}
                      className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-3xl font-black font-sans transition-all relative z-10 ${btnBgClass} ${
                        !isLocked ? 'cursor-pointer' : ''
                      }`}
                    >
                      {isCompleted ? (
                        <div className="relative">
                          <span>{index + 1}</span>
                          <span className="absolute -bottom-1.5 -right-1.5 bg-slate-950 text-emerald-400 rounded-full p-0.5 border border-emerald-400 text-[10px] shadow-sm">
                            <Check className="w-3 h-3 stroke-[4px]" />
                          </span>
                        </div>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </button>

                    {/* Tiêu đề ngắn gọn */}
                    <span className="text-xs font-bold text-slate-400 mt-3 text-center line-clamp-1 max-w-[110px]">
                      {lesson.title.replace('Luyện gõ ', '')}
                    </span>

                    {/* Tooltip thông tin */}
                    <AnimatePresence>
                      {hoveredLessonId === lesson.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full mb-3 z-50 bg-slate-950 text-slate-100 p-3.5 rounded-xl shadow-2xl w-48 text-center text-xs pointer-events-none border border-slate-800"
                        >
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1.5 border-4 border-transparent border-t-slate-950" />
                          <h4 className="font-extrabold text-cyan-400 text-sm mb-1">{lesson.title}</h4>
                          <p className="text-slate-400 mb-2">{lesson.description}</p>
                          <div className="flex justify-around bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <div>
                              <div className="text-slate-500 font-bold font-sans">Mục tiêu</div>
                              <div className="font-bold text-emerald-400">🎯 {lesson.targetWPM} WPM</div>
                            </div>
                            <div className="w-[1px] bg-slate-800" />
                            <div>
                              <div className="text-slate-500 font-bold font-sans">Độ chuẩn</div>
                              <div className="font-bold text-sky-400">⭐ {lesson.minAccuracy}%</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Hướng dẫn Đặt Ngón Tay */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 mt-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-3xl shrink-0">
            💡
          </div>
          <div>
            <h3 className="text-lg font-bold text-cyan-400">
              Bí quyết luyện gõ phím chuyên nghiệp
            </h3>
            <p className="text-slate-400 text-sm md:text-base mt-1 leading-relaxed">
              Hãy luôn đặt hai ngón tay trỏ lên các phím định vị có gờ nổi là <span className="font-bold text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded-md border border-slate-800">F</span> và <span className="font-bold text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded-md border border-slate-800">J</span>. Giữ lưng thẳng, mắt nhìn màn hình và dùng ngón cái để nhấn phím Cách (Spacebar). Không nhìn xuống bàn phím khi gõ!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
