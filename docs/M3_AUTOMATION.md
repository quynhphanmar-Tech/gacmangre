# GẠC MĂNG RÊ — M3 AUTOMATION LAYER SPECIFICATION
**Version 1.0 · Milestone M3**

---

## 1. Mục Tiêu Nghiệm Thu M3
> **Chứng minh:** Một người đặt Ngăn $\rightarrow$ Hệ thống ghi nhận $\rightarrow$ Khách nhận được xác nhận $\rightarrow$ Khi gom đủ MOQ, cả Khách và Nhà sản xuất đều nhận được thông báo.

Tất cả diễn ra tự động mà **không bao giờ để tầng tự động hóa quyết định thay logic của cơ sở dữ liệu**.

---

## 2. Kịch Bản Tự Động Hóa Make (Make Scenarios)

### Scenario 01: ORDER_CREATED
1. **Trigger:** Webhook từ Supabase hoặc Poller bắt sự kiện mới có `event_type = 'ORDER_CREATED'` và `status = 'PENDING'`.
2. **Action 1:** Kiểm tra tính hợp lệ của chữ ký `x-make-secret`.
3. **Action 2:** Đọc dữ liệu đơn hàng và thông tin khách hàng từ payload.
4. **Action 3:** Gọi `NotificationService.sendOrderCreatedNotification()`.
5. **Action 4:** Đánh dấu sự kiện thành `PROCESSED` kèm `processed_at = NOW()`.

### Scenario 02: MOQ_REACHED
1. **Trigger:** Bắt sự kiện `event_type = 'MOQ_REACHED'` khi một Ngăn chuyển sang trạng thái `FULL`.
2. **Action 1:** Đọc thông tin Ngăn, số lượng gom thực tế, và thông tin Nhà sản xuất (`producer_id`).
3. **Action 2:** Gửi thông báo `"NGĂN ĐÃ ĐỦ"` tới danh sách khách hàng đã cùng mở Ngăn.
4. **Action 3:** Gửi thông báo `"NGĂN ĐÃ ĐỦ — VUI LÒNG XÁC NHẬN"` tới Zalo của Nhà sản xuất kèm đường dẫn xác nhận một chạm.
5. **Action 4:** Đánh dấu sự kiện thành `PROCESSED`.

---

## 3. Quản Lý Trạng Thái Lỗi & Cơ Chế Retry (Retry Semantics)

| Trạng thái | Ý nghĩa | Hành động tiếp theo |
| :--- | :--- | :--- |
| **`PENDING`** | Sự kiện vừa tạo, đang chờ Make lấy đi xử lý. | Make Worker tiếp nhận. |
| **`PROCESSING`** | Make đang kết nối Zalo API để bắn tin. | Đang chờ phản hồi mạng. |
| **`PROCESSED`** | Tin nhắn đã gửi thành công tới Zalo. | Kết thúc chu kỳ sự kiện. |
| **`FAILED`** | Zalo lỗi mạng hoặc số máy không nhận tin. Lưu `last_error`. | Cho phép Retry thủ công hoặc Cron tự động thử lại tối đa 3 lần. |

---

## 4. Chiến Lược Thay Thế Tầng Tự Động Hóa (Replacement Strategy)

Nếu trong tương lai chi phí của Make tăng hoặc cần tự chủ hạ tầng:
```text
MAKE SCENARIOS
      ↓ (Có thể thay thế trong 1 ngày)
N8N SELF-HOSTED WORKFLOWS
      ↓ (Hoặc thay bằng)
SUPABASE EDGE FUNCTIONS / NODE.JS CRON WORKER
```
Toàn bộ logic bảng `orders`, `customers`, `ngans` và bảng `events` hoàn toàn giữ nguyên, không cần cấu trúc lại hệ thống.
