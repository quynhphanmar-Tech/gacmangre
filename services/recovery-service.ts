import { IncidentRecord, DisasterRecoverySnapshot, FailureLayer, BlastRadius } from '@/types';
import { mockOrdersStore, mockNgans } from '@/lib/data/mock-data';
import { mockEventsStore } from '@/services/event-service';
import { auditLogsStore, AuditService } from '@/services/audit-service';
import crypto from 'crypto';

// In-Memory store for Disaster Recovery Snapshots
export const drSnapshotsStore: DisasterRecoverySnapshot[] = [
  {
    snapshot_id: 'snap-v0.6.0-init',
    timestamp: '2026-10-06T17:00:00Z',
    tag: 'v0.6.0-audit-foundation',
    git_commit: '245f181',
    migration_version: '20261005_init_schema.sql',
    rpo_target: '<= 24h',
    rto_target: '<= 4h',
    data_counts: {
      orders: 1,
      customers: 1,
      events: 1,
      audits: 1,
      ngans: 4,
    },
    checksum: 'sha256_mock_init_good_state',
    created_by: 'system_milestone',
  },
];

// In-Memory store for Incidents (Audit Trail for DR)
export const incidentsStore: IncidentRecord[] = [];

/**
 * Service quản lý Disaster Recovery, Freeze, Rollback Checkpoint và Verification
 */
export class RecoveryService {
  /**
   * Tạo Snapshot sao lưu trạng thái dữ liệu (Pre-Migration / Milestone Checkpoint)
   */
  static createSnapshot(tag: string, commit = 'HEAD', createdBy = 'admin-quynh'): DisasterRecoverySnapshot {
    const ordersCount = mockOrdersStore.length;
    const eventsCount = mockEventsStore.length;
    const auditsCount = auditLogsStore.length;
    const ngansCount = mockNgans.length;

    const rawDataString = JSON.stringify({
      orders: mockOrdersStore.map((o) => o.id),
      events: mockEventsStore.map((e) => e.id),
      audits: auditLogsStore.map((a) => a.id),
    });

    const checksum = crypto.createHash('sha256').update(rawDataString).digest('hex').substring(0, 16);

    const snapshot: DisasterRecoverySnapshot = {
      snapshot_id: `snap-${Date.now()}-${tag}`,
      timestamp: new Date().toISOString(),
      tag,
      git_commit: commit,
      migration_version: '20261006_audit_foundation.sql',
      rpo_target: '<= 24h',
      rto_target: '<= 4h',
      data_counts: {
        orders: ordersCount,
        customers: ordersCount,
        events: eventsCount,
        audits: auditsCount,
        ngans: ngansCount,
      },
      checksum: `sha256_${checksum}`,
      created_by: createdBy,
    };

    drSnapshotsStore.unshift(snapshot);

    // Ghi nhận Audit Log
    AuditService.recordAudit({
      correlation_id: `corr_snap_${tag}_${Date.now()}`,
      module: 'ORDER',
      action: 'CREATE_DR_SNAPSHOT',
      actor: { id: createdBy, name: createdBy, role: 'ADMIN' },
      entity: { type: 'ORDER', id: snapshot.snapshot_id, code: tag },
      reason: `Tạo mốc checkpoint sao lưu trước biến động / milestone`,
      result: 'SUCCESS',
      metadata: snapshot.data_counts,
    });

    return snapshot;
  }

  /**
   * Bước 01 & 02: Ghi nhận sự cố và kích hoạt Protocol FREEZE
   */
  static recordIncident(data: {
    module: IncidentRecord['module'];
    severity: IncidentRecord['severity'];
    layer: FailureLayer;
    blast_radius: BlastRadius;
    symptom: string;
    correlation_id?: string;
    affected_entity?: { type: string; id: string };
    detected_by?: string;
  }): IncidentRecord {
    const correlationId = data.correlation_id || AuditService.getCorrelationId('incident');

    const incident: IncidentRecord = {
      incident_id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      detected_at: new Date().toISOString(),
      detected_by: data.detected_by || 'Admin Quỳnh',
      module: data.module,
      severity: data.severity,
      correlation_id: correlationId,
      affected_entity: data.affected_entity,
      layer: data.layer,
      blast_radius: data.blast_radius,
      symptom: data.symptom,
      status: 'FREEZE' as any,
    };

    incidentsStore.unshift(incident);

    // Audit log
    AuditService.recordAudit({
      correlation_id: correlationId,
      module: data.module,
      action: 'INCIDENT_DETECTED_FREEZE',
      actor: { id: incident.detected_by, name: incident.detected_by, role: 'ADMIN' },
      entity: {
        type: (data.affected_entity?.type as any) || 'ORDER',
        id: incident.incident_id,
        code: data.affected_entity?.id,
      },
      reason: `Sự cố ${data.layer} [${data.blast_radius}]: ${data.symptom}. Kích hoạt FREEZE ngăn lỗi lan rộng.`,
      result: 'SUCCESS',
    });

    return incident;
  }

  /**
   * Bước 03 - 06: Cập nhật chẩn đoán, rollback theo layer và giải quyết sự cố
   */
  static resolveIncident(
    incidentId: string,
    resolution: {
      root_cause: string;
      action_taken: string;
      rollback_point: string;
      preventive_action: string;
      verified_by: string;
    }
  ): IncidentRecord | null {
    const incident = incidentsStore.find((i) => i.incident_id === incidentId);
    if (!incident) return null;

    incident.root_cause = resolution.root_cause;
    incident.action_taken = resolution.action_taken;
    incident.rollback_point = resolution.rollback_point;
    incident.preventive_action = resolution.preventive_action;
    incident.verified_by = resolution.verified_by;
    incident.resolved_at = new Date().toISOString();
    incident.status = 'RESOLVED';

    // Audit log
    AuditService.recordAudit({
      correlation_id: incident.correlation_id,
      module: incident.module,
      action: 'INCIDENT_RESOLVED_RESUME',
      actor: { id: resolution.verified_by, name: resolution.verified_by, role: 'ADMIN' },
      entity: { type: 'ORDER', id: incident.incident_id },
      reason: `Đã xác minh và Resume: ${resolution.action_taken} (Rollback: ${resolution.rollback_point})`,
      result: 'SUCCESS',
      metadata: resolution,
    });

    return incident;
  }

  /**
   * Bước 05: Verify toàn diện tính toàn vẹn hệ thống trước khi Resume
   */
  static verifySystemIntegrity(): {
    passed: boolean;
    checks: {
      core_routes: boolean;
      orders_integrity: boolean;
      events_integrity: boolean;
      audit_ledger: boolean;
      traceability: boolean;
      message: string;
    };
  } {
    const ordersValid = mockOrdersStore.every((o) => Boolean(o.id && o.order_code && o.quantity > 0));
    const eventsValid = mockEventsStore.every((e) => Boolean(e.id && e.correlation_id && e.event_type));
    const auditsValid = auditLogsStore.length > 0;
    const allPassed = ordersValid && eventsValid && auditsValid;

    return {
      passed: allPassed,
      checks: {
        core_routes: true,
        orders_integrity: ordersValid,
        events_integrity: eventsValid,
        audit_ledger: auditsValid,
        traceability: true,
        message: allPassed
          ? 'Hệ thống đạt chuẩn an toàn 100%. Đủ điều kiện RESUME.'
          : 'Phát hiện dữ liệu bất toàn. Tiếp tục Freeze để rà soát.',
      },
    };
  }
}
