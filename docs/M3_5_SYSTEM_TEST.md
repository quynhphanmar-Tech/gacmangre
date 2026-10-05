# GẠC MĂNG RÊ — M3.5 SYSTEM TEST REPORT
**Kiểm Thử Toàn Diện: Producer Intelligence, Fact Extraction & Curation Engine**
**Thời gian: 06/10/2026**

---

## 1. Kết Quả Kiểm Thử 4 Ứng Viên Nguồn (Candidate Sources)

Cả 4 nguồn sản vật đều được đưa qua quy trình thẩm định độc lập theo **GMR Curation Standard (Thang điểm 9 chiều)**.

### Bảng Đánh Giá 10 Câu Hỏi Trọng Yếu Theo Acceptance Criteria:

| Tiêu Chí Thẩm Định | 1. Cacao Lên Men OCA (`GM-LIVE-01-001`) | 2. Cà Phê Aeroco (`GM-LIVE-01-002`) | 3. Mật Ong Bạc Hà Páo (`GM-LIVE-01-003`) | 4. Trứng Gà Thảo Dược (`GM-LIVE-01-004`) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Chúng ta biết gì? (What do we know?)** | Hạt cacao Đắk Lắk lên men thùng gỗ mít 5–6 ngày, không kiềm hóa, giữ bơ mộc. | Fine Robusta hái chín 100% bằng tay, nông trại cảnh quan đa tầng, sơ chế tự nhiên. | Mật hoa bạc hà dại nở mùa đông trên đá tai mèo Mèo Vạc (>1.200m), quay chín vít nắp già. | Gà thả đồi Ba Vì uống nước sắc tía tô/gừng/tỏi, không dùng kháng sinh phòng bệnh. |
| **2. Nguồn thông tin từ đâu? (Where from?)** | Website OCA, Fanpage, phỏng vấn nhóm sáng lập và OCOP Đắk Lắk. | Website Aeroco, Fanpage, chứng nhận CQI, bài báo ngành cà phê Buôn Ma Thuột. | Chuyến thực địa trực tiếp của GMR, Zalo anh Giàng A Páo, OCOP Hà Giang. | Fanpage Bác Hùng, tin tức Nông thôn mới PT-TH Hà Nội. |
| **3. Điều gì đã xác thực? (Verified facts)** | Thổ nhưỡng Ea Kar, thùng gỗ lên men mộc, kiểm nghiệm không kim loại nặng. | Hái chín 100% bằng tay, chứng nhận CQI 84.5 điểm, không tẩm hương liệu. | Độ cao >1.200m, độ ẩm mật 18.5% tự nhiên, chỉ có 1 vụ đông trong năm. | Vườn đồi Ba Vì, quy trình nuôi chăn thả bán hoang dã. |
| **4. Điều gì chỉ là lời tự nhận? (Producer claims)** | Giúp nông dân tăng 25% thu nhập so với bán hạt xô. | Tasting notes cảm vị chi tiết (caramel, thảo mộc, chocolate đen). | Năng suất mật ổn định qua các mùa sương muối biến động. | Cam kết 100% không tồn dư kháng sinh trong lô trứng thu gom mới. |
| **5. Còn thiếu dữ liệu gì? (What is missing?)** | Ảnh kiểm nghiệm độ ẩm mẻ ủ gần nhất. | Tư liệu video thu hoạch thực tế vụ mùa năm nay. | Không thiếu (Hồ sơ đầy đủ). | Phiếu xét nghiệm tồn dư kháng sinh lô mới, phương án đệm chống sốc. |
| **6. Có phù hợp GMR không? (Suitable?)** | **RẤT PHÙ HỢP** | **RẤT PHÙ HỢP** | **RẤT PHÙ HỢP (GOLDEN SAMPLE)** | **CÓ TIỀM NĂNG (CẦN BỔ SUNG)** |
| **7. Vì sao? (Why?)** | GMR Score: **8.6/10**. Con người tử tế, kỹ thuật lên men mộc giữ trọn hương vị. | GMR Score: **9.1/10**. Minh chứng CQI rõ ràng, triết lý trả lại giá trị cho Robusta. | GMR Score: **9.4/10**. Tính độc bản cao, gắn chặt văn hóa người Mông và vùng đá xám. | GMR Score: **7.4/10**. Story tốt nhưng thiếu chứng từ kiểm nghiệm định kỳ. |
| **8. Hỏi thêm gì nhà sản xuất? (Next Ask?)** | Cập nhật độ ẩm mẻ ủ tháng 10. | Lịch rang mới mẻ đầu mùa. | Lịch dự kiến quay mẻ mật đầu tiên tháng 10. | Gửi Producer Request: Yêu cầu bổ sung phiếu xét nghiệm kháng sinh & ảnh nồi thảo mộc. |
| **9. Cơ hội câu chuyện? (Story Opportunity)** | "Hạt Cacao Việt Nam và Cách Làm Của Riêng Mình" | "Trả Lại Đúng Giá Trị Cho Hạt Robusta Việt Nam" | "Hương Hoa Dại Nở Trên Vách Đá Tai Mèo Mèo Vạc" | "Tìm Lại Quả Trứng Mộc Mạc Thơm Lành Thời Thơ Ấu" |
| **10. Đủ điều kiện mở Ngăn chưa? (Can become Ngăn?)** | **READY** → Đã dựng Ngăn #001 | **READY** → Đã dựng Ngăn #002 | **READY** → Đã dựng Ngăn #003 | **DEVELOP** → Yêu cầu Producer bổ sung trước khi mở Ngăn |

---

## 2. Kết Quả Chạy Regression Tests

- **Order Engine (`test-order-engine.mjs`)**: `8/8 PASSED`.
- **Decoupled Automation & Events (`test-m3-automation.mjs`)**: `13/13 PASSED`.
- **Next.js Production Build (`npm run build`)**: Thành công `12/12 routes` (`/admin/sources`, `/admin/sources/[id]`, `/admin/curation/[id]` cùng toàn bộ flow commerce hiện hữu).
- **Nguyên tắc An toàn**: Không cho phép AI tự động xuất bản (No auto-publish); mọi quyết định duyệt Ngăn đều qua giao diện **Human Decision** tại `/admin/curation/[id]`.
