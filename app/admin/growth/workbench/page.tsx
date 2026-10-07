'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface WorkbenchAsset {
  id: string;
  url: string;
  asset_type: 'DOCUMENTARY' | 'SOURCE' | 'EDITORIAL' | 'AI_GENERATED';
  caption: string;
  credit: string;
  source_ref: string;
  role_in_story: 'hero' | 'evidence' | 'context';
  created_at?: string;
}

export default function ProducerGrowthWorkbenchPage() {
  const [producerId, setProducerId] = useState('PRD-OCA-001');
  const [assetType, setAssetType] = useState<'DOCUMENTARY' | 'SOURCE' | 'EDITORIAL' | 'AI_GENERATED'>('DOCUMENTARY');
  const [caption, setCaption] = useState('Đôi bàn tay thợ đảo mẻ cacao trong thùng gỗ mít');
  const [credit, setCredit] = useState('Chị Thu / Vườn Châu Đức BR-VT');
  const [sourceRef, setSourceRef] = useState('https://ocacacao.com/quy-trinh-san-xuat/');
  const [roleInStory, setRoleInStory] = useState<'hero' | 'evidence' | 'context'>('evidence');
  const [imageUrl, setImageUrl] = useState('/1791301980993_1495576537881552819_558378821601381069_143eb3245c6b738be2eb1f62e19ba28d.jpg');

  const [assets, setAssets] = useState<WorkbenchAsset[]>([
    {
      id: 'AST-WB-INIT-1',
      url: '/1791301980993_1495576537881552819_558378821601381069_143eb3245c6b738be2eb1f62e19ba28d.jpg',
      asset_type: 'DOCUMENTARY',
      caption: 'Ảnh thực địa thùng ủ men gỗ mít 6 ngày',
      credit: 'Tư liệu thực địa',
      source_ref: 'https://ocacacao.com/quy-trinh-san-xuat/',
      role_in_story: 'evidence',
      created_at: '2026-10-07T12:00:00Z',
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: WorkbenchAsset = {
      id: `AST-WB-${Date.now()}`,
      url: imageUrl,
      asset_type: assetType,
      caption,
      credit,
      source_ref: sourceRef,
      role_in_story: roleInStory,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/admin/growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_WORKBENCH_ASSET',
          producer_id: producerId,
          asset: newAsset,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAssets([data.asset, ...assets]);
        setNotification('✅ Đã lưu tài sản thực địa có provenance hợp lệ vào Workbench!');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setAssets([newAsset, ...assets]);
      setNotification('✅ Đã thêm tài sản tạm vào danh sách cục bộ!');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C2825] font-sans p-6 sm:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D9] mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#8C827A] font-medium">
              Gạc Măng Rê — Growth Intelligence v0.1
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1917] mt-1">
              Producer Asset Workbench (Lightweight Spike)
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/control-tower"
              className="text-xs px-3 py-2 border border-[#D5CEC5] rounded hover:bg-[#EFEAE2] transition"
            >
              Control Tower
            </Link>
            <Link
              href="/admin"
              className="text-xs px-3 py-2 bg-[#1C1917] text-white rounded hover:bg-[#332E2A] transition"
            >
              Admin Home
            </Link>
          </div>
        </div>

        {notification && (
          <div className="mb-6 p-4 rounded bg-[#EAF5EC] border border-[#A7D7AF] text-[#1E4D2B] text-sm flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-xs font-bold">×</button>
          </div>
        )}

        {/* Informational Banner */}
        <div className="p-4 bg-[#F2EEE9] rounded-lg border border-[#E0D8CE] text-xs text-[#5C544E] mb-8 leading-relaxed">
          <p className="font-semibold text-[#1C1917] mb-1">
            🔒 Nguyên tắc Workbench Spike:
          </p>
          <p>
            Đây là giao diện lightweight để kiểm chứng luồng thu nạp tài sản thực địa từ nhà sản xuất. Mọi tài sản phải có provenance rõ ràng:
            (1) <code>asset_type</code> hợp chuẩn, (2) <code>source_ref</code> minh chứng, (3) <code>credit</code> nguồn gốc. Không tự ý chỉnh sửa các tầng bất biến của Foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E8E2D9] shadow-sm">
            <h2 className="text-base font-serif font-semibold text-[#1C1917] mb-4 pb-2 border-b border-[#F0EBE3]">
              Gắn nhãn Provenance cho Tài sản
            </h2>

            <form onSubmit={handleAddAsset} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5C544E] font-medium mb-1">Mã Nhà Sản Xuất (Producer ID)</label>
                <input
                  type="text"
                  value={producerId}
                  onChange={(e) => setProducerId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5CEC5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#7A6B5D]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5C544E] font-medium mb-1">URL / Đường dẫn ảnh hoặc tư liệu</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5CEC5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#7A6B5D]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5C544E] font-medium mb-1">Phân loại tài sản (Asset Type)</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#D5CEC5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#7A6B5D]"
                >
                  <option value="DOCUMENTARY">DOCUMENTARY (Tư liệu thực địa nguyên bản)</option>
                  <option value="SOURCE">SOURCE (Tài liệu gốc do nhà sản xuất cung cấp)</option>
                  <option value="EDITORIAL">EDITORIAL (Ảnh chụp biên tập có bản quyền)</option>
                  <option value="AI_GENERATED">AI_GENERATED (Không khuyên dùng cho bằng chứng)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5C544E] font-medium mb-1">Vai trò trong câu chuyện (Role in Story)</label>
                <select
                  value={roleInStory}
                  onChange={(e) => setRoleInStory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#D5CEC5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#7A6B5D]"
                >
                  <option value="evidence">evidence (Minh chứng trực tiếp cho chất lượng)</option>
                  <option value="hero">hero (Ảnh biểu tượng đại diện câu chuyện)</option>
                  <option value="context">context (Bối cảnh cảnh quan vùng đất)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5C544E] font-medium mb-1">Chú thích mộc mạc (Caption)</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5CEC5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#7A6B5D]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5C544E] font-medium mb-1">Ghi nhận tác giả / Nguồn (Credit)</label>
                <input
                  type="text"
                  value={credit}
                  onChange={(e) => setCredit(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5CEC5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#7A6B5D]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5C544E] font-medium mb-1">Liên kết nguồn kiểm chứng (Source URL/Ref)</label>
                <input
                  type="text"
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5CEC5] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#7A6B5D]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#2C2825] hover:bg-[#1A1816] text-white font-medium rounded transition shadow-sm"
              >
                Lưu Tài Sản vào Workbench
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D9]">
              <h2 className="text-base font-serif font-semibold text-[#1C1917]">
                Danh mục Tài sản Đã Cập Nhật ({assets.length})
              </h2>
              <span className="text-xs text-[#8C827A]">Nhà sản xuất: {producerId}</span>
            </div>

            <div className="space-y-3">
              {assets.map((ast) => (
                <div
                  key={ast.id}
                  className="bg-white p-4 rounded-xl border border-[#E8E2D9] flex flex-col sm:flex-row gap-4 items-start shadow-sm"
                >
                  <div className="w-full sm:w-28 h-24 bg-[#EFEAE2] rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-xs text-[#8C827A]">
                    {ast.url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={ast.url} alt={ast.caption} className="w-full h-full object-cover" />
                    ) : (
                      <span>No Preview</span>
                    )}
                  </div>
                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-[#7A6B5D] bg-[#F4EFEA] px-1.5 py-0.5 rounded">
                        {ast.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF0F6] text-[#2C4869]">
                        {ast.asset_type}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F5EDE4] text-[#704620]">
                        role: {ast.role_in_story}
                      </span>
                    </div>
                    <p className="font-serif text-sm font-semibold text-[#1C1917] pt-1">
                      {ast.caption}
                    </p>
                    <p className="text-[#6B635B]">
                      <span className="font-medium text-[#403B36]">Credit:</span> {ast.credit}
                    </p>
                    <p className="text-[#8C827A] truncate max-w-md">
                      <span className="font-medium text-[#5C544E]">Source:</span> {ast.source_ref}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
