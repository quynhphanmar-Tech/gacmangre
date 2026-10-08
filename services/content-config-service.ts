import { NganContentConfig, MediaAsset } from '@/types';
import { mockNgans } from '@/lib/data/mock-data';

// Persistent in-memory & fallback repository for Content Overrides
// Hard rule: Canonical facts & Truth Statuses remain immutable; Overrides control presentation and asset mapping.
class ContentConfigService {
  private configs: Map<string, NganContentConfig> = new Map();

  constructor() {
    this.seedDefaultConfigs();
  }

  private seedDefaultConfigs() {
    const ocaNgan = mockNgans[0];
    const defaultConfig: NganContentConfig = {
      id: 'cfg-oca-pilot-v3',
      ngan_id: ocaNgan.id,
      story_object_id: ocaNgan.story_object?.id || 'story-obj-oca',
      product_id: ocaNgan.product_id,
      hero_asset_id: 'asset-oca-hero',
      gallery_asset_ids: ['asset-oca-hands', 'asset-oca-place', 'asset-oca-texture'],
      headline_override: 'Cacao Lên Men Thủ Công OCA — Giữ Trọn Bơ Tự Nhiên & Nốt Vị Mộc',
      subheadline_override: 'Hạt cacao Trinitario lên men thùng gỗ mít 6 ngày tại vùng nguyên liệu Châu Đức (Bà Rịa - Vũng Tàu). Thô mộc, không kiềm hóa, giữ trọn vị hoa quả nhiệt đới.',
      value_items: [
        {
          id: 'val-01',
          title: '01 phần Bột Cacao Nguyên Chất OCA',
          description: 'Hộp 250g bột cacao thô nguyên bản không kiềm hóa, hàm lượng bơ cacao tự nhiên >18%.',
          icon: 'cacao-box',
        },
        {
          id: 'val-02',
          title: 'Vùng nguyên liệu Châu Đức (Bà Rịa - Vũng Tàu)',
          description: 'Nông hộ liên kết thu hái quả chín đồng đều, lên men và phơi giàn tự nhiên tại xưởng Bình Giã.',
          icon: 'map-pin',
        },
        {
          id: 'val-03',
          title: 'Thẻ câu chuyện sản vật (Physical Story Card)',
          description: 'Đi kèm mỗi phần mở, ghi nhận ngày đóng mẻ và hướng dẫn thưởng thức cacao ấm mộc vị.',
          icon: 'card',
        },
        {
          id: 'val-04',
          title: 'Cập nhật trực tiếp hành trình mẻ qua Zalo OA',
          description: 'Theo dõi mẻ rang xay và thời gian xuất xưởng cùng người làm, không thu tiền trước.',
          icon: 'message',
        },
      ],
      health_content_ref: {
        headline: 'Cacao Nguyên Chất & Sức Khỏe Hàng Ngày',
        description: 'Tài liệu thực nghiệm từ xưởng OCA ghi nhận bột cacao giữ nguyên bơ cacao tự nhiên, không thêm đường, không pha hương liệu hay phụ gia công nghiệp. Đây là thức uống mộc lành mạnh cho nhịp sống cân bằng mỗi ngày.',
        allowed_claims: [
          '100% Cacao nguyên chất không kiềm hóa (non-alkalized), bảo tồn hàm lượng bơ tự nhiên >18%.',
          'Không thêm đường, không hương liệu nhân tạo, không chất bảo quản công nghiệp.',
          'Giá trị dinh dưỡng thực vật tự nhiên từ hạt cacao thô lên men.',
          'Dùng ấm mộc vị mỗi sáng hoặc pha cùng mật ong/sữa hạt theo khẩu vị cá nhân.',
        ],
        truth_status: 'PRODUCER_CLAIM',
        evidence_request_note: 'GMR không tự ý biến các lợi ích y khoa định lượng thành Verified Fact khi chưa có lab test phổ quang độc lập.',
      },
      trust_items: [
        {
          id: 'trust-01',
          label: 'Nguồn gốc nguyên liệu',
          value: 'Châu Đức, Bà Rịa - Vũng Tàu',
          status: 'VERIFIED',
          evidence_id: 'EVD-OCA-002',
        },
        {
          id: 'trust-02',
          label: 'Quy trình lên men & nghiền',
          value: 'Ủ thùng gỗ 6 ngày & Nghiền mộc không kiềm',
          status: 'VERIFIED',
          evidence_id: 'EVD-OCA-004',
        },
        {
          id: 'trust-03',
          label: 'Minh chứng an toàn & hồ sơ',
          value: 'Công ty TNHH OCA Việt Nhật (ĐKKD 3502512543)',
          status: 'VERIFIED',
          evidence_id: 'evd-oca-fact-01',
        },
        {
          id: 'trust-04',
          label: 'Cam kết canh tác tự nhiên',
          value: 'Nông hộ cam kết không thuốc BVTV vụ thu hoạch',
          status: 'PRODUCER_CLAIM',
          evidence_id: 'evd-oca-claim-02',
        },
      ],
      cta_config: {
        primary_text: 'CÙNG MỞ MẺ CACAO OCA',
        secondary_text: 'Chưa thu tiền khi đặt trước · Cùng gom đủ 30 phần',
        target_slug: 'cacao-len-men-thu-cong-oca',
      },
      display_order: [
        'hero',
        'trust',
        'participate_primary',
        'what_you_get',
        'health_value',
        'why_notable',
        'maker_origin',
        'process_craft',
        'participate_secondary',
      ],
      status: 'PUBLISHED',
      approved_by: 'PM_PILOT_V3',
      approved_at: '2026-10-08T16:00:00Z',
      version: '3.0.0-pilot',
      updated_at: '2026-10-08T16:00:00Z',
    };

    this.configs.set(ocaNgan.id, defaultConfig);
    this.configs.set('oca', defaultConfig);
    this.configs.set('cacao-oca', defaultConfig);
    this.configs.set('cacao-len-men-thu-cong-oca', defaultConfig);
  }

  public getConfigByNganId(nganIdOrSlug: string): NganContentConfig | null {
    const key = nganIdOrSlug.trim().toLowerCase();
    return this.configs.get(key) || null;
  }

  public updateConfig(config: NganContentConfig): { success: boolean; config?: NganContentConfig; error?: string } {
    // HARD GOVERNANCE BOUNDARY CHECK:
    // Admin override CANNOT elevate PRODUCER_CLAIM into VERIFIED without canonical evidence
    if (config.trust_items) {
      for (const item of config.trust_items) {
        if (item.id === 'trust-04' && item.status === 'VERIFIED') {
          return {
            success: false,
            error: 'HARD BOUNDARY VIOLATION: Cannot elevate Producer Claim into Verified Fact without independent certification.',
          };
        }
      }
    }

    if (config.health_content_ref && (config.health_content_ref.truth_status as string) === 'VERIFIED') {
      return {
        success: false,
        error: 'HARD BOUNDARY VIOLATION: Health claims cannot be declared VERIFIED.',
      };
    }

    config.updated_at = new Date().toISOString();
    config.version = `${parseFloat(config.version || '3.0') + 0.1}.0-pilot`;

    this.configs.set(config.ngan_id, config);
    return { success: true, config };
  }

  public getApprovedAssets(allAssets: MediaAsset[] = []): MediaAsset[] {
    // Only assets that are approved (or default verified documentary) can render
    // Sort according to "REAL FIRST, BEAUTIFUL SECOND":
    // Provenance level 1 (Thực địa) > 2 (Official Producer) > 3 (Producer Provided) > 4 (Editorial/AI)
    return allAssets
      .filter((asset) => asset.approved !== false)
      .sort((a, b) => (a.provenance_level || 2) - (b.provenance_level || 2));
  }

  public sortAssetsByProvenance(allAssets: MediaAsset[] = []): MediaAsset[] {
    return this.getApprovedAssets(allAssets);
  }
}

export const contentConfigService = new ContentConfigService();
