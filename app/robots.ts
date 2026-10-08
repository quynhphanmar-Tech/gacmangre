import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isVercelOrigin = process.env.VERCEL_ENV === 'production' && !process.env.IS_CANONICAL_DOMAIN;

  // Protect canonical indexing:
  // If request hits gacmangre.vercel.app directly, discourage search engines from duplicate indexing
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
    ],
    sitemap: 'https://brandtalk.asia/gacmangre/sitemap.xml',
    host: 'https://brandtalk.asia/gacmangre',
  };
}
