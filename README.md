# GẠC MĂNG RÊ — CẤT VỊ QUÊ NHÀ
**MVP Version 1.0 (Golden Sample — Ngăn #001)**

> "Có những thứ ngon không dễ tìm. Có những người làm rất tử tế nhưng ít người biết đến. Gạc Măng Rê đi tìm họ."

---

## 1. Triết lý & Mô hình Cốt lõi
- **Không phải sàn thương mại điện tử:** Không gom hàng ngàn SKU vô danh. Curation Moat tuyển chọn các sản vật đắt giá nhất theo 4 tiêu chuẩn: **ĐẤT · NGƯỜI · VỊ · CHUYỆN**.
- **Đơn vị trung tâm là NGĂN:** Mỗi Ngăn là một mẻ thu hoạch/chế biến tươi từ vùng đất bản địa, chỉ bắt đầu sản xuất và xuất mẻ khi cộng đồng cùng gom đủ mốc **MOQ (Minimum Order Quantity)**.
- **Story-Commerce Flow:** `Social → Story → Ngăn #001 → Form đặt ngăn → Gom đủ MOQ → Nhà sản xuất xác nhận → Vận chuyển → Lấy phản hồi (Hậu vị)`.

---

## 2. Tech Stack

- **Frontend:** Next.js 15 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS (Rustic Vietnamese Earthy Palette)
- **Database & Backend:** Supabase (PostgreSQL 15+, RLS, Computed MOQ Triggers, Events Table)
- **Automation Layer:** Make (Integromat) Webhooks
- **Customer & Producer Messaging:** Zalo OA & ZNS
- **Hosting:** Vercel

---

## 3. Cấu trúc thư mục

```text
├── app/
│   ├── layout.tsx                     # Root layout, Header & Footer
│   ├── page.tsx                       # Homepage: Hero, Active Ngăn #001, Story & Curation
│   ├── stories/[slug]/page.tsx        # Chi tiết câu chuyện sản vật & người làm
│   ├── ngan/[slug]/page.tsx           # Chi tiết Ngăn #001 (Story, Gom đơn, Sticky CTA)
│   ├── dat-hang/[slug]/page.tsx       # Form đặt ngăn tối giản, không bắt tạo tài khoản
│   ├── order/[id]/page.tsx            # Xác nhận đơn hàng & tiến độ gom MOQ
│   ├── da-mo/page.tsx                 # Lưu trữ các ngăn đã mở
│   ├── ve-gac-mang-re/page.tsx        # Tuyên ngôn thương hiệu & 4 tiêu chuẩn
│   ├── admin/page.tsx                 # Dashboard quản trị P0 (Ngăn, Đơn hàng, NSX)
│   └── api/
│       ├── orders/route.ts            # Server-side API tiếp nhận đơn & kích hoạt MOQ
│       └── webhooks/make/route.ts     # Webhook tích hợp kịch bản tự động hóa Make
├── components/
│   ├── Navbar.tsx                     # Header thương hiệu mộc bản
│   ├── Footer.tsx                     # Footer & triết lý cất vị
│   ├── ProgressBar.tsx                # Thanh tiến trình MOQ trực quan
│   └── NganCard.tsx                   # Card Ngăn đang mở
├── docs/
│   ├── PRODUCT_BRIEF.md               # Bản mô tả sản phẩm & nguyên tắc định vị
│   ├── ARCHITECTURE.md                # Kiến trúc kỹ thuật & nguyên tắc Source of Truth
│   ├── BUSINESS_RULES.md              # Ràng buộc MOQ & State Machine chi tiết
│   └── AUTOMATION.md                  # Kịch bản Make Webhook & mẫu tin nhắn Zalo OA
├── lib/
│   ├── supabase/                      # Client & Server Supabase connectors
│   └── data/                          # Mock store & Fallback data cho Ngăn #001
├── services/                          # Business logic services (Ngăn, Story, Order)
├── supabase/
│   ├── migrations/                    # SQL migration tạo schema, enum, trigger MOQ
│   └── seed/                          # Seed data mẫu cho Ngăn #001 Mật ong Hà Giang
└── types/                             # TypeScript type definitions
```

---

## 4. Hướng dẫn Khởi chạy Local

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Thiết lập biến môi trường
Tạo file `.env.local` từ `.env.example`:
```bash
cp .env.example .env.local
```

*(Lưu ý: Hệ thống đã tích hợp sẵn cơ chế **Resilient Fallback Mode**. Dù bạn chưa điền Supabase credentials thật, toàn bộ luồng Golden Sample Ngăn #001 vẫn hoạt động trơn tru 100% để kiểm thử ngay lập tức).*

### Bước 3: Chạy môi trường phát triển
```bash
npm run dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## 5. Cài đặt Supabase & Chạy Migration

1. Tạo dự án mới trên [Supabase](https://supabase.com).
2. Mở **SQL Editor** trong Supabase Dashboard.
3. Chạy file `supabase/migrations/20261005000000_init_schema.sql` để khởi tạo bảng, enums, triggers tính toán MOQ và RLS policies.
4. Chạy file `supabase/seed/seed_ngan_001.sql` để nạp dữ liệu mẫu Ngăn #001 (Mật ong bạc hà Mèo Vạc).
5. Copy `Project URL` và `Anon Key` vào file `.env.local`.

---

## 6. Kiểm thử Golden Flow (P0)

1. **Brand Entry & Discovery:** Truy cập trang chủ `/`, đọc Hero và xem card Ngăn #001.
2. **Kể chuyện (Story):** Bấm "Đọc Câu Chuyện #001" để vào bài viết ký sự thực địa Mèo Vạc.
3. **Mở Ngăn:** Bấm "Khám Phá Các Ngăn" hoặc "Mở Ngăn Này" để xem chi tiết Ngăn #001 và thanh tiến trình gom MOQ (`74/100 phần`).
4. **Đặt Ngăn:** Bấm nút CTA "ĐẶT NGĂN NÀY", điền thông tin người nhận (Họ tên, SĐT, Địa chỉ, Số lượng).
5. **Xác nhận & Cập nhật MOQ:** Bấm "Xác Nhận Đặt Ngăn", hệ thống sinh mã đơn `GM-2026-XXXXXX`, tự động cộng dồn số lượng vào mốc MOQ và hiển thị trang hoàn tất.
6. **Admin P0:** Truy cập `/admin` để xem danh sách đơn hàng vừa đặt, chuyển trạng thái đơn, hoặc mô phỏng tiến độ gom đủ 100% MOQ.
