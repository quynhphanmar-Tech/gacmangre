# GẠC MĂNG RÊ — M2.1 UAT & HARDENING REPORT
**Version 1.0 · Date: 06/10/2026**
**Environment:** Localhost & Network Dev (Next.js 15.5 App Router)

---

## 1. Executive Summary

Milestone M2 (Order Engine) has undergone end-to-end user acceptance testing (UAT), mobile viewport verification, concurrency checks, data integrity inspection, and security hardening.

**Result: 10/10 Test Scenarios PASSED. 0 P0 Blockers. Ready for M3 Automation Layer.**

---

## 2. Test Cases & Verification Matrix

| ID | Test Case | Expected Result | Actual Result | Status | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Direct Navigation (A1)**<br>`/ngan/[slug]` $\rightarrow$ Click CTA "MỞ NGĂN" | Navigates directly to `/dat-hang/[slug]` without intermediate cart pages. | Navigated immediately to form; parameters pre-filled. | **PASS** | - |
| **TC-02** | **Server-side Form Validation (A1)**<br>Submit invalid phone or short name | HTTP 400 with human-readable error; input data preserved. | Form retains input; displays inline alert without losing state. | **PASS** | - |
| **TC-03** | **Order Code Sequencing (A1)**<br>Submit valid order | Sequential order code `GM-2026-XXXXXX` generated server-side. | Codes generated monotonically (`GM-2026-000074`, `000075`...). | **PASS** | - |
| **TC-04** | **Idempotency Protection (A4)**<br>Double click submit button or network retry with same `idempotency_key` | Only 1 order created in database; second request returns `is_duplicate: true` with existing order. | Identical order code returned; no duplicate record inserted. | **PASS** | - |
| **TC-05** | **Capacity Guard (A1)**<br>Order quantity exceeding remaining MOQ capacity | HTTP 409 `QUANTITY_UNAVAILABLE`; order rejected. | System reports remaining capacity; blocks over-ordering. | **PASS** | - |
| **TC-06** | **Confirmation Refresh (A1)**<br>Hard refresh `/order/[order-code]` | Page renders order and MOQ status without creating any new order. | Idempotent read query; returns current state accurately. | **PASS** | - |
| **TC-07** | **Mobile Viewport 390×844 (A2)**<br>iPhone 12/13/14 viewport | No horizontal overflow; sticky CTA visible at bottom; input touch targets $\ge 48$px. | Clean layout; zero overflow; keyboard inputs use `inputMode="numeric"` for phone. | **PASS** | - |
| **TC-08** | **Mobile Viewport 375×812 & 430×932 (A2)**<br>iPhone SE / Mini / Pro Max | Spacing, typography, and buttons adapt seamlessly. | All elements fit within viewport; responsive typography renders cleanly. | **PASS** | - |
| **TC-09** | **Data Integrity Check (A3)**<br>Inspect demand calculation | Exactly ONE source of truth: `SUM(valid confirmed orders)`. | Derived dynamically; no frontend price or quantity can spoof database. | **PASS** | - |
| **TC-10** | **Security & Secrets Check (A5)**<br>Inspect client bundle and network calls | `SUPABASE_SERVICE_ROLE_KEY` is never sent to browser; client cannot alter price or status. | Zero leaked secrets; server route actions execute with strict boundaries. | **PASS** | - |

---

## 3. Data Integrity & Concurrency Architecture

### Single Source of Truth
* **Demand Truth:** Phép tính nhu cầu thực tế là:
  $$\text{Current Demand} = \sum_{\text{order } \in \text{ Confirmed Orders}} \text{quantity}$$
* `current_quantity` trên bảng `ngans` chỉ đóng vai trò **read-optimized cache**, được tính toán và cập nhật lại bằng database trigger hoặc atomic function `fn_create_order_atomic()`. Frontend không có quyền ghi đè trường này.
* Khi hai người dùng cùng đặt hàng tại thời điểm mẻ còn 1 phần, câu lệnh `SELECT ... FOR UPDATE` khóa dòng Ngăn trong transaction, đảm bảo một đơn thành công và đơn tiếp theo nhận lỗi `QUANTITY_UNAVAILABLE`, tuyệt đối không vượt quá mốc 100/100.

---

## 4. Security Review & Current Limitations

1. **Client / Server Boundary:**
   - Giá sản phẩm (`280.000đ`), mốc MOQ (`100`), và trạng thái đơn hàng (`CONFIRMED`, `UNPAID`) đều được server đọc trực tiếp từ dữ liệu gốc. Client chỉ gửi `{ name, phone, address, quantity, idempotency_key }`.
2. **Admin Route Security Limitation (MVP Scope):**
   - Tuyến đường `/admin` hiện tại dùng để nội bộ kiểm tra đơn và theo dõi vận hành P0, chưa gắn phiên đăng nhập Supabase Auth (OAuth/Email).
   - *Khuyến nghị:* Trước khi launch production mở rộng, sẽ bổ sung lớp Middleware xác thực HTTP Basic Auth hoặc Supabase Auth Admin Role.
3. **No Payment Gateway (PM Lock):**
   - Đơn hàng được gắn cứng `payment_status = 'UNPAID'`. Hệ thống đang thu thập tín hiệu nhu cầu thực tế, không giữ thông tin thẻ hay tiền của khách hàng.

---

## 5. Conclusion

Phase A hoàn thành xuất sắc. Động cơ giao dịch M2 đã được tôi luyện và sẵn sàng cho việc đấu nối tầng tự động hóa **M3 — AUTOMATION LAYER**.
