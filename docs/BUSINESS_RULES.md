# GẠC MĂNG RÊ — BUSINESS RULES & STATE MACHINE

## 1. Ràng buộc & Tính toán MOQ (Minimum Order Quantity)

1. **Khái niệm:** Mỗi Ngăn có một chỉ tiêu gom đơn tối thiểu (`moq`, ví dụ: 100 phần) để nhà sản xuất có thể khởi động quy trình khai thác và đóng gói mẻ sản vật tươi chuẩn chất lượng.
2. **Công thức tính toán:**
   $$\text{current\_quantity} = \sum_{\text{order } \in \text{ Active Orders}} \text{quantity}$$
   * Trong đó: `Active Orders` là các đơn hàng ở trạng thái hợp lệ (`CONFIRMED`, `PAID`, `FULFILLING`, `SHIPPED`, `DELIVERED`). Đơn bị `CANCELLED` sẽ bị loại trừ ngay lập tức khỏi tổng.
3. **Cơ chế chuyển đổi trạng thái tự động:**
   * Khi `current_quantity < moq`: Ngăn ở trạng thái `OPEN`.
   * Khi `current_quantity >= moq`: Ngăn tự động chuyển sang trạng thái `FULL` và sinh sự kiện `MOQ_REACHED`.
   * Khách đặt tiếp sau khi chạm MOQ: Tùy theo `capacity` tối đa của mẻ (nếu còn mở thêm slot), hoặc dừng nhận đơn bổ sung.

## 2. State Machine: Vòng đời Ngăn (Ngăn Lifecycle)

```text
DRAFT                -> Đang biên soạn nội dung, kiểm duyệt thông tin vùng đất/người làm
  ↓
PUBLISHED            -> Câu chuyện đã lên sóng để cộng đồng theo dõi
  ↓
OPEN                 -> Chính thức mở nhận đơn gom (Pre-order)
  ↓
FULL (MOQ REACHED)   -> Đã gom đủ số lượng tối thiểu, kích hoạt thông báo cho Nhà sản xuất & Khách
  ↓
PRODUCER_CONFIRMING  -> Chờ nhà sản xuất xác nhận một chạm qua Zalo
  ↓
PRODUCTION           -> Nhà sản xuất đang thu hoạch/chiết rót/đóng gói theo số lượng chuẩn
  ↓
SHIPPING             -> Đơn hàng đã được xuất kho và giao cho đơn vị vận chuyển
  ↓
COMPLETED            -> Tất cả đơn trong Ngăn đã giao thành công, thu nhận phản hồi
```

*Các nhánh rẽ ngoại lệ:*
* `OPEN` $\rightarrow$ `EXPIRED`: Quá hạn gom (`deadline`) mà không đủ MOQ.
* `OPEN` $\rightarrow$ `CANCELLED`: Lý do bất khả kháng (thời tiết, mất mùa...).

## 3. State Machine: Vòng đời Đơn hàng (Order Lifecycle)

```text
CREATED             -> Khách vừa gửi form đặt ngăn
  ↓
CONFIRMED           -> Hệ thống xác nhận đơn hợp lệ (tính vào MOQ)
  ↓
PAYMENT_PENDING     -> (Dự phòng cho luồng cọc/thanh toán khi đủ ngăn)
  ↓
PAID                -> Đã thanh toán thành công
  ↓
FULFILLING          -> Đơn hàng đang được chuẩn bị đóng gói tại nguồn
  ↓
SHIPPED             -> Đã có mã vận đơn và đang trên đường giao
  ↓
DELIVERED           -> Đã giao thành công tới khách hàng
```

*Trạng thái kết thúc thất bại:* `CANCELLED`, `REFUNDED`.

## 4. Quy tắc xác thực Form đặt hàng (Order Form Validation)

- **Họ tên:** Tối thiểu 2 ký tự, chuẩn hóa khoảng trắng.
- **Số điện thoại:** Định dạng số điện thoại Việt Nam chuẩn (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09 hoặc chuẩn quốc tế +84).
- **Zalo:** Số điện thoại hoặc Zalo Identifier để nhận tin hành trình đơn.
- **Địa chỉ:** Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố rõ ràng để phục vụ giao hàng mẻ tươi.
- **Số lượng:** Số nguyên dương lớn hơn 0 (mặc định giới hạn tối đa ví dụ 10 phần/khách để tránh đầu cơ gom hết ngăn).
