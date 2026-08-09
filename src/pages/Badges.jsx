import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { 
  Award, 
  Flame, 
  Zap, 
  Trophy, 
  BookOpen, 
  Brain, 
  Crown, 
  Timer, 
  GraduationCap, 
  Target, 
  CheckCircle2, 
  Lock,
  Sparkles
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { computeStats, getEarnedBadges } from "@/components/StreakBadges";

const BADGES_KEY = "cognita_badges";
const BADGES_SEEN_KEY = "cognita_badges_seen";

// Rich badge definitions with categories, custom icons, and progress calculators
const BADGE_DEFS = [
  { 
    id: "first_session", 
    label: "First Step", 
    desc: "Complete 1 study session", 
    category: "general",
    icon: Target, 
    color: "from-blue-500 to-cyan-400",
    check: (s) => s.total >= 1,
    progress: (s) => ({ current: Math.min(s.total, 1), target: 1 })
  },
  { 
    id: "streak_3", 
    label: "On Fire", 
    desc: "Maintain a 3-day streak", 
    category: "streaks",
    icon: Flame, 
    color: "from-orange-500 to-amber-400",
    check: (s) => s.streak >= 3,
    progress: (s) => ({ current: Math.min(s.streak, 3), target: 3 })
  },
  { 
    id: "streak_7", 
    label: "Week Warrior", 
    desc: "Maintain a 7-day streak", 
    category: "streaks",
    icon: Zap, 
    color: "from-amber-500 to-yellow-300",
    check: (s) => s.streak >= 7,
    progress: (s) => ({ current: Math.min(s.streak, 7), target: 7 })
  },
  { 
    id: "streak_30", 
    label: "Unstoppable", 
    desc: "Reach a 30-day streak", 
    category: "streaks",
    icon: Trophy, 
    color: "from-yellow-400 to-orange-500",
    check: (s) => s.streak >= 30,
    progress: (s) => ({ current: Math.min(s.streak, 30), target: 30 })
  },
  { 
    id: "cards_50", 
    label: "Card Collector", 
    desc: "Review 50 flashcards", 
    category: "cards",
    icon: BookOpen, 
    color: "from-emerald-500 to-teal-400",
    check: (s) => s.totalCards >= 50,
    progress: (s) => ({ current: Math.min(s.totalCards, 50), target: 50 })
  },
  { 
    id: "cards_500", 
    label: "Knowledge Seeker", 
    desc: "Review 500 flashcards", 
    category: "cards",
    icon: Brain, 
    color: "from-indigo-500 to-violet-400",
    check: (s) => s.totalCards >= 500,
    progress: (s) => ({ current: Math.min(s.totalCards, 500), target: 500 })
  },
  { 
    id: "cards_1000", 
    label: "Grand Master", 
    desc: "Review 1,000 flashcards", 
    category: "cards",
    icon: Crown, 
    color: "from-purple-500 to-pink-500",
    check: (s) => s.totalCards >= 1000,
    progress: (s) => ({ current: Math.min(s.totalCards, 1000), target: 1000 })
  },
  { 
    id: "minutes_60", 
    label: "Deep Focus", 
    desc: "Study for 60 minutes", 
    category: "time",
    icon: Timer, 
    color: "from-sky-500 to-indigo-400",
    check: (s) => s.totalMinutes >= 60,
    progress: (s) => ({ current: Math.min(s.totalMinutes, 60), target: 60 })
  },
  { 
    id: "minutes_300", 
    label: "Scholar", 
    desc: "Study for 5 total hours", 
    category: "time",
    icon: GraduationCap, 
    color: "from-violet-600 to-fuchsia-500",
    check: (s) => s.totalMinutes >= 300,
    progress: (s) => ({ current: Math.min(s.totalMinutes, 300), target: 300 })
  },
  { 
    id: "quiz_ace", 
    label: "Quiz Ace", 
    desc: "Score 100% on any quiz", 
    category: "general",
    icon: Sparkles, 
    color: "from-rose-500 to-red-400",
    check: (s) => s.perfectQuiz,
    progress: (s) => ({ current: s.perfectQuiz ? 1 : 0, target: 1 })
  },
];

function getStreak(sessions, userEmail) {
  const today = new Date().toLocaleDateString("en-CA");
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
  const [filter, setFilter] = useState("all");

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
  const stats = user ? { ...computeStats(sessions, user.email), streak } : { total: 0, totalCards: 0, totalMinutes: 0, streak: 0, perfectQuiz: false };
  const earned = stats ? getEarnedBadges(stats) : [];
  const earnedIds = new Set(earned.map(b => b.id));

  const filteredBadges = BADGE_DEFS.filter(b => {
    if (filter === "earned") return earnedIds.has(b.id);
    if (filter === "locked") return !earnedIds.has(b.id);
    return true;
  });

  const completionRate = Math.round((earned.length / BADGE_DEFS.length) * 100);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
                <p className="text-xs text-neutral-400 mt-0.5">Track your milestones and study consistency</p>
              </div>
            </div>
          </div>

          {/* Progress Pill & Bar */}
          <div className="flex flex-col gap-1.5 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-400">Completion</span>
              <span className="text-violet-400 font-semibold">{earned.length} of {BADGE_DEFS.length} ({completionRate}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 ease-out" 
                style={{ width: `${completionRate}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All Badges" },
            { id: "earned", label: `Unlocked (${earned.length})` },
            { id: "locked", label: `Locked (${BADGE_DEFS.length - earned.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === tab.id 
                  ? "bg-violet-600 text-white shadow-sm" 
                  : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Responsive Badge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map(badge => {
            const isEarned = earnedIds.has(badge.id);
            const Icon = badge.icon;
            const prog = badge.progress ? badge.progress(stats) : { current: 0, target: 1 };
            const percent = Math.min(100, Math.round((prog.current / prog.target) * 100));

            return (
              <div
                key={badge.id}
                className={`relative group rounded-2xl p-4 transition-all duration-200 border ${
                  isEarned
                    ? "bg-gradient-to-b from-white/[0.04] to-transparent border-violet-500/30 hover:border-violet-500/50"
                    : "bg-black/20 border-white/5 opacity-60 hover:opacity-80"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Custom Styled Badge Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md ${
                      isEarned
                        ? `bg-gradient-to-br ${badge.color} text-white shadow-violet-500/10`
                        : "bg-neutral-800/80 text-neutral-500 border border-white/5"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-semibold text-white truncate">{badge.label}</h3>
                      {isEarned ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-snug line-clamp-2">{badge.desc}</p>
                  </div>
                </div>

                {/* Progress Bar for Locked Badges */}
                {!isEarned && (
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 mb-1">
                      <span>Progress</span>
                      <span className="font-mono">{prog.current} / {prog.target}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                      <div 
                        className="h-full bg-neutral-600 transition-all duration-300" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
