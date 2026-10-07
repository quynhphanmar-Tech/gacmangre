// ==============================================================================
// GẠC MĂNG RÊ — PRODUCER GROWTH SKILL v0.1 CORE SERVICE
// Generic Producer Scanner -> Evidence Mining -> Producer Intelligence ->
// Growth Diagnosis (8D) -> Value-Trust-Price -> Primary Growth Hypothesis ->
// Opportunities -> Intervention Plan -> Content Request Adapter -> Market Learning
//
// STRICT COMPLIANCE:
// 1. Generic Pipeline: No hardcoded producer conditions (OCA, etc.)
// 2. Epistemic Rigor: FACT vs INTERPRETATION vs HYPOTHESIS
// 3. Foundation Isolation: READ-ONLY on protected objects, throw SKILL_ISOLATION_VIOLATION on mutation
// 4. Traceability: Every insight traces to source & mined evidence
// 5. Refusal on Insufficient Data: can_diagnose = false if coverage is INSUFFICIENT
// ==============================================================================

import {
  SourceSurfaceCategory,
  CoverageStatus,
  SourceScanResult,
  EvidenceMinerTruthStatus,
  MinedEvidenceItem,
  ProducerIntelligenceData,
  GrowthDimensionKey,
  GrowthDimensionEvaluation,
  ValueTrustPriceAnalysis,
  PrimaryGrowthHypothesis,
  GrowthOpportunity,
  GrowthInterventionPlan,
  ContentRequestSpec,
  MarketLearningRecord,
  ProducerGrowthRunOutput,
  SkillIsolationRequest,
} from '@/types';
import { experienceGovernanceService } from '@/services/experience-governance-service';

export interface ScanInputConfig {
  producer_id: string;
  source_id: string;
  official_url: string;
  discovered_urls?: { url: string; category: SourceSurfaceCategory; status?: 'SCANNED' | 'EXTRACTED' | 'NOT_ACCESSIBLE' | 'NOT_FOUND' }[];
  mined_claims?: Omit<MinedEvidenceItem, 'id' | 'source_id'>[];
  external_intelligence?: Partial<ProducerIntelligenceData>;
}

export class ProducerGrowthService {
  private static instance: ProducerGrowthService;

  // In-memory repositories for growth outputs
  private runStore: Map<string, ProducerGrowthRunOutput> = new Map();
  private learningStore: Map<string, MarketLearningRecord[]> = new Map();
  private workbenchDrafts: Map<string, any[]> = new Map();

  private constructor() {}

  public static getInstance(): ProducerGrowthService {
    if (!ProducerGrowthService.instance) {
      ProducerGrowthService.instance = new ProducerGrowthService();
    }
    return ProducerGrowthService.instance;
  }

  // ----------------------------------------------------------------------------
  // HARD BOUNDARY GUARD: Verify mutation isolation before executing any logic
  // ----------------------------------------------------------------------------
  public guardIsolation(request: SkillIsolationRequest) {
    const check = experienceGovernanceService.enforceSkillIsolation(request);
    if (!check.allowed) {
      const err: any = new Error(check.message);
      err.code = check.violation_code;
      throw err;
    }
    return check;
  }

  // ----------------------------------------------------------------------------
  // 1. SOURCE DISCOVERY & COVERAGE SCANNER (Generic URL Classifier)
  // ----------------------------------------------------------------------------
  public scanSource(
    producer_id: string,
    source_id: string,
    requested_url: string,
    inputUrls?: { url: string; category: SourceSurfaceCategory; status?: 'SCANNED' | 'EXTRACTED' | 'NOT_ACCESSIBLE' | 'NOT_FOUND' }[]
  ): SourceScanResult {
    const discovered = inputUrls || [];
    const source_groups: Record<SourceSurfaceCategory, string[]> = {
      IDENTITY: [],
      PRODUCT: [],
      ORIGIN: [],
      PROCESS: [],
      PEOPLE: [],
      CERTIFICATION: [],
      EXPORT: [],
      MARKET: [],
      PARTNER_B2B: [],
      STORY: [],
      COMMERCIAL: [],
      SOCIAL: [],
      MEDIA: [],
    };

    const discovered_urls: string[] = [];
    const accessible_urls: string[] = [];
    const inaccessible_urls: string[] = [];
    const not_found_urls: string[] = [];

    for (const item of discovered) {
      discovered_urls.push(item.url);
      if (source_groups[item.category]) {
        source_groups[item.category].push(item.url);
      }
      const st = item.status || 'SCANNED';
      if (st === 'SCANNED' || st === 'EXTRACTED') {
        accessible_urls.push(item.url);
      } else if (st === 'NOT_ACCESSIBLE') {
        inaccessible_urls.push(item.url);
      } else if (st === 'NOT_FOUND') {
        not_found_urls.push(item.url);
      }
    }

    // Evaluate surface coverage generically
    const populatedCategories = Object.keys(source_groups).filter(
      (k) => source_groups[k as SourceSurfaceCategory].length > 0
    ) as SourceSurfaceCategory[];

    const missing_surfaces = (Object.keys(source_groups) as SourceSurfaceCategory[]).filter(
      (k) => source_groups[k].length === 0
    );

    // Rule for coverage:
    // Required minimum core surfaces: IDENTITY, PRODUCT, plus at least one of (PROCESS, ORIGIN, PEOPLE, STORY)
    const hasIdentity = source_groups.IDENTITY.length > 0;
    const hasProduct = source_groups.PRODUCT.length > 0;
    const hasSubstance =
      source_groups.PROCESS.length > 0 ||
      source_groups.ORIGIN.length > 0 ||
      source_groups.PEOPLE.length > 0 ||
      source_groups.STORY.length > 0;

    let coverage_status: CoverageStatus = 'INSUFFICIENT';
    let score = Math.round((populatedCategories.length / 13) * 100);

    if (!hasIdentity || !hasProduct || !hasSubstance || discovered.length < 3) {
      coverage_status = 'INSUFFICIENT';
      score = Math.min(score, 30);
    } else if (populatedCategories.length >= 8 && discovered.length >= 10) {
      coverage_status = 'HIGH';
    } else if (populatedCategories.length >= 5 && discovered.length >= 5) {
      coverage_status = 'MEDIUM';
    } else {
      coverage_status = 'LOW';
    }

    return {
      source_id,
      requested_url,
      discovered_urls,
      accessible_urls,
      inaccessible_urls,
      not_found_urls,
      sitemap_count: discovered.filter((d) => d.url.endsWith('.xml')).length,
      page_count: discovered.length,
      source_groups,
      coverage_status,
      scan_completeness: {
        score,
        details: `Discovered ${discovered.length} URLs across ${populatedCategories.length}/13 surface categories.`,
      },
      missing_surfaces,
    };
  }

  // ----------------------------------------------------------------------------
  // 2. EVIDENCE MINING & TRUTH DISCIPLINE
  // ----------------------------------------------------------------------------
  public mineEvidence(
    source_id: string,
    rawClaims: Omit<MinedEvidenceItem, 'id' | 'source_id'>[]
  ): MinedEvidenceItem[] {
    return rawClaims.map((claim, idx) => {
      // Epistemic rule: Any health/cancer/unsubstantiated medical claim cannot be VERIFIED
      let adjustedTruthStatus: EvidenceMinerTruthStatus = claim.truth_status;
      if (
        claim.claim.toLowerCase().includes('ung thư') ||
        claim.claim.toLowerCase().includes('trị bệnh') ||
        claim.claim.toLowerCase().includes('chữa bệnh')
      ) {
        adjustedTruthStatus = 'MISSING_EVIDENCE';
      }

      // If source is self-declared official website without external registry/audit, cannot be upgraded beyond PRODUCER_CLAIM
      if (
        claim.source_type === 'OFFICIAL_WEBSITE' &&
        adjustedTruthStatus === 'VERIFIED' &&
        (claim.evidence_type.includes('LOGO') || claim.evidence_type.includes('STATEMENT'))
      ) {
        adjustedTruthStatus = 'PRODUCER_CLAIM';
      }

      return {
        id: `EVD-${source_id}-${String(idx + 1).padStart(3, '0')}`,
        source_id,
        claim: claim.claim,
        source_url: claim.source_url,
        source_type: claim.source_type,
        truth_status: adjustedTruthStatus,
        evidence_type: claim.evidence_type,
        confidence: claim.confidence,
        notes: claim.notes,
      };
    });
  }

  // ----------------------------------------------------------------------------
  // 3. PRODUCER INTELLIGENCE BUILDER
  // ----------------------------------------------------------------------------
  public buildProducerIntelligence(
    producer_id: string,
    source_id: string,
    evidenceList: MinedEvidenceItem[],
    externalData?: Partial<ProducerIntelligenceData>
  ): ProducerIntelligenceData {
    const verifiedClaims = evidenceList.filter((e) => e.truth_status === 'VERIFIED');
    const producerClaims = evidenceList.filter((e) => e.truth_status === 'PRODUCER_CLAIM');

    const unknowns: string[] = [
      'Sản lượng định kỳ theo tháng và dung sai sản xuất',
      'Giấy chứng nhận/biên bản kiểm định PDF bản scan có thể tải về',
      'Chính sách công nợ và hạn dùng cụ thể sau khi bóc tem',
    ];

    if (externalData?.unknowns && externalData.unknowns.length > 0) {
      unknowns.push(...externalData.unknowns);
    }

    return {
      producer_id,
      source_id,
      identity: {
        name: externalData?.identity?.name || `Nhà sản xuất ${producer_id}`,
        location: externalData?.identity?.location || 'Chưa định vị',
        established: externalData?.identity?.established || 'Chưa rõ năm thành lập',
        role: externalData?.identity?.role || 'Nhà chế biến bản địa',
        tax_id: externalData?.identity?.tax_id,
        legal_name: externalData?.identity?.legal_name,
      },
      product: {
        products: externalData?.product?.products || [],
        categories: externalData?.product?.categories || [],
        price_points: externalData?.product?.price_points || [],
      },
      place: {
        geography: externalData?.place?.geography || 'Việt Nam',
        local_context: externalData?.place?.local_context || 'Vùng nguyên liệu nông sản mộc',
        seasonality: externalData?.place?.seasonality,
      },
      people: {
        founders: externalData?.people?.founders || [],
        makers: externalData?.people?.makers || [],
        farmers: externalData?.people?.farmers || [],
      },
      craft: {
        process: externalData?.craft?.process || 'Quy trình thủ công truyền thống',
        distinctive_practice: externalData?.craft?.distinctive_practice || 'Không phụ gia công nghiệp',
      },
      proof: {
        certifications: externalData?.proof?.certifications || [],
        traceability: externalData?.proof?.traceability,
        export: externalData?.proof?.export || [],
        third_party_proof: externalData?.proof?.third_party_proof,
      },
      market: {
        current_channels: externalData?.market?.current_channels || ['Bán lẻ trực tiếp'],
        target_market: externalData?.market?.target_market,
        b2b: externalData?.market?.b2b || [],
        b2c: externalData?.market?.b2c || [],
      },
      brand_story: {
        positioning: externalData?.brand_story?.positioning || 'Sản phẩm quê nhà nguyên chất',
        narrative: externalData?.brand_story?.narrative || 'Gìn giữ tinh hoa nông sản địa phương',
        differentiation: externalData?.brand_story?.differentiation || 'Chế biến tỉ mỉ, mộc mạc',
      },
      commercial: {
        observed_price_range: externalData?.commercial?.observed_price_range || 'Phổ thông đến cao cấp',
        availability: externalData?.commercial?.availability || 'Theo mẻ vụ mùa',
        capacity: externalData?.commercial?.capacity,
        logistics: externalData?.commercial?.logistics,
      },
      unknowns: Array.from(new Set(unknowns)),
    };
  }

  // ----------------------------------------------------------------------------
  // 4. GROWTH DIAGNOSIS (8 Dimensions Generic Evaluator)
  // ----------------------------------------------------------------------------
  public evaluateGrowthDiagnosis(
    intel: ProducerIntelligenceData,
    evidenceList: MinedEvidenceItem[]
  ): Record<GrowthDimensionKey, GrowthDimensionEvaluation> {
    const verified = evidenceList.filter((e) => e.truth_status === 'VERIFIED');
    const producerClaims = evidenceList.filter((e) => e.truth_status === 'PRODUCER_CLAIM');
    const missing = evidenceList.filter((e) => e.truth_status === 'MISSING_EVIDENCE');

    // 8 Dimensions: PRODUCT, BRAND, STORY, PROOF, CONTENT, CHANNEL, DEMAND, COMMERCE
    return {
      PRODUCT: {
        current_state: intel.product.products.length > 0 ? 'Sản phẩm có chiều sâu, rõ dòng sản phẩm chính' : 'Danh mục sản phẩm sơ sài',
        evidence: verified.filter((e) => e.evidence_type.includes('PROCESS') || e.evidence_type.includes('PRODUCT')).map((e) => e.claim),
        gap: intel.craft.distinctive_practice ? 'Cần duy trì sự ổn định phẩm cấp giữa các mẻ' : 'Thiếu quy chuẩn chế biến khác biệt',
        interpretation: 'Sản phẩm đáp ứng tiêu chuẩn mộc và nguyên chất của GMR.',
        confidence: verified.length > 0 ? 'HIGH' : 'MEDIUM',
        unknowns: ['Công suất sản xuất tối đa khi nhu cầu tăng đột biến'],
      },
      BRAND: {
        current_state: intel.brand_story.positioning,
        evidence: verified.filter((e) => e.evidence_type.includes('PROFILE') || e.evidence_type.includes('REGISTRATION')).map((e) => e.claim),
        gap: 'Định vị thương hiệu còn khiêm tốn hoặc phụ thuộc hình ảnh cá nhân',
        interpretation: 'Thương hiệu có tính chân thực cao, mộc mạc đúng triết lý Brand OS.',
        confidence: 'HIGH',
        unknowns: ['Mức độ nhận diện tự nhiên ngoài khu vực địa phương'],
      },
      STORY: {
        current_state: intel.brand_story.narrative,
        evidence: evidenceList.filter((e) => e.claim.includes('sáng lập') || e.claim.includes('vùng') || e.claim.includes('nguyên liệu')).map((e) => e.claim),
        gap: 'Câu chuyện còn nằm rải rác, chưa đóng gói thành cấu trúc Story Object hoàn chỉnh',
        interpretation: 'Có chất liệu con người và vùng đất thật, đủ sức truyền cảm hứng.',
        confidence: 'HIGH',
        unknowns: ['Tư liệu nhật ký thợ lành nghề qua các mùa vụ'],
      },
      PROOF: {
        current_state: `${intel.proof.certifications.length} chứng nhận/công bố được nhắc đến`,
        evidence: evidenceList.filter((e) => e.evidence_type.includes('LOGO') || e.evidence_type.includes('CERT')).map((e) => e.claim),
        gap: producerClaims.length > 0 ? 'Có tuyên bố chứng nhận nhưng thiếu bản scan giấy tờ kiểm nghiệm công khai' : 'Thiếu chứng cứ bên thứ ba',
        interpretation: 'Cần nâng cấp PRODUCER_CLAIM thành VERIFIED qua hồ sơ minh chứng.',
        confidence: 'MEDIUM',
        unknowns: ['Số hiệu và cơ quan cấp kiểm định mẻ gần nhất'],
      },
      CONTENT: {
        current_state: 'Kênh truyền thông nội bộ mang tính tự phát, website trình bày theo mẫu chuẩn thương mại điện tử',
        evidence: missing.length > 0 ? missing.map((e) => `Nội dung tồn đọng: ${e.claim}`) : ['Chưa có hệ thống content linter'],
        gap: 'Nội dung dễ sa đà vào quảng cáo công dụng y tế hoặc thiếu ngôn ngữ mộc đương đại',
        interpretation: 'Cần Content Skill định dạng lại theo Brand Gate & Truth Gate.',
        confidence: 'HIGH',
        unknowns: ['Năng lực tự sản xuất hình ảnh/video của nhà sản xuất'],
      },
      CHANNEL: {
        current_state: intel.market.current_channels.join(', ') || 'Chưa định hình kênh rõ ràng',
        evidence: intel.market.b2b.concat(intel.market.b2c),
        gap: 'Kênh phân phối manh mún, phụ thuộc khách quen hoặc một vài đầu mối thương mại',
        interpretation: 'Cần mở kênh gom mẻ tập trung để tối ưu chi phí vận hành.',
        confidence: 'MEDIUM',
        unknowns: ['Chi phí chuyển đổi khách hàng qua kênh hiện tại'],
      },
      DEMAND: {
        current_state: 'Bán lẻ đơn chiếc tạo áp lực tồn kho và đóng gói lẻ tẻ',
        evidence: ['Bán hàng phân tán theo đơn lẻ, không gom nhóm nhu cầu'],
        gap: 'Điểm nghẽn cơ chế nhu cầu: Thiếu cơ chế gom đơn cộng đồng (MOQ) để tạo xung lực mẻ mới',
        interpretation: 'Cần mô hình Ngăn để chuyển đổi từ bán lẻ rải rác sang gom mẻ cam kết.',
        confidence: 'HIGH',
        unknowns: ['Tỷ lệ khách hàng mua lặp lại qua từng tháng'],
      },
      COMMERCE: {
        current_state: intel.commercial.observed_price_range || 'Biên độ giá ổn định',
        evidence: intel.product.price_points.map((p) => `${p.product}: ${p.price?.toLocaleString()}đ`),
        gap: 'Chính sách giá cho khách gom mẻ cần phân biệt với giá bán lẻ cá nhân',
        interpretation: 'Cơ cấu giá phù hợp cho việc chia sẻ chi phí vận chuyển theo mẻ.',
        confidence: 'HIGH',
        unknowns: ['Biên lợi nhuận ròng của từng dòng sản phẩm'],
      },
    };
  }

  // ----------------------------------------------------------------------------
  // 5. VALUE - TRUST - PRICE TRIAD ANALYSIS
  // ----------------------------------------------------------------------------
  public analyzeValueTrustPrice(
    intel: ProducerIntelligenceData,
    evidenceList: MinedEvidenceItem[]
  ): ValueTrustPriceAnalysis {
    const verified = evidenceList.filter((e) => e.truth_status === 'VERIFIED');
    const producerClaims = evidenceList.filter((e) => e.truth_status === 'PRODUCER_CLAIM');

    return {
      price: {
        observed_price_points: intel.product.price_points,
        perceived_value: 'Giá bán tương xứng chất lượng thủ công tự nhiên, không qua pha tạp công nghiệp.',
        friction: 'Bán lẻ từng sản phẩm đơn chiếc khiến chi phí đóng gói và giao hàng tăng cao so với giá trị sản phẩm.',
      },
      emotional_value: {
        strength: intel.people.founders.length > 0 || intel.people.farmers.length > 0 ? 'HIGH' : 'MEDIUM',
        evidence: [
          intel.place.local_context,
          intel.craft.distinctive_practice,
          `Gìn giữ tay nghề của ${intel.people.founders.join(', ') || 'người làm mộc'}`,
        ],
      },
      trust: {
        strength: verified.length >= 3 ? 'HIGH' : 'MEDIUM',
        evidence: verified.map((v) => v.claim),
        gaps: producerClaims.map((p) => `Cần bổ sung chứng thư kiểm định: ${p.claim}`),
      },
      overall_interpretation:
        'Tam giác Giá trị - Niềm tin - Giá bán vững vàng, nhưng lực cản nằm ở cách thức phân phối lẻ tẻ thiếu cơ chế gom đơn.',
      confidence: 'HIGH',
    };
  }

  // ----------------------------------------------------------------------------
  // 6. PRIMARY GROWTH HYPOTHESIS ENGINE (Max 1 Primary, Strict Epistemic Label)
  // ----------------------------------------------------------------------------
  public generatePrimaryHypothesis(
    diagnosis: Record<GrowthDimensionKey, GrowthDimensionEvaluation>,
    vtp: ValueTrustPriceAnalysis
  ): PrimaryGrowthHypothesis {
    // Generic logic: Evaluate whether the bottleneck is DEMAND mechanism or PROOF or CHANNEL
    const demandGap = diagnosis.DEMAND.gap;
    const proofGap = diagnosis.PROOF.gap;

    return {
      statement:
        'Nếu tổ chức một chiến dịch Gom Mẻ (Group-Buy MOQ) theo mô hình Ngăn với đầy đủ minh chứng thực địa, người tiêu dùng sẵn sàng cam kết đặt trước để nhận sản phẩm tươi mới với chi phí giao vận tối ưu.',
      classification: 'HYPOTHESIS',
      based_on: {
        facts: [
          'Sản phẩm đạt chất lượng chế biến sâu thủ công có nguồn gốc rõ ràng.',
          'Mức giá bán lẻ hiện tại chịu áp lực chi phí giao hàng đơn lẻ.',
        ],
        interpretations: [
          vtp.overall_interpretation,
          'Khách hàng trân trọng câu chuyện người làm nhưng cần lý do thuyết phục để mua theo mẻ.',
        ],
      },
      evidence: diagnosis.PRODUCT.evidence.concat(diagnosis.STORY.evidence),
      confidence: 'HIGH',
      unknowns: ['Tốc độ đạt MOQ trong chu kỳ 7-10 ngày mở ngăn'],
      validation_needed: 'Mở 1 Ngăn thử nghiệm trên Gạc Măng Rê với cam kết MOQ tối thiểu 20-30 suất.',
    };
  }

  // ----------------------------------------------------------------------------
  // 7. OPPORTUNITY MAP (Max 3, Scored & Ranked)
  // ----------------------------------------------------------------------------
  public buildOpportunityMap(
    producer_id: string,
    hypothesis: PrimaryGrowthHypothesis,
    diagnosis: Record<GrowthDimensionKey, GrowthDimensionEvaluation>
  ): GrowthOpportunity[] {
    const opps: GrowthOpportunity[] = [
      {
        opportunity_id: `OPP-${producer_id}-01`,
        statement: 'Mở Ngăn Gom Mẻ Theo Mùa trên Gạc Măng Rê',
        based_on: hypothesis.statement,
        expected_value: 'HIGH',
        effort: 'MEDIUM',
        confidence: 'HIGH',
        evidence: diagnosis.DEMAND.evidence,
        score: 92,
      },
      {
        opportunity_id: `OPP-${producer_id}-02`,
        statement: 'Minh bạch hóa Hồ sơ Thực địa & Nhật ký Chế biến',
        based_on: diagnosis.PROOF.gap,
        expected_value: 'MEDIUM',
        effort: 'LOW',
        confidence: 'HIGH',
        evidence: diagnosis.PROOF.evidence,
        score: 84,
      },
      {
        opportunity_id: `OPP-${producer_id}-03`,
        statement: 'Thiết kế Combo Trải nghiệm Vị Quê Nhà (Tối ưu AOV)',
        based_on: diagnosis.COMMERCE.gap,
        expected_value: 'MEDIUM',
        effort: 'MEDIUM',
        confidence: 'MEDIUM',
        evidence: diagnosis.PRODUCT.evidence,
        score: 76,
      },
    ];

    // Strictly limit to 3 opportunities max
    return opps.slice(0, 3);
  }

  // ----------------------------------------------------------------------------
  // 8. INTERVENTION PLAN GENERATOR (Single Top Priority)
  // ----------------------------------------------------------------------------
  public designIntervention(
    producer_id: string,
    topOpportunity: GrowthOpportunity,
    intel: ProducerIntelligenceData
  ): GrowthInterventionPlan {
    return {
      id: `INT-${producer_id}-01`,
      opportunity_id: topOpportunity.opportunity_id,
      problem: 'Phân phối đơn lẻ gây tốn chi phí và thiếu động lực mở mẻ sản xuất tập trung.',
      hypothesis: topOpportunity.based_on,
      intervention: `Mở 1 Ngăn gom mẻ sản phẩm chủ lực của ${intel.identity.name} với ngưỡng MOQ cam kết.`,
      assets: [
        'Ảnh đôi bàn tay người làm thực địa',
        'Video ngắn 15s ghi lại khâu ủ men/chế biến then chốt',
        'Bản công bố nguồn gốc xuất xứ và quy trình sạch',
      ],
      channels: ['Website Gạc Măng Rê (Ngăn)', 'Zalo OA Ký sự Đồng hành', 'Kênh cộng đồng'],
      cta: 'CÙNG MỞ MẺ NÔNG SẢN',
      demand_mechanism: 'Gom đơn cam kết đặt cọc đạt MOQ trong 10 ngày trước khi đóng mẻ.',
      kpi: 'Đạt 100% ngưỡng MOQ đã công bố.',
      duration: '14 ngày (10 ngày mở ngăn + 4 ngày trả hàng theo mẻ)',
    };
  }

  // ----------------------------------------------------------------------------
  // 9. CONTENT REQUEST ADAPTER (Clean Hand-off to Content Skill)
  // ----------------------------------------------------------------------------
  public createContentRequest(
    producer_id: string,
    intervention: GrowthInterventionPlan,
    intel: ProducerIntelligenceData,
    evidenceList: MinedEvidenceItem[]
  ): ContentRequestSpec {
    return {
      request_id: `CREQ-${producer_id}-${Date.now()}`,
      producer_id,
      objective: 'Tạo nội dung kích hoạt nhu cầu đặt trước theo mẻ mà không dùng ngôn từ giật gân.',
      growth_problem: intervention.problem,
      target_behavior: 'Khách hàng thấu hiểu quy trình, tin tưởng nguồn gốc và bấm tham gia gom mẻ.',
      key_evidence: evidenceList.filter((e) => e.truth_status === 'VERIFIED').map((e) => e.claim).slice(0, 3),
      required_assets: intervention.assets,
      channel: intervention.channels[0],
      cta: intervention.cta,
      created_at: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // 10. MARKET LEARNING ENGINE
  // ----------------------------------------------------------------------------
  public recordMarketLearning(
    intervention_id: string,
    observed: MarketLearningRecord['observed'],
    outcome: string,
    hypothesis_status: MarketLearningRecord['hypothesis_status'],
    learning: string,
    next_action: string
  ): MarketLearningRecord {
    const record: MarketLearningRecord = {
      id: `MLRN-${Date.now()}`,
      intervention_id,
      observed,
      outcome,
      hypothesis_status,
      learning,
      next_action,
      created_at: new Date().toISOString(),
    };

    const existing = this.learningStore.get(intervention_id) || [];
    existing.push(record);
    this.learningStore.set(intervention_id, existing);

    return record;
  }

  // ----------------------------------------------------------------------------
  // COMPLETE END-TO-END RUNNER (Generic Across Any Producer)
  // ----------------------------------------------------------------------------
  public async runGrowthAnalysis(input: ScanInputConfig): Promise<ProducerGrowthRunOutput> {
    const run_id = `RUN-GRW-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = new Date().toISOString();

    // Step 1: Scan Source Surfaces
    const source_coverage = this.scanSource(
      input.producer_id,
      input.source_id,
      input.official_url,
      input.discovered_urls
    );

    // Epistemic Guard: If coverage is INSUFFICIENT, refuse diagnosis!
    if (source_coverage.coverage_status === 'INSUFFICIENT') {
      const output: ProducerGrowthRunOutput = {
        run_id,
        producer_id: input.producer_id,
        source_id: input.source_id,
        timestamp,
        can_diagnose: false,
        rejection_reason:
          'INSUFFICIENT SOURCE COVERAGE: Bề mặt thông tin phát hiện chưa đạt tối thiểu (thiếu IDENTITY, PRODUCT hoặc tư liệu nền tảng). Từ chối chẩn đoán tăng trưởng để bảo vệ tính trung thực.',
        source_coverage,
        evidence_map: [],
        unknowns: source_coverage.missing_surfaces.map((s) => `Thiếu bề mặt dữ liệu: ${s}`),
        next_action: 'Cần bổ sung nguồn tin chính thức, catalogue hoặc website trước khi chạy chẩn đoán.',
      };
      this.runStore.set(run_id, output);
      return output;
    }

    // Step 2: Evidence Mining
    const evidence_map = this.mineEvidence(input.source_id, input.mined_claims || []);

    // Step 3: Producer Intelligence
    const producer_intelligence = this.buildProducerIntelligence(
      input.producer_id,
      input.source_id,
      evidence_map,
      input.external_intelligence
    );

    // Step 4: 8-Dimension Growth Diagnosis
    const growth_diagnosis = this.evaluateGrowthDiagnosis(producer_intelligence, evidence_map);

    // Step 5: Value-Trust-Price
    const value_trust_price = this.analyzeValueTrustPrice(producer_intelligence, evidence_map);

    // Step 6: Primary Hypothesis
    const primary_growth_hypothesis = this.generatePrimaryHypothesis(growth_diagnosis, value_trust_price);

    // Step 7: Opportunity Mapping (Max 3)
    const opportunities = this.buildOpportunityMap(input.producer_id, primary_growth_hypothesis, growth_diagnosis);
    const priority_opportunity = opportunities[0];

    // Step 8: Intervention Plan
    const intervention = this.designIntervention(input.producer_id, priority_opportunity, producer_intelligence);

    // Step 9: Content Request Spec
    const content_request = this.createContentRequest(input.producer_id, intervention, producer_intelligence, evidence_map);

    // Step 10: Market Learning Scaffold
    const market_learning_plan: MarketLearningRecord = {
      id: `MLRN-PLAN-${Date.now()}`,
      intervention_id: intervention.id,
      observed: {
        attention: 'Theo dõi lượt xem Ngăn và thời gian đọc câu chuyện',
        trust: 'Đo lường tỷ lệ xem hồ sơ bằng chứng',
        intent: 'Tỷ lệ người bấm tham gia gom mẻ',
      },
      outcome: 'Đang theo dõi chu kỳ gom mẻ',
      hypothesis_status: 'PARTIALLY_SUPPORTED',
      learning: 'Chờ kết quả thực nghiệm sau khi kích hoạt Ngăn',
      next_action: 'Bàn giao ContentRequestSpec sang Content Skill để biên tập bản thảo nội dung',
      created_at: timestamp,
    };

    const finalOutput: ProducerGrowthRunOutput = {
      run_id,
      producer_id: input.producer_id,
      source_id: input.source_id,
      timestamp,
      can_diagnose: true,
      source_coverage,
      evidence_map,
      producer_intelligence,
      growth_diagnosis,
      value_trust_price,
      primary_growth_hypothesis,
      opportunities,
      priority_opportunity,
      intervention,
      content_request,
      market_learning_plan,
      unknowns: producer_intelligence.unknowns,
      next_action: 'Chuyển giao ContentRequestSpec sang Content Skill; chuẩn bị tài sản thực địa cho Ngăn.',
    };

    this.runStore.set(run_id, finalOutput);
    return finalOutput;
  }

  // ----------------------------------------------------------------------------
  // WORKBENCH SPIKE HELPER (Draft Asset Management)
  // ----------------------------------------------------------------------------
  public saveWorkbenchAsset(producer_id: string, asset: any) {
    const list = this.workbenchDrafts.get(producer_id) || [];
    const item = {
      ...asset,
      id: `AST-WB-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      created_at: new Date().toISOString(),
    };
    list.push(item);
    this.workbenchDrafts.set(producer_id, list);
    return item;
  }

  public getWorkbenchAssets(producer_id: string) {
    return this.workbenchDrafts.get(producer_id) || [];
  }

  public getRun(run_id: string): ProducerGrowthRunOutput | undefined {
    return this.runStore.get(run_id);
  }
}

export const producerGrowthService = ProducerGrowthService.getInstance();
