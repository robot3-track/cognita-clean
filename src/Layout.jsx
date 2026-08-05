import { db } from '@/lib/firebase';

import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, MessageSquare, Layers, Home, User, ChevronLeft, Settings, BarChart3, Trophy, Camera, Mic, Users, Gamepad2, Globe, Gift, History, Info, Brain, Timer, CalendarDays, BookOpen, GraduationCap, Shield, Calculator, BookMarked, FolderOpen, ClipboardList, FlaskConical, Lightbulb, NotebookPen, Code2, Handshake, FileText, UserPlus } from "lucide-react";
import { useTranslation, LANGUAGES } from "./hooks/useTranslation";
import { useEffect, useState, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { applyTheme, THEME_KEY } from "./pages/Settings";
import WelcomeSplash from "./components/WelcomeSplash";

import AdMobBanner from "./components/AdMobBanner";
import { useNotificationEmail } from "./hooks/useNotificationEmail";
import { useSuspiciousActivity } from "./hooks/useSuspiciousActivity";
import SuspensionGate from "./components/SuspensionGate";
import NotificationBanner from "./components/NotificationBanner";
import SurveyBanner from "./components/SurveyBanner";
import AiUsageCounter from "./components/AiUsageCounter";
import DevAnnouncementBanner from "./components/DevAnnouncementBanner";
import APShowcaseBanner from "./components/APShowcaseBanner";
import { useAppTimeTracker } from "./hooks/useAppTimeTracker";
import QuestionnairePopup from "./components/QuestionnairePopup";
import AnnouncementPopup from "./components/AnnouncementPopup";

// Ads currently disabled
// (function preloadAdSense() {
//   if (document.getElementById("adsense-script")) return;
//   const script = document.createElement("script");
//   script.id = "adsense-script";
//   script.async = true;
//   script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3207455851065433";
//   script.crossOrigin = "anonymous";
//   document.head.appendChild(script);
//   window.adsbygoogle = window.adsbygoogle || [];
// })();

const navItems = [
  { label: "Home", icon: Home, page: "Home" },
  { label: "Chat", icon: MessageSquare, page: "Chat" },
  { label: "Decks", icon: Layers, page: "Decks" },
  { label: "Groups", icon: Users, page: "StudyGroups" },
  { label: "Scan", icon: Camera, page: "Scan" },
  { label: "Compete", icon: Trophy, page: "Compete" },
  { label: "Progress", icon: BarChart3, page: "Progress" },
];

const CHILD_PAGES = ["Study", "Media", "Pricing", "Settings", "MatchingGame", "StudyGroups"];

function AdSenseMeta() {
  useEffect(() => {
    if (document.querySelector('meta[name="google-adsense-account"]')) return;
    const meta = document.createElement("meta");
    meta.name = "google-adsense-account";
    meta.content = "ca-pub-3207455851065433";
    document.head.appendChild(meta);
  }, []);
  return null;
}

function EffectiveGateAd() {
  // Ads currently disabled
  return null;
}

function InjectBodyScript() {
  // Ads currently disabled
  return null;
}

function ThemeProvider() {
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) || "system";
    applyTheme(saved);
    if (saved === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => { if ((localStorage.getItem(THEME_KEY) || "system") === "system") applyTheme("system"); };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);
  return null;
}

const DEV_EMAILS = ["yychang100@student.hbuhsd.edu", "yohanyinyuchang@gmail.com"];

const buildNavGroups = (t, userEmail) => [
  {
    label: t('studyTools'),
    subGroups: [
      {
        label: "AI Studio",
        pages: [
          { label: "AI Studio", icon: Sparkles, page: "Media" },
          { label: "AI Tutors", icon: GraduationCap, page: "AITutors" },
        ],
      },
    ],
    pages: [
      { label: "AI Chat", icon: MessageSquare, page: "Chat" },
      { label: t('decks'), icon: Layers, page: "Decks" },
      { label: t('scan'), icon: Camera, page: "Scan" },
      { label: "Study Games", icon: Gamepad2, page: "TowerDefense" },
      { label: "Multilingual Dictionary", icon: BookMarked, page: "Dictionary" },
      { label: "Exam Prep", icon: ClipboardList, page: "ExamPrep" },
      { label: "Grade Checker", icon: ClipboardList, page: "GradeChecker" },
    ],
  },
  {
    label: t('advancedTools'),
    subGroups: [
      {
        label: t('moreTools'),
        pages: [
          { label: t('spacedRepetition'), icon: Brain, page: "SpacedRepetition" },
          { label: t('pomodoro'), icon: Timer, page: "Pomodoro" },
          { label: t('roadmap'), icon: CalendarDays, page: "StudyRoadmap" },
          { label: "Notes", icon: NotebookPen, page: "Notes" },
          { label: t('brainDump'), icon: Mic, page: "BrainDump" },
        ],
      },
      {
        label: "Math",
        pages: [
          { label: "Calculator", icon: Calculator, page: "Calculator" },
        ],
      },
      {
        label: "Science",
        pages: [
          { label: t('chemBalancer') || "Chem Balancer", icon: FlaskConical, page: "ChemBalance" },
          { label: t('periodicTable') || "Periodic Table", icon: Layers, page: "PeriodicTable" },
        ],
      },
      {
        label: "Coding",
        pages: [
          { label: t('codeSandbox') || "Code Sandbox", icon: Code2, page: "CodeSandbox" },
        ],
      },
      {
        label: "English",
        pages: [
          { label: "MLA Formatter", icon: FileText, page: "MLAFormatter" },
        ],
      },
    ],
    pages: [], // flat pages list (kept for active detection)
  },
  {
    label: t('examPrep') || "Exam Prep",
    pages: [
      { label: "Exam Prep Hub", icon: ClipboardList, page: "ExamPrep" },
      { label: t('apTestPrep') || "AP Testing", icon: ClipboardList, page: "APTesting" },
      { label: t('apTips') || "AP Tips", icon: Lightbulb, page: "APTips" },
      { label: "SAT Prep", icon: ClipboardList, page: "SATPrep" },
      { label: t('stateTestPrep') || "State Test Prep", icon: ClipboardList, page: "StateTestPrep" },
      { label: t('iReadyPrep') || "iReady Prep", icon: ClipboardList, page: "iReadyPrep" },
    ],
  },
  {
    label: t('classroomTab'),
    pages: [
      { label: t('classroom'), icon: GraduationCap, page: "Classroom" },
      { label: t('joinGameByCode'), icon: Gamepad2, page: "ClassroomGame" },
    ],
  },
  {
    label: t('community'),
    pages: [
      { label: t('groups'), icon: Users, page: "StudyGroups" },
      { label: t('compete'), icon: Trophy, page: "Compete" },
      { label: t('publicDecks'), icon: Globe, page: "PublicDecks" },
      { label: "Friends & Users", icon: UserPlus, page: "FriendsAndUsers" },
      { label: t('resourceLibrary'), icon: BookOpen, page: "ResourceLibrary" },
      { label: "Resource Hub", icon: FolderOpen, page: "ResourceHub" },
    ],
  },
  {
    label: t('account'),
    pages: [
      { label: t('profile'), icon: User, page: "Profile" },
      { label: t('progress'), icon: BarChart3, page: "Progress" },
      { label: t('settings'), icon: Settings, page: "Settings" },
      { label: t('surveys'), icon: Gift, page: "Surveys" },
      { label: t('rewardHistory'), icon: History, page: "RewardHistory" },
      { label: t('about'), icon: Info, page: "About" },
      { label: "Partnership", icon: Handshake, page: "Partnership" },
      ...(DEV_EMAILS.includes(userEmail) ? [
        { label: "🛡️ Dev Dashboard", icon: Shield, page: "DevDashboard" },
      ] : []),
    ],
  },
];

// Flyout sub-subgroup item (appears to the right of the parent dropdown)
function SubGroupFlyout({ sg, currentPageName, onNavigate, parentOpenTimer }) {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const flyoutTimer = useRef(null);
  const isActive = sg.pages.some(p => p.page === currentPageName);

  const handleEnter = () => {
    if (flyoutTimer.current) clearTimeout(flyoutTimer.current);
    if (parentOpenTimer?.current) clearTimeout(parentOpenTimer.current);
    setFlyoutOpen(true);
  };
  const handleLeave = () => {
    flyoutTimer.current = setTimeout(() => setFlyoutOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={() => setFlyoutOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2 transition-all cursor-pointer text-sm font-medium ${isActive ? "text-violet-400 bg-violet-500/10" : "opacity-70 hover:opacity-100 hover:bg-white/5"}`}
      >
        <span>{sg.label}</span>
        <svg className="w-3 h-3 opacity-50 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {flyoutOpen && (
        <div
          className="absolute left-full top-0 pl-1 z-[110]"
          style={{ minWidth: 200 }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <div
            className="rounded-2xl shadow-2xl py-2"
            style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }}
          >
            {sg.pages.map(({ label, icon: Icon, page }) => (
              <Link key={page} to={createPageUrl(page)} onClick={onNavigate}>
                <div className={`flex items-center gap-3 px-4 py-2.5 transition-all cursor-pointer ${currentPageName === page ? "text-violet-400 bg-violet-500/10" : "opacity-70 hover:opacity-100 hover:bg-white/5"}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownNav({ currentPageName, userEmail }) {
  const [open, setOpen] = useState(null);
  const closeTimer = useRef(null);
  const navRef = useRef(null);
  const { t } = useTranslation();
  const NAV_GROUPS = buildNavGroups(t, userEmail);

  const handleMouseEnter = (label) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 200);
  };

  const getAllPages = (group) => {
    const subPages = group.subGroups ? group.subGroups.flatMap(sg => sg.pages) : [];
    return [...subPages, ...(group.pages || [])];
  };
  const isGroupActive = (group) => getAllPages(group).some(p => p.page === currentPageName);

  return (
    <div ref={navRef} className="hidden md:flex items-center gap-1" style={{ position: "relative", zIndex: 999 }}>
      {NAV_GROUPS.map((group) => (
        <div
          key={group.label}
          className="relative"
          style={{ overflow: "visible" }}
          onMouseEnter={() => handleMouseEnter(group.label)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setOpen(open === group.label ? null : group.label)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-sm font-medium ${
              isGroupActive(group) ? "bg-violet-500/10 text-violet-400" : "opacity-50 hover:opacity-90"
            }`}
          >
            {group.label}
            <svg className={`w-3 h-3 transition-transform ${open === group.label ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === group.label && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[999] before:content-[''] before:absolute before:-top-4 before:inset-x-0 before:h-4"
              style={{ minWidth: 200 }}
              onMouseEnter={() => handleMouseEnter(group.label)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="rounded-2xl shadow-2xl py-2 relative z-[999]"
                style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }}
              >
                {/* Render subGroups flyouts if present */}
                {group.subGroups && group.subGroups.map(sg => (
                  <SubGroupFlyout
                    key={sg.label}
                    sg={sg}
                    currentPageName={currentPageName}
                    onNavigate={() => setOpen(null)}
                    parentOpenTimer={closeTimer}
                  />
                ))}
                {/* Always render flat pages too */}
                {(group.pages || []).length > 0 && group.subGroups && (
                  <div className="my-1 mx-3 border-t" style={{ borderColor: "var(--app-border)" }} />
                )}
                {(group.pages || []).map(({ label, icon: Icon, page }) => (
                  <Link key={page} to={createPageUrl(page)} onClick={() => setOpen(null)}>
                    <div className={`flex items-center gap-3 px-4 py-2.5 transition-all cursor-pointer ${currentPageName === page ? "text-violet-400 bg-violet-500/10" : "opacity-70 hover:opacity-100 hover:bg-white/5"}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold opacity-60 hover:opacity-90 transition-all" title="Change language">
        <span className="text-base">{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 rounded-2xl shadow-2xl z-50 py-1 overflow-hidden" style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)", minWidth: 140 }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-all hover:bg-white/5 ${lang === l.code ? "text-violet-400" : "opacity-70"}`}>
              <span>{l.flag}</span> {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AppTimeTrackerWrapper({ pageName }) {
  useAppTimeTracker(pageName);
  return null;
}

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isChild = CHILD_PAGES.includes(currentPageName);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState(null);
  const { t } = useTranslation();
  const [devEmail, setDevEmail] = useState("");
  const [layoutUser, setLayoutUser] = useState(null);
  useEffect(() => {
    db.auth.me().then(me => {
      setDevEmail(me?.email || "");
      setLayoutUser(me);
      // Track login event once per browser session
      if (me?.email) {
      const sessionKey = `login_tracked_${me.email}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "1");
        db.entities.UserLoginEvent.create({
          user_email: me.email,
          user_name: me.full_name || "",
          platform: navigator.userAgent.includes("Mobile") ? "mobile" : "desktop",
        }).catch(() => {});
      }
      }
    }).catch(() => {});
  }, []);
  useNotificationEmail(layoutUser);
  useSuspiciousActivity(layoutUser);

  const navGroups = buildNavGroups(t, devEmail);

  const handleNavClick = (page) => {
    const url = createPageUrl(page);
    const currentPath = location.pathname + location.search;
    if (currentPageName === page) {
      // Force re-navigation to root of tab
      navigate(url, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(url);
    }
  };
  const showTopNav = true; // always show nav

  if (layoutUser && !layoutUser.email) return null; // still loading

  return (
    <SuspensionGate user={layoutUser}>
    <div className="min-h-screen flex flex-col" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      <ThemeProvider />
      <AppTimeTrackerWrapper pageName={currentPageName} />
      <InjectBodyScript />
      <AdSenseMeta />
      <EffectiveGateAd />
      <WelcomeSplash />
      {layoutUser && <QuestionnairePopup user={layoutUser} />}
      <APShowcaseBanner />
      <DevAnnouncementBanner />
      <AnnouncementPopup />
      <NotificationBanner />
      <SurveyBanner />
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        button, a, nav * { user-select: none; -webkit-user-select: none; }
        body { overscroll-behavior: none; }
      `}</style>

      {/* AdMob Banner (removed after I didn't want to use ads anymore) - top */}
      <AdMobBanner />

      {/* Top nav */}
      {showTopNav && (
        <nav
          className="sticky top-0 z-[999] flex items-center px-4 backdrop-blur-xl gap-4"
          style={{ borderBottom: "1px solid var(--app-border)", background: "var(--app-nav-bg)", paddingTop: "calc(0.75rem + env(safe-area-inset-top))", paddingBottom: "0.75rem" }}
        >
          <div className="flex items-center gap-2 flex-1">
            {isChild && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-1 opacity-60 hover:opacity-100 transition-all text-sm font-medium rounded-xl"
                style={{ minWidth: 44, minHeight: 44, color: "var(--app-text)" }}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <Link to={createPageUrl("Home")}>
              <div className="flex items-center gap-2">
                <img src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" alt="Cognita" className="w-7 h-7 rounded-lg object-cover" />
                <span className="font-black text-lg tracking-tight">Cognita</span>
              </div>
            </Link>
          </div>

          {/* Standalone Home link */}
          <div className="hidden md:flex items-center gap-1">
            <Link to={createPageUrl("Home")}>
              <button className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-sm font-medium ${currentPageName === "Home" ? "bg-violet-500/10 text-violet-400" : "opacity-50 hover:opacity-90"}`}>
                <Home className="w-4 h-4" /> {t('home')}
              </button>
            </Link>
            <Link to={createPageUrl("Courses")}>
              <button className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-sm font-medium ${currentPageName === "Courses" || currentPageName === "CourseView" ? "bg-violet-500/10 text-violet-400" : "opacity-50 hover:opacity-90"}`}>
                <BookOpen className="w-4 h-4" /> {t('courses')}
              </button>
            </Link>
          </div>
          <DropdownNav currentPageName={currentPageName} userEmail={devEmail} />

          <div className="flex items-center gap-2 flex-1 justify-end">
          <LanguageSwitcher />
          <AiUsageCounter />
          {/* Hamburger for mobile/tablet */}
          <button
            className="md:hidden flex flex-col items-center justify-center gap-1 p-2 rounded-xl opacity-70 hover:opacity-100 transition-all"
            onClick={() => setMobileMenuOpen(o => !o)}
            style={{ minWidth: 40, minHeight: 40 }}
          >
            <span className={`block w-5 h-0.5 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} style={{ background: "var(--app-text)" }} />
            <span className={`block w-5 h-0.5 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} style={{ background: "var(--app-text)" }} />
            <span className={`block w-5 h-0.5 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} style={{ background: "var(--app-text)" }} />
          </button>
          <Link to={createPageUrl("Media")} className="md:block">
            <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Studio</span>
            </button>
          </Link>
          </div>
        </nav>
      )}

      {/* Page content with slide-in animation */}
      <main className="flex-1 min-h-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPageName}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer credit */}
      <div className="w-full text-center py-3 text-xs opacity-30 flex flex-col items-center gap-2" style={{ color: "var(--app-text)" }}>
        <span>Made by Yohan Chang, student of Marina High School. 2026.</span>
        <a href="https://instagram.com/cognita.study" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ filter: "grayscale(1)" }}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </div>

      {/* Mobile grouped menu overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60]"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 z-[61] w-72 transition-transform duration-300 flex flex-col overflow-y-auto`}
        style={{
          background: "var(--app-surface-solid)",
          borderLeft: "1px solid var(--app-border)",
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(100%)",
          paddingTop: "calc(4rem + env(safe-area-inset-top))",
          paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="px-4 space-y-1">
          {/* Home link in mobile menu */}
          <Link to={createPageUrl("Home")} onClick={() => setMobileMenuOpen(false)}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all mb-1 ${currentPageName === "Home" ? "text-violet-400 bg-violet-500/10 font-bold" : "opacity-70 hover:opacity-100"}`}>
              <Home className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{t('home')}</span>
            </div>
          </Link>
          {/* Courses link in mobile menu */}
          <Link to={createPageUrl("Courses")} onClick={() => setMobileMenuOpen(false)}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all mb-1 ${currentPageName === "Courses" || currentPageName === "CourseView" ? "text-violet-400 bg-violet-500/10 font-bold" : "opacity-70 hover:opacity-100"}`}>
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{t('courses')}</span>
            </div>
          </Link>
          {navGroups.map((group) => {
            const allGroupPages = [...(group.subGroups ? group.subGroups.flatMap(sg => sg.pages) : []), ...(group.pages || [])];
            const isActive = allGroupPages.some(p => p.page === currentPageName);
            return (
            <div key={group.label}>
              <button
                onClick={() => setMobileOpenGroup(mobileOpenGroup === group.label ? null : group.label)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all"
                style={{
                  background: isActive ? "rgba(139,92,246,0.1)" : "transparent",
                  color: isActive ? "rgb(167,139,250)" : "var(--app-text)",
                }}
              >
                {group.label}
                <svg className={`w-4 h-4 transition-transform ${mobileOpenGroup === group.label ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileOpenGroup === group.label && (
                <div className="ml-2 mt-1 space-y-0.5 mb-2">
                  {group.subGroups && group.subGroups.map(sg => (
                    <div key={sg.label}>
                      <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider opacity-40">{sg.label}</p>
                      {sg.pages.map(({ label, icon: Icon, page }) => (
                        <Link key={page} to={createPageUrl(page)} onClick={() => { setMobileMenuOpen(false); setMobileOpenGroup(null); }}>
                          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all ${currentPageName === page ? "text-violet-400 bg-violet-500/10" : "opacity-70 hover:opacity-100"}`}>
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                  {group.subGroups && (group.pages || []).length > 0 && (
                    <div className="my-1 mx-2 border-t" style={{ borderColor: "var(--app-border)" }} />
                  )}
                  {(group.pages || []).map(({ label, icon: Icon, page }) => (
                    <Link key={page} to={createPageUrl(page)} onClick={() => { setMobileMenuOpen(false); setMobileOpenGroup(null); }}>
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentPageName === page ? "text-violet-400 bg-violet-500/10" : "opacity-70 hover:opacity-100"}`}>
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
    </SuspensionGate>
  );
}
