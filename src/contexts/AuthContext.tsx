"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useStudent } from "./StudentContext";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: "student" | "teacher" | "admin";
  authType: "google" | "normal";
  isActive: boolean;
  avatar: string;
  nickname: string;
  grade: string;
  createdAt: string;
  googleAvatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  allUsers: User[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: { name: string; phone: string; email: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; newPassword?: string; error?: string }>;
  adminCreateUser: (userData: Omit<User, "id" | "createdAt">) => Promise<{ success: boolean; error?: string }>;
  adminUpdateUser: (id: string, updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  adminDeleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;
  adminResetPassword: (id: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateStudentInfo, clearStudentInfo } = useStudent();

  // Tải danh sách tất cả hồ sơ người dùng (Dùng cho trang Admin)
  const loadAllUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi khi tải danh sách người dùng từ profiles:", error.message);
        return;
      }

      if (data) {
        const formattedUsers: User[] = data.map((u: any) => ({
          id: u.id,
          name: u.name,
          phone: u.phone || "",
          email: u.email || "",
          role: u.role as "student" | "teacher" | "admin",
          authType: u.auth_type as "google" | "normal",
          isActive: u.is_active,
          avatar: u.avatar || "🦊",
          nickname: u.nickname || "",
          grade: u.grade || "Lớp 6",
          createdAt: u.created_at,
        }));
        setAllUsers(formattedUsers);
      }
    } catch (err) {
      console.error("Lỗi hệ thống khi tải danh sách người dùng:", err);
    }
  }, []);

  // Xử lý thông tin session người dùng từ auth.users và public.profiles
  const handleUserSession = useCallback(async (authUser: any) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error || !profile) {
        console.error("Không tìm thấy profile cho user:", authUser.email, error);
        setUser(null);
        return;
      }

      // Nếu tài khoản chưa kích hoạt, đăng xuất ngay
      if (!profile.is_active) {
        await supabase.auth.signOut();
        setUser(null);
        clearStudentInfo();
        return;
      }

      const formattedUser: User = {
        id: profile.id,
        name: profile.name,
        phone: profile.phone || "",
        email: authUser.email || profile.email || "",
        role: profile.role as "student" | "teacher" | "admin",
        authType: profile.auth_type as "google" | "normal",
        isActive: profile.is_active,
        avatar: profile.avatar || "🦊",
        nickname: profile.nickname || "",
        grade: profile.grade || "Lớp 6",
        createdAt: profile.created_at,
        googleAvatarUrl: authUser.user_metadata?.avatar_url || authUser.raw_user_meta_data?.avatar_url || undefined,
      };

      setUser(formattedUser);

      // Đồng bộ sang StudentContext nếu là học sinh
      if (formattedUser.role === "student") {
        updateStudentInfo({
          name: formattedUser.name,
          nickname: formattedUser.nickname,
          grade: formattedUser.grade,
          avatar: formattedUser.avatar,
        });
      }
    } catch (err) {
      console.error("Lỗi khi xử lý phiên người dùng:", err);
      setUser(null);
    }
  }, [clearStudentInfo, updateStudentInfo]);

  // Đăng ký nhận sự kiện thay đổi trạng thái đăng nhập từ Supabase Auth
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const initAuth = async () => {
      try {
        setIsLoading(true);
        // Lấy session hiện tại khi bắt đầu chạy app
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await handleUserSession(session.user);
        } else {
          setUser(null);
        }

        // Lắng nghe sự kiện đăng nhập/đăng xuất thay đổi
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (currentSession?.user) {
            await handleUserSession(currentSession.user);
          } else {
            setUser(null);
            clearStudentInfo();
          }
        });

        unsubscribe = () => {
          subscription.unsubscribe();
        };

        // Tải danh sách người dùng cho trang Admin
        await loadAllUsers();
      } catch (err) {
        console.error("Lỗi khởi tạo hệ thống xác thực:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      unsubscribe();
    };
  }, [handleUserSession, loadAllUsers, clearStudentInfo]);

  // Đăng nhập tài khoản thường (Email / Password)
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: "Đăng nhập không thành công. Vui lòng thử lại." };
      }

      // Truy vấn profile để kiểm tra xem tài khoản đã được kích hoạt chưa
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        return { success: false, error: "Không tìm thấy hồ sơ của bạn trên hệ thống!" };
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: "Tài khoản của bạn đang chờ phê duyệt. Vui lòng liên hệ Admin/Giáo viên để kích hoạt!" 
        };
      }

      await handleUserSession(authData.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi hệ thống!" };
    } finally {
      setIsLoading(false);
    }
  }, [handleUserSession]);

  // Đăng nhập bằng Google (Thật)
  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/typing`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi hệ thống khi gọi Google Auth!" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Đăng ký tài khoản thường (Họ tên, SĐT, Email, Mật khẩu)
  const signup = useCallback(async (userData: { name: string; phone: string; email: string; password?: string }) => {
    try {
      setIsLoading(true);
      if (!userData.password) {
        return { success: false, error: "Mật khẩu là bắt buộc!" };
      }

      // 1. Tạo tài khoản trong auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: "Đăng ký không thành công. Vui lòng thử lại." };
      }

      // 2. Chèn thông tin hồ sơ vào bảng profiles
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          nickname: userData.email.split("@")[0],
          grade: "Lớp 6",
          role: "student",
          auth_type: "normal",
          is_active: false, // Mặc định Đăng ký thường luôn là Chờ kích hoạt
          avatar: "🦊",
        }
      ]);

      if (profileError) {
        console.error("Lỗi tạo hồ sơ bổ sung:", profileError.message);
        // Đăng xuất ngay để giữ sạch DB
        await supabase.auth.signOut();
        return { success: false, error: "Có lỗi khi lưu thông tin hồ sơ bổ sung!" };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi hệ thống!" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Đăng xuất
  const logout = useCallback(() => {
    supabase.auth.signOut().then(() => {
      setUser(null);
      clearStudentInfo();
    });
  }, [clearStudentInfo]);

  // Đổi mật khẩu cá nhân
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      // Supabase cho phép trực tiếp cập nhật mật khẩu phiên đang đăng nhập
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi đổi mật khẩu!" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Quên mật khẩu: Trả về thông báo liên hệ admin
  const resetPassword = useCallback(async (email: string) => {
    return { 
      success: false, 
      error: "Tính năng khôi phục qua Email tạm khóa. Vui lòng liên hệ trực tiếp Admin để được cấp lại mật khẩu mới!" 
    };
  }, []);

  // ==========================================
  // CÁC CHỨC NĂNG QUẢN TRỊ VIÊN (GỌI API ROUTE BẢO MẬT)
  // ==========================================

  // Lấy access token hiện tại để đưa vào Authorization Header
  const getAdminAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.access_token || ""}`,
    };
  };

  // Admin thêm người dùng mới
  const adminCreateUser = useCallback(async (userData: Omit<User, "id" | "createdAt">) => {
    try {
      setIsLoading(true);
      const headers = await getAdminAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers,
        body: JSON.stringify({
          action: "createUser",
          userData: {
            email: userData.email,
            password: userData.password || "student123",
            name: userData.name,
            phone: userData.phone,
            nickname: userData.nickname,
            grade: userData.grade,
            role: userData.role,
            avatar: userData.avatar,
            isActive: userData.isActive,
          },
        }),
      });

      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error };
      }

      await loadAllUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi tạo tài khoản admin!" };
    } finally {
      setIsLoading(false);
    }
  }, [loadAllUsers]);

  // Admin cập nhật thông tin người dùng
  const adminUpdateUser = useCallback(async (id: string, updates: Partial<User>) => {
    try {
      setIsLoading(true);
      const headers = await getAdminAuthHeaders();
      
      // Chuyển đổi keys tương thích database
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.nickname !== undefined) dbUpdates.nickname = updates.nickname;
      if (updates.grade !== undefined) dbUpdates.grade = updates.grade;
      if (updates.role !== undefined) dbUpdates.role = updates.role;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
      if (updates.email !== undefined) dbUpdates.email = updates.email;

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers,
        body: JSON.stringify({
          action: "updateUser",
          userId: id,
          updates: dbUpdates,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error };
      }

      await loadAllUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi cập nhật!" };
    } finally {
      setIsLoading(false);
    }
  }, [loadAllUsers]);

  // Admin xóa tài khoản
  const adminDeleteUser = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const headers = await getAdminAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers,
        body: JSON.stringify({
          action: "deleteUser",
          userId: id,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error };
      }

      await loadAllUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi xóa tài khoản!" };
    } finally {
      setIsLoading(false);
    }
  }, [loadAllUsers]);

  // Admin đặt lại mật khẩu cho bất kỳ ai
  const adminResetPassword = useCallback(async (id: string, newPassword: string) => {
    try {
      setIsLoading(true);
      const headers = await getAdminAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers,
        body: JSON.stringify({
          action: "resetPassword",
          userId: id,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error };
      }

      await loadAllUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi đặt lại mật khẩu!" };
    } finally {
      setIsLoading(false);
    }
  }, [loadAllUsers]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        allUsers,
        login,
        loginWithGoogle,
        signup,
        logout,
        changePassword,
        resetPassword,
        adminCreateUser,
        adminUpdateUser,
        adminDeleteUser,
        adminResetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
