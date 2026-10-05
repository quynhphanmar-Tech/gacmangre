# GẠC MĂNG RÊ — CONTENT & IMAGE ARCHITECTURE
**Version 1.0 · Integrity & Progressive Media Layer**

> "Sự thật tạo ra cảm xúc. Hình ảnh và tư liệu phải trung thực tuyệt đối với con người và vùng đất."

---

## 1. Bốn Loại Asset (Four Asset Types)

Hệ thống quản lý tư liệu hình ảnh của Gạc Măng Rê phân định rạch ròi 4 loại asset với mục đích và chuẩn mực kiểm chứng riêng:

```text
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   DOCUMENTARY   │      │     SOURCE      │      │    EDITORIAL    │      │  AI_GENERATED   │
│  (Tư liệu gốc)  │      │ (Nguồn cung cấp)│      │  (Biên tập ảnh) │      │  (Tạo bởi AI)   │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │                        │
         ↓                        ↓                        ↓                        ↓
  Bắt buộc xác minh        Có giấy phép &        Tuyển chọn thẩm mỹ      TUYỆT ĐỐI KHÔNG
  (is_verified=true)       ghi công nguồn         tôn vinh sản vật        làm bằng chứng thật
```

### 1.1. `DOCUMENTARY` (Tư liệu thực địa)
* **Định nghĩa:** Ảnh/video do chính đội ngũ Gạc Măng Rê trực tiếp chụp/quay tại thực địa (người làm, đôi bàn tay, con đèo, lán ong, tàng mật vít nắp).
* **Quy tắc bắt buộc:** `is_verified: true`.
* **Ý nghĩa:** Là bằng chứng chân thực nhất về nguồn gốc, quy trình và cái tâm của người làm.

### 1.2. `SOURCE` (Tư liệu từ nhà sản xuất / Đối tác bản địa)
* **Định nghĩa:** Ảnh, video, tài liệu kiểm nghiệm do chính người làm hoặc hợp tác xã địa phương gửi qua Zalo/điện thoại.
* **Đặc điểm:** Thường chụp bằng điện thoại, góc chụp thô mộc, ánh sáng tự nhiên, đôi khi độ phân giải chưa cao.
* **Quy tắc bắt buộc:** Phải có `source`, `license`, `credit` rõ ràng.

### 1.3. `EDITORIAL` (Ảnh nghệ thuật & Biên tập)
* **Định nghĩa:** Ảnh chụp tĩnh vật trong studio, ảnh bài trí món ăn, ảnh bối cảnh phong cảnh bản quyền chất lượng cao được curator tuyển chọn để dẫn nhập cảm xúc.
* **Quy tắc bắt buộc:** Ghi rõ quyền sử dụng (`license`), không được mạo nhận là ảnh nhà sản xuất cụ thể nếu không phải.

### 1.4. `AI_GENERATED` (Hình ảnh tạo bởi Trí tuệ Nhân tạo)
* **Định nghĩa:** Hình ảnh mô phỏng chất liệu hoặc minh họa ý niệm do AI sinh ra (nếu có dùng).
* **Quy tắc bất di bất dịch:**
  > **AI_GENERATED NEVER PRESENTED AS DOCUMENTARY EVIDENCE.**  
  > Tuyệt đối không bao giờ dùng ảnh AI để giả mạo người nông dân, bàn tay lao động, cảnh quay mật hay chứng nhận kiểm nghiệm thật. Nếu có asset AI thử nghiệm, bắt buộc phải gắn nhãn minh bạch `AI_GENERATED`.

---

## 2. Media Asset Schema Specification

Mỗi file hình ảnh/video trong hệ thống đều sở hữu metadata chuẩn:

```typescript
export type AssetType = 'DOCUMENTARY' | 'SOURCE' | 'EDITORIAL' | 'AI_GENERATED';

export interface MediaAsset {
  id: string;
  url: string;
  thumbnail_url?: string;
  asset_type: AssetType;
  source: string;              // e.g. "Chuyến thực địa Gạc Măng Rê 10/2026", "Zalo Anh Páo"
  license: string;             // e.g. "GacMangRe Exclusive", "Creative Commons", "Producer Authorized"
  credit: string;              // e.g. "Ảnh: Nguyễn Văn A", "Cung cấp bởi: Giàng A Páo"
  is_verified: boolean;        // true nếu đã được đối chiếu thực địa
  alt_text: string;            // Mô tả hình ảnh chi tiết cho accessibility & SEO
  caption?: string;            // Chú thích xuất hiện bên dưới ảnh
  width?: number;
  height?: number;
  created_at: string;
}
```

---

## 3. Progressive Replacement Architecture (Kiến trúc Thay thế Tiệm tiến)

Trong thực tế vận hành MVP:
1. **Giai đoạn ban đầu (Day 1):** Người làm ở bản cao (như anh Giàng A Páo) chỉ có thể gửi ảnh chụp nhanh bằng điện thoại qua Zalo (`asset_type: 'SOURCE'`). Ảnh có thể mờ hoặc chụp vội.
2. **Giai đoạn thực địa (Day 3–7):** Đội ngũ Gạc Măng Rê đến tận nơi, ghi lại bộ ảnh chuẩn tư liệu sắc nét (`asset_type: 'DOCUMENTARY'`).
3. **Nguyên tắc kỹ thuật:**
   > **Media Layer độc lập với Page Structure.**  
   > Các trang Ngăn và Story tham chiếu media thông qua Asset ID hoặc Media Slot (`hero`, `hands`, `location`, `process`, `product_texture`).  
   > Khi nâng cấp từ ảnh Zalo của người làm sang ảnh máy cơ thực địa, hệ thống **chỉ cần tráo đổi asset record**, toàn bộ cấu trúc URL, SEO, text content và layout website được giữ nguyên vẹn 100%.

```text
PRODUCER ASSETS (Source via Zalo)
       │
       ↓ (Curator Review & Ingestion)
CURATED ASSETS REPOSITORY (Supabase Storage + Media Assets Table)
       │
       ├─────────────────────────┐
       ↓                         ↓
  STORY PAGE                 NGĂN PAGE
(Slot: Hero, Landscape)   (Slot: Hands, Process, Product)
       │                         │
       └───────────┬─────────────┘
                   ↓
   (Khi có ảnh Documentary mới)
Tráo đổi Asset ID → Giữ nguyên cấu trúc trang
```

---

## 4. Bảng Kiểm Tra Tuân Thủ (Compliance Checklist)

- [x] Không bao giờ gắn mác `DOCUMENTARY` cho ảnh stock hoặc ảnh chưa được đội ngũ kiểm chứng.
- [x] Luôn hiển thị `credit` và `source` kín đáo nhưng rõ ràng ở chân ảnh bài viết.
- [x] Luôn có `alt_text` mô tả chân thực nội dung thị giác.
- [x] Đảm bảo cấu trúc data hỗ trợ nhiều ảnh con trong một Ngăn/Story thay vì chỉ một trường `hero_image` đơn điệu.
