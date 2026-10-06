// scripts/test-audit-foundation.mjs
// Test suite for GMR Audit Foundation & Observability Layer via HTTP API

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runAuditTests() {
  console.log('========================================================');
  console.log('🛡️ RUNNING GMR AUDIT FOUNDATION & OBSERVABILITY TEST');
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

  // 1. Test System Health Radar
  console.log('📡 1. System Health Radar for PM Control Tower');
  const healthRes = await fetch(`${BASE_URL}/api/admin/audit?mode=health`);
  const healthData = await healthRes.json();
  assert(healthData.success, 'Health API returned successfully');
  assert(healthData.health?.totalAudits >= 0, `Total audit records: ${healthData.health?.totalAudits}`);
  assert(healthData.health?.moduleStatus?.ORDER?.healthy === true, 'ORDER module is healthy in radar');
  console.log('');

  // 2. Test Order Engine Correlation & Audit Stamping
  console.log('📦 2. Order Engine Workflow with Correlation Key');
  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Nguyễn Văn Kiểm Toán',
      phone: '0988776655',
      address: 'Số 98 Phố Huế, Hoàn Kiếm, Hà Nội',
      quantity: 1,
      idempotency_key: `audit-test-${Date.now()}`,
    }),
  });
  const orderData = await orderRes.json();
  assert(orderData.success, 'Order created successfully');
  const orderCode = orderData.order_code;
  console.log(`   Order Code: ${orderCode}\n`);

  // 3. Test Audit Log Query & Module Filtering
  console.log('📝 3. Audit Log Query & Dimension Filtering');
  const auditRes = await fetch(`${BASE_URL}/api/admin/audit?module=ORDER`);
  const auditData = await auditRes.json();
  assert(auditData.success, 'Audit API returned ORDER logs');
  const orderAudit = auditData.audits?.find((a) => a.entity?.code === orderCode);
  assert(!!orderAudit, `Audit log found for order code ${orderCode}`);
  assert(
    orderAudit?.correlation_id?.startsWith('corr_ord_'),
    `Order stamped with valid correlation_id: ${orderAudit?.correlation_id}`
  );
  assert(orderAudit?.actor?.role === 'CUSTOMER', 'Audit correctly captured actor role as CUSTOMER');
  console.log('');

  // 4. Test End-to-End Correlation Trace
  console.log('🔍 4. Trace End-to-End Journey by Correlation ID');
  const traceRes = await fetch(`${BASE_URL}/api/admin/audit?correlation_id=${encodeURIComponent(orderAudit?.correlation_id)}`);
  const traceData = await traceRes.json();
  assert(traceData.success, 'Trace API resolved successfully');
  assert(traceData.trace?.audits?.length >= 1, `Found ${traceData.trace?.audits?.length} steps in workflow journey`);
  console.log('');

  // 5. Test Curation State Change Audit Logging
  console.log('🌿 5. Source Curation State Change Audit');
  const patchRes = await fetch(`${BASE_URL}/api/admin/sources/src-001-oca`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'VERIFIED',
      notes: 'Đã hoàn tất đối soát giấy tờ vùng trồng OCA Đắk Lắk',
    }),
  });
  const patchData = await patchRes.json();
  assert(patchData.success, 'Curation status updated via API');
  const curationAuditRes = await fetch(`${BASE_URL}/api/admin/audit?module=CURATION`);
  const curationAuditData = await curationAuditRes.json();
  const recentCurationAudit = curationAuditData.audits?.[0];
  assert(!!recentCurationAudit, 'Curation audit record found');
  assert(recentCurationAudit?.action === 'UPDATE_CURATION_STATUS', 'Action is UPDATE_CURATION_STATUS');
  console.log('');

  // Summary
  console.log('========================================================');
  console.log(`🏁 AUDIT FOUNDATION TEST COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) process.exit(1);
}

runAuditTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
