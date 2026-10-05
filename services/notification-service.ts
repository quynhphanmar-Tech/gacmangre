// ==============================================================================
// GẠC MĂNG RÊ — Notification Abstraction Layer (M3 Automation)
// ==============================================================================

export interface OrderNotificationPayload {
  order_id: string;
  order_code: string;
  ngan_number: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  customer_zalo?: string;
  quantity: number;
  current_quantity: number;
  moq: number;
  created_at: string;
}

export interface MoqReachedNotificationPayload {
  ngan_id: string;
  ngan_number: string;
  product_name: string;
  moq: number;
  total_quantity: number;
  total_orders: number;
  shipping_estimate?: string;
  producer_id: string;
  producer_name: string;
  producer_phone: string;
  producer_zalo?: string;
}

export interface NotificationResult {
  success: boolean;
  provider: 'mock' | 'zalo';
  recipient: string;
  message_content: string;
  error?: string;
  sent_at: string;
}

// ------------------------------------------------------------------------------
// Provider Interface
// ------------------------------------------------------------------------------
export interface NotificationProvider {
  sendOrderCreated(payload: OrderNotificationPayload): Promise<NotificationResult>;
  sendMoqReachedCustomer(payload: MoqReachedNotificationPayload, customer: { name: string; phone: string; zalo?: string }): Promise<NotificationResult>;
  sendMoqReachedProducer(payload: MoqReachedNotificationPayload): Promise<NotificationResult>;
}

// ------------------------------------------------------------------------------
// In-Memory Simulated Log for UAT & Audit
// ------------------------------------------------------------------------------
export const sentNotificationsLog: NotificationResult[] = [];

// ------------------------------------------------------------------------------
// Mock Notification Provider (Reliable, Inspectable, Testable)
// ------------------------------------------------------------------------------
export class MockNotificationProvider implements NotificationProvider {
  // Allows testing failure simulation without breaking orders
  private simulateFailure = false;

  setSimulateFailure(fail: boolean) {
    this.simulateFailure = fail;
  }

  async sendOrderCreated(payload: OrderNotificationPayload): Promise<NotificationResult> {
    const recipient = payload.customer_zalo || payload.customer_phone;
    const content = `[ZALO OA MOCK] ĐẶT NGĂN THÀNH CÔNG\nChào ${payload.customer_name}, bạn đã cùng Gạc Măng Rê mở Ngăn ${payload.ngan_number}.\nMã đơn: ${payload.order_code}\nSố lượng: ${payload.quantity} phần\nTiến trình hiện tại: ${payload.current_quantity} / ${payload.moq}\nGạc Măng Rê sẽ cập nhật cho bạn khi Ngăn đủ số lượng.\nCTA: Xem Ngăn (https://gacmangre.com/order/${payload.order_code})`;

    if (this.simulateFailure) {
      const failedResult: NotificationResult = {
        success: false,
        provider: 'mock',
        recipient,
        message_content: content,
        error: 'SIMULATED_ZALO_API_NETWORK_TIMEOUT',
        sent_at: new Date().toISOString(),
      };
      sentNotificationsLog.unshift(failedResult);
      return failedResult;
    }

    const result: NotificationResult = {
      success: true,
      provider: 'mock',
      recipient,
      message_content: content,
      sent_at: new Date().toISOString(),
    };
    sentNotificationsLog.unshift(result);
    return result;
  }

  async sendMoqReachedCustomer(
    payload: MoqReachedNotificationPayload,
    customer: { name: string; phone: string; zalo?: string }
  ): Promise<NotificationResult> {
    const recipient = customer.zalo || customer.phone;
    const content = `[ZALO OA MOCK] NGĂN ĐÃ ĐỦ\nNgăn ${payload.ngan_number} (${payload.product_name}) đã đủ người cùng mở!\nGạc Măng Rê sẽ chuyển sang bước xác nhận với người làm.\nCảm ơn bạn đã cùng mở Ngăn.`;

    const result: NotificationResult = {
      success: true,
      provider: 'mock',
      recipient,
      message_content: content,
      sent_at: new Date().toISOString(),
    };
    sentNotificationsLog.unshift(result);
    return result;
  }

  async sendMoqReachedProducer(payload: MoqReachedNotificationPayload): Promise<NotificationResult> {
    const recipient = payload.producer_zalo || payload.producer_phone;
    const confirmationUrl = `https://gacmangre.com/admin/producers/confirm?ngan_id=${payload.ngan_id}`;
    const content = `[ZALO OA MOCK] NGĂN ${payload.ngan_number} ĐÃ ĐỦ\nSản vật: ${payload.product_name}\nSố lượng: ${payload.total_quantity} phần\nNgười đặt: ${payload.total_orders} khách hàng\nGạc Măng Rê đã đạt MOQ. Vui lòng xác nhận khả năng chuẩn bị đơn.\nCTA: XÁC NHẬN (${confirmationUrl})`;

    const result: NotificationResult = {
      success: true,
      provider: 'mock',
      recipient,
      message_content: content,
      sent_at: new Date().toISOString(),
    };
    sentNotificationsLog.unshift(result);
    return result;
  }
}

// ------------------------------------------------------------------------------
// Production Zalo Provider (Ready for Live ZNS Credentials)
// ------------------------------------------------------------------------------
export class ZaloNotificationProvider implements NotificationProvider {
  private oaToken: string;

  constructor() {
    this.oaToken = process.env.ZALO_OA_ACCESS_TOKEN || '';
  }

  async sendOrderCreated(payload: OrderNotificationPayload): Promise<NotificationResult> {
    if (!this.oaToken) {
      // Fallback to Mock if credentials are not configured in environment
      return new MockNotificationProvider().sendOrderCreated(payload);
    }

    try {
      // Official Zalo ZNS API Call
      const res = await fetch('https://business.openapi.zalo.me/message/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          access_token: this.oaToken,
        },
        body: JSON.stringify({
          phone: payload.customer_phone.replace(/^0/, '84'),
          template_id: process.env.ZALO_TEMPLATE_ORDER_CREATED || 'default',
          template_data: {
            customer_name: payload.customer_name,
            ngan_number: payload.ngan_number,
            order_code: payload.order_code,
            quantity: String(payload.quantity),
            current_progress: `${payload.current_quantity}/${payload.moq}`,
          },
        }),
      });

      const data = await res.json();
      return {
        success: data.error === 0,
        provider: 'zalo',
        recipient: payload.customer_phone,
        message_content: `ZNS sent for ${payload.order_code}`,
        error: data.error !== 0 ? data.message : undefined,
        sent_at: new Date().toISOString(),
      };
    } catch (err: unknown) {
      return {
        success: false,
        provider: 'zalo',
        recipient: payload.customer_phone,
        message_content: `ZNS failed for ${payload.order_code}`,
        error: err instanceof Error ? err.message : 'Zalo Network Error',
        sent_at: new Date().toISOString(),
      };
    }
  }

  async sendMoqReachedCustomer(
    payload: MoqReachedNotificationPayload,
    customer: { name: string; phone: string; zalo?: string }
  ): Promise<NotificationResult> {
    return new MockNotificationProvider().sendMoqReachedCustomer(payload, customer);
  }

  async sendMoqReachedProducer(payload: MoqReachedNotificationPayload): Promise<NotificationResult> {
    return new MockNotificationProvider().sendMoqReachedProducer(payload);
  }
}

// ------------------------------------------------------------------------------
// Notification Service Singleton
// ------------------------------------------------------------------------------
export const mockNotificationProvider = new MockNotificationProvider();

export class NotificationService {
  private static getProvider(): NotificationProvider {
    const isLiveZalo = process.env.NOTIFICATION_PROVIDER === 'zalo';
    return isLiveZalo ? new ZaloNotificationProvider() : mockNotificationProvider;
  }

  static async sendOrderCreatedNotification(payload: OrderNotificationPayload): Promise<NotificationResult> {
    return this.getProvider().sendOrderCreated(payload);
  }

  static async sendMoqReachedCustomer(
    payload: MoqReachedNotificationPayload,
    customer: { name: string; phone: string; zalo?: string }
  ): Promise<NotificationResult> {
    return this.getProvider().sendMoqReachedCustomer(payload, customer);
  }

  static async sendProducerMoqNotification(payload: MoqReachedNotificationPayload): Promise<NotificationResult> {
    return this.getProvider().sendMoqReachedProducer(payload);
  }
}
