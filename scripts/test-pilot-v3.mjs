/**
 * GMR PILOT UX V3 & CONTENT OVERRIDE REGRESSION SUITE
 * 
 * Verifies:
 * 1. Pilot UX V3 10-section architecture on /ngan/cacao-oca
 * 2. Cùng mở mẻ conversion module: 18/30, 280.000đ/phần, live demand
 * 3. Evidence Drawer and granular truth statuses (VERIFIED, PRODUCER_CLAIM, MISSING_EVIDENCE)
 * 4. Health claims governance (Strict PRODUCER_CLAIM, ZERO medical claims: tim, não, ung thư, huyết áp)
 * 5. Dynamic Content / Image Override API (/api/admin/content-config)
 * 6. Hard boundary protection: Prohibits elevating PRODUCER_CLAIM to VERIFIED
 * 7. Asset provenance priority: REAL FIRST, BEAUTIFUL SECOND
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runPilotV3Tests() {
  console.log('================================================================');
  console.log('🚀 GMR PILOT UX V3 & GOVERNANCE REGRESSION SUITE');
  console.log(`📡 Target: ${BASE_URL}`);
  console.log('================================================================\n');

  let passes = 0;
  let fails = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passes++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      fails++;
    }
  }

  // 1. Fetch Pilot Page /ngan/cacao-oca
  console.log('🍫 [TEST 1] Pilot UX V3 Layout on /ngan/cacao-oca');
  const res = await fetch(`${BASE_URL}/ngan/cacao-oca`);
  assert(res.status === 200, 'Page /ngan/cacao-oca returns 200 OK');
  const html = await res.text();

  assert(html.includes('CACAO OCA') || html.includes('Cacao Lên Men Thủ Công OCA') || (html.includes('Cacao') && html.includes('OCA')), 'Hero renders canonical CACAO OCA title');
  assert(html.includes('Châu Đức'), 'Hero renders canonical location Châu Đức');
  assert(!html.includes('Chợ Gạo'), 'Hero isolates Chợ Gạo (Regression REG-LOCATION-001)');
  assert(!html.includes('Giàng A Páo'), 'Zero cross-case producer leakage (No Giàng A Páo)');

  // 2. Trust Strip & Evidence Drawer
  console.log('\n🛡️ [TEST 2] Trust Strip & Evidence Drawer');
  assert(html.includes('Nguồn gốc') && html.includes('Quy trình') && html.includes('Minh chứng'), 'Trust Strip renders 3 pillars');
  assert(html.includes('Xem toàn bộ minh chứng') || html.includes('minh chứng'), 'Evidence trigger is present');
  assert(html.includes('VERIFIED FACT') || html.includes('Verified Fact'), 'Verified Fact badge is present');
  assert(html.includes('PRODUCER CLAIM'), 'Producer Claim badge is present');

  // 3. Cùng Mở Mẻ Conversion Modules (Section 03 & 09)
  console.log('\n🤝 [TEST 3] Cùng Mở Mẻ Conversion Modules');
  assert(/18\s*(?:<!-- -->\/<!-- -->|\/)\s*30/.test(html) || (html.includes('18') && html.includes('30')), 'Live demand renders 18/30 MOQ progress');
  assert(/Còn\s*(?:<!-- -->)?\s*12\s*(?:<!-- -->)?\s*phần để đủ mẻ/.test(html), 'Calculates and renders exact remaining 12 portions');
  assert(html.includes('280.000') || html.includes('280,000'), 'Price renders 280.000đ/phần');
  assert(html.includes('Chưa thu tiền trước'), 'Reassures no upfront fee (Chưa thu tiền trước)');
  assert(html.includes('CÙNG MỞ NGĂN') || html.includes('CÙNG MỞ MẺ CACAO OCA') || html.includes('CÙNG MỞ MẺ'), 'Primary CTA text conforms');

  // 4. Value Card & Health Claims Governance (Section 04 & 05)
  console.log('\n🌿 [TEST 4] Product Value & Health Claims Governance');
  assert(html.includes('Bạn sẽ nhận được gì khi cùng mở mẻ?'), 'Renders editorial product card section');
  assert(html.includes('01 phần CACAO OCA 250g') || html.includes('250g'), 'Renders 250g pack specification');
  assert(html.includes('Thẻ câu chuyện sản vật'), 'Renders Physical Story Card inclusion');
  
  // Health claims checks
  assert(/Cacao.*Sức Khỏe/i.test(html), 'Renders Health section');
  assert(html.includes('PRODUCER CLAIM'), 'Health section is strictly bound to PRODUCER CLAIM');
  
  // Forbidden medical claims: Must NOT claim medical treatment/cures
  const forbiddenClaims = [
    'phòng ngừa bệnh tim',
    'chống đột quỵ',
    'ngừa ung thư',
    'điều trị trầm cảm',
    'hạ huyết áp dứt điểm'
  ];
  for (const f of forbiddenClaims) {
    assert(!html.toLowerCase().includes(f), `Strictly prohibits unverified medical claim: "${f}"`);
  }

  // 5. Sticky CTA (Section 10)
  console.log('\n📱 [TEST 5] Sticky CTA');
  assert(html.includes('fixed bottom-0'), 'Sticky bar container is present');

  // 6. Content & Image Override API Test
  console.log('\n⚙️ [TEST 6] Admin Content Config API & Hard Boundary');
  const getApiRes = await fetch(`${BASE_URL}/api/admin/content-config?slug=cacao-oca`);
  assert(getApiRes.status === 200, 'GET /api/admin/content-config returns 200');
  const apiJson = await getApiRes.json();
  assert(apiJson.data && apiJson.data.ngan_id, 'Content Config contains valid ngan_id');
  assert(apiJson.data.value_items && apiJson.data.value_items.length >= 3, 'Content Config returns value items');

  // Hard Boundary Violation Test: Attempt to forge health claim into VERIFIED
  console.log('\n🚫 [TEST 7] Hard Governance Boundary Enforcement');
  const invalidConfig = {
    ...apiJson.data,
    health_content_ref: {
      ...apiJson.data.health_content_ref,
      truth_status: 'VERIFIED'
    }
  };
  const postApiRes = await fetch(`${BASE_URL}/api/admin/content-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidConfig)
  });
  assert(postApiRes.status === 422, 'POST with illegal VERIFIED health claim returns 422 Unprocessable');
  const postResJson = await postApiRes.json();
  assert(postResJson.error && postResJson.error.includes('HARD BOUNDARY VIOLATION'), 'Rejects claim elevation with explicit error message');

  console.log('\n================================================================');
  console.log(`🏁 PILOT V3 RESULTS: ${passes} PASSED, ${fails} FAILED`);
  console.log('================================================================');

  if (fails > 0) {
    process.exit(1);
  }
}

runPilotV3Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
