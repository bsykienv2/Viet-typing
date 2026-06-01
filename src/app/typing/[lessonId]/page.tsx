'use client';

import React, { useState, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { lessons } from '@/data/lessons';
import TypingPractice, { TypingTask } from '@/components/TypingPractice';
import CompletionModal from '@/components/CompletionModal';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { TelemetryPayload } from '@/types/lesson';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900']
});

interface Props {
  params: Promise<{
    lessonId: string;
  }>;
}

interface Stats {
  wpm: number;
  accuracy: number;
  incorrectCount: number;
}

export default function LessonPage({ params }: Props) {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [minRequirements, setMinRequirements] = useState<{ minWpm: number; minAccuracy: number } | undefined>(undefined);

  const resolvedParams = React.use(params);
  const lesson = lessons.find((l) => l.id === resolvedParams.lessonId);

  if (!lesson) {
    notFound();
  }

  // Load teacher requirements from localStorage on mount
  React.useEffect(() => {
    try {
      const rulesStr = localStorage.getItem('viettyping_admin_rules');
      if (rulesStr) {
        const rules = JSON.parse(rulesStr);
        setMinRequirements({
          minWpm: rules.minWpm ?? 0,
          minAccuracy: rules.minAccuracy ?? 0,
        });
      }
    } catch (err) {
      console.error('Failed to load rules:', err);
    }
  }, []);

  const handleLessonComplete = useCallback((telemetry: TelemetryPayload) => {
    const newStats = {
      wpm: telemetry.metadata?.wpm || 0,
      accuracy: telemetry.score,
      incorrectCount: telemetry.metadata?.incorrectCount || 0,
    };
    setStats(newStats);
    setShowModal(true);

    // Read the latest rules directly to ensure correct locking
    let meetsRequirements = true;
    try {
      const rulesStr = localStorage.getItem('viettyping_admin_rules');
      if (rulesStr) {
        const rules = JSON.parse(rulesStr);
        const reqWpm = rules.minWpm ?? 0;
        const reqAcc = rules.minAccuracy ?? 0;
        if (newStats.wpm < reqWpm || newStats.accuracy < reqAcc) {
          meetsRequirements = false;
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Only save progress and add XP/Streak if teacher rules are met
    if (meetsRequirements) {
      try {
        // 1. Lưu danh sách bài học đã hoàn thành
        const completedList = JSON.parse(localStorage.getItem('typing_completed_lessons') || '[]');
        if (!completedList.includes(resolvedParams.lessonId)) {
          completedList.push(resolvedParams.lessonId);
          localStorage.setItem('typing_completed_lessons', JSON.stringify(completedList));
        }

        // 2. Tính toán & Cộng thêm XP (ví dụ: gõ tốt được 100 XP, gõ xuất sắc 3 sao được 150 XP)
        const earnedXP = telemetry.score >= 90 ? 150 : 100;
        const currentXP = parseInt(localStorage.getItem('typing_xp') || '0', 10);
        localStorage.setItem('typing_xp', String(currentXP + earnedXP));

        // 3. Cập nhật Streak
        const currentStreak = parseInt(localStorage.getItem('typing_streak') || '0', 10);
        localStorage.setItem('typing_streak', String(currentStreak + 1));
      } catch (err) {
        console.error('Failed to save typing progress to localStorage:', err);
      }
    }
  }, [resolvedParams.lessonId]);

  const getNextLesson = useCallback(() => {
    const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
    return lessons[currentIndex + 1] || null;
  }, [lesson.id]);

  const handleNextLesson = useCallback(() => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      router.push(`/typing/${nextLesson.id}`);
    }
  }, [getNextLesson, router]);

  const handleRestart = useCallback(() => {
    setShowModal(false);
    setStats(null);
    setResetKey((prev) => prev + 1);
  }, []);

  const handleContinue = useCallback(() => {
    setShowModal(false);
    setStats(null);
    const nextLesson = getNextLesson();
    if (nextLesson) {
      router.push(`/typing/${nextLesson.id}`);
    } else {
      router.push('/typing');
    }
  }, [getNextLesson, router]);

  return (
    <main className={`min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden py-6 ${beVietnamPro.className}`}>
      {/* Light decorative background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/50 blur-[120px]" />
      </div>

      <div className="w-full px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/typing')}
              className="flex items-center gap-2 px-5 py-3 bg-white text-slate-600 hover:text-slate-800 rounded-xl font-bold border-2 border-slate-200 transition-all hover:bg-slate-100 shadow-sm cursor-pointer"
            >
              <IoArrowBack className="text-xl" />
              <span>Danh sách bài học</span>
            </button>
          </div>
          
          <h1 className={`text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-center ${beVietnamPro.className}`}>
            {lesson.title}
          </h1>

          {getNextLesson() ? (
            <button
              onClick={handleNextLesson}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/15 cursor-pointer"
            >
              <span>Bài tiếp theo</span>
              <IoArrowForward className="text-xl" />
            </button>
          ) : (
            <div className="w-[120px] hidden md:block"></div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-md mb-8">
          <TypingPractice
            key={`${lesson.id}-${resetKey}`}
            task={lesson as unknown as TypingTask}
            onComplete={handleLessonComplete}
          />
        </div>

        {stats && (
          <CompletionModal
            isOpen={showModal}
            stats={stats}
            onRestart={handleRestart}
            onContinue={handleContinue}
            continueLabel={getNextLesson() ? 'Bài tiếp theo' : 'Quay lại danh sách'}
            minRequirements={minRequirements}
          />
        )}
      </div>
    </main>
  );
}
