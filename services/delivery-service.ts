import { Shipment } from '@/types';

export interface CreateShipmentInput {
  order_id: string;
  order_code: string;
  carrier?: string;
  tracking_code?: string;
  shipping_fee?: number;
  notes?: string;
}

export interface DeliveryProviderAdapter {
  createShipment(input: CreateShipmentInput): Promise<Shipment>;
  getShipmentStatus(trackingCode: string): Promise<{ status: Shipment['status']; location?: string }>;
  cancelShipment(trackingCode: string): Promise<boolean>;
  calculateShipping(weightGrams: number, destinationProvince: string): Promise<number>;
}

// In-Memory store for shipments
export const shipmentsStore: Shipment[] = [];

/**
 * P0 Manual Delivery Adapter (Staff enters carrier, tracking code, shipping fee)
 */
export class ManualDeliveryAdapter implements DeliveryProviderAdapter {
  async createShipment(input: CreateShipmentInput): Promise<Shipment> {
    const existing = shipmentsStore.find((s) => s.order_id === input.order_id);
    if (existing) {
      existing.carrier = input.carrier || existing.carrier;
      existing.tracking_code = input.tracking_code || existing.tracking_code;
      existing.shipping_fee = input.shipping_fee ?? existing.shipping_fee;
      existing.notes = input.notes || existing.notes;
      existing.updated_at = new Date().toISOString();
      return existing;
    }

    const tracking = input.tracking_code || `VN-${Date.now().toString().slice(-6)}`;
    const newShipment: Shipment = {
      id: `ship-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order_id: input.order_id,
      order_code: input.order_code,
      carrier: input.carrier || 'MANUAL',
      tracking_code: tracking,
      shipping_fee: input.shipping_fee || 30000,
      status: 'IN_TRANSIT',
      shipped_at: new Date().toISOString(),
      notes: input.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    shipmentsStore.unshift(newShipment);
    return newShipment;
  }

  async getShipmentStatus(trackingCode: string): Promise<{ status: Shipment['status']; location?: string }> {
    const found = shipmentsStore.find((s) => s.tracking_code === trackingCode);
    return {
      status: found ? found.status : 'IN_TRANSIT',
      location: 'Đang vận chuyển trên đường',
    };
  }

  async cancelShipment(trackingCode: string): Promise<boolean> {
    const found = shipmentsStore.find((s) => s.tracking_code === trackingCode);
    if (found) {
      found.status = 'RETURNED';
      found.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  async calculateShipping(weightGrams: number, destinationProvince: string): Promise<number> {
    const isHanoiOrHcm = destinationProvince.includes('Hà Nội') || destinationProvince.includes('Hồ Chí Minh');
    return isHanoiOrHcm ? 30000 : 45000;
  }
}

export const defaultDeliveryAdapter = new ManualDeliveryAdapter();
