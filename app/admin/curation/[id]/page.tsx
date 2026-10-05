'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SourceProfile, CurationStatus } from '@/types';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Save
} from 'lucide-react';

export default function AdminCurationDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [source, setSource] = useState<SourceProfile | null>(null);
  const [status, setStatus] = useState<CurationStatus>('REVIEWING');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/sources/${id}`);
        const data = await res.json();
        if (data.success) {
          setSource(data.source);
          setStatus(data.source.status);
          setNotes(data.source.scorecard.evaluation_summary || '');
        }
      } catch {
        // fallback
      }
    }
    if (id) load();
  }, [id]);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/admin/sources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSource(data.source);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!source) {
    return (
      <div className="py-20 text-center text-xs text-[#665E58]">
        Đang tải bảng thẩm định...
      </div>
    );
  }

  const sc = source.scorecard;
  const fitScore = sc.gmr_fit_score.toFixed(1);

  const scoreDimensions = [
    { label: '1. ORIGIN (Thổ Nhưỡng / Vùng Đất)', val: sc.origin, weight: '15%' },
    { label: '2. HUMAN (Con Người Làm Nghề)', val: sc.human, weight: '15%' },
    { label: '3. CRAFT (Tay Nghề & Kỹ Thuật)', val: sc.craft, weight: '15%' },
    { label: '4. DISTINCTIVENESS (Tính Độc Bản)', val: sc.distinctiveness, weight: '10%' },
    { label: '5. STORY POTENTIAL (Tiềm Năng Câu Chuyện)', val: sc.story_potential, weight: '15%' },
    { label: '6. PROOF (Căn Cứ Xác Thực / Bằng Chứng)', val: sc.proof, weight: '10%' },
    { label: '7. PRODUCT QUALITY SIGNAL (Phẩm Vị)', val: sc.product_quality_signal, weight: '5%' },
    { label: '8. COMMERCIAL READINESS (Sẵn Sàng Thương Mại)', val: sc.commercial_readiness, weight: '10%' },
    { label: '9. SUPPLY RELIABILITY (Độ Tin Cậy Cung Ứng)', val: sc.supply_reliability, weight: '5%' },
  ];

  return (
    <div className="py-10 px-5 sm:px-8 max-w-5xl mx-auto space-y-8 font-sans">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E7DFD3]">
        <Link
          href="/admin/sources"
          className="text-xs font-semibold text-[#665E58] hover:text-[#141211] inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Kho Nguồn</span>
        </Link>
        <Link
          href={`/admin/sources/${source.id}`}
          className="text-xs font-semibold text-[#A65F25] hover:underline"
        >
          Xem Hồ Sơ Nguồn Chi Tiết
        </Link>
      </div>

      {/* Main Scorecard Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#141211] to-[#2E2824] text-white shadow-xl space-y-6 border border-[#3E3834]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#A65F25] text-white text-[10px] font-mono uppercase tracking-pantryst font-bold">
                GMR SCORECARD
              </span>
              <span className="text-xs text-[#C5BCB3]">{source.category}</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#FAF8F5]">
              {source.product_name}
            </h1>
            <p className="text-xs text-[#A89F95]">
              Đánh giá theo Tiêu Chuẩn Tuyển Chọn GMR (Thang điểm 9 chiều độc lập)
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#1F1B19] p-4 rounded-2xl border border-[#3D3733]">
            <div>
              <span className="text-[10px] uppercase tracking-pantryst text-[#A89F95] block font-semibold">
                GMR Fit Score
              </span>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-amber-400">
                {fitScore}
                <span className="text-xs text-[#A89F95]"> / 10</span>
              </p>
            </div>
            <div className="border-l border-[#3D3733] pl-4">
              <span className="text-[10px] uppercase tracking-pantryst text-[#A89F95] block font-semibold">
                Phân Loại
              </span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {source.status}
              </span>
            </div>
          </div>
        </div>

        {/* 9 Dimensions Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#3E3834]">
          {scoreDimensions.map((d, idx) => (
            <div key={idx} className="bg-[#1C1917] p-3 rounded-xl border border-[#2D2825] space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#A89F95] line-clamp-1">{d.label}</span>
                <span className="font-bold text-amber-300">{d.val}/10</span>
              </div>
              <div className="w-full bg-[#2E2824] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#A65F25] h-full rounded-full transition-all"
                  style={{ width: `${(d.val / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STORY ARCHITECT SECTION (NẾU ĐẠT READY HOẶC CÓ STORY BRIEF) */}
      {source.story_brief && (
        <div className="p-8 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A65F25]" />
              <h2 className="font-serif text-2xl font-bold text-[#141211]">
                Bản Thảo Cốt Truyện (Story Architect)
              </h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#EFE8DC] text-[#665E58]">
              Chuỗi chuyển hóa 6 bước
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
              <span className="font-bold text-[#A65F25] uppercase tracking-pantryst text-[10px] block">
                1. FACT (Sự Thật Gốc Rễ)
              </span>
              <p className="text-[#141211] font-medium leading-relaxed">{source.story_brief.fact}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
              <span className="font-bold text-[#A65F25] uppercase tracking-pantryst text-[10px] block">
                2. DETAIL (Chi Tiết Đắt Giá)
              </span>
              <p className="text-[#141211] font-medium leading-relaxed">{source.story_brief.detail}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
              <span className="font-bold text-[#A65F25] uppercase tracking-pantryst text-[10px] block">
                3. HUMAN (Con Người & Bàn Tay Làm Nghề)
              </span>
              <p className="text-[#141211] font-medium leading-relaxed">{source.story_brief.human}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
              <span className="font-bold text-[#A65F25] uppercase tracking-pantryst text-[10px] block">
                4. MEANING (Ý Nghĩa Văn Hóa & Triết Lý)
              </span>
              <p className="text-[#141211] font-medium leading-relaxed">{source.story_brief.meaning}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
              <span className="font-bold text-[#A65F25] uppercase tracking-pantryst text-[10px] block">
                5. PRODUCT (Sản Vật Kết Tinh)
              </span>
              <p className="text-[#141211] font-medium leading-relaxed">{source.story_brief.product}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
              <span className="font-bold text-[#A65F25] uppercase tracking-pantryst text-[10px] block">
                6. OPEN THE NGĂN (Lời Mời Cùng Mở Chiếc Tủ)
              </span>
              <p className="text-[#141211] font-medium leading-relaxed">{source.story_brief.open_ngan_call}</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900 uppercase tracking-pantryst text-[10px] block">
                Tách Biệt: Editorial Interpretation (Suy Luận Biên Tập Cần Human Phê Duyệt)
              </span>
              <p className="text-amber-950 italic leading-relaxed">{source.story_brief.editorial_interpretation}</p>
            </div>
          </div>

          {source.ngan_slug && (
            <div className="pt-4 border-t border-[#E7DFD3] flex items-center justify-between">
              <span className="text-xs text-[#665E58]">
                Đã liên kết Ngăn tương ứng: <strong>/ngan/{source.ngan_slug}</strong>
              </span>
              <Link
                href={`/ngan/${source.ngan_slug}`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-[#141211] text-white text-xs font-semibold hover:bg-[#A65F25] transition inline-flex items-center gap-1.5"
              >
                <span>Xem Ngăn Mở Thực Tế</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* HUMAN REVIEW & STATUS DECISION */}
      <div className="p-8 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#141211]">
              Phê Duyệt Thẩm Định (Human Decision)
            </h3>
            <p className="text-xs text-[#665E58]">
              AI không tự động xuất bản (No auto-publish). Quyết định cuối cùng thuộc về người phụ trách tuyển chọn.
            </p>
          </div>
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Đã lưu quyết định thành công!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-pantryst font-bold text-[#423B36] block">
              Trạng Thái Thẩm Định:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CurationStatus)}
              className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-xs font-bold text-[#141211]"
            >
              <option value="READY">READY (Đủ điều kiện dựng Ngăn mở gom đơn)</option>
              <option value="DEVELOP">DEVELOP (Có tiềm năng nhưng thiếu dữ liệu / cần Producer Request)</option>
              <option value="NEEDS_INPUT">NEEDS_INPUT (Thiếu thông tin liên hệ / giá sơ khai)</option>
              <option value="REVIEWING">REVIEWING (Đang trong quá trình thẩm định chi tiết)</option>
              <option value="NOT_FIT">NOT_FIT (Không phù hợp tiêu chuẩn Gạc Măng Rê)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-pantryst font-bold text-[#423B36] block">
              Ghi Chú Quyết Định (Curation Summary):
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-xs text-[#141211]"
              placeholder="Nhập lý do phê duyệt, điểm mạnh hoặc lưu ý cần kiểm tra thực địa..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleUpdateStatus}
            disabled={isUpdating}
            className="px-6 py-2.5 rounded-xl bg-[#141211] text-white text-xs font-semibold hover:bg-[#A65F25] transition inline-flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isUpdating ? 'Đang lưu...' : 'Lưu Quyết Định Thẩm Định'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
