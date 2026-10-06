'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  QrCode,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  RefreshCw,
  Box,
  Layers
} from 'lucide-react';

export default function MobileFulfillmentScanPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Manual shipment input state
  const [carrier, setCarrier] = useState('MANUAL');
  const [trackingCode, setTrackingCode] = useState('');

  const handleResolve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;

    setErrorMsg(null);
    setActionSuccess(null);
    setIsScanning(true);

    try {
      const res = await fetch('/api/fulfillment/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setScanResult(data);
      } else {
        setErrorMsg(data.error || 'Không tìm thấy đơn hàng hoặc lô hàng.');
        setScanResult(null);
      }
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleExecuteAction = async (action: string) => {
    if (!scanResult) return;
    setErrorMsg(null);
    setActionSuccess(null);

    const target = scanResult.type === 'ORDER'
      ? scanResult.order.id
      : scanResult.batch.batch_code;

    try {
      const res = await fetch('/api/fulfillment/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: target,
          action,
          actor_type: 'WAREHOUSE_STAFF',
          actor_id: 'mobile-staff-01',
          metadata: action === 'MARK_SHIPPED' ? { carrier, tracking_code: trackingCode } : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Thao tác ${action} thành công!`);
        // Refresh target
        handleResolve();
      } else {
        setErrorMsg(data.error || 'Không thể thực hiện thao tác.');
      }
    } catch {
      setErrorMsg('Lỗi thực hiện thao tác.');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-lg mx-auto space-y-6 font-sans">
      {/* Mobile Header */}
      <div className="text-center space-y-2 border-b border-[#E7DFD3] pb-4">
        <span className="px-2.5 py-0.5 rounded-full bg-[#141211] text-[#FAF8F5] text-[10px] font-mono uppercase tracking-pantryst font-bold">
          GMR FULFILLMENT · MOBILE
        </span>
        <h1 className="font-serif text-2xl font-bold text-[#141211]">
          Điều Phối Kho & Quét Mã QR
        </h1>
        <p className="text-xs text-[#665E58]">
          Giao diện tối giản dành cho nhân viên kho & camera điện thoại
        </p>
      </div>

      {/* QUICK SCAN / SEARCH INPUT */}
      <form onSubmit={handleResolve} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Dán token QR hoặc nhập mã đơn / lô..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full pl-10 pr-24 py-3.5 rounded-2xl border border-[#E7DFD3] bg-white text-xs font-semibold focus:outline-[#A65F25] shadow-sm"
          />
          <QrCode className="w-4 h-4 text-[#A65F25] absolute left-3.5 top-4" />
          <button
            type="submit"
            disabled={isScanning}
            className="absolute right-2 top-2 px-3.5 py-1.5 rounded-xl bg-[#141211] text-white text-xs font-semibold hover:bg-[#A65F25] transition"
          >
            {isScanning ? 'Đang đọc...' : 'Tra cứu'}
          </button>
        </div>

        {/* Quick Test Presets */}
        <div className="flex items-center justify-between text-[11px] text-[#665E58] px-1">
          <span>Thử nhanh:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setTokenInput('GM-2026-000073');
              }}
              className="text-[#A65F25] hover:underline"
            >
              Order #073
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setTokenInput('BATCH-003-2026-01');
              }}
              className="text-[#A65F25] hover:underline"
            >
              Batch #003
            </button>
          </div>
        </div>
      </form>

      {/* ERROR OR SUCCESS FEEDBACK */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* RESOLVED RESULT CARD */}
      {scanResult && (
        <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-5 animate-in fade-in duration-200">
          {/* ORDER RESULT */}
          {scanResult.type === 'ORDER' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#A65F25]" />
                  <span className="font-mono text-xs font-bold text-[#A65F25]">
                    {scanResult.order.order_code}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EFE8DC] text-[#141211]">
                  {scanResult.order.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#665E58] uppercase block">Sản phẩm & Số lượng:</span>
                  <strong className="text-[#141211] text-sm">
                    {scanResult.order.product_name} · {scanResult.order.quantity} phần
                  </strong>
                </div>

                {/* Privacy Protected PII */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
                  <span className="text-[10px] text-[#A65F25] font-bold uppercase block tracking-wider">
                    Thông tin nhận hàng (Bảo mật PII):
                  </span>
                  <p className="font-medium text-[#141211]">{scanResult.order.customer_display}</p>
                  <p className="text-[#665E58]">{scanResult.order.address_display}</p>
                </div>
              </div>

              {/* ACTION CHOICES */}
              <div className="space-y-2 pt-2 border-t border-[#E7DFD3]">
                <span className="text-[10px] uppercase font-bold text-[#665E58] block">
                  Chọn thao tác chuyển tiếp:
                </span>

                {scanResult.order.status === 'RECEIVED' && (
                  <button
                    onClick={() => handleExecuteAction('PACK_ORDER')}
                    className="w-full py-3 rounded-xl bg-[#141211] text-white text-xs font-bold hover:bg-[#A65F25] transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>[ 1 ] ĐÓNG GÓI XONG (PACK ORDER)</span>
                  </button>
                )}

                {scanResult.order.status === 'PACKED' && (
                  <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E7DFD3]">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Hãng (Manual/GHN...)"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E7DFD3] text-xs bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Mã vận đơn..."
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E7DFD3] text-xs bg-white"
                      />
                    </div>
                    <button
                      onClick={() => handleExecuteAction('MARK_SHIPPED')}
                      className="w-full py-2.5 rounded-xl bg-[#A65F25] text-white text-xs font-bold hover:bg-[#8C4F1E] transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>[ 2 ] XUẤT KHO VẬN CHUYỂN (SHIP)</span>
                    </button>
                  </div>
                )}

                {scanResult.order.status === 'SHIPPED' && (
                  <button
                    onClick={() => handleExecuteAction('MARK_DELIVERED')}
                    className="w-full py-3 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>[ 3 ] XÁC NHẬN ĐÃ GIAO (DELIVERED + TẶNG ĐIỂM)</span>
                  </button>
                )}

                {scanResult.order.status === 'DELIVERED' && (
                  <div className="text-center p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                    ✓ Đơn hàng đã hoàn tất giao hàng & tích lũy điểm thành viên.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BATCH RESULT */}
          {scanResult.type === 'BATCH' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#A65F25]" />
                  <span className="font-mono text-xs font-bold text-[#A65F25]">
                    {scanResult.batch.batch_code}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EFE8DC] text-[#141211]">
                  {scanResult.batch.status}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p>Nhà sản xuất: <strong>{scanResult.batch.producer_name}</strong></p>
                <p>Ngăn: <strong>{scanResult.batch.ngan_number}</strong></p>
                <p>Số lượng: <strong>{scanResult.batch.received_quantity || 0} / {scanResult.batch.expected_quantity} phần</strong></p>
              </div>

              {scanResult.batch.status !== 'RECEIVED' ? (
                <button
                  onClick={() => handleExecuteAction('RECEIVE_BATCH')}
                  className="w-full py-3 rounded-xl bg-[#141211] text-white text-xs font-bold hover:bg-[#A65F25] transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>XÁC NHẬN NHẬN ĐỦ LÔ ({scanResult.batch.expected_quantity} PHẦN)</span>
                </button>
              ) : (
                <div className="text-center p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                  ✓ Lô hàng đã được nhận tại kho ({scanResult.batch.received_at})
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-4 flex items-center justify-between text-xs text-[#665E58]">
        <Link href="/admin/fulfillment" className="hover:text-[#141211] underline">
          ← Về Dashboard Fulfillment
        </Link>
        <Link href="/producer/fulfillment/prod-003-pao" className="hover:text-[#A65F25] underline">
          Giao diện Producer →
        </Link>
      </div>
    </div>
  );
}
