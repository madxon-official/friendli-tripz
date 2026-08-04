'use client';

import { useEffect } from 'react';

export function useRealtimeSubscription(
  tableName: string,
  onPayload?: (payload: unknown) => void
) {
  useEffect(() => {
    let channel: { unsubscribe: () => void } | null = null;

    async function subscribe() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        channel = supabase
          .channel(`public:${tableName}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: tableName },
            (payload) => {
              if (onPayload) {
                onPayload(payload);
              }
            }
          )
          .subscribe();
      } catch {
        // Realtime subscription fallback when Supabase is offline or env vars absent
      }
    }

    subscribe();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [tableName, onPayload]);
}
