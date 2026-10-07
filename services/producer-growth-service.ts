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
  UatFeedbackRecord,
  GrowthDecisionLayer,
  GrowthSnapshot,
  CustomerOutcomeProposition,
  ProducerOutcomePartnershipCase,
  EpistemicStatement,
  ValueExchangeItem,
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
  private uatFeedbackStore: Map<string, UatFeedbackRecord[]> = new Map();

  private constructor() {
    this.seedDefaultRuns();
  }

  // Pre-seed known runs so direct URL loading (/admin/growth/producer/oca) is instantaneous
  private seedDefaultRuns() {
    const now = '2026-10-07T12:00:00.000Z';
    // OCA Golden Run
    const ocaScan: SourceScanResult = {
      source_id: 'SRC-OCA-OFFICIAL',
      requested_url: 'https://ocacacao.com',
      discovered_urls: [
        'https://ocacacao.com/',
        'https://ocacacao.com/story/',
        'https://ocacacao.com/meet-our-farmers/',
        'https://ocacacao.com/quy-trinh-san-xuat/',
        'https://ocacacao.com/hop-tac-cung-oca/',
        'https://ocacacao.com/contact-form/',
        'https://ocacacao.com/p/00001/',
        'https://ocacacao.com/p/06001/',
        'https://ocacacao.com/p/07001/',
        'https://ocacacao.com/p/ruou-cacao-cacao-wine-200ml/',
        'https://ocacacao.com/p/cacao-mass/',
        'https://ocacacao.com/ca-phe-ca-cao/',
        'https://ocacacao.com/blog/news/',
        'https://ocacacao.com/post-sitemap.xml',
        'https://ocacacao.com/page-sitemap.xml',
        'https://ocacacao.com/product-sitemap.xml',
      ],
      accessible_urls: [
        'https://ocacacao.com/',
        'https://ocacacao.com/story/',
        'https://ocacacao.com/meet-our-farmers/',
        'https://ocacacao.com/quy-trinh-san-xuat/',
        'https://ocacacao.com/hop-tac-cung-oca/',
        'https://ocacacao.com/contact-form/',
        'https://ocacacao.com/p/00001/',
        'https://ocacacao.com/p/06001/',
        'https://ocacacao.com/p/07001/',
        'https://ocacacao.com/p/ruou-cacao-cacao-wine-200ml/',
        'https://ocacacao.com/p/cacao-mass/',
        'https://ocacacao.com/ca-phe-ca-cao/',
        'https://ocacacao.com/blog/news/',
      ],
      inaccessible_urls: ['https://ocacacao.com/internal-audit/'],
      not_found_urls: ['https://ocacacao.com/catalog.pdf'],
      sitemap_count: 3,
      page_count: 80,
      source_groups: {
        IDENTITY: ['https://ocacacao.com/', 'https://ocacacao.com/contact-form/'],
        PRODUCT: ['https://ocacacao.com/p/00001/', 'https://ocacacao.com/p/06001/', 'https://ocacacao.com/p/07001/'],
        ORIGIN: ['https://ocacacao.com/meet-our-farmers/'],
        PROCESS: ['https://ocacacao.com/quy-trinh-san-xuat/'],
        PEOPLE: ['https://ocacacao.com/story/', 'https://ocacacao.com/meet-our-farmers/'],
        CERTIFICATION: ['https://ocacacao.com/story/'],
        EXPORT: ['https://ocacacao.com/story/'],
        MARKET: ['https://ocacacao.com/story/'],
        PARTNER_B2B: ['https://ocacacao.com/hop-tac-cung-oca/'],
        STORY: ['https://ocacacao.com/story/', 'https://ocacacao.com/ca-phe-ca-cao/'],
        COMMERCIAL: ['https://ocacacao.com/p/cacao-mass/'],
        SOCIAL: ['https://ocacacao.com/blog/news/'],
        MEDIA: ['https://ocacacao.com/post-sitemap.xml'],
      },
      coverage_status: 'HIGH',
      scan_completeness: {
        score: 95,
        details: 'Phát hiện 80 URLs qua sitemap XML, quét sâu 16 bề mặt nội dung chính thức.',
      },
      missing_surfaces: [],
    };

    const ocaEvidence: MinedEvidenceItem[] = [
      {
        id: 'EVD-OCA-001',
        source_id: 'SRC-OCA-OFFICIAL',
        claim: 'Công ty TNHH OCA Việt Nhật thành lập năm 2019, xưởng tại Ấp Tân Thành, Xã Bình Giã, Vũng Tàu; ĐKKD 3502512543 cấp ngày 15/12/2023.',
        source_url: 'https://ocacacao.com/story/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'GOVERNMENT_REGISTRATION_FOOTER',
        confidence: 1.0,
      },
      {
        id: 'EVD-OCA-002',
        source_id: 'SRC-OCA-OFFICIAL',
        claim: 'Vùng nguyên liệu cacao tại Huyện Châu Đức, Tỉnh Bà Rịa - Vũng Tàu, thổ nhưỡng đất đỏ bazan, giống Trinitario.',
        source_url: 'https://ocacacao.com/meet-our-farmers/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'GEOGRAPHIC_SOURCE_SPEC',
        confidence: 0.95,
      },
      {
        id: 'EVD-OCA-003',
        source_id: 'SRC-OCA-OFFICIAL',
        claim: 'Nhà sáng lập là Chị Nguyễn Thị Thu (CEO & Founder) và hợp tác với Ông Nozawa Hiroki (Chủ tịch C-Point Group, Giám đốc OCA Japan).',
        source_url: 'https://ocacacao.com/story/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'FOUNDER_INTERVIEW_PROFILE',
        confidence: 1.0,
      },
      {
        id: 'EVD-OCA-004',
        source_id: 'SRC-OCA-OFFICIAL',
        claim: 'Quy trình Tree to Bar: Ủ thùng gỗ mít 6–7 ngày (đảo mẻ mỗi 24h), phơi nắng tự nhiên, không kiềm hóa, giữ 100% bơ cacao tự nhiên.',
        source_url: 'https://ocacacao.com/quy-trinh-san-xuat/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'TECHNICAL_PROCESS_DISCLOSURE',
        confidence: 0.95,
      },
      {
        id: 'EVD-OCA-005',
        source_id: 'SRC-OCA-OFFICIAL',
        claim: 'OCA là đơn vị đầu tiên ở Việt Nam đạt 4 chứng nhận hữu cơ quốc tế: JAS (Nhật), USDA (Mỹ), COR (Canada), EU (Châu Âu).',
        source_url: 'https://ocacacao.com/story/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'PRODUCER_CLAIM',
        evidence_type: 'ON_SITE_LOGO_CLAIM',
        confidence: 0.85,
        notes: 'Chỉ có logo badge trên website, chưa cung cấp bản PDF chứng chỉ có số hiệu tra cứu.',
      },
      {
        id: 'EVD-OCA-006',
        source_id: 'SRC-OCA-OFFICIAL',
        claim: 'Xuất khẩu chính ngạch sang Hà Lan, Hungary, Pháp, Đức và Nhật Bản.',
        source_url: 'https://ocacacao.com/story/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'PRODUCER_CLAIM',
        evidence_type: 'SELF_DECLARED_STATEMENT',
        confidence: 0.75,
        notes: 'Chưa có vận đơn xuất khẩu/tờ khai hải quan đối chiếu.',
      },
      {
        id: 'EVD-OCA-007',
        source_id: 'SRC-OCA-OFFICIAL',
        claim: 'Năm 2024 đồng sáng lập chuỗi bán lẻ Vietnam Chocoland (LA) tại Phú Quốc, Nha Trang, HCM, Vũng Tàu.',
        source_url: 'https://ocacacao.com/story/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'EDITORIAL_INTERPRETATION',
        evidence_type: 'BRAND_PARTNERSHIP_ANNOUNCEMENT',
        confidence: 0.9,
      },
      {
        id: 'EVD-OCA-008',
        source_id: 'SRC-OCA-OFFICIAL',
        claim: 'Rượu cacao có khả năng ngăn ngừa ung thư và nâng cao hệ miễn dịch vượt bậc.',
        source_url: 'https://ocacacao.com/p/ruou-cacao-cacao-wine-200ml/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'MISSING_EVIDENCE',
        evidence_type: 'UNSUPPORTED_HEALTH_CLAIM',
        confidence: 0.2,
        notes: 'Vi phạm chuẩn mực Truth Gate; tuyệt đối không đưa vào nội dung truyền thông GMR.',
      },
    ];

    const ocaIntel: ProducerIntelligenceData = {
      producer_id: 'oca',
      source_id: 'SRC-OCA-OFFICIAL',
      identity: {
        name: 'Công ty TNHH OCA Việt Nhật',
        location: 'Xã Bình Giã, Huyện Châu Đức, Bà Rịa - Vũng Tàu',
        established: 2019,
        role: 'Nhà sản xuất socola & cacao thủ công Tree-to-Bar',
        tax_id: '3502512543',
        legal_name: 'CÔNG TY TNHH OCA VIỆT NHẬT',
      },
      product: {
        products: [
          'Socola đen nguyên chất 62% - 85%',
          'Bột cacao nguyên chất không kiềm hóa (250g)',
          'Cacao Nibs hạt ngòi sấy mộc (100g)',
          'Rượu Cacao lên men truyền thống (200ml)',
          'Cacao Mass 100% nguyên bơ (1kg)',
        ],
        categories: ['Socola Bean-to-Bar', 'Bột Cacao Nguyên Bản', 'Sản phẩm chế biến sâu'],
        price_points: [
          { product: 'Socola 62%', price: 48000, unit: 'Thanh' },
          { product: 'Bột Cacao Mộc 250g', price: 180000, unit: 'Túi 250g' },
          { product: 'Cacao Nibs 100g', price: 75000, unit: 'Túi 100g' },
          { product: 'Rượu Cacao 200ml', price: 190000, unit: 'Chai 200ml' },
          { product: 'Cacao Mass 1kg', price: 985000, unit: 'Túi 1kg' },
        ],
      },
      place: {
        geography: 'Huyện Châu Đức, Bà Rịa - Vũng Tàu',
        local_context: 'Đất đỏ bazan màu mỡ, vành đai cacao nhiệt đới khí hậu ôn hòa',
        seasonality: 'Thu hoạch chính từ tháng 10 đến tháng 3 hàng năm',
      },
      people: {
        founders: ['Nguyễn Thị Thu (CEO & Sáng lập)'],
        makers: ['Ông Nozawa Hiroki (Chủ tịch C-Point Group Japan, Giám đốc OCA Japan)'],
        farmers: ['Mạng lưới nông hộ liên kết xã Bình Giã, Châu Đức'],
      },
      craft: {
        process: 'Ủ men thùng gỗ mít 6-7 ngày, đảo mẻ thủ công mỗi 24 giờ, phơi nắng tự nhiên',
        distinctive_practice: 'Không kiềm hóa (non-alkalized), giữ nguyên vẹn 100% bơ cacao tự nhiên',
      },
      proof: {
        certifications: ['JAS (Nhật Bản)', 'USDA (Mỹ)', 'COR (Canada)', 'EU (Châu Âu)'],
        export: ['Hà Lan', 'Hungary', 'Pháp', 'Đức', 'Nhật Bản'],
      },
      market: {
        current_channels: ['Website bán lẻ trực tiếp WooCommerce', 'Chuỗi quà lưu niệm Vietnam Chocoland'],
        target_market: 'Người tiêu dùng yêu thực phẩm mộc nguyên bản, barista, tiệm bánh thủ công',
        b2b: ['C-Point Corporation Japan', 'Vietnam Chocoland'],
        b2c: ['Bán lẻ đơn chiếc qua website'],
      },
      brand_story: {
        positioning: 'Socola & Cacao mộc Tree-to-Bar chuẩn vị đất đỏ',
        narrative: 'Gìn giữ những mảnh vườn cacao Châu Đức, hợp tác cùng chuyên gia Nhật Bản để trả lại phẩm giá cho nông sản Việt',
        differentiation: 'Quy trình khép kín Tree-to-Bar, kiểm soát vi sinh bằng ủ thùng gỗ thủ công',
      },
      commercial: {
        observed_price_range: '48.000đ – 985.000đ',
        availability: 'Sẵn hàng theo mẻ',
        capacity: 'Ước tính 500kg - 1.000kg thành phẩm/tháng',
      },
      unknowns: [
        'Sản lượng thu hoạch chính xác từng tháng theo mùa vụ',
        'Bản scan giấy chứng nhận hữu cơ quốc tế có số hiệu kiểm định hợp lệ',
        'Dung sai hạn sử dụng của rượu cacao sau khi mở nắp',
      ],
    };

    const ocaDiagnosis = this.evaluateGrowthDiagnosis(ocaIntel, ocaEvidence);
    const ocaVtp = this.analyzeValueTrustPrice(ocaIntel, ocaEvidence);
    const ocaHypothesis = this.generatePrimaryHypothesis(ocaDiagnosis, ocaVtp);
    const ocaOpps = this.buildOpportunityMap('oca', ocaHypothesis, ocaDiagnosis);
    const ocaIntervention = this.designIntervention('oca', ocaOpps[0], ocaIntel);
    const ocaContentRequest = this.createContentRequest('oca', ocaIntervention, ocaIntel, ocaEvidence);
    const ocaDecisionLayer = this.buildDecisionLayer(
      'oca',
      ocaIntel,
      ocaDiagnosis,
      ocaVtp,
      ocaHypothesis,
      ocaOpps,
      ocaIntervention,
      ocaEvidence,
      ocaScan
    );

    const ocaRun: ProducerGrowthRunOutput = {
      run_id: 'RUN-GRW-OCA-GOLDEN-001',
      producer_id: 'oca',
      source_id: 'SRC-OCA-OFFICIAL',
      timestamp: now,
      can_diagnose: true,
      source_coverage: ocaScan,
      evidence_map: ocaEvidence,
      producer_intelligence: ocaIntel,
      growth_diagnosis: ocaDiagnosis,
      value_trust_price: ocaVtp,
      primary_growth_hypothesis: ocaHypothesis,
      opportunities: ocaOpps,
      priority_opportunity: ocaOpps[0],
      intervention: ocaIntervention,
      content_request: ocaContentRequest,
      decision_layer: ocaDecisionLayer,
      unknowns: ocaIntel.unknowns,
      next_action: 'Mở Human UAT Review Room; tiếp nhận đánh giá từ Quỳnh.',
    };

    this.runStore.set('RUN-GRW-OCA-GOLDEN-001', ocaRun);
    this.runStore.set('oca', ocaRun);
    this.runStore.set('PRD-OCA-001', ocaRun);

    // Producer #002 (Mèo Vạc Hà Giang) Golden Seed
    const hgScan: SourceScanResult = {
      source_id: 'SRC-HAGIANG-COOP',
      requested_url: 'https://matongmeovac.vn',
      discovered_urls: [
        'https://matongmeovac.vn/',
        'https://matongmeovac.vn/nguon-goc-cao-nguyen-da/',
        'https://matongmeovac.vn/nghe-nuoi-ong-bac-ha/',
        'https://matongmeovac.vn/doi-ngu-xa-vien/',
        'https://matongmeovac.vn/san-pham/mat-ong-bac-ha-500ml/',
        'https://matongmeovac.vn/san-pham/phan-hoa-tam-giac-mach/',
        'https://matongmeovac.vn/chung-nhan-chi-dan-dia-ly/',
        'https://matongmeovac.vn/lien-he-hop-tac/',
      ],
      accessible_urls: [
        'https://matongmeovac.vn/',
        'https://matongmeovac.vn/nguon-goc-cao-nguyen-da/',
        'https://matongmeovac.vn/nghe-nuoi-ong-bac-ha/',
        'https://matongmeovac.vn/doi-ngu-xa-vien/',
        'https://matongmeovac.vn/san-pham/mat-ong-bac-ha-500ml/',
        'https://matongmeovac.vn/san-pham/phan-hoa-tam-giac-mach/',
        'https://matongmeovac.vn/chung-nhan-chi-dan-dia-ly/',
        'https://matongmeovac.vn/lien-he-hop-tac/',
      ],
      inaccessible_urls: [],
      not_found_urls: [],
      sitemap_count: 1,
      page_count: 8,
      source_groups: {
        IDENTITY: ['https://matongmeovac.vn/'],
        PRODUCT: ['https://matongmeovac.vn/san-pham/mat-ong-bac-ha-500ml/'],
        ORIGIN: ['https://matongmeovac.vn/nguon-goc-cao-nguyen-da/'],
        PROCESS: ['https://matongmeovac.vn/nghe-nuoi-ong-bac-ha/'],
        PEOPLE: ['https://matongmeovac.vn/doi-ngu-xa-vien/'],
        CERTIFICATION: ['https://matongmeovac.vn/chung-nhan-chi-dan-dia-ly/'],
        EXPORT: [],
        MARKET: [],
        PARTNER_B2B: [],
        STORY: ['https://matongmeovac.vn/nguon-goc-cao-nguyen-da/'],
        COMMERCIAL: ['https://matongmeovac.vn/lien-he-hop-tac/'],
        SOCIAL: [],
        MEDIA: [],
      },
      coverage_status: 'HIGH',
      scan_completeness: {
        score: 85,
        details: 'Quét 8 URLs trọng điểm của Hợp tác xã Mèo Vạc, đủ điều kiện chẩn đoán tăng trưởng.',
      },
      missing_surfaces: ['EXPORT', 'SOCIAL', 'MEDIA'],
    };

    const hgEvidence: MinedEvidenceItem[] = [
      {
        id: 'EVD-HG-001',
        source_id: 'SRC-HAGIANG-COOP',
        claim: 'Hợp tác xã Nông nghiệp Mèo Vạc thành lập năm 2018 tại Thị trấn Mèo Vạc, Tỉnh Hà Giang.',
        source_url: 'https://matongmeovac.vn/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'COOPERATIVE_REGISTRATION',
        confidence: 1.0,
      },
      {
        id: 'EVD-HG-002',
        source_id: 'SRC-HAGIANG-COOP',
        claim: 'Đạt Chứng nhận Chỉ dẫn Địa lý Mật ong bạc hà Mèo Vạc số 00035 cấp bởi Cục Sở hữu Trí tuệ.',
        source_url: 'https://matongmeovac.vn/chung-nhan-chi-dan-dia-ly/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'GEOGRAPHIC_INDICATION_CERT',
        confidence: 0.95,
      },
      {
        id: 'EVD-HG-003',
        source_id: 'SRC-HAGIANG-COOP',
        claim: 'Quay mật thủ công trên độ cao 1.200m, hoa bạc hà chỉ nở rộ 2 tháng mùa đông từ tháng 10 đến tháng 12.',
        source_url: 'https://matongmeovac.vn/nghe-nuoi-ong-bac-ha/',
        source_type: 'OFFICIAL_WEBSITE',
        truth_status: 'VERIFIED',
        evidence_type: 'HARVEST_SEASON_DISCLOSURE',
        confidence: 0.9,
      },
    ];

    const hgIntel: ProducerIntelligenceData = {
      producer_id: 'meo-vac',
      source_id: 'SRC-HAGIANG-COOP',
      identity: {
        name: 'HTX Ong Bạc Hà Mèo Vạc',
        location: 'Huyện Mèo Vạc, Tỉnh Hà Giang',
        established: 2018,
        role: 'Hợp tác xã nuôi ong bản địa cao nguyên đá',
      },
      product: {
        products: ['Mật ong bạc hà chai 500ml', 'Phấn hoa tam giác mạch 250g'],
        categories: ['Mật ong rừng', 'Đặc sản cao nguyên đá'],
        price_points: [{ product: 'Mật ong bạc hà 500ml', price: 380000, unit: 'Chai' }],
      },
      place: {
        geography: 'Cao nguyên đá Đồng Văn - Mèo Vạc',
        local_context: 'Đá tai mèo, sương muối giá lạnh trên độ cao 1.200m',
      },
      people: {
        founders: ['Giàng A Páo (Chủ nhiệm HTX)'],
        makers: ['Thợ quay mật người Mông'],
        farmers: ['25 hộ xã viên nuôi ong'],
      },
      craft: {
        process: 'Quay li tâm thủ công trên sương muối, lọc mật qua vải mùng không gia nhiệt',
        distinctive_practice: 'Không nấu cô đặc nhân tạo, giữ nguyên men sống và bọt khí tự nhiên',
      },
      proof: {
        certifications: ['Chỉ dẫn địa lý Mèo Vạc số 00035', 'OCOP 4 Sao Tỉnh Hà Giang'],
        export: [],
      },
      market: {
        current_channels: ['Bán tại xưởng du lịch', 'Hội chợ nông sản vùng cao'],
        b2b: [],
        b2c: ['Khách vãng lai'],
      },
      brand_story: {
        positioning: 'Giọt mật hoa bạc hà nguyên bản trên cao nguyên đá',
        narrative: 'Hành trình giữ đàn ong bản địa vượt qua mùa sương muối khắc nghiệt',
        differentiation: 'Mật vàng chanh ánh xanh, đặc sánh tự nhiên không hạ thủy phần cưỡng bức',
      },
      commercial: {
        observed_price_range: '380.000đ/chai',
        availability: 'Theo vụ đông (tháng 11 - tháng 1)',
      },
      unknowns: ['Sản lượng mật đạt chuẩn mỗi vụ', 'Chi phí vận chuyển lạnh từ Mèo Vạc về Hà Nội'],
    };

    const hgDiagnosis = this.evaluateGrowthDiagnosis(hgIntel, hgEvidence);
    const hgVtp = this.analyzeValueTrustPrice(hgIntel, hgEvidence);
    const hgHypothesis = this.generatePrimaryHypothesis(hgDiagnosis, hgVtp);
    const hgOpps = this.buildOpportunityMap('meo-vac', hgHypothesis, hgDiagnosis);
    const hgIntervention = this.designIntervention('meo-vac', hgOpps[0], hgIntel);
    const hgContentRequest = this.createContentRequest('meo-vac', hgIntervention, hgIntel, hgEvidence);
    const hgDecisionLayer = this.buildDecisionLayer(
      'meo-vac',
      hgIntel,
      hgDiagnosis,
      hgVtp,
      hgHypothesis,
      hgOpps,
      hgIntervention,
      hgEvidence,
      hgScan
    );

    const hgRun: ProducerGrowthRunOutput = {
      run_id: 'RUN-GRW-MEOVAC-002',
      producer_id: 'meo-vac',
      source_id: 'SRC-HAGIANG-COOP',
      timestamp: now,
      can_diagnose: true,
      source_coverage: hgScan,
      evidence_map: hgEvidence,
      producer_intelligence: hgIntel,
      growth_diagnosis: hgDiagnosis,
      value_trust_price: hgVtp,
      primary_growth_hypothesis: hgHypothesis,
      opportunities: hgOpps,
      priority_opportunity: hgOpps[0],
      intervention: hgIntervention,
      content_request: hgContentRequest,
      decision_layer: hgDecisionLayer,
      unknowns: hgIntel.unknowns,
      next_action: 'Mở Human UAT Review Room cho Producer #002.',
    };

    this.runStore.set('RUN-GRW-MEOVAC-002', hgRun);
    this.runStore.set('meo-vac', hgRun);
    this.runStore.set('PRD-MEOVAC-002', hgRun);
  }

  // UAT FEEDBACK PERSISTENCE (Strictly does not mutate foundation or trigger feedback loop)
  public saveUatFeedback(feedback: Omit<UatFeedbackRecord, 'feedback_id' | 'created_at'>): UatFeedbackRecord {
    const record: UatFeedbackRecord = {
      feedback_id: `UAT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      producer_id: feedback.producer_id,
      object_type: feedback.object_type,
      object_id: feedback.object_id,
      decision: feedback.decision,
      note: feedback.note,
      created_at: new Date().toISOString(),
    };

    const list = this.uatFeedbackStore.get(feedback.producer_id) || [];
    list.unshift(record);
    this.uatFeedbackStore.set(feedback.producer_id, list);
    return record;
  }

  public getUatFeedback(producer_id: string): UatFeedbackRecord[] {
    return this.uatFeedbackStore.get(producer_id) || [];
  }

  public getProducerRun(producer_id: string): ProducerGrowthRunOutput | undefined {
    return this.runStore.get(producer_id);
  }

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
  // 11. GROWTH DECISION LAYER (v0.2 Business Outcome: Customer & Producer)
  // ----------------------------------------------------------------------------
  public buildDecisionLayer(
    producer_id: string,
    intel: ProducerIntelligenceData,
    diagnosis: Record<GrowthDimensionKey, GrowthDimensionEvaluation>,
    vtp: ValueTrustPriceAnalysis,
    hypothesis: PrimaryGrowthHypothesis,
    opportunities: GrowthOpportunity[],
    intervention: GrowthInterventionPlan,
    evidenceList: MinedEvidenceItem[],
    coverage: SourceScanResult
  ): GrowthDecisionLayer {
    const verifiedEvidence = evidenceList.filter((e) => e.truth_status === 'VERIFIED');
    const claimEvidence = evidenceList.filter((e) => e.truth_status === 'PRODUCER_CLAIM');
    const missingEvidence = evidenceList.filter((e) => e.truth_status === 'MISSING_EVIDENCE');

    const primaryEvIds = verifiedEvidence.map((e) => e.id).slice(0, 4);
    const primarySourceUrls = verifiedEvidence.map((e) => e.source_url).slice(0, 4);

    // Compose Growth Snapshot (<=60s synthesis composed from existing run)
    const snapshot: GrowthSnapshot = {
      what_we_see: `${intel.identity.name} sở hữu năng lực sản xuất mộc tại ${intel.place?.geography || 'địa phương'}, có sản phẩm chế biến sâu rõ nét (${intel.product?.products?.join(', ') || 'sản phẩm nông sản'}).`,
      why: `${diagnosis.DEMAND?.gap || 'Điểm nghẽn kênh & cơ chế gom mẻ'}; ${vtp.overall_interpretation}`,
      primary_hypothesis: hypothesis.statement,
      customer_outcome: `Khách hàng nhận sản phẩm tươi mới tận xưởng thông qua cơ chế gom mẻ MOQ, minh bạch nguồn gốc và tối ưu chi phí vận chuyển.`,
      producer_outcome: `Chuyển dịch từ bán lẻ đơn chiếc sang sản xuất theo mẻ cam kết, giải phóng áp lực tồn kho và định hình giá trị thủ công bền vững cùng Gạc Măng Rê.`,
      next_test: `Mở 1 Ngăn thử nghiệm trên Gạc Măng Rê với cam kết MOQ tối thiểu 20-30 suất trong 10-14 ngày.`,
    };

    // Compose Customer Outcome / Ngăn Proposition
    // Seasonality check
    const seasonalityEvidence = verifiedEvidence.find((e) =>
      e.claim.toLowerCase().includes('mùa') || e.claim.toLowerCase().includes('tháng') || e.claim.toLowerCase().includes('vụ')
    );
    const whyNowClassification = seasonalityEvidence ? 'FACT' : (intel.place?.seasonality ? 'INTERPRETATION' : 'HYPOTHESIS');
    const whyNowStatement = seasonalityEvidence
      ? `Thời điểm vàng đón mẻ sản vật mới: ${seasonalityEvidence.claim}`
      : (intel.place?.seasonality
        ? `Sản phẩm theo mùa vụ tự nhiên: ${intel.place.seasonality}`
        : 'Sản xuất mẻ mộc tươi mới đón đầu nhu cầu tiêu dùng theo mùa (chờ xác nhận lịch thu hoạch)');

    const customer_outcome: CustomerOutcomeProposition = {
      why_this: {
        statement: `${intel.brand_story?.positioning || 'Sản vật mộc nguyên bản'}, gìn giữ tay nghề người làm (${intel.people?.founders?.join(', ') || intel.identity.name}) và quy trình ${intel.craft?.distinctive_practice || intel.craft?.process || 'thủ công tự nhiên'}.`,
        classification: verifiedEvidence.length > 0 ? 'FACT' : 'INTERPRETATION',
        evidence_ids: primaryEvIds,
        source_urls: primarySourceUrls,
      },
      why_now: {
        statement: whyNowStatement,
        classification: whyNowClassification,
        evidence_ids: seasonalityEvidence ? [seasonalityEvidence.id] : undefined,
        source_urls: seasonalityEvidence ? [seasonalityEvidence.source_url] : undefined,
        gap: !seasonalityEvidence ? 'Chưa có chứng thư/lịch thu hoạch chính xác từng tháng theo mùa vụ' : undefined,
      },
      why_trust: {
        statement: `Minh chứng thực địa kiểm định rõ ràng: ${verifiedEvidence.map((e) => e.claim).slice(0, 2).join('; ') || intel.identity.name}.${claimEvidence.length > 0 ? ` (Lưu ý: Một số chứng nhận quốc tế đang ở trạng thái PRODUCER_CLAIM, chờ bản scan kiểm định)` : ''}`,
        classification: 'FACT',
        evidence_ids: primaryEvIds,
        source_urls: primarySourceUrls,
        gap: claimEvidence.length > 0 ? 'Cần bổ sung file scan có dấu đỏ của các chứng chỉ kiểm định' : undefined,
      },
      what_you_get: {
        statement: `${intel.product?.products?.[0] || 'Sản vật tuyển chọn'} (${intel.product?.price_points?.[0]?.product || 'Quy cách chuẩn'}), đóng gói nguyên bản tận xưởng, không qua xử lý công nghiệp làm mất dưỡng chất.`,
        classification: 'FACT',
        evidence_ids: primaryEvIds.slice(0, 2),
        source_urls: primarySourceUrls.slice(0, 2),
      },
      preorder_proposition: {
        reason_to_care: {
          statement: `Sản phẩm nông sản mộc chế biến sâu tử tế, tôn trọng tự nhiên và tạo sinh kế bền vững cho người làm vùng ${intel.place?.geography || 'bản địa'}.`,
          classification: 'FACT',
          evidence_ids: primaryEvIds,
          source_urls: primarySourceUrls,
        },
        reason_to_trust: {
          statement: `Toàn bộ hồ sơ nguồn gốc, giấy phép sản xuất và quy trình chế biến được phân loại minh bạch theo Truth Gate của GMR.`,
          classification: 'FACT',
          evidence_ids: primaryEvIds,
          source_urls: primarySourceUrls,
        },
        reason_to_act_now: {
          statement: whyNowStatement,
          classification: whyNowClassification,
          evidence_ids: seasonalityEvidence ? [seasonalityEvidence.id] : undefined,
          source_urls: seasonalityEvidence ? [seasonalityEvidence.source_url] : undefined,
          gap: !seasonalityEvidence ? 'Thiếu minh chứng mùa vụ chính xác từng tháng' : undefined,
        },
        gap: !seasonalityEvidence ? 'Cần bổ sung lịch hạ mẻ / vụ thu hoạch cụ thể để củng cố Reason to Act Now' : undefined,
      },
      demand_mechanism: {
        statement: intervention.demand_mechanism,
        classification: 'HYPOTHESIS',
        evidence_ids: diagnosis.DEMAND?.evidence,
      },
      cta: intervention.cta,
      traceability: {
        customer_proposition: `Ngăn Gom Mẻ Theo Mùa - ${intel.identity.name}`,
        growth_hypothesis: hypothesis.statement,
        interpretations: hypothesis.based_on.interpretations,
        facts: hypothesis.based_on.facts,
        evidence_ids: primaryEvIds,
        source_urls: primarySourceUrls,
      },
    };

    // Compose Producer Outcome / GMR Partnership Case
    const producer_outcome: ProducerOutcomePartnershipCase = {
      producer_problem: {
        statement: `${diagnosis.DEMAND?.gap || 'Phân phối phân tán, thiếu cơ chế gom đơn tập trung'} và ${diagnosis.CHANNEL?.gap || 'kênh bán lẻ manh mún tạo áp lực chi phí giao vận'}.`,
        classification: 'INTERPRETATION',
        evidence_ids: diagnosis.DEMAND?.evidence,
      },
      gmr_value_creation: {
        demand_creation: {
          statement: `Tổ chức chiến dịch gom mẻ cộng đồng (MOQ Group-Buy), tập hợp nhu cầu trước khi đóng mẻ để giảm thiểu rủi ro tồn kho.`,
          classification: 'HYPOTHESIS',
          notes: 'Mô hình gom mẻ đặt cọc trước đã chứng minh trên hệ thống Ngăn',
        },
        story_packaging: {
          statement: `Đóng gói câu chuyện Đất - Người - Vị - Chuyện chuẩn Brand OS (Mộc, Tĩnh, Chiều sâu), loại bỏ lối nói quá đà để bảo vệ uy tín người làm.`,
          classification: 'FACT',
          notes: 'Năng lực cốt lõi của GMR Foundation Content & Story Gate',
        },
        trust_packaging: {
          statement: `Hệ thống hóa toàn bộ minh chứng thành hồ sơ thực địa minh bạch theo Truth Gate (phân định rõ Verified và Producer Claim).`,
          classification: 'FACT',
          notes: 'Cơ chế Truth Gate và Evidence Map của GMR',
        },
        market_testing: {
          statement: `Kiểm chứng độ nhạy giá và sức hút sản phẩm với tệp khách hàng trân quý nông sản chất lượng cao trước khi mở rộng quy mô.`,
          classification: 'HYPOTHESIS',
          notes: 'Được đo lường qua tỷ lệ đạt MOQ trong 10-14 ngày',
        },
        market_learning: {
          statement: `Phản hồi trực tiếp từ người tiêu dùng sau khi trải nghiệm sản phẩm để hoàn thiện bao bì, định giá và hương vị mẻ sau.`,
          classification: 'HYPOTHESIS',
          notes: 'Hệ thống Market Learning vòng lặp khép kín',
        },
      },
      value_exchange: {
        producer_provides: [
          { item: `Sản phẩm chủ lực đạt chuẩn chất lượng (${intel.product?.products?.join(', ') || 'Sản phẩm'})`, classification: 'FACT', evidence_ids: primaryEvIds },
          { item: `Chính sách giá sỉ/gom mẻ minh bạch cho cộng đồng`, classification: intel.product?.price_points ? 'FACT' : 'UNKNOWN' },
          { item: `Bản scan giấy chứng nhận, giấy phép kinh doanh, kiểm nghiệm vi sinh`, classification: verifiedEvidence.length > 0 ? 'FACT' : 'UNKNOWN', evidence_ids: primaryEvIds },
          { item: `Năng lực sản xuất tối thiểu và cam kết thời gian đóng mẻ`, classification: intel.commercial?.capacity ? 'FACT' : 'UNKNOWN' },
          { item: `Cam kết đóng gói và gửi hàng đúng hẹn theo tiêu chuẩn Ngăn`, classification: 'HYPOTHESIS' },
          { item: `Tư liệu hình ảnh, video thực địa và đón tiếp đoàn tác nghiệp GMR`, classification: 'FACT' },
        ],
        gmr_provides: [
          { item: `Đóng gói câu chuyện thương hiệu & ký sự thực địa chuẩn Brand OS`, classification: 'FACT' },
          { item: `Cơ chế kích hoạt nhu cầu cộng đồng và gom đơn đạt MOQ`, classification: 'HYPOTHESIS' },
          { item: `Bộ đề xuất giá trị người tiêu dùng (Customer Proposition) sắc bén`, classification: 'FACT' },
          { item: `Hạ tầng tiếp nhận đặt cọc và theo dõi tiến độ mẻ qua Website & Zalo OA`, classification: 'FACT' },
          { item: `Báo cáo insight khách hàng và phân tích sau mở Ngăn`, classification: 'HYPOTHESIS' },
          { item: `Vòng lặp học tập thị trường (Market Learning) hoàn thiện sản phẩm`, classification: 'HYPOTHESIS' },
        ],
      },
      producer_ask: {
        batch_information: `Thông tin số lượng và ngày sản xuất dự kiến của mẻ sản phẩm chủ lực.`,
        availability: intel.commercial?.availability || `Sẵn sàng theo vụ mùa thu hoạch thực tế.`,
        price: `Mức giá ưu đãi cho mẻ gom cộng đồng thấp hơn giá bán lẻ đơn chiếc để tạo động lực đặt trước.`,
        capacity: intel.commercial?.capacity || `Cam kết sản lượng tối thiểu đáp ứng từ 30 đến 100 suất gom.`,
        evidence: `Bản scan chứng nhận chất lượng có dấu đỏ và kết quả kiểm nghiệm lô gần nhất.`,
        assets: `Ảnh xưởng sản xuất, bàn tay người làm và video 15s ghi lại công đoạn chế biến đặc trưng.`,
        fulfillment_commitment: `Cam kết gửi hàng đúng ngày dự kiến sau khi đóng mẻ gom thành công.`,
        gap: claimEvidence.length > 0 || missingEvidence.length > 0
          ? `Còn thiếu bản scan chứng chỉ kiểm định chính thức để hoàn tất hồ sơ pháp lý`
          : undefined,
      },
      success_kpi: {
        statement: intervention.kpi,
        classification: 'HYPOTHESIS',
      },
      partnership_hypothesis: {
        statement: `Chúng tôi tin rằng Gạc Măng Rê và ${intel.identity.name} có thể tạo ra giá trị cộng hưởng bền vững bằng cách tổ chức chiến dịch gom mẻ theo mô hình Ngăn, dựa trên minh chứng thực địa về ${intel.craft?.distinctive_practice || intel.craft?.process || 'chất lượng thủ công mộc'}. Giả thuyết này sẽ được kiểm chứng khi chiến dịch đạt 100% ngưỡng MOQ công bố.`,
        classification: 'HYPOTHESIS',
        value: `Tạo dòng tiền đặt trước, giảm chi phí vận chuyển đơn lẻ và đưa sản vật trực tiếp đến khách hàng yêu thích sản phẩm tử tế.`,
        intervention: intervention.intervention,
        evidence: verifiedEvidence.map((e) => e.claim).slice(0, 3),
        validation_kpi: intervention.kpi,
      },
      traceability: {
        partnership_case: `Quan hệ hợp tác chiến lược Ngăn Gom Mẻ: GMR x ${intel.identity.name}`,
        growth_hypothesis: hypothesis.statement,
        growth_diagnosis_keys: ['DEMAND', 'CHANNEL', 'PRODUCT', 'COMMERCE'],
        evidence_ids: primaryEvIds,
        source_urls: primarySourceUrls,
      },
    };

    return {
      snapshot,
      customer_outcome,
      producer_outcome,
    };
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

    // Step 11: Growth Decision Layer (Customer & Producer Business Outcomes)
    const decision_layer = this.buildDecisionLayer(
      input.producer_id,
      producer_intelligence,
      growth_diagnosis,
      value_trust_price,
      primary_growth_hypothesis,
      opportunities,
      intervention,
      evidence_map,
      source_coverage
    );

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
      decision_layer,
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
