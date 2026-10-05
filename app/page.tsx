import Link from 'next/link';
import Image from 'next/image';
import { getActiveNgans } from '@/services/ngan-service';
import { getStories } from '@/services/story-service';
import NganCard from '@/components/NganCard';
import { Compass, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const ngans = await getActiveNgans();
  const stories = await getStories();
  const goldenStory = stories[0];

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 md:pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8D8C3]/60 border border-[#D6BFA0] text-xs font-medium text-[#7F5E3C]">
            <Sparkles className="w-3.5 h-3.5 text-[#8C4A2F]" />
            <span>Story-Commerce · Tuyển chọn sản vật bản địa</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#211D1A] leading-[1.15]">
            Cất vị quê nhà.
          </h1>

          <div className="max-w-2xl mx-auto space-y-4 text-base sm:text-xl font-serif text-[#5F442A] leading-relaxed">
            <p className="font-semibold text-[#8C4A2F]">
              Có những thứ ngon không dễ tìm.
            </p>
            <p>
              Có những người làm rất tử tế nhưng ít người biết đến.
            </p>
            <p className="font-bold text-[#211D1A]">
              Gạc Măng Rê đi tìm họ.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#dang-mo-ngan"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#8C4A2F] text-[#FAF7F2] font-semibold text-sm uppercase tracking-widest hover:bg-[#723922] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Khám Phá Các Ngăn</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E8D8C3]/50 border border-[#D6BFA0] text-[#5F442A] font-semibold text-sm uppercase tracking-wider hover:bg-[#E8D8C3] transition-all"
            >
              Đọc Câu Chuyện #001
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ĐANG MỞ NGĂN — TRUNG TÂM (Active Drop) */}
      <section id="dang-mo-ngan" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8D8C3]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C4A2F] font-semibold mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
              Đang Mở Gom Đơn
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211D1A]">
              Các Ngăn Đang Mở
            </h2>
          </div>
          <p className="text-sm text-[#7F5E3C] mt-2 md:mt-0 max-w-md">
            Mỗi Ngăn là một mẻ thu hoạch tươi mới, chỉ bắt đầu chuẩn bị khi cộng đồng cùng gom đủ mốc MOQ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {ngans.map((ngan) => (
            <NganCard key={ngan.id} ngan={ngan} />
          ))}
        </div>
      </section>

      {/* 3. STORY SECTION — ĐI TÌM CÙNG GẠC MĂNG RÊ */}
      {goldenStory && (
        <section className="bg-[#F4ECE1] py-20 px-4 sm:px-6 border-y border-[#E8D8C3]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image Column */}
              <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[#D6BFA0]/60">
                <Image
                  src={goldenStory.cover_image}
                  alt={goldenStory.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded bg-[#211D1A]/80 backdrop-blur-sm text-[#FAF7F2] text-xs font-medium tracking-wide">
                    Nhật ký thực địa
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8C4A2F]">
                  <Compass className="w-4 h-4" />
                  <span>Vùng đất Mèo Vạc, Hà Giang</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211D1A] leading-tight">
                  {goldenStory.title}
                </h2>

                <p className="text-[#5F442A] text-base sm:text-lg font-serif italic leading-relaxed">
                  &ldquo;{goldenStory.excerpt}&rdquo;
                </p>

                <p className="text-sm text-[#7F5E3C] leading-relaxed">
                  Chúng tôi không tìm sản vật qua điện thoại hay phòng triển lãm. Gạc Măng Rê lặn lội đến tận triền núi, ở cùng người làm, ăn cùng mâm cơm để hiểu trọn cái tâm của họ đọng lại trong từng giọt hương vị.
                </p>

                <div className="pt-2">
                  <Link
                    href={`/stories/${goldenStory.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#211D1A] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#8C4A2F] transition-colors"
                  >
                    <span>Đi Tìm Cùng Gạc Măng Rê</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. CURATION MOAT & 4 TIÊU CHUẨN */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4A2F]">
            Curation Moat
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211D1A]">
            Ở đây người ta đã chọn giúp mình
          </h2>
          <p className="text-sm text-[#7F5E3C] leading-relaxed">
            Chúng tôi kiên định không biến Gạc Măng Rê thành sàn thương mại điện tử với hàng ngàn món đồ vô danh. Mọi ngăn được mở đều thỏa mãn 4 tiêu chuẩn khắt khe:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-3">
            <span className="font-mono text-xs font-bold text-[#8C4A2F]">01</span>
            <h3 className="font-serif text-xl font-bold text-[#211D1A]">ĐẤT</h3>
            <p className="text-xs text-[#7F5E3C] leading-relaxed">
              Vùng thổ nhưỡng đặc hữu, vi khí hậu tạo nên phẩm chất nguyên liệu mà không nơi nào có thể sao chép được.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-3">
            <span className="font-mono text-xs font-bold text-[#8C4A2F]">02</span>
            <h3 className="font-serif text-xl font-bold text-[#211D1A]">NGƯỜI</h3>
            <p className="text-xs text-[#7F5E3C] leading-relaxed">
              Người làm tử tế, kiên nhẫn với quy trình mộc mạc thủ công, tuyệt đối không vội vã chạy theo năng suất công nghiệp.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-3">
            <span className="font-mono text-xs font-bold text-[#8C4A2F]">03</span>
            <h3 className="font-serif text-xl font-bold text-[#211D1A]">VỊ</h3>
            <p className="text-xs text-[#7F5E3C] leading-relaxed">
              Hương vị nguyên bản, thanh lành, hậu vị sâu sắc đọng lại nơi cuống họng và trong ký ức ẩm thực quê nhà.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-3">
            <span className="font-mono text-xs font-bold text-[#8C4A2F]">04</span>
            <h3 className="font-serif text-xl font-bold text-[#211D1A]">CHUYỆN</h3>
            <p className="text-xs text-[#7F5E3C] leading-relaxed">
              Câu chuyện có thật đằng sau chuyến đi, sự gắn kết bền bỉ giữa con người với mảnh đất sinh tồn qua bao thế hệ.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
