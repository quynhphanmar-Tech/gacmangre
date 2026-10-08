import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Heart, ShieldCheck, Compass } from 'lucide-react';

export const metadata = {
  title: 'Về Gạc Măng Rê — Tuyên Ngôn Cất Vị Quê Nhà',
  description:
    'Gạc Măng Rê không phải là sàn đặc sản. Đây là chiếc tủ tuyển chọn: cất giữ nông sản nguyên bản từ những người làm tử tế khắp Việt Nam theo 4 tiêu chuẩn Đất · Người · Vị · Chuyện.',
  alternates: {
    canonical: 'https://brandtalk.asia/gacmangre/ve-gac-mang-re',
  },
};

export default function VeGacMangRePage() {
  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#9E7B54] hover:text-[#8C4A2F] transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>

        <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4A2F] block">
          Tuyên ngôn thương hiệu
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#211D1A] leading-tight">
          Cất vị quê nhà
        </h1>

        <p className="text-lg sm:text-xl font-serif italic text-[#5F442A] max-w-2xl mx-auto leading-relaxed">
          &ldquo;Gạc Măng Rê không được trở thành sàn đặc sản. Ở đây người ta đã chọn giúp mình.&rdquo;
        </p>
      </div>

      {/* Philosophy content */}
      <div className="prose prose-stone prose-lg max-w-none text-[#3E2B1B] font-serif leading-loose space-y-6">
        <p className="text-lg">
          Ngày nay, chỉ cần một cú nhấp chuột, người ta có thể mua được hàng ngàn loại bánh trái, mật ong, trà quả từ khắp mọi miền. Nhưng giữa một rừng sản phẩm công nghiệp gắn mác &ldquo;truyền thống&rdquo;, việc tìm được một thức quà mộc mạc, thật thà, được làm bằng cái tâm nhẫn nại của người nông dân lại trở nên khó khăn hơn bao giờ hết.
        </p>
        <p className="text-lg">
          <strong>Gạc Măng Rê</strong> ra đời từ những chuyến xe ngược dốc lên non. Chúng tôi chọn cách đi chậm lại: gặp từng người làm, ăn cùng mâm cơm, leo lên từng triền đá để tận mắt thấy từng đàn ong, từng gốc chè shan tuyết.
        </p>
        <p className="text-lg">
          Chúng tôi không gom hàng ngàn món đồ vào kho để bán lẻ. Mỗi sản vật được cất trong một <strong>&ldquo;NGĂN&rdquo;</strong>. Khi cộng đồng gom đủ số lượng tối thiểu (MOQ), người làm mới bắt đầu thu hái, chưng cất và đóng mẻ tươi nhất gửi về bếp nhà bạn.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="space-y-6 border-t border-[#E8D8C3] pt-12">
        <h3 className="font-serif text-2xl font-bold text-[#211D1A] text-center">
          Bốn Tiêu Chuẩn Cất Vị
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-[#F4ECE1] border border-[#E8D8C3] space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#8C4A2F]">ĐẤT — Thổ nhưỡng bản địa</h4>
            <p className="text-sm text-[#7F5E3C] leading-relaxed">
              Khí hậu, nguồn nước và chất đất đặc thù tạo nên hương vị nguyên bản mà kỹ thuật nhân tạo không thể tạo tác.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4ECE1] border border-[#E8D8C3] space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#8C4A2F]">NGƯỜI — Sự tử tế & Nhẫn nại</h4>
            <p className="text-sm text-[#7F5E3C] leading-relaxed">
              Những con người chân chất gìn giữ nghề xưa, tuyệt đối không vì lợi nhuận ngắn hạn mà đánh đổi phẩm chất mẻ hàng.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4ECE1] border border-[#E8D8C3] space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#8C4A2F]">VỊ — Hậu vị thanh sâu</h4>
            <p className="text-sm text-[#7F5E3C] leading-relaxed">
              Vị ngon tròn đầy, không phụ gia công nghiệp, lưu giữ cảm giác dễ chịu và ấm lòng khi thưởng thức.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4ECE1] border border-[#E8D8C3] space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#8C4A2F]">CHUYỆN — Kết nối thật tâm</h4>
            <p className="text-sm text-[#7F5E3C] leading-relaxed">
              Mỗi món ăn là một lát cắt văn hoá, là sự sẻ chia giữa người làm ra nó và người trân trọng nó.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/ngan/cacao-oca"
          className="inline-block px-8 py-4 rounded-full bg-[#8C4A2F] text-[#FAF7F2] font-semibold text-xs uppercase tracking-widest hover:bg-[#723922] transition-colors shadow-lg"
        >
          Khám phá Ngăn #001
        </Link>
      </div>
    </div>
  );
}
