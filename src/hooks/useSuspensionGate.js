import { db } from '@/lib/firebase';

import { useEffect, useState } from "react";

/**
 * Returns { suspended: bool, status: "suspended"|"banned"|null }
 * for the current user. Components can block UI accordingly.
 */
export function useSuspensionGate(user) {
  const [suspended, setSuspended] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    db.entities.SuspendedUser.filter({ user_email: user.email })
      .then(records => {
        const active = records.find(r => r.status === "suspended" || r.status === "banned");
        if (active) { setSuspended(true); setStatus(active.status); }
        else { setSuspended(false); setStatus(null); }
      })
      .catch(() => {});
  }, [user?.email]);

  return { suspended, status };
}