'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, ShieldCheck, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { Ngan, Story } from '@/types';
import ProgressBar from '@/components/ProgressBar';

interface CinematicHeroProps {
  pilotNgans: Ngan[];
  goldenStory: Story | null;
}

export default function CinematicPantryHero({ pilotNgans, goldenStory }: CinematicHeroProps) {
  const [animationSettled, setAnimationSettled] = useState(false);

  useEffect(() => {
    // Cinematic subtle drawer unlatched entrance: runs once for 3.5s then settles still
    const timer = setTimeout(() => {
      setAnimationSettled(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const ocaNgan = pilotNgans.find((n) => n.slug.includes('oca')) || pilotNgans[0];
  const meoVacNgan = pilotNgans.find((n) => n.slug.includes('meo-vac') || n.slug.includes('ha-giang')) || pilotNgans[1];

  return (
    <div className="space-y-24 md:space-y-32 pb-24 overflow-x-hidden">
      
      {/* 1. CINEMATIC HERO — A DIGITAL PANTRY OF VIETNAM */}
      <section className="relative pt-12 md:pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
        
        {/* Subtle Background Wooden Texture Vignette */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#E8D8C3_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        <div className="text-center space-y-8 max-w-3xl mx-auto">
          
          <div className="space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A65F25] font-semibold block">
              A Digital Pantry of Vietnam
            </span>
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-[0.2em] text-[#141211] block">
              GẠC MĂNG RÊ
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#141211] leading-[1.12]">
            Cất vị quê nhà.
          </h1>

          <div className="max-w-xl mx-auto space-y-2 text-base sm:text-xl font-serif text-[#423B36] leading-relaxed">
            <p>Có những thứ ngon không dễ tìm.</p>
            <p>Có những người làm rất tử tế nhưng ít người biết đến.</p>
            <p className="font-semibold text-[#141211] pt-1">
              Gạc Măng Rê đi tìm họ.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ngan/cacao-oca"
              className="w-full sm:w-auto min-h-[50px] px-10 py-4 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold hover:bg-[#A65F25] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>MỞ NGĂN ĐẦU TIÊN</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/ve-gac-mang-re"
              className="w-full sm:w-auto min-h-[50px] px-8 py-4 rounded-full bg-[#EFE8DC]/80 border border-[#E7DFD3] text-[#423B36] text-xs uppercase tracking-widest font-semibold hover:bg-[#EFE8DC] transition-all duration-300 text-center flex items-center justify-center"
            >
              VỀ GẠC MĂNG RÊ
            </Link>
          </div>
        </div>

        {/* VISUAL METAPHOR: CHIẾC TỦ GỖ GẠC MĂNG RÊ (DRAWERS) */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div
            className={`p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border-2 border-[#D9CEBF] shadow-xl transition-all duration-1000 ${
              animationSettled ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-95 scale-[0.99]'
            }`}
          >
            <div className="flex items-center justify-between pb-5 border-b border-[#E7DFD3]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A65F25] animate-ping" />
                <span className="text-xs uppercase font-mono tracking-widest text-[#A65F25] font-bold">
                  CHIẾC TỦ ĐANG HÉ MỞ · 2 NGĂN PILOT
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#665E58]">Mùa thu hái 2026</span>
            </div>

            {/* 2 Ngăn Pilot Drawers side-by-side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              
              {/* NGĂN #001 — CACAO OCA */}
              {ocaNgan && (
                <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#A65F25] transition-colors group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#141211] text-[#FAF8F5] font-mono text-[10px] tracking-widest uppercase">
                        NGĂN #001
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        GOLDEN TEST
                      </span>
                    </div>

                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#E7DFD3] bg-[#F3EDE2]">
                      <Image
                        src={ocaNgan.hero_image}
                        alt="Cacao OCA Châu Đức"
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-2 left-2 bg-[#141211]/70 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#A65F25]" />
                        <span>Châu Đức, Bà Rịa - Vũng Tàu</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#141211] group-hover:text-[#A65F25] transition-colors">
                      {ocaNgan.title}
                    </h3>
                    <p className="text-xs font-serif text-[#665E58] leading-relaxed line-clamp-2">
                      Hạt cacao Trinitario lên men thùng gỗ mít 6 ngày, giữ nguyên tỷ lệ bơ cacao mộc tự nhiên &gt;18%.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#F0EBE1]">
                    <div className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="font-serif text-lg font-bold text-[#141211]">
                          280.000₫
                        </span>
                        <span className="text-[11px] text-[#665E58]"> / phần 250g</span>
                      </div>
                      <span className="font-mono text-[#A65F25] font-bold text-[11px]">
                        18/30 phần (Còn 12 phần)
                      </span>
                    </div>
                    <ProgressBar current={18} moq={30} showDetails={false} />
                    <Link
                      href="/ngan/cacao-oca"
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold hover:bg-[#A65F25] transition flex items-center justify-center gap-1.5"
                    >
                      <span>MỞ NGĂN #001</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* NGĂN #002 — MẬT ONG BẠC HÀ MÈO VẠC */}
              {meoVacNgan && (
                <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#A65F25] transition-colors group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#141211] text-[#FAF8F5] font-mono text-[10px] tracking-widest uppercase">
                        NGĂN #002
                      </span>
                      <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        SẢN VẬT MÙA ĐÔNG
                      </span>
                    </div>

                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#E7DFD3] bg-[#F3EDE2]">
                      <Image
                        src={meoVacNgan.hero_image}
                        alt="Mật ong hoa bạc hà Mèo Vạc"
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-2 left-2 bg-[#141211]/70 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#A65F25]" />
                        <span>Mèo Vạc, Hà Giang (&gt;1.200m)</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#141211] group-hover:text-[#A65F25] transition-colors">
                      Mật Ong Bạc Hà Mèo Vạc
                    </h3>
                    <p className="text-xs font-serif text-[#665E58] leading-relaxed line-clamp-2">
                      Mật ong dại vách đá tai mèo mùa đông của anh Giàng A Páo. Vàng chanh ánh xanh, vị the mát thanh sâu.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#F0EBE1]">
                    <div className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="font-serif text-lg font-bold text-[#141211]">
                          280.000₫
                        </span>
                        <span className="text-[11px] text-[#665E58]"> / chai 500ml</span>
                      </div>
                      <span className="font-mono text-[#A65F25] font-bold text-[11px]">
                        14/20 phần (Còn 6 phần)
                      </span>
                    </div>
                    <ProgressBar current={14} moq={20} showDetails={false} />
                    <Link
                      href="/ngan/mat-ong-bac-ha-meo-vac"
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold hover:bg-[#A65F25] transition flex items-center justify-center gap-1.5"
                    >
                      <span>MỞ NGĂN #002</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* 2. CÂU CHUYỆN KÝ SỰ THỰC ĐỊA */}
      {goldenStory && (
        <section className="bg-[#F7F3EB] py-20 px-4 sm:px-6 border-y border-[#E7DFD3]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-[#E7DFD3]">
              <Image
                src={goldenStory.cover_image}
                alt={goldenStory.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#141211]/85 backdrop-blur-xs text-[#FAF8F5] text-[10px] font-mono tracking-wider">
                  Ký sự thực địa
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#A65F25]">
                <Compass className="w-3.5 h-3.5" />
                <span>Hành trình tìm người làm tử tế</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#141211] leading-tight">
                {goldenStory.title}
              </h2>

              <p className="text-[#423B36] text-base font-serif italic leading-relaxed">
                &ldquo;{goldenStory.excerpt}&rdquo;
              </p>

              <div className="pt-2">
                <Link
                  href={`/stories/${goldenStory.slug}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold hover:bg-[#A65F25] transition shadow-sm"
                >
                  <span>Đọc Ký Sự</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. TRIẾT LÝ: ĐẤT · NGƯỜI · VỊ · CHUYỆN */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#A65F25]">
            TRIẾT LÝ GẠC MĂNG RÊ
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            Bốn Tiêu Chuẩn Cất Vị
          </h2>
          <p className="text-xs sm:text-sm text-[#665E58] font-sans">
            Không phải sàn thương mại điện tử. Mỗi sản vật trong ngăn được lựa chọn cẩn trọng bằng đôi mắt thực địa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-bold text-[#A65F25]">01</span>
            <h3 className="font-serif text-lg font-bold text-[#141211]">ĐẤT</h3>
            <p className="text-xs text-[#665E58] leading-relaxed">
              Thổ nhưỡng, vi khí hậu đặc hữu không thể sao chép của từng ngóc ngách Việt Nam.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-bold text-[#A65F25]">02</span>
            <h3 className="font-serif text-lg font-bold text-[#141211]">NGƯỜI</h3>
            <p className="text-xs text-[#665E58] leading-relaxed">
              Đôi tay người làm tử tế, kiên nhẫn với nghề xưa, không vội vã chạy theo sản lượng.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-bold text-[#A65F25]">03</span>
            <h3 className="font-serif text-lg font-bold text-[#141211]">VỊ</h3>
            <p className="text-xs text-[#665E58] leading-relaxed">
              Thô mộc nguyên bản, không hương liệu hay chất bảo quản, giữ trọn hậu vị ấm sâu.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-bold text-[#A65F25]">04</span>
            <h3 className="font-serif text-lg font-bold text-[#141211]">CHUYỆN</h3>
            <p className="text-xs text-[#665E58] leading-relaxed">
              Minh bạch từng lô hạt, từng thùng ủ, kết nối người làm tử tế với người biết thưởng thức.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
