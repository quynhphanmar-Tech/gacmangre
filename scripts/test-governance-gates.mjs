// ==============================================================================
// GẠC MĂNG RÊ — M4 EXPERIENCE GOVERNANCE 9-GATES VERIFICATION SUITE
// Tests all 9 Gates: BG, TG, SG, NG, AG, CG, UX, CT, TR
// Target: 9/9 PASS. Zero feeling-based reviews.
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

async function runGovernanceTest() {
  console.log('========================================================');
  console.log('🛡️ RUNNING M4 EXPERIENCE GOVERNANCE 9 GATES TEST SUITE');
  console.log(`📡 Target Base URL: ${BASE_URL}`);
  console.log('========================================================\n');

  // Fetch governance evaluation
  const res = await fetch(`${BASE_URL}/api/admin/governance`);
  const data = await res.json();

  assert(data.success === true, 'Governance API responded successfully');
  const scorecard = data.scorecard;
  assert(scorecard.overall_status === 'APPROVED', `Overall status is APPROVED (Result: ${scorecard.overall_status})`);

  console.log('\n--- 1. BG — Brand Gate ---');
  const bg = scorecard.gates.BG;
  assert(bg.status === 'PASS', 'Brand Gate PASS (100% critical rules pass)');
  assert(bg.passed_rules === 6 && bg.total_rules === 6, 'BG has 6/6 rules verified');

  console.log('\n--- 2. TG — Truth Gate ---');
  const tg = scorecard.gates.TG;
  assert(tg.status === 'PASS', 'Truth Gate PASS (Zero missing evidence)');
  assert(tg.passed_rules === tg.total_rules, `TG passed all ${tg.total_rules} claims`);

  console.log('\n--- 3. SG — Story Gate (Minimum Ready Rule) ---');
  const sg = scorecard.gates.SG;
  assert(sg.status === 'PASS', 'Story Gate PASS (Satisfies Story Object Minimum Ready Rule)');
  const sgRule01 = sg.rules.find((r) => r.rule_id === 'SG-001');
  assert(sgRule01 && sgRule01.name.includes('Minimum Ready Rule'), 'SG-001 uses Story Object Minimum Ready Rule');

  console.log('\n--- 4. NG — Ngăn State Gate ---');
  const ng = scorecard.gates.NG;
  assert(ng.status === 'PASS', 'Ngăn State Gate PASS (CTA is State-derived UI)');

  console.log('\n--- 5. AG — Asset Gate (Type-Specific Provenance) ---');
  const ag = scorecard.gates.AG;
  assert(ag.status === 'PASS', 'Asset Gate PASS (Differentiates DOCUMENTARY, SOURCE, EDITORIAL, AI)');
  assert(ag.name.includes('Type-Specific Provenance'), 'AG name reflects type-specific provenance');

  console.log('\n--- 6. CG — Commerce Gate (Producer Truth vs GMR Commerce Rule) ---');
  const cg = scorecard.gates.CG;
  assert(cg.status === 'PASS', 'Commerce Gate PASS');
  const cgRule01 = cg.rules.find((r) => r.rule_id === 'CG-001');
  const cgRule02 = cg.rules.find((r) => r.rule_id === 'CG-002');
  assert(cgRule01 && cgRule01.name.includes('Producer Retail Truth'), 'CG separates Producer Retail Truth');
  assert(cgRule02 && cgRule02.name.includes('GMR Commerce'), 'CG separates GMR Commerce Rule');

  console.log('\n--- 7. UX — UX Gate ---');
  const ux = scorecard.gates.UX;
  assert(ux.status === 'PASS', `UX Gate PASS with score ${ux.score}/100 (Threshold >= 85)`);
  assert(scorecard.ux_breakdown.p0_count === 0, 'P0 issues count is 0');
  assert(scorecard.ux_breakdown.p1_count === 0, 'P1 issues count is 0');

  console.log('\n--- 8. CT — Content Linter ---');
  const ct = scorecard.gates.CT;
  assert(ct.status === 'PASS', 'Content Linter PASS (Zero forbidden superlatives / unsupported claims)');

  console.log('\n--- 9. TR — Traceability Gate (Evidence-Bearing Content) ---');
  const tr = scorecard.gates.TR;
  assert(tr.status === 'PASS', 'Traceability Gate PASS (100% evidence-bearing content traceable)');
  assert(scorecard.traceability_chain.is_fully_traceable === true, 'Traceability chain is unbroken');

  console.log('\n--- Regression Suite Check ---');
  assert(scorecard.regressions_passed === scorecard.regressions_checked, `All ${scorecard.regressions_checked} regression rules PASS`);

  console.log('\n========================================================');
  console.log('🏁 9 GATES GOVERNANCE SUITE COMPLETE: 9/9 PASS, 0 P0/P1');
  console.log('========================================================');
}

runGovernanceTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
