import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByIdOrCode } from '@/services/order-service';
import ProgressBar from '@/components/ProgressBar';
import { CheckCircle2, MessageSquare, ArrowRight, Home } from 'lucide-react';

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { id } = await params;
  const order = await getOrderByIdOrCode(id);

  if (!order) {
    notFound();
  }

  const currentQty = order.ngan?.current_quantity || 74;
  const moq = order.ngan?.moq || 100;

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(order.total_amount);

  return (
    <div className="py-16 md:py-24 px-5 sm:px-8 max-w-2xl mx-auto">
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7DFD3] p-8 sm:p-12 shadow-pantry space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 pb-8 border-b border-[#E7DFD3]">
          <div className="w-14 h-14 rounded-full bg-[#F4F6F2] text-emerald-800 flex items-center justify-center mx-auto mb-2 border border-[#D7E2D3]">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <span className="text-[11px] uppercase tracking-pantryst font-mono font-bold text-[#A65F25]">
            ĐÃ LƯU VÀO CHIẾC TỦ
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141211] leading-tight">
            Bạn đã đặt một ngăn của Việt Nam.
          </h1>

          <div className="pt-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E7DFD3] font-mono text-xs font-bold text-[#141211]">
              Mã đơn: {order.order_code}
            </span>
          </div>
        </div>

        {/* Current MOQ Progress */}
        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-4">
          <div className="flex items-center justify-between text-xs text-[#665E58] font-sans">
            <span className="font-semibold uppercase tracking-pantryst text-[#A65F25]">
              Tiến độ mẻ {order.ngan?.number || '#001'}
            </span>
            <span>Mục tiêu: {moq} người cùng mở</span>
          </div>

          <ProgressBar current={currentQty} moq={moq} />

          <p className="text-xs text-[#423B36] font-serif italic leading-relaxed">
            &ldquo;Hiện ngăn này đã có <strong>{currentQty}/{moq} người cùng mở</strong>. Chúng tôi sẽ cập nhật cho bạn qua Zalo khi ngăn đủ đầy để người làm bắt đầu mẻ mới.&rdquo;
          </p>
        </div>

        {/* Details Table */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#141211]">
            Chi tiết mẻ đặt
          </h3>

          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7DFD3] p-6 space-y-3 text-xs sm:text-sm font-sans">
            <div className="flex justify-between py-1 border-b border-[#E7DFD3]/60">
              <span className="text-[#665E58]">Sản vật</span>
              <span className="font-semibold text-[#141211]">{order.ngan?.title || 'Mật ong bạc hà hoa dại Hà Giang'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7DFD3]/60">
              <span className="text-[#665E58]">Số lượng</span>
              <span className="font-semibold text-[#141211]">{order.quantity} phần</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7DFD3]/60">
              <span className="text-[#665E58]">Tổng dự kiến</span>
              <span className="font-serif font-bold text-base text-[#141211]">{formattedTotal}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7DFD3]/60">
              <span className="text-[#665E58]">Người nhận</span>
              <span className="font-semibold text-[#141211]">{order.customer?.name} ({order.customer?.phone})</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#665E58]">Địa chỉ nhận hàng</span>
              <span className="font-semibold text-[#141211] text-right max-w-xs">{order.customer?.address}, {order.customer?.province}</span>
            </div>
          </div>
        </div>

        {/* Zalo Callout */}
        <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] flex items-start gap-4">
          <div className="w-9 h-9 rounded-full bg-[#EFE8DC] text-[#A65F25] flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#141211] uppercase tracking-pantryst">
              Thông báo hành trình Zalo
            </h4>
            <p className="text-xs text-[#665E58] font-sans leading-relaxed">
              Bạn sẽ nhận được tin nhắn tự động từ <strong>Gạc Măng Rê</strong> xác nhận đơn ngay lập tức, và một thông báo tiếp theo khi Ngăn đủ mốc kèm ngày giao dự kiến.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#141211] text-[#FAF8F5] font-semibold text-xs uppercase tracking-pantryst hover:bg-[#A65F25] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>VỀ CHIẾC TỦ</span>
          </Link>
          <Link
            href="/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#EFE8DC]/60 border border-[#E7DFD3] text-[#423B36] font-semibold text-xs uppercase tracking-pantryst hover:bg-[#EFE8DC] transition-all text-center"
          >
            ĐỌC KÝ SỰ HÀ GIANG
          </Link>
        </div>
      </div>
    </div>
  );
}
