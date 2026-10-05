import React from 'react';

interface ProgressBarProps {
  current: number;
  moq: number;
  showDetails?: boolean;
  className?: string;
}

export default function ProgressBar({
  current,
  moq,
  showDetails = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((current / moq) * 100));
  const remaining = Math.max(0, moq - current);
  const isFull = current >= moq;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {showDetails && (
        <div className="flex items-baseline justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-[#211D1A]">
              {current}
            </span>
            <span className="text-[#7F5E3C] font-medium">/ {moq} phần</span>
          </div>
          <span className="font-mono text-sm font-semibold text-[#8C4A2F]">
            {percentage}%
          </span>
        </div>
      )}

      {/* Progress Track */}
      <div className="relative w-full h-3.5 bg-[#E8D8C3] rounded-full overflow-hidden p-0.5 border border-[#D6BFA0]/50 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isFull
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
              : 'bg-gradient-to-r from-[#BE9D77] via-[#9E7B54] to-[#8C4A2F]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showDetails && (
        <p className="text-xs text-[#7F5E3C] flex items-center justify-between">
          {isFull ? (
            <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              ĐÃ ĐỦ NGĂN — Nhà sản xuất đang chuẩn bị mẻ hàng
            </span>
          ) : (
            <span>
              Còn <strong className="text-[#8C4A2F] font-bold">{remaining} phần</strong> để chính thức mở Ngăn này.
            </span>
          )}
          <span className="italic text-[#9E7B54]">Mùa 2026</span>
        </p>
      )}
    </div>
  );
}
