import { NextRequest, NextResponse } from 'next/server';
import { ScanService } from '@/services/scan-service';
import { ScanAction } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, action, actor_type, actor_id, metadata } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Thiếu mã QR hoặc mã định danh.' }, { status: 400 });
    }

    // If action is provided, execute scan transition action
    if (action) {
      const execResult = await ScanService.executeScanAction(
        token,
        action as ScanAction,
        actor_type,
        actor_id,
        metadata
      );
      return NextResponse.json(execResult);
    }

    // Otherwise resolve scanned token or code (masking PII by default unless admin)
    const resolveResult = ScanService.resolveScanTarget(token, actor_type === 'ADMIN');
    return NextResponse.json(resolveResult);
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi xử lý scan' },
      { status: 500 }
    );
  }
}
