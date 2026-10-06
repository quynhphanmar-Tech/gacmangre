import { ScanEvent, ScanAction, Order, FulfillmentBatch } from '@/types';
import { resolveQrToken, maskPii } from '@/lib/crypto/qr-token';
import { mockOrdersStore } from '@/lib/data/mock-data';
import { BatchService } from './batch-service';
import { FulfillmentService } from './fulfillment-service';

// In-Memory store for Scan Events (Immutable audit trail)
export const scanEventsStore: ScanEvent[] = [];

export interface ScanResolveResult {
  success: boolean;
  type?: 'ORDER' | 'BATCH';
  order?: {
    id: string;
    order_code: string;
    product_name: string;
    quantity: number;
    status: string;
    customer_display: string;
    address_display: string;
  };
  batch?: FulfillmentBatch;
  error?: string;
}

export class ScanService {
  /**
   * Resolves a scanned token or human-entered code.
   * If token is scanned, checks signature and masks PII for privacy.
   */
  static resolveScanTarget(rawInput: string, hasFullPermission = false): ScanResolveResult {
    const clean = rawInput.trim();

    // 1. Try resolving as signed QR Token
    const tokenPayload = resolveQrToken(clean);
    if (tokenPayload) {
      if (tokenPayload.type === 'BATCH') {
        const batch = BatchService.getBatch(tokenPayload.code || tokenPayload.id);
        if (batch) return { success: true, type: 'BATCH', batch };
      }

      if (tokenPayload.type === 'ORDER') {
        const order = mockOrdersStore.find((o) => o.id === tokenPayload.id || o.order_code === tokenPayload.code);
        if (order) {
          const ful = FulfillmentService.getFulfillment(order.id);
          const custName = order.customer?.name || 'Khách hàng';
          const custPhone = order.customer?.phone || '0900000000';
          const custAddr = order.customer?.address || 'Địa chỉ ghi nhận';
          const custProv = order.customer?.province || 'Việt Nam';
          const { maskedName, maskedPhone } = maskPii(custName, custPhone);

          return {
            success: true,
            type: 'ORDER',
            order: {
              id: order.id,
              order_code: order.order_code,
              product_name: order.ngan?.title || 'Sản vật GMR',
              quantity: order.quantity,
              status: ful.status,
              customer_display: hasFullPermission ? `${custName} (${custPhone})` : `${maskedName} (${maskedPhone})`,
              address_display: hasFullPermission ? custAddr : custProv,
            },
          };
        }
      }
    }

    // 2. Direct code lookup fallback (e.g. human types "GM-2026-000073" or "BATCH-003-2026-01")
    const orderDirect = mockOrdersStore.find((o) => o.order_code === clean || o.id === clean);
    if (orderDirect) {
      const ful = FulfillmentService.getFulfillment(orderDirect.id);
      const custName = orderDirect.customer?.name || 'Khách hàng';
      const custPhone = orderDirect.customer?.phone || '0900000000';
      const custAddr = orderDirect.customer?.address || 'Địa chỉ ghi nhận';
      const custProv = orderDirect.customer?.province || 'Việt Nam';
      const { maskedName, maskedPhone } = maskPii(custName, custPhone);

      return {
        success: true,
        type: 'ORDER',
        order: {
          id: orderDirect.id,
          order_code: orderDirect.order_code,
          product_name: orderDirect.ngan?.title || 'Sản vật GMR',
          quantity: orderDirect.quantity,
          status: ful.status,
          customer_display: hasFullPermission ? `${custName} (${custPhone})` : `${maskedName} (${maskedPhone})`,
          address_display: hasFullPermission ? custAddr : custProv,
        },
      };
    }

    const batchDirect = BatchService.getBatch(clean);
    if (batchDirect) {
      return { success: true, type: 'BATCH', batch: batchDirect };
    }

    return { success: false, error: 'Mã QR hoặc mã tra cứu không hợp lệ.' };
  }

  /**
   * Executes a workflow action from a scan (e.g., PACK_ORDER, MARK_SHIPPED, RECEIVE_BATCH).
   * Records immutable scan audit event.
   */
  static async executeScanAction(
    targetIdentifier: string,
    action: ScanAction,
    actorType: 'WAREHOUSE_STAFF' | 'PRODUCER' | 'ADMIN' | 'SYSTEM' = 'WAREHOUSE_STAFF',
    actorId = 'staff-01',
    metadata?: Record<string, unknown>
  ): Promise<{ success: boolean; result?: unknown; error?: string }> {
    // Audit log entry
    const scanEvent: ScanEvent = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      token: targetIdentifier,
      actor_type: actorType,
      actor_id: actorId,
      action,
      metadata,
      created_at: new Date().toISOString(),
    };

    scanEventsStore.unshift(scanEvent);

    // M4 Audit Foundation: Record QR_SCANNED Event & Audit
    const { AuditService } = await import('./audit-service');
    const correlationId = `corr_qr_${targetIdentifier.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 16)}_${Date.now()}`;

    AuditService.recordAudit({
      correlation_id: correlationId,
      module: 'QR',
      action: 'QR_SCANNED',
      actor: {
        id: actorId,
        name: actorId,
        role: actorType === 'PRODUCER' ? 'PRODUCER' : 'STAFF',
      },
      entity: {
        type: 'QR',
        id: targetIdentifier,
        code: targetIdentifier,
      },
      reason: `Quét mã thực hiện hành động ${action}`,
      result: 'SUCCESS',
      metadata: { action, actorType, ...metadata },
    });

    // Dispatch action
    if (action === 'RECEIVE_BATCH') {
      const res = await BatchService.receiveBatch(targetIdentifier, undefined, actorId);
      scanEvent.batch_code = targetIdentifier;
      return res;
    }

    if (action === 'PACK_ORDER') {
      const res = await FulfillmentService.transitionStatus(targetIdentifier, 'PACKED', { actor_id: actorId });
      scanEvent.order_code = targetIdentifier;
      return res;
    }

    if (action === 'MARK_SHIPPED') {
      const res = await FulfillmentService.transitionStatus(targetIdentifier, 'SHIPPED', {
        actor_id: actorId,
        carrier: (metadata?.carrier as string) || 'MANUAL',
        tracking_code: metadata?.tracking_code as string,
        shipping_fee: metadata?.shipping_fee as number,
      });
      scanEvent.order_code = targetIdentifier;
      return res;
    }

    if (action === 'MARK_DELIVERED') {
      const res = await FulfillmentService.transitionStatus(targetIdentifier, 'DELIVERED', { actor_id: actorId });
      scanEvent.order_code = targetIdentifier;
      return res;
    }

    return { success: true, result: 'Action acknowledged' };
  }

  static getScanEvents(): ScanEvent[] {
    return scanEventsStore;
  }
}
