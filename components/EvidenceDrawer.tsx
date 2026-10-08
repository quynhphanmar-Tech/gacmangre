'use client';

import { useState } from 'react';
import { ShieldCheck, AlertCircle, HelpCircle, X, ChevronRight, FileText } from 'lucide-react';
import { CanonicalEvidenceItem, TruthStatus } from '@/types';

interface EvidenceDrawerProps {
  evidenceItems: CanonicalEvidenceItem[];
  originName: string;
}

export default function EvidenceDrawer({ evidenceItems, originName }: EvidenceDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = (status: TruthStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            VERIFIED FACT
          </span>
        );
      case 'PRODUCER_CLAIM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
            <AlertCircle className="w-3 h-3 text-amber-700" />
            PRODUCER CLAIM
          </span>
        );
      case 'UNKNOWN':
      case 'MISSING_EVIDENCE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-mono font-bold">
            <HelpCircle className="w-3 h-3 text-stone-500" />
            CHỜ BỔ SUNG MINH CHỨNG
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A65F25] hover:text-[#864918] transition-colors py-1 group cursor-pointer focus:outline-none"
      >
        <span>Xem toàn bộ minh chứng & đối soát thực địa</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-[#141211]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E7DFD3] shadow-2xl flex flex-col justify-between">
              
              {/* Header */}
              <div className="p-6 border-b border-[#E7DFD3] bg-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A65F25] font-bold block">
                    Epistemic Governance & Truth Gate
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#141211]">
                    Hồ sơ Minh chứng: {originName}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#F0DCB8] text-xs font-sans text-[#665E58] leading-relaxed">
                  <strong className="text-[#A65F25] block mb-1">Quy tắc thẩm định minh chứng GMR:</strong>
                  Mọi thông tin trên Ngăn được phân định rành mạch giữa <em>Verified Fact</em> (đã đối soát thực địa/hồ sơ pháp lý) và <em>Producer Claim</em> (tự công bố từ nhà vườn, chưa độc lập kiểm nghiệm). Tuyệt đối không biến phỏng đoán thành sự thật.
                </div>

                <div className="space-y-3 pt-2">
                  {evidenceItems && evidenceItems.length > 0 ? (
                    evidenceItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`p-4 rounded-2xl border bg-white space-y-2 shadow-xs ${
                          item.truth_status === 'VERIFIED'
                            ? 'border-[#D7E2D3]'
                            : 'border-[#F0DCB8]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-stone-400">
                            {item.id || `EVD-${idx + 1}`}
                          </span>
                          {getStatusBadge(item.truth_status)}
                        </div>

                        <h4 className="font-serif text-sm font-bold text-[#141211]">
                          {item.claim}
                        </h4>

                        <p className="text-xs text-[#554D46] font-sans leading-relaxed">
                          {item.notes || 'Hồ sơ đã qua đối soát thực địa và xác nhận hồ sơ từ nhà sản xuất.'}
                        </p>

                        {item.source_title && (
                          <div className="pt-2 border-t border-[#F0EBE1] flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                            <FileText className="w-3 h-3 text-[#A65F25]" />
                            <span className="truncate">{item.source_title}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-stone-500 bg-white rounded-xl border border-[#E7DFD3]">
                      Đang đồng bộ hồ sơ minh chứng.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-[#E7DFD3] bg-white flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#665E58]">
                  {evidenceItems.length} minh chứng đã đối soát
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#141211] text-white text-xs font-semibold hover:bg-[#A65F25] transition"
                >
                  Đóng hồ sơ
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
