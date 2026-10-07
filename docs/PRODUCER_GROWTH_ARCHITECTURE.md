# GẠC MĂNG RÊ — PRODUCER GROWTH ARCHITECTURE

## 1. Vị trí trong Hệ thống Brand OS & Hierarchy

```text
SYSTEM OS
   ↓
BRAND OS (Mộc · Tĩnh · Chiều sâu · Người thật · Đương đại)
   ↓
KNOWLEDGE / EVIDENCE MINING
   ↓
PRODUCER GROWTH SKILL (v0.1)
   ├── 1. Source Surface Scanner (13 Surfaces)
   ├── 2. Evidence Miner (Truth Status Enforcer)
   ├── 3. Producer Intelligence (11 Dimensions)
   ├── 4. Growth Diagnosis (8 Dimensions: Product, Brand, Story, Proof, Content, Channel, Demand, Commerce)
   ├── 5. Value–Trust–Price Triad
   ├── 6. Primary Growth Hypothesis Engine (Classification: HYPOTHESIS, Facts + Interpretations)
   ├── 7. Opportunity Map (Ranked, Max 3)
   ├── 8. Intervention Plan (Top 1, 14-30 days)
   └── 9. Content Request Adapter (Hand-off to Content Skill)
   ↓
STORY OBJECT
   ↓
NGĂN STATE MACHINE (DISCOVERY → CURATED → STORY_READY → OPEN_NGAN → FULFILLED)
   ↓
CONTENT / DESIGN / WORKBENCH
   ↓
MARKET LEARNING
```

## 2. Invariants & Epistemic Rules

1. **PRODUCER_CLAIM ≠ VERIFIED:** Bất kỳ tuyên bố nào của nhà sản xuất (kể cả có logo huy hiệu trên trang chủ) nếu chưa có tài liệu kiểm định bên thứ ba hoặc cổng hành chính công khai đều phải giữ ở trạng thái `PRODUCER_CLAIM`.
2. **Cấm Y tế hoá:** Mọi tuyên bố trị bệnh, ngừa ung thư, cải tử hoàn đồng đều tự động bị gán `MISSING_EVIDENCE` và cấm đưa vào truyền thông thương hiệu.
3. **Chống Ảo tưởng Tăng trưởng (No Fake Silver Bullets):** Không đưa ra giải pháp chạy quảng cáo rầm rộ hoặc giảm giá sốc. Can thiệp phải bám sát cơ chế gom mẻ (Group-buy MOQ) và chia sẻ chi phí vận chuyển.
4. **Không Tạo Object Mồ côi (No Orphan Objects):** Bất kỳ giả thuyết hay cơ hội tăng trưởng nào cũng phải truy được về `producer_id`, `source_id`, và `evidence_id`.
