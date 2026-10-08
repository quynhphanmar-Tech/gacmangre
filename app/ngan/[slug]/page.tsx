import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNganBySlug, getNganCtaSpec } from '@/services/ngan-service';
import ProgressBar from '@/components/ProgressBar';
import { MapPin, ArrowRight, ShieldCheck, Camera, Clock, Truck } from 'lucide-react';
import { CanonicalEvidenceItem } from '@/types';

interface NganPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NganDetailPage({ params }: NganPageProps) {
  const { slug } = await params;
  const ngan = await getNganBySlug(slug);

  if (!ngan) {
    notFound();
  }

  const ctaSpec = getNganCtaSpec(ngan);

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(ngan.price);

  // Asset slot resolution with product integrity
  const heroAsset = ngan.media_assets?.find((a) => a.slot === 'hero') || ngan.media_assets?.[0];
  const handsAsset = ngan.media_assets?.find((a) => a.slot === 'hands') || ngan.media_assets?.[1];
  const placeAsset = ngan.media_assets?.find((a) => a.slot === 'place') || ngan.media_assets?.[2];
  const textureAsset = ngan.media_assets?.find((a) => a.slot === 'texture') || ngan.media_assets?.[3];

  const storyObj = ngan.story_object;
  const demand = ngan.demand_state;
  const canonicalLocation = ngan.product?.canonical_locations?.find((l) => l.role === 'RAW_MATERIAL_ORIGIN')?.name || ngan.product?.origin || 'Vùng đất nguyên bản';
  const processingLocation = ngan.product?.canonical_locations?.find((l) => l.role === 'PROCESSING_LOCATION')?.name;

  const currentQty = demand?.current_quantity ?? ngan.current_quantity;
  const targetMoq = demand?.moq ?? ngan.moq;

  return (
    <div className="pb-32">
      {/* 01. HERO SECTION — ABOVE-FOLD COMMERCE & OVERVIEW */}
      <section className="pt-8 md:pt-16 pb-14 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Photography Gallery with Documentary Metadata */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-pantry border border-[#E7DFD3] bg-[#F3EDE2]">
              <Image
                src={heroAsset?.url || ngan.hero_image}
                alt={heroAsset?.alt_text || ngan.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#141211]/90 backdrop-blur-md text-[#FAF8F5] font-mono text-[11px] tracking-pantryst uppercase shadow-sm">
                  NGĂN {ngan.number}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFFFFF]/85 backdrop-blur-md text-[10px] font-sans font-medium text-[#141211]">
                  <Camera className="w-3 h-3 text-[#A65F25]" />
                  <span>{heroAsset?.asset_type === 'DOCUMENTARY' ? 'Tư liệu thực địa' : 'Ảnh sản vật thực tế'}</span>
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-[10px] text-[#FAF8F5]/90 bg-[#141211]/60 backdrop-blur-sm px-2.5 py-1 rounded-md line-clamp-1">
                  {heroAsset?.caption || ngan.title} · {heroAsset?.credit || 'Ảnh: Gạc Măng Rê'}
                </p>
              </div>
            </div>

            {/* Editorial Secondary Photography */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-sm group">
                {handsAsset ? (
                  <Image
                    src={handsAsset.url}
                    alt={handsAsset.alt_text || 'Đôi tay người làm'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EDE6DC] flex items-center justify-center text-xs text-[#8C827A]">Đôi tay</div>
                )}
                <span className="absolute bottom-1 left-2 text-[9px] text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                  Đôi tay
                </span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-sm group">
                {placeAsset ? (
                  <Image
                    src={placeAsset.url}
                    alt={placeAsset.alt_text || 'Vùng đất sản vật'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EDE6DC] flex items-center justify-center text-xs text-[#8C827A]">Vùng đất</div>
                )}
                <span className="absolute bottom-1 left-2 text-[9px] text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                  Vùng đất
                </span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-sm group">
                {textureAsset ? (
                  <Image
                    src={textureAsset.url}
                    alt={textureAsset.alt_text || 'Chất lượng sản vật'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EDE6DC] flex items-center justify-center text-xs text-[#8C827A]">Chất lượng</div>
                )}
                <span className="absolute bottom-1 left-2 text-[9px] text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                  Chất lượng
                </span>
              </div>
            </div>
          </div>

          {/* Above-fold Commerce & Progress Panel */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-3">
              <span className="font-mono text-xs text-[#A65F25] uppercase tracking-pantryst font-bold block">
                NGĂN {ngan.number}
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141211] leading-tight">
                {ngan.title}
              </h1>

              <div className="flex items-center gap-2 text-xs font-sans text-[#665E58]">
                <MapPin className="w-3.5 h-3.5 text-[#A65F25]" />
                <span>
                  Nguyên liệu: {canonicalLocation}
                </span>
              </div>
            </div>

            {/* TRUST STRIP — Early Trust Layer (Nguồn gốc · Quy trình · Minh chứng) */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] grid grid-cols-3 gap-2 text-center">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A65F25] font-bold block">
                  Nguồn gốc
                </span>
                <span className="text-xs font-serif font-bold text-[#141211] block line-clamp-1">
                  {canonicalLocation}
                </span>
                <span className="text-[9px] text-emerald-800 font-mono block">GPS / Hồ sơ thật</span>
              </div>
              <div className="space-y-1 border-x border-[#E7DFD3]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A65F25] font-bold block">
                  Quy trình
                </span>
                <span className="text-xs font-serif font-bold text-[#141211] block line-clamp-1">
                  {storyObj?.making_process?.[0]?.split(':')[0] || 'Mộc nguyên bản'}
                </span>
                <span className="text-[9px] text-[#665E58] font-mono block">Mộc nguyên bản</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A65F25] font-bold block">
                  Minh chứng
                </span>
                <span className="text-xs font-serif font-bold text-[#141211] block line-clamp-1">
                  {storyObj?.evidence_refs?.[0]?.truth_status || 'VERIFIED'}
                </span>
                <span className="text-[9px] text-emerald-800 font-mono block">Đã qua thẩm định</span>
              </div>
            </div>

            {/* Price block */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block">
                  Mức giá một phần
                </span>
                <span className="font-serif text-3xl font-bold text-[#141211]">
                  {formattedPrice}
                </span>
                <span className="text-xs text-[#665E58]"> / phần</span>
              </div>
              <span className="text-xs font-semibold text-[#4D6346] bg-[#F4F6F2] px-3 py-1 rounded-full border border-[#D7E2D3]">
                {ngan.product?.unit || 'Phần chuẩn'}
              </span>
            </div>

            {/* Progress Bar (Demand Mechanism - Rephrased to Cùng mở mẻ) */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-pantryst text-[#A65F25] font-bold block">
                  Tiến độ cùng mở mẻ (MOQ)
                </span>
                <span className="text-xs font-mono font-bold text-[#141211]">
                  {currentQty} / {targetMoq} phần
                </span>
              </div>
              <ProgressBar current={currentQty} moq={targetMoq} />
              <p className="text-[11px] text-[#665E58] font-sans leading-relaxed">
                {currentQty >= targetMoq
                  ? 'Đã đủ số người cùng mở để kích hoạt mẻ sản xuất/thu hoạch tươi mới.'
                  : `Cần thêm ${Math.max(0, targetMoq - currentQty)} người cùng mở mẻ để người làm bắt đầu thu gom mẻ tươi.`}
              </p>
            </div>

            {/* Entry Intent: Dùng cho mình | Làm quà */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-pantryst font-bold text-[#A65F25]">
                  Mục đích thưởng thức
                </span>
                <span className="text-[10px] text-[#665E58] font-mono">Kèm Thẻ câu chuyện</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <Link
                  href={`/dat-hang/${ngan.slug}?intent=PERSONAL`}
                  className="p-3 rounded-xl border border-[#E7DFD3] hover:border-[#141211] bg-[#FAF8F5] transition text-center block"
                >
                  <strong className="block text-[#141211]">Dùng cho mình</strong>
                  <span className="text-[10px] text-[#665E58]">Thưởng thức hàng ngày</span>
                </Link>
                <Link
                  href={`/dat-hang/${ngan.slug}?intent=GIFT`}
                  className="p-3 rounded-xl border border-[#A65F25]/40 hover:border-[#A65F25] bg-[#FFF9F2] transition text-center block"
                >
                  <strong className="block text-[#A65F25]">Làm quà tặng</strong>
                  <span className="text-[10px] text-[#665E58]">Kèm thẻ & lời chúc</span>
                </Link>
              </div>
            </div>

            {/* Action CTA & Reassurance — State-derived UI */}
            <div className="space-y-3 pt-1">
              {ctaSpec.isOrderable ? (
                <Link
                  href={`/dat-hang/${ngan.slug}`}
                  className="w-full py-4 px-6 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#A65F25] transition-all duration-300 shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <span>{demand?.cta || 'CÙNG MỞ MẺ NGAY'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="w-full py-4 px-6 rounded-full bg-[#EFE8DC] text-[#423B36] text-xs uppercase tracking-pantryst font-bold text-center border border-[#E7DFD3] flex items-center justify-center gap-2">
                  <span>{ctaSpec.ctaText}</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-4 text-[11px] text-[#665E58] font-sans text-center">
                <span>{ctaSpec.explanationText || '✓ Cập nhật hành trình mẻ qua Zalo OA'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12-PART STRUCTURAL VERTICAL SLICE FLOW */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-16 border-t border-[#E7DFD3] pt-16">
        
        {/* STORY CARD PREVIEW — Vật phẩm kể chuyện vật lý & số hóa đi kèm */}
        <section className="p-7 sm:p-9 rounded-3xl bg-[#FAF8F5] border border-[#E7DFD3] shadow-pantry space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD3]">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25]">
                THẺ CÂU CHUYỆN SẢN VẬT (STORY CARD)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#141211] text-[#FAF8F5] font-mono">
                ĐI KÈM MỖI PHẦN
              </span>
            </div>
            <span className="text-[11px] text-[#665E58] font-mono">Mã mẻ: BATCH-{ngan.number.replace('#', '')}-2026</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A65F25]">
                  VÙNG NGUYÊN LIỆU {canonicalLocation.toUpperCase()}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#141211]">
                  {ngan.product?.name || ngan.title}
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                VERIFIED FACT
              </span>
            </div>

            <p className="text-xs text-[#423B36] font-serif italic leading-relaxed">
              &ldquo;{storyObj?.selection_chuyen || ngan.selection_chuyen}&rdquo;
            </p>

            <div className="pt-3 border-t border-[#E7DFD3] flex flex-wrap items-center justify-between text-[11px] text-[#665E58] font-sans gap-2">
              <span>Người làm: <strong className="text-[#141211]">{ngan.product?.producer?.name}</strong></span>
              <span>Minh chứng: <strong className="text-[#141211]">Truth Gate đối soát thực địa</strong></span>
            </div>
          </div>
        </section>

        {/* 02. WHY THIS — LÝ DO CHỌN SẢN VẬT NÀY */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25]">
              02 — VÌ SAO CHỌN SẢN VẬT NÀY (WHY THIS)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
              VERIFIED FACT
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            {storyObj?.headline || ngan.title}
          </h2>
          <p className="text-base font-serif text-[#423B36] leading-relaxed">
            {storyObj?.why_this || ngan.short_description}
          </p>
        </section>

        {/* 03. PLACE — VÙNG ĐẤT */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            03 — VÙNG ĐẤT (TERROIR & ORIGIN)
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            {canonicalLocation} {processingLocation ? `& ${processingLocation}` : ''}
          </h2>
          <p className="text-base font-serif text-[#423B36] leading-relaxed">
            {storyObj?.selection_dat || ngan.selection_dat}
          </p>
        </section>

        {/* 04. MAKER — NGƯỜI LÀM */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            04 — NGƯỜI LÀM (MAKER IDENTITY)
          </span>
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#E7DFD3]">
              <Image
                src={ngan.product?.producer?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'}
                alt={ngan.product?.producer?.name || 'Người làm sản vật'}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#141211]">
                {ngan.product?.producer?.name}
              </h3>
              <p className="text-xs font-semibold text-[#A65F25]">
                {ngan.product?.producer?.brand_name} · {ngan.product?.producer?.location}
              </p>
              <p className="text-sm text-[#423B36] leading-relaxed font-sans">
                {storyObj?.selection_nguoi || ngan.selection_nguoi}
              </p>
            </div>
          </div>
        </section>

        {/* 05. MAKING — ĐÔI TAY & QUY TRÌNH THỦ CÔNG */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            05 — ĐÔI TAY & CÁCH LÀM (MAKING PROCESS)
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            Quy trình chế biến mộc, tôn trọng nguyên bản
          </h2>
          <div className="text-sm font-sans text-[#665E58] space-y-3 leading-relaxed">
            {storyObj?.making_process && storyObj.making_process.length > 0 ? (
              storyObj.making_process.map((step, idx) => {
                const parts = step.split(':');
                if (parts.length > 1) {
                  return (
                    <p key={idx}>
                      • <strong>{parts[0]}:</strong>{parts.slice(1).join(':')}
                    </p>
                  );
                }
                return <p key={idx}>• {step}</p>;
              })
            ) : (
              <p>• {ngan.selection_nguoi}</p>
            )}
          </div>
        </section>

        {/* 06. WHY TRUST — CƠ SỞ MINH CHỨNG & TRUTH STATUS */}
        <section className="space-y-4 p-7 rounded-3xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD3]">
            <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25]">
              06 — CƠ SỞ TIN CẬY (WHY TRUST & TRUTH STATUS)
            </span>
            <span className="text-[10px] text-[#665E58] font-mono">Epistemic Governance v1.0</span>
          </div>
          
          <div className="space-y-4 pt-2">
            {storyObj?.evidence_refs && storyObj.evidence_refs.length > 0 ? (
              storyObj.evidence_refs.map((evd: CanonicalEvidenceItem) => (
                <div
                  key={evd.id}
                  className={`p-4 rounded-2xl border space-y-1.5 ${
                    evd.truth_status === 'VERIFIED'
                      ? 'bg-[#F7F9F6] border-[#D7E2D3]'
                      : 'bg-[#FFF9F2] border-[#F0DCB8]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        evd.truth_status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {evd.truth_status}
                    </span>
                    <span className="text-xs font-bold text-[#141211]">
                      {evd.claim}
                    </span>
                  </div>
                  <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                    {evd.notes || 'Minh chứng được xác thực từ hồ sơ thực địa và tư liệu chính thức.'}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#D7E2D3] space-y-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                  VERIFIED FACT
                </span>
                <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                  Thông tin sản vật đã qua đối soát thực địa và xác nhận hồ sơ từ nhà sản xuất.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 07. WHAT YOU GET — TRẢI NGHIỆM THỰC NHẬN & QUY CÁCH */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            07 — TRẢI NGHIỆM THỰC NHẬN (WHAT YOU GET)
          </span>
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7DFD3] divide-y divide-[#E7DFD3] text-xs sm:text-sm font-sans shadow-sm">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Thành phần</span>
              <span className="text-[#141211] font-semibold">{ngan.product?.ingredients}</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Quy cách phần nhận</span>
              <span className="text-[#141211] font-semibold">{ngan.product?.unit} ({ngan.product?.weight})</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Hương vị cảm nhận</span>
              <span className="text-[#141211] font-semibold">{storyObj?.selection_vi || ngan.selection_vi}</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Thời hạn sử dụng</span>
              <span className="text-[#141211] font-semibold">{ngan.product?.expiry}</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Vật phẩm đi kèm</span>
              <span className="text-[#141211] font-semibold">
                Thẻ câu chuyện sản vật & Hướng dẫn thưởng thức
              </span>
            </div>
          </div>
        </section>

        {/* 08. WHY PREORDER — 3-PILLAR TRIAD & WHY ACT NOW */}
        <section className="space-y-4 p-7 rounded-3xl bg-[#FAF8F5] border border-[#E7DFD3] shadow-pantry">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            08 — VÌ SAO ĐẶT TRƯỚC (WHY PREORDER & WHY ACT NOW)
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD3] space-y-2">
              <span className="text-[11px] font-bold text-[#A65F25] uppercase tracking-wide block">
                1. Reason to Care
              </span>
              <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                {storyObj?.why_preorder_care || 'Sản phẩm giữ trọn phẩm chất tự nhiên tươi mới, mang lại giá trị chân thật nhất.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD3] space-y-2">
              <span className="text-[11px] font-bold text-[#A65F25] uppercase tracking-wide block">
                2. Reason to Trust
              </span>
              <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                {storyObj?.why_preorder_trust || `Minh bạch xuất xứ tại ${canonicalLocation}, pháp nhân và quy trình được đối soát rõ ràng.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD3] space-y-2">
              <span className="text-[11px] font-bold text-[#A65F25] uppercase tracking-wide block">
                3. Reason to Act Now
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>Gom mẻ theo đợt</span>
                </div>
                <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                  {storyObj?.why_preorder_act_now || `Chỉ hạ mẻ và đóng gói khi đủ ${targetMoq} phần đăng ký để bảo đảm độ tươi mới.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 09. DEMAND MECHANISM — CƠ CHẾ MOQ & KHÔNG THU TIỀN TRƯỚC */}
        <section className="space-y-4 p-7 rounded-3xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            09 — CƠ CHẾ NHU CẦU (DEMAND MECHANISM)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#141211]">
                Cùng mở gom mẻ ({targetMoq} phần)
              </h3>
              <p className="text-xs text-[#665E58] font-sans leading-relaxed">
                Người làm nông nghiệp thủ công không thể xuất từng mẻ nhỏ lẻ. Cơ chế mở Ngăn giúp tập hợp đủ số lượng tối thiểu để người làm yên tâm hạ mẻ tươi nhất.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#E7DFD3] space-y-1.5 text-xs text-[#423B36] font-sans">
              <div className="flex items-center gap-1.5 font-bold text-[#A65F25]">
                <ShieldCheck className="w-4 h-4" />
                <span>Chưa thu tiền khi đặt trước</span>
              </div>
              <p className="leading-relaxed text-[#665E58]">
                Bạn gửi thông tin để cùng tạo tín hiệu nhu cầu thật. Chúng tôi chỉ thông báo thanh toán khi mẻ đạt 100% MOQ và chuẩn bị chuyển về kho.
              </p>
            </div>
          </div>
        </section>

        {/* 10. PRODUCT / BATCH — THÔNG TIN MẺ SẢN XUẤT */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            10 — THÔNG TIN MẺ (BATCH DETAILS)
          </span>
          <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] space-y-3 font-sans text-xs">
            <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
              <span className="text-[#665E58]">Mã hiệu đợt mở</span>
              <span className="font-mono font-bold text-[#141211]">NGAN-{ngan.number.replace('#', '')}-2026</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
              <span className="text-[#665E58]">Sản lượng mẻ mục tiêu</span>
              <span className="font-semibold text-[#141211]">{targetMoq} {ngan.product?.unit}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
              <span className="text-[#665E58]">Hình thức chế biến / thu hoạch</span>
              <span className="font-semibold text-[#141211]">
                {storyObj?.making_process?.[0]?.split(':')[0] || 'Chế biến thủ công mộc'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#665E58]">Tình trạng mẻ</span>
              <span className="font-mono font-bold text-[#A65F25]">
                {currentQty >= targetMoq ? 'ĐÃ ĐẠT MOQ — CHỜ ĐÓNG MẺ' : 'ĐANG GOM ĐƠN CÙNG MỞ'}
              </span>
            </div>
          </div>
        </section>

        {/* 11. FULFILLMENT EXPECTATION — KỲ VỌNG VẬN HÀNH & GIAO NHẬN */}
        <section className="space-y-4 p-7 rounded-3xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25]">
              11 — KỲ VỌNG VẬN HÀNH & GIAO HÀNG (FULFILLMENT EXPECTATION)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-bold">
              PRODUCER DIRECT & GMR QUALITY CHECK
            </span>
          </div>

          <div className="space-y-4 pt-1 font-sans text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#141211]">
                <Truck className="w-4 h-4 text-[#A65F25]" />
                <span>Phương thức giao nhận:</span>
              </div>
              <p className="text-[#665E58] leading-relaxed">
                Sau khi đạt MOQ, sản vật được thu gom trực tiếp từ xưởng/nhà vườn, đóng gói cẩn trọng và vận chuyển đến tận tay bạn với mã vận đơn tracking riêng.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#E7DFD3] bg-white">
                <span className="text-[#665E58] block mb-1">Dự kiến xuất xưởng / hạ mẻ:</span>
                <strong className="text-sm text-[#141211]">{ngan.shipping_estimate}</strong>
              </div>
              <div className="p-4 rounded-xl border border-[#E7DFD3] bg-white">
                <span className="text-[#665E58] block mb-1">Quy cách bao bì bảo quản:</span>
                <strong className="text-sm text-[#141211]">
                  Bao bì kín khí chuyên dụng, bảo vệ hương vị nguyên bản
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* 12. GMR REASON FOR OPENING THIS NGĂN — LÝ DO GẠC MĂNG RÊ MỞ NGĂN NÀY */}
        <section className="space-y-4 p-8 sm:p-10 rounded-3xl bg-[#141211] text-[#FAF8F5] shadow-2xl">
          <span className="text-xs uppercase tracking-pantrystWide text-[#EFE8DC] font-mono block">
            12 — LÝ DO GẠC MĂNG RÊ MỞ NGĂN NÀY (GMR CURATION REASON)
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            &ldquo;{storyObj?.selection_chuyen || ngan.selection_chuyen}&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-[#EFE8DC]/80 font-sans leading-relaxed pt-2">
            {storyObj?.curation_reason || ngan.short_description}
          </p>

          <div className="pt-6 border-t border-[#332B25] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] text-[#A89D91] font-mono uppercase block">Tiến độ hiện tại:</span>
              <span className="font-serif text-lg font-bold text-white">
                {currentQty} / {targetMoq} phần đã đăng ký
              </span>
            </div>

            {ctaSpec.isOrderable ? (
              <Link
                href={`/dat-hang/${ngan.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#A65F25] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#864918] transition-all duration-300 shadow-lg text-center"
              >
                <span>{demand?.cta || ctaSpec.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#EFE8DC] text-[#423B36] text-xs uppercase tracking-pantryst font-bold border border-[#E7DFD3] text-center">
                <span>{ctaSpec.ctaText}</span>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* MOBILE STICKY BOTTOM BAR (State-derived UI) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E7DFD3] p-4 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#665E58] uppercase tracking-pantryst block">
              Ngăn {ngan.number}
            </span>
            <span className="font-serif text-lg font-bold text-[#141211]">
              {formattedPrice}
            </span>
          </div>
          {ctaSpec.isOrderable ? (
            <Link
              href={`/dat-hang/${ngan.slug}`}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#A65F25] transition-colors text-center shadow"
            >
              {demand?.cta || ctaSpec.ctaText}
            </Link>
          ) : (
            <div className="flex-1 py-3.5 px-6 rounded-full bg-[#EFE8DC] text-[#423B36] text-xs uppercase tracking-pantryst font-bold text-center border border-[#E7DFD3]">
              {ctaSpec.ctaText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
