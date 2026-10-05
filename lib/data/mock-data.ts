import { Ngan, Story, Producer, Product, Order, MediaAsset } from '@/types';

// ==============================================================================
// CURATED MEDIA ASSETS (Brief v1.1 Task 2 & 3: Documentary, Source, Editorial)
// ==============================================================================
export const mockMediaAssets: MediaAsset[] = [
  {
    id: 'asset-001-hero',
    url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1200&auto=format&fit=crop',
    asset_type: 'DOCUMENTARY',
    source: 'Chuyến thực địa Gạc Măng Rê 10/2026',
    license: 'GacMangRe Exclusive',
    credit: 'Ảnh: Gạc Măng Rê Thực Địa',
    is_verified: true,
    alt_text: 'Bát mật ong bạc hà hoa dại nguyên chất màu vàng chanh ánh xanh tại lán Mèo Vạc',
    caption: 'Mật ong thô nguyên chất vừa hạ tầng, giữ trọn hạt phấn hoa tự nhiên.',
    slot: 'hero',
    created_at: '2026-10-02T08:00:00Z',
  },
  {
    id: 'asset-002-hands',
    url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop',
    asset_type: 'DOCUMENTARY',
    source: 'Chuyến thực địa Gạc Măng Rê 10/2026',
    license: 'GacMangRe Exclusive',
    credit: 'Ảnh: Gạc Măng Rê Thực Địa',
    is_verified: true,
    alt_text: 'Đôi bàn tay anh Giàng A Páo nâng niu tàng ong đá vít nắp già',
    caption: 'Đôi tay anh Páo kiểm tra độ chín của tàng ong trước khi đưa vào thùng quay.',
    slot: 'hands',
    created_at: '2026-10-02T08:00:00Z',
  },
  {
    id: 'asset-003-landscape',
    url: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1200&auto=format&fit=crop',
    asset_type: 'DOCUMENTARY',
    source: 'Chuyến thực địa Gạc Măng Rê 10/2026',
    license: 'GacMangRe Exclusive',
    credit: 'Ảnh: Gạc Măng Rê Thực Địa',
    is_verified: true,
    alt_text: 'Triền đá vôi tai mèo sương mù buốt giá tại Mèo Vạc độ cao 1.200m',
    caption: 'Thung lũng đá tai mèo nơi loài hoa bạc hà dại bừng nở tím vào mùa đông.',
    slot: 'landscape',
    created_at: '2026-10-02T08:00:00Z',
  },
  {
    id: 'asset-004-producer',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    asset_type: 'SOURCE',
    source: 'Nhà sản xuất cung cấp & Đối chiếu thực địa',
    license: 'Producer Authorized',
    credit: 'Cung cấp bởi: Giàng A Páo',
    is_verified: true,
    alt_text: 'Chân dung anh Giàng A Páo người Mông 18 năm giữ nghề nuôi ong đá',
    caption: 'Anh Giàng A Páo tại lán ong Mèo Vạc.',
    slot: 'producer',
    created_at: '2026-10-02T08:00:00Z',
  },
  {
    id: 'asset-005-texture',
    url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=800&auto=format&fit=crop',
    asset_type: 'EDITORIAL',
    source: 'Gạc Măng Rê Curation Studio',
    license: 'Curated Collection',
    credit: 'Biên tập: Gạc Măng Rê',
    is_verified: true,
    alt_text: 'Dòng mật thô sánh vàng óng ánh chảy nhẹ nhàng',
    caption: 'Độ sánh tự nhiên không qua xử lý cô đặc bằng nhiệt công nghiệp.',
    slot: 'texture',
    created_at: '2026-10-02T08:00:00Z',
  },
];

export const mockProducer: Producer = {
  id: 'a1111111-1111-1111-1111-111111111111',
  name: 'Giàng A Páo',
  slug: 'giang-a-pao-ha-giang',
  brand_name: 'Tổ ong đá Đồng Văn',
  location: 'Mèo Vạc, Hà Giang',
  description: 'Người giữ trọn phương thức quay mật truyền thống trên triền đá tai mèo cheo leo hơn 18 năm qua.',
  story: 'Mỗi mùa gió bấc tràn về cao nguyên đá, khi cây bạc hà dại nở những chùm hoa phớt tím trong sương muối, là lúc A Páo mang từng thùng ong gỗ mộc lên vách núi. Không đun sôi hạ thủy phần công nghiệp, mật của anh giữ trọn vẹn hương phấn hoa tươi và vị the mát tự nhiên.',
  avatar: mockMediaAssets[3].url,
  phone: '0912345678',
  zalo: '0912345678',
  capacity: 100,
  status: 'ACTIVE',
  media_assets: [mockMediaAssets[3]],
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
};

export const mockProduct: Product = {
  id: 'b2222222-2222-2222-2222-222222222222',
  producer_id: mockProducer.id,
  name: 'Mật ong bạc hà cao nguyên đá',
  slug: 'mat-ong-bac-ha-cao-nguyen-da',
  description: 'Mật ong tự nhiên khai thác từ hoa bạc hà mọc hoang dã trên hốc đá vôi ở độ cao trên 1.200m.',
  origin: 'Mèo Vạc & Đồng Văn, Hà Giang',
  unit: 'Chai thuỷ tinh 500ml',
  weight: '700g',
  price: 280000,
  ingredients: '100% Mật ong hoa bạc hà tự nhiên thô (chưa qua xử lý nhiệt công nghiệp)',
  storage: 'Bảo quản nơi thoáng mát, tránh ánh nắng trực tiếp. Không để trong ngăn mát tủ lạnh.',
  expiry: '24 tháng kể từ ngày mở ngăn',
  certifications: 'Chỉ dẫn địa lý Hà Giang · Kiểm nghiệm vi sinh & thủy phần đạt chuẩn',
  status: 'ACTIVE',
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
  producer: mockProducer,
};

export const mockNgan001: Ngan = {
  id: 'c3333333-3333-3333-3333-333333333333',
  number: '#001',
  slug: 'ngan-001-mat-ong-bac-ha-ha-giang',
  product_id: mockProduct.id,
  title: 'Mật ong bạc hà hoa dại Hà Giang',
  short_description: 'Được chắt chiu từ những thung lũng đá tai mèo lạnh buốt mùa đông. Màu vàng chanh ánh xanh, vị ngọt thanh mát sâu cổ họng.',
  price: 280000,
  moq: 100,
  current_quantity: 74,
  open_at: '2026-10-02T08:00:00Z',
  deadline: '2026-10-15T23:59:59Z',
  status: 'OPEN',
  hero_image: mockMediaAssets[0].url,
  gallery: [
    mockMediaAssets[0].url,
    mockMediaAssets[1].url,
    mockMediaAssets[4].url,
  ],
  media_assets: mockMediaAssets,
  selection_dat: 'Thổ nhưỡng đá vôi khô cằn trên độ cao 1.200m tạo nên loài hoa bạc hà dại tím ngát đặc hữu chỉ nở vào mùa đông lạnh nhất năm.',
  selection_nguoi: 'Anh Giàng A Páo — người Mông giữ phương thức quay mật truyền thống: chỉ lấy mật khi tàng ong vít nắp 100%, tuyệt đối không vắt ép non.',
  selection_vi: 'Vị ngọt dịu thanh, không gắt họng như mật đồng bằng, thoang thoảng hương thảo mộc the mát ở hậu vị.',
  selection_chuyen: 'Chuyến đi 6 ngày qua 4 con đèo cao của Gạc Măng Rê để tìm đúng người giữ được mẻ mật sánh nguyên bản không pha đường.',
  shipping_estimate: '18–20/10/2026',
  created_at: '2026-10-02T08:00:00Z',
  updated_at: '2026-10-05T12:00:00Z',
  product: mockProduct,
};

export const mockStory001: Story = {
  id: 'd4444444-4444-4444-4444-444444444444',
  title: 'Hương hoa dại nở trên vách đá tai mèo Mèo Vạc',
  slug: 'huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac',
  type: 'ARTICLE',
  excerpt: 'Ở nơi chỉ có đá xám và gió lạnh, có một thứ mật ngọt màu vàng chanh ánh xanh kì lạ được chắt chiu từ sự nhẫn nại của con người và loài ong bản địa.',
  content: `Mùa đông ở cao nguyên đá không có màu của sự sống vội vã. Tất cả thu mình lại dưới lớp sương muối đặc quánh. Nhưng chính trong cái rét căm căm ấy, những vạt hoa bạc hà dại lại bừng nở tím ngát khắp các triền đá nứt nẻ.

Chúng tôi tìm đến lán của anh Giàng A Páo khi sương chiều vừa buông. Trong gian nhà đất ám mùi khói củi, những bình mật ong sóng sánh màu vàng chanh ánh xanh được xếp ngay ngắn trên kệ gỗ.

"Mật này một năm chỉ có đúng một vụ vào tháng 10 tới tháng 12 âm lịch," anh Páo vừa rót mời chúng tôi ngụm trà nóng pha mật, vừa cười bảo. "Nếu ham lấy nhiều mà vắt non, mật sẽ loãng và chua. Phải đợi đàn ong quạt cánh cô đặc, vít kín sáp tổ lại mới được hạ tầng quay."

Ngụm mật đầu tiên tan trên đầu lưỡi mang đến cảm giác hoàn toàn khác biệt: không ngọt khé, không nồng mùi hương liệu, mà thanh mát, có một chút the nhẹ như gió sớm thổi qua rặng cây.

Đó là lý do Gạc Măng Rê quyết định mở Ngăn #001: đưa hương vị chân thật của triền đá Hà Giang về đúng căn bếp của những người biết trân trọng sự tử tế.`,
  cover_image: mockMediaAssets[2].url,
  media_assets: [mockMediaAssets[2], mockMediaAssets[1], mockMediaAssets[3]],
  producer_id: mockProducer.id,
  product_id: mockProduct.id,
  published_at: '2026-10-02T08:00:00Z',
  status: 'ACTIVE',
  created_at: '2026-10-02T08:00:00Z',
  updated_at: '2026-10-02T08:00:00Z',
  producer: mockProducer,
  product: mockProduct,
};

export const mockOrdersStore: Order[] = [
  {
    id: 'e5555555-5555-5555-5555-555555555551',
    order_code: 'GM-2026-000073',
    customer_id: 'cust-1',
    ngan_id: mockNgan001.id,
    quantity: 2,
    unit_price: 280000,
    total_amount: 560000,
    status: 'CONFIRMED',
    payment_status: 'PENDING_MOQ',
    created_at: '2026-10-05T09:30:00Z',
    updated_at: '2026-10-05T09:30:00Z',
    customer: {
      id: 'cust-1',
      name: 'Nguyễn Thuỳ Chi',
      phone: '0988112233',
      zalo_identifier: '0988112233',
      address: 'Phố Đặng Thai Mai, Tây Hồ, Hà Nội',
      province: 'Hà Nội',
      created_at: '2026-10-05T09:30:00Z',
    },
    ngan: mockNgan001,
  },
];
