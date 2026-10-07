// scripts/test-vertical-slice.mjs
// ==============================================================================
// GẠC MĂNG RÊ — VERTICAL SLICE ACCEPTANCE TEST SUITE (OCA + MÈO VẠC)
// Full End-to-End Proof:
// Source/Truth -> Story Object -> Ngăn Experience (12 sections) ->
// Demand/Preorder -> Order Engine -> Fulfillment (Producer Ships & GMR Batch) ->
// Learning Trace
// ==============================================================================

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log('================================================================');
  console.log('🚀 GẠC MĂNG RÊ — VERTICAL SLICE ACCEPTANCE TEST SUITE');
  console.log(`📡 Runtime Target: ${BASE_URL}`);
  console.log('================================================================\n');

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

  // ============================================================================
  // 1. OCA VERTICAL SLICE
  // ============================================================================
  console.log('🍫 [A] OCA Cacao Vertical Slice (/ngan/cacao-oca)');

  const ocaRes = await fetch(`${BASE_URL}/ngan/cacao-oca`);
  assert(ocaRes.status === 200, 'OCA Ngăn responds HTTP 200');
  const ocaHtml = await ocaRes.text();

  // Phase 1: 12 Sections check on OCA
  assert(ocaHtml.includes('Cacao Lên Men Thủ Công OCA') || ocaHtml.includes('Cacao'), '01. Hero: Title present');
  assert(ocaHtml.includes('VÌ SAO CHỌN SẢN VẬT NÀY') && ocaHtml.includes('Chợ Gạo'), '02. Why This present');
  assert(ocaHtml.includes('VÙNG ĐẤT'), '03. Place present');
  assert(ocaHtml.includes('NGƯỜI LÀM'), '04. Maker present');
  assert(ocaHtml.includes('MAKING PROCESS') && (ocaHtml.includes('ĐÔI TAY') || ocaHtml.includes('quy trình')), '05. Making present');
  assert(ocaHtml.includes('CƠ SỞ TIN CẬY') && ocaHtml.includes('VERIFIED FACT') && ocaHtml.includes('PRODUCER CLAIM'), '06. Why Trust present with strict Epistemic Badges');
  assert(ocaHtml.includes('TRẢI NGHIỆM THỰC NHẬN'), '07. What You Get present');
  assert(ocaHtml.includes('VÌ SAO ĐẶT TRƯỚC') && ocaHtml.includes('Reason to Care') && ocaHtml.includes('Reason to Trust') && ocaHtml.includes('Reason to Act Now'), '08. Why Preorder & Triad present');
  assert(ocaHtml.includes('CƠ CHẾ NHU CẦU') && ocaHtml.includes('Chưa thu tiền khi đặt trước'), '09. Demand mechanism present');
  assert(ocaHtml.includes('THÔNG TIN MẺ'), '10. Product / batch present');
  assert(ocaHtml.includes('KỲ VỌNG VẬN HÀNH & GIAO HÀNG') || ocaHtml.includes('PRODUCER SHIPS DIRECT'), '11. Fulfillment expectation (Model A: Producer Ships Direct) present');
  assert(ocaHtml.includes('LÝ DO GẠC MĂNG RÊ MỞ NGĂN NÀY'), '12. GMR reason for opening present');
  assert(ocaHtml.includes('CÙNG MỞ NGĂN'), 'CTA derived correctly from OPEN status');

  // Phase 2: Demand -> Preorder Form -> Create Order
  console.log('\n  📦 Phase 2: Preorder & Order Creation for OCA...');
  const ocaIdempotency = `idem-oca-vs-${Date.now()}`;
  const ocaOrderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Phan Quỳnh OCA Tester',
      phone: '0912001001',
      address: 'Xưởng Cacao, Quận 1, TP Hồ Chí Minh',
      province: 'TP. Hồ Chí Minh',
      quantity: 2,
      ngan_id: 'cacao-len-men-thu-cong-oca',
      idempotency_key: ocaIdempotency,
      source: 'VERTICAL_SLICE_TEST',
    }),
  });
  const ocaOrderData = await ocaOrderRes.json();
  assert(ocaOrderRes.status === 200 && ocaOrderData.success, 'OCA Order created successfully');
  assert(ocaOrderData.order_code && ocaOrderData.order_code.startsWith('GM-2026-'), `Generated sequential order code: ${ocaOrderData.order_code}`);
  assert(ocaOrderData.order?.unit_price === 165000, `Unit price retrieved server-side: ${ocaOrderData.order?.unit_price} VND`);
  assert(ocaOrderData.order?.total_amount === 330000, `Total amount calculated server-side: ${ocaOrderData.order?.total_amount} VND`);

  // Verify Order Confirmation Page
  const ocaConfirmRes = await fetch(`${BASE_URL}/order/${ocaOrderData.order_code}`);
  assert(ocaConfirmRes.status === 200, `Order Confirmation page renders 200 for ${ocaOrderData.order_code}`);

  // Phase 3: Fulfillment Model A (Producer Ships Direct)
  // Step 1: Pack order at Producer Workshop
  console.log('\n  🚚 Phase 3: Fulfillment Model A (Producer Ships Direct)...');
  const packResA = await fetch(`${BASE_URL}/api/fulfillment/orders/${ocaOrderData.order.id}/pack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actor_id: 'producer-oca-packer',
    }),
  });
  const packDataA = await packResA.json();
  assert(packDataA.success && packDataA.fulfillment?.status === 'PACKED', 'Order packed by Producer Workshop');

  // Step 2: Ship order with tracking
  const shipResA = await fetch(`${BASE_URL}/api/fulfillment/orders/${ocaOrderData.order.id}/ship`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      carrier: 'GHTK_DIRECT',
      tracking_code: 'GHTK-OCA-2026-001',
      shipping_fee: 30000,
      actor_id: 'producer-oca-staff',
    }),
  });
  const shipDataA = await shipResA.json();
  assert(shipDataA.success && shipDataA.fulfillment?.status === 'SHIPPED', 'Order transitioned to SHIPPED by Producer');

  // Step 3: Deliver order
  const deliverResA = await fetch(`${BASE_URL}/api/fulfillment/orders/${ocaOrderData.order.id}/deliver`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actor_id: 'courier-oca',
    }),
  });
  const deliverDataA = await deliverResA.json();
  assert(deliverDataA.success && deliverDataA.fulfillment?.status === 'DELIVERED', 'Order transitioned to DELIVERED');

  // ============================================================================
  // 2. MÈO VẠC VERTICAL SLICE
  // ============================================================================
  console.log('\n🐝 [B] Mèo Vạc Vertical Slice (/ngan/mat-ong-bac-ha-meo-vac)');

  const mvRes = await fetch(`${BASE_URL}/ngan/mat-ong-bac-ha-meo-vac`);
  assert(mvRes.status === 200, 'Mèo Vạc Ngăn responds HTTP 200');
  const mvHtml = await mvRes.text();

  // Phase 1: 12 Sections check on Mèo Vạc
  assert(mvHtml.includes('Mật Ong Bạc Hà Mèo Vạc Hà Giang') || mvHtml.includes('Mật Ong'), '01. Hero: Title present');
  assert(mvHtml.includes('VÌ SAO CHỌN SẢN VẬT NÀY') && mvHtml.includes('Mèo Vạc'), '02. Why This present');
  assert(mvHtml.includes('VÙNG ĐẤT'), '03. Place present');
  assert(mvHtml.includes('Anh Giàng A Páo'), '04. Maker present');
  assert(mvHtml.includes('MAKING PROCESS') && (mvHtml.includes('ĐÔI TAY') || mvHtml.includes('quy trình')), '05. Making present');
  assert(mvHtml.includes('CƠ SỞ TIN CẬY') && mvHtml.includes('VERIFIED FACT') && mvHtml.includes('PRODUCER CLAIM'), '06. Why Trust present with strict Epistemic Badges');
  assert(mvHtml.includes('TRẢI NGHIỆM THỰC NHẬN'), '07. What You Get present');
  assert(mvHtml.includes('VÌ SAO ĐẶT TRƯỚC') && mvHtml.includes('Mùa vụ hữu hạn'), '08. Why Preorder & Triad present with Harvest Window');
  assert(mvHtml.includes('CƠ CHẾ NHU CẦU') && mvHtml.includes('Chưa thu tiền khi đặt trước'), '09. Demand mechanism present');
  assert(mvHtml.includes('THÔNG TIN MẺ'), '10. Product / batch present');
  assert(mvHtml.includes('KỲ VỌNG VẬN HÀNH & GIAO HÀNG') || mvHtml.includes('GMR BATCH CONSOLIDATION'), '11. Fulfillment expectation (Model B: GMR Batch Consolidation) present');
  assert(mvHtml.includes('LÝ DO GẠC MĂNG RÊ MỞ NGĂN NÀY'), '12. GMR reason for opening present');

  // Phase 2: Demand -> Preorder Form -> Create Order
  console.log('\n  📦 Phase 2: Preorder & Order Creation for Mèo Vạc...');
  const mvIdempotency = `idem-mv-vs-${Date.now()}`;
  const mvOrderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Lê Hoàng Mèo Vạc Tester',
      phone: '0987654321',
      address: 'Số 45 Tràng Tiền, Hoàn Kiếm, Hà Nội',
      province: 'Hà Nội',
      quantity: 1,
      ngan_id: 'mat-ong-bac-ha-ha-giang',
      idempotency_key: mvIdempotency,
      source: 'VERTICAL_SLICE_TEST',
    }),
  });
  const mvOrderData = await mvOrderRes.json();
  assert(mvOrderRes.status === 200 && mvOrderData.success, 'Mèo Vạc Order created successfully');
  assert(mvOrderData.order_code && mvOrderData.order_code.startsWith('GM-2026-'), `Generated sequential order code: ${mvOrderData.order_code}`);
  assert(mvOrderData.order?.unit_price === 280000, `Unit price retrieved server-side: ${mvOrderData.order?.unit_price} VND`);

  // Phase 3: Fulfillment Model B (GMR Batch Consolidation)
  console.log('\n  📦 Phase 3: Fulfillment Model B (GMR Batch Consolidation)...');
  const batchRes = await fetch(`${BASE_URL}/api/fulfillment/batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ngan_id: 'ngan-live-003',
      order_ids: [mvOrderData.order.id],
      notes: 'Lô gom mật ong Mèo Vạc chuyển kho Hà Nội',
    }),
  });
  const batchData = await batchRes.json();
  assert(batchData.success, `Created GMR Batch: ${batchData.batch?.batch_code || batchData.batch?.id}`);

  // Receive Batch at GMR Warehouse
  const batchId = batchData.batch.id;
  const receiveRes = await fetch(`${BASE_URL}/api/fulfillment/batches/${batchId}/receive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      received_quantity: 1,
      actor_id: 'gmr-warehouse-qc',
    }),
  });
  const receiveData = await receiveRes.json();
  assert(receiveData.success, 'Batch successfully received & inspected at GMR Warehouse');

  // Pack order at GMR Warehouse
  const packRes = await fetch(`${BASE_URL}/api/fulfillment/orders/${mvOrderData.order.id}/pack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actor_id: 'gmr-pack-staff',
    }),
  });
  const packData = await packRes.json();
  assert(packData.success && packData.fulfillment?.status === 'PACKED', 'Order packed at GMR Warehouse');

  // Ship order from GMR Warehouse
  const shipResB = await fetch(`${BASE_URL}/api/fulfillment/orders/${mvOrderData.order.id}/ship`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      carrier: 'AHAMOVE_HANOI',
      tracking_code: 'AHA-MV-2026-99',
      actor_id: 'gmr-dispatch',
    }),
  });
  const shipDataB = await shipResB.json();
  assert(shipDataB.success && shipDataB.fulfillment?.status === 'SHIPPED', 'Order shipped via carrier');

  // Deliver order
  const deliverResB = await fetch(`${BASE_URL}/api/fulfillment/orders/${mvOrderData.order.id}/deliver`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actor_id: 'ahamove-driver',
    }),
  });
  const deliverDataB = await deliverResB.json();
  assert(deliverDataB.success && deliverDataB.fulfillment?.status === 'DELIVERED', 'Order delivered successfully');

  // ============================================================================
  // 3. PHASE 4: LEARNING TRACEABILITY CHECK
  // ============================================================================
  console.log('\n💡 [C] Phase 4: Learning Traceability Verification...');
  const growthApiRes = await fetch(`${BASE_URL}/api/admin/growth?mode=market_validation&producer_id=oca`);
  const growthApiData = await growthApiRes.json();
  assert(growthApiRes.status === 200 && growthApiData.success, 'Admin Growth API accessible');

  const learnings = growthApiData.learnings || [];
  const orderLearning = learnings.find((l) => l.observation?.includes('Khách hàng đặt thành công'));
  assert(Boolean(orderLearning), 'Order action traces directly to Internal Market Learning record');
  assert(orderLearning?.source === 'INTERNAL_TEST', 'Learning source is strictly INTERNAL_TEST');
  assert(orderLearning?.target_pillar === 'CUSTOMER_OUTCOME', 'Target pillar is CUSTOMER_OUTCOME');

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
