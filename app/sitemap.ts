import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://brandtalk.asia/gacmangre';
  const lastModified = new Date('2026-10-08T00:00:00.000Z');

  return [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ngan/cacao-oca`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ngan/mat-ong-bac-ha-meo-vac`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stories/hat-cacao-viet-nam-va-cach-lam-cua-rieng-minh`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stories/huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ve-gac-mang-re`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
