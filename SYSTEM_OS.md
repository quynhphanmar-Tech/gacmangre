# GẠC MĂNG RÊ — SYSTEM_OS
**Version: 1.0 · Single Source of Architecture Truth**

> **Tôn chỉ vận hành:**  
> Gạc Măng Rê không phải sàn thương mại điện tử, không phải marketplace, không phải trang tin lá cải.  
> Đây là **A Digital Pantry of Vietnam** — Hệ điều hành kết nối:  
> `SOURCE → TRUTH / EVIDENCE → STORY OBJECT → NGĂN STATE → COMMERCE / MOQ → FULFILLMENT → LEARNING`.

---

## 1. System Topology & Layers

Hệ thống tuân thủ nghiêm ngặt 8 tầng dữ liệu đơn hướng (Unidirectional Flow):

```text
┌─────────────────────────────────────────────────────────────────┐
│ 1. SOURCE INTAKE & DISCOVERY LAYER                              │
│    Quét bề mặt thông tin, thu nhận dữ liệu thô từ thực địa/nhà làm│
└────────────────────────────────┬────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. EPISTEMIC TRUTH & EVIDENCE LAYER (Knowledge Core)            │
│    Bóc tách Fact, Evidence, phân loại Truth Status (Không đoán) │
└────────────────────────────────┬────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. STORY OBJECT LAYER                                           │
│    Narrative Arc chuẩn: Fact → Detail → Human → Meaning         │
└────────────────────────────────┬────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. NGĂN STATE ENGINE                                            │
│    Finite State Machine: DRAFT → OPEN → FULL → PRODUCTION       │
└────────────────────────────────┬────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. M4 EXPERIENCE GOVERNANCE (9 Hard & Soft Gates)               │
│    BG, TG, SG, NG, AG, CG, UX, CT, TR — Validate, Trace, Block  │
└────────────────────────────────┬────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. EDITORIAL COMMERCE & UX LAYER                                │
│    Discover → Trust → Value → Participate → Pre-order (No fee)  │
└────────────────────────────────┬────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. FULFILLMENT & TRACEABILITY LAYER                             │
│    QR/Batch tracking, nhận diện lô mẻ, tương tác Zalo OA        │
└────────────────────────────────┬────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. MARKET LEARNING & DECISION LAYER                             │
│    Ghi nhận học hỏi sau thực nghiệm (Dual Outcome: Buyer + Maker)│
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Hard System Invariants (Các Bất Biến Cốt Lõi)

1. **Source of Truth duy nhất:**
   - Dữ liệu quan hệ, đơn hàng, mốc MOQ và bảo mật RLS được kiểm soát tập trung tại PostgreSQL / Supabase Schema.
   - Client hoặc Edge proxy không được phép tự tính hoặc ghi đè trạng thái nghiệp vụ.

2. **Ranh giới Epistemic (Nhận thức luận):**
   - Mọi tuyên bố (Claim) trên hệ thống bắt buộc phải mang một trong các trạng thái:
     - `VERIFIED`: Đã đối soát hồ sơ pháp lý, chứng nhận nhà nước hoặc kiểm chứng thực địa GMR.
     - `PRODUCER_CLAIM`: Tự công bố từ nhà sản xuất / nông hộ (chưa kiểm nghiệm độc lập).
     - `EDITORIAL_INTERPRETATION`: Góc nhìn văn hóa/biên tập từ giám tuyển viên.
     - `MISSING_EVIDENCE` / `UNKNOWN`: Chưa có dữ liệu, **tuyệt đối không biến phỏng đoán thành sự thật**.

3. **Cơ chế Gom Mẻ (MOQ Demanded Commerce):**
   - Không nhập hàng tồn kho đại trà.
   - Chỉ xuất xưởng và giao nhận khi cộng đồng cùng gom đạt số lượng tối thiểu (`current_quantity >= moq`).
   - Khách đăng ký mở mẻ **chưa thu tiền trước**, chỉ kích hoạt thanh toán khi mẻ đạt 100% MOQ.

4. **Nguyên tắc tư liệu hình ảnh (Visual Hierarchy):**
   - `REAL → APPROVED → BEAUTIFUL`:
     1. Ảnh thực địa GMR (`provenance_level: 1`)
     2. Ảnh chính thức nhà sản xuất (`provenance_level: 2`)
     3. Ảnh do người làm cung cấp có nguồn gốc rõ ràng (`provenance_level: 3`)
     4. Ảnh bài trí biên tập (`EDITORIAL`)
     5. Ảnh AI/Concept: Tuyệt đối không dùng làm bằng chứng documentary.

5. **Tính toán MOQ minh bạch:**
   $$\text{current\_quantity} = \sum_{\text{order } \in \text{ Valid Orders}} \text{quantity}$$
   - Không dùng số liệu khan hiếm giả tạo (fake urgency countdown / fake numbers).
