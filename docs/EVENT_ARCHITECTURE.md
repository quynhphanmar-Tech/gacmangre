# GẠC MĂNG RÊ — EVENT ARCHITECTURE SPECIFICATION
**Version 1.0 · Milestone M3**

> "Supabase là Source of Truth duy nhất. Make chỉ là tầng tự động hóa phản ứng theo sự kiện. Sự cố ở tầng tự động hóa không bao giờ được làm sai lệch dữ liệu giao dịch."

---

## 1. Nguyên Tắc Cốt Lõi (Architecture Principles)

```text
              SUPABASE (PostgreSQL)
               [SOURCE OF TRUTH]
                       │
       ┌───────────────┴───────────────┐
       ↓                               ↓
  ORDERS TABLE                    EVENTS TABLE
(Business Transaction)         (Event Dispatch Queue)
  [CONFIRMED / UNPAID]             [PENDING]
                                       │
                                       ↓ (Asynchronous Webhook / Poller)
                              MAKE / INTEGROMAT
                            (Automation Adapter)
                                       │
                         ┌─────────────┴─────────────┐
                         ↓                           ↓
                 CUSTOMER NOTIFICATION       PRODUCER NOTIFICATION
                    (Zalo OA / ZNS)             (Zalo 1-Touch Link)
```

### Nguyên tắc bất di bất dịch:
1. **Make KHÔNG BAO GIỜ quyết định logic nghiệp vụ:**
   * ❌ **SAI:** Make đếm số đơn $\rightarrow$ Make tự kết luận MOQ $\rightarrow$ Make ghi ngược lại database.
   * ✅ **ĐÚNG:** Supabase tính toán atomic $\rightarrow$ Supabase ghi sự kiện `MOQ_REACHED` vào bảng `events` $\rightarrow$ Make chỉ nhận sự kiện đã rồi để gửi tin nhắn.
2. **Decoupling (Phân tách độc lập):**
   * Nếu Make sập, Zalo bảo trì, hoặc mạng gián đoạn $\rightarrow$ Giao dịch của khách hàng **vẫn hoàn tất thành công 100%**.
   * Trạng thái sự kiện chuyển thành `FAILED` với `retry_count` tăng dần để hệ thống tự động thử lại sau. Đơn hàng tuyệt đối không bị hủy hay rollback.
3. **Thay thế dễ dàng (Pluggable):**
   * Tầng tự động hóa Make được trừu tượng hóa qua `NotificationService`. Sau này có thể chuyển sang n8n hoặc Custom Worker Node.js mà không cần sửa đổi dù chỉ 1 dòng logic cốt lõi.

---

## 2. Event Lifecycle & Trạng Thái

```text
   [ INSERT ]
        ↓
    PENDING      ──→  Sự kiện vừa được sinh ra cùng transaction tạo đơn/đạt MOQ
        ↓
   PROCESSING    ──→  Make hoặc Dispatcher đã tiếp nhận và đang gửi tin
        │
   ┌────┴──────────────────────────┐
   ↓                               ↓
PROCESSED                       FAILED
(Gửi thành công,               (Zalo/Mạng lỗi, lưu `last_error`,
 cập nhật `processed_at`)       cho phép retry theo backoff)
```

---

## 3. Danh Mục Sự Kiện M3 (Event Specifications)

### 3.1. `ORDER_CREATED`
* **Kích hoạt khi:** Một khách hàng đặt đơn hợp lệ được lưu vào bảng `orders`.
* **Entity:** `order` (ID của đơn hàng).
* **Payload:**
  ```json
  {
    "order_id": "c7a8...",
    "order_code": "GM-2026-000075",
    "ngan_id": "c333...",
    "ngan_number": "#001",
    "product_name": "Mật ong bạc hà hoa dại Hà Giang",
    "customer_name": "Nguyễn Thuỳ Chi",
    "customer_phone": "0988112233",
    "customer_zalo": "0988112233",
    "quantity": 1,
    "current_total_quantity": 74,
    "moq": 100,
    "created_at": "2026-10-06T00:00:00Z"
  }
  ```

### 3.2. `MOQ_REACHED`
* **Kích hoạt khi:** Đơn hàng mới khiến tổng số phần gom đạt hoặc vượt `moq` ($\ge 100$).
* **Entity:** `ngan` (ID của Ngăn).
* **Payload:**
  ```json
  {
    "ngan_id": "c333...",
    "ngan_number": "#001",
    "product_name": "Mật ong bạc hà hoa dại Hà Giang",
    "producer_id": "a111...",
    "producer_name": "Giàng A Páo",
    "producer_phone": "0912345678",
    "producer_zalo": "0912345678",
    "moq": 100,
    "total_quantity": 100,
    "total_orders": 82,
    "triggered_at": "2026-10-06T00:00:00Z"
  }
  ```

---

## 4. Bảo Vệ Replay & Idempotency ở Tầng Automation

1. **Webhook Signature & Secret:** Mọi request từ Make gọi vào backend đều phải mang header `x-make-secret`.
2. **Event Idempotency:** Trước khi gửi tin, provider kiểm tra xem `event_id` đó đã ở trạng thái `PROCESSED` chưa. Nếu đã gửi rồi, bỏ qua để tránh spam khách hàng.
