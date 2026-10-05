import { NextRequest, NextResponse } from 'next/server';
import { getSourceById, updateSourceStatus } from '@/services/source-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const source = await getSourceById(id);
  if (!source) {
    return NextResponse.json({ success: false, error: 'Không tìm thấy nguồn' }, { status: 404 });
  }
  return NextResponse.json({ success: true, source });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateSourceStatus(id, body.status, body.notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không thể cập nhật nguồn' }, { status: 400 });
    }
    return NextResponse.json({ success: true, source: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi cập nhật' },
      { status: 500 }
    );
  }
}
