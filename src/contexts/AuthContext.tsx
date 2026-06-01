"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useStudent } from "./StudentContext";

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
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  allUsers: User[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email: string, name: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
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

const USERS_STORAGE_KEY = "viettyping_users_db";
const SESSION_STORAGE_KEY = "viettyping_current_session";

// Hàng đợi hạt giống (Seed data) cho hệ thống nếu chưa có dữ liệu trong LocalStorage
const DEFAULT_USERS: User[] = [
  {
    id: "admin-1",
    name: "Quản trị viên Hệ thống",
    phone: "0901234567",
    email: "admin@viettyping.edu.vn",
    password: "admin123", // Mật khẩu thuần cho dev/demo
    role: "admin",
    authType: "normal",
    isActive: true,
    avatar: "👑",
    nickname: "Admin",
    grade: "Tất cả",
    createdAt: new Date().toISOString()
  },
  {
    id: "teacher-1",
    name: "Cô Nguyễn Hồng",
    phone: "0912345678",
    email: "giao-vien@viettyping.edu.vn",
    password: "teacher123",
    role: "teacher",
    authType: "normal",
    isActive: true,
    avatar: "👩‍🏫",
    nickname: "CoHong",
    grade: "Lớp 8A1",
    createdAt: new Date().toISOString()
  },
  {
    id: "student-1",
    name: "Nguyễn Hoàng Nam",
    phone: "0987654321",
    email: "nam.nguyen@viettyping.edu.vn",
    password: "student123",
    role: "student",
    authType: "normal",
    isActive: true,
    avatar: "💻",
    nickname: "NamSpeed",
    grade: "Lớp 8A1",
    createdAt: new Date().toISOString()
  },
  {
    id: "student-2",
    name: "Lê Mai Anh",
    phone: "0934567890",
    email: "maianh@viettyping.edu.vn",
    password: "student123",
    role: "student",
    authType: "normal",
    isActive: true,
    avatar: "🦊",
    nickname: "Clover",
    grade: "Lớp 8A1",
    createdAt: new Date().toISOString()
  },
  {
    id: "student-3",
    name: "Trần Minh Đức",
    phone: "0976543210",
    email: "minhduc@viettyping.edu.vn",
    password: "student123",
    role: "student",
    authType: "normal",
    isActive: true,
    avatar: "🤖",
    nickname: "RexTypist",
    grade: "Lớp 8A2",
    createdAt: new Date().toISOString()
  },
  {
    id: "student-4",
    name: "Phạm Thảo Linh",
    phone: "0945678901",
    email: "thaolinh@viettyping.edu.vn",
    password: "student123",
    role: "student",
    authType: "normal",
    isActive: false, // Tài khoản mẫu chờ phê duyệt
    avatar: "🎧",
    nickname: "LinhCute",
    grade: "Lớp 7A3",
    createdAt: new Date().toISOString()
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateStudentInfo, clearStudentInfo } = useStudent();

  // Đọc dữ liệu từ localStorage khi mount
  useEffect(() => {
    try {
      // 1. Đọc database người dùng
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedUsers) {
        setAllUsers(JSON.parse(savedUsers));
      } else {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        setAllUsers(DEFAULT_USERS);
      }

      // 2. Đọc phiên đăng nhập hiện tại
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      }
    } catch (err) {
      console.error("Lỗi khi đồng bộ Auth từ localStorage:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hàm helper cập nhật cơ sở dữ liệu users và đồng bộ state
  const syncUsersDb = useCallback((updatedUsers: User[]) => {
    setAllUsers(updatedUsers);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    } catch (err) {
      console.error("Không thể ghi danh sách người dùng vào localStorage:", err);
    }
  }, []);

  // Đăng nhập tài khoản thường (Email / Password)
  const login = useCallback(async (email: string, password: string) => {
    // Trì hoãn nhẹ mô phỏng gọi API
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.authType === "normal"
    );

    if (!foundUser) {
      return { success: false, error: "Email đăng nhập không tồn tại!" };
    }

    if (foundUser.password !== password) {
      return { success: false, error: "Mật khẩu không chính xác!" };
    }

    if (!foundUser.isActive) {
      return { success: false, error: "Tài khoản chưa được kích hoạt bởi Admin!" };
    }

    // Đăng nhập thành công
    setUser(foundUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(foundUser));

    // Đồng bộ sang StudentContext nếu là học sinh
    if (foundUser.role === "student") {
      updateStudentInfo({
        name: foundUser.name,
        nickname: foundUser.nickname,
        grade: foundUser.grade,
        avatar: foundUser.avatar,
      });
    }

    return { success: true };
  }, [allUsers, updateStudentInfo]);

  // Đăng nhập bằng Google
  const loginWithGoogle = useCallback(async (email: string, name: string, avatar: string = "🦊") => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let foundUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.authType === "google"
    );

    // Nếu chưa đăng ký bằng Google trước đó, tự tạo tài khoản Google mới
    if (!foundUser) {
      const emailPrefix = email.split("@")[0];
      const newUser: User = {
        id: `google-${Math.random().toString(36).substring(2, 9)}`,
        name,
        phone: "",
        email,
        role: "student",
        authType: "google",
        isActive: true, // Google login tự động kích hoạt, không cần phê duyệt
        avatar,
        nickname: emailPrefix,
        grade: "Lớp 6",
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...allUsers, newUser];
      syncUsersDb(updatedUsers);
      foundUser = newUser;
    }

    // Đăng nhập thành công
    setUser(foundUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(foundUser));

    // Đồng bộ sang StudentContext nếu là học sinh
    if (foundUser.role === "student") {
      updateStudentInfo({
        name: foundUser.name,
        nickname: foundUser.nickname,
        grade: foundUser.grade,
        avatar: foundUser.avatar,
      });
    }

    return { success: true };
  }, [allUsers, syncUsersDb, updateStudentInfo]);

  // Đăng ký tài khoản thường (Họ tên, SĐT, Email, Mật khẩu)
  const signup = useCallback(async (userData: { name: string; phone: string; email: string; password?: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const emailExists = allUsers.some(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (emailExists) {
      return { success: false, error: "Email này đã được sử dụng!" };
    }

    const emailPrefix = userData.email.split("@")[0];
    const newUser: User = {
      id: `normal-${Math.random().toString(36).substring(2, 9)}`,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
      role: "student",
      authType: "normal",
      isActive: false, // BẮT BUỘC ADMIN KÍCH HOẠT
      avatar: "🦊",
      nickname: emailPrefix,
      grade: "Lớp 6",
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...allUsers, newUser];
    syncUsersDb(updatedUsers);

    return { success: true };
  }, [allUsers, syncUsersDb]);

  // Đăng xuất
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    clearStudentInfo();
  }, [clearStudentInfo]);

  // Đổi mật khẩu tự phục vụ
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!user) {
      return { success: false, error: "Bạn chưa đăng nhập!" };
    }

    if (user.authType === "google") {
      return { success: false, error: "Tài khoản liên kết Google không sử dụng mật khẩu!" };
    }

    if (user.password !== currentPassword) {
      return { success: false, error: "Mật khẩu hiện tại không đúng!" };
    }

    // Cập nhật trong database
    const updatedUsers = allUsers.map((u) =>
      u.id === user.id ? { ...u, password: newPassword } : u
    );
    syncUsersDb(updatedUsers);

    // Cập nhật session hiện tại
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

    return { success: true };
  }, [user, allUsers, syncUsersDb]);

  // Quên mật khẩu: Sinh mật khẩu ngẫu nhiên và gửi về email
  const resetPassword = useCallback(async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundIndex = allUsers.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.authType === "normal"
    );

    if (foundIndex === -1) {
      return { success: false, error: "Không tìm thấy tài khoản thường đăng ký với email này!" };
    }

    // Tạo mật khẩu ngẫu nhiên có độ dài 8 chữ số/chữ cái dễ nhớ
    const newPassword = `VT-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedUsers = [...allUsers];
    updatedUsers[foundIndex] = {
      ...updatedUsers[foundIndex],
      password: newPassword,
    };
    
    syncUsersDb(updatedUsers);

    // Nếu người dùng hiện tại đang đăng nhập là chính user đó (trường hợp hiếm hoi quên pass khi đang ở trong app)
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      const updatedSession = { ...user, password: newPassword };
      setUser(updatedSession);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
    }

    return { success: true, newPassword };
  }, [allUsers, syncUsersDb, user]);

  // ==========================================
  // CÁC CHỨC NĂNG QUẢN TRỊ VIÊN (ADMIN CRUD)
  // ==========================================

  // Admin thêm người dùng mới
  const adminCreateUser = useCallback(async (userData: Omit<User, "id" | "createdAt">) => {
    const emailExists = allUsers.some(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (emailExists) {
      return { success: false, error: "Email này đã tồn tại trên hệ thống!" };
    }

    const newUser: User = {
      ...userData,
      id: `${userData.authType === "google" ? "google" : "normal"}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...allUsers, newUser];
    syncUsersDb(updatedUsers);
    return { success: true };
  }, [allUsers, syncUsersDb]);

  // Admin cập nhật thông tin người dùng
  const adminUpdateUser = useCallback(async (id: string, updates: Partial<User>) => {
    const emailExists = allUsers.some(
      (u) => u.id !== id && updates.email && u.email.toLowerCase() === updates.email.toLowerCase()
    );

    if (emailExists) {
      return { success: false, error: "Email cập nhật đã trùng với tài khoản khác!" };
    }

    const updatedUsers = allUsers.map((u) => {
      if (u.id === id) {
        const updated = { ...u, ...updates };
        // Nếu là phiên đăng nhập hiện tại thì cập nhật luôn session
        if (user && user.id === id) {
          setUser(updated);
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
        }
        return updated;
      }
      return u;
    });

    syncUsersDb(updatedUsers);
    return { success: true };
  }, [allUsers, syncUsersDb, user]);

  // Admin xóa tài khoản
  const adminDeleteUser = useCallback(async (id: string) => {
    if (user && user.id === id) {
      return { success: false, error: "Bạn không thể tự xóa tài khoản của chính mình!" };
    }

    const updatedUsers = allUsers.filter((u) => u.id !== id);
    syncUsersDb(updatedUsers);
    return { success: true };
  }, [allUsers, syncUsersDb, user]);

  // Admin đặt lại mật khẩu cho bất kỳ ai
  const adminResetPassword = useCallback(async (id: string, newPassword: string) => {
    const updatedUsers = allUsers.map((u) => {
      if (u.id === id) {
        const updated = { ...u, password: newPassword };
        if (user && user.id === id) {
          setUser(updated);
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
        }
        return updated;
      }
      return u;
    });

    syncUsersDb(updatedUsers);
    return { success: true };
  }, [allUsers, syncUsersDb, user]);

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
