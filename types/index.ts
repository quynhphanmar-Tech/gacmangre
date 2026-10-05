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
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
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
  event_type: 'ORDER_CREATED' | 'MOQ_REACHED' | 'PRODUCER_CONFIRMED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED';
  entity_type: 'order' | 'ngan' | 'producer';
  entity_id: string;
  payload: Record<string, unknown>;
  status: EventStatus;
  retry_count: number;
  last_error?: string;
  created_at: string;
  processed_at?: string;
  updated_at?: string;
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

