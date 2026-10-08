const BASE_URL = process.env.GATEWAY_URL || 'https://brandtalk-gateway.vercel.app';

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✅ PASS: ${message}`);
}

async function run() {
  console.log('================================================================');
  console.log('🌐 BRANDTALK GATEWAY SMOKE TEST');
  console.log(`📡 Target Gateway: ${BASE_URL}`);
  console.log('================================================================\n');

  // 1. Root Gateway
  console.log('1. Root Landing Page:');
  const resRoot = await fetch(`${BASE_URL}/`);
  assert(resRoot.status === 200, 'Root / returns 200 OK');
  const htmlRoot = await resRoot.text();
  assert(htmlRoot.includes('BrandTalk Asia'), 'Root contains BrandTalk Asia title');

  // 2. GMR Root Rewrite
  console.log('\n2. GMR Home Rewrite (/gacmangre):');
  const resGmr = await fetch(`${BASE_URL}/gacmangre`);
  assert(resGmr.status === 200, '/gacmangre returns 200 OK');
  const htmlGmr = await resGmr.text();
  assert(htmlGmr.includes('GẠC MĂNG RÊ') || htmlGmr.includes('Cất vị quê nhà'), 'GMR Home content rendered');

  // 3. Ngăn Detail Rewrite
  console.log('\n3. Ngăn Detail Rewrite (/gacmangre/ngan/cacao-oca):');
  const resNgan = await fetch(`${BASE_URL}/gacmangre/ngan/cacao-oca`);
  assert(resNgan.status === 200, '/gacmangre/ngan/cacao-oca returns 200 OK');
  const htmlNgan = await resNgan.text();
  assert(htmlNgan.includes('Cacao') || htmlNgan.includes('OCA'), 'OCA Cacao content rendered');

  // 4. Admin Rewrite
  console.log('\n4. Admin Suite Rewrite (/gacmangre/admin):');
  const resAdmin = await fetch(`${BASE_URL}/gacmangre/admin`);
  assert(resAdmin.status === 200, '/gacmangre/admin returns 200 OK');
  const htmlAdmin = await resAdmin.text();
  assert(htmlAdmin.includes('Quản Trị') || htmlAdmin.includes('Control Tower') || htmlAdmin.includes('Admin'), 'Admin content rendered');

  // 5. Review Room Rewrite
  console.log('\n5. Review Room Rewrite (/gacmangre/admin/growth/producer/oca):');
  const resReview = await fetch(`${BASE_URL}/gacmangre/admin/growth/producer/oca`);
  assert(resReview.status === 200, '/gacmangre/admin/growth/producer/oca returns 200 OK');

  // 6. API Route Rewrite
  console.log('\n6. API Route Rewrite (/gacmangre/api/admin/audit?mode=health):');
  const resApi = await fetch(`${BASE_URL}/gacmangre/api/admin/audit?mode=health`);
  assert(resApi.status === 200, 'API audit returns 200 OK');
  const jsonApi = await resApi.json();
  assert(jsonApi.success === true, 'API audit returns success: true');

  // 7. Static Assets
  console.log('\n7. Next.js Static Asset Rewrite:');
  const cssMatch = htmlGmr.match(/\/_next\/static\/css\/[a-zA-Z0-9_-]+\.css/);
  const jsMatch = htmlGmr.match(/\/_next\/static\/chunks\/[a-zA-Z0-9_-]+\.js/);
  if (cssMatch) {
    const resCss = await fetch(`${BASE_URL}${cssMatch[0]}`);
    assert(resCss.status === 200, `CSS bundle (${cssMatch[0]}) returns 200 OK`);
  }
  if (jsMatch) {
    const resJs = await fetch(`${BASE_URL}${jsMatch[0]}`);
    assert(resJs.status === 200, `JS chunk (${jsMatch[0]}) returns 200 OK`);
  }

  console.log('\n================================================================');
  console.log('🏁 ALL GATEWAY REWRITE SMOKE TESTS PASSED 100%');
  console.log('================================================================');
}

run().catch((err) => {
  console.error('Smoke test error:', err);
  process.exit(1);
});
