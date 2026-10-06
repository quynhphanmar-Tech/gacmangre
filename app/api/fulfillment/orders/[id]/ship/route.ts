import { NextRequest, NextResponse } from 'next/server';
import { FulfillmentService } from '@/services/fulfillment-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const result = await FulfillmentService.transitionStatus(id, 'SHIPPED', {
      carrier: body.carrier || 'MANUAL',
      tracking_code: body.tracking_code,
      shipping_fee: body.shipping_fee,
      actor_id: body.actor_id,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi xuất kho vận chuyển' },
      { status: 500 }
    );
  }
}
