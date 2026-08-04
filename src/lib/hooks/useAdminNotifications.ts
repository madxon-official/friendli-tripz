'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRealtimeSubscription } from './useRealtime';

export interface AdminNotificationItem {
  id: string;
  recipient_id?: string | null;
  title: string;
  body: string;
  type: string;
  link?: string | null;
  is_read: boolean;
  created_at: string;
}

/**
 * Triggers a web browser audio alert chime when a new enquiry or notification arrives.
 */
function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 tone
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.18); // A5 chime
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch {
    // Ignore autoplay restriction errors
  }
}

/**
 * Dispatches an HTML5 Desktop Browser Notification.
 */
export function triggerBrowserNotification(title: string, body: string, link?: string | null) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    const notif = new Notification(title, {
      body,
      icon: '/friendli/logo.svg',
      badge: '/friendli/logo.svg',
      tag: `enquiry_${Date.now()}`,
    });

    if (link) {
      notif.onclick = () => {
        window.focus();
        window.location.href = link;
      };
    }
    playNotificationSound();
  } else if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        triggerBrowserNotification(title, body, link);
      }
    });
  }
}

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  const loadNotifications = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error } = await supabase
        .from('admin_notifications')
        .select('id, recipient_id, title, body, type, link, is_read, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data as AdminNotificationItem[]);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
      }
    } catch {
      // Fallback
    }
  };

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      setPermissionStatus(res);
      return res;
    }
    return 'denied' as NotificationPermission;
  }, []);

  useEffect(() => {
    loadNotifications();

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(setPermissionStatus);
      }
    }
  }, []);

  // Realtime postgres_changes subscription for instant browser push notifications
  useRealtimeSubscription('admin_notifications', (payload: any) => {
    loadNotifications();

    if (payload?.eventType === 'INSERT' && payload?.new) {
      const newNotif = payload.new;
      triggerBrowserNotification(
        newNotif.title || 'New Enquiry Received!',
        newNotif.body || 'A new trip enquiry has been submitted on Friendli Tripz.',
        newNotif.link || '/admin/enquiries'
      );
    }
  });

  return {
    notifications,
    unreadCount,
    permissionStatus,
    requestPermission: requestNotificationPermission,
    refresh: loadNotifications,
    triggerBrowserNotification,
  };
}
