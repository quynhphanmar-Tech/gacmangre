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

        {/* Contemporary Editorial Navigation (Brief v1.1): ĐI TÌM · MỞ NGĂN · ĐÃ MỞ · CHUYỆN */}
        <nav className="hidden md:flex items-center space-x-10 text-xs font-semibold tracking-pantryst uppercase text-[#423B36]">
          <Link
            href="/#di-tim"
            className="hover:text-[#A65F25] transition-colors"
          >
            ĐI TÌM
          </Link>
          <Link
            href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang"
            className="hover:text-[#A65F25] transition-colors flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A65F25] animate-pulse"></span>
            MỞ NGĂN
          </Link>
          <Link
            href="/da-mo"
            className="hover:text-[#A65F25] transition-colors text-[#665E58]"
          >
            ĐÃ MỞ
          </Link>
          <Link
            href="/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac"
            className="hover:text-[#A65F25] transition-colors"
          >
            CHUYỆN
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang"
            className="px-5 py-2.5 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#A65F25] transition-all duration-300 shadow-sm"
          >
            Mở Ngăn #001
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
              href="/#di-tim"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#A65F25] py-1 border-b border-[#E7DFD3]/50 flex justify-between items-center"
            >
              <span>ĐI TÌM</span>
              <ArrowUpRight className="w-4 h-4 text-[#665E58]" />
            </Link>
            <Link
              href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#A65F25] py-1 border-b border-[#E7DFD3]/50 flex justify-between items-center text-[#A65F25]"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A65F25]"></span>
                MỞ NGĂN #001
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/da-mo"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#A65F25] py-1 border-b border-[#E7DFD3]/50 flex justify-between items-center text-[#665E58]"
            >
              <span>ĐÃ MỞ</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#A65F25] py-1 border-b border-[#E7DFD3]/50 flex justify-between items-center"
            >
              <span>CHUYỆN</span>
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
