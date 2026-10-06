// scripts/test-m4-fulfillment.mjs
// Comprehensive Acceptance Test Suite for M4 Fulfillment + QR + Delivery + CRM Bridge
// Covers all 15 P0 Scenarios specified in the M4 Code Brief.

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING M4 FULFILLMENT & QR ACCEPTANCE TEST SUITE');
  console.log(`📡 Target Base URL: ${BASE_URL}`);
  console.log('====================================================\n');

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

  // 1. Create a test order via Order Engine first
  console.log('📦 Setup: Creating an order via Order Engine...');
  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Nguyễn Văn Kiểm Thử',
      phone: '0987654321',
      address: 'Số 123 Đường Láng, Đống Đa, Hà Nội',
      quantity: 2,
      note: 'Giao giờ hành chính',
      idempotency_key: `m4-test-${Date.now()}`,
    }),
  });

  const orderData = await orderRes.json();
  assert(orderData.success, 'Order Engine creates order successfully');
  const testOrder = orderData.order;
  const orderCode = testOrder.order_code;
  console.log(`   Order Code: ${orderCode}\n`);

  // --- TEST 01 & 04: Order QR Generation & PII Masking ---
  console.log('🔍 Test 01 & 04: Generate QR Token & Verify PII Masking');
  // Replicate generateQrToken logic:
  const crypto = await import('crypto');
  const QR_SECRET = process.env.QR_SECRET_KEY || 'gac-mang-re-pantry-secret-key-2026';
  const payload = {
    type: 'ORDER',
    id: testOrder.id,
    code: orderCode,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
    salt: crypto.randomBytes(4).toString('hex'),
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', QR_SECRET).update(payloadStr).digest('base64url').substring(0, 16);
  const validQrToken = `gmr_order_${payloadStr}.${signature}`;

  const scanOrderRes = await fetch(`${BASE_URL}/api/fulfillment/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: validQrToken }),
  });
  const scanOrderData = await scanOrderRes.json();
  assert(scanOrderData.success, 'QR Token resolved valid order');
  assert(
    scanOrderData.order?.customer_display?.includes('***'),
    `PII Masking applied to customer name/phone: "${scanOrderData.order?.customer_display}"`
  );
  console.log('');

  // --- TEST 02 & 03: Invalid QR Rejection ---
  console.log('🛡️ Test 03: Rejection of forged / invalid QR Token');
  const invalidScanRes = await fetch(`${BASE_URL}/api/fulfillment/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: 'invalid_malformed_token_xyz',
    }),
  });
  assert(invalidScanRes.status === 400 || !(await invalidScanRes.clone().json()).success, 'Invalid QR token correctly rejected');
  console.log('');

  // --- TEST 05: Batch Creation Linking Orders ---
  console.log('📦 Test 05: Batch Creation');
  const batchRes = await fetch(`${BASE_URL}/api/fulfillment/batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ngan_id: 'ngan-001',
      producer_id: 'prod-001',
      order_ids: [testOrder.id],
      note: 'Lô hàng thử nghiệm số 1',
    }),
  });
  const batchData = await batchRes.json();
  assert(batchData.success && batchData.batch?.code.startsWith('BATCH-'), `Created Batch ${batchData.batch?.code}`);
  const batchId = batchData.batch?.id;
  assert(batchData.batch?.total_orders >= 1, 'Batch contains linked orders');
  console.log('');

  // --- TEST 06: Atomic Batch Receive ---
  console.log('📥 Test 06: Atomic Batch Receive at Warehouse');
  const receiveRes = await fetch(`${BASE_URL}/api/fulfillment/batches/${batchId}/receive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actor_id: 'operator-hanoi' }),
  });
  const receiveData = await receiveRes.json();
  assert(receiveData.success && receiveData.batch?.status === 'RECEIVED', 'Batch status updated to RECEIVED');
  assert(receiveData.batch?.items[0]?.status === 'RECEIVED', 'Batch item status transitioned to RECEIVED');
  console.log('');

  // --- TEST 07: Pack Order Event ---
  console.log('🎁 Test 07: Pack Order');
  const packRes = await fetch(`${BASE_URL}/api/fulfillment/orders/${testOrder.id}/pack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actor_id: 'pack-staff-1' }),
  });
  const packData = await packRes.json();
  assert(packData.success && packData.fulfillment?.status === 'PACKED', 'Order transitioned to PACKED');
  console.log('');

  // --- TEST 08 & 15: Ship Order & Manual Carrier Workflow ---
  console.log('🚚 Test 08 & 15: Ship Order with Carrier Adapter');
  const shipRes = await fetch(`${BASE_URL}/api/fulfillment/orders/${testOrder.id}/ship`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      carrier: 'GHN Express',
      tracking_code: 'GHN-VN-998877',
      shipping_fee: 30000,
    }),
  });
  const shipData = await shipRes.json();
  assert(shipData.success && shipData.fulfillment?.status === 'SHIPPED', 'Order transitioned to SHIPPED');
  assert(shipData.shipment?.tracking_code === 'GHN-VN-998877', 'Shipment created with carrier tracking');
  console.log('');

  // --- TEST 09 & 12: Deliver Order & Member Points Ledger ---
  console.log('🏅 Test 09 & 12: Deliver Order & Award Member Points');
  const deliverRes = await fetch(`${BASE_URL}/api/fulfillment/orders/${testOrder.id}/deliver`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actor_id: 'shipper-01' }),
  });
  const deliverData = await deliverRes.json();
  assert(deliverData.success && deliverData.fulfillment?.status === 'DELIVERED', 'Order transitioned to DELIVERED');
  assert(deliverData.points_awarded > 0, `Member points awarded: ${deliverData.points_awarded} pts`);
  console.log('');

  // --- TEST 10 & 13: Idempotent Re-scan / Deliver & No Double Points ---
  console.log('🔁 Test 10 & 13: Idempotent Retry & Zero Double Points');
  const reDeliverRes = await fetch(`${BASE_URL}/api/fulfillment/orders/${testOrder.id}/deliver`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actor_id: 'shipper-01' }),
  });
  const reDeliverData = await reDeliverRes.json();
  assert(reDeliverData.success, 'Re-deliver request acknowledged gracefully');
  assert(reDeliverData.points_awarded === 0, 'No duplicate points awarded on idempotent re-delivery');
  console.log('');

  // --- TEST 11: Invalid State Jump Rejection ---
  console.log('🚫 Test 11: State Machine Rejection of Invalid Jump');
  // Create another fresh order (which starts in PENDING / CONFIRMED)
  const freshOrderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Trần Văn Nhảy Trạng Thái',
      phone: '0912345678',
      address: 'Số 456 Hoàng Hoa Thám, Ba Đình, Hà Nội',
      quantity: 1,
    }),
  });
  const freshOrder = (await freshOrderRes.json()).order;

  // Attempt to deliver straight from RECEIVED/CONFIRMED without PACKED & SHIPPED
  const invalidJumpRes = await fetch(`${BASE_URL}/api/fulfillment/orders/${freshOrder.id}/deliver`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actor_id: 'hacker-jump' }),
  });
  const invalidJumpData = await invalidJumpRes.json();
  assert(!invalidJumpData.success, 'Invalid state jump (RECEIVED -> DELIVERED) correctly rejected');
  console.log(`   Rejection reason: "${invalidJumpData.error}"\n`);

  // --- TEST 14: Producer Capture Flow ---
  console.log('📝 Test 14: Producer Unstructured Delivery List Capture');
  const captureRawText = `
Danh sách giao sáng nay 06/10:
1. Anh ${testOrder.customer?.name} - ${testOrder.customer?.phone} - ${orderCode} - Đã giao xong
2. Chị Nguyễn Thị B - 0909000111 - 2 hũ - Chưa giao
  `;
  const captureRes = await fetch(`${BASE_URL}/api/fulfillment/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      raw_text: captureRawText,
      source_type: 'TEXT',
      producer_id: 'prod-001',
    }),
  });
  const captureData = await captureRes.json();
  assert(captureData.success, 'Capture Layer ingested unstructured text');
  assert(captureData.job?.records?.length >= 1, `Extracted ${captureData.job?.records?.length} records`);
  const matchedRecord = captureData.job?.records?.find(
    (r) => r.matched_order_code === orderCode || r.raw_text?.includes(orderCode)
  );
  assert(!!matchedRecord, `Matched order code ${orderCode} in producer list`);
  console.log('');

  // --- SUMMARY ---
  console.log('====================================================');
  console.log(`🏁 TEST COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
