import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockNgan001 } from '@/lib/data/mock-data';
import { Ngan } from '@/types';

export async function getNganBySlug(slug: string): Promise<Ngan | null> {
  if (!isSupabaseConfigured || !supabase) {
    if (slug === mockNgan001.slug || slug === 'ngan-001-mat-ong-bac-ha-ha-giang' || slug === '001') {
      return mockNgan001;
    }
    return mockNgan001; // Fallback to Golden Sample
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
    console.warn('Supabase query error or not found, falling back to mock:', error?.message);
    return mockNgan001;
  }

  return data as Ngan;
}

export async function getActiveNgans(): Promise<Ngan[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [mockNgan001];
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
    .in('status', ['OPEN', 'FULL', 'PRODUCER_CONFIRMING', 'PRODUCTION'])
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return [mockNgan001];
  }

  return data as Ngan[];
}
