'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ShareButtonProps {
  orderCode: string;
  nganNumber: string;
  nganSlug: string;
}

export default function ShareButton({ orderCode, nganNumber, nganSlug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    trackEvent('share_ngan', { order_code: orderCode, ngan_number: nganNumber });

    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/ngan/${nganSlug}?utm_source=share_order&utm_medium=referral`
      : `/ngan/${nganSlug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Gạc Măng Rê — Mở Ngăn ${nganNumber}`,
          text: `Tôi vừa cùng Gạc Măng Rê mở một Ngăn ${nganNumber}. Cùng mở để mẻ quà quê sớm gom đủ nhé!`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#EFE8DC]/70 border border-[#E7DFD3] text-[#423B36] font-semibold text-xs uppercase tracking-pantryst hover:bg-[#EFE8DC] transition-all flex items-center justify-center gap-2 cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-700" />
          <span>ĐÃ SAO CHÉP LIÊN KẾT</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-[#A65F25]" />
          <span>CHIA SẺ NGĂN</span>
        </>
      )}
    </button>
  );
}
