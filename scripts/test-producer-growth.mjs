// ==============================================================================
// GẠC MĂNG RÊ — MULTI-PRODUCER GROWTH SUITE TEST
// Verifies:
// 1. Golden Test #001: OCA Cacao (High Coverage, Full Pipeline, Top 1 Opportunity)
// 2. Generic Test #002: Producer thứ 2 (Hà Giang Mèo Vạc - No hardcoded logic)
// 3. Insufficient Coverage Guard: Refuses diagnosis when critical surfaces are missing
// 4. Hard Isolation Enforcement: Blocks mutation of Brand Truth / Foundation
// 5. Epistemic Rigor: Classification is HYPOTHESIS, max 3 opportunities
// ==============================================================================

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`  ✅ PASS: ${message}`);
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING PRODUCER GROWTH SKILL v0.1 COMPREHENSIVE TEST SUITE');
  console.log(`📡 Target API: ${BASE_URL}`);
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: GOLDEN TEST #001 — OCA CACAO PIPELINE
  // --------------------------------------------------------------------------
  console.log('🍫 TEST 1: Golden Dataset OCA Cacao (End-to-End Pipeline via API)');

  const ocaInput = {
    producer_id: 'PRD-OCA-001',
    source_id: 'SRC-OCA-OFFICIAL',
    official_url: 'https://ocacacao.com',
    discovered_urls: [
      { url: 'https://ocacacao.com/', category: 'IDENTITY', status: 'SCANNED' },
      { url: 'https://ocacacao.com/story/', category: 'STORY', status: 'SCANNED' },
      { url: 'https://ocacacao.com/meet-our-farmers/', category: 'PEOPLE', status: 'SCANNED' },
      { url: 'https://ocacacao.com/quy-trinh-san-xuat/', category: 'PROCESS', status: 'SCANNED' },
      { url: 'https://ocacacao.com/hop-tac-cung-oca/', category: 'PARTNER_B2B', status: 'SCANNED' },
      { url: 'https://ocacacao.com/contact-form/', category: 'IDENTITY', status: 'SCANNED' },
      { url: 'https://ocacacao.com/p/00001/', category: 'PRODUCT', status: 'SCANNED' },
      { url: 'https://ocacacao.com/p/06001/', category: 'PRODUCT', status: 'SCANNED' },
      { url: 'https://ocacacao.com/p/07001/', category: 'PRODUCT', status: 'SCANNED' },
      { url: 'https://ocacacao.com/p/cacao-mass/', category: 'COMMERCIAL', status: 'SCANNED' },
      { url: 'https://ocacacao.com/ca-phe-ca-cao/', category: 'STORY', status: 'SCANNED' },
      { url: 'https://ocacacao.com/blog/news/', category: 'SOCIAL', status: 'SCANNED' },
      { url: 'https://ocacacao.com/post-sitemap.xml', category: 'MEDIA', status: 'EXTRACTED' },
    ],
    mined_claims: [
      {
        claim: 'Công ty TNHH OCA Việt Nhật thành lập năm 2019, xưởng tại Châu Đức Bà Rịa Vũng Tàu; ĐKKD 3502512543.',
        source_url: 'https://ocacacao.com/story/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'GOVERNMENT_REGISTRATION_FOOTER',
        confidence: 1.0,
      },
      {
        claim: 'Quy trình Tree-to-Bar: Ủ thùng gỗ mít 6-7 ngày, không kiềm hóa, giữ 100% bơ cacao nguyên chất.',
        source_url: 'https://ocacacao.com/quy-trinh-san-xuat/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'TECHNICAL_PROCESS_DISCLOSURE',
        confidence: 0.95,
      },
      {
        claim: 'Đạt 4 chứng nhận hữu cơ quốc tế: JAS, USDA, COR, EU.',
        source_url: 'https://ocacacao.com/story/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'PRODUCER_CLAIM',
        evidence_type: 'ON_SITE_LOGO_CLAIM',
        confidence: 0.85,
      },
      {
        claim: 'Rượu cacao có thể ngăn ngừa ung thư và chữa bách bệnh.',
        source_url: 'https://ocacacao.com/p/ruou-cacao/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'PRODUCER_CLAIM', // Demoted by miner!
        evidence_type: 'UNSUPPORTED_HEALTH_CLAIM',
        confidence: 0.2,
      },
    ],
    external_intelligence: {
      identity: {
        name: 'Công ty TNHH OCA Việt Nhật',
        location: 'Châu Đức, Bà Rịa - Vũng Tàu',
        established: 2019,
      },
      product: {
        products: ['Socola 62%', 'Bột Cacao Mộc 250g', 'Cacao Nibs 100g', 'Cacao Mass 1kg'],
        categories: ['Socola thủ công', 'Bột dinh dưỡng'],
        price_points: [
          { product: 'Socola 62%', price: 48000, unit: 'Thanh' },
          { product: 'Bột Cacao Mộc', price: 180000, unit: 'Túi 250g' },
          { product: 'Cacao Mass 1kg', price: 985000, unit: 'Túi 1kg' },
        ],
      },
      place: {
        geography: 'Bà Rịa - Vũng Tàu',
        local_context: 'Đất đỏ bazan huyện Châu Đức',
      },
      people: {
        founders: ['Nguyễn Thị Thu (CEO)'],
        makers: ['Ông Nozawa Hiroki (Chủ tịch C-Point Japan)'],
        farmers: ['Nông hộ trồng cacao xã Bình Giã'],
      },
      craft: {
        process: 'Ủ thùng gỗ 6-7 ngày, đảo thủ công mỗi 24 giờ',
        distinctive_practice: 'Không kiềm hóa, giữ trọn bơ cacao tự nhiên',
      },
      proof: {
        certifications: ['JAS (Nhật)', 'USDA (Mỹ)', 'COR (Canada)', 'EU (Châu Âu)'],
        export: ['Hà Lan', 'Hungary', 'Pháp', 'Đức', 'Nhật Bản'],
      },
    },
  };

  const ocaRes = await fetch(`${BASE_URL}/api/admin/growth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'RUN_ANALYSIS', input: ocaInput }),
  });
  const ocaData = await ocaRes.json();
  assert(ocaData.success === true, 'OCA analysis API responded successfully');
  const ocaResult = ocaData.output;

  assert(ocaResult.can_diagnose === true, 'OCA analysis succeeded with valid coverage');
  assert(ocaResult.source_coverage.coverage_status === 'HIGH', 'OCA coverage evaluated as HIGH');
  assert(ocaResult.evidence_map.length === 4, 'Mined 4 evidence claims');

  // Verify health claim demotion to MISSING_EVIDENCE
  const cancerClaim = ocaResult.evidence_map.find((e) => e.claim.includes('ung thư'));
  assert(cancerClaim?.truth_status === 'MISSING_EVIDENCE', 'Medical claim strictly demoted to MISSING_EVIDENCE');

  // Verify Epistemic classification
  assert(ocaResult.primary_growth_hypothesis?.classification === 'HYPOTHESIS', 'Primary hypothesis strictly classified as HYPOTHESIS');
  assert(ocaResult.opportunities?.length === 3, 'Opportunities strictly capped at 3');
  assert(Boolean(ocaResult.intervention?.cta), 'Intervention specifies concrete CTA');
  assert(Boolean(ocaResult.content_request?.target_behavior), 'Content request specifies target behavior');

  console.log('  🟢 Golden Test OCA Cacao: 100% PASS\n');

  // --------------------------------------------------------------------------
  // TEST 2: GENERIC PRODUCER #002 — MẬT ONG HOA BẠC HÀ MÈO VẠC
  // --------------------------------------------------------------------------
  console.log('🐝 TEST 2: Generic Producer #002 (HTX Mèo Vạc Hà Giang — No Hardcoded Conditions)');

  const haGiangInput = {
    producer_id: 'PRD-MEOVAC-002',
    source_id: 'SRC-HAGIANG-COOP',
    official_url: 'https://matongmeovac.vn',
    discovered_urls: [
      { url: 'https://matongmeovac.vn/', category: 'IDENTITY', status: 'SCANNED' },
      { url: 'https://matongmeovac.vn/nguon-goc-cao-nguyen-da/', category: 'ORIGIN', status: 'SCANNED' },
      { url: 'https://matongmeovac.vn/nghe-nuoi-ong-bac-ha/', category: 'PROCESS', status: 'SCANNED' },
      { url: 'https://matongmeovac.vn/doi-ngu-xa-vien/', category: 'PEOPLE', status: 'SCANNED' },
      { url: 'https://matongmeovac.vn/san-pham/mat-ong-bac-ha-500ml/', category: 'PRODUCT', status: 'SCANNED' },
      { url: 'https://matongmeovac.vn/san-pham/phan-hoa-tam-giac-mach/', category: 'PRODUCT', status: 'SCANNED' },
      { url: 'https://matongmeovac.vn/chung-nhan-chi-dan-dia-ly/', category: 'CERTIFICATION', status: 'SCANNED' },
      { url: 'https://matongmeovac.vn/lien-he-hop-tac/', category: 'COMMERCIAL', status: 'SCANNED' },
    ],
    mined_claims: [
      {
        claim: 'Hợp tác xã Nông nghiệp Mèo Vạc thành lập năm 2018 tại Thị trấn Mèo Vạc, Tỉnh Hà Giang.',
        source_url: 'https://matongmeovac.vn/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'COOPERATIVE_REGISTRATION',
        confidence: 1.0,
      },
      {
        claim: 'Đạt Chứng nhận Chỉ dẫn Địa lý Mật ong bạc hà Mèo Vạc số 00035 cấp bởi Cục Sở hữu Trí tuệ.',
        source_url: 'https://matongmeovac.vn/chung-nhan-chi-dan-dia-ly/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'GEOGRAPHIC_INDICATION_CERT',
        confidence: 0.95,
      },
      {
        claim: 'Quay mật thủ công trên độ cao 1.200m, hoa bạc hà chỉ nở rộ 2 tháng mùa đông từ tháng 10 đến tháng 12.',
        source_url: 'https://matongmeovac.vn/nghe-nuoi-ong-bac-ha/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'HARVEST_SEASON_DISCLOSURE',
        confidence: 0.9,
      },
    ],
    external_intelligence: {
      identity: {
        name: 'HTX Ong Bạc Hà Mèo Vạc',
        location: 'Huyện Mèo Vạc, Hà Giang',
        established: 2018,
      },
      product: {
        products: ['Mật ong bạc hà chai 500ml', 'Phấn hoa tam giác mạch 250g'],
        categories: ['Mật ong rừng đặc sản'],
        price_points: [
          { product: 'Mật ong bạc hà 500ml', price: 380000, unit: 'Chai' },
        ],
      },
      place: {
        geography: 'Cao nguyên đá Đồng Văn - Mèo Vạc',
        local_context: 'Đá tai mèo, khí hậu sương muối lạnh giá',
      },
      people: {
        founders: ['Giàng A Páo (Chủ nhiệm HTX)'],
        farmers: ['25 hộ nuôi ong người Mông'],
      },
      craft: {
        process: 'Quay li tâm thủ công, lọc mật qua vải mùng không gia nhiệt',
        distinctive_practice: 'Không nấu cô đặc nhân tạo, giữ nguyên bọt khí và men sống',
      },
      proof: {
        certifications: ['Chỉ dẫn địa lý Mèo Vạc', 'OCOP 4 Sao Hà Giang'],
      },
    },
  };

  const hgRes = await fetch(`${BASE_URL}/api/admin/growth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'RUN_ANALYSIS', input: haGiangInput }),
  });
  const hgData = await hgRes.json();
  assert(hgData.success === true, 'Ha Giang API responded successfully');
  const haGiangResult = hgData.output;

  assert(haGiangResult.can_diagnose === true, 'Ha Giang producer diagnosed successfully without changing any code');
  assert(haGiangResult.producer_id === 'PRD-MEOVAC-002', 'Producer ID preserved');
  assert(haGiangResult.primary_growth_hypothesis.classification === 'HYPOTHESIS', 'Generic hypothesis generated');
  assert(haGiangResult.opportunities.length === 3, 'Generic opportunities generated');
  assert(haGiangResult.intervention.intervention.includes('HTX Ong Bạc Hà Mèo Vạc'), 'Intervention dynamically tailored to Ha Giang coop');

  console.log('  🟢 Generic Producer #002 Test: 100% PASS\n');

  // --------------------------------------------------------------------------
  // TEST 3: INSUFFICIENT COVERAGE GUARD (Must refuse diagnosis)
  // --------------------------------------------------------------------------
  console.log('🛡️ TEST 3: Insufficient Coverage Guard (Strict Epistemic Refusal)');

  const poorInput = {
    producer_id: 'PRD-UNKNOWN-003',
    source_id: 'SRC-POOR-LINK',
    official_url: 'https://random-sparse-fb.com',
    discovered_urls: [
      { url: 'https://random-sparse-fb.com/home', category: 'SOCIAL', status: 'SCANNED' },
    ],
    mined_claims: [],
  };

  const poorRes = await fetch(`${BASE_URL}/api/admin/growth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'RUN_ANALYSIS', input: poorInput }),
  });
  const poorData = await poorRes.json();
  assert(poorData.success === true, 'Sparse input request handled gracefully');
  const poorResult = poorData.output;

  assert(poorResult.can_diagnose === false, 'Refused diagnosis when source coverage is insufficient');
  assert(poorResult.source_coverage.coverage_status === 'INSUFFICIENT', 'Evaluated coverage as INSUFFICIENT');
  assert(Boolean(poorResult.rejection_reason), 'Returned explicit rejection reason');
  assert(poorResult.evidence_map.length === 0, 'No fake evidence fabricated');

  console.log('  🟢 Insufficient Coverage Guard: 100% PASS\n');

  // --------------------------------------------------------------------------
  // TEST 4: HARD FOUNDATION ISOLATION MUTATION TEST
  // --------------------------------------------------------------------------
  console.log('🔒 TEST 4: Skill Isolation Mutation Test (Blocks Illegal Foundation Mutation)');

  const mutationRes = await fetch(`${BASE_URL}/api/admin/growth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'TEST_ISOLATION_MUTATION',
      request: {
        skill_name: 'ProducerGrowthService',
        action: 'MUTATE_BRAND_TRUTH',
        target_layer: 'BRAND_TRUTH',
        attempted_mutation: 'Attempt to inject aggressive promo copy to overwrite Brand OS',
      },
    }),
  });
  const mutationData = await mutationRes.json();

  assert(mutationRes.status === 403, 'API returned HTTP 403 Forbidden for illegal Foundation mutation');
  assert(mutationData.allowed === false, 'Mutation attempt denied');
  assert(mutationData.code === 'SKILL_ISOLATION_VIOLATION', 'Violation code verified as SKILL_ISOLATION_VIOLATION');
  console.log('  🟢 Isolation Mutation Guard: 100% PASS\n');

  // --------------------------------------------------------------------------
  // TEST 5: NO ORPHAN OBJECT INVARIANT TEST
  // --------------------------------------------------------------------------
  console.log('🔗 TEST 5: No Orphan Object Invariant Test');

  const orphanValidRes = await fetch(`${BASE_URL}/api/admin/governance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'VALIDATE_ORPHAN',
      object_type: 'LEARNING',
      object: {
        producer_id: 'PRD-OCA-001',
        source_id: 'SRC-OCA-OFFICIAL',
        statement: 'Valid learning linked to producer',
      },
    }),
  });
  const orphanValidData = await orphanValidRes.json();
  assert(orphanValidData.result.canonical_valid === true, 'Linked object passes orphan validation');

  const orphanInvalidRes = await fetch(`${BASE_URL}/api/admin/governance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'VALIDATE_ORPHAN',
      object_type: 'LEARNING',
      object: {
        statement: 'Orphan object with no parent entity ID',
      },
    }),
  });
  const orphanInvalidData = await orphanInvalidRes.json();
  assert(orphanInvalidData.result.canonical_valid === false, 'Orphan object strictly rejected by Foundation Invariants');

  console.log('  🟢 No Orphan Object Invariant: 100% PASS\n');

  console.log('================================================================');
  console.log('🎉 ALL 5 PRODUCER GROWTH SUITE TESTS PASSED WITH ZERO VIOLATIONS');
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
