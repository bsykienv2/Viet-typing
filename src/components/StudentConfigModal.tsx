"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent, StudentInfo } from "@/contexts/StudentContext";
import { useSound } from "@/contexts/SoundContext";
import { X, Sparkles, User, GraduationCap, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { usePathname } from "next/navigation";

const AVATARS = [
  { emoji: "🤖", name: "Robot" },
  { emoji: "👾", name: "Alien" },
  { emoji: "🚀", name: "Spaceship" },
  { emoji: "💻", name: "Coder" },
  { emoji: "🎮", name: "Gamer" },
  { emoji: "🦊", name: "CyberFox" },
  { emoji: "🐉", name: "Dragon" },
  { emoji: "⚡", name: "Lightning" },
  { emoji: "🎧", name: "DJ" },
  { emoji: "🔥", name: "Blaze" }
];

const GRADES = ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"];

export default function StudentConfigModal() {
  const { studentInfo, isConfigured, isOpenConfig, setIsOpenConfig, updateStudentInfo, isLoaded } = useStudent();
  const { playSound } = useSound();

  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Lớp 6");
  const [avatar, setAvatar] = useState("🤖");
  const [error, setError] = useState("");

  // Đồng bộ thông tin từ context khi mở modal
  useEffect(() => {
    if (studentInfo) {
      setNickname(studentInfo.nickname || "");
      setName(studentInfo.name || "");
      setGrade(studentInfo.grade || "Lớp 6");
      setAvatar(studentInfo.avatar || "🤖");
    } else {
      // Mặc định cho học sinh mới
      setNickname("");
      setName("");
      setGrade("Lớp 6");
      setAvatar("🤖");
    }
    setError("");
  }, [studentInfo, isOpenConfig]);

  const pathname = usePathname();

  // Tự động mở modal nếu học sinh chưa cấu hình và dữ liệu đã được load từ localStorage
  useEffect(() => {
    if (isLoaded && !isConfigured && pathname && !pathname.startsWith('/admin')) {
      setIsOpenConfig(true);
    }
  }, [isLoaded, isConfigured, pathname, setIsOpenConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      playSound("wrong");
      setError("Vui lòng điền biệt danh hoặc tên hiển thị của bạn nhé! 🔥");
      return;
    }

    const updatedInfo: StudentInfo = {
      name: name.trim(),
      nickname: nickname.trim(),
      grade,
      avatar
    };

    updateStudentInfo(updatedInfo);
    playSound("tada");

    // Hiệu ứng pháo hoa ăn mừng
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff4500", "#ff8c00", "#ffd700", "#32cd32", "#1e90ff", "#da70d6"]
    });

    setIsOpenConfig(false);
  };

  const handleSelectAvatar = (emoji: string) => {
    playSound("tick");
    setAvatar(emoji);
  };

  const handleSelectGrade = (selectedGrade: string) => {
    playSound("click");
    setGrade(selectedGrade);
  };

  // Xác định xem có cho phép đóng modal bằng nút X hay click overlay hay không
  // Bắt buộc cấu hình nếu chưa từng có thông tin
  const canClose = isConfigured;

  if (!isLoaded || !isOpenConfig || (pathname && pathname.startsWith('/admin'))) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (canClose) {
              playSound("click");
              setIsOpenConfig(false);
            }
          }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg max-h-[90vh] bg-slate-900 border-2 border-slate-800 rounded-[32px] shadow-[8px_8px_0px_0px_#020617] overflow-hidden z-10 flex flex-col text-slate-100"
        >
          {/* Nút Đóng (chỉ hiện khi đã cấu hình xong) */}
          {canClose && (
            <button
              onClick={() => {
                playSound("click");
                setIsOpenConfig(false);
              }}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-rose-900 text-slate-350 hover:text-rose-200 border border-slate-700 rounded-full shadow-md active:translate-y-[1px] transition-all cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Dải màu trang trí phía trên */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 z-20" />

          {/* Vùng nội dung cuộn */}
          <div className="overflow-y-auto p-6 md:p-8 pt-10 md:pt-10 w-full flex-1 custom-scrollbar">
            {/* Tiêu đề */}
            <div className="text-center mt-2 mb-6">
              <span className="text-5xl inline-block animate-bounce mb-2">⚡</span>
              <h2 className="text-3xl font-black text-cyan-400 tracking-wide flex items-center justify-center gap-2">
                <span>Hồ Sơ Cá Nhân</span>
                <Sparkles className="w-6 h-6 text-amber-500 fill-amber-300 animate-pulse" />
              </h2>
              <p className="text-slate-400 text-sm font-bold mt-1">
                {isConfigured ? "Cập nhật thông tin tài khoản luyện gõ" : "Nhập thông tin của bạn để bắt đầu luyện tập"}
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Lựa chọn Avatar Emoji */}
              <div>
                <label className="block text-slate-300 font-extrabold text-base mb-2.5 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                  <span>1. Chọn ảnh đại diện của bạn:</span>
                </label>
                <div className="grid grid-cols-5 gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                  {AVATARS.map((item) => (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={() => handleSelectAvatar(item.emoji)}
                      className={`text-3xl p-2 rounded-xl transition-all relative border-2 cursor-pointer ${
                        avatar === item.emoji
                          ? "bg-slate-800 border-cyan-400 scale-110 shadow-sm"
                          : "bg-slate-900 border-transparent hover:bg-slate-800/50 hover:scale-105"
                      }`}
                    >
                      {avatar === item.emoji && (
                        <span className="absolute -top-1.5 -right-1.5 text-xs bg-cyan-400 text-slate-950 rounded-full w-4 h-4 flex items-center justify-center font-bold">
                          ✓
                        </span>
                      )}
                      <span className="block transform hover:rotate-12 transition-transform">{item.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Biệt danh / Tên ở nhà */}
              <div>
                <label className="block text-slate-300 font-extrabold text-base mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>2. Biệt danh / Tên hiển thị:</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: CoderPro, SpeedTypist..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={15}
                  className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-lg font-black text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
                />
              </div>

              {/* Tên đầy đủ trên lớp */}
              <div>
                <label className="block text-slate-300 font-extrabold text-base mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  <span>3. Họ và tên học sinh (tùy chọn):</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Minh Khang"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                  className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-lg font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>

              {/* Bé học lớp mấy */}
              <div>
                <label className="block text-slate-300 font-extrabold text-base mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>4. Bạn đang học lớp mấy?</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleSelectGrade(g)}
                      className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-sm font-black border transition-all cursor-pointer ${
                        grade === g
                          ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md"
                          : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 shadow-sm active:translate-y-[1px]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-bold text-rose-400 bg-rose-950/30 border border-rose-900 px-4 py-2.5 rounded-xl"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-slate-950 hover:text-slate-900 font-black text-xl rounded-2xl shadow-lg hover:shadow-cyan-500/20 active:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Bắt Đầu Luyện Tập! 🚀</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
