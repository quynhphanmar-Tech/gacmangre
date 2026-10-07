'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { mockNgans, mockNgan001 } from '@/lib/data/mock-data';

export default function OrderFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // Resolve slug dynamically
  const slug = (typeof params?.slug === 'string' ? params.slug : '') || 'mat-ong-bac-ha-ha-giang';
  const normalized = slug.trim().toLowerCase();

  // Match corresponding Ngăn
  const slugAliases: Record<string, string> = {
    'cacao-oca': 'cacao-len-men-thu-cong-oca',
    'oca': 'cacao-len-men-thu-cong-oca',
    'mat-ong-bac-ha-meo-vac': 'mat-ong-bac-ha-ha-giang',
    'meo-vac': 'mat-ong-bac-ha-ha-giang',
  };
  const targetSlug = slugAliases[normalized] || normalized;
  const currentNgan = mockNgans.find(
    (n) => n.slug.toLowerCase() === targetSlug || n.slug.toLowerCase() === normalized || n.id === slug
  ) || mockNgan001;

  // Form Fields
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zalo, setZalo] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('Hà Nội');
  const [note, setNote] = useState('');

  // UI & Error States
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const hasTrackedStart = useRef(false);

  // Initialize Idempotency Key and track view on mount
  useEffect(() => {
    const key = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `idem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setIdempotencyKey(key);

    trackEvent('order_form_view', {
      ngan_number: currentNgan.number,
      utm_source: searchParams.get('utm_source') || 'direct',
    });
  }, [searchParams, currentNgan.number]);

  // Track user start typing
  const handleFirstInteraction = () => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackEvent('order_form_start', { ngan_number: currentNgan.number });
    }
  };

  const unitPrice = currentNgan.price;
  const totalAmount = unitPrice * quantity;

  const formattedUnitPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(unitPrice);

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double click

    setError(null);

    // Client-side quick check for immediate UX feedback
    if (!name.trim()) {
      setError('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    const cleanPhone = phone.replace(/[\s.-]/g, '');
    if (!/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(cleanPhone)) {
      setError('Số điện thoại không đúng định dạng Việt Nam (10 chữ số).');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setError('Vui lòng nhập địa chỉ nhận hàng chi tiết.');
      return;
    }

    setIsSubmitting(true);
    trackEvent('order_submit', { quantity, ngan_number: currentNgan.number });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          zalo_identifier: zalo.trim() || cleanPhone,
          address: address.trim(),
          province,
          quantity,
          ngan_id: currentNgan.id,
          note: note.trim() || undefined,
          source: searchParams.get('source') || 'DIRECT_WEB',
          utm_source: searchParams.get('utm_source') || undefined,
          utm_medium: searchParams.get('utm_medium') || undefined,
          utm_campaign: searchParams.get('utm_campaign') || undefined,
          utm_content: searchParams.get('utm_content') || undefined,
          landing_url: typeof window !== 'undefined' ? window.location.href : undefined,
          idempotency_key: idempotencyKey,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || 'Có lỗi xảy ra khi đặt ngăn. Vui lòng kiểm tra lại.';
        setError(errorMsg);
        trackEvent('order_error', { error_code: data.error_code, error: errorMsg });
        setIsSubmitting(false);
        return;
      }

      trackEvent('order_success', {
        order_code: data.order_code,
        quantity,
        ngan_number: currentNgan.number,
      });

      // Route directly to Order Confirmation
      router.push(`/order/${data.order_code}`);
    } catch {
      setError('Không thể kết nối đến máy chủ. Dữ liệu của bạn vẫn được giữ nguyên, vui lòng thử gửi lại.');
      trackEvent('order_error', { error: 'NETWORK_FAILURE' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 md:py-20 px-5 sm:px-8 max-w-xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/ngan/${slug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-pantryst text-[#665E58] hover:text-[#141211] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Ngăn {currentNgan.number}</span>
        </Link>
      </div>

      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7DFD3] p-7 sm:p-10 shadow-pantry space-y-8">
        {/* Header with Collective Language */}
        <div className="space-y-2 pb-6 border-b border-[#E7DFD3]">
          <span className="px-3 py-1 rounded-full bg-[#EFE8DC] text-[11px] font-mono font-bold text-[#A65F25]">
            MỞ NGĂN {currentNgan.number}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            {currentNgan.title}
          </h1>
          <p className="text-xs text-[#665E58] font-sans">
            Từ {currentNgan.product?.origin} · Mùa vụ 2026
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#A65F25] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Thông báo</span>
              <p className="leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quantity Selector — Large Mobile Touch Target */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Số phần bạn muốn cùng mở:
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E7DFD3] rounded-2xl overflow-hidden bg-[#FAF8F5]">
                <button
                  type="button"
                  aria-label="Giảm số lượng"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-xl font-bold text-[#423B36] hover:bg-[#EFE8DC] transition active:scale-95"
                >
                  -
                </button>
                <span className="w-14 h-12 flex items-center justify-center font-sans font-bold text-lg text-[#141211]">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Tăng số lượng"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-12 h-12 flex items-center justify-center text-xl font-bold text-[#423B36] hover:bg-[#EFE8DC] transition active:scale-95"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#665E58] font-sans">
                ({formattedUnitPrice} / phần)
              </span>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="customer-name" className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Họ và tên <span className="text-[#A65F25]">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onFocus={handleFirstInteraction}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Thuỳ Chi"
              className="w-full h-12 px-4 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm text-[#141211] focus:outline-none focus:border-[#A65F25] transition"
            />
          </div>

          {/* Phone & Zalo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="customer-phone" className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
                Số điện thoại <span className="text-[#A65F25]">*</span>
              </label>
              <input
                id="customer-phone"
                type="tel"
                inputMode="numeric"
                required
                autoComplete="tel"
                value={phone}
                onFocus={handleFirstInteraction}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0988xxxxxx"
                className="w-full h-12 px-4 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm text-[#141211] focus:outline-none focus:border-[#A65F25] transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="customer-zalo" className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
                Số Zalo nhận tin
              </label>
              <input
                id="customer-zalo"
                type="tel"
                inputMode="numeric"
                value={zalo}
                onFocus={handleFirstInteraction}
                onChange={(e) => setZalo(e.target.value)}
                placeholder="Để trống nếu trùng SĐT"
                className="w-full h-12 px-4 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm text-[#141211] focus:outline-none focus:border-[#A65F25] transition"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <label htmlFor="customer-address" className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Địa chỉ nhận hàng <span className="text-[#A65F25]">*</span>
            </label>
            <input
              id="customer-address"
              type="text"
              required
              autoComplete="street-address"
              value={address}
              onFocus={handleFirstInteraction}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, tên đường, phường/xã..."
              className="w-full h-12 px-4 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm text-[#141211] focus:outline-none focus:border-[#A65F25] transition"
            />
          </div>

          {/* Province */}
          <div className="space-y-2">
            <label htmlFor="customer-province" className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Tỉnh / Thành phố <span className="text-[#A65F25]">*</span>
            </label>
            <select
              id="customer-province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm text-[#141211] focus:outline-none focus:border-[#A65F25] transition"
            >
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Quảng Ninh">Quảng Ninh</option>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="Tỉnh thành khác">Tỉnh thành khác</option>
            </select>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label htmlFor="customer-note" className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Lời nhắn gửi người làm (tuỳ chọn)
            </label>
            <textarea
              id="customer-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Gửi gắm tới ${currentNgan.product?.producer?.name || 'người làm'} hoặc ghi chú nhận hàng...`}
              className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm text-[#141211] focus:outline-none focus:border-[#A65F25] transition"
            />
          </div>

          {/* Policy Callout — Calm reassurance */}
          <div className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#E7DFD3] space-y-1.5 text-xs text-[#423B36] font-sans">
            <div className="flex items-center gap-1.5 font-bold text-[#A65F25]">
              <ShieldCheck className="w-4 h-4" />
              <span>Chưa thu tiền ngay lúc này</span>
            </div>
            <p className="leading-relaxed text-[#665E58]">
              Bạn đang cùng mọi người tạo tín hiệu nhu cầu thật để mở Ngăn. Chúng tôi chỉ thông báo thanh toán và xuất mẻ khi Ngăn gom đủ {currentNgan.moq}/{currentNgan.moq} phần và người làm bắt đầu đóng mẻ tươi.
            </p>
          </div>

          {/* Summary & Value */}
          <div className="pt-4 border-t border-[#E7DFD3] flex items-baseline justify-between font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block">
                Tổng giá trị dự kiến
              </span>
              <span className="text-xs text-[#665E58]">
                {quantity} phần × {formattedUnitPrice}
              </span>
            </div>
            <span className="font-serif text-3xl font-bold text-[#141211]">
              {formattedTotal}
            </span>
          </div>

          {/* Submit Button — Collective Language: CÙNG MỞ NGĂN */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#A65F25] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 text-center flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang ghi nhận...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>CÙNG MỞ NGĂN</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
