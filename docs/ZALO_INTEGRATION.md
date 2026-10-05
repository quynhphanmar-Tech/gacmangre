# GẠC MĂNG RÊ — ZALO NOTIFICATION INTEGRATION
**Version 1.0 · Milestone M3**

> "Giao tiếp văn minh, chân thành, tôn trọng sự riêng tư của khách hàng và nhà sản xuất."

---

## 1. Bản Chất Kỹ Thuật Của Zalo Transactional Messaging

Trong hệ sinh thái Zalo tại Việt Nam, **không thể gửi tin nhắn tùy ý chỉ bằng số điện thoại đơn thuần**. Có 2 phương thức chính quy:

### 1.1. Zalo Notification Service (ZNS)
* **Cơ chế:** Gửi tin nhắn chăm sóc khách hàng dựa trên giao dịch phát sinh qua số điện thoại (+84/0xxx).
* **Điều kiện:**
  - Zalo Official Account (OA) phải được xác thực tích vàng doanh nghiệp.
  - Nội dung tin nhắn phải đăng ký trước dưới dạng **Template cố định** và được Zalo duyệt (Template ID).
  - Không chứa nội dung quảng cáo, khuyến mãi. Chỉ dùng cho: Xác nhận đơn, Trạng thái gom, Giao hàng.
* **Định danh người nhận:** Số điện thoại khách hàng (định dạng E.164: `84988112233`).

### 1.2. Zalo OA Message (Tin nhắn Tương tác OA)
* **Cơ chế:** OA gửi tin trực tiếp trong khung chat khi người dùng đã bấm **Quan tâm OA** hoặc đã từng tương tác với OA trong vòng 7 ngày (User ID / Zalo ID).
* **Ưu điểm:** Linh hoạt, có thể gửi kèm nút bấm tương tác (CTA Buttons), hình ảnh mộc mạc.

---

## 2. Kiến Trúc Adapter (Notification Provider Architecture)

Để đảm bảo hệ thống không bị phụ thuộc cứng vào việc cấp quyền của Zalo, mã nguồn triển khai mô hình **Provider Pattern**:

```text
               NotificationService
                       │
        ┌──────────────┴──────────────┐
        ↓                             ↓
   MockProvider                  ZaloProvider
 (Phát triển / Test)        (Zalo ZNS / OA Live API)
- Ghi log định dạng Zalo   - Ký chữ ký số HMAC
- Giả lập độ trễ mạng      - Đẩy payload ZNS Template
- Kiểm thử kịch bản lỗi    - Xử lý mã lỗi Zalo (130, -32...)
```

Cấu hình qua biến môi trường:
```bash
NOTIFICATION_PROVIDER=mock   # hoặc 'zalo' khi có credentials thật
```

---

## 3. Quy Chuẩn Bản Mẫu Tin Nhắn (ZNS Templates)

### Bản mẫu 1: Xác nhận đặt đơn (`ORDER_CREATED`)
* **Loại tin:** Giao dịch phát sinh (Transaction Notification)
* **Tiêu đề:** ĐẶT NGĂN THÀNH CÔNG
* **Các biến số (Variables):**
  - `customer_name`: Họ tên khách hàng
  - `ngan_number`: `#001`
  - `order_code`: `GM-2026-000075`
  - `quantity`: `1`
  - `current_quantity`: `74`
  - `moq`: `100`
  - `detail_url`: `https://gacmangre.com/order/GM-2026-000075`
* **Nội dung hiển thị:**
  ```text
  ĐẶT NGĂN THÀNH CÔNG
  Chào [customer_name], bạn đã cùng Gạc Măng Rê mở Ngăn [ngan_number].
  Mã đơn: [order_code]
  Số lượng: [quantity] phần
  Tiến trình hiện tại: [current_quantity] / [moq] người cùng mở.
  Gạc Măng Rê sẽ cập nhật cho bạn ngay khi Ngăn đủ mốc để người làm bắt đầu mẻ mới!
  👉 [ XEM TIẾN ĐỘ NGĂN ]
  ```

---

### Bản mẫu 2: Thông báo Ngăn đủ đầy gửi Khách hàng (`MOQ_REACHED` - Customer)
* **Loại tin:** Cập nhật trạng thái chiến dịch
* **Tiêu đề:** NGĂN ĐÃ ĐỦ
* **Các biến số:**
  - `customer_name`: Tên khách
  - `ngan_number`: `#001`
  - `product_name`: Mật ong bạc hà Mèo Vạc
  - `shipping_estimate`: 18–20/10/2026
* **Nội dung hiển thị:**
  ```text
  NGĂN ĐÃ ĐỦ
  Ngăn [ngan_number] ([product_name]) đã đủ người cùng mở!
  Gạc Măng Rê đang tiến hành xác nhận mẻ hàng với người làm tại Mèo Vạc.
  Cảm ơn bạn đã cùng mở Ngăn.
  Dự kiến giao hàng: [shipping_estimate]
  ```

---

### Bản mẫu 3: Thông báo gửi Nhà sản xuất (`MOQ_REACHED` - Producer)
* **Người nhận:** Số điện thoại / Zalo của Nhà sản xuất (Anh Giàng A Páo: `0912345678`)
* **Nội dung:**
  ```text
  🐝 THÔNG BÁO MẺ HÀNG: NGĂN [ngan_number] ĐÃ ĐỦ
  Kính gửi anh [producer_name],
  Sản vật: [product_name]
  Số lượng xác nhận: [confirmed_quantity] phần
  Số người tham gia: [total_orders] khách hàng

  Gạc Măng Rê đã đạt đủ chỉ tiêu MOQ. Kính nhờ anh bấm xác nhận khả năng cung ứng:
  👉 [ XÁC NHẬN CUNG ỨNG ]([confirmation_url])
  ```

---

## 4. Xử Lý Giới Hạn & Lỗi (Rate Limits & Failure Handling)

* **Giới hạn tốc độ:** ZNS cho phép tối đa 30 tin/giây. Với quy mô MVP 100 phần/Ngăn, lưu lượng hoàn toàn nằm trong ngưỡng an toàn.
* **Xử lý khi số điện thoại không có Zalo:**
  - Zalo trả về mã lỗi `error: -130 (User not found)`.
  - Hệ thống ghi nhận `last_error = 'ZALO_USER_NOT_FOUND'`, đánh dấu `status = 'FAILED'`, nhưng đơn hàng vẫn ở trạng thái `CONFIRMED`.
  - Admin có thể liên hệ trực tiếp qua điện thoại truyền thống.
