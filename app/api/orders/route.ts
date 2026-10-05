import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/services/order-service';
import { OrderInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    let body: OrderInput;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu gửi lên không đúng định dạng JSON.' },
        { status: 400 }
      );
    }

    // Capture request landing metadata
    const referer = request.headers.get('referer') || undefined;
    if (!body.landing_url && referer) {
      body.landing_url = referer;
    }

    const result = await createOrder(body);

    if (!result.success) {
      const statusCode =
        result.error_code === 'QUANTITY_UNAVAILABLE' || result.error_code === 'NGAN_CLOSED'
          ? 409
          : 400;

      return NextResponse.json(
        {
          success: false,
          error_code: result.error_code,
          error: result.error,
          remaining_capacity: result.remaining_capacity,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      order_code: result.order_code,
      is_duplicate: result.is_duplicate,
    });
  } catch (error: unknown) {
    // Never expose stack traces or internal database errors
    console.error('API /api/orders internal error:', error);
    return NextResponse.json(
      {
        success: false,
        error_code: 'SERVER_ERROR',
        error: 'Có lỗi xảy ra trong quá trình xử lý đơn. Vui lòng thử lại sau ít phút.',
      },
      { status: 500 }
    );
  }
}
