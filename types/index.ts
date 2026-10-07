// ==============================================================================
// GẠC MĂNG RÊ — Core TypeScript Type Definitions
// Version: 1.1 (Build Brief v1.1 + Content & Image Architecture)
// ==============================================================================

export type NganStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'OPEN'
  | 'FULL'
  | 'PRODUCER_CONFIRMING'
  | 'PRODUCTION'
  | 'SHIPPING'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELLED';

export type OrderStatus =
  | 'CREATED'
  | 'CONFIRMED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'FULFILLING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type FulfillmentStatus =
  | 'PENDING'
  | 'PRODUCER_CONFIRMED'
  | 'PREPARING'
  | 'READY_TO_RECEIVE'
  | 'RECEIVED'
  | 'PACKED'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED'
  | 'RETURNED';

export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

// ==============================================================================
// CONTENT & IMAGE ASSET TYPES (Brief v1.1 Task 2 & 3)
// ==============================================================================
export type AssetType = 'DOCUMENTARY' | 'SOURCE' | 'EDITORIAL' | 'AI_GENERATED';

export interface MediaAsset {
  id: string;
  url: string;
  thumbnail_url?: string;
  asset_type: AssetType;
  source: string;              // e.g. "Chuyến thực địa Gạc Măng Rê 10/2026", "Zalo Giàng A Páo"
  license: string;             // e.g. "GacMangRe Exclusive", "Producer Authorized"
  credit: string;              // e.g. "Ảnh: Nguyễn Văn A", "Cung cấp bởi Giàng A Páo"
  is_verified: boolean;        // true nếu là ảnh chụp thực tế đã xác thực
  alt_text: string;            // Mô tả ảnh trợ năng & SEO
  caption?: string;            // Chú thích chân thực
  slot?: 'hero' | 'hands' | 'landscape' | 'process' | 'texture' | 'producer';
  created_at: string;
}

export interface Producer {
  id: string;
  name: string;
  slug: string;
  brand_name: string;
  location: string;
  description: string;
  story: string;
  avatar: string;
  phone: string;
  zalo: string;
  capacity: number;
  status: EntityStatus;
  media_assets?: MediaAsset[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  producer_id: string;
  name: string;
  slug: string;
  category?: string;
  description: string;
  origin: string;
  unit: string;
  weight: string;
  price: number;
  ingredients: string;
  storage: string;
  expiry: string;
  certifications: string;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
  producer?: Producer;
}

export interface Ngan {
  id: string;
  number: string;
  slug: string;
  product_id: string;
  title: string;
  short_description: string;
  price: number;
  moq: number;
  current_quantity: number;
  open_at: string;
  deadline?: string;
  status: NganStatus;
  hero_image: string;
  gallery: string[];
  media_assets?: MediaAsset[];
  selection_dat: string;
  selection_nguoi: string;
  selection_vi: string;
  selection_chuyen: string;
  shipping_estimate: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  type: string;
  excerpt: string;
  content: string;
  cover_image: string;
  video_url?: string;
  producer_id?: string;
  product_id?: string;
  media_assets?: MediaAsset[];
  published_at: string;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
  producer?: Producer;
  product?: Product;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  zalo_identifier?: string;
  address: string;
  province?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_code: string;
  customer_id: string;
  ngan_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: string; // 'UNPAID' for M2
  note?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  landing_url?: string;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  ngan?: Ngan;
}

export interface Fulfillment {
  id: string;
  order_id: string;
  producer_id?: string;
  status: FulfillmentStatus;
  tracking_number?: string;
  carrier?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export type EventStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED';

export interface EventItem {
  id: string;
  correlation_id: string;
  event_type:
    | 'ORDER_CREATED'
    | 'MOQ_REACHED'
    | 'PRODUCER_CONFIRMED'
    | 'PACKAGE_CREATED'
    | 'QR_SCANNED'
    | 'LOYALTY_GRANTED'
    | 'ORDER_SHIPPED'
    | 'ORDER_DELIVERED'
    | 'FEEDBACK_CREATED';
  entity_type: 'order' | 'ngan' | 'producer' | 'package' | 'qr' | 'story' | 'source';
  entity_id: string;
  actor_id?: string;
  actor_role?: 'SYSTEM' | 'ADMIN' | 'PRODUCER' | 'WAREHOUSE_STAFF' | 'CUSTOMER';
  payload: Record<string, unknown>;
  status: EventStatus;
  retry_count: number;
  last_error?: string;
  created_at: string;
  processed_at?: string;
  updated_at?: string;
}

export type GmrModule =
  | 'SOURCE'
  | 'CURATION'
  | 'STORY'
  | 'NGAN'
  | 'DEMAND'
  | 'ORDER'
  | 'AUTOMATION'
  | 'FULFILLMENT'
  | 'QR'
  | 'LOYALTY'
  | 'CRM'
  | 'ADAPTER_ZALO'
  | 'ADAPTER_CARRIER'
  | 'ADAPTER_MAKE';

export interface AuditLog {
  id: string;
  correlation_id: string;
  timestamp: string;
  module: GmrModule;
  action: string;
  actor: {
    id: string;
    name: string;
    role: 'ADMIN' | 'PRODUCER' | 'STAFF' | 'SYSTEM' | 'CUSTOMER';
  };
  entity: {
    type: 'ORDER' | 'NGAN' | 'PRODUCER' | 'BATCH' | 'SHIPMENT' | 'STORY' | 'SOURCE' | 'QR' | 'POINT';
    id: string;
    code?: string;
  };
  from_state?: string;
  to_state?: string;
  reason?: string;
  result: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  metadata?: Record<string, unknown>;
}

export interface ErrorLog {
  id: string;
  correlation_id: string;
  timestamp: string;
  module: GmrModule;
  error_code: string;
  error_message: string;
  stack_trace?: string;
  entity?: {
    type: string;
    id: string;
  };
  retry_count: number;
  status: 'PENDING_RETRY' | 'FAILED' | 'RESOLVED';
  resolved_at?: string;
  resolved_by?: string;
}

export type FailureLayer =
  | 'CODE'
  | 'DATABASE'
  | 'MIGRATION'
  | 'EVENT'
  | 'AUTOMATION'
  | 'ADAPTER'
  | 'EXTERNAL_PROVIDER'
  | 'DATA';

export type BlastRadius = 'USER' | 'ORDER' | 'NGAN' | 'MODULE' | 'SYSTEM';

export interface IncidentRecord {
  incident_id: string;
  detected_at: string;
  detected_by: string;
  module: GmrModule;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  correlation_id: string;
  affected_entity?: {
    type: string;
    id: string;
  };
  layer: FailureLayer;
  blast_radius: BlastRadius;
  symptom: string;
  root_cause?: string;
  action_taken?: string;
  rollback_point?: string;
  verified_by?: string;
  resolved_at?: string;
  preventive_action?: string;
  status: 'DETECTED' | 'FROZEN' | 'DIAGNOSED' | 'ROLLING_BACK' | 'VERIFYING' | 'RESOLVED';
}

export interface DisasterRecoverySnapshot {
  snapshot_id: string;
  timestamp: string;
  tag: string; // e.g. v0.6.0-audit-foundation
  git_commit: string;
  migration_version: string;
  rpo_target: string; // e.g. "<= 24h"
  rto_target: string; // e.g. "<= 4h"
  data_counts: {
    orders: number;
    customers: number;
    events: number;
    audits: number;
    ngans: number;
  };
  checksum: string;
  created_by: string;
}


export interface OrderInput {
  name: string;
  phone: string;
  zalo_identifier?: string;
  address: string;
  province?: string;
  quantity: number;
  ngan_id: string;
  note?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  landing_url?: string;
  idempotency_key?: string;
}

export interface OrderCreationResult {
  success: boolean;
  order?: Order;
  order_code?: string;
  is_duplicate?: boolean;
  error_code?: 'NGAN_NOT_FOUND' | 'NGAN_CLOSED' | 'QUANTITY_UNAVAILABLE' | 'VALIDATION_ERROR' | 'SERVER_ERROR';
  error?: string;
  remaining_capacity?: number;
}

// ==============================================================================
// M3.5 SYSTEMIC LIVE VALIDATION & PRODUCER INTELLIGENCE TYPES
// ==============================================================================

export type FactProvenance =
  | 'VERIFIED'           // Đã xác thực thực địa / giấy tờ công chứng
  | 'PRODUCER_CLAIM'     // Khẳng định từ phía nhà sản xuất (chưa kiểm chứng độc lập)
  | 'SOURCE_INFERRED'    // Suy luận từ tài liệu / social media
  | 'UNKNOWN';           // Chưa có thông tin

export interface ExtractedFact {
  field: string;
  value: string;
  provenance: FactProvenance;
  source_reference?: string;
  notes?: string;
}

export type CurationStatus =
  | 'NEW'
  | 'REVIEWING'
  | 'NEEDS_INPUT'
  | 'DEVELOP'
  | 'READY'
  | 'NOT_FIT';

export interface GmrScorecard {
  origin: number;                 // 0-10
  human: number;                  // 0-10
  craft: number;                  // 0-10
  distinctiveness: number;        // 0-10
  story_potential: number;        // 0-10
  proof: number;                  // 0-10
  product_quality_signal: number; // 0-10
  commercial_readiness: number;   // 0-10
  supply_reliability: number;     // 0-10
  gmr_fit_score: number;          // Điểm tổng hợp có trọng số (0-10)
  strengths: string[];
  weaknesses: string[];
  evaluation_summary: string;
}

export interface ProducerRequest {
  id: string;
  source_id: string;
  producer_name: string;
  missing_fields: string[];
  suggested_message: string;      // Thông điệp mộc mạc gửi Zalo/gọi điện
  status: 'PENDING' | 'SENT' | 'RECEIVED';
  created_at: string;
}

export interface StoryBrief {
  id: string;
  source_id: string;
  headline_angle: string;
  fact: string;                   // Cốt lõi sự thật
  detail: string;                 // Chi tiết đắt giá
  human: string;                  // Con người & bàn tay làm ra
  meaning: string;                // Ý nghĩa văn hóa / triết lý
  product: string;                // Sản vật đóng gói
  open_ngan_call: string;         // Lời mời mở Ngăn
  editorial_interpretation: string; // Tách biệt rõ suy luận biên tập
  media_recommendations: {
    slot: string;
    asset_type: AssetType;
    description: string;
  }[];
}

export interface SourceProfile {
  id: string;
  experiment_id?: string;         // e.g. "GM-LIVE-01-001"
  status: CurationStatus;
  input_url?: string;
  raw_input_notes?: string;

  // 1. Identity
  producer_name: string;
  organization?: string;
  contact_phone?: string;
  contact_zalo?: string;
  contact_email?: string;
  location: string;
  source_urls: string[];

  // 2. Product
  category: string;
  product_name: string;
  product_description: string;
  variants?: string[];

  // 3. Origin
  province: string;
  district?: string;
  locality?: string;
  raw_material_origin: string;

  // 4. Human
  producer_person: string;
  producer_story: string;

  // 5. Process
  production_method: string;
  distinctive_practice: string;

  // 6. Proof
  certifications: string[];
  documents: string[];
  source_claims: string[];
  references: string[];

  // 7. Commercial
  estimated_price?: number;
  unit?: string;
  moq?: number;
  capacity?: number;
  lead_time?: string;

  // 8. Media
  media_assets: MediaAsset[];

  // 9. Intelligence & Curation Layer
  facts: ExtractedFact[];
  missing_fields: string[];
  scorecard: GmrScorecard;
  producer_request?: ProducerRequest;
  story_brief?: StoryBrief;

  // Reference to generated Ngăn if status === 'READY'
  ngan_id?: string;
  ngan_slug?: string;

  created_at: string;
  updated_at: string;
}

// ==============================================================================
// M4 LIVE VALIDATION · 7 DAYS TYPES
// ==============================================================================

export type ExperimentDecision = 'SCALE' | 'KEEP_REVISE' | 'HOLD' | 'KILL' | 'INSUFFICIENT_DATA';

export interface DailySnapshot {
  date: string;
  experiment_id: string;
  views: number;
  cta_clicks: number;
  orders: number;
  quantity: number;
  shares: number;
  top_traffic_source: string;
}

export interface ContentAngle {
  id: string;
  type: 'VUNG_DAT' | 'CON_NGUOI' | 'CHI_TIET';
  headline: string;
  hook: string;
  utm_content: string;
  impressions?: number;
  clicks?: number;
}

export interface M4Experiment {
  experiment_id: string;          // e.g. "GM-LIVE-01-001"
  ngan_id: string;
  ngan_number: string;
  ngan_slug: string;
  product_name: string;
  producer_name: string;
  gmr_fit_score: number;
  status: 'ACTIVE' | 'FROZEN' | 'COMPLETED';
  start_date: string;
  days_live: number;

  // Funnel & Core Metrics
  ngan_views: number;
  cta_clicks: number;
  orders: number;
  confirmed_quantity: number;     // North Star Metric
  moq: number;
  shares: number;

  // Derived Performance Metrics
  demand_velocity: number;        // confirmed_quantity / days_live
  story_to_open_rate: number;     // cta_clicks / ngan_views
  open_to_demand_rate: number;    // confirmed_quantity / ngan_views
  progress_percent: number;       // (confirmed_quantity / moq) * 100

  // Traffic & Content Angles
  top_traffic_sources: { source: string; orders: number; views: number }[];
  content_angles: ContentAngle[];

  // Qualitative & Diagnosis
  diagnosis?: string;
  decision?: ExperimentDecision;
  decision_rationale?: string;

  // M4 Learning Loop
  learning?: {
    what_worked: string[];
    what_did_not: string[];
    customer_signal: string;
    story_signal: string;
    commerce_signal: string;
    producer_signal: string;
    next_action: string;
  };
}

// ==============================================================================
// M4 FULFILLMENT + QR + DELIVERY + CRM BRIDGE TYPES
// ==============================================================================

export type ScanAction =
  | 'SCAN_BATCH'
  | 'RECEIVE_BATCH'
  | 'SCAN_ORDER'
  | 'PACK_ORDER'
  | 'MARK_READY'
  | 'MARK_SHIPPED'
  | 'MARK_DELIVERED';

export interface ScanEvent {
  id: string;
  token: string;
  order_id?: string;
  order_code?: string;
  batch_id?: string;
  batch_code?: string;
  actor_type: 'WAREHOUSE_STAFF' | 'PRODUCER' | 'ADMIN' | 'SYSTEM';
  actor_id: string;
  action: ScanAction;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export type BatchStatus = 'CREATED' | 'DISPATCHED' | 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface FulfillmentBatchItem {
  id: string;
  batch_id: string;
  order_id: string;
  order_code: string;
  quantity: number;
  status: 'PENDING' | 'RECEIVED' | 'PACKED' | 'SHIPPED';
  created_at: string;
}

export interface FulfillmentBatch {
  id: string;
  batch_code: string;             // e.g. "BATCH-003-2026-01"
  ngan_id: string;
  ngan_number: string;
  producer_id: string;
  producer_name: string;
  expected_quantity: number;
  received_quantity: number;
  status: BatchStatus;
  items?: FulfillmentBatchItem[];
  created_at: string;
  received_at?: string;
  notes?: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  order_code: string;
  carrier: string;                // e.g. "MANUAL", "GHN", "VIETTEL_POST", "XE_KHACH"
  tracking_code: string;
  shipping_fee: number;
  status: 'PREPARED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED';
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PointLedgerEntry {
  id: string;
  member_id: string;
  customer_phone: string;
  event_id: string;
  order_id: string;
  order_code: string;
  points: number;
  type: 'EARNED_DELIVERED' | 'REFUNDED_RETURN' | 'ADJUSTED';
  created_at: string;
}

export interface CustomerCrmSummary {
  phone: string;
  name: string;
  points_balance: number;
  order_count: number;
  total_spent: number;
  last_order_code?: string;
  last_order_at?: string;
  last_delivery_at?: string;
  fulfillment_history: {
    order_code: string;
    product_name: string;
    quantity: number;
    status: FulfillmentStatus;
    delivered_at?: string;
  }[];
}

export type CaptureStatus = 'UPLOADED' | 'CAPTURED' | 'EXTRACTED' | 'MATCHED' | 'NEEDS_HUMAN_REVIEW' | 'CONFIRMED';

export interface ExtractedOrderRecord {
  id: string;
  raw_text: string;
  extracted_customer_name?: string;
  extracted_phone?: string;
  extracted_product?: string;
  extracted_quantity?: number;
  extracted_address?: string;
  matched_order_id?: string;
  matched_order_code?: string;
  confidence_score: number;       // 0 - 1.0
  status: 'PENDING_MATCH' | 'MATCHED' | 'NEEDS_HUMAN_REVIEW' | 'CONFIRMED';
}

export interface CaptureJob {
  id: string;
  file_name: string;
  file_type: 'EXCEL' | 'CSV' | 'IMAGE' | 'PDF';
  file_url?: string;
  producer_id: string;
  status: CaptureStatus;
  records: ExtractedOrderRecord[];
  created_at: string;
  updated_at: string;
}

// ==============================================================================
// M4 — EXPERIENCE GOVERNANCE & CONTROL SYSTEM
// ==============================================================================

export type GovernanceGateId =
  | 'BG' // Brand Gate
  | 'TG' // Truth Gate
  | 'SG' // Story Gate
  | 'NG' // Ngăn State Gate
  | 'AG' // Asset Gate
  | 'CG' // Commerce Gate
  | 'UX' // UX Gate
  | 'CT' // Content Linter
  | 'TR'; // Traceability Gate

export type GateEvaluationStatus = 'PASS' | 'FAIL' | 'BLOCKED';

export type TruthStatus =
  | 'VERIFIED'
  | 'PRODUCER_CLAIM'
  | 'EDITORIAL_INTERPRETATION'
  | 'UNKNOWN';

export interface TruthClaimItem {
  claim_id: string;
  claim_text: string;
  truth_status: TruthStatus;
  evidence_id?: string;
  source_id?: string;
  confidence: number; // 0.0 - 1.0
  is_brand_critical?: boolean;
}

export interface GateRuleResult {
  rule_id: string;
  name: string;
  gate_id: GovernanceGateId;
  is_hard_gate: boolean;
  status: 'PASS' | 'FAIL';
  score?: number; // Cho UX Gate
  max_score?: number;
  message: string;
  details?: Record<string, any>;
  evidence_ref?: string;
}

export interface GateSummaryResult {
  gate_id: GovernanceGateId;
  name: string;
  is_hard_gate: boolean;
  status: GateEvaluationStatus;
  passed_rules: number;
  total_rules: number;
  score?: number;
  weight?: number;
  rules: GateRuleResult[];
}

export interface UxGateBreakdown {
  legibility_accessibility: number; // Max 25
  clarity_task_speed: number;       // Max 25
  group_buy_transparency: number;   // Max 25
  product_scannability_trust: number;// Max 25
  total_score: number;              // Target >= 85
  p0_count: number;                 // Must be 0
  p1_count: number;                 // Must be 0
}

export interface ExperienceGovernanceInput {
  target_id: string;
  content_id?: string;
  story_id?: string;
  ngan_id?: string;
  product_id?: string;
  producer_id?: string;
  source_id?: string;
  evidence_ids?: string[];
  
  // Data payload to govern
  brand_context?: {
    brand_name: string;
    brand_idea: string;
    raw_copy: string;
    cta_text: string;
    logo_asset_id?: string;
  };
  claims?: TruthClaimItem[];
  story_object?: {
    producer: string;
    place: string;
    product: string;
    core_story: string;
    evidence: string[];
    gmr_fit: number;
    unknowns: string[];
    visual_direction: string;
    demand_state: string;
    narrative_steps?: string[]; // FACT → DETAIL → HUMAN → PLACE → CRAFT → MEANING → PRODUCT → OPEN NGĂN
  };
  ngan_state_context?: {
    current_state: NganStatus;
    cta_rendered: string;
    shows_current_quantity: boolean;
    shows_moq: boolean;
    shows_remaining: boolean;
    shows_what_happens_next: boolean;
    shows_fulfillment_status?: boolean;
  };
  asset_context?: {
    assets: {
      asset_id: string;
      url: string;
      asset_type: AssetType; // DOCUMENTARY | SOURCE | EDITORIAL | AI_GENERATED
      source: string;
      license: string;
      credit: string;
      is_verified?: boolean; // Required for DOCUMENTARY
      provenance_valid: boolean;
      role_in_story?: 'evidence' | 'context' | 'editorial' | 'concept_mood';
    }[];
  };
  commerce_context?: {
    producer_retail_truth: {
      suggested_retail_price: number;
      producer_confirmed_capacity?: number;
      producer_source_confirmed: boolean;
      source_ref?: string;
    };
    gmr_commerce_rules: {
      batch_moq: number; // GMR Demand / Commerce Rule
      gmr_selling_price: number; // Calibrated unit price for group-buy
      producer_discount_pct?: number;
      customer_benefit_note?: string;
      payment_terms_clarified: boolean;
    };
  };

  ux_context?: {
    body_font_size_px: number;
    touch_target_size_px: number;
    contrast_ratio: number;
    time_to_cta_seconds: number;
    comprehension_seconds: number;
    p0_issues: string[];
    p1_issues: string[];
  };
  content_text?: string;
}

export interface GovernanceScorecard {
  id: string;
  evaluated_at: string;
  target_id: string;
  overall_status: 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
  gates: Record<GovernanceGateId, GateSummaryResult>;
  ux_breakdown: UxGateBreakdown;
  traceability_chain: {
    content_id?: string;
    story_id?: string;
    ngan_id?: string;
    product_id?: string;
    producer_id?: string;
    source_id?: string;
    evidence_ids: string[];
    is_fully_traceable: boolean;
  };
  regressions_checked: number;
  regressions_passed: number;
}

export interface FailureRecord {
  failure_id: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  detected_at: string;
  module: GmrModule | 'GOVERNANCE';
  gate_id: GovernanceGateId;
  symptom: string;
  root_cause: string;
  rule_created: string; // e.g. "REG-BRAND-002"
  fix_commit?: string;
  regression_test: string;
  status: 'OPEN' | 'RESOLVED' | 'VERIFIED';
}

export interface RegressionRule {
  rule_id: string;
  gate_id: GovernanceGateId;
  failure_id: string;
  title: string;
  description: string;
  forbidden_pattern?: string | RegExp;
  required_condition: string;
  last_verified_at: string;
  pass_count: number;
}

// ==============================================================================
// PRODUCER GROWTH SKILL v0.1 — CORE TYPED SCHEMAS
// Strict Hierarchy & Isolation: Intelligence / Diagnosis / Hypothesis / Opportunity / Intervention / Learning
// ==============================================================================

export type SourceSurfaceCategory =
  | 'IDENTITY'
  | 'PRODUCT'
  | 'ORIGIN'
  | 'PROCESS'
  | 'PEOPLE'
  | 'CERTIFICATION'
  | 'EXPORT'
  | 'MARKET'
  | 'PARTNER_B2B'
  | 'STORY'
  | 'COMMERCIAL'
  | 'SOCIAL'
  | 'MEDIA';

export type CoverageStatus = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';

export interface SourceScanResult {
  source_id: string;
  requested_url: string;
  discovered_urls: string[];
  accessible_urls: string[];
  inaccessible_urls: string[];
  not_found_urls: string[];
  sitemap_count: number;
  page_count: number;
  source_groups: Record<SourceSurfaceCategory, string[]>;
  coverage_status: CoverageStatus;
  scan_completeness: {
    score: number; // 0 - 100
    details: string;
  };
  missing_surfaces: SourceSurfaceCategory[];
}

export type EvidenceMinerTruthStatus =
  | 'VERIFIED'
  | 'PRODUCER_CLAIM'
  | 'EDITORIAL_INTERPRETATION'
  | 'UNKNOWN'
  | 'MISSING_EVIDENCE';

export interface MinedEvidenceItem {
  id: string;
  claim: string;
  source_id: string;
  source_url: string;
  source_type: 'OFFICIAL_WEBSITE' | 'SOCIAL' | 'GOVERNMENT_REGISTRY' | 'THIRD_PARTY_AUDIT';
  truth_status: EvidenceMinerTruthStatus;
  evidence_type: string;
  confidence: number; // 0.0 - 1.0
  notes?: string;
}

export interface ProducerIntelligenceData {
  producer_id: string;
  source_id: string;
  identity: {
    name: string;
    location: string;
    established?: number | string;
    role?: string;
    tax_id?: string;
    legal_name?: string;
  };
  product: {
    products: string[];
    categories: string[];
    price_points: { product: string; price?: number; unit?: string }[];
  };
  place: {
    geography: string;
    local_context: string;
    seasonality?: string;
  };
  people: {
    founders: string[];
    makers: string[];
    farmers: string[];
  };
  craft: {
    process: string;
    distinctive_practice: string;
  };
  proof: {
    certifications: string[];
    traceability?: string;
    export: string[];
    third_party_proof?: string;
  };
  market: {
    current_channels: string[];
    target_market?: string;
    b2b: string[];
    b2c: string[];
  };
  brand_story: {
    positioning: string;
    narrative: string;
    differentiation: string;
  };
  commercial: {
    observed_price_range?: string;
    availability?: string;
    capacity?: string;
    logistics?: string;
  };
  unknowns: string[];
}

export type EpistemicClassification = 'FACT' | 'INTERPRETATION' | 'HYPOTHESIS' | 'UNKNOWN';

export type GrowthDimensionKey =
  | 'PRODUCT'
  | 'BRAND'
  | 'STORY'
  | 'PROOF'
  | 'CONTENT'
  | 'CHANNEL'
  | 'DEMAND'
  | 'COMMERCE';

export interface GrowthDimensionEvaluation {
  current_state: string;
  evidence: string[];
  gap: string;
  interpretation: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  unknowns: string[];
}

export interface ValueTrustPriceAnalysis {
  price: {
    observed_price_points: { product: string; price?: number; unit?: string }[];
    perceived_value: string;
    friction: string;
  };
  emotional_value: {
    strength: 'LOW' | 'MEDIUM' | 'HIGH';
    evidence: string[];
  };
  trust: {
    strength: 'LOW' | 'MEDIUM' | 'HIGH';
    evidence: string[];
    gaps: string[];
  };
  overall_interpretation: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PrimaryGrowthHypothesis {
  statement: string;
  classification: 'HYPOTHESIS';
  based_on: {
    facts: string[];
    interpretations: string[];
  };
  evidence: string[];
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  unknowns: string[];
  validation_needed: string;
}

export interface GrowthOpportunity {
  opportunity_id: string;
  statement: string;
  based_on: string;
  expected_value: 'LOW' | 'MEDIUM' | 'HIGH';
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence: string[];
  score?: number;
}

export interface GrowthInterventionPlan {
  id: string;
  opportunity_id: string;
  problem: string;
  hypothesis: string;
  intervention: string;
  assets: string[];
  channels: string[];
  cta: string;
  demand_mechanism: string;
  kpi: string;
  duration: string;
}

export interface ContentRequestSpec {
  request_id: string;
  story_id?: string;
  producer_id: string;
  objective: string;
  growth_problem: string;
  target_behavior: string;
  key_evidence: string[];
  required_assets: string[];
  channel: string;
  cta: string;
  created_at: string;
}

export interface MarketLearningRecord {
  id: string;
  intervention_id: string;
  observed: {
    attention?: string;
    trust?: string;
    intent?: string;
    demand?: string;
    conversion?: string;
    fulfillment?: string;
    repeat?: string;
  };
  outcome: string;
  hypothesis_status: 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'REJECTED' | 'INCONCLUSIVE';
  learning: string;
  next_action: string;
  created_at: string;
}

export interface GrowthSnapshot {
  what_we_see: string;
  why: string;
  primary_hypothesis: string;
  customer_outcome: string;
  producer_outcome: string;
  next_test: string;
}

export interface EpistemicStatement {
  statement: string;
  classification: EpistemicClassification;
  evidence_ids?: string[];
  source_urls?: string[];
  gap?: string;
  notes?: string;
}

export interface CustomerOutcomeProposition {
  why_this: EpistemicStatement;
  why_now: EpistemicStatement;
  why_trust: EpistemicStatement;
  what_you_get: EpistemicStatement;
  preorder_proposition: {
    reason_to_care: EpistemicStatement;
    reason_to_trust: EpistemicStatement;
    reason_to_act_now: EpistemicStatement;
    gap?: string;
  };
  demand_mechanism: EpistemicStatement;
  cta: string;
  traceability: {
    customer_proposition: string;
    growth_hypothesis: string;
    interpretations: string[];
    facts: string[];
    evidence_ids: string[];
    source_urls: string[];
  };
}

export interface ValueExchangeItem {
  item: string;
  classification: EpistemicClassification;
  evidence_ids?: string[];
  notes?: string;
}

export interface ProducerOutcomePartnershipCase {
  producer_problem: EpistemicStatement;
  gmr_value_creation: {
    demand_creation: EpistemicStatement;
    story_packaging: EpistemicStatement;
    trust_packaging: EpistemicStatement;
    market_testing: EpistemicStatement;
    market_learning: EpistemicStatement;
  };
  value_exchange: {
    producer_provides: ValueExchangeItem[];
    gmr_provides: ValueExchangeItem[];
  };
  producer_ask: {
    batch_information: string;
    availability: string;
    price: string;
    capacity: string;
    evidence: string;
    assets: string;
    fulfillment_commitment: string;
    gap?: string;
  };
  success_kpi: EpistemicStatement;
  partnership_hypothesis: {
    statement: string;
    classification: 'HYPOTHESIS';
    value: string;
    intervention: string;
    evidence: string[];
    validation_kpi: string;
  };
  traceability: {
    partnership_case: string;
    growth_hypothesis: string;
    growth_diagnosis_keys: GrowthDimensionKey[];
    evidence_ids: string[];
    source_urls: string[];
  };
}

export interface GrowthDecisionLayer {
  snapshot: GrowthSnapshot;
  customer_outcome: CustomerOutcomeProposition;
  producer_outcome: ProducerOutcomePartnershipCase;
}

export interface ProducerGrowthRunOutput {
  run_id: string;
  producer_id: string;
  source_id: string;
  timestamp: string;
  can_diagnose: boolean;
  rejection_reason?: string;
  source_coverage: SourceScanResult;
  evidence_map: MinedEvidenceItem[];
  producer_intelligence?: ProducerIntelligenceData;
  growth_diagnosis?: Record<GrowthDimensionKey, GrowthDimensionEvaluation>;
  value_trust_price?: ValueTrustPriceAnalysis;
  primary_growth_hypothesis?: PrimaryGrowthHypothesis;
  opportunities?: GrowthOpportunity[];
  priority_opportunity?: GrowthOpportunity;
  intervention?: GrowthInterventionPlan;
  content_request?: ContentRequestSpec;
  market_learning_plan?: MarketLearningRecord;
  decision_layer?: GrowthDecisionLayer;
  unknowns: string[];
  next_action: string;
}

export interface SkillIsolationRequest {
  skill_name: string;
  action: string;
  target_layer: 'BRAND_TRUTH' | 'EVIDENCE' | 'PRODUCER_CLAIM' | 'STORY_TRUTH' | 'COMMERCE_RULE' | 'NGAN_STATE' | 'CONTENT_OUTPUT';
  attempted_mutation?: string;
}

export type UatDecision = 'CORRECT' | 'REVIEW' | 'INCORRECT';

export interface UatFeedbackRecord {
  feedback_id: string;
  producer_id: string;
  object_type:
    | 'EVIDENCE'
    | 'DIAGNOSIS'
    | 'HYPOTHESIS'
    | 'OPPORTUNITY'
    | 'INTERVENTION'
    | 'CONTENT_REQUEST'
    | 'CUSTOMER_OUTCOME'
    | 'PRODUCER_OUTCOME'
    | 'GROWTH_SNAPSHOT';
  object_id: string;
  decision: UatDecision;
  note?: string;
  created_at: string;
}

export type MarketValidationDecision =
  | 'CLEAR'
  | 'UNCLEAR'
  | 'NOT_CONVINCING'
  | 'WRONG'
  | 'MISSING_EVIDENCE';

export interface MarketValidationFeedbackRecord {
  id: string;
  producer_id: string;
  target_pillar: 'CUSTOMER_OUTCOME' | 'PRODUCER_OUTCOME' | 'GROWTH_SNAPSHOT';
  object_id: string;
  decision: MarketValidationDecision;
  comment?: string;
  reviewer: string;
  created_at: string;
}

export interface InternalMarketLearningRecord {
  id: string;
  producer_id: string;
  source: 'INTERNAL_TEST';
  target_pillar: 'CUSTOMER_OUTCOME' | 'PRODUCER_OUTCOME' | 'GROWTH_SNAPSHOT';
  observation: string;
  interpretation: string;
  hypothesis: string;
  next_test: string;
  created_at: string;
}




