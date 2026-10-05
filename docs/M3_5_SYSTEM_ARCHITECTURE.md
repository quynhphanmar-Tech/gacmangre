# GẠC MĂNG RÊ — M3.5 SYSTEM ARCHITECTURE
**Tích Hợp Toàn Diện: Producer Intelligence & Live Validation Engine**

---

## 1. Bản Đồ Tổng Thể Luồng Dữ Liệu (Master Flow)

```text
[DISCOVERY] ──> [INTAKE] ──> [QUALIFY & SCORECARD]
 (URL/Social)   (Source Profile)       │
                                        ├── [READY] ──> [STORY ARCHITECT] ──> [NGĂN DRAFT] ──> [HUMAN APPROVE]
                                        │                                                             │
                                        ├── [DEVELOP] ──> [PRODUCER REQUEST]                          ▼
                                        │                      │                                 [OPEN NGĂN]
                                        │                      ▼                                      │
                                        │                 (Bổ sung data)                              ▼
                                        └── [NOT_FIT] ─────────────────────────┐               [DEMAND SIGNAL]
                                                                               │                (M2 Atomic Orders)
                                                                               │                      │
                                                                               ▼                      ▼
                                                                     [LEARNING LOOP] <── [FULFILLMENT & FEEDBACK]
                                                                     (Data Moat)          (M3 Events & Automation)
```

---

## 2. Các Phân Vùng Lưu Trữ & Nguyên Tắc Tách Biệt Dữ Liệu

Theo nguyên tắc Mục 18:
1. **Source of Truth Layer**: Hồ sơ nhà sản xuất, nguyên liệu thô, tài liệu kiểm định, liên hệ thực tế.
2. **Interpretation Layer**: Điểm số Curation, phân tích Story Opportunity, lời mời mở Ngăn (do AI hỗ trợ biên tập, cần Human duyệt).
3. **Commerce Layer**: Đơn hàng, số lượng gom, mã tuần tự `GM-2026-XXXXXX`, trạng thái thanh toán (`payment_status = 'UNPAID'`).
4. **Experiment Layer**: Đo lường 4 nhóm sản vật `GM-LIVE-01-001` đến `004` (vận tốc, tỷ lệ hoàn tất form, câu hỏi thường gặp).
5. **Learning Moat**: Đúc kết từ phản hồi khách nhận hàng để nâng chuẩn thẩm định `GMR Curation Standard`.

---

## 3. Hệ Thống Định Danh Thực Thể (ID Conventions)

- **Source Profile**: `src-[category]-[slug]` (Ví dụ: `src-001-cacao-oca`)
- **Experiment ID**: `GM-LIVE-01-[001..004]`
- **Ngăn**: `ngan-live-[001..004]` (Hiển thị `#001` đến `#004`)
- **Order Code**: `GM-2026-[000001..999999]`
- **Event ID**: `evt-[timestamp]-[hash]`
