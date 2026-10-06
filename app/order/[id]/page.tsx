import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByIdOrCode } from '@/services/order-service';
import ProgressBar from '@/components/ProgressBar';
import { CheckCircle2, ArrowRight, Home, Share2, Copy } from 'lucide-react';
import ShareButton from './ShareButton';

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
    <div className="py-14 md:py-24 px-5 sm:px-8 max-w-2xl mx-auto">
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7DFD3] p-8 sm:p-12 shadow-pantry space-y-10">
        {/* Header (Section 10 of M2 brief) */}
        <div className="text-center space-y-3 pb-6 border-b border-[#E7DFD3]">
          <div className="w-14 h-14 rounded-full bg-[#F4F6F2] text-emerald-800 flex items-center justify-center mx-auto mb-2 border border-[#D7E2D3]">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <span className="text-[11px] uppercase tracking-pantryst font-mono font-bold text-[#A65F25]">
            XÁC NHẬN GHI NHẬN ĐƠN
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141211] leading-tight">
            BẠN VỪA CÙNG MỞ MỘT NGĂN
          </h1>

          <p className="text-xs text-[#665E58] font-sans">
            Bạn đã cùng những người khác mở Ngăn này.
          </p>
        </div>

        {/* Structured Spec Info (Mã Ngăn, Mã đơn, Số lượng, Tổng) */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7DFD3] p-6 space-y-3 text-xs sm:text-sm font-sans">
          <div className="flex justify-between py-1.5 border-b border-[#E7DFD3]/60">
            <span className="text-[#665E58]">Mã Ngăn</span>
            <span className="font-mono font-bold text-[#141211]">{order.ngan?.number || '#001'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#E7DFD3]/60">
            <span className="text-[#665E58]">Mã đơn</span>
            <span className="font-mono font-bold text-[#A65F25]">{order.order_code}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#E7DFD3]/60">
            <span className="text-[#665E58]">Số lượng</span>
            <span className="font-semibold text-[#141211]">{order.quantity} phần</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[#665E58]">Tổng</span>
            <span className="font-serif font-bold text-base text-[#141211]">{formattedTotal}</span>
          </div>
        </div>

        {/* Tiến trình mở Ngăn */}
        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-4">
          <div className="flex items-center justify-between text-xs text-[#665E58] font-sans">
            <span className="font-semibold uppercase tracking-pantryst text-[#A65F25]">
              Tiến trình mở Ngăn
            </span>
            <span>Mục tiêu: {moq} phần</span>
          </div>

          <ProgressBar current={currentQty} moq={moq} />

          {/* Explanation Quote from Brief */}
          <div className="p-4 rounded-xl bg-white border border-[#E7DFD3] text-xs text-[#423B36] font-serif italic leading-relaxed">
            &ldquo;Bạn đã cùng những người khác mở Ngăn này. Khi đủ số lượng, Gạc Măng Rê sẽ xác nhận với người làm và thông báo bước tiếp theo.&rdquo;
          </div>
        </div>

        {/* Trạng thái vận hành & Giao hàng (M4 Fulfillment Timeline) */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7DFD3] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-pantryst font-mono font-bold text-[#A65F25]">
              HÀNH TRÌNH SẢN VẬT
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E7DFD3] font-mono text-[#5C5248]">
              {order.status === 'DELIVERED'
                ? 'Đã giao thành công'
                : order.status === 'SHIPPED'
                ? 'Đang vận chuyển'
                : 'Đã ghi nhận nhu cầu'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs font-sans">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-[#141211] text-white flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <span className="text-[11px] font-semibold text-[#141211]">Ghi nhận</span>
              <span className="text-[9px] text-[#8C827A]">Đã mở Ngăn</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status)
                  ? 'bg-[#141211] text-white'
                  : 'bg-[#E7DFD3] text-[#8C827A]'
              }`}>
                2
              </div>
              <span className="text-[11px] font-semibold text-[#141211]">Chuẩn bị</span>
              <span className="text-[9px] text-[#8C827A]">Tại nguồn</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                ['SHIPPED', 'DELIVERED'].includes(order.status)
                  ? 'bg-[#141211] text-white'
                  : 'bg-[#E7DFD3] text-[#8C827A]'
              }`}>
                3
              </div>
              <span className="text-[11px] font-semibold text-[#141211]">Đang giao</span>
              <span className="text-[9px] text-[#8C827A]">Vận chuyển</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                order.status === 'DELIVERED'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#E7DFD3] text-[#8C827A]'
              }`}>
                4
              </div>
              <span className="text-[11px] font-semibold text-[#141211]">Đã nhận</span>
              <span className="text-[9px] text-[#8C827A]">+ Điểm tích lũy</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: XEM NGĂN & CHIA SẺ NGĂN */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/ngan/${order.ngan?.slug || 'ngan-001-mat-ong-bac-ha-ha-giang'}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#141211] text-[#FAF8F5] font-semibold text-xs uppercase tracking-pantryst hover:bg-[#A65F25] transition-all flex items-center justify-center gap-2 text-center"
          >
            <span>XEM NGĂN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <ShareButton
            orderCode={order.order_code}
            nganNumber={order.ngan?.number || '#001'}
            nganSlug={order.ngan?.slug || 'ngan-001-mat-ong-bac-ha-ha-giang'}
          />
        </div>
      </div>
    </div>
  );
}
