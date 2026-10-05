# GẠC MĂNG RÊ — ARCHITECTURE SPECIFICATION

## 1. Nguyên tắc kiến trúc (Architecture Principles)

```text
                 FRONTEND (Next.js App Router)
                            │
                            ↓ (Server Actions / Route Handlers)
                       SUPABASE
                  SOURCE OF TRUTH (PostgreSQL)
                            │
                  ┌─────────┴─────────┐
                  ↓                   ↓
             BUSINESS LOGIC         EVENTS TABLE
           (PostgreSQL Triggers)      │
                                      ↓ (Database Webhooks)
                                    MAKE (Automation Layer)
                                      │
                                 ┌────┴────┐
                                 ↓         ↓
                              ZALO OA    OTHER SERVICES
```

### Nguyên tắc bất di bất dịch:
1. **Supabase là Source of Truth duy nhất.** Toàn bộ dữ liệu, quan hệ, validation ràng buộc, và tính toán MOQ (`SUM(valid orders)`) phải được thực thi ở tầng database.
2. **Make chỉ là Automation & Notification Layer.** Business logic không bao giờ được phụ thuộc vào Make. Nếu tắt Make hoặc thay thế bằng n8n hay Custom Worker, hệ thống lõi vẫn hoàn toàn nguyên vẹn và chuẩn xác.
3. **Client không bao giờ tự tính hoặc ghi đè trạng thái MOQ / Order status.** Toàn bộ thao tác thay đổi trạng thái đều đi qua API Server-Side được kiểm tra quyền hạn nghiêm ngặt.

## 2. Tech Stack Chi tiết

| Thành phần | Công nghệ | Vai trò |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router, React 19, TypeScript) | Giao diện Story-Commerce, Server-side rendering chuẩn SEO, tốc độ cao |
| **Styling** | Tailwind CSS v3 | Thiết kế mang bảng màu mộc bản Việt Nam (Earth, Ochre, Clay, Bamboo) |
| **Database** | Supabase (PostgreSQL 15+) | RDBMS quan hệ, Row-Level Security (RLS), Triggers, Computed Columns |
| **Automation** | Make (Integromat) Webhooks | Bắt event từ DB để bắn tin nhắn Zalo OA, thông báo đơn hàng |
| **Communication**| Zalo OA + ZNS (Zalo Notification Service) | Kênh giao tiếp chính với khách hàng và nhà sản xuất |
| **Analytics** | GA4 + PostHog | Đo lường Funnel: Story → Ngăn → Order → MOQ |
| **Hosting** | Vercel | Edge deployment tự động tích hợp GitHub |

## 3. Sitemap và Định tuyến URL
```text
/                          -> Trang chủ (Hero cảm xúc, Ngăn đang mở, Danh sách câu chuyện)
/stories/[slug]            -> Chi tiết câu chuyện sản vật & người làm
/ngan/[slug]               -> Chi tiết Mở Ngăn #001 (Story, Người làm, Đất/Người/Vị/Chuyện, Gom đơn, CTA Đặt)
/da-mo                     -> Lưu trữ các Ngăn đã hoàn thành/đóng
/nha-san-xuat/[slug]       -> Hồ sơ nhà sản xuất chân phương
/ve-gac-mang-re            -> Tuyên ngôn thương hiệu, triết lý cất vị
/dat-hang/[ngan-slug]      -> Trang đặt ngăn tối giản (prefilled)
/order/[order-id]          -> Trang xác nhận đơn hàng thành công, hiển thị tiến độ Ngăn trực tiếp
/admin                     -> Dashboard quản trị P0: Ngăn, Đơn hàng, Nhà sản xuất, Vận hành
/admin/ngan                -> Quản lý trạng thái Ngăn & mốc MOQ
/admin/orders              -> Quản trị và lọc đơn hàng theo trạng thái
/admin/producers           -> Danh sách nhà sản xuất và xác nhận cung ứng
```
