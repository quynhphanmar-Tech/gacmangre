'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockOrdersStore, mockNgans, mockProducers } from '@/lib/data/mock-data';
import {
  CheckCircle2,
  Package,
  Send,
  Upload,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function ProducerSelfFulfillmentPage() {
  const params = useParams();
  const token = params?.token as string;
  const [orders, setOrders] = useState(mockOrdersStore);
  const [uploadText, setUploadText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const producer = mockProducers.find((p) => p.id === token || p.slug === token) || mockProducers[0];

  const handleMarkShipped = async (orderId: string) => {
    try {
      const res = await fetch(`/api/fulfillment/orders/${orderId}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier: 'PRODUCER_DIRECT',
          tracking_code: `PROD-${Date.now().toString().slice(-4)}`,
          actor_id: producer.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'SHIPPED' } : o))
        );
        setFeedback(`Đã xác nhận gửi đơn ${orderId}!`);
      }
    } catch {
      setFeedback('Lỗi cập nhật.');
    }
  };

  const handleCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadText.trim()) return;

    setIsUploading(true);
    setFeedback(null);
    try {
      const lines = uploadText.split('\n').filter((l) => l.trim().length > 0);
      const res = await fetch('/api/fulfillment/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_name: 'producer_pao_delivery.txt',
          file_type: 'IMAGE',
          producer_id: producer.id,
          raw_lines: lines,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`Đã ghi nhận ${data.job.records.length} dòng dữ liệu vào hàng đợi đối soát!`);
        setUploadText('');
      }
    } catch {
      setFeedback('Lỗi gửi danh sách.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 font-sans">
      {/* Producer Header */}
      <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#E7DFD3] shadow-pantry space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#A65F25] text-white text-[10px] font-mono uppercase tracking-pantryst font-bold">
            PRODUCER SELF-FULFILLMENT
          </span>
          <span className="text-xs text-[#665E58]">GMR Dedicated Link</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#141211]">
          Kênh Giao Hàng Trực Tiếp · {producer.name}
        </h1>
        <p className="text-xs text-[#665E58] leading-relaxed">
          Giao diện dành riêng cho nhà sản xuất tự điều phối giao hàng đến tay người nhận. Anh/chị có thể bấm xác nhận từng đơn hoặc dán danh sách gửi hàng bên dưới.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* METHOD 1 & 2: ORDER LIST + CLICK "ĐÃ GIAO" */}
      <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-3">
          <h2 className="font-serif text-xl font-bold text-[#141211]">
            Danh Sách Đơn Cần Giao ({orders.length} đơn)
          </h2>
          <span className="text-xs text-[#665E58]">Bấm &quot;ĐÃ GIAO&quot; để báo hệ thống</span>
        </div>

        <div className="divide-y divide-[#E7DFD3]">
          {orders.map((o) => (
            <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#A65F25]">{o.order_code}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EFE8DC] font-bold text-[10px]">
                    {o.quantity} phần
                  </span>
                  <span className="text-[#665E58]">({o.status})</span>
                </div>
                <p className="font-medium text-[#141211]">
                  {o.customer?.name || 'Khách hàng'} · {o.customer?.phone || ''}
                </p>
                <p className="text-[#665E58]">{o.customer?.address || 'Địa chỉ ghi nhận'}, {o.customer?.province || 'Toàn quốc'}</p>
              </div>

              <div>
                {o.status === 'SHIPPED' || o.status === 'DELIVERED' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã gửi hàng
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkShipped(o.id)}
                    className="px-4 py-2 rounded-xl bg-[#141211] text-white hover:bg-[#A65F25] transition font-bold text-xs"
                  >
                    BÁO ĐÃ GIAO
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* METHOD 3: UPLOAD / PASTE DELIVERY LIST (CAPTURE LAYER) */}
      <form onSubmit={handleCaptureSubmit} className="p-6 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E7DFD3] pb-3">
          <Upload className="w-4 h-4 text-[#A65F25]" />
          <h2 className="font-serif text-lg font-bold text-[#141211]">
            Cách 3: Dán Nội Dung Danh Sách Giao Hàng (Ảnh/Ghi chú)
          </h2>
        </div>

        <p className="text-xs text-[#665E58]">
          Nếu anh/chị ghi sổ hoặc có ảnh chụp đơn, có thể dán nội dung văn bản vào đây. Hệ thống đối soát GMR sẽ tự động đối chiếu mã đơn.
        </p>

        <textarea
          rows={4}
          placeholder="Ví dụ:&#10;Nguyễn Văn A - 0988112233 - 2 chai - Hà Nội&#10;Trần Thị B - 0912345678 - 1 chai - Ba Đình"
          value={uploadText}
          onChange={(e) => setUploadText(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E7DFD3] text-xs bg-[#FAF8F5] focus:outline-[#A65F25]"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="px-5 py-2 rounded-xl bg-[#A65F25] text-white text-xs font-bold hover:bg-[#8C4F1E] transition"
          >
            {isUploading ? 'Đang gửi...' : 'Gửi Danh Sách Cho GMR'}
          </button>
        </div>
      </form>
    </div>
  );
}
