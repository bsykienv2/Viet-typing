"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent, StudentInfo } from "@/contexts/StudentContext";
import { useSound } from "@/contexts/SoundContext";
import { useAuth } from "@/contexts/AuthContext";
import { X, Sparkles, User, GraduationCap, Heart, Key, Lock, Eye, EyeOff, CheckCircle, ShieldAlert } from "lucide-react";
import confetti from "canvas-confetti";
import { usePathname, useRouter } from "next/navigation";

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
  const { isLoggedIn, user, changePassword, adminUpdateUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile states
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Lớp 6");
  const [avatar, setAvatar] = useState("🤖");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Check if normal user has been activated by admin to edit their profile
  const isNormalUser = isLoggedIn && user?.authType === "normal";
  const isNormalAndNotActivated = isNormalUser && user?.isActivated !== true;
  const canEdit = !isNormalAndNotActivated;

  // Sync profile details when opening modal or user changing
  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setName(user.name || "");
      setGrade(user.grade || "Lớp 6");
      setAvatar(user.avatar || "🤖");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    } else if (studentInfo) {
      setNickname(studentInfo.nickname || "");
      setName(studentInfo.name || "");
      setGrade(studentInfo.grade || "Lớp 6");
      setAvatar(studentInfo.avatar || "🤖");
      setEmail("");
      setPhone("");
    } else {
      setNickname("");
      setName("");
      setGrade("Lớp 6");
      setAvatar("🤖");
      setEmail("");
      setPhone("");
    }
    setProfileError("");
    setProfileSuccess(false);
    
    // Reset password states
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
    setPasswordSuccess("");
    setActiveTab("profile");
  }, [studentInfo, user, isOpenConfig]);

  const pathname = usePathname();

  // Auto-open if student profile is not configured on non-admin page (excluding the homepage '/')
  useEffect(() => {
    if (isLoaded && !isConfigured && pathname && pathname !== '/' && !pathname.startsWith('/admin') && pathname !== '/login') {
      setIsOpenConfig(true);
    }
  }, [isLoaded, isConfigured, pathname, setIsOpenConfig]);

  // Auto-sync logged-in user profile with studentInfo if they differ
  useEffect(() => {
    if (isLoggedIn && user) {
      const userProfileMatches = 
        studentInfo &&
        studentInfo.name === user.name &&
        studentInfo.nickname === user.nickname &&
        studentInfo.grade === user.grade &&
        studentInfo.avatar === user.avatar;
      
      if (!userProfileMatches) {
        updateStudentInfo({
          name: user.name || "",
          nickname: user.nickname || "",
          grade: user.grade || "Lớp 6",
          avatar: user.avatar || "🤖"
        });
      }
    }
  }, [isLoggedIn, user, studentInfo, updateStudentInfo]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");

    if (!nickname.trim()) {
      playSound("wrong");
      setProfileError("Vui lòng điền biệt danh hoặc tên hiển thị của bạn nhé! 🔥");
      return;
    }

    if (isLoggedIn && user) {
      if (!email.trim() || !email.includes("@")) {
        playSound("wrong");
        setProfileError("Vui lòng nhập địa chỉ email hợp lệ nhé! 📧");
        return;
      }
    }

    const updatedInfo: StudentInfo = {
      name: name.trim(),
      nickname: nickname.trim(),
      grade,
      avatar
    };

    // If logged in, also sync with AuthContext database
    if (isLoggedIn && user) {
      try {
        const res = await adminUpdateUser(user.id, {
          name: name.trim(),
          nickname: nickname.trim(),
          grade,
          avatar,
          email: email.trim(),
          phone: phone.trim(),
        });
        if (res && !res.success) {
          playSound("wrong");
          setProfileError(res.error || "Có lỗi xảy ra khi cập nhật thông tin!");
          return;
        }
      } catch (err) {
        console.error("Lỗi đồng bộ hồ sơ đăng nhập:", err);
        playSound("wrong");
        setProfileError("Có lỗi xảy ra trong quá trình cập nhật.");
        return;
      }
    }

    // Update in StudentContext
    updateStudentInfo(updatedInfo);

    playSound("tada");

    // Confetti effect
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff4500", "#ff8c00", "#ffd700", "#32cd32", "#1e90ff", "#da70d6"]
    });

    setProfileSuccess(true);
    setTimeout(() => {
      setIsOpenConfig(false);
      setProfileSuccess(false);
    }, 1200);
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      playSound("wrong");
      setPasswordError("Vui lòng điền đầy đủ tất cả các trường mật khẩu.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      playSound("wrong");
      setPasswordError("Mật khẩu mới và mật khẩu xác nhận không trùng khớp!");
      return;
    }

    if (newPassword.length < 6) {
      playSound("wrong");
      setPasswordError("Mật khẩu mới phải dài ít nhất 6 ký tự.");
      return;
    }

    setIsChangingPass(true);
    playSound("click");

    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        playSound("tada");
        setPasswordSuccess("Thay đổi mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        playSound("error");
        setPasswordError(res.error || "Mật khẩu hiện tại không chính xác.");
      }
    } catch (err) {
      playSound("error");
      setPasswordError("Có lỗi xảy ra trong quá trình đổi mật khẩu!");
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleSelectAvatar = (emoji: string) => {
    playSound("tick");
    setAvatar(emoji);
  };

  const handleSelectGrade = (selectedGrade: string) => {
    playSound("click");
    setGrade(selectedGrade);
  };

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
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg max-h-[90vh] bg-white border-2 border-slate-200 rounded-[32px] shadow-2xl overflow-hidden z-10 flex flex-col text-slate-800"
        >
          {/* Close button (only if configured) */}
          {canClose && (
            <button
              onClick={() => {
                playSound("click");
                setIsOpenConfig(false);
              }}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 border-2 border-slate-200 hover:border-rose-200 rounded-full shadow-sm active:translate-y-[1px] transition-all cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Top color strip */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 z-20" />

          {/* Tabs header if logged in and authType is normal */}
          {isLoggedIn && user?.authType === "normal" && (
            <div className="flex bg-slate-50 border-b border-slate-200 pt-3 px-6 gap-2">
              <button
                onClick={() => { playSound("click"); setActiveTab("profile"); }}
                className={`py-3 px-4 font-extrabold text-sm border-b-4 rounded-t-lg transition-all ${
                  activeTab === "profile"
                    ? "border-sky-500 text-sky-600 bg-white"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Hồ Sơ Cá Nhân
              </button>
              <button
                onClick={() => { playSound("click"); setActiveTab("password"); }}
                className={`py-3 px-4 font-extrabold text-sm border-b-4 rounded-t-lg transition-all ${
                  activeTab === "password"
                    ? "border-indigo-500 text-indigo-600 bg-white"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Đổi Mật Khẩu
              </button>
            </div>
          )}

          {/* Scrollable Content View */}
          <div className="overflow-y-auto p-6 md:p-8 pt-6 w-full flex-1 custom-scrollbar">
            {activeTab === "profile" ? (
              <>
                {/* Header */}
                <div className="text-center mt-2 mb-6">
                  <span className="text-5xl inline-block animate-bounce mb-2">{avatar}</span>
                  <h2 className="text-3xl font-black text-sky-600 tracking-wide flex items-center justify-center gap-2">
                    <span>Hồ Sơ Cá Nhân</span>
                    <Sparkles className="w-6 h-6 text-amber-500 fill-amber-300 animate-pulse" />
                  </h2>
                  <p className="text-slate-400 text-sm font-bold mt-1">
                    {isConfigured ? "Cập nhật thông tin tài khoản luyện gõ" : "Nhập thông tin của bạn để bắt đầu luyện tập"}
                  </p>
                  
                  {isLoggedIn && user && (
                    <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>Đăng nhập qua {user.authType === "google" ? "Google" : "Tài khoản thường"}</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {!canEdit && (
                    <div className="bg-amber-50 border-2 border-amber-200 text-amber-800 text-xs font-bold rounded-2xl p-4 flex flex-col gap-2 shadow-sm leading-relaxed">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                        <span className="text-sm font-extrabold text-amber-700">Tài khoản chưa được kích hoạt</span>
                      </div>
                      <span>
                        Tài khoản của bạn đã được đăng ký nhưng cần được <strong>Quản trị viên (Admin) phê duyệt</strong> trước khi có thể thay đổi thông tin hồ sơ cá nhân và bắt đầu luyện tập đầy đủ.
                      </span>
                    </div>
                  )}
                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-slate-600 font-extrabold text-base mb-2.5 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-sky-500 fill-sky-400/20" />
                      <span>1. Chọn ảnh đại diện của bạn:</span>
                    </label>
                    <div className="grid grid-cols-5 gap-2.5 p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                      {AVATARS.map((item) => (
                        <button
                          key={item.emoji}
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleSelectAvatar(item.emoji)}
                          className={`text-3xl p-2 rounded-xl transition-all relative border-2 cursor-pointer ${
                            avatar === item.emoji
                              ? "bg-sky-50 border-sky-400 scale-110 shadow-sm"
                              : "bg-white border-transparent hover:bg-slate-100 hover:scale-105"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {avatar === item.emoji && (
                            <span className="absolute -top-1.5 -right-1.5 text-xs bg-sky-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                              ✓
                            </span>
                          )}
                          <span className="block transform hover:rotate-12 transition-transform">{item.emoji}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nickname / Display Name */}
                  <div>
                    <label className="block text-slate-600 font-extrabold text-base mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-sky-500" />
                      <span>2. Biệt danh / Tên hiển thị:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: CoderPro, SpeedTypist..."
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      disabled={!canEdit}
                      maxLength={15}
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg font-black text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Full name */}
                  <div>
                    <label className="block text-slate-600 font-extrabold text-base mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-500" />
                      <span>3. Họ và tên học sinh:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Minh Khang"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!canEdit}
                      maxLength={30}
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Grade Picker */}
                  <div>
                    <label className="block text-slate-600 font-extrabold text-base mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-sky-500" />
                      <span>4. Bạn đang học lớp mấy?</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GRADES.map((g) => (
                        <button
                          key={g}
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleSelectGrade(g)}
                          className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer ${
                            grade === g
                              ? "bg-sky-500 text-white border-sky-400 shadow-md"
                              : "bg-white hover:bg-slate-100 text-slate-500 border-slate-200 shadow-sm active:translate-y-[1px]"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email & Phone fields (only for logged-in users) */}
                  {isLoggedIn && (
                    <div className="space-y-5 border-t border-slate-100 pt-4 mt-2">
                      <div>
                        <label className="block text-slate-600 font-extrabold text-base mb-2 flex items-center gap-1.5">
                          <span>📧 Địa chỉ Email:</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!canEdit || user?.authType === "google"}
                          placeholder="Ví dụ: hocsinh@gmail.com"
                          className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                        {user?.authType === "google" && (
                          <span className="text-xs text-slate-400 font-bold block mt-1">
                            Tài khoản liên kết Google không được phép sửa email.
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-slate-600 font-extrabold text-base mb-2 flex items-center gap-1.5">
                          <span>📞 Số điện thoại:</span>
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={!canEdit}
                          placeholder="Ví dụ: 0987654321"
                          className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error & Success Messages */}
                  {profileError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-bold text-rose-600 bg-rose-50 border-2 border-rose-200 px-4 py-2.5 rounded-xl flex items-center gap-2"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>{profileError}</span>
                    </motion.div>
                  )}

                  {profileSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-bold text-emerald-600 bg-emerald-50 border-2 border-emerald-200 px-4 py-2.5 rounded-xl flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Đã lưu thông tin tài khoản thành công! 🚀</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileSuccess || !canEdit}
                      className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xl rounded-2xl shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 active:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{profileSuccess ? "Đang lưu..." : "Lưu Thay Đổi! 🚀"}</span>
                    </button>
                  </div>

                  {/* Guess Login Note */}
                  {!isLoggedIn && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          playSound("click");
                          setIsOpenConfig(false);
                          router.push("/login");
                        }}
                        className="text-xs font-bold text-indigo-500 hover:text-indigo-700 hover:underline"
                      >
                        Đăng nhập bằng tài khoản để lưu XP và tiến trình lâu dài 🔐
                      </button>
                    </div>
                  )}
                </form>
              </>
            ) : (
              <>
                {/* Password Change Form */}
                <div className="text-center mt-2 mb-6">
                  <span className="text-5xl inline-block mb-2">🔐</span>
                  <h2 className="text-3xl font-black text-indigo-600 tracking-wide flex items-center justify-center gap-2">
                    <span>Đổi Mật Khẩu</span>
                    <Key className="w-6 h-6 text-indigo-500 animate-pulse" />
                  </h2>
                  <p className="text-slate-400 text-sm font-bold mt-1">
                    Cập nhật mật khẩu tài khoản thường của bạn
                  </p>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-slate-600 font-extrabold text-sm mb-2 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-indigo-500" />
                      <span>Mật khẩu hiện tại:</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Nhập mật khẩu đang sử dụng"
                        className="w-full pl-5 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => { playSound("click"); setShowCurrentPass(!showCurrentPass); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrentPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-slate-600 font-extrabold text-sm mb-2 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-emerald-500" />
                      <span>Mật khẩu mới (tối thiểu 6 ký tự):</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới mong muốn"
                        className="w-full pl-5 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => { playSound("click"); setShowNewPass(!showNewPass); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-slate-600 font-extrabold text-sm mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Xác nhận mật khẩu mới:</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmNewPass ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu mới"
                        className="w-full pl-5 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => { playSound("click"); setShowConfirmNewPass(!showConfirmNewPass); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error & Success Messages */}
                  {passwordError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-bold text-rose-600 bg-rose-50 border-2 border-rose-200 px-4 py-2.5 rounded-xl flex items-center gap-2"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>{passwordError}</span>
                    </motion.div>
                  )}

                  {passwordSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-bold text-emerald-600 bg-emerald-50 border-2 border-emerald-200 px-4 py-2.5 rounded-xl flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{passwordSuccess}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isChangingPass}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{isChangingPass ? "Đang xử lý..." : "Cập Nhật Mật Khẩu 🔐"}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
