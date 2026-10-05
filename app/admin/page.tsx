'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockNgan001, mockOrdersStore } from '@/lib/data/mock-data';
import { NganStatus, OrderStatus, EventItem } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import {
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'events' | 'overview' | 'ngan'>('orders');
  const [nganStatus, setNganStatus] = useState<NganStatus>(mockNgan001.status);
  const [orders, setOrders] = useState(mockOrdersStore);
  const [currentQty, setCurrentQty] = useState(mockNgan001.current_quantity);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // M3 Events state
  const [events, setEvents] = useState<EventItem[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
        setNotifications(data.sent_notifications || []);
      }
    } catch {
      // offline fallback
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
    <div className="py-10 px-5 sm:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7DFD3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#141211] text-[#FAF8F5] text-[10px] font-mono uppercase tracking-pantryst font-bold">
              Admin M3
            </span>
            <span className="text-xs text-[#665E58] font-sans">Order Engine & Automation Events</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#141211] mt-1">
            Quản Trị Vận Hành Gạc Măng Rê
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-[#EFE8DC]/60 p-1 rounded-2xl border border-[#E7DFD3] overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-pantryst transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#141211] text-[#FAF8F5] shadow-sm'
                : 'text-[#423B36] hover:text-[#141211]'
            }`}
          >
            ĐƠN HÀNG ({orders.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('events');
              fetchEvents();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-pantryst transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'bg-[#141211] text-[#FAF8F5] shadow-sm'
                : 'text-[#423B36] hover:text-[#141211]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>SỰ KIỆN ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-pantryst transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#141211] text-[#FAF8F5] shadow-sm'
                : 'text-[#423B36] hover:text-[#141211]'
            }`}
          >
            TIẾN ĐỘ MOQ
          </button>
          <button
            onClick={() => setActiveTab('ngan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-pantryst transition whitespace-nowrap ${
              activeTab === 'ngan'
                ? 'bg-[#141211] text-[#FAF8F5] shadow-sm'
                : 'text-[#423B36] hover:text-[#141211]'
            }`}
          >
            QUẢN LÝ NGĂN
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#141211]">
                Danh Sách Đơn Gom Nhu Cầu
              </h2>
              <p className="text-xs text-[#665E58] font-sans">
                PM Decision: Chưa thu tiền · Trạng thái: <strong>UNPAID</strong>
              </p>
            </div>

            <div className="flex gap-2">
              {['ALL', 'CONFIRMED', 'CREATED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                    filterStatus === status
                      ? 'bg-[#141211] text-white'
                      : 'bg-[#EFE8DC] text-[#423B36] hover:bg-[#E7DFD3]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7DFD3] overflow-hidden shadow-pantry">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#FAF8F5] border-b border-[#E7DFD3] text-[#665E58] uppercase tracking-pantryst font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Mã đơn</th>
                    <th className="py-3.5 px-4">Khách hàng</th>
                    <th className="py-3.5 px-4">SĐT / Zalo</th>
                    <th className="py-3.5 px-4">Ngăn</th>
                    <th className="py-3.5 px-4 text-center">SL</th>
                    <th className="py-3.5 px-4">Tổng tiền</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4">Thời gian</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DFD3]">
                  {filteredOrders.map((order) => {
                    const createdDate = new Date(order.created_at);
                    const formattedDate = !isNaN(createdDate.getTime())
                      ? `${createdDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${createdDate.toLocaleDateString('vi-VN')}`
                      : 'Vừa xong';

                    return (
                      <tr key={order.id} className="hover:bg-[#FAF8F5]/60 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#A65F25]">
                          <Link href={`/order/${order.order_code}`} target="_blank" className="hover:underline flex items-center gap-1">
                            <span>{order.order_code}</span>
                            <ExternalLink className="w-3 h-3 text-[#665E58]" />
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#141211]">
                          <div>{order.customer?.name}</div>
                          <div className="text-[10px] text-[#665E58] font-normal truncate max-w-xs">
                            {order.customer?.address}, {order.customer?.province}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#423B36]">
                          <div>{order.customer?.phone}</div>
                          <div className="text-[10px] text-[#A65F25]">Zalo: {order.customer?.zalo_identifier}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#141211]">
                          {order.ngan?.number || '#001'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#141211]">
                          {order.quantity}
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-[#141211]">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-100 text-zinc-800'
                          }`}>
                            {order.status}
                          </span>
                          <span className="block text-[9px] text-[#665E58] mt-0.5">UNPAID</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#665E58] whitespace-nowrap">
                          {formattedDate}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-[#FAF8F5] border border-[#E7DFD3] rounded-lg px-2 py-1 text-[11px] focus:outline-none"
                          >
                            <option value="CREATED">CREATED</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS & ZALO NOTIFICATIONS (Section 12 of M3 Brief) */}
      {activeTab === 'events' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#141211]">
                Hàng Đợi Sự Kiện & Tự Động Hóa (Events Queue)
              </h2>
              <p className="text-xs text-[#665E58] font-sans">
                Supabase là Source of Truth · Make / Zalo độc lập xử lý bất đồng bộ
              </p>
            </div>

            <button
              onClick={fetchEvents}
              disabled={isLoadingEvents}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE8DC] text-xs font-semibold text-[#423B36] hover:bg-[#E7DFD3] transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEvents ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>

          {/* Events Queue Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7DFD3] overflow-hidden shadow-pantry">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#FAF8F5] border-b border-[#E7DFD3] text-[#665E58] uppercase tracking-pantryst font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Loại sự kiện</th>
                    <th className="py-3.5 px-4">Entity</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4">Retry</th>
                    <th className="py-3.5 px-4">Thời gian tạo</th>
                    <th className="py-3.5 px-4">Lỗi gần nhất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DFD3]">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-[#665E58]">
                        Chưa có sự kiện nào trong hàng đợi.
                      </td>
                    </tr>
                  ) : (
                    events.map((evt) => (
                      <tr key={evt.id} className="hover:bg-[#FAF8F5]/60 transition">
                        <td className="py-3 px-4 font-mono font-bold text-[#A65F25]">
                          {evt.event_type}
                        </td>
                        <td className="py-3 px-4 text-[#141211]">
                          <span className="font-semibold">{evt.entity_type}</span>
                          <span className="block font-mono text-[10px] text-[#665E58] truncate max-w-[120px]">
                            {evt.entity_id}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            evt.status === 'PROCESSED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : evt.status === 'PROCESSING'
                              ? 'bg-blue-100 text-blue-800'
                              : evt.status === 'FAILED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {evt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono">
                          {evt.retry_count}
                        </td>
                        <td className="py-3 px-4 text-[#665E58] whitespace-nowrap">
                          {new Date(evt.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 text-red-700 max-w-xs truncate text-[11px]">
                          {evt.last_error || '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sent Notifications Log */}
          {notifications.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#141211]">
                Nhật Ký Bản Tin Zalo Đã Bắn (Mock/Live)
              </h3>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((noti, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E7DFD3] text-xs font-sans space-y-1">
                    <div className="flex items-center justify-between text-[#665E58]">
                      <span className="font-semibold text-[#A65F25]">Người nhận: {noti.recipient} ({noti.provider})</span>
                      <span>{new Date(noti.sent_at).toLocaleTimeString('vi-VN')}</span>
                    </div>
                    <pre className="p-2.5 rounded-lg bg-[#FAF8F5] text-[#262220] font-sans whitespace-pre-wrap text-[11px] leading-relaxed">
                      {noti.message_content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-1">
              <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] font-medium">
                Ngăn Đang Mở
              </span>
              <p className="font-serif text-3xl font-bold text-[#141211]">1</p>
              <span className="text-[11px] text-[#665E58]">Ngăn #001</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-1">
              <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] font-medium">
                Đã Gom Đơn
              </span>
              <p className="font-serif text-3xl font-bold text-[#A65F25]">
                {currentQty} / 100
              </p>
              <span className="text-[11px] text-emerald-800 font-semibold">
                Đạt {(currentQty / 100) * 100}% MOQ
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-1">
              <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] font-medium">
                Doanh Thu Dự Kiến
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#141211]">
                {formattedRevenue}
              </p>
              <span className="text-[11px] text-[#665E58]">Chưa thu tiền (Demand Signal)</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-1">
              <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] font-medium">
                Time to Full
              </span>
              <p className="font-serif text-3xl font-bold text-[#141211]">~ 4.5 ngày</p>
              <span className="text-[11px] text-[#665E58]">Vận tốc nhu cầu tốt</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#141211]">
              Tiến Độ Mở Ngăn #001 Hiện Tại
            </h3>
            <ProgressBar current={currentQty} moq={mockNgan001.moq} />
          </div>
        </div>
      )}

      {/* TAB 4: NGAN MANAGEMENT */}
      {activeTab === 'ngan' && (
        <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7DFD3] shadow-pantry space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#141211]">
            Điều Khiển Trạng Thái Ngăn #001
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
                Trạng thái Ngăn:
              </label>
              <select
                value={nganStatus}
                onChange={(e) => {
                  const s = e.target.value as NganStatus;
                  setNganStatus(s);
                  mockNgan001.status = s;
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-sm font-semibold text-[#141211]"
              >
                <option value="OPEN">OPEN (Đang mở nhận gom đơn)</option>
                <option value="FULL">FULL (Đã đủ mốc MOQ 100/100)</option>
                <option value="DRAFT">DRAFT (Tạm ẩn / Đang biên tập)</option>
                <option value="EXPIRED">EXPIRED (Hết hạn gom)</option>
                <option value="CANCELLED">CANCELLED (Hủy mẻ)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-pantryst font-semibold text-[#423B36] block">
                Kiểm thử tăng/giảm số lượng gom:
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const next = Math.max(0, currentQty - 5);
                    setCurrentQty(next);
                    mockNgan001.current_quantity = next;
                    if (next < 100) {
                      setNganStatus('OPEN');
                      mockNgan001.status = 'OPEN';
                    }
                  }}
                  className="px-4 py-2 bg-[#EFE8DC] border border-[#E7DFD3] rounded-xl text-xs font-bold hover:bg-[#E7DFD3]"
                >
                  -5
                </button>
                <span className="font-serif text-xl font-bold text-[#A65F25]">
                  {currentQty} / 100
                </span>
                <button
                  onClick={() => {
                    const next = Math.min(100, currentQty + 5);
                    setCurrentQty(next);
                    mockNgan001.current_quantity = next;
                    if (next >= 100) {
                      setNganStatus('FULL');
                      mockNgan001.status = 'FULL';
                    }
                  }}
                  className="px-4 py-2 bg-[#141211] text-white rounded-xl text-xs font-bold hover:bg-[#A65F25]"
                >
                  +5
                </button>
                <button
                  onClick={() => {
                    setCurrentQty(100);
                    mockNgan001.current_quantity = 100;
                    setNganStatus('FULL');
                    mockNgan001.status = 'FULL';
                  }}
                  className="px-3 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900"
                >
                  Gom Đủ 100%
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
