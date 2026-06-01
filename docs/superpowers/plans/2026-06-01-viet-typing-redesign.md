# VietTyping Redesign for THCS & Educators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign VietTyping from a primary-school-oriented app into a sleek, modern, typing.com-style platform for Secondary School (THCS) students (grades 6-9, ages 11-15) and educators, complete with a 60-lesson curriculum and an administrative portal.

**Architecture:** 
- Next.js (App Router) client-centric architecture utilizing React Context and LocalStorage for student stats syncing, with a robust fallback for school-level data persistence.
- Sleek glassmorphism UI/UX design (dark mode default) matching THCS demographics, removing kiddie-focused terminology.
- Dynamic Input Method Translator (`telex.ts` and `vietnameseUtils.ts`) integrated into the keyboard listener for instant VNI/Telex visual toggle.
- Educator panel (`/admin`) grouped into dashboard modules (class management, reports, exams, settings).

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti.

---

## File Structure & Impact Map

- `src/data/lessons.ts`: Stores the complete 60-lesson catalog (20 Sơ cấp, 20 Trung cấp, 20 Cao cấp).
- `src/app/page.tsx`: Overhauled homepage for THCS students with modern dashboards and visual progression.
- `src/components/TypingPractice.tsx`: Core typing engine with inline VNI/Telex toggles and dynamic key coloring.
- `src/app/admin/layout.tsx`: Shell for the Educator/School dashboard.
- `src/app/admin/page.tsx`: Main Educator Dashboard with class analytics summaries.
- `src/app/admin/classes/page.tsx`: Management portal for creating classes, importing students, and generating Class Codes.
- `src/app/admin/assignments/page.tsx`: Portal for configuring lesson locking rules, minimum thresholds (WPM/Accuracy), and custom assignments.
- `src/app/admin/live/page.tsx`: Live room view for teachers to monitor student status in real time.
- `src/app/admin/reports/page.tsx`: Class-wide speed/accuracy reports and character error analysis charts.
- `src/app/admin/exams/page.tsx` & `src/app/exam/[examId]/page.tsx`: Typing test schedule setup and student exam room.
- `src/app/certificate/[id]/page.tsx`: PDF-friendly printable completion certificate generator.

---

## Task Breakdown

### Task 1: Curriculum Expansion (60 Lessons)

**Files:**
- Modify: `src/data/lessons.ts`
- Test: `src/data/__tests__/lessons.test.ts` (Create if not exists)

- [ ] **Step 1: Write tests for curriculum completeness**
  Verify that all 60 lessons exist, have valid IDs, and belong to the correct levels with appropriate goals.
  Create `src/data/__tests__/lessons.test.ts`:
  ```typescript
  import { lessons } from '../lessons';

  describe('Curriculum Data Integrity', () => {
    it('should have exactly 60 lessons (20 per level)', () => {
      const basic = lessons.filter(l => l.level === 'basic');
      const intermediate = lessons.filter(l => l.level === 'intermediate');
      const advanced = lessons.filter(l => l.level === 'advanced');
      
      expect(basic.length).toBe(20);
      expect(intermediate.length).toBe(20);
      expect(advanced.length).toBe(20);
    });

    it('should have unique lesson IDs', () => {
      const ids = lessons.map(l => l.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(lessons.length);
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npm test src/data/__tests__/lessons.test.ts`
  Expected: FAIL (only 17 lessons exist in current lessons.ts)

- [ ] **Step 3: Implement the full 60-lesson dataset in `src/data/lessons.ts`**
  Write the full dataset with 20 lessons per level, adapting targets to be challenging for THCS.
  ```typescript
  export interface Lesson {
    id: string;
    level: 'basic' | 'intermediate' | 'advanced';
    title: string;
    description: string;
    content: string;
    targetWPM: number;
    minAccuracy: number;
  }

  export const lessons: Lesson[] = [
    // === SƠ CẤP (1 - 20) ===
    { id: 'basic-1', level: 'basic', title: 'Hàng phím cơ sở (Home Row)', description: 'Luyện tập các phím giữa: A S D F J K L ;', content: 'asdf jkl; asdf jkl; fdsajkl; fdsajkl;', targetWPM: 15, minAccuracy: 90 },
    { id: 'basic-2', level: 'basic', title: 'Hàng phím cơ sở mở rộng', description: 'Gõ phím G và H bằng ngón trỏ', content: 'fgf jhj asdfg hjkl; ghaf jash ghgh ghfj', targetWPM: 15, minAccuracy: 90 },
    { id: 'basic-3', level: 'basic', title: 'Hàng phím trên - Phía trái', description: 'Luyện tập phím Q W E R T', content: 'qwer rewq asdfq werta qawer trewq qwert', targetWPM: 18, minAccuracy: 90 },
    { id: 'basic-4', level: 'basic', title: 'Hàng phím trên - Phía phải', description: 'Luyện tập phím Y U I O P', content: 'uiop poui jkl;u iopy uiopu juiop yuiop', targetWPM: 18, minAccuracy: 90 },
    { id: 'basic-5', level: 'basic', title: 'Hàng phím dưới - Phía trái', description: 'Luyện tập phím Z X C V B', content: 'zxcv bvcx asdfz xcvb vzxc vczx zxcvb', targetWPM: 18, minAccuracy: 90 },
    { id: 'basic-6', level: 'basic', title: 'Hàng phím dưới - Phía phải', description: 'Luyện tập phím N M , . /', content: 'bnm, mnb jkl;n m,.n mnb, mnb. mnb,', targetWPM: 18, minAccuracy: 90 },
    { id: 'basic-7', level: 'basic', title: 'Nguyên âm dấu mũ (Telex & VNI)', description: 'Cách gõ nguyên âm dấu mũ: Â, Ê, Ô', content: 'aa ee oo s6 d6 f6 aaee ooee aaeeo', targetWPM: 20, minAccuracy: 90 },
    { id: 'basic-8', level: 'basic', title: 'Nguyên âm móc & Chữ Đ', description: 'Cách gõ nguyên âm móc: Ă, Ơ, Ư và chữ Đ', content: 'aw ow uw dd d9 a8 o7 u7 dddd awow uwdd', targetWPM: 20, minAccuracy: 90 },
    { id: 'basic-9', level: 'basic', title: 'Dấu thanh: Sắc và Huyền', description: 'Gõ phím dấu Sắc (s / 1) và dấu Huyền (f / 2)', content: 'as df a1 a2 ca1 ca2 la1 la2 ma1 ma2', targetWPM: 20, minAccuracy: 90 },
    { id: 'basic-10', level: 'basic', title: 'Dấu thanh: Hỏi và Ngã', description: 'Gõ phím dấu Hỏi (r / 3) và dấu Ngã (x / 4)', content: 'ar ax a3 a4 ma3 ma4 la3 la4 ca3 ca4', targetWPM: 20, minAccuracy: 90 },
    { id: 'basic-11', level: 'basic', title: 'Dấu thanh: Nặng', description: 'Gõ phím dấu Nặng (j / 5)', content: 'aj a5 ma5 la5 ca5 na5 da5 ha5 ja5', targetWPM: 20, minAccuracy: 90 },
    { id: 'basic-12', level: 'basic', title: 'Ôn tập tổ hợp dấu thanh', description: 'Luyện gõ từ kết hợp tất cả các dấu', content: 'má mà mả mã mạ lá là lả lã lạ', targetWPM: 22, minAccuracy: 90 },
    { id: 'basic-13', level: 'basic', title: 'Nguyên âm ghép tiếng Việt', description: 'Các âm ghép thường gặp: ai, ao, au, ay, oai, oay', content: 'ai ao au ay oai oay tai sao may bay khoai', targetWPM: 22, minAccuracy: 90 },
    { id: 'basic-14', level: 'basic', title: 'Phụ âm ghép tiếng Việt', description: 'Các phụ âm đầu ghép: ch, gh, gi, kh, ng, ngh, nh, ph, th, tr', content: 'ch gh gi kh ng ngh nh ph th tr cha gia nha pha tha tra', targetWPM: 22, minAccuracy: 90 },
    { id: 'basic-15', level: 'basic', title: 'Luyện phím viết hoa (Shift)', description: 'Sử dụng phím Shift để gõ chữ in hoa', content: 'Học Sinh Lớp Sáu Trường Trung Học Cơ Sở Việt Nam', targetWPM: 20, minAccuracy: 90 },
    { id: 'basic-16', level: 'basic', title: 'Hàng phím số cơ bản', description: 'Luyện tập gõ nhanh các phím số từ 0 đến 9', content: '123 456 789 012 345 678 901 234 567 890', targetWPM: 25, minAccuracy: 90 },
    { id: 'basic-17', level: 'basic', title: 'Các từ đơn tiếng Việt phổ biến', description: 'Luyện gõ các từ đơn có cấu trúc hoàn chỉnh', content: 'anh em học sinh lớp học sách vở bút thước thầy cô trường', targetWPM: 25, minAccuracy: 90 },
    { id: 'basic-18', level: 'basic', title: 'Cụm từ sơ cấp 1', description: 'Luyện gõ các cụm từ ngắn gọn', content: 'đi học về nhà ăn cơm quét nhà tưới cây giúp mẹ', targetWPM: 25, minAccuracy: 90 },
    { id: 'basic-19', level: 'basic', title: 'Cụm từ sơ cấp 2', description: 'Cụm từ dài hơn kết hợp viết hoa', content: 'Em học sinh lớp 6. Em yêu trường học của em.', targetWPM: 25, minAccuracy: 90 },
    { id: 'basic-20', level: 'basic', title: 'Bài kiểm tra hoàn thành Sơ cấp', description: 'Kiểm tra tốc độ và độ chính xác cuối cấp độ Sơ cấp', content: 'Học sinh trung học cơ sở cần luyện tập gõ bàn phím bằng mười ngón tay mỗi ngày.', targetWPM: 25, minAccuracy: 92 },

    // === TRUNG CẤP (21 - 40) ===
    { id: 'intermediate-1', level: 'intermediate', title: 'Từ ghép thông dụng 1', description: 'Gõ các từ ghép hai âm tiết phổ biến', content: 'học tập rèn luyện trường lớp thầy cô bạn bè sách vở', targetWPM: 30, minAccuracy: 92 },
    { id: 'intermediate-2', level: 'intermediate', title: 'Từ ghép thông dụng 2', description: 'Gõ từ ghép kết hợp nhiều dấu thanh phức tạp', content: 'nghiên cứu khoa học phát triển công nghệ tổ quốc hòa bình', targetWPM: 30, minAccuracy: 92 },
    { id: 'intermediate-3', level: 'intermediate', title: 'Dấu câu cơ bản', description: 'Luyện tập dấu chấm (.), phẩy (,), hỏi (?), than (!)', content: 'Chào bạn! Bạn tên là gì? Mình là học sinh lớp bảy, rất vui được gặp bạn.', targetWPM: 32, minAccuracy: 92 },
    { id: 'intermediate-4', level: 'intermediate', title: 'Dấu câu nâng cao', description: 'Luyện gõ dấu hai chấm (:), chấm phẩy (;), gạch ngang (-)', content: 'Thời khóa biểu hôm nay gồm: Toán - Tin học; Ngữ văn - Lịch sử.', targetWPM: 32, minAccuracy: 92 },
    { id: 'intermediate-5', level: 'intermediate', title: 'Từ láy tiếng Việt', description: 'Luyện gõ các từ láy thông dụng giàu nhạc điệu', content: 'xinh xắn ríu rít lung linh lấp lánh rì rào nao nao xôn xao', targetWPM: 35, minAccuracy: 92 },
    { id: 'intermediate-6', level: 'intermediate', title: 'Ký tự Shift hàng số 1', description: 'Luyện gõ các ký tự !, @, #, $, %', content: 'Email liên hệ: hocsinh@school.edu.vn! Khuyến mãi giảm giá 50% #1', targetWPM: 30, minAccuracy: 90 },
    { id: 'intermediate-7', level: 'intermediate', title: 'Ký tự Shift hàng số 2', description: 'Luyện gõ các ký tự ^, &, *, (, )', content: 'Công thức toán: (a * b) & (c * d) = 100% kết quả kiểm tra.', targetWPM: 30, minAccuracy: 90 },
    { id: 'intermediate-8', level: 'intermediate', title: 'Cụm số và đơn vị đo lường', description: 'Kết hợp gõ chữ, viết hoa và phím số cùng đơn vị', content: 'Chiều dài 150m, chiều rộng 85m. Diện tích đạt hơn 12.000 mét vuông.', targetWPM: 32, minAccuracy: 92 },
    { id: 'intermediate-9', level: 'intermediate', title: 'Câu đơn hoàn chỉnh', description: 'Luyện gõ các câu đơn chính xác', content: 'Học sinh tích cực tham gia các hoạt động ngoại khóa của nhà trường.', targetWPM: 35, minAccuracy: 92 },
    { id: 'intermediate-10', level: 'intermediate', title: 'Câu phức hai vế', description: 'Luyện gõ câu phức ghép vế câu bằng liên từ', content: 'Mặc dù trời mưa rất to, các bạn học sinh vẫn đến lớp đúng giờ.', targetWPM: 35, minAccuracy: 92 },
    { id: 'intermediate-11', level: 'intermediate', title: 'Luyện gõ dấu ngoặc kép', description: 'Gõ dấu ngoặc kép "" để trích dẫn', content: 'Bác Hồ đã từng căn dặn: "Non sông Việt Nam có trở nên tươi đẹp hay không..."', targetWPM: 35, minAccuracy: 92 },
    { id: 'intermediate-12', level: 'intermediate', title: 'Từ mượn tiếng nước ngoài', description: 'Luyện gõ các từ mượn thông dụng trong tiếng Việt', content: 'in-tơ-nét ti-vi máy vi tính ca-ra-te săm lốp ô-tô pi-a-nô', targetWPM: 35, minAccuracy: 92 },
    { id: 'intermediate-13', level: 'intermediate', title: 'Luyện gõ từ vựng Địa lý', description: 'Tên các địa danh lịch sử Việt Nam', content: 'Hà Nội, Thành phố Hồ Chí Minh, Huế, Đà Nẵng, Vịnh Hạ Long, Phong Nha.', targetWPM: 35, minAccuracy: 92 },
    { id: 'intermediate-14', level: 'intermediate', title: 'Luyện gõ từ vựng Lịch sử', description: 'Các nhân vật lịch sử nước nhà', content: 'Vua Hùng Vương, Hai Bà Trưng, Ngô Quyền, Trần Hưng Đạo, Quang Trung.', targetWPM: 35, minAccuracy: 92 },
    { id: 'intermediate-15', level: 'intermediate', title: 'Đoạn văn ngắn: Đời sống học đường', description: 'Đoạn văn 2 câu liên kết về trường học', content: 'Tiếng trống trường vang lên giòn giã, báo hiệu giờ ra chơi đã bắt đầu. Học sinh ùa ra sân trường rộn rã tiếng cười vui.', targetWPM: 38, minAccuracy: 92 },
    { id: 'intermediate-16', level: 'intermediate', title: 'Đoạn văn ngắn: Gia định', description: 'Đoạn văn 2 câu liên kết về chủ đề gia đình', content: 'Gia đình là tổ ấm yêu thương, nơi có cha mẹ luôn dang rộng vòng tay đón em về. Em hứa sẽ học tập chăm chỉ để bố mẹ vui lòng.', targetWPM: 38, minAccuracy: 92 },
    { id: 'intermediate-17', level: 'intermediate', title: 'Đoạn văn ngắn: Quê hương', description: 'Luyện gõ đoạn văn ngắn mô tả quê hương đất nước', content: 'Quê hương em có dòng sông xanh mát uốn lượn quanh những cánh đồng lúa chín vàng. Những buổi chiều hè, lũ trẻ rủ nhau ra đê thả diều thật vui vẻ.', targetWPM: 38, minAccuracy: 92 },
    { id: 'intermediate-18', level: 'intermediate', title: 'Luyện gõ cụm từ viết hoa hỗn hợp', description: 'Thử thách gõ hoa chữ cái xen kẽ', content: 'UNESCO công nhận Vịnh Hạ Long là Di sản Thiên nhiên Thế giới.', targetWPM: 35, minAccuracy: 92 },
    { id: 'intermediate-19', level: 'intermediate', title: 'Thử thách tốc độ (Time Attack)', description: 'Luyện phản xạ gõ nhanh các cụm từ ngắn dưới áp lực thời gian', content: 'gõ nhanh gõ đúng phản xạ mười ngón tay không nhìn bàn phím tập trung cao độ', targetWPM: 42, minAccuracy: 90 },
    { id: 'intermediate-20', level: 'intermediate', title: 'Bài kiểm tra tốt nghiệp Trung cấp', description: 'Kiểm tra tổng hợp kiến thức và phản xạ cấp độ Trung cấp', content: 'Việc tự rèn luyện kỹ năng gõ phím giúp học sinh THCS hoàn thành tốt các bài tập môn Tin học trên lớp nhanh chóng.', targetWPM: 40, minAccuracy: 94 },

    // === CAO CẤP (41 - 60) ===
    { id: 'advanced-1', level: 'advanced', title: 'Trích đoạn văn học Việt Nam', description: 'Luyện gõ trích đoạn văn xuôi nổi tiếng', content: 'Mặt trời đã khuất sau dãy núi, để lại những tia nắng cuối cùng nhuộm đỏ bầu trời. Gió chiều thổi nhẹ, mang theo hương thơm dịu mát của cánh đồng.', targetWPM: 45, minAccuracy: 95 },
    { id: 'advanced-2', level: 'advanced', title: 'Trích đoạn thơ ca nổi tiếng', description: 'Luyện gõ thơ ca có dấu câu xuống dòng phức tạp', content: 'Thân em vừa trắng lại vừa tròn, Bảy nổi ba chìm với nước non. Rắn nát mặc dầu tay kẻ nặn, Mà em vẫn giữ tấm lòng son.', targetWPM: 42, minAccuracy: 95 },
    { id: 'advanced-3', level: 'advanced', title: 'Văn bản Khoa học Thường thức', description: 'Chủ đề bảo vệ môi trường toàn cầu', content: 'Biến đổi khí hậu đang làm nhiệt độ Trái Đất tăng lên, băng tan ở hai cực khiến mực nước biển dâng cao đe dọa các vùng đồng bằng ven biển.', targetWPM: 48, minAccuracy: 95 },
    { id: 'advanced-4', level: 'advanced', title: 'Tin tức công nghệ', description: 'Chủ đề trí tuệ nhân tạo và tương lai', content: 'Trí tuệ nhân tạo (AI) đang phát triển vô cùng mạnh mẽ, hỗ trợ con người trong nhiều công việc như lập trình, dịch thuật và phân tích dữ liệu lớn.', targetWPM: 50, minAccuracy: 95 },
    { id: 'advanced-5', level: 'advanced', title: 'Luyện gõ ký tự đặc biệt Toán học', description: 'Gõ các ký tự phép tính toán học nâng cao', content: 'f(x) = x^2 + 2x - 5; a >= b và c <= d; 100 / 5 = 20; 25 * 4 = 100.', targetWPM: 40, minAccuracy: 92 },
    { id: 'advanced-6', level: 'advanced', title: 'Luyện gõ văn bản Lập trình cơ bản', description: 'Tập gõ các thẻ HTML và đoạn CSS cơ bản', content: '<div className="text-xl font-bold">Hello World!</div> body { color: #333; margin: 0; }', targetWPM: 38, minAccuracy: 92 },
    { id: 'advanced-7', level: 'advanced', title: 'Danh ngôn cuộc sống 1', description: 'Các câu châm ngôn sâu sắc về ý chí vươn lên', content: 'Đường đi khó, không khó vì ngăn sông cách núi, mà khó vì lòng người ngại núi e sông.', targetWPM: 45, minAccuracy: 95 },
    { id: 'advanced-8', level: 'advanced', title: 'Danh ngôn cuộc sống 2', description: 'Châm ngôn về giá trị của tri thức', content: 'Học, học nữa, học mãi. Tri thức là chìa khóa vạn năng mở ra cánh cửa tương lai tươi đẹp.', targetWPM: 45, minAccuracy: 95 },
    { id: 'advanced-9', level: 'advanced', title: 'Bài tập sức bền gõ phím 1', description: 'Đoạn văn dài liên tục 80 từ chủ đề sức khỏe', content: 'Luyện tập thể dục thể thao mỗi ngày giúp cơ thể dẻo dai và tinh thần sảng khoái. Các bạn học sinh THCS nên cân bằng giữa việc học tập và hoạt động thể chất ngoài trời để phát triển toàn diện.', targetWPM: 48, minAccuracy: 95 },
    { id: 'advanced-10', level: 'advanced', title: 'Bài tập sức bền gõ phím 2', description: 'Đoạn văn dài chủ đề lịch sử đấu tranh dân tộc', content: 'Trải qua hàng ngàn năm lịch sử dựng nước và giữ nước, nhân dân Việt Nam đã xây dựng nên truyền thống yêu nước nồng nàn, ý chí kiên cường bất khuất chống lại mọi kẻ thù xâm lược.', targetWPM: 48, minAccuracy: 95 },
    { id: 'advanced-11', level: 'advanced', title: 'Luyện gõ thuật ngữ Tin học', description: 'Các từ tiếng Anh chuyên ngành Tin học THCS', content: 'Hardware, Software, Keyboard, Mouse, Database, Network, Algorithm, CPU, RAM, ROM, Operating System.', targetWPM: 45, minAccuracy: 94 },
    { id: 'advanced-12', level: 'advanced', title: 'Luyện gõ hội thoại đối đáp', description: 'Sử dụng gạch đầu dòng, dấu hai chấm và ngoặc kép', content: '- Bạn đã ôn bài Tin học chưa?\n- Mình đã luyện gõ xong bài 15 rồi: "Cực kỳ thú vị!".', targetWPM: 42, minAccuracy: 94 },
    { id: 'advanced-13', level: 'advanced', title: 'Ký hiệu khoa học và Vật lý', description: 'Luyện gõ các ký hiệu và hằng số Vật lý, Hóa học', content: 'Tốc độ ánh sáng c = 3 * 10^8 m/s. Công thức nước H2O. Lực hấp dẫn F = m * g.', targetWPM: 40, minAccuracy: 92 },
    { id: 'advanced-14', level: 'advanced', title: 'Tốc độ tối đa (Speed Challenge)', description: 'Thử thách phản xạ gõ nhanh các chữ ghép phức tạp', content: 'khuyên bảo nguyên quán nghiêng ngả khuynh hướng nguyên nhân chuyên nghiệp truyền thuyết', targetWPM: 55, minAccuracy: 93 },
    { id: 'advanced-15', level: 'advanced', title: 'Touch Typing - Không nhìn bàn phím 1', description: 'Thử thách định vị phím mù qua đoạn văn ngắn', content: 'Hãy để đôi bàn tay tự động ghi nhớ vị trí các phím và lướt đi trên bàn phím một cách nhẹ nhàng nhất.', targetWPM: 45, minAccuracy: 95 },
    { id: 'advanced-16', level: 'advanced', title: 'Touch Typing - Không nhìn bàn phím 2', description: 'Đoạn văn khó với các phím dấu cách xa', content: 'Tập trung nhìn thẳng vào màn hình, tuyệt đối không nhìn xuống bàn phím. Sự kiên trì sẽ mang lại kết quả bất ngờ.', targetWPM: 45, minAccuracy: 95 },
    { id: 'advanced-17', level: 'advanced', title: 'Kỹ năng làm việc nhóm', description: 'Đoạn văn nói về vai trò của tinh thần đồng đội', content: 'Muốn đi nhanh hãy đi một mình, muốn đi xa hãy đi cùng nhau. Tinh thần đồng đội giúp chúng ta vượt qua mọi khó khăn thử thách.', targetWPM: 50, minAccuracy: 95 },
    { id: 'advanced-18', level: 'advanced', title: 'Truyền thông xã hội và An toàn mạng', description: 'Cảnh báo về an toàn thông tin trên mạng xã hội', content: 'Học sinh THCS cần nâng cao cảnh giác, bảo mật thông tin cá nhân và cư xử văn minh lịch sự trên môi trường mạng xã hội.', targetWPM: 48, minAccuracy: 95 },
    { id: 'advanced-19', level: 'advanced', title: 'Marathon gõ phím siêu dài', description: 'Thử thách cuối cùng kiểm tra sức bền đôi tay', content: 'Trải qua sáu mươi bài học rèn luyện kỹ năng gõ phím từ cơ bản đến nâng cao, giờ đây bạn đã làm chủ được bàn phím máy tính. Kỹ năng này sẽ là hành trang vô giá đi theo bạn suốt quá trình học tập và làm việc trong thời đại số hóa ngày nay. Hãy luôn tự tin lướt ngón tay và không ngừng nâng cao tốc độ của bản thân mình nhé.', targetWPM: 52, minAccuracy: 95 },
    { id: 'advanced-20', level: 'advanced', title: 'Thử thách Tốt nghiệp xuất sắc', description: 'Bài kiểm tra cuối cùng nhận chứng nhận gõ phím chuyên nghiệp', content: 'Chúc mừng bạn đã hoàn thành xuất sắc lộ trình luyện gõ tiếng Việt mười ngón dành cho học sinh trung học cơ sở!', targetWPM: 55, minAccuracy: 96 }
  ];
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npm test src/data/__tests__/lessons.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run: `git add src/data/lessons.ts` & `git commit -m "feat: complete 60-lesson Vietnamese typing curriculum"`

---

### Task 2: THCS Student UI/UX Redesign

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Test: Manual visual verification (or screenshot audit)

- [ ] **Step 1: Shift layout to high-tech glassmorphism**
  Clean up primary-school tags ("bé", "bố mẹ", "đảo học tập"). Overhaul the colors in `src/app/page.tsx` to a high-contrast cyber-tech color theme (slate dark, neon cyan, electric purple). Add level stats summary cards.
  Update `src/app/page.tsx` rendering block:
  ```tsx
  // Replacing childish island references with sleek levels
  const levelNames = {
    basic: { title: 'Sơ Cấp - Nhập Môn', icon: '⚡', desc: 'Rèn luyện hàng phím cơ sở và các nguyên âm đặc biệt.' },
    intermediate: { title: 'Trung Cấp - Tăng Tốc', icon: '🚀', desc: 'Ghép từ phức, câu dài và làm quen các ký tự đặc biệt.' },
    advanced: { title: 'Cao Cấp - Chuyên Nghiệp', icon: '🏆', desc: 'Thử thách tốc độ, sức bền gõ văn bản và kỹ năng touch typing.' }
  };
  ```

- [ ] **Step 2: Run dev server and inspect style**
  Run: `npm run dev`
  Expected: Dev server runs. Visual styling uses dark mode palettes (`bg-slate-950`, border `border-slate-800`, hover states).

- [ ] **Step 3: Commit**
  Run: `git add src/app/page.tsx src/app/globals.css` & `git commit -m "style: redesign student UI for THCS"`

---

### Task 3: Dual Telex/VNI Typing Practice Toggle

**Files:**
- Modify: `src/components/TypingPractice.tsx`
- Test: `src/components/__tests__/TypingPractice.test.tsx` (Update target keyboard highlights tests)

- [ ] **Step 1: Add input method toggle to TypingPractice header**
  Add a state variable `inputMethod` ('telex' | 'vni') with buttons in the practice header to toggle between them.
  Modify `src/components/TypingPractice.tsx` (approx. line 350):
  ```tsx
  const [inputMethod, setInputMethod] = useState<'telex' | 'vni'>('telex');
  
  // Inside render:
  <div className="flex gap-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-700">
    <button 
      onClick={() => setInputMethod('telex')}
      className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${inputMethod === 'telex' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
    >TELEX</button>
    <button 
      onClick={() => setInputMethod('vni')}
      className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${inputMethod === 'vni' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
    >VNI</button>
  </div>
  ```

- [ ] **Step 2: Feed inputMethod into keyboard mapping logic**
  Ensure the typing engine's key guide (visual keyboard highlighting correct fingers) updates automatically when `inputMethod` toggles.
  ```typescript
  const inputAdapter = useMemo(() => getInputMethodAdapter(inputMethod), [inputMethod]);
  const targetInputKeys = useMemo(() => inputAdapter.stringToKeys(task.content), [inputAdapter, task.content]);
  ```

- [ ] **Step 3: Run the local test suite**
  Run: `npm test`
  Expected: Key highlighting tests adapt accurately for both input options.

- [ ] **Step 4: Commit**
  Run: `git add src/components/TypingPractice.tsx` & `git commit -m "feat: add direct Telex/VNI layout toggle in practice interface"`

---

### Task 4: Educator Dashboard Core Layout

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Test: Navigate to `/admin`

- [ ] **Step 1: Create layout with side navigation**
  Create `src/app/admin/layout.tsx` with sidebar links: Dashboard, Classes (Quản lý lớp), Assignments (Bài tập & Rào cản), Live Room (Giám sát phòng máy), Reports (Báo cáo lỗi), Exams (Kỳ thi).
  ```tsx
  import React from 'react';
  import Link from 'next/link';

  export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6">
          <div className="text-xl font-extrabold text-cyan-400 mb-8 flex items-center gap-2">
            <span>🏫 VietTyping Edu</span>
          </div>
          <nav className="flex-1 space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-all">📊 Thống kê chung</Link>
            <Link href="/admin/classes" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-all">👥 Quản lý lớp học</Link>
            <Link href="/admin/assignments" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-all">⚙️ Cài đặt & Rào cản</Link>
            <Link href="/admin/live" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-all">🔴 Giám sát trực tiếp</Link>
            <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-all">📈 Báo cáo lỗi phím</Link>
            <Link href="/admin/exams" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-all">📝 Kỳ thi & Chứng chỉ</Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Create statistics home page**
  Create `src/app/admin/page.tsx` displaying statistics (total active students, avg speed, avg accuracy, completed lessons).
  ```tsx
  import React from 'react';

  export default function AdminPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Thống kê chung nhà trường</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-sm font-medium text-slate-400">Tổng số học sinh</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">320</p>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-sm font-medium text-slate-400">Tốc độ trung bình (WPM)</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">28.5 WPM</p>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-sm font-medium text-slate-400">Độ chính xác trung bình</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">93.7%</p>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-sm font-medium text-slate-400">Số bài đã luyện tập</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">1,540</p>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 3: Verify navigation**
  Verify `/admin` loads properly in browser.

- [ ] **Step 4: Commit**
  Run: `git add src/app/admin/` & `git commit -m "feat: create educator admin workspace structure"`

---

### Task 5: Class & Account Management

**Files:**
- Create: `src/app/admin/classes/page.tsx`
- Test: Verify class list loading, mock students generation, Class Code sharing.

- [ ] **Step 1: Implement student list and class creator page**
  Allow teachers to create classes, import a student roster, and display class codes for student registration.
  Code for `src/app/admin/classes/page.tsx`:
  ```tsx
  'use client';
  import React, { useState } from 'react';

  interface ClassGroup {
    id: string;
    name: string;
    code: string;
    studentCount: number;
  }

  export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassGroup[]>([
      { id: '1', name: 'Lớp 6A1', code: 'VTHCS-6A1', studentCount: 35 },
      { id: '2', name: 'Lớp 6A2', code: 'VTHCS-6A2', studentCount: 32 }
    ]);
    const [newClassName, setNewClassName] = useState('');

    const handleCreateClass = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newClassName) return;
      const newClass: ClassGroup = {
        id: Date.now().toString(),
        name: newClassName,
        code: `VTHCS-${newClassName.toUpperCase().replace(/\s+/g, '')}`,
        studentCount: 0
      };
      setClasses([...classes, newClass]);
      setNewClassName('');
    };

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Quản lý lớp học</h1>
        <form onSubmit={handleCreateClass} className="flex gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <input
            type="text"
            placeholder="Tên lớp mới (Ví dụ: Lớp 7A1)"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100"
          />
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold px-6 py-2 rounded-lg transition-all">Tạo Lớp</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-100">{cls.name}</h3>
                <span className="bg-cyan-500/10 text-cyan-400 text-xs px-2.5 py-1 rounded-full border border-cyan-500/20 font-semibold">Mã: {cls.code}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Số lượng học sinh:</span>
                <span className="font-bold text-slate-100">{cls.studentCount} học viên</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify in browser**
  Expected: Interface loads classes, adding class generates corresponding class code.

- [ ] **Step 3: Commit**
  Run: `git add src/app/admin/classes/page.tsx` & `git commit -m "feat: add class creation & code generation UI for educators"`

---

### Task 6: Real-time Classroom Monitor

**Files:**
- Create: `src/app/admin/live/page.tsx`
- Test: Mock student sessions showing current typing accuracy and speeds.

- [ ] **Step 1: Build simulated live room console**
  Render list of student computer stations showing current lesson, status (Gõ phím, Idle, Hoàn thành), current WPM, and current Accuracy.
  Code for `src/app/admin/live/page.tsx`:
  ```tsx
  'use client';
  import React, { useState, useEffect } from 'react';

  interface StudentSession {
    name: string;
    lesson: string;
    wpm: number;
    accuracy: number;
    status: 'active' | 'idle' | 'finished';
  }

  export default function LiveMonitorPage() {
    const [students, setStudents] = useState<StudentSession[]>([
      { name: 'Nguyễn Văn Nam', lesson: 'Bài 8: Chữ Đ', wpm: 22, accuracy: 92, status: 'active' },
      { name: 'Trần Thị Mai', lesson: 'Bài 15: Luyện phím viết hoa', wpm: 34, accuracy: 96, status: 'active' },
      { name: 'Lê Hoàng Long', lesson: 'Bài 20: Tốt nghiệp Sơ cấp', wpm: 0, accuracy: 0, status: 'idle' },
      { name: 'Phạm Minh Đức', lesson: 'Bài 12: Luyện dấu thanh', wpm: 28, accuracy: 94, status: 'finished' }
    ]);

    // Simulate real-time updates
    useEffect(() => {
      const interval = setInterval(() => {
        setStudents(prev => prev.map(s => {
          if (s.status === 'active') {
            return {
              ...s,
              wpm: Math.max(15, Math.min(60, s.wpm + (Math.random() > 0.5 ? 2 : -2))),
              accuracy: Math.max(88, Math.min(100, s.accuracy + (Math.random() > 0.5 ? 1 : -1)))
            };
          }
          return s;
        }));
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Giám sát phòng máy trực tiếp</h1>
          <span className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full font-semibold">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span> Đang kết nối
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {students.map((student, idx) => (
            <div key={idx} className={`p-5 bg-slate-900 border rounded-xl space-y-3 ${student.status === 'active' ? 'border-cyan-500/40' : 'border-slate-800'}`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-100">{student.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${student.status === 'active' ? 'bg-cyan-500/10 text-cyan-400' : student.status === 'idle' ? 'bg-slate-800 text-slate-400' : 'bg-green-500/10 text-green-400'}`}>
                  {student.status === 'active' ? 'Đang gõ' : student.status === 'idle' ? 'Chờ' : 'Xong'}
                </span>
              </div>
              <p className="text-sm text-slate-400 truncate">{student.lesson}</p>
              {student.status !== 'idle' && (
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-400">Tốc độ: <strong className="text-cyan-400">{student.wpm} WPM</strong></span>
                  <span className="text-slate-400">Độ chính xác: <strong className="text-cyan-400">{student.accuracy}%</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit**
  Run: `git add src/app/admin/live/page.tsx` & `git commit -m "feat: implement live student session monitoring UI"`

---

### Task 7: Lesson Locking Rules & Gatekeeper Settings

**Files:**
- Create: `src/app/admin/assignments/page.tsx`
- Test: Verify accuracy/WPM parameters settings and locking controls.

- [ ] **Step 1: Build the lock rules configuration page**
  Enable config parameters (minimum target WPM, minimum Accuracy required to advance to the next lesson).
  Code for `src/app/admin/assignments/page.tsx`:
  ```tsx
  'use client';
  import React, { useState } from 'react';

  export default function LockRulesPage() {
    const [minAccuracy, setMinAccuracy] = useState(90);
    const [minWpm, setMinWpm] = useState(20);
    const [lockProgress, setLockProgress] = useState(true);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Rào cản tiến trình (Gatekeeper Settings)</h1>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6 max-w-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Bắt buộc theo trình tự</h3>
              <p className="text-sm text-slate-400">Khóa bài tiếp theo nếu chưa đạt yêu cầu bài trước</p>
            </div>
            <input 
              type="checkbox" 
              checked={lockProgress} 
              onChange={(e) => setLockProgress(e.target.checked)}
              className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <hr className="border-slate-800" />
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-slate-200">Tiêu chuẩn tối thiểu để mở khóa bài tiếp theo:</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Độ chính xác tối thiểu (%)</label>
                <input 
                  type="number" 
                  value={minAccuracy} 
                  onChange={(e) => setMinAccuracy(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Tốc độ tối thiểu (WPM)</label>
                <input 
                  type="number" 
                  value={minWpm} 
                  onChange={(e) => setMinWpm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit**
  Run: `git add src/app/admin/assignments/page.tsx` & `git commit -m "feat: add classroom lesson gatekeeping configuration UI"`

---

### Task 8: Class-wide Typing Error Analytics

**Files:**
- Create: `src/app/admin/reports/page.tsx`
- Test: Verify display of error frequencies and WPM trends.

- [ ] **Step 1: Build reports page with diagnostic analysis**
  Implement statistical view of keypress error frequencies (highlighting which characters students mistype most frequently).
  Code for `src/app/admin/reports/page.tsx`:
  ```tsx
  'use client';
  import React from 'react';

  export default function ReportsPage() {
    const commonErrors = [
      { key: 'w', count: 145, description: 'Nguyên âm móc (ă/ơ/ư) trong Telex' },
      { key: 'r', count: 98, description: 'Phím thanh hỏi (?)' },
      { key: 'x', count: 82, description: 'Phím thanh ngã (~)' },
      { key: '6', count: 64, description: 'Ký tự thanh mũ (â/ê/ô) trong VNI' }
    ];

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Thống kê lỗi gõ phím tập thể</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Phím gõ sai nhiều nhất</h3>
            <div className="space-y-3">
              {commonErrors.map((error, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-400 font-bold border border-red-500/20 rounded-md">{error.key}</span>
                    <span className="text-sm text-slate-400">{error.description}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-100">{error.count} lần sai</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Báo cáo phương pháp gõ phím</h3>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Số học sinh sử dụng Telex:</span>
                <strong className="text-slate-100">72% (230 học viên)</strong>
              </div>
              <div className="flex justify-between">
                <span>Số học sinh sử dụng VNI:</span>
                <strong className="text-slate-100">28% (90 học viên)</strong>
              </div>
              <hr className="border-slate-800" />
              <p className="text-xs text-cyan-400/80">💡 Lời khuyên giáo viên: Hãy dành thêm 5 phút trong tiết học tới hướng dẫn lại cách đặt ngón trỏ gõ nguyên âm móc (w/7/8).</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit**
  Run: `git add src/app/admin/reports/page.tsx` & `git commit -m "feat: add typing error diagnostic reporting UI"`

---

### Task 9: Typing Exams & Certifications

**Files:**
- Create: `src/app/admin/exams/page.tsx`
- Create: `src/app/certificate/[id]/page.tsx`
- Test: Verify certificate output layout.

- [ ] **Step 1: Build Exam Scheduling & Certificate generation**
  Create educator exam scheduler and student certificate template.
  Code for `src/app/certificate/[id]/page.tsx`:
  ```tsx
  'use client';
  import React from 'react';
  import { useSearchParams } from 'next/navigation';

  export default function CertificatePage() {
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || 'HỌC SINH THCS';
    const level = searchParams.get('level') || 'Cao cấp';
    const wpm = searchParams.get('wpm') || '55';
    const accuracy = searchParams.get('accuracy') || '98';

    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 p-6">
        <div className="w-[800px] h-[550px] bg-slate-900 border-8 border-double border-cyan-500 p-12 text-center flex flex-col justify-between rounded-xl relative overflow-hidden shadow-2xl">
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-cyan-400"></div>
          
          <div className="space-y-4">
            <span className="text-cyan-400 font-extrabold tracking-widest text-sm uppercase">Chứng Nhận Tốt Nghiệp Khóa Học Gõ Phím</span>
            <h1 className="text-4xl font-extrabold text-slate-100 mt-2">VIETTYPING</h1>
          </div>
          
          <div className="space-y-2">
            <p className="text-slate-400 italic">Chứng nhận này được trao tặng một cách vinh dự cho học sinh</p>
            <h2 className="text-3xl font-extrabold text-cyan-400 py-3">{name.toUpperCase()}</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Vì đã hoàn thành xuất sắc lộ trình luyện gõ phím tiếng Việt cấp độ <strong className="text-slate-100">{level}</strong> với thành tích học tập vượt trội.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-12 max-w-md mx-auto py-4 bg-slate-950/80 rounded-lg border border-slate-800">
            <div>
              <p className="text-xs text-slate-500 uppercase">Tốc độ gõ phím</p>
              <p className="text-2xl font-bold text-slate-100">{wpm} WPM</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Độ chính xác</p>
              <p className="text-2xl font-bold text-slate-100">{accuracy}%</p>
            </div>
          </div>
          
          <div className="flex justify-between items-end text-sm text-slate-500 px-6">
            <div className="text-left">
              <p>Ngày cấp: {new Date().toLocaleDateString('vi-VN')}</p>
              <p>Mã hiệu: VT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="italic text-slate-400">Ban quản trị hệ thống</p>
              <p className="font-bold text-cyan-400">VietTyping Edu</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify in browser**
  Expected: Navigating to `/certificate/123?name=Nguyen+Van+Nam&level=Cao+cap&wpm=60&accuracy=99` yields a printable certificate frame.

- [ ] **Step 3: Commit**
  Run: `git add src/app/certificate/` & `git commit -m "feat: implement student completion certificate generator"`
