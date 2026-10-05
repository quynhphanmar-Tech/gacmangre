import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#22170E] text-[#E8D8C3] pt-16 pb-12 border-t border-[#3E2B1B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#3E2B1B]">
          <div className="md:col-span-6 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-widest text-[#FAF7F2] block">
              GẠC MĂNG RÊ
            </span>
            <p className="text-sm font-serif italic text-[#D6BFA0] max-w-md leading-relaxed">
              &ldquo;Có những thứ ngon không dễ tìm. Có những người làm rất tử tế nhưng ít người biết đến. Gạc Măng Rê đi tìm họ. Cất vị quê nhà.&rdquo;
            </p>
            <p className="text-xs text-[#9E7B54] uppercase tracking-widest">
              Định vị: Curation Moat · Không phải sàn thương mại điện tử
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#FAF7F2]">
              Hành trình
            </h4>
            <ul className="space-y-2 text-sm text-[#D6BFA0]">
              <li>
                <Link href="/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac" className="hover:text-white transition">
                  Câu chuyện Hà Giang
                </Link>
              </li>
              <li>
                <Link href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang" className="hover:text-white transition">
                  Mở Ngăn #001
                </Link>
              </li>
              <li>
                <Link href="/ve-gac-mang-re" className="hover:text-white transition">
                  Triết lý Đất · Người · Vị · Chuyện
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#FAF7F2]">
              Kết nối
            </h4>
            <p className="text-sm text-[#D6BFA0]">
              Cập nhật trực tiếp qua Zalo Official Account khi Ngăn mở gom và đạt MOQ.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-[#3E2B1B] text-xs text-[#FAF7F2] rounded">
                Zalo OA: Gạc Măng Rê
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E7B54]">
          <p>© 2026 Gạc Măng Rê. Mọi quyền được bảo lưu.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/admin" className="hover:text-[#D6BFA0] transition">
              Quản trị đơn P0
            </Link>
            <span>Phiên bản MVP Golden Sample 1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
