'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, X, CheckCheck, Compass, MessageSquare, UserPlus, Info } from 'lucide-react';
import { AdminNotificationItem } from '@/lib/hooks/useAdminNotifications';
import { markAllNotificationsAsRead } from '@/lib/actions/teamActions';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminNotificationItem[];
  onRefresh: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh,
}) => {
  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    onRefresh();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'team_invite':
        return <UserPlus className="w-4 h-4 text-brand-orange" />;
      case 'enquiry':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'trip':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-elevated z-50 animate-fade-in text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-orange" />
            <h3 className="text-sm font-bold text-white">Notifications & Alerts</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark read
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              <Bell className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
              No notifications in stream.
            </div>
          ) : (
            notifications.map((item) => (
              <Link
                key={item.id}
                href={item.link || '#'}
                onClick={onClose}
                className={`block p-4 rounded-2xl border transition-all ${
                  item.is_read
                    ? 'bg-slate-950/50 border-slate-800/60 text-slate-400'
                    : 'bg-slate-950 border-slate-800 text-slate-100 ring-1 ring-brand-orange/20 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
