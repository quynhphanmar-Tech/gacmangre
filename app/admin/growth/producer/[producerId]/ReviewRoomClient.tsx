'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ProducerGrowthRunOutput,
  MinedEvidenceItem,
  GrowthDimensionKey,
  UatDecision,
  UatFeedbackRecord,
} from '@/types';

interface ReviewRoomClientProps {
  producerId: string;
  initialRun?: ProducerGrowthRunOutput | null;
  initialFeedback?: UatFeedbackRecord[];
}

export default function ReviewRoomClient({
  producerId,
  initialRun = null,
  initialFeedback = [],
}: ReviewRoomClientProps) {
  const [loading, setLoading] = useState(!initialRun);
  const [error, setError] = useState<string | null>(null);
  const [run, setRun] = useState<ProducerGrowthRunOutput | null>(initialRun);

  // Initialize feedbacks map from initialFeedback
  const [feedbacks, setFeedbacks] = useState<Record<string, UatFeedbackRecord>>(() => {
    const map: Record<string, UatFeedbackRecord> = {};
    if (initialFeedback && Array.isArray(initialFeedback)) {
      for (const item of initialFeedback) {
        map[item.object_id] = item;
      }
    }
    return map;
  });

  // UI interaction states
  const [expandedSurfaces, setExpandedSurfaces] = useState<Record<string, boolean>>({});
  const [expandedClaims, setExpandedClaims] = useState<Record<string, boolean>>({});
  const [expandedTrace, setExpandedTrace] = useState<Record<string, boolean>>({});
  const [showContentModal, setShowContentModal] = useState(false);

  // Review note modal state
  const [activeNoteTarget, setActiveNoteTarget] = useState<{
    object_type: UatFeedbackRecord['object_type'];
    object_id: string;
    decision: UatDecision;
  } | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // If initialRun wasn't provided, fetch data on mount
  useEffect(() => {
    if (initialRun) {
      setRun(initialRun);
      setLoading(false);
      return;
    }

    async function fetchProducerRun() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/growth?producer_id=${encodeURIComponent(producerId)}`);
        const data = await res.json();
        if (!data.success || !data.run) {
          setError(data.error || `Không tìm thấy kết quả phân tích tăng trưởng cho: ${producerId}`);
          setLoading(false);
          return;
        }
        setRun(data.run);

        // Map existing feedbacks
        if (data.feedback && Array.isArray(data.feedback)) {
          const map: Record<string, UatFeedbackRecord> = {};
          for (const item of data.feedback) {
            map[item.object_id] = item;
          }
          setFeedbacks(map);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Lỗi kết nối khi tải dữ liệu review');
        setLoading(false);
      }
    }
    fetchProducerRun();
  }, [producerId, initialRun]);

  // Handle UAT Feedback action
  const handleFeedbackClick = (
    object_type: UatFeedbackRecord['object_type'],
    object_id: string,
    decision: UatDecision
  ) => {
    if (decision === 'CORRECT') {
      submitFeedback(object_type, object_id, 'CORRECT', '');
    } else {
      // Open note modal for REVIEW or INCORRECT
      setActiveNoteTarget({ object_type, object_id, decision });
      setNoteInput(feedbacks[object_id]?.note || '');
    }
  };

  const submitFeedback = async (
    object_type: UatFeedbackRecord['object_type'],
    object_id: string,
    decision: UatDecision,
    note: string
  ) => {
    setSavingNote(true);
    try {
      const res = await fetch('/api/admin/growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_UAT_FEEDBACK',
          producer_id: producerId,
          object_type,
          object_id,
          decision,
          note,
        }),
      });
      const data = await res.json();
      if (data.success && data.record) {
        setFeedbacks((prev) => ({ ...prev, [object_id]: data.record }));
        setNotification(`Đã ghi nhận phản hồi ${decision} cho ${object_id}`);
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setNotification('Lưu phản hồi thất bại do lỗi mạng');
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setSavingNote(false);
      setActiveNoteTarget(null);
    }
  };

  const toggleSurface = (key: string) => {
    setExpandedSurfaces((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleClaim = (id: string) => {
    setExpandedClaims((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTrace = (id: string) => {
    setExpandedTrace((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#2C2825] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="text-xs uppercase tracking-widest text-[#8C827A] font-medium">Gạc Măng Rê — Review Room</div>
          <div className="text-lg font-serif italic text-[#1C1917]">Đang truy xuất hồ sơ thực địa & dữ liệu tăng trưởng...</div>
        </div>
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#2C2825] p-8 sm:p-16 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E8E2D9] shadow-sm text-center space-y-4">
          <div className="text-2xl">🌿</div>
          <h2 className="text-lg font-serif font-semibold text-[#1C1917]">Hồ sơ chưa có kết quả quét</h2>
          <p className="text-xs text-[#6B635B] leading-relaxed">{error}</p>
          <div className="pt-2">
            <Link
              href="/admin/growth/workbench"
              className="inline-block px-4 py-2 bg-[#2C2825] text-white text-xs rounded hover:bg-[#1A1816] transition"
            >
              Về Workbench Thử Nghiệm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    producer_intelligence: intel,
    source_coverage: coverage,
    evidence_map: evidence,
    growth_diagnosis: diagnosis,
    value_trust_price: vtp,
    primary_growth_hypothesis: hypothesis,
    opportunities,
    intervention,
    content_request: contentReq,
    decision_layer: decisionLayer,
  } = run;

  // Render UAT feedback button toolbar
  const renderUatToolbar = (object_type: UatFeedbackRecord['object_type'], object_id: string) => {
    const current = feedbacks[object_id];
    return (
      <div className="flex items-center gap-1.5 text-[11px]">
        <button
          onClick={() => handleFeedbackClick(object_type, object_id, 'CORRECT')}
          className={`px-2 py-0.5 rounded border transition flex items-center gap-1 ${
            current?.decision === 'CORRECT'
              ? 'bg-[#E7F3E9] text-[#1E5C2B] border-[#93C99F] font-semibold'
              : 'border-[#E0D8CE] text-[#5C544E] hover:bg-[#F2EEE9]'
          }`}
          title="Xác nhận thông tin chính xác theo thực địa"
        >
          <span>✓</span> CORRECT
        </button>
        <button
          onClick={() => handleFeedbackClick(object_type, object_id, 'REVIEW')}
          className={`px-2 py-0.5 rounded border transition flex items-center gap-1 ${
            current?.decision === 'REVIEW'
              ? 'bg-[#FEF5E7] text-[#8C5311] border-[#E8C287] font-semibold'
              : 'border-[#E0D8CE] text-[#5C544E] hover:bg-[#F2EEE9]'
          }`}
          title="Cần đội thực địa hoặc chuyên gia xem lại"
        >
          <span>⚠</span> REVIEW
        </button>
        <button
          onClick={() => handleFeedbackClick(object_type, object_id, 'INCORRECT')}
          className={`px-2 py-0.5 rounded border transition flex items-center gap-1 ${
            current?.decision === 'INCORRECT'
              ? 'bg-[#FBEAE8] text-[#8C231A] border-[#E5A39B] font-semibold'
              : 'border-[#E0D8CE] text-[#5C544E] hover:bg-[#F2EEE9]'
          }`}
          title="Thông tin chưa đúng hoặc có nhầm lẫn"
        >
          <span>✕</span> INCORRECT
        </button>
        {current?.note && (
          <span className="text-[10px] text-[#7A6B5D] italic ml-1 max-w-[140px] truncate" title={current.note}>
            ({current.note})
          </span>
        )}
      </div>
    );
  };

  // Status badge styling helper
  const renderTruthBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#EAF5EC] text-[#1E4D2B] border border-[#A7D7AF]">VERIFIED</span>;
      case 'PRODUCER_CLAIM':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#FEF7EC] text-[#8C5311] border border-[#E9C387]">PRODUCER_CLAIM</span>;
      case 'EDITORIAL_INTERPRETATION':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#F0F4FA] text-[#1E3A8A] border border-[#BFDBFE]">EDITORIAL_INTERPRETATION</span>;
      case 'MISSING_EVIDENCE':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#FBEAE8] text-[#991B1B] border border-[#F87171]">MISSING_EVIDENCE</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#F3F4F6] text-[#4B5563] border border-[#D1D5DB]">UNKNOWN</span>;
    }
  };

  const renderEpistemicBadge = (classification: string) => {
    switch (classification) {
      case 'FACT':
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#EAF5EC] text-[#1E4D2B] border border-[#A7D7AF]">FACT</span>;
      case 'INTERPRETATION':
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#F0F4FA] text-[#1E3A8A] border border-[#BFDBFE]">INTERPRETATION</span>;
      case 'HYPOTHESIS':
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#FEF7EC] text-[#8C5311] border border-[#E9C387]">HYPOTHESIS</span>;
      default:
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#F3F4F6] text-[#6B7280] border border-[#D1D5DB]">UNKNOWN</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C2825] font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#1C1917] text-white text-xs px-4 py-2.5 rounded shadow-lg border border-[#3E3935] flex items-center gap-3">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-[#A89F91] hover:text-white">✕</button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between pb-6 border-b border-[#E8E2D9] gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#8C827A] font-semibold">
              Gạc Măng Rê — Producer Growth Skill v0.1
            </div>
            <h1 className="text-xl sm:text-2xl font-serif text-[#1C1917] mt-0.5">
              Producer Intelligence Review Room
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/growth/workbench"
              className="text-xs px-3 py-1.5 border border-[#D5CEC5] rounded hover:bg-[#EFEAE2] transition"
            >
              Asset Workbench
            </Link>
            <Link
              href="/admin/control-tower"
              className="text-xs px-3 py-1.5 border border-[#D5CEC5] rounded hover:bg-[#EFEAE2] transition"
            >
              Control Tower
            </Link>
          </div>
        </div>

        {/* ================================================================== */}
        {/* GROWTH SNAPSHOT (<= 60 seconds Synthesis)                          */}
        {/* ================================================================== */}
        {decisionLayer?.snapshot && (
          <section className="bg-gradient-to-r from-[#2A2421] to-[#1C1917] text-[#F5F0E6] p-6 sm:p-8 rounded-2xl border border-[#423832] shadow-md space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3E352E]">
              <div className="flex items-center gap-2.5">
                <span className="text-amber-400 text-sm">⚡</span>
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#FAF7F2]">
                  GROWTH SNAPSHOT (TỔNG QUAN TĂNG TRƯỞNG & ĐÁNH GIÁ TRONG 60 GIÂY)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#3A3029] text-amber-200 border border-[#52443A]">
                  Business Outcome Synthesis
                </span>
                {renderUatToolbar('GROWTH_SNAPSHOT', 'SNAPSHOT-MAIN')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-[#221C19]/80 rounded-xl border border-[#3A302A] space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">01 · WHAT WE SEE</span>
                <p className="text-[#E6DED5] leading-relaxed">{decisionLayer.snapshot.what_we_see}</p>
              </div>

              <div className="p-3.5 bg-[#221C19]/80 rounded-xl border border-[#3A302A] space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">02 · WHY (LÝ DO NGHẼN)</span>
                <p className="text-[#E6DED5] leading-relaxed">{decisionLayer.snapshot.why}</p>
              </div>

              <div className="p-3.5 bg-[#221C19]/80 rounded-xl border border-[#3A302A] space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">03 · PRIMARY HYPOTHESIS</span>
                <p className="text-[#E6DED5] leading-relaxed">{decisionLayer.snapshot.primary_hypothesis}</p>
              </div>

              <div className="p-3.5 bg-[#221C19]/80 rounded-xl border border-[#3A302A] space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">04 · CUSTOMER OUTCOME</span>
                <p className="text-[#E6DED5] leading-relaxed">{decisionLayer.snapshot.customer_outcome}</p>
              </div>

              <div className="p-3.5 bg-[#221C19]/80 rounded-xl border border-[#3A302A] space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">05 · PRODUCER OUTCOME</span>
                <p className="text-[#E6DED5] leading-relaxed">{decisionLayer.snapshot.producer_outcome}</p>
              </div>

              <div className="p-3.5 bg-[#221C19]/80 rounded-xl border border-[#3A302A] space-y-1.5">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">06 · NEXT TEST</span>
                <p className="text-[#E6DED5] leading-relaxed">{decisionLayer.snapshot.next_test}</p>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* SECTION 01 — PRODUCER HEADER                                      */}
        {/* ================================================================== */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D9] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-2">
              <div className="text-xs font-mono text-[#7A6B5D] uppercase tracking-wider">
                Run ID: {run.run_id} · Last Analyzed: {new Date(run.timestamp).toLocaleString('vi-VN')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight">
                {intel?.identity?.name || producerId}
              </h2>
              <p className="text-xs text-[#5C544E] flex items-center gap-2">
                <span>📍 {intel?.place?.geography || 'Việt Nam'}</span>
                <span>·</span>
                <span>🏷️ {intel?.product?.categories?.join(', ') || 'Nông sản mộc'}</span>
              </p>
            </div>

            <div className="md:col-span-5 grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-[#EFEAE2] pt-4 md:pt-0 md:pl-6 text-center">
              <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#EDE7DE]">
                <div className="text-[10px] text-[#8C827A] font-medium uppercase tracking-wider">Source Coverage</div>
                <div className="text-sm font-semibold text-[#1C1917] mt-0.5">{coverage?.coverage_status}</div>
                <div className="text-[10px] text-[#7A6B5D] mt-0.5">{coverage?.discovered_urls?.length || 0} URLs</div>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#EDE7DE]">
                <div className="text-[10px] text-[#8C827A] font-medium uppercase tracking-wider">Scan Score</div>
                <div className="text-sm font-semibold text-[#1C1917] mt-0.5">{coverage?.scan_completeness?.score || 0}%</div>
                <div className="text-[10px] text-[#7A6B5D] mt-0.5">13 bề mặt</div>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#EDE7DE]">
                <div className="text-[10px] text-[#8C827A] font-medium uppercase tracking-wider">Confidence</div>
                <div className="text-sm font-semibold text-[#1E4D2B] mt-0.5">{run.can_diagnose ? 'HIGH' : 'LOW'}</div>
                <div className="text-[10px] text-[#7A6B5D] mt-0.5">{evidence.length} claims</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 02 — SOURCE DISCOVERY                                      */}
        {/* ================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D9]">
            <div>
              <h3 className="text-base font-serif font-semibold text-[#1C1917]">
                02 · Source Discovery & Surface Mapping
              </h3>
              <p className="text-xs text-[#7A6B5D]">
                Toàn bộ bề mặt dữ liệu chính thức đã được thu nạp, lọc trùng và phân loại
              </p>
            </div>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${
              coverage?.coverage_status === 'HIGH' ? 'bg-[#EAF5EC] text-[#1E4D2B] border-[#A7D7AF]' : 'bg-[#FEF7EC] text-[#8C5311] border-[#E9C387]'
            }`}>
              {coverage?.coverage_status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-[#E8E2D9]">
              <span className="text-[#8C827A] text-[11px]">Tổng số tìm thấy:</span>
              <div className="text-base font-bold text-[#1C1917] mt-0.5">{coverage?.discovered_urls?.length || 0}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#E8E2D9]">
              <span className="text-[#8C827A] text-[11px]">Truy cập thành công:</span>
              <div className="text-base font-bold text-[#1E4D2B] mt-0.5">{coverage?.accessible_urls?.length || 0}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#E8E2D9]">
              <span className="text-[#8C827A] text-[11px]">Không truy cập được:</span>
              <div className="text-base font-bold text-[#B45309] mt-0.5">{coverage?.inaccessible_urls?.length || 0}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#E8E2D9]">
              <span className="text-[#8C827A] text-[11px]">Không tìm thấy (404):</span>
              <div className="text-base font-bold text-[#8C231A] mt-0.5">{coverage?.not_found_urls?.length || 0}</div>
            </div>
          </div>

          {coverage?.coverage_status === 'INSUFFICIENT' ? (
            <div className="p-4 bg-[#FDE8E8] text-[#991B1B] text-xs rounded-lg border border-[#F87171]">
              ⚠️ Chưa đủ dữ liệu để đưa ra Growth Diagnosis đáng tin cậy. (Thiếu các bề mặt cốt lõi: {coverage.missing_surfaces.join(', ')})
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E8E2D9] divide-y divide-[#F0EBE3] text-xs">
              {Object.entries(coverage?.source_groups || {}).map(([key, urls]) => {
                const count = urls.length;
                const isExpanded = expandedSurfaces[key];
                return (
                  <div key={key} className="p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#1C1917]">{key}</span>
                        <span className="text-[10px] text-[#7A6B5D] bg-[#F4EFEA] px-1.5 py-0.2 rounded">
                          {count} URLs
                        </span>
                      </div>
                      {count > 0 && (
                        <button
                          onClick={() => toggleSurface(key)}
                          className="text-[11px] text-[#7A6B5D] hover:text-[#1C1917] font-medium"
                        >
                          {isExpanded ? 'Thu gọn ↑' : 'Xem URLs ↓'}
                        </button>
                      )}
                    </div>
                    {isExpanded && (
                      <ul className="mt-2.5 pl-3 border-l-2 border-[#E8E2D9] space-y-1 font-mono text-[11px] text-[#5C544E]">
                        {urls.map((u, i) => (
                          <li key={i} className="truncate">
                            <a href={u} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[#1C1917]">
                              {u}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================================== */}
        {/* SECTION 03 — PRODUCER INTELLIGENCE                                 */}
        {/* ================================================================== */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-[#E8E2D9]">
            <h3 className="text-base font-serif font-semibold text-[#1C1917]">
              03 · Producer Intelligence (11 Dimensions Mapped)
            </h3>
            <p className="text-xs text-[#7A6B5D]">
              Trí tuệ tổ chức theo chuẩn mộc mạc: Chỉ hiển thị dữ liệu đã khai thác, không tự động bịa đặt giá trị thiếu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Identity */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0EBE3]">
                <span className="font-serif font-semibold text-[#1C1917]">IDENTITY</span>
                <span className="text-[10px] text-[#1E4D2B] font-mono">CONFIDENCE: HIGH</span>
              </div>
              <p><span className="text-[#8C827A]">Tên pháp lý:</span> {intel?.identity?.legal_name || intel?.identity?.name || 'UNKNOWN'}</p>
              <p><span className="text-[#8C827A]">Mã số thuế:</span> {intel?.identity?.tax_id || 'UNKNOWN'}</p>
              <p><span className="text-[#8C827A]">Năm thành lập:</span> {intel?.identity?.established || 'UNKNOWN'}</p>
              <p><span className="text-[#8C827A]">Vai trò:</span> {intel?.identity?.role || 'UNKNOWN'}</p>
            </div>

            {/* Place */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0EBE3]">
                <span className="font-serif font-semibold text-[#1C1917]">PLACE & TERROIR</span>
                <span className="text-[10px] text-[#1E4D2B] font-mono">CONFIDENCE: HIGH</span>
              </div>
              <p><span className="text-[#8C827A]">Vùng đất:</span> {intel?.place?.geography || 'UNKNOWN'}</p>
              <p><span className="text-[#8C827A]">Thổ nhưỡng / Khí hậu:</span> {intel?.place?.local_context || 'UNKNOWN'}</p>
              <p><span className="text-[#8C827A]">Mùa vụ:</span> {intel?.place?.seasonality || 'UNKNOWN'}</p>
            </div>

            {/* Product */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0EBE3]">
                <span className="font-serif font-semibold text-[#1C1917]">PRODUCTS & PRICING</span>
                <span className="text-[10px] text-[#1E4D2B] font-mono">CONFIDENCE: HIGH</span>
              </div>
              <p><span className="text-[#8C827A]">Danh mục:</span> {intel?.product?.products?.join(', ') || 'UNKNOWN'}</p>
              <div className="pt-1">
                <span className="text-[#8C827A] block mb-1">Mức giá quan sát:</span>
                <div className="space-y-1 pl-2 border-l border-[#E8E2D9]">
                  {intel?.product?.price_points?.map((p, i) => (
                    <div key={i} className="flex justify-between font-mono text-[11px]">
                      <span>{p.product}</span>
                      <span className="font-semibold">{p.price?.toLocaleString()}đ / {p.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* People & Craft */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0EBE3]">
                <span className="font-serif font-semibold text-[#1C1917]">PEOPLE & CRAFT</span>
                <span className="text-[10px] text-[#1E4D2B] font-mono">CONFIDENCE: HIGH</span>
              </div>
              <p><span className="text-[#8C827A]">Sáng lập / Thợ chính:</span> {intel?.people?.founders?.concat(intel?.people?.makers || [])?.join(', ') || 'UNKNOWN'}</p>
              <p><span className="text-[#8C827A]">Nông hộ liên kết:</span> {intel?.people?.farmers?.join(', ') || 'UNKNOWN'}</p>
              <p><span className="text-[#8C827A]">Quy trình chế biến:</span> {intel?.craft?.process || 'UNKNOWN'}</p>
              <p><span className="text-[#8C827A]">Khác biệt cốt lõi:</span> {intel?.craft?.distinctive_practice || 'UNKNOWN'}</p>
            </div>

            {/* Proof & Export */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0EBE3]">
                <span className="font-serif font-semibold text-[#1C1917]">PROOF & EXPORT</span>
                <span className="text-[10px] text-[#8C5311] font-mono">CONFIDENCE: MEDIUM</span>
              </div>
              <p><span className="text-[#8C827A]">Chứng nhận công bố:</span> {intel?.proof?.certifications?.join(', ') || 'UNKNOWN'}</p>
              <p><span className="text-[#8C827A]">Thị trường xuất khẩu:</span> {intel?.proof?.export?.join(', ') || 'UNKNOWN'}</p>
              <p className="text-[11px] text-[#8C5311] italic bg-[#FEF7EC] p-2 rounded border border-[#E9C387]">
                Lưu ý: Các chứng chỉ hữu cơ hiện tại chỉ được ghi nhận dưới dạng PRODUCER_CLAIM do chưa có file scan chứng chỉ chính thức.
              </p>
            </div>

            {/* Unknowns & Missing Info */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0EBE3]">
                <span className="font-serif font-semibold text-[#1C1917]">UNKNOWNS (THÔNG TIN CÒN THIẾU)</span>
                <span className="text-[10px] text-[#8C231A] font-mono font-bold">STRICT UNKNOWN</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[#6B635B] text-[11px]">
                {intel?.unknowns?.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 04 — EVIDENCE & TRUTH                                      */}
        {/* ================================================================== */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-[#E8E2D9]">
            <h3 className="text-base font-serif font-semibold text-[#1C1917]">
              04 · Evidence & Truth Status (Evidence-Bearing Claims)
            </h3>
            <p className="text-xs text-[#7A6B5D]">
              Trọng tâm thẩm định: Phân định rạch ròi VERIFIED vs PRODUCER_CLAIM vs MISSING_EVIDENCE
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E8E2D9] divide-y divide-[#F0EBE3] text-xs shadow-sm">
            {evidence.map((item) => {
              const isExpanded = expandedClaims[item.id];
              return (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#7A6B5D] bg-[#F4EFEA] px-1.5 py-0.5 rounded">
                        {item.id}
                      </span>
                      {renderTruthBadge(item.truth_status)}
                      <span className="text-[10px] text-[#7A6B5D] font-mono">
                        CONFIDENCE: {item.confidence}
                      </span>
                    </div>
                    {renderUatToolbar('EVIDENCE', item.id)}
                  </div>

                  <p className="font-serif text-sm text-[#1C1917] leading-relaxed">
                    {item.claim}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[#8C827A] truncate max-w-md">
                      Nguồn: <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1C1917]">{item.source_url}</a>
                    </span>
                    <button
                      onClick={() => toggleClaim(item.id)}
                      className="text-[#7A6B5D] hover:text-[#1C1917] font-medium"
                    >
                      {isExpanded ? 'Đóng chi tiết ↑' : 'Chi tiết minh chứng ↓'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 p-3 bg-[#FAF8F5] rounded border border-[#EDE7DE] space-y-1.5 text-[11px] text-[#5C544E]">
                      <p><span className="font-semibold text-[#1C1917]">Loại bằng chứng:</span> {item.evidence_type}</p>
                      <p><span className="font-semibold text-[#1C1917]">Phân loại nguồn:</span> {item.source_type}</p>
                      {item.notes && (
                        <p><span className="font-semibold text-[#8C231A]">Ghi chú kiểm duyệt:</span> {item.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 05 — 8D GROWTH DIAGNOSIS                                   */}
        {/* ================================================================== */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-[#E8E2D9]">
            <h3 className="text-base font-serif font-semibold text-[#1C1917]">
              05 · 8D Growth Diagnosis (Epistemic Rigor: FACT vs INTERPRETATION vs HYPOTHESIS)
            </h3>
            <p className="text-xs text-[#7A6B5D]">
              Đánh giá toàn diện 8 chiều tăng trưởng; không coi suy luận chuyên gia là sự thật tuyệt đối
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.entries(diagnosis || {}).map(([dimKey, evalData]) => (
              <div key={dimKey} className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#F0EBE3]">
                  <span className="font-serif font-bold text-[#1C1917] tracking-wide">{dimKey}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#7A6B5D]">CONFIDENCE: {evalData.confidence}</span>
                    {renderUatToolbar('DIAGNOSIS', `DIAG-${dimKey}`)}
                  </div>
                </div>

                <div>
                  <span className="text-[#8C827A] text-[11px] block">Current State:</span>
                  <p className="text-[#1C1917] font-medium mt-0.5">{evalData.current_state}</p>
                </div>

                <div>
                  <span className="text-[#8C827A] text-[11px] block">Gap (Điểm nghẽn):</span>
                  <p className="text-[#8C231A] font-medium mt-0.5">{evalData.gap}</p>
                </div>

                <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#EDE7DE] text-[11px] text-[#5C544E] space-y-1">
                  <span className="font-semibold text-[#1C1917] block">Interpretation (Góc nhìn suy luận):</span>
                  <p>{evalData.interpretation}</p>
                </div>

                {evalData.unknowns.length > 0 && (
                  <div className="text-[10px] text-[#8C827A]">
                    <span className="font-semibold">Unknowns:</span> {evalData.unknowns.join('; ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 06 — VALUE × TRUST × PRICE                                */}
        {/* ================================================================== */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-[#E8E2D9]">
            <h3 className="text-base font-serif font-semibold text-[#1C1917]">
              06 · Value × Trust × Price Triad Test
            </h3>
            <p className="text-xs text-[#7A6B5D]">
              Phân tích tam giác định vị: Giá trị cảm xúc · Niềm tin minh chứng · Ma sát giá bán
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Price */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2">
              <span className="font-serif font-semibold text-[#1C1917] block pb-1 border-b border-[#F0EBE3]">
                1. PRICE (GIÁ BÁN)
              </span>
              <p className="text-[#5C544E]"><span className="text-[#8C827A]">Nhận định giá trị:</span> {vtp?.price?.perceived_value}</p>
              <p className="text-[#8C231A]"><span className="text-[#8C827A]">Ma sát phân phối:</span> {vtp?.price?.friction}</p>
            </div>

            {/* Emotional Value */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0EBE3]">
                <span className="font-serif font-semibold text-[#1C1917]">2. EMOTIONAL VALUE</span>
                <span className="text-[10px] font-mono text-[#1E4D2B]">STRENGTH: {vtp?.emotional_value?.strength}</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[#5C544E] text-[11px]">
                {vtp?.emotional_value?.evidence?.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>

            {/* Trust */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0EBE3]">
                <span className="font-serif font-semibold text-[#1C1917]">3. TRUST (NIỀM TIN)</span>
                <span className="text-[10px] font-mono text-[#1E4D2B]">STRENGTH: {vtp?.trust?.strength}</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <span className="text-[#8C827A] block">Khoảng trống niềm tin:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[#8C5311]">
                  {vtp?.trust?.gaps?.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 07 — PRIMARY GROWTH HYPOTHESIS (HERO SECTION)             */}
        {/* ================================================================== */}
        <section className="bg-[#FAF8F5] p-6 sm:p-8 rounded-xl border-2 border-[#D5CEC5] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E0D8CE]">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-serif font-bold text-[#1C1917] tracking-wide">
                07 · PRIMARY GROWTH HYPOTHESIS
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#1C1917] text-white rounded">
                CLASSIFICATION: HYPOTHESIS
              </span>
            </div>
            {renderUatToolbar('HYPOTHESIS', 'HYPOTHESIS-PRIMARY')}
          </div>

          <div className="p-4 bg-white rounded-lg border border-[#E0D8CE]">
            <p className="font-serif text-base sm:text-lg text-[#1C1917] font-semibold leading-relaxed">
              "{hypothesis?.statement}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-lg border border-[#E0D8CE] space-y-2">
              <span className="font-semibold text-[#1C1917] block">WHY WE THINK THIS (CƠ SỞ):</span>
              <div className="space-y-1.5 text-[#5C544E]">
                <p><span className="font-semibold text-[#1E4D2B]">Facts (Sự thật có chứng cứ):</span></p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {hypothesis?.based_on?.facts?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <p className="pt-1"><span className="font-semibold text-[#1E3A8A]">Interpretations (Suy luận chuyên gia):</span></p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {hypothesis?.based_on?.interpretations?.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#E0D8CE] space-y-2">
              <span className="font-semibold text-[#1C1917] block">VALIDATION NEEDED (HÀNH ĐỘNG KIỂM CHỨNG):</span>
              <p className="text-[#5C544E] text-[11px] leading-relaxed">
                {hypothesis?.validation_needed}
              </p>
              <div className="pt-2 text-[10px] text-[#8C827A] italic">
                * Cam kết: Đây là giả thuyết cần thị trường kiểm chứng qua cơ chế Ngăn, không phải chân lý bất biến.
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 08 — OPPORTUNITY MAP (MAX 3, 1 PRIORITY)                   */}
        {/* ================================================================== */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-[#E8E2D9]">
            <h3 className="text-base font-serif font-semibold text-[#1C1917]">
              08 · Opportunity Map (Top 3 Ranked Opportunities)
            </h3>
            <p className="text-xs text-[#7A6B5D]">
              Chỉ xếp hạng tối đa 3 cơ hội có cơ sở vững chắc nhất; duy nhất 1 cơ hội được gắn nhãn PRIORITY
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {opportunities?.map((opp, idx) => {
              const isPriority = idx === 0;
              return (
                <div
                  key={opp.opportunity_id}
                  className={`bg-white p-4 rounded-xl border transition shadow-sm space-y-2 ${
                    isPriority ? 'border-[#1C1917] ring-1 ring-[#1C1917]' : 'border-[#E8E2D9]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#7A6B5D] bg-[#F4EFEA] px-1.5 py-0.5 rounded">
                        {opp.opportunity_id}
                      </span>
                      {isPriority ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#1C1917] text-white rounded">
                          PRIORITY TOP 1
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#F4EFEA] text-[#7A6B5D] rounded">
                          RANK #{idx + 1}
                        </span>
                      )}
                      <span className="text-[10px] text-[#7A6B5D] font-mono">SCORE: {opp.score}</span>
                    </div>
                    {renderUatToolbar('OPPORTUNITY', opp.opportunity_id)}
                  </div>

                  <p className="font-serif text-sm font-semibold text-[#1C1917]">
                    {opp.statement}
                  </p>

                  <p className="text-[#5C544E] text-[11px]">
                    <span className="text-[#8C827A]">Dựa trên cơ sở:</span> {opp.based_on}
                  </p>

                  <div className="flex gap-4 text-[11px] pt-1 text-[#7A6B5D]">
                    <span>Giá trị dự kiến: <strong>{opp.expected_value}</strong></span>
                    <span>Nỗ lực thực thi: <strong>{opp.effort}</strong></span>
                    <span>Độ tin cậy: <strong>{opp.confidence}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 09 — INTERVENTION PLAN (30-DAY PROPOSAL)                   */}
        {/* ================================================================== */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D9] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0EBE3]">
            <div>
              <h3 className="text-base font-serif font-semibold text-[#1C1917]">
                09 · Intervention Plan (14–30 Days Action Plan)
              </h3>
              <p className="text-xs text-[#7A6B5D]">
                Kế hoạch can thiệp cụ thể giải quyết trực tiếp giả thuyết tăng trưởng then chốt
              </p>
            </div>
            {renderUatToolbar('INTERVENTION', intervention?.id || 'INT-TOP')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-[#8C827A] text-[11px] block">Điểm nghẽn cần giải quyết (Problem):</span>
                <p className="text-[#8C231A] font-medium mt-0.5">{intervention?.problem}</p>
              </div>
              <div>
                <span className="text-[#8C827A] text-[11px] block">Nội dung can thiệp (Intervention Action):</span>
                <p className="text-[#1C1917] font-semibold mt-0.5">{intervention?.intervention}</p>
              </div>
              <div>
                <span className="text-[#8C827A] text-[11px] block">Cơ chế nhu cầu & MOQ (Proposed Test Parameter):</span>
                <p className="text-[#1E4D2B] font-medium mt-0.5 bg-[#EAF5EC] p-2 rounded border border-[#A7D7AF]">
                  {intervention?.demand_mechanism}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[#8C827A] text-[11px] block">Tài sản cần có (Required Assets):</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[#5C544E] mt-0.5">
                  {intervention?.assets?.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[#8C827A] text-[11px] block">Kênh phát hành & CTA:</span>
                <p className="text-[#1C1917] font-medium mt-0.5">
                  {intervention?.channels?.join(', ')} · <strong className="text-[#704620]">CTA: "{intervention?.cta}"</strong>
                </p>
              </div>
              <div>
                <span className="text-[#8C827A] text-[11px] block">Chỉ số đo lường (KPI) & Thời hạn:</span>
                <p className="text-[#1C1917] font-medium mt-0.5">{intervention?.kpi} ({intervention?.duration})</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 10 — CONTENT HANDOFF SPEC                                 */}
        {/* ================================================================== */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D9] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0EBE3]">
            <div>
              <h3 className="text-base font-serif font-semibold text-[#1C1917]">
                10 · Content Request Handoff
              </h3>
              <p className="text-xs text-[#7A6B5D]">
                Đặc tả bài toán tăng trưởng chuyển giao sang Content Skill (Không sinh copy tự do)
              </p>
            </div>
            <button
              onClick={() => setShowContentModal(true)}
              className="px-3.5 py-1.5 bg-[#1C1917] text-white text-xs font-medium rounded hover:bg-[#332E2A] transition"
            >
              VIEW CONTENT REQUEST
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#8C827A]">Mục tiêu bài viết (Objective):</span>
              <p className="text-[#1C1917] font-medium mt-0.5">{contentReq?.objective}</p>
            </div>
            <div>
              <span className="text-[#8C827A]">Hành vi mục tiêu (Target Behavior):</span>
              <p className="text-[#1C1917] font-medium mt-0.5">{contentReq?.target_behavior}</p>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 11 — GROWTH OUTCOME (CUSTOMER & PRODUCER DUAL ENGINE)     */}
        {/* ================================================================== */}
        {decisionLayer && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E8E2D9] gap-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1C1917] flex items-center gap-2">
                  <span>11 · GROWTH OUTCOME (DECISION LAYER: DUAL OUTCOME)</span>
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Chuyển hóa chẩn đoán thành kết quả kinh doanh thực tế cho cả Khách hàng (Ngăn) và Nhà sản xuất (GMR Partnership)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#5C544E] border border-[#DDD5CA]">
                  DUAL-COLUMN ARCHITECTURE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* LEFT COLUMN: CUSTOMER OUTCOME / NGĂN PROPOSITION */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A65F25] font-bold block">
                      LEFT COLUMN · CONSUMER
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#1C1917]">
                      CUSTOMER OUTCOME / NGĂN PROPOSITION
                    </h4>
                  </div>
                  {renderUatToolbar('CUSTOMER_OUTCOME', 'CUST-OUTCOME-MAIN')}
                </div>

                {/* 1. WHY THIS */}
                <div className="space-y-1.5 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#1C1917]">WHY THIS (VÌ SAO CHỌN SẢN VẬT NÀY?)</span>
                    {renderEpistemicBadge(decisionLayer.customer_outcome.why_this.classification)}
                  </div>
                  <p className="text-xs text-[#4A423C] leading-relaxed">
                    {decisionLayer.customer_outcome.why_this.statement}
                  </p>
                </div>

                {/* 2. WHY NOW */}
                <div className="space-y-1.5 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#1C1917]">WHY NOW (TẠI SAO PHẢI LÀ BÂY GIỜ?)</span>
                    {renderEpistemicBadge(decisionLayer.customer_outcome.why_now.classification)}
                  </div>
                  <p className="text-xs text-[#4A423C] leading-relaxed">
                    {decisionLayer.customer_outcome.why_now.statement}
                  </p>
                  {decisionLayer.customer_outcome.why_now.gap && (
                    <div className="text-[10px] text-[#A65F25] italic bg-[#FEF7EC] p-2 rounded border border-[#E9C387] mt-1">
                      ⚠️ GAP: {decisionLayer.customer_outcome.why_now.gap}
                    </div>
                  )}
                </div>

                {/* 3. WHY TRUST */}
                <div className="space-y-1.5 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#1C1917]">WHY TRUST (CƠ SỞ NIỀM TIN TRUNG THỰC)</span>
                    {renderEpistemicBadge(decisionLayer.customer_outcome.why_trust.classification)}
                  </div>
                  <p className="text-xs text-[#4A423C] leading-relaxed">
                    {decisionLayer.customer_outcome.why_trust.statement}
                  </p>
                  {decisionLayer.customer_outcome.why_trust.gap && (
                    <div className="text-[10px] text-[#8C231A] italic bg-[#FBEAE8] p-2 rounded border border-[#E5A39B] mt-1">
                      ⚠️ GAP: {decisionLayer.customer_outcome.why_trust.gap}
                    </div>
                  )}
                </div>

                {/* 4. WHAT YOU GET */}
                <div className="space-y-1.5 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#1C1917]">WHAT YOU GET (TRẢI NGHIỆM THỰC NHẬN)</span>
                    {renderEpistemicBadge(decisionLayer.customer_outcome.what_you_get.classification)}
                  </div>
                  <p className="text-xs text-[#4A423C] leading-relaxed">
                    {decisionLayer.customer_outcome.what_you_get.statement}
                  </p>
                </div>

                {/* 5. PREORDER / DEMAND MECHANISM FRAMEWORK */}
                <div className="space-y-3 p-4 bg-[#F5EFE6] rounded-xl border border-[#DECDBB]">
                  <div className="flex items-center justify-between pb-1 border-b border-[#E5D7C5]">
                    <span className="text-[11px] font-bold text-[#1C1917] uppercase tracking-wide">
                      WHY SHOULD CUSTOMER PREORDER? (3-PILLAR TRIAD)
                    </span>
                    <span className="text-[10px] font-mono text-[#A65F25]">TRIAD CHECK</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2C2825]">
                        <span>• Reason to Care:</span>
                        {renderEpistemicBadge(decisionLayer.customer_outcome.preorder_proposition.reason_to_care.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] pl-3 mt-0.5">
                        {decisionLayer.customer_outcome.preorder_proposition.reason_to_care.statement}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2C2825]">
                        <span>• Reason to Trust:</span>
                        {renderEpistemicBadge(decisionLayer.customer_outcome.preorder_proposition.reason_to_trust.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] pl-3 mt-0.5">
                        {decisionLayer.customer_outcome.preorder_proposition.reason_to_trust.statement}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2C2825]">
                        <span>• Reason to Act Now:</span>
                        {renderEpistemicBadge(decisionLayer.customer_outcome.preorder_proposition.reason_to_act_now.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] pl-3 mt-0.5">
                        {decisionLayer.customer_outcome.preorder_proposition.reason_to_act_now.statement}
                      </p>
                    </div>

                    {decisionLayer.customer_outcome.preorder_proposition.gap && (
                      <div className="text-[10px] text-[#8C5311] italic bg-[#FEF7EC] p-2 rounded border border-[#E9C387] mt-1">
                        ⚠️ GAP TRIAD: {decisionLayer.customer_outcome.preorder_proposition.gap}
                      </div>
                    )}
                  </div>
                </div>

                {/* DEMAND MECHANISM & CTA */}
                <div className="p-3.5 bg-white rounded-xl border border-[#E8E2D9] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#1C1917]">CƠ CHẾ NHU CẦU & CTA:</span>
                    {renderEpistemicBadge(decisionLayer.customer_outcome.demand_mechanism.classification)}
                  </div>
                  <p className="text-xs text-[#5C544E]">{decisionLayer.customer_outcome.demand_mechanism.statement}</p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-2 bg-[#1C1917] text-[#FAF8F5] text-xs font-semibold rounded-lg tracking-wider">
                      CTA: {decisionLayer.customer_outcome.cta}
                    </span>
                  </div>
                </div>

                {/* Customer Outcome Traceability */}
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] font-mono text-[10px] space-y-1 text-[#5C544E]">
                  <span className="font-semibold text-[#1C1917] block">Traceability (Customer Outcome):</span>
                  <p>Proposition: {decisionLayer.customer_outcome.traceability.customer_proposition}</p>
                  <p>Hypothesis: {decisionLayer.customer_outcome.traceability.growth_hypothesis}</p>
                  <p>Evidence IDs: {decisionLayer.customer_outcome.traceability.evidence_ids.join(', ') || 'N/A'}</p>
                </div>
              </div>

              {/* RIGHT COLUMN: PRODUCER OUTCOME / GMR PARTNERSHIP CASE */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E5C2B] font-bold block">
                      RIGHT COLUMN · PRODUCER
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#1C1917]">
                      PRODUCER OUTCOME / GMR PARTNERSHIP CASE
                    </h4>
                  </div>
                  {renderUatToolbar('PRODUCER_OUTCOME', 'PROD-OUTCOME-MAIN')}
                </div>

                {/* 1. PRODUCER PROBLEM */}
                <div className="space-y-1.5 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#1C1917]">PRODUCER PROBLEM (VẤN ĐỀ CỦA NHÀ SẢN XUẤT)</span>
                    {renderEpistemicBadge(decisionLayer.producer_outcome.producer_problem.classification)}
                  </div>
                  <p className="text-xs text-[#8C231A] font-medium leading-relaxed">
                    {decisionLayer.producer_outcome.producer_problem.statement}
                  </p>
                </div>

                {/* 2. GMR VALUE CREATION (5 FRAMEWORKS) */}
                <div className="space-y-2 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE]">
                  <span className="text-[11px] font-semibold text-[#1C1917] block">
                    GMR VALUE CREATION (5 TRỤ CỘT GIÁ TRỊ GMR MANG LẠI)
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                      <div className="flex items-center justify-between">
                        <strong className="text-[11px] text-[#1C1917]">1. Demand Creation (Tạo Nhu Cầu):</strong>
                        {renderEpistemicBadge(decisionLayer.producer_outcome.gmr_value_creation.demand_creation.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">
                        {decisionLayer.producer_outcome.gmr_value_creation.demand_creation.statement}
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                      <div className="flex items-center justify-between">
                        <strong className="text-[11px] text-[#1C1917]">2. Story Packaging (Đóng Gói Câu Chuyện):</strong>
                        {renderEpistemicBadge(decisionLayer.producer_outcome.gmr_value_creation.story_packaging.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">
                        {decisionLayer.producer_outcome.gmr_value_creation.story_packaging.statement}
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                      <div className="flex items-center justify-between">
                        <strong className="text-[11px] text-[#1C1917]">3. Trust Packaging (Đóng Gói Niềm Tin):</strong>
                        {renderEpistemicBadge(decisionLayer.producer_outcome.gmr_value_creation.trust_packaging.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">
                        {decisionLayer.producer_outcome.gmr_value_creation.trust_packaging.statement}
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                      <div className="flex items-center justify-between">
                        <strong className="text-[11px] text-[#1C1917]">4. Market Testing (Thử Nghiệm Thị Trường):</strong>
                        {renderEpistemicBadge(decisionLayer.producer_outcome.gmr_value_creation.market_testing.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">
                        {decisionLayer.producer_outcome.gmr_value_creation.market_testing.statement}
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                      <div className="flex items-center justify-between">
                        <strong className="text-[11px] text-[#1C1917]">5. Market Learning (Học Tập Thị Trường):</strong>
                        {renderEpistemicBadge(decisionLayer.producer_outcome.gmr_value_creation.market_learning.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">
                        {decisionLayer.producer_outcome.gmr_value_creation.market_learning.statement}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. VALUE EXCHANGE (2 PHÍA) */}
                <div className="space-y-3 p-4 bg-[#F2EFE9] rounded-xl border border-[#DDD5CA]">
                  <span className="text-[11px] font-bold text-[#1C1917] uppercase tracking-wide block pb-1 border-b border-[#DDD5CA]">
                    VALUE EXCHANGE (TRAO ĐỔI GIÁ TRỊ SONG HƯỚNG)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Producer Provides */}
                    <div className="space-y-2 p-3 bg-white rounded-lg border border-[#EDE7DE]">
                      <span className="text-[10px] font-bold text-[#A65F25] uppercase tracking-wider block">
                        PRODUCER PROVIDES:
                      </span>
                      <ul className="space-y-1.5 text-[11px]">
                        {decisionLayer.producer_outcome.value_exchange.producer_provides.map((item, idx) => (
                          <li key={idx} className="flex items-start justify-between gap-1 text-[#4A423C]">
                            <span>• {item.item}</span>
                            {renderEpistemicBadge(item.classification)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* GMR Provides */}
                    <div className="space-y-2 p-3 bg-white rounded-lg border border-[#EDE7DE]">
                      <span className="text-[10px] font-bold text-[#1E5C2B] uppercase tracking-wider block">
                        GMR PROVIDES:
                      </span>
                      <ul className="space-y-1.5 text-[11px]">
                        {decisionLayer.producer_outcome.value_exchange.gmr_provides.map((item, idx) => (
                          <li key={idx} className="flex items-start justify-between gap-1 text-[#4A423C]">
                            <span>• {item.item}</span>
                            {renderEpistemicBadge(item.classification)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 4. PRODUCER ASK */}
                <div className="space-y-2 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#1C1917]">
                      PRODUCER ASK (YÊU CẦU ĐẦU VÀO ĐỂ GMR TRIỂN KHAI):
                    </span>
                    <span className="text-[10px] font-mono text-[#7A6B5D]">INPUT REQUIREMENTS</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#5C544E]">
                    <p><strong className="text-[#1C1917]">• Mẻ sản xuất:</strong> {decisionLayer.producer_outcome.producer_ask.batch_information}</p>
                    <p><strong className="text-[#1C1917]">• Thời điểm:</strong> {decisionLayer.producer_outcome.producer_ask.availability}</p>
                    <p><strong className="text-[#1C1917]">• Chính sách giá:</strong> {decisionLayer.producer_outcome.producer_ask.price}</p>
                    <p><strong className="text-[#1C1917]">• Năng lực (Capacity):</strong> {decisionLayer.producer_outcome.producer_ask.capacity}</p>
                    <p><strong className="text-[#1C1917]">• Bằng chứng pháp lý:</strong> {decisionLayer.producer_outcome.producer_ask.evidence}</p>
                    <p><strong className="text-[#1C1917]">• Cam kết giao hàng:</strong> {decisionLayer.producer_outcome.producer_ask.fulfillment_commitment}</p>
                  </div>
                  {decisionLayer.producer_outcome.producer_ask.gap && (
                    <div className="text-[10px] text-[#8C231A] italic bg-[#FBEAE8] p-2 rounded border border-[#E5A39B] mt-1">
                      ⚠️ GAP: {decisionLayer.producer_outcome.producer_ask.gap}
                    </div>
                  )}
                </div>

                {/* 5. PARTNERSHIP HYPOTHESIS & KPI */}
                <div className="p-4 bg-[#F2F7F4] rounded-xl border border-[#BBDAC2] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1E5C2B] uppercase tracking-wide">
                      PARTNERSHIP HYPOTHESIS (GIẢ THUYẾT HỢP TÁC CHIẾN LƯỢC)
                    </span>
                    {renderEpistemicBadge(decisionLayer.producer_outcome.partnership_hypothesis.classification)}
                  </div>
                  <p className="font-serif text-[#14381C] leading-relaxed italic">
                    “{decisionLayer.producer_outcome.partnership_hypothesis.statement}”
                  </p>
                  <div className="pt-1 text-[11px] text-[#2D5A35]">
                    <strong>Thước đo thành công (KPI):</strong> {decisionLayer.producer_outcome.partnership_hypothesis.validation_kpi}
                  </div>
                </div>

                {/* Producer Outcome Traceability */}
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] font-mono text-[10px] space-y-1 text-[#5C544E]">
                  <span className="font-semibold text-[#1C1917] block">Traceability (Producer Outcome):</span>
                  <p>Case: {decisionLayer.producer_outcome.traceability.partnership_case}</p>
                  <p>Diagnosis Dimensions: {decisionLayer.producer_outcome.traceability.growth_diagnosis_keys.join(', ')}</p>
                  <p>Evidence IDs: {decisionLayer.producer_outcome.traceability.evidence_ids.join(', ') || 'N/A'}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* SECTION 12 — TRACEABILITY EXPLORER                                 */}
        {/* ================================================================== */}
        <section className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E0D8CE] text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-serif font-semibold text-[#1C1917]">
              Traceability Chain (Chuỗi truy nguyên khép kín)
            </span>
            <button
              onClick={() => toggleTrace('full_chain')}
              className="text-[#7A6B5D] hover:text-[#1C1917] font-medium"
            >
              {expandedTrace['full_chain'] ? 'Ẩn chuỗi truy nguyên ↑' : 'Mở rộng chuỗi truy nguyên ↓'}
            </button>
          </div>

          {expandedTrace['full_chain'] && (
            <div className="pt-2 border-t border-[#E8E2D9] font-mono text-[11px] space-y-2 text-[#5C544E]">
              <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                <strong>Content Request:</strong> {contentReq?.request_id}
              </div>
              <div className="pl-4">↓ traces to</div>
              <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                <strong>Intervention Plan:</strong> {intervention?.id}
              </div>
              <div className="pl-4">↓ traces to</div>
              <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                <strong>Top Opportunity:</strong> {opportunities?.[0]?.opportunity_id}
              </div>
              <div className="pl-4">↓ traces to</div>
              <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                <strong>Primary Hypothesis:</strong> HYPOTHESIS-PRIMARY ({hypothesis?.statement})
              </div>
              <div className="pl-4">↓ traces to</div>
              <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                <strong>Evidence & Sources:</strong> {evidence.map((e) => e.id).join(', ')} → {coverage?.requested_url}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Content Request Modal */}
      {showContentModal && contentReq && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E8E2D9] max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
              <h4 className="font-serif font-bold text-[#1C1917] text-base">Content Request Specification</h4>
              <button onClick={() => setShowContentModal(false)} className="text-[#8C827A] hover:text-[#1C1917]">✕</button>
            </div>
            <div className="text-xs space-y-3 text-[#5C544E]">
              <p><strong className="text-[#1C1917]">Mã yêu cầu:</strong> {contentReq.request_id}</p>
              <p><strong className="text-[#1C1917]">Nhà sản xuất:</strong> {contentReq.producer_id}</p>
              <p><strong className="text-[#1C1917]">Mục tiêu:</strong> {contentReq.objective}</p>
              <p><strong className="text-[#1C1917]">Vấn đề tăng trưởng:</strong> {contentReq.growth_problem}</p>
              <p><strong className="text-[#1C1917]">Hành vi mong muốn:</strong> {contentReq.target_behavior}</p>
              <div>
                <strong className="text-[#1C1917]">Bằng chứng then chốt (Key Evidence):</strong>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
                  {contentReq.key_evidence.map((ke, idx) => (
                    <li key={idx}>{ke}</li>
                  ))}
                </ul>
              </div>
              <p><strong className="text-[#1C1917]">CTA:</strong> {contentReq.cta}</p>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowContentModal(false)}
                className="px-4 py-2 bg-[#1C1917] text-white text-xs rounded hover:bg-[#332E2A]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review / Note Modal */}
      {activeNoteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E8E2D9] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
              <h4 className="font-serif font-bold text-[#1C1917] text-base">
                Nhập ghi chú thẩm định ({activeNoteTarget.decision})
              </h4>
              <button onClick={() => setActiveNoteTarget(null)} className="text-[#8C827A] hover:text-[#1C1917]">✕</button>
            </div>
            <div className="text-xs space-y-2">
              <p className="text-[#7A6B5D]">
                Đối tượng thẩm định: <strong>{activeNoteTarget.object_id}</strong>
              </p>
              <textarea
                rows={3}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Nhập lý do cần xem lại hoặc điểm chưa chính xác..."
                className="w-full p-2.5 border border-[#D5CEC5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#7A6B5D] text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveNoteTarget(null)}
                className="px-3 py-1.5 border border-[#D5CEC5] rounded text-xs hover:bg-[#F2EEE9]"
              >
                Hủy
              </button>
              <button
                onClick={() =>
                  submitFeedback(
                    activeNoteTarget.object_type,
                    activeNoteTarget.object_id,
                    activeNoteTarget.decision,
                    noteInput
                  )
                }
                disabled={savingNote}
                className="px-4 py-1.5 bg-[#1C1917] text-white rounded text-xs font-medium hover:bg-[#332E2A] transition disabled:opacity-50"
              >
                {savingNote ? 'Đang lưu...' : 'Lưu Phản Hồi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
