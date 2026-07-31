import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import { Users, Trophy, Clock } from "lucide-react";

export default function LiveActivityBar() {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [sessions, pomodoro] = await Promise.all([
        db.entities.StudySession.list("-created_date", 200),
        db.entities.PomodoroSession.filter({ status: "focusing" }),
      ]);

      const built = [];

      // How many people studied today
      const todayUsers = new Set(sessions.filter(s => s.created_date?.slice(0,10) === today && s.user_email).map(s => s.user_email));
      if (todayUsers.size >= 1) {
        built.push({ icon: Users, color: "text-violet-400", text: `${todayUsers.size} student${todayUsers.size !== 1 ? "s" : ""} studying today` });
      }

      // Total hours — fetch all sessions (not capped at 200)
      const allSessions = await db.entities.StudySession.list("-created_date", 2000);
      const totalHours = Math.round(allSessions.reduce((s, r) => s + (r.duration_minutes || 0), 0) / 60);
      if (totalHours >= 1) {
        built.push({ icon: Clock, color: "text-blue-400", text: `${totalHours.toLocaleString()} hours studied by the community` });
      }

      // Who's focusing right now (Pomodoro)
      if (pomodoro.length >= 1) {
        built.push({ icon: Users, color: "text-emerald-400", text: `${pomodoro.length} user${pomodoro.length !== 1 ? "s" : ""} in focus mode right now 🔥` });
      }

      // Leaderboard leader — most time studied today
      const byUserTime = {};
      allSessions.filter(s => s.created_date?.slice(0,10) === today).forEach(s => {
        if (s.user_email) byUserTime[s.user_email] = (byUserTime[s.user_email] || 0) + (s.duration_minutes || 0);
      });
      const sorted = Object.entries(byUserTime).sort((a,b) => b[1]-a[1]);
      if (sorted.length > 0) {
        const [email, mins] = sorted[0];
        const name = email.split("@")[0];
        const hrs = mins >= 60 ? `${(mins/60).toFixed(1)}h` : `${mins}m`;
        built.push({ icon: Trophy, color: "text-amber-400", text: `🏆 ${name} is leading with ${hrs} studied today` });
      }

      setItems(built);
    };

    load().catch(() => {});
  }, []);

  // Cycle through items every 4s
  useEffect(() => {
    if (items.length < 2) return;
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % items.length), 4000);
    return () => clearInterval(timerRef.current);
  }, [items]);

  if (items.length === 0) return null;

  const item = items[idx];
  const Icon = item.icon;

  return (
    <div className="rounded-2xl px-4 py-3 mb-5 flex items-center gap-3 transition-all"
      style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
      <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
      <p className="text-xs font-medium flex-1 truncate" style={{ color: "var(--app-text-muted)" }}>{item.text}</p>
      {items.length > 1 && (
        <div className="flex gap-1 shrink-0">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`rounded-full transition-all ${i === idx ? "w-4 h-1.5 bg-violet-500" : "w-1.5 h-1.5 bg-white/20"}`} />
          ))}
        </div>
      )}
    </div>
  );
}