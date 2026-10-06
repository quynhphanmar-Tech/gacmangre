# GẠC MĂNG RÊ — M4 EXPERIENCE GOVERNANCE & CONTROL SPECIFICATION
**Version 1.0 · Anti-Feeling Governance Architecture**

> **Nguyên tắc cốt lõi:**  
> Không dùng "review bằng cảm giác". Mọi lỗi Brand / Truth / Story / State / UX / Asset / Commerce phải biến thành một rule có ID, tiêu chí PASS/FAIL, dữ liệu truy hồi và regression test.

---

## 1. Vị Trí Trong System Hierarchy

Governance nằm **sau Story Object / Ngăn State nhưng trước Content / UI**:

```text
SYSTEM OS
  ↓
BRAND OS
  ↓
KNOWLEDGE / EVIDENCE
  ↓
STORY OBJECT
  ↓
NGĂN STATE
  ↓
┌──────────────────────────────────────────────┐
│  M4 EXPERIENCE GOVERNANCE (9 GATES)          │
│                                              │
│  BG  Brand Gate            (Hard Gate)       │
│  TG  Truth Gate            (Hard Gate)       │
│  SG  Story Gate            (Hard Gate)       │
│  NG  Ngăn-State Gate       (Hard Gate)       │
│  AG  Asset Gate            (Hard Gate)       │
│  CG  Commerce Gate         (Hard Gate)       │
│  UX  UX Gate               (>=85/100, P0/P1=0)│
│  CT  Content Linter        (Hard Gate)       │
│  TR  Traceability Gate     (Hard Gate)       │
└──────────────────────┬───────────────────────┘
                       ↓
               CONTENT / DESIGN / UI
                       ↓
              PUBLISH / COMMERCE
                       ↓
                   LEARNING
```

> **Nguyên lý 3 Không của Governance**: Governance chỉ **VALIDATE → TRACE → BLOCK**.  
> Governance không viết lại Brand, không tự sáng tác Story, không tự đổi Truth status, và không tự tạo MOQ.

---

## 2. Chi Tiết 9 Governance Gates

| Gate ID | Tên Gate | Loại Gate | Tiêu Chí PASS Tuyệt Đối |
|:---|:---|:---:|:---|
| **BG** | Brand Gate | **HARD** | 100% Brand Critical Rules PASS (BG-001 đến BG-006). Không cho phép slogan sai lệch. |
| **TG** | Truth Gate | **HARD** | 100% claims có `truth_status`. `PRODUCER_CLAIM ≠ VERIFIED`, `UNKNOWN ≠ VERIFIED`. Phải có `evidence_id`. |
| **SG** | Story Gate | **HARD** | Đủ 9 chiều Story Object. Đúng cấu trúc: `FACT → DETAIL → HUMAN → PLACE → CRAFT → MEANING → PRODUCT → OPEN NGĂN`. `GMR_FIT ≥ 7.0`. |
| **NG** | Ngăn State Gate | **HARD** | CTA bind chặt với State máy chủ (`DEMAND/OPEN` = "MỞ NGĂN"/"CÙNG MỞ NGĂN", show slots/MOQ/what happens next). |
| **AG** | Asset Gate | **HARD** | 100% hình ảnh có provenance, tác quyền, license, và đã qua xác thực. |
| **CG** | Commerce Gate | **HARD** | Giá và MOQ được xác nhận từ nguồn chính thức nhà sản xuất. |
| **UX** | UX Gate | **OPTIMIZATION** | Tổng điểm ≥ 85/100. P0 = 0, P1 = 0. |
| **CT** | Content Linter | **HARD** | 0 lỗi linter (`BRAND_CLAIM_001`, `UNSUPPORTED_CLAIM_002`, `MISSING_EVIDENCE_003`, `ROMANTICIZATION_004`). |
| **TR** | Traceability Gate | **HARD** | Chuỗi truy vết ngược 7 mắt xích hoàn chỉnh 100%. |

---

## 3. Khung Đo Lường UX Gate (100 Điểm)

| Dimension | Trọng số | Chỉ tiêu định lượng |
|:---|:---:|:---|
| **1. Legibility & Accessibility** | 25 | Body text ≥ 16px, Touch target ≥ 48px, Contrast ratio ≥ 4.5:1 |
| **2. Clarity & Task Speed** | 25 | Time-to-CTA < 3s, Comprehension < 10s |
| **3. Group-buy Transparency** | 25 | Thanh tiến độ real-time, số slot còn lại, mốc MOQ, cam kết sau mở ngăn |
| **4. Product Scannability & Trust** | 25 | Grid ảnh thực địa chân thực, chân dung người làm, thông số thổ nhưỡng |

---

## 4. Chuỗi Truy Vết Ngược (TR — Reverse Traceability Chain)

Mọi chữ xuất hiện trên website phải trả lời được câu hỏi: **"Tại sao câu này xuất hiện ở đây?"** trong < 1 giây:

```text
CONTENT-2026-XXXX (Bản copy UI)
       ↓
STORY-XXXX        (Story Object)
       ↓
NGAN-003          (Ngăn State)
       ↓
PRODUCT-XXX       (Sản phẩm)
       ↓
PRODUCER-XXX      (Người sản xuất)
       ↓
SOURCE-XXX        (Hồ sơ nguồn thực địa)
       ↓
EVIDENCE-XXX      (Bằng chứng: GPS, video quay mật, ảnh mùa hoa)
```

---

## 5. Cơ Chế Chống Lặp Lỗi: Failure Registry & Regression Rules

Mỗi lỗi phát hiện không chỉ được fix code mà phải tự động sinh ra một **Regression Rule ID**:

```yaml
failure_id: FAIL-BRAND-001
severity: P1
detected_at: 2026-10-06T15:30:00Z
module: STORY
gate_id: BG
symptom: Hardcoded slogan thương mại sai lệch
root_cause: Designer tự gõ slogan thay vì resolve từ BRAND_OS
rule_created: REG-BRAND-002
regression_test: verifyBrandIdentityVocabulary
status: RESOLVED
```

```yaml
failure_id: FAIL-UX-004
severity: P1
detected_at: 2026-10-06T18:00:00Z
module: NGAN
gate_id: NG
symptom: CTA "MỞ NGĂN" thiếu ngữ cảnh và không bind theo Ngan State
root_cause: CTA hardcoded tách rời khỏi ExperienceSpec
rule_created: REG-NGAN-CTA-001
regression_test: verifyNganStateCtaBinding
status: RESOLVED
```
