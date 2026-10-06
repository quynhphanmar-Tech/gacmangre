import { NextRequest, NextResponse } from 'next/server';
import { CaptureService } from '@/services/capture-service';

export async function GET() {
  const jobs = CaptureService.getAllJobs();
  return NextResponse.json({ success: true, jobs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { file_name, file_type, producer_id, raw_lines, raw_text } = body;

    if (!raw_lines && raw_text && typeof raw_text === 'string') {
      raw_lines = raw_text
        .split('\n')
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 0);
    }

    if (!raw_lines || !Array.isArray(raw_lines) || raw_lines.length === 0) {
      return NextResponse.json({ success: false, error: 'Thiếu danh sách dòng nội dung raw_lines hoặc raw_text.' }, { status: 400 });
    }

    const job = CaptureService.processRawText(
      file_name || 'delivery_list.txt',
      file_type || 'EXCEL',
      producer_id || 'prod-003-pao',
      raw_lines
    );

    return NextResponse.json({ success: true, job });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi xử lý capture' },
      { status: 500 }
    );
  }
}
