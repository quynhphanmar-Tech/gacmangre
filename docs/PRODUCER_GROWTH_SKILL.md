# GẠC MĂNG RÊ — PRODUCER GROWTH SKILL v0.1

> **Phiên bản:** v0.1  
> **Phạm vi:** Trí tuệ Tăng trưởng Nhà sản xuất (Intelligence, Diagnosis, Hypothesis, Opportunity, Intervention, Learning)  
> **Nguyên tắc:** 100% Foundation Isolation — 0% cảm tính — Epistemic Rigor (FACT vs INTERPRETATION vs HYPOTHESIS)  
> **Trạng thái:** Triển khai hoàn tất & Kiểm chứng Generic

---

## 1. Mục tiêu & Định vị Kiến trúc

Producer Growth Skill **không phải là một chatbot tư vấn chung chung** và **không cạnh tranh với Content Skill**.

```text
SOURCE / PRODUCER INTELLIGENCE
  ↓
GROWTH DIAGNOSIS (8 Dimensions)
  ↓
VALUE - TRUST - PRICE TRIAD
  ↓
PRIMARY GROWTH HYPOTHESIS (Max 1)
  ↓
OPPORTUNITY MAP (Max 3, Scored)
  ↓
INTERVENTION PLAN (Top 1)
  ↓
CONTENT REQUEST SPEC (Hand-off)
  ↓
CONTENT SKILL (Sinh bản thảo / Copy / Visual)
  ↓
NGĂN STATE (Kích hoạt mở mẻ)
  ↓
MARKET LEARNING
```

### Phân định vai trò:
- **Producer Growth Skill:** Trả lời *"Nhà sản xuất đang mắc ở đâu, cơ sở bằng chứng là gì, giả thuyết tăng trưởng then chốt là gì, và kế hoạch can thiệp 14-30 ngày thế nào?"*
- **Content Skill:** Trả lời *"Nếu đã biết mục tiêu tăng trưởng và bằng chứng, thì kể câu chuyện mộc mạc đương đại này ra sao?"*

---

## 2. Ranh giới Bất biến (Hard Boundaries & Isolation)

Skill **KHÔNG ĐƯỢC PHÉP MUTATE**:
- `BRAND_TRUTH` / `BRAND_OS` (Mộc, Tĩnh, Có chiều sâu, Người thật, Đương đại)
- `EVIDENCE` (Không tự nâng cấp chứng chỉ chưa có bản scan thành VERIFIED)
- `STORY_OBJECT_TRUTH` (Không bóp méo sự thật chỉ để bài viết hay hơn)
- `NGAN_STATE` (Không tự ý nhảy cóc trạng thái Ngăn)
- `COMMERCE_RULE` (Không tự ý phá vỡ MOQ hoặc cơ chế đặt cọc)

Nếu cố tình gọi mutation lên các đối tượng trên:
Hệ thống kích hoạt ngay lập tức **`SKILL_ISOLATION_VIOLATION`** và chặn thực thi (HTTP 403 / Exception).

---

## 3. Khung Khái niệm Nhận thức luận (Epistemic Rigor)

1. **FACT (Sự thật):** Dữ liệu có bằng chứng trực tiếp xác thực (ĐKKD trên cổng quốc gia, toạ độ thực địa GPS, giấy kiểm định độc lập).
2. **INTERPRETATION (Suy luận chuyên gia):** Nhận định logic rút ra từ nhiều nguồn dữ liệu, có nêu rõ góc nhìn và độ tin cậy.
3. **HYPOTHESIS (Giả thuyết):** Nhận định về tương lai cần kiểm chứng qua thực nghiệm thị trường (ví dụ: gom mẻ đạt MOQ). Tuyệt đối **không gọi là "root cause"** khi chưa có dữ liệu thị trường thực tế.

---

## 4. Generic Pipeline (Chống Hardcode)

Hệ thống được thiết kế hoàn toàn generic qua [`ProducerGrowthService`](file:///Users/phanquynh/Documents/Gacmangre/services/producer-growth-service.ts):
- Phân loại 13 bề mặt thông tin (`IDENTITY`, `PRODUCT`, `ORIGIN`, `PROCESS`, `PEOPLE`, `CERTIFICATION`, `EXPORT`, `MARKET`, `PARTNER_B2B`, `STORY`, `COMMERCIAL`, `SOCIAL`, `MEDIA`).
- **Từ chối chẩn đoán khi thiếu dữ liệu:** Nếu bề mặt thu thập có `coverage_status === 'INSUFFICIENT'`, hệ thống trả về `can_diagnose = false` và yêu cầu bổ sung thông tin, không bịa đặt chẩn đoán.
- Hoạt động trơn tru với bất kỳ nhà sản xuất nông sản nào (OCA Cacao, Hợp tác xã Hà Giang, Trà Shan Tuyết Tà Xùa, v.v.).

---

## 5. Các thành phần mã nguồn đã triển khai

| Tệp / Thành phần | Chức năng |
|---|---|
| [`types/index.ts`](file:///Users/phanquynh/Documents/Gacmangre/types/index.ts) | Định nghĩa toàn bộ schema `SourceScanResult`, `MinedEvidenceItem`, `ProducerIntelligenceData`, `GrowthDimensionEvaluation`, `PrimaryGrowthHypothesis`, `GrowthOpportunity`, `GrowthInterventionPlan`, `ContentRequestSpec`, `MarketLearningRecord`. |
| [`services/producer-growth-service.ts`](file:///Users/phanquynh/Documents/Gacmangre/services/producer-growth-service.ts) | Core Engine: Scan, Mine, Build Intel, Diagnose 8D, VTP, Hypothesis, Opps, Intervene, Content Request hand-off, Market Learning. |
| [`app/api/admin/growth/route.ts`](file:///Users/phanquynh/Documents/Gacmangre/app/api/admin/growth/route.ts) | REST API cho Admin & Automation Engine kích hoạt phân tích tăng trưởng, lưu tài sản workbench, kiểm tra isolation. |
| [`app/admin/growth/workbench/page.tsx`](file:///Users/phanquynh/Documents/Gacmangre/app/admin/growth/workbench/page.tsx) | Lightweight Asset Workbench Spike cho phép gắn nhãn provenance cho tài sản thực địa (`DOCUMENTARY`, `SOURCE`, `EDITORIAL`). |
| [`scripts/test-producer-growth.mjs`](file:///Users/phanquynh/Documents/Gacmangre/scripts/test-producer-growth.mjs) | Bộ test tích hợp toàn diện chạy 5 suite: OCA Golden, Producer thứ 2 (Hà Giang), Insufficient Coverage Guard, Isolation Violation Block, No Orphan Object. |
