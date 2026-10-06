import { AuditLog, ErrorLog, GmrModule } from '@/types';

// In-Memory store for Audit Logs (Immutable append-only ledger)
export const auditLogsStore: AuditLog[] = [
  {
    id: 'audit-init-001',
    correlation_id: 'corr_init_sys_2026',
    timestamp: '2026-10-06T00:00:00Z',
    module: 'NGAN',
    action: 'INIT_SYSTEM_NGAN',
    actor: {
      id: 'admin-quynh',
      name: 'Admin Quỳnh',
      role: 'ADMIN',
    },
    entity: {
      type: 'NGAN',
      id: 'ngan-live-003',
      code: '#003',
    },
    from_state: 'DRAFT',
    to_state: 'OPEN',
    reason: 'Sprint GM-LIVE-01 Launch',
    result: 'SUCCESS',
  },
];

// In-Memory store for Error Logs
export const errorLogsStore: ErrorLog[] = [];

/**
 * Audit and Observability Service for GMR Core
 * Answers:
 * 1. "Ai đã làm gì, trên đối tượng nào, lúc nào?" (Audit)
 * 2. "Cái gì hỏng và ảnh hưởng đến đâu?" (Error)
 * 3. Traceability: Link via correlation_id
 */
export class AuditService {
  /**
   * Generates or extracts a standardized correlation ID.
   * e.g. corr_ord_17282348234_abc
   */
  static getCorrelationId(prefix = 'gen', existing?: string): string {
    if (existing && existing.startsWith('corr_')) return existing;
    const cleanPrefix = prefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 10);
    const rand = Math.random().toString(36).substring(2, 7);
    return `corr_${cleanPrefix}_${Date.now()}_${rand}`;
  }

  /**
   * Records an immutable audit log entry.
   * Never throws errors that crash business transactions.
   */
  static recordAudit(entry: Omit<AuditLog, 'id' | 'timestamp'> & { timestamp?: string }): AuditLog {
    try {
      const log: AuditLog = {
        id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: entry.timestamp || new Date().toISOString(),
        ...entry,
      };

      auditLogsStore.unshift(log);
      return log;
    } catch (err) {
      console.warn('[AuditService] Failed to record audit log (non-blocking):', err);
      return {
        id: `aud-err-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...entry,
      };
    }
  }

  /**
   * Records an error entry with correlation context.
   */
  static recordError(entry: Omit<ErrorLog, 'id' | 'timestamp' | 'retry_count' | 'status'> & {
    retry_count?: number;
    status?: ErrorLog['status'];
  }): ErrorLog {
    try {
      const errLog: ErrorLog = {
        id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        retry_count: entry.retry_count || 0,
        status: entry.status || 'FAILED',
        ...entry,
      };

      errorLogsStore.unshift(errLog);
      return errLog;
    } catch (err) {
      console.warn('[AuditService] Failed to record error log (non-blocking):', err);
      return {
        id: `err-fallback-${Date.now()}`,
        timestamp: new Date().toISOString(),
        retry_count: 0,
        status: 'FAILED',
        ...entry,
      };
    }
  }

  /**
   * Trace all events, audits, and errors across an entire journey by correlation_id.
   */
  static traceByCorrelationId(correlationId: string) {
    const audits = auditLogsStore.filter((a) => a.correlation_id === correlationId);
    const errors = errorLogsStore.filter((e) => e.correlation_id === correlationId);
    return {
      correlation_id: correlationId,
      audits,
      errors,
    };
  }

  /**
   * Get all audits with optional filter by module / entity.
   */
  static getAudits(filter?: { module?: GmrModule; entityId?: string; actorId?: string }): AuditLog[] {
    return auditLogsStore.filter((a) => {
      if (filter?.module && a.module !== filter.module) return false;
      if (filter?.entityId && a.entity.id !== filter.entityId) return false;
      if (filter?.actorId && a.actor.id !== filter.actorId) return false;
      return true;
    });
  }

  /**
   * Get system health and metric counters for Control Tower.
   */
  static getSystemHealth() {
    const totalAudits = auditLogsStore.length;
    const totalErrors = errorLogsStore.length;
    const failedErrors = errorLogsStore.filter((e) => e.status === 'FAILED').length;
    const pendingRetry = errorLogsStore.filter((e) => e.status === 'PENDING_RETRY').length;

    const moduleStatus: Record<GmrModule, { healthy: boolean; errorCount: number }> = {
      SOURCE: { healthy: true, errorCount: 0 },
      CURATION: { healthy: true, errorCount: 0 },
      STORY: { healthy: true, errorCount: 0 },
      NGAN: { healthy: true, errorCount: 0 },
      DEMAND: { healthy: true, errorCount: 0 },
      ORDER: { healthy: true, errorCount: 0 },
      AUTOMATION: { healthy: true, errorCount: 0 },
      FULFILLMENT: { healthy: true, errorCount: 0 },
      QR: { healthy: true, errorCount: 0 },
      LOYALTY: { healthy: true, errorCount: 0 },
      CRM: { healthy: true, errorCount: 0 },
      ADAPTER_ZALO: { healthy: true, errorCount: 0 },
      ADAPTER_CARRIER: { healthy: true, errorCount: 0 },
      ADAPTER_MAKE: { healthy: true, errorCount: 0 },
    };

    errorLogsStore.forEach((err) => {
      if (moduleStatus[err.module]) {
        moduleStatus[err.module].errorCount += 1;
        if (err.status === 'FAILED') {
          moduleStatus[err.module].healthy = false;
        }
      }
    });

    return {
      totalAudits,
      totalErrors,
      failedErrors,
      pendingRetry,
      moduleStatus,
    };
  }
}
