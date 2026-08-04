'use client';

import { useState, useEffect } from 'react';
import { getCurrentAdminProfile, DbTeamMember } from '@/lib/actions/teamActions';
import { AdminRole } from '@/lib/rbac/roles';

export function useCurrentAdminProfile() {
  const [profile, setProfile] = useState<DbTeamMember | null>(null);
  const [role, setRole] = useState<AdminRole>('owner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCurrentAdminProfile().then((res) => {
      if (mounted) {
        if (res) {
          setProfile(res);
          setRole(res.role);
        } else {
          // Default to owner if database profile initial seed
          setRole('owner');
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { profile, role, loading };
}
