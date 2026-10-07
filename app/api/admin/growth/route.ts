import { NextRequest, NextResponse } from 'next/server';
import { producerGrowthService } from '@/services/producer-growth-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const run_id = searchParams.get('run_id');
    const producer_id = searchParams.get('producer_id');

    if (run_id) {
      const run = producerGrowthService.getRun(run_id);
      if (!run) {
        return NextResponse.json({ success: false, error: 'Run not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, run });
    }

    if (producer_id) {
      const mode = searchParams.get('mode');
      if (mode === 'feedback') {
        const feedback = producerGrowthService.getUatFeedback(producer_id);
        return NextResponse.json({ success: true, feedback });
      }
      if (mode === 'assets') {
        const assets = producerGrowthService.getWorkbenchAssets(producer_id);
        return NextResponse.json({ success: true, assets });
      }

      if (mode === 'market_validation') {
        const validationFeedback = producerGrowthService.getMarketValidationFeedback(producer_id);
        const learnings = producerGrowthService.getInternalMarketLearning(producer_id);
        return NextResponse.json({ success: true, validation_feedback: validationFeedback, learnings });
      }

      // Default: return run for this producer
      const run = producerGrowthService.getProducerRun(producer_id);
      const feedback = producerGrowthService.getUatFeedback(producer_id);
      const validationFeedback = producerGrowthService.getMarketValidationFeedback(producer_id);
      const learnings = producerGrowthService.getInternalMarketLearning(producer_id);
      if (!run) {
        return NextResponse.json({ success: false, error: `No growth run found for producer: ${producer_id}` }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        run,
        feedback,
        validation_feedback: validationFeedback,
        learnings,
      });
    }

    return NextResponse.json({
      success: true,
      service: 'ProducerGrowthService v0.1',
      status: 'READY',
      features: [
        'Source Surface Coverage Mapping',
        'Strict Truth Evidence Mining',
        'Producer Intelligence 11D',
        '8-Dimension Growth Diagnosis',
        'Value-Trust-Price Triad',
        'Primary Growth Hypothesis Engine',
        'Max 3 Opportunity Ranking',
        'Intervention Plan Generator',
        'Content Request Adapter',
        'Market Learning Scaffold',
      ],
    });
  } catch (error: any) {
    console.error('Growth API GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'RUN_ANALYSIS';

    if (action === 'RUN_ANALYSIS') {
      const output = await producerGrowthService.runGrowthAnalysis(body.input);
      return NextResponse.json({ success: true, output });
    }

    if (action === 'SAVE_UAT_FEEDBACK') {
      const record = producerGrowthService.saveUatFeedback({
        producer_id: body.producer_id,
        object_type: body.object_type,
        object_id: body.object_id,
        decision: body.decision,
        note: body.note,
      });
      return NextResponse.json({ success: true, record });
    }

    if (action === 'SAVE_WORKBENCH_ASSET') {
      const asset = producerGrowthService.saveWorkbenchAsset(body.producer_id, body.asset);
      return NextResponse.json({ success: true, asset });
    }

    if (action === 'SAVE_MARKET_VALIDATION_FEEDBACK') {
      const record = producerGrowthService.saveMarketValidationFeedback({
        producer_id: body.producer_id,
        target_pillar: body.target_pillar,
        object_id: body.object_id,
        decision: body.decision,
        comment: body.comment,
        reviewer: body.reviewer,
      });
      return NextResponse.json({ success: true, record });
    }

    if (action === 'RECORD_INTERNAL_MARKET_LEARNING') {
      const record = producerGrowthService.recordInternalMarketLearning({
        producer_id: body.producer_id,
        target_pillar: body.target_pillar,
        observation: body.observation,
        interpretation: body.interpretation,
        hypothesis: body.hypothesis,
        next_test: body.next_test,
      });
      return NextResponse.json({ success: true, record });
    }

    if (action === 'RECORD_MARKET_LEARNING') {
      const record = producerGrowthService.recordMarketLearning(
        body.intervention_id,
        body.observed,
        body.outcome,
        body.hypothesis_status,
        body.learning,
        body.next_action
      );
      return NextResponse.json({ success: true, record });
    }

    if (action === 'TEST_ISOLATION_MUTATION') {
      // Intentionally triggers skill isolation guard
      try {
        producerGrowthService.guardIsolation(body.request);
        return NextResponse.json({ success: true, allowed: true });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          allowed: false,
          error: err.message,
          code: err.code || 'SKILL_ISOLATION_VIOLATION',
        }, { status: 403 });
      }
    }

    return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error('Growth API POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
