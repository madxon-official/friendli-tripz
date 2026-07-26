import { NextRequest, NextResponse } from 'next/server';
import { saveEnquiry, CreateEnquiryInput } from '@/lib/storage/enquiries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot spam protection: if hidden field is filled, silently discard
    if (body.website || body.honeypot) {
      return NextResponse.json({
        success: true,
        message: 'Enquiry received',
        reference: 'FT-KOD-SPAM00',
      });
    }

    const {
      name,
      phone,
      email,
      destination = 'Kodaikanal',
      travellerCount,
      preferredDate,
      startingLocation,
      tripType,
      stayPreference,
      notes,
    } = body;

    // Server-Side Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'WhatsApp phone number is required.' },
        { status: 400 }
      );
    }

    // Indian Mobile Number Validation (+91 optional, 10 digits required)
    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(?:\+?91)?\d{10}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const numTravellers = parseInt(String(travellerCount), 10);
    if (isNaN(numTravellers) || numTravellers < 1) {
      return NextResponse.json(
        { success: false, error: 'Number of travellers must be at least 1.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const input: CreateEnquiryInput = {
      name: name.trim(),
      phone: cleanedPhone.startsWith('+91') ? cleanedPhone : `+91${cleanedPhone.slice(-10)}`,
      email: email && typeof email === 'string' && email.trim().length > 0 ? email.trim() : null,
      destination: destination || 'Kodaikanal',
      travellerCount: numTravellers,
      preferredDate: preferredDate && typeof preferredDate === 'string' && preferredDate.trim() ? preferredDate.trim() : 'Flexible / Date TBD',
      startingLocation: startingLocation && typeof startingLocation === 'string' && startingLocation.trim() ? startingLocation.trim() : 'TBD',
      tripType: ['Join Friendli Group Trip', 'Private Group', 'Custom Trip', 'Not Sure Yet'].includes(tripType)
        ? tripType
        : 'Join Friendli Group Trip',
      stayPreference: ['Budget', 'Comfortable', 'Premium', 'No preference'].includes(stayPreference)
        ? stayPreference
        : 'Comfortable',
      notes: notes && typeof notes === 'string' ? notes.trim() : null,
    };

    const enquiry = await saveEnquiry(input);

    return NextResponse.json({
      success: true,
      enquiry: {
        id: enquiry.id,
        reference: enquiry.reference,
        createdAt: enquiry.createdAt,
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        destination: enquiry.destination,
        travellerCount: enquiry.travellerCount,
        preferredDate: enquiry.preferredDate,
        startingLocation: enquiry.startingLocation,
        tripType: enquiry.tripType,
        stayPreference: enquiry.stayPreference,
        notes: enquiry.notes,
      },
    });
  } catch (error) {
    console.error('Enquiry Submission Error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
