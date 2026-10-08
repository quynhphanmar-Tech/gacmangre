# GẠC MĂNG RÊ — NGAN_SCHEMA
**Version: 1.0 · Cấu Trúc Dữ Liệu & State Machine Của Ngăn**

> **Định nghĩa:**  
> `Ngăn` (The Drawer) là đơn vị thương mại và trải nghiệm trung tâm của Gạc Măng Rê.  
> Không phải trang sản phẩm (Product Page) thông thường; mỗi Ngăn là một mẻ thu hoạch thật kết nối trực tiếp giữa người làm bản địa và cộng đồng người thưởng thức.

---

## 1. JSON Schema & TypeScript Definition

```typescript
export interface Ngan {
  /** Mã định danh Ngăn (vd: 'ngan-live-001') */
  id: string;

  /** Số hiệu Ngăn chính thức (vd: '#001', '#002') */
  number: string;

  /** Đường dẫn thân thiện URL (vd: 'cacao-oca', 'mat-ong-bac-ha-meo-vac') */
  slug: string;

  /** Khóa ngoại liên kết sản phẩm lõi */
  product_id: string;

  /** Tiêu đề hiển thị trên Ngăn */
  title: string;

  /** Mô tả ngắn xúc tích (1 câu) */
  short_description: string;

  /** Mức đóng góp một phần (VND) */
  price: number;

  /** Chỉ tiêu tối thiểu để đủ mẻ mở ngăn (Minimum Order Quantity) */
  moq: number;

  /** Số lượng phần cộng đồng đã đăng ký hiện tại */
  current_quantity: number;

  /** Thời điểm bắt đầu mở nhận gom */
  open_at: string;

  /** Hạn chót gom mẻ */
  deadline: string;

  /** Trạng thái vòng đời Ngăn */
  status: 'DRAFT' | 'OPEN' | 'FULL' | 'PRODUCER_CONFIRMING' | 'PRODUCTION' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

  /** Ảnh đại diện chính (ưu tiên thực địa) */
  hero_image: string;

  /** Danh mục tư liệu hình ảnh phân loại theo slot */
  media_assets?: MediaAsset[];

  /** Thực thể nội dung ký sự liên kết */
  story_object?: StoryObject;

  /** Trạng thái nhu cầu & CTA động */
  demand_state?: {
    current_quantity: number;
    moq: number;
    progress_percent: number;
    qualified_demand: boolean;
    state: string;
    cta: string;
  };

  /** Cấu hình tùy biến copy & ảnh đã duyệt từ Admin/Backend */
  content_config?: NganContentConfig;

  /** Dự kiến thời gian xuất xưởng và giao mẻ tươi */
  shipping_estimate?: string;

  /** Thực thể sản phẩm chi tiết */
  product?: Product;
}
```

---

## 2. Finite State Machine (Ngăn Lifecycle)

```text
       [DRAFT] (Đang thu thập tư liệu thực địa, chưa công khai)
          │
          ↓
       [OPEN] (Chính thức mở nhận đăng ký mẻ · Chưa thu tiền trước)
          │
          ├──────────────────────────────────────────┐
          │ (current_quantity >= moq)                │ (Quá hạn gom mà không đủ MOQ)
          ↓                                          ↓
       [FULL] (Đủ mẻ MOQ)                        [EXPIRED / CANCELLED]
          │
          ↓
 [PRODUCER_CONFIRMING] (Nhà sản xuất xác nhận mẻ tươi qua Zalo OA)
          │
          ↓
    [PRODUCTION] (Bắt đầu rang xay / quay mật / đóng gói theo số lượng chuẩn)
          │
          ↓
     [SHIPPING] (Xuất xưởng kèm mã tracking vận đơn đến tận tay khách)
          │
          ↓
    [COMPLETED] (Giao thành công, chuyển dữ liệu lưu trữ vào "Đã Mở")
```

---

## 3. Ràng Buộc Kiểm Duyệt Ngăn (Ngăn State Gate — NG Rules)

1. **`NG-001` (CTA State Binding):** Nút hành động chính bắt buộc phải sinh động từ trạng thái Ngăn:
   - Khi `OPEN` $\rightarrow$ Nút: `"CÙNG MỞ MẺ NGAY"`, mở form đặt trước (không thu phí).
   - Khi `FULL` $\rightarrow$ Nút: `"ĐÃ ĐỦ MẺ — CHỜ XÁC NHẬN"`.
   - Khi `PRODUCTION` $\rightarrow$ Nút: `"MẺ ĐANG ĐƯỢC CHẾ BIẾN"`.
2. **`NG-002` (MOQ Truthfulness):** Số lượng hiển thị `current_quantity / moq` phải phản ánh chính xác số đơn hàng hợp lệ trong cơ sở dữ liệu. Cấm hardcode số lượng ảo.
3. **`NG-003` (No Cross-Producer Contamination):** Một Ngăn chỉ liên kết duy nhất với một Producer và các địa danh thuộc quyền quản lý của Producer đó.
