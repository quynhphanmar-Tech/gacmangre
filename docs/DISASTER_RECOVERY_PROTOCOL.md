# GẠC MĂNG RÊ — DISASTER RECOVERY & ROLLBACK PROTOCOL
## CHUẨN KIỂM SOÁT SỰ CỐ VÀ KHÔI PHỤC HỆ THỐNG (MVP & SCALE)

> **"ĐỪNG VỘI SỬA — ĐỪNG VỘI ROLLBACK. KHÔNG ROLLBACK KHI CHƯA DIAGNOSE."**

---

### 1. Chỉ Tiêu RPO & RTO

| Chỉ tiêu | Định nghĩa | MVP | Khi Scale |
|---|---|---|---|
| **RPO** (Recovery Point Objective) | Lượng dữ liệu tối đa chấp nhận mất khi sự cố | $\le$ 24h | $\le$ 1h |
| **RTO** (Recovery Time Objective) | Thời gian tối đa đưa hệ thống trở lại hoạt động | $\le$ 4h | $\le$ 1h |
| **Daily DB Backup** | Sao lưu định kỳ cơ sở dữ liệu hàng ngày | Có | Có |
| **Snapshot trước migration** | Sao lưu nguyên trạng schema & data trước khi DDL | **Bắt buộc** | **Bắt buộc** |
| **Git Release Checkpoint** | Gắn tag Git release mỗi milestone | Mỗi Milestone | Mỗi Release |
| **Restore Test** | Kiểm tra khôi phục thử nghiệm trên môi trường test | 1 lần / tuần | Định kỳ tự động |

---

### 2. Backup Retention Policy

1. **Daily Backup**: Giữ từ 7 – 14 ngày.
2. **Weekly Backup**: Giữ từ 4 – 8 tuần.
3. **Milestone Snapshots**: Lưu trữ lâu dài, gắn chặt với Git tag:
   - `v0.6.0-audit-foundation` *(Current)*
   - `v0.7.0-fulfillment`
   - `v0.8.0-qr`
   - `v0.9.0-loyalty`
4. Mỗi milestone bắt buộc gồm bộ 4 yếu tố:
   $$\text{Milestone} = \text{Git Release} + \text{DB Snapshot} + \text{Migration Version} + \text{Known Good State}$$

---

### 3. Ma Trận Phân Định Lớp Rollback (Rollback Matrix)

> **Tuyệt đối không dùng "rollback toàn hệ thống" như phản xạ mặc định.**

| Sự cố | Phân loại Layer | Hành động Rollback chuẩn | Ảnh hưởng Core |
|---|---|---|---|
| **UI / Code logic FE-BE lỗi** | `CODE` | Rollback Git Release checkpoint | Không đụng chạm DB / Orders |
| **Migration SQL lỗi cú pháp/logic** | `MIGRATION` | Chạy migration rollback script hoặc restore DB snapshot trước migration | Bảo lưu đơn hàng hợp lệ |
| **Data Corruption (dữ liệu sai lệch)** | `DATABASE` | Restore DB về Snapshot gần nhất trong RPO | Xác minh lại audit ledger |
| **Event bất đồng bộ thất bại** | `EVENT` | Replay / Retry Event Queue theo `event_id` | Core Order không bị hủy |
| **Make.com kẹt webhook** | `AUTOMATION` | Tạm ngắt adapter, lưu queue nội bộ | Core Order vẫn tạo bình thường |
| **Zalo OA API timeout / từ chối** | `ADAPTER` | Retry theo exponential backoff hoặc đổi fallback provider | Không ảnh hưởng thanh toán/đơn |
| **Đơn vị vận chuyển (GHN/Viettel) lỗi** | `ADAPTER` | Adapter retry hoặc chuyển sang phân loại MANUAL | Core Order vẫn giữ nguyên |
| **Cổng thanh toán / Đối tác sập** | `EXTERNAL_PROVIDER` | Core GMR tiếp tục hoạt động độc lập | Tuyệt đối không rollback Order |

---

### 4. Protocol 6 Bước Xử Lý Sự Cố

```text
 01 — DETECT
    │  Ghi nhận: timestamp, module, symptom, affected_entity, error, correlation_id
    ↓
 02 — FREEZE
    │  Tạm dừng thao tác gây lan rộng.
    │  CẤM: Không xóa DB, Không sửa DB trực tiếp, Không deploy vội, Không rollback ẩu.
    ↓
 03 — DIAGNOSE
    │  Xác định Layer: CODE | DATABASE | MIGRATION | EVENT | ADAPTER | EXTERNAL.
    │  Xác định Blast Radius: USER | ORDER | NGĂN | MODULE | SYSTEM.
    ↓
 04 — ROLLBACK
    │  Chọn checkpoint nhỏ nhất cần thiết: Code (Git tag) / DB (Snapshot) / Event (Replay).
    ↓
 05 — VERIFY
    │  Kiểm tra 8 chiều trước khi mở lại: Core pages, Order creation, Existing orders,
    │  Customer data, Event queue, Audit log, Traceability, External adapters.
    ↓
 06 — RESUME
       Chỉ mở lại hệ thống khi toàn bộ 8 chiều PASS. Lập biên bản Incident Record.
```

---

### 5. Format Giao Tiếp Chuẩn Giữa PM & Kỹ Thuật Khi Có Sự Cố

Khi phát hiện vấn đề, PM gửi đúng 10 câu hỏi theo định dạng:

```text
INCIDENT QUESTION:
Có vấn đề ở [module/chức năng]. Hãy Diagnose trước, chưa rollback.
1. Lỗi nằm ở layer nào: Code / DB / Event / Adapter / External?
2. Blast radius là gì? (1 user / 1 order / 1 ngăn / 1 module / toàn hệ thống)
3. Những dữ liệu nào có nguy cơ bị ảnh hưởng?
4. correlation_id và log liên quan là gì?
5. Last Known Good State là checkpoint nào?
6. RPO/RTO hiện tại có bị vượt không?
7. Đề xuất phương án recovery ít ảnh hưởng nhất.
8. Nếu rollback, rollback chính xác module/layer nào?
9. Sau rollback cần verify những gì?
10. Có cần tạo preventive action để tránh lặp lại không?
```

> **Nguyên tắc kỹ thuật:** Code không được tự ý rollback, chạy migration production hoặc destructive operation chỉ dựa trên phán đoán. Bắt buộc phải phản hồi: **Diagnosis $\rightarrow$ Impact $\rightarrow$ Options $\rightarrow$ Recommendation** trước khi thực thi.
