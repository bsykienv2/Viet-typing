import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client sử dụng service_role key để có toàn quyền admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Kiểm tra Authorization Header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Không có quyền truy cập' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    // Xác thực token của người yêu cầu thông qua Supabase Auth
    const { data: { user: requester }, error: reqError } = await supabaseAdmin.auth.getUser(token);
    
    if (reqError || !requester) {
      return NextResponse.json({ success: false, error: 'Phiên làm việc hết hạn hoặc không hợp lệ' }, { status: 401 });
    }

    // 2. Truy vấn role của requester trong bảng profiles
    const { data: reqProfile, error: reqProfileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', requester.id)
      .single();

    if (reqProfileError || !reqProfile || reqProfile.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Chỉ Admin mới có quyền thực hiện hành động này' }, { status: 403 });
    }

    // 3. Phân loại hành động quản trị
    const body = await req.json();
    const { action, userId, updates, userData, newPassword } = body;

    // A. Thêm người dùng mới
    if (action === 'createUser') {
      const { email, password, name, phone, nickname, grade, role, avatar, isActive } = userData;
      
      // Tạo tài khoản trong auth.users
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) {
        return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
      }

      // Tạo hồ sơ tương ứng trong public.profiles
      const { error: profileError } = await supabaseAdmin.from('profiles').insert([
        {
          id: authData.user.id,
          name,
          email,
          phone,
          nickname: nickname || email.split('@')[0],
          grade: grade || 'Lớp 6',
          role: role || 'student',
          auth_type: 'normal',
          is_active: isActive !== undefined ? isActive : false,
          avatar: avatar || '🦊',
        }
      ]);

      if (profileError) {
        // Nếu tạo hồ sơ lỗi, dọn dẹp tài khoản auth.users để tránh rác database
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return NextResponse.json({ success: false, error: profileError.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    // B. Cập nhật thông tin tài khoản
    if (action === 'updateUser') {
      // Nếu Admin cập nhật thông tin email của auth.users
      if (updates.email) {
        const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          email: updates.email,
        });
        if (authUpdateError) {
          return NextResponse.json({ success: false, error: authUpdateError.message }, { status: 400 });
        }
      }

      // Cập nhật thông tin trong public.profiles
      const { error } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    // C. Xóa tài khoản người dùng
    if (action === 'deleteUser') {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    // D. Đặt lại mật khẩu
    if (action === 'resetPassword') {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Hành động không được hỗ trợ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
