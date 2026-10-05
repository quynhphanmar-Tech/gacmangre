'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockNgan001, mockOrdersStore, mockProducer } from '@/lib/data/mock-data';
import { NganStatus, OrderStatus } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import {
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  ExternalLink,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'ngan' | 'producers'>('overview');
  const [nganStatus, setNganStatus] = useState<NganStatus>(mockNgan001.status);
  const [orders, setOrders] = useState(mockOrdersStore);
  const [currentQty, setCurrentQty] = useState(mockNgan001.current_quantity);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const totalRevenue = currentQty * 280000;
  const formattedRevenue = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalRevenue);

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8D8C3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#8C4A2F] text-[#FAF7F2] text-[10px] font-mono uppercase tracking-wider">
              Admin P0
            </span>
            <span className="text-xs text-[#9E7B54]">Golden Sample Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#211D1A] mt-1">
            Quản Trị Vận Hành Gạc Măng Rê
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-[#E8D8C3]/50 p-1 rounded-xl border border-[#D6BFA0]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-[#8C4A2F] text-[#FAF7F2] shadow-sm'
                : 'text-[#5F442A] hover:text-[#211D1A]'
            }`}
          >
            Tổng Quan
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-[#8C4A2F] text-[#FAF7F2] shadow-sm'
                : 'text-[#5F442A] hover:text-[#211D1A]'
            }`}
          >
            Đơn Hàng ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('ngan')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'ngan'
                ? 'bg-[#8C4A2F] text-[#FAF7F2] shadow-sm'
                : 'text-[#5F442A] hover:text-[#211D1A]'
            }`}
          >
            Quản Lý Ngăn
          </button>
          <button
            onClick={() => setActiveTab('producers')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'producers'
                ? 'bg-[#8C4A2F] text-[#FAF7F2] shadow-sm'
                : 'text-[#5F442A] hover:text-[#211D1A]'
            }`}
          >
            Người Làm
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & KPIs (Brief Section 9) */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#9E7B54] font-medium">
                Ngăn Đang Mở
              </span>
              <p className="font-serif text-3xl font-bold text-[#211D1A]">1</p>
              <span className="text-[11px] text-[#7F5E3C]">Ngăn #001 (Mật ong Hà Giang)</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#9E7B54] font-medium">
                Đã Gom Đơn
              </span>
              <p className="font-serif text-3xl font-bold text-[#8C4A2F]">
                {currentQty} / 100
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Đạt {(currentQty / 100) * 100}% MOQ
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#9E7B54] font-medium">
                Doanh Thu Dự Kiến
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#211D1A]">
                {formattedRevenue}
              </p>
              <span className="text-[11px] text-[#7F5E3C]">Thu khi gom đủ ngăn</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#9E7B54] font-medium">
                Time to Full (Ước tính)
              </span>
              <p className="font-serif text-3xl font-bold text-amber-700">~ 4.5 ngày</p>
              <span className="text-[11px] text-[#7F5E3C]">Demand Velocity cao</span>
            </div>
          </div>

          {/* Quick Ngăn #001 Status Card */}
          <div className="p-6 rounded-2xl bg-[#F4ECE1] border border-[#E8D8C3] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-[#8C4A2F]">
                  NGĂN #001
                </span>
                <h3 className="font-serif text-xl font-bold text-[#211D1A]">
                  Mật ong bạc hà hoa dại Hà Giang
                </h3>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#D6BFA0] text-xs font-bold text-[#8C4A2F]">
                Trạng thái: {nganStatus}
              </span>
            </div>

            <ProgressBar current={currentQty} moq={mockNgan001.moq} />

            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/ngan/ngan-001-mat-ong-bac-ha-ha-giang"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#D6BFA0] text-xs font-semibold text-[#5F442A] hover:bg-[#FAF7F2] transition"
              >
                <span>Xem trang công khai</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dat-hang/ngan-001-mat-ong-bac-ha-ha-giang"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C4A2F] text-[#FAF7F2] text-xs font-semibold hover:bg-[#723922] transition"
              >
                <span>Test đặt hàng (Form)</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#211D1A]">
              Danh Sách Đơn Hàng Gom Ngăn
            </h2>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {['ALL', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    filterStatus === status
                      ? 'bg-[#211D1A] text-white'
                      : 'bg-[#F4ECE1] text-[#7F5E3C] hover:bg-[#E8D8C3]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8D8C3] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] border-b border-[#E8D8C3] text-[#7F5E3C] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Mã đơn</th>
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4">SĐT / Zalo</th>
                    <th className="py-3 px-4">Địa chỉ giao</th>
                    <th className="py-3 px-4 text-center">SL</th>
                    <th className="py-3 px-4">Tổng tiền</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D8C3]">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#8C4A2F]">
                        <Link href={`/order/${order.order_code}`} className="hover:underline">
                          {order.order_code}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#211D1A]">
                        {order.customer?.name}
                      </td>
                      <td className="py-3 px-4 text-[#5F442A]">
                        <div>{order.customer?.phone}</div>
                        <div className="text-[10px] text-[#9E7B54]">Zalo: {order.customer?.zalo_identifier}</div>
                      </td>
                      <td className="py-3 px-4 text-[#5F442A] max-w-xs truncate">
                        {order.customer?.address}, {order.customer?.province}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[#211D1A]">
                        {order.quantity}
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-[#211D1A]">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-[#FAF7F2] border border-[#D6BFA0] rounded px-2 py-1 text-[11px]"
                        >
                          <option value="CREATED">CREATED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="FULFILLING">FULFILLING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NGAN MANAGEMENT */}
      {activeTab === 'ngan' && (
        <div className="p-8 rounded-3xl bg-white border border-[#E8D8C3] space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#211D1A]">
            Cập nhật trạng thái Ngăn #001
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#5F442A] block">
                Chuyển đổi trạng thái (State Machine):
              </label>
              <select
                value={nganStatus}
                onChange={(e) => setNganStatus(e.target.value as NganStatus)}
                className="w-full px-4 py-3 rounded-xl border border-[#D6BFA0] bg-[#FAF7F2] text-sm font-semibold"
              >
                <option value="DRAFT">DRAFT (Bản nháp)</option>
                <option value="OPEN">OPEN (Đang mở nhận gom đơn)</option>
                <option value="FULL">FULL (Đã đạt MOQ 100/100)</option>
                <option value="PRODUCER_CONFIRMING">PRODUCER_CONFIRMING (Chờ NSX duyệt)</option>
                <option value="PRODUCTION">PRODUCTION (Đang quay mật / đóng gói)</option>
                <option value="SHIPPING">SHIPPING (Đang xuất kho & giao hàng)</option>
                <option value="COMPLETED">COMPLETED (Hoàn tất mẻ)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#5F442A] block">
                Tăng số lượng gom mô phỏng:
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentQty(Math.max(0, currentQty - 5))}
                  className="px-4 py-2 bg-[#F4ECE1] border border-[#D6BFA0] rounded-xl text-xs font-bold hover:bg-[#E8D8C3]"
                >
                  -5
                </button>
                <span className="font-serif text-xl font-bold text-[#8C4A2F]">
                  {currentQty} / 100
                </span>
                <button
                  onClick={() => {
                    const next = Math.min(100, currentQty + 5);
                    setCurrentQty(next);
                    if (next >= 100) setNganStatus('FULL');
                  }}
                  className="px-4 py-2 bg-[#8C4A2F] text-white rounded-xl text-xs font-bold hover:bg-[#723922]"
                >
                  +5
                </button>
                <button
                  onClick={() => {
                    setCurrentQty(100);
                    setNganStatus('FULL');
                  }}
                  className="px-3 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                >
                  Gom Đủ 100%
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCERS */}
      {activeTab === 'producers' && (
        <div className="p-8 rounded-3xl bg-white border border-[#E8D8C3] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#211D1A]">
                Nhà Sản Xuất: {mockProducer.name}
              </h2>
              <p className="text-xs text-[#8C4A2F] font-semibold">
                {mockProducer.brand_name} · {mockProducer.location}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Đang hợp tác
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3]">
              <span className="text-[#9E7B54] block">Công suất mẻ</span>
              <strong className="text-sm text-[#211D1A]">{mockProducer.capacity} phần / mẻ</strong>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3]">
              <span className="text-[#9E7B54] block">Kênh Zalo thông báo</span>
              <strong className="text-sm text-[#211D1A]">{mockProducer.zalo}</strong>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3]">
              <span className="text-[#9E7B54] block">Thời gian chuẩn bị</span>
              <strong className="text-sm text-[#211D1A]">3–5 ngày sau khi đủ MOQ</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
