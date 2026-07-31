import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Award } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { computeStats, getEarnedBadges } from "@/components/StreakBadges";

const BADGES_KEY = "cognita_badges";
const BADGES_SEEN_KEY = "cognita_badges_seen";

const BADGE_DEFS = [
  { id: "first_session", label: "First Step", desc: "Complete your first study session", emoji: "🎯", check: (s) => s.total >= 1 },
  { id: "streak_3", label: "On Fire", desc: "3-day study streak", emoji: "🔥", check: (s) => s.streak >= 3 },
  { id: "streak_7", label: "Week Warrior", desc: "7-day study streak", emoji: "⚡", check: (s) => s.streak >= 7 },
  { id: "streak_30", label: "Unstoppable", desc: "30-day study streak", emoji: "🏆", check: (s) => s.streak >= 30 },
  { id: "cards_50", label: "Card Collector", desc: "Review 50 flashcards", emoji: "📚", check: (s) => s.totalCards >= 50 },
  { id: "cards_500", label: "Knowledge Seeker", desc: "Review 500 flashcards", emoji: "🧠", check: (s) => s.totalCards >= 500 },
  { id: "cards_1000", label: "Grand Master", desc: "Review 1,000 flashcards", emoji: "👑", check: (s) => s.totalCards >= 1000 },
  { id: "minutes_60", label: "Deep Focus", desc: "Study for 60 total minutes", emoji: "⏱️", check: (s) => s.totalMinutes >= 60 },
  { id: "minutes_300", label: "Scholar", desc: "Study for 5 total hours", emoji: "🎓", check: (s) => s.totalMinutes >= 300 },
  { id: "quiz_ace", label: "Quiz Ace", desc: "Score 100% on a quiz", emoji: "💯", check: (s) => s.perfectQuiz },
];

function getStreak(sessions, userEmail) {
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local
  const mySessions = sessions.filter(s => s.user_email === userEmail || s.created_by === userEmail);
  const days = new Set(mySessions.map(s => {
    if (!s.created_date) return null;
    return new Date(s.created_date).toLocaleDateString("en-CA");
  }).filter(Boolean));
  let streak = 0;
  let d = new Date();
  if (!days.has(today)) d.setDate(d.getDate() - 1);
  while (true) {
    const key = d.toLocaleDateString("en-CA");
    if (!days.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function Badges() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [newBadges, setNewBadges] = useState([]);

  useEffect(() => {
    Promise.all([
      db.auth.me(),
      db.entities.StudySession.list("-created_date", 2000),
    ]).then(([me, s]) => {
      setUser(me);
      setSessions(s);
    }).catch(() => {});
  }, []);

  const streak = user ? getStreak(sessions, user.email) : 0;
  const stats = user ? { ...computeStats(sessions, user.email), streak } : null;
  const earned = stats ? getEarnedBadges(stats) : [];
  const earnedIds = new Set(earned.map(b => b.id));

  useEffect(() => {
    if (!earned.length) return;
    const prev = JSON.parse(localStorage.getItem(BADGES_KEY) || "[]");
    const seen = JSON.parse(localStorage.getItem(BADGES_SEEN_KEY) || "[]");
    const seenSet = new Set(seen);
    const prevSet = new Set(prev);
    const fresh = earned.filter(b => !prevSet.has(b.id) && !seenSet.has(b.id));
    if (fresh.length > 0) setNewBadges(fresh);
    localStorage.setItem(BADGES_KEY, JSON.stringify(earned.map(b => b.id)));
  }, [earned.length]);

  const dismissToast = () => {
    const seen = JSON.parse(localStorage.getItem(BADGES_SEEN_KEY) || "[]");
    localStorage.setItem(BADGES_SEEN_KEY, JSON.stringify([...new Set([...seen, ...newBadges.map(b => b.id)])]));
    setNewBadges([]);
  };

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen px-5 pt-8 pb-16" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Award className="w-6 h-6 text-violet-400" />
          <div>
            <h1 className="text-2xl font-black">Badges</h1>
            <p className="text-sm mt-0.5" style={mutedStyle}>Achievements earned through studying</p>
          </div>
          <div className="ml-auto px-3 py-1 rounded-full bg-violet-500/15 text-violet-400 text-sm font-bold">
            {earned.length}/{BADGE_DEFS.length}
          </div>
        </div>

        {/* Badge unlock toasts removed */}

        <div className="space-y-2">
          {BADGE_DEFS.map(b => {
            const isEarned = earnedIds.has(b.id);
            return (
              <div key={b.id}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${isEarned ? "border border-violet-500/25 bg-violet-500/8" : "opacity-45"}`}
                style={!isEarned ? cardStyle : {}}>
                <span className="text-2xl w-9 text-center shrink-0">{b.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{b.label}</p>
                  <p className="text-xs mt-0.5" style={mutedStyle}>{b.desc}</p>
                </div>
                {isEarned && <span className="text-xs text-emerald-400 font-semibold shrink-0">Earned ✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}