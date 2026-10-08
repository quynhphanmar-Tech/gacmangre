# GẠC MĂNG RÊ — CONTENT_SKILL
**Version: 1.0 · Cẩm Nang & Tiêu Chuẩn Sáng Tác Ký Sự Thực Địa**

> **Tôn chỉ của Content Creator GMR:**  
> *"Không copy brochure hay website của người làm.  
> Tìm ra điều lay động nhất trong nguồn nguyên liệu và bàn tay người làm để mở một Ngăn."*

---

## 1. Bản Đồ Tiếp Nhận & Bàn Giao (Input & Hand-off)

Content Skill không hoạt động trong khoảng trống tưởng tượng. Kỹ năng này nhận đầu vào trực tiếp từ **Producer Growth Skill** và **Evidence Miner**:

```text
┌────────────────────────────────────────┐
│ INPUT TỪ PRODUCER GROWTH & EVIDENCE   │
│ • Producer Intelligence (11 chiều)     │
│ • Canonical Locations (GPS / Địa danh) │
│ • Mined Evidence Items (Facts/Claims)  │
│ • Primary Growth Hypothesis            │
│ • Content Request Spec (Mục tiêu mẻ)   │
└───────────────────┬────────────────────┘
                    ↓
┌────────────────────────────────────────┐
│ CONTENT SKILL PIPELINE                 │
│ 1. Trích xuất "Chi tiết đắt giá"       │
│ 2. Dựng mạch Narrative Arc (6 bước)    │
│ 3. Viết Story Object (9 chiều)         │
│ 4. Chấm điểm GMR Fit Score             │
│ 5. Chạy Content Linter (CT Gate)       │
└───────────────────┬────────────────────┘
                    ↓
┌────────────────────────────────────────┐
│ OUTPUT: NGĂN COPY & PHYSICAL CARD      │
│ • Headline & Short Description         │
│ • Why This / Why Preorder Triad        │
│ • Making Process Steps                 │
│ • Thẻ câu chuyện vật lý (Story Card)  │
└────────────────────────────────────────┘
```

---

## 2. Bộ Quy Tắc Ngôn Từ (Tone of Voice & Lexicon)

### 2.1. Danh Sách Từ Được Khuyến Khích (Allowed & Encouraged):
- **Tính chất mộc:** Thô mộc, nguyên bản, không kiềm hóa, giữ trọn bơ, mộc vị, hương hoa cỏ, ánh vàng chanh.
- **Hành động người làm:** Nhẫn nại, kiên trì, chắt chiu, vít nắp, phơi giàn, đảo thùng gỗ, hái chín bằng tay, giữ nghề.
- **Cơ chế cộng đồng:** Cùng mở mẻ, đồng hành, tạo tín hiệu nhu cầu, bảo tồn phẩm chất, gửi gắm căn bếp.

### 2.2. Danh Sách Từ Bị CẤM Tuyệt Đối (Blacklisted Jargon):
- **Từ ngữ thương mại chợ:** Siêu giảm giá, đại hạ giá, mua ngay kẻo lỡ, hàng hot, deal hời, xả kho.
- **Mỹ từ sáo rỗng vô căn cứ:** Đẳng cấp số 1, thượng hạng bậc nhất, thần dược, đỉnh cao ẩm thực.
- **Thuật ngữ y khoa trái phép:** Trị dứt điểm, ngăn ngừa ung thư, chống đột quỵ, hạ huyết áp tức thì, chữa bệnh tim.
- **Thuật ngữ áp lực ảo:** Chỉ còn 5 phút, đếm ngược chớp nhoáng, tranh giành suất mua.

---

## 3. Bộ Lọc Lỗi Biên Tập (Content Linter — CT Rules)

Mỗi bản thảo trước khi đưa lên Ngăn phải pass 4 bài kiểm tra tự động của Content Linter:

1. **`CT-001` (Brand Slogan Check):**
   - Đảm bảo câu định vị chuẩn: *"Cất vị quê nhà"* và *"A Digital Pantry of Vietnam"*.
2. **`CT-002` (Unsupported Health Claim Check):**
   - Bất kỳ đoạn văn nào nói về lợi ích tự nhiên của sản vật phải tự động gắn badge `PRODUCER CLAIM`. Nếu phát hiện từ y khoa chữa bệnh $\rightarrow$ Chặn xuất bản.
3. **`CT-003` (Location Purity Check):**
   - Một bài viết về Cacao Châu Đức **không được phép xuất hiện** địa danh Chợ Gạo hoặc Mèo Vạc (chống rò rỉ chéo dữ liệu).
4. **`CT-004` (Physical Story Card Generation):**
   - Mỗi mẻ sản vật bắt buộc phải sinh ra một bản copy thu nhỏ (khoảng 80–120 từ) dành riêng cho Thẻ câu chuyện vật lý in kèm trong hộp quà.
