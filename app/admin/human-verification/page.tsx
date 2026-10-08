'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  XCircle,
  CheckCircle2,
  FileText,
  UserCheck,
  ChevronRight,
  Clock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import {
  VerifiableClaimItem,
  HumanVerificationRecord,
  VerificationMethod,
  TruthStatus,
} from '@/types';

export default function HumanVerificationReviewRoom() {
  const [claims, setClaims] = useState<VerifiableClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<VerifiableClaimItem | null>(null);

  // Verification form state
  const [verifiedBy, setVerifiedBy] = useState('Quỳnh (GMR Lead Curator)');
  const [method, setMethod] = useState<VerificationMethod>('FIELD_VISIT');
  const [evidenceRef, setEvidenceRef] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await fetch('/api/admin/human-verification');
      const json = await res.json();
      if (json.data) {
        setClaims(json.data);
        if (!selectedClaim && json.data.length > 0) {
          setSelectedClaim(json.data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load claims', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'VERIFY' | 'REJECT' | 'NEED_MORE_EVIDENCE') => {
    if (!selectedClaim) return;
    setSubmitting(true);
    setFeedbackMsg(null);

    const defaultRef = evidenceRef.trim() || (action === 'VERIFY' ? 'Thực địa Châu Đức ngày 05/10/2026' : 'Đối soát hồ sơ thực tế');
    const defaultNote = note.trim() || (action === 'VERIFY' ? 'Đã trực tiếp kiểm tra quy trình và chứng thực tại xưởng.' : 'Cần thêm tài liệu chứng minh.');

    try {
      const res = await fetch('/api/admin/human-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim_id: selectedClaim.id,
          verified_by: verifiedBy,
          action,
          verification_method: method,
          evidence_reference: defaultRef,
          verification_note: defaultNote,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setFeedbackMsg({
          type: 'success',
          text: `Đã cập nhật trạng thái claim: ${json.claim.current_truth_status} (Workflow: ${json.claim.verification_state})`,
        });
        // Update local state
        setClaims((prev) =>
          prev.map((c) => (c.id === json.claim.id ? json.claim : c))
        );
        setSelectedClaim(json.claim);
        setNote('');
        setEvidenceRef('');
      } else {
        setFeedbackMsg({ type: 'error', text: json.error || 'Có lỗi xảy ra' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Lỗi kết nối' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: TruthStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            VERIFIED
          </span>
        );
      case 'PRODUCER_CLAIM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
            <AlertCircle className="w-3 h-3 text-amber-700" />
            PRODUCER_CLAIM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-mono font-bold">
            {status}
          </span>
        );
    }
  };

  const getWorkflowBadge = (state: string) => {
    switch (state) {
      case 'VERIFIED':
        return <span className="text-[10px] font-mono text-emerald-700 font-bold">● HUMAN VERIFIED</span>;
      case 'REJECTED':
        return <span className="text-[10px] font-mono text-rose-700 font-bold">● REJECTED</span>;
      case 'NEEDS_HUMAN_VERIFICATION':
        return <span className="text-[10px] font-mono text-amber-700 font-bold">● CHỜ XÁC MINH</span>;
      default:
        return <span className="text-[10px] font-mono text-stone-500 font-bold">● {state}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141211] font-sans pb-20">
      
      {/* Header */}
      <header className="border-b border-[#E7DFD3] bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#A65F25] font-bold block">
                Story Intelligence Gate
              </span>
              <h1 className="font-serif text-xl font-bold text-[#141211]">
                Human Verification Review Room · Test #002
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500">
              {claims.length} claims đã trích xuất
            </span>
          </div>
        </div>
      </header>

      {/* Main Review Layout */}
      <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Claim Queue List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD3]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600">
              Danh sách Claims trích xuất
            </span>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Anti-AI Elevation Gate
            </span>
          </div>

          <div className="space-y-2.5">
            {claims.map((claim) => (
              <div
                key={claim.id}
                onClick={() => {
                  setSelectedClaim(claim);
                  setFeedbackMsg(null);
                }}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  selectedClaim?.id === claim.id
                    ? 'bg-white border-[#141211] shadow-md ring-1 ring-[#141211]'
                    : 'bg-white/80 border-[#E7DFD3] hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] text-stone-400">{claim.id}</span>
                  <div className="flex items-center gap-1.5">
                    {getStatusBadge(claim.current_truth_status)}
                  </div>
                </div>

                <h3 className="font-serif text-sm font-bold text-[#141211] line-clamp-2 leading-snug">
                  {claim.claim}
                </h3>

                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 truncate max-w-[200px]">
                    {claim.source_title || claim.source_type}
                  </span>
                  {getWorkflowBadge(claim.verification_state)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Claim Inspection & Verification Gate */}
        <div className="lg:col-span-7">
          {selectedClaim ? (
            <div className="bg-white rounded-3xl border border-[#D9CEBF] shadow-sm p-6 sm:p-8 space-y-6">
              
              {/* Claim Header */}
              <div className="space-y-2 pb-4 border-b border-[#E7DFD3]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#A65F25]">
                    {selectedClaim.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-stone-500">
                      Trạng thái hiện hành:
                    </span>
                    {getStatusBadge(selectedClaim.current_truth_status)}
                  </div>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141211] leading-tight">
                  &ldquo;{selectedClaim.claim}&rdquo;
                </h2>
              </div>

              {/* AI Assessment Breakdown */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F0DCB8] space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#A65F25]" />
                  <span className="text-xs font-mono font-bold text-[#A65F25] uppercase tracking-wide">
                    Đánh giá từ AI & Nguồn khai thác
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-stone-500 block">AI Initial Status:</span>
                    <strong className="text-stone-800">{selectedClaim.ai_truth_status}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Độ tin cậy (Confidence):</span>
                    <strong className="text-stone-800">{Math.round(selectedClaim.ai_confidence * 100)}%</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-500 block">Nguồn tham chiếu:</span>
                    <span className="text-[#141211] font-mono text-[11px] break-all">
                      {selectedClaim.source_title} ({selectedClaim.source_type})
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#554D46] pt-1 leading-relaxed italic border-t border-[#F0DCB8]/60">
                  <strong>Lý do AI phân loại:</strong> {selectedClaim.ai_rationale}
                </p>
              </div>

              {/* Human Verification Action Form */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#141211]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#141211]">
                    Cổng thẩm định của Người có thẩm quyền (Human Gate)
                  </span>
                </div>

                {feedbackMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-sans ${
                      feedbackMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {feedbackMsg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">
                      Người thẩm định (Authorized Admin):
                    </label>
                    <input
                      type="text"
                      value={verifiedBy}
                      onChange={(e) => setVerifiedBy(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#141211] font-sans"
                      placeholder="vd: Quỳnh (GMR Lead Curator)"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">
                      Phương thức xác minh:
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value as VerificationMethod)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#141211] font-sans bg-white"
                    >
                      <option value="FIELD_VISIT">Thực địa trực tiếp (Field Visit)</option>
                      <option value="PRIVATE_DOCUMENT">Tài liệu riêng / Hợp đồng nội bộ</option>
                      <option value="LAB_TEST_REPORT">Phiếu kiểm nghiệm phòng lab</option>
                      <option value="PRODUCER_INTERVIEW">Phỏng vấn sâu người làm</option>
                      <option value="OFFICIAL_REGISTRY">Cổng thông tin pháp lý nhà nước</option>
                      <option value="EDITORIAL_AUDIT">Đối soát biên tập độc lập</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-stone-600 font-semibold mb-1">
                    Căn cứ / Tham chiếu minh chứng (Evidence Reference):
                  </label>
                  <input
                    type="text"
                    value={evidenceRef}
                    onChange={(e) => setEvidenceRef(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#141211] font-sans"
                    placeholder="vd: Sổ tay thực địa GMR tại xưởng Châu Đức ngày 05/10/2026"
                  />
                </div>

                <div className="text-xs">
                  <label className="block text-stone-600 font-semibold mb-1">
                    Ghi chú thẩm định của Người duyệt (Verification Note):
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#141211] font-sans"
                    placeholder="Ghi rõ cơ sở kết luận để phục vụ truy vết ngược sau này..."
                  />
                </div>

                {/* Triad Decision Buttons */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <button
                    disabled={submitting}
                    onClick={() => handleAction('VERIFY')}
                    className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác nhận VERIFIED</span>
                  </button>

                  <button
                    disabled={submitting}
                    onClick={() => handleAction('NEED_MORE_EVIDENCE')}
                    className="py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Cần thêm minh chứng</span>
                  </button>

                  <button
                    disabled={submitting}
                    onClick={() => handleAction('REJECT')}
                    className="py-3 px-4 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Bác bỏ (REJECT)</span>
                  </button>
                </div>
              </div>

              {/* Audit Trail Log */}
              {selectedClaim.audit_trail && selectedClaim.audit_trail.length > 0 && (
                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block">
                    Nhật ký kiểm toán truy vết (Audit Trail)
                  </span>
                  <div className="space-y-2">
                    {selectedClaim.audit_trail.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-sans space-y-1"
                      >
                        <div className="flex items-center justify-between text-stone-500 font-mono text-[10px]">
                          <span>Người duyệt: <strong>{rec.verified_by}</strong></span>
                          <span>{new Date(rec.verified_at).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="text-stone-700">
                          <strong>Phương thức:</strong> {rec.verification_method} · <strong>Tham chiếu:</strong> {rec.evidence_reference}
                        </div>
                        <p className="text-stone-600 italic">&ldquo;{rec.verification_note}&rdquo;</p>
                        <div className="text-[11px] font-mono text-emerald-800">
                          {rec.previous_truth_status} ➔ <strong>{rec.resulting_truth_status}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E7DFD3] text-stone-400">
              Chọn một claim bên trái để bắt đầu thẩm định.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
