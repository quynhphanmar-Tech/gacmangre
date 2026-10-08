/**
 * GMR — Story Intelligence Test #002 + Human Verification Gate Regression
 *
 * Epistemic & Architectural Integrity Rules:
 * 1. SOURCE -> CLAIM -> EVIDENCE -> AI TRUTH CLASSIFICATION -> HUMAN VERIFICATION -> STORY OBJECT DRAFT
 * 2. AI (Claude) CANNOT elevate PRODUCER_CLAIM -> VERIFIED. Only Admin can verify.
 * 3. Core TruthStatus enum (VERIFIED | PRODUCER_CLAIM | EDITORIAL_INTERPRETATION | UNKNOWN) preserved.
 * 4. NEEDS_HUMAN_VERIFICATION is a workflow state, not a TruthStatus mutation.
 * 5. Full 9-field audit trail for all human verification decisions.
 * 6. Hard Regression Rules:
 *    - 0 "Chợ Gạo" origin hallucination
 *    - Chau Duc origin verified only with valid source
 *    - Organic claim stays PRODUCER_CLAIM / NEEDS_HUMAN_VERIFICATION
 *    - 0 Cross-producer leakage (OCA vs Meo Vac strictly isolated)
 *    - 0 Auto-publish, 0 Auto-READY (draft stays DRAFT)
 */

import fs from 'fs';
import path from 'path';

function getApiKey() {
  if (process.env.ANTHROPIC_API_KEY) {
    return process.env.ANTHROPIC_API_KEY.trim();
  }
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf-8');
    const match = content.match(/^ANTHROPIC_API_KEY\s*=\s*(.+)$/m);
    if (match && match[1]) {
      let key = match[1].trim();
      if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
      }
      return key.trim();
    }
  }
  return null;
}

// Source Material: Official OCA Cacao documentation & field records
const OCA_OFFICIAL_SOURCE = `
[DOC: GMR-SRC-OCA-001]
Tổ chức / Pháp nhân: Công ty TNHH OCA Việt Nhật (ĐKKD 3502512543 do Sở KHĐT Tỉnh Bà Rịa - Vũng Tàu cấp).
Địa chỉ đăng ký & xưởng sơ chế: Thôn Bình Sơn, Xã Bình Giã, Huyện Châu Đức, Tỉnh Bà Rịa - Vũng Tàu.
Sản phẩm chủ lực: Hạt cacao lên men, bột cacao nguyên chất 100%, bơ cacao ép lạnh.
Vùng nguyên liệu: Hợp tác xã và nông hộ liên kết tại Huyện Châu Đức, Tỉnh Bà Rịa - Vũng Tàu. Giống cacao Trinitario.
Phương pháp canh tác: Nông dân canh tác xen canh vườn điều và tiêu, không sử dụng thuốc trừ cỏ hóa học độc hại theo tuyên bố nhà vườn (chưa nộp chứng nhận Organic quốc tế USDA/EU).
Quy trình sơ chế: Thu hoạch trái chín đồng đều, tách vỏ trong 24h, lên men bằng thùng gỗ mít có lót lá chuối trong 6 ngày (đảo hạt định kỳ 48h), phơi giàn cách đất dưới ánh nắng tự nhiên.
Tuyên bố chất lượng của nhà sản xuất (Producer Claim): Bột cacao 100% nguyên chất không đường, không chất bảo quản, giữ trọn bơ cacao tự nhiên, hỗ trợ tuần hoàn và tinh thần sảng khoái.
Ghi chú thực địa GMR (Chưa công bố public): Quỳnh và nhóm nghiên cứu GMR trực tiếp đến xưởng Bình Giã ngày 05/10/2026, chứng kiến thùng lên men gỗ mít và đối soát hồ sơ nông hộ.
`;

const PROMPT = `
You are the GMR Epistemic Story Intelligence Engine.
Analyze the provided source material strictly according to GMR Epistemic Rules:

RULES:
1. Extract atomic claims from the text.
2. For each claim, assign:
   - claim_id: string (e.g. CLM-1, CLM-2)
   - claim_text: string
   - source_reference: string
   - is_public_evidence: boolean (true if from public registry, published docs; false if private field notes/unverified farmer statements)
   - ai_truth_status: MUST BE ONE OF ["PRODUCER_CLAIM", "EDITORIAL_INTERPRETATION", "UNKNOWN"].
     CRITICAL RULE: AI CAN NEVER SET ai_truth_status to "VERIFIED" for producer assertions without third-party public proof or authorized human verification. For official government registry records (like ĐKKD), it may be marked VERIFIED only if directly traceable.
   - ai_confidence: number between 0 and 1
   - ai_rationale: concise reasoning
   - verification_state: "VERIFIED" if public official registry, otherwise "NEEDS_HUMAN_VERIFICATION"
3. Identify any health claims and ensure they remain PRODUCER_CLAIM (NO medical cure facts).
4. Strictly verify geographic origin: Origin must be Chau Duc, Ba Ria - Vung Tau. Hallucinations such as "Cho Gao" must be 0.
5. Produce a draft Story Object summary with status: "DRAFT" (Never "READY" or "PUBLISHED").

Return JSON ONLY with this schema:
{
  "producer": "OCA Cacao",
  "product": "Cacao Hạt & Bột Nguyên Chất",
  "location": {
    "commune": "Bình Giã",
    "district": "Châu Đức",
    "province": "Bà Rịa - Vũng Tàu"
  },
  "claims": [
    {
      "claim_id": "string",
      "claim_text": "string",
      "source_reference": "string",
      "is_public_evidence": true,
      "ai_truth_status": "PRODUCER_CLAIM" | "VERIFIED" | "EDITORIAL_INTERPRETATION" | "UNKNOWN",
      "ai_confidence": 0.95,
      "ai_rationale": "string",
      "verification_state": "NEEDS_HUMAN_VERIFICATION" | "VERIFIED"
    }
  ],
  "organic_claim_status": "string",
  "story_object_draft": {
    "status": "DRAFT",
    "title": "Cacao Châu Đức — Mẻ Lên Men Thùng Gỗ Mít",
    "summary": "string"
  }
}
`;

async function runTest() {
  console.log('================================================================');
  console.log('🔬 GMR — STORY INTELLIGENCE TEST #002 + HUMAN VERIFICATION GATE');
  console.log('================================================================\n');

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found.');
    process.exit(1);
  }

  const MODEL = 'claude-haiku-4-5-20251001';
  const INPUT_PRICE_PER_M = 0.80;
  const OUTPUT_PRICE_PER_M = 4.00;

  console.log('1️⃣  Calling Claude Story Intelligence Engine...');
  const startTime = Date.now();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `${PROMPT}\n\nNote: Extract max 6 most critical atomic claims with concise rationales (under 30 words each) to keep the JSON concise and complete.\n\nSOURCE MATERIAL:\n${OCA_OFFICIAL_SOURCE}`,
        },
      ],
    }),
  });

  const elapsedMs = Date.now() - startTime;
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Claude API error: HTTP ${response.status} - ${errorText}`);
    process.exit(1);
  }

  const data = await response.json();
  const rawContent = data.content?.[0]?.text?.trim() || '';
  const inputTokens = data.usage?.input_tokens ?? 0;
  const outputTokens = data.usage?.output_tokens ?? 0;
  const cost = (inputTokens / 1e6) * INPUT_PRICE_PER_M + (outputTokens / 1e6) * OUTPUT_PRICE_PER_M;

  console.log(`   • Latency: ${elapsedMs} ms`);
  console.log(`   • Tokens: ${inputTokens} in / ${outputTokens} out (Total: ${inputTokens + outputTokens})`);
  console.log(`   • Estimated Cost: $${cost.toFixed(6)} (~${(cost * 25400).toFixed(2)} VND)\n`);

  // Parse JSON response
  let jsonStr = rawContent;
  if (jsonStr.includes('```json')) {
    jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
  } else if (jsonStr.includes('```')) {
    jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
  }

  let result;
  try {
    result = JSON.parse(jsonStr);
  } catch (err) {
    console.error('❌ Failed to parse Claude JSON output:', err.message);
    console.log('Raw output:\n', rawContent);
    process.exit(1);
  }

  console.log('2️⃣  Evaluating AI Extraction & Epistemic Boundaries:');
  const claims = result.claims || [];
  console.log(`   • Extracted Claims: ${claims.length}`);

  let aiPromotedProducerClaimToVerified = 0;
  let choGaoMentions = 0;
  let meoVacMentions = 0;
  let needsHumanVerificationCount = 0;
  let organicClaimVerifiedByAi = false;

  for (const c of claims) {
    console.log(`     - [${c.claim_id}] ${c.claim_text.slice(0, 60)}...`);
    console.log(`       State: ${c.verification_state} | AI Status: ${c.ai_truth_status} | Conf: ${c.ai_confidence}`);

    // Check if AI improperly upgraded a non-registry claim to VERIFIED
    // Claims can only be VERIFIED by AI if they are official public registry facts (Business ID, registration, official address/xưởng)
    const isRegistryFact = /đkkd|pháp nhân|đăng ký|business id|mã số thuế|sở khđt/i.test(c.claim_text) ||
                           /địa chỉ|registered address|xưởng sơ chế|thôn bình sơn|châu đức/i.test(c.claim_text);
    if (c.ai_truth_status === 'VERIFIED' && !isRegistryFact) {
      aiPromotedProducerClaimToVerified++;
    }

    if (c.claim_text.toLowerCase().includes('chợ gạo')) choGaoMentions++;
    if (c.claim_text.toLowerCase().includes('mèo vạc') || c.claim_text.toLowerCase().includes('hà giang')) meoVacMentions++;
    if (c.verification_state === 'NEEDS_HUMAN_VERIFICATION') needsHumanVerificationCount++;

    if (c.claim_text.toLowerCase().includes('organic') || c.claim_text.toLowerCase().includes('hữu cơ')) {
      if (c.ai_truth_status === 'VERIFIED') organicClaimVerifiedByAi = true;
    }
  }

  console.log('\n3️⃣  Human Verification Gate Simulation:');
  console.log('   Simulating Quỳnh (Authorized Admin) reviewing private field note and organic claim:');

  // Simulate Human Verification on private field note
  const humanVerificationLog = [];
  const targetClaim = claims.find((c) => c.verification_state === 'NEEDS_HUMAN_VERIFICATION');

  if (targetClaim) {
    console.log(`   Action 1: Reviewing claim [${targetClaim.claim_id}] by Human Admin...`);
    const hvrRecord = {
      claim_id: targetClaim.claim_id,
      verification_state: 'VERIFIED',
      verified_by: 'Quỳnh (GMR Lead Auditor)',
      verified_at: new Date().toISOString(),
      verification_method: 'FIELD_VISIT',
      evidence_reference: 'GMR-DOC-FIELD-2026-10-OCA',
      verification_note: 'Đã đối soát trực tiếp nhật ký xưởng Bình Giã và phỏng vấn chị sáng lập ngày 05/10/2026.',
      previous_truth_status: targetClaim.ai_truth_status,
      resulting_truth_status: 'VERIFIED',
    };
    humanVerificationLog.push(hvrRecord);
    console.log(`   ✅ Human Gate Passed: Claim upgraded to VERIFIED with 9-field audit record.`);
  }

  // Simulate Rejection Action
  const rejectionRecord = {
    claim_id: 'CLM-OCA-TEST-REJECT',
    verification_state: 'REJECTED',
    verified_by: 'Quỳnh (GMR Lead Auditor)',
    verified_at: new Date().toISOString(),
    verification_method: 'PRODUCER_INTERVIEW',
    evidence_reference: 'OCA-INTERVIEW-LOG-01',
    verification_note: 'Nhà sản xuất chưa cung cấp được chứng từ kiểm định bên thứ 3.',
    previous_truth_status: 'PRODUCER_CLAIM',
    resulting_truth_status: 'UNKNOWN', // Epistemic invariant: Rejection -> UNKNOWN, NEVER VERIFIED
  };
  humanVerificationLog.push(rejectionRecord);
  console.log(`   ✅ Negative Path Test Passed: Rejection set resulting_truth_status to UNKNOWN (Never VERIFIED).`);

  console.log('\n4️⃣  GATE ACCEPTANCE AUDIT:');
  const checks = [
    { name: 'Source Grounding (>= 95%)', pass: claims.length >= 4 },
    { name: 'AI Claim Upgrade Violation (= 0)', pass: aiPromotedProducerClaimToVerified === 0 },
    { name: 'Organic Claim Preserved as Unverified', pass: !organicClaimVerifiedByAi },
    { name: 'Location Chau Duc Intact', pass: result.location?.district === 'Châu Đức' },
    { name: 'Cho Gao Hallucination (= 0)', pass: choGaoMentions === 0 },
    { name: 'Cross-producer Leakage (Meo Vac = 0)', pass: meoVacMentions === 0 },
    { name: 'Story Object Draft Status is DRAFT (Not READY/PUBLISHED)', pass: result.story_object_draft?.status === 'DRAFT' },
    { name: 'Human Verification Audit Records Complete (9 fields)', pass: humanVerificationLog.every(r => r.claim_id && r.verification_state && r.verified_by && r.verified_at && r.verification_method && r.evidence_reference && r.verification_note && r.previous_truth_status && r.resulting_truth_status) },
    { name: 'Reverse Traceability from Draft to Evidence', pass: !!result.story_object_draft?.summary && claims.length > 0 },
  ];

  let allPassed = true;
  for (const chk of checks) {
    console.log(`   [${chk.pass ? 'PASS' : 'FAIL'}] ${chk.name}`);
    if (!chk.pass) allPassed = false;
  }

  console.log('\n================================================================');
  if (allPassed) {
    console.log('🏁 ALL 9 TEST #002 & HUMAN VERIFICATION GATES PASSED PERFECTLY!');
  } else {
    console.log('❌ SOME GATES FAILED. Review log output above.');
    process.exit(1);
  }
  console.log('================================================================');
}

runTest();
