import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNganBySlug } from '@/services/ngan-service';
import ProgressBar from '@/components/ProgressBar';
import { MapPin, ShieldCheck, Clock, PackageCheck, ArrowRight, User } from 'lucide-react';

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
    <div className="pb-28">
      {/* 1. ABOVE THE FOLD — CORE EXPERIENCE */}
      <section className="pt-8 md:pt-16 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery / Image Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#D6BFA0]/60 bg-[#E8D8C3]">
              <Image
                src={ngan.hero_image}
                alt={ngan.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 rounded-full bg-[#211D1A]/90 text-[#FAF7F2] font-mono text-xs font-bold tracking-wider shadow">
                  NGĂN {ngan.number}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {ngan.gallery && ngan.gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {ngan.gallery.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E8D8C3] shadow-sm">
                    <Image src={img} alt={`Gạc Măng Rê gallery ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Column */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C4A2F] font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{ngan.product?.origin || 'Hà Giang · Mùa 2026'}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211D1A] leading-tight">
                {ngan.title}
              </h1>

              <p className="text-sm text-[#7F5E3C] leading-relaxed">
                {ngan.short_description}
              </p>
            </div>

            {/* Price block */}
            <div className="p-4 rounded-2xl bg-[#F4ECE1] border border-[#E8D8C3] flex items-baseline justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#9E7B54] block">
                  Mức giá gom chung
                </span>
                <span className="font-serif text-3xl font-bold text-[#211D1A]">
                  {formattedPrice}
                </span>
                <span className="text-xs text-[#7F5E3C]"> / phần</span>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {ngan.product?.unit || '500ml'}
              </span>
            </div>

            {/* MOQ Progress Box */}
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#D6BFA0] shadow-sm space-y-4">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4A2F] block">
                Tiến Độ Gom Đơn (MOQ)
              </span>
              <ProgressBar current={ngan.current_quantity} moq={ngan.moq} />
            </div>

            {/* Desktop CTA Button */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/dat-hang/${ngan.slug}`}
                className="w-full py-4 px-6 rounded-full bg-[#8C4A2F] text-[#FAF7F2] text-sm uppercase tracking-widest font-bold hover:bg-[#723922] transition-all shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2"
              >
                <span>ĐẶT NGĂN NÀY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-xs text-[#9E7B54]">
                ✓ Thanh toán khi đủ ngăn · Cập nhật hành trình qua Zalo OA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 01 — CÂU CHUYỆN */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#E8D8C3] space-y-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4A2F] block">
          01 — CÂU CHUYỆN SẢN VẬT
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211D1A]">
          Hương hoa dại trên triền đá tai mèo
        </h2>
        <div className="prose prose-stone text-base leading-relaxed text-[#5F442A] space-y-4 font-serif">
          <p>
            Mỗi năm, khi mùa đông mang cái lạnh buốt giá tràn qua thung lũng đá xám Mèo Vạc, loài hoa bạc hà dại lại kiên cường đâm chồi nở hoa. Thứ mật ong được kết tinh từ loài hoa này có màu vàng chanh phớt ánh xanh kì lạ, hương the mát dịu nhẹ mà không một loại mật đồng bằng nào có được.
          </p>
          <p>
            Gạc Măng Rê đồng hành cùng những người làm bản địa để gom chung một mẻ mật tươi ngon nhất, giữ nguyên trạng thái mật thô không đun sấy công nghiệp.
          </p>
        </div>
      </section>

      {/* 3. SECTION 02 — NGƯỜI LÀM */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#E8D8C3] space-y-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4A2F] block">
          02 — NGƯỜI LÀM TỬ TẾ
        </span>
        <div className="p-8 rounded-3xl bg-[#F4ECE1] border border-[#E8D8C3] flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-[#D6BFA0] shadow">
            <Image
              src={ngan.product?.producer?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'}
              alt={ngan.product?.producer?.name || 'Anh Giàng A Páo'}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#211D1A]">
              {ngan.product?.producer?.name || 'Anh Giàng A Páo'}
            </h3>
            <p className="text-xs text-[#8C4A2F] font-semibold">
              Người Mông giữ đàn ong đá · {ngan.product?.producer?.location}
            </p>
            <p className="text-sm text-[#5F442A] leading-relaxed">
              &ldquo;Ong làm mật cho núi rừng, mình chỉ mượn một phần khi tổ đã vít nắp no đủ. Mật làm ra phải sạch như lòng người thì uống vào mới thấy thơm mát.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION 03 & 04 — TIÊU CHUẨN: ĐẤT · NGƯỜI · VỊ · CHUYỆN */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#E8D8C3] space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4A2F] block mb-2">
            03 & 04 — TẠI SAO GẠC MĂNG RÊ CHỌN?
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211D1A]">
            Bốn tiêu chuẩn cất vị
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#8C4A2F]">ĐẤT</h4>
            <p className="text-sm text-[#7F5E3C] leading-relaxed">{ngan.selection_dat}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#8C4A2F]">NGƯỜI</h4>
            <p className="text-sm text-[#7F5E3C] leading-relaxed">{ngan.selection_nguoi}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#8C4A2F]">VỊ</h4>
            <p className="text-sm text-[#7F5E3C] leading-relaxed">{ngan.selection_vi}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#8C4A2F]">CHUYỆN</h4>
            <p className="text-sm text-[#7F5E3C] leading-relaxed">{ngan.selection_chuyen}</p>
          </div>
        </div>
      </section>

      {/* 5. SECTION 05 — THÔNG TIN SẢN VẬT */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#E8D8C3] space-y-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4A2F] block">
          05 — CHI TIẾT SẢN VẬT
        </span>
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8D8C3] divide-y divide-[#E8D8C3]">
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
            <span className="text-[#9E7B54] font-medium">Thành phần</span>
            <span className="text-[#211D1A] font-semibold">{ngan.product?.ingredients}</span>
          </div>
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
            <span className="text-[#9E7B54] font-medium">Quy cách đóng gói</span>
            <span className="text-[#211D1A] font-semibold">{ngan.product?.unit} ({ngan.product?.weight})</span>
          </div>
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
            <span className="text-[#9E7B54] font-medium">Bảo quản</span>
            <span className="text-[#211D1A] font-semibold">{ngan.product?.storage}</span>
          </div>
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
            <span className="text-[#9E7B54] font-medium">Chứng nhận & Kiểm nghiệm</span>
            <span className="text-[#211D1A] font-semibold">{ngan.product?.certifications}</span>
          </div>
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
            <span className="text-[#9E7B54] font-medium">Dự kiến giao hàng</span>
            <span className="text-[#8C4A2F] font-bold">{ngan.shipping_estimate}</span>
          </div>
        </div>
      </section>

      {/* STICKY BOTTOM BAR FOR MOBILE (Brief Section 11 Requirement) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8D8C3] p-4 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#9E7B54] block">Ngăn {ngan.number}</span>
            <span className="font-serif text-lg font-bold text-[#211D1A]">{formattedPrice}</span>
          </div>
          <Link
            href={`/dat-hang/${ngan.slug}`}
            className="flex-1 py-3 px-6 rounded-full bg-[#8C4A2F] text-[#FAF7F2] text-xs uppercase tracking-widest font-bold hover:bg-[#723922] transition-colors text-center shadow"
          >
            ĐẶT NGĂN NÀY
          </Link>
        </div>
      </div>
    </div>
  );
}
