'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { M4Experiment, ExperimentDecision } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import {
  Activity,
  TrendingUp,
  Share2,
  ExternalLink,
  ChevronRight,
  Filter,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save
} from 'lucide-react';

export default function AdminExperimentsPage() {
  const [experiments, setExperiments] = useState<M4Experiment[]>([]);
  const [selectedExp, setSelectedExp] = useState<M4Experiment | null>(null);
  const [decision, setDecision] = useState<ExperimentDecision>('KEEP_REVISE');
  const [rationale, setRationale] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchExperiments = async () => {
    try {
      const res = await fetch('/api/admin/experiments');
      const data = await res.json();
      if (data.success) {
        setExperiments(data.experiments);
        if (!selectedExp && data.experiments.length > 0) {
          setSelectedExp(data.experiments[0]);
          setDecision(data.experiments[0].decision || 'KEEP_REVISE');
          setRationale(data.experiments[0].decision_rationale || '');
        }
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleSaveDecision = async () => {
    if (!selectedExp) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experiment_id: selectedExp.experiment_id,
          decision,
          rationale,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        fetchExperiments();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const totalDemand = experiments.reduce((sum, e) => sum + e.confirmed_quantity, 0);
  const totalOrders = experiments.reduce((sum, e) => sum + e.orders, 0);
  const totalViews = experiments.reduce((sum, e) => sum + e.ngan_views, 0);
  const totalShares = experiments.reduce((sum, e) => sum + e.shares, 0);

  return (
    <div className="py-10 px-5 sm:px-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7DFD3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#A65F25] text-[#FAF8F5] text-[10px] font-mono uppercase tracking-pantryst font-bold">
              M4 LIVE EXPERIMENTS
            </span>
            <span className="text-xs text-[#665E58]">7-Day Demand Signal & Learning Matrix</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#141211] mt-1">
            Theo Dõi Thử Nghiệm Thị Trường (M4 Live Validation)
          </h1>
          <p className="text-xs text-[#665E58] mt-1 max-w-2xl">
            North Star: <strong>Confirmed Demand</strong> (Không đo bằng views hay likes). Hệ thống theo dõi phản hồi thực tế từ 3 Ngăn đã đạt chuẩn READY: Cacao OCA, Cà phê Aeroco, Mật ong bạc hà Hà Giang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl border border-[#E7DFD3] text-xs font-semibold text-[#423B36] hover:bg-[#EFE8DC] transition"
          >
            Về Vận Hành
          </Link>
          <Link
            href="/admin/sources"
            className="px-4 py-2 rounded-xl bg-[#141211] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A65F25] transition"
          >
            Kho Nguồn & Thẩm Định
          </Link>
        </div>
      </div>

      {/* Aggregate KPI Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E7DFD3] shadow-pantry space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-pantryst text-[#665E58]">
            Confirmed Demand (North Star)
          </span>
          <p className="font-serif text-3xl font-bold text-[#A65F25]">{totalDemand} Phần</p>
          <span className="text-[11px] text-[#665E58]">Nhu cầu đã xác nhận thực tế</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E7DFD3] shadow-pantry space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-pantryst text-[#665E58]">
            Tổng Số Đơn Hàng
          </span>
          <p className="font-serif text-3xl font-bold text-[#141211]">{totalOrders} Đơn</p>
          <span className="text-[11px] text-[#665E58]">TB {(totalDemand / Math.max(1, totalOrders)).toFixed(1)} phần/đơn</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E7DFD3] shadow-pantry space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-pantryst text-[#665E58]">
            Lượt Xem Ngăn
          </span>
          <p className="font-serif text-3xl font-bold text-[#141211]">{totalViews}</p>
          <span className="text-[11px] text-emerald-700">Tỷ lệ CTA TB ~26.5%</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E7DFD3] shadow-pantry space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-pantryst text-[#665E58]">
            Vòng Lặp Lan Tỏa (Shares)
          </span>
          <p className="font-serif text-3xl font-bold text-[#141211]">{totalShares}</p>
          <span className="text-[11px] text-[#665E58]">Chia sẻ sau khi mở Ngăn</span>
        </div>
      </div>

      {/* 3 LIVE EXPERIMENTS COMPARISON TABLE */}
      <div className="p-8 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#141211]">
              Ma Trận Đo Lường 3 Thử Nghiệm (Comparison Matrix)
            </h2>
            <p className="text-xs text-[#665E58]">
              Theo dõi vận tốc gom (Demand Velocity) và tỷ lệ chuyển đổi Story → Open → Demand
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            3 / 3 EXPERIMENTS ACTIVE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E7DFD3] text-[10px] font-mono uppercase text-[#665E58]">
              <tr>
                <th className="py-3 px-3">Mã Thử Nghiệm</th>
                <th className="py-3 px-3">Sản Vật & Người Làm</th>
                <th className="py-3 px-2 text-right">Lượt Xem</th>
                <th className="py-3 px-2 text-right">CTA Clicks</th>
                <th className="py-3 px-2 text-right">Đơn Hàng</th>
                <th className="py-3 px-2 text-right">Nhu Cầu</th>
                <th className="py-3 px-2 text-right">Mục Tiêu (MOQ)</th>
                <th className="py-3 px-2 text-right">Tiến Độ</th>
                <th className="py-3 px-2 text-right">Vận Tốc (Qty/Ngày)</th>
                <th className="py-3 px-2 text-right">Story→Open</th>
                <th className="py-3 px-2 text-right">Open→Demand</th>
                <th className="py-3 px-3 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DFD3]">
              {experiments.map((exp) => {
                const isSelected = selectedExp?.experiment_id === exp.experiment_id;
                return (
                  <tr
                    key={exp.experiment_id}
                    className={`hover:bg-[#FAF8F5]/80 transition cursor-pointer ${
                      isSelected ? 'bg-[#FAF8F5] font-semibold' : ''
                    }`}
                    onClick={() => {
                      setSelectedExp(exp);
                      setDecision(exp.decision || 'KEEP_REVISE');
                      setRationale(exp.decision_rationale || '');
                    }}
                  >
                    <td className="py-3.5 px-3 font-mono text-[#A65F25] font-bold">
                      {exp.experiment_id}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-serif font-bold text-[#141211]">
                        {exp.ngan_number} · {exp.product_name}
                      </div>
                      <span className="text-[10px] text-[#665E58] font-sans">
                        {exp.producer_name} · GMR Fit: {exp.gmr_fit_score}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono">{exp.ngan_views}</td>
                    <td className="py-3.5 px-2 text-right font-mono">{exp.cta_clicks}</td>
                    <td className="py-3.5 px-2 text-right font-mono font-bold text-[#141211]">{exp.orders}</td>
                    <td className="py-3.5 px-2 text-right font-mono font-bold text-[#A65F25]">
                      {exp.confirmed_quantity}
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono text-[#665E58]">{exp.moq}</td>
                    <td className="py-3.5 px-2 text-right font-mono font-bold text-emerald-700">
                      {exp.progress_percent}%
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono font-bold text-[#141211]">
                      {exp.demand_velocity}
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono">
                      {(exp.story_to_open_rate * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono">
                      {(exp.open_to_demand_rate * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <Link
                        href={`/ngan/${exp.ngan_slug}`}
                        target="_blank"
                        className="text-[#A65F25] hover:underline inline-flex items-center gap-1 font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Xem</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELECTED EXPERIMENT DETAIL: DIAGNOSIS & 3 CONTENT ANGLES */}
      {selectedExp && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: 3 Content Angles & Traffic Attribution */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#141211]">
                  3 Góc Nội Dung Thử Nghiệm (Content Angles)
                </h3>
                <span className="font-mono text-xs text-[#A65F25] font-bold">
                  {selectedExp.experiment_id}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {selectedExp.content_angles.map((ang) => (
                  <div key={ang.id} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#A65F25]">
                        ANGLE {ang.type === 'VUNG_DAT' ? 'A (VÙNG ĐẤT)' : ang.type === 'CON_NGUOI' ? 'B (CON NGƯỜI)' : 'C (CHI TIẾT)'}
                      </span>
                      <span className="text-[10px] font-mono text-[#665E58]">
                        utm_content: <code>{ang.utm_content}</code>
                      </span>
                    </div>
                    <strong className="text-[#141211] block font-serif text-sm">{ang.headline}</strong>
                    <p className="text-[#665E58] italic">{ang.hook}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Attribution */}
            <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-3">
              <h3 className="font-serif text-base font-bold text-[#141211]">
                Nguồn Truy Cập (Traffic Attribution)
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {selectedExp.top_traffic_sources.map((ts, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3]">
                    <span className="text-[10px] uppercase font-mono text-[#665E58] block">{ts.source}</span>
                    <strong className="font-serif text-lg text-[#141211]">{ts.orders} Đơn</strong>
                    <span className="text-[10px] text-[#665E58] block">({ts.views} views)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Diagnosis & Decision Framework */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E7DFD3] shadow-pantry space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#A65F25]" />
                <h3 className="font-serif text-lg font-bold text-[#141211]">
                  Chẩn Đoán Nhu Cầu & Tín Hiệu (Learning)
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#E7DFD3]">
                  <span className="font-bold text-[#A65F25] block text-[10px] uppercase">Tín Hiệu Khách Hàng:</span>
                  <p className="text-[#423B36] mt-0.5">{selectedExp.learning?.customer_signal}</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E7DFD3]">
                  <span className="font-bold text-emerald-800 block text-[10px] uppercase">Điểm Thành Công (What worked):</span>
                  <ul className="list-disc list-inside mt-0.5 text-[#423B36] space-y-0.5">
                    {selectedExp.learning?.what_worked.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E7DFD3]">
                  <span className="font-bold text-amber-800 block text-[10px] uppercase">Điểm Cần Tinh Chỉnh (What did not):</span>
                  <ul className="list-disc list-inside mt-0.5 text-[#423B36] space-y-0.5">
                    {selectedExp.learning?.what_did_not.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Decision Framework (Day 7 Protocol) */}
            <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] shadow-pantry space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#141211]">
                  Khung Ra Quyết Định (Day 7 Decision)
                </h3>
                {saveSuccess && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Đã lưu quyết định!
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#665E58] block">Phân loại quyết định:</label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value as ExperimentDecision)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-xs font-bold text-[#141211]"
                  >
                    <option value="SCALE">SCALE (Nhu cầu mạnh + Câu chuyện sâu → Tiếp tục mở rộng)</option>
                    <option value="KEEP_REVISE">KEEP & REVISE (Có nhu cầu nhưng còn điểm nghẽn UX/Offer → Tinh chỉnh)</option>
                    <option value="HOLD">HOLD (Tín hiệu thú vị nhưng chưa đủ dữ liệu → Thu thập thêm)</option>
                    <option value="KILL">KILL (Nhu cầu yếu dù traffic và trải nghiệm đã chuẩn mực → Dừng)</option>
                    <option value="INSUFFICIENT_DATA">INSUFFICIENT_DATA (Chưa đủ lưu lượng/dữ liệu để phán xét)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#665E58] block">Lý do & Kế hoạch hành động:</label>
                  <textarea
                    rows={3}
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Ghi nhận căn cứ ra quyết định dựa trên dữ liệu thật (Không chỉ dựa trên cảm tính)..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] text-xs text-[#141211]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveDecision}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-[#141211] text-white text-xs font-semibold hover:bg-[#A65F25] transition inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Đang lưu...' : 'Ghi Nhận Quyết Định'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
