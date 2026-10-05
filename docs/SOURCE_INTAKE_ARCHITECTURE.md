# GẠC MĂNG RÊ — SOURCE INTAKE ARCHITECTURE
**Phiên bản: 1.0 · Tháng 10/2026**

---

## 1. Mục Đích & Nguyên Tắc

Tài liệu này định nghĩa kiến trúc tầng **SOURCE INTAKE (Tầng 1 & Tầng 2)** của Gạc Măng Rê.

> **Tư duy cốt lõi**: Khởi đầu từ *Nguồn nguyên liệu & Con người*, không khởi đầu từ *Sản phẩm thương mại*. Nhà sản xuất không cần phải hiểu về storytelling hay marketing; hệ thống chỉ cần tiếp nhận nguyên liệu thô (URL, fanpage, video TikTok, hồ sơ OCOP, ghi chú điện thoại) để chuẩn hóa thành **Source Profile**.

---

## 2. Kiến Trúc 5 Lớp Dữ Liệu (5-Layer System)

```text
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: SOURCE INTAKE (Kho nguyên liệu thô)                 │
│ URL, OCOP Profile, TikTok, Fanpage, Voice Note              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ LAYER 2: CURATION & QUALIFICATION (Thẩm định GMR Standard)  │
│ Fact Extraction, 9D Scorecard, GMR Fit Score, Status        │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Nếu READY)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ LAYER 3: STORY ARCHITECT & EDITORIAL ASSEMBLY               │
│ Fact → Detail → Human → Meaning → Ngăn Draft                │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Phê duyệt Human Review)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ LAYER 4: COMMERCE & VALIDATION ENGINE (M2 + M3 Core)         │
│ Ngăn Page, Demand Signal, Atomic Orders, Events, Zalo       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Sau khi đóng mẻ gom)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ LAYER 5: LEARNING LOOP & CURATION REFINEMENT                │
│ Fulfillment → Customer Feedback → Data Moat → Update Rules  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Cấu Trúc Dữ Liệu Hồ Sơ Nguồn (`SourceProfile`)

Một bản ghi nguồn đầy đủ bao gồm các nhóm trường dữ liệu chuẩn hóa:

```typescript
interface SourceProfile {
  id: string;                      // e.g. "src-001-oca"
  experiment_id?: string;          // e.g. "GM-LIVE-01-001"
  status: CurationStatus;          // NEW | REVIEWING | NEEDS_INPUT | DEVELOP | READY | NOT_FIT
  input_url?: string;
  raw_input_notes?: string;

  // 1. Định danh (Identity)
  producer_name: string;
  organization?: string;
  contact_phone?: string;
  contact_zalo?: string;
  location: string;
  source_urls: string[];

  // 2. Sản vật (Product)
  category: string;
  product_name: string;
  product_description: string;

  // 3. Vùng đất (Origin)
  province: string;
  raw_material_origin: string;

  // 4. Con người (Human)
  producer_person: string;
  producer_story: string;

  // 5. Kỹ thuật & Thực hành (Process & Craft)
  production_method: string;
  distinctive_practice: string;

  // 6. Minh chứng (Proof)
  certifications: string[];
  documents: string[];
  source_claims: string[];

  // 7. Thương mại (Commercial)
  estimated_price?: number;
  unit?: string;
  moq?: number;
  capacity?: number;
  lead_time?: string;

  // 8. Đa phương tiện (Media)
  media_assets: MediaAsset[];

  // 9. Thẩm định & Cơ hội (Intelligence)
  facts: ExtractedFact[];
  missing_fields: string[];
  scorecard: GmrScorecard;
  producer_request?: ProducerRequest;
  story_brief?: StoryBrief;
}
```

---

## 4. Cơ Chế Sinh Yêu Cầu Cho Nhà Sản Xuất (Producer Request Generator)

Khi một nguồn rơi vào trạng thái `DEVELOP` hoặc `NEEDS_INPUT`, hệ thống tự động lọc danh sách `missing_fields` và sinh bản thảo tin nhắn gửi nhà sản xuất (qua Zalo hoặc cuộc gọi điện).

**Nguyên tắc giao tiếp**:
- Giữ câu từ mộc mạc, lễ độ, trân trọng người làm nghề.
- Không dùng thuật ngữ marketing, KPI hay hệ thống.
- Chỉ hỏi đúng các thông tin còn thiếu (ví dụ: mùa thu hoạch kế tiếp, giấy kiểm định an toàn vệ sinh thực phẩm, quy cách đóng gói).
