# GẠC MĂNG RÊ — PRODUCER GROWTH SCHEMA SPECIFICATION

## Schema Definitions

Các kiểu dữ liệu chính được định nghĩa trong [`types/index.ts`](file:///Users/phanquynh/Documents/Gacmangre/types/index.ts):

### 1. `SourceScanResult`
Bản đồ phân loại bề mặt quét thông tin từ các kênh chính thức của nhà sản xuất:
- `source_id`: Mã nguồn duy nhất.
- `requested_url`: URL gốc được yêu cầu quét.
- `discovered_urls`: Danh sách toàn bộ URL tìm thấy.
- `source_groups`: Phân loại thành 13 nhóm bề mặt (`IDENTITY`, `PRODUCT`, `ORIGIN`, `PROCESS`, `PEOPLE`, `CERTIFICATION`, `EXPORT`, `MARKET`, `PARTNER_B2B`, `STORY`, `COMMERCIAL`, `SOCIAL`, `MEDIA`).
- `coverage_status`: `HIGH` | `MEDIUM` | `LOW` | `INSUFFICIENT`.
- `missing_surfaces`: Danh sách các bề mặt còn trống.

### 2. `MinedEvidenceItem`
Bản ghi bằng chứng khai thác từ nguồn:
- `id`: Mã bằng chứng (`EVD-...`).
- `claim`: Nội dung tuyên bố được trích xuất.
- `source_url`: URL nguồn chứa tuyên bố.
- `truth_status`: `VERIFIED` | `PRODUCER_CLAIM` | `EDITORIAL_INTERPRETATION` | `UNKNOWN` | `MISSING_EVIDENCE`.
- `confidence`: 0.0 đến 1.0.

### 3. `ProducerIntelligenceData`
Dữ liệu trí tuệ 11 chiều của nhà sản xuất:
- `identity`, `product`, `place`, `people`, `craft`, `proof`, `market`, `brand_story`, `commercial`, `unknowns`.

### 4. `PrimaryGrowthHypothesis`
Giả thuyết tăng trưởng trọng tâm (duy nhất 1):
- `statement`: Nội dung giả thuyết.
- `classification`: Cố định giá trị `'HYPOTHESIS'`.
- `based_on`: Gồm `{ facts: string[], interpretations: string[] }`.
- `evidence`: Bằng chứng hỗ trợ.
- `confidence`: `LOW` | `MEDIUM` | `HIGH`.
- `unknowns`: Những điểm chưa biết cần làm rõ.
- `validation_needed`: Hành động thực nghiệm để kiểm chứng.

### 5. `GrowthOpportunity`
Cơ hội tăng trưởng (tối đa 3 cơ hội, xếp hạng theo điểm):
- `opportunity_id`, `statement`, `based_on`, `expected_value`, `effort`, `confidence`, `evidence`, `score`.

### 6. `GrowthInterventionPlan`
Kế hoạch can thiệp 14–30 ngày cho cơ hội ưu tiên số 1:
- `id`, `opportunity_id`, `problem`, `hypothesis`, `intervention`, `assets`, `channels`, `cta`, `demand_mechanism`, `kpi`, `duration`.

### 7. `ContentRequestSpec`
Đặc tả bàn giao cho Content Skill:
- `request_id`, `producer_id`, `objective`, `growth_problem`, `target_behavior`, `key_evidence`, `required_assets`, `channel`, `cta`.

### 8. `MarketLearningRecord`
Ghi nhận học hỏi sau thực nghiệm:
- `id`, `intervention_id`, `observed`, `outcome`, `hypothesis_status`, `learning`, `next_action`.
