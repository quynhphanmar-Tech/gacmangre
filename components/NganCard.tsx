import Image from 'next/image';
import Link from 'next/link';
import { Ngan } from '@/types';
import ProgressBar from './ProgressBar';

interface NganCardProps {
  ngan: Ngan;
}

export default function NganCard({ ngan }: NganCardProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(ngan.price);

  return (
    <div className="group bg-[#FAF7F2] rounded-2xl border border-[#E8D8C3] hover:border-[#BE9D77] transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8D8C3]">
        <Image
          src={ngan.hero_image}
          alt={ngan.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3.5 py-1.5 rounded-full bg-[#211D1A]/85 backdrop-blur-md text-[#FAF7F2] font-mono text-xs font-bold tracking-wider shadow">
            NGĂN {ngan.number}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block px-3 py-1 rounded bg-[#FAF7F2]/90 backdrop-blur-sm text-xs font-semibold text-[#5F442A] shadow-sm">
            {ngan.product?.origin || 'Hà Giang · Mùa 2026'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <h3 className="font-serif text-2xl font-bold text-[#211D1A] group-hover:text-[#8C4A2F] transition-colors leading-snug">
            {ngan.title}
          </h3>
          <p className="text-sm text-[#7F5E3C] line-clamp-2 leading-relaxed">
            {ngan.short_description}
          </p>
        </div>

        {/* MOQ Progress Component */}
        <div className="pt-2">
          <ProgressBar current={ngan.current_quantity} moq={ngan.moq} />
        </div>

        {/* Bottom Price & CTA */}
        <div className="pt-4 border-t border-[#E8D8C3]/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#9E7B54] block">
              Mức giá mở ngăn
            </span>
            <span className="text-xl font-bold font-serif text-[#211D1A]">
              {formattedPrice}
            </span>
            <span className="text-xs text-[#7F5E3C]"> / phần</span>
          </div>

          <Link
            href={`/ngan/${ngan.slug}`}
            className="px-5 py-2.5 rounded-full bg-[#8C4A2F] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#723922] transition-colors shadow-sm"
          >
            Mở Ngăn Này
          </Link>
        </div>
      </div>
    </div>
  );
}
