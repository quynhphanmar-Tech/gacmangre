import { NextRequest, NextResponse } from 'next/server';
import { processEvent, getAllEvents } from '@/services/event-service';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('x-make-secret') || request.headers.get('authorization');
    const secret = process.env.MAKE_WEBHOOK_SECRET || 'gacmangre-make-secret-2026';

    // Verify secret
    if (authHeader !== secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing x-make-secret' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { action, event_id } = body;

    // Action A: Process specific event
    if (event_id) {
      const result = await processEvent(event_id);
      return NextResponse.json({
        success: result.success,
        event: result.event,
        error: result.error,
      });
    }

    // Action B: Poller / Query pending events
    if (action === 'poll_pending') {
      const allEvents = await getAllEvents();
      const pendingEvents = allEvents.filter((e) => e.status === 'PENDING' || e.status === 'FAILED');
      return NextResponse.json({
        success: true,
        count: pendingEvents.length,
        events: pendingEvents,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Make webhook endpoint ready. Provide event_id to process.',
    });
  } catch (error: unknown) {
    console.error('Make webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('x-make-secret') || request.headers.get('authorization');
  const secret = process.env.MAKE_WEBHOOK_SECRET || 'gacmangre-make-secret-2026';

  if (authHeader !== secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or missing x-make-secret' },
      { status: 401 }
    );
  }

  const allEvents = await getAllEvents();
  return NextResponse.json({
    success: true,
    total: allEvents.length,
    events: allEvents,
  });
}
