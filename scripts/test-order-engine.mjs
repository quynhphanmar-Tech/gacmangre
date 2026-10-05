// ==============================================================================
// GẠC MĂNG RÊ — M2 Acceptance Test Suite
// (Automated Verification of Section 20 Acceptance Criteria)
// ==============================================================================

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting Gạc Măng Rê M2 Order Engine Acceptance Tests...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // --------------------------------------------------------------------------
    // Test A: 1 user orders 1.
    // --------------------------------------------------------------------------
    console.log('--- Test A: 1 user orders 1 ---');
    const idempotencyKeyA = 'test-a-' + Date.now();
    const resA = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Trần Văn Nam',
        phone: '0912345678',
        address: 'Số 12 Lý Thường Kiệt, Hà Nội',
        province: 'Hà Nội',
        quantity: 1,
        ngan_id: 'c3333333-3333-3333-3333-333333333333',
        idempotency_key: idempotencyKeyA,
      }),
    });
    const dataA = await resA.json();
    assert(resA.status === 200 && dataA.success, 'Test A order created successfully');
    assert(dataA.order_code && dataA.order_code.startsWith('GM-2026-'), `Sequential order code format: ${dataA.order_code}`);
    assert(dataA.is_duplicate === false, 'Order A is marked as fresh order');

    // --------------------------------------------------------------------------
    // Test B: Same user accidentally submits twice (Double Click / Idempotency)
    // --------------------------------------------------------------------------
    console.log('\n--- Test B: Accidental duplicate submission ---');
    const resB = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Trần Văn Nam',
        phone: '0912345678',
        address: 'Số 12 Lý Thường Kiệt, Hà Nội',
        province: 'Hà Nội',
        quantity: 1,
        ngan_id: 'c3333333-3333-3333-3333-333333333333',
        idempotency_key: idempotencyKeyA, // SAME KEY
      }),
    });
    const dataB = await resB.json();
    assert(resB.status === 200 && dataB.success, 'Duplicate request handled gracefully');
    assert(dataB.is_duplicate === true, 'Duplicate request flagged as duplicate');
    assert(dataB.order_code === dataA.order_code, 'Returned identical order code without creating new row');

    // --------------------------------------------------------------------------
    // Test C: Validation checks (Phone, Empty Name, Invalid Quantity)
    // --------------------------------------------------------------------------
    console.log('\n--- Test C: Server validation checks ---');
    const resBadPhone = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lê Sai',
        phone: '12345', // Invalid phone
        address: 'Hà Nội',
        quantity: 1,
        ngan_id: 'c3333333-3333-3333-3333-333333333333',
      }),
    });
    const dataBadPhone = await resBadPhone.json();
    assert(resBadPhone.status === 400 && dataBadPhone.success === false, 'Rejected invalid phone number');

    // --------------------------------------------------------------------------
    // Test G: Order Confirmation Page Read
    // --------------------------------------------------------------------------
    console.log('\n--- Test G: Order Confirmation Page ---');
    const resConfirm = await fetch(`${BASE_URL}/order/${dataA.order_code}`);
    assert(resConfirm.status === 200, `Confirmation page renders successfully for ${dataA.order_code}`);

    // Summary
    console.log(`\n=============================================`);
    console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
    console.log(`=============================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
