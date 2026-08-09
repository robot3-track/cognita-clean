import { useState, useEffect } from "react";
import { 
  Flame, 
  Award, 
  Target, 
  Zap, 
  Trophy, 
  BookOpen, 
  Brain, 
  Crown, 
  Timer, 
  GraduationCap, 
  Sparkles 
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../hooks/useTranslation";

const BADGES_KEY = "cognita_badges";
const BADGES_SEEN_KEY = "cognita_badges_seen";

const BADGE_DEFS = [
  { id: "first_session", label: "First Step", desc: "Complete your first study session", icon: Target, check: (s) => s.total >= 1 },
  { id: "streak_3", label: "On Fire", desc: "3-day study streak", icon: Flame, check: (s) => s.streak >= 3 },
  { id: "streak_7", label: "Week Warrior", desc: "7-day study streak", icon: Zap, check: (s) => s.streak >= 7 },
  { id: "streak_30", label: "Unstoppable", desc: "30-day study streak", icon: Trophy, check: (s) => s.streak >= 30 },
  { id: "cards_50", label: "Card Collector", desc: "Review 50 flashcards", icon: BookOpen, check: (s) => s.totalCards >= 50 },
  { id: "cards_500", label: "Knowledge Seeker", desc: "Review 500 flashcards", icon: Brain, check: (s) => s.totalCards >= 500 },
  { id: "cards_1000", label: "Grand Master", desc: "Review 1,000 flashcards", icon: Crown, check: (s) => s.totalCards >= 1000 },
  { id: "minutes_60", label: "Deep Focus", desc: "Study for 60 total minutes", icon: Timer, check: (s) => s.totalMinutes >= 60 },
  { id: "minutes_300", label: "Scholar", desc: "Study for 5 total hours", icon: GraduationCap, check: (s) => s.totalMinutes >= 300 },
  { id: "quiz_ace", label: "Quiz Ace", desc: "Score 100% on a quiz", icon: Sparkles, check: (s) => s.perfectQuiz },
];

function getStreakData(sessions, userEmail) {
  const today = new Date().toISOString().slice(0, 10);
  const mySessions = (sessions || []).filter(s => s.user_email === userEmail || s.created_by === userEmail);
  const days = new Set(mySessions.map(s => s.created_date?.slice(0, 10)).filter(Boolean));
  
  let streak = 0;
  let d = new Date();
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
  const mySessions = (sessions || []).filter(s => s.user_email === userEmail || s.created_by === userEmail);
  const totalCards = mySessions.reduce((s, x) => s + (x.cards_reviewed || 0), 0);
  const totalMinutes = mySessions.reduce((s, x) => s + (x.duration_minutes || 0), 0);
  const total = mySessions.length;
  const perfectQuiz = mySessions.some(s => s.quiz_score === 100 && s.quiz_total > 0);
  return { totalCards, totalMinutes, total, perfectQuiz };
}

export function getEarnedBadges(stats) {
  return BADGE_DEFS.filter(b => b.check(stats));
}

export default function StreakBadges({ sessions = [], userEmail }) {
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

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="mb-6 w-full">
      <div className="rounded-3xl p-4 sm:p-5 w-full" style={cardStyle}>
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          
          {/* Left Flame Icon */}
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            studiedToday ? "bg-orange-500/20 text-orange-400" : "bg-white/5 text-neutral-400"
          }`}>
            <Flame className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          {/* Middle Info Block - Clean Spacing */}
          <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-black leading-tight">
                {streak}
              </span>
              <span className="text-xs sm:text-sm font-semibold opacity-60">
                {streak !== 1 ? t('daysLabel') : t('dayLabel')}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold leading-tight truncate">
              {t('studyStreakLabel')}
            </p>

            <p className="text-xs leading-tight truncate" style={mutedStyle}>
              {studiedToday ? t('studiedTodayMsg') : t('studyTodayWarning')}
            </p>
          </div>

          {/* Right Badges Link */}
          <Link to={createPageUrl("Badges")} className="shrink-0 ml-auto">
            <div 
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all hover:bg-violet-500/10 min-w-[70px]" 
              style={{ border: "1px solid var(--app-border)" }}
            >
              <Award className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] font-bold text-violet-400 whitespace-nowrap">
                {earned.length} badges
              </span>
            </div>
          </Link>

        </div>

        {streak >= 3 && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5 text-orange-400 font-bold text-xs sm:text-sm">
            <Flame className="w-4 h-4 shrink-0" />
            <span>{streak}-day streak</span>
          </div>
        )}
      </div>
    </div>
  );
}
