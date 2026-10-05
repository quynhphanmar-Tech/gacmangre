import Image from 'next/image';
import Link from 'next/link';
import { Ngan } from '@/types';
import ProgressBar from './ProgressBar';
import { ArrowRight, MapPin } from 'lucide-react';

interface NganCardProps {
  ngan: Ngan;
}

export default function NganCard({ ngan }: NganCardProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(ngan.price);

  const experimentSubId = `GM-LIVE-01-${ngan.number.replace('#', '')}`;

  return (
    <div className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E7DFD3] hover:border-[#A65F25]/60 transition-all duration-500 shadow-pantry hover:shadow-pantryHover overflow-hidden flex flex-col">
      {/* "Hé mở ngăn tủ" subtle top hairline indication */}
      <div className="h-1 w-full bg-[#EFE8DC] group-hover:bg-[#A65F25] transition-colors duration-500"></div>

      {/* Visual Photography Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F3EDE2]">
        <Image
          src={ngan.hero_image}
          alt={ngan.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Number & Experiment Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-[#141211]/85 backdrop-blur-md text-[#FAF8F5] font-mono text-[11px] uppercase tracking-widest shadow-sm">
            NGĂN {ngan.number}
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-[#FAF8F5]/85 backdrop-blur-md text-[#665E58] font-mono text-[9px]">
            {experimentSubId}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md text-xs font-sans text-[#262220] shadow-sm">
            <MapPin className="w-3 h-3 text-[#A65F25]" />
            <span>{ngan.product?.origin || 'Việt Nam · Mùa 2026'}</span>
          </span>
        </div>
      </div>

      {/* Card Content & Metaphor */}
      <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <div className="text-[10px] uppercase font-mono tracking-pantryst font-bold text-[#A65F25]">
            {ngan.product?.unit ? `${ngan.product.unit} · ` : ''}{ngan.product?.origin?.split(',')[0] || ''}
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#141211] group-hover:text-[#A65F25] transition-colors leading-snug">
            {ngan.title}
          </h3>
          <p className="text-sm font-serif italic text-[#665E58] line-clamp-2 leading-relaxed">
            &ldquo;{ngan.short_description}&rdquo;
          </p>
        </div>

        {/* Progress: X / Y người cùng mở · Còn Z phần để mở Ngăn */}
        <div className="pt-2">
          <ProgressBar
            current={ngan.current_quantity}
            moq={ngan.moq}
            showDetails={true}
          />
        </div>

        {/* Bottom: Visible Price & "MỞ NGĂN →" CTA */}
        <div className="pt-5 border-t border-[#E7DFD3] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block">
              Mức giá mở ngăn
            </span>
            <span className="text-base font-semibold font-sans text-[#262220]">
              {formattedPrice}
            </span>
            <span className="text-xs text-[#665E58]"> / {ngan.product?.unit || 'phần'}</span>
          </div>

          <Link
            href={`/ngan/${ngan.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold hover:bg-[#A65F25] transition-all duration-300 shadow-sm"
          >
            <span>MỞ NGĂN</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
