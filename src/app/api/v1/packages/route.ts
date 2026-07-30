import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('package_families')
    .select('id, slug, name, tagline, base_price, duration_days, duration_nights')
    .limit(10);

  if (error || !data || data.length === 0) {
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 'pkg-1',
          slug: 'ultimate-kodaikanal-3d2n',
          name: 'Ultimate Kodaikanal Misty Escapes',
          tagline: 'Pine forests, organic tea gardens & serene lake cruises',
          basePrice: 14500,
          durationDays: 3,
          durationNights: 2,
        }
      ]
    });
  }

  return NextResponse.json({ success: true, data });
}
