import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getServiceSupabase } from '@/lib/supabase/server';
import { EventItem, EventStatus } from '@/types';
import {
  NotificationService,
  OrderNotificationPayload,
  MoqReachedNotificationPayload,
} from './notification-service';
import { mockProducer, mockNgan001 } from '@/lib/data/mock-data';

// In-Memory fallback events store for local test / zero-dependency development
export const mockEventsStore: EventItem[] = [
  {
    id: 'evt-001',
    correlation_id: 'corr_ord_gm2026000073_init',
    event_type: 'ORDER_CREATED',
    entity_type: 'order',
    entity_id: 'e5555555-5555-5555-5555-555555555551',
    payload: {
      order_id: 'e5555555-5555-5555-5555-555555555551',
      order_code: 'GM-2026-000073',
      ngan_number: '#001',
      product_name: 'Mật ong bạc hà hoa dại Hà Giang',
      customer_name: 'Nguyễn Thuỳ Chi',
      customer_phone: '0988112233',
      customer_zalo: '0988112233',
      quantity: 2,
      current_quantity: 74,
      moq: 100,
    },
    status: 'PROCESSED',
    retry_count: 0,
    created_at: '2026-10-05T09:30:00Z',
    processed_at: '2026-10-05T09:30:05Z',
  },
];

export async function createEventRecord(
  eventType: EventItem['event_type'],
  entityType: EventItem['entity_type'],
  entityId: string,
  payload: Record<string, unknown>,
  options?: {
    correlation_id?: string;
    actor_id?: string;
    actor_role?: EventItem['actor_role'];
  }
): Promise<EventItem> {
  const correlationId =
    options?.correlation_id ||
    (typeof payload.correlation_id === 'string' ? payload.correlation_id : undefined) ||
    `corr_${entityType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newEvent: EventItem = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    correlation_id: correlationId,
    event_type: eventType,
    entity_type: entityType,
    entity_id: entityId,
    actor_id: options?.actor_id || 'system',
    actor_role: options?.actor_role || 'SYSTEM',
    payload: {
      ...payload,
      correlation_id: correlationId,
    },
    status: 'PENDING',
    retry_count: 0,
    created_at: new Date().toISOString(),
  };

  const db = getServiceSupabase() || supabase;
  if (db && isSupabaseConfigured) {
    try {
      const { data, error } = await db
        .from('events')
        .insert({
          event_type: eventType,
          entity_type: entityType,
          entity_id: entityId,
          payload,
          status: 'PENDING',
          retry_count: 0,
        })
        .select()
        .single();

      if (!error && data) {
        return data as EventItem;
      }
    } catch (err) {
      console.warn('Could not insert event into Supabase, storing in memory:', err);
    }
  }

  mockEventsStore.unshift(newEvent);
  return newEvent;
}

// Process an event (Dispatches notification without blocking core transaction)
export async function processEvent(eventId: string): Promise<{ success: boolean; event?: EventItem; error?: string }> {
  // 1. Find the event
  let event: EventItem | undefined = mockEventsStore.find((e) => e.id === eventId);

  const db = getServiceSupabase() || supabase;
  if (db && isSupabaseConfigured) {
    const { data } = await db.from('events').select('*').eq('id', eventId).single();
    if (data) event = data as EventItem;
  }

  if (!event) {
    return { success: false, error: 'Sự kiện không tồn tại.' };
  }

  // Idempotency: If already PROCESSED, return success without re-sending
  if (event.status === 'PROCESSED') {
    return { success: true, event };
  }

  event.status = 'PROCESSING';

  try {
    if (event.event_type === 'ORDER_CREATED') {
      const p = event.payload as unknown as OrderNotificationPayload;
      const result = await NotificationService.sendOrderCreatedNotification(p);

      if (!result.success) {
        throw new Error(result.error || 'Failed to dispatch customer notification');
      }
    } else if (event.event_type === 'MOQ_REACHED') {
      const p = event.payload as unknown as MoqReachedNotificationPayload;

      // Notify customer
      await NotificationService.sendMoqReachedCustomer(p, {
        name: 'Quý khách',
        phone: 'Khách hàng tham gia',
      });

      // Notify producer (Anh Giàng A Páo)
      const prodResult = await NotificationService.sendProducerMoqNotification({
        ...p,
        producer_id: mockProducer.id,
        producer_name: mockProducer.name,
        producer_phone: mockProducer.phone,
        producer_zalo: mockProducer.zalo,
      });

      if (!prodResult.success) {
        throw new Error(prodResult.error || 'Failed to notify producer');
      }
    }

    event.status = 'PROCESSED';
    event.processed_at = new Date().toISOString();
    event.updated_at = new Date().toISOString();
    event.last_error = undefined;
  } catch (err: unknown) {
    event.status = 'FAILED';
    event.retry_count += 1;
    event.last_error = err instanceof Error ? err.message : 'Unknown notification error';
    event.updated_at = new Date().toISOString();
  }

  // Update in Supabase if live
  if (db && isSupabaseConfigured) {
    await db
      .from('events')
      .update({
        status: event.status,
        retry_count: event.retry_count,
        last_error: event.last_error,
        processed_at: event.processed_at,
        updated_at: event.updated_at,
      })
      .eq('id', event.id);
  }

  return { success: event.status === 'PROCESSED', event };
}

export async function getAllEvents(): Promise<EventItem[]> {
  const db = getServiceSupabase() || supabase;
  if (db && isSupabaseConfigured) {
    const { data } = await db.from('events').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) return data as EventItem[];
  }
  return mockEventsStore;
}
