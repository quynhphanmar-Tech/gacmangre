import { NextRequest, NextResponse } from 'next/server';
import { getAllSources, createSourceFromInput } from '@/services/source-service';

export async function GET() {
  const sources = await getAllSources();
  return NextResponse.json({
    success: true,
    sources,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSource = await createSourceFromInput(body);
    return NextResponse.json({
      success: true,
      source: newSource,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Lỗi tiếp nhận nguồn',
      },
      { status: 500 }
    );
  }
}
