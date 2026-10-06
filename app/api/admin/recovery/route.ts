import { NextRequest, NextResponse } from 'next/server';
import { RecoveryService, drSnapshotsStore, incidentsStore } from '@/services/recovery-service';
import { FailureLayer, BlastRadius } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'all';

    if (mode === 'verify') {
      const verification = RecoveryService.verifySystemIntegrity();
      return NextResponse.json({ success: true, verification });
    }

    if (mode === 'snapshots') {
      return NextResponse.json({ success: true, snapshots: drSnapshotsStore });
    }

    if (mode === 'incidents') {
      return NextResponse.json({ success: true, incidents: incidentsStore });
    }

    return NextResponse.json({
      success: true,
      snapshots: drSnapshotsStore,
      incidents: incidentsStore,
      verification: RecoveryService.verifySystemIntegrity(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi truy vấn phục hồi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action 1: Create Backup Snapshot
    if (action === 'CREATE_SNAPSHOT') {
      const { tag, commit, created_by } = body;
      const snapshot = RecoveryService.createSnapshot(
        tag || `milestone-${Date.now()}`,
        commit || 'HEAD',
        created_by || 'admin-quynh'
      );
      return NextResponse.json({ success: true, snapshot });
    }

    // Action 2: Record Incident (DETECT -> FREEZE)
    if (action === 'RECORD_INCIDENT') {
      const { module, severity, layer, blast_radius, symptom, correlation_id, affected_entity } = body;
      const incident = RecoveryService.recordIncident({
        module: module || 'ORDER',
        severity: severity || 'HIGH',
        layer: (layer as FailureLayer) || 'CODE',
        blast_radius: (blast_radius as BlastRadius) || 'MODULE',
        symptom: symptom || 'Phát hiện bất thường',
        correlation_id,
        affected_entity,
      });
      return NextResponse.json({ success: true, incident });
    }

    // Action 3: Resolve Incident & Resume
    if (action === 'RESOLVE_INCIDENT') {
      const { incident_id, root_cause, action_taken, rollback_point, preventive_action, verified_by } = body;
      const resolved = RecoveryService.resolveIncident(incident_id, {
        root_cause,
        action_taken,
        rollback_point,
        preventive_action,
        verified_by: verified_by || 'admin-quynh',
      });
      return NextResponse.json({ success: true, incident: resolved });
    }

    return NextResponse.json({ success: false, error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Lỗi xử lý sự cố' },
      { status: 500 }
    );
  }
}
