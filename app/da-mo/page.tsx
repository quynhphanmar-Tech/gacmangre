import Link from 'next/link';
import { ArrowLeft, Archive, CheckCircle } from 'lucide-react';

export default function DaMoPage() {
  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto space-y-12">
      <div className="space-y-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#9E7B54] hover:text-[#8C4A2F] transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#211D1A]">
          Các Ngăn Đã Mở
        </h1>
        <p className="text-base text-[#7F5E3C] max-w-xl mx-auto font-serif italic">
          Lưu trữ các đợt gom sản vật bản địa đã đạt mốc MOQ và được chuyển về căn bếp của những người đồng điệu.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-[#F4ECE1] border border-[#E8D8C3] text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#E8D8C3] text-[#8C4A2F] flex items-center justify-center mx-auto">
          <Archive className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-bold text-[#211D1A]">
          Ngăn #001 (Cacao OCA) đang trong tiến trình cùng mở mẻ
        </h3>
        <p className="text-sm text-[#5F442A] max-w-md mx-auto">
          Các mẻ sản vật thu hoạch thủ công chỉ hạ mẻ khi cộng đồng cùng gom đủ mốc MOQ. Sau khi hoàn thành xuất xưởng và giao nhận đến tay bạn, toàn bộ dữ liệu nhật ký mẻ sẽ được cất giữ vĩnh viễn tại đây.
        </p>
        <div className="pt-2">
          <Link
            href="/ngan/cacao-oca"
            className="inline-block px-6 py-3 rounded-full bg-[#8C4A2F] text-[#FAF7F2] text-xs uppercase tracking-widest font-bold hover:bg-[#723922] transition-colors"
          >
            Xem Ngăn #001 Đang Mở
          </Link>
        </div>
      </div>
    </div>
  );
}
