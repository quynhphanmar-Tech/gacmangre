import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNganBySlug } from '@/services/ngan-service';
import ProgressBar from '@/components/ProgressBar';
import { MapPin, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface NganPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NganDetailPage({ params }: NganPageProps) {
  const { slug } = await params;
  const ngan = await getNganBySlug(slug);

  if (!ngan) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(ngan.price);

  return (
    <div className="pb-32">
      {/* 00. ABOVE-FOLD HERO — CLEAR, FAST, 5 KEY ANSWERS (Brief v1.1 Section 07) */}
      <section className="pt-8 md:pt-16 pb-14 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Photography Gallery (Editorial framing) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-pantry border border-[#E7DFD3] bg-[#F3EDE2]">
              <Image
                src={ngan.hero_image}
                alt={ngan.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#141211]/90 backdrop-blur-md text-[#FAF8F5] font-mono text-[11px] tracking-pantryst uppercase shadow-sm">
                  NGĂN {ngan.number}
                </span>
              </div>
            </div>

            {/* Editorial Secondary Photography (Đôi tay & Quy trình) */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop"
                  alt="Đôi tay thu mật hoa dại"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600&auto=format&fit=crop"
                  alt="Tổ ong đá tự nhiên"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFD3] shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=600&auto=format&fit=crop"
                  alt="Rót mật thô sánh"
                  fill
                  className="object-cover"
                />
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
                <span>Từ {ngan.product?.origin || 'Mèo Vạc, Hà Giang'}</span>
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
                {ngan.product?.unit || '500ml'}
              </span>
            </div>

            {/* Progress Bar (73 / 100 người cùng mở) */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-3">
              <span className="text-[10px] uppercase tracking-pantryst text-[#A65F25] font-bold block">
                Tiến độ mở ngăn
              </span>
              <ProgressBar current={ngan.current_quantity} moq={ngan.moq} />
            </div>

            {/* Action CTA & Reassurance */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/dat-hang/${ngan.slug}`}
                className="w-full py-4 px-6 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#A65F25] transition-all duration-300 shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
              >
                <span>MỞ NGĂN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center gap-4 text-[11px] text-[#665E58] font-sans">
                <span>✓ Thanh toán khi đủ ngăn</span>
                <span>•</span>
                <span>✓ Cập nhật qua Zalo OA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7-PART EDITORIAL EXPERIENCE FLOW (Brief v1.1 Section 06) */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-20 border-t border-[#E7DFD3] pt-16">
        {/* 01 — VÙNG ĐẤT */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            01 — VÙNG ĐẤT
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            Cao nguyên đá vôi Mèo Vạc (Trên 1.200m)
          </h2>
          <p className="text-base font-serif text-[#423B36] leading-relaxed">
            {ngan.selection_dat}
          </p>
        </section>

        {/* 02 — NGƯỜI */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            02 — NGƯỜI
          </span>
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#E7DFD3]">
              <Image
                src={ngan.product?.producer?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'}
                alt={ngan.product?.producer?.name || 'Anh Giàng A Páo'}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#141211]">
                {ngan.product?.producer?.name || 'Anh Giàng A Páo'}
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

        {/* 03 — ĐÔI TAY */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            03 — ĐÔI TAY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            Quy trình quay mật thủ công, tôn trọng tự nhiên
          </h2>
          <div className="text-sm font-sans text-[#665E58] space-y-3 leading-relaxed">
            <p>
              • <strong>Hạ tầng ong:</strong> Chỉ gạt nhẹ lớp sáp vít nắp khi mật đã chín già đặc tự nhiên.
            </p>
            <p>
              • <strong>Không qua đun nóng:</strong> Giữ nguyên vẹn các enzyme kháng khuẩn và hạt phấn hoa bạc hà tím ngát.
            </p>
            <p>
              • <strong>Lọc vải thưa:</strong> Chỉ loại bỏ sáp vụn, giữ trọn vẹn màu vàng chanh ánh xanh nguyên bản.
            </p>
          </div>
        </section>

        {/* 04 — SẢN VẬT */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25] block">
            04 — SẢN VẬT
          </span>
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7DFD3] divide-y divide-[#E7DFD3] text-xs sm:text-sm font-sans">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Thành phần</span>
              <span className="text-[#141211] font-semibold">{ngan.product?.ingredients}</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Quy cách</span>
              <span className="text-[#141211] font-semibold">{ngan.product?.unit} ({ngan.product?.weight})</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Hương vị</span>
              <span className="text-[#141211] font-semibold">{ngan.selection_vi}</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Chứng nhận</span>
              <span className="text-[#141211] font-semibold">{ngan.product?.certifications}</span>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#665E58]">Dự kiến giao hàng</span>
              <span className="text-[#A65F25] font-bold">{ngan.shipping_estimate}</span>
            </div>
          </div>
        </section>

        {/* 05 — CÂU CHUYỆN */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-pantryst font-bold text-[#A65F25]">
              05 — CÂU CHUYỆN
            </span>
            <Link
              href="/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac"
              className="text-xs uppercase tracking-pantryst text-[#141211] hover:text-[#A65F25] font-semibold underline underline-offset-4"
            >
              Đọc toàn bộ ký sự thực địa →
            </Link>
          </div>
          <p className="text-base font-serif italic text-[#423B36] leading-relaxed">
            &ldquo;{ngan.selection_chuyen}&rdquo;
          </p>
        </section>

        {/* 06 & 07 — CỘNG ĐỒNG & MỞ NGĂN */}
        <section className="p-8 sm:p-12 rounded-3xl bg-[#141211] text-[#FAF8F5] space-y-6 text-center shadow-2xl">
          <span className="text-xs uppercase tracking-pantrystWide text-[#EFE8DC] font-mono block">
            06 & 07 — CỘNG ĐỒNG CÙNG MỞ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Mở Ngăn #{ngan.number} cùng 100 người
          </h2>
          <p className="text-xs sm:text-sm text-[#EFE8DC]/80 max-w-md mx-auto font-sans leading-relaxed">
            Chỉ còn một số ít phần nữa để mẻ mật ong bạc hà Mèo Vạc chính thức được anh Giàng A Páo hạ tầng quay và đóng mẻ gửi về bếp nhà bạn.
          </p>

          <div className="pt-2">
            <Link
              href={`/dat-hang/${ngan.slug}`}
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#A65F25] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#864918] transition-all duration-300 shadow-lg"
            >
              <span>MỞ NGĂN NGAY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>

      {/* MOBILE STICKY BOTTOM BAR (Brief v1.1 Section 07 P0 Requirement) */}
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
          <Link
            href={`/dat-hang/${ngan.slug}`}
            className="flex-1 py-3.5 px-6 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#A65F25] transition-colors text-center shadow"
          >
            MỞ NGĂN
          </Link>
        </div>
      </div>
    </div>
  );
}
