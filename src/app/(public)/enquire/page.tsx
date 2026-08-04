'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, MapPin, Calendar, DollarSign, Users, User, Phone, Mail, Compass } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { submitTripEnquiry } from '@/lib/actions/enquiryActions';

const SUPPORTED_DESTINATIONS = ['Kodaikanal', 'Ooty', 'Valparai'];

export default function TripEnquiryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [startingLocation, setStartingLocation] = useState('Coimbatore');
  const [destination, setDestination] = useState('Kodaikanal');
  const [travelDate, setTravelDate] = useState('');
  const [budget, setBudget] = useState('₹4,000 - ₹6,000');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (searchParams) {
      const destParam = searchParams.get('destination');
      const fromParam = searchParams.get('from') || searchParams.get('starting_location');
      const expParam = searchParams.get('experience');
      const pkgParam = searchParams.get('package');
      const msgParam = searchParams.get('message');
      const budgetParam = searchParams.get('budget');

      if (destParam) setDestination(destParam);
      if (fromParam) setStartingLocation(fromParam);
      if (budgetParam) setBudget(budgetParam);
      if (expParam) setMessage(`Enquiry for Experience: ${expParam}`);
      else if (pkgParam) setMessage(`Enquiry for Package: ${pkgParam}`);
      else if (msgParam) setMessage(msgParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setErrorMsg('Please enter your Name and Phone Number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const res = await submitTripEnquiry({
      name,
      phone,
      email,
      starting_location: startingLocation,
      destination,
      travel_date: travelDate || 'Flexible',
      budget,
      adults,
      children,
      message,
    });

    setSubmitting(false);

    if (res.success && res.reference) {
      router.push(`/enquire/confirmation/${res.reference}`);
    } else {
      setErrorMsg(res.error || 'Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">
            <Send className="w-3.5 h-3.5" />
            <span>Frictionless Trip Request</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Trip Enquiry</h1>
          <p className="text-slate-400 text-base mt-3">
            No password setup or payment required. Tell us your vibe and receive a unique Reference ID for live tracking.
          </p>
        </div>

        {/* Enquiry Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-elevated">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-orange" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-brand-orange" /> WhatsApp / Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-brand-orange" /> Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. priya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Starting City / Pickup Location */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-brand-orange" /> Starting City / Pickup Location
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Optional</span>
                </label>
                <select
                  value={startingLocation}
                  onChange={(e) => setStartingLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                >
                  <option value="Coimbatore">Coimbatore (Main Hub)</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Own Transport / Self Arrival">Own Transport / Self Arrival</option>
                </select>
              </div>

              {/* Target Destination */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-orange" /> Target Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                >
                  {SUPPORTED_DESTINATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-orange" /> Travel Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-brand-orange" /> Expected Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                >
                  <option value="Under ₹4,000">Under ₹4,000 / person</option>
                  <option value="₹4,000 - ₹6,000">₹4,000 - ₹6,000 / person</option>
                  <option value="₹6,000 - ₹10,000">₹6,000 - ₹10,000 / person</option>
                  <option value="₹10,000+">₹10,000+ Luxury / Group</option>
                </select>
              </div>

              {/* Adults */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-orange" /> Adults
                </label>
                <input
                  type="number"
                  min={1}
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Children */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-orange" /> Children
                </label>
                <input
                  type="number"
                  min={0}
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            {/* Message / Special Requests */}
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">
                Additional Notes / Custom Requests
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your squad, stay preferences, or custom activity requests..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                🔒 Instant Reference ID generation. No passwords.
              </span>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="shadow-button"
              >
                {submitting ? 'Submitting...' : 'Submit Trip Enquiry'}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
