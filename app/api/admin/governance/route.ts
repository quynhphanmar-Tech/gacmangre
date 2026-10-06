import { NextRequest, NextResponse } from 'next/server';
import { experienceGovernanceService } from '@/services/experience-governance-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    if (mode === 'failures') {
      const failures = experienceGovernanceService.getFailures();
      return NextResponse.json({ success: true, failures });
    }

    if (mode === 'regressions') {
      const rules = experienceGovernanceService.getRegressionRules();
      return NextResponse.json({ success: true, rules });
    }

    // Default: run audit evaluation on active default Ngăn (Ngăn #003 Hà Giang)
    const scorecard = await experienceGovernanceService.evaluate({
      target_id: 'NGAN-003-HA-GIANG',
      content_id: 'CONTENT-2026-003',
      story_id: 'STORY-003-MEO-VAC',
      ngan_id: 'NGAN-003',
      product_id: 'PRD-MAT-ONG-BAC-HA',
      producer_id: 'PRDCR-GIANG-A-PAO',
      source_id: 'SRC-MEO-VAC-FIELD-2026',
      evidence_ids: ['EVD-HAGIANG-GPS-001', 'EVD-SEASON-LOG-002', 'EVD-VIDEO-HARVEST-003'],
      brand_context: {
        brand_name: 'Gạc Măng Rê',
        brand_idea: 'Cất vị quê nhà',
        raw_copy: 'Mật ong bạc hà Mèo Vạc Hà Giang. Giữ trọn hạt phấn hoa tự nhiên, đôi bàn tay anh Giàng A Páo quay mật trên sương muối.',
        cta_text: 'MỞ NGĂN',
      },
      content_text: 'Mật ong bạc hà Mèo Vạc Hà Giang. Giữ trọn hạt phấn hoa tự nhiên, đôi bàn tay anh Giàng A Páo quay mật trên sương muối.',
      commerce_context: {
        unit_price: 280000,
        moq: 20,
        official_source_confirmed: true,
        payment_terms_clarified: true,
      },
      ux_context: {
        body_font_size_px: 16,
        touch_target_size_px: 48,
        contrast_ratio: 7.2,
        time_to_cta_seconds: 2.1,
        comprehension_seconds: 6.4,
        p0_issues: [],
        p1_issues: [],
      },
    });

    const failures = experienceGovernanceService.getFailures();
    const regressions = experienceGovernanceService.getRegressionRules();

    return NextResponse.json({
      success: true,
      scorecard,
      failures,
      regressions,
    });
  } catch (error: any) {
    console.error('Governance API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === 'REGISTER_FAILURE') {
      experienceGovernanceService.registerFailure(body.record);
      return NextResponse.json({ success: true, message: 'Failure recorded successfully' });
    }

    if (action === 'ADD_REGRESSION_RULE') {
      experienceGovernanceService.addRegressionRule(body.rule);
      return NextResponse.json({ success: true, message: 'Regression rule appended' });
    }

    // Default action: Evaluate custom input payload
    const scorecard = await experienceGovernanceService.evaluate(body.input);
    return NextResponse.json({ success: true, scorecard });
  } catch (error: any) {
    console.error('Governance Evaluation Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
