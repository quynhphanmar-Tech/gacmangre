import { SourceProfile, CurationStatus, GmrScorecard } from '@/types';
import { mockSources } from '@/lib/data/mock-sources';

// In-Memory store for sources
let sourcesStore: SourceProfile[] = [...mockSources];

export async function getAllSources(): Promise<SourceProfile[]> {
  return sourcesStore;
}

export async function getSourceById(id: string): Promise<SourceProfile | null> {
  const found = sourcesStore.find(
    (s) => s.id === id || s.experiment_id === id || s.product_name.toLowerCase().includes(id.toLowerCase())
  );
  return found || null;
}

export async function createSourceFromInput(input: {
  url?: string;
  notes?: string;
  producer_name?: string;
  category?: string;
}): Promise<SourceProfile> {
  const newId = `src-${Date.now()}`;
  const producerName = input.producer_name || (input.url ? new URL(input.url).hostname : 'Nhà sản xuất mới');

  // Automatic prototype extraction & heuristic score
  const newProfile: SourceProfile = {
    id: newId,
    status: 'NEW',
    input_url: input.url,
    raw_input_notes: input.notes,
    producer_name: producerName,
    location: 'Chưa xác định (Cần xác thực)',
    source_urls: input.url ? [input.url] : [],
    category: input.category || 'CHƯA PHÂN LOẠI',
    product_name: `Sản vật tiềm năng từ ${producerName}`,
    product_description: input.notes || 'Hồ sơ mới tiếp nhận, chờ trích xuất dữ liệu.',
    province: 'Chưa rõ',
    raw_material_origin: 'Chưa rõ',
    producer_person: 'Chưa rõ',
    producer_story: 'Chưa rõ',
    production_method: 'Chưa rõ',
    distinctive_practice: 'Chưa rõ',
    certifications: [],
    documents: [],
    source_claims: input.notes ? [input.notes] : [],
    references: input.url ? [input.url] : [],
    media_assets: [],
    facts: [
      {
        field: 'Nguồn tiếp nhận',
        value: input.url || 'Ghi chú nội bộ',
        provenance: 'SOURCE_INFERRED',
      },
    ],
    missing_fields: [
      'Địa chỉ vùng nguyên liệu cụ thể',
      'Người đại diện sản xuất',
      'Quy trình canh tác / chế biến đặc trưng',
      'Giấy tờ kiểm định chất lượng',
      'Quy cách thương mại và giá thành'
    ],
    scorecard: {
      origin: 5.0,
      human: 5.0,
      craft: 5.0,
      distinctiveness: 5.0,
      story_potential: 6.0,
      proof: 2.0,
      product_quality_signal: 5.0,
      commercial_readiness: 4.0,
      supply_reliability: 5.0,
      gmr_fit_score: 4.7,
      strengths: ['Nguồn nguyên liệu mới phát hiện'],
      weaknesses: ['Dữ liệu ban đầu còn sơ khai, thiếu chứng từ kiểm chứng'],
      evaluation_summary: 'Hồ sơ mới tạo, cần chuyển sang trạng thái REVIEWING để bổ sung thông tin.',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  sourcesStore.unshift(newProfile);
  return newProfile;
}

export async function updateSourceStatus(
  id: string,
  newStatus: CurationStatus,
  notes?: string
): Promise<SourceProfile | null> {
  const source = sourcesStore.find((s) => s.id === id);
  if (!source) return null;

  source.status = newStatus;
  source.updated_at = new Date().toISOString();
  if (notes) {
    source.scorecard.evaluation_summary = `${notes} (Cập nhật lúc ${new Date().toLocaleTimeString('vi-VN')})`;
  }

  return source;
}
