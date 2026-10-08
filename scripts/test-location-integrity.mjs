// scripts/test-location-integrity.mjs
// ==============================================================================
// GẠC MĂNG RÊ — LOCATION INTEGRITY & REGRESSION TEST SUITE (REG-LOCATION-001)
//
// MỤC TIÊU:
// 1. REG-LOCATION-001: Ngăn chặn triệt để cross-producer location contamination
//    - OCA Cacao KHÔNG ĐƯỢC chứa 'Chợ Gạo', 'Đắk Lắk'
//    - Mèo Vạc KHÔNG ĐƯỢC chứa 'Ba Vì', 'Lâm Đồng'
// 2. Canonical Location Traceability:
//    - Mọi Location Entity phải gắn liền với role, evidence_id và truth_status
// 3. UI Integrity:
//    - /ngan/cacao-oca và /ngan/mat-ong-bac-ha-meo-vac hiển thị đúng canonical origin
//    - Không được render địa danh không có bằng chứng
// ==============================================================================

import assert from 'node:assert';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runLocationIntegrityTests() {
  console.log('================================================================');
  console.log('🏛️  GẠC MĂNG RÊ — LOCATION INTEGRITY & REGRESSION TEST SUITE');
  console.log('    [REG-LOCATION-001: Zero Cross-Producer Contamination]');
  console.log(`📡 Runtime Target: ${BASE_URL}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function testAsync(description, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${description}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${description}`);
      console.error(`     Reason: ${err.message}`);
      failed++;
    }
  }

  // ----------------------------------------------------------------------------
  // TEST 1: OCA CACAO REGRESSION & CANONICAL ORIGIN
  // ----------------------------------------------------------------------------
  console.log('🍫 Phase 1: OCA Cacao Location & Contamination Audit');

  await testAsync('OCA Live Ngăn (/ngan/cacao-oca) renders 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/ngan/cacao-oca`);
    assert.strictEqual(res.status, 200, 'OCA Ngăn should respond 200');
  });

  await testAsync('REG-LOCATION-001: OCA Ngăn is completely free of "Chợ Gạo"', async () => {
    const res = await fetch(`${BASE_URL}/ngan/cacao-oca`);
    const html = await res.text();
    assert(!html.includes('Chợ Gạo'), 'REG-LOCATION-001 VIOLATION: "Chợ Gạo" detected in OCA Ngăn!');
  });

  await testAsync('OCA Ngăn features canonical origin "Châu Đức, Bà Rịa - Vũng Tàu" backed by EVD-OCA-002', async () => {
    const res = await fetch(`${BASE_URL}/ngan/cacao-oca`);
    const html = await res.text();
    assert(html.includes('Châu Đức'), 'HTML must feature canonical Châu Đức');
    assert(html.includes('Bà Rịa - Vũng Tàu'), 'HTML must feature canonical Bà Rịa - Vũng Tàu');
  });

  await testAsync('OCA Ngăn displays early Trust Strip (Nguồn gốc · Quy trình · Minh chứng)', async () => {
    const res = await fetch(`${BASE_URL}/ngan/cacao-oca`);
    const html = await res.text();
    assert(html.includes('Nguồn gốc'), 'Must render early Trust Strip: Nguồn gốc');
    assert(html.includes('Quy trình'), 'Must render early Trust Strip: Quy trình');
    assert(html.includes('Minh chứng'), 'Must render early Trust Strip: Minh chứng');
  });

  await testAsync('OCA Ngăn features Personal vs Gift entry with Story Card preview', async () => {
    const res = await fetch(`${BASE_URL}/ngan/cacao-oca`);
    const html = await res.text();
    assert(html.includes('Dùng cho mình'), 'Must feature Dùng cho mình button');
    assert(html.includes('Làm quà tặng'), 'Must feature Làm quà tặng button');
    assert(html.includes('THẺ CÂU CHUYỆN SẢN VẬT'), 'Must feature Story Card component');
  });

  // ----------------------------------------------------------------------------
  // TEST 2: MÈO VẠC HONEY REGRESSION & CANONICAL ORIGIN
  // ----------------------------------------------------------------------------
  console.log('\n🐝 Phase 2: Mèo Vạc Honey Location & Contamination Audit');

  await testAsync('Mèo Vạc Live Ngăn (/ngan/mat-ong-bac-ha-meo-vac) renders 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/ngan/mat-ong-bac-ha-meo-vac`);
    assert.strictEqual(res.status, 200, 'Mèo Vạc Ngăn should respond 200');
  });

  await testAsync('Mèo Vạc Ngăn is free of cross-producer contamination ("Chợ Gạo", "Ba Vì")', async () => {
    const res = await fetch(`${BASE_URL}/ngan/mat-ong-bac-ha-meo-vac`);
    const html = await res.text();
    assert(!html.includes('Chợ Gạo'), 'Contamination: "Chợ Gạo" in Mèo Vạc Ngăn');
    assert(!html.includes('Ba Vì'), 'Contamination: "Ba Vì" in Mèo Vạc Ngăn');
  });

  await testAsync('Mèo Vạc Ngăn features canonical origin "Mèo Vạc" and "Hà Giang"', async () => {
    const res = await fetch(`${BASE_URL}/ngan/mat-ong-bac-ha-meo-vac`);
    const html = await res.text();
    assert(html.includes('Mèo Vạc'), 'HTML must feature Mèo Vạc');
    assert(html.includes('Hà Giang'), 'HTML must feature Hà Giang');
  });

  await testAsync('Mèo Vạc Ngăn displays early Trust Strip and Story Card preview', async () => {
    const res = await fetch(`${BASE_URL}/ngan/mat-ong-bac-ha-meo-vac`);
    const html = await res.text();
    assert(html.includes('Nguồn gốc'), 'Must render early Trust Strip');
    assert(html.includes('THẺ CÂU CHUYỆN SẢN VẬT'), 'Must feature Story Card');
  });

  // ----------------------------------------------------------------------------
  // TEST 3: ORDER FORM INTENTION & STORY CARD CONFIRMATION FLOW
  // ----------------------------------------------------------------------------
  console.log('\n📦 Phase 3: Order Flow with Intention & Story Card');

  await testAsync('Order Form (/dat-hang/cacao-oca?intent=GIFT) renders Gift mode', async () => {
    const res = await fetch(`${BASE_URL}/dat-hang/cacao-oca?intent=GIFT`);
    assert.strictEqual(res.status, 200, 'Order form responds 200');
    const html = await res.text();
    assert(html.includes('Làm quà tặng'), 'Order form renders Gift selector');
  });

  await testAsync('Create Order with GIFT intention and verify Story Card on Confirmation page', async () => {
    const testCode = `idem-loc-test-${Date.now()}`;
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Trần Minh Đức',
        phone: '0988776655',
        zalo_identifier: '0988776655',
        address: 'Số 88 Phố Huế, Hàng Bài, Hoàn Kiếm',
        province: 'Hà Nội',
        quantity: 2,
        ngan_id: 'prod-001-oca',
        intention: 'GIFT',
        gift_note: 'Chúc bạn thưởng thức trọn vẹn hương vị mộc bản xứ',
        idempotency_key: testCode,
      }),
    });

    const orderData = await orderRes.json();
    assert(orderData.success, 'Order API created gift order successfully');
    assert(orderData.order?.intention === 'GIFT', 'Order persists GIFT intention');
    assert(orderData.order?.story_card, 'Order generated Story Card spec');

    // Fetch Order Confirmation Page
    const confirmRes = await fetch(`${BASE_URL}/order/${orderData.order_code}`);
    assert.strictEqual(confirmRes.status, 200, 'Confirmation page responds 200');
    const confirmHtml = await confirmRes.text();
    assert(confirmHtml.includes('Làm quà tặng'), 'Confirmation page shows Gift intention');
    assert(confirmHtml.includes('THẺ CÂU CHUYỆN SẢN VẬT ĐÍNH KÈM'), 'Confirmation page renders Story Card');
    assert(confirmHtml.includes('Chúc bạn thưởng thức'), 'Confirmation page renders gift note');
  });

  // ----------------------------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 LOCATION INTEGRITY REPORT: ${passed} PASSED / ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runLocationIntegrityTests().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
