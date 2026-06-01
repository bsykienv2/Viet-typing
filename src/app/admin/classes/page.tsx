'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Copy, 
  Check, 
  ArrowLeft, 
  Search,
  BookOpen, 
  Trash2,
  GraduationCap,
  Keyboard,
  Sliders,
  Settings
} from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

interface ClassItem {
  id: string;
  name: string;
  gradeLevel: 'Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9';
  inviteCode: string;
  studentCount: number;
  avgWpm: number;
  avgAccuracy: number;
  allowedLayouts: 'both' | 'telex' | 'vni';
}

const INITIAL_CLASSES: ClassItem[] = [
  { id: 'c1', name: 'Lớp 8A1', gradeLevel: 'Lớp 8', inviteCode: 'VT-8A1-9X2', studentCount: 38, avgWpm: 48, avgAccuracy: 95, allowedLayouts: 'both' },
  { id: 'c2', name: 'Lớp 8A2', gradeLevel: 'Lớp 8', inviteCode: 'VT-8A2-3Y8', studentCount: 36, avgWpm: 45, avgAccuracy: 94, allowedLayouts: 'both' },
  { id: 'c3', name: 'Lớp 7A3', gradeLevel: 'Lớp 7', inviteCode: 'VT-7A3-1A9', studentCount: 40, avgWpm: 35, avgAccuracy: 92, allowedLayouts: 'telex' },
  { id: 'c4', name: 'Lớp 9B1', gradeLevel: 'Lớp 9', inviteCode: 'VT-9B1-7K4', studentCount: 34, avgWpm: 56, avgAccuracy: 96, allowedLayouts: 'both' },
  { id: 'c5', name: 'Lớp 6A2', gradeLevel: 'Lớp 6', inviteCode: 'VT-6A2-5W3', studentCount: 28, avgWpm: 28, avgAccuracy: 89, allowedLayouts: 'telex' },
];

export default function AdminClassesPage() {
  const { playSound } = useSound();
  
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Form states
  const [newClassName, setNewClassName] = useState('');
  const [newGradeLevel, setNewGradeLevel] = useState<'Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9'>('Lớp 8');
  const [newAllowedLayouts, setNewAllowedLayouts] = useState<'both' | 'telex' | 'vni'>('both');

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    playSound('tada');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newClassName.trim()) {
      playSound('wrong');
      alert('Vui lòng điền tên lớp học!');
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const cleanClassName = newClassName.replace(/\s+/g, '').toUpperCase();
    const generatedCode = `VT-${cleanClassName}-${randomSuffix}`;

    const newClass: ClassItem = {
      id: String(Date.now()),
      name: newClassName.trim(),
      gradeLevel: newGradeLevel,
      inviteCode: generatedCode,
      studentCount: 0,
      avgWpm: 0,
      avgAccuracy: 0,
      allowedLayouts: newAllowedLayouts
    };

    setClasses(prev => [newClass, ...prev]);
    playSound('tada');
    setIsModalOpen(false);
    setNewClassName('');
  };

  const handleDeleteClass = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa lớp học ${name} không? Dữ liệu thống kê của học sinh trong lớp sẽ không còn hiển thị ở đây.`)) {
      playSound('wrong');
      setClasses(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
            QUẢN LÝ LỚP HỌC
          </h1>
          <p className="text-slate-400 text-sm font-semibold mt-1">
            Tạo mã tham gia cho học sinh THCS và theo dõi thống kê lớp học
          </p>
        </div>
        <button
          onClick={() => {
            playSound('click');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-black rounded-2xl shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Tạo lớp học mới</span>
        </button>
      </div>

      {/* Roster list of class cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div 
            key={cls.id} 
            className="bg-[#0A0E1A] border-2 border-slate-800/80 hover:border-cyan-500/30 rounded-3xl p-6 shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              {/* Top info */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {cls.gradeLevel}
                  </span>
                  <h3 className="text-2xl font-black text-slate-100 mt-2 group-hover:text-cyan-400 transition-colors">
                    {cls.name}
                  </h3>
                </div>
                
                <button
                  onClick={() => handleDeleteClass(cls.id, cls.name)}
                  className="p-2 text-slate-550 hover:text-rose-500 rounded-xl hover:bg-rose-500/5 transition-all cursor-pointer"
                  title="Xóa lớp học"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Code display Box */}
              <div className="bg-slate-950 border border-slate-850/80 rounded-2xl p-4 flex items-center justify-between gap-3 mb-6 relative">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Mã học sinh tham gia</span>
                  <code className="text-sm font-black text-indigo-400 tracking-wider select-all">{cls.inviteCode}</code>
                </div>
                <button
                  onClick={() => handleCopyCode(cls.inviteCode, cls.id)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2 rounded-xl text-slate-400 hover:text-slate-200 active:scale-95 transition-all cursor-pointer"
                  title="Sao chép mã"
                >
                  {copiedId === cls.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Layout limits */}
              <div className="flex items-center gap-2 mb-6">
                <Keyboard className="w-4 h-4 text-slate-550" />
                <span className="text-xs text-slate-400 font-semibold">
                  Kiểu gõ cho phép: 
                  <strong className="text-slate-350 ml-1">
                    {cls.allowedLayouts === 'both' && 'Telex & VNI'}
                    {cls.allowedLayouts === 'telex' && 'Telex'}
                    {cls.allowedLayouts === 'vni' && 'VNI'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="border-t border-slate-900 pt-5 flex items-center justify-between text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-cyan-455" />
                <span>{cls.studentCount} Học sinh</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-medium">|</span>
                <span>Speed: <strong className="text-slate-200">{cls.avgWpm} WPM</strong></span>
                <span className="text-slate-500 font-medium">|</span>
                <span>Acc: <strong className="text-slate-200">{cls.avgAccuracy}%</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide to invite students */}
      <div className="bg-gradient-to-br from-[#090D1A] to-[#0D1326] border-2 border-slate-800/80 rounded-[32px] p-8 shadow-md">
        <h2 className="text-lg font-black tracking-wide text-cyan-400 mb-4 uppercase">
          HƯỚNG DẪN CẤP MÃ CHO HỌC SINH THCS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <div className="text-2xl font-black text-cyan-400">01.</div>
            <h4 className="font-extrabold text-slate-200">Chia sẻ mã lớp học</h4>
            <p className="text-slate-450 leading-relaxed">
              Nhấp vào nút sao chép mã (ví dụ: <code className="text-indigo-400 font-bold bg-slate-950 px-1 py-0.5 rounded">VT-8A1-9X2</code>) để gửi cho học sinh trong lớp của bạn qua Zalo hoặc trình chiếu trên bảng.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-black text-indigo-400">02.</div>
            <h4 className="font-extrabold text-slate-200">Học sinh nhập mã</h4>
            <p className="text-slate-450 leading-relaxed">
              Học sinh đăng nhập, nhấp vào tên của mình, chọn <strong>Hồ sơ cá nhân</strong> và nhập Mã lớp được giáo viên cung cấp để liên kết tài khoản.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-black text-fuchsia-400">03.</div>
            <h4 className="font-extrabold text-slate-200">Giám sát & Chấm điểm</h4>
            <p className="text-slate-450 leading-relaxed">
              Tất cả tiến trình hoàn thành 60 bài học gõ tiếng Việt, tốc độ gõ (WPM), và độ chuẩn xác của học sinh sẽ tự động đồng bộ lên Bảng điều khiển giáo viên.
            </p>
          </div>
        </div>
      </div>

      {/* Modal - Create Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            onClick={() => {
              playSound('click');
              setIsModalOpen(false);
            }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-[32px] p-8 w-full max-w-md shadow-2xl relative z-10 text-slate-100 overflow-hidden">
            {/* Design stripes */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-indigo-500" />
            
            <h2 className="text-2xl font-black text-cyan-400 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 stroke-[3]" />
              <span>Tạo lớp học mới</span>
            </h2>

            <form onSubmit={handleCreateClass} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tên lớp học</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lớp 8A1, Lớp 9A2..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm font-semibold px-4 py-3 rounded-2xl text-slate-200 outline-none transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cấp bậc học sinh</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'] as const).map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setNewGradeLevel(grade);
                      }}
                      className={`text-xs font-bold py-2.5 rounded-xl border transition-all cursor-pointer ${
                        newGradeLevel === grade
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-900'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Giới hạn kiểu gõ dấu tiếng Việt</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-850 rounded-2xl p-3 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="layouts"
                      checked={newAllowedLayouts === 'both'}
                      onChange={() => setNewAllowedLayouts('both')}
                      className="accent-cyan-500"
                    />
                    <div>
                      <span className="text-xs font-black text-slate-200 block">Telex & VNI</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Khuyên khích tự do lựa chọn</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-850 rounded-2xl p-3 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="layouts"
                      checked={newAllowedLayouts === 'telex'}
                      onChange={() => setNewAllowedLayouts('telex')}
                      className="accent-cyan-500"
                    />
                    <div>
                      <span className="text-xs font-black text-slate-200 block">Chỉ cho gõ kiểu Telex</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Tất cả bài học buộc gõ Telex</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-850 rounded-2xl p-3 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="layouts"
                      checked={newAllowedLayouts === 'vni'}
                      onChange={() => setNewAllowedLayouts('vni')}
                      className="accent-cyan-500"
                    />
                    <div>
                      <span className="text-xs font-black text-slate-200 block">Chỉ cho gõ kiểu VNI</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Tất cả bài học buộc gõ VNI</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setIsModalOpen(false);
                  }}
                  className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 py-3 rounded-2xl text-xs font-extrabold text-slate-400 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-3 rounded-2xl text-xs font-black shadow-lg shadow-cyan-500/10 transition-colors cursor-pointer"
                >
                  Tạo lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
