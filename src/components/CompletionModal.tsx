'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { IoStar, IoStarOutline, IoRefreshOutline, IoArrowForward, IoTrophy } from 'react-icons/io5';
import { useSound } from '@/contexts/SoundContext';
import confetti from 'canvas-confetti';
import { useStudent } from '@/contexts/StudentContext';

interface CompletionModalProps {
    isOpen: boolean;
    stats: {
        wpm: number;
        accuracy: number;
        incorrectCount: number;
    };
    onRestart: () => void;
    onContinue: () => void;
    continueLabel?: string;
    minRequirements?: {
        minWpm: number;
        minAccuracy: number;
    };
}

function calculateScore(wpm: number, accuracy: number, incorrectCount: number): number {
    // Score formula: base = wpm * accuracy factor, scaled to 1000-9999 range
    const accuracyFactor = accuracy / 100;
    const base = wpm * accuracyFactor * 100;
    const errorPenalty = incorrectCount * 50;
    const raw = Math.round(base - errorPenalty);
    return Math.max(1000, Math.min(9999, raw + 1000));
}

export default function CompletionModal({
    isOpen,
    stats,
    onRestart,
    onContinue,
    continueLabel = 'Tiếp tục',
    minRequirements,
}: CompletionModalProps) {
    const { playSound } = useSound();
    const { studentInfo } = useStudent();
    const [displayScore, setDisplayScore] = useState(0);
    const [isCountingDone, setIsCountingDone] = useState(false);
    const [showStars, setShowStars] = useState(false);
    const animFrameRef = useRef<number>(0);
    const hasPlayedTada = useRef(false);

    const minWpm = minRequirements?.minWpm ?? 0;
    const minAccuracy = minRequirements?.minAccuracy ?? 0;
    const meetsRequirements = stats.wpm >= minWpm && stats.accuracy >= minAccuracy;

    const finalScore = calculateScore(stats.wpm, stats.accuracy, stats.incorrectCount);

    const calculateStars = (acc: number) => {
        if (!meetsRequirements) return 0;
        if (acc >= 90) return 3;
        if (acc >= 70) return 2;
        if (acc >= 50) return 1;
        return 0;
    };

    const stars = calculateStars(stats.accuracy);

    const getMessage = () => {
        const name = studentInfo?.nickname || 'Học sinh';
        if (!meetsRequirements) {
            return `Chưa đạt yêu cầu của giáo viên rồi, cố lên ${name} ơi! 💪`;
        }
        if (stars === 3) return `Chúc mừng ${name}! Bạn đã hoàn thành xuất sắc! 🎉`;
        if (stars === 2) return `Rất tốt! Cố gắng cải thiện thêm tốc độ nhé! 🌟`;
        return `Hoàn thành bài tập! Hãy luyện tập thêm để cải thiện! 💪`;
    };

    // Fire confetti
    const fireConfetti = useCallback(() => {
        const colors = ['#0ea5e9', '#6366f1', '#d946ef', '#10b981', '#fbbf24', '#f43f5e'];

        // Side cannons
        const duration = 2000;
        const end = Date.now() + duration;
        const frame = () => {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();

        // Big burst
        confetti({
            particleCount: 100, spread: 100, origin: { y: 0.6 }, colors,
            startVelocity: 35, gravity: 0.8, scalar: 1.2, ticks: 100,
        });
    }, []);

    // Counter animation
    useEffect(() => {
        if (!isOpen) {
            setDisplayScore(0);
            setIsCountingDone(false);
            setShowStars(false);
            hasPlayedTada.current = false;
            return;
        }

        const startTime = Date.now();
        const duration = 1800; // 1.8 seconds count-up
        let lastTickAt = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for decelerating effect
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentScore = Math.round(eased * finalScore);

            setDisplayScore(currentScore);

            // Play tick sound every 80ms
            if (elapsed - lastTickAt > 80 && progress < 1) {
                playSound('tick');
                lastTickAt = elapsed;
            }

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayScore(finalScore);
                setIsCountingDone(true);

                // Tada + confetti when counter finishes
                if (!hasPlayedTada.current) {
                    hasPlayedTada.current = true;
                    if (meetsRequirements) {
                        playSound('tada');
                        fireConfetti();
                    } else {
                        playSound('wrong');
                    }
                }

                // Show stars after a short delay
                setTimeout(() => setShowStars(true), 400);
            }
        };

        // Small delay before starting counter
        const timer = setTimeout(() => {
            animFrameRef.current = requestAnimationFrame(animate);
        }, 500);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [isOpen, finalScore, playSound, fireConfetti]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
            <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-bounce-in text-slate-800">

                {/* Score Counter */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <IoTrophy className={`text-3xl transition-colors duration-500 ${isCountingDone ? 'text-amber-500' : 'text-slate-300'}`} />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Điểm số</span>
                    </div>
                    <div className={`text-6xl font-black font-mono tabular-nums transition-all duration-300 ${isCountingDone ? 'text-amber-500 scale-110' : 'text-slate-400'}`}>
                        {displayScore.toLocaleString()}
                    </div>
                </div>

                {/* Stars - appear after counter */}
                <div className={`flex justify-center gap-3 mb-5 transition-all duration-500 ${showStars ? 'opacity-100' : 'opacity-0'}`}>
                    {[1, 2, 3].map((star) => (
                        <span
                            key={star}
                            className="text-5xl filter drop-shadow-md"
                            style={{
                                transitionDelay: `${star * 150}ms`,
                                transform: showStars ? 'scale(1)' : 'scale(0)',
                                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        >
                            {star <= stars ? (
                                <IoStar className="text-amber-400" />
                            ) : (
                                <IoStarOutline className="text-slate-200" />
                            )}
                        </span>
                    ))}
                </div>

                {/* Message */}
                <h3 className={`text-xl font-extrabold text-center mb-5 text-slate-700 transition-all duration-500 ${showStars ? 'opacity-100' : 'opacity-0'}`}>
                    {getMessage()}
                </h3>

                {/* Requirements Warning Box */}
                {!meetsRequirements && showStars && (
                    <div className="mb-5 bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 text-center">
                        <span className="text-xs font-black text-rose-600 uppercase tracking-widest block mb-2">🔴 CHƯA ĐẠT CHỈ TIÊU CỦA GIÁO VIÊN</span>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="bg-white p-2.5 rounded-xl border border-rose-100">
                                <p className="text-slate-400 font-bold mb-0.5">Tốc độ</p>
                                <p className={`text-base font-black ${stats.wpm >= minWpm ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {stats.wpm} / {minWpm} <span className="text-[10px] font-normal text-slate-400">WPM</span>
                                </p>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-rose-100">
                                <p className="text-slate-400 font-bold mb-0.5">Độ chính xác</p>
                                <p className={`text-base font-black ${stats.accuracy >= minAccuracy ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {stats.accuracy}% / {minAccuracy}%
                                </p>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-3">
                            Em cần gõ đạt tốc độ và độ chính xác tối thiểu ở trên để hoàn thành bài này.
                        </p>
                    </div>
                )}

                {/* Stats */}
                <div className={`grid grid-cols-3 gap-3 mb-6 transition-all duration-500 ${showStars ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-sky-50 border-2 border-sky-100 p-3 rounded-xl text-center">
                        <p className="text-xs text-slate-400 mb-1">Tốc độ</p>
                        <p className="text-lg font-bold text-sky-600">{stats.wpm}</p>
                        <p className="text-xs text-slate-400">WPM</p>
                    </div>
                    <div className="bg-indigo-50 border-2 border-indigo-100 p-3 rounded-xl text-center">
                        <p className="text-xs text-slate-400 mb-1">Chính xác</p>
                        <p className="text-lg font-bold text-indigo-600">{stats.accuracy}%</p>
                    </div>
                    <div className="bg-rose-50 border-2 border-rose-100 p-3 rounded-xl text-center">
                        <p className="text-xs text-slate-400 mb-1">Số lỗi</p>
                        <p className="text-lg font-bold text-rose-500">{stats.incorrectCount}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className={`flex gap-3 transition-all duration-500 ${showStars ? 'opacity-100' : 'opacity-0'}`}>
                    {meetsRequirements ? (
                        <>
                            <button
                                onClick={onRestart}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 border-2 border-slate-200 transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer"
                            >
                                <IoRefreshOutline className="text-lg shrink-0" />
                                <span>Làm lại</span>
                            </button>
                            <button
                                onClick={onContinue}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-black transition-colors shadow-md shadow-sky-500/15 whitespace-nowrap text-sm sm:text-base cursor-pointer"
                            >
                                <span>{continueLabel}</span>
                                <IoArrowForward className="text-lg shrink-0" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => window.location.href = '/typing'}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 border-2 border-slate-200 transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer"
                            >
                                <span>Thoát</span>
                            </button>
                            <button
                                onClick={onRestart}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-black transition-colors shadow-md shadow-rose-500/15 whitespace-nowrap text-sm sm:text-base cursor-pointer"
                            >
                                <IoRefreshOutline className="text-lg shrink-0" />
                                <span>Gõ lại</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
