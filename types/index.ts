// ==============================================================================
// GẠC MĂNG RÊ — Core TypeScript Type Definitions
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
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  producer_id: string;
  name: string;
  slug: string;
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
  payment_status: string;
  note?: string;
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

export interface EventItem {
  id: string;
  event_type: 'ORDER_CREATED' | 'MOQ_REACHED' | 'PRODUCER_CONFIRMED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED';
  entity_type: 'order' | 'ngan' | 'producer';
  entity_id: string;
  payload: Record<string, unknown>;
  created_at: string;
  processed_at?: string;
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
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}
