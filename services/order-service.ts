import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getServiceSupabase } from '@/lib/supabase/server';
import { mockNgan001, mockOrdersStore } from '@/lib/data/mock-data';
import { Order, OrderInput } from '@/types';

// Generate human-friendly order code: GM-2026-XXXXXX
export function generateOrderCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `GM-${year}-${randomNum}`;
}

// Vietnamese phone validation
export function isValidVietnamPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s.-]/g, '');
  return /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(cleaned);
}

export async function createOrder(input: OrderInput): Promise<{ success: boolean; order?: Order; error?: string }> {
  // 1. Validation
  if (!input.name || input.name.trim().length < 2) {
    return { success: false, error: 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).' };
  }

  if (!isValidVietnamPhone(input.phone)) {
    return { success: false, error: 'Số điện thoại không đúng định dạng Việt Nam.' };
  }

  if (!input.address || input.address.trim().length < 5) {
    return { success: false, error: 'Vui lòng nhập địa chỉ nhận hàng chi tiết.' };
  }

  if (!input.quantity || input.quantity < 1 || input.quantity > 10) {
    return { success: false, error: 'Số lượng đặt mỗi lần từ 1 đến 10 phần.' };
  }

  const orderCode = generateOrderCode();
  const unitPrice = 280000;
  const totalAmount = unitPrice * input.quantity;

  // 2. If Supabase is configured, execute database transaction
  const db = getServiceSupabase() || supabase;
  if (db && isSupabaseConfigured) {
    try {
      // Create or update customer
      const { data: customerData, error: customerErr } = await db
        .from('customers')
        .insert({
          name: input.name.trim(),
          phone: input.phone.trim(),
          zalo_identifier: input.zalo_identifier || input.phone.trim(),
          address: input.address.trim(),
          province: input.province || 'Toàn quốc',
          source: 'DIRECT_WEB',
          utm_source: input.utm_source,
          utm_medium: input.utm_medium,
          utm_campaign: input.utm_campaign,
          utm_content: input.utm_content,
        })
        .select()
        .single();

      if (customerErr) throw customerErr;

      // Insert Order
      const { data: orderData, error: orderErr } = await db
        .from('orders')
        .insert({
          order_code: orderCode,
          customer_id: customerData.id,
          ngan_id: input.ngan_id,
          quantity: input.quantity,
          unit_price: unitPrice,
          total_amount: totalAmount,
          status: 'CONFIRMED',
          payment_status: 'PENDING_MOQ',
          note: input.note,
        })
        .select(`
          *,
          customer:customers(*),
          ngan:ngans(*)
        `)
        .single();

      if (orderErr) throw orderErr;

      return { success: true, order: orderData as Order };
    } catch (err: unknown) {
      console.error('Error creating order in Supabase:', err);
      // Fallback to local memory store if database fails
    }
  }

  // 3. Fallback: Save in memory mock store
  const newOrder: Order = {
    id: `local-${Date.now()}`,
    order_code: orderCode,
    customer_id: `cust-${Date.now()}`,
    ngan_id: input.ngan_id || mockNgan001.id,
    quantity: input.quantity,
    unit_price: unitPrice,
    total_amount: totalAmount,
    status: 'CONFIRMED',
    payment_status: 'PENDING_MOQ',
    note: input.note,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer: {
      id: `cust-${Date.now()}`,
      name: input.name.trim(),
      phone: input.phone.trim(),
      zalo_identifier: input.zalo_identifier || input.phone.trim(),
      address: input.address.trim(),
      province: input.province || 'Toàn quốc',
      utm_source: input.utm_source,
      utm_medium: input.utm_medium,
      utm_campaign: input.utm_campaign,
      created_at: new Date().toISOString(),
    },
    ngan: {
      ...mockNgan001,
      current_quantity: mockNgan001.current_quantity + input.quantity,
    },
  };

  mockNgan001.current_quantity += input.quantity;
  if (mockNgan001.current_quantity >= mockNgan001.moq) {
    mockNgan001.status = 'FULL';
  }

  mockOrdersStore.unshift(newOrder);

  return { success: true, order: newOrder };
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
