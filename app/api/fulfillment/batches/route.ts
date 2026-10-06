import { NextRequest, NextResponse } from 'next/server';
import { BatchService } from '@/services/batch-service';

export async function GET() {
  const batches = BatchService.getAllBatches();
  return NextResponse.json({ success: true, batches });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ngan_id, notes, order_ids } = body;

    if (!ngan_id) {
      return NextResponse.json({ success: false, error: 'Thiếu ngan_id để tạo lô.' }, { status: 400 });
    }

    const newBatch = BatchService.createBatch(ngan_id, notes, order_ids);
    return NextResponse.json({
      success: true,
      batch: {
        ...newBatch,
        code: newBatch.batch_code,
        total_orders: newBatch.items?.length || 0,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi tạo batch' },
      { status: 500 }
    );
  }
}
