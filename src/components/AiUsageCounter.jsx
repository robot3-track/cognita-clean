import { db } from '@/lib/firebase';
import { useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { getRemainingAiUses, initAiCredits } from "@/components/aiUsageLimit";

const DAILY_MAX = 8;
const EXEMPT_EMAIL = "yychang100@student.hbuhsd.edu";

export function triggerAiUsageUpdate() {
  window.dispatchEvent(new Event("ai_usage_update"));
}

export default function AiUsageCounter() {
  const [user, setUser] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [maxCredits, setMaxCredits] = useState(DAILY_MAX);

  const refreshUsage = useCallback((email) => {
    if (!email || email === EXEMPT_EMAIL) return;
    const currentRemaining = getRemainingAiUses(email);
    
    setRemaining(currentRemaining);
    setMaxCredits(Math.max(DAILY_MAX, currentRemaining));
  }, []);

  useEffect(() => {
    let isMounted = true;
    db.auth.me().then(async (u) => {
      if (!isMounted || !u) return;
      setUser(u);
      if (u.email === EXEMPT_EMAIL) return;
      
      await initAiCredits(u.email);
      refreshUsage(u.email);
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [refreshUsage]);

  useEffect(() => {
    if (!user?.email || user.email === EXEMPT_EMAIL) return;

    const handler = () => refreshUsage(user.email);

    window.addEventListener("ai_usage_update", handler);
    window.addEventListener("storage", handler);
    window.addEventListener("focus", handler);

    const interval = setInterval(handler, 3000);

    return () => {
      window.removeEventListener("ai_usage_update", handler);
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", handler);
      clearInterval(interval);
    };
  }, [user, refreshUsage]);

  if (!user || user.email === EXEMPT_EMAIL) return null;
  if (remaining === null) return null;

  const pct = Math.max(0, Math.min(1, remaining / maxCredits));
  const color = pct > 0.5 ? "text-emerald-400" : pct > 0.2 ? "text-amber-400" : "text-red-400";
  const barColor = pct > 0.5 ? "bg-emerald-500" : pct > 0.2 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-1.5" title={`${remaining} AI credits left`}>
      <Sparkles className={`w-3.5 h-3.5 shrink-0 ${color}`} />
      <div className="flex flex-col gap-0.5">
        <span className={`text-[10px] font-bold leading-none ${color}`}>
          {Math.round(remaining)}/{maxCredits}
        </span>
        <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${barColor}`} 
            style={{ width: `${pct * 100}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
