'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSound } from '@/contexts/SoundContext';
import { Be_Vietnam_Pro } from 'next/font/google';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Radio, 
  BarChart3, 
  Calendar, 
  ArrowLeft,
  Keyboard,
  ShieldCheck
} from 'lucide-react';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900']
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { playSound } = useSound();

  const menuItems = [
    {
      name: 'Tổng quan',
      href: '/admin',
      icon: LayoutDashboard,
      color: 'text-cyan-400',
    },
    {
      name: 'Quản lý lớp học',
      href: '/admin/classes',
      icon: Users,
      color: 'text-indigo-400',
    },
    {
      name: 'Quy tắc & Bài tập',
      href: '/admin/assignments',
      icon: Settings,
      color: 'text-emerald-400',
    },
    {
      name: 'Giám sát trực tuyến',
      href: '/admin/live',
      icon: Radio,
      color: 'text-rose-400',
    },
    {
      name: 'Báo cáo & Thống kê',
      href: '/admin/reports',
      icon: BarChart3,
      color: 'text-amber-400',
    },
    {
      name: 'Lịch thi cử',
      href: '/admin/exams',
      icon: Calendar,
      color: 'text-fuchsia-400',
    },
  ];

  const handleLinkClick = () => {
    playSound('click');
  };

  return (
    <div className={`min-h-screen bg-[#060810] text-slate-100 flex ${beVietnamPro.className}`}>
      
      {/* Dynamic Cyber Grid (Shared across admin pages) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      {/* Sidebar navigation */}
      <aside className="w-64 bg-[#090D1A]/90 backdrop-blur-md border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 relative z-10">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 p-2 rounded-xl text-slate-950 font-black shadow-md shadow-cyan-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">VIETTYPING</span>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> Educator Hub
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-slate-800/80 text-slate-100 border border-slate-700/50 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color} ${isActive ? 'scale-110' : ''}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to Student view */}
        <div className="pt-4 border-t border-slate-800/60">
          <Link
            href="/typing"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-cyan-400 hover:bg-slate-900/50 border border-transparent hover:border-cyan-500/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trở về giao diện Học sinh</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
