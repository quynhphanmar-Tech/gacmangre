import { PointLedgerEntry, CustomerCrmSummary, FulfillmentStatus } from '@/types';
import { mockOrdersStore } from '@/lib/data/mock-data';

// In-Memory store for Member Point Ledger (Audit trail)
export const pointLedgerStore: PointLedgerEntry[] = [];

// Set of processed event IDs to guarantee idempotency (No double points on retry)
const processedEventIds = new Set<string>();

export class PointService {
  /**
   * Awards member points upon successful ORDER_DELIVERED.
   * Point rule: 10 points per quantity unit delivered.
   * Strictly idempotent: Cannot award points twice for the same event/order.
   */
  static awardPointsForDelivery(
    eventId: string,
    orderId: string,
    orderCode: string,
    customerPhone: string,
    quantity: number
  ): { success: boolean; pointsAwarded: number; entry?: PointLedgerEntry; isDuplicate?: boolean } {
    if (processedEventIds.has(eventId)) {
      const existing = pointLedgerStore.find((e) => e.event_id === eventId);
      return { success: true, pointsAwarded: 0, entry: existing, isDuplicate: true };
    }

    const points = quantity * 10;
    const entry: PointLedgerEntry = {
      id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      member_id: `mem-${customerPhone}`,
      customer_phone: customerPhone,
      event_id: eventId,
      order_id: orderId,
      order_code: orderCode,
      points,
      type: 'EARNED_DELIVERED',
      created_at: new Date().toISOString(),
    };

    pointLedgerStore.unshift(entry);
    processedEventIds.add(eventId);

    return { success: true, pointsAwarded: points, entry, isDuplicate: false };
  }

  /**
   * Gets total point balance for a customer.
   */
  static getCustomerBalance(customerPhone: string): number {
    return pointLedgerStore
      .filter((e) => e.customer_phone === customerPhone)
      .reduce((total, e) => total + e.points, 0);
  }
}

export class MemberCrmBridge {
  /**
   * Aggregates customer summary across Orders and Fulfillment without owning customer entity.
   */
  static getCustomerSummary(phone: string): CustomerCrmSummary | null {
    const orders = mockOrdersStore.filter((o) => o.customer?.phone === phone);
    if (orders.length === 0) return null;

    const firstOrder = orders[0];
    const pointsBalance = PointService.getCustomerBalance(phone);
    const totalSpent = orders.reduce((sum, o) => sum + o.total_amount, 0);

    const history = orders.map((o) => ({
      order_code: o.order_code,
      product_name: o.ngan?.title || 'Sản vật GMR',
      quantity: o.quantity,
      status: (o.status === 'DELIVERED' ? 'DELIVERED' : 'PACKED') as FulfillmentStatus,
      delivered_at: o.status === 'DELIVERED' ? o.updated_at : undefined,
    }));

    return {
      phone,
      name: firstOrder.customer?.name || 'Khách hàng',
      points_balance: pointsBalance,
      order_count: orders.length,
      total_spent: totalSpent,
      last_order_code: firstOrder.order_code,
      last_order_at: firstOrder.created_at,
      last_delivery_at: orders.find((o) => o.status === 'DELIVERED')?.updated_at,
      fulfillment_history: history,
    };
  }
}
