# GẠC MĂNG RÊ — DESIGN SYSTEM SPECIFICATION (M0.5)
**Version 1.0 · A Digital Pantry of Vietnam**

> "Một chiếc tủ cũ của người Việt được mở lại bằng tư duy digital hiện đại."  
> Reference: Jubilee Organics (Học nguyên lý editorial, photography-led, mobile-first, visual rhythm & whitespace).

---

## 1. Design Principles (Nguyên lý Thiết kế)

1. **Editorial × Digital Product:** Kết hợp trải nghiệm đọc sâu lắng của một tạp chí văn hóa với sự mạch lạc, tốc độ cao và tiện lợi không ma sát của một digital product hiện đại.
2. **Quietly Premium, Not Vintage Cliché:** Không dùng texture gỗ sần sùi giả lập hay họa tiết dân gian rườm rà. Tinh thần cao cấp đến từ khoảng trắng (whitespace), typography chuẩn mực và tỷ lệ bố cục thanh thoát.
3. **The Pantry Metaphor (Chiếc Tủ):** Không làm hoạt họa mở cánh tủ literal (graphic gimmick). Chiếc tủ là kiến trúc phân tầng thông tin: mỗi **Ngăn** là một đơn vị chứa đựng một vùng đất, một người làm, một sản vật, một câu chuyện và một cộng đồng cùng mở.
4. **Mobile-First Heritage:** Giao diện được thiết kế ưu tiên 100% cho trải nghiệm trên màn hình dọc (nguồn lưu lượng chính từ mạng xã hội), với Sticky CTA cố định và nhịp đọc ngắn, giàu hình ảnh.

---

## 2. Color Tokens (Hệ Thống Màu Sắc)

Bảng màu được xây dựng dựa trên nguyên tắc: **Warm Ivory + Paper + Ink + Local Accent**.

| Token Name | Hex Code | Tailwind Class | Ứng Dụng |
| :--- | :--- | :--- | :--- |
| **ivory-DEFAULT** | `#FAF8F5` | `bg-ivory` / `bg-[#FAF8F5]` | Nền chính toàn bộ website (ấm áp như màu giấy cũ) |
| **ivory-100** | `#F7F3EB` | `bg-ivory-100` | Nền các section phóng sự, trích dẫn thực địa |
| **ivory-200** | `#EFE8DC` | `bg-ivory-200` | Nền track progress bar, tag phân loại |
| **paper-light** | `#FFFFFF` | `bg-white` | Bề mặt card Ngăn, form đặt hàng (tạo chiều sâu nổi nhẹ) |
| **paper-border** | `#E7DFD3` | `border-[#E7DFD3]` | Đường hairline phân cách thanh mảnh, tinh tế |
| **ink-deep** | `#141211` | `text-[#141211]` | Chữ tiêu đề chính, nút CTA chính (đen mực tàu lắng đọng) |
| **ink-DEFAULT** | `#262220` | `text-[#262220]` | Chữ nội dung bài viết, body text |
| **ink-light** | `#423B36` | `text-[#423B36]` | Chữ phụ đề, trích dẫn ký sự |
| **ink-lighter** | `#665E58` | `text-[#665E58]` | Caption ảnh, metadata, nhãn phụ, ngày tháng |
| **amberWood-500** | `#C27835` | `text-[#C27835]` | Accent Ngăn #001: Mật ong hoa dại cao nguyên đá |
| **amberWood-600** | `#A65F25` | `bg-[#A65F25]` | Hover state nút mở ngăn, điểm nhấn tiến độ |
| **sagePantry-700**| `#364731` | `text-emerald-800` | Trạng thái xác nhận, mẻ đã đạt đủ 100% MOQ |

---

## 3. Typography (Hệ Thống Kiểu Chữ)

### 3.1. Editorial Serif — `Newsreader`
* **Công năng:** Headlines, Section Title, Pull Quotes, Ký sự thực địa, Tên địa danh.
* **Đặc tính:** Font serif đương đại với các đường nét thanh tú, mô phỏng cảm giác in ấn trên sách văn học và tạp chí cao cấp.
* **Hierarchy:**
  - Hero Headline: `font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.12]`
  - Section Title: `font-serif text-3xl sm:text-4xl font-bold leading-tight`
  - Card Title: `font-serif text-2xl font-bold leading-snug`
  - Pull Quote: `font-serif text-lg sm:text-xl italic leading-relaxed`

### 3.2. Contemporary Sans-Serif — `Inter`
* **Công năng:** Navigation, Button CTA, Price, MOQ Progress, Forms, Data, Meta labels.
* **Đặc tính:** Cực kỳ rõ ràng, trung tính, tối ưu hóa hiển thị trên màn hình di động độ phân giải cao.
* **Hierarchy:**
  - Nav Label: `text-xs uppercase font-semibold tracking-[0.22em]`
  - Button Text: `text-xs uppercase font-bold tracking-[0.22em]`
  - Price Hero: `font-sans text-base font-semibold` / `font-serif text-3xl font-bold`
  - Meta/Caption: `text-[11px] font-sans font-medium text-[#665E58]`

### 3.3. Technical Data Mono — `JetBrains Mono`
* **Công năng:** Mã ngăn (`NGĂN #001`), Mã đơn hàng (`GM-2026-000073`), Tỷ lệ hoàn thành (`74%`).

---

## 4. Spacing & Grid System

* **Base Unit:** 4px (Tailwind standard).
* **Container Max-widths:**
  - Page container: `max-w-6xl mx-auto px-5 sm:px-8` (1152px)
  - Focused Reading (Story / Detail): `max-w-4xl mx-auto` (896px)
  - Narrow Editorial Essay: `max-w-3xl mx-auto` (768px)
  - Transactional Forms: `max-w-xl mx-auto` (576px)
* **Vertical Rhythm:**
  - Section Spacing (Desktop): `space-y-28 md:space-y-36` / `py-24`
  - Section Spacing (Mobile): `space-y-20` / `py-14`
  - Card Internal Padding: `p-7` (Desktop), `p-5` (Mobile)

---

## 5. UI Components

### 5.1. Buttons
* **Primary Button (Mở Ngăn):**
  - Style: `rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#A65F25] transition-all duration-300 shadow-md hover:shadow-lg`
  - Sizing: `px-9 py-4` (Desktop Hero/Footer), `px-5 py-2.5` (Card Inline)
* **Secondary Button:**
  - Style: `rounded-full bg-[#EFE8DC]/60 border border-[#E7DFD3] text-[#423B36] text-xs uppercase tracking-pantryst font-semibold hover:bg-[#EFE8DC] transition-all duration-300`
* **Mobile Sticky CTA:**
  - Vị trí: `fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E7DFD3] p-4 shadow-2xl lg:hidden`
  - Tích hợp: Tên ngăn + Giá tiền bên trái + Nút `MỞ NGĂN` full-width bên phải.

### 5.2. Ngăn Card (Hé Mở Ngăn Tủ)
* Card viền hairline mảnh `border-[#E7DFD3]`, bo góc `rounded-2xl`, bóng đổ `shadow-pantry`.
* Đỉnh card có hairline accent bar ẩn hiện khi hover (`group-hover:bg-[#A65F25]`).
* Ảnh chụp tỷ lệ `16/10` kèm thẻ ngăn `NGĂN #001` và huy hiệu xuất xứ `MapPin Hà Giang`.
* Thông số tiến độ `74 / 100 người cùng mở` · `Còn 26 phần để mở Ngăn`.
* Giá tiền hiển thị trang nhã, không lấn át nút mở ngăn.

### 5.3. Progress Bar (Tiến độ Gom Đơn)
* Track bo tròn hoàn toàn `rounded-full bg-[#EFE8DC] h-2.5 overflow-hidden`.
* Bar lấp đầy chuyển động êm `transition-all duration-700 ease-out bg-[#A65F25]`.
* Khi chạm 100%: Chuyển sang xanh sẫm `bg-emerald-700` kèm thông báo: *"Đã đủ mốc mở ngăn · Người làm đang chuẩn bị mẻ mới"*.

---

## 6. Image Treatment & Photography Rules

* **Tỷ lệ khung hình:** `16/9` cho ảnh bìa ký sự, `16/10` cho card ngăn, `4/3` cho ảnh vuông chi tiết, `1/1` bo tròn cho chân dung người làm.
* **Xử lý màu:** Tự nhiên, ấm áp, độ tương phản vừa phải, không áp filter giả cổ hay chỉnh màu rực rỡ sai thực tế.
* **Caption & Credit:** Luôn đính kèm nguồn ảnh, credit người chụp và loại asset (`DOCUMENTARY`, `SOURCE`, `EDITORIAL`) ở chân ảnh.

---

## 7. Reusability for Ngăn #002+ (Mở rộng cho các ngăn tiếp theo)

Khi mở Ngăn mới (ví dụ Ngăn #002: Chè Shan Tuyết Cổ Thụ Tà Xùa, Ngăn #003: Nước mắm cốt nhĩ Phú Quốc), chỉ cần:
1. Gán mã định danh và số thứ tự ngăn (`number: '#002'`).
2. Chọn Accent Color phù hợp với sản vật (ví dụ Chè Shan Tuyết: Deep Forest Moss `#2E4A34`, Nước mắm: Muted Terracotta `#9E4732`).
3. Kế thừa nguyên vẹn Typography, Spacing, Formats và State Machine mà không cần viết lại giao diện.
