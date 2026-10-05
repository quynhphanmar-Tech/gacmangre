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
  const remaining = Math.max(0, moq - currentQty);

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(order.total_amount);

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="bg-[#FAF7F2] rounded-3xl border-2 border-[#D6BFA0] p-8 sm:p-12 shadow-2xl space-y-10">
        {/* Success Header */}
        <div className="text-center space-y-4 pb-8 border-b border-[#E8D8C3]">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4A2F]">
            Đã Tiếp Nhận Thành Công
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#211D1A]">
            Bạn đã đặt một ngăn của Việt Nam.
          </h1>

          <div className="pt-2">
            <span className="inline-block px-4 py-2 rounded-xl bg-[#F4ECE1] border border-[#D6BFA0] font-mono text-sm font-bold text-[#8C4A2F]">
              Mã đơn: {order.order_code}
            </span>
          </div>
        </div>

        {/* Current MOQ Progress */}
        <div className="p-6 rounded-2xl bg-[#F4ECE1] border border-[#E8D8C3] space-y-4">
          <div className="flex items-center justify-between text-xs text-[#7F5E3C]">
            <span className="font-semibold uppercase tracking-wider text-[#8C4A2F]">
              Trạng thái gom mẻ {order.ngan?.number || '#001'}
            </span>
            <span>Mục tiêu: {moq} phần</span>
          </div>

          <ProgressBar current={currentQty} moq={moq} />

          <p className="text-xs text-[#5F442A] italic">
            &ldquo;Hiện ngăn này đã có <strong>{currentQty}/{moq} phần</strong>. Chúng tôi sẽ cập nhật cho bạn qua Zalo khi ngăn đủ đầy để người làm bắt đầu mẻ mới.&rdquo;
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#211D1A]">
            Thông tin chi tiết
          </h3>

          <div className="bg-white rounded-2xl border border-[#E8D8C3] p-6 space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-[#F4ECE1]">
              <span className="text-[#9E7B54]">Sản vật</span>
              <span className="font-semibold text-[#211D1A]">{order.ngan?.title || 'Mật ong bạc hà hoa dại Hà Giang'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F4ECE1]">
              <span className="text-[#9E7B54]">Số lượng</span>
              <span className="font-semibold text-[#211D1A]">{order.quantity} phần</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F4ECE1]">
              <span className="text-[#9E7B54]">Tổng thanh toán</span>
              <span className="font-serif font-bold text-lg text-[#8C4A2F]">{formattedTotal}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F4ECE1]">
              <span className="text-[#9E7B54]">Người nhận</span>
              <span className="font-semibold text-[#211D1A]">{order.customer?.name} ({order.customer?.phone})</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#9E7B54]">Địa chỉ giao</span>
              <span className="font-semibold text-[#211D1A] text-right max-w-xs">{order.customer?.address}, {order.customer?.province}</span>
            </div>
          </div>
        </div>

        {/* Zalo OA Notification Box */}
        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#D6BFA0] flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#8C4A2F]/10 text-[#8C4A2F] flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#211D1A]">
              Kênh thông báo Zalo Official Account
            </h4>
            <p className="text-xs text-[#7F5E3C] leading-relaxed">
              Bạn sẽ nhận được tin nhắn tự động từ <strong>Gạc Măng Rê</strong> xác nhận đơn ngay lập tức, và một thông báo tiếp theo khi Ngăn đạt mốc 100/100 kèm ngày giao dự kiến.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#211D1A] text-[#FAF7F2] font-semibold text-xs uppercase tracking-widest hover:bg-[#8C4A2F] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Trở Về Trang Chủ</span>
          </Link>
          <Link
            href="/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E8D8C3]/60 border border-[#D6BFA0] text-[#5F442A] font-semibold text-xs uppercase tracking-wider hover:bg-[#E8D8C3] transition-all text-center"
          >
            Đọc Ký Sự Hà Giang
          </Link>
        </div>
      </div>
    </div>
  );
}
