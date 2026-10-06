import { NextRequest, NextResponse } from 'next/server';
import { AuditService } from '@/services/audit-service';
import { GmrModule } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const correlationId = searchParams.get('correlation_id');
    const module = searchParams.get('module') as GmrModule | null;
    const entityId = searchParams.get('entity_id') || undefined;
    const mode = searchParams.get('mode') || 'all';

    // 1. Trace by correlation_id
    if (correlationId) {
      const trace = AuditService.traceByCorrelationId(correlationId);
      return NextResponse.json({ success: true, trace });
    }

    // 2. System health for PM Control Tower
    if (mode === 'health') {
      const health = AuditService.getSystemHealth();
      return NextResponse.json({ success: true, health });
    }

    // 3. Filtered audits
    const audits = AuditService.getAudits({
      module: module || undefined,
      entityId,
    });

    return NextResponse.json({ success: true, audits, total: audits.length });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi truy vấn audit' },
      { status: 500 }
    );
  }
}
