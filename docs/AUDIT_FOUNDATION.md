# GẠC MĂNG RÊ — AUDIT FOUNDATION ARCHITECTURE
## 6-LAYER OBSERVABILITY & PM CONTROL TOWER

> **"Mọi dữ liệu quan trọng phải có nguồn; mọi hành động quan trọng phải có dấu vết; mọi module phải có thể thay thế mà không phá Core."**

---

### 1. Bốn Nguyên Tắc Lõi

| Nguyên tắc | Cơ chế kiểm soát |
|---|---|
| **Truth** | Không biến claim thành fact (`VERIFIED` vs `PRODUCER_CLAIM`). |
| **Traceability** | Dữ liệu và hành động luôn trace ngược về Actor, Source, Evidence qua `correlation_id`. |
| **Decoupling** | External Adapters (Zalo, Viettel, GHN, Make) tách rời độc lập, không chứa business logic. |
| **Auditability** | PM luôn truy được “Ai đã làm gì, trên đối tượng nào, lúc nào, kết quả ra sao”. |

---

### 2. Mô Hình 6 Lớp (6-Layer Observability)

```text
                    GMR CORE
                       │
       ┌───────────────┼────────────────┐
       ↓               ↓                ↓
     DATA            BUSINESS         EXTERNAL
    TRUTH             STATE           ADAPTERS
       │               │                ↓
 SOURCE / STORY     ORDER / NGĂN      ZALO
 PRODUCT / CRM      DEMAND            CARRIER (GHN/Viettel)
 CUSTOMER           FULFILLMENT       MAKE WEBHOOKS
       │               │                │
       └───────────────┼────────────────┘
                       ↓
              OBSERVABILITY LAYER
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      EVENT          AUDIT          ERROR
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                 CONTROL TOWER
             (/admin/control-tower)
```

1. **Layer 01 — Data Truth**:
   - Hierarchy: `SOURCE → PRODUCER → PLACE → PRODUCT → EVIDENCE → STORY OBJECT → NGĂN → CONTENT → DEMAND → LEARNING`.
   - Phân định rõ ràng: `VERIFIED` (đã đối soát thực địa/chứng từ), `PRODUCER_CLAIM` (khẳng định của người làm, chưa chứng minh), `SOURCE_INFERRED`.

2. **Layer 02 — Business State Machine**:
   - Ngăn: `DISCOVERY → CURATED → STORY_READY → CONTENT_LIVE → DEMAND → OPENED → FULFILLMENT → REVIEW → REPEAT`.
   - Fulfillment: `PENDING → PRODUCER_CONFIRMED → PREPARING → READY_TO_RECEIVE → RECEIVED → PACKED → READY_TO_SHIP → SHIPPED → DELIVERED`.
   - Tuyệt đối cấm nhảy cóc trạng thái (ví dụ `RECEIVED` nhảy thẳng sang `DELIVERED` bị chặn lập tức).

3. **Layer 03 — Business Event**:
   - Phát các sự kiện nghiệp vụ bất biến: `ORDER_CREATED`, `MOQ_REACHED`, `PRODUCER_CONFIRMED`, `PACKAGE_CREATED`, `QR_SCANNED`, `LOYALTY_GRANTED`, `ORDER_SHIPPED`, `ORDER_DELIVERED`.
   - Trả lời: *"Hệ thống đã làm gì?"*

4. **Layer 04 — Audit Log (Append-Only)**:
   - Trả lời: *"Ai đã làm gì, trên đối tượng nào, từ trạng thái nào sang trạng thái nào, lý do gì, lúc nào?"*
   - Không thể chỉnh sửa hoặc xóa tùy tiện.

5. **Layer 05 — Error Log**:
   - Trả lời: *"Cái gì hỏng, thuộc module nào, correlation_id là gì, retry count bao nhiêu và ảnh hưởng đến đâu?"*
   - Non-blocking: Lỗi ghi log không bao giờ làm transaction chính bị hủy.

6. **Layer 06 — Correlation Key**:
   - Mọi chuỗi workflow được gắn một `correlation_id` duy nhất (ví dụ: `corr_ord_gm2026000075_17282348234`).
   - PM tìm 1 ID là tra cứu được toàn bộ hành trình từ lúc mở Ngăn đến khi tích điểm.

---

### 3. Ma Trận Rà Soát 100% Modules (Audit Matrix)

| Module | Data Truth | State Rule | Event | Audit | Error | Traceability | Adapter |
|---|---|---|---|---|---|---|---|
| **Source (P0)** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Curation (P0)** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Story Object** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Ngăn** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Order Engine** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Automation** | — | ✓ | ✓ | ✓ | ✓ | ✓ | Make / Zalo |
| **Fulfillment** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Carrier (Manual/GHN) |
| **QR Engine** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Opaque Crypto (No PII) |
| **Loyalty Ledger** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Point Ledger |
| **Customer/CRM Bridge** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Decoupled Bridge |

---

### 4. Giao Diện PM Control Tower

- URL: `/admin/control-tower`
- Các tính năng:
  - **System Health Radar**: Giám sát thời gian thực trạng thái 14 module/adapters và tỷ lệ lỗi.
  - **Audit Log Ledger**: Bảng lịch sử dấu vết chi tiết, lọc theo Module (`ORDER`, `FULFILLMENT`, `CURATION`, `QR`, `LOYALTY`).
  - **Correlation Trace**: Tra cứu hành trình xuyên suốt (End-to-End timeline) theo `correlation_id`.
  - **Audit Matrix**: Bảng đối soát tiêu chuẩn Definition of Done.
