'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSound } from '@/contexts/SoundContext';
import { useAuth } from '@/contexts/AuthContext';
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
  ShieldCheck,
  UserCog
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
  const router = useRouter();
  const { playSound } = useSound();
  const { user, isLoading, isLoggedIn } = useAuth();

  // Kiểm tra quyền truy cập Admin/Giáo viên
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || !user || (user.role !== 'admin' && user.role !== 'teacher')) {
        router.push('/login');
      }
    }
  }, [isLoading, isLoggedIn, user, router]);

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-slate-50 flex items-center justify-center ${beVietnamPro.className}`}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Đang xác thực quyền...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user || (user.role !== 'admin' && user.role !== 'teacher')) {
    return null;
  }

  const menuItems = [
    {
      name: 'Tổng quan',
      href: '/admin',
      icon: LayoutDashboard,
      color: 'text-sky-500',
    },
    {
      name: 'Quản lý tài khoản',
      href: '/admin/users',
      icon: UserCog,
      color: 'text-indigo-600',
    },
    {
      name: 'Quản lý lớp học',
      href: '/admin/classes',
      icon: Users,
      color: 'text-indigo-500',
    },
    {
      name: 'Quy tắc & Bài tập',
      href: '/admin/assignments',
      icon: Settings,
      color: 'text-emerald-500',
    },
    {
      name: 'Giám sát trực tuyến',
      href: '/admin/live',
      icon: Radio,
      color: 'text-rose-500',
    },
    {
      name: 'Báo cáo & Thống kê',
      href: '/admin/reports',
      icon: BarChart3,
      color: 'text-amber-500',
    },
    {
      name: 'Lịch thi cử',
      href: '/admin/exams',
      icon: Calendar,
      color: 'text-purple-500',
    },
  ];

  const handleLinkClick = () => {
    playSound('click');
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 flex ${beVietnamPro.className}`}>
      
      {/* Light decorative background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-100/40 blur-[120px]" />
      </div>

      {/* Sidebar navigation */}
      <aside className="w-64 bg-white border-r-2 border-slate-200 p-5 flex flex-col justify-between shrink-0 relative z-10 shadow-sm">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-2 rounded-xl text-white font-black shadow-md shadow-sky-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider block bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-600">VIETTYPING</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-500" /> Educator Hub
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
                      ? 'bg-sky-50 text-sky-700 border-2 border-sky-200 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-2 border-transparent'
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
        <div className="pt-4 border-t-2 border-slate-200">
          <Link
            href="/typing"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-sky-600 hover:bg-sky-50 border-2 border-transparent hover:border-sky-200 transition-all"
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
