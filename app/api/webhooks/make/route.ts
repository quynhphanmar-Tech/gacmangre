import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('x-make-secret') || request.headers.get('authorization');
    const secret = process.env.MAKE_WEBHOOK_SECRET;

    // Security check: verify webhook secret if configured
    if (secret && authHeader !== secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 });
    }

    const body = await request.json();
    const { action, event_id } = body;

    const db = getServiceSupabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'Mock webhook handler acknowledged: ' + (action || 'ping'),
      });
    }

    // Mark event as processed if event_id is supplied
    if (event_id) {
      await db
        .from('events')
        .update({ processed_at: new Date().toISOString() })
        .eq('id', event_id);
    }

    return NextResponse.json({ success: true, processed: true });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
