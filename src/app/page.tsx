'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Be_Vietnam_Pro } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Users, BarChart3, Shield, ChevronRight, Zap, Target, Award, GraduationCap, Star, HelpCircle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { useAuth } from '@/contexts/AuthContext';
import { useStudent } from '@/contexts/StudentContext';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900']
});

export default function HomePage() {
  const { playSound } = useSound();
  const { user, isLoggedIn, logout } = useAuth();
  const { isConfigured, setIsOpenConfig } = useStudent();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    playSound('click');
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const stats = [
    { value: '60+', label: 'Bài học', desc: 'Lộ trình bài bản từ cơ bản đến nâng cao', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
    { value: '3', label: 'Cấp độ', desc: 'Sơ cấp, Trung cấp và Cao cấp', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { value: '100%', label: 'Miễn phí', desc: 'Không quảng cáo, không thu phí học sinh', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { value: '2', label: 'Kiểu gõ', desc: 'Hỗ trợ song song cả Telex và VNI', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Minh Anh',
      role: 'Học sinh Lớp 8A',
      school: 'Trường THCS Nguyễn Du',
      avatar: '🦁',
      content: 'Em rất thích VietTyping vì có avatar emoji siêu dễ thương! Nhờ luyện tập mỗi ngày 15 phút, tốc độ gõ Telex của em đã tăng từ 20 WPM lên 45 WPM.',
      color: 'bg-sky-50 border-sky-100'
    },
    {
      name: 'Lê Thảo Vy',
      role: 'Học sinh Lớp 7C',
      school: 'Trường THCS Lê Quý Đôn',
      avatar: '🐰',
      content: 'Giao diện của trang web cực kỳ sáng sủa và dễ sử dụng, giống như đang chơi game vậy. Em đã duy trì được chuỗi streak 15 ngày liên tiếp rồi!',
      color: 'bg-indigo-50 border-indigo-100'
    },
    {
      name: 'Trần Tuấn Kiệt',
      role: 'Học sinh Lớp 9B',
      school: 'Trường THCS Trần Đại Nghĩa',
      avatar: '🐯',
      content: 'Trước đây em gõ VNI rất chậm và hay nhìn bàn phím. Nhờ bàn phím ảo highlight phím tiếp theo của VietTyping, em đã sửa được thói quen xấu này.',
      color: 'bg-emerald-50 border-emerald-100'
    },
    {
      name: 'Phạm Gia Bảo',
      role: 'Học sinh Lớp 6A',
      school: 'Trường THCS Trưng Vương',
      avatar: '🐼',
      content: 'Chúng em thi đua gõ phím xem ai có nhiều XP hơn trên bảng xếp hạng của lớp. Việc học tin học bây giờ vui và sôi nổi hơn hẳn!',
      color: 'bg-amber-50 border-amber-100'
    }
  ];

  const faqs = [
    {
      question: 'VietTyping là gì?',
      answer: 'VietTyping là nền tảng luyện gõ phím 10 ngón tiếng Việt hoàn toàn miễn phí dành riêng cho học sinh Trung học cơ sở (THCS), giúp học sinh rèn luyện kỹ năng gõ nhanh và chính xác với hai kiểu gõ phổ biến nhất là Telex và VNI.'
    },
    {
      question: 'Tôi có cần đăng ký tài khoản để học không?',
      answer: 'Học sinh không đăng ký tài khoản có thể luyện tập gõ thử tối đa 3 bài học đầu tiên ở mỗi cấp độ (Sơ cấp, Trung cấp, Cao cấp). Để có thể mở khóa toàn bộ 60+ bài học và lưu trữ thành tích (XP, streak, lịch sử gõ), bạn cần đăng ký bằng cách thiết lập thông tin cá nhân cơ bản.'
    },
    {
      question: 'Telex và VNI khác nhau như thế nào?',
      answer: 'Telex dùng phím chữ để gõ dấu (s=sắc, f=huyền, r=hỏi, x=ngã, j=nặng, aa=â, aw=ă, ee=ê, oo=ô, ow=ơ, uw=ư, dd=đ). VNI dùng phím số ở hàng trên cùng để gõ dấu (1=sắc, 2=huyền, 3=hỏi, 4=ngã, 5=nặng, 6=mũ â/ê/ô, 7=mũ móc ơ/ư, 8=trăng ă, 9=gạch đ).'
    },
    {
      question: 'Làm thế nào để luyện gõ 10 ngón đúng tư thế?',
      answer: 'Luôn đặt hai ngón tay trỏ lên các phím định vị có gờ nổi là F và J. Giữ lưng thẳng, mắt nhìn màn hình và dùng ngón cái để nhấn phím Cách (Spacebar). Không được nhìn xuống bàn phím khi gõ, hãy tin tưởng vào cảm giác tay của mình!'
    },
    {
      question: 'Giáo viên quản lý học sinh và lớp học như thế nào?',
      answer: 'Giáo viên đăng nhập bằng mật khẩu vào trang Giáo viên để tạo lớp học, nhận mã lớp, thiết lập ngưỡng chấm đạt (WPM & độ chính xác) và giám sát trực tiếp thời gian thực kết quả gõ phím của toàn bộ học sinh trong lớp.'
    },
    {
      question: 'Hệ thống XP và Chuỗi ngày (Streak) hoạt động ra sao?',
      answer: 'Mỗi bài luyện tập thành công sẽ mang lại cho bạn 100 - 150 điểm XP tùy thuộc vào điểm số. Nếu bạn hoàn thành ít nhất 1 bài gõ mỗi ngày, chuỗi Streak của bạn sẽ tăng lên để ghi nhận sự chăm chỉ của bạn!'
    },
    {
      question: 'Tại sao tôi không thể mở khóa bài học tiếp theo?',
      answer: 'Mặc định hệ thống áp dụng chế độ mở khóa tuần tự (phải hoàn thành bài trước mới mở bài sau). Ngoài ra giáo viên có thể thay đổi cài đặt này sang chế độ mở khóa tự do để học sinh lựa chọn bài học tùy ý.'
    },
    {
      question: 'VietTyping có chạy tốt trên điện thoại hoặc máy tính bảng không?',
      answer: 'VietTyping được thiết kế tương thích với mọi thiết bị. Tuy nhiên, để luyện gõ phím 10 ngón một cách hiệu quả và chuẩn nhất, chúng tôi khuyên bạn nên sử dụng máy tính cá nhân hoặc máy tính ở phòng thực hành trường học có bàn phím vật lý.'
    },
    {
      question: 'Làm thế nào để xem bảng xếp hạng học sinh đạt điểm cao?',
      answer: 'Khi bạn vào giao diện "Luyện gõ phím", ở phần bên trái của màn hình sẽ hiển thị bảng xếp hạng Top 20 học sinh có điểm tích lũy XP và tốc độ gõ WPM cao nhất để các bạn cùng thi đua.'
    }
  ];

  return (
    <main className={`min-h-screen bg-slate-50 text-slate-800 ${beVietnamPro.className}`}>

      {/* ===== NAVIGATION BAR ===== */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-sky-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-slate-800">VIETTYPING</span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest -mt-0.5">Luyện Gõ Tiếng Việt</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/typing"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors"
            >
              Bài Học
            </Link>

            {isLoggedIn && (user?.role === 'admin' || user?.role === 'teacher') && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Giáo Viên
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200 hover:border-sky-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/login?tab=signup"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all active:scale-95"
                >
                  Đăng ký
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-1.5 shadow-sm">
                <button
                  onClick={() => {
                    playSound('click');
                    setIsOpenConfig(true);
                  }}
                  className="flex items-center gap-2 hover:bg-slate-100/80 px-2 py-1 rounded-xl transition-all text-left cursor-pointer"
                  title="Chỉnh sửa hồ sơ"
                >
                  <span className="text-lg">{user?.avatar || '👤'}</span>
                  <div className="text-left leading-tight hidden md:block">
                    <span className="text-xs font-black text-slate-800 block hover:text-sky-600 transition-colors">{user?.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      @{user?.nickname} • {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => { playSound('click'); logout(); }}
                  className="text-xs font-extrabold text-rose-500 hover:text-rose-700 bg-rose-50 border border-rose-100 hover:bg-rose-100/50 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/50 to-slate-50 py-16 lg:py-24">
        {/* Decorative blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-100/60 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/60 blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />
                Dành cho học sinh THCS (Lớp 6-9)
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-tight mb-6">
                Luyện Gõ Phím
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500">
                  Tiếng Việt
                </span>
                <br />
                Chuyên Nghiệp
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl">
                Hệ thống 60 bài học từ sơ cấp đến cao cấp, hỗ trợ cả kiểu gõ <strong className="text-slate-700">Telex</strong> và <strong className="text-slate-700">VNI</strong> trên cùng một giao diện, giúp học sinh rèn luyện kỹ năng gõ phím 10 ngón chuẩn xác.
              </p>

              <div className="flex flex-wrap gap-4">
                {isConfigured ? (
                  <Link
                    href="/typing"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-base font-bold rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all active:scale-[0.97] border-2 border-sky-400/30 font-black cursor-pointer"
                  >
                    <Keyboard className="w-5 h-5" />
                    Vào luyện tập ngay
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      playSound('click');
                      setIsOpenConfig(true);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-base font-bold rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all active:scale-[0.97] border-2 border-sky-400/30 font-black cursor-pointer"
                  >
                    <Keyboard className="w-5 h-5" />
                    Đăng ký trải nghiệm
                  </button>
                )}
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 text-base font-bold rounded-2xl shadow-md border-2 border-slate-200 hover:border-sky-300 hover:text-sky-600 transition-all active:scale-[0.97]"
                >
                  <GraduationCap className="w-5 h-5" />
                  Dành cho Giáo viên
                </Link>
              </div>
            </motion.div>

            {/* Right - Visual illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center lg:col-span-5"
            >
              <div className="relative w-full max-w-md">
                {/* Keyboard illustration card */}
                <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500" />

                  <div className="text-center mb-6">
                    <span className="text-6xl">⌨️</span>
                    <h3 className="text-xl font-black text-slate-800 mt-3">Giao diện luyện gõ</h3>
                    <p className="text-sm text-slate-400 font-medium mt-1">Bàn phím ảo hướng dẫn trực quan</p>
                  </div>

                  {/* Fake keyboard rows */}
                  <div className="space-y-2">
                    <div className="flex gap-1.5 justify-center">
                      {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
                        <div key={k} className="w-9 h-9 bg-slate-100 border-2 border-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                          {k}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5 justify-center ml-3">
                      {['A','S','D','F','G','H','J','K','L'].map(k => (
                        <div key={k} className={`w-9 h-9 border-2 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm ${
                          k === 'F' || k === 'J'
                            ? 'bg-sky-100 border-sky-300 text-sky-600'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {k}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5 justify-center ml-6">
                      {['Z','X','C','V','B','N','M'].map(k => (
                        <div key={k} className="w-9 h-9 bg-slate-100 border-2 border-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                          {k}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg"
                  >
                    95% chính xác ✓
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute -bottom-3 -left-3 bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg"
                  >
                    🏆 45 WPM
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ===== HIGHLY PROMINENT CENTERED STATS ===== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-20 pt-12 border-t border-slate-200">
            {stats.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 ${s.bg} rounded-3xl border-2 ${s.border} shadow-sm text-center flex flex-col justify-between items-center transition-all hover:scale-105 hover:shadow-md`}
              >
                <div className={`text-4xl md:text-5xl lg:text-6xl font-black font-sans ${s.color} tracking-tight mb-2`}>
                  {s.value}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-slate-800 mb-1">{s.label}</h3>
                  <p className="text-xs md:text-sm text-slate-400 font-medium">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
              Tại sao chọn VietTyping?
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Thiết kế đẹp mắt, vui nhộn tương tự typing.com, dành riêng cho học sinh THCS với lộ trình bài bản và tính năng giám sát tối ưu cho Giáo viên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-sky-50/60 border-2 border-sky-100 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-sky-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-sky-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">60 bài học có lộ trình</h3>
              <p className="text-slate-500 leading-relaxed">
                Chia đều thành Sơ cấp (làm quen phím cơ bản) → Trung cấp (gõ từ ghép, câu ngắn) → Cao cấp (chinh phục văn bản tiếng Việt thực tế).
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-indigo-50/60 border-2 border-indigo-100 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-indigo-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-indigo-500/20">
                <Keyboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Hỗ trợ Telex & VNI</h3>
              <p className="text-slate-500 leading-relaxed">
                Cho phép học sinh linh hoạt lựa chọn kiểu gõ phù hợp. Giáo viên có quyền bắt buộc học sinh sử dụng kiểu gõ cụ thể theo bài thi.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-50/60 border-2 border-emerald-100 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-emerald-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-emerald-500/20">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Bàn phím ảo trực quan</h3>
              <p className="text-slate-500 leading-relaxed">
                Hướng dẫn đặt tay chính xác, highlight nút phím tiếp theo và cung cấp phản hồi âm thanh gõ phím sống động theo thời gian thực.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-amber-50/60 border-2 border-amber-100 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-amber-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-amber-500/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">XP & Chuỗi ngày Streak</h3>
              <p className="text-slate-500 leading-relaxed">
                Học sinh tích lũy điểm XP kinh nghiệm, duy trì Streak ngày học chăm chỉ và mở khóa các huy hiệu sao đánh giá, tạo động lực cạnh tranh lành mạnh.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-rose-50/60 border-2 border-rose-100 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-rose-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-rose-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Giám sát của Giáo viên</h3>
              <p className="text-slate-500 leading-relaxed">
                Quản lý lớp học thông qua mã lớp. Theo dõi kết quả và sự tiến bộ của học sinh bằng biểu đồ và danh sách trực tiếp cực kỳ trực quan.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-purple-50/60 border-2 border-purple-100 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-purple-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-purple-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Thống kê chi tiết</h3>
              <p className="text-slate-500 leading-relaxed">
                Cung cấp báo cáo WPM (tốc độ gõ), độ chuẩn xác và lỗi thường gặp để học sinh khắc phục và tự hoàn thiện khả năng gõ của mình.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STUDENT TESTIMONIALS SECTION ===== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold rounded-full mb-3">
              <MessageSquare className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Nhận Xét Từ Học Sinh
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800">
              Các bạn học sinh nói gì về VietTyping?
            </h2>
            <p className="text-lg text-slate-400 mt-2">
              Luyện gõ phím không còn nhàm chán nhờ có sự kết hợp thú vị giữa học tập và trò chơi!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-6 rounded-3xl border-2 ${t.color} shadow-sm flex flex-col justify-between`}
              >
                <p className="text-slate-600 italic leading-relaxed text-sm md:text-base mb-6">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3 border-t border-slate-200/60 pt-4">
                  <span className="text-4xl bg-white p-2 rounded-2xl border border-slate-100 shadow-inner">
                    {t.avatar}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm md:text-base">{t.name}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{t.role}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{t.school}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Q&A (FAQ) SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold rounded-full mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
              Giải Đáp Thắc Mắc
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-lg text-slate-400 mt-2">
              Mọi thắc mắc của bạn về VietTyping sẽ được giải đáp tại đây!
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`border-2 rounded-2xl transition-all overflow-hidden ${
                    isOpen ? 'border-sky-300 bg-sky-50/20' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-800 text-base md:text-lg focus:outline-none cursor-pointer"
                  >
                    <span>{idx + 1}. {faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-sky-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-slate-500 leading-relaxed text-sm md:text-base border-t border-slate-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Sẵn sàng trở thành "Cao thủ Gõ Phím"? 🚀
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Hơn 60 bài học tiếng Việt, hệ thống thi đua tích lũy XP, bàn phím ảo sinh động — tất cả đều hoàn toàn miễn phí.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/typing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-700 text-base font-black rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.97]"
            >
              <Keyboard className="w-5 h-5" />
              Bắt đầu luyện tập ngay
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 text-white text-base font-bold rounded-2xl border-2 border-white/30 hover:bg-white/25 transition-all active:scale-[0.97]"
            >
              <Shield className="w-5 h-5" />
              Đăng nhập Giáo viên
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 bg-slate-800 text-slate-400">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-1.5 rounded-lg text-white">
              <Keyboard className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-300">VietTyping</span>
            <span className="text-xs text-slate-500">— Luyện gõ tiếng Việt cho học sinh THCS</span>
          </div>
          <div className="text-sm text-slate-500">
            © 2025 VietTyping. Dự án giáo dục phi lợi nhuận.
          </div>
        </div>
      </footer>
    </main>
  );
}
