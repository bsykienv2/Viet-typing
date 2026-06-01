'use client';

import React, { useState, useEffect } from 'react';
import { Users, Clock, Percent, TrendingUp, Activity, Search, Filter, Monitor, Flame, Award, Sparkles } from 'lucide-react';
import { useStudent } from '@/contexts/StudentContext';
import { lessons } from '@/data/lessons';
import { useSound } from '@/contexts/SoundContext';

interface StudentRosterItem {
  id: string; name: string; nickname: string; avatar: string; grade: string;
  wpm: number; accuracy: number; lessonsDone: number; layout: 'Telex' | 'VNI';
  status: 'online' | 'offline'; lastActive: string;
}

const MOCK_ROSTER: StudentRosterItem[] = [
  { id: '1', name: 'Nguyễn Hoàng Nam', nickname: 'NamSpeed', avatar: '💻', grade: 'Lớp 8A1', wpm: 54, accuracy: 96, lessonsDone: 34, layout: 'Telex', status: 'online', lastActive: 'Vừa xong' },
  { id: '2', name: 'Lê Mai Anh', nickname: 'Clover', avatar: '🦊', grade: 'Lớp 8A1', wpm: 48, accuracy: 98, lessonsDone: 28, layout: 'Telex', status: 'online', lastActive: '2 phút trước' },
  { id: '3', name: 'Trần Minh Đức', nickname: 'RexTypist', avatar: '🤖', grade: 'Lớp 8A2', wpm: 62, accuracy: 94, lessonsDone: 42, layout: 'VNI', status: 'offline', lastActive: '10 phút trước' },
  { id: '4', name: 'Phạm Thảo Linh', nickname: 'LinhCute', avatar: '🎧', grade: 'Lớp 7A3', wpm: 35, accuracy: 92, lessonsDone: 15, layout: 'Telex', status: 'online', lastActive: 'Vừa xong' },
  { id: '5', name: 'Hoàng Quốc Bảo', nickname: 'Storm', avatar: '⚡', grade: 'Lớp 9B1', wpm: 71, accuracy: 95, lessonsDone: 51, layout: 'VNI', status: 'online', lastActive: 'Vừa xong' },
  { id: '6', name: 'Vũ Thu Trang', nickname: 'Starlight', avatar: '🐉', grade: 'Lớp 6A2', wpm: 28, accuracy: 89, lessonsDone: 8, layout: 'Telex', status: 'offline', lastActive: '1 giờ trước' },
  { id: '7', name: 'Đỗ Anh Tuấn', nickname: 'Shadow', avatar: '👾', grade: 'Lớp 8A1', wpm: 45, accuracy: 93, lessonsDone: 22, layout: 'Telex', status: 'offline', lastActive: '30 phút trước' },
];

export default function AdminDashboard() {
  const { studentInfo, isConfigured } = useStudent();
  const { playSound } = useSound();
  const [selectedClass, setSelectedClass] = useState<string>('Tất cả');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [liveActivities, setLiveActivities] = useState<Array<{ id: string; student: string; avatar: string; lessonName: string; wpm: number; accuracy: number; time: string; }>>([
    { id: 'a1', student: 'Hoàng Quốc Bảo', avatar: '⚡', lessonName: 'Bài 42: Luyện tốc độ nâng cao', wpm: 73, accuracy: 96, time: 'Vừa xong' },
    { id: 'a2', student: 'Nguyễn Hoàng Nam', avatar: '💻', lessonName: 'Bài 24: Thực hành gõ dấu', wpm: 56, accuracy: 94, time: '1 phút trước' },
    { id: 'a3', student: 'Phạm Thảo Linh', avatar: '🎧', lessonName: 'Bài 12: Hàng phím trên cùng', wpm: 38, accuracy: 91, time: '3 phút trước' },
  ]);
  const [roster, setRoster] = useState<StudentRosterItem[]>(MOCK_ROSTER);

  useEffect(() => {
    if (isConfigured && studentInfo) {
      const completedList = JSON.parse(localStorage.getItem('typing_completed_lessons') || '[]');
      const savedXp = parseInt(localStorage.getItem('typing_xp') || '0', 10);
      const realWpm = Math.min(25 + Math.floor(savedXp / 100), 90);
      const realAccuracy = Math.min(85 + Math.floor(savedXp / 150), 100);
      const realStudent: StudentRosterItem = {
        id: 'student-self', name: studentInfo.name || 'Học sinh Hiện tại', nickname: studentInfo.nickname,
        avatar: studentInfo.avatar || '🤖', grade: studentInfo.grade || 'Lớp 8A1', wpm: realWpm,
        accuracy: realAccuracy, lessonsDone: completedList.length, layout: 'Telex', status: 'online', lastActive: 'Vừa xong'
      };
      setRoster(prev => { const filtered = prev.filter(p => p.id !== 'student-self'); return [realStudent, ...filtered]; });
    }
  }, [isConfigured, studentInfo]);

  useEffect(() => {
    const names = ['Nguyễn Hoàng Nam', 'Lê Mai Anh', 'Trần Minh Đức', 'Phạm Thảo Linh', 'Hoàng Quốc Bảo', 'Vũ Thu Trang'];
    const avatars = ['💻', '🦊', '🤖', '🎧', '⚡', '🐉'];
    const activities = ['Bài 5: Phím F và J', 'Bài 18: Ôn tập tổng hợp', 'Bài 31: Từ thông dụng', 'Bài 50: Văn mẫu ngắn', 'Bài 58: Văn học'];
    const interval = setInterval(() => {
      const ri = Math.floor(Math.random() * names.length);
      const ra = Math.floor(Math.random() * activities.length);
      const wpm = 30 + Math.floor(Math.random() * 50);
      const acc = 90 + Math.floor(Math.random() * 10);
      setLiveActivities(prev => [{ id: String(Date.now()), student: names[ri], avatar: avatars[ri], lessonName: activities[ra], wpm, accuracy: acc, time: 'Vừa xong' }, ...prev.slice(0, 4)]);
      setRoster(prev => prev.map(s => s.name === names[ri] ? { ...s, wpm: Math.round((s.wpm + wpm) / 2), accuracy: Math.round((s.accuracy + acc) / 2), lessonsDone: s.lessonsDone + 1, status: 'online', lastActive: 'Vừa xong' } : s));
      try { playSound('tick'); } catch {}
    }, 12000);
    return () => clearInterval(interval);
  }, [playSound]);

  const filteredRoster = roster.filter(s => {
    const mc = selectedClass === 'Tất cả' || s.grade === selectedClass;
    const ms = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    return mc && ms;
  });
  const totalStudentsCount = filteredRoster.length;
  const averageWpm = totalStudentsCount > 0 ? Math.round(filteredRoster.reduce((sum, s) => sum + s.wpm, 0) / totalStudentsCount) : 0;
  const averageAccuracy = totalStudentsCount > 0 ? Math.round(filteredRoster.reduce((sum, s) => sum + s.accuracy, 0) / totalStudentsCount * 10) / 10 : 0;
  const activeOnlineCount = filteredRoster.filter(s => s.status === 'online').length;
  const telexCount = filteredRoster.filter(s => s.layout === 'Telex').length;
  const vniCount = filteredRoster.filter(s => s.layout === 'VNI').length;
  const telexPct = totalStudentsCount > 0 ? Math.round((telexCount / totalStudentsCount) * 100) : 0;
  const vniPct = totalStudentsCount > 0 ? Math.round((vniCount / totalStudentsCount) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-600">TỔNG QUAN HỆ THỐNG</h1>
          <p className="text-slate-400 text-sm font-semibold mt-1">Bảng điều khiển giám sát học tập thời gian thực dành cho giáo viên</p>
        </div>
        <div className="flex items-center gap-3 bg-rose-50 border-2 border-rose-200 rounded-2xl p-1.5 shadow-sm">
          <span className="flex h-2.5 w-2.5 relative ml-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span></span>
          <span className="text-xs font-black text-rose-500 uppercase tracking-widest pr-2">Live Monitor Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-sky-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Users className="w-24 h-24 text-sky-500" /></div>
          <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Học sinh quản lý</span><div className="bg-sky-50 p-2 rounded-xl text-sky-500"><Users className="w-5 h-5" /></div></div>
          <div className="flex items-baseline gap-2"><span className="text-3xl font-black text-sky-600">{totalStudentsCount}</span><span className="text-xs font-bold text-slate-400">học sinh</span></div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-500"><Activity className="w-3.5 h-3.5" /><span>{activeOnlineCount} học sinh trực tuyến</span></div>
        </div>
        <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Clock className="w-24 h-24 text-indigo-500" /></div>
          <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tốc độ gõ trung bình</span><div className="bg-indigo-50 p-2 rounded-xl text-indigo-500"><TrendingUp className="w-5 h-5" /></div></div>
          <div className="flex items-baseline gap-2"><span className="text-3xl font-black text-indigo-600">{averageWpm}</span><span className="text-xs font-bold text-slate-400">Từ/phút (WPM)</span></div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-400"><Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /><span>Mục tiêu THCS: 35 WPM</span></div>
        </div>
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Percent className="w-24 h-24 text-emerald-500" /></div>
          <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Độ chính xác trung bình</span><div className="bg-emerald-50 p-2 rounded-xl text-emerald-500"><Percent className="w-5 h-5" /></div></div>
          <div className="flex items-baseline gap-2"><span className="text-3xl font-black text-emerald-600">{averageAccuracy}%</span><span className="text-xs font-bold text-slate-400">tỷ lệ phím đúng</span></div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-500"><Award className="w-3.5 h-3.5" /><span>Đạt chuẩn yêu cầu tối thiểu</span></div>
        </div>
        <div className="bg-white border-2 border-rose-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-rose-300 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Monitor className="w-24 h-24 text-rose-500" /></div>
          <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hoàn thành bài tập</span><div className="bg-rose-50 p-2 rounded-xl text-rose-500"><Monitor className="w-5 h-5" /></div></div>
          <div className="flex items-baseline gap-2"><span className="text-3xl font-black text-rose-600">{filteredRoster.reduce((sum, s) => sum + s.lessonsDone, 0)}</span><span className="text-xs font-bold text-slate-400">lượt làm bài</span></div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-rose-500"><Sparkles className="w-3.5 h-3.5" /><span>Tổng cộng 60 bài học</span></div>
        </div>
      </div>

      {/* Roster & Live */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-black tracking-wide text-slate-800 flex items-center gap-2">DANH SÁCH HỌC SINH <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-400 border border-slate-200">{filteredRoster.length}</span></h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Tìm học sinh..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-sky-400 text-xs font-semibold pl-9 pr-4 py-2 rounded-xl text-slate-700 outline-none transition-all w-44" /></div>
              <div className="flex items-center gap-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl px-2.5 py-1.5"><Filter className="w-3.5 h-3.5 text-slate-400" /><select value={selectedClass} onChange={(e) => { playSound('click'); setSelectedClass(e.target.value); }} className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer border-none"><option value="Tất cả">Tất cả lớp</option><option value="Lớp 8A1">Lớp 8A1</option><option value="Lớp 8A2">Lớp 8A2</option><option value="Lớp 7A3">Lớp 7A3</option><option value="Lớp 9B1">Lớp 9B1</option><option value="Lớp 6A2">Lớp 6A2</option></select></div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b-2 border-slate-100 text-slate-400 text-[10px] uppercase tracking-widest font-black"><th className="pb-3 pl-2">Học sinh</th><th className="pb-3 text-center">Lớp</th><th className="pb-3 text-center">Kiểu gõ</th><th className="pb-3 text-center">Tốc độ</th><th className="pb-3 text-center">Độ chuẩn</th><th className="pb-3 text-center">Đã xong</th><th className="pb-3 text-right pr-2">Trạng thái</th></tr></thead>
              <tbody>
                {filteredRoster.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors group cursor-pointer" onClick={() => playSound('click')}>
                    <td className="py-3.5 pl-2 flex items-center gap-3">
                      <span className="text-2xl bg-slate-100 w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-200">{s.avatar}</span>
                      <div><div className="text-sm font-extrabold text-slate-700 group-hover:text-sky-600 transition-colors">{s.name}</div><div className="text-xs text-slate-400 font-semibold">@{s.nickname}</div></div>
                    </td>
                    <td className="py-3.5 text-center text-xs font-bold text-slate-500">{s.grade}</td>
                    <td className="py-3.5 text-center"><span className={`text-[10px] px-2 py-0.5 rounded font-black border uppercase tracking-wider ${s.layout === 'Telex' ? 'bg-sky-50 text-sky-600 border-sky-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>{s.layout}</span></td>
                    <td className="py-3.5 text-center font-extrabold text-sm text-slate-700">{s.wpm}</td>
                    <td className="py-3.5 text-center font-bold text-xs"><span className={s.accuracy >= 95 ? 'text-emerald-500' : 'text-amber-500'}>{s.accuracy}%</span></td>
                    <td className="py-3.5 text-center text-xs font-bold text-slate-400">{s.lessonsDone}/60</td>
                    <td className="py-3.5 text-right pr-2"><div className="flex items-center justify-end gap-1.5"><span className={`w-1.5 h-1.5 rounded-full ${s.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} /><span className="text-[10px] text-slate-400 font-bold">{s.lastActive}</span></div></td>
                  </tr>
                ))}
                {filteredRoster.length === 0 && (<tr><td colSpan={7} className="text-center py-12 text-slate-400 font-bold text-sm">Không tìm thấy học sinh nào.</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Stream */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black tracking-wide text-slate-800 flex items-center justify-between mb-6">HOẠT ĐỘNG TRỰC TIẾP <span className="text-[10px] bg-rose-50 text-rose-500 border-2 border-rose-200 px-2 py-0.5 rounded font-black tracking-widest uppercase">REALTIME</span></h2>
            <div className="space-y-4">
              {liveActivities.map((act) => (
                <div key={act.id} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex gap-3 hover:border-sky-200 hover:bg-sky-50/30 transition-all group">
                  <span className="text-2xl bg-white w-10 h-10 flex items-center justify-center rounded-xl border-2 border-slate-200 shrink-0">{act.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1"><span className="text-xs font-black text-slate-700 truncate group-hover:text-sky-600 transition-colors">{act.student}</span><span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{act.time}</span></div>
                    <p className="text-[11px] text-slate-500 font-bold truncate mb-2">{act.lessonName}</p>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-slate-400"><span className="flex items-center gap-1">⚡ WPM: <strong className="text-indigo-600">{act.wpm}</strong></span><span className="flex items-center gap-1">✓ Đúng: <strong className="text-emerald-600">{act.accuracy}%</strong></span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t-2 border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Phân bổ kiểu gõ</h3>
            <div className="space-y-3.5">
              <div><div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5"><span>Telex</span><span>{telexPct}% ({telexCount} HS)</span></div><div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200"><div className="bg-gradient-to-r from-sky-400 to-sky-500 h-full rounded-full transition-all duration-1000" style={{ width: `${telexPct}%` }} /></div></div>
              <div><div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5"><span>VNI</span><span>{vniPct}% ({vniCount} HS)</span></div><div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200"><div className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${vniPct}%` }} /></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
