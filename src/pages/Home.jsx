import { db } from '@/lib/firebase';
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { 
  Sparkles, BookOpen, Layers, ArrowRight, Search, Globe, 
  ChevronDown, Camera, Trophy, 
  Calculator, BookMarked, FolderOpen, FileText, 
  ClipboardList, CheckCircle2, Play, X, FlaskConical, NotebookPen, Code2, Heart, Compass, User,
  PenLine, Flag, Gamepad2, Type, CalendarDays, Brain, Users, BarChart3, Timer, FlaskRound
} from "lucide-react";
import HomeLayoutCustomizer, { getHomeLayout } from "@/components/HomeLayoutCustomizer";
import VerifiedBadge from "@/components/VerifiedBadge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PullToRefresh from "@/components/PullToRefresh";
import StreakBadges from "@/components/StreakBadges";
import Footer from "@/components/Footer";
import OurPartners from "@/components/OurPartners";
import TutorialModal from "@/components/TutorialModal";
import LiveActivityBar from "@/components/LiveActivityBar";
import { addSurveyBonusServer } from "@/components/userCredits";

const TOP_STUDIER_KEY = "cognita_top_studier_rewarded";

const MAIN_FEATURES = [
  { label: "Flashcards", desc: "Study decks with active recall and SRS mode", icon: Layers, page: "Decks", iconColor: "text-amber-500", borderHover: "hover:border-amber-500/50", bgGlow: "from-amber-500/15 via-amber-500/5 to-transparent" },
  { label: "Media Lab", desc: "Create narrated videos, audio recaps, and study guides", icon: FlaskRound, page: "Media", iconColor: "text-violet-500", borderHover: "hover:border-violet-500/50", bgGlow: "from-violet-500/15 via-violet-500/5 to-transparent" },
  { label: "Study Chat", desc: "Ask questions, talk via voice, or upload course files", icon: Brain, page: "Chat", iconColor: "text-blue-500", borderHover: "hover:border-blue-500/50", bgGlow: "from-blue-500/15 via-blue-500/5 to-transparent" },
  { label: "Scan & Import", desc: "Turn photo notes or pasted text into cards", icon: Camera, page: "Scan", iconColor: "text-rose-500", borderHover: "hover:border-rose-500/50", bgGlow: "from-rose-500/15 via-rose-500/5 to-transparent" },
  { label: "Test Prep", desc: "Practice sets for AP, SAT, state tests, and exams", icon: BookOpen, page: "ExamPrep", iconColor: "text-purple-500", borderHover: "hover:border-purple-500/50", bgGlow: "from-purple-500/15 via-purple-500/5 to-transparent" },
  { label: "Study Games", desc: "Play tower defense and term matching with classmates", icon: Gamepad2, page: "TowerDefense", iconColor: "text-emerald-500", borderHover: "hover:border-emerald-500/50", bgGlow: "from-emerald-500/15 via-emerald-500/5 to-transparent" },
];

const ROTATING_TIPS = [
  "Review sets with Spaced Repetition (SRS) to keep concepts in long-term memory.",
  "Upload photos of handwritten notes to generate review sets.",
  "Turn regular sets into audio narrations or video lessons for studying on the go.",
  "Share study decks directly to your classroom group for study sessions."
];

function MoreTools({ cardStyle, mutedStyle }) {
  const [open, setOpen] = useState(false);
  const tools = [
    { label: "Write Mode", desc: "Type answers", icon: PenLine, page: "WriteMode" },
    { label: "Practice Exams", desc: "Test simulation", icon: Flag, page: "CheckpointMode" },
    { label: "Matching Game", desc: "Match terms", icon: Gamepad2, page: "MatchingGame" },
    { label: "Word Scramble", desc: "Unscramble", icon: Type, page: "MatchingGame" },
    { label: "Study Schedule", desc: "Exam timeline", icon: CalendarDays, page: "StudyRoadmap" },
    { label: "Voice Notes", desc: "Speak and save", icon: Brain, page: "BrainDump" },
    { label: "Video Lessons", desc: "Visual review", icon: BarChart3, page: "Media" },
    { label: "Audio Lessons", desc: "Audio recaps", icon: BookOpen, page: "Media"},
    { label: "Study Groups", desc: "Group study", icon: Users, page: "StudyGroups" },
    { label: "Leaderboard", desc: "Weekly ranks", icon: Trophy, page: "Compete" },
    { label: "Progress Stats", desc: "Your metrics", icon: BarChart3, page: "Progress" },
    { label: "Calculator", desc: "Scientific calc", icon: Calculator, page: "Calculator" },
    { label: "Dictionary", desc: "Word lookup", icon: BookMarked, page: "Dictionary" },
    { label: "Practice Test", desc: "Full test", icon: ClipboardList, page: "Decks" },
    { label: "Shared Files", desc: "Resource hub", icon: FolderOpen, page: "ResourceHub" },
    { label: "Pomodoro Timer", desc: "Focus timer", icon: Timer, page: "Pomodoro" },
    { label: "Public Decks", desc: "Community sets", icon: Globe, page: "PublicDecks" },
    { label: "Resource Library", desc: "Topic guides", icon: BookOpen, page: "ResourceLibrary" },
    { label: "MLA Citation", desc: "Format sources", icon: FileText, page: "MLAFormatter" },
    { label: "Chem Balancer", desc: "Balance equations", icon: FlaskConical, page: "ChemBalance" },
    { label: "Periodic Table", desc: "Elements guide", icon: Layers, page: "PeriodicTable" },
    { label: "Notepad", desc: "Quick notes", icon: NotebookPen, page: "Notes" },
    { label: "Code Sandbox", desc: "Run code", icon: Code2, page: "CodeSandbox" },
    { label: "Classroom", desc: "Manage classes", icon: Users, page: "Classroom" },
  ];

  return (
    <div className="pt-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 rounded-2xl text-xs font-semibold transition-all duration-200 hover:opacity-90 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-[var(--app-text)] shadow-xs"
        style={{ minHeight: "52px" }}
      >
        <span className="flex items-center gap-2 text-xs font-medium">
          <Compass className="w-4 h-4 text-violet-500" />
          <span>{open ? "Hide additional tools" : "Browse all study tools"}</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={mutedStyle} />
      </button>
      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {tools.map(({ label, desc, icon: Icon, page }) => (
            <Link key={label} to={createPageUrl(page)}>
              <div className="rounded-2xl p-3.5 cursor-pointer border transition-all duration-150 bg-[var(--app-surface)] hover:border-violet-500/40 shadow-xs" style={{ borderColor: "var(--app-border)" }}>
                <div className="w-7 h-7 rounded-lg bg-[var(--app-bg)] border border-[var(--app-border)] flex items-center justify-center mb-2.5 text-violet-500 dark:text-violet-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="font-semibold text-xs text-[var(--app-text)] truncate">{label}</p>
                <p className="text-[10px] mt-0.5 truncate" style={mutedStyle}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [publicDecks, setPublicDecks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalCardsReviewed, setTotalCardsReviewed] = useState(0);
  const [ratings, setRatings] = useState({});
  const [trending, setTrending] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [allSessions, setAllSessions] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [homeLayout, setHomeLayout] = useState(getHomeLayout);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % ROTATING_TIPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [loading]);

  const rewardTopStudierIfNeeded = async (sessions, me) => {
    const today = new Date().toISOString().slice(0, 10);
    const rewardedKey = `${TOP_STUDIER_KEY}_${today}_${me.email}`;
    if (localStorage.getItem(rewardedKey)) return;
    const now = new Date();
    const hour = now.getHours();
    const myTodaySessions = sessions.filter(s => s.created_date?.slice(0, 10) === today && s.user_email === me.email);
    const myCards = myTodaySessions.reduce((sum, s) => sum + (s.cards_reviewed || 0), 0);
    if (myCards < 10) return;
    const byUser = {};
    sessions.filter(s => s.created_date?.slice(0, 10) === today && s.user_email)
      .forEach(s => { byUser[s.user_email] = (byUser[s.user_email] || 0) + (s.cards_reviewed || 0); });
    const sorted = Object.entries(byUser).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0 && sorted[0][0] === me.email) {
      if (hour >= 23) {
        await addSurveyBonusServer(3, "Daily study bonus unlocked: 3 extra credits.");
        localStorage.setItem(rewardedKey, "1");
      } else {
        const msUntil11pm = new Date(now).setHours(23, 0, 0, 0) - now.getTime();
        if (msUntil11pm > 0) {
          setTimeout(() => {
            if (!localStorage.getItem(rewardedKey)) {
              addSurveyBonusServer(3, "Daily study bonus unlocked: 3 extra credits.")
                .then(() => localStorage.setItem(rewardedKey, "1"))
                .catch(() => {});
            }
          }, msUntil11pm);
        }
      }
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const me = await db.auth.me();
      setUser(me);
      const [myDecks, allDecks, sessions, allRatings, myRatings] = await Promise.all([
        db.entities.Deck.filter({ created_by: me.email }, "-updated_date", 100),
        db.entities.Deck.filter({ is_public: true }, "-updated_date", 200),
        db.entities.StudySession.list("-created_date"),
        db.entities.DeckRating.list("-created_date", 1000),
        db.entities.DeckRating.filter({ user_email: me.email }),
      ]);
      setDecks(myDecks);
      setPublicDecks(allDecks);
      setAllSessions(sessions);
      setTotalMinutes(Math.round(sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)));
      setTotalCardsReviewed(Math.round(sessions.filter(s => s.session_type !== "browsing").reduce((sum, s) => sum + (s.cards_reviewed || 0), 0)));
      
      const rMap = {};
      allRatings.forEach(r => {
        if (!rMap[r.deck_id]) rMap[r.deck_id] = { sum: 0, count: 0 };
        rMap[r.deck_id].sum += r.rating;
        rMap[r.deck_id].count += 1;
      });
      const rAvg = {};
      Object.entries(rMap).forEach(([id, { sum, count }]) => { rAvg[id] = { avg: sum / count, count }; });
      setRatings(rAvg);

      const now = Date.now();
      const tMap = {};
      sessions.forEach(s => {
        if (!s.deck_id || !s.created_date) return;
        const ageMs = now - new Date(s.created_date).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        let weight = 0;
        if (ageDays < 1) weight = 3;
        else if (ageDays < 2) weight = 2;
        else if (ageDays < 7) weight = 1;
        if (weight > 0) tMap[s.deck_id] = (tMap[s.deck_id] || 0) + weight;
      });
      setTrending(tMap);

      const myMap = {};
      myRatings.forEach(r => { myMap[r.deck_id] = r; });
      setUserRatings(myMap);

      const allCls = await db.entities.ClassroomClass.list("-created_date", 100).catch(() => []);
      const joined = allCls.filter(c => (c.student_emails || []).includes(me.email));
      setMyClasses(joined);

      const users = await db.entities.User.list("-created_date", 500).catch(() => []);
      setAllUsers(users);

      await rewardTopStudierIfNeeded(sessions, me).catch(() => {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData().catch(() => setLoading(false)); }, [loadData]);

  useEffect(() => {
    const unsub = db.entities.StudySession.subscribe((event) => {
      if (event.type === "create" && event.data) {
        setTotalMinutes(prev => prev + (event.data.duration_minutes || 0));
        setTotalCardsReviewed(prev => prev + (event.data.cards_reviewed || 0));
      }
    });
    return unsub;
  }, []);

  const ALL_SEARCH_TARGETS = [
    ...MAIN_FEATURES,
    { label: "Write Mode", desc: "Type answers and practice terms", page: "WriteMode", icon: PenLine },
    { label: "Practice Exams", desc: "Simulated exam practice", page: "CheckpointMode", icon: Flag },
    { label: "Matching Game", desc: "Fast term matching", page: "MatchingGame", icon: Gamepad2 },
    { label: "Word Scramble", desc: "Unscramble term vocabulary", page: "MatchingGame", icon: Type },
    { label: "Study Schedule", desc: "Custom exam study plans", page: "StudyRoadmap", icon: CalendarDays },
    { label: "Voice Notes", desc: "Audio notes and transcription", page: "BrainDump", icon: Brain },
    { label: "Video Lessons", desc: "Visual review timelines", page: "Media", icon: BookOpen },
    { label: "Study Groups", desc: "Shared study groups", page: "StudyGroups", icon: Users },
    { label: "Leaderboard", desc: "Study rankings and points", page: "Compete", icon: Trophy },
    { label: "Progress Stats", desc: "Study stats and charts", page: "Progress", icon: BarChart3 },
    { label: "Calculator", desc: "Scientific calculator", page: "Calculator", icon: Calculator },
    { label: "Dictionary", desc: "Definitions and lookup", page: "Dictionary", icon: BookMarked },
    { label: "Practice Tests", desc: "Custom evaluation tests", page: "Decks", icon: ClipboardList },
    { label: "Shared Files", desc: "Notes and file uploads", page: "ResourceHub", icon: FolderOpen },
    { label: "Resource Library", desc: "Premade study materials", page: "ResourceLibrary", icon: BookOpen },
    { label: "Pomodoro Timer", desc: "Focus timer", page: "Pomodoro", icon: Timer },
    { label: "Public Decks", desc: "Community flashcard sets", page: "PublicDecks", icon: Globe },
    { label: "MLA Formatter", desc: "Citation generator", page: "MLAFormatter", icon: FileText },
    { label: "Chem Balancer", desc: "Balance chemical equations", page: "ChemBalance", icon: FlaskConical },
    { label: "Periodic Table", desc: "Interactive element reference", page: "PeriodicTable", icon: Layers },
    { label: "Notepad", desc: "Notes and outline workspace", page: "Notes", icon: NotebookPen },
    { label: "Code Sandbox", desc: "Code editor and workspace", page: "CodeSandbox", icon: Code2 },
    { label: "Settings", desc: "Preferences and settings", page: "Settings", icon: Sparkles },
  ];

  const searchQuery = search.trim().toLowerCase();
  
  const matchedFeatures = searchQuery 
    ? ALL_SEARCH_TARGETS.filter(f => 
        f.label.toLowerCase().includes(searchQuery) || 
        f.desc.toLowerCase().includes(searchQuery)
      ).slice(0, 5) 
    : [];

  const matchedMyDecks = searchQuery 
    ? decks.filter(d => [d.title, d.subject, d.description].some(f => f?.toLowerCase().includes(searchQuery))).slice(0, 4) 
    : [];

  const matchedCommunityDecks = searchQuery 
    ? publicDecks.filter(d => 
        !decks.some(myD => myD.id === d.id) && 
        [d.title, d.subject, d.description].some(f => f?.toLowerCase().includes(searchQuery))
      ).slice(0, 4)
    : [];

  const matchedUsers = searchQuery
    ? allUsers.filter(u => 
        u.full_name?.toLowerCase().includes(searchQuery) || 
        u.email?.toLowerCase().includes(searchQuery)
      ).slice(0, 4)
    : [];

  const showDropdown = searchQuery.length > 0 && (
    matchedFeatures.length > 0 || 
    matchedMyDecks.length > 0 || 
    matchedCommunityDecks.length > 0 || 
    matchedUsers.length > 0
  );

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };
  const searchRef = useRef(null);

  const scoreDeck = (d) => {
    const r = ratings[d.id];
    const ratingScore = r ? (r.avg * Math.min(r.count, 20)) / 20 : 0;
    const activityBonus = Math.min((trending[d.id] || 0) * 0.5, 3);
    return ratingScore + activityBonus;
  };

  const trendingDecks = [...publicDecks]
    .filter(d => ratings[d.id]?.count > 0 || (trending[d.id] || 0) > 0)
    .sort((a, b) => scoreDeck(b) - scoreDeck(a))
    .slice(0, 4);

  const getFallbackStyle = (id) => {
    const colors = [
      "from-violet-600 to-indigo-700",
      "from-blue-600 to-cyan-700",
      "from-emerald-600 to-teal-700",
      "from-rose-600 to-pink-700",
      "from-amber-600 to-orange-700",
      "from-purple-600 to-fuchsia-700"
    ];
    const index = id ? id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;
    return colors[index];
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans antialiased transition-colors duration-200" 
        style={bgStyle}
      >
        <style>{`
          @keyframes funStomp {
            0% { transform: translateY(-120%) scale(0.8) rotate(-6deg); opacity: 0; }
            50% { transform: translateY(8px) scale(1.05) rotate(2deg); opacity: 1; }
            70% { transform: translateY(-4px) scale(0.98) rotate(-1deg); }
            85% { transform: translateY(2px) scale(1.01) rotate(0.5deg); }
            100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
          }
          .animate-fun-stomp {
            animation: funStomp 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>
        <div className="w-full max-w-[360px] space-y-6 px-4 z-10">
          <div 
            className="rounded-2xl border bg-[var(--app-surface)] p-6 shadow-xs flex flex-col items-center text-center space-y-5 animate-fun-stomp" 
            style={{ borderColor: "var(--app-border)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--app-bg)] border p-2 flex items-center justify-center shadow-xs" style={{ borderColor: "var(--app-border)" }}>
              <img 
                src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                alt="Cognita" 
                className="w-full h-full object-contain" 
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-[var(--app-text)]">
                Loading Cognita
              </h2>
              <p className="text-xs" style={mutedStyle}>
                Getting your sets ready...
              </p>
            </div>

            <div className="w-full space-y-1.5">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                <div className="absolute inset-y-0 bg-violet-500 rounded-full w-1/3 animate-[shimmer_1.5s_infinite_linear] [animation:progress_1.8s_ease-in-out_infinite]" 
                  style={{
                    animation: "loading-bar 1.6s ease-in-out infinite"
                  }}
                />
                <style>{`
                  @keyframes loading-bar {
                    0% { left: -35%; width: 30%; }
                    50% { left: 35%; width: 40%; }
                    100% { left: 100%; width: 30%; }
                  }
                `}</style>
              </div>
              <div className="flex justify-between items-center text-[10px] font-medium" style={mutedStyle}>
                <span>Syncing workspace</span>
                <span className="animate-pulse">Loading...</span>
              </div>
            </div>

            <div 
              className="w-full pt-4 border-t text-left space-y-1" 
              style={{ borderColor: "var(--app-border)" }}
            >
              <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-wider block">
                Study Tip
              </span>
              <p className="text-xs leading-relaxed transition-opacity duration-300 text-[var(--app-text)] min-h-[36px]">
                {ROTATING_TIPS[tipIndex]}
              </p>
            </div>
          </div>

          <div className="text-center text-[11px] opacity-60 font-medium" style={mutedStyle}>
            Cognita Platform • Marina High School
          </div>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={loadData}>
      <div className="min-h-screen pb-16 px-4 pt-6 sm:px-8 sm:pt-8 transition-colors duration-200 flex flex-col justify-between" style={bgStyle}>
        <div className="max-w-6xl w-full mx-auto flex-1 space-y-8">
          
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--app-text)]">
                    Welcome back{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
                  </h1>
                  <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-md px-2 py-0.5 tracking-wide shrink-0">Verified</span>
                </div>
                <p className="text-xs mt-1" style={mutedStyle}>Your main dashboard and study overview.</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <HomeLayoutCustomizer layout={homeLayout} onChange={setHomeLayout} />
              </div>
            </div>

            <div className="relative z-50 max-w-2xl" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tools, decks, subjects, or classmates..."
                  className="w-full pl-11 pr-10 rounded-2xl text-xs outline-none transition-all duration-150 focus:border-violet-500 font-medium shadow-xs"
                  style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)", height: "46px" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-50 hover:opacity-100 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-lg z-50 overflow-y-auto max-h-[420px] backdrop-blur-md border"
                  style={{ background: "var(--app-surface-solid, var(--app-surface))", borderColor: "var(--app-border)" }}>
                  
                  {matchedFeatures.length > 0 && (
                    <div className="border-b pb-1" style={{ borderColor: "var(--app-border)" }}>
                      <p className="text-[9px] font-bold px-4 pt-2.5 pb-1 opacity-50 tracking-wider uppercase" style={mutedStyle}>Tools & Features</p>
                      {matchedFeatures.map(f => {
                        const IconComponent = f.icon;
                        return (
                          <Link key={f.page + f.label} to={createPageUrl(f.page)} onClick={() => setSearch("")}>
                            <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-xs">
                              <IconComponent className="w-4 h-4 text-violet-500" />
                              <span className="font-medium text-[var(--app-text)]">{f.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {matchedMyDecks.length > 0 && (
                    <div className="border-b pb-1" style={{ borderColor: "var(--app-border)" }}>
                      <p className="text-[9px] font-bold px-4 pt-2.5 pb-1 opacity-50 tracking-wider uppercase" style={mutedStyle}>Your Decks</p>
                      {matchedMyDecks.map(deck => (
                        <Link key={deck.id} to={createPageUrl(`Study?deck_id=${deck.id}`)} onClick={() => setSearch("")}>
                          <div className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 text-xs truncate font-medium flex items-center gap-2.5 text-[var(--app-text)]">
                            {deck.cover_image_url ? (
                              <img src={deck.cover_image_url} alt="" className="w-5 h-5 rounded object-cover bg-[var(--app-bg)] border" style={{ borderColor: "var(--app-border)" }} />
                            ) : (
                              <div className={`w-5 h-5 rounded bg-gradient-to-br ${getFallbackStyle(deck.id)}`} />
                            )}
                            <span className="truncate">{deck.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {matchedCommunityDecks.length > 0 && (
                    <div className="border-b pb-1" style={{ borderColor: "var(--app-border)" }}>
                      <p className="text-[9px] font-bold px-4 pt-2.5 pb-1 opacity-50 tracking-wider uppercase" style={mutedStyle}>Community Decks</p>
                      {matchedCommunityDecks.map(deck => (
                        <Link key={deck.id} to={createPageUrl(`Study?deck_id=${deck.id}`)} onClick={() => setSearch("")}>
                          <div className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 text-xs truncate font-medium flex items-center gap-2.5 text-[var(--app-text)]">
                            {deck.cover_image_url ? (
                              <img src={deck.cover_image_url} alt="" className="w-5 h-5 rounded object-cover bg-[var(--app-bg)] border" style={{ borderColor: "var(--app-border)" }} />
                            ) : (
                              <div className={`w-5 h-5 rounded bg-gradient-to-br ${getFallbackStyle(deck.id)}`} />
                            )}
                            <span className="truncate">{deck.title}</span>
                            {deck.is_verified && <VerifiedBadge size={10} />}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {matchedUsers.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold px-4 pt-2.5 pb-1 opacity-50 tracking-wider uppercase" style={mutedStyle}>Classmates</p>
                      {matchedUsers.map(u => (
                        <Link key={u.email} to={createPageUrl(`FriendsAndUsers`)} onClick={() => setSearch("")} className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 text-xs flex items-center gap-2.5 text-[var(--app-text)] block transition-colors">
                          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] text-violet-500 font-bold uppercase">
                            {u.full_name ? u.full_name[0] : <User className="w-2.5 h-2.5" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate leading-tight">{u.full_name || "Student"}</p>
                            <p className="text-[9px] opacity-50 truncate leading-none mt-0.5" style={mutedStyle}>{u.email}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <TutorialModal />

          <div className="space-y-3">
            <h2 className="font-semibold text-xs tracking-wider uppercase opacity-60 px-1" style={mutedStyle}>
              Main Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MAIN_FEATURES.map((feat, i) => {
                const IconComponent = feat.icon;
                return (
                  <Link key={i} to={createPageUrl(feat.page)} className="block group">
                    <div 
                      className={`rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between min-h-[140px] bg-[var(--app-surface)] hover:border-violet-500/30 hover:shadow-sm ${feat.borderHover}`} 
                      style={{ borderColor: "var(--app-border)" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-base sm:text-lg tracking-tight text-[var(--app-text)] group-hover:text-violet-500 transition-colors">
                          {feat.label}
                        </h3>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                          <IconComponent className={`w-4 h-4 ${feat.iconColor}`} />
                        </div>
                      </div>

                      <div className="mt-3 flex items-end justify-between gap-2">
                        <p className="text-xs leading-relaxed opacity-70 line-clamp-2" style={mutedStyle}>
                          {feat.desc}
                        </p>
                        <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-violet-500 shrink-0">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-2">
            
            <div className="lg:col-span-2 space-y-8">
              {homeLayout.showTools && <MoreTools cardStyle={cardStyle} mutedStyle={mutedStyle} />}

              {homeLayout.showRecentDecks && decks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="font-semibold text-xs tracking-wider uppercase opacity-60" style={mutedStyle}>Recent Decks</h2>
                    <Link to={createPageUrl("Decks")} className="text-violet-500 text-xs font-semibold hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {decks.slice(0, 4).map(deck => (
                      <Link key={deck.id} to={createPageUrl(`Study?deck_id=${deck.id}`)} className="block">
                        <div className="rounded-2xl p-4 border transition-all duration-150 flex items-center justify-between group bg-[var(--app-surface)] hover:border-violet-500/30 shadow-xs" style={cardStyle}>
                          <div className="flex items-center gap-3.5 min-w-0 pr-2">
                            {deck.cover_image_url ? (
                              <img src={deck.cover_image_url} alt="" className="w-10 h-10 rounded-xl object-cover bg-[var(--app-bg)] border shrink-0" style={{ borderColor: "var(--app-border)" }} />
                            ) : (
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getFallbackStyle(deck.id)} shrink-0 flex items-center justify-center text-white/70 font-semibold text-xs`}>
                                SET
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-xs text-[var(--app-text)] truncate group-hover:text-violet-500 transition-colors">{deck.title}</span>
                                {deck.is_verified && <VerifiedBadge size={12} />}
                              </div>
                              <p className="text-[10px] opacity-60 mt-0.5" style={mutedStyle}>{deck.card_count || 0} cards</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400 group-hover:text-violet-500 shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {homeLayout.showCommunityDecks && trendingDecks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="font-semibold text-xs tracking-wider uppercase opacity-60" style={mutedStyle}>Popular Study Sets</h2>
                    <Link to={createPageUrl("PublicDecks")} className="text-violet-500 text-xs font-semibold hover:underline">
                      Browse all
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trendingDecks.map(deck => (
                      <Link key={deck.id} to={createPageUrl(`Study?deck_id=${deck.id}`)}>
                        <div className="rounded-2xl p-4 border transition-all h-full flex flex-col justify-between bg-[var(--app-surface)] hover:border-violet-500/30 shadow-xs" style={cardStyle}>
                          <div className="flex items-start gap-3">
                            {deck.cover_image_url ? (
                              <img src={deck.cover_image_url} alt="" className="w-10 h-10 rounded-xl object-cover bg-[var(--app-bg)] border shrink-0" style={{ borderColor: "var(--app-border)" }} />
                            ) : (
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getFallbackStyle(deck.id)} shrink-0 flex items-center justify-center text-white/70 font-semibold text-xs`}>
                                TRND
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="font-semibold text-xs text-[var(--app-text)] truncate block">{deck.title}</span>
                                {deck.is_verified && <VerifiedBadge size={11} />}
                              </div>
                              <p className="text-[10px] opacity-60" style={mutedStyle}>{deck.card_count || 0} terms</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-3">Popular across classes</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              
              {user && (
                <div className="border rounded-2xl p-4 bg-[var(--app-surface)] shadow-xs" style={cardStyle}>
                  <div className="mb-2 px-1">
                  </div>
                  <StreakBadges sessions={allSessions} userEmail={user.email} />
                </div>
              )}

              {homeLayout.showLiveCounters && (
                <div className="border rounded-2xl p-5 space-y-4 bg-[var(--app-surface)] shadow-xs" style={cardStyle}>
                  <h4 className="text-[10px] font-semibold tracking-wider uppercase opacity-60" style={mutedStyle}>Overall Activity</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xl font-bold text-[var(--app-text)]">{totalMinutes.toLocaleString()}</p>
                      <p className="text-[9px] font-semibold opacity-60 tracking-tight mt-0.5 uppercase" style={mutedStyle}>Minutes studied</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[var(--app-text)]">{totalCardsReviewed.toLocaleString()}</p>
                      <p className="text-[9px] font-semibold opacity-60 tracking-tight mt-0.5 uppercase" style={mutedStyle}>Cards reviewed</p>
                    </div>
                  </div>
                </div>
              )}

              <LiveActivityBar />

              {homeLayout.showMyClasses && myClasses.length > 0 && (
                <div className="border rounded-2xl p-4 space-y-3 bg-[var(--app-surface)] shadow-xs" style={cardStyle}>
                  <h4 className="text-[10px] font-semibold tracking-wider uppercase opacity-60" style={mutedStyle}>Your Classes</h4>
                  <div className="space-y-1.5">
                    {myClasses.slice(0, 3).map(cls => (
                      <Link 
                        key={cls.id} 
                        to={createPageUrl("Classroom")} 
                        className="block group"
                      >
                        <div 
                          className="text-xs font-medium p-2.5 rounded-xl bg-[var(--app-bg)] border flex items-center justify-between text-[var(--app-text)] hover:border-violet-500/40 transition-all cursor-pointer" 
                          style={{ borderColor: "var(--app-border)" }}
                        >
                          <span className="truncate pr-2 group-hover:text-violet-500 transition-colors">
                            {cls.name}
                          </span>
                          <Play className="w-3 h-3 opacity-50 shrink-0 text-violet-500 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl p-5 border relative overflow-hidden bg-[var(--app-surface)] border-violet-500/20 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-violet-600 dark:text-violet-400">
                  <Heart className="w-4 h-4" />
                  <h4 className="font-semibold text-xs">Support Cognita</h4>
                </div>
                <p className="text-[11px] leading-relaxed opacity-70 mb-4" style={mutedStyle}>
                  Help keep this study hub free for students.
                </p>
                <a 
                  href="https://paypal.me/ycmusicmodels" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full inline-flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold h-9 rounded-xl transition-all shadow-xs"
                >
                  Support project
                </a>
              </div>

            </div>

          </div>

        </div>

        <div className="pt-8 w-full max-w-6xl mx-auto">
          <Footer userEmail={user?.email} />
          
          <div className="pt-8 w-full max-w-6xl mx-auto">
            <OurPartners />
          </div>

          <div className="flex items-center gap-4 text-xs font-medium" style={mutedStyle}>
            <Link to="/Documentation" className="hover:text-violet-500 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/Referral" className="hover:text-violet-500 transition-colors">
              Referrals
            </Link>
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
}
