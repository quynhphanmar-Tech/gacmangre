import { M4Experiment, DailySnapshot } from '@/types';
import { mockNgans, mockOrdersStore } from '@/lib/data/mock-data';

// ==============================================================================
// GẠC MĂNG RÊ — M4 LIVE VALIDATION DATA STORE
// 3 Active Live Experiments (GM-LIVE-01-001, 002, 003)
// ==============================================================================

export const initialM4Experiments: M4Experiment[] = [
  // ----------------------------------------------------------------------------
  // Experiment 1: Cacao OCA (#001)
  // ----------------------------------------------------------------------------
  {
    experiment_id: 'GM-LIVE-01-001',
    ngan_id: 'ngan-live-001',
    ngan_number: '#001',
    ngan_slug: 'cacao-len-men-thu-cong-oca',
    product_name: 'Cacao Lên Men Thủ Công OCA',
    producer_name: 'Đội ngũ Cacao OCA',
    gmr_fit_score: 8.6,
    status: 'ACTIVE',
    start_date: '2026-10-06T00:00:00Z',
    days_live: 1,
    ngan_views: 142,
    cta_clicks: 38,
    orders: 12,
    confirmed_quantity: 18,
    moq: 30,
    shares: 9,
    demand_velocity: 18.0,
    story_to_open_rate: 0.267,
    open_to_demand_rate: 0.126,
    progress_percent: 60,
    top_traffic_sources: [
      { source: 'facebook', orders: 7, views: 82 },
      { source: 'instagram', orders: 3, views: 35 },
      { source: 'direct', orders: 2, views: 25 },
    ],
    content_angles: [
      {
        id: 'angle-oca-a',
        type: 'VUNG_DAT',
        headline: 'Đất đỏ Ea Kar và giống cacao không qua kiềm hóa',
        hook: 'Tại sao thổ nhưỡng Đắk Lắk lại giữ được lượng bơ cacao tự nhiên béo ngậy?',
        utm_content: 'vung_dat_ea_kar',
        clicks: 18,
      },
      {
        id: 'angle-oca-b',
        type: 'CON_NGUOI',
        headline: 'Những người trẻ chọn ở lại học cách làm cacao mộc',
        hook: 'Khi người nông dân không còn phải bán tháo hạt cacao xô cho thương lái.',
        utm_content: 'nguoi_tre_oca',
        clicks: 14,
      },
      {
        id: 'angle-oca-c',
        type: 'CHI_TIET',
        headline: 'Mùi chuối chín trong thùng gỗ ủ men 6 ngày',
        hook: 'Mỗi buổi sáng hé nắp thùng mít để đón nhận một mùi hương hoàn toàn khác biệt.',
        utm_content: 'mui_chuoi_thung_go',
        clicks: 6,
      },
    ],
    diagnosis: 'Sức hút ban đầu tốt từ nhóm quan tâm đến thực phẩm mộc nguyên chất. Vận tốc gom ổn định (60% sau ngày đầu).',
    learning: {
      what_worked: [
        'Chi tiết thùng gỗ mít ủ men 6 ngày gợi tò mò mạnh mẽ',
        'Định vị không kiềm hóa tách biệt rõ ràng với bột cacao siêu thị'
      ],
      what_did_not: [
        'Một số khách thắc mắc vị chua tự nhiên là do hỏng hay lên men chuẩn'
      ],
      customer_signal: 'Người dùng quan tâm liệu có pha đường sẵn không (trả lời: 100% nguyên chất mộc).',
      story_signal: 'Góc nhìn Con người và Chi tiết mộc đạt tương tác sâu hơn góc Vùng đất.',
      commerce_signal: 'Mức giá 165.000đ/hũ được đón nhận tự nhiên, không có phản hồi chê đắt.',
      producer_signal: 'OCA sẵn sàng giao lô 30 phần ngay sau khi chốt mẻ gom.',
      next_action: 'Tiếp tục đẩy góc nội dung Chi tiết mộc mạc và chuẩn bị thông báo mốc 80% MOQ.'
    }
  },

  // ----------------------------------------------------------------------------
  // Experiment 2: Cà phê Aeroco (#002)
  // ----------------------------------------------------------------------------
  {
    experiment_id: 'GM-LIVE-01-002',
    ngan_id: 'ngan-live-002',
    ngan_number: '#002',
    ngan_slug: 'ca-phe-dac-san-aeroco-farm',
    product_name: 'Cà Phê Đặc Sản Aeroco Farm',
    producer_name: 'Aeroco Coffee Farm',
    gmr_fit_score: 9.1,
    status: 'ACTIVE',
    start_date: '2026-10-06T00:00:00Z',
    days_live: 1,
    ngan_views: 198,
    cta_clicks: 52,
    orders: 16,
    confirmed_quantity: 26,
    moq: 50,
    shares: 14,
    demand_velocity: 26.0,
    story_to_open_rate: 0.262,
    open_to_demand_rate: 0.131,
    progress_percent: 52,
    top_traffic_sources: [
      { source: 'tiktok', orders: 8, views: 96 },
      { source: 'facebook', orders: 5, views: 64 },
      { source: 'referral', orders: 3, views: 38 },
    ],
    content_angles: [
      {
        id: 'angle-aero-a',
        type: 'VUNG_DAT',
        headline: 'Trang trại cảnh quan đa tầng dưới bóng râm Buôn Ma Thuột',
        hook: 'Tại sao cây cà phê trồng xen cây rừng lại cho hạt đượm vị ngọt sâu?',
        utm_content: 'nong_trai_canh_quan',
        clicks: 22,
      },
      {
        id: 'angle-aero-b',
        type: 'CON_NGUOI',
        headline: 'Người đàn ông kiên nhẫn trả lại sự đĩnh đạc cho Robusta',
        hook: 'Từ chối tuốt cành ồ ạt, chỉ hái từng trái đỏ chín mọng bằng tay.',
        utm_content: 'le_van_vuong_robusta',
        clicks: 20,
      },
      {
        id: 'angle-aero-c',
        type: 'CHI_TIET',
        headline: 'Không tuốt cành: Nhặt từng trái để giữ mắt hoa vụ sau',
        hook: 'Sự nhẫn nại đắt giá của những người nông dân Ê-đê bản địa.',
        utm_content: 'chi_hai_chin_100',
        clicks: 10,
      },
    ],
    diagnosis: 'Vận tốc nhu cầu rất cao từ cộng đồng yêu cà phê đặc sản. Tỷ lệ chia sẻ cao nhất trong 3 Ngăn.',
    learning: {
      what_worked: [
        'Chứng thực CQI 84.5 điểm và cam kết hái chín 100% tạo niềm tin tức thì',
        'Hình ảnh giàn phơi trong nhà kính mang lại cảm giác chỉn chu, hiện đại'
      ],
      what_did_not: [
        'Khách hỏi nhiều về dạng hạt hay dạng xay sẵn (cần làm rõ tùy chọn trong form)'
      ],
      customer_signal: 'Nhiều người ngạc nhiên vì Robusta Việt Nam có thể rang mộc ngon mà không cần tẩm bơ.',
      story_signal: 'Video TikTok về bàn tay nâng niu từng trái đỏ tạo chuyển đổi mạnh nhất.',
      commerce_signal: 'Số lượng đặt trung bình 1.6 phần/đơn (nhiều khách mua 2 gói).',
      producer_signal: 'Aeroco cam kết mẻ rang mới nhất sẽ hoàn thành trong 48h sau khi đủ MOQ.',
      next_action: 'Giữ đà tăng trưởng và theo dõi vòng lặp chia sẻ referral.'
    }
  },

  // ----------------------------------------------------------------------------
  // Experiment 3: Mật ong bạc hà Hà Giang (#003)
  // ----------------------------------------------------------------------------
  {
    experiment_id: 'GM-LIVE-01-003',
    ngan_id: 'ngan-live-003',
    ngan_number: '#003',
    ngan_slug: 'mat-ong-bac-ha-ha-giang',
    product_name: 'Mật Ong Bạc Hà Mèo Vạc Hà Giang',
    producer_name: 'Anh Giàng A Páo',
    gmr_fit_score: 9.4,
    status: 'ACTIVE',
    start_date: '2026-10-06T00:00:00Z',
    days_live: 1,
    ngan_views: 165,
    cta_clicks: 44,
    orders: 11,
    confirmed_quantity: 14,
    moq: 20,
    shares: 11,
    demand_velocity: 14.0,
    story_to_open_rate: 0.266,
    open_to_demand_rate: 0.084,
    progress_percent: 70,
    top_traffic_sources: [
      { source: 'facebook', orders: 6, views: 90 },
      { source: 'zalo_oa', orders: 3, views: 45 },
      { source: 'direct', orders: 2, views: 30 },
    ],
    content_angles: [
      {
        id: 'angle-pao-a',
        type: 'VUNG_DAT',
        headline: 'Loài hoa tím nở trong cái rét sương muối 1.200m cao nguyên đá',
        hook: 'Ở nơi chỉ có đá xám và gió buốt, giọt mật vàng chanh ánh xanh đã thành hình thế nào?',
        utm_content: 'vach_da_tai_meo_hoa_tim',
        clicks: 19,
      },
      {
        id: 'angle-pao-b',
        type: 'CON_NGUOI',
        headline: 'Anh Giàng A Páo và lời hứa không quay mật non',
        hook: 'Đợi đàn ong quạt đặc vít kín nắp tổ mới hạ tầng quay.',
        utm_content: 'giang_a_pao_vit_nap',
        clicks: 18,
      },
      {
        id: 'angle-pao-c',
        type: 'CHI_TIET',
        headline: 'Sợi mật sóng sánh rót không đứt đoạn trong gian nhà đất ấm khói',
        hook: 'Màu vàng chanh ánh xanh đặc trưng chỉ có ở mật ong bạc hà nguyên bản.',
        utm_content: 'soi_mat_khong_dut_doan',
        clicks: 7,
      },
    ],
    diagnosis: 'Đã đạt 70% MOQ (14/20 chai). Dự kiến sẽ là Ngăn đầu tiên cán mốc MOQ trong 48h tới.',
    learning: {
      what_worked: [
        'Hình ảnh thực địa chân thực của anh Páo tại Mèo Vạc mang tính độc quyền cao',
        'Mô tả vị the mát sâu cổ họng chạm đúng nỗi đau sợ mật giả/mật nuôi đường'
      ],
      what_did_not: [
        'Khách hỏi nhiều về cách phân biệt với mật pha màu hóa chất trên thị trường'
      ],
      customer_signal: 'Khách hàng sẵn sàng trả 280.000đ khi tin rằng đây là mật quay chín già không đun hạ thủy phân.',
      story_signal: 'Cốt truyện về cao nguyên đá và mùa hoa dại đạt thời gian đọc trung bình trên 2.5 phút.',
      commerce_signal: 'Tỷ lệ chốt đơn rất cao khi đã vào trang đặt hàng (form completion > 80%).',
      producer_signal: 'Anh Páo báo thời tiết Mèo Vạc đang ủng hộ vụ hoa, sẵn sàng chuyển mật bằng xe khách về Hà Nội.',
      next_action: 'Chuẩn bị kích hoạt thông báo MOQ_REACHED khi đủ 20/20 chai.'
    }
  }
];

// In-Memory store for M4 experiments and snapshots
let experimentsStore: M4Experiment[] = [...initialM4Experiments];

export const dailySnapshotsStore: DailySnapshot[] = [
  {
    date: '2026-10-06',
    experiment_id: 'GM-LIVE-01-001',
    views: 142,
    cta_clicks: 38,
    orders: 12,
    quantity: 18,
    shares: 9,
    top_traffic_source: 'facebook',
  },
  {
    date: '2026-10-06',
    experiment_id: 'GM-LIVE-01-002',
    views: 198,
    cta_clicks: 52,
    orders: 16,
    quantity: 26,
    shares: 14,
    top_traffic_source: 'tiktok',
  },
  {
    date: '2026-10-06',
    experiment_id: 'GM-LIVE-01-003',
    views: 165,
    cta_clicks: 44,
    orders: 11,
    quantity: 14,
    shares: 11,
    top_traffic_source: 'facebook',
  },
];

export async function getM4Experiments(): Promise<M4Experiment[]> {
  // Sync confirmed quantity dynamically from mockOrdersStore if orders were placed
  return experimentsStore.map((exp) => {
    const matchingNgans = mockNgans.find((n) => n.id === exp.ngan_id);
    const confirmedQty = matchingNgans ? matchingNgans.current_quantity : exp.confirmed_quantity;
    const progress = Math.min(100, Math.round((confirmedQty / exp.moq) * 100));
    const velocity = Number((confirmedQty / Math.max(1, exp.days_live)).toFixed(1));

    return {
      ...exp,
      confirmed_quantity: confirmedQty,
      progress_percent: progress,
      demand_velocity: velocity,
    };
  });
}

export async function getM4ExperimentById(id: string): Promise<M4Experiment | null> {
  const all = await getM4Experiments();
  return all.find((e) => e.experiment_id === id || e.ngan_slug === id) || null;
}

export async function updateExperimentDecision(
  id: string,
  decision: 'SCALE' | 'KEEP_REVISE' | 'HOLD' | 'KILL' | 'INSUFFICIENT_DATA',
  rationale: string
): Promise<M4Experiment | null> {
  const exp = experimentsStore.find((e) => e.experiment_id === id);
  if (!exp) return null;

  exp.decision = decision;
  exp.decision_rationale = rationale;
  return exp;
}
