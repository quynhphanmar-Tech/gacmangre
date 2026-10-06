import { NextRequest, NextResponse } from 'next/server';
import { BatchService } from '@/services/batch-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { received_quantity, actor_id } = body;

    const result = await BatchService.receiveBatch(id, received_quantity, actor_id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi nhận lô' },
      { status: 500 }
    );
  }
}
