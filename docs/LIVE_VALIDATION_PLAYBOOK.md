# GẠC MĂNG RÊ — LIVE VALIDATION PLAYBOOK (SPRINT GM-LIVE-01)
**Thời gian:** 7 ngày kể từ khi khởi chạy · **Version:** 1.0

> "Không coi đây là một ecommerce launch. Đây là thử nghiệm thị trường đầu tiên của Gạc Măng Rê: Kiểm chứng xem người ta có muốn nghe câu chuyện, có muốn mở Ngăn, và có sẵn sàng để lại đơn không."

---

## 1. Thiết Kế Thử Nghiệm 4 Ngăn (Differentiated MOQ Test)

Sprint GM-LIVE-01 được cấu hình với 4 nhóm sản vật thực tế có mốc MOQ và danh mục khác biệt để đo lường độ nhạy cảm của người dùng:

| Mã Thử Nghiệm | Ngăn | Sản Vật | Danh mục | MOQ Thử Nghiệm | Đơn Vị | Vùng Đất |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GM-LIVE-01-001` | **#001** | Cacao Lên Men Thủ Công OCA | `CACAO` | **30 phần** | Hộp 250g | Cao Bằng / Đắk Lắk |
| `GM-LIVE-01-002` | **#002** | Cà Phê Đặc Sản Aeroco Farm | `COFFEE` | **50 phần** | Túi 250g | Buôn Ma Thuột, Đắk Lắk |
| `GM-LIVE-01-003` | **#003** | Mật Ong Bạc Hà Mèo Vạc | `HONEY` | **20 chai** | Chai thuỷ tinh 500ml | Mèo Vạc, Hà Giang |
| `GM-LIVE-01-004` | **#004** | Trứng Gà Thảo Dược Đồi | `EGG` | **20 khay** | Khay 10 quả | Nông trại Thảo Dược |

---

## 2. Kế Hoạch Đăng Bài Mạng Xã Hội (Social Content Plan 7 Ngày)

Không dàn trải nội dung hay chạy quảng cáo dồn dập. Mỗi Ngăn chạy đúng 3 nhịp nội dung:

### Nhịp A: Story Discovery (Ngày 1–2)
* **Thông điệp:** Kể về vùng đất và con người chân thật (`fact → detail → human`).
* **Không làm:** Giới thiệu giá tiền hay kêu gọi mua hàng như siêu thị.
* **CTA:** `"Xem câu chuyện tại Ngăn"` (gắn link `/ngan/[slug]`).

### Nhịp B: Open the Ngăn (Ngày 3–4)
* **Thông điệp:** Công bố mở chiếc tủ gom đơn với mốc MOQ cụ thể.
* **Hình ảnh:** Hiển thị trực tiếp thanh tiến trình (ví dụ: `12 / 30 phần`).
* **CTA:** `"Cùng mở Ngăn"` (gắn link `/dat-hang/[slug]`).

### Nhịp C: Progress & Human Proof (Ngày 5–7)
* **Thông điệp:** Cập nhật số người đã cùng tham gia mở ngăn.
* **Tâm lý:** Tạo sự đồng hành tập thể ("Đã có 18 phần được cùng mở, chỉ còn 12 phần để người làm bắt đầu mẻ mới").
* **CTA:** `"Mở Ngăn"`.

---

## 3. Hệ Thống Đo Lường (Metrics & Funnel)

1. **Awareness:** `ngan_view` (Số lượt người ghé thăm chi tiết Ngăn).
2. **Interest (CTA Rate):** Tỷ lệ click vào nút `MỞ NGĂN` / `ngan_view`.
3. **Consideration (Form Start Rate):** Tỷ lệ người bắt đầu gõ thông tin vào form / Form views.
4. **Conversion (Order Rate):** Số đơn `CONFIRMED` thực tế / Tổng lượt xem.
5. **Demand Velocity:** Số lượng phần đặt thành công mỗi ngày (`Quantity/Day`).
6. **Social Propagation:** Tỷ lệ người bấm nút `CHIA SẺ NGĂN` sau khi đặt xong.

---

## 4. Nguyên Tắc "No Premature Optimization" (Khóa Nghiệp Vụ)

Trong suốt 7 ngày thử nghiệm:
* ❌ **Không:** Đổi homepage mỗi ngày theo cảm tính.
* ❌ **Không:** Giảm giá hoặc hạ MOQ giữa chừng để "cứu số".
* ❌ **Không:** Đổ tiền chạy ads khi chưa có baseline organic rõ ràng.
* ❌ **Không:** Thêm tính năng phức tạp chỉ vì một vài phản hồi lẻ tẻ.
* ✅ **Được phép:** Sửa lỗi giao diện hiển thị (bug P0/P1) hoặc bổ sung fact hình ảnh tư liệu thật khi nhà sản xuất gửi thêm.
