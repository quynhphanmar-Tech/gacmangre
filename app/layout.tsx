import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Gạc Măng Rê — Cất vị quê nhà',
  description:
    'Tuyển chọn những sản vật địa phương tinh túy của Việt Nam. Mỗi Ngăn là một câu chuyện, một người làm tử tế và một vùng đất.',
  openGraph: {
    title: 'Gạc Măng Rê — Cất vị quê nhà',
    description:
      'Có những thứ ngon không dễ tìm. Có những người làm rất tử tế nhưng ít người biết đến. Gạc Măng Rê đi tìm họ.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211D1A]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
