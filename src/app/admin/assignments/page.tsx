'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Lock, 
  Unlock, 
  Keyboard, 
  Check, 
  Sparkles, 
  Info,
  Save,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

interface AdminRules {
  unlockRule: 'linear' | 'free';
  minWpm: number;
  minAccuracy: number;
  forceLayout: 'both' | 'telex' | 'vni';
}

const DEFAULT_RULES: AdminRules = {
  unlockRule: 'linear',
  minWpm: 25,
  minAccuracy: 90,
  forceLayout: 'both',
};

export default function AdminAssignmentsPage() {
  const { playSound } = useSound();
  
  const [rules, setRules] = useState<AdminRules>(DEFAULT_RULES);
  const [isSaved, setIsSaved] = useState(false);

  // Load rules from localStorage
  useEffect(() => {
    try {
      const savedRules = localStorage.getItem('viettyping_admin_rules');
      if (savedRules) {
        setRules(JSON.parse(savedRules));
      }
    } catch (e) {
      console.error('Failed to load admin rules:', e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('viettyping_admin_rules', JSON.stringify(rules));
      playSound('tada');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error(e);
      playSound('wrong');
    }
  };

  const handleReset = () => {
    if (confirm('Bạn có muốn khôi phục các quy tắc học tập mặc định không?')) {
      playSound('click');
      setRules(DEFAULT_RULES);
      localStorage.setItem('viettyping_admin_rules', JSON.stringify(DEFAULT_RULES));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
          QUY TẮC BÀI TẬP & KHÓA HỌC
        </h1>
        <p className="text-slate-400 text-sm font-semibold mt-1">
          Thiết lập tiêu chuẩn hoàn thành bài tập gõ tiếng Việt của toàn bộ học sinh THCS
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Main form card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Unlock Progression Rules */}
          <div className="bg-[#0A0E1A] border-2 border-slate-800/80 rounded-[32px] p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-100 uppercase tracking-wider">Lộ trình mở khóa bài học</h3>
            </div>

            <div className="space-y-4">
              <label 
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  rules.unlockRule === 'linear'
                    ? 'bg-cyan-500/5 border-cyan-500/30'
                    : 'bg-slate-950 border-transparent hover:border-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="unlockRule"
                  checked={rules.unlockRule === 'linear'}
                  onChange={() => {
                    playSound('click');
                    setRules(prev => ({ ...prev, unlockRule: 'linear' }));
                  }}
                  className="mt-1 accent-cyan-500"
                />
                <div>
                  <span className="text-sm font-extrabold text-slate-100 block mb-1">Mở khóa Tuần tự (Bắt buộc)</span>
                  <span className="text-xs text-slate-400 leading-relaxed font-semibold block">
                    Học sinh phải vượt qua bài học N để mở khóa bài học tiếp theo (N+1). Đảm bảo học sinh học đúng lộ trình.
                  </span>
                </div>
              </label>

              <label 
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  rules.unlockRule === 'free'
                    ? 'bg-cyan-500/5 border-cyan-500/30'
                    : 'bg-slate-950 border-transparent hover:border-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="unlockRule"
                  checked={rules.unlockRule === 'free'}
                  onChange={() => {
                    playSound('click');
                    setRules(prev => ({ ...prev, unlockRule: 'free' }));
                  }}
                  className="mt-1 accent-cyan-500"
                />
                <div>
                  <span className="text-sm font-extrabold text-slate-100 block mb-1">Luyện tập Tự do</span>
                  <span className="text-xs text-slate-400 leading-relaxed font-semibold block">
                    Tất cả 60 bài học (Sơ cấp, Trung cấp, Cao cấp) đều mở khóa ngay lập tức. Học sinh có thể làm bất kỳ bài nào.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Card 2: Layout limits */}
          <div className="bg-[#0A0E1A] border-2 border-slate-800/80 rounded-[32px] p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400">
                <Keyboard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-100 uppercase tracking-wider">Giới hạn kiểu gõ dấu</h3>
            </div>

            <div className="space-y-4">
              <label 
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  rules.forceLayout === 'both'
                    ? 'bg-indigo-500/5 border-indigo-500/30'
                    : 'bg-slate-950 border-transparent hover:border-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="forceLayout"
                  checked={rules.forceLayout === 'both'}
                  onChange={() => {
                    playSound('click');
                    setRules(prev => ({ ...prev, forceLayout: 'both' }));
                  }}
                  className="mt-1 accent-indigo-500"
                />
                <div>
                  <span className="text-sm font-extrabold text-slate-100 block mb-1">Mặc định (Telex & VNI)</span>
                  <span className="text-xs text-slate-400 leading-relaxed font-semibold block">
                    Học sinh tự do lựa chọn gõ kiểu Telex hoặc VNI tùy thói quen trên cùng một giao diện luyện tập.
                  </span>
                </div>
              </label>

              <label 
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  rules.forceLayout === 'telex'
                    ? 'bg-indigo-500/5 border-indigo-500/30'
                    : 'bg-slate-950 border-transparent hover:border-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="forceLayout"
                  checked={rules.forceLayout === 'telex'}
                  onChange={() => {
                    playSound('click');
                    setRules(prev => ({ ...prev, forceLayout: 'telex' }));
                  }}
                  className="mt-1 accent-indigo-500"
                />
                <div>
                  <span className="text-sm font-extrabold text-slate-100 block mb-1">Bắt buộc gõ kiểu Telex</span>
                  <span className="text-xs text-slate-400 leading-relaxed font-semibold block">
                    Khóa tính năng gõ kiểu VNI. Học sinh chỉ có thể luyện tập gõ tiếng Việt bằng kiểu Telex.
                  </span>
                </div>
              </label>

              <label 
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  rules.forceLayout === 'vni'
                    ? 'bg-indigo-500/5 border-indigo-500/30'
                    : 'bg-slate-950 border-transparent hover:border-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="forceLayout"
                  checked={rules.forceLayout === 'vni'}
                  onChange={() => {
                    playSound('click');
                    setRules(prev => ({ ...prev, forceLayout: 'vni' }));
                  }}
                  className="mt-1 accent-indigo-500"
                />
                <div>
                  <span className="text-sm font-extrabold text-slate-100 block mb-1">Bắt buộc gõ kiểu VNI</span>
                  <span className="text-xs text-slate-400 leading-relaxed font-semibold block">
                    Khóa tính năng gõ kiểu Telex. Học sinh chỉ có thể luyện tập gõ tiếng Việt bằng kiểu VNI.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Card 3: Minimum Accuracy and WPM thresholds */}
          <div className="bg-[#0A0E1A] border-2 border-slate-800/80 rounded-[32px] p-6 shadow-md md:col-span-2 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-100 uppercase tracking-wider">Ngưỡng chấm đạt tối thiểu</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
              {/* Speed WPM Threshold */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-350">Tốc độ gõ tối thiểu (WPM)</span>
                  <span className="text-xl font-black text-emerald-400">{rules.minWpm} WPM</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={rules.minWpm}
                    onChange={(e) => {
                      playSound('tick');
                      setRules(prev => ({ ...prev, minWpm: parseInt(e.target.value, 10) }));
                    }}
                    className="flex-1 accent-emerald-400 h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Mức khuyến nghị: Lớp 6 (20 WPM), Lớp 7 (25 WPM), Lớp 8-9 (30 WPM trở lên).
                </div>
              </div>

              {/* Accuracy Threshold */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-350">Độ chuẩn xác tối thiểu (%)</span>
                  <span className="text-xl font-black text-emerald-400">{rules.minAccuracy}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="80"
                    max="98"
                    step="1"
                    value={rules.minAccuracy}
                    onChange={(e) => {
                      playSound('tick');
                      setRules(prev => ({ ...prev, minAccuracy: parseInt(e.target.value, 10) }));
                    }}
                    className="flex-1 accent-emerald-400 h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Độ chính xác cao giúp rèn thói quen gõ ngón chuẩn và tạo tốc độ bền vững cho học sinh THCS.
                </div>
              </div>
            </div>

            {/* Warning display */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 mt-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-amber-500 uppercase tracking-wide block mb-1">CẢNH BÁO BẢO MẬT HỌC TẬP</span>
                <span className="text-xs text-slate-450 leading-relaxed font-bold block">
                  Khi học sinh luyện tập gõ phím, nếu không đạt một trong hai chỉ số trên, bài học đó sẽ báo <strong>"Không đạt ngưỡng tiêu chuẩn giáo viên"</strong> và không ghi nhận hoàn thành.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 active:scale-95 text-slate-400 hover:text-slate-200 font-extrabold rounded-2xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-95 text-slate-950 font-black rounded-2xl shadow-lg shadow-cyan-500/10 transition-all cursor-pointer relative"
          >
            <Save className="w-4 h-4 stroke-[3]" />
            <span>Lưu tất cả quy tắc</span>
            {isSaved && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl shadow-lg animate-bounce">
                Đã cập nhật ✓
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
