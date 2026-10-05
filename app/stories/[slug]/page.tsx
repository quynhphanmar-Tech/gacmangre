import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStoryBySlug } from '@/services/story-service';
import { MapPin, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <article className="pb-24">
      {/* 1. HERO STORY */}
      <section className="relative pt-12 md:pt-20 pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8D8C3] text-xs font-semibold uppercase tracking-widest text-[#8C4A2F]">
          <span>Ký sự thực địa · Ngăn #001</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#211D1A] leading-[1.2]">
          {story.title}
        </h1>

        <p className="text-lg sm:text-xl font-serif italic text-[#5F442A] max-w-2xl mx-auto leading-relaxed">
          &ldquo;{story.excerpt}&rdquo;
        </p>

        <div className="flex items-center justify-center gap-6 text-xs text-[#9E7B54] pt-2">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#8C4A2F]" />
            Mèo Vạc, Hà Giang
          </span>
          <span>·</span>
          <span>Mùa đông 2026</span>
        </div>
      </section>

      {/* 2. COVER IMAGE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-[#D6BFA0]/60">
          <Image
            src={story.cover_image}
            alt={story.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* 3. MAIN STORY CONTENT */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Story Body */}
        <div className="prose prose-stone prose-lg max-w-none text-[#3E2B1B] font-serif leading-loose space-y-6">
          {story.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 4. NGƯỜI LÀM (Producer Spotlight) */}
        {story.producer && (
          <div className="p-8 rounded-3xl bg-[#F4ECE1] border border-[#E8D8C3] space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C4A2F] font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>Người Làm Tử Tế</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-[#D6BFA0] shadow">
                <Image
                  src={story.producer.avatar}
                  alt={story.producer.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#211D1A]">
                  {story.producer.name}
                </h3>
                <p className="text-xs text-[#8C4A2F] font-semibold tracking-wide">
                  {story.producer.brand_name} · {story.producer.location}
                </p>
                <p className="text-sm text-[#5F442A] leading-relaxed">
                  {story.producer.story}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. TẠI SAO GẠC MĂNG RÊ CHỌN? */}
        <div className="border-t border-[#E8D8C3] pt-12 space-y-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4A2F] block">
            Tiêu Chuẩn Lựa Chọn
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211D1A]">
            Vì sao Gạc Măng Rê chọn mẻ mật này?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3]">
              <strong className="block text-sm font-bold text-[#8C4A2F] mb-1">
                ĐẤT (Thổ nhưỡng đá vôi)
              </strong>
              <p className="text-xs text-[#7F5E3C] leading-relaxed">
                Độ cao trên 1.200m của cao nguyên Đồng Văn mang lại không khí lạnh buốt, chỉ có giống hoa bạc hà hoang dại sinh tồn trên kẽ đá.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3]">
              <strong className="block text-sm font-bold text-[#8C4A2F] mb-1">
                NGƯỜI (Anh Giàng A Páo)
              </strong>
              <p className="text-xs text-[#7F5E3C] leading-relaxed">
                Giữ đúng nguyên tắc chỉ quay khi mật chín vít nắp hoàn toàn, bảo tồn nguyên vẹn lượng enzyme và phấn hoa tự nhiên.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3]">
              <strong className="block text-sm font-bold text-[#8C4A2F] mb-1">
                VỊ (Thanh mát sâu cuống họng)
              </strong>
              <p className="text-xs text-[#7F5E3C] leading-relaxed">
                Ngọt dịu tinh khiết, the nhẹ như cơn gió sớm, không ngọt gắt, màu vàng chanh ánh xanh đặc trưng không thể làm giả.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3]">
              <strong className="block text-sm font-bold text-[#8C4A2F] mb-1">
                CHUYỆN (Chuyến xe ngược dốc)
              </strong>
              <p className="text-xs text-[#7F5E3C] leading-relaxed">
                Hành trình thực địa vượt qua những khúc cua Mèo Vạc để mang hương vị chân thực về căn bếp người đồng điệu.
              </p>
            </div>
          </div>
        </div>

        {/* 6. CTA — MỞ NGĂN NÀY */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#22170E] text-[#FAF7F2] text-center space-y-6 shadow-2xl">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-mono text-[#D6BFA0]">
              Mời Bạn Đồng Hành
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#FAF7F2]">
              Cùng mở Ngăn #001
            </h3>
            <p className="text-sm text-[#D6BFA0] max-w-lg mx-auto">
              Ngăn chỉ gom đúng 100 phần mẻ mật ong bạc hà Mèo Vạc tươi nguyên để anh Giàng A Páo hạ tầng quay và đóng chai thủ công.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#8C4A2F] text-[#FAF7F2] font-semibold text-sm uppercase tracking-widest hover:bg-[#723922] transition-colors shadow-lg"
            >
              <span>Xem Chi Tiết & Đặt Ngăn Này</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
