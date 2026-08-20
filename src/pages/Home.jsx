import { db } from '@/lib/firebase';
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { 
  Sparkles, BookOpen, Layers, ArrowRight, Search, Globe, 
  ChevronDown, Camera, Trophy, 
  Calculator, BookMarked, FolderOpen, FileText, 
  ClipboardList, CheckCircle2, Play, X, FlaskConical, NotebookPen, Code2, Heart, Compass, User,
  PenLine, Flag, Gamepad2, Type, CalendarDays, Brain, Users, BarChart3, Timer
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
  { label: "Flashcards", desc: "Review master decks and active recall sets", icon: Layers, page: "Decks", iconColor: "text-amber-500", borderHover: "hover:border-amber-500/50", bgGlow: "from-amber-500/15 via-amber-500/5 to-transparent" },
  { label: "AI Studio", desc: "Generate AI videos, narration audio & custom tutors", icon: Sparkles, page: "Media", iconColor: "text-violet-500", borderHover: "hover:border-violet-500/50", bgGlow: "from-violet-500/15 via-violet-500/5 to-transparent" },
  { label: "AI Chat", desc: "Interactive smart tutor with voice & document upload", icon: Brain, page: "Chat", iconColor: "text-blue-500", borderHover: "hover:border-blue-500/50", bgGlow: "from-blue-500/15 via-blue-500/5 to-transparent" },
  { label: "Scan & Import", desc: "Snap photos or paste text to instantly auto-generate cards", icon: Camera, page: "Scan", iconColor: "text-rose-500", borderHover: "hover:border-rose-500/50", bgGlow: "from-rose-500/15 via-rose-500/5 to-transparent" },
  { label: "Full Exam Prep", desc: "Targeted practice for AP, SAT, State & iReady exams", icon: BookOpen, page: "ExamPrep", iconColor: "text-purple-500", borderHover: "hover:border-purple-500/50", bgGlow: "from-purple-500/15 via-purple-500/5 to-transparent" },
  { label: "Study Games", desc: "Interactive multiplayer games & tower defense recall", icon: Gamepad2, page: "TowerDefense", iconColor: "text-emerald-500", borderHover: "hover:border-emerald-500/50", bgGlow: "from-emerald-500/15 via-emerald-500/5 to-transparent" },
];

const ROTATING_TIPS = [
  "Maximize your learning retention by reviewing sets using Spaced Repetition (SRS).",
  "Take a picture of written notes or insert public urls to instantly generate flashcards.",
  "Turn any regular dataset or flashcard deck into fully narrated AI audio and video lessons.",
  "Sync your interactive flashcards to your Classroom module to launch live multiplayer study games."
];

function MoreTools({ cardStyle, mutedStyle }) {
  const [open, setOpen] = useState(false);
  const tools = [
    { label: "Write Mode", desc: "Type answers", icon: PenLine, page: "WriteMode" },
    { label: "Checkpoint", desc: "Exam simulation", icon: Flag, page: "CheckpointMode" },
    { label: "Matching Game", desc: "Match terms", icon: Gamepad2, page: "MatchingGame" },
    { label: "Word Scramble", desc: "Unscramble", icon: Type, page: "MatchingGame" },
    { label: "Study Roadmap", desc: "AI exam plan", icon: CalendarDays, page: "StudyRoadmap" },
    { label: "Voice Brain Dump", desc: "Speak & capture", icon: Brain, page: "BrainDump" },
    { label: "Video Lessons", desc: "Visual learning", icon: BarChart3, page: "Media" },
    { label: "Audio Lessons", desc: "Audio Narration", icon: BookOpen, page: "Media"},
    { label: "Study Groups", desc: "Collaborate", icon: Users, page: "StudyGroups" },
    { label: "Compete", desc: "Leaderboard", icon: Trophy, page: "Compete" },
    { label: "Progress Stats", desc: "Your metrics", icon: BarChart3, page: "Progress" },
    { label: "Calculator", desc: "Scientific calc", icon: Calculator, page: "Calculator" },
    { label: "Dictionary", desc: "Word definitions", icon: BookMarked, page: "Dictionary" },
    { label: "Practice Test", desc: "Full AI test", icon: ClipboardList, page: "Decks" },
    { label: "Resource Hub", desc: "Share study files", icon: FolderOpen, page: "ResourceHub" },
    { label: "Pomodoro", desc: "Focus timer", icon: Timer, page: "Pomodoro" },
    { label: "Public Decks", desc: "Browse community", icon: Globe, page: "PublicDecks" },
    { label: "Resource Library", desc: "AI topic cards", icon: BookOpen, page: "ResourceLibrary" },
    { label: "MLA Formatter", desc: "MLA citations", icon: FileText, page: "MLAFormatter" },
    { label: "Chem Balancer", desc: "Balance equations", icon: FlaskConical, page: "ChemBalance" },
    { label: "Periodic Table", desc: "Element reference", icon: Layers, page: "PeriodicTable" },
    { label: "Notes Grid", desc: "Organize workflows", icon: NotebookPen, page: "Notes" },
    { label: "Code Sandbox", desc: "Run environments", icon: Code2, page: "CodeSandbox" },
    { label: "Classroom", desc: "Setup Classes", icon: Users, page: "Classroom" },
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
          <span>{open ? "Hide specialized tools" : "View all study tools and utilities"}</span>
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
        await addSurveyBonusServer(3, "Top studier bonus rewarded — +3 AI credits applied.");
        localStorage.setItem(rewardedKey, "1");
      } else {
        const msUntil11pm = new Date(now).setHours(23, 0, 0, 0) - now.getTime();
        if (msUntil11pm > 0) {
          setTimeout(() => {
            if (!localStorage.getItem(rewardedKey)) {
              addSurveyBonusServer(3, "Top studier bonus rewarded — +3 AI credits applied.")
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
    { label: "Write Mode", desc: "Type answers & text matching training", page: "WriteMode", icon: PenLine },
    { label: "Checkpoint Exams", desc: "Interactive exam simulation testing", page: "CheckpointMode", icon: Flag },
    { label: "Vocabulary Matching", desc: "Match terms card speed run game", page: "MatchingGame", icon: Gamepad2 },
    { label: "Word Scramble", desc: "Unscramble dataset vocabulary strings", page: "MatchingGame", icon: Type },
    { label: "AI Exam Planners", desc: "Custom study schedules & timelines", page: "StudyRoadmap", icon: CalendarDays },
    { label: "Voice Brain Dump", desc: "Speak & capture automated transcripts", page: "BrainDump", icon: Brain },
    { label: "Video Lessons", desc: "Visual interactive learning timelines", page: "Media", icon: BookOpen },
    { label: "Study Communities", desc: "Collaborative flashcard channels", page: "StudyGroups", icon: Users },
    { label: "Live Scoreboards", desc: "Compete with leaderboard trackers", page: "Compete", icon: Trophy },
    { label: "Analytics Insights", desc: "Your progress metrics & data charts", page: "Progress", icon: BarChart3 },
    { label: "Scientific Calculator", desc: "Formula calculator solver layout", page: "Calculator", icon: Calculator },
    { label: "Terminology Reference", desc: "Dictionary definitions matching panel", page: "Dictionary", icon: BookMarked },
    { label: "Practice Tests", desc: "Full AI customized evaluation exams", page: "Decks", icon: ClipboardList },
    { label: "Resource Shared Library", desc: "AI topics, notes & file sharing hubs", page: "ResourceHub", icon: FolderOpen },
    { label: "Resource Library Index", desc: "AI pre-made topic study materials", page: "ResourceLibrary", icon: BookOpen },
    { label: "Focus Pomodoro Timer", desc: "Customized intervals study timers", page: "Pomodoro", icon: Timer },
    { label: "Public Repositories", desc: "Browse community shared card datasets", page: "PublicDecks", icon: Globe },
    { label: "MLA Format Builder", desc: "Research citation helper layouts", page: "MLAFormatter", icon: FileText },
    { label: "Chemistry Engine", desc: "Balance element reactions instantly", page: "ChemBalance", icon: FlaskConical },
    { label: "Periodic Matrix Grid", desc: "Element interactive guide data sheet", page: "PeriodicTable", icon: Layers },
    { label: "Workflows Layout Notes", desc: "Organize folders & custom notepad rich text", page: "Notes", icon: NotebookPen },
    { label: "Code Compiler Terminal", desc: "Run languages inside sandboxed workspace environments", page: "CodeSandbox", icon: Code2 },
    { label: "User Parameters Settings", desc: "Theme styling configuration profiles", page: "Settings", icon: Sparkles },
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
        <div className="w-full max-w-[380px] space-y-6 px-4 z-10">
          <div 
            className="rounded-3xl border bg-[var(--app-surface)] p-6 sm:p-8 shadow-sm flex flex-col items-center text-center space-y-6" 
            style={{ borderColor: "var(--app-border)" }}
          >
            <div className="relative w-16 h-16 flex items-center justify-center my-1">
              <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
              <div 
                className="relative z-10 w-10 h-10 rounded-xl bg-[var(--app-surface)] border p-2 flex items-center justify-center"
                style={{ borderColor: "var(--app-border)" }}
              >
                <img 
                  src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                  alt="Cognita" 
                  className="w-full h-full object-contain" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-[var(--app-text)]">
                Preparing Your Workspace
              </h2>
              <p className="text-xs" style={mutedStyle}>
                Retrieving your study tools
              </p>
            </div>

            <div className="w-full px-4">
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full animate-pulse w-3/4 transition-all duration-500" />
              </div>
            </div>

            <div 
              className="w-full pt-4 border-t text-left space-y-1" 
              style={{ borderColor: "var(--app-border)" }}
            >
              <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-wider block">
                Study Insight
              </span>
              <p className="text-xs leading-relaxed transition-opacity duration-300 text-[var(--app-text)] min-h-[36px]">
                {ROTATING_TIPS[tipIndex]}
              </p>
            </div>
          </div>

          <div className="text-center text-[11px] opacity-60" style={mutedStyle}>
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
                <p className="text-xs mt-1" style={mutedStyle}>Your primary study dashboard & learning hub.</p>
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
                  placeholder="Search features, tools, flashcard decks, or classmates..."
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
                      <p className="text-[9px] font-bold px-4 pt-2.5 pb-1 opacity-50 tracking-wider uppercase" style={mutedStyle}>Users</p>
                      {matchedUsers.map(u => (
                        <Link key={u.email} to={createPageUrl(`FriendsAndUsers`)} onClick={() => setSearch("")} className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 text-xs flex items-center gap-2.5 text-[var(--app-text)] block transition-colors">
                          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] text-violet-500 font-bold uppercase">
                            {u.full_name ? u.full_name[0] : <User className="w-2.5 h-2.5" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate leading-tight">{u.full_name || "Anonymous Learner"}</p>
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
          <LiveActivityBar />

          <div className="space-y-3">
            <h2 className="font-semibold text-xs tracking-wider uppercase opacity-60 px-1" style={mutedStyle}>
              Main Study Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MAIN_FEATURES.map((feat, i) => {
                const IconComponent = feat.icon;
                return (
                  <Link key={i} to={createPageUrl(feat.page)} className="block group">
                    <div 
                      className={`rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between min-h-[150px] bg-[var(--app-surface)] hover:border-violet-500/30 hover:shadow-sm ${feat.borderHover}`} 
                      style={{ borderColor: "var(--app-border)" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-transform group-hover:scale-105">
                          <IconComponent className={`w-5 h-5 ${feat.iconColor}`} />
                        </div>
                        <div className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-violet-500">
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      <div className="mt-4 space-y-1">
                        <h3 className="font-bold text-sm text-[var(--app-text)] group-hover:text-violet-500 transition-colors">
                          {feat.label}
                        </h3>
                        <p className="text-xs leading-relaxed opacity-70 line-clamp-2" style={mutedStyle}>
                          {feat.desc}
                        </p>
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
                    <h2 className="font-semibold text-xs tracking-wider uppercase opacity-60" style={mutedStyle}>Recent Flashcards</h2>
                    <Link to={createPageUrl("Decks")} className="text-violet-500 text-xs font-semibold hover:underline">
                      View all sets
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
                              <p className="text-[10px] opacity-60 mt-0.5" style={mutedStyle}>{deck.card_count || 0} cards · Personal deck</p>
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
                    <h2 className="font-semibold text-xs tracking-wider uppercase opacity-60" style={mutedStyle}>Trending Study Sets</h2>
                    <Link to={createPageUrl("PublicDecks")} className="text-violet-500 text-xs font-semibold hover:underline">
                      Explore public sets
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
                  <h4 className="text-[10px] font-semibold tracking-wider uppercase opacity-60" style={mutedStyle}>Study Overview By All Users</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xl font-bold text-[var(--app-text)]">{totalMinutes.toLocaleString()}</p>
                      <p className="text-[9px] font-semibold opacity-60 tracking-tight mt-0.5 uppercase" style={mutedStyle}>Minutes spent</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[var(--app-text)]">{totalCardsReviewed.toLocaleString()}</p>
                      <p className="text-[9px] font-semibold opacity-60 tracking-tight mt-0.5 uppercase" style={mutedStyle}>Cards studied</p>
                    </div>
                  </div>
                </div>
              )}

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
                  <h4 className="font-semibold text-xs">Support Open Learning</h4>
                </div>
                <p className="text-[11px] leading-relaxed opacity-70 mb-4" style={mutedStyle}>
                  Help keep this study environment accessible for high school and college students.
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

              <div className="rounded-2xl p-4 border bg-emerald-500/5 border-emerald-500/10 flex gap-3 items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">Student Operated</p>
                  <p className="text-[11px] leading-relaxed opacity-70" style={mutedStyle}>
                    Cognita Study is operated entirely by students for students. Reach out via our partnership page for integrations.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Centered Our Partners Section at the Bottom */}
        <div className="w-full flex justify-center text-center my-8 opacity-80">
          <OurPartners />
        </div>

        <div className="border-t pt-8 w-full max-w-6xl mx-auto" style={{ borderColor: "var(--app-border)" }}>
          <Footer userEmail={user?.email} />
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
