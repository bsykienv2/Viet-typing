'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Key, 
  Check, 
  X, 
  Shield, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  User, 
  Users,
  Mail, 
  Phone, 
  Calendar, 
  ChevronDown, 
  UserCheck, 
  UserX,
  Sparkles,
  RefreshCw,
  MoreVertical,
  Laptop,
  GraduationCap,
  Lock,
  Loader2,
  Clock
} from 'lucide-react';
import { useAuth, User as AuthUser } from '@/contexts/AuthContext';
import { useSound } from '@/contexts/SoundContext';
import Avatar from '@/components/Avatar';

// Emojis danh sách avatar có sẵn cho giáo viên/học sinh chọn
const AVATAR_OPTIONS = ['💻', '🦊', '🤖', '🎧', '⚡', '🐉', '👾', '👑', '👩‍🏫', '🎓', '⭐', '🍀', '🍎', '🚀'];

export default function AdminUsersPage() {
  const { 
    allUsers, 
    user: currentUser,
    adminCreateUser, 
    adminUpdateUser, 
    adminDeleteUser, 
    adminResetPassword 
  } = useAuth();
  const { playSound } = useSound();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [authFilter, setAuthFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active'>('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  
  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | null }>({
    message: '',
    type: null
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4000);
  };

  // Add User Form State
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher' | 'admin',
    authType: 'normal' as 'normal' | 'google',
    isActive: false,
    avatar: '🦊',
    nickname: '',
    grade: 'Lớp 6',
  });

  // Edit User Form State
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student' as 'student' | 'teacher' | 'admin',
    authType: 'normal' as 'normal' | 'google',
    isActive: true,
    avatar: '🦊',
    nickname: '',
    grade: 'Lớp 6',
  });

  // Reset Password State
  const [resetForm, setResetForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // Update nickname and active defaults when fields change in addForm
  useEffect(() => {
    if (addForm.email && !addForm.nickname) {
      const prefix = addForm.email.split('@')[0];
      setAddForm(prev => ({ ...prev, nickname: prefix }));
    }
  }, [addForm.email]);

  // Sync edit form when selected user changes
  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        phone: selectedUser.phone || '',
        role: selectedUser.role || 'student',
        authType: selectedUser.authType || 'normal',
        isActive: selectedUser.isActive,
        avatar: selectedUser.avatar || '🦊',
        nickname: selectedUser.nickname || '',
        grade: selectedUser.grade || 'Lớp 6',
      });
    }
  }, [selectedUser]);

  // Stats calculation
  const totalUsers = allUsers.length;
  const pendingApprovals = allUsers.filter(u => !u.isActive && u.authType === 'normal').length;
  const activeUsers = allUsers.filter(u => u.isActive).length;
  const googleUsers = allUsers.filter(u => u.authType === 'google').length;
  const standardUsers = allUsers.filter(u => u.authType === 'normal').length;

  // Filtered users list
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    // Tab filter: 'pending' only shows normal accounts that are not activated yet
    // 'active' shows currently activated accounts
    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = !u.isActive && u.authType === 'normal';
    } else if (activeTab === 'active') {
      matchesTab = u.isActive;
    }

    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'active' 
        ? u.isActive 
        : !u.isActive;
    const matchesAuth = authFilter === 'all' ? true : u.authType === authFilter;

    return matchesSearch && matchesTab && matchesRole && matchesStatus && matchesAuth;
  });

  // Toggle user active status directly from the list
  const handleToggleStatus = async (user: AuthUser) => {
    if (user.id === currentUser?.id) {
      playSound('error');
      showToast('Bạn không thể tự vô hiệu hóa tài khoản của chính mình!', 'error');
      return;
    }

    const nextState = !user.isActive;
    const res = await adminUpdateUser(user.id, { isActive: nextState });

    if (res.success) {
      playSound('correct');
      showToast(
        `Đã ${nextState ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản của ${user.name} thành công!`, 
        'success'
      );
    } else {
      playSound('error');
      showToast(res.error || 'Có lỗi xảy ra khi cập nhật trạng thái!', 'error');
    }
  };

  // Add User submit handler
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!addForm.name || !addForm.email) {
      playSound('error');
      showToast('Họ tên và Email là bắt buộc!', 'error');
      return;
    }

    if (addForm.authType === 'normal') {
      if (!addForm.password) {
        playSound('error');
        showToast('Mật khẩu là bắt buộc đối với đăng ký thường!', 'error');
        return;
      }
      if (addForm.password !== addForm.confirmPassword) {
        playSound('error');
        showToast('Mật khẩu xác nhận không khớp!', 'error');
        return;
      }
    }

    const { confirmPassword, ...submitData } = addForm;
    const res = await adminCreateUser(submitData);

    if (res.success) {
      playSound('success');
      showToast(`Tạo người dùng "${addForm.name}" thành công!`, 'success');
      setShowAddModal(false);
      // Reset form
      setAddForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        authType: 'normal',
        isActive: false,
        avatar: '🦊',
        nickname: '',
        grade: 'Lớp 6',
      });
    } else {
      playSound('error');
      showToast(res.error || 'Email này đã tồn tại!', 'error');
    }
  };

  // Edit User submit handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (!editForm.name || !editForm.email) {
      playSound('error');
      showToast('Họ tên và Email không được để trống!', 'error');
      return;
    }

    const res = await adminUpdateUser(selectedUser.id, editForm);

    if (res.success) {
      playSound('success');
      showToast(`Cập nhật thông tin tài khoản "${editForm.name}" thành công!`, 'success');
      setShowEditModal(false);
      setSelectedUser(null);
    } else {
      playSound('error');
      showToast(res.error || 'Có lỗi xảy ra khi cập nhật!', 'error');
    }
  };

  // Reset Password handler
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (!resetForm.newPassword) {
      playSound('error');
      showToast('Vui lòng nhập mật khẩu mới!', 'error');
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      playSound('error');
      showToast('Mật khẩu xác nhận không trùng khớp!', 'error');
      return;
    }

    const res = await adminResetPassword(selectedUser.id, resetForm.newPassword);

    if (res.success) {
      playSound('success');
      showToast(`Thay đổi mật khẩu cho ${selectedUser.name} thành công!`, 'success');
      setShowResetModal(false);
      setResetForm({ newPassword: '', confirmPassword: '' });
      setSelectedUser(null);
    } else {
      playSound('error');
      showToast(res.error || 'Có lỗi xảy ra!', 'error');
    }
  };

  // Delete User handler
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    if (selectedUser.id === currentUser?.id) {
      playSound('error');
      showToast('Bạn không thể tự xóa tài khoản của chính mình!', 'error');
      setShowDeleteModal(false);
      setSelectedUser(null);
      return;
    }

    const res = await adminDeleteUser(selectedUser.id);

    if (res.success) {
      playSound('success');
      showToast(`Đã xóa tài khoản của ${selectedUser.name} khỏi hệ thống!`, 'success');
      setShowDeleteModal(false);
      setSelectedUser(null);
    } else {
      playSound('error');
      showToast(res.error || 'Có lỗi xảy ra khi xóa tài khoản!', 'error');
    }
  };

  // Helper formatting dates
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* Toast Notification */}
      {toast.message && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border transition-all duration-300 transform translate-y-0 scale-100 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : toast.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 animate-pulse" />}
          {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-indigo-600" />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 bg-clip-text text-transparent">
            Quản trị Người dùng & Tài khoản
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Xem danh sách, thêm mới, sửa đổi, xóa tài khoản và kích hoạt tài khoản đăng ký thường.
          </p>
        </div>
        
        <button
          onClick={() => {
            playSound('click');
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm người dùng mới</span>
        </button>
      </div>

      {/* Premium Dashboard Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Users */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden group hover:border-sky-100 hover:shadow-md transition-all duration-300">
          <div className="absolute top-[-20%] right-[-10%] w-[35%] h-[70%] rounded-full bg-sky-500/5 blur-[30px] group-hover:scale-125 transition-all duration-500" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Tổng tài khoản</span>
              <span className="text-3xl font-black text-slate-800 mt-1 block tracking-tight">{totalUsers}</span>
            </div>
            <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl border border-sky-100">
              <User className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-sky-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ thống VietTyping Live</span>
          </div>
        </div>

        {/* Card 2: Awaiting approvals (Standard and Inactive) */}
        <div className={`border-2 rounded-3xl p-5 shadow-sm relative overflow-hidden group transition-all duration-300 ${
          pendingApprovals > 0 
            ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300 hover:shadow-md' 
            : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
        }`}>
          <div className="absolute top-[-20%] right-[-10%] w-[35%] h-[70%] rounded-full bg-amber-500/5 blur-[30px] group-hover:scale-125 transition-all duration-500" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Chờ Admin kích hoạt</span>
              <span className={`text-3xl font-black mt-1 block tracking-tight ${
                pendingApprovals > 0 ? 'text-amber-600' : 'text-slate-800'
              }`}>{pendingApprovals}</span>
            </div>
            <div className={`p-3 rounded-2xl border ${
              pendingApprovals > 0 
                ? 'bg-amber-100/60 text-amber-600 border-amber-200' 
                : 'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500">
            {pendingApprovals > 0 ? (
              <span className="text-amber-700 animate-pulse">● Cần kích hoạt để học sinh đăng nhập</span>
            ) : (
              <span>Không có tài khoản chờ duyệt</span>
            )}
          </div>
        </div>

        {/* Card 3: Active Users */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden group hover:border-emerald-100 hover:shadow-md transition-all duration-300">
          <div className="absolute top-[-20%] right-[-10%] w-[35%] h-[70%] rounded-full bg-emerald-500/5 blur-[30px] group-hover:scale-125 transition-all duration-500" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Đã kích hoạt (Hoạt động)</span>
              <span className="text-3xl font-black text-emerald-600 mt-1 block tracking-tight">{activeUsers}</span>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <span>Tỉ lệ hoạt động: {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%</span>
          </div>
        </div>

        {/* Card 4: Google Auth vs Standard */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden group hover:border-indigo-100 hover:shadow-md transition-all duration-300">
          <div className="absolute top-[-20%] right-[-10%] w-[35%] h-[70%] rounded-full bg-indigo-500/5 blur-[30px] group-hover:scale-125 transition-all duration-500" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Loại hình đăng ký</span>
              <span className="text-lg font-bold text-slate-800 mt-1 block tracking-tight">
                Google: <span className="text-indigo-600 font-extrabold">{googleUsers}</span> | Thường: <span className="text-sky-600 font-extrabold">{standardUsers}</span>
              </span>
            </div>
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl border border-indigo-100">
              <Laptop className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-500">
            <span>{googleUsers} tài khoản liên kết Google</span>
          </div>
        </div>

      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-4 mb-6">
        <button
          onClick={() => {
            playSound('click');
            setActiveTab('all');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all duration-200 ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-102'
              : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tất cả</span>
          <span className={`px-2 py-0.5 text-[11px] rounded-full font-black transition-all ${
            activeTab === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            {totalUsers}
          </span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTab('pending');
            setStatusFilter('all');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all duration-200 relative ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-100 scale-102'
              : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Chờ phê duyệt</span>
          {pendingApprovals > 0 ? (
            <span className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-200"></span>
              </span>
              <span className={`px-2 py-0.5 text-[11px] rounded-full font-black ${
                activeTab === 'pending' ? 'bg-amber-650 text-white' : 'bg-amber-100 text-amber-700'
              }`}>
                {pendingApprovals}
              </span>
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[11px] rounded-full font-black bg-slate-100 text-slate-500">
              0
            </span>
          )}
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTab('active');
            setStatusFilter('all');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all duration-200 ${
            activeTab === 'active'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-102'
              : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Đang hoạt động</span>
          <span className={`px-2 py-0.5 text-[11px] rounded-full font-black transition-all ${
            activeTab === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            {activeUsers}
          </span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, email, sđt hoặc biệt danh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:bg-white rounded-2xl font-semibold text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs bg-slate-200 hover:bg-slate-300 w-5 h-5 rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Filter by Role */}
            <div className="flex items-center gap-1.5 bg-slate-50 border-2 border-slate-200 px-3.5 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase">Vai trò:</span>
              <select
                value={roleFilter}
                onChange={(e) => {
                  playSound('click');
                  setRoleFilter(e.target.value);
                }}
                className="bg-transparent font-bold text-sm text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Tất cả</option>
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 bg-slate-50 border-2 border-slate-200 px-3.5 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  playSound('click');
                  setStatusFilter(e.target.value);
                }}
                className="bg-transparent font-bold text-sm text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đang bị khóa/Chờ duyệt</option>
              </select>
            </div>

            {/* Filter by Auth Type */}
            <div className="flex items-center gap-1.5 bg-slate-50 border-2 border-slate-200 px-3.5 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase">Liên kết:</span>
              <select
                value={authFilter}
                onChange={(e) => {
                  playSound('click');
                  setAuthFilter(e.target.value);
                }}
                className="bg-transparent font-bold text-sm text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Tất cả</option>
                <option value="normal">Đăng ký thường</option>
                <option value="google">Đăng nhập Google</option>
              </select>
            </div>

            {/* Reset button if filter is active */}
            {(roleFilter !== 'all' || statusFilter !== 'all' || authFilter !== 'all' || searchTerm || activeTab !== 'all') && (
              <button
                onClick={() => {
                  playSound('click');
                  setRoleFilter('all');
                  setStatusFilter('all');
                  setAuthFilter('all');
                  setSearchTerm('');
                  setActiveTab('all');
                  showToast('Đã xóa tất cả bộ lọc', 'info');
                }}
                className="flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-2xl transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
                <span>Đặt lại bộ lọc</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Users List Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-sm overflow-hidden relative">
        <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-slate-800">Danh sách tài khoản hiển thị</span>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-black text-xs">
              {filteredUsers.length} kết quả
            </span>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <UserX className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">Không tìm thấy người dùng nào phù hợp với bộ lọc!</p>
            <p className="text-slate-400 text-xs font-medium">Vui lòng thử gõ từ khóa khác hoặc đặt lại bộ lọc.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 whitespace-nowrap">Người dùng</th>
                  <th className="py-4 px-6 whitespace-nowrap">Thông tin liên hệ</th>
                  <th className="py-4 px-6 whitespace-nowrap">Vai trò</th>
                  <th className="py-4 px-6 whitespace-nowrap">Loại tài khoản</th>
                  <th className="py-4 px-6 whitespace-nowrap">Trạng thái</th>
                  <th className="py-4 px-6 text-center whitespace-nowrap">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y border-slate-100">
                {filteredUsers.map((userItem) => {
                  const isSelf = userItem.id === currentUser?.id;
                  
                  return (
                    <tr 
                      key={userItem.id}
                      className="hover:bg-slate-50/50 transition-all font-semibold text-slate-700"
                    >
                      {/* User Column */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-sm overflow-hidden shrink-0">
                            <Avatar avatar={userItem.avatar} className="text-xl" imgClassName="w-full h-full" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-800 text-sm">{userItem.name}</span>
                              {isSelf && (
                                <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full font-black text-[9px] uppercase tracking-wider">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-semibold">
                              @{userItem.nickname} {userItem.role === 'student' && userItem.grade ? `• ${userItem.grade}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Column */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1 text-slate-600 font-bold">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{userItem.email}</span>
                          </div>
                          {userItem.phone && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{userItem.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role Badge Column */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {userItem.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-xs font-black">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Quản trị viên</span>
                          </span>
                        ) : userItem.role === 'teacher' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-full text-xs font-black">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Giáo viên</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-full text-xs font-black">
                            <Laptop className="w-3.5 h-3.5" />
                            <span>Học sinh</span>
                          </span>
                        )}
                      </td>

                      {/* Auth Type Column */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {userItem.authType === 'google' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-rose-500 via-emerald-500 to-sky-500" />
                            <span>Google Auth</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-[11px] font-semibold">
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Đăng ký thường</span>
                          </span>
                        )}
                      </td>

                      {/* Status Active Toggle Column */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {userItem.isActive ? (
                          <button
                            onClick={() => handleToggleStatus(userItem)}
                            disabled={isSelf}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-black shadow-sm transition-all outline-none bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70 ${
                              isSelf ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                            title={isSelf ? 'Bạn không thể khóa tài khoản chính mình' : 'Bấm để vô hiệu hóa tài khoản'}
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Hoạt động</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(userItem)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md shadow-amber-100 hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
                              title="Bấm để phê duyệt tài khoản này"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Phê duyệt</span>
                            </button>
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-bold bg-slate-100 border border-slate-200 px-2 py-1 rounded-xl">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>Chờ duyệt</span>
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* Edit User Details */}
                          <button
                            onClick={() => {
                              playSound('click');
                              setSelectedUser(userItem);
                              setShowEditModal(true);
                            }}
                            className="p-2 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-100 text-slate-500 hover:text-indigo-600 rounded-xl transition-all"
                            title="Sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Reset Password */}
                          {userItem.authType === 'normal' && (
                            <button
                              onClick={() => {
                                playSound('click');
                                setSelectedUser(userItem);
                                setResetForm({ newPassword: '', confirmPassword: '' });
                                setShowResetModal(true);
                              }}
                              className="p-2 hover:bg-amber-50 border-2 border-transparent hover:border-amber-100 text-slate-500 hover:text-amber-600 rounded-xl transition-all"
                              title="Đổi mật khẩu"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Account */}
                          <button
                            onClick={() => {
                              playSound('click');
                              setSelectedUser(userItem);
                              setShowDeleteModal(true);
                            }}
                            disabled={isSelf}
                            className={`p-2 rounded-xl border-2 border-transparent transition-all ${
                              isSelf 
                                ? 'opacity-40 cursor-not-allowed text-slate-300' 
                                : 'hover:bg-rose-50 hover:border-rose-100 text-slate-500 hover:text-rose-600'
                            }`}
                            title={isSelf ? 'Không thể tự xóa tài khoản của bạn' : 'Xóa tài khoản'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {/* ========================================== */}
      {/* 1. MODAL: THÊM NGƯỜI DÙNG MỚI (ADD USER)   */}
      {/* ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="bg-indigo-100 p-2.5 rounded-2xl text-indigo-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Thêm người dùng hệ thống mới</h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">Tạo tài khoản thủ công cho học sinh, giáo viên hoặc admin.</p>
                </div>
              </div>
              <button 
                onClick={() => { playSound('click'); setShowAddModal(false); }}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center font-bold text-slate-400 hover:text-slate-600 transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-6">
              
              {/* Row 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Trần Văn Nam"
                    value={addForm.name}
                    onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0987654321"
                    value={addForm.phone}
                    onChange={(e) => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Email & Nickname */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Email (Tài khoản) *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@viettyping.edu.vn"
                    value={addForm.email}
                    onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Biệt danh / Nickname</label>
                  <input
                    type="text"
                    placeholder="Sinh tự động theo Email"
                    value={addForm.nickname}
                    onChange={(e) => setAddForm(prev => ({ ...prev, nickname: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Role & Grade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Vai trò hệ thống</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => {
                      const newRole = e.target.value as 'student' | 'teacher' | 'admin';
                      setAddForm(prev => ({ 
                        ...prev, 
                        role: newRole,
                        avatar: newRole === 'admin' ? '👑' : newRole === 'teacher' ? '👩‍🏫' : '🦊'
                      }));
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                  >
                    <option value="student">Học sinh (Student)</option>
                    <option value="teacher">Giáo viên (Teacher)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
                
                {addForm.role === 'student' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Lớp học</label>
                    <select
                      value={addForm.grade}
                      onChange={(e) => setAddForm(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                    >
                      <option value="Lớp 6A1">Lớp 6A1</option>
                      <option value="Lớp 6A2">Lớp 6A2</option>
                      <option value="Lớp 7A1">Lớp 7A1</option>
                      <option value="Lớp 7A2">Lớp 7A2</option>
                      <option value="Lớp 8A1">Lớp 8A1</option>
                      <option value="Lớp 8A2">Lớp 8A2</option>
                      <option value="Lớp 9A1">Lớp 9A1</option>
                      <option value="Lớp 9B1">Lớp 9B1</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Nhiệm vụ quản lý</label>
                    <input
                      type="text"
                      disabled
                      value={addForm.role === 'admin' ? 'Quản lý toàn bộ hệ thống' : 'Quản lý giảng dạy lớp học'}
                      className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 text-slate-400 rounded-xl font-bold text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                )}
              </div>

              {/* Row 4: Auth, Status & Avatar Selector Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Phương thức đăng ký</label>
                    <select
                      value={addForm.authType}
                      onChange={(e) => {
                        const value = e.target.value as 'normal' | 'google';
                        setAddForm(prev => ({ 
                          ...prev, 
                          authType: value,
                          // Mặc định tài khoản Google tự động kích hoạt
                          isActive: value === 'google' ? true : false 
                        }));
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                    >
                      <option value="normal">Mật khẩu riêng (Đăng ký thường)</option>
                      <option value="google">Liên kết Google OAuth (Không mật khẩu)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Kích hoạt tài khoản</label>
                    <button
                      type="button"
                      onClick={() => setAddForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`flex items-center gap-1.5 px-4 py-2.5 border-2 rounded-2xl font-bold text-xs shadow-sm transition-all w-full justify-center ${
                        addForm.isActive 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {addForm.isActive ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Kích hoạt ngay (Có thể đăng nhập)</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Chờ kích hoạt / Bị khóa</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Chọn ảnh đại diện Emoji</label>
                  <div className="grid grid-cols-7 gap-1.5 max-w-[280px]">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAddForm(prev => ({ ...prev, avatar: emoji }))}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-base hover:scale-110 active:scale-95 shadow-sm transition-all ${
                          addForm.avatar === emoji 
                            ? 'bg-indigo-50 border-indigo-600 scale-105' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Password Section - Only for standard normal signup */}
              {addForm.authType === 'normal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Mật khẩu khởi tạo *</label>
                    <input
                      type="password"
                      required={addForm.authType === 'normal'}
                      placeholder="Nhập mật khẩu"
                      value={addForm.password}
                      onChange={(e) => setAddForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl font-bold text-sm outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Xác nhận mật khẩu *</label>
                    <input
                      type="password"
                      required={addForm.authType === 'normal'}
                      placeholder="Xác nhận lại mật khẩu"
                      value={addForm.confirmPassword}
                      onChange={(e) => setAddForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl font-bold text-sm outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/10 transition-all scale-100 hover:scale-[1.01]"
                >
                  Xác nhận lưu
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* ========================================== */}
      {/* 2. MODAL: SỬA THÔNG TIN NGƯỜI DÙNG (EDIT)  */}
      {/* ========================================== */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="bg-indigo-100 p-2.5 rounded-2xl text-indigo-600">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Sửa thông tin tài khoản</h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">Cập nhật hồ sơ thành viên hệ thống.</p>
                </div>
              </div>
              <button 
                onClick={() => { playSound('click'); setShowEditModal(false); }}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center font-bold text-slate-400 hover:text-slate-600 transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              
              {/* Row 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Số điện thoại</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Email & Nickname */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Email (Không đổi được) *</label>
                  <input
                    type="email"
                    required
                    disabled
                    value={editForm.email}
                    className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 text-slate-400 rounded-xl font-bold text-sm outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Biệt danh / Nickname</label>
                  <input
                    type="text"
                    value={editForm.nickname}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Role & Grade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Vai trò hệ thống</label>
                  <select
                    value={editForm.role}
                    disabled={selectedUser.id === currentUser?.id}
                    onChange={(e) => {
                      const newRole = e.target.value as 'student' | 'teacher' | 'admin';
                      setEditForm(prev => ({ ...prev, role: newRole }));
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-sm outline-none transition-all ${
                      selectedUser.id === currentUser?.id
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-50 border-slate-200 focus:border-indigo-500 focus:bg-white'
                    }`}
                  >
                    <option value="student">Học sinh (Student)</option>
                    <option value="teacher">Giáo viên (Teacher)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
                
                {editForm.role === 'student' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Lớp học</label>
                    <select
                      value={editForm.grade}
                      onChange={(e) => setEditForm(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                    >
                      <option value="Lớp 6A1">Lớp 6A1</option>
                      <option value="Lớp 6A2">Lớp 6A2</option>
                      <option value="Lớp 7A1">Lớp 7A1</option>
                      <option value="Lớp 7A2">Lớp 7A2</option>
                      <option value="Lớp 8A1">Lớp 8A1</option>
                      <option value="Lớp 8A2">Lớp 8A2</option>
                      <option value="Lớp 9A1">Lớp 9A1</option>
                      <option value="Lớp 9B1">Lớp 9B1</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Nhiệm vụ quản lý</label>
                    <input
                      type="text"
                      disabled
                      value={editForm.role === 'admin' ? 'Quản lý toàn bộ hệ thống' : 'Quản lý giảng dạy lớp học'}
                      className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 text-slate-400 rounded-xl font-bold text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                )}
              </div>

              {/* Row 4: Status Active & Avatar Selector Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Trạng thái kích hoạt</label>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      disabled={selectedUser.id === currentUser?.id}
                      onClick={() => setEditForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`flex items-center gap-1.5 px-4 py-2.5 border-2 rounded-2xl font-bold text-xs shadow-sm transition-all w-full justify-center ${
                        selectedUser.id === currentUser?.id
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : editForm.isActive 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/50' 
                            : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100/50'
                      }`}
                    >
                      {editForm.isActive ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Đã kích hoạt</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Đang bị khóa / Chờ duyệt</span>
                        </>
                      )}
                    </button>
                    {selectedUser.id === currentUser?.id && (
                      <span className="text-[10px] text-slate-400 font-bold">* Không thể tự thay đổi trạng thái của chính bạn</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Chọn ảnh đại diện Emoji</label>
                  <div className="grid grid-cols-7 gap-1.5 max-w-[280px]">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, avatar: emoji }))}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-base hover:scale-110 active:scale-95 shadow-sm transition-all ${
                          editForm.avatar === emoji 
                            ? 'bg-indigo-50 border-indigo-600 scale-105' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/10 transition-all scale-100 hover:scale-[1.01]"
                >
                  Cập nhật thay đổi
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* ============================================== */}
      {/* 3. MODAL: ĐẶT LẠI MẬT KHẨU (RESET PASSWORD)    */}
      {/* ============================================== */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl border-2 border-slate-200 w-full max-w-md shadow-2xl animate-fade-in relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Đặt lại mật khẩu</h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">Đặt lại mật khẩu truy cập hệ thống.</p>
                </div>
              </div>
              <button 
                onClick={() => { playSound('click'); setShowResetModal(false); }}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center font-bold text-slate-400 hover:text-slate-600 transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4">
              
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs font-bold text-amber-800 space-y-1">
                <p>⚠️ Bạn đang đặt lại mật khẩu cho tài khoản:</p>
                <p className="font-extrabold text-slate-700">{selectedUser.name} ({selectedUser.email})</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu mới..."
                  value={resetForm.newPassword}
                  onChange={(e) => setResetForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới..."
                  value={resetForm.confirmPassword}
                  onChange={(e) => setResetForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-sm outline-none transition-all"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  Thay đổi mật khẩu
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* ============================================== */}
      {/* 4. MODAL: XÁC NHẬN XÓA TÀI KHOẢN (DELETE)     */}
      {/* ============================================== */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl border-2 border-slate-200 w-full max-w-md shadow-2xl animate-fade-in relative p-6 space-y-6">
            
            <div className="flex items-center gap-3 text-rose-600">
              <div className="bg-rose-100 p-3 rounded-2xl">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Xóa vĩnh viễn tài khoản?</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">Hành động này không thể hoàn tác!</p>
              </div>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 font-semibold text-sm text-slate-700 space-y-2">
              <p>Bạn có chắc chắn muốn xóa tài khoản của người dùng này?</p>
              <div className="border-t border-rose-100/50 pt-2 text-xs">
                <p className="font-black text-slate-800">{selectedUser.name}</p>
                <p className="text-slate-500 font-medium">Email: {selectedUser.email}</p>
                <p className="text-slate-500 font-medium">Vai trò: {selectedUser.role === 'admin' ? 'Quản trị viên' : selectedUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}</p>
              </div>
            </div>

            <p className="text-[11px] font-bold text-slate-400 leading-relaxed">
              * Mọi kết quả thực hành, tiến độ luyện gõ, chứng chỉ và lịch sử liên quan đến tài khoản này sẽ bị xóa sạch khỏi hệ thống.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { playSound('click'); setShowDeleteModal(false); setSelectedUser(null); }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-600/10 transition-all"
              >
                Đồng ý xóa
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
