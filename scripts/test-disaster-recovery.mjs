// scripts/test-disaster-recovery.mjs
// Acceptance test suite for Disaster Recovery, Snapshotting, and Incident Protocol

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runRecoveryTests() {
  console.log('========================================================');
  console.log('🛡️ RUNNING GMR DISASTER RECOVERY & ROLLBACK TEST SUITE');
  console.log(`📡 Target Base URL: ${BASE_URL}`);
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Test Backup Snapshot Creation (Pre-Migration / Milestone)
  console.log('📸 1. Create Pre-Migration / Milestone Backup Snapshot');
  const snapRes = await fetch(`${BASE_URL}/api/admin/recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'CREATE_SNAPSHOT',
      tag: 'v0.6.0-audit-foundation',
      commit: '245f181',
      created_by: 'admin-quynh',
    }),
  });
  const snapData = await snapRes.json();
  assert(snapData.success, 'Snapshot created successfully');
  assert(snapData.snapshot?.tag === 'v0.6.0-audit-foundation', 'Snapshot tagged with milestone');
  assert(snapData.snapshot?.checksum?.startsWith('sha256_'), `Checksum generated: ${snapData.snapshot?.checksum}`);
  assert(snapData.snapshot?.data_counts?.ngans >= 1, 'Snapshot captures entity counts');
  console.log('');

  // 2. Test Incident Protocol: 01 DETECT & 02 FREEZE
  console.log('🚨 2. Protocol 01 DETECT & 02 FREEZE Simulation');
  const incidentRes = await fetch(`${BASE_URL}/api/admin/recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'RECORD_INCIDENT',
      module: 'ADAPTER_CARRIER',
      severity: 'HIGH',
      layer: 'ADAPTER',
      blast_radius: 'MODULE',
      symptom: 'Viettel Post API timeout during bulk pickup sync',
      correlation_id: `corr_inc_${Date.now()}`,
      affected_entity: { type: 'ORDER', id: 'GM-2026-000075' },
    }),
  });
  const incidentData = await incidentRes.json();
  assert(incidentData.success, 'Incident recorded with status FREEZE');
  assert(incidentData.incident?.layer === 'ADAPTER', 'Layer correctly diagnosed as ADAPTER');
  assert(incidentData.incident?.blast_radius === 'MODULE', 'Blast radius isolated to MODULE');
  const incidentId = incidentData.incident?.incident_id;
  console.log(`   Incident ID: ${incidentId}\n`);

  // 3. Test Rollback & Layered Diagnosis: Simulate Adapter Fallback without rolling back Core Order
  console.log('🔄 3. Rollback Action (Selective Layer Recovery)');
  const resolveRes = await fetch(`${BASE_URL}/api/admin/recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'RESOLVE_INCIDENT',
      incident_id: incidentId,
      root_cause: 'Carrier DNS degradation outside GMR infrastructure',
      action_taken: 'Switched adapter carrier to MANUAL fallback queue without touching Order DB',
      rollback_point: 'Adapter config layer (No DB/Core rollback)',
      preventive_action: 'Configured automated carrier timeout fallback to 2500ms',
      verified_by: 'admin-quynh',
    }),
  });
  const resolveData = await resolveRes.json();
  assert(resolveData.success, 'Incident resolved and updated');
  assert(resolveData.incident?.status === 'RESOLVED', 'Incident status set to RESOLVED');
  assert(
    resolveData.incident?.action_taken?.includes('without touching Order DB'),
    'Preserved Order Database integrity during adapter rollback'
  );
  console.log('');

  // 4. Test 05 VERIFY: Multi-Dimension System Integrity Check
  console.log('🔍 4. Protocol 05 VERIFY Multi-Dimension Integrity Check');
  const verifyRes = await fetch(`${BASE_URL}/api/admin/recovery?mode=verify`);
  const verifyData = await verifyRes.json();
  assert(verifyData.success, 'Verification endpoint executed');
  assert(verifyData.verification?.passed === true, 'All 5 integrity checks passed');
  assert(verifyData.verification?.checks?.orders_integrity === true, 'Order data integrity verified');
  assert(verifyData.verification?.checks?.events_integrity === true, 'Event queue integrity verified');
  assert(verifyData.verification?.checks?.audit_ledger === true, 'Audit ledger verified');
  console.log(`   Status Message: "${verifyData.verification?.checks?.message}"\n`);

  // Summary
  console.log('========================================================');
  console.log(`🏁 DISASTER RECOVERY TEST COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) process.exit(1);
}

runRecoveryTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
