import { FulfillmentBatch, FulfillmentBatchItem, BatchStatus } from '@/types';
import { mockOrdersStore, mockNgans, mockProducers } from '@/lib/data/mock-data';
import { generateQrToken } from '@/lib/crypto/qr-token';
import { createEventRecord } from '@/services/event-service';

// In-Memory store for Fulfillment Batches
export const batchesStore: FulfillmentBatch[] = [
  {
    id: 'batch-003-2026-01',
    batch_code: 'BATCH-003-2026-01',
    ngan_id: 'ngan-live-003',
    ngan_number: '#003',
    producer_id: 'prod-003-pao',
    producer_name: 'Anh Giàng A Páo',
    expected_quantity: 20,
    received_quantity: 20,
    status: 'RECEIVED',
    items: [
      {
        id: 'bi-1',
        batch_id: 'batch-003-2026-01',
        order_id: 'e5555555-5555-5555-5555-555555555551',
        order_code: 'GM-2026-000073',
        quantity: 2,
        status: 'RECEIVED',
        created_at: '2026-10-06T00:00:00Z',
      },
    ],
    created_at: '2026-10-06T08:00:00Z',
    received_at: '2026-10-06T10:00:00Z',
    notes: 'Mẻ mật ong đầu mùa chuyển bằng xe khách từ Mèo Vạc về Hà Nội.',
  },
];

export class BatchService {
  /**
   * Creates a batch grouping orders for a specific Ngăn.
   * Does NOT duplicate order data; references order IDs.
   */
  static createBatch(nganId: string, notes?: string, explicitOrderIds?: string[]): FulfillmentBatch {
    const ngan = mockNgans.find((n) => n.id === nganId || n.slug === nganId || n.number === nganId) || mockNgans[0];
    const producer = mockProducers.find((p) => p.id === ngan.product?.producer_id) || mockProducers[0];

    // Filter confirmed orders for this Ngăn or explicit order IDs
    const orders = explicitOrderIds && explicitOrderIds.length > 0
      ? mockOrdersStore.filter((o) => explicitOrderIds.includes(o.id) || explicitOrderIds.includes(o.order_code))
      : mockOrdersStore.filter(
          (o) => (o.ngan_id === ngan.id || o.ngan?.slug === ngan.slug || !o.ngan_id) && o.status !== 'CANCELLED'
        );

    const expectedQty = orders.reduce((sum, o) => sum + o.quantity, 0) || ngan.current_quantity;
    const batchCode = `BATCH-${ngan.number.replace('#', '')}-${new Date().getFullYear()}-${String(batchesStore.length + 1).padStart(2, '0')}`;
    const batchId = `batch-${Date.now()}`;

    const items: FulfillmentBatchItem[] = orders.map((o) => ({
      id: `bi-${Date.now()}-${o.id}`,
      batch_id: batchId,
      order_id: o.id,
      order_code: o.order_code,
      quantity: o.quantity,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    }));

    const newBatch: FulfillmentBatch = {
      id: batchId,
      batch_code: batchCode,
      ngan_id: ngan.id,
      ngan_number: ngan.number,
      producer_id: producer.id,
      producer_name: producer.name,
      expected_quantity: expectedQty,
      received_quantity: 0,
      status: 'CREATED',
      items,
      notes,
      created_at: new Date().toISOString(),
    };

    batchesStore.unshift(newBatch);
    return newBatch;
  }

  /**
   * Receives a batch at the warehouse (Scanning Batch QR).
   * Atomically transitions batch status to RECEIVED and sets all item statuses to RECEIVED.
   */
  static async receiveBatch(
    batchIdOrCode: string,
    receivedQty?: number,
    actorId = 'warehouse-staff-1'
  ): Promise<{ success: boolean; batch?: FulfillmentBatch; error?: string }> {
    const batch = batchesStore.find(
      (b) => b.id === batchIdOrCode || b.batch_code === batchIdOrCode
    );

    if (!batch) {
      return { success: false, error: 'Không tìm thấy lô hàng (Batch).' };
    }

    if (batch.status === 'RECEIVED') {
      // Idempotent acknowledgement
      return { success: true, batch };
    }

    batch.status = 'RECEIVED';
    batch.received_quantity = receivedQty !== undefined ? receivedQty : batch.expected_quantity;
    batch.received_at = new Date().toISOString();

    if (batch.items) {
      batch.items.forEach((item) => {
        item.status = 'RECEIVED';
      });
    }

    // Emit FULFILLMENT_RECEIVED event (Decoupled)
    await createEventRecord('PRODUCER_CONFIRMED', 'ngan', batch.ngan_id, {
      batch_id: batch.id,
      batch_code: batch.batch_code,
      received_quantity: batch.received_quantity,
      received_at: batch.received_at,
      actor_id: actorId,
    });

    return { success: true, batch };
  }

  static getBatch(idOrCode: string): FulfillmentBatch | null {
    return batchesStore.find((b) => b.id === idOrCode || b.batch_code === idOrCode) || null;
  }

  static getAllBatches(): FulfillmentBatch[] {
    return batchesStore;
  }
}
