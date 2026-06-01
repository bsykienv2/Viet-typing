# Hướng Dẫn Chi Tiết Cấu Hình Dịch Vụ Gửi Email Bằng Resend

Vì bạn đã đăng ký tài khoản trên **Resend**, dưới đây là tài liệu hướng dẫn chi tiết từng bước để lấy khóa API, cấu hình tên miền gửi mail và cài đặt tính năng gửi email thật trong ứng dụng Next.js của bạn.

---

## BƯỚC 1: LẤY API KEY TỪ RESEND
1. Truy cập vào [resend.com/overview](https://resend.com/overview) và đăng nhập vào tài khoản của bạn.
2. Tại thanh menu bên trái, chọn **API Keys**.
3. Bấm vào nút **Create API Key**.
4. Thiết lập thông số:
   * **Name**: Đặt tên gợi nhớ (Ví dụ: `VietTyping-Key`).
   * **Permission**: Chọn **Full Access** hoặc **Sending Access**.
   * **Domain**: Chọn *All domains* (hoặc chọn cụ thể tên miền của bạn nếu đã xác thực ở Bước 2).
5. Bấm **Add** để tạo.
6. **Sao chép mã API Key** hiển thị trên màn hình (Có dạng `re_...`). *Lưu ý: Mã này chỉ hiển thị duy nhất một lần.*

---

## BƯỚC 2: CẤU HÌNH TÊN MIỀN GỬI MAIL (DOMAIN VERIFICATION)
Mặc định, tài khoản Resend mới tạo chỉ cho phép gửi email kiểm thử đến chính địa chỉ email đăng ký của bạn thông qua địa chỉ gửi là `onboarding@resend.dev`. 

Để gửi được email cho toàn bộ học sinh bằng địa chỉ chuyên nghiệp (ví dụ: `lienhe@tenmien-cuaban.com`), bạn cần xác thực tên miền của mình:
1. Tại menu bên trái Resend Dashboard, chọn **Domains**.
2. Bấm **Add Domain**.
3. Nhập tên miền của bạn (Ví dụ: `viettyping.edu.vn`) và chọn khu vực (Region) gần nhất rồi bấm **Add**.
4. Resend sẽ hiển thị danh sách các bản ghi DNS gồm **DKIM**, **SPF**, và **MX/TXT**:
   * Hãy truy cập vào trang quản lý tên miền của bạn (ví dụ: Cloudflare, Mắt Bão, Pavietnam, GoDaddy, v.v.).
   * Thêm các bản ghi tương ứng vào cấu hình DNS của tên miền.
5. Quay lại Resend và bấm **Verify**. Khi trạng thái chuyển sang màu xanh lá **Verified**, bạn đã có thể gửi mail từ bất kỳ địa chỉ nào dưới tên miền của mình.

---

## BƯỚC 3: CÀI ĐẶT THƯ VIỆN & CẤU HÌNH BIẾN MÔI TRƯỜNG

1. Mở terminal tại thư mục dự án và cài đặt thư viện chính thức của Resend:
   ```bash
   npm install resend
   ```

2. Cập nhật khóa API vào file `.env.local` ở thư mục gốc dự án:
   ```env
   RESEND_API_KEY="re_sdsD234...nhập_mã_key_của_bạn_ở_đây"
   ```

---

## BƯỚC 4: VIẾT API ROUTES GỬI MAIL THẬT TRONG NEXT.JS

Dưới đây là 2 API routes thực tế để xử lý: **Kích hoạt tài khoản** và **Khôi phục mật khẩu**.

### 1. API Route Gửi Mail Kích Hoạt Tài Khoản (`src/app/api/auth/send-activation/route.ts`)
Khi học sinh đăng ký tài khoản thường thành công, hệ thống sẽ tự động gọi API này gửi mail cho học sinh để thông báo tài khoản đang chờ kích hoạt.

Tạo file mới tại đường dẫn trên và dán đoạn mã sau:
```typescript
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ success: false, error: "Thiếu Email hoặc Họ tên!" }, { status: 400 });
    }

    // Nếu chưa xác thực tên miền ở Bước 2, bạn phải đổi từ thành 'onboarding@resend.dev' 
    // và chỉ gửi được đến chính địa chỉ email đăng ký Resend của bạn để test.
    const sender = process.env.NODE_ENV === 'production' 
      ? 'VietTyping <no-reply@viettyping.edu.vn>' // Địa chỉ email thật
      : 'VietTyping Test <onboarding@resend.dev>'; // Dành cho chạy thử local

    const data = await resend.emails.send({
      from: sender,
      to: [email],
      subject: 'Tài khoản Luyện gõ tiếng Việt của bạn đang chờ kích hoạt! ⏳',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 50px;">🚀</span>
          </div>
          <h2 style="color: #0284c7; text-align: center; margin-bottom: 24px;">Chúc mừng đăng ký thành công!</h2>
          <p>Xin chào <strong>${name}</strong>,</p>
          <p>Tài khoản học sinh của bạn đã được đăng ký thành công trên hệ thống **VietTyping**.</p>
          <p style="padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; color: #78350f; border-radius: 8px;">
            🔒 <strong>Trạng thái: Chờ kích hoạt.</strong><br/>
            Tài khoản thường cần được Ban quản trị hoặc Giáo viên của bạn phê duyệt kích hoạt trước khi có thể đăng nhập luyện tập. Vui lòng liên hệ với thầy cô của bạn để phê duyệt nhanh nhất!
          </p>
          <p style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 13px; color: #64748b; text-align: center;">
            Hệ thống luyện gõ tiếng Việt thông minh - VietTyping
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

---

### 2. API Route Gửi Mật Khẩu Mới (`src/app/api/auth/reset-password-mail/route.ts`)
Khi người dùng bấm **Quên mật khẩu**, backend tạo mật khẩu mới và gọi API này để gửi mật khẩu mới về hòm thư của học sinh.

Tạo file mới tại đường dẫn trên:
```typescript
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ success: false, error: "Thiếu Email hoặc Mật khẩu mới!" }, { status: 400 });
    }

    const sender = process.env.NODE_ENV === 'production' 
      ? 'VietTyping Security <security@viettyping.edu.vn>'
      : 'VietTyping Test <onboarding@resend.dev>';

    const data = await resend.emails.send({
      from: sender,
      to: [email],
      subject: 'Yêu cầu khôi phục mật khẩu tài khoản VietTyping! 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 50px;">🔐</span>
          </div>
          <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">Khôi phục mật khẩu thành công!</h2>
          <p>Xin chào <strong>${name || 'học sinh'}</strong>,</p>
          <p>Hệ thống vừa nhận được yêu cầu khôi phục mật khẩu tài khoản của bạn.</p>
          <div style="padding: 20px; background-color: #f3f4f6; border-radius: 12px; text-align: center; margin: 24px 0;">
            <span style="font-size: 14px; color: #4b5563; display: block; margin-bottom: 8px;">Mật khẩu mới của bạn là:</span>
            <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #1f2937; letter-spacing: 2px;">${newPassword}</span>
          </div>
          <p style="color: #dc2626; font-size: 13px; font-weight: bold;">
            ⚠️ Lưu ý bảo mật: Hãy đăng nhập ngay lập tức và đổi lại mật khẩu cá nhân tại phần quản lý hồ sơ để đảm bảo an toàn cho tài khoản.
          </p>
          <p style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 13px; color: #64748b; text-align: center;">
            Đây là email tự động từ hệ thống bảo mật VietTyping.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

---

## BƯỚC 5: CẬP NHẬT TRONG LOGIC SIGNUP / FORGOT PASSWORD FRONTEND

Bây giờ, tại file `src/contexts/AuthContext.tsx`, bạn chỉ cần gọi API này khi thực hiện đăng ký hoặc quên mật khẩu:

### Cập nhật hàm `signup` để gọi API gửi email:
```typescript
// Trong src/contexts/AuthContext.tsx
const signup = useCallback(async (userData: { name: string; phone: string; email: string; password?: string }) => {
  // 1. Gọi logic đăng ký lưu vào DB/LocalStorage của bạn
  // ... (giữ nguyên logic kiểm tra và lưu tài khoản cũ)

  // 2. Gọi API Route gửi email kích hoạt của Resend
  try {
    await fetch("/api/auth/send-activation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name
      })
    });
  } catch (e) {
    console.error("Gửi email kích hoạt thất bại nhưng tài khoản vẫn được đăng ký trên hệ thống:", e);
  }

  return { success: true };
}, [allUsers, syncUsersDb]);
```

### Cập nhật hàm `resetPassword` để gửi email chứa mật khẩu mới:
```typescript
// Trong src/contexts/AuthContext.tsx
const resetPassword = useCallback(async (email: string) => {
  // 1. Tạo mật khẩu mới ngẫu nhiên và lưu vào DB
  // ... (giữ nguyên logic sinh mật khẩu mới cũ)

  // 2. Gọi API Route gửi mật khẩu mới qua email cho học sinh
  try {
    await fetch("/api/auth/reset-password-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        name: foundUser.name,
        newPassword: newPassword
      })
    });
  } catch (e) {
    console.error("Không thể gửi mật khẩu mới qua email:", e);
  }

  return { success: true };
}, [allUsers, syncUsersDb]);
```
