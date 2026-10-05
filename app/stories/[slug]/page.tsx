import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStoryBySlug } from '@/services/story-service';
import { MapPin, ArrowRight, Compass, Camera } from 'lucide-react';

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const coverAsset = story.media_assets?.[0];

  return (
    <article className="pb-28">
      {/* 1. HERO STORY — EDITORIAL MAGAZINE LAYOUT */}
      <section className="pt-12 md:pt-24 pb-14 px-5 sm:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFE8DC] text-[11px] font-mono font-semibold uppercase tracking-pantryst text-[#A65F25]">
          <span>KÝ SỰ THỰC ĐỊA · NGĂN #001</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#141211] leading-[1.18]">
          {story.title}
        </h1>

        <p className="text-lg sm:text-xl font-serif italic text-[#423B36] max-w-2xl mx-auto leading-relaxed">
          &ldquo;{story.excerpt}&rdquo;
        </p>

        <div className="flex items-center justify-center gap-4 text-xs font-sans text-[#665E58] pt-2">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#A65F25]" />
            Mèo Vạc, Hà Giang
          </span>
          <span>•</span>
          <span>Độ cao 1.200m</span>
          <span>•</span>
          <span>Mùa đông 2026</span>
        </div>
      </section>

      {/* 2. COVER PHOTOGRAPHY WITH METADATA CAPTION */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-16">
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-pantry border border-[#E7DFD3]">
          <Image
            src={coverAsset?.url || story.cover_image}
            alt={coverAsset?.alt_text || story.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
          {coverAsset?.is_verified && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141211]/85 backdrop-blur-md text-[10px] font-sans font-medium text-[#FAF8F5]">
                <Camera className="w-3 h-3 text-[#A65F25]" />
                <span>Tư liệu thực địa xác thực</span>
              </span>
            </div>
          )}
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[10px] text-[#FAF8F5]/90 bg-[#141211]/60 backdrop-blur-sm px-3 py-1 rounded-md line-clamp-1 inline-block">
              {coverAsset?.caption || 'Thung lũng đá tai mèo Mèo Vạc mùa sương muối.'} · {coverAsset?.credit || 'Ảnh: Gạc Măng Rê'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. FACTS OVER ROMANCE: DETAIL CALLOUT */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-14">
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          <div className="space-y-1">
            <span className="text-[#665E58] block">Người quay mật</span>
            <strong className="text-sm text-[#141211] font-semibold">Giàng A Páo (18 năm nghề)</strong>
          </div>
          <div className="space-y-1">
            <span className="text-[#665E58] block">Loài hoa nguồn</span>
            <strong className="text-sm text-[#141211] font-semibold">Bạc hà mọc hoang vách đá</strong>
          </div>
          <div className="space-y-1">
            <span className="text-[#665E58] block">Quy chuẩn mẻ</span>
            <strong className="text-sm text-[#A65F25] font-semibold">100% mật thô không hạ nhiệt</strong>
          </div>
        </div>

        {/* 4. MAIN ESSAY CONTENT */}
        <div className="prose prose-stone prose-lg max-w-none text-[#262220] font-serif leading-loose space-y-6">
          {story.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 5. PRODUCER CARD */}
        {story.producer && (
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-pantryst text-[#A65F25] font-semibold">
              <Compass className="w-4 h-4" />
              <span>Gặp Gỡ Người Làm</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#E7DFD3]">
                <Image
                  src={story.producer.avatar}
                  alt={story.producer.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#141211]">
                  {story.producer.name}
                </h3>
                <p className="text-xs text-[#A65F25] font-semibold tracking-wide">
                  {story.producer.brand_name} · {story.producer.location}
                </p>
                <p className="text-sm text-[#423B36] leading-relaxed font-sans">
                  {story.producer.story}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. DIRECT COMMERCE BRIDGE: STORY → NGĂN (Never trap user in story) */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#141211] text-[#FAF8F5] text-center space-y-6 shadow-2xl">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-pantrystWide font-mono text-[#EFE8DC]">
              Chiếc tủ đang mở
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#FAF8F5]">
              Mở Ngăn #001: Mật ong hoa dại Hà Giang
            </h3>
            <p className="text-xs sm:text-sm text-[#EFE8DC]/80 max-w-md mx-auto font-sans leading-relaxed">
              Câu chuyện kết tinh thành một ngăn sản vật có thật. Hiện đã có 74 người cùng mở trên mục tiêu 100 phần.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#A65F25] text-[#FAF8F5] font-semibold text-xs uppercase tracking-pantryst hover:bg-[#864918] transition-all duration-300 shadow-lg"
            >
              <span>XEM NGĂN & CÙNG MỞ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
