import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code') || 'FT-2026-9001';

  return NextResponse.json({
    success: true,
    data: {
      bookingCode: code,
      leadBookerName: 'Rahul Sharma',
      status: 'confirmed',
      passengerCount: 2,
      totalAmount: 29000,
      paidDeposit: 7250,
      departureDate: '2026-10-15',
    }
  });
}
