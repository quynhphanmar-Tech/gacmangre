import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockStory001 } from '@/lib/data/mock-data';
import { Story } from '@/types';

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockStory001;
  }

  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      producer:producers(*),
      product:products(*)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return mockStory001;
  }

  return data as Story;
}

export async function getStories(): Promise<Story[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [mockStory001];
  }

  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      producer:producers(*),
      product:products(*)
    `)
    .eq('status', 'ACTIVE')
    .order('published_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return [mockStory001];
  }

  return data as Story[];
}
