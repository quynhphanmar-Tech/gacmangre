'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

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
    <div className="py-12 md:py-16 px-4 sm:px-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#9E7B54] hover:text-[#8C4A2F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Ngăn #001</span>
        </Link>
      </div>

      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8D8C3] p-6 sm:p-10 shadow-xl space-y-8">
        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-[#E8D8C3]">
          <span className="px-3 py-1 rounded-full bg-[#E8D8C3] text-xs font-mono font-bold text-[#8C4A2F]">
            ĐẶT NGĂN #001
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#211D1A]">
            Mật ong bạc hà hoa dại Hà Giang
          </h1>
          <p className="text-xs text-[#7F5E3C]">
            Được chắt lọc thủ công từ cao nguyên đá Mèo Vạc · Mùa 2026
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quantity selector */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#5F442A] block">
              Số lượng phần muốn đặt:
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#D6BFA0] rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-lg font-bold text-[#5F442A] hover:bg-[#F4ECE1] transition"
                >
                  -
                </button>
                <span className="px-5 py-2.5 font-serif font-bold text-lg text-[#211D1A] min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-4 py-2.5 text-lg font-bold text-[#5F442A] hover:bg-[#F4ECE1] transition"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#7F5E3C]">
                ({formattedUnitPrice} / phần)
              </span>
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#5F442A] block">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Thuỳ Chi"
              className="w-full px-4 py-3 rounded-xl border border-[#D6BFA0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/50"
            />
          </div>

          {/* Phone & Zalo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#5F442A] block">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0988xxxxxx"
                className="w-full px-4 py-3 rounded-xl border border-[#D6BFA0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#5F442A] block">
                Số Zalo nhận tin
              </label>
              <input
                type="tel"
                value={zalo}
                onChange={(e) => setZalo(e.target.value)}
                placeholder="Để trống nếu trùng SĐT"
                className="w-full px-4 py-3 rounded-xl border border-[#D6BFA0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/50"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#5F442A] block">
              Địa chỉ nhận hàng chi tiết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, tên đường, phường/xã..."
              className="w-full px-4 py-3 rounded-xl border border-[#D6BFA0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/50"
            />
          </div>

          {/* Province */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#5F442A] block">
              Tỉnh / Thành phố <span className="text-red-500">*</span>
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#D6BFA0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/50"
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
            <label className="text-xs uppercase tracking-wider font-semibold text-[#5F442A] block">
              Ghi chú cho Gạc Măng Rê (tuỳ chọn)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Lời nhắn gửi tới người làm mật hoặc thời gian nhận hàng thuận tiện..."
              className="w-full px-4 py-3 rounded-xl border border-[#D6BFA0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/50"
            />
          </div>

          {/* Payment Terms Callout */}
          <div className="p-4 rounded-2xl bg-[#F4ECE1] border border-[#E8D8C3] space-y-2 text-xs text-[#5F442A]">
            <div className="flex items-center gap-1.5 font-bold text-[#8C4A2F]">
              <ShieldCheck className="w-4 h-4" />
              <span>Chính sách thanh toán khi đủ ngăn</span>
            </div>
            <p className="leading-relaxed">
              Bạn không cần chuyển tiền ngay lúc này. Chúng tôi chỉ liên hệ thông báo thanh toán và xuất mẻ khi Ngăn gom đủ 100/100 phần và người làm bắt đầu đóng mẻ tươi.
            </p>
          </div>

          {/* Order Summary */}
          <div className="pt-4 border-t border-[#E8D8C3] flex items-baseline justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#9E7B54] block">
                Tổng giá trị mẻ đặt
              </span>
              <span className="text-xs text-[#7F5E3C]">
                {quantity} phần × {formattedUnitPrice}
              </span>
            </div>
            <span className="font-serif text-3xl font-bold text-[#211D1A]">
              {formattedTotal}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 px-6 rounded-full bg-[#8C4A2F] text-[#FAF7F2] text-sm uppercase tracking-widest font-bold hover:bg-[#723922] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 text-center"
          >
            {isPending ? 'Đang gửi thông tin...' : 'XÁC NHẬN ĐẶT NGĂN'}
          </button>
        </form>
      </div>
    </div>
  );
}
