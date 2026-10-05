import Link from 'next/link';
import Image from 'next/image';
import { getActiveNgans } from '@/services/ngan-service';
import { getStories } from '@/services/story-service';
import NganCard from '@/components/NganCard';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export default async function HomePage() {
  const ngans = await getActiveNgans();
  const stories = await getStories();
  const goldenStory = stories[0];

  return (
    <div className="space-y-28 md:space-y-36 pb-28">
      {/* 1. ABOVE FOLD — STRICTLY BRIEF v1.1 */}
      <section className="relative pt-20 md:pt-32 pb-16 px-5 sm:px-8 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <div className="space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-pantrystWide text-[#665E58] block">
              A Digital Pantry of Vietnam
            </span>
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-[0.18em] text-[#141211] block">
              GẠC MĂNG RÊ
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#141211] leading-[1.12]">
            Cất vị quê nhà.
          </h1>

          <div className="max-w-xl mx-auto space-y-4 text-lg sm:text-2xl font-serif text-[#423B36] leading-relaxed">
            <p>Có những thứ ngon không dễ tìm.</p>
            <p>
              Có những người làm rất tử tế<br className="hidden sm:inline" /> nhưng ít người biết đến.
            </p>
            <p className="font-semibold text-[#141211] pt-2">
              Gạc Măng Rê đi tìm họ.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#dang-mo-ngan"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-semibold hover:bg-[#A65F25] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>MỞ NGĂN</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#EFE8DC]/60 border border-[#E7DFD3] text-[#423B36] text-xs uppercase tracking-pantryst font-semibold hover:bg-[#EFE8DC] transition-all duration-300 text-center"
            >
              ĐI TÌM CÙNG GẠC MĂNG RÊ
            </Link>
          </div>
        </div>
      </section>

      {/* 2. NGĂN ĐANG MỞ (1–3 Ngăn tuyển chọn, không product grid dài) */}
      <section id="dang-mo-ngan" className="max-w-5xl mx-auto px-5 sm:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E7DFD3]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-pantryst text-[#A65F25] font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#A65F25] animate-ping"></span>
              Chiếc tủ đang hé mở
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141211]">
              Ngăn Đang Mở
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#665E58] mt-2 md:mt-0 max-w-sm font-sans">
            Mỗi Ngăn là một mẻ thu hoạch thật từ một vùng đất, chỉ bắt đầu chuẩn bị khi cộng đồng cùng gom đủ mốc.
          </p>
        </div>

        {/* 3 Selected Drop Cards (M4 Live Validation) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ngans.map((ngan) => (
            <NganCard key={ngan.id} ngan={ngan} />
          ))}
        </div>
      </section>

      {/* 3. EDITORIAL STORY SECTION: FACT → DETAIL → HUMAN → MEANING */}
      {goldenStory && (
        <section id="di-tim" className="bg-[#F7F3EB] py-24 px-5 sm:px-8 border-y border-[#E7DFD3]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Photography Column */}
              <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-pantry border border-[#E7DFD3]">
                <Image
                  src={goldenStory.cover_image}
                  alt={goldenStory.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute top-5 left-5">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#141211]/80 backdrop-blur-md text-[#FAF8F5] text-[11px] font-mono tracking-wider">
                    Thực địa · Mèo Vạc
                  </span>
                </div>
              </div>

              {/* Editorial Text Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-pantryst text-[#A65F25]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Một vùng đất · Mèo Vạc, Hà Giang</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#141211] leading-tight">
                  {goldenStory.title}
                </h2>

                <p className="text-[#423B36] text-lg font-serif italic leading-relaxed">
                  &ldquo;{goldenStory.excerpt}&rdquo;
                </p>

                {/* Facts over romance */}
                <div className="border-l-2 border-[#A65F25] pl-4 py-1 text-xs sm:text-sm text-[#665E58] space-y-1.5 font-sans">
                  <p>• <strong>Độ cao:</strong> Trên 1.200m so với mực nước biển trên triền đá tai mèo.</p>
                  <p>• <strong>Mùa vụ:</strong> Chỉ một vụ duy nhất từ tháng 10 đến tháng 12 âm lịch.</p>
                  <p>• <strong>Quy tắc:</strong> Chỉ hạ tầng quay khi tàng ong vít nắp 100%, không hạ thủy phần công nghiệp.</p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/stories/${goldenStory.slug}`}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-semibold hover:bg-[#A65F25] transition-all duration-300"
                  >
                    <span>Đọc Ký Sự Đi Tìm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. BRAND METAPHOR: CHIẾC TỦ CỦA NGƯỜI VIỆT */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-pantryst font-semibold text-[#A65F25]">
            Information Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141211]">
            Một chiếc tủ cũ được mở lại
          </h2>
          <p className="text-sm text-[#665E58] leading-relaxed font-sans">
            Mỗi Ngăn là một đơn vị trải nghiệm hoàn chỉnh: kết nối một vùng đất, một người làm, một sản vật, một câu chuyện và một cộng đồng cùng mở.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] space-y-3 shadow-pantry">
            <span className="font-mono text-xs font-bold text-[#A65F25]">01</span>
            <h3 className="font-serif text-xl font-bold text-[#141211]">VÙNG ĐẤT</h3>
            <p className="text-xs text-[#665E58] leading-relaxed font-sans">
              Thổ nhưỡng, vi khí hậu đặc hữu không thể sao chép của từng ngóc ngách Việt Nam.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] space-y-3 shadow-pantry">
            <span className="font-mono text-xs font-bold text-[#A65F25]">02</span>
            <h3 className="font-serif text-xl font-bold text-[#141211]">NGƯỜI</h3>
            <p className="text-xs text-[#665E58] leading-relaxed font-sans">
              Những đôi tay thật, người làm tử tế kiên nhẫn với nghề, không vội vã chạy theo sản lượng.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] space-y-3 shadow-pantry">
            <span className="font-mono text-xs font-bold text-[#A65F25]">03</span>
            <h3 className="font-serif text-xl font-bold text-[#141211]">SẢN VẬT</h3>
            <p className="text-xs text-[#665E58] leading-relaxed font-sans">
              Mẻ hàng tươi thô nguyên bản, minh bạch nguồn gốc, chứng nhận và ngày thu hái.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] space-y-3 shadow-pantry">
            <span className="font-mono text-xs font-bold text-[#A65F25]">04</span>
            <h3 className="font-serif text-xl font-bold text-[#141211]">CỘNG ĐỒNG</h3>
            <p className="text-xs text-[#665E58] leading-relaxed font-sans">
              Cùng nhau gom đủ số lượng tối thiểu để người nông dân an tâm làm ra mẻ hàng tử tế nhất.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
