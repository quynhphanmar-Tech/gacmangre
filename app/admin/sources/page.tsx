'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SourceProfile, CurationStatus } from '@/types';
import {
  Compass,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Filter,
  FileText
} from 'lucide-react';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<SourceProfile[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newProducer, setNewProducer] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/admin/sources');
      const data = await res.json();
      if (data.success) {
        setSources(data.sources);
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl && !newNotes && !newProducer) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl,
          notes: newNotes,
          producer_name: newProducer,
          category: newCategory,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewUrl('');
        setNewNotes('');
        setNewProducer('');
        setNewCategory('');
        setIsCreating(false);
        fetchSources();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSources = statusFilter === 'ALL'
    ? sources
    : sources.filter((s) => s.status === statusFilter);

  return (
    <div className="py-10 px-5 sm:px-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7DFD3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#141211] text-[#FAF8F5] text-[10px] font-mono uppercase tracking-pantryst font-bold">
              LAYER 1 & 2
            </span>
            <span className="text-xs text-[#665E58]">Raw Material Repository & Curation</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#141211] mt-1">
            Kho Nguồn & Thẩm Định Sản Vật (P0 Intake)
          </h1>
          <p className="text-xs text-[#665E58] mt-1 max-w-2xl">
            Gạc Măng Rê không bắt đầu từ sản phẩm thương mại. Hệ thống bắt đầu từ nguồn nguyên liệu thô, tiến hành phân tích sự thật (Facts), chấm điểm 9 chiều (GMR Scorecard) trước khi đưa sang Story Architect.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl border border-[#E7DFD3] text-xs font-semibold text-[#423B36] hover:bg-[#EFE8DC] transition"
          >
            Về Dashboard Vận Hành
          </Link>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 rounded-xl bg-[#A65F25] text-white text-xs font-semibold hover:bg-[#8C4F1E] transition inline-flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tiếp Nhận Nguồn Mới</span>
          </button>
        </div>
      </div>

      {/* QUICK INTAKE FORM (COLLAPSIBLE) */}
      {isCreating && (
        <form
          onSubmit={handleCreateSource}
          className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#A65F25]/30 shadow-pantry space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#141211]">
              Tiếp Nhận Tư Liệu Nguồn Mới (Quick Intake)
            </h3>
            <span className="text-xs text-[#665E58]">Hỗ trợ URL / Fanpage / Ghi chú mộc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#423B36]">
                URL Nguồn (Website / Fanpage / Video TikTok / OCOP)
              </label>
              <input
                type="text"
                placeholder="https://facebook.com/..., https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DFD3] text-xs focus:outline-[#A65F25] bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#423B36]">Tên Nhà Sản Xuất / Nghệ Nhân</label>
                <input
                  type="text"
                  placeholder="Vd: Cà phê Aeroco, Bác Hùng..."
                  value={newProducer}
                  onChange={(e) => setNewProducer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DFD3] text-xs focus:outline-[#A65F25] bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#423B36]">Nhóm Ngành (Category)</label>
                <input
                  type="text"
                  placeholder="Vd: HONEY, COFFEE, CACAO..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DFD3] text-xs focus:outline-[#A65F25] bg-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#423B36]">
              Ghi Chú Ban Đầu / Trích Dẫn Thô (Raw Notes)
            </label>
            <textarea
              rows={3}
              placeholder="Nhập những chi tiết ban đầu quan sát được: thổ nhưỡng, giống loài, con người, câu chuyện..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DFD3] text-xs focus:outline-[#A65F25] bg-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#665E58] hover:bg-[#EFE8DC]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#141211] text-white text-xs font-semibold hover:bg-[#A65F25] transition"
            >
              {isSubmitting ? 'Đang tạo hồ sơ...' : 'Tạo Hồ Sơ Nguồn'}
            </button>
          </div>
        </form>
      )}

      {/* FILTER BUTTONS */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'READY', 'DEVELOP', 'NEEDS_INPUT', 'REVIEWING', 'NEW', 'NOT_FIT'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-pantryst transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#141211] text-[#FAF8F5]'
                  : 'bg-[#EFE8DC]/70 text-[#423B36] hover:bg-[#E7DFD3]'
              }`}
            >
              {st} ({st === 'ALL' ? sources.length : sources.filter((s) => s.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* SOURCES LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSources.map((source) => {
          const fitScore = source.scorecard.gmr_fit_score.toFixed(1);
          let badgeColor = 'bg-gray-100 text-gray-700 border-gray-200';
          if (source.status === 'READY') badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          if (source.status === 'DEVELOP') badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
          if (source.status === 'NOT_FIT') badgeColor = 'bg-red-50 text-red-800 border-red-200';

          return (
            <div
              key={source.id}
              className="p-6 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry hover:border-[#A65F25]/40 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD3]/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#A65F25]">
                      {source.experiment_id || source.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFE8DC] text-[#665E58] uppercase">
                      {source.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {source.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#141211]">
                    {source.product_name}
                  </h3>
                  <p className="text-xs text-[#665E58]">
                    Người làm: <strong>{source.producer_person || source.producer_name}</strong> · Vùng: {source.location}
                  </p>
                </div>

                {/* Scorecard quick indicator */}
                <div className="flex items-center gap-4 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E7DFD3]">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block font-semibold">
                      GMR Fit Score
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#A65F25]">
                      {fitScore}
                      <span className="text-xs text-[#665E58]"> / 10</span>
                    </span>
                  </div>
                  <Link
                    href={`/admin/curation/${source.id}`}
                    className="p-2 rounded-xl bg-[#141211] text-white hover:bg-[#A65F25] transition"
                    title="Xem chi tiết Thẩm định"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Facts overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E7DFD3]">
                  <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block font-semibold">
                    1. Vùng Đất (Origin)
                  </span>
                  <p className="text-[#141211] font-medium mt-1 line-clamp-2">
                    {source.raw_material_origin || 'Chưa có thông tin'}
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E7DFD3]">
                  <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block font-semibold">
                    2. Tay Nghề (Craft & Practice)
                  </span>
                  <p className="text-[#141211] font-medium mt-1 line-clamp-2">
                    {source.distinctive_practice || source.production_method || 'Chưa rõ quy trình'}
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E7DFD3]">
                  <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block font-semibold">
                    3. Bằng Chứng (Proof)
                  </span>
                  <p className="text-[#141211] font-medium mt-1 line-clamp-2">
                    {source.certifications.length > 0 ? source.certifications.join(', ') : 'Chưa có chứng nhận xác thực'}
                  </p>
                </div>
              </div>

              {/* Action footer */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="text-[#665E58]">
                  {source.missing_fields.length > 0 ? (
                    <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Thiếu {source.missing_fields.length} trường thông tin
                    </span>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Đủ thông tin thẩm định
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/sources/${source.id}`}
                    className="text-[#423B36] hover:text-[#141211] font-semibold flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Hồ Sơ Nguồn</span>
                  </Link>
                  <Link
                    href={`/admin/curation/${source.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#141211] text-white hover:bg-[#A65F25] transition font-semibold flex items-center gap-1"
                  >
                    <span>Thẩm Định (Curation)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
