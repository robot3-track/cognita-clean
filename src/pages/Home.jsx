import { db } from '@/lib/firebase';
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { 
  Sparkles, BookOpen, BarChart3, Layers, ArrowRight, Search, Globe, 
  Loader2, Clock, Star, Users, Gamepad2, Type, Brain, Timer, 
  CalendarDays, PenLine, Flag, ChevronDown, Camera, Trophy, 
  GraduationCap, Calculator, BookMarked, FolderOpen, FileText, 
  ClipboardList, CheckCircle2, Play, X, FlaskConical, NotebookPen, Code2, Heart, Compass, User
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

const ALL_FEATURES = [
  { label: "Flashcards", desc: "Review master modules", icon: Layers, page: "Decks", iconColor: "text-amber-500", bgGlow: "from-amber-500/10 to-transparent" },
  { label: "AI Studio", desc: "AI Video, audio, and tutoring", icon: Sparkles, page: "Media", iconColor: "text-violet-500", bgGlow: "from-violet-500/10 to-transparent" },
  { label: "AI Chat", desc: "Voice, files, and cards", icon: Brain, page: "Chat", iconColor: "text-blue-500", bgGlow: "from-blue-500/10 to-transparent" },
  { label: "Scan & Import", desc: "Photo text extractors", icon: Camera, page: "Scan", iconColor: "text-rose-500", bgGlow: "from-rose-500/10 to-transparent" },
  { label: "Full Exam Prep", desc: "AP, State, iReady Exam Prep", icon: BookOpen, page: "ExamPrep", iconColor: "text-purple-500", bgGlow: "from-purple-500/10 to-transparent" },
  { label: "Study Games", desc: "Multiplayer active recall", icon: Gamepad2, page: "TowerDefense", iconColor: "text-emerald-500", bgGlow: "from-emerald-500/10 to-transparent" },
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
    <div className="mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 rounded-xl text-xs font-bold transition-all duration-200 hover:opacity-90 bg-gradient-to-r from-violet-600/10 to-indigo-600/5 border border-violet-500/20 text-[var(--app-text)]"
        style={{ minHeight: "48px" }}
      >
        <span className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-violet-400" />
          <span>{open ? "Hide optional tools" : "View all study tools"}</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={mutedStyle} />
      </button>
      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {tools.map(({ label, desc, icon: Icon, page }) => (
            <Link key={label} to={createPageUrl(page)}>
              <div className="rounded-xl p-4 cursor-pointer border transition-all duration-150 bg-[var(--app-surface)] hover:opacity-90 hover:border-violet-500/40" style={{ borderColor: "var(--app-border)" }}>
                <div className="w-8 h-8 rounded-lg bg-[var(--app-bg)] border border-[var(--app-border)] flex items-center justify-center mb-3 text-violet-400">
                  <Icon className="w-4 h-4" />
                </div>
                <p className="font-bold text-xs text-[var(--app-text)]">{label}</p>
                <p className="text-[11px] mt-0.5" style={mutedStyle}>{desc}</p>
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
    ...ALL_FEATURES,
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
    { label: "Referrals Tracking", desc: "Invite links tracking dashboard stats", page: "Referral", icon: Heart },
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans antialiased transition-colors duration-200" style={bgStyle}>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-[390px] space-y-6 px-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                alt="Cognita" 
                className="w-10 h-10 object-contain rounded-xl border p-1 bg-[var(--app-surface)] shadow-md" 
                style={{ borderColor: "var(--app-border)" }}
              />
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-[var(--app-text)]">Cognita</span>
                <span className="text-[9px] font-bold text-violet-500 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded px-1.5 py-0.5 tracking-wide">Free</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black tracking-tight text-[var(--app-text)]">Loading your workspace</h2>
              <p className="text-xs font-medium" style={mutedStyle}>Setting up dashboard assets and user profiles...</p>
            </div>
          </div>

          <div className="rounded-2xl border bg-[var(--app-surface)] backdrop-blur-xl p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-5" style={{ borderColor: "var(--app-border)" }}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-violet-500 animate-spin absolute" />
              <div className="w-2 h-2 rounded-full bg-violet-400" />
            </div>

            <div className="w-full pt-4 border-t text-left" style={{ borderColor: "var(--app-border)" }}>
              <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-wider block mb-1">Study Tip</span>
              <p className="text-xs leading-relaxed font-medium transition-opacity duration-300 text-[var(--app-text)]">
                {ROTATING_TIPS[tipIndex]}
              </p>
            </div>
          </div>

          <div className="text-center text-[11px] font-medium tracking-wide" style={mutedStyle}>
            Made by Yohan Chang • Marina High School • 2026
          </div>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={loadData}>
      <div className="min-h-screen pb-16 px-4 pt-6 sm:px-8 sm:pt-10 transition-colors duration-200 flex flex-col justify-between" style={bgStyle}>
        <div className="max-w-6xl w-full mx-auto flex-1">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b" style={{ borderColor: "var(--app-border)" }}>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--app-text)]">
                  Welcome back{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
                </h1>
                <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-md px-1.5 py-0.5 tracking-wider">Free account</span>
              </div>
              <p className="text-xs mt-1 font-medium" style={mutedStyle}>Access your flashcards, notes, and study tools all in one workspace.</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <HomeLayoutCustomizer layout={homeLayout} onChange={setHomeLayout} />
            </div>
          </div>

          <TutorialModal />

          <div className="mb-8 relative z-50 max-w-xl" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tools, flashcard sets, or active users..."
                className="w-full pl-11 pr-10 rounded-xl text-xs outline-none transition-all duration-150 focus:border-violet-500 font-medium shadow-sm"
                style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)", height: "42px" }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-50 hover:opacity-100 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl shadow-xl z-50 overflow-y-auto max-h-[420px] backdrop-blur-md"
                style={{ background: "var(--app-surface-solid, var(--app-surface))", border: "1px solid var(--app-border)" }}>
                
                {matchedFeatures.length > 0 && (
                  <div className="border-b pb-1" style={{ borderColor: "var(--app-border)" }}>
                    <p className="text-[9px] font-bold px-4 pt-2.5 pb-1 opacity-50 tracking-wider" style={mutedStyle}>Tools & Frameworks</p>
                    {matchedFeatures.map(f => {
                      const IconComponent = f.icon;
                      return (
                        <Link key={f.page + f.label} to={createPageUrl(f.page)} onClick={() => setSearch("")}>
                          <div className="flex items-center gap-3 px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-xs">
                            <IconComponent className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                            <span className="font-semibold text-[var(--app-text)]">{f.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {matchedMyDecks.length > 0 && (
                  <div className="border-b pb-1" style={{ borderColor: "var(--app-border)" }}>
                    <p className="text-[9px] font-bold px-4 pt-2.5 pb-1 opacity-50 tracking-wider" style={mutedStyle}>Your Decks</p>
                    {matchedMyDecks.map(deck => (
                      <Link key={deck.id} to={createPageUrl(`Study?deck_id=${deck.id}`)} onClick={() => setSearch("")}>
                        <div className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 text-xs truncate font-semibold flex items-center gap-2.5 text-[var(--app-text)]">
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
                    <p className="text-[9px] font-bold px-4 pt-2.5 pb-1 opacity-50 tracking-wider" style={mutedStyle}>Community Decks</p>
                    {matchedCommunityDecks.map(deck => (
                      <Link key={deck.id} to={createPageUrl(`Study?deck_id=${deck.id}`)} onClick={() => setSearch("")}>
                        <div className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 text-xs truncate font-semibold flex items-center gap-2.5 text-[var(--app-text)]">
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
                    <p className="text-[9px] font-bold px-4 pt-2.5 pb-1 opacity-50 tracking-wider" style={mutedStyle}>Users</p>
                    {matchedUsers.map(u => (
                      <Link key={u.email} to={createPageUrl(`FriendsAndUsers`)} onClick={() => setSearch("")} className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 text-xs flex items-center gap-2.5 text-[var(--app-text)] block transition-colors">
                        <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] text-violet-500 dark:text-violet-400 font-bold uppercase">
                          {u.full_name ? u.full_name[0] : <User className="w-2.5 h-2.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate leading-tight">{u.full_name || "Anonymous Learner"}</p>
                          <p className="text-[9px] opacity-50 truncate leading-none mt-0.5" style={mutedStyle}>{u.email}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <LiveActivityBar />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4">
            
            <div className="lg:col-span-2 space-y-8">
              
              <div className="space-y-3">
                <h2 className="font-bold text-xs tracking-wide opacity-60" style={mutedStyle}>Study tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {ALL_FEATURES.map((feat, i) => {
                    const IconComponent = feat.icon;
                    return (
                      <Link key={i} to={createPageUrl(feat.page)} className="block group">
                        <div className="rounded-xl p-4 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-[116px] bg-slate-500/5 dark:bg-slate-900/10 hover:bg-slate-500/10 dark:hover:bg-slate-900/30 hover:border-violet-500/30" style={{ borderColor: "var(--app-border)" }}>
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${feat.bgGlow} blur-2xl pointer-events-none opacity-60`} />
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                            <IconComponent className={`w-4 h-4 ${feat.iconColor}`} />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-[var(--app-text)] flex items-center gap-1 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                              <span>{feat.label}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-violet-500 dark:text-violet-400" />
                            </p>
                            <p className="text-[11px] mt-0.5 opacity-60" style={mutedStyle}>{feat.desc}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {homeLayout.showTools && <MoreTools cardStyle={cardStyle} mutedStyle={mutedStyle} />}

              {homeLayout.showRecentDecks && decks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-xs tracking-wide opacity-60" style={mutedStyle}>Recent flashcards</h2>
                    <Link to={createPageUrl("Decks")} className="text-violet-500 dark:text-violet-400 text-xs font-bold hover:underline">
                      View all sets
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {decks.slice(0, 4).map(deck => (
                      <Link key={deck.id} to={createPageUrl(`Study?deck_id=${deck.id}`)} className="block">
                        <div className="rounded-xl p-3 border transition-all duration-150 flex items-center justify-between group bg-slate-500/5 dark:bg-slate-900/5 hover:bg-slate-500/10 dark:hover:bg-slate-900/20 hover:border-violet-500/30" style={cardStyle}>
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            {deck.cover_image_url ? (
                              <img src={deck.cover_image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-[var(--app-bg)] border shrink-0" style={{ borderColor: "var(--app-border)" }} />
                            ) : (
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getFallbackStyle(deck.id)} shrink-0 flex items-center justify-center text-white/50 font-bold text-[10px]`}>
                                SET
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-[var(--app-text)] truncate group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">{deck.title}</span>
                                {deck.is_verified && <VerifiedBadge size={12} />}
                              </div>
                              <p className="text-[10px] opacity-60 mt-0.5 font-medium" style={mutedStyle}>{deck.card_count || 0} cards · Personal set</p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400 group-hover:text-violet-500 shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {homeLayout.showCommunityDecks && trendingDecks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-xs tracking-wide opacity-60" style={mutedStyle}>Trending study sets</h2>
                    <Link to={createPageUrl("PublicDecks")} className="text-violet-500 dark:text-violet-400 text-xs font-bold hover:underline">
                      Explore community sets
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trendingDecks.map(deck => (
                      <Link key={deck.id} to={createPageUrl(`Study?deck_id=${deck.id}`)}>
                        <div className="rounded-xl p-3 border transition-all h-full flex flex-col justify-between bg-slate-500/5 dark:bg-slate-900/5 hover:bg-slate-500/10 dark:hover:bg-slate-900/20" style={cardStyle}>
                          <div className="flex items-start gap-3">
                            {deck.cover_image_url ? (
                              <img src={deck.cover_image_url} alt="" className="w-12 h-12 rounded-lg object-cover bg-[var(--app-bg)] border shrink-0" style={{ borderColor: "var(--app-border)" }} />
                            ) : (
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getFallbackStyle(deck.id)} shrink-0 flex items-center justify-center text-white/50 font-bold text-[10px]`}>
                                TRND
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="font-bold text-xs text-[var(--app-text)] truncate block">{deck.title}</span>
                                {deck.is_verified && <VerifiedBadge size={11} />}
                              </div>
                              <p className="text-[10px] opacity-60 font-medium" style={mutedStyle}>{deck.card_count || 0} terms</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-3 tracking-wide">Popular across classes</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              
              {user && (
                <div className="border rounded-xl p-4 bg-slate-500/5 dark:bg-slate-900/10" style={cardStyle}>
                  <StreakBadges sessions={allSessions} userEmail={user.email} />
                </div>
              )}

              {homeLayout.showLiveCounters && (
                <div className="border rounded-xl p-4 space-y-4 bg-slate-500/5 dark:bg-slate-900/10" style={cardStyle}>
                  <h4 className="text-[10px] font-bold tracking-wide opacity-60" style={mutedStyle}>Study analytics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-lg font-black text-[var(--app-text)]">{totalMinutes.toLocaleString()}</p>
                      <p className="text-[9px] font-bold opacity-50 tracking-tight mt-0.5" style={mutedStyle}>Minutes spent</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-[var(--app-text)]">{totalCardsReviewed.toLocaleString()}</p>
                      <p className="text-[9px] font-bold opacity-50 tracking-tight mt-0.5" style={mutedStyle}>Cards studied</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-xl p-5 border relative overflow-hidden bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border-violet-500/20">
                <div className="flex items-center gap-2 mb-2 text-violet-600 dark:text-violet-400">
                  <Heart className="w-3.5 h-3.5 fill-violet-500/10" />
                  <h4 className="font-bold text-xs tracking-tight">Support open learning</h4>
                </div>
                <p className="text-[11px] leading-relaxed opacity-80 mb-4" style={mutedStyle}>
                  Help keep this study environment fast and fully open-access for high school and college student learning pipelines.
                </p>
                <a 
                  href="https://paypal.me/ycmusicmodels" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full inline-flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold h-9 rounded-lg transition-all shadow-md active:scale-[0.99]"
                >
                  Support project
                </a>
              </div>

              {homeLayout.showMyClasses && myClasses.length > 0 && (
                <div className="border rounded-xl p-4 space-y-3 bg-slate-500/5 dark:bg-slate-900/10" style={cardStyle}>
                  <h4 className="text-[10px] font-bold tracking-wide opacity-60" style={mutedStyle}>Your classes</h4>
                  <div className="space-y-1.5">
                    {myClasses.slice(0, 3).map(cls => (
                      <div key={cls.id} className="text-[11px] font-semibold p-2.5 rounded-lg bg-white dark:bg-slate-950/40 border flex items-center justify-between text-[var(--app-text)]" style={{ borderColor: "var(--app-border)" }}>
                        <span className="truncate pr-2">{cls.name}</span>
                        <Play className="w-2.5 h-2.5 opacity-50 shrink-0 text-violet-500 dark:text-violet-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl p-4 border bg-emerald-500/5 border-emerald-500/10 flex gap-3 items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-emerald-600 dark:text-emerald-400">Student Operated</p>
                  <p className="text-[11px] leading-relaxed opacity-80" style={mutedStyle}>
                    Cognita Study is fully operated by students! We don't do this for the profit- but for helping our fellow classmates out! Go to the parternship page if you'd like to partner up for integrations or would like to support us!
                  </p>
                </div>
              </div>

              <div className="text-center opacity-70 saturate-50 hover:saturate-100 transition-all">
                <OurPartners />
              </div>

            </div>

          </div>

        </div>

        <div className="mt-20 border-t pt-8 w-full max-w-6xl mx-auto" style={{ borderColor: "var(--app-border)" }}>
          <Footer userEmail={user?.email} />
        </div>
      </div>
    </PullToRefresh>
  );
}