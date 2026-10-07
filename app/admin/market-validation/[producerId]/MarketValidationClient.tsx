'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ProducerGrowthRunOutput,
  MarketValidationDecision,
  MarketValidationFeedbackRecord,
  InternalMarketLearningRecord,
  EpistemicClassification,
} from '@/types';

interface MarketValidationClientProps {
  producerId: string;
  initialRun: ProducerGrowthRunOutput | null;
  initialFeedback: MarketValidationFeedbackRecord[];
  initialLearnings: InternalMarketLearningRecord[];
}

export default function MarketValidationClient({
  producerId,
  initialRun,
  initialFeedback = [],
  initialLearnings = [],
}: MarketValidationClientProps) {
  const [feedbacks, setFeedbacks] = useState<MarketValidationFeedbackRecord[]>(initialFeedback);
  const [learnings, setLearnings] = useState<InternalMarketLearningRecord[]>(initialLearnings);

  // Active Feedback Modal State
  const [activeFeedbackTarget, setActiveFeedbackTarget] = useState<{
    target_pillar: MarketValidationFeedbackRecord['target_pillar'];
    object_id: string;
    object_title: string;
  } | null>(null);
  const [feedbackDecision, setFeedbackDecision] = useState<MarketValidationDecision>('CLEAR');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [reviewerName, setReviewerName] = useState('Quỳnh (Internal Reviewer)');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Active Learning Form Modal State
  const [showLearningModal, setShowLearningModal] = useState(false);
  const [learningPillar, setLearningPillar] = useState<InternalMarketLearningRecord['target_pillar']>('CUSTOMER_OUTCOME');
  const [learningObservation, setLearningObservation] = useState('');
  const [learningInterpretation, setLearningInterpretation] = useState('');
  const [learningHypothesis, setLearningHypothesis] = useState('');
  const [learningNextTest, setLearningNextTest] = useState('');
  const [isSubmittingLearning, setIsSubmittingLearning] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);

  if (!initialRun) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-8 flex items-center justify-center font-sans text-[#2C2825]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E8E2D9] text-center space-y-4 shadow-sm">
          <div className="text-3xl">⚠️</div>
          <h2 className="text-lg font-serif font-bold text-[#1C1917]">Chưa tìm thấy dữ liệu Market Test</h2>
          <p className="text-xs text-[#6B635B] leading-relaxed">
            Chưa có Growth Decision Run cho nhà sản xuất: <strong>{producerId}</strong>.
          </p>
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

  const run = initialRun;
  const decisionLayer = run.decision_layer;
  const intel = run.producer_intelligence;
  const cust = decisionLayer?.customer_outcome;
  const prod = decisionLayer?.producer_outcome;

  // Epistemic badge
  const renderEpistemicBadge = (classification: EpistemicClassification | string) => {
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

  // Feedback badge styling
  const renderDecisionBadge = (decision: MarketValidationDecision) => {
    switch (decision) {
      case 'CLEAR':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#EAF5EC] text-[#1E4D2B] border border-[#A7D7AF]">✓ CLEAR</span>;
      case 'UNCLEAR':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#FEF7EC] text-[#8C5311] border border-[#E9C387]">? UNCLEAR</span>;
      case 'NOT_CONVINCING':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#FFF1F0] text-[#CF1322] border border-[#FFA39E]">⚡ NOT_CONVINCING</span>;
      case 'WRONG':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#FBEAE8] text-[#991B1B] border border-[#F87171]">✕ WRONG</span>;
      case 'MISSING_EVIDENCE':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#F5222D] text-white font-mono">! MISSING_EVIDENCE</span>;
    }
  };

  // Open feedback modal
  const openFeedbackModal = (
    target_pillar: MarketValidationFeedbackRecord['target_pillar'],
    object_id: string,
    object_title: string
  ) => {
    setActiveFeedbackTarget({ target_pillar, object_id, object_title });
    setFeedbackDecision('CLEAR');
    setFeedbackComment('');
  };

  // Submit Feedback
  const handleSubmitFeedback = async () => {
    if (!activeFeedbackTarget) return;
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch('/api/admin/growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_MARKET_VALIDATION_FEEDBACK',
          producer_id: producerId,
          target_pillar: activeFeedbackTarget.target_pillar,
          object_id: activeFeedbackTarget.object_id,
          decision: feedbackDecision,
          comment: feedbackComment,
          reviewer: reviewerName,
        }),
      });
      const data = await res.json();
      if (data.success && data.record) {
        setFeedbacks((prev) => [data.record, ...prev]);
        setNotification(`Đã ghi nhận phản hồi [${feedbackDecision}] cho ${activeFeedbackTarget.object_title}`);
        setTimeout(() => setNotification(null), 3000);
        setActiveFeedbackTarget(null);
      }
    } catch {
      setNotification('Lỗi kết nối khi lưu phản hồi');
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Submit Internal Market Learning
  const handleSubmitLearning = async () => {
    if (!learningObservation || !learningHypothesis) {
      alert('Vui lòng nhập Observation và Hypothesis');
      return;
    }
    setIsSubmittingLearning(true);
    try {
      const res = await fetch('/api/admin/growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RECORD_INTERNAL_MARKET_LEARNING',
          producer_id: producerId,
          target_pillar: learningPillar,
          observation: learningObservation,
          interpretation: learningInterpretation,
          hypothesis: learningHypothesis,
          next_test: learningNextTest,
        }),
      });
      const data = await res.json();
      if (data.success && data.record) {
        setLearnings((prev) => [data.record, ...prev]);
        setNotification('Đã lưu bài học thị trường nội bộ (Market Learning) thành công');
        setTimeout(() => setNotification(null), 3000);
        setShowLearningModal(false);
        setLearningObservation('');
        setLearningInterpretation('');
        setLearningHypothesis('');
        setLearningNextTest('');
      }
    } catch {
      setNotification('Lỗi kết nối khi ghi nhận Market Learning');
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSubmittingLearning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2825] font-sans pb-24">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#1C1917] text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-[#3E3935] flex items-center gap-3">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-[#A89F91] hover:text-white">✕</button>
        </div>
      )}

      {/* Header Container */}
      <div className="bg-[#1C1917] text-[#FAF7F2] border-b border-[#332B25] py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-300">
                <span>Gạc Măng Rê · Growth Intelligence Layer</span>
                <span>/</span>
                <span>Internal Market Validation v0.1</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2] mt-1">
                Internal Market Test Room — {intel?.identity?.name || producerId}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/growth/producer/${producerId}`}
                className="text-xs px-3.5 py-1.5 border border-[#52443A] rounded-lg text-[#E6DED5] hover:bg-[#2A231E] transition"
              >
                ← Về Review Room
              </Link>
              <button
                onClick={() => setShowLearningModal(true)}
                className="text-xs px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-[#1C1917] font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm"
              >
                <span>💡</span> Ghi nhận Market Learning
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#26201C] rounded-xl border border-[#3E342D] text-xs text-[#D5CEC5] grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-[#9E9185] block text-[10px] uppercase font-mono">Trạng thái thẩm định:</span>
              <strong className="text-emerald-400 font-mono text-sm">INTERNAL TEST COMPLETED</strong>
              <p className="text-[11px] text-[#A89D91] mt-0.5">Không đồng nhất internal test với market validated thật</p>
            </div>
            <div>
              <span className="text-[#9E9185] block text-[10px] uppercase font-mono">Đơn vị thử nghiệm:</span>
              <span className="font-semibold text-white">{intel?.identity?.name}</span> ({intel?.place?.geography})
            </div>
            <div>
              <span className="text-[#9E9185] block text-[10px] uppercase font-mono">Nguyên tắc cốt lõi:</span>
              <span className="italic">Observation ≠ Verified Fact. Giữ nguyên ranh giới Epistemic & Brand Gate.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* ================================================================== */}
        {/* ROOM CORE: 2 PHÒNG TEST SONG HÀNH (DUAL TEST ROOM)                 */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ================================================================ */}
          {/* A. CUSTOMER TEST ROOM: "MUA VÌ SAO?"                              */}
          {/* ================================================================ */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A65F25] font-bold block">
                  PHÒNG 01 · GÓC NHÌN NGƯỜI MUA
                </span>
                <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                  CUSTOMER TEST — “MUA VÌ SAO?”
                </h2>
                <p className="text-xs text-[#7A6B5D] mt-0.5">
                  Câu hỏi kiểm chứng: <em>“Nếu tôi là khách hàng, tôi có hiểu tại sao mình nên quan tâm và đặt trước không?”</em>
                </p>
              </div>
              <button
                onClick={() => openFeedbackModal('CUSTOMER_OUTCOME', 'CUST-OVERALL', 'Tổng thể đề xuất người mua')}
                className="px-2.5 py-1 text-[11px] bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg hover:bg-[#F2EFE9] text-[#5C544E] font-medium"
              >
                Đánh giá Đề xuất
              </button>
            </div>

            {cust ? (
              <div className="space-y-4">
                {/* 1. WHY THIS */}
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">01 · WHY THIS (VÌ SAO CHỌN SẢN VẬT NÀY?)</span>
                    <div className="flex items-center gap-2">
                      {renderEpistemicBadge(cust.why_this.classification)}
                      <button
                        onClick={() => openFeedbackModal('CUSTOMER_OUTCOME', 'CUST-WHY-THIS', 'Customer: Why This')}
                        className="text-[10px] text-[#A65F25] underline hover:text-[#864918]"
                      >
                        Phản hồi
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A423C] leading-relaxed">{cust.why_this.statement}</p>
                  {cust.why_this.evidence_ids && (
                    <div className="text-[10px] font-mono text-[#8C827A]">
                      Evidence: {cust.why_this.evidence_ids.join(', ')}
                    </div>
                  )}
                </div>

                {/* 2. WHY TRUST */}
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">02 · WHY TRUST (CƠ SỞ ĐỂ TIN CẬY?)</span>
                    <div className="flex items-center gap-2">
                      {renderEpistemicBadge(cust.why_trust.classification)}
                      <button
                        onClick={() => openFeedbackModal('CUSTOMER_OUTCOME', 'CUST-WHY-TRUST', 'Customer: Why Trust')}
                        className="text-[10px] text-[#A65F25] underline hover:text-[#864918]"
                      >
                        Phản hồi
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A423C] leading-relaxed">{cust.why_trust.statement}</p>
                  {cust.why_trust.gap && (
                    <div className="text-[10px] text-[#8C231A] italic bg-[#FBEAE8] p-2 rounded border border-[#E5A39B]">
                      ⚠️ GAP CẦN MINH CHỨNG: {cust.why_trust.gap}
                    </div>
                  )}
                </div>

                {/* 3. WHAT YOU GET */}
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">03 · WHAT YOU GET (TRẢI NGHIỆM THỰC NHẬN)</span>
                    <div className="flex items-center gap-2">
                      {renderEpistemicBadge(cust.what_you_get.classification)}
                      <button
                        onClick={() => openFeedbackModal('CUSTOMER_OUTCOME', 'CUST-WHAT-GET', 'Customer: What You Get')}
                        className="text-[10px] text-[#A65F25] underline hover:text-[#864918]"
                      >
                        Phản hồi
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A423C] leading-relaxed">{cust.what_you_get.statement}</p>
                </div>

                {/* 4. WHY PREORDER TRIAD */}
                <div className="p-4 bg-[#F5EFE6] rounded-xl border border-[#DECDBB] space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-[#E5D7C5]">
                    <span className="text-xs font-bold text-[#1C1917]">
                      04 · WHY PREORDER? (3-PILLAR TRIAD CHECK)
                    </span>
                    <button
                      onClick={() => openFeedbackModal('CUSTOMER_OUTCOME', 'CUST-PREORDER-TRIAD', 'Customer: Preorder Triad')}
                      className="text-[10px] text-[#A65F25] underline hover:text-[#864918]"
                    >
                      Phản hồi Triad
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#2C2825] text-[11px]">
                        <span>• Reason to Care:</span>
                        {renderEpistemicBadge(cust.preorder_proposition.reason_to_care.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] pl-3 mt-0.5">
                        {cust.preorder_proposition.reason_to_care.statement}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#2C2825] text-[11px]">
                        <span>• Reason to Trust:</span>
                        {renderEpistemicBadge(cust.preorder_proposition.reason_to_trust.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] pl-3 mt-0.5">
                        {cust.preorder_proposition.reason_to_trust.statement}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#2C2825] text-[11px]">
                        <span>• Reason to Act Now:</span>
                        {renderEpistemicBadge(cust.preorder_proposition.reason_to_act_now.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] pl-3 mt-0.5">
                        {cust.preorder_proposition.reason_to_act_now.statement}
                      </p>
                    </div>
                    {cust.preorder_proposition.gap && (
                      <div className="text-[10px] text-[#8C5311] italic bg-[#FEF7EC] p-2 rounded border border-[#E9C387]">
                        ⚠️ GAP TRIAD: {cust.preorder_proposition.gap}
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. DEMAND MECHANISM & CTA */}
                <div className="p-4 bg-white rounded-xl border border-[#E8E2D9] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">05 · DEMAND MECHANISM & CTA</span>
                    {renderEpistemicBadge(cust.demand_mechanism.classification)}
                  </div>
                  <p className="text-xs text-[#5C544E] leading-relaxed">{cust.demand_mechanism.statement}</p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-2 bg-[#1C1917] text-[#FAF8F5] text-xs font-semibold rounded-lg tracking-wider">
                      CTA: {cust.cta}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#8C827A] italic">Chưa có dữ liệu Customer Outcome.</div>
            )}
          </div>

          {/* ================================================================ */}
          {/* B. PRODUCER TEST ROOM: “HỢP TÁC VÌ SAO? (WHY GMR?)”              */}
          {/* ================================================================ */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1E5C2B] font-bold block">
                  PHÒNG 02 · GÓC NHÌN ĐỐI TÁC SẢN XUẤT
                </span>
                <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                  PRODUCER TEST — WHY GMR?
                </h2>
                <p className="text-xs text-[#7A6B5D] mt-0.5">
                  Câu hỏi kiểm chứng: <em>“Nếu tôi là nhà sản xuất, tôi có thấy lý do đủ rõ để hợp tác với GMR không?”</em>
                </p>
              </div>
              <button
                onClick={() => openFeedbackModal('PRODUCER_OUTCOME', 'PROD-OVERALL', 'Tổng thể đề xuất hợp tác')}
                className="px-2.5 py-1 text-[11px] bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg hover:bg-[#F2EFE9] text-[#5C544E] font-medium"
              >
                Đánh giá Hợp tác
              </button>
            </div>

            {prod ? (
              <div className="space-y-4">
                {/* 1. PRODUCER PROBLEM */}
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">01 · PRODUCER PROBLEM</span>
                    <div className="flex items-center gap-2">
                      {renderEpistemicBadge(prod.producer_problem.classification)}
                      <button
                        onClick={() => openFeedbackModal('PRODUCER_OUTCOME', 'PROD-PROBLEM', 'Producer Problem')}
                        className="text-[10px] text-[#1E5C2B] underline hover:text-[#143E1D]"
                      >
                        Phản hồi
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#8C231A] font-medium leading-relaxed">{prod.producer_problem.statement}</p>
                </div>

                {/* 2. GMR VALUE CREATION */}
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-[#EDE7DE]">
                    <span className="text-xs font-bold text-[#1C1917]">02 · GMR VALUE CREATION (5 TRỤ CỘT)</span>
                    <button
                      onClick={() => openFeedbackModal('PRODUCER_OUTCOME', 'PROD-VALUE-CREATION', 'GMR Value Creation')}
                      className="text-[10px] text-[#1E5C2B] underline hover:text-[#143E1D]"
                    >
                      Phản hồi Giá trị
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-[#EDE7DE]">
                      <div className="flex items-center justify-between text-[11px]">
                        <strong>1. Demand Creation:</strong>
                        {renderEpistemicBadge(prod.gmr_value_creation.demand_creation.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">{prod.gmr_value_creation.demand_creation.statement}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#EDE7DE]">
                      <div className="flex items-center justify-between text-[11px]">
                        <strong>2. Story Packaging:</strong>
                        {renderEpistemicBadge(prod.gmr_value_creation.story_packaging.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">{prod.gmr_value_creation.story_packaging.statement}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#EDE7DE]">
                      <div className="flex items-center justify-between text-[11px]">
                        <strong>3. Trust Packaging:</strong>
                        {renderEpistemicBadge(prod.gmr_value_creation.trust_packaging.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">{prod.gmr_value_creation.trust_packaging.statement}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#EDE7DE]">
                      <div className="flex items-center justify-between text-[11px]">
                        <strong>4. Market Testing:</strong>
                        {renderEpistemicBadge(prod.gmr_value_creation.market_testing.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">{prod.gmr_value_creation.market_testing.statement}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#EDE7DE]">
                      <div className="flex items-center justify-between text-[11px]">
                        <strong>5. Market Learning:</strong>
                        {renderEpistemicBadge(prod.gmr_value_creation.market_learning.classification)}
                      </div>
                      <p className="text-[11px] text-[#5C544E] mt-0.5">{prod.gmr_value_creation.market_learning.statement}</p>
                    </div>
                  </div>
                </div>

                {/* 3. VALUE EXCHANGE */}
                <div className="p-4 bg-[#F2EFE9] rounded-xl border border-[#DDD5CA] space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-[#DDD5CA]">
                    <span className="text-xs font-bold text-[#1C1917]">03 · VALUE EXCHANGE (SONG HƯỚNG)</span>
                    <button
                      onClick={() => openFeedbackModal('PRODUCER_OUTCOME', 'PROD-EXCHANGE', 'Value Exchange')}
                      className="text-[10px] text-[#1E5C2B] underline hover:text-[#143E1D]"
                    >
                      Phản hồi Trao đổi
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded border border-[#EDE7DE] space-y-1">
                      <strong className="text-[10px] text-[#A65F25] uppercase block">PRODUCER PROVIDES:</strong>
                      {prod.value_exchange.producer_provides.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-1 text-[11px]">
                          <span>• {item.item}</span>
                          {renderEpistemicBadge(item.classification)}
                        </div>
                      ))}
                    </div>
                    <div className="p-2.5 bg-white rounded border border-[#EDE7DE] space-y-1">
                      <strong className="text-[10px] text-[#1E5C2B] uppercase block">GMR PROVIDES:</strong>
                      {prod.value_exchange.gmr_provides.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-1 text-[11px]">
                          <span>• {item.item}</span>
                          {renderEpistemicBadge(item.classification)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. PRODUCER ASK */}
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">04 · PRODUCER ASK (YÊU CẦU ĐẦU VÀO)</span>
                    <button
                      onClick={() => openFeedbackModal('PRODUCER_OUTCOME', 'PROD-ASK', 'Producer Ask')}
                      className="text-[10px] text-[#1E5C2B] underline hover:text-[#143E1D]"
                    >
                      Phản hồi Đầu vào
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#5C544E]">
                    <p>• Mẻ: {prod.producer_ask.batch_information}</p>
                    <p>• Thời điểm: {prod.producer_ask.availability}</p>
                    <p>• Giá: {prod.producer_ask.price}</p>
                    <p>• Năng lực: {prod.producer_ask.capacity}</p>
                    <p>• Bằng chứng: {prod.producer_ask.evidence}</p>
                    <p>• Giao hàng: {prod.producer_ask.fulfillment_commitment}</p>
                  </div>
                  {prod.producer_ask.gap && (
                    <div className="text-[10px] text-[#8C231A] italic bg-[#FBEAE8] p-2 rounded border border-[#E5A39B]">
                      ⚠️ GAP ĐẦU VÀO: {prod.producer_ask.gap}
                    </div>
                  )}
                </div>

                {/* 5. SUCCESS KPI & PARTNERSHIP HYPOTHESIS */}
                <div className="p-4 bg-[#F2F7F4] rounded-xl border border-[#BBDAC2] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E5C2B]">05 · PARTNERSHIP HYPOTHESIS & KPI</span>
                    {renderEpistemicBadge(prod.partnership_hypothesis.classification)}
                  </div>
                  <p className="font-serif text-[#14381C] leading-relaxed italic">
                    “{prod.partnership_hypothesis.statement}”
                  </p>
                  <p className="text-[11px] text-[#2D5A35]">
                    <strong>KPI Xác thực:</strong> {prod.partnership_hypothesis.validation_kpi}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#8C827A] italic">Chưa có dữ liệu Producer Outcome.</div>
            )}
          </div>
        </div>

        {/* ================================================================== */}
        {/* C. FEEDBACK LOG TABLE (LƯU TRỮ PHẢN HỒI ĐỘC LẬP)                   */}
        {/* ================================================================== */}
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
            <div>
              <h3 className="font-serif text-base font-bold text-[#1C1917]">
                FEEDBACK LOG — PHẢN HỒI THỰC TẾ CỦA REVIEWER ({feedbacks.length})
              </h3>
              <p className="text-xs text-[#7A6B5D]">
                Ghi nhận trung thực mọi quan sát CLEAR / UNCLEAR / NOT_CONVINCING / WRONG / MISSING_EVIDENCE
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD5CA]">
              IMMUTABLE OBSERVATIONS
            </span>
          </div>

          {feedbacks.length === 0 ? (
            <div className="text-xs text-[#8C827A] italic py-4 text-center">
              Chưa có phản hồi nào được ghi nhận cho phòng thử nghiệm này. Bấm nút “Phản hồi” ở các phần phía trên để gửi đánh giá.
            </div>
          ) : (
            <div className="divide-y divide-[#F0EBE3] text-xs">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {renderDecisionBadge(fb.decision)}
                      <span className="font-semibold text-[#1C1917]">{fb.object_id}</span>
                      <span className="text-[10px] text-[#8C827A] font-mono">[{fb.target_pillar}]</span>
                    </div>
                    {fb.comment && <p className="text-[#4A423C] text-[11px] pl-1">💬 {fb.comment}</p>}
                  </div>
                  <div className="text-[10px] text-[#8C827A] font-mono sm:text-right shrink-0">
                    <div>{fb.reviewer}</div>
                    <div>{new Date(fb.created_at).toLocaleTimeString('vi-VN')} {new Date(fb.created_at).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================================================================== */}
        {/* D. INTERNAL MARKET LEARNING LOG (OBSERVATION -> HYPOTHESIS)         */}
        {/* ================================================================== */}
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
            <div>
              <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
                <span>MARKET LEARNING LOG — BÀI HỌC THỊ TRƯỜNG NỘI BỘ ({learnings.length})</span>
              </h3>
              <p className="text-xs text-[#7A6B5D]">
                Chuỗi học tập khép kín: Observation → Interpretation → Hypothesis → Next Test (Source: INTERNAL_TEST)
              </p>
            </div>
            <button
              onClick={() => setShowLearningModal(true)}
              className="text-xs px-3 py-1.5 bg-[#1C1917] text-white rounded-lg hover:bg-[#332B25] transition"
            >
              + Thêm Record
            </button>
          </div>

          {learnings.length === 0 ? (
            <div className="text-xs text-[#8C827A] italic py-4 text-center">
              Chưa có bản ghi Market Learning nào. Ghi nhận bài học rút ra từ các quan sát để hoàn thiện proposition trước vòng Audit.
            </div>
          ) : (
            <div className="space-y-3">
              {learnings.map((lrn) => (
                <div key={lrn.id} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE7DE] text-xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#EDE7DE]">
                    <span className="font-mono text-[10px] font-bold text-[#A65F25]">
                      {lrn.id} · [{lrn.target_pillar}]
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#EDE7DE] text-[#5C544E]">
                      SOURCE: {lrn.source}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
                    <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                      <strong className="text-[#1C1917] block mb-0.5">Observation (Quan sát):</strong>
                      <span className="text-[#5C544E]">{lrn.observation}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                      <strong className="text-[#1C1917] block mb-0.5">Interpretation (Góc nhìn):</strong>
                      <span className="text-[#5C544E]">{lrn.interpretation || 'Chưa phân tích thêm'}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                      <strong className="text-[#1C1917] block mb-0.5">Hypothesis (Giả thuyết mới):</strong>
                      <span className="text-[#8C5311] font-medium">{lrn.hypothesis}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#EDE7DE]">
                      <strong className="text-[#1C1917] block mb-0.5">Next Test (Thử nghiệm tới):</strong>
                      <span className="text-[#1E5C2B] font-medium">{lrn.next_test || 'Kiểm chứng thực địa'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ================================================================== */}
      {/* MODAL: SUBMIT REVIEW FEEDBACK                                      */}
      {/* ================================================================== */}
      {activeFeedbackTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D9] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
              <h4 className="font-serif font-bold text-[#1C1917] text-base">
                Đánh giá: {activeFeedbackTarget.object_title}
              </h4>
              <button onClick={() => setActiveFeedbackTarget(null)} className="text-[#8C827A] hover:text-[#1C1917]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#7A6B5D] font-medium mb-1">Kết quả đánh giá:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['CLEAR', 'UNCLEAR', 'NOT_CONVINCING', 'WRONG', 'MISSING_EVIDENCE'] as MarketValidationDecision[]).map((dec) => (
                    <button
                      key={dec}
                      type="button"
                      onClick={() => setFeedbackDecision(dec)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-semibold transition ${
                        feedbackDecision === dec
                          ? 'bg-[#1C1917] text-white border-[#1C1917]'
                          : 'bg-[#FAF8F5] text-[#4A423C] border-[#EDE7DE] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      {dec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#7A6B5D] font-medium mb-1">Nhận xét chi tiết (Comment):</label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Giải thích vì sao chưa thuyết phục hoặc điểm còn thiếu..."
                  className="w-full p-2.5 border border-[#D5CEC5] rounded-lg bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#7A6B5D]"
                />
              </div>

              <div>
                <label className="block text-[#7A6B5D] font-medium mb-1">Người thẩm định (Reviewer):</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full p-2 border border-[#D5CEC5] rounded-lg bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#7A6B5D]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EBE3]">
              <button
                onClick={() => setActiveFeedbackTarget(null)}
                className="px-3.5 py-1.5 border border-[#D5CEC5] rounded-lg text-xs hover:bg-[#F2EEE9]"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmittingFeedback}
                className="px-4 py-1.5 bg-[#1C1917] text-white rounded-lg text-xs font-medium hover:bg-[#332E2A] transition disabled:opacity-50"
              >
                {isSubmittingFeedback ? 'Đang lưu...' : 'Lưu Phản Hồi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: RECORD INTERNAL MARKET LEARNING                              */}
      {/* ================================================================== */}
      {showLearningModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D9] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
              <h4 className="font-serif font-bold text-[#1C1917] text-base">
                Ghi nhận Bài học Thị trường Nội bộ (Market Learning)
              </h4>
              <button onClick={() => setShowLearningModal(false)} className="text-[#8C827A] hover:text-[#1C1917]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="text-[11px] text-[#7A6B5D] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EDE7DE]">
                Nguồn bắt buộc: <strong>INTERNAL_TEST</strong> · Nghiêm cấm coi nhận xét là Verified Fact.
              </div>

              <div>
                <label className="block text-[#7A6B5D] font-medium mb-1">Trụ cột đánh giá (Target Pillar):</label>
                <select
                  value={learningPillar}
                  onChange={(e) => setLearningPillar(e.target.value as any)}
                  className="w-full p-2 border border-[#D5CEC5] rounded-lg bg-[#FAF8F5] text-xs"
                >
                  <option value="CUSTOMER_OUTCOME">Customer Outcome (Ngăn Proposition)</option>
                  <option value="PRODUCER_OUTCOME">Producer Outcome (GMR Partnership)</option>
                  <option value="GROWTH_SNAPSHOT">Growth Snapshot</option>
                </select>
              </div>

              <div>
                <label className="block text-[#7A6B5D] font-medium mb-1">1. Observation (Quan sát thực tế từ reviewer):</label>
                <textarea
                  rows={2}
                  value={learningObservation}
                  onChange={(e) => setLearningObservation(e.target.value)}
                  placeholder="Ví dụ: Khách hàng chưa thấy lý do cần mua ngay bây giờ vì thiếu thông tin mùa vụ..."
                  className="w-full p-2.5 border border-[#D5CEC5] rounded-lg bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#7A6B5D]"
                />
              </div>

              <div>
                <label className="block text-[#7A6B5D] font-medium mb-1">2. Interpretation (Phân tích nguyên nhân):</label>
                <textarea
                  rows={2}
                  value={learningInterpretation}
                  onChange={(e) => setLearningInterpretation(e.target.value)}
                  placeholder="Ví dụ: Do thiếu bản scan lịch hạ mẻ từ xưởng..."
                  className="w-full p-2.5 border border-[#D5CEC5] rounded-lg bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#7A6B5D]"
                />
              </div>

              <div>
                <label className="block text-[#7A6B5D] font-medium mb-1">3. Hypothesis (Giả thuyết điều chỉnh):</label>
                <textarea
                  rows={2}
                  value={learningHypothesis}
                  onChange={(e) => setLearningHypothesis(e.target.value)}
                  placeholder="Ví dụ: Nếu bổ sung ngày đóng gói dự kiến của mẻ thì tỷ lệ tin cậy tăng..."
                  className="w-full p-2.5 border border-[#D5CEC5] rounded-lg bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#7A6B5D]"
                />
              </div>

              <div>
                <label className="block text-[#7A6B5D] font-medium mb-1">4. Next Test (Thử nghiệm tiếp theo):</label>
                <input
                  type="text"
                  value={learningNextTest}
                  onChange={(e) => setLearningNextTest(e.target.value)}
                  placeholder="Ví dụ: Bổ sung câu hỏi trong Producer Ask và chạy lại room test..."
                  className="w-full p-2 border border-[#D5CEC5] rounded-lg bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#7A6B5D]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EBE3]">
              <button
                onClick={() => setShowLearningModal(false)}
                className="px-3.5 py-1.5 border border-[#D5CEC5] rounded-lg text-xs hover:bg-[#F2EEE9]"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitLearning}
                disabled={isSubmittingLearning}
                className="px-4 py-1.5 bg-[#1C1917] text-white rounded-lg text-xs font-medium hover:bg-[#332E2A] transition disabled:opacity-50"
              >
                {isSubmittingLearning ? 'Đang lưu...' : 'Lưu Market Learning'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
