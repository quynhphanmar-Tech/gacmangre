'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function OrderFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zalo, setZalo] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('Hà Nội');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const unitPrice = 280000;
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
    setError(null);

    if (!name.trim()) {
      setError('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại liên lạc.');
      return;
    }

    if (!address.trim()) {
      setError('Vui lòng cung cấp địa chỉ nhận hàng chi tiết.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            zalo_identifier: zalo || phone,
            address,
            province,
            quantity,
            ngan_id: 'c3333333-3333-3333-3333-333333333333',
            note,
            utm_source: searchParams.get('utm_source') || 'web',
            utm_medium: searchParams.get('utm_medium') || undefined,
            utm_campaign: searchParams.get('utm_campaign') || undefined,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          setError(data.error || 'Có lỗi xảy ra trong quá trình đặt ngăn.');
          return;
        }

        router.push(`/order/${data.order.order_code}`);
      } catch (err: unknown) {
        setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      }
    });
  };

  return (
    <div className="py-12 md:py-20 px-5 sm:px-8 max-w-xl mx-auto">
      <div className="mb-8">
        <Link
          href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-pantryst text-[#665E58] hover:text-[#141211] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Ngăn #001</span>
        </Link>
      </div>

      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7DFD3] p-7 sm:p-10 shadow-pantry space-y-8">
        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-[#E7DFD3]">
          <span className="px-3 py-1 rounded-full bg-[#EFE8DC] text-[11px] font-mono font-bold text-[#A65F25]">
            MỞ NGĂN #001
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
            Mật ong bạc hà hoa dại Hà Giang
          </h1>
          <p className="text-xs text-[#665E58] font-sans">
            Mẻ thu hái thủ công từ Mèo Vạc · Mùa đông 2026
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Số lượng phần cùng mở:
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E7DFD3] rounded-xl overflow-hidden bg-[#FAF8F5]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-base font-bold text-[#423B36] hover:bg-[#EFE8DC] transition"
                >
                  -
                </button>
                <span className="px-5 py-2.5 font-sans font-bold text-base text-[#141211] min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-4 py-2.5 text-base font-bold text-[#423B36] hover:bg-[#EFE8DC] transition"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#665E58] font-sans">
                ({formattedUnitPrice} / phần 500ml)
              </span>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Họ và tên <span className="text-[#A65F25]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Thuỳ Chi"
              className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm focus:outline-none focus:border-[#A65F25]"
            />
          </div>

          {/* Phone & Zalo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
                Số điện thoại <span className="text-[#A65F25]">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0988xxxxxx"
                className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm focus:outline-none focus:border-[#A65F25]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
                Số Zalo nhận tin
              </label>
              <input
                type="tel"
                value={zalo}
                onChange={(e) => setZalo(e.target.value)}
                placeholder="Để trống nếu trùng SĐT"
                className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm focus:outline-none focus:border-[#A65F25]"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Địa chỉ nhận hàng <span className="text-[#A65F25]">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, tên đường, phường/xã..."
              className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm focus:outline-none focus:border-[#A65F25]"
            />
          </div>

          {/* Province */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Tỉnh / Thành phố <span className="text-[#A65F25]">*</span>
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm focus:outline-none focus:border-[#A65F25]"
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
            <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
              Lời nhắn gửi người làm (tuỳ chọn)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Gửi gắm tới anh Giàng A Páo hoặc ghi chú nhận hàng..."
              className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm focus:outline-none focus:border-[#A65F25]"
            />
          </div>

          {/* Policy Callout */}
          <div className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#E7DFD3] space-y-1.5 text-xs text-[#423B36] font-sans">
            <div className="flex items-center gap-1.5 font-bold text-[#A65F25]">
              <ShieldCheck className="w-4 h-4" />
              <span>Chính sách thanh toán khi đủ ngăn</span>
            </div>
            <p className="leading-relaxed text-[#665E58]">
              Bạn không cần thanh toán ngay. Chúng tôi chỉ thông báo thanh toán và xuất mẻ khi Ngăn đạt đủ 100 người cùng mở và người làm bắt đầu đóng mẻ tươi.
            </p>
          </div>

          {/* Summary */}
          <div className="pt-4 border-t border-[#E7DFD3] flex items-baseline justify-between font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block">
                Tổng thanh toán dự kiến
              </span>
              <span className="text-xs text-[#665E58]">
                {quantity} phần × {formattedUnitPrice}
              </span>
            </div>
            <span className="font-serif text-3xl font-bold text-[#141211]">
              {formattedTotal}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 px-6 rounded-full bg-[#141211] text-[#FAF8F5] text-xs uppercase tracking-pantryst font-bold hover:bg-[#A65F25] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 text-center flex items-center justify-center gap-2"
          >
            <span>{isPending ? 'Đang gửi thông tin...' : 'XÁC NHẬN MỞ NGĂN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
