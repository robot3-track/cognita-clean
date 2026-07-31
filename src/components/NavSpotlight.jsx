import { useState } from "react";
import { ChevronRight, ChevronLeft, X, MessageSquare, Layers, Camera, Users, Trophy, Mic, Gamepad2, Brain, Timer, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_SPOTLIGHT_KEY = "cognita_nav_spotlight_done_v2";

const FEATURE_STEPS = [
  {
    emoji: "💬",
    icon: MessageSquare,
    color: "from-violet-600 to-purple-600",
    title: "AI Chat Tutor",
    desc: "Ask any question. The AI explains concepts, helps with homework, and can convert your conversation into flashcards or a quiz in one tap.",
    navGroup: "Study Tools",
  },
  {
    emoji: "📚",
    icon: Layers,
    color: "from-blue-600 to-cyan-600",
    title: "Flashcard Decks",
    desc: "Create decks manually or generate up to 200 cards from any text using AI. Attach files, link decks to chat, and organize into folders.",
    navGroup: "Study Tools",
  },
  {
    emoji: "📷",
    icon: Camera,
    color: "from-rose-600 to-pink-600",
    title: "Scan & Import",
    desc: "Photograph your notes or paste a URL. AI extracts the content and creates flashcards automatically — including Quizlet sets.",
    navGroup: "Study Tools",
  },
  {
    emoji: "🧠",
    icon: Brain,
    color: "from-indigo-600 to-violet-600",
    title: "Smart Study Modes",
    desc: "Spaced Repetition, Write Mode, Adaptive Learning, Checkpoint Quiz — all powered by AI to help you retain more with less time.",
    navGroup: "Study Tools",
  },
  {
    emoji: "🎮",
    icon: Gamepad2,
    color: "from-orange-600 to-red-600",
    title: "Study Games",
    desc: "Play Term Invaders, Block Blasters, Jeopardy, and Matching Game — study while having fun and climbing the leaderboard!",
    navGroup: "Study Tools",
  },
  {
    emoji: "🎧",
    icon: Mic,
    color: "from-purple-600 to-pink-600",
    title: "Audio & Video Lessons",
    desc: "Turn any deck into an AI-narrated audio lesson or animated video. Also includes a live Voice Conversation mode in AI Chat.",
    navGroup: "Study Tools",
  },
  {
    emoji: "⏱️",
    icon: Timer,
    color: "from-amber-600 to-orange-600",
    title: "Focus Tools",
    desc: "Pomodoro timer, Study Roadmap, Brain Dump recorder — all under the Study Tools or Advanced Tools menus.",
    navGroup: "Advanced Tools",
  },
  {
    emoji: "👥",
    icon: Users,
    color: "from-sky-600 to-blue-600",
    title: "Study Groups & Community",
    desc: "Join or create study groups with real-time chat. Browse public decks, compete on leaderboards, and add friends.",
    navGroup: "Community",
  },
  {
    emoji: "🏆",
    icon: Trophy,
    color: "from-amber-500 to-yellow-600",
    title: "Compete & Progress",
    desc: "Track your study time, cards reviewed, quizzes taken, and scores. Compete with friends and build daily streaks.",
    navGroup: "Account",
  },
  {
    emoji: "⚙️",
    icon: Settings,
    color: "from-slate-600 to-gray-600",
    title: "Settings & Account",
    desc: "Customize your theme, set daily study goals, manage notifications, and earn bonus AI credits by completing surveys.",
    navGroup: "Account",
  },
];

export default function NavSpotlight({ onDone }) {
  const [step, setStep] = useState(0);
  const [isMobile] = useState(() => window.innerWidth < 768);

  const current = FEATURE_STEPS[step];
  const isLast = step === FEATURE_STEPS.length - 1;
  const Icon = current?.icon;

  const finish = () => {
    localStorage.setItem(NAV_SPOTLIGHT_KEY, "1");
    onDone?.();
  };

  const next = () => { if (isLast) finish(); else setStep(s => s + 1); };
  const prev = () => { if (step > 0) setStep(s => s - 1); };

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-sm rounded-3xl p-7 relative shadow-2xl"
          style={{ background: "var(--app-surface-solid, #18181b)", border: "1px solid rgba(139,92,246,0.4)" }}
        >
          {/* Close */}
          <button onClick={finish} className="absolute top-4 right-4 opacity-40 hover:opacity-80 transition-all">
            <X className="w-5 h-5" style={{ color: "var(--app-text)" }} />
          </button>

          {/* Header: step counter */}
          <p className="text-[11px] font-bold tracking-widest uppercase mb-4 opacity-40" style={{ color: "var(--app-text)" }}>
            Feature Tour — {step + 1} of {FEATURE_STEPS.length}
          </p>

          {/* Icon */}
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-lg`}>
              {Icon && <Icon className="w-8 h-8 text-white" />}
            </div>
            <span className="absolute -bottom-1 -right-1 text-xl">{current.emoji}</span>
          </div>

          <h2 className="text-xl font-black text-center mb-2" style={{ color: "var(--app-text)" }}>{current.title}</h2>
          <p className="text-sm text-center leading-relaxed mb-2" style={{ color: "var(--app-text-muted)" }}>{current.desc}</p>

          {/* Nav hint */}
          <p className="text-center text-[11px] mb-5 font-semibold" style={{ color: "var(--app-text-muted)", opacity: 0.5 }}>
            {isMobile ? `☰ Hamburger menu → ${current.navGroup}` : `Top nav → "${current.navGroup}"`}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-5">
            {FEATURE_STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)}
                className={`rounded-full transition-all ${i === step ? "w-6 h-2 bg-violet-500" : "w-2 h-2"}`}
                style={{ background: i === step ? undefined : "rgba(255,255,255,0.15)" }}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={prev}
                className="flex items-center gap-1 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--app-text)" }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button onClick={next}
              className="flex-1 flex items-center justify-center gap-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-2xl font-semibold text-sm transition-all">
              {isLast ? "Done! 🎉" : <>Next <ChevronRight className="w-4 h-4" /></>}
            </button>
          </div>

          <button onClick={finish} className="w-full text-center text-xs mt-3 opacity-30 hover:opacity-50 transition-all" style={{ color: "var(--app-text)" }}>
            Skip tour
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}