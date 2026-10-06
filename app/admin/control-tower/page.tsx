'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { AuditLog, ErrorLog, GmrModule } from '@/types';

export default function ControlTowerPage() {
  const [health, setHealth] = useState<any>(null);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [searchCorrelation, setSearchCorrelation] = useState('');
  const [tracedJourney, setTracedJourney] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'health' | 'audit_log' | 'trace' | 'matrix' | 'recovery'>('health');

  const fetchHealthAndAudits = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch System Health
      const healthRes = await fetch('/api/admin/audit?mode=health');
      const healthData = await healthRes.json();
      if (healthData.success) setHealth(healthData.health);

      // 2. Fetch Audits
      const url = selectedModule !== 'ALL'
        ? `/api/admin/audit?module=${selectedModule}`
        : '/api/admin/audit';
      const auditRes = await fetch(url);
      const auditData = await auditRes.json();
      if (auditData.success) setAudits(auditData.audits);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthAndAudits();
  }, [selectedModule]);

  const handleTrace = async (corrId?: string) => {
    const idToTrace = corrId || searchCorrelation.trim();
    if (!idToTrace) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/audit?correlation_id=${encodeURIComponent(idToTrace)}`);
      const data = await res.json();
      if (data.success) {
        setTracedJourney(data.trace);
        setActiveView('trace');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const auditMatrix = [
    { module: 'Source', data: '✓', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: '—' },
    { module: 'Curation', data: '✓', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: '—' },
    { module: 'Story', data: '✓', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: '—' },
    { module: 'Ngăn', data: '✓', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: '—' },
    { module: 'Order', data: '✓', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: '—' },
    { module: 'Automation', data: '—', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: 'Make/Zalo' },
    { module: 'Fulfillment', data: '✓', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: 'Manual/GHN' },
    { module: 'QR Engine', data: '✓', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: 'Opaque Crypto' },
    { module: 'Loyalty', data: '✓', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: 'Point Ledger' },
    { module: 'CRM Bridge', data: '✓', state: '✓', event: '✓', audit: '✓', error: '✓', trace: '✓', adapter: 'Customer Bridge' },
  ];

  return (
    <div className="py-10 px-5 sm:px-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7DFD3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#141211] text-[#FAF8F5] text-[10px] font-mono uppercase tracking-pantryst font-bold">
              AUDIT FOUNDATION
            </span>
            <span className="text-xs text-[#665E58]">GMR PM Control Tower · Traceability & Observability</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#141211] mt-1">
            Control Tower & Observability
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchHealthAndAudits()}
            className="p-2.5 rounded-2xl bg-[#EFE8DC] text-[#141211] hover:bg-[#E7DFD3] transition"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-2xl bg-[#141211] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A65F25] transition"
          >
            Về Admin Core
          </Link>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E7DFD3] pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveView('health')}
          className={`px-4 py-2 rounded-xl transition ${
            activeView === 'health'
              ? 'bg-[#141211] text-[#FAF8F5]'
              : 'text-[#665E58] hover:text-[#141211] bg-[#FAF8F5]'
          }`}
        >
          System Health
        </button>
        <button
          onClick={() => setActiveView('audit_log')}
          className={`px-4 py-2 rounded-xl transition ${
            activeView === 'audit_log'
              ? 'bg-[#141211] text-[#FAF8F5]'
              : 'text-[#665E58] hover:text-[#141211] bg-[#FAF8F5]'
          }`}
        >
          Audit Log ({audits.length})
        </button>
        <button
          onClick={() => setActiveView('trace')}
          className={`px-4 py-2 rounded-xl transition ${
            activeView === 'trace'
              ? 'bg-[#141211] text-[#FAF8F5]'
              : 'text-[#665E58] hover:text-[#141211] bg-[#FAF8F5]'
          }`}
        >
          Correlation Trace
        </button>
        <button
          onClick={() => setActiveView('matrix')}
          className={`px-4 py-2 rounded-xl transition ${
            activeView === 'matrix'
              ? 'bg-[#141211] text-[#FAF8F5]'
              : 'text-[#665E58] hover:text-[#141211] bg-[#FAF8F5]'
          }`}
        >
          Audit Matrix (100% Modules)
        </button>
        <button
          onClick={() => setActiveView('recovery')}
          className={`px-4 py-2 rounded-xl transition ${
            activeView === 'recovery'
              ? 'bg-[#A65F25] text-[#FAF8F5]'
              : 'text-[#A65F25] hover:text-[#141211] bg-[#FAF8F5] border border-[#E7DFD3]'
          }`}
        >
          Disaster Recovery & Rollback
        </button>
      </div>

      {/* VIEW 1: SYSTEM HEALTH */}
      {activeView === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3]">
              <span className="text-[11px] uppercase tracking-pantryst font-mono text-[#8C827A]">
                Tổng Audit Log
              </span>
              <p className="font-serif text-3xl font-bold text-[#141211] mt-2">
                {health?.totalAudits || 0}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">Bất biến · Append-only</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3]">
              <span className="text-[11px] uppercase tracking-pantryst font-mono text-[#8C827A]">
                Lỗi phát sinh
              </span>
              <p className="font-serif text-3xl font-bold text-[#141211] mt-2">
                {health?.totalErrors || 0}
              </p>
              <span className="text-[11px] text-[#8C827A]">0 lỗi chặn luồng</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3]">
              <span className="text-[11px] uppercase tracking-pantryst font-mono text-[#8C827A]">
                Failed Events
              </span>
              <p className="font-serif text-3xl font-bold text-emerald-700 mt-2">
                {health?.failedErrors || 0}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">Core vận hành trơn tru</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3]">
              <span className="text-[11px] uppercase tracking-pantryst font-mono text-[#8C827A]">
                Hệ thống Observability
              </span>
              <p className="font-serif text-xl font-bold text-[#141211] mt-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE (100%)
              </p>
              <span className="text-[11px] text-[#8C827A]">7 chiều log chuẩn hóa</span>
            </div>
          </div>

          {/* Module Health Radar Grid */}
          <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#141211]">
              Trạng Thái 14 Module & Adapter
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {health?.moduleStatus &&
                Object.entries(health.moduleStatus).map(([mod, info]: [string, any]) => (
                  <div
                    key={mod}
                    className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] text-center space-y-1.5"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          info.healthy ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      ></span>
                      <span className="text-[10px] font-mono font-bold text-[#141211] truncate">
                        {mod}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8C827A]">
                      {info.errorCount === 0 ? 'Ổn định' : `${info.errorCount} lỗi`}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: AUDIT LOG LEDGER */}
      {activeView === 'audit_log' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[#8C827A] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Lọc module:
              </span>
              {['ALL', 'ORDER', 'FULFILLMENT', 'CURATION', 'QR', 'LOYALTY'].map((mod) => (
                <button
                  key={mod}
                  onClick={() => setSelectedModule(mod)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition ${
                    selectedModule === mod
                      ? 'bg-[#141211] text-white'
                      : 'bg-[#FAF8F5] text-[#665E58] border border-[#E7DFD3]'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>

            <span className="text-xs text-[#8C827A] font-mono">
              Hiển thị {audits.length} logs
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-[#E7DFD3] divide-y divide-[#E7DFD3]/60 overflow-hidden">
            {audits.map((a) => (
              <div key={a.id} className="p-4 sm:p-5 space-y-2 hover:bg-[#FAF8F5]/50 transition">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#141211] text-white font-mono text-[10px] font-bold">
                      {a.module}
                    </span>
                    <span className="font-mono font-bold text-[#A65F25]">{a.action}</span>
                    <span className="text-[#8C827A]">·</span>
                    <span className="text-[#665E58] font-medium">
                      Actor: {a.actor.name} ({a.actor.role})
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8C827A] font-mono">
                    {new Date(a.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
                  <div className="space-y-0.5">
                    <p className="text-[#141211]">
                      Thực thể: <span className="font-mono font-semibold">{a.entity.type}</span> (
                      {a.entity.code || a.entity.id})
                      {a.from_state && a.to_state && (
                        <span className="ml-2 font-mono text-[#A65F25]">
                          [{a.from_state} → {a.to_state}]
                        </span>
                      )}
                    </p>
                    {a.reason && <p className="text-[#8C827A] italic text-[11px]">&ldquo;{a.reason}&rdquo;</p>}
                  </div>

                  <button
                    onClick={() => handleTrace(a.correlation_id)}
                    className="px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] font-mono text-[11px] text-[#423B36] hover:bg-[#EFE8DC] transition inline-flex items-center gap-1"
                  >
                    <span>Trace: {a.correlation_id.substring(0, 18)}...</span>
                    <ArrowRight className="w-3 h-3 text-[#A65F25]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CORRELATION TRACE JOURNEY */}
      {activeView === 'trace' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#141211]">
              Truy Vết Hành Trình Xuyên Suốt (End-to-End Correlation)
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập Correlation ID (vd: corr_ord_gm2026000075...)"
                value={searchCorrelation}
                onChange={(e) => setSearchCorrelation(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] text-xs font-mono focus:outline-none focus:border-[#A65F25]"
              />
              <button
                onClick={() => handleTrace()}
                className="px-6 py-2.5 rounded-2xl bg-[#141211] text-white text-xs font-bold hover:bg-[#A65F25] transition inline-flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Truy vết</span>
              </button>
            </div>
          </div>

          {tracedJourney ? (
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD3]">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-pantryst text-[#8C827A]">
                    CORRELATION ID
                  </span>
                  <p className="font-mono font-bold text-sm text-[#141211]">
                    {tracedJourney.correlation_id}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {tracedJourney.audits?.length || 0} Dấu vết ghi nhận
                </span>
              </div>

              {/* Timeline steps */}
              <div className="space-y-4 pt-2">
                {tracedJourney.audits?.map((step: AuditLog, idx: number) => (
                  <div key={step.id} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#141211] text-white flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-[#E7DFD3] flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#A65F25]">
                          [{step.module}] {step.action}
                        </span>
                        <span className="text-[11px] text-[#8C827A] font-mono">
                          {new Date(step.timestamp).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-xs text-[#141211]">
                        Thực thể: <span className="font-mono">{step.entity.code || step.entity.id}</span> · Actor:{' '}
                        {step.actor.name} ({step.actor.role})
                      </p>
                      {step.reason && (
                        <p className="text-[11px] text-[#8C827A] italic">
                          &ldquo;{step.reason}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#8C827A] text-xs">
              Nhập mã correlation_id hoặc bấm nút Trace trên một dòng audit log để xem toàn bộ hành trình.
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: AUDIT MATRIX (100% MODULES) */}
      {activeView === 'matrix' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#141211]">
              Ma Trận Kiểm Soát 100% Module (PM Definition of Done)
            </h2>
            <p className="text-xs text-[#665E58] leading-relaxed">
              Toàn bộ các module trong hệ thống Gạc Măng Rê đã được rà soát và đóng chặt 6 lớp Audit Foundation:
              Data Truth, Business State, Event, Audit, Error, Traceability, và Decoupled Adapters.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E7DFD3] overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF8F5] border-b border-[#E7DFD3] text-[#8C827A] font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-4">Module</th>
                  <th className="p-4">Data Truth</th>
                  <th className="p-4">State Rule</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Audit</th>
                  <th className="p-4">Error</th>
                  <th className="p-4">Traceability</th>
                  <th className="p-4">Adapter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DFD3]/60">
                {auditMatrix.map((m) => (
                  <tr key={m.module} className="hover:bg-[#FAF8F5]/50 transition">
                    <td className="p-4 font-mono font-bold text-[#141211]">{m.module}</td>
                    <td className="p-4 font-bold text-emerald-700">{m.data}</td>
                    <td className="p-4 font-bold text-emerald-700">{m.state}</td>
                    <td className="p-4 font-bold text-emerald-700">{m.event}</td>
                    <td className="p-4 font-bold text-emerald-700">{m.audit}</td>
                    <td className="p-4 font-bold text-emerald-700">{m.error}</td>
                    <td className="p-4 font-bold text-emerald-700">{m.trace}</td>
                    <td className="p-4 font-mono text-[#8C827A]">{m.adapter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: DISASTER RECOVERY & ROLLBACK PROTOCOL */}
      {activeView === 'recovery' && (
        <div className="space-y-6">
          {/* Recovery Overview & RPO / RTO Rules */}
          <div className="p-6 rounded-3xl bg-[#141211] text-white space-y-4 border border-[#3E3834]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-pantryst text-[#A65F25] font-bold">
                  DISASTER RECOVERY STANDARD
                </span>
                <h2 className="font-serif text-2xl font-bold mt-1">
                  Protocol 6 Bước & RPO/RTO Khóa
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20">
                  RPO: &le; 24h
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20">
                  RTO: &le; 4h
                </span>
              </div>
            </div>

            <p className="text-xs text-[#C2B7A8] leading-relaxed font-sans">
              Nguyên tắc sống còn: <strong className="text-white">Không rollback khi chưa Diagnose</strong>.
              Tuân thủ chuỗi 6 bước: <span className="font-mono text-[#EFE8DC]">01 DETECT &rarr; 02 FREEZE &rarr; 03 DIAGNOSE &rarr; 04 ROLLBACK &rarr; 05 VERIFY &rarr; 06 RESUME</span>.
            </p>
          </div>

          {/* Rollback Matrix */}
          <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#141211]">
              Ma Trận Phân Định Lớp Rollback (Tránh Rollback Nhầm Hệ Thống)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
                <span className="font-mono font-bold text-[#A65F25]">LỖI UI / CODE FE-BE</span>
                <p className="text-[#665E58]">Rollback Git Release Checkpoint (Không đụng chạm DB / Order data)</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
                <span className="font-mono font-bold text-[#A65F25]">LỖI MIGRATION DB</span>
                <p className="text-[#665E58]">Kế hoạch Migration Rollback theo script hoặc Restore Snapshot DB trước migration</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
                <span className="font-mono font-bold text-[#A65F25]">EVENT BẤT ĐỒNG BỘ THẤT BẠI</span>
                <p className="text-[#665E58]">Replay / Retry Event Queue (Không rollback Order và không đập Core)</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-1">
                <span className="font-mono font-bold text-[#A65F25]">MAKE / ZALO / CARRIER SẬP</span>
                <p className="text-[#665E58]">Tạm disable Adapter, xếp hàng chờ hoặc đổi Provider. Core tiếp tục bán bình thường</p>
              </div>
            </div>
          </div>

          {/* Checkpoint Retention Milestones */}
          <div className="p-6 rounded-3xl bg-white border border-[#E7DFD3] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#141211]">
                Milestone Snapshots & Known Good State
              </h3>
              <span className="text-xs font-mono text-[#8C827A]">
                Backup Retention: Daily 14 ngày &middot; Milestone dài hạn
              </span>
            </div>

            <div className="divide-y divide-[#E7DFD3]/60 border border-[#E7DFD3] rounded-2xl overflow-hidden text-xs">
              <div className="p-4 bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#141211]">v0.6.0-audit-foundation</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                      KNOWN GOOD STATE
                    </span>
                  </div>
                  <p className="text-[#8C827A] font-mono text-[11px]">Git Commit: 245f181 &middot; Migration: 20261006_audit_foundation.sql</p>
                </div>
                <div className="flex items-center gap-2 text-right font-mono text-[11px] text-[#5C5248]">
                  <span>Checksum: sha256_mock_init_good_state</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
