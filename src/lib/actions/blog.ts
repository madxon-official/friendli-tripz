'use server';

import { createClient } from '@/lib/supabase/server';
import { BlogPost } from '@/lib/types/blog';

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return [
      {
        id: '1',
        slug: 'ultimate-kodaikanal-travel-guide-2026',
        title: 'The Ultimate Kodaikanal Travel Guide 2026',
        excerpt: 'Discover hidden waterfalls, pine forests, organic cafes, and misty viewpoints in the Princess of Hill Stations.',
        content_markdown: '# Kodaikanal Travel Guide\n\nNested at 2,133m altitude...',
        featured_image_url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0',
        author_name: 'Friendli Travel Team',
        tags: ['Kodaikanal', 'Guide', 'Hill Station'],
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        slug: 'top-5-activities-in-ooty-for-couples',
        title: 'Top 5 Romantic Activities in Ooty for Couples',
        excerpt: 'From Nilgiri Mountain Railway rides to lakeside picnics, here is your romantic itinerary for Ooty.',
        content_markdown: '# Ooty Romantic Escapes\n\nExperience Ooty with your loved one...',
        featured_image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
        author_name: 'Friendli Travel Team',
        tags: ['Ooty', 'Honeymoon', 'Couples'],
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
  }

  return data as BlogPost[];
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !data) {
    const blogs = await getPublishedBlogs();
    return blogs.find(b => b.slug === slug) || blogs[0];
  }

  return data as BlogPost;
}
