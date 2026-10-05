import { SourceProfile } from '@/types';

// ==============================================================================
// GẠC MĂNG RÊ — M3.5 CANDIDATE SOURCES (RAW REPOSITORY & CURATION STORE)
// ==============================================================================

export const mockSources: SourceProfile[] = [
  // ----------------------------------------------------------------------------
  // 1. Cacao Lên Men Thủ Công OCA
  // ----------------------------------------------------------------------------
  {
    id: 'src-001-oca',
    experiment_id: 'GM-LIVE-01-001',
    status: 'READY',
    input_url: 'https://ocacacao.vn/about-us',
    raw_input_notes: 'Nhóm bạn trẻ làm cacao lên men thủ công tại Đắk Lắk. Thu mua hạt tuyển từ các nông hộ, lên men thùng gỗ 5-6 ngày rồi phơi giàn đón nắng. Hạt mộc, thơm dịu.',
    producer_name: 'Đội ngũ Cacao OCA',
    organization: 'Hợp tác xã & Công ty Cổ phần Cacao OCA Việt Nam',
    contact_phone: '0912001001',
    contact_zalo: '0912001001',
    contact_email: 'hello@ocacacao.vn',
    location: 'Đắk Lắk & Cao Bằng',
    source_urls: ['https://ocacacao.vn', 'https://facebook.com/ocacacaovietnam'],
    category: 'CACAO',
    product_name: 'Cacao Lên Men Thủ Công Nguyên Chất OCA',
    product_description: 'Bột và hạt cacao mộc lên men truyền thống, giữ trọn lượng bơ cacao tự nhiên và vị chua thanh thanh của hoa quả nhiệt đới.',
    variants: ['Hũ thủy tinh 250g', 'Gói thiếc 500g'],
    province: 'Đắk Lắk',
    district: 'Ea Kar',
    locality: 'Xã Cư Ni',
    raw_material_origin: 'Vườn cacao trồng xen canh sinh thái tại Đắk Lắk, đất đỏ bazan cổ.',
    producer_person: 'Bạn Lê Minh Tuấn & Đội ngũ bạn trẻ OCA',
    producer_story: 'Nhận thấy nông dân thường bị ép giá khi bán hạt thô chưa lên men cho thương lái nước ngoài, nhóm dấn thân cùng nông dân học lại cách lên men thùng gỗ chuẩn mực để tạo ra mẻ cacao mang bản sắc Việt.',
    production_method: 'Lên men kỵ khí trong thùng gỗ mộc từ 5–6 ngày kết hợp đảo mẻ thủ công, phơi nắng tự nhiên trên giàn cao.',
    distinctive_practice: 'Tuyệt đối không dùng chất kiềm hóa (alkalized/Dutch process), giữ lại 100% bơ cacao và vi sinh vật tự nhiên có lợi.',
    certifications: ['OCOP 4 sao Đắk Lắk (2024)', 'Kiểm nghiệm không kim loại nặng Viện Pasteur'],
    documents: ['Giấy chứng nhận ATTP số 112/2024/ATTP-DL', 'Kết quả xét nghiệm mẫu mẻ 08/2026'],
    source_claims: [
      'Hạt cacao lên men chuẩn giúp hương vị phong phú hơn hạt rang công nghiệp',
      'Giúp nông dân địa phương tăng thu nhập thêm 25% so với bán hạt xô'
    ],
    references: ['Báo Nông Nghiệp Việt Nam bài viết tháng 04/2025 về mô hình OCA'],
    estimated_price: 165000,
    unit: 'Hũ 250g',
    moq: 30,
    capacity: 100,
    lead_time: '14 ngày chuẩn bị và đóng mẻ',
    media_assets: [
      {
        id: 'med-oca-1',
        url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1200&auto=format&fit=crop',
        asset_type: 'SOURCE',
        source: 'Thực địa Đắk Lắk 09/2026',
        license: 'Producer Authorized',
        credit: 'Ảnh: OCA Archive',
        is_verified: true,
        alt_text: 'Thùng gỗ lên men hạt cacao mộc',
        caption: 'Hạt cacao ủ men trong thùng gỗ mít tự nhiên tại Ea Kar.',
        slot: 'hero',
        created_at: '2026-10-06T00:00:00Z',
      }
    ],
    facts: [
      { field: 'Vùng nguyên liệu', value: 'Đắk Lắk, độ cao 450m, đất bazan', provenance: 'VERIFIED' },
      { field: 'Phương pháp lên men', value: 'Thùng gỗ mít 5-6 ngày', provenance: 'VERIFIED' },
      { field: 'Kiềm hóa nhân tạo', value: 'Hoàn toàn không sử dụng', provenance: 'VERIFIED' },
      { field: 'Tăng thu nhập nông dân 25%', value: 'Khảo sát nội bộ OCA', provenance: 'PRODUCER_CLAIM' },
    ],
    missing_fields: ['Hình ảnh kiểm nghiệm độ ẩm mẻ gần nhất'],
    scorecard: {
      origin: 9.0,
      human: 8.5,
      craft: 9.0,
      distinctiveness: 8.5,
      story_potential: 9.0,
      proof: 8.0,
      product_quality_signal: 8.5,
      commercial_readiness: 8.0,
      supply_reliability: 8.5,
      gmr_fit_score: 8.6,
      strengths: [
        'Quy trình lên men thùng gỗ thủ công chuẩn mực',
        'Câu chuyện người trẻ đồng hành cùng nông hộ Ea Kar rất thuyết phục',
        'Sản phẩm định vị rõ ràng: không kiềm hóa, giữ bơ tự nhiên'
      ],
      weaknesses: [
        'Vị chua nhẹ của trái cây lên men cần được giải thích kỹ để khách hiểu đúng giá trị'
      ],
      evaluation_summary: 'Hồ sơ đạt tiêu chuẩn READY để phát triển thành Ngăn #001.'
    },
    story_brief: {
      id: 'sb-001-oca',
      source_id: 'src-001-oca',
      headline_angle: 'Hạt Cacao Việt Nam và Cách Làm Của Riêng Mình',
      fact: 'Hạt cacao Đắk Lắk được lên men trong thùng gỗ mít 6 ngày liên tục, không qua xử lý kiềm công nghiệp.',
      detail: 'Mỗi buổi sáng, người làm phải mở nắp thùng kiểm tra nhiệt độ lõi ủ và mùi hương men chuối thoang thoảng.',
      human: 'Những bạn trẻ kiên nhẫn cùng nông dân Ea Kar nhặt từng hạt sâu mọt trước khi đưa vào ủ.',
      meaning: 'Khẳng định giá trị nguyên bản của nông sản Việt: không cần pha tạp hương vani tổng hợp để che giấu khuyết điểm.',
      product: 'Cacao Lên Men Thủ Công Nguyên Chất (Hũ 250g) — béo ngậy, đắng êm, hậu vị thanh mát.',
      open_ngan_call: 'Chiếc tủ Gạc Măng Rê mở 30 phần cacao mộc nguyên chất cho mẻ ủ tháng 10.',
      editorial_interpretation: 'Vị chua trái cây lên men là dấu ấn của sự nguyên bản, khác hẳn bột cacao công nghiệp đã qua kiềm hóa.',
      media_recommendations: [
        { slot: 'hero', asset_type: 'SOURCE', description: 'Cận cảnh hạt cacao ủ men lên phấn tự nhiên' }
      ]
    },
    ngan_id: 'ngan-live-001',
    ngan_slug: 'cacao-len-men-thu-cong-oca',
    created_at: '2026-10-06T00:00:00Z',
    updated_at: '2026-10-06T00:00:00Z',
  },

  // ----------------------------------------------------------------------------
  // 2. Cà Phê Đặc Sản Aeroco Farm
  // ----------------------------------------------------------------------------
  {
    id: 'src-002-aeroco',
    experiment_id: 'GM-LIVE-01-002',
    status: 'READY',
    input_url: 'https://aerocofarm.com',
    raw_input_notes: 'Trang trại cảnh quan tại Buôn Ma Thuột. Trồng Fine Robusta dưới tán rừng sinh thái. Chỉ hái quả chín 100%. Quy trình sơ chế tự nhiên phơi giàn.',
    producer_name: 'Aeroco Coffee Farm',
    organization: 'Công ty TNHH Aeroco Farm Buôn Ma Thuột',
    contact_phone: '0905123456',
    contact_zalo: '0905123456',
    contact_email: 'contact@aerocofarm.com',
    location: 'Buôn Ma Thuột, Đắk Lắk',
    source_urls: ['https://aerocofarm.com', 'https://facebook.com/aerocofarm'],
    category: 'COFFEE',
    product_name: 'Cà Phê Đặc Sản Fine Robusta Hái Chín 100%',
    product_description: 'Cà phê Robusta chọn lọc từ vườn cảnh quan đa tầng, hái tay 100% trái chín đỏ, lên men tự nhiên và rang mộc mẻ nhỏ.',
    variants: ['Túi van 1 chiều 250g hạt', 'Túi van 1 chiều 250g bột pha phin'],
    province: 'Đắk Lắk',
    district: 'TP. Buôn Ma Thuột',
    locality: 'Xã Hòa Phú',
    raw_material_origin: 'Nông trại sinh thái đa tầng phủ xanh bóng mát tại cao nguyên Buôn Ma Thuột.',
    producer_person: 'Anh Lê Văn Vương & Đội ngũ nông dân Ê-đê bản địa',
    producer_story: 'Nuôi dưỡng ước mơ xóa bỏ định kiến "cà phê Robusta chỉ là cà phê giá rẻ, đậm đắng khét". Anh Vương kiến tạo mô hình nông lâm kết hợp, bảo vệ thảm thực vật để hạt cà phê tích lũy vị ngọt tự nhiên.',
    production_method: 'Sơ chế tự nhiên (Natural Process) trên giàn phơi trong nhà kính có kiểm soát nhiệt ẩm.',
    distinctive_practice: 'Quy tắc khắt khe hái chín tay 100%, hạt được tuyển lựa tỷ trọng trong nước trước khi ủ men.',
    certifications: ['Chứng nhận Nông nghiệp cảnh quan bền vững', 'Top CQI Fine Robusta Việt Nam (84.5 điểm)'],
    documents: ['Bản chấm điểm Cupping Form CQI', 'Chứng nhận kiểm nghiệm dư lượng bảo vệ thực vật âm tính'],
    source_claims: ['Hái chín 100% bằng tay từng trái', 'Tasting notes tự nhiên: caramel, thảo mộc khô, sôcôla đen'],
    references: ['Hiệp hội Cà phê Buôn Ma Thuột vinh danh nông hộ tiêu biểu 2024'],
    estimated_price: 195000,
    unit: 'Túi 250g',
    moq: 50,
    capacity: 200,
    lead_time: '10 ngày rang mới và đóng gói',
    media_assets: [
      {
        id: 'med-aeroco-1',
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
        asset_type: 'SOURCE',
        source: 'Aeroco Media Kit',
        license: 'Producer Authorized',
        credit: 'Ảnh: Aeroco Farm',
        is_verified: true,
        alt_text: 'Trái cà phê Robusta chín đỏ mọng trên cành',
        caption: 'Hái tay 100% từng quả chín mọng trên nông trại cảnh quan Hòa Phú.',
        slot: 'hero',
        created_at: '2026-10-06T00:00:00Z',
      }
    ],
    facts: [
      { field: 'Độ chín thu hoạch', value: '100% quả chín đỏ hái tay', provenance: 'VERIFIED' },
      { field: 'Điểm chất lượng CQI', value: '84.5 điểm Fine Robusta', provenance: 'VERIFIED' },
      { field: 'Rang tẩm hóa chất', value: 'Rang mộc nguyên chất 100%', provenance: 'VERIFIED' },
    ],
    missing_fields: ['Video tư liệu ngắn ghi lại cảnh nông dân thu hoạch thực tế vụ này'],
    scorecard: {
      origin: 9.5,
      human: 9.0,
      craft: 9.5,
      distinctiveness: 9.0,
      story_potential: 9.0,
      proof: 9.0,
      product_quality_signal: 9.0,
      commercial_readiness: 8.5,
      supply_reliability: 9.0,
      gmr_fit_score: 9.1,
      strengths: [
        'Minh chứng kiểm định CQI uy tín',
        'Mô hình nông trại cảnh quan bền vững hiếm có',
        'Chất lượng mộc xuất sắc, hậu vị ngọt đậm không chát gắt'
      ],
      weaknesses: [
        'Cần truyền thông để người uống phân biệt giữa vị đắng khét cháy bắp rang với vị đậm sánh thanh nhã của Robusta hảo hạng'
      ],
      evaluation_summary: 'Hồ sơ xuất sắc, xếp loại READY mở Ngăn #002.'
    },
    story_brief: {
      id: 'sb-002-aeroco',
      source_id: 'src-002-aeroco',
      headline_angle: 'Trả Lại Giá Trị Cho Hạt Robusta Việt Nam',
      fact: 'Những cây cà phê Robusta lớn lên dưới tán cây rừng, chỉ thu hái khi vỏ quả chuyển sang sắc đỏ thẫm.',
      detail: 'Không tuốt cành ồ ạt, bàn tay người hái nâng niu từng cuống quả để giữ trọn mắt hoa cho vụ mùa năm sau.',
      human: 'Anh Lê Văn Vương cùng những người đồng bào Ê-đê gắn bó cả đời với đất đỏ Buôn Ma Thuột.',
      meaning: 'Một sự đĩnh đạc tự tin: Robusta Việt Nam khi được chăm sóc tử tế có thể sánh vai cùng bất kỳ dòng cà phê đặc sản nào.',
      product: 'Cà Phê Đặc Sản Aeroco (250g) rang mộc thơm hương thảo mộc, caramel và sôcôla.',
      open_ngan_call: 'Mở Ngăn #002 cùng 50 phần gom mẻ rang mới đầu mùa.',
      editorial_interpretation: 'Câu chuyện thức tỉnh sự trân trọng đối với sản vật quốc gia.',
      media_recommendations: [
        { slot: 'hero', asset_type: 'SOURCE', description: 'Giàn phơi quả cà phê chín dưới nắng Buôn Ma Thuột' }
      ]
    },
    ngan_id: 'ngan-live-002',
    ngan_slug: 'ca-phe-dac-san-aeroco-farm',
    created_at: '2026-10-06T00:00:00Z',
    updated_at: '2026-10-06T00:00:00Z',
  },

  // ----------------------------------------------------------------------------
  // 3. Mật Ong Bạc Hà Hà Giang (Giàng A Páo)
  // ----------------------------------------------------------------------------
  {
    id: 'src-003-pao',
    experiment_id: 'GM-LIVE-01-003',
    status: 'READY',
    input_url: 'https://gacmangre.com/archive/pao-meo-vac',
    raw_input_notes: 'Mật ong bạc hà Mèo Vạc. Thung lũng đá vôi trên 1.200m. Hoa mọc dại vào mùa sương muối đông. Anh Giàng A Páo quay mật khi đã vít nắp già.',
    producer_name: 'Gia đình Giàng A Páo & Hợp tác xã Ong Núi Đá Mèo Vạc',
    organization: 'Tổ hợp tác nuôi ong bản địa Mèo Vạc',
    contact_phone: '0988123789',
    contact_zalo: '0988123789',
    location: 'Mèo Vạc, Hà Giang',
    source_urls: ['https://gacmangre.com/archive/pao-meo-vac'],
    category: 'HONEY',
    product_name: 'Mật Ong Bạc Hà Hoa Dại Mèo Vạc Vít Nắp Già',
    product_description: 'Mật ong khai thác từ loài hoa bạc hà dại nở trên cao nguyên đá Mèo Vạc. Màu vàng chanh ánh xanh, vị the mát dịu dàng.',
    variants: ['Chai thủy tinh nút bần 500ml'],
    province: 'Hà Giang',
    district: 'Mèo Vạc',
    locality: 'Xã Pả Vi',
    raw_material_origin: 'Vạt hoa bạc hà dại nở tím trên khe đá vôi ở độ cao 1.200m – 1.400m vào tháng 10 – 12 âm lịch.',
    producer_person: 'Anh Giàng A Páo (người Mông)',
    producer_story: 'Giữa cái rét thấu xương trên cao nguyên đá, anh Páo cặm cụi chăm từng đàn ong. Anh từ chối hạ tổ non để chạy theo số lượng, nhất quyết chờ ong quạt đặc vít nắp mới quay.',
    production_method: 'Quay li tâm thủ công, lọc qua vải mộc truyền thống, không đun hạ thủy phân nhân tạo.',
    distinctive_practice: 'Thu hoạch mẻ mật già tự nhiên, độ ẩm dưới 19% tự nhiên nhờ ong tự quạt sáp vít nắp.',
    certifications: ['Chứng nhận Chỉ dẫn địa lý Mật ong bạc hà Mèo Vạc', 'OCOP 3 sao tỉnh Hà Giang'],
    documents: ['Phiếu kiểm nghiệm hàm lượng đường khử và độ ẩm Viện Kiểm Nghiệm VSATTP Quốc Gia'],
    source_claims: [
      'Chỉ có 1 vụ mật duy nhất trong năm kéo dài 2 tháng mùa đông',
      'Màu vàng chanh ánh xanh và vị the mát cổ họng tự nhiên'
    ],
    references: ['Chuyến đi thực địa của nhóm sáng lập Gạc Măng Rê tháng 10/2025'],
    estimated_price: 280000,
    unit: 'Chai 500ml',
    moq: 20,
    capacity: 60,
    lead_time: 'Giao sau 5 ngày kết thúc mẻ quay',
    media_assets: [
      {
        id: 'med-pao-1',
        url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1200&auto=format&fit=crop',
        asset_type: 'DOCUMENTARY',
        source: 'Thực địa Gạc Măng Rê Mèo Vạc',
        license: 'GacMangRe Exclusive',
        credit: 'Ảnh: Đội ngũ Gạc Măng Rê',
        is_verified: true,
        alt_text: 'Tổ ong mật bạc hà trên vách đá tai mèo',
        caption: 'Anh Giàng A Páo kiểm tra cầu ong vít nắp già tại lán Pả Vi.',
        slot: 'hero',
        created_at: '2026-10-06T00:00:00Z',
      }
    ],
    facts: [
      { field: 'Độ cao khai thác', value: '1.200m - 1.400m cao nguyên đá', provenance: 'VERIFIED' },
      { field: 'Mùa hoa bạc hà', value: 'Tháng 10 - tháng 12 âm lịch', provenance: 'VERIFIED' },
      { field: 'Độ ẩm mật tự nhiên', value: '18.5% (không hạ nhiệt nhân tạo)', provenance: 'VERIFIED' },
    ],
    missing_fields: [],
    scorecard: {
      origin: 9.8,
      human: 9.5,
      craft: 9.0,
      distinctiveness: 9.5,
      story_potential: 9.8,
      proof: 9.0,
      product_quality_signal: 9.5,
      commercial_readiness: 8.5,
      supply_reliability: 8.0,
      gmr_fit_score: 9.4,
      strengths: [
        'Vùng đất và con người mang tính biểu tượng văn hóa cao',
        'Sản vật quý hiếm có mùa vụ ngặt nghèo',
        'Tư liệu documentary thực địa độc quyền đã xác minh'
      ],
      weaknesses: [
        'Sản lượng phụ thuộc thời tiết sương muối, nguồn cung hữu hạn'
      ],
      evaluation_summary: 'Hồ sơ tiêu chuẩn vàng (Golden Sample), xếp loại READY mở Ngăn #003.'
    },
    story_brief: {
      id: 'sb-003-pao',
      source_id: 'src-003-pao',
      headline_angle: 'Hương Hoa Dại Nở Trên Vách Đá Tai Mèo Mèo Vạc',
      fact: 'Ở độ cao 1.200m trên cao nguyên đá Đồng Văn, hoa bạc hà dại chỉ bừng nở trong cái rét căm căm của mùa sương muối.',
      detail: 'Màu mật vàng chanh ánh xanh trong veo, khi rót ra sóng sánh tựa sợi chỉ không đứt đoạn.',
      human: 'Anh Giàng A Páo — người đàn ông Mông mộc mạc gìn giữ từng mẻ mật chín già không qua đun nấu.',
      meaning: 'Sự nhẫn nại của con người hòa cùng sức sống mãnh liệt của thiên nhiên nơi triền đá xám.',
      product: 'Mật Ong Bạc Hà Mèo Vạc (Chai 500ml) the mát tựa ngọn gió núi.',
      open_ngan_call: 'Cùng mở Ngăn #003 với 20 chai mật đầu vụ từ cao nguyên Mèo Vạc.',
      editorial_interpretation: 'Một giọt mật gói trọn vị ngọt chân thật của đất trời Tây Bắc.',
      media_recommendations: [
        { slot: 'hero', asset_type: 'DOCUMENTARY', description: 'Cận cảnh bình mật ong vàng chanh sóng sánh trong lán đất' }
      ]
    },
    ngan_id: 'ngan-live-003',
    ngan_slug: 'mat-ong-bac-ha-ha-giang',
    created_at: '2026-10-06T00:00:00Z',
    updated_at: '2026-10-06T00:00:00Z',
  },

  // ----------------------------------------------------------------------------
  // 4. Trứng Gà Thảo Dược Thả Đồi Ba Vì
  // ----------------------------------------------------------------------------
  {
    id: 'src-004-thaoduoc',
    experiment_id: 'GM-LIVE-01-004',
    status: 'DEVELOP',
    input_url: 'https://facebook.com/trunggatunhienbavi',
    raw_input_notes: 'Trang trại nuôi gà thả đồi tại chân núi Ba Vì. Cho gà uống nước thảo dược tự sắc (sả, gừng, tỏi, tía tô, ngải cứu). Không dùng kháng sinh phòng bệnh. Trứng thơm bùi.',
    producer_name: 'Trang Trại Gà Đồi Sinh Thái Ba Vì',
    organization: 'Hộ kinh doanh Nông nghiệp Sạch Ba Vì',
    contact_phone: '0979888999',
    contact_zalo: '0979888999',
    location: 'Ba Vì, Hà Nội',
    source_urls: ['https://facebook.com/trunggatunhienbavi'],
    category: 'EGG',
    product_name: 'Trứng Gà Thảo Dược Thả Đồi Tươi Sạch',
    product_description: 'Trứng gà đẻ từ đàn gà chạy bộ bới đất đồi, uống nước thảo dược phòng bệnh, lòng đỏ cam đậm sánh đặc không tanh nồng.',
    variants: ['Khay vỉ giấy ép 10 quả'],
    province: 'Hà Nội',
    district: 'Ba Vì',
    locality: 'Xã Vân Hòa',
    raw_material_origin: 'Vườn đồi thoai thoải dưới chân núi Ba Vì nhiều cây xanh râm mát.',
    producer_person: 'Bác Nguyễn Khắc Hùng & Gia đình',
    producer_story: 'Từng chứng kiến đàn gà ốm phải dùng nhiều kháng sinh công nghiệp, bác Hùng quyết định chuyển hướng sang phương pháp dưỡng sinh bằng thảo dược dân gian truyền thống.',
    production_method: 'Chăn thả bán hoang dã, khẩu phần ăn phối trộn ngô nghiền, cám gạo, giun quế và bã dược liệu.',
    distinctive_practice: 'Nồi thảo dược đun sôi hàng ngày gồm tỏi tía, gừng già, sả chanh hòa nước uống cho gà.',
    certifications: ['TODO — INPUT REQUIRED: Cần giấy kiểm nghiệm không tồn dư kháng sinh lô thu gom mới'],
    documents: ['Giấy chứng nhận cơ sở đủ điều kiện ATTP huyện Ba Vì (2023)'],
    source_claims: [
      'Hoàn toàn không tồn dư kháng sinh và chất tạo màu tổng hợp',
      'Lòng đỏ sánh dẻo, thơm ngậy khi luộc lòng đào'
    ],
    references: ['Chuyên mục Nông thôn mới đài PT-TH Hà Nội đưa tin năm 2023'],
    estimated_price: 65000,
    unit: 'Khay 10 quả',
    moq: 20,
    capacity: 80,
    lead_time: 'Giao trong 24-48h sau khi thu gom để đảm bảo độ tươi',
    media_assets: [
      {
        id: 'med-trung-1',
        url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1200&auto=format&fit=crop',
        asset_type: 'SOURCE',
        source: 'Fanpage Bác Hùng',
        license: 'Producer Authorized',
        credit: 'Ảnh: Gia đình Bác Hùng',
        is_verified: false,
        alt_text: 'Đàn gà chạy bộ dưới bóng mát cây rừng Ba Vì',
        caption: 'Đàn gà thả đồi bới tìm khoáng chất tự nhiên dưới tán cây Ba Vì.',
        slot: 'hero',
        created_at: '2026-10-06T00:00:00Z',
      }
    ],
    facts: [
      { field: 'Mô hình chăn thả', value: 'Gà chạy bộ đồi gò Ba Vì', provenance: 'SOURCE_INFERRED' },
      { field: 'Nước uống thảo dược', value: 'Nước sắc gừng, tỏi, sả, ngải cứu', provenance: 'PRODUCER_CLAIM' },
      { field: 'Kháng sinh phòng bệnh', value: 'Cam kết không dùng kháng sinh', provenance: 'PRODUCER_CLAIM' },
    ],
    missing_fields: [
      'Phiếu xét nghiệm tồn dư kháng sinh (Chloramphenicol, Tetracycline) lô mới nhất',
      'Quy chuẩn bao bì chống vỡ khi giao nội thành Hà Nội',
      'Ảnh chụp thực địa độ phân giải cao ghi lại nồi thảo mộc và chuồng trại'
    ],
    scorecard: {
      origin: 7.5,
      human: 8.0,
      craft: 8.0,
      distinctiveness: 7.5,
      story_potential: 8.0,
      proof: 5.5,
      product_quality_signal: 8.0,
      commercial_readiness: 7.0,
      supply_reliability: 8.0,
      gmr_fit_score: 7.4,
      strengths: [
        'Nhu cầu tiêu dùng hằng ngày cao đối với thực phẩm sạch',
        'Mô hình nước uống thảo mộc mộc mạc, gần gũi và có tính thuyết phục'
      ],
      weaknesses: [
        'Proof còn yếu: chưa có phiếu xét nghiệm kháng sinh định kỳ cập nhật',
        'Rủi ro nứt vỡ trong vận chuyển trứng tươi'
      ],
      evaluation_summary: 'Hồ sơ xếp loại DEVELOP. Cần đội ngũ GMR hỗ trợ gửi Producer Request để lấy phiếu xét nghiệm trước khi chính thức mở Ngăn.'
    },
    producer_request: {
      id: 'req-004-hung',
      source_id: 'src-004-thaoduoc',
      producer_name: 'Bác Nguyễn Khắc Hùng',
      missing_fields: [
        'Phiếu kiểm nghiệm không tồn dư kháng sinh',
        'Ảnh chụp nồi thảo dược đun hàng ngày',
        'Phương án lót khay chống sốc vận chuyển'
      ],
      suggested_message: 'Kính gửi Bác Hùng, Gạc Măng Rê rất trân trọng tâm huyết nuôi gà bằng thảo mộc của gia đình. Để chuẩn bị mở Ngăn gom mẻ cho khách hàng thành phố, Gạc Măng Rê xin phép nhờ Bác gửi giúp: (1) Ảnh chụp phiếu kiểm nghiệm tồn dư kháng sinh gần nhất, (2) Một vài tấm ảnh mộc chụp nồi nước thảo mộc đun buổi sáng, và (3) Thống nhất phương án đệm lót vỉ trứng khi giao. Chúc Bác và gia đình luôn dồi dào sức khỏe!',
      status: 'PENDING',
      created_at: '2026-10-06T00:00:00Z',
    },
    story_brief: {
      id: 'sb-004-thaoduoc',
      source_id: 'src-004-thaoduoc',
      headline_angle: 'Tìm Lại Quả Trứng Mộc Mạc Thơm Lành Thời Thơ Ấu',
      fact: 'Đàn gà Ba Vì uống nước sắc tía tô, tỏi tía và ngải cứu, ăn ngô mảnh và thảo mộc tự nhiên.',
      detail: 'Quả trứng cầm nặng tay, lòng trắng đặc quánh ôm khít lòng đỏ màu cam sậm.',
      human: 'Bác Hùng kiên trì đun từng nồi nước lá thảo mộc dân gian sớm tinh sương.',
      meaning: 'Sự an tâm trong bữa cơm gia đình từ phương thức chăn nuôi không hóa chất.',
      product: 'Trứng Gà Thảo Dược Thả Đồi (Khay 10 quả) thơm bùi tự nhiên.',
      open_ngan_call: 'Mở thử nghiệm 20 khay trứng tươi giao trong ngày.',
      editorial_interpretation: 'Giá trị nằm ở niềm tin vào quả trứng không tồn dư kháng sinh.',
      media_recommendations: [
        { slot: 'hero', asset_type: 'SOURCE', description: 'Khay trứng tươi trên rơm vàng mộc mạc' }
      ]
    },
    ngan_id: 'ngan-live-004',
    ngan_slug: 'trung-ga-thao-duoc-doi',
    created_at: '2026-10-06T00:00:00Z',
    updated_at: '2026-10-06T00:00:00Z',
  }
];
