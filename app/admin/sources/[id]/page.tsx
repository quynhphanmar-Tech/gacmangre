'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SourceProfile, FactProvenance } from '@/types';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  User,
  MapPin,
  Sparkles,
  ChevronRight,
  Send
} from 'lucide-react';

export default function SourceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [source, setSource] = useState<SourceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/sources/${id}`);
        const data = await res.json();
        if (data.success) {
          setSource(data.source);
        }
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-[#665E58]">
        Đang tải hồ sơ nguồn...
      </div>
    );
  }

  if (!source) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm font-semibold text-red-700">Không tìm thấy hồ sơ nguồn</p>
        <Link href="/admin/sources" className="text-xs text-[#A65F25] underline">
          Quay lại danh sách nguồn
        </Link>
      </div>
    );
  }

  const getProvenanceBadge = (prov: FactProvenance) => {
    switch (prov) {
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">VERIFIED</span>;
      case 'PRODUCER_CLAIM':
        return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">PRODUCER_CLAIM</span>;
      case 'SOURCE_INFERRED':
        return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">SOURCE_INFERRED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold">UNKNOWN</span>;
    }
  };

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
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/curation/${source.id}`}
            className="px-4 py-2 rounded-xl bg-[#A65F25] text-white text-xs font-semibold hover:bg-[#8C4F1E] transition inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Sang Thẩm Định (GMR Scorecard)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="p-8 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#A65F25]">
            {source.experiment_id || source.id}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFE8DC] text-[#665E58] uppercase">
            {source.category}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {source.status}
          </span>
        </div>

        <h1 className="font-serif text-3xl font-bold text-[#141211]">
          {source.product_name}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E7DFD3]/60 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block">Người đại diện:</span>
            <strong className="text-[#141211]">{source.producer_person}</strong>
            <p className="text-[#665E58]">{source.producer_name}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block">Vùng nguyên liệu:</span>
            <strong className="text-[#141211]">{source.location}</strong>
            <p className="text-[#665E58]">{source.province}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-pantryst text-[#665E58] block">Liên hệ / Kênh:</span>
            <p className="text-[#141211] font-mono">{source.contact_phone || 'Chưa có'}</p>
            {source.input_url && (
              <a
                href={source.input_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#A65F25] hover:underline flex items-center gap-1 mt-0.5"
              >
                <span>Xem URL Nguồn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* STRUCTURED FACTS EXTRACTION TABLE */}
      <div className="p-8 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#141211]">
              Trích Xuất Sự Thật Có Xuất Xứ (Fact Extraction & Provenance)
            </h2>
            <p className="text-xs text-[#665E58]">
              Nguyên tắc vàng: Phân biệt rõ sự thật xác thực (VERIFIED) với lời khẳng định (CLAIM) hoặc suy luận (INFERRED).
            </p>
          </div>
        </div>

        <div className="border border-[#E7DFD3] rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#FAF8F5] border-b border-[#E7DFD3] text-[11px] font-mono uppercase text-[#665E58]">
              <tr>
                <th className="py-3 px-4">Trường Thông Tin</th>
                <th className="py-3 px-4">Nội Dung Sự Thật (Fact)</th>
                <th className="py-3 px-4">Xuất Xứ (Provenance)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DFD3]">
              {source.facts.map((f, i) => (
                <tr key={i} className="hover:bg-[#FAF8F5]/60 transition">
                  <td className="py-3 px-4 font-semibold text-[#423B36]">{f.field}</td>
                  <td className="py-3 px-4 text-[#141211]">{f.value}</td>
                  <td className="py-3 px-4">{getProvenanceBadge(f.provenance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MISSING FIELDS & PRODUCER REQUEST */}
      {source.missing_fields.length > 0 && (
        <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-amber-200 space-y-4">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <h3 className="font-serif text-lg font-bold">
              Thông Tin Còn Thiếu Cần Bổ Sung ({source.missing_fields.length} trường)
            </h3>
          </div>

          <ul className="list-disc list-inside space-y-1 text-xs text-[#665E58]">
            {source.missing_fields.map((mf, idx) => (
              <li key={idx} className="text-amber-950 font-medium">
                {mf}
              </li>
            ))}
          </ul>

          {source.producer_request && (
            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD3] space-y-2 mt-4">
              <span className="text-[10px] uppercase tracking-pantryst text-[#A65F25] font-bold block">
                Bản Thảo Tin Nhắn Hỏi Người Làm (Producer Request Generator):
              </span>
              <p className="text-xs text-[#141211] italic leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#E7DFD3]">
                &quot;{source.producer_request.suggested_message}&quot;
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => alert('Đã sao chép tin nhắn để gửi Zalo cho nhà sản xuất!')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#141211] text-white text-xs font-semibold hover:bg-[#A65F25] transition inline-flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Sao Chép Tin Nhắn Zalo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
