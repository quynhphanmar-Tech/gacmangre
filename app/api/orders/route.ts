import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/services/order-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createOrder(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.order,
    });
  } catch (error: unknown) {
    console.error('API /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi máy chủ nội bộ.' },
      { status: 500 }
    );
  }
}
