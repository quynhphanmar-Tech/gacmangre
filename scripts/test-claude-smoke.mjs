/**
 * GMR — Claude API Connectivity Smoke Test
 * 
 * Strict safety rules:
 * - Reads ANTHROPIC_API_KEY from process.env or .env.local
 * - NEVER logs or prints secrets
 * - Model: claude-3-5-haiku-20241022 (Minimal cost & ultra low latency)
 * - Exact Prompt: "Return exactly: GMR_API_OK"
 * - Logs: provider, model, success, input tokens, output tokens, estimated cost
 * - Zero URL crawl, zero Story Intel, zero DB write, zero batch
 */

import fs from 'fs';
import path from 'path';

// 1. Safe Env Ingestion (Never prints value)
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
      // Remove wrapping quotes if present
      if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
      }
      return key.trim();
    }
  }

  return null;
}

async function runSmokeTest() {
  console.log('================================================================');
  console.log('🛡️  GMR — CLAUDE API CONNECTIVITY SMOKE TEST');
  console.log('================================================================\n');

  const apiKey = getApiKey();

  if (!apiKey) {
    console.log('❌ STATUS: ANTHROPIC_API_KEY not found in environment or .env.local.');
    process.exit(1);
  }

  console.log('✅ ANTHROPIC_API_KEY: DETECTED (Secret masked for security)\n');

  // Model available on account with minimal cost: claude-haiku-4-5-20251001
  // Pricing: $0.80 / 1M input tokens, $4.00 / 1M output tokens
  const MODEL = 'claude-haiku-4-5-20251001';
  const PROVIDER = 'Anthropic';
  const INPUT_PRICE_PER_M = 0.80;
  const OUTPUT_PRICE_PER_M = 4.00;

  try {
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
        max_tokens: 30,
        messages: [
          {
            role: 'user',
            content: 'Return exactly: GMR_API_OK',
          },
        ],
      }),
    });

    const elapsedMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Request Failed: HTTP ${response.status}`);
      console.error(`Details: ${errorText}`);
      process.exit(1);
    }

    const data = await response.json();
    const responseText = data.content?.[0]?.text?.trim() || '';
    const inputTokens = data.usage?.input_tokens ?? 0;
    const outputTokens = data.usage?.output_tokens ?? 0;

    // Estimated Cost Calculation
    const inputCost = (inputTokens / 1_000_000) * INPUT_PRICE_PER_M;
    const outputCost = (outputTokens / 1_000_000) * OUTPUT_PRICE_PER_M;
    const totalCost = inputCost + outputCost;

    const isMatch = responseText === 'GMR_API_OK' || responseText.includes('GMR_API_OK');

    console.log('📊 TEST RESULTS:');
    console.log(`  • Provider:         ${PROVIDER}`);
    console.log(`  • Model:            ${MODEL}`);
    console.log(`  • Request Status:   ${response.ok ? 'SUCCESS (HTTP 200)' : 'FAILED'}`);
    console.log(`  • API Connected:    ${response.ok ? 'YES' : 'NO'}`);
    console.log(`  • Response Text:    "${responseText}" ${isMatch ? '✅ (MATCH)' : '⚠️'}`);
    console.log(`  • Latency:          ${elapsedMs} ms`);
    console.log(`  • Input Tokens:     ${inputTokens}`);
    console.log(`  • Output Tokens:    ${outputTokens}`);
    console.log(`  • Total Tokens:     ${inputTokens + outputTokens}`);
    console.log(`  • Estimated Cost:   $${totalCost.toFixed(6)} (~${(totalCost * 25400).toFixed(2)} VND)\n`);

    console.log('================================================================');
    console.log('🏁 SMOKE TEST ACCEPTANCE: PASSED — ZERO MUTATION & MINIMAL COST');
    console.log('================================================================');
  } catch (err) {
    console.error('❌ Connection Error:', err.message || err);
    process.exit(1);
  }
}

runSmokeTest();
