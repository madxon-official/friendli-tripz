'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MessageCircle,
  PhoneCall,
  Copy,
  Check,
  Archive,
  ArchiveRestore,
  Send,
  Clock,
  User,
  MapPin,
  Loader2,
  FileText,
  X,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { createClient } from '@/lib/supabase/client';

export interface EnquiryDetail {
  id: string;
  reference: string;
  created_at: string;
  name: string;
  phone: string;
  email?: string | null;
  destination: string;
  traveller_count: number;
  preferred_date?: string | null;
  starting_location?: string | null;
  trip_type?: string | null;
  stay_preference?: string | null;
  notes_from_traveller?: string | null;
  status: string;
  archived_at?: string | null;
}

export interface NoteItem {
  id: string;
  note: string;
  created_at: string;
  admin_id: string;
  admin_name?: string;
}

export interface HistoryItem {
  id: string;
  previous_status?: string | null;
  new_status: string;
  created_at: string;
  changed_by?: string | null;
  admin_name?: string;
}

interface EnquiryDetailClientProps {
  initialEnquiry: EnquiryDetail;
  initialNotes: NoteItem[];
  notesAvailable: boolean;
  initialHistory: HistoryItem[];
  historyAvailable: boolean;
  initialNewCount: number;
  adminUser?: { id: string; name: string; email?: string };
}

export const EnquiryDetailClient: React.FC<EnquiryDetailClientProps> = ({
  initialEnquiry,
  initialNotes,
  notesAvailable: initialNotesAvailable,
  initialHistory,
  historyAvailable: initialHistoryAvailable,
  initialNewCount,
  adminUser,
}) => {
  const router = useRouter();

  const [enquiry, setEnquiry] = useState<EnquiryDetail>(initialEnquiry);
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [notesAvailable] = useState<boolean>(initialNotesAvailable);
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [historyAvailable] = useState<boolean>(initialHistoryAvailable);

  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [copied, setCopied] = useState(false);

  // Archive modal state
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  // Refresh enquiry detail
  const refreshDetail = async () => {
    try {
      const { data } = await supabase
        .from('enquiries')
        .select('*')
        .eq('id', enquiry.id)
        .single();

      if (data) setEnquiry(data);

      if (notesAvailable) {
        const { data: nData } = await supabase
          .from('enquiry_notes')
          .select('*')
          .eq('enquiry_id', enquiry.id)
          .order('created_at', { ascending: false });
        if (nData) setNotes(nData);
      }

      if (historyAvailable) {
        const { data: hData } = await supabase
          .from('enquiry_status_history')
          .select('*')
          .eq('enquiry_id', enquiry.id)
          .order('created_at', { ascending: false });
        if (hData) setHistory(hData);
      }
    } catch (err) {
      console.warn('Refresh error:', err);
    }
  };

  // Status update
  const handleStatusChange = async (newStatus: string) => {
    if (!enquiry || updatingStatus) return;

    setUpdatingStatus(true);
    const oldStatus = enquiry.status;

    try {
      const { error: updateErr } = await supabase
        .from('enquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', enquiry.id);

      if (updateErr) throw updateErr;

      // Log status history if table exists
      try {
        if (adminUser) {
          await supabase.from('enquiry_status_history').insert({
            enquiry_id: enquiry.id,
            previous_status: oldStatus,
            new_status: newStatus,
            changed_by: adminUser.id,
          });
        }
      } catch (histErr) {
        console.warn('Could not record status history:', histErr);
      }

      setEnquiry((prev) => ({ ...prev, status: newStatus }));
      refreshDetail();
    } catch (err: any) {
      console.error('Status update failed:', err);
      alert(`Couldn't update status: ${err.message || 'Please try again.'}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Add Internal Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newNote.trim();
    if (!trimmed || !adminUser || !enquiry || addingNote) return;

    setAddingNote(true);

    try {
      const { error: noteErr } = await supabase.from('enquiry_notes').insert({
        enquiry_id: enquiry.id,
        admin_id: adminUser.id,
        note: trimmed,
      });

      if (noteErr) throw noteErr;

      setNewNote('');
      refreshDetail();
    } catch (err: any) {
      console.error('Adding note failed:', err);
      alert(`Couldn't save note: ${err.message || 'Please ensure Phase 5 database migration is applied.'}`);
    } finally {
      setAddingNote(false);
    }
  };

  // Confirm and toggle Archive state
  const confirmArchiveToggle = async () => {
    if (!enquiry || archiving) return;
    setArchiving(true);
    const isArchived = Boolean(enquiry.archived_at);

    try {
      const { error: archErr } = await supabase
        .from('enquiries')
        .update({
          archived_at: isArchived ? null : new Date().toISOString(),
        })
        .eq('id', enquiry.id);

      if (archErr) throw archErr;

      setShowArchiveModal(false);
      refreshDetail();
    } catch (err: any) {
      console.error('Archive toggle failed:', err);
      alert(`Couldn't update archive status: ${err.message || 'Please try again.'}`);
    } finally {
      setArchiving(false);
    }
  };

  // Copy phone number
  const copyPhone = () => {
    if (enquiry?.phone && navigator.clipboard) {
      navigator.clipboard.writeText(enquiry.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Pre-filled WhatsApp message for Admin -> Traveller
  const firstName = enquiry.name.split(' ')[0] || enquiry.name;
  const adminFirstName = adminUser?.name?.split(' ')[0] || 'Friendli Team';
  const waRaw = `Hi ${firstName} 👋\n\nThis is ${adminFirstName} from Friendli Tripz regarding your ${enquiry.destination} trip enquiry (${enquiry.reference}).\n\nI'd like to continue with your trip requirements.`;
  const waPhoneClean = enquiry.phone.replace(/[\s\-\(\)]/g, '');
  const waFormattedPhone = waPhoneClean.startsWith('+') ? waPhoneClean.substring(1) : waPhoneClean.startsWith('91') ? waPhoneClean : `91${waPhoneClean.slice(-10)}`;
  const waHref = `https://wa.me/${waFormattedPhone}?text=${encodeURIComponent(waRaw)}`;

  return (
    <AdminLayout
      initialNewCount={initialNewCount}
      adminName={adminUser?.name}
      adminEmail={adminUser?.email}
    >
      <div className="space-y-6 pb-12">
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/enquiries"
              className="p-2 rounded-xl text-brand-navy hover:bg-brand-soft-navy transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center border border-brand-border/40"
              title="Back to Enquiries"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black text-brand-navy">
                  {enquiry.reference}
                </span>
                {enquiry.archived_at && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-gray-200 text-gray-700">
                    ARCHIVED
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-muted mt-0.5">
                Submitted on{' '}
                {enquiry.created_at
                  ? new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Recent'}
              </p>
            </div>
          </div>

          {/* Archive Modal Trigger Button */}
          <button
            onClick={() => {
              if (enquiry.archived_at) {
                confirmArchiveToggle();
              } else {
                setShowArchiveModal(true);
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-navy hover:bg-brand-soft-navy transition-colors shrink-0 min-h-[44px]"
          >
            {enquiry.archived_at ? (
              <>
                <ArchiveRestore className="w-4 h-4 text-emerald-600" />
                <span>Restore Enquiry</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4 text-slate-500" />
                <span>Archive Enquiry</span>
              </>
            )}
          </button>
        </div>

        {/* Action Trigger Bar: WhatsApp, Call, Copy Number */}
        <div className="bg-white rounded-2xl p-4 border border-brand-border/60 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider font-mono">
            Quick Admin Actions:
          </span>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Traveller</span>
            </a>

            <a
              href={`tel:${enquiry.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-dark text-white font-bold text-xs shadow-sm transition-colors min-h-[44px]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call ({enquiry.phone})</span>
            </a>

            <button
              onClick={copyPhone}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-navy hover:bg-brand-warm transition-colors min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-brand-muted" />}
              <span>{copied ? 'Copied!' : 'Copy Number'}</span>
            </button>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Traveller & Trip Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Traveller Details */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-border/60 shadow-card space-y-3">
              <h2 className="text-base font-bold text-brand-navy font-heading border-b border-brand-border/60 pb-2.5 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-orange" />
                <span>1. Traveller Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] text-brand-muted block font-mono uppercase">Full Name</span>
                  <span className="font-bold text-brand-navy text-base">{enquiry.name}</span>
                </div>
                <div>
                  <span className="text-[11px] text-brand-muted block font-mono uppercase">WhatsApp / Phone</span>
                  <span className="font-bold text-brand-navy font-mono text-base">{enquiry.phone}</span>
                </div>
                <div>
                  <span className="text-[11px] text-brand-muted block font-mono uppercase">Email</span>
                  <span className="font-semibold text-brand-navy">{enquiry.email || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-border/60 shadow-card space-y-3">
              <h2 className="text-base font-bold text-brand-navy font-heading border-b border-brand-border/60 pb-2.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-orange" />
                <span>2. Trip Preferences</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] text-brand-muted block font-mono uppercase">Destination</span>
                  <span className="font-bold text-brand-navy">{enquiry.destination}</span>
                </div>
                <div>
                  <span className="text-[11px] text-brand-muted block font-mono uppercase">Travellers</span>
                  <span className="font-bold text-brand-navy">{enquiry.traveller_count} travellers</span>
                </div>
                <div>
                  <span className="text-[11px] text-brand-muted block font-mono uppercase">Preferred Date</span>
                  <span className="font-bold text-brand-navy">{enquiry.preferred_date || 'Flexible'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-brand-muted block font-mono uppercase">Starting City</span>
                  <span className="font-bold text-brand-navy">{enquiry.starting_location || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-brand-muted block font-mono uppercase">Trip Type</span>
                  <span className="font-bold text-brand-navy">{enquiry.trip_type || 'Group Trip'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-brand-muted block font-mono uppercase">Stay Preference</span>
                  <span className="font-bold text-brand-navy">{enquiry.stay_preference || 'Comfortable'}</span>
                </div>
              </div>

              {enquiry.notes_from_traveller && (
                <div className="pt-2 border-t border-brand-border/40">
                  <span className="text-[11px] text-brand-muted block font-mono uppercase mb-1">
                    Special Requests or Notes from Traveller
                  </span>
                  <p className="p-3 rounded-xl bg-brand-warm text-xs sm:text-sm text-brand-navy font-medium italic">
                    &ldquo;{enquiry.notes_from_traveller}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Internal Notes Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-border/60 shadow-card space-y-5">
              <h2 className="text-base font-bold text-brand-navy font-heading border-b border-brand-border/60 pb-2.5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-orange" />
                <span>3. Internal Notes (Private to Admin Team)</span>
              </h2>

              {!notesAvailable ? (
                <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  Notes table unavailable. Please run the Phase 5 database migration in Supabase to enable internal notes.
                </p>
              ) : (
                <>
                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="space-y-3">
                    <textarea
                      rows={3}
                      placeholder="Add an internal note about this enquiry (e.g. 'Customer prefers Aug 15. Asked about Coimbatore pickup...')"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-navy font-medium outline-none focus:border-brand-orange"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={addingNote || !newNote.trim()}
                        icon={addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      >
                        {addingNote ? 'Saving...' : 'Add Note'}
                      </Button>
                    </div>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-2.5 pt-1">
                    {notes.length === 0 ? (
                      <p className="text-xs text-brand-muted italic text-center py-3">
                        No internal notes added yet.
                      </p>
                    ) : (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3.5 rounded-2xl bg-brand-soft-navy/50 border border-brand-navy/10 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between text-brand-navy font-bold">
                            <span>{adminUser?.name || 'Admin Team'}</span>
                            <span className="text-brand-muted font-normal font-mono">
                              {note.created_at
                                ? new Date(note.created_at).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : ''}
                            </span>
                          </div>
                          <p className="text-brand-navy text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                            {note.note}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Sidebar: Status Management & Audit Trail */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Selector Box */}
            <div className="bg-white rounded-3xl p-5 border border-brand-border/60 shadow-card space-y-3.5">
              <h3 className="font-heading font-bold text-sm text-brand-navy border-b border-brand-border/60 pb-2">
                Status Management
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-brand-muted uppercase font-mono mb-1.5">
                  Current Status
                </label>
                <select
                  value={enquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs sm:text-sm font-bold text-brand-navy outline-none focus:border-brand-orange bg-white cursor-pointer min-h-[44px]"
                >
                  <option value="new">NEW</option>
                  <option value="contacted">CONTACTED</option>
                  <option value="follow_up">FOLLOW-UP</option>
                  <option value="confirmed">CONFIRMED</option>
                  <option value="completed">COMPLETED</option>
                  <option value="cancelled">CANCELLED</option>
                </select>
              </div>

              {updatingStatus && (
                <p className="text-xs text-brand-orange flex items-center gap-1 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating status...</span>
                </p>
              )}
            </div>

            {/* Status History Timeline */}
            <div className="bg-white rounded-3xl p-5 border border-brand-border/60 shadow-card space-y-3.5">
              <h3 className="font-heading font-bold text-sm text-brand-navy border-b border-brand-border/60 pb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange" />
                <span>Status History</span>
              </h3>

              {!historyAvailable ? (
                <p className="text-xs text-brand-muted italic">Status history unavailable until Phase 5 migration is applied.</p>
              ) : history.length === 0 ? (
                <p className="text-xs text-brand-muted italic">No status changes recorded yet.</p>
              ) : (
                <div className="space-y-3 relative pl-4 border-l-2 border-brand-border/60 text-xs">
                  {history.map((h) => (
                    <div key={h.id} className="relative space-y-0.5">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-orange" />
                      <span className="text-[11px] text-brand-muted font-mono block">
                        {h.created_at
                          ? new Date(h.created_at).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                      <p className="font-bold text-brand-navy">
                        {h.previous_status ? `${h.previous_status.toUpperCase()} → ` : ''}
                        <span className="text-brand-orange">{h.new_status.toUpperCase()}</span>
                      </p>
                      <span className="text-[10px] text-brand-muted block">
                        Changed by {adminUser?.name || 'Admin'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal for Archiving */}
        {showArchiveModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border/60 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-navy">
                  <Archive className="w-5 h-5 text-brand-orange" />
                  <h3 className="font-heading font-black text-lg">Archive this enquiry?</h3>
                </div>
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="p-1 rounded-lg text-brand-muted hover:text-brand-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                This enquiry (<strong className="font-mono text-brand-navy">{enquiry.reference}</strong>) will be removed from Active enquiries but safely retained in Friendli records.
              </p>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowArchiveModal(false)}
                  disabled={archiving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={confirmArchiveToggle}
                  disabled={archiving}
                  icon={archiving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                >
                  {archiving ? 'Archiving...' : 'Archive'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
