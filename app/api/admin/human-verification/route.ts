import { NextResponse } from 'next/server';
import { humanVerificationService } from '@/services/human-verification-service';
import { VerificationMethod } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const producerId = searchParams.get('producerId') || undefined;
  const claimId = searchParams.get('claimId') || undefined;

  if (claimId) {
    const claim = humanVerificationService.getClaimById(claimId);
    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }
    const auditTrail = humanVerificationService.getAuditTrail(claimId);
    return NextResponse.json({ data: claim, audit_trail: auditTrail });
  }

  const claims = humanVerificationService.getClaims(producerId);
  return NextResponse.json({ data: claims });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      claim_id,
      verified_by,
      action,
      verification_method,
      evidence_reference,
      verification_note,
    } = body;

    if (!claim_id || !verified_by || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: claim_id, verified_by, action.' },
        { status: 400 }
      );
    }

    const result = humanVerificationService.verifyClaim({
      claim_id,
      verified_by,
      action: action as 'VERIFY' | 'REJECT' | 'NEED_MORE_EVIDENCE',
      verification_method: (verification_method as VerificationMethod) || 'FIELD_VISIT',
      evidence_reference: evidence_reference || 'Sổ tay thực địa GMR',
      verification_note: verification_note || 'Xác minh hồ sơ trực tiếp.',
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      claim: result.claim,
      audit_record: result.record,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
