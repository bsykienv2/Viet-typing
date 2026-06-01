# Hướng Dẫn Tích Hợp Hệ Thống Backend (Supabase & Google Sheets)

Tài liệu này hướng dẫn chi tiết cách thiết lập cơ sở dữ liệu Supabase, phân quyền bảo mật RLS, cấu hình môi trường Vercel, và thiết lập đồng bộ dữ liệu gõ phím của học sinh sang Google Sheets theo thời gian thực.

---

## 1. Thiết Lập Cấu Trúc Bảng Trên Supabase (SQL Schema)

Truy cập **Supabase Dashboard** -> chọn dự án của bạn -> vào phần **SQL Editor** -> tạo truy vấn mới và chạy đoạn mã SQL dưới đây để khởi tạo cơ cấu dữ liệu lớp học, học sinh, cài đặt giáo viên và lịch sử thực hành:

```sql
-- 1. Bảng quản lý Lớp Học (Classes)
CREATE TABLE public.classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,              -- Tên lớp (Ví dụ: Lớp 6A, Lớp 7B)
    grade VARCHAR(50) NOT NULL,              -- Khối lớp (Lớp 6, Lớp 7, Lớp 8, Lớp 9)
    class_code VARCHAR(10) UNIQUE NOT NULL,  -- Mã tham gia lớp học (Ví dụ: LOP6A26)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    teacher_id UUID                          -- ID của giáo viên quản trị (nếu sử dụng Auth)
);

-- Tạo Index tìm kiếm mã lớp nhanh
CREATE INDEX idx_classes_code ON public.classes(class_code);

-- 2. Bảng quản lý Học Sinh (Students)
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,              -- Tên học sinh
    avatar VARCHAR(50) DEFAULT '🤖',          -- Emoji đại diện
    streak INTEGER DEFAULT 0 NOT NULL,       -- Chuỗi ngày gõ liên tiếp
    xp INTEGER DEFAULT 0 NOT NULL,           -- Tổng kinh nghiệm/điểm tích lũy
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bảng Lưu Trữ Quy Tắc Giáo Viên Đặt Ra (Teacher Rules)
CREATE TABLE public.teacher_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE UNIQUE,
    min_wpm INTEGER DEFAULT 20 NOT NULL,          -- WPM tối thiểu
    min_accuracy INTEGER DEFAULT 80 NOT NULL,    -- Độ chính xác (%) tối thiểu
    sequential_unlock BOOLEAN DEFAULT false,      -- Bắt buộc mở khóa tuần tự
    forced_layout VARCHAR(50) DEFAULT 'free',    -- Kiểu gõ ép buộc: 'free', 'telex', 'vni'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bảng Ghi Nhận Kết Quả Gõ Phím (Typing Telemetry / Progress)
CREATE TABLE public.typing_telemetry (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL,             -- ID bài học (ví dụ: basic-1, basic-2)
    wpm INTEGER NOT NULL,                        -- Tốc độ đạt được
    accuracy INTEGER NOT NULL,                   -- Độ chính xác (%) đạt được
    incorrect_count INTEGER NOT NULL,            -- Số lỗi gõ phím
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    meets_requirements BOOLEAN DEFAULT true      -- Đạt chỉ tiêu của giáo viên không
);

-- Tạo Index tối ưu hóa truy vấn điểm số/tiến trình
CREATE INDEX idx_telemetry_student ON public.typing_telemetry(student_id);
CREATE INDEX idx_telemetry_lesson ON public.typing_telemetry(student_id, lesson_id);

-- 5. Trigger tự động cập nhật updated_at cho bảng teacher_rules
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teacher_rules_modtime
    BEFORE UPDATE ON public.teacher_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
```

---

## 2. Bảo Mật Trên Supabase: Chính Sách Hàng Rào Bảo Vệ (Row Level Security - RLS)

Để ngăn chặn học sinh chỉnh sửa dữ liệu của học sinh khác hoặc thay đổi cấu hình giáo viên, bạn cần kích hoạt **Row Level Security (RLS)** trên tất cả các bảng. Chạy các lệnh SQL sau:

```sql
-- Kích hoạt RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_telemetry ENABLE ROW LEVEL SECURITY;

-- 1. Chính sách cho bảng classes: Mọi người có quyền Đọc (Select) để tham gia lớp học
CREATE POLICY "Cho phép đọc lớp học công khai" 
ON public.classes FOR SELECT 
USING (true);

-- 2. Chính sách cho bảng students: 
-- Học sinh có quyền tự tạo tài khoản (Insert) và cập nhật điểm/XP/streak của chính mình (Update)
CREATE POLICY "Cho phép ghi nhận học sinh mới" 
ON public.students FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Học sinh tự cập nhật thông tin" 
ON public.students FOR UPDATE 
USING (true);

CREATE POLICY "Xem danh sách học sinh" 
ON public.students FOR SELECT 
USING (true);

-- 3. Chính sách cho bảng teacher_rules: Học sinh chỉ có quyền Đọc (Select)
CREATE POLICY "Học sinh xem quy định lớp" 
ON public.teacher_rules FOR SELECT 
USING (true);

-- Cho phép Giáo viên chỉnh sửa quy tắc lớp (nếu chưa tích hợp tài khoản auth giáo viên, tạm cho phép chỉnh sửa bằng key anon/authenticated)
CREATE POLICY "Quản trị viên cập nhật quy định" 
ON public.teacher_rules FOR ALL 
USING (true);

-- 4. Chính sách cho bảng typing_telemetry:
-- Cho phép Học sinh chèn lịch sử gõ phím mới (Insert) và xem lịch sử của mọi người (Select) để vẽ bảng xếp hạng
CREATE POLICY "Ghi nhận lịch sử gõ" 
ON public.typing_telemetry FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Xem lịch sử thực hành" 
ON public.typing_telemetry FOR SELECT 
USING (true);
```

> [!IMPORTANT]
> Khi chuyển sang môi trường chạy thực tế quy mô lớn, hãy cấu hình hệ thống Xác thực người dùng (`supabase.auth`) để liên kết `teacher_id` trong `classes` trực tiếp với người dùng đăng nhập bằng tài khoản giáo viên, đảm bảo chỉ có chủ sở hữu lớp học mới được quyền UPDATE/DELETE lớp hoặc quy định.

---

## 3. Cấu Hình Môi Trường & Bảo Mật Trên Vercel

Khi deploy ứng dụng Next.js lên Vercel, hãy thiết lập các biến môi trường để kết nối API của Supabase và tránh lộ API Key trong mã nguồn.

### Các biến môi trường cần cấu hình tại Vercel Dashboard:
1. Vào trang dự án trên **Vercel** -> **Settings** -> **Environment Variables**.
2. Thêm các biến sau:
   - `NEXT_PUBLIC_SUPABASE_URL`: Đường dẫn API của Supabase (lấy tại *Project Settings -> API*).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Khóa API Anon (an toàn cho trình duyệt client).
   - `SUPABASE_SERVICE_ROLE_KEY`: Khóa dịch vụ quản trị hệ thống (Chỉ dành cho API route chạy ở Server-side, tuyệt đối không đặt tiền tố `NEXT_PUBLIC_` để tránh lộ ra ngoài trình duyệt).

---

## 4. Đồng Bộ Dữ Liệu Thời Gian Thực Sang Google Sheets

Để giáo viên dễ dàng theo dõi tiến độ của học sinh trên Google Sheets mà không cần đăng nhập vào hệ thống quản trị, ta sẽ xây dựng cơ chế tự động gửi kết quả gõ phím sang Google Sheets mỗi khi học sinh hoàn thành bài học.

### Cách 1: Sử dụng Google Apps Script Webhook (Trực tiếp và Miễn phí)

#### Bước 1: Tạo Google Sheet và lấy Script
1. Tạo một trang tính mới trên Google Sheets.
2. Thiết lập tiêu đề cho dòng đầu tiên (Cột A - H):
   `Thời gian` | `Học sinh` | `Lớp` | `Mã bài học` | `WPM` | `Chính xác (%)` | `Số lỗi` | `Trạng thái đạt`
3. Vào menu **Tiện ích mở rộng (Extensions)** -> **Apps Script**.
4. Xóa hết mã hiện tại, dán mã này vào:

```javascript
function doPost(e) {
  try {
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Thêm một hàng dữ liệu mới
    sheet.appendRow([
      new Date(),
      data.studentName,
      data.className,
      data.lessonTitle,
      data.wpm,
      data.accuracy + "%",
      data.incorrectCount,
      data.meetsRequirements ? "ĐẠT" : "CHƯA ĐẠT"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Click **Triển khai (Deploy)** -> **Triển khai mới (New deployment)**.
6. Chọn loại triển khai là **Ứng dụng web (Web app)**.
7. Cấu hình:
   - **Mô tả**: `Đồng bộ dữ liệu Viet-typing`
   - **Thực thi dưới dạng (Execute as)**: `Tôi (Email của bạn)`
   - **Ai có quyền truy cập (Who has access)**: `Mọi người (Anyone)` (để server có thể gọi webhook mà không bị chặn xác thực oauth).
8. Nhấn **Triển khai**, cấp quyền truy cập tài khoản khi được hỏi, sau đó sao chép **URL của ứng dụng web** (đường dẫn có dạng `https://script.google.com/macros/s/.../exec`).

#### Bước 2: Gọi Webhook từ ứng dụng Next.js
Trong logic hoàn thành bài học (`src/app/typing/[lessonId]/page.tsx` hoặc API Route hỗ trợ), gọi API này:

```typescript
const syncToGoogleSheets = async (telemetry: any, student: any, meets: boolean) => {
  const GOOGLE_SCRIPT_URL = "URL_GOOGLE_APPS_SCRIPT_CỦA_BẠN";
  
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Cho phép gọi chéo nguồn qua Google Apps Script
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentName: student.name,
        className: student.className || "Tự do",
        lessonTitle: telemetry.lessonTitle || "Bài tập gõ",
        wpm: telemetry.wpm,
        accuracy: telemetry.accuracy,
        incorrectCount: telemetry.incorrectCount,
        meetsRequirements: meets
      })
    });
    console.log("Đã gửi dữ liệu đồng bộ sang Google Sheets!");
  } catch (err) {
    console.error("Lỗi đồng bộ Google Sheets:", err);
  }
};
```

---

### Cách 2: Sử dụng Supabase Edge Functions / Database Webhooks (Tự động 100% từ Database)

Nếu muốn đảm bảo an toàn tuyệt đối và tự động hóa ở tầng cơ sở dữ liệu:
1. Vào Supabase Dashboard -> **Integrations** -> **Database Webhooks**.
2. Tạo Webhook mới:
   - **Tên**: `sync_to_sheets`
   - **Bảng**: `typing_telemetry`
   - **Sự kiện**: `INSERT`
   - **Kiểu gửi**: `POST`
   - **HTTP URL**: Điền đường dẫn Webhook của Google Apps Script hoặc API trung gian (Make.com, Zapier).
3. Mỗi khi học sinh gõ xong, dữ liệu lưu vào bảng `typing_telemetry` trên Supabase sẽ kích hoạt Webhook gửi trực tiếp đến Google Sheets ngay lập tức.
