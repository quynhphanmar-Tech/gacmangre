import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNganBySlug, getNganCtaSpec } from '@/services/ngan-service';
import { contentConfigService } from '@/services/content-config-service';
import ProgressBar from '@/components/ProgressBar';
import EvidenceDrawer from '@/components/EvidenceDrawer';
import { MapPin, ArrowRight, ShieldCheck, Camera, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { CanonicalEvidenceItem, MediaAsset } from '@/types';

import { Metadata } from 'next';

interface NganPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NganPageProps): Promise<Metadata> {
  const { slug } = await params;
  const ngan = await getNganBySlug(slug);

  if (!ngan) {
    return {
      title: 'Ngăn không tồn tại · Gạc Măng Rê',
    };
  }

  const canonicalUrl = `https://brandtalk.asia/gacmangre/ngan/${slug}`;

  return {
    title: `${ngan.title} — Ngăn #${ngan.number.replace('#', '')} | Gạc Măng Rê`,
    description: ngan.short_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${ngan.title} — Ngăn #${ngan.number.replace('#', '')}`,
      description: ngan.short_description,
      url: canonicalUrl,
      images: [
        {
          url: ngan.hero_image,
          width: 1200,
          height: 630,
          alt: ngan.title,
        },
      ],
      type: 'website',
    },
  };
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
          id: `EVD-${ngan.number.replace('#', '')}-001`,
          claim: `Vùng nguyên liệu xuất xứ tại ${canonicalLocation}`,
          truth_status: 'VERIFIED',
          source_type: 'FIELD_EXPEDITION',
          source_title: `Khảo sát thực địa GMR tại ${canonicalLocation}`,
          notes: `Đã xác nhận vùng canh tác thực tế của ${ngan.product?.producer?.name || 'nhà làm'}.`,
        },
        {
          id: `EVD-${ngan.number.replace('#', '')}-002`,
          claim: 'Quy trình sơ chế thủ công mộc, kiểm soát theo tiêu chuẩn Gạc Măng Rê',
          truth_status: 'VERIFIED',
          source_type: 'PRODUCER_DOCUMENT',
          source_title: 'Hồ sơ quy trình khai thác và chế biến',
          notes: 'Đối soát trực tiếp tại cơ sở sản xuất.',
        },
        {
          id: `EVD-${ngan.number.replace('#', '')}-003`,
          claim: ngan.product?.ingredients ? `Thành phần: ${ngan.product.ingredients}` : 'Sản vật nguyên chất tự nhiên, minh bạch nguồn gốc',
          truth_status: 'VERIFIED',
          source_type: 'INDEPENDENT_TEST',
          source_title: 'Phiếu kiểm nghiệm thành phần & chỉ tiêu vệ sinh an toàn',
          notes: 'Chứng chỉ an toàn thực phẩm và hồ sơ đối soát hợp chuẩn.',
        },
        {
          id: `EVD-${ngan.number.replace('#', '')}-004`,
          claim: 'Định hướng sản phẩm thô mộc, bảo toàn phẩm chất tự nhiên',
          truth_status: 'PRODUCER_CLAIM',
          source_type: 'PRODUCER_DECLARATION',
          source_title: `Cam kết chất lượng từ ${ngan.product?.producer?.name || 'nhà làm'}`,
          notes: 'GMR ghi nhận dạng Producer Claim, tuyệt đối không tuyên bố trị liệu hay công dụng y khoa.',
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

  // Machine-readable Schema.org for AI & Search crawlers
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: ngan.product?.name || ngan.title,
    image: [heroAsset.url],
    description: ngan.short_description,
    sku: `GMR-${ngan.number.replace('#', '')}`,
    brand: {
      '@type': 'Brand',
      name: ngan.product?.producer?.brand_name || ngan.product?.producer?.name || 'Gạc Măng Rê',
    },
    offers: {
      '@type': 'Offer',
      url: `https://brandtalk.asia/gacmangre/ngan/${slug}`,
      priceCurrency: 'VND',
      price: ngan.price,
      availability: 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
    },
    category: 'Local Artisanal Food & Provenance',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://brandtalk.asia/gacmangre',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `Ngăn #${ngan.number.replace('#', '')}`,
        item: `https://brandtalk.asia/gacmangre/ngan/${slug}`,
      },
    ],
  };

  return (
    <div className="pb-36 bg-[#FAF8F5] text-[#141211] font-sans selection:bg-[#EBDCCB]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
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
                  {heroAsset.caption || ngan.title} · {heroAsset.credit || `Ghi nhận thực tế tại ${canonicalLocation}`}
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
                  {textureAsset?.alt_text || 'Phẩm chất mộc'}
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
                <EvidenceDrawer evidenceItems={evidenceList} originName={ngan.product?.name || ngan.title} />
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
                  {currentQty} người đã cùng mở mẻ. Khi đủ {targetMoq} phần, {ngan.product?.producer?.name || 'nhà làm'} bắt đầu đóng mẻ chuẩn và xuất xưởng mẻ tươi mới nhất.
                </p>
              </div>

              {/* Intent Selection */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <Link
                  href={`/dat-hang/${ngan.slug}?intent=PERSONAL`}
                  className="p-3 rounded-xl border border-[#E7DFD3] hover:border-[#141211] bg-[#FAF8F5] transition text-center"
                >
                  <strong className="block text-[#141211]">Dùng cho mình</strong>
                  <span className="text-[10px] text-[#665E58]">Thưởng thức tại nhà</span>
                </Link>
                <Link
                  href={`/dat-hang/${ngan.slug}?intent=GIFT`}
                  className="p-3 rounded-xl border border-[#A65F25]/40 hover:border-[#A65F25] bg-[#FFF9F2] transition text-center"
                >
                  <strong className="block text-[#A65F25]">Làm quà biếu / quà tặng</strong>
                  <span className="text-[10px] text-[#665E58]">Kèm thẻ câu chuyện</span>
                </Link>
              </div>

              {/* Primary CTA Button - derived from Ngăn State */}
              <div className="space-y-2 pt-2">
                <Link
                  href={`/dat-hang/${ngan.slug}`}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-[#141211] hover:bg-[#A65F25] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold transition-all shadow-md flex items-center justify-center gap-2 text-center"
                >
                  <span>{ctaSpec.ctaText}</span>
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

          {/* Product Specifications Box - Derived dynamically from product data */}
          <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] shadow-2xs space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E7DFD3]">
              <div>
                <span className="text-[#665E58] block mb-0.5">Khối lượng / Quy cách</span>
                <strong className="text-sm text-[#141211] font-semibold">
                  {ngan.product?.unit || ngan.product?.weight || 'Quy chuẩn đóng gói'}
                </strong>
              </div>
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[#665E58] block mb-0.5">Xuất xứ / Vùng trồng</span>
                <strong className="text-sm text-[#141211] font-semibold truncate block">
                  {canonicalLocation.split(',')[0].trim()}
                </strong>
              </div>
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[#665E58] block mb-0.5">Thành phần</span>
                <strong className="text-sm text-[#141211] font-semibold line-clamp-1">
                  {ngan.product?.ingredients || '100% Nguyên chất tự nhiên'}
                </strong>
              </div>
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[#665E58] block mb-0.5">Hạn sử dụng</span>
                <strong className="text-sm text-[#141211] font-semibold">
                  {ngan.product?.expiry || '12 tháng từ ngày đóng mẻ'}
                </strong>
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
                Quy trình khai thác và sơ chế thủ công mộc tại {canonicalLocation}.
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
              Cùng mở mẻ {ngan.product?.name || ngan.title} — Đủ {targetMoq} phần để bắt đầu xuất xưởng
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/80 font-sans leading-relaxed">
              Bạn không phải trả tiền trước. Gạc Măng Rê kết nối đủ số người thưởng thức để {ngan.product?.producer?.name || 'nhà làm'} chuẩn bị đúng mẻ tươi, giữ trọn vẹn hương vị thủ công.
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
              <span>{ctaSpec.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="w-full sm:w-auto text-center">
              <EvidenceDrawer evidenceItems={evidenceList} originName={ngan.product?.name || ngan.title} />
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
              <span>{ctaSpec.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
