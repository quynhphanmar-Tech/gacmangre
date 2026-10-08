# GẠC MĂNG RÊ — STORY_OBJECT_SCHEMA
**Version: 1.0 · Cấu Trúc Dữ Liệu Thực Thể Ký Sự Sản Vật**

> **Nguyên tắc định danh:**  
> `StoryObject` là thực thể dữ liệu độc lập (Single Source of Truth cho nội dung), cầu nối trung gian giữa bằng chứng thực địa (`Evidence`) và giao diện hiển thị (`Ngăn UI`).  
> **Tuyệt đối không hardcode text bài viết trực tiếp vào giao diện frontend.**

---

## 1. JSON Schema & TypeScript Definition

```typescript
export interface StoryObject {
  /** Mã định danh duy nhất của Story Object (vd: 'story-obj-oca', 'story-obj-meovac') */
  id: string;

  /** Tiêu đề ký sự mang sức nặng của sự thật (Fact-driven Headline) */
  headline: string;

  /** Đoạn trích dẫn cô đọng lay động (1–2 câu) */
  excerpt: string;

  /** Toàn bộ nội dung ký sự chuyên sâu (nếu có bài đọc riêng) */
  full_content?: string;

  /** 01. VÌ SAO CHỌN SẢN VẬT NÀY (Why This) */
  why_this: string;

  /** 02. LÝ DO ĐẶT TRƯỚC (Triad: Care · Trust · Act Now) */
  why_preorder_care: string;      // Vì sao nên quan tâm & đón nhận?
  why_preorder_trust: string;     // Căn cứ nào để trao gửi niềm tin?
  why_preorder_act_now: string;   // Tại sao cần mở mẻ ngay thời điểm này?

  /** 03. QUY TRÌNH THỦ CÔNG (Đôi tay & Cách làm mộc) */
  making_process: string[];       // Danh sách các bước: ['Thu hoạch...', 'Lên men...', 'Phơi giàn...']

  /** 04. BỐN LÁT CẮT TIÊU CHUẨN CỦA GẠC MĂNG RÊ */
  selection_dat: string;          // Thổ nhưỡng, địa hình, vi khí hậu bản địa
  selection_nguoi: string;        // Chân dung con người làm nghề tử tế
  selection_vi: string;           // Hương vị nguyên bản, cấu trúc cảm quan
  selection_chuyen: string;       // Lát cắt văn hóa & câu chuyện giữ nghề

  /** 05. LÝ DO GMR MỞ NGĂN NÀY (Curation Justification) */
  curation_reason: string;

  /** 06. DANH SÁCH LIÊN KẾT MINH CHỨNG ĐÃ ĐỐI SOÁT (Evidence References) */
  evidence_refs: CanonicalEvidenceItem[];

  /** 07. DANH SÁCH TƯ LIỆU HÌNH ẢNH CÓ NGUỒN GỐC (Asset References) */
  asset_refs?: MediaAsset[];

  /** Điểm số giám tuyển GMR Fit (Thang 10) */
  gmr_fit_score?: number;

  /** Người duyệt & Thời điểm phê duyệt */
  approved_by?: string;
  approved_at?: string;
}
```

---

## 2. Ràng Buộc Kiểm Duyệt (Story Gate — SG Rules)

Mỗi `StoryObject` trước khi được liên kết vào Ngăn bắt buộc phải thỏa mãn:

1. **`SG-001` (Narrative Arc):** Phải đi đúng trình tự:
   $$\text{FACT} \rightarrow \text{DETAIL} \rightarrow \text{HUMAN} \rightarrow \text{MEANING} \rightarrow \text{PRODUCT} \rightarrow \text{OPEN NGĂN}$$
2. **`SG-002` (No Medical Overclaim):** Tuyệt đối không chứa các từ ngữ khẳng định y khoa trị liệu ("chữa dứt điểm", "phòng chống ung thư", "thần dược", "điều trị").
3. **`SG-003` (No Romanticization of Poverty):** Khắc họa sự tử tế và lòng tự trọng của người nông dân; không lợi dụng hình ảnh nghèo khổ để kêu gọi mua hàng mang tính từ thiện ban ơn.
4. **`SG-004` (Evidence Grounding):** Mọi tuyên bố về tỷ lệ bơ, cao độ địa hình, thời gian lên men đều phải có `evidence_id` tương ứng trong danh sách `evidence_refs`.
