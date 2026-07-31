import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles, Layers, MessageSquare, Brain, Trophy, GraduationCap, CalendarDays, Gamepad2, ClipboardList, Camera, Timer, Globe, Mic, PlayCircle, NotebookPen } from "lucide-react";
import NavSpotlight from "./NavSpotlight";

const TUTORIAL_KEY = "cognita_tutorial_done_v2";
const ACCOUNT_TYPE_KEY = "cognita_account_type";

const studentSteps = [
  {
    icon: Sparkles,
    color: "from-violet-600 to-purple-600",
    emoji: "🎉",
    title: "Welcome to Cognita!",
    desc: "Your AI-powered study platform. Let's take a quick tour of everything available to you.",
  },
  {
    icon: Layers,
    color: "from-blue-600 to-cyan-600",
    emoji: "📚",
    title: "Flashcard Decks",
    desc: "Create decks manually, scan a photo of your notes, or let AI instantly generate cards from any text or uploaded file.",
  },
  {
    icon: MessageSquare,
    color: "from-violet-600 to-indigo-600",
    emoji: "🤖",
    title: "AI Chat Tutor",
    desc: "Ask anything — the AI explains concepts, solves problems, and converts your conversation into flashcards or a quiz with one click.",
  },
  {
    icon: Brain,
    color: "from-pink-600 to-rose-600",
    emoji: "🧠",
    title: "Smart Study Modes",
    desc: "Flashcards, Write Mode, Adaptive Learning, Spaced Repetition, Checkpoint Quiz, and AI-generated Practice Tests — all in one place.",
  },
  {
    icon: ClipboardList,
    color: "from-violet-600 to-fuchsia-600",
    emoji: "📝",
    title: "AI Practice Tests",
    desc: "Generate full tests with multiple choice, true/false, matching, and written questions — then export them as printable PDFs with an answer key!",
  },
  {
    icon: Gamepad2,
    color: "from-orange-600 to-red-600",
    emoji: "🎮",
    title: "Study Games",
    desc: "Play Term Invaders, Block Blasters, Jeopardy, Matching Game, and Word Scramble — study while having fun and climbing the leaderboard!",
  },
  {
    icon: CalendarDays,
    color: "from-blue-600 to-sky-600",
    emoji: "📅",
    title: "Study Roadmap + Calendar",
    desc: "Enter your exam date and AI builds a personalized day-by-day plan. Track it on the built-in calendar and add your own events.",
  },
  {
    icon: Mic,
    color: "from-purple-600 to-pink-600",
    emoji: "🎧",
    title: "Audio & Video Lessons",
    desc: "Turn any deck or text into an AI-narrated audio lesson or animated video — perfect for studying on the go.",
  },
  {
    icon: PlayCircle,
    color: "from-green-600 to-emerald-600",
    emoji: "🎬",
    title: "Video Courses",
    desc: "80+ structured courses across Programming, AP, Engineering, and more. Watch lessons, pass AI quizzes (80% required), and earn certificates you can share.",
  },
  {
    icon: NotebookPen,
    color: "from-purple-600 to-violet-600",
    emoji: "📝",
    title: "Notes + More Tools",
    desc: "Write and organize study notes in a built-in rich-text editor. Plus: AP Tips, Calculator, Dictionary, and more — all without leaving the app. You're all set!",
  },
];

const teacherSteps = [
  {
    icon: Sparkles,
    color: "from-violet-600 to-purple-600",
    emoji: "👋",
    title: "Welcome, Teacher!",
    desc: "Cognita helps you create engaging learning materials, run live classroom activities, and export ready-to-print tests.",
  },
  {
    icon: Layers,
    color: "from-blue-600 to-cyan-600",
    emoji: "📚",
    title: "Create & Share Decks",
    desc: "Build flashcard decks and mark them as public to share with students. AI can generate an entire deck from a document in seconds.",
  },
  {
    icon: Camera,
    color: "from-rose-600 to-pink-600",
    emoji: "📷",
    title: "Scan & Import",
    desc: "Photograph a worksheet, textbook page, or whiteboard — Cognita extracts the content and turns it into flashcards automatically.",
  },
  {
    icon: ClipboardList,
    color: "from-violet-600 to-fuchsia-600",
    emoji: "📝",
    title: "AI Practice Tests + PDF Export",
    desc: "Generate multi-format tests (MCQ, T/F, matching, written) from any deck and export them as printable PDFs with a full answer key.",
  },
  {
    icon: GraduationCap,
    color: "from-emerald-600 to-teal-600",
    emoji: "🏫",
    title: "Classroom Mode",
    desc: "Create a class, share a join code with students, assign decks, and run live multiplayer Kahoot-style quiz games in real time.",
  },
  {
    icon: Globe,
    color: "from-sky-600 to-blue-600",
    emoji: "🌐",
    title: "Resource Hub",
    desc: "Upload and share study files (PDFs, images, videos) with your class or the whole community. Browse what others have shared too.",
  },
  {
    icon: PlayCircle,
    color: "from-green-600 to-emerald-600",
    emoji: "🎬",
    title: "Courses & Certificates",
    desc: "80+ video courses across programming, AP subjects, and engineering. Students can complete courses, earn certificates, and even rate course content.",
  },
  {
    icon: Trophy,
    color: "from-amber-600 to-orange-600",
    emoji: "🏆",
    title: "Live Games & Progress",
    desc: "Host Term Invaders or Jeopardy games in class. Track engagement and keep students motivated. You're ready to go!",
  },
];

const personalSteps = [
  {
    icon: Sparkles,
    color: "from-violet-600 to-purple-600",
    emoji: "🎉",
    title: "Welcome to Cognita!",
    desc: "Your personal AI-powered learning companion. Here's a quick look at what you can do.",
  },
  {
    icon: Layers,
    color: "from-blue-600 to-cyan-600",
    emoji: "📚",
    title: "Build Knowledge Decks",
    desc: "Create flashcard decks on any topic — languages, hobbies, professional skills. AI generates cards from any text or file instantly.",
  },
  {
    icon: MessageSquare,
    color: "from-violet-600 to-indigo-600",
    emoji: "🤖",
    title: "Chat with AI",
    desc: "Ask questions, explore ideas, and convert conversations into structured flashcards or quizzes in one click.",
  },
  {
    icon: Brain,
    color: "from-pink-600 to-rose-600",
    emoji: "🧠",
    title: "Study Smarter",
    desc: "Use Spaced Repetition to retain information long-term, set Pomodoro focus sessions, and follow an AI-built study roadmap.",
  },
  {
    icon: Mic,
    color: "from-purple-600 to-pink-600",
    emoji: "🎧",
    title: "Audio Lessons & Media",
    desc: "Turn any deck into an AI-narrated podcast-style lesson or animated video — listen while commuting or working out.",
  },
  {
    icon: Timer,
    color: "from-orange-600 to-red-600",
    emoji: "⏱️",
    title: "Focus Tools",
    desc: "Pomodoro timer, Brain Dump voice recorder, and a study calendar help you stay on track and capture ideas instantly.",
  },
  {
    icon: PlayCircle,
    color: "from-green-600 to-emerald-600",
    emoji: "🎬",
    title: "Video Courses & Notes",
    desc: "80+ structured video courses across coding, AP subjects, and more — with AI quizzes and certificates. Plus a built-in notes editor to capture ideas as you learn.",
  },
  {
    icon: Trophy,
    color: "from-amber-600 to-orange-600",
    emoji: "🏆",
    title: "Track Progress & Community",
    desc: "View study stats, join study groups for accountability, compete on leaderboards, and explore the community's public decks. Enjoy!",
  },
];

const NAV_SPOTLIGHT_KEY = "cognita_nav_spotlight_done_v2";

export default function TutorialModal() {
  const [phase, setPhase] = useState("type");
  const [accountType, setAccountType] = useState(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Tutorial permanently disabled — mark as done for any user who hasn't seen it
    localStorage.setItem(TUTORIAL_KEY, "1");
    // Never show
  }, []);

  const dismiss = () => {
    localStorage.setItem(TUTORIAL_KEY, "1");
    if (accountType) localStorage.setItem(ACCOUNT_TYPE_KEY, accountType);
    // Go to nav spotlight instead of closing entirely
    setPhase("spotlight");
  };

  const finishAll = () => {
    setVisible(false);
  };

  const selectType = (type) => {
    setAccountType(type);
    localStorage.setItem(ACCOUNT_TYPE_KEY, type);
    setPhase("tour");
  };

  if (!visible) return null;

  // Phase 3: nav spotlight
  if (phase === "spotlight") {
    return <NavSpotlight onDone={finishAll} />;
  }

  // Phase 1: ask account type
  if (phase === "type") {
    return (
      <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
        <div className="w-full max-w-sm rounded-3xl p-8 relative" style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }}>
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black text-center mb-2" style={{ color: "var(--app-text)" }}>Welcome to Cognita! 🎉</h2>
          <p className="text-sm text-center mb-6 leading-relaxed" style={{ color: "var(--app-text-muted)" }}>
            How will you be using Cognita? We'll personalize your tutorial.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => selectType("student")}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.35)", color: "var(--app-text)" }}
            >
              <span className="text-2xl">🎓</span>
              <div className="text-left">
                <p className="font-bold">Student</p>
                <p className="text-xs opacity-60 font-normal">Study smarter, ace exams</p>
              </div>
            </button>
            <button
              onClick={() => selectType("teacher")}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)", color: "var(--app-text)" }}
            >
              <span className="text-2xl">🏫</span>
              <div className="text-left">
                <p className="font-bold">Teacher</p>
                <p className="text-xs opacity-60 font-normal">Create classes & run games</p>
              </div>
            </button>
            <button
              onClick={() => selectType("personal")}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.35)", color: "var(--app-text)" }}
            >
              <span className="text-2xl">💡</span>
              <div className="text-left">
                <p className="font-bold">Personal Learning</p>
                <p className="text-xs opacity-60 font-normal">Skills, hobbies, curiosity</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase 2: tour based on account type
  const steps = accountType === "teacher" ? teacherSteps : accountType === "personal" ? personalSteps : studentSteps;
  const { icon: Icon, color, title, desc, emoji } = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-sm rounded-3xl p-8 relative" style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }}>
        <button onClick={dismiss} className="absolute top-4 right-4 opacity-40 hover:opacity-80 transition-all" style={{ color: "var(--app-text)" }}>
          <X className="w-5 h-5" />
        </button>
        <div className="relative w-16 h-16 mx-auto mb-5">
          <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          {emoji && <span className="absolute -bottom-1 -right-1 text-xl">{emoji}</span>}
        </div>
        <h2 className="text-xl font-black text-center mb-2" style={{ color: "var(--app-text)" }}>{title}</h2>
        <p className="text-sm text-center mb-6 leading-relaxed" style={{ color: "var(--app-text-muted)" }}>{desc}</p>
        <div className="flex justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`rounded-full transition-all ${i === step ? "w-6 h-2 bg-violet-500" : "w-2 h-2 hover:opacity-60"}`}
              style={{ background: i === step ? undefined : "var(--app-text-muted)", opacity: i === step ? 1 : 0.3 }} />
          ))}
        </div>
        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          {!isLast ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex-1 flex items-center justify-center gap-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-2xl font-semibold text-sm transition-all">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={dismiss}
              className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 rounded-2xl font-semibold text-sm transition-all">
              Let's Go! 🚀
            </button>
          )}
        </div>
        <button onClick={finishAll} className="w-full text-center text-xs mt-3 opacity-40 hover:opacity-60 transition-all" style={{ color: "var(--app-text)" }}>
          Skip tutorial
        </button>
      </div>
    </div>
  );
}