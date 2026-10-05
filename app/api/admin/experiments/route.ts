import { NextRequest, NextResponse } from 'next/server';
import { getM4Experiments, updateExperimentDecision } from '@/lib/data/mock-experiments';

export async function GET() {
  const experiments = await getM4Experiments();
  return NextResponse.json({
    success: true,
    experiments,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { experiment_id, decision, rationale } = await request.json();
    if (!experiment_id || !decision) {
      return NextResponse.json({ success: false, error: 'Thiếu dữ liệu bắt buộc' }, { status: 400 });
    }

    const updated = await updateExperimentDecision(experiment_id, decision, rationale || '');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy experiment' }, { status: 404 });
    }

    return NextResponse.json({ success: true, experiment: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
