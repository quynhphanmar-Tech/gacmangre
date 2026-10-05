# GẠC MĂNG RÊ — GMR CURATION STANDARD
**Phiên bản: 1.0 · Tháng 10/2026**

> *"Không phải database hàng trăm sản phẩm, mà là một hệ thống biết nhận diện: Điều gì thực sự đáng được cất vào chiếc tủ."*

---

## 1. Triết Lý Tuyển Chọn (Curation Philosophy)

Gạc Măng Rê không phải là một marketplace hay siêu thị đặc sản trực tuyến. 
Một sản vật muốn được mở Ngăn phải hội tụ đủ 3 trụ cột:

1. **Gốc rễ chân thật (Roots & Truth)**: Vùng đất có thật, con người làm nghề tử tế có thật, quy trình có thể kiểm chứng, không quảng cáo thổi phồng công dụng y tế hay thần thánh hóa.
2. **Tiềm năng cảm xúc (Story Potential)**: Có chi tiết lay động — không phải câu chữ copywriting hoa mỹ, mà là chi tiết mộc mạc từ sương muối, đá vôi, đôi bàn tay chai sần, hoặc sự kiên nhẫn nhiều năm giữ nghề.
3. **Tính khả thi thương mại mộc (Gentle Commercial Feasibility)**: Sản lượng đủ để gom mẻ (MOQ từ 20–50 phần), giá trị tương xứng với công sức người làm, vận chuyển được mà không làm hư hại phẩm vị.

---

## 2. Thang Điểm 9 Chiều (9-Dimensional Scorecard)

Mỗi hồ sơ nguồn (Source Profile) được chấm độc lập trên thang điểm **0 – 10** qua 9 chiều:

| Dimension | Trọng số | Định nghĩa & Tiêu chuẩn đánh giá |
| :--- | :---: | :--- |
| **1. ORIGIN (Thổ Nhưỡng / Vùng Đất)** | 15% | Vùng nguyên liệu bản địa rõ ràng, có chỉ dẫn địa lý tự nhiên (khí hậu, cao độ, tầng đất). Không phải nguyên liệu nhập trôi nổi về đóng gói. |
| **2. HUMAN (Con Người Làm Nghề)** | 15% | Nhận diện rõ người đứng sau (nông hộ, người làm mẻ thủ công). Có triết lý sống tử tế, có câu chuyện cá nhân gắn chặt với sản vật. |
| **3. CRAFT (Tay Nghề & Kỹ Thuật)** | 15% | Quy trình lên men, ủ chín, rang mộc, hoặc hái lượm có yếu tố bí quyết thủ công đặc sắc, không phụ thuộc vào hương liệu hay hóa chất công nghiệp. |
| **4. DISTINCTIVENESS (Tính Độc Bản / Khác Biệt)** | 10% | Sự khác biệt không thể nhầm lẫn so với hàng sản xuất hàng loạt trên thị trường (màu sắc, cấu trúc vị, mùa vụ giới hạn). |
| **5. STORY POTENTIAL (Tiềm Năng Câu Chuyện)** | 15% | Có tình tiết cụ thể lay động, giàu hình ảnh gợi liên tưởng (Fact → Detail → Human → Meaning). Khách đọc xong muốn cùng mở Ngăn. |
| **6. PROOF (Căn Cứ Xác Thực / Bằng Chứng)** | 10% | Giấy kiểm nghiệm an toàn, chứng nhận OCOP/VietGAP/HACCP, hoặc hình ảnh/video thực địa ghi nhận quy trình không gian lận. |
| **7. PRODUCT QUALITY SIGNAL (Tín Hiệu Phẩm Vị)** | 5% | Trải nghiệm thử mẫu thực tế: hương thơm, hậu vị lưu sâu, độ tự nhiên, độ đồng đều mẻ thử nghiệm. |
| **8. COMMERCIAL READINESS (Độ Sẵn Sàng Thương Mại)** | 10% | Định giá hợp lý (đủ bù đắp chi phí làm tử tế), quy cách đóng gói sạch sẽ, xác định được dung sai hạn sử dụng và phương án vận chuyển. |
| **9. SUPPLY RELIABILITY (Độ Tin Cậy Nguồn Cung)** | 5% | Nhà sản xuất hiểu mô hình gom mẻ MOQ, hợp tác minh bạch về lịch giao mẻ và số lượng tối đa có thể cung ứng. |

### Công Thức Tính `GMR_FIT_SCORE`:
$$\text{GMR\_FIT\_SCORE} = \sum (\text{Dimension Score} \times \text{Trọng số})$$

> **QUY TẮC CỐT LÕI**: `GMR_FIT_SCORE` **không bao giờ** là căn cứ duy nhất để quyết định. Cần nhìn vào sự phân bổ điểm (vd: Story 9/10 nhưng Proof 3/10 thì phải xếp loại `DEVELOP`, yêu cầu bổ sung bằng chứng trước khi mở Ngăn).

---

## 3. Hệ Thống Trạng Thái Thẩm Định (Curation Statuses)

```text
       [NEW] ──(Bắt đầu thẩm định)──→ [REVIEWING]
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ↓                     ↓                     ↓
                [READY]               [DEVELOP]             [NOT_FIT]
                   │                      │                     │
           (Story Architect)       (Producer Request)    (Lưu kho lưu trữ)
                   ↓                      │
              [NGĂN DRAFT]         (Bổ sung dữ liệu)
                   ↓                      │
             [HUMAN REVIEW] ←─────────────┘
                   ↓
              [PUBLISHED]
```

1. **`NEW`**: Vừa paste link hoặc nhập ghi chú thô, chưa trích xuất thông tin.
2. **`REVIEWING`**: Đang phân tích facts, phân loại xuất xứ và chấm điểm 9 chiều.
3. **`NEEDS_INPUT`**: Hồ sơ thiếu các trường thông tin cơ bản về giá, số lượng hoặc người đại diện.
4. **`DEVELOP`**: Rất có tiềm năng (Origin/Human/Craft cao) nhưng thiếu bằng chứng kiểm định hoặc chi tiết mùa vụ. Hệ thống sinh *Producer Request* để đội ngũ liên hệ bổ sung.
5. **`READY`**: Đủ dữ liệu và căn cứ xác thực để chuyển sang *Story Architect* dựng Ngăn.
6. **`NOT_FIT`**: Không đáp ứng triết lý Gạc Măng Rê (hàng thương mại gia công không rõ nguồn gốc, dùng phụ gia hóa học, hoặc nhà sản xuất thiếu thiện chí hợp tác).

---

## 4. Nguyên Tắc Phân Loại Xuất Xứ Thông Tin (Provenance Classification)

Mọi nhận định trích xuất từ tài liệu đều phải gán nhãn:
- **`VERIFIED`**: Có bằng chứng tài liệu đối soát độc lập, chứng nhận nhà nước hoặc đội ngũ Gạc Măng Rê đã thực địa tận nơi.
- **`PRODUCER_CLAIM`**: Lời nói/tuyên bố từ phía nhà sản xuất (chưa có giấy tờ kiểm chứng độc lập).
- **`SOURCE_INFERRED`**: Phân tích suy luận từ bài viết báo chí hoặc bài đăng mạng xã hội.
- **`UNKNOWN`**: Chưa rõ, tuyệt đối không tự bịa đặt.
