import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockNgans, mockNgan001 } from '@/lib/data/mock-data';
import { Ngan } from '@/types';

export async function getNganBySlug(slug: string): Promise<Ngan | null> {
  // Check mock store first for fast zero-failure fallback
  const normalized = slug.trim().toLowerCase();
  const mockFound = mockNgans.find(
    (n) =>
      n.slug.toLowerCase() === normalized ||
      n.number.toLowerCase() === normalized ||
      n.number.replace('#', '').toLowerCase() === normalized ||
      n.id === slug
  );

  if (mockFound) {
    return mockFound;
  }

  if (!isSupabaseConfigured || !supabase) {
    return mockNgans[0] || mockNgan001;
  }

  const { data, error } = await supabase
    .from('ngans')
    .select(`
      *,
      product:products(
        *,
        producer:producers(*)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return mockNgans[0] || mockNgan001;
  }

  return data as Ngan;
}

export async function getActiveNgans(): Promise<Ngan[]> {
  const activeStatuses = ['OPEN', 'FULL', 'PRODUCER_CONFIRMING', 'PRODUCTION'];

  if (!isSupabaseConfigured || !supabase) {
    return mockNgans.filter((n) => activeStatuses.includes(n.status));
  }

  const { data, error } = await supabase
    .from('ngans')
    .select(`
      *,
      product:products(
        *,
        producer:producers(*)
      )
    `)
    .in('status', activeStatuses)
    .order('number', { ascending: true });

  if (error || !data || data.length === 0) {
    return mockNgans.filter((n) => activeStatuses.includes(n.status));
  }

  return data as Ngan[];
}
