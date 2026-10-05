import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8D8C3]/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-2xl font-bold tracking-widest text-[#211D1A] group-hover:text-[#8C4A2F] transition-colors">
            GẠC MĂNG RÊ
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7B54] font-medium">
            Cất vị quê nhà
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#5F442A]">
          <Link
            href="/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac"
            className="hover:text-[#8C4A2F] transition-colors tracking-wide"
          >
            CÂU CHUYỆN
          </Link>
          <Link
            href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang"
            className="hover:text-[#8C4A2F] transition-colors tracking-wide flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            ĐANG MỞ NGĂN
          </Link>
          <Link
            href="/da-mo"
            className="hover:text-[#8C4A2F] transition-colors tracking-wide text-[#9E7B54]"
          >
            ĐÃ MỞ
          </Link>
          <Link
            href="/ve-gac-mang-re"
            className="hover:text-[#8C4A2F] transition-colors tracking-wide"
          >
            VỀ GẠC MĂNG RÊ
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/dat-hang/ngan-001-mat-ong-bac-ha-ha-giang"
            className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full bg-[#8C4A2F] text-[#FAF7F2] hover:bg-[#723922] transition-all shadow-sm hover:shadow"
          >
            Mở Ngăn #001
          </Link>
          <Link
            href="/admin"
            className="text-xs text-[#9E7B54] hover:text-[#5F442A] underline underline-offset-4 hidden lg:inline-block"
          >
            Admin P0
          </Link>
        </div>
      </div>
    </header>
  );
}
