import { useState, useEffect } from "react";

import { Flame, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../hooks/useTranslation";

const STREAK_KEY = "cognita_streak";
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

function getStreakData(sessions, userEmail) {
  const today = new Date().toISOString().slice(0, 10);
  const mySessions = sessions.filter(s => s.user_email === userEmail || s.created_by === userEmail);
  const days = new Set(mySessions.map(s => s.created_date?.slice(0, 10)).filter(Boolean));
  
  // Calculate streak
  let streak = 0;
  let d = new Date();
  // If no session today, start checking from yesterday
  if (!days.has(today)) d.setDate(d.getDate() - 1);
  
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }

  const studiedToday = days.has(today);
  return { streak, studiedToday };
}

export function computeStats(sessions, userEmail) {
  const mySessions = sessions.filter(s => s.user_email === userEmail || s.created_by === userEmail);
  const totalCards = mySessions.reduce((s, x) => s + (x.cards_reviewed || 0), 0);
  const totalMinutes = mySessions.reduce((s, x) => s + (x.duration_minutes || 0), 0);
  const total = mySessions.length;
  const perfectQuiz = mySessions.some(s => s.quiz_score === 100 && s.quiz_total > 0);
  return { totalCards, totalMinutes, total, perfectQuiz };
}

export function getEarnedBadges(stats) {
  return BADGE_DEFS.filter(b => b.check(stats));
}

export default function StreakBadges({ sessions, userEmail }) {
  const { t } = useTranslation();
  const [newBadges, setNewBadges] = useState([]);

  const { streak, studiedToday } = getStreakData(sessions, userEmail);
  const stats = { ...computeStats(sessions, userEmail), streak };
  const earned = getEarnedBadges(stats);

  useEffect(() => {
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
    <div className="mb-6">
        {/* Badge unlock banner removed */}

      <div className="rounded-3xl p-5" style={cardStyle}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${studiedToday ? "bg-orange-500/20" : "bg-white/5"}`}>
            🔥
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-2xl leading-none">{streak} <span className="text-base font-semibold opacity-60">{streak !== 1 ? t('daysLabel') : t('dayLabel')}</span></p>
            <p className="text-sm font-semibold mt-0.5">{t('studyStreakLabel')}</p>
            <p className="text-xs mt-1" style={mutedStyle}>{studiedToday ? t('studiedTodayMsg') : t('studyTodayWarning')}</p>
          </div>
          <Link to={createPageUrl("Badges")} className="shrink-0">
            <div className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all hover:bg-violet-500/10" style={{ border: "1px solid var(--app-border)" }}>
              <Award className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] font-bold text-violet-400">{earned.length} badges</span>
            </div>
          </Link>
        </div>
        {streak >= 3 && (
          <div className="flex items-center gap-1 mt-3 text-orange-400 font-bold text-sm">
            <Flame className="w-4 h-4" /> {streak}-day streak 🔥
          </div>
        )}
      </div>
    </div>
  );
}