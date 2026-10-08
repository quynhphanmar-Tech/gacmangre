'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7DFD3] transition-all">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo: GẠC MĂNG RÊ */}
        <Link href="/" className="group flex flex-col items-start focus:outline-none">
          <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#141211] group-hover:text-[#A65F25] transition-colors">
            GẠC MĂNG RÊ
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#665E58] font-sans font-medium">
            A Digital Pantry of Vietnam
          </span>
        </Link>

        {/* Contemporary Editorial Navigation (Pilot v1.0): MỞ NGĂN · KÝ SỰ CHUYỆN · VỀ GẠC MĂNG RÊ */}
        <nav className="hidden md:flex items-center space-x-9 text-xs font-semibold tracking-pantryst uppercase text-[#423B36]">
          <Link
            href="/ngan/cacao-oca"
            className="hover:text-[#A65F25] transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A65F25] animate-pulse"></span>
            NGĂN #001 (CACAO)
          </Link>
          <Link
            href="/ngan/mat-ong-bac-ha-meo-vac"
            className="hover:text-[#A65F25] transition-colors"
          >
            NGĂN #002 (MẬT ONG)
          </Link>
          <Link
            href="/stories/hat-cacao-viet-nam-va-cach-lam-cua-rieng-minh"
            className="hover:text-[#A65F25] transition-colors"
          >
            CÂU CHUYỆN
          </Link>
          <Link
            href="/ve-gac-mang-re"
            className="hover:text-[#A65F25] transition-colors text-[#665E58]"
          >
            VỀ GẠC MĂNG RÊ
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/ngan/cacao-oca"
            className="px-5 py-2.5 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#A65F25] transition-all duration-300 shadow-sm"
          >
            Mở Ngăn Đầu Tiên
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#141211] hover:text-[#A65F25] focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E7DFD3] px-6 py-8 space-y-6 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-5 text-sm uppercase tracking-pantryst font-semibold text-[#262220]">
            <Link
              href="/ngan/cacao-oca"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#A65F25] py-1 border-b border-[#E7DFD3]/50 flex justify-between items-center text-[#A65F25]"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A65F25]"></span>
                MỞ NGĂN #001 (CACAO OCA)
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ngan/mat-ong-bac-ha-meo-vac"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#A65F25] py-1 border-b border-[#E7DFD3]/50 flex justify-between items-center text-[#262220]"
            >
              <span>MỞ NGĂN #002 (MẬT ONG)</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/stories/hat-cacao-viet-nam-va-cach-lam-cua-rieng-minh"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#A65F25] py-1 border-b border-[#E7DFD3]/50 flex justify-between items-center"
            >
              <span>CÂU CHUYỆN SẢN VẬT</span>
              <ArrowUpRight className="w-4 h-4 text-[#665E58]" />
            </Link>
            <Link
              href="/ve-gac-mang-re"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#A65F25] py-1 border-b border-[#E7DFD3]/50 flex justify-between items-center text-[#665E58]"
            >
              <span>VỀ GẠC MĂNG RÊ</span>
              <ArrowUpRight className="w-4 h-4 text-[#665E58]" />
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-[#665E58] pt-2"
            >
              Trang Quản Trị P0
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
