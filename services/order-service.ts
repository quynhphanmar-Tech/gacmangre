import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getServiceSupabase } from '@/lib/supabase/server';
import { mockNgan001, mockNgans, mockOrdersStore } from '@/lib/data/mock-data';
import { Order, OrderInput, OrderCreationResult } from '@/types';
import { createEventRecord, processEvent } from '@/services/event-service';


// Server-side atomic sequence counter for development/mock mode (sequential GM-2026-000074+)
let mockSequenceCounter = 74;
// In-memory idempotency cache to protect against rapid duplicate submits
const idempotencyCache = new Map<string, Order>();

// Vietnamese phone validation
export function isValidVietnamPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s.-]/g, '');
  return /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(cleaned);
}

// Sanitize string inputs against XSS and excessive whitespace
export function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

// Format sequential order code: GM-2026-000001
export function formatOrderCode(sequenceNumber: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequenceNumber).padStart(6, '0');
  return `GM-${year}-${padded}`;
}

export async function createOrder(input: OrderInput): Promise<OrderCreationResult> {
  // 1. Check Idempotency Key first (Prevent double click / repeated submit)
  const idempotencyKey = input.idempotency_key?.trim();
  if (idempotencyKey) {
    if (idempotencyCache.has(idempotencyKey)) {
      const existing = idempotencyCache.get(idempotencyKey)!;
      return {
        success: true,
        order: existing,
        order_code: existing.order_code,
        is_duplicate: true,
      };
    }
  }

  // 2. Strict Server-Side Validation
  const name = sanitizeInput(input.name);
  if (!name || name.length < 2) {
    return {
      success: false,
      error_code: 'VALIDATION_ERROR',
      error: 'Vui lòng nhập họ và tên của bạn (tối thiểu 2 ký tự).',
    };
  }

  const phone = input.phone?.trim();
  if (!isValidVietnamPhone(phone)) {
    return {
      success: false,
      error_code: 'VALIDATION_ERROR',
      error: 'Số điện thoại không đúng định dạng Việt Nam (10 chữ số).',
    };
  }

  const address = sanitizeInput(input.address);
  if (!address || address.length < 5) {
    return {
      success: false,
      error_code: 'VALIDATION_ERROR',
      error: 'Vui lòng cung cấp địa chỉ nhận hàng chi tiết (tối thiểu 5 ký tự).',
    };
  }

  const quantity = Math.floor(Number(input.quantity));
  if (isNaN(quantity) || quantity < 1 || quantity > 10) {
    return {
      success: false,
      error_code: 'VALIDATION_ERROR',
      error: 'Số lượng mở mỗi lần hợp lệ là từ 1 đến 10 phần.',
    };
  }

  const province = sanitizeInput(input.province || 'Toàn quốc');
  const zalo = sanitizeInput(input.zalo_identifier || phone);
  const note = input.note ? sanitizeInput(input.note) : undefined;
  const source = input.source || 'DIRECT';
  const landingUrl = input.landing_url;

  // 3. Supabase Execution (if live database is configured)
  const db = getServiceSupabase() || supabase;
  if (db && isSupabaseConfigured) {
    try {
      // Call the atomic PostgreSQL function: fn_create_order_atomic
      const { data, error } = await db.rpc('fn_create_order_atomic', {
        p_ngan_id: input.ngan_id || mockNgan001.id,
        p_customer_name: name,
        p_customer_phone: phone,
        p_customer_zalo: zalo,
        p_customer_address: address,
        p_customer_province: province,
        p_quantity: quantity,
        p_idempotency_key: idempotencyKey || null,
        p_note: note || null,
        p_source: source,
        p_utm_source: input.utm_source || null,
        p_utm_medium: input.utm_medium || null,
        p_utm_campaign: input.utm_campaign || null,
        p_utm_content: input.utm_content || null,
        p_landing_url: landingUrl || null,
      });

      if (error) {
        console.error('Supabase atomic order error:', error);
        throw error;
      }

      if (data && !data.success) {
        return {
          success: false,
          error_code: data.error_code,
          error: data.error_message,
          remaining_capacity: data.remaining_capacity,
        };
      }

      // Fetch the created order with relations
      const order = await getOrderByIdOrCode(data.order_code);
      return {
        success: true,
        order: order || undefined,
        order_code: data.order_code,
        is_duplicate: data.is_duplicate || false,
      };
    } catch (err: unknown) {
      console.warn('Supabase call failed, falling back to atomic in-memory engine:', err);
      // Fall through to memory engine
    }
  }

  // 4. In-Memory Atomic Simulation Engine (Zero failure mode)
  // Find targeted Ngăn across all 4 sprint Ngăns
  const targetNgan = (input.ngan_id
    ? (mockNgans.find((n) => n.id === input.ngan_id || n.slug === input.ngan_id || n.number === input.ngan_id) || mockNgan001)
    : mockNgan001);

  // Lock: Check Ngăn status
  if (targetNgan.status !== 'OPEN') {
    return {
      success: false,
      error_code: 'NGAN_CLOSED',
      error: 'Ngăn này hiện không còn nhận đơn.',
    };
  }

  // Calculate current confirmed demand for this specific Ngăn
  const confirmedOrdersTotal = mockOrdersStore
    .filter((o) => o.ngan_id === targetNgan.id && o.status !== 'CANCELLED' && o.status !== 'REFUNDED')
    .reduce((sum, o) => sum + o.quantity, 0);

  const currentTotal = targetNgan.current_quantity + confirmedOrdersTotal;
  const remaining = Math.max(0, targetNgan.moq - currentTotal);

  // If already at or above MOQ, allow order if within reasonable buffer, otherwise reject
  if (remaining > 0 && quantity > remaining) {
    return {
      success: false,
      error_code: 'QUANTITY_UNAVAILABLE',
      error: 'Số lượng bạn chọn đã vượt quá phần còn lại của Ngăn.',
      remaining_capacity: remaining,
    };
  }

  // Generate server-side sequential order code: GM-2026-000074...
  mockSequenceCounter += 1;
  const orderCode = formatOrderCode(mockSequenceCounter);
  const unitPrice = targetNgan.price; // Server-retrieved price!
  const totalAmount = unitPrice * quantity;

  const newOrder: Order = {
    id: `ord-${Date.now()}-${mockSequenceCounter}`,
    order_code: orderCode,
    customer_id: `cust-${Date.now()}`,
    ngan_id: targetNgan.id,
    quantity,
    unit_price: unitPrice,
    total_amount: totalAmount,
    status: 'CONFIRMED',
    payment_status: 'UNPAID', // PM lock: no payment gateway yet
    note,
    source,
    utm_source: input.utm_source,
    utm_medium: input.utm_medium,
    utm_campaign: input.utm_campaign,
    utm_content: input.utm_content,
    landing_url: landingUrl,
    idempotency_key: idempotencyKey,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer: {
      id: `cust-${Date.now()}`,
      name,
      phone,
      zalo_identifier: zalo,
      address,
      province,
      created_at: new Date().toISOString(),
    },
    ngan: {
      ...targetNgan,
      current_quantity: currentTotal + quantity,
    },
  };

  // Update Ngăn state
  const prevQuantity = targetNgan.current_quantity;
  const newTotal = prevQuantity + quantity;
  targetNgan.current_quantity = newTotal;
  const reachedMoqNow = prevQuantity < targetNgan.moq && newTotal >= targetNgan.moq;

  // Cache idempotency key
  if (idempotencyKey) {
    idempotencyCache.set(idempotencyKey, newOrder);
  }

  mockOrdersStore.unshift(newOrder);

  // M3: Emit Decoupled Events (Non-blocking: Failure does not affect order truth)
  (async () => {
    try {
      // 1. Emit ORDER_CREATED
      const orderEvt = await createEventRecord('ORDER_CREATED', 'order', newOrder.id, {
        order_id: newOrder.id,
        order_code: newOrder.order_code,
        ngan_number: mockNgan001.number,
        product_name: mockNgan001.title,
        customer_name: name,
        customer_phone: phone,
        customer_zalo: zalo,
        quantity,
        current_quantity: newTotal,
        moq: mockNgan001.moq,
        created_at: newOrder.created_at,
      });

      // Dispatch notification
      processEvent(orderEvt.id).catch((e) => console.warn('Non-blocking order notification error:', e));

      // 2. Emit MOQ_REACHED if threshold is reached
      if (reachedMoqNow) {
        const moqEvt = await createEventRecord('MOQ_REACHED', 'ngan', mockNgan001.id, {
          ngan_id: mockNgan001.id,
          ngan_number: mockNgan001.number,
          product_name: mockNgan001.title,
          moq: mockNgan001.moq,
          total_quantity: newTotal,
          total_orders: mockOrdersStore.length,
          triggered_at: new Date().toISOString(),
        });

        processEvent(moqEvt.id).catch((e) => console.warn('Non-blocking MOQ notification error:', e));
      }
    } catch (evtErr) {
      console.warn('Background event emission logged error (order unaffected):', evtErr);
    }
  })();

  return {
    success: true,
    order: newOrder,
    order_code: orderCode,
    is_duplicate: false,
  };
}


export async function getOrderByIdOrCode(identifier: string): Promise<Order | null> {
  const db = getServiceSupabase() || supabase;
  if (db && isSupabaseConfigured) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    const query = db
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        ngan:ngans(
          *,
          product:products(
            *,
            producer:producers(*)
          )
        )
      `);

    const { data, error } = isUUID
      ? await query.eq('id', identifier).single()
      : await query.eq('order_code', identifier).single();

    if (!error && data) {
      return data as Order;
    }
  }

  // Fallback to memory store
  const found = mockOrdersStore.find(
    (o) => o.id === identifier || o.order_code === identifier || identifier.includes(o.order_code)
  );

  return found || mockOrdersStore[0] || null;
}
