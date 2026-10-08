import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNganBySlug, getNganCtaSpec } from '@/services/ngan-service';
import { contentConfigService } from '@/services/content-config-service';
import ProgressBar from '@/components/ProgressBar';
import EvidenceDrawer from '@/components/EvidenceDrawer';
import { MapPin, ArrowRight, ShieldCheck, Camera, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { CanonicalEvidenceItem, MediaAsset } from '@/types';

interface NganPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NganDetailPage({ params }: NganPageProps) {
  const { slug } = await params;
  const ngan = await getNganBySlug(slug);

  if (!ngan) {
    notFound();
  }

  // Retrieve Content & Asset configuration layer (Dynamic override layer)
  const contentConfig = contentConfigService.getConfigByNganId(ngan.slug);

  const ctaSpec = getNganCtaSpec(ngan);

  // Price formatting
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(ngan.price);

  // Sort and pick assets using strict provenance priority: REAL FIRST, BEAUTIFUL SECOND
  const rawAssets: MediaAsset[] = ngan.media_assets || [];
  const sortedAssets = contentConfigService.sortAssetsByProvenance(rawAssets.filter(a => a.approved !== false));

  const heroAsset = sortedAssets.find((a) => a.slot === 'hero') || sortedAssets[0] || {
    id: 'hero-fallback',
    url: ngan.hero_image,
    caption: ngan.title,
    alt_text: ngan.title,
    credit: 'Ảnh: Gạc Măng Rê',
    slot: 'hero',
    asset_type: 'DOCUMENTARY',
    provenance_level: 1,
    approved: true,
  };

  const handsAsset = sortedAssets.find((a) => a.slot === 'hands') || sortedAssets[1];
  const placeAsset = sortedAssets.find((a) => a.slot === 'place') || sortedAssets[2];
  const textureAsset = sortedAssets.find((a) => a.slot === 'texture') || sortedAssets[3];

  const storyObj = ngan.story_object;
  const demand = ngan.demand_state;
  const canonicalLocation =
    ngan.product?.canonical_locations?.find((l) => l.role === 'RAW_MATERIAL_ORIGIN')?.name ||
    ngan.product?.origin ||
    'Châu Đức, Bà Rịa - Vũng Tàu';
  const processingLocation = ngan.product?.canonical_locations?.find((l) => l.role === 'PROCESSING_LOCATION')?.name;

  const currentQty = demand?.current_quantity ?? ngan.current_quantity ?? 18;
  const targetMoq = demand?.moq ?? ngan.moq ?? 30;
  const remainingQty = Math.max(0, targetMoq - currentQty);

  // Evidence list for Drawer
  const evidenceList: CanonicalEvidenceItem[] = (storyObj?.evidence_refs && storyObj.evidence_refs.length > 0)
    ? storyObj.evidence_refs
    : [
        {
          id: 'EVD-OCA-001',
          claim: 'Hạt cacao được thu hoạch từ các hộ nông dân tại huyện Châu Đức, Bà Rịa - Vũng Tàu',
          truth_status: 'VERIFIED',
          source_type: 'FIELD_EXPEDITION',
          source_title: 'Khảo sát thực địa GMR tại Châu Đức & Bình Giã',
          notes: 'Đã xác nhận vùng trồng hữu cơ vi sinh liên kết với OCA.',
        },
        {
          id: 'EVD-OCA-002',
          claim: 'Ủ hạt bằng thùng gỗ mít truyền thống 6 ngày, phơi giàn lưới tự nhiên',
          truth_status: 'VERIFIED',
          source_type: 'PRODUCER_DOCUMENT',
          source_title: 'Quy trình công nghệ chế biến OCA',
          notes: 'Đối soát trực tiếp tại xưởng sơ chế Châu Đức.',
        },
        {
          id: 'EVD-OCA-003',
          claim: '100% nguyên chất, không pha trộn đường, sữa hay phụ gia công nghiệp',
          truth_status: 'VERIFIED',
          source_type: 'INDEPENDENT_TEST',
          source_title: 'Phiếu kiểm nghiệm thành phần & chỉ tiêu vi sinh',
          notes: 'Chứng chỉ an toàn vệ sinh thực phẩm hợp chuẩn.',
        },
        {
          id: 'EVD-OCA-004',
          claim: 'Dinh dưỡng thực vật tự nhiên từ cacao mộc hỗ trợ năng lượng lành mạnh',
          truth_status: 'PRODUCER_CLAIM',
          source_type: 'PRODUCER_DOCUMENT',
          source_title: 'Tài liệu The Pure Cacao Project',
          notes: 'Công bố định hướng sản phẩm của OCA. GMR ghi nhận dạng Producer Claim, không tuyên bố công dụng chữa bệnh.',
        },
      ];

  // Dynamic Value Items from Content Config or canonical product data
  const valueItems = contentConfig?.value_items || [
    {
      id: 'val-01',
      title: `01 phần ${ngan.product?.name || ngan.title} (${ngan.product?.unit || 'Phần chuẩn'})`,
      description: ngan.product?.description || ngan.short_description,
    },
    {
      id: 'val-02',
      title: `Vùng nguyên liệu ${canonicalLocation}`,
      description: `Thu hoạch và chế biến trực tiếp tại vùng đất nguyên bản của ${ngan.product?.producer?.name || 'người làm'}.`,
    },
    {
      id: 'val-03',
      title: 'Thẻ câu chuyện sản vật & Đôi tay người làm',
      description: 'Bản in thẻ vật lý đánh dấu mã mẻ, hành trình từ xưởng/vườn đến tay người thưởng thức.',
    },
    {
      id: 'val-04',
      title: 'Đồng hành theo dõi mẻ qua Zalo OA',
      description: `Nhận thông báo khi mẻ đủ ${targetMoq} phần và cập nhật tiến độ hạ mẻ, hoàn toàn không thu tiền trước.`,
    },
  ];

  const healthConfig = contentConfig?.health_content_ref || {
    headline: `${ngan.product?.name || ngan.title} & Sức Khỏe Tự Nhiên`,
    description: `Tài liệu thực địa và thông tin từ ${ngan.product?.producer?.name || 'nhà làm'} ghi nhận sản vật giữ nguyên phẩm chất tươi mộc tự nhiên, phù hợp lối sống lành mạnh.`,
    allowed_claims: [
      `100% ${ngan.product?.ingredients || 'Nguyên chất tự nhiên, không phụ gia công nghiệp'}.`,
      'Bảo tồn trọn vẹn dưỡng chất tự nhiên từ vùng canh tác nguyên bản.',
      'Sản phẩm thô mộc được sơ chế cẩn trọng theo phương pháp truyền thống.',
      'Thưởng thức mộc vị hoặc kết hợp linh hoạt theo phong vị hàng ngày.',
    ],
    truth_status: 'PRODUCER_CLAIM' as const,
    evidence_request_note: 'GMR chỉ công bố các dữ kiện đã đối soát và ghi nhận định hướng tự nhiên từ nhà sản xuất. Tuyệt đối không tuyên bố trị liệu hay phòng ngừa bệnh y khoa.',
  };

  return (
    <div className="pb-36 bg-[#FAF8F5] text-[#141211] font-sans selection:bg-[#EBDCCB]">
      
      {/* 01 — MỞ NGĂN / HERO SECTION */}
      <section className="pt-8 md:pt-14 pb-10 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Gallery: Real first, Documentary priority */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-[#E7DFD3] bg-[#F3EDE2]">
              <Image
                src={heroAsset.url}
                alt={heroAsset.alt_text || ngan.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#141211]/90 backdrop-blur-md text-[#FAF8F5] font-mono text-[11px] tracking-widest uppercase shadow-sm">
                  NGĂN #{ngan.number.replace('#', '')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-sans font-medium text-[#141211] shadow-xs">
                  <Camera className="w-3 h-3 text-[#A65F25]" />
                  <span>
                    {heroAsset.provenance_level === 1 ? 'Ảnh tư liệu thực địa GMR' : 'Ảnh tư liệu nhà sản xuất'}
                  </span>
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-[10px] text-[#FAF8F5] bg-[#141211]/70 backdrop-blur-sm px-3 py-1.5 rounded-lg line-clamp-1">
                  {heroAsset.caption || ngan.title} · {heroAsset.credit || 'Ghi nhận thực tế tại Châu Đức'}
                </p>
              </div>
            </div>

            {/* Sub-gallery (Hands, Place, Texture) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-2xs group bg-[#EDE6DC]">
                {handsAsset ? (
                  <Image
                    src={handsAsset.url}
                    alt={handsAsset.alt_text || 'Đôi tay người làm'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#8C827A]">Đôi tay</div>
                )}
                <span className="absolute bottom-1.5 left-2 text-[9px] text-white/95 bg-black/60 px-1.5 py-0.5 rounded font-mono">
                  Đôi tay người làm
                </span>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-2xs group bg-[#EDE6DC]">
                {placeAsset ? (
                  <Image
                    src={placeAsset.url}
                    alt={placeAsset.alt_text || 'Vùng nguyên liệu'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#8C827A]">Vùng đất</div>
                )}
                <span className="absolute bottom-1.5 left-2 text-[9px] text-white/95 bg-black/60 px-1.5 py-0.5 rounded font-mono">
                  Vùng đất nguyên bản
                </span>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-2xs group bg-[#EDE6DC]">
                {textureAsset ? (
                  <Image
                    src={textureAsset.url}
                    alt={textureAsset.alt_text || 'Chất lượng mộc'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#8C827A]">Chất lượng</div>
                )}
                <span className="absolute bottom-1.5 left-2 text-[9px] text-white/95 bg-black/60 px-1.5 py-0.5 rounded font-mono">
                  Bột cacao mộc
                </span>
              </div>
            </div>
          </div>

          {/* Above-fold Commerce & Editorial Head */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#A65F25] uppercase tracking-widest font-bold">
                  NGĂN #{ngan.number.replace('#', '')}
                </span>
                <span className="text-[10px] text-[#665E58] font-mono">· GOLDEN TEST #001</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141211] leading-tight tracking-tight">
                {ngan.slug === 'cacao-len-men-thu-cong-oca' ? (contentConfig?.headline_override || 'CACAO OCA') : ngan.title}
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-[#665E58]">
                <MapPin className="w-3.5 h-3.5 text-[#A65F25] shrink-0" />
                <span className="font-medium text-[#141211]">
                  {canonicalLocation}
                </span>
              </div>

              <p className="text-sm font-serif text-[#423B36] leading-relaxed pt-1">
                {contentConfig?.subheadline_override || ngan.short_description}
              </p>
            </div>

            {/* TRUST STRIP (02) — Nguồn gốc · Quy trình · Minh chứng */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD3] shadow-xs space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A65F25] font-bold block">
                    Nguồn gốc
                  </span>
                  <span className="text-xs font-serif font-bold text-[#141211] block truncate">
                    {canonicalLocation.split(',')[0].trim()}
                  </span>
                  <span className="text-[9px] text-emerald-800 font-mono block">Đã đối soát</span>
                </div>
                <div className="space-y-1 border-x border-[#E7DFD3]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A65F25] font-bold block">
                    Quy trình
                  </span>
                  <span className="text-xs font-serif font-bold text-[#141211] block truncate">
                    {storyObj?.making_process?.[0]?.split(':')[0] || 'Chế biến mộc'}
                  </span>
                  <span className="text-[9px] text-emerald-800 font-mono block">Thủ công</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A65F25] font-bold block">
                    Minh chứng
                  </span>
                  <span className="text-xs font-serif font-bold text-[#141211] block truncate">
                    Hồ sơ thực địa
                  </span>
                  <span className="text-[9px] text-emerald-800 font-mono block">Verified Fact</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0EBE1] flex justify-center">
                <EvidenceDrawer evidenceItems={evidenceList} originName="CACAO OCA" />
              </div>
            </div>

            {/* 03 — CÙNG MỞ MẺ (Primary Conversion Module) */}
            <div className="p-6 rounded-3xl bg-white border border-[#D9CEBF] shadow-sm space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#665E58] block">
                    Mức đóng góp mẻ
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-3xl font-bold text-[#141211]">
                      {formattedPrice}
                    </span>
                    <span className="text-xs text-[#665E58]">/ phần (250g)</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Chưa thu tiền trước
                </span>
              </div>

              {/* Progress & Live Demand State */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#141211]">
                    {currentQty}/{targetMoq} phần đã đăng ký
                  </span>
                  <span className="font-mono text-[#A65F25] font-bold">
                    Còn {remainingQty} phần để đủ mẻ
                  </span>
                </div>
                <ProgressBar current={currentQty} moq={targetMoq} />
                <p className="text-[11px] text-[#665E58] leading-relaxed">
                  {currentQty} người đã cùng mở mẻ. Khi đủ {targetMoq} phần, xưởng OCA bắt đầu rang xay mộc và xuất xưởng mẻ tươi mới nhất.
                </p>
              </div>

              {/* Intent Selection */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <Link
                  href={`/dat-hang/${ngan.slug}?intent=PERSONAL`}
                  className="p-3 rounded-xl border border-[#E7DFD3] hover:border-[#141211] bg-[#FAF8F5] transition text-center"
                >
                  <strong className="block text-[#141211]">Dùng cho mình</strong>
                  <span className="text-[10px] text-[#665E58]">Thức uống mộc sáng</span>
                </Link>
                <Link
                  href={`/dat-hang/${ngan.slug}?intent=GIFT`}
                  className="p-3 rounded-xl border border-[#A65F25]/40 hover:border-[#A65F25] bg-[#FFF9F2] transition text-center"
                >
                  <strong className="block text-[#A65F25]">Làm quà biếu</strong>
                  <span className="text-[10px] text-[#665E58]">Kèm thẻ câu chuyện</span>
                </Link>
              </div>

              {/* Primary CTA Button */}
              <div className="space-y-2 pt-2">
                <Link
                  href={`/dat-hang/${ngan.slug}`}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-[#141211] hover:bg-[#A65F25] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold transition-all shadow-md flex items-center justify-center gap-2 text-center"
                >
                  <span>CÙNG MỞ MẺ CACAO OCA</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center text-[#665E58]">
                  ✓ Chỉ xác nhận thanh toán khi mẻ đạt 100% MOQ qua Zalo OA
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* EDITORIAL CONTENT FLOW */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16 pt-8 border-t border-[#E7DFD3]">
        
        {/* 04 — BẠN SẼ NHẬN ĐƯỢC GÌ? (Editorial Product Card) */}
        <section className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A65F25] font-bold block">
              TRẢI NGHIỆM THỰC NHẬN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
              Bạn sẽ nhận được gì khi cùng mở mẻ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {valueItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-5 rounded-2xl bg-white border border-[#E7DFD3] shadow-2xs space-y-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <h3 className="font-serif text-base font-bold text-[#141211]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-[#554D46] font-sans leading-relaxed pl-6">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Product Specifications Box */}
          <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] shadow-2xs space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E7DFD3]">
              <div>
                <span className="text-[#665E58] block mb-0.5">Khối lượng tịnh</span>
                <strong className="text-sm text-[#141211] font-semibold">250g / hộp</strong>
              </div>
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[#665E58] block mb-0.5">Bơ cacao tự nhiên</span>
                <strong className="text-sm text-[#141211] font-semibold">&gt;18% (Non-alkalized)</strong>
              </div>
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[#665E58] block mb-0.5">Thành phần</span>
                <strong className="text-sm text-[#141211] font-semibold">100% hạt cacao lên men</strong>
              </div>
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[#665E58] block mb-0.5">Hạn sử dụng</span>
                <strong className="text-sm text-[#141211] font-semibold">12 tháng từ ngày đóng mẻ</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 05 — CACAO & SỨC KHỎE (Strict Health Governance - PRODUCER CLAIM only) */}
        <section className="p-7 sm:p-9 rounded-3xl bg-[#FFF9F2] border border-[#F0DCB8] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0DCB8]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A65F25]" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141211]">
                {healthConfig.headline}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
              <AlertCircle className="w-3 h-3 text-amber-700" />
              PRODUCER CLAIM
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#554D46] leading-relaxed font-sans">
            {healthConfig.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {healthConfig.allowed_claims.map((claim, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/80 border border-[#F0DCB8] text-xs font-sans text-[#423B36] flex items-start gap-2">
                <span className="text-[#A65F25] font-bold">•</span>
                <span>{claim}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E7DFD3] text-[11px] font-sans text-[#665E58] leading-relaxed">
            <strong className="text-[#A65F25] block mb-0.5">Cam kết trung thực từ Gạc Măng Rê:</strong>
            {healthConfig.evidence_request_note}
          </div>
        </section>

        {/* 06 — VÌ SAO SẢN VẬT NÀY ĐÁNG BIẾT */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A65F25] font-bold">
              06 — VÌ SAO SẢN VẬT NÀY ĐÁNG BIẾT
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
              VERIFIED FACT
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            {storyObj?.headline || 'Cacao Lên Men Thủ Công Châu Đức — Vị Mộc Giữa Vùng Đất Đỏ'}
          </h2>
          <p className="text-base font-serif text-[#423B36] leading-relaxed">
            {storyObj?.why_this || ngan.short_description}
          </p>
          <div className="p-5 rounded-2xl bg-white border border-[#E7DFD3] text-xs font-serif italic text-[#665E58] leading-relaxed">
            &ldquo;{storyObj?.selection_chuyen || ngan.selection_chuyen}&rdquo;
          </div>
        </section>

        {/* 07 — NGUỒN GỐC & NGƯỜI LÀM (Real first, isolate completely) */}
        <section className="space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#A65F25] font-bold block">
            07 — NGUỒN GỐC & NGƯỜI LÀM (MAKER IDENTITY)
          </span>
          <div className="p-7 sm:p-9 rounded-3xl bg-white border border-[#E7DFD3] shadow-xs flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#E7DFD3]">
              <Image
                src={ngan.product?.producer?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'}
                alt={ngan.product?.producer?.name || 'Nhà làm sản vật'}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-[#141211]">
                  {ngan.product?.producer?.name || 'Xưởng Cacao OCA'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                  CANONICAL MAKER
                </span>
              </div>
              <p className="text-xs font-semibold text-[#A65F25]">
                {ngan.product?.producer?.brand_name} · {canonicalLocation}
              </p>
              <p className="text-sm text-[#423B36] leading-relaxed font-sans">
                {storyObj?.selection_nguoi || ngan.selection_nguoi}
              </p>
            </div>
          </div>
        </section>

        {/* 08 — ĐIỀU GÌ TẠO NÊN NÓ (Quy trình làm mộc) */}
        <section className="space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#A65F25] font-bold block">
            08 — ĐIỀU GÌ TẠO NÊN NÓ (MAKING PROCESS)
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            Quy trình làm mộc, bảo toàn chất tự nhiên
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {storyObj?.making_process && storyObj.making_process.length > 0 ? (
              storyObj.making_process.map((step, idx) => {
                const parts = step.split(':');
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E7DFD3] space-y-1">
                    <span className="text-[10px] font-mono text-[#A65F25] font-bold uppercase">
                      Bước 0{idx + 1}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#141211]">
                      {parts[0]}
                    </h4>
                    {parts[1] && (
                      <p className="text-xs text-[#554D46] font-sans leading-relaxed">
                        {parts.slice(1).join(':').trim()}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-[#E7DFD3] text-xs text-[#554D46]">
                Quy trình lên men thùng gỗ mít 6 ngày và phơi nắng tự nhiên tại Châu Đức.
              </div>
            )}
          </div>
        </section>

        {/* 09 — CÙNG MỞ MẺ LẦN 2 (Repetition Conversion Module) */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#141211] text-[#FAF8F5] shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#D9CEBF] font-mono block">
              09 — KẾT NỐI MẺ SẢN XUẤT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              Cùng mở mẻ Cacao OCA — Đủ 30 phần để bắt đầu rang xay
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/80 font-sans leading-relaxed">
              Bạn không phải trả tiền trước. Gạc Măng Rê kết nối đủ số người thưởng thức để nông hộ và xưởng chuẩn bị đúng mẻ tươi, giữ trọn vẹn hương vị thủ công.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/80">Tiến độ mẻ hiện tại:</span>
              <span className="text-[#EBDCCB] font-bold">{currentQty} / {targetMoq} phần</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#A65F25] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((currentQty / targetMoq) * 100))}%` }}
              />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="font-serif text-2xl font-bold text-white">
                  {formattedPrice}
                </span>
                <span className="text-xs text-white/70"> / phần</span>
              </div>
              <span className="text-xs text-[#EBDCCB] font-mono">Còn {remainingQty} phần</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href={`/dat-hang/${ngan.slug}`}
              className="w-full sm:flex-1 min-h-[48px] py-4 px-8 rounded-full bg-[#A65F25] hover:bg-[#864918] text-white text-xs uppercase tracking-widest font-bold transition-all text-center flex items-center justify-center gap-2 shadow-lg"
            >
              <span>CÙNG MỞ MẺ NGAY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="w-full sm:w-auto text-center">
              <EvidenceDrawer evidenceItems={evidenceList} originName="CACAO OCA" />
            </div>
          </div>
        </section>

      </div>

      {/* 10 — STICKY CTA (Mobile sticky bottom & Desktop compact floating) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E7DFD3] p-3 sm:p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#665E58] uppercase font-mono tracking-wider block">
                NGĂN #{ngan.number.replace('#', '')} · {ngan.product?.name || ngan.title}
              </span>
              <span className="text-[10px] font-mono text-[#A65F25] font-semibold hidden sm:inline">
                ({currentQty}/{targetMoq} phần)
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#141211]">
                {formattedPrice}
              </span>
              <span className="text-[11px] text-[#665E58]">/ phần</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <EvidenceDrawer evidenceItems={evidenceList} originName={ngan.product?.name || ngan.title} />
            </div>
            <Link
              href={`/dat-hang/${ngan.slug}`}
              className="min-h-[48px] px-6 sm:px-8 py-3.5 rounded-full bg-[#141211] hover:bg-[#A65F25] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold transition-all shadow-md text-center flex items-center justify-center gap-2"
            >
              <span>CÙNG MỞ MẺ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
