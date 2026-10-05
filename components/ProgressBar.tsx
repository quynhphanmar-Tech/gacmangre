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
    <div className={`space-y-3 ${className}`}>
      {showDetails && (
        <div className="flex items-baseline justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-[#141211]">
              {current}
            </span>
            <span className="text-[#665E58] font-sans text-xs">/ {moq} người cùng mở</span>
          </div>
          <span className="font-mono text-xs font-semibold text-[#A65F25]">
            {percentage}%
          </span>
        </div>
      )}

      {/* Modern Editorial Progress Track */}
      <div className="relative w-full h-2.5 bg-[#EFE8DC] rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isFull
              ? 'bg-emerald-700'
              : 'bg-[#A65F25]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showDetails && (
        <p className="text-xs text-[#665E58] flex items-center justify-between font-sans">
          {isFull ? (
            <span className="font-medium text-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Đã đủ mốc mở ngăn · Người làm đang chuẩn bị mẻ mới
            </span>
          ) : (
            <span>
              Còn <strong className="text-[#141211] font-semibold">{remaining} phần</strong> để mở Ngăn.
            </span>
          )}
          <span className="text-[11px] text-[#A65F25]">Mùa 2026</span>
        </p>
      )}
    </div>
  );
}
