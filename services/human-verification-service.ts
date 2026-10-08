import {
  VerifiableClaimItem,
  HumanVerificationRecord,
  VerificationWorkflowState,
  VerificationMethod,
  TruthStatus,
} from '@/types';

class HumanVerificationService {
  private claims: Map<string, VerifiableClaimItem> = new Map();
  private records: HumanVerificationRecord[] = [];

  constructor() {
    this.seedDefaultClaims();
  }

  private seedDefaultClaims() {
    const ocaInitialClaims: VerifiableClaimItem[] = [
      {
        id: 'CLM-OCA-001',
        claim: 'Pháp nhân Công ty TNHH OCA Việt Nhật (ĐKKD 3502512543) đăng ký tại Bình Giã, Châu Đức',
        source_id: 'SRC-OCA-LEGAL',
        source_url: 'https://ocacacao.com/story/',
        source_type: 'OFFICIAL_REGISTRY',
        source_title: 'Cổng thông tin doanh nghiệp quốc gia',
        ai_truth_status: 'VERIFIED',
        ai_confidence: 0.98,
        ai_rationale: 'Mã số thuế và tên pháp nhân tra cứu được công khai trên cổng đăng ký quốc gia.',
        is_public_evidence: true,
        verification_state: 'VERIFIED',
        current_truth_status: 'VERIFIED',
      },
      {
        id: 'CLM-OCA-002',
        claim: 'Hạt cacao Trinitario thu mua trực tiếp từ các hộ nông dân tại huyện Châu Đức, Bà Rịa - Vũng Tàu',
        source_id: 'SRC-OCA-ORIGIN',
        source_url: 'https://ocacacao.com/meet-our-farmers/',
        source_type: 'FIELD_EXPEDITION',
        source_title: 'Khảo sát thực địa GMR tại Châu Đức',
        ai_truth_status: 'VERIFIED',
        ai_confidence: 0.95,
        ai_rationale: 'Hồ sơ thực địa GMR đã đối soát vùng trồng liên kết và nông hộ tại địa bàn huyện Châu Đức.',
        is_public_evidence: true,
        verification_state: 'VERIFIED',
        current_truth_status: 'VERIFIED',
      },
      {
        id: 'CLM-OCA-003',
        claim: 'Vùng trồng cacao xen canh đạt chuẩn Organic/Hữu cơ quốc tế',
        source_id: 'SRC-OCA-FARM',
        source_url: 'https://ocacacao.com/meet-our-farmers/',
        source_type: 'PRODUCER_DECLARATION',
        source_title: 'Tuyên bố từ nhà vườn OCA',
        ai_truth_status: 'PRODUCER_CLAIM',
        ai_confidence: 0.65,
        ai_rationale: 'Nhà sản xuất tuyên bố không dùng hóa chất, nhưng chưa có bản scan chứng nhận Organic quốc tế độc lập.',
        is_public_evidence: false,
        verification_state: 'NEEDS_HUMAN_VERIFICATION',
        current_truth_status: 'PRODUCER_CLAIM',
      },
      {
        id: 'CLM-OCA-004',
        claim: 'Quy trình lên men thùng gỗ mít 6 ngày và phơi giàn lưới tại xưởng Bình Giã',
        source_id: 'SRC-OCA-PROCESS',
        source_url: 'https://ocacacao.com/quy-trinh-san-xuat/',
        source_type: 'PRODUCER_DOCUMENT',
        source_title: 'Tài liệu quy trình xưởng OCA',
        ai_truth_status: 'VERIFIED',
        ai_confidence: 0.92,
        ai_rationale: 'Tài liệu quy trình kỹ thuật công khai và ảnh tư liệu thực địa xác nhận thùng ủ men gỗ mít.',
        is_public_evidence: true,
        verification_state: 'VERIFIED',
        current_truth_status: 'VERIFIED',
      },
      {
        id: 'CLM-OCA-005',
        claim: 'Nhật ký thực địa riêng: Trưởng nhóm GMR gặp chị sáng lập OCA tại xưởng kiểm tra mẻ ủ hạt ngày 05/10/2026',
        source_id: 'SRC-GMR-FIELDNOTE',
        source_type: 'PRIVATE_FIELD_NOTE',
        source_title: 'Sổ tay thực địa nội bộ GMR 10/2026',
        ai_truth_status: 'PRODUCER_CLAIM',
        ai_confidence: 0.50,
        ai_rationale: 'Tư liệu nội bộ / phi công khai. AI không được tự ý xác nhận VERIFIED mà phải chuyển sang hàng đợi xác minh của Admin.',
        is_public_evidence: false,
        verification_state: 'NEEDS_HUMAN_VERIFICATION',
        current_truth_status: 'PRODUCER_CLAIM',
      },
    ];

    for (const c of ocaInitialClaims) {
      this.claims.set(c.id, c);
    }
  }

  public getClaims(producerId?: string): VerifiableClaimItem[] {
    return Array.from(this.claims.values());
  }

  public getClaimById(claimId: string): VerifiableClaimItem | null {
    return this.claims.get(claimId) || null;
  }

  public verifyClaim(params: {
    claim_id: string;
    verified_by: string;
    action: 'VERIFY' | 'REJECT' | 'NEED_MORE_EVIDENCE';
    verification_method: VerificationMethod;
    evidence_reference: string;
    verification_note: string;
  }): { success: boolean; claim?: VerifiableClaimItem; record?: HumanVerificationRecord; error?: string } {
    const claim = this.claims.get(params.claim_id);
    if (!claim) {
      return { success: false, error: `Claim with id ${params.claim_id} not found.` };
    }

    if (!params.verified_by || params.verified_by.trim() === '') {
      return { success: false, error: 'Verified_by (Authorized Admin/Reviewer) is mandatory.' };
    }

    if (!params.verification_note || params.verification_note.trim().length < 5) {
      return { success: false, error: 'Verification note is required (minimum 5 characters).' };
    }

    if (!params.evidence_reference || params.evidence_reference.trim() === '') {
      return { success: false, error: 'Evidence reference is required.' };
    }

    const previousStatus = claim.current_truth_status;
    let newWorkflowState: VerificationWorkflowState = 'NEEDS_HUMAN_VERIFICATION';
    let newTruthStatus: TruthStatus = previousStatus;

    if (params.action === 'VERIFY') {
      newWorkflowState = 'VERIFIED';
      newTruthStatus = 'VERIFIED';
    } else if (params.action === 'REJECT') {
      newWorkflowState = 'REJECTED';
      // Hard rule: Rejection CANNOT result in VERIFIED
      newTruthStatus = 'UNKNOWN';
    } else {
      newWorkflowState = 'NEEDS_HUMAN_VERIFICATION';
      newTruthStatus = 'PRODUCER_CLAIM';
    }

    const record: HumanVerificationRecord = {
      id: `HVR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      claim_id: claim.id,
      verification_state: newWorkflowState,
      verified_by: params.verified_by.trim(),
      verified_at: new Date().toISOString(),
      verification_method: params.verification_method,
      evidence_reference: params.evidence_reference.trim(),
      verification_note: params.verification_note.trim(),
      previous_truth_status: previousStatus,
      resulting_truth_status: newTruthStatus,
    };

    this.records.push(record);

    claim.verification_state = newWorkflowState;
    claim.current_truth_status = newTruthStatus;
    claim.audit_trail = claim.audit_trail || [];
    claim.audit_trail.push(record);

    this.claims.set(claim.id, claim);

    return { success: true, claim, record };
  }

  public getAuditTrail(claimId?: string): HumanVerificationRecord[] {
    if (claimId) {
      return this.records.filter((r) => r.claim_id === claimId);
    }
    return this.records;
  }
}

export const humanVerificationService = new HumanVerificationService();
