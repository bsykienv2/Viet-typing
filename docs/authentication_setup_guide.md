# Hướng Dẫn Tích Hợp Xác Thực Email Thật & Google OAuth 2.0

Tài liệu này hướng dẫn bạn từng bước cấu hình **Xác thực qua Google OAuth 2.0** trên Google Cloud Console và thiết lập hệ thống **Gửi email thật** để xác thực đăng ký hoặc khôi phục mật khẩu cho ứng dụng học tập VietTyping.

---

## PHẦN 1: CẤU HÌNH GOOGLE OAUTH 2.0 (GOOGLE CLOUD CONSOLE)

Để nút đăng nhập bằng Google trên VietTyping hoạt động thực tế, bạn cần cấu hình dự án của mình trên Google Developer Console theo các bước sau:

### Bước 1: Tạo dự án (Project) mới trên Google Cloud
1. Truy cập trang quản trị [Google Cloud Console](https://console.cloud.google.com/).
2. Đăng nhập bằng tài khoản Google của bạn.
3. Ở thanh công cụ trên cùng, nhấn vào danh sách dự án hiện có và chọn **New Project** (Dự án mới).
4. Nhập tên dự án (Ví dụ: `VietTyping-App`) và nhấn **Create** (Tạo).

### Bước 2: Thiết lập OAuth Consent Screen (Màn hình đồng ý OAuth)
Trước khi tạo mã khóa xác thực, bạn phải cho Google biết ứng dụng của bạn sẽ hiển thị thông tin gì cho người dùng:
1. Tại menu bên trái, tìm và chọn **APIs & Services** > **OAuth consent screen**.
2. Chọn loại người dùng (**User Type**):
   * **External** (Ngoại vi): Cho phép bất kỳ tài khoản Gmail nào đăng nhập (Khuyên dùng cho ứng dụng học tập cộng đồng).
   * **Internal** (Nội bộ): Chỉ những tài khoản cùng tổ chức Google Workspace của bạn mới đăng nhập được.
   * Nhấn **Create**.
3. Điền thông tin cơ bản của ứng dụng:
   * **App name**: `VietTyping`
   * **User support email**: Email hỗ trợ của bạn (ví dụ: `support@viettyping.edu.vn`).
   * **Developer contact information**: Nhập địa chỉ email của bạn để nhận thông tin cập nhật từ Google.
   * Nhấn **Save and Continue** (Lưu và tiếp tục).
4. Phần **Scopes**: Giữ mặc định (mặc định Google đã chọn các quyền cơ bản như email, profile để lấy avatar, tên hiển thị). Nhấn **Save and Continue**.
5. Phần **Test users**: Nhập các địa chỉ email của bạn hoặc đồng nghiệp để thử nghiệm đăng nhập trước khi ứng dụng được phê duyệt công khai. Nhấn **Save and Continue** và quay lại Dashboard.

### Bước 3: Tạo mã xác thực Credentials (OAuth Client ID)
1. Chọn **APIs & Services** > **Credentials** ở menu bên trái.
2. Bấm vào nút **+ Create Credentials** (Tạo thông tin xác thực) > chọn **OAuth client ID**.
3. Chọn **Application type** là **Web application** (Ứng dụng Web).
4. Nhập tên nhận diện (Ví dụ: `VietTyping Web Client`).
5. Cấu hình các đường dẫn URI liên kết:
   * **Authorized JavaScript origins** (Nguồn gốc JavaScript được phép):
     * Cài đặt local: `http://localhost:3000`
     * Môi trường chạy thực tế (Ví dụ): `https://viettyping.edu.vn`
   * **Authorized redirect URIs** (URI chuyển hướng được cấp phép - Đường dẫn tiếp nhận kết quả đăng nhập sau khi xác thực):
     * Nếu bạn dùng NextAuth.js: `http://localhost:3000/api/auth/callback/google`
     * Nếu bạn tự xử lý gọi API: `http://localhost:3000/login`
6. Nhấn **Create** (Tạo). 
7. Một cửa sổ hiện lên chứa **Your Client ID** (Mã ứng dụng) và **Your Client Secret** (Mã bảo mật của khách). Hãy lưu chúng lại.

> [!IMPORTANT]
> **Your Client Secret** là thông tin tuyệt mật, tuyệt đối không được đưa lên GitHub hoặc để lộ ở phía Client.

---

## PHẦN 2: THIẾT LẬP ĐĂNG KÝ VÀ XÁC THỰC EMAIL THẬT

Hiện nay, hệ thống đăng ký tài khoản thường đang lưu trực tiếp mật khẩu dạng thuần và đồng bộ qua LocalStorage. Để kích hoạt luồng gửi mã OTP/link kích hoạt thật về hòm thư người dùng, bạn cần thực hiện theo các bước sau:

### Bước 1: Chọn và Đăng ký một dịch vụ gửi Mail (Mail Provider)
Để gửi email với tỷ lệ vào hộp thư chính (Inbox) cao thay vì hòm thư rác (Spam), bạn nên chọn các dịch vụ sau:
1. **Resend** (Khuyên dùng cho Next.js, miễn phí 3,000 email/tháng, thiết lập cực nhanh).
2. **SendGrid** hoặc **Mailgun** (Dành cho quy mô lớn).
3. **Gmail SMTP** (Thích hợp cho thử nghiệm nhỏ, cấu hình qua mật khẩu ứng dụng - App Password).

### Bước 2: Viết API Route gửi mail trong Next.js
Tạo một API Endpoint tại backend Next.js để thực hiện việc gửi email. Ví dụ dưới đây sử dụng dịch vụ **Resend**:

1. Cài đặt thư viện của Resend vào dự án:
   ```bash
   npm install resend
   ```

2. Tạo file API Route gửi email kích hoạt tại `src/app/api/send-activation/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server';
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function POST(request: Request) {
     try {
       const { email, name, activationLink } = await request.json();

       const data = await resend.emails.send({
         from: 'VietTyping <no-reply@viettyping.edu.vn>',
         to: [email],
         subject: 'Kích hoạt tài khoản Luyện gõ tiếng Việt của bạn! 🚀',
         html: `
           <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; rounded-corners: 12px;">
             <h2 style="color: #0284c7;">Chào mừng ${name} đến với VietTyping!</h2>
             <p>Tài khoản thường của bạn đã được khởi tạo thành công trên hệ thống.</p>
             <p>Vui lòng đợi Ban quản trị kích hoạt tài khoản, hoặc bạn có thể nhấp vào liên kết dưới đây để gửi yêu cầu phê duyệt nhanh nhất:</p>
             <a href="${activationLink}" style="display: inline-block; padding: 12px 24px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">
               Gửi Yêu Cầu Kích Hoạt
             </a>
             <p style="margin-top: 20px; font-size: 12px; color: #64748b;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
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

## PHẦN 3: CÁC LỰA CHỌN PHỔ BIẾN ĐỂ TÍCH HỢP OAUTH VÀ EMAIL THẬT

Thay vì phải tự viết backend và cơ sở dữ liệu để kiểm tra mật khẩu, kích hoạt tài khoản và xử lý đăng nhập Google, bạn nên sử dụng **02 giải pháp trọn gói** rất phổ biến dành cho Next.js dưới đây:

### Giải pháp A: Sử dụng Supabase Auth (Khuyên dùng)
Supabase cung cấp sẵn hệ thống PostgreSQL Database và Module Auth cực mạnh, miễn phí.
1. **Lợi ích**:
   * Có sẵn giao diện quản trị Admin để bật/tắt kích hoạt tài khoản chỉ bằng 1 nút nhấn.
   * Hỗ trợ gửi email xác nhận tài khoản tự động (Confirm email) bằng giao diện có sẵn.
   * Tích hợp đăng nhập Google chỉ bằng 2 dòng cấu hình Client ID/Secret trên bảng điều khiển Supabase.
2. **Các bước thực hiện**:
   * Cài đặt thư viện: `npm install @supabase/ssr @supabase/supabase-js`
   * Bật nhà cung cấp **Google** trong phần **Auth > Providers** trên Supabase Dashboard và dán mã Client ID/Secret nhận được từ Google Console ở Phần 1.

### Giải pháp B: Sử dụng NextAuth.js (Auth.js)
Đây là thư viện xác thực tiêu chuẩn ngành cho Next.js, xử lý phiên đăng nhập (Session) cực kỳ an toàn.
1. **Cài đặt thư viện**:
   ```bash
   npm install next-auth
   ```
2. **Cấu hình file API route**: Tạo file `src/app/api/auth/[...nextauth]/route.ts` để cấu hình:
   ```typescript
   import NextAuth from "next-auth";
   import GoogleProvider from "next-auth/providers/google";
   import CredentialsProvider from "next-auth/providers/credentials";

   const handler = NextAuth({
     providers: [
       GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID || "",
         clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
       }),
       CredentialsProvider({
         name: "Credentials",
         credentials: {
           email: { label: "Email", type: "text" },
           password: { label: "Password", type: "password" }
         },
         async authorize(credentials) {
           // Truy vấn cơ sở dữ liệu của bạn ở đây để kiểm tra người dùng
           // Xem tài khoản đã isActive chưa, nếu chưa: throw new Error("Chưa kích hoạt")
           return null;
         }
       })
     ],
     pages: {
       signIn: '/login',
     }
   });

   export { handler as GET, handler as POST };
   ```

---

## PHẦN 4: CẤU HÌNH BIẾN MÔI TRƯỜNG BẢO MẬT (.ENV.LOCAL)

Tạo hoặc cập nhật file `.env.local` ở thư mục gốc của dự án để lưu trữ các tham số bí mật:

```bash
# Cấu hình Google OAuth 2.0
NEXT_PUBLIC_GOOGLE_CLIENT_ID="nhap-client-id-cua-ban-o-day.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="nhap-client-secret-tuyet-mat-o-day"

# Cấu hình dịch vụ gửi Email (Ví dụ: Resend API Key)
RESEND_API_KEY="re_123456789abcde..."

# Đường dẫn URL của ứng dụng
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tao-mot-chuoi-ma-hoa-ngau-nhien-viet-typing-secret-key"
```

> [!WARNING]
> Đảm bảo file `.env.local` đã nằm trong danh sách loại trừ của file `.gitignore` để không bao giờ đẩy thông tin bảo mật này lên các repository công khai như GitHub.
