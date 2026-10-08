import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://brandtalk.asia/gacmangre'),
  title: {
    default: 'Gạc Măng Rê — Cất vị quê nhà | A Digital Pantry of Vietnam',
    template: '%s · Gạc Măng Rê',
  },
  description:
    'A Digital Pantry of Vietnam. Tuyển chọn những sản vật địa phương tinh túy của Việt Nam. Mỗi Ngăn là một mẻ thu hoạch thật từ một vùng đất, cất giữ sự tử tế của người làm nghề bản địa.',
  keywords: [
    'Gạc Măng Rê',
    'A Digital Pantry of Vietnam',
    'sản vật Việt Nam',
    'cacao Châu Đức OCA',
    'mật ong bạc hà Mèo Vạc',
    'nông sản nguyên bản',
    'cùng mở mẻ',
  ],
  authors: [{ name: 'Gạc Măng Rê', url: 'https://brandtalk.asia/gacmangre' }],
  creator: 'Gạc Măng Rê',
  publisher: 'Gạc Măng Rê',
  alternates: {
    canonical: 'https://brandtalk.asia/gacmangre',
  },
  openGraph: {
    title: 'Gạc Măng Rê — Cất vị quê nhà | A Digital Pantry of Vietnam',
    description:
      'Có những thứ ngon không dễ tìm. Có những người làm rất tử tế nhưng ít người biết đến. Gạc Măng Rê đi tìm họ. Chiếc tủ cất vị nguyên bản của người Việt.',
    url: 'https://brandtalk.asia/gacmangre',
    siteName: 'Gạc Măng Rê',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Gạc Măng Rê — A Digital Pantry of Vietnam',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gạc Măng Rê — Cất vị quê nhà',
    description: 'A Digital Pantry of Vietnam — Tuyển chọn sản vật nguyên bản Việt Nam.',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gạc Măng Rê',
    alternateName: 'A Digital Pantry of Vietnam',
    url: 'https://brandtalk.asia/gacmangre',
    logo: 'https://brandtalk.asia/gacmangre/favicon.ico',
    description: 'Chiếc tủ số lưu giữ sản vật nguyên bản và giá trị người làm nghề thủ công tử tế tại Việt Nam.',
    knowsAbout: [
      'Cacao thủ công Châu Đức',
      'Mật ong bạc hà Mèo Vạc',
      'Nông sản bản địa Việt Nam',
      'Thực địa và bảo tồn phẩm chất ẩm thực',
    ],
  };

  const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gạc Măng Rê',
    url: 'https://brandtalk.asia/gacmangre',
    description: 'A Digital Pantry of Vietnam — Cất vị quê nhà.',
    inLanguage: 'vi',
  };

  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211D1A] antialiased overflow-x-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
