import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNganBySlug, getNganCtaSpec } from '@/services/ngan-service';
import ProgressBar from '@/components/ProgressBar';
import { MapPin, ArrowRight, ShieldCheck, Check, Sparkles, Camera, Clock, AlertTriangle, Truck, Award, Leaf } from 'lucide-react';

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

  const heroAsset = ngan.media_assets?.[0];
  const handsAsset = ngan.media_assets?.[1];
  const textureAsset = ngan.media_assets?.[4];

  // Producer-specific Truth & Proposition Configuration
  const isOca = ngan.slug.includes('oca') || ngan.product?.producer?.slug?.includes('oca');

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
                <Image
                  src={handsAsset?.url || (isOca ? "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600&auto=format&fit=crop" : "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600&auto=format&fit=crop")}
                  alt="Đôi tay người làm"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 left-2 text-[9px] text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                  Đôi tay
                </span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-sm group">
                <Image
                  src={isOca ? "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=600&auto=format&fit=crop" : "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=600&auto=format&fit=crop"}
                  alt="Vùng đất sản vật"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 left-2 text-[9px] text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                  Vùng đất
                </span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-sm group">
                <Image
                  src={textureAsset?.url || (isOca ? "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=600&auto=format&fit=crop" : "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=600&auto=format&fit=crop")}
                  alt="Chất lượng sản vật"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
                <span>Từ {ngan.product?.origin || 'Vùng đất nguyên bản'}</span>
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

            {/* Progress Bar (Demand Mechanism) */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-pantryst text-[#A65F25] font-bold block">
                  Tiến độ mở ngăn (MOQ)
                </span>
                <span className="text-xs font-mono font-bold text-[#141211]">
                  {ngan.current_quantity} / {ngan.moq} phần
                </span>
              </div>
              <ProgressBar current={ngan.current_quantity} moq={ngan.moq} />
              <p className="text-[11px] text-[#665E58] font-sans leading-relaxed">
                {ngan.current_quantity >= ngan.moq
                  ? 'Đã đủ số người cùng mở để kích hoạt mẻ thu hoạch/sản xuất.'
                  : `Cần thêm ${Math.max(0, ngan.moq - ngan.current_quantity)} người cùng mở để người làm bắt đầu thu gom mẻ tươi.`}
              </p>
            </div>

            {/* Action CTA & Reassurance — State-derived UI */}
            <div className="space-y-3 pt-2">
              {ctaSpec.isOrderable ? (
                <Link
                  href={`/dat-hang/${ngan.slug}`}
                  className="w-full py-4 px-6 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#A65F25] transition-all duration-300 shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <span>{ctaSpec.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="w-full py-4 px-6 rounded-full bg-[#EFE8DC] text-[#423B36] text-xs uppercase tracking-pantryst font-bold text-center border border-[#E7DFD3] flex items-center justify-center gap-2">
                  <span>{ctaSpec.ctaText}</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-4 text-[11px] text-[#665E58] font-sans text-center">
                <span>{ctaSpec.explanationText || '✓ Cập nhật hành trình qua Zalo OA'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12-PART STRUCTURAL VERTICAL SLICE FLOW */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-16 border-t border-[#E7DFD3] pt-16">
        
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
            {isOca 
              ? 'Hạt cacao Chợ Gạo lên men thùng gỗ 6 ngày, giữ trọn bơ cacao tự nhiên'
              : 'Mật ong hoa bạc hà khai thác triền đá vôi Đồng Văn - Mèo Vạc (>1.200m)'}
          </h2>
          <p className="text-base font-serif text-[#423B36] leading-relaxed">
            {isOca
              ? 'Khác với cacao công nghiệp bị tách kiềm hóa và vắt kiệt bơ cacao để bán riêng, bột cacao của OCA giữ nguyên tỷ lệ bơ cacao tự nhiên trên 18%. Hạt được lên men thủ công trong thùng gỗ mộc từ 5–6 ngày trước khi phơi nắng giàn, mang vị chua thanh hoa quả nhiệt đới đặc trưng.'
              : 'Hoa bạc hà dại chỉ nở trên các hốc đá tai mèo lạnh buốt vào mùa đông (tháng 10 đến tháng 12). Đàn ong bản địa kiếm mật trong điều kiện khắc nghiệt, tạo nên dòng mật sánh đặc màu vàng chanh ánh xanh với hậu vị the mát sâu cổ họng.'}
          </p>
        </section>

        {/* 03. PLACE — VÙNG ĐẤT */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            03 — VÙNG ĐẤT (TERROIR & ORIGIN)
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            {isOca ? 'Thổ nhưỡng phù sa Chợ Gạo, Tiền Giang & xưởng Vũng Tàu' : 'Thung lũng đá tai mèo Mèo Vạc, Hà Giang (Trên 1.200m)'}
          </h2>
          <p className="text-base font-serif text-[#423B36] leading-relaxed">
            {ngan.selection_dat}
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
                {ngan.selection_nguoi}
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
            {isOca ? 'Kiểm soát lên men vi sinh và nghiền mộc chậm' : 'Quy trình quay mật thủ công, tôn trọng tự nhiên'}
          </h2>
          <div className="text-sm font-sans text-[#665E58] space-y-3 leading-relaxed">
            {isOca ? (
              <>
                <p>• <strong>Thu hái chọn lọc:</strong> Chỉ hạ quả khi vỏ chín vàng đều, bóc hạt ngay trong ngày để giữ men tươi.</p>
                <p>• <strong>Lên men thùng gỗ mộc:</strong> Ủ 5–6 ngày với lớp lá chuối phủ kín, đảo hạt định kỳ để giải phóng nốt hương hoa quả.</p>
                <p>• <strong>Phơi giàn nắng tự nhiên:</strong> Làm khô chậm dưới nắng giàn cao ráo, tuyệt đối không sấy khói cưỡng bức làm hỏng bơ.</p>
              </>
            ) : (
              <>
                <p>• <strong>Hạ tầng ong:</strong> Chỉ gạt nhẹ lớp sáp vít nắp khi mật đã chín già đặc tự nhiên.</p>
                <p>• <strong>Không qua đun nóng:</strong> Giữ nguyên vẹn các enzyme kháng khuẩn và hạt phấn hoa bạc hà tím ngát.</p>
                <p>• <strong>Lọc vải thưa:</strong> Chỉ loại bỏ sáp vụn, giữ trọn vẹn màu vàng chanh ánh xanh nguyên bản.</p>
              </>
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
            {/* Verified Fact Item */}
            <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#D7E2D3] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                  VERIFIED FACT
                </span>
                <span className="text-xs font-bold text-[#141211]">
                  {isOca ? 'Pháp nhân & Hồ sơ xuất khẩu Nhật Bản' : 'Tọa độ thực địa & Nhật ký khai thác'}
                </span>
              </div>
              <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                {isOca 
                  ? 'Công ty TNHH OCA Việt Nhật (ĐKKD 3502512543), có chứng từ xuất khẩu chính ngạch sang thị trường Nhật Bản và nhà xưởng đạt chuẩn an toàn VSTP.'
                  : 'Ghi nhận thực địa có GPS tại Mèo Vạc (23°09\'N, 105°24\'E), sổ theo dõi thời gian quay mật và kiểm nghiệm thủy phần tự nhiên dưới 19%.'}
              </p>
            </div>

            {/* Producer Claim Item with Explicit Epistemic Badge */}
            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F0DCB8] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                  PRODUCER CLAIM
                </span>
                <span className="text-xs font-bold text-[#141211]">
                  {isOca ? 'Tuyên bố: “Vùng trồng canh tác tự nhiên / Hữu cơ”' : 'Tuyên bố: “100% nguyên chất hoang dã”'}
                </span>
              </div>
              <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                {isOca
                  ? 'Nhà vườn tuyên bố không dùng thuốc bảo vệ thực vật hóa học trong vụ thu hoạch. (Ghi chú minh bạch: Gạc Măng Rê chưa nhận bản scan chứng nhận Organic quốc tế độc lập, dữ liệu được ghi nhận theo cam kết của người làm).'
                  : 'Người nuôi ong cam kết không can thiệp đun nhiệt hạ thủy phần. Được kiểm chứng bằng mẫu nếm trực tiếp tại chỗ nhưng chưa có lab test phổ quang phân tích enzyme.'}
              </p>
            </div>
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
              <span className="text-[#141211] font-semibold">{ngan.selection_vi}</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Thời hạn sử dụng</span>
              <span className="text-[#141211] font-semibold">{ngan.product?.expiry}</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Vật phẩm đi kèm</span>
              <span className="text-[#141211] font-semibold">
                {isOca ? 'Hướng dẫn nếm vị mộc & công thức pha cacao ấm' : 'Thẻ ghi nhận mẻ thu hái & mã truy xuất nguồn gốc'}
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
                {isOca 
                  ? 'Sản phẩm giữ nguyên bơ cacao tươi, mang lại hương vị sâu lắng và giá trị dinh dưỡng cao nhất.'
                  : 'Mật hoa bạc hà thật khai thác tự nhiên chỉ có một mùa duy nhất trong năm, không thể tái sản xuất công nghiệp.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD3] space-y-2">
              <span className="text-[11px] font-bold text-[#A65F25] uppercase tracking-wide block">
                2. Reason to Trust
              </span>
              <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                {isOca
                  ? 'Minh bạch nguồn gốc từng lô hạt, xuất xứ Chợ Gạo rõ ràng, pháp nhân xưởng sản xuất có đăng ký chính ngạch.'
                  : 'Kiểm nghiệm thủy phần trực tiếp tại bản, sổ tay nhật ký khai thác và quay mật của anh Giàng A Páo.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD3] space-y-2">
              <span className="text-[11px] font-bold text-[#A65F25] uppercase tracking-wide block">
                3. Reason to Act Now
              </span>
              {isOca ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>Gom mẻ rang theo đợt</span>
                  </div>
                  <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                    Xưởng chỉ rang và nghiền khi gom đủ 30 hộp để đảm bảo mẻ bột tươi mới nhất đến tay người mở.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>Mùa vụ hữu hạn (Tháng 10–12)</span>
                  </div>
                  <p className="text-xs text-[#423B36] font-sans leading-relaxed">
                    Sản lượng vụ đông 2026 giới hạn theo số cầu ong thực tế của bản. Không thu hoạch thêm sau khi hết mùa hoa.
                  </p>
                </div>
              )}
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
                Cùng mở gom mẻ ({ngan.moq} phần)
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
              <span className="font-semibold text-[#141211]">{ngan.moq} {ngan.product?.unit}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
              <span className="text-[#665E58]">Hình thức chế biến / thu hoạch</span>
              <span className="font-semibold text-[#141211]">
                {isOca ? 'Ủ men thùng gỗ & Nghiền mộc không kiềm' : 'Hạ tầng quay chín già, lọc thô tự nhiên'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#665E58]">Tình trạng mẻ</span>
              <span className="font-mono font-bold text-[#A65F25]">
                {ngan.current_quantity >= ngan.moq ? 'ĐÃ ĐẠT MOQ — CHỜ ĐÓNG MẺ' : 'ĐANG GOM ĐƠN CÙNG MỞ'}
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
              {isOca ? 'PRODUCER SHIPS DIRECT' : 'GMR BATCH CONSOLIDATION'}
            </span>
          </div>

          <div className="space-y-4 pt-1 font-sans text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#141211]">
                <Truck className="w-4 h-4 text-[#A65F25]" />
                <span>Phương thức giao nhận:</span>
              </div>
              <p className="text-[#665E58] leading-relaxed">
                {isOca
                  ? 'Mô hình A (Producer Ships): Sau khi đạt MOQ, xưởng đóng mẻ bột tươi và gửi trực tiếp qua đơn vị vận chuyển có mã tracking độc lập gửi tới bạn.'
                  : 'Mô hình B (GMR Batch): Mật ong được gom thành lô từ bản Mèo Vạc chuyển về kho trung chuyển Gạc Măng Rê tại Hà Nội để kiểm tra cảm quan trước khi phân phối.'}
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
                  {isOca ? 'Hộp màng nhôm kín khí chống ẩm' : 'Chai thủy tinh bọc chống sốc & chống biến tính nhiệt'}
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
            &ldquo;{ngan.selection_chuyen}&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-[#EFE8DC]/80 font-sans leading-relaxed pt-2">
            {isOca
              ? 'Chúng tôi mở Ngăn này để cùng bạn chứng minh rằng: nông sản chế biến sâu của người Việt Nam hoàn toàn có thể tự đứng vững bằng phẩm chất nguyên bản mà không cần ẩn mình sau các nhãn hàng gia công công nghiệp.'
              : 'Chúng tôi mở Ngăn này để bảo vệ giá trị thật của người nuôi ong trên vách đá tai mèo Mèo Vạc, nơi giọt mật hoa dại xứng đáng được trả đúng giá trị thay vì bị ép giá bởi thị trường hương liệu công nghiệp.'}
          </p>

          <div className="pt-6 border-t border-[#332B25] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] text-[#A89D91] font-mono uppercase block">Tiến độ hiện tại:</span>
              <span className="font-serif text-lg font-bold text-white">
                {ngan.current_quantity} / {ngan.moq} phần đã đăng ký
              </span>
            </div>

            {ctaSpec.isOrderable ? (
              <Link
                href={`/dat-hang/${ngan.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#A65F25] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#864918] transition-all duration-300 shadow-lg text-center"
              >
                <span>{ctaSpec.ctaText}</span>
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
              {ctaSpec.ctaText}
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
