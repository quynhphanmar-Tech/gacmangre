import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, processEvent } from '@/services/event-service';
import { sentNotificationsLog } from '@/services/notification-service';

export async function GET() {
  const events = await getAllEvents();
  return NextResponse.json({
    success: true,
    events,
    sent_notifications: sentNotificationsLog,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { event_id } = await request.json();
    if (!event_id) {
      return NextResponse.json({ success: false, error: 'Missing event_id' }, { status: 400 });
    }

    const result = await processEvent(event_id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error' },
      { status: 500 }
    );
  }
}
