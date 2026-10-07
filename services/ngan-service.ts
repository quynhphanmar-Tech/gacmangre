import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockNgans, mockNgan001 } from '@/lib/data/mock-data';
import { Ngan } from '@/types';

export async function getNganBySlug(slug: string): Promise<Ngan | null> {
  // Check mock store first for fast zero-failure fallback
  const normalized = slug.trim().toLowerCase();
  const mockFound = mockNgans.find(
    (n) =>
      n.slug.toLowerCase() === normalized ||
      n.number.toLowerCase() === normalized ||
      n.number.replace('#', '').toLowerCase() === normalized ||
      n.id === slug
  );

  if (mockFound) {
    return mockFound;
  }

  if (!isSupabaseConfigured || !supabase) {
    return mockNgans[0] || mockNgan001;
  }

  const { data, error } = await supabase
    .from('ngans')
    .select(`
      *,
      product:products(
        *,
        producer:producers(*)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return mockNgans[0] || mockNgan001;
  }

  return data as Ngan;
}

export async function getActiveNgans(): Promise<Ngan[]> {
  const activeStatuses = ['OPEN', 'FULL', 'PRODUCER_CONFIRMING', 'PRODUCTION'];

  if (!isSupabaseConfigured || !supabase) {
    return mockNgans.filter((n) => activeStatuses.includes(n.status));
  }

  const { data, error } = await supabase
    .from('ngans')
    .select(`
      *,
      product:products(
        *,
        producer:producers(*)
      )
    `)
    .in('status', activeStatuses)
    .order('number', { ascending: true });

  if (error || !data || data.length === 0) {
    return mockNgans.filter((n) => activeStatuses.includes(n.status));
  }

  return data as Ngan[];
}

export interface NganCtaSpec {
  ctaText: string;
  isOrderable: boolean;
  explanationText?: string;
}

/**
 * State-derived UI rule: CTA derives directly from NganStatus.
 * DISCOVERY / DRAFT -> "TÌM HIỂU CÂU CHUYỆN"
 * OPEN / DEMAND     -> "CÙNG MỞ NGĂN" (hoặc "MỞ NGĂN")
 * FULL / OPENED     -> "NGĂN ĐÃ MỞ" (hoặc "ĐỦ MẺ — CHỜ XÁC NHẬN")
 * SHIPPING          -> "NGĂN ĐANG VỀ"
 * COMPLETED         -> "CHIA SẺ HẬU VỊ"
 * CANCELLED / EXPIRED -> "NGĂN ĐÃ ĐÓNG"
 */
export function getNganCtaSpec(ngan: Ngan): NganCtaSpec {
  switch (ngan.status) {
    case 'OPEN':
      return {
        ctaText: 'CÙNG MỞ NGĂN',
        isOrderable: true,
        explanationText: 'Thanh toán khi đủ ngăn • Cập nhật qua Zalo OA',
      };
    case 'FULL':
    case 'PRODUCER_CONFIRMING':
      return {
        ctaText: 'NGĂN ĐÃ MỞ',
        isOrderable: false,
        explanationText: 'Mẻ đã đạt 100% người cùng mở • Nhà sản xuất đang chuẩn bị thu hoạch',
      };
    case 'PRODUCTION':
      return {
        ctaText: 'NGĂN ĐANG LÊN MEN / CHẾ BIẾN',
        isOrderable: false,
        explanationText: 'Sản vật đang được đóng mẻ theo tiêu chuẩn thủ công',
      };
    case 'SHIPPING':
      return {
        ctaText: 'NGĂN ĐANG VỀ',
        isOrderable: false,
        explanationText: 'Chuyến xe vận chuyển đang lăn bánh từ vùng đất về kho',
      };
    case 'COMPLETED':
      return {
        ctaText: 'CHIA SẺ HẬU VỊ CỦA NGĂN',
        isOrderable: false,
        explanationText: 'Ngăn đã hoàn thành phân phối • Đang chờ mùa vụ tiếp theo',
      };
    case 'DRAFT':
    case 'PUBLISHED':
      return {
        ctaText: 'TÌM HIỂU CÂU CHUYỆN',
        isOrderable: false,
        explanationText: 'Ngăn đang trong giai đoạn tiền thẩm định vùng đất',
      };
    case 'EXPIRED':
    case 'CANCELLED':
    default:
      return {
        ctaText: 'NGĂN ĐÃ ĐÓNG',
        isOrderable: false,
        explanationText: 'Đợt mở đã kết thúc',
      };
  }
}

