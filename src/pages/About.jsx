
import { MessageSquare, Layers, Camera, Users, Gamepad2, Type, Trophy, BarChart3, Mic, Video, Globe, Gift, Sparkles, Brain, Target, BookOpen, Zap, Shield, Moon, Timer, CalendarDays, Sigma, PenLine, Flag, Volume2, ChevronDown, GraduationCap, Languages, Calculator, BookMarked, FolderOpen, Swords, ClipboardList, Flame, Award, FileText, Database, HelpCircle, NotebookPen, PlayCircle, Lightbulb, UserPlus, FlaskConical, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useState } from "react";

const CATEGORIES = [
  {
    label: "Core Study Tools",
    color: "text-violet-400",
    features: [
      {
        icon: MessageSquare,
        color: "from-violet-600 to-purple-600",
        title: "AI Chat Tutor",
        desc: "Ask anything about your studies. Attach files & images, link flashcard decks as reference, specify how many flashcards to create, rename chats, and organize into folders. Includes Voice Conversation mode — speak and get real-time audio replies.",
        page: "Chat",
      },
      {
        icon: Layers,
        color: "from-blue-600 to-cyan-600",
        title: "Smart Flashcard Decks",
        desc: "Create decks manually or auto-generate up to 200 flashcards from any text or notes using AI. Organize by subject, color-code, group into folders, and share publicly.",
        page: "Decks",
      },
      {
        icon: Brain,
        color: "from-indigo-600 to-violet-600",
        title: "Flashcard Study Mode",
        desc: "Interactive flip cards with 'Need to Study' tracking. Shuffle mode, targeted re-review pass, and per-session progress logging.",
        page: null,
      },
      {
        icon: Target,
        color: "from-emerald-600 to-teal-600",
        title: "AI-Generated Quizzes",
        desc: "Generate multiple-choice quizzes from your decks instantly. Choose 5–200 questions, save for retakes, and get explanations for every answer.",
        page: null,
      },
    ],
  },
  {
    label: "Advanced Practice Modes",
    color: "text-pink-400",
    features: [
      {
        icon: PenLine,
        color: "from-pink-600 to-rose-600",
        title: "Write Mode",
        desc: "Type your answers instead of flipping cards. AI semantic matching accepts conceptually correct answers — not just exact matches. Great for deep recall.",
        page: "WriteMode",
      },
      {
        icon: Flag,
        color: "from-amber-600 to-orange-600",
        title: "Checkpoint Mode",
        desc: "Cumulative multiple-choice exam simulation. Tests you on all cards in a deck, randomises distractors, and logs your performance as a study session.",
        page: "CheckpointMode",
      },
      {
        icon: Gamepad2,
        color: "from-amber-600 to-yellow-600",
        title: "Matching Game",
        desc: "Match terms to definitions in a timed drag-and-drop game. Tracks moves and time — beat your high score with any deck.",
        page: "MatchingGame",
      },
      {
        icon: Type,
        color: "from-teal-600 to-emerald-600",
        title: "Word Scramble",
        desc: "Unscramble the answer to each flashcard. Great for spelling and recall. Includes hints and score tracking.",
        page: "MatchingGame",
      },
      {
        icon: ClipboardList,
        color: "from-violet-600 to-fuchsia-600",
        title: "Practice Test Mode",
        desc: "AI generates a full custom test from your deck — choose question count, answer direction, and question types: True/False, Multiple Choice, Matching, and Written. Graded automatically with a detailed review.",
        page: "Decks",
      },
    ],
  },
  {
    label: "Smart Study & Focus",
    color: "text-blue-400",
    features: [
      {
        icon: Brain,
        color: "from-violet-600 to-indigo-600",
        title: "Spaced Repetition (SRS)",
        desc: "SM-2 algorithm schedules reviews automatically. Supports both your own decks and the community's public decks. Hard cards return sooner, easy cards later.",
        page: "SpacedRepetition",
      },
      {
        icon: Volume2,
        color: "from-sky-600 to-blue-600",
        title: "Focus Mode",
        desc: "Ambient soundscapes (white noise, brown noise, rain) built into every study session. Adjust volume and let the sounds carry you into deep focus.",
        page: null,
      },
      {
        icon: Timer,
        color: "from-orange-600 to-red-600",
        title: "Group Pomodoro Timer",
        desc: "25/5 focus sessions with a real-time Study Room showing which friends are currently focusing. Complete 4 sessions to earn bonus AI credits.",
        page: "Pomodoro",
      },
      {
        icon: CalendarDays,
        color: "from-blue-600 to-cyan-600",
        title: "AI Study Roadmap",
        desc: "Enter your exam date and topics. AI generates a day-by-day calendar study plan mixing flashcards, audio, and games — so you always know what to study next.",
        page: "StudyRoadmap",
      },
      {
        icon: Mic,
        color: "from-pink-600 to-purple-600",
        title: "Voice Brain Dump",
        desc: "Speak about what you just learned. AI removes filler words, structures your thoughts into a summary, and suggests 3–5 flashcards — all from your voice.",
        page: "BrainDump",
      },
    ],
  },
  {
    label: "AI Studio & Media",
    color: "text-emerald-400",
    features: [
      {
        icon: Sparkles,
        color: "from-violet-600 to-blue-700",
        title: "AI Studio",
        desc: "The all-in-one AI content creation hub. Generate audio lessons, video lessons, and podcasts from any study material — paste notes, upload a file, or use a flashcard deck.",
        page: "Media",
      },
      {
        icon: Mic,
        color: "from-purple-600 to-pink-600",
        title: "Audio Lessons",
        desc: "Generate AI audio lessons from your decks. Listen to your notes read aloud — perfect for auditory learners or studying on the go.",
        page: "Media",
      },
      {
        icon: Video,
        color: "from-orange-600 to-red-600",
        title: "Video Lessons",
        desc: "Create AI-narrated slideshow-style video lessons from your decks. Scenes with visual imagery and narration for a lecture-like experience.",
        page: "Media",
      },
      {
        icon: Users,
        color: "from-sky-600 to-blue-600",
        title: "Study Groups",
        desc: "Create or join study groups for any subject. Real-time chat, reply threads, emoji reactions, member lists — collaborate and learn together.",
        page: "StudyGroups",
      },
      {
        icon: Globe,
        color: "from-green-600 to-emerald-600",
        title: "Public Deck Library",
        desc: "Browse community-shared decks across every subject. Search by topic or keyword. Study any public deck instantly — including in Spaced Repetition mode.",
        page: "PublicDecks",
      },
      {
        icon: Trophy,
        color: "from-yellow-600 to-amber-600",
        title: "Compete & Leaderboard",
        desc: "Add friends and compete on a leaderboard ranked by study time and quiz performance. Send and accept friend requests.",
        page: "Compete",
      },
    ],
  },
  {
    label: "Classroom & Language",
    color: "text-amber-400",
    features: [
      {
        icon: GraduationCap,
        color: "from-violet-600 to-indigo-600",
        title: "Classroom",
        desc: "Teachers can create classes with a shareable join code, assign decks, and manage students. Students join with a code and see all assigned study material.",
        page: "Classroom",
      },
      {
        icon: Zap,
        color: "from-amber-500 to-yellow-600",
        title: "Live Classroom Game",
        desc: "Host a real-time Kahoot-style quiz game for your class. AI generates questions from any deck. Students join with a code and compete on a live leaderboard.",
        page: "Classroom",
      },
      {
        icon: Languages,
        color: "from-teal-600 to-cyan-600",
        title: "Multi-Language UI",
        desc: "Switch the entire app interface to English, Spanish (Español), French (Français), or Chinese (中文) using the language switcher in the top navigation bar.",
        page: null,
      },
      {
        icon: Brain,
        color: "from-purple-600 to-violet-600",
        title: "Adaptive Learn Mode",
        desc: "Smarter than flashcards: hard cards appear more often until you get each card correct twice. Tracks per-card difficulty and shows round-by-round mastery progress.",
        page: null,
      },
      {
        icon: MessageSquare,
        color: "from-blue-600 to-sky-600",
        title: "AI Deck Tutor",
        desc: "Chat with an AI that knows every card in your deck. Ask for explanations, mnemonics, quizzes, or clarifications — all context-aware to your specific study material.",
        page: null,
      },
      {
        icon: BookOpen,
        color: "from-green-600 to-emerald-600",
        title: "Resource Library",
        desc: "60+ subject topics across 10 categories. Click any topic to instantly generate 20 high-quality AI flashcards and save them to your decks — no text required.",
        page: "ResourceLibrary",
      },
    ],
  },
  {
    label: "Courses & Video Learning",
    color: "text-green-400",
    features: [
      {
        icon: PlayCircle,
        color: "from-green-600 to-emerald-600",
        title: "Video Course Catalog",
        desc: "Browse 80+ structured courses across Programming, AP Sciences, AP Math, AP History, Engineering, and quick Coding Skills. Each course includes curated YouTube video lessons and AI quizzes.",
        page: "Courses",
      },
      {
        icon: Brain,
        color: "from-violet-600 to-indigo-600",
        title: "Module Quizzes (AI-graded)",
        desc: "After watching each lesson, take an AI-generated 5-question quiz. You must score 80%+ to unlock the next module. Retakes available after a 10-minute cooldown.",
        page: "Courses",
      },
      {
        icon: Award,
        color: "from-amber-500 to-yellow-600",
        title: "Course Certificates",
        desc: "Complete all modules and pass every quiz to earn a certificate of completion. Download or print your certificate — LinkedIn and Facebook sharing included.",
        page: "Courses",
      },
      {
        icon: NotebookPen,
        color: "from-purple-600 to-violet-600",
        title: "Notes (Google-Docs Style)",
        desc: "Built-in rich-text document editor. Bold, italic, headings, bullet lists, color-coded notes, pin important docs, and auto-save. Organize all your study notes in one place.",
        page: "Notes",
      },
    ],
  },
  {
    label: "AI Tutors",
    color: "text-rose-400",
    features: [
      {
        icon: GraduationCap,
        color: "from-violet-600 to-purple-700",
        title: "25 AP Course Tutors",
        desc: "Personal AI tutors for every AP course — Calc AB/BC, Physics, Chemistry, Biology, US History, World History, Psychology, CS A, Spanish, French, and more.",
        page: "AITutors",
      },
      {
        icon: BookOpen,
        color: "from-blue-600 to-cyan-700",
        title: "High School Tutors",
        desc: "Dedicated tutors for every core high school subject: Algebra 1 & 2, Geometry, Precalculus, Biology, Chemistry, Physics, English, US & World History, and languages.",
        page: "AITutors",
      },
      {
        icon: Brain,
        color: "from-emerald-600 to-teal-700",
        title: "College Course Tutors",
        desc: "University-level AI tutors for Calculus I–III, Differential Equations, Linear Algebra, General Chemistry, Organic Chemistry, Cell Biology, Economics, Psychology, and more.",
        page: "AITutors",
      },
      {
        icon: Code2,
        color: "from-orange-600 to-red-700",
        title: "Professional & Coding Experts",
        desc: "Expert tutors for Python, JavaScript, React, Java, C++, SQL, Data Structures & Algorithms, Machine Learning, Web Dev, Finance, Business Strategy, Accounting, and Interview Prep.",
        page: "AITutors",
      },
    ],
  },
  {
    label: "AP Test Prep",
    color: "text-indigo-400",
    features: [
      {
        icon: PenLine,
        color: "from-pink-600 to-rose-600",
        title: "FRQ Maker & Grader",
        desc: "Generate realistic AP Free Response Questions for any subject. Write your answer, then get AI-graded feedback with rubric scores for each part.",
        page: "APTesting",
      },
      {
        icon: Target,
        color: "from-blue-600 to-cyan-600",
        title: "AP MCQ Practice",
        desc: "Practice with authentic AP-format multiple choice questions (4–5 options, skill-tagged, stimulus-based where applicable). Get detailed explanations after submission.",
        page: "APTesting",
      },
      {
        icon: ClipboardList,
        color: "from-violet-600 to-indigo-600",
        title: "Full AP Exam Simulator",
        desc: "Simulate a full AP exam: 15 MCQs + 2 FRQs. AI grades both sections and gives you a predicted AP Score from 1 to 5.",
        page: "APTesting",
      },
      {
        icon: Lightbulb,
        color: "from-amber-600 to-orange-600",
        title: "AP Exam Tips (No AI Credits)",
        desc: "Expert pre-written tips for 15+ AP subjects — exam format, key topics, FRQ strategies, common mistakes, and final-week advice. No AI credits consumed.",
        page: "APTips",
      },
    ],
  },
  {
    label: "Tools & Extras",
    color: "text-slate-400",
    features: [
      {
        icon: Camera,
        color: "from-pink-600 to-rose-600",
        title: "Scan & Import",
        desc: "Upload a photo of notes or a textbook page — paste any URL — or import a Quizlet set directly by URL. AI extracts content to auto-generate flashcards, quizzes, or a study summary.",
        page: "Scan",
      },
      {
        icon: Globe,
        color: "from-indigo-600 to-violet-600",
        title: "Quizlet Import",
        desc: "Paste any Quizlet set URL and an AI agent automatically fetches and extracts every term and definition from that exact set — no manual copying needed. Saves instantly as a flashcard deck.",
        page: "Scan",
      },
      {
        icon: Database,
        color: "from-orange-600 to-amber-600",
        title: "AI Bulk Generator",
        desc: "Type any topic and AI searches the web to generate a complete, accurate flashcard deck (10–50 cards) in seconds. Great for any subject you don't have notes for yet.",
        page: "Scan",
      },
      {
        icon: Sigma,
        color: "from-cyan-600 to-teal-600",
        title: "LaTeX / STEM Support",
        desc: "Full LaTeX rendering for math and chemistry. Write $E=mc^2$ inline or block equations — rendered beautifully in Chat, Flashcards, and Quizzes.",
        page: "Chat",
      },
      {
        icon: BarChart3,
        color: "from-indigo-600 to-blue-600",
        title: "Progress Tracking",
        desc: "Full study history: total time, cards reviewed, quiz scores, and 7-day trends. Every session is automatically logged.",
        page: "Progress",
      },
      {
        icon: Gift,
        color: "from-violet-600 to-indigo-600",
        title: "Earn AI Credits",
        desc: "Complete short surveys via CPX Research to earn extra AI credits — permanently added to your quota. View your full earning history.",
        page: "Surveys",
      },
      {
        icon: Moon,
        color: "from-slate-600 to-gray-600",
        title: "Dark / Light Mode",
        desc: "Switch between dark, light, or system preference. The entire app adapts instantly with accessible contrast ratios.",
        page: "Settings",
      },
      {
        icon: Shield,
        color: "from-emerald-600 to-green-600",
        title: "Privacy First",
        desc: "Your data, flashcards, and chats are private by default. No ads, no data selling. Decks stay private unless you explicitly share them.",
        page: "Settings",
      },
      {
        icon: Calculator,
        color: "from-slate-600 to-gray-700",
        title: "Scientific Calculator",
        desc: "Built-in scientific calculator with trig, logarithms, exponents, constants, and history — no need to leave the app while studying.",
        page: "Calculator",
      },
      {
        icon: BookMarked,
        color: "from-cyan-600 to-sky-600",
        title: "Dictionary",
        desc: "Look up any English word instantly: definitions, phonetic pronunciation, parts of speech, usage examples, synonyms, and audio playback.",
        page: "Dictionary",
      },
      {
        icon: FolderOpen,
        color: "from-orange-600 to-amber-600",
        title: "Resource Hub",
        desc: "Upload and share study files (PDFs, images, videos, audio) with the community. Browse public resources, preview PDFs inline, and download materials.",
        page: "ResourceHub",
      },
      {
        icon: Swords,
        color: "from-red-600 to-orange-600",
        title: "Term Invaders",
        desc: "Tower-defense style vocabulary game. Defend your base — answer before the enemy reaches you. 8 difficulty levels, multiple themes, and a global leaderboard.",
        page: "TowerDefense",
      },
      {
        icon: Gamepad2,
        color: "from-orange-600 to-red-600",
        title: "Block Blasters",
        desc: "Timed answer-blasting game — read the term and smash the correct definition block before the 20-second clock runs out. Streak bonuses for consecutive correct answers.",
        page: "TowerDefense",
      },
      {
        icon: HelpCircle,
        color: "from-blue-600 to-cyan-600",
        title: "Jeopardy",
        desc: "Full Jeopardy board built from your flashcards. Pick a clue by value, type your answer in question form, and gain or lose points. Play solo with any deck.",
        page: "TowerDefense",
      },
      {
        icon: Flame,
        color: "from-orange-500 to-red-500",
        title: "Study Streaks",
        desc: "Track your daily study streak. Study every day to build your streak — miss a day and it resets. Streak counter shown on the home page with fire indicator.",
        page: "Home",
      },
      {
        icon: Award,
        color: "from-violet-600 to-fuchsia-600",
        title: "Badges & Achievements",
        desc: "Earn 10 badges for milestones like completing your first session, 3/7/30-day streaks, reviewing 50/500/1000 cards, studying 60+ minutes, and scoring 100% on a quiz.",
        page: "Home",
      },
      {
        icon: FileText,
        color: "from-indigo-600 to-blue-600",
        title: "MLA Formatter",
        desc: "Generate properly formatted MLA citations for websites, books, articles, and more. Copy to clipboard instantly.",
        page: "MLAFormatter",
      },
      {
        icon: UserPlus,
        color: "from-sky-600 to-blue-600",
        title: "Friends & Users",
        desc: "Search for other Cognita users, view public profiles, and send or accept friend requests to build your study network.",
        page: "FriendsAndUsers",
      },
      {
        icon: FlaskConical,
        color: "from-teal-600 to-cyan-600",
        title: "Chemistry Equation Balancer",
        desc: "Balance any chemical equation step by step. Enter reactants and products and get a balanced equation instantly.",
        page: "ChemBalance",
      },
      {
        icon: Layers,
        color: "from-indigo-600 to-violet-600",
        title: "Periodic Table",
        desc: "Interactive periodic table with element details, atomic numbers, masses, electron configurations, and properties.",
        page: "PeriodicTable",
      },
      {
        icon: Code2,
        color: "from-slate-600 to-gray-600",
        title: "Code Sandbox",
        desc: "Run JavaScript, Python, and more directly in the browser. Great for practicing coding concepts while studying CS.",
        page: "CodeSandbox",
      },
      {
        icon: Type,
        color: "from-violet-600 to-indigo-600",
        title: "Dyslexia & Accessibility Toolbar",
        desc: "Switch to dyslexia-friendly fonts (OpenDyslexic, Verdana, Comic Sans, Arial), adjust text size, and trigger Read Aloud on any flashcard — all from the toolbar inside every deck.",
        page: null,
      },
      {
        icon: Shield,
        color: "from-blue-600 to-cyan-600",
        title: "Verified Deck Badges",
        desc: "Admins and teachers can award a blue verified badge (✓) to decks they've reviewed for quality. Verified badges appear on deck titles and in public listings.",
        page: "PublicDecks",
      },
    ],
  },
];

export default function About() {
  const [expanded, setExpanded] = useState({ "Core Study Tools": true, "Advanced Practice Modes": true });
  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const toggle = (label) => setExpanded(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="min-h-screen pb-28 px-5 py-12" style={bgStyle}>
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-14">
          <img src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" alt="Cognita" className="w-20 h-20 rounded-3xl object-cover mx-auto mb-6 shadow-lg shadow-violet-500/25" />
          <h1 className="text-4xl font-black tracking-tight mb-3">About Cognita</h1>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={mutedStyle}>
            An AI-powered study platform to help you learn faster, study smarter, and retain more — completely free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✅ 100% Free</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20"><Sparkles className="w-3 h-3" /> AI-Powered</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20"><Shield className="w-3 h-3" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20"><Zap className="w-3 h-3" /> 50+ Features</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">🎓 AI Tutors</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20"><PlayCircle className="w-3 h-3" /> 80+ Courses</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><GraduationCap className="w-3 h-3" /> Classroom</span>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="space-y-6">
          {CATEGORIES.map(({ label, color, features }) => {
            const isOpen = expanded[label] !== false;
            return (
              <div key={label}>
                <button
                  onClick={() => toggle(label)}
                  className="w-full flex items-center justify-between mb-4 group"
                >
                  <h2 className={`font-bold text-sm uppercase tracking-widest ${color}`}>{label}</h2>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} style={mutedStyle} />
                </button>
                {isOpen && (
                  <div className="grid md:grid-cols-2 gap-3">
                    {features.map(({ icon: Icon, color: grad, title, desc, page }) => (
                      <div
                        key={title}
                        className="rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
                        style={cardStyle}
                      >
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mb-4`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-sm mb-1.5">{title}</h3>
                        <p className="text-xs leading-relaxed" style={mutedStyle}>{desc}</p>
                        {page && (
                          <Link to={createPageUrl(page)}>
                            <button className="mt-3 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                              Try it →
                            </button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legal links */}
        <div className="mt-10 rounded-2xl p-5 flex flex-wrap gap-3 justify-center border border-white/5" style={cardStyle}>
          <Link to={createPageUrl("TermsAndConditions")}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 hover:bg-white/5 transition-all">
              <FileText className="w-4 h-4 text-blue-400" /> Terms &amp; Conditions
            </button>
          </Link>
          <Link to={createPageUrl("SecurityPractices")}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 hover:bg-white/5 transition-all">
              <Shield className="w-4 h-4 text-emerald-400" /> Security Practices
            </button>
          </Link>
        </div>

      {/* Bottom CTA */}
        <div className="mt-12 rounded-3xl p-10 text-center bg-gradient-to-br from-violet-600/10 to-blue-600/10 border border-violet-500/20">
          <h2 className="text-2xl font-black mb-2">Ready to study smarter?</h2>
          <p className="text-sm mb-6" style={mutedStyle}>Everything is free. No friction. Just open and start learning.</p>
          <Link to={createPageUrl("Chat")}>
            <button className="px-7 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95">
              Start Studying with AI →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}