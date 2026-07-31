import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { getRemainingAiUses, initAiCredits } from "@/components/aiUsageLimit";

const DAILY_MAX = 8;
const EXEMPT_EMAIL = "yychang100@student.hbuhsd.edu";

export default function AiUsageCounter() {
  const [user, setUser] = useState(null);
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    db.auth.me().then(async u => {
      setUser(u);
      if (u.email === EXEMPT_EMAIL) return; // unlimited
      await initAiCredits(u.email);
      setRemaining(getRemainingAiUses(u.email));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user?.email || user.email === EXEMPT_EMAIL) return;
    const handler = () => setRemaining(getRemainingAiUses(user.email));
    window.addEventListener("ai_usage_update", handler);
    return () => window.removeEventListener("ai_usage_update", handler);
  }, [user]);

  if (!user || user.email === EXEMPT_EMAIL) return null;
  if (remaining === null) return null;

  const pct = Math.max(0, Math.min(1, remaining / DAILY_MAX));
  const color = pct > 0.5 ? "text-emerald-400" : pct > 0.2 ? "text-amber-400" : "text-red-400";
  const barColor = pct > 0.5 ? "bg-emerald-500" : pct > 0.2 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-1.5" title={`${remaining} AI credits left`}>
      <Sparkles className={`w-3.5 h-3.5 shrink-0 ${color}`} />
      <div className="flex flex-col gap-0.5">
        <span className={`text-[10px] font-bold leading-none ${color}`}>{Math.round(remaining)}/{DAILY_MAX}</span>
        <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct * 100}%` }} />
        </div>
      </div>
    </div>
  );
  // Always visible — no hidden class
}