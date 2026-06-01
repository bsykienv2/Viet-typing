'use client';

import React from 'react';
import Link from 'next/link';
import { Be_Vietnam_Pro } from 'next/font/google';
import { motion } from 'framer-motion';
import { Keyboard, Users, BarChart3, Shield, ChevronRight, Zap, Target, Award, BookOpen, GraduationCap, Star } from 'lucide-react';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900']
});

export default function HomePage() {
  return (
    <main className={`min-h-screen bg-slate-50 text-slate-800 ${beVietnamPro.className}`}>

      {/* ===== NAVIGATION BAR ===== */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors"
            >
              Giáo Viên
            </Link>
            <Link
              href="/typing"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all active:scale-95"
            >
              Bắt đầu luyện tập
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/50 to-slate-50 py-20 lg:py-28">
        {/* Decorative blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-100/60 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/60 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
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

              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                Hệ thống 60 bài học từ cơ bản đến nâng cao, hỗ trợ gõ <strong className="text-slate-700">Telex</strong> & <strong className="text-slate-700">VNI</strong>, giúp học sinh THCS rèn luyện kỹ năng gõ phím 10 ngón chuẩn quốc tế.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/typing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-base font-bold rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all active:scale-[0.97] border-2 border-sky-400/30"
                >
                  <Keyboard className="w-5 h-5" />
                  Bắt đầu luyện tập miễn phí
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 text-base font-bold rounded-2xl shadow-md border-2 border-slate-200 hover:border-sky-300 hover:text-sky-600 transition-all active:scale-[0.97]"
                >
                  <GraduationCap className="w-5 h-5" />
                  Dành cho Giáo viên
                </Link>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 mt-10 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-black text-sky-600">60+</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bài học</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-indigo-600">3</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cấp độ</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600">100%</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Miễn phí</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-600">2</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kiểu gõ (Telex & VNI)</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Visual illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
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
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Tại sao chọn VietTyping?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Được thiết kế riêng cho học sinh Trung học cơ sở Việt Nam với lộ trình bài bản và công cụ quản trị cho Giáo viên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-sky-50/60 border-2 border-sky-100 rounded-3xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-sky-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-sky-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">60 bài học có lộ trình</h3>
              <p className="text-slate-500 leading-relaxed">
                Từ Sơ cấp (làm quen hàng phím) → Trung cấp (từ ghép, câu ngắn) → Cao cấp (đoạn văn dài). Tất cả nội dung đều bằng tiếng Việt có dấu.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-indigo-50/60 border-2 border-indigo-100 rounded-3xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-indigo-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-indigo-500/20">
                <Keyboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Hỗ trợ Telex & VNI</h3>
              <p className="text-slate-500 leading-relaxed">
                Học sinh tự do chọn kiểu gõ dấu tiếng Việt phù hợp. Giáo viên có thể bắt buộc lớp học chỉ dùng một kiểu gõ duy nhất.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-50/60 border-2 border-emerald-100 rounded-3xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-emerald-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-emerald-500/20">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Bàn phím ảo trực quan</h3>
              <p className="text-slate-500 leading-relaxed">
                Bàn phím ảo hướng dẫn ngón tay đặt đúng vị trí, highlight phím cần gõ tiếp theo, phản hồi âm thanh đúng/sai tức thì.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-amber-50/60 border-2 border-amber-100 rounded-3xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-amber-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-amber-500/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Hệ thống XP & Streak</h3>
              <p className="text-slate-500 leading-relaxed">
                Tích lũy điểm XP, duy trì chuỗi ngày luyện tập, nhận sao đánh giá 3 mức. Gamification giúp học sinh luôn có động lực.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-rose-50/60 border-2 border-rose-100 rounded-3xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-rose-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-rose-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Quản trị Giáo viên</h3>
              <p className="text-slate-500 leading-relaxed">
                Giáo viên tạo lớp học, chia sẻ mã tham gia, giám sát tiến độ học sinh realtime, thiết lập ngưỡng chấm đạt WPM & độ chính xác.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-purple-50/60 border-2 border-purple-100 rounded-3xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="bg-purple-500 text-white p-3 rounded-2xl w-fit mb-5 shadow-md shadow-purple-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Thống kê chi tiết</h3>
              <p className="text-slate-500 leading-relaxed">
                Theo dõi tốc độ gõ (WPM), độ chính xác, số bài hoàn thành. Dashboard tổng quan với biểu đồ phân bổ kiểu gõ Telex/VNI.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Cách hoạt động
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Chỉ cần 3 bước đơn giản để bắt đầu luyện gõ phím tiếng Việt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-500 text-white text-2xl font-black rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-sky-500/20 border-2 border-sky-400/50">
                01
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Chọn cấp độ</h3>
              <p className="text-slate-500 leading-relaxed">
                Bắt đầu từ <strong>Sơ cấp</strong> nếu bạn mới học gõ phím, hoặc nhảy thẳng đến <strong>Trung cấp / Cao cấp</strong> để thử thách bản thân.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500 text-white text-2xl font-black rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/20 border-2 border-indigo-400/50">
                02
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Luyện gõ tiếng Việt</h3>
              <p className="text-slate-500 leading-relaxed">
                Gõ theo bàn phím ảo hướng dẫn, sử dụng kiểu gõ <strong>Telex</strong> hoặc <strong>VNI</strong> để tạo dấu tiếng Việt trên cùng giao diện.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 text-white text-2xl font-black rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20 border-2 border-emerald-400/50">
                03
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Nhận kết quả & tiến bộ</h3>
              <p className="text-slate-500 leading-relaxed">
                Xem tốc độ WPM, độ chính xác, tích lũy XP và nhận sao đánh giá. Giáo viên giám sát trực tiếp tiến độ của cả lớp.
              </p>
            </div>
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
            Hơn 60 bài học tiếng Việt, hệ thống gamification, bàn phím ảo trực quan — tất cả đều miễn phí. Bắt đầu ngay hôm nay!
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
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
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
