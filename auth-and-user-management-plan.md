# Kế Hoạch Triển Khai: Xác Thực & Quản Trị Người Dùng

## Mục tiêu
Xây dựng hệ thống đăng nhập/đăng ký (bằng Google & tài khoản thường cần Admin phê duyệt), quản lý mật khẩu tự phục vụ, và giao diện quản lý tài khoản cho Admin.

## Các Công Việc Cần Thực Hiện

- [ ] **Công việc 1: Xây dựng `AuthContext` & Database Giả lập**
  - Tạo `src/contexts/AuthContext.tsx` quản lý phiên đăng nhập (`user`, `role`, `isLoggedIn`).
  - Lưu trữ danh sách tài khoản trong `localStorage` để hoạt động bền vững và ổn định, tự động đồng bộ.
  - Thiết lập sẵn tài khoản Admin mặc định: `admin@viettyping.edu.vn` / mật khẩu `admin123`.
  - *Kiểm tra:* File context được import mà không có lỗi biên dịch.

- [ ] **Công việc 2: Xây dựng các Trang Xác thực (`/login`, `/signup`, `/forgot-password`)**
  - Tạo `/login` với form đăng nhập và nút "Đăng nhập bằng Google".
  - Tạo `/signup` với form đăng ký thường (Họ tên, SĐT, Email, Mật khẩu, Xác nhận mật khẩu) và nút "Đăng ký bằng Google".
  - Tạo `/forgot-password` thực hiện tạo mật khẩu tạm thời gửi qua email và hiển thị thông báo.
  - *Kiểm tra:* Có thể truy cập các đường dẫn trên, các trường nhập liệu hoạt động tốt.

- [ ] **Công việc 3: Tích hợp Đăng nhập Google & Phê duyệt Tài khoản**
  - Luồng Google Auth: Nhấp nút đăng nhập Google -> mở màn hình chọn tài khoản giả lập -> đăng nhập trực tiếp (mặc định `isActive = true`).
  - Luồng Đăng ký thường: Sau khi gửi -> lưu trạng thái `isActive = false` -> thông báo chờ Admin phê duyệt.
  - Đăng nhập thường: Nếu `isActive == false` -> báo lỗi "Tài khoản chưa được kích hoạt bởi Admin!".
  - *Kiểm tra:* Thao tác đăng ký thường và đăng nhập để xem thông báo chặn.

- [ ] **Công việc 4: Tích hợp Auth vào Thanh điều hướng chính (Navbar)**
  - Cập nhật Navbar trong `src/app/page.tsx` hiển thị thông tin User (Tên, Ảnh đại diện) và Dropdown thao tác (Đổi mật khẩu, Trang quản trị - nếu là Admin, Đăng xuất).
  - Kết nối `StudentContext` với `AuthContext` để tự động điền hồ sơ học sinh.
  - *Kiểm tra:* Đăng nhập xong hiển thị đúng avatar và tên trên thanh điều hướng.

- [ ] **Công việc 5: Tính năng Đổi mật khẩu tự phục vụ**
  - Tạo trang hoặc Modal `/change-password` cho phép người dùng đang đăng nhập đổi mật khẩu.
  - *Kiểm tra:* Đổi mật khẩu thành công và đăng nhập lại bằng mật khẩu mới.

- [ ] **Công việc 6: Xây dựng Trang Quản trị Người dùng (`/admin/users`)**
  - Hiển thị danh sách tài khoản. Thống kê theo bộ lọc: Trạng thái (Chờ phê duyệt, Hoạt động), Kiểu đăng ký, Vai trò.
  - Chức năng: Phê duyệt kích hoạt chỉ với 1 click, Thêm tài khoản mới, Sửa thông tin, Xóa tài khoản, và Đặt lại mật khẩu cho bất kỳ tài khoản nào.
  - *Kiểm tra:* Thao tác kích hoạt tài khoản thường vừa đăng ký, thử đăng nhập lại tài khoản đó.

- [ ] **Công việc 7: Cập nhật Sidebar Admin**
  - Thêm mục "Quản lý tài khoản" trỏ tới `/admin/users` vào `src/app/admin/layout.tsx`.
  - *Kiểm tra:* Sidebar hiển thị mục mới và chuyển hướng chính xác.

- [ ] **Công việc 8: Kiểm thử & Hoàn thiện**
  - Chạy build dự án (`npm run build`) để kiểm tra lỗi TypeScript/Next.js.
  - Kiểm tra tính tương thích Responsive trên di động và các vi hiệu ứng (micro-animations).

## Tiêu chí hoàn thành (Done When)
- [ ] Đăng nhập Google và đăng ký thường thành công.
- [ ] Chặn tài khoản thường chưa phê duyệt đăng nhập.
- [ ] Người dùng đổi được mật khẩu và khôi phục mật khẩu quên thành công.
- [ ] Quản trị viên duyệt, sửa, xóa, đổi mật khẩu người dùng trên dashboard `/admin/users`.
- [ ] Dự án build thành công không lỗi TypeScript/ESLint.
