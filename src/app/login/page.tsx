"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/contexts/SoundContext";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, Mail, Lock, Phone, User, ShieldAlert, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function LoginPage() {
  const router = useRouter();
  const { playSound } = useSound();
  const { login, loginWithGoogle, signup, resetPassword, isLoggedIn, user } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sign in states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [tempPassword, setTempPassword] = useState<string | null>(null);



  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "admin" || user.role === "teacher") {
        router.push("/admin");
      } else {
        router.push("/typing");
      }
    }
  }, [isLoggedIn, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setLoading(true);
    setMessage(null);
    playSound("click");

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        playSound("tada");
        // Redirect handled in useEffect
      } else {
        playSound("error");
        setMessage({ type: "error", text: res.error || "Lỗi đăng nhập không xác định." });
      }
    } catch (err) {
      playSound("error");
      setMessage({ type: "error", text: "Đã xảy ra lỗi hệ thống!" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !signupEmail || !signupPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ các trường thông tin." });
      playSound("error");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Xác nhận mật khẩu không trùng khớp!" });
      playSound("error");
      return;
    }

    if (signupPassword.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu phải dài ít nhất 6 ký tự." });
      playSound("error");
      return;
    }

    setLoading(true);
    setMessage(null);
    playSound("click");

    try {
      const res = await signup({
        name,
        phone,
        email: signupEmail,
        password: signupPassword,
      });

      if (res.success) {
        playSound("tada");
        setSignupSuccess(true);
        // Reset form
        setName("");
        setPhone("");
        setSignupEmail("");
        setSignupPassword("");
        setConfirmPassword("");
      } else {
        playSound("error");
        setMessage({ type: "error", text: res.error || "Không thể đăng ký tài khoản." });
      }
    } catch (err) {
      playSound("error");
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ!" });
    } finally {
      setLoading(false);
    }
  };

  // Forgot password is now handled via admin contact info

  const triggerGoogleLogin = async () => {
    playSound("click");
    setLoading(true);
    setMessage(null);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        playSound("error");
        setMessage({ type: "error", text: res.error || "Không thể khởi tạo đăng nhập Google." });
      }
    } catch (err) {
      playSound("error");
      setMessage({ type: "error", text: "Lỗi kết nối khi đăng nhập Google!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden ${beVietnamPro.className}`}>
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sky-200/40 blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/40 blur-[130px]" />
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-8 relative z-10 overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500" />

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            onClick={() => playSound("click")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Trở lại Trang chủ
          </Link>
        </div>

        {/* Logo and Intro */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-br from-sky-500 to-indigo-600 p-2.5 rounded-2xl text-white shadow-md shadow-sky-500/20 mb-3">
            <Keyboard className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-wider text-slate-800 uppercase">VIETTYPING</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Luyện gõ tiếng việt 10 ngón
          </p>
        </div>

        {/* Error / Success Notifications */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border-2 mb-6 text-xs font-bold flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              <span className="text-base shrink-0">{message.type === "success" ? "✅" : "⚠️"}</span>
              <p className="leading-relaxed">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB CONTROLS (Hide when forgot password or success layout is shown) */}
        {!showForgotPassword && !signupSuccess && (
          <div className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner mb-6">
            <button
              onClick={() => {
                playSound("click");
                setActiveTab("login");
                setMessage(null);
              }}
              className={`py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                activeTab === "login" ? "bg-white text-sky-600 shadow-md scale-105" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => {
                playSound("click");
                setActiveTab("signup");
                setMessage(null);
              }}
              className={`py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                activeTab === "signup" ? "bg-white text-sky-600 shadow-md scale-105" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Đăng Ký
            </button>
          </div>
        )}

        {/* FORMS */}
        {showForgotPassword ? (
          /* FORGOT PASSWORD INFO CARD */
          <div className="space-y-6 py-2 text-center">
            <div className="w-16 h-16 bg-indigo-50 border-2 border-indigo-200 rounded-full flex items-center justify-center mx-auto text-3xl animate-pulse">
              🔑
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-800">Quên mật khẩu?</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Vui lòng liên hệ với Admin</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold text-slate-500 leading-relaxed text-left space-y-2">
              <p className="text-indigo-600 font-extrabold flex items-center gap-1">
                <span>💁‍♂️</span> Hướng dẫn cấp lại mật khẩu:
              </p>
              <p>Bạn không thể tự khôi phục mật khẩu qua email trên trang web này.</p>
              <p>Hãy <strong>liên hệ trực tiếp với Thầy/Cô giáo hoặc Quản trị viên hệ thống (Admin)</strong> để yêu cầu cấp lại mật khẩu mới.</p>
              <p>Sau khi nhận mật khẩu mới và đăng nhập, bạn có thể tự thay đổi lại mật khẩu cá nhân bất cứ lúc nào trong phần quản lý hồ sơ.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                playSound("click");
                setShowForgotPassword(false);
                setMessage(null);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              Quay lại Đăng Nhập
            </button>
          </div>
        ) : signupSuccess ? (
          /* REGISTRATION SUCCESS VIEW */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              ⏳
            </div>
            <h3 className="text-lg font-black text-slate-800">Đăng ký thành công!</h3>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-xs font-bold text-slate-500 leading-relaxed text-left space-y-2">
              <p className="text-amber-600 font-extrabold flex items-center gap-1">
                <span>⚠️</span> Tài khoản đang ở chế độ CHỜ PHÊ DUYỆT.
              </p>
              <p>Hệ thống quy định các tài khoản thường sau khi đăng ký phải được <strong>Giáo viên hoặc Admin kích hoạt</strong> thì mới có thể đăng nhập vào ứng dụng.</p>
              <p>Mẹo: Bạn có thể liên hệ Giáo viên phụ trách hoặc đăng nhập tài khoản Admin mẫu để tự duyệt nhanh tài khoản của mình.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  playSound("click");
                  setSignupSuccess(false);
                  setActiveTab("login");
                }}
                className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl text-xs font-black shadow-md"
              >
                Đăng Nhập Ngay
              </button>
            </div>
          </div>
        ) : activeTab === "login" ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@viettyping.edu.vn"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-sky-400 rounded-xl text-xs font-bold text-slate-700 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">Mật khẩu</label>
                <button
                  type="button"
                  onClick={() => {
                    playSound("click");
                    setShowForgotPassword(true);
                    setMessage(null);
                  }}
                  className="text-[10px] font-black text-sky-600 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-sky-400 rounded-xl text-xs font-bold text-slate-700 outline-none tracking-wide transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    playSound("click");
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? "Đang xác thực..." : "Đăng Nhập"}
            </button>

            {/* Google Login Simulation Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 font-bold text-[10px] uppercase tracking-wider">Hoặc tiếp tục với</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={triggerGoogleLogin}
              className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl text-xs font-black text-slate-600 hover:text-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="24" height="24">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path
                    d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.83 21.56,11.4 21.35,11.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12,20.8c2.43,0 4.47,-0.8 5.96,-2.2l-3.3,-2.58c-0.92,0.6 -2.1,0.98 -3.66,0.98 -2.35,0 -4.33,-1.58 -5.04,-3.7H2.54v2.66C4.02,18.88 7.74,20.8 12,20.8z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.96,13.3c-0.18,-0.54 -0.28,-1.12 -0.28,-1.7c0,-0.58 0.1,-1.16 0.28,-1.7V7.24H2.54C1.92,8.48 1.56,9.89 1.56,11.6c0,1.71 0.36,3.12 0.98,4.36L6.96,13.3z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12,6.42c1.32,0 2.5,0.46 3.44,1.36l2.58,-2.58C16.46,3.67 14.43,2.8 12,2.8 7.74,2.8 4.02,4.72 2.54,7.24l4.42,3.46c0.71,-2.12 2.69,-3.7 5.04,-3.7z"
                    fill="#EA4335"
                  />
                </g>
              </svg>
              <span>Đăng nhập bằng Google</span>
            </button>


          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Họ và tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-sky-400 rounded-xl text-xs font-bold text-slate-700 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="090xxxxxxx"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-sky-400 rounded-xl text-xs font-bold text-slate-700 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Email đăng ký</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="emailcuaban@gmail.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-sky-400 rounded-xl text-xs font-bold text-slate-700 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-sky-400 rounded-xl text-xs font-bold text-slate-700 outline-none tracking-wide transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    playSound("click");
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-sky-400 rounded-xl text-xs font-bold text-slate-700 outline-none tracking-wide transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    playSound("click");
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? "Đang xử lý..." : "Đăng Ký Tài Khoản thường"}
            </button>
          </form>
        )}
      </div>


    </main>
  );
}
