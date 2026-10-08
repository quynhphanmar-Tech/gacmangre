import { getActiveNgans } from '@/services/ngan-service';
import { getStories } from '@/services/story-service';
import CinematicPantryHero from '@/components/CinematicPantryHero';

export const metadata = {
  title: 'Gạc Măng Rê — Cất vị quê nhà | A Digital Pantry of Vietnam',
  description:
    'A Digital Pantry of Vietnam. Chiếc tủ cất vị quê nhà: Ngăn #001 Cacao OCA Châu Đức & Ngăn #002 Mật Ong Bạc Hà Mèo Vạc. Tuyển chọn sản vật nguyên bản Việt Nam.',
  alternates: {
    canonical: 'https://brandtalk.asia/gacmangre',
  },
};

export default async function HomePage() {
  const ngans = await getActiveNgans();
  const stories = await getStories();
  const goldenStory = stories[0] || null;

  // Pilot scope: only pass the 2 primary pilot Ngans (Cacao OCA & Mèo Vạc)
  const pilotNgans = ngans.filter((n) => n.slug.includes('oca') || n.slug.includes('meo-vac') || n.slug.includes('ha-giang'));

  return (
    <div className="min-h-screen">
      <CinematicPantryHero pilotNgans={pilotNgans.length > 0 ? pilotNgans : ngans} goldenStory={goldenStory} />
    </div>
  );
}
