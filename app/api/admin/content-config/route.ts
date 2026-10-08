import { NextResponse } from 'next/server';
import { contentConfigService } from '@/services/content-config-service';
import { NganContentConfig } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nganId = searchParams.get('nganId') || searchParams.get('slug') || 'cacao-oca';

  const config = contentConfigService.getConfigByNganId(nganId);
  if (!config) {
    return NextResponse.json({ error: 'Config not found' }, { status: 404 });
  }

  return NextResponse.json({ data: config });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const configToUpdate = body as NganContentConfig;

    if (!configToUpdate.ngan_id) {
      return NextResponse.json({ error: 'Missing ngan_id' }, { status: 400 });
    }

    const result = contentConfigService.updateConfig(configToUpdate);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({ success: true, data: result.config });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
