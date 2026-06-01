'use client';

import React, { useState, useEffect } from 'react';
import { lessons, Lesson } from '@/data/lessons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import { Be_Vietnam_Pro } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, Keyboard, Home, GraduationCap, Lock, Trophy, Flame } from 'lucide-react';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900']
});

const levelNames: Record<string, { name: string; description: string; color: string; icon: string; bgClass: string; borderClass: string; accentColor: string; lightBg: string; lightBorder: string }> = {
  basic: {
    name: 'Cấp Độ Sơ Cấp ⚡',
    description: 'Làm quen các hàng phím cơ bản và quy tắc gõ dấu tiếng Việt',
    color: 'from-sky-500 to-blue-600',
    icon: '⚡',
    bgClass: 'bg-white',
    borderClass: 'border-sky-200',
    accentColor: '#0ea5e9',
    lightBg: 'bg-sky-50',
    lightBorder: 'border-sky-100',
  },
  intermediate: {
    name: 'Cấp Độ Trung Cấp 🚀',
    description: 'Thực hành gõ các từ ghép và câu văn ngắn tiếng Việt',
    color: 'from-indigo-500 to-purple-600',
    icon: '🚀',
    bgClass: 'bg-white',
    borderClass: 'border-indigo-200',
    accentColor: '#6366f1',
    lightBg: 'bg-indigo-50',
    lightBorder: 'border-indigo-100',
  },
  advanced: {
    name: 'Cấp Độ Cao Cấp 🔥',
    description: 'Chinh phục đoạn văn dài để rèn luyện tốc độ tối đa và độ chuẩn xác',
    color: 'from-rose-500 to-pink-600',
    icon: '🔥',
    bgClass: 'bg-white',
    borderClass: 'border-rose-200',
    accentColor: '#f43f5e',
    lightBg: 'bg-rose-50',
    lightBorder: 'border-rose-100',
  }
};

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  grade: string;
  xp: number;
  wpm: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Minh Anh", avatar: "🦁", grade: "Lớp 8A", xp: 12450, wpm: 72 },
  { rank: 2, name: "Thảo Vy", avatar: "🐰", grade: "Lớp 7C", xp: 11200, wpm: 68 },
  { rank: 3, name: "Tuấn Kiệt", avatar: "🐯", grade: "Lớp 9B", xp: 10950, wpm: 65 },
  { rank: 4, name: "Gia Bảo", avatar: "🐼", grade: "Lớp 6A", xp: 9800, wpm: 58 },
  { rank: 5, name: "Bảo Trâm", avatar: "🦊", grade: "Lớp 8B", xp: 9400, wpm: 57 },
  { rank: 6, name: "Duy Khánh", avatar: "🐨", grade: "Lớp 7A", xp: 8900, wpm: 55 },
  { rank: 7, name: "Khánh Linh", avatar: "🦄", grade: "Lớp 9A", xp: 8650, wpm: 54 },
  { rank: 8, name: "Hoàng Long", avatar: "🐸", grade: "Lớp 8C", xp: 8200, wpm: 52 },
  { rank: 9, name: "Phương Vy", avatar: "🐙", grade: "Lớp 6C", xp: 7900, wpm: 50 },
  { rank: 10, name: "Hải Đăng", avatar: "🐳", grade: "Lớp 7B", xp: 7500, wpm: 49 },
  { rank: 11, name: "Quỳnh Chi", avatar: "🦋", grade: "Lớp 9D", xp: 7200, wpm: 48 },
  { rank: 12, name: "Hữu Phước", avatar: "🐵", grade: "Lớp 8D", xp: 6900, wpm: 47 },
  { rank: 13, name: "Ngọc Mai", avatar: "🌸", grade: "Lớp 6B", xp: 6600, wpm: 46 },
  { rank: 14, name: "Đức Huy", avatar: "🐧", grade: "Lớp 7D", xp: 6300, wpm: 45 },
  { rank: 15, name: "Thành Đạt", avatar: "🦅", grade: "Lớp 9C", xp: 6000, wpm: 44 },
  { rank: 16, name: "Anh Thư", avatar: "🐈", grade: "Lớp 8A", xp: 5700, wpm: 43 },
  { rank: 17, name: "Quốc Anh", avatar: "🐺", grade: "Lớp 7A", xp: 5400, wpm: 42 },
  { rank: 18, name: "Tuyết Vy", avatar: "🦌", grade: "Lớp 6A", xp: 5100, wpm: 41 },
  { rank: 19, name: "Hoài Nam", avatar: "🦁", grade: "Lớp 8C", xp: 4800, wpm: 40 },
  { rank: 20, name: "Bảo Châu", avatar: "🐼", grade: "Lớp 9B", xp: 4500, wpm: 39 },
];

export default function TypingPage() {
  const router = useRouter();
  const { playSound } = useSound();
  const { isConfigured, setIsOpenConfig } = useStudent();
  
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

    // Kiểm tra trigger mở modal đăng ký tài khoản từ redirect
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('triggerRegister') === 'true') {
        setIsOpenConfig(true);
        // Clean URL params
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [setIsOpenConfig]);

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

  const handleLessonClick = (lesson: Lesson, isLocked: boolean, isLimit: boolean) => {
    if (isLimit) {
      playSound('error');
      setIsOpenConfig(true);
      return;
    }
    if (isLocked) {
      playSound('error');
      return;
    }
    playSound('click');
    router.push(`/typing/${lesson.id}`);
  };

  return (
    <main className={`min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden pb-16 ${beVietnamPro.className}`}>
      
      {/* Light decorative background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/50 blur-[120px]" />
      </div>

      <div className="max-w-[1500px] mx-auto px-6 py-8 relative z-10">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link
              href="/"
              onClick={() => playSound('click')}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-xl font-bold border-2 border-slate-200 transition-all shadow-sm cursor-pointer"
            >
              <Home className="w-5 h-5 text-sky-500" />
              <span>Trang chủ</span>
            </Link>
            <button
              disabled
              className="flex items-center gap-2 px-5 py-3 bg-sky-50 text-sky-700 rounded-xl font-bold border-2 border-sky-200 shadow-sm cursor-default"
            >
              <Keyboard className="w-5 h-5" />
              <span>⌨️ Luyện gõ phím</span>
            </button>
            <Link
              href="/admin"
              onClick={() => playSound('click')}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-amber-600 hover:text-amber-700 rounded-xl font-bold border-2 border-slate-200 transition-all shadow-sm sm:ml-auto cursor-pointer"
            >
              <GraduationCap className="w-5 h-5" />
              Giáo viên
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 tracking-wider">
            ⌨️ LUYỆN GÕ PHÍM
          </h1>
        </div>

        {/* Banners for Forced Layouts */}
        {adminRules && adminRules.forceLayout && adminRules.forceLayout !== 'both' && (
          <div className="mb-6 bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">YÊU CẦU TỪ GIÁO VIÊN</span>
                <span className="text-sm text-slate-600 font-bold">
                  Hệ thống bắt buộc luyện gõ bằng kiểu gõ: <strong className="text-slate-800 uppercase">{adminRules.forceLayout}</strong>
                </span>
              </div>
            </div>
            <span className="text-xs font-black bg-indigo-100 text-indigo-600 border border-indigo-200 px-3 py-1 rounded-xl">
              ENFORCED
            </span>
          </div>
        )}

        {/* Grid chia 2 cột chính */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
          
          {/* CỘT TRÁI: Bảng xếp hạng Top 20 (chiếm 3 cột trên lg) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm lg:sticky lg:top-24 max-h-[82vh] flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-100 shrink-0">
              <Trophy className="w-6 h-6 text-amber-500 fill-amber-500" />
              <h2 className="text-lg font-black text-slate-800">Top 20 Cao Thủ</h2>
            </div>

            {/* List học sinh scrollable */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 custom-scrollbar">
              {mockLeaderboard.map((student) => {
                let rankBg = 'bg-slate-50 border-slate-200';
                let rankTextColor = 'text-slate-500';
                if (student.rank === 1) {
                  rankBg = 'bg-amber-50 border-amber-200 ring-2 ring-amber-400/30';
                  rankTextColor = 'text-amber-600';
                } else if (student.rank === 2) {
                  rankBg = 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/20';
                  rankTextColor = 'text-slate-600';
                } else if (student.rank === 3) {
                  rankBg = 'bg-orange-50 border-orange-200 ring-2 ring-orange-400/20';
                  rankTextColor = 'text-orange-600';
                }

                return (
                  <div
                    key={student.rank}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all hover:translate-x-1 ${rankBg}`}
                  >
                    {/* Rank number */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${rankTextColor} bg-white border border-slate-200 shadow-sm`}>
                      {student.rank}
                    </div>

                    {/* Avatar Emoji */}
                    <span className="text-2xl">{student.avatar}</span>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm text-slate-800 truncate leading-tight">
                        {student.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {student.grade}
                      </div>
                    </div>

                    {/* XP & WPM */}
                    <div className="text-right shrink-0">
                      <div className="font-black text-xs text-sky-600">{student.xp} XP</div>
                      <div className="text-[10px] font-bold text-emerald-500">{student.wpm} WPM</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI: Dashboard và danh sách bài học (chiếm 9 cột trên lg) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Dashboard Thành Tích */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 w-full md:w-auto">
                
                {/* Card XP */}
                <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-200 px-5 py-3 rounded-xl min-w-[140px]">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    className="text-3xl"
                  >
                    🏆
                  </motion.div>
                  <div>
                    <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Tích lũy</div>
                    <div className="text-2xl font-black text-amber-600">{xp} XP</div>
                  </div>
                </div>

                {/* Card Streak */}
                <div className="flex items-center gap-3 bg-orange-50 border-2 border-orange-200 px-5 py-3 rounded-xl min-w-[140px]">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="text-3xl"
                  >
                    🔥
                  </motion.div>
                  <div>
                    <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Chuỗi ngày</div>
                    <div className="text-2xl font-black text-orange-600">{streak} ngày</div>
                  </div>
                </div>

                {/* Card Progress */}
                <div className="flex flex-col bg-sky-50 border-2 border-sky-200 px-5 py-3 rounded-xl min-w-[220px]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">Tiến trình học</span>
                    <span className="text-sm font-black text-sky-600">{completedCount}/{totalLessonsCount} bài</span>
                  </div>
                  <div className="w-full bg-sky-100 h-3 rounded-full overflow-hidden border border-sky-200">
                    <motion.div 
                      className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetProgress}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-400 bg-slate-100 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all border-2 border-slate-200 hover:border-rose-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Thiết lập lại tiến trình
              </button>
            </div>

            {/* Tab Selector */}
            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto bg-white p-2 rounded-2xl border-2 border-slate-200 shadow-sm">
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
                        ? `bg-gradient-to-r ${tabInfo.color} text-white font-black shadow-lg` 
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
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
                className={`rounded-3xl p-6 md:p-8 border-2 ${levelNames[activeTab].borderClass} bg-white shadow-lg relative`}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r ${levelNames[activeTab].color} rounded-full`} />

                {/* Banner level */}
                <div className={`flex flex-col sm:flex-row items-center gap-4 mb-8 text-center sm:text-left border-b border-slate-200 pb-6`}>
                  <span className={`text-5xl md:text-6xl p-4 ${levelNames[activeTab].lightBg} rounded-2xl shadow-inner border-2 ${levelNames[activeTab].lightBorder}`}>
                    {levelNames[activeTab].icon}
                  </span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                      {levelNames[activeTab].name}
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base mt-1 font-medium">
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
                    
                    // Logic khóa tuần tự mặc định của admin
                    const isLockedByProgress = !isUnlockFree && !isCompleted && !isNext && completedLessons.length < lessons.findIndex(l => l.id === lesson.id);

                    // Giới hạn 3 bài học cho học sinh chưa đăng ký
                    const isUnregisteredLimit = index >= 3 && !isConfigured;

                    // Bài bị khóa nếu thỏa 1 trong 2 điều kiện khóa
                    const isLocked = isLockedByProgress || isUnregisteredLimit;

                    let btnBgClass = 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50';
                    
                    if (isUnregisteredLimit) {
                      btnBgClass = 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100 transition-all cursor-pointer shadow-sm';
                    } else if (isCompleted) {
                      btnBgClass = 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-emerald-300 shadow-md shadow-emerald-500/15 hover:shadow-lg hover:shadow-emerald-500/25 active:translate-y-[2px] cursor-pointer';
                    } else if (isNext) {
                      btnBgClass = 'bg-gradient-to-br from-sky-400 to-blue-500 text-white border-sky-300 shadow-md shadow-sky-400/20 active:translate-y-[2px] ring-2 ring-sky-400/60 ring-offset-2 ring-offset-white animate-pulse cursor-pointer';
                    } else if (!isLockedByProgress) {
                      btnBgClass = 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-sky-300 hover:text-sky-600 active:translate-y-[2px] shadow-sm cursor-pointer';
                    }

                    return (
                      <div key={lesson.id} className="relative flex flex-col items-center">
                        {/* Nút bài học */}
                        <button
                          onClick={() => handleLessonClick(lesson, isLockedByProgress, isUnregisteredLimit)}
                          onMouseEnter={() => {
                            setHoveredLessonId(lesson.id);
                            if (!isLockedByProgress) playSound('click');
                          }}
                          onMouseLeave={() => setHoveredLessonId(null)}
                          className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-3xl font-black font-sans transition-all relative z-10 ${btnBgClass}`}
                        >
                          {isUnregisteredLimit ? (
                            <Lock className="w-6 h-6 text-amber-500 stroke-[3px]" />
                          ) : isCompleted ? (
                            <div className="relative">
                              <span>{index + 1}</span>
                              <span className="absolute -bottom-1.5 -right-1.5 bg-white text-emerald-500 rounded-full p-0.5 border-2 border-emerald-400 text-[10px] shadow-sm">
                                <Check className="w-3 h-3 stroke-[4px]" />
                              </span>
                            </div>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </button>

                        {/* Tiêu đề ngắn gọn */}
                        <span className="text-xs font-bold text-slate-500 mt-3 text-center line-clamp-1 max-w-[110px]">
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
                              className="absolute bottom-full mb-3 z-50 bg-white text-slate-800 p-3.5 rounded-xl shadow-xl w-48 text-center text-xs pointer-events-none border-2 border-slate-200"
                            >
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1.5 border-4 border-transparent border-t-white" />
                              {isUnregisteredLimit ? (
                                <>
                                  <h4 className="font-extrabold text-amber-600 text-sm mb-1">Cần Đăng Ký Tài Khoản</h4>
                                  <p className="text-slate-500">Đăng ký thông tin học sinh để mở khóa bài học số 4 trở đi!</p>
                                </>
                              ) : (
                                <>
                                  <h4 className="font-extrabold text-sky-600 text-sm mb-1">{lesson.title}</h4>
                                  <p className="text-slate-500 mb-2">{lesson.description}</p>
                                  <div className="flex justify-around bg-slate-50 p-2 rounded-lg border border-slate-200">
                                    <div>
                                      <div className="text-slate-400 font-bold font-sans">Mục tiêu</div>
                                      <div className="font-bold text-emerald-600">🎯 {lesson.targetWPM} WPM</div>
                                    </div>
                                    <div className="w-[1px] bg-slate-200" />
                                    <div>
                                      <div className="text-slate-400 font-bold font-sans">Độ chuẩn</div>
                                      <div className="font-bold text-sky-600">⭐ {lesson.minAccuracy}%</div>
                                    </div>
                                  </div>
                                </>
                              )}
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
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-3xl shrink-0">
                💡
              </div>
              <div>
                <h3 className="text-lg font-bold text-sky-600">
                  Bí quyết luyện gõ phím chuyên nghiệp
                </h3>
                <p className="text-slate-500 text-sm md:text-base mt-1 leading-relaxed">
                  Hãy luôn đặt hai ngón tay trỏ lên các phím định vị có gờ nổi là <span className="font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-md border border-sky-200">F</span> và <span className="font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-md border border-sky-200">J</span>. Giữ lưng thẳng, mắt nhìn màn hình và dùng ngón cái để nhấn phím Cách (Spacebar). Không nhìn xuống bàn phím khi gõ!
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
