import { Fulfillment, FulfillmentStatus } from '@/types';
import { mockOrdersStore } from '@/lib/data/mock-data';
import { isValidTransition } from './state-machine';
import { defaultDeliveryAdapter } from './delivery-service';
import { PointService } from './points-service';
import { createEventRecord, processEvent } from './event-service';

// In-Memory store for individual order fulfillments
export const fulfillmentsStore: Map<string, Fulfillment> = new Map();

export class FulfillmentService {
  /**
   * Gets or initializes a fulfillment record for an order.
   */
  static getFulfillment(orderId: string): Fulfillment {
    if (fulfillmentsStore.has(orderId)) {
      return fulfillmentsStore.get(orderId)!;
    }

    const order = mockOrdersStore.find((o) => o.id === orderId || o.order_code === orderId);
    const initialStatus: FulfillmentStatus = order?.status === 'DELIVERED'
      ? 'DELIVERED'
      : order?.status === 'SHIPPED'
      ? 'SHIPPED'
      : 'RECEIVED';

    const newFulfillment: Fulfillment = {
      id: `ful-${orderId}`,
      order_id: order?.id || orderId,
      status: initialStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    fulfillmentsStore.set(orderId, newFulfillment);
    return newFulfillment;
  }

  /**
   * Validates and transitions an order's fulfillment state.
   * Enforces State Machine rules (No jumping states; idempotent if same state).
   */
  static async transitionStatus(
    orderId: string,
    targetStatus: FulfillmentStatus,
    metadata?: {
      carrier?: string;
      tracking_code?: string;
      shipping_fee?: number;
      actor_id?: string;
    }
  ): Promise<{
    success: boolean;
    fulfillment?: Fulfillment;
    shipment?: unknown;
    points_awarded?: number;
    error?: string;
  }> {
    const order = mockOrdersStore.find((o) => o.id === orderId || o.order_code === orderId);
    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng tương ứng.' };
    }

    const fulfillment = this.getFulfillment(order.id);
    const currentStatus = fulfillment.status;

    // Idempotent acknowledgement if already in target status
    if (currentStatus === targetStatus) {
      return { success: true, fulfillment, points_awarded: 0 };
    }


    // Validate state transition
    if (!isValidTransition(currentStatus, targetStatus)) {
      return {
        success: false,
        error: `Chuyển trạng thái không hợp lệ: không thể từ ${currentStatus} nhảy sang ${targetStatus}.`,
      };
    }

    // Update fulfillment state
    fulfillment.status = targetStatus;
    fulfillment.updated_at = new Date().toISOString();

    let pointsAwarded = 0;
    let createdShipment = undefined;

    const correlationId = `corr_ord_${order.order_code.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    // Record Audit Log for Fulfillment transition
    const { AuditService } = await import('./audit-service');
    AuditService.recordAudit({
      correlation_id: correlationId,
      module: 'FULFILLMENT',
      action: `TRANSITION_${targetStatus}`,
      actor: {
        id: metadata?.actor_id || 'warehouse-staff',
        name: metadata?.actor_id || 'Nhân sự kho',
        role: 'STAFF',
      },
      entity: {
        type: 'ORDER',
        id: order.id,
        code: order.order_code,
      },
      from_state: currentStatus,
      to_state: targetStatus,
      reason: metadata?.carrier ? `Xuất đơn qua đơn vị ${metadata.carrier}` : undefined,
      result: 'SUCCESS',
      metadata: metadata,
    });

    // Side effect: Handle shipment creation when SHIPPED
    if (targetStatus === 'SHIPPED') {
      const shipment = await defaultDeliveryAdapter.createShipment({
        order_id: order.id,
        order_code: order.order_code,
        carrier: metadata?.carrier || 'MANUAL',
        tracking_code: metadata?.tracking_code,
        shipping_fee: metadata?.shipping_fee || 30000,
      });

      fulfillment.tracking_number = shipment.tracking_code;
      fulfillment.carrier = shipment.carrier;
      fulfillment.shipped_at = shipment.shipped_at;
      order.status = 'SHIPPED';
      createdShipment = shipment;

      // Emit ORDER_SHIPPED event
      const shipEvt = await createEventRecord(
        'ORDER_SHIPPED',
        'order',
        order.id,
        {
          order_code: order.order_code,
          carrier: shipment.carrier,
          tracking_code: shipment.tracking_code,
          correlation_id: correlationId,
        },
        { correlation_id: correlationId, actor_id: metadata?.actor_id }
      );
      processEvent(shipEvt.id).catch(() => {});
    }

    // Side effect: Handle delivery & points award when DELIVERED
    if (targetStatus === 'DELIVERED') {
      fulfillment.delivered_at = new Date().toISOString();
      order.status = 'DELIVERED';

      // Emit ORDER_DELIVERED event
      const delivEvt = await createEventRecord(
        'ORDER_DELIVERED',
        'order',
        order.id,
        {
          order_code: order.order_code,
          delivered_at: fulfillment.delivered_at,
          quantity: order.quantity,
          correlation_id: correlationId,
        },
        { correlation_id: correlationId, actor_id: metadata?.actor_id }
      );
      processEvent(delivEvt.id).catch(() => {});

      // Award Member Points (Strictly idempotent based on event ID)
      const ptResult = PointService.awardPointsForDelivery(
        delivEvt.id,
        order.id,
        order.order_code,
        order.customer?.phone || '0900000000',
        order.quantity
      );
      pointsAwarded = ptResult.pointsAwarded;

      // Emit LOYALTY_GRANTED audit
      if (pointsAwarded > 0) {
        AuditService.recordAudit({
          correlation_id: correlationId,
          module: 'LOYALTY',
          action: 'LOYALTY_GRANTED',
          actor: { id: 'system', name: 'Hệ thống GMR Point', role: 'SYSTEM' },
          entity: { type: 'POINT', id: ptResult.entry?.id || delivEvt.id, code: order.order_code },
          reason: `Tích lũy ${pointsAwarded} điểm sau khi giao đơn thành công`,
          result: 'SUCCESS',
        });
      }
    }

    if (targetStatus === 'PACKED') {
      // Emit PACKAGE_CREATED event
      const packEvt = await createEventRecord(
        'PACKAGE_CREATED',
        'package',
        order.id,
        {
          order_code: order.order_code,
          action: 'ORDER_PACKED',
          correlation_id: correlationId,
        },
        { correlation_id: correlationId, actor_id: metadata?.actor_id }
      );
      processEvent(packEvt.id).catch(() => {});
    }

    return {
      success: true,
      fulfillment,
      shipment: createdShipment,
      points_awarded: pointsAwarded,
    };
  }
}
