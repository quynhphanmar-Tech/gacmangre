# GẠC MĂNG RÊ — M4 METRICS & DIAGNOSIS MATRIX
**Đo Lường & Chẩn Đoán Sức Hút Nhu Cầu Thực Tế**

---

## 1. Chỉ Số North Star

> **Confirmed Demand (`confirmed_quantity`)**  
> Không đo bằng page views, likes hay số người theo dõi. Số lượng sản vật mà người dùng thực sự cam kết cùng mở Ngăn là thước đo cao nhất.

---

## 2. Các Chỉ Số Nâng Cao (Performance Metrics)

### 2.1. Demand Velocity (Vận Tốc Nhu Cầu)
$$\text{Demand Velocity} = \frac{\text{Confirmed Quantity}}{\text{Days Live}}$$
*Ý nghĩa*: Cho biết trung bình mỗi ngày một Ngăn gom được bao nhiêu phần. Giúp so sánh công bằng giữa các đợt mở khác thời điểm.

### 2.2. Story → Open Rate (Tỷ Lệ Từ Câu Chuyện Đến Mở Ngăn)
$$\text{Story} \rightarrow \text{Open Rate} = \frac{\text{CTA Clicks}}{\text{Ngăn Views}}$$
*Ý nghĩa*: Đánh giá sức hút của câu chuyện và độ tò mò của độc giả. Nếu dưới 15%, câu chuyện hoặc hook mở đầu chưa đủ hấp dẫn.

### 2.3. Open → Demand Rate (Tỷ Lệ Từ Mở Ngăn Đến Đặt Đơn)
$$\text{Open} \rightarrow \text{Demand Rate} = \frac{\text{Confirmed Quantity}}{\text{Ngăn Views}}$$
*Ý nghĩa*: Đánh giá mức độ chuyển đổi nhu cầu thực trên mỗi lượt ghé thăm.

---

## 3. Ma Trận Chẩn Đoán Điểm Nghẽn (Diagnosis Matrix)

| Biểu Hiện Trên Dữ Liệu | Chẩn Đoán Nguyên Nhân | Điểm Cần Khắc Phục |
| :--- | :--- | :--- |
| **Views cao + CTA thấp** | **LỖI CÂU CHUYỆN (STORY PROBLEM)** | Hook mở đầu chưa chạm, thiếu chi tiết lay động, độc giả đọc xong lướt qua. Cần đổi góc nội dung (Vùng đất → Con người). |
| **CTA cao + Orders thấp** | **LỖI NIỀM TIN / THƯƠNG MẠI (TRUST / COMMERCE)** | Vào form rồi thoát do thiếu thông tin giá, quy cách chưa rõ, hoặc thiếu chứng nhận (Proof) để ra quyết định. |
| **Orders cao + Share thấp** | **LỖI LAN TỎA (COMMUNITY LOOP)** | Khách đặt một mình nhưng chưa thấy động lực rủ bạn bè cùng gom. Cần cải thiện thông điệp chia sẻ sau đặt đơn. |
| **Orders cao + Share cao + Gom chậm** | **LỖI THIẾT KẾ MOQ (OFFER DESIGN)** | Câu chuyện rất tốt nhưng đặt mốc MOQ quá xa so với dung lượng tệp ban đầu. Cần cân chỉnh lại quy mô mẻ gom. |
| **Views thấp + Chuyển đổi cao** | **LỖI PHÂN PHỐI (DISTRIBUTION)** | Sản vật và câu chuyện rất hay (người xem là đặt) nhưng chưa phân phối đủ kênh. Cần mở rộng kênh lan tỏa. |
