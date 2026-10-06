'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  Truck,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Clock,
  Award
} from 'lucide-react';
import { generateQrToken } from '@/lib/crypto/qr-token';
import { mockOrdersStore } from '@/lib/data/mock-data';

export default function AdminFulfillmentDashboardPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>(mockOrdersStore);
  const [scanEvents, setScanEvents] = useState<any[]>([]);
  const [pointEntries, setPointEntries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'batches' | 'orders' | 'scans' | 'points'>('batches');
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [selectedNgan, setSelectedNgan] = useState('ngan-live-003');

  const fetchFulfillmentData = async () => {
    try {
      const bRes = await fetch('/api/fulfillment/batches');
      const bData = await bRes.json();
      if (bData.success) setBatches(bData.batches);
    } catch {}
  };

  useEffect(() => {
    fetchFulfillmentData();
  }, []);

  const handleCreateBatch = async () => {
    try {
      const res = await fetch('/api/fulfillment/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngan_id: selectedNgan, notes: 'Tạo lô mới từ Admin' }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingBatch(false);
        fetchFulfillmentData();
      }
    } catch {}
  };

  return (
    <div className="py-10 px-5 sm:px-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7DFD3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#141211] text-[#FAF8F5] text-[10px] font-mono uppercase tracking-pantryst font-bold">
              M4 FULFILLMENT
            </span>
            <span className="text-xs text-[#665E58]">Batch Management · QR Engine · CRM Bridge</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#141211] mt-1">
            Quản Trị Fulfillment & Giao Hàng
          </h1>
          <p className="text-xs text-[#665E58] mt-1">
            Điều phối mẻ hàng từ nhà sản xuất → nhập kho GMR → xuất giao lẻ hoặc hỗ trợ nhà sản xuất tự giao.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/fulfillment"
            className="px-4 py-2 rounded-xl bg-[#A65F25] text-white text-xs font-semibold hover:bg-[#8C4F1E] transition inline-flex items-center gap-1.5 shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Mở Giao Diện Scan Mobile</span>
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl border border-[#E7DFD3] text-xs font-semibold text-[#423B36] hover:bg-[#EFE8DC] transition"
          >
            Về Dashboard
          </Link>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center bg-[#EFE8DC]/60 p-1 rounded-2xl border border-[#E7DFD3] overflow-x-auto">
        <button
          onClick={() => setActiveTab('batches')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-pantryst transition whitespace-nowrap ${
            activeTab === 'batches' ? 'bg-[#141211] text-[#FAF8F5] shadow-sm' : 'text-[#423B36]'
          }`}
        >
          LÔ HÀNG BATCH ({batches.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-pantryst transition whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-[#141211] text-[#FAF8F5] shadow-sm' : 'text-[#423B36]'
          }`}
        >
          ĐƠN FULFILLMENT ({orders.length})
        </button>
      </div>

      {/* TAB 1: BATCHES */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#141211]">
              Danh Sách Lô Hàng Gom (Batches)
            </h2>
            <button
              onClick={() => setIsCreatingBatch(!isCreatingBatch)}
              className="px-3.5 py-1.5 rounded-xl bg-[#141211] text-white text-xs font-semibold hover:bg-[#A65F25] transition inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tạo Lô Hàng Mới</span>
            </button>
          </div>

          {isCreatingBatch && (
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-3">
              <span className="text-xs font-bold text-[#141211] block">Chọn Ngăn để gom lô:</span>
              <div className="flex gap-3">
                <select
                  value={selectedNgan}
                  onChange={(e) => setSelectedNgan(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#E7DFD3] text-xs bg-white font-semibold"
                >
                  <option value="ngan-live-001">Ngăn #001 · Cacao OCA</option>
                  <option value="ngan-live-002">Ngăn #002 · Cà phê Aeroco</option>
                  <option value="ngan-live-003">Ngăn #003 · Mật ong Hà Giang</option>
                </select>
                <button
                  onClick={handleCreateBatch}
                  className="px-4 py-2 rounded-xl bg-[#A65F25] text-white text-xs font-bold hover:bg-[#8C4F1E]"
                >
                  Xác Nhận Tạo Lô
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {batches.map((b) => (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-4 text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#A65F25]" />
                    <strong className="font-mono text-sm text-[#141211]">{b.batch_code}</strong>
                    <span className="px-2 py-0.5 rounded-full bg-[#EFE8DC] text-[10px] font-bold">
                      {b.ngan_number}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-[#665E58] block">Người sản xuất:</span>
                    <strong>{b.producer_name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#665E58] block">Số lượng mẻ:</span>
                    <strong>{b.received_quantity} / {b.expected_quantity} phần</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#665E58] block">Ngày nhận lô:</span>
                    <span className="font-mono">{b.received_at || 'Đang chờ nhận'}</span>
                  </div>
                </div>

                {b.notes && (
                  <p className="text-[#665E58] italic bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E7DFD3]">
                    Ghi chú: {b.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#141211]">
            Trạng Thái Từng Đơn Hàng
          </h2>

          <div className="divide-y divide-[#E7DFD3] text-xs">
            {orders.map((o) => (
              <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#A65F25]">{o.order_code}</span>
                    <span className="font-medium text-[#141211]">{o.customer.name}</span>
                    <span className="text-[#665E58]">({o.customer.phone})</span>
                  </div>
                  <p className="text-[#665E58]">{o.quantity} phần · {o.customer.address}, {o.customer.province}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-[#EFE8DC] font-bold text-[10px]">
                    {o.status}
                  </span>
                  <Link
                    href={`/order/${o.order_code}`}
                    target="_blank"
                    className="p-1.5 rounded-lg border border-[#E7DFD3] hover:bg-[#FAF8F5]"
                    title="Xem trang khách hàng"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
