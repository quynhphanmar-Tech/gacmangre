# GẠC MĂNG RÊ — M4 LIVE VALIDATION (7 DAYS)
**Tài Liệu Điều Hành Thử Nghiệm Kiểm Chứng Nhu Cầu Thị Trường**
**Thời gian: 06/10/2026 – 13/10/2026 · Mã Thử Nghiệm: `GM-LIVE-01`**

---

## 1. Mục Tiêu Cốt Lõi

Trong 7 ngày, Gạc Măng Rê kiểm chứng giả thuyết:
> **Một câu chuyện được tuyển chọn tốt → Một Ngăn được mở → Người thật phát sinh nhu cầu → Hệ thống ghi nhận → Đạt/Không đạt MOQ → Học được điều gì.**

M4 không tối ưu doanh thu hay chạy theo lượt xem ảo.
M4 đo lường **Demand Signal + Story-to-Commerce + Operating Model**.

---

## 2. Danh Sách 3 Ngăn Thử Nghiệm Độc Lập

Chỉ 3 nguồn đã đạt chuẩn `READY` (theo GMR Curation Standard) được đưa vào chiếc tủ:

1. **`GM-LIVE-01-001` (Ngăn #001)**: Cacao Lên Men Thủ Công OCA (GMR Fit: 8.6 · MOQ: 30 phần)
2. **`GM-LIVE-01-002` (Ngăn #002)**: Cà Phê Đặc Sản Aeroco Farm (GMR Fit: 9.1 · MOQ: 50 phần)
3. **`GM-LIVE-01-003` (Ngăn #003)**: Mật Ong Bạc Hà Mèo Vạc Hà Giang (GMR Fit: 9.4 · MOQ: 20 chai)

*Lưu ý: Trứng gà thảo dược Ba Vì (`GM-LIVE-01-004`) tạm giữ ở trạng thái `DEVELOP` và không đưa vào live experiment cho tới khi nhà sản xuất bổ sung phiếu xét nghiệm kháng sinh.*

---

## 3. Khung 3 Giả Thuyết Thử Nghiệm (Experiment Hypotheses)

| Giả Thuyết | Nội Dung Kiểm Chứng | Chỉ Số Đo Lường Chính |
| :--- | :--- | :--- |
| **H1 — STORY** | Người dùng có lý do để dừng lại đọc và lắng đọng cùng câu chuyện. | Unique Ngăn views, thời gian đọc trung bình, bounce rate. |
| **H2 — TRUST** | Nguồn gốc thổ nhưỡng + con người tử tế + bằng chứng (proof) đủ để tạo niềm tin. | Tỷ lệ nhấp CTA `MỞ NGĂN` (Story → Open Rate), tỷ lệ bắt đầu điền form. |
| **H3 — COMMERCE** | Người dùng chấp nhận cơ chế *Cùng Mở Ngăn* (gom mẻ mộc) thay vì *Mua Ngay*. | Số đơn (`orders`), số lượng gom (`confirmed_quantity`), tỷ lệ chia sẻ (`shares`). |

---

## 4. Phễu Đo Lường Đồng Nhất (Tracking Funnel)

Mọi sự kiện trên website tuân thủ quy chuẩn analytics sẵn có:
```text
CONTENT VIEW
      ↓
NGAN VIEW (`ngan_view`)
      ↓
CTA CLICK (`ngan_cta_click`)
      ↓
ORDER FORM VIEW (`order_form_view`)
      ↓
ORDER START (`order_form_start`)
      ↓
ORDER SUBMIT (`order_submit`)
      ↓
ORDER SUCCESS (`order_success`)
      ↓
SHARE NGĂN (`share_ngan`)
      ↓
MOQ REACHED (`MOQ_REACHED` event)
```

---

## 5. Nguyên Tắc Nội Dung: 3 Góc Thử Nghiệm (Content Angles)

Mỗi Ngăn kiểm thử 3 góc tiếp cận khác biệt để tìm ra điểm chạm hiệu quả nhất:
- **Angle A — VÙNG ĐẤT**: Vì sao mảnh đất này tạo ra sản vật này (độ cao, khí hậu, đá vôi, rừng rậm).
- **Angle B — CON NGƯỜI**: Ai là người làm ra và tại sao họ lại kiên trì với cách làm này.
- **Angle C — CHI TIẾT ĐẮT GIÁ**: Một chi tiết cụ thể, khác biệt không thể nhầm lẫn (thùng gỗ mít, hái tay từng quả chín 100%, quay mật vít nắp già).

Tỷ lệ nội dung: **Story > Commerce**. Không dùng thủ thuật giục mua (urgency), giảm giá (sale), hay khan hiếm nhân tạo. Sự khan hiếm đến từ thực tế mùa vụ và MOQ.
