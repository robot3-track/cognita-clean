import { useState, useEffect } from "react";

const FEATURES = [
  {
    emoji: "🧠",
    gradient: "from-violet-600/25 to-purple-600/25",
    border: "border-violet-500/30",
    title: "Adaptive Learn Mode",
    desc: "Hard cards appear more often until you master them",
    page: "Decks",
    darkAccent: "text-violet-300",
    lightAccent: "text-violet-700",
  },
  {
    emoji: "🛡️",
    gradient: "from-red-600/25 to-orange-600/25",
    border: "border-red-500/30",
    title: "Term Invaders",
    desc: "Tower-defense vocabulary game — type fast to defend!",
    page: "TowerDefense",
    darkAccent: "text-orange-300",
    lightAccent: "text-orange-700",
  },
  {
    emoji: "📋",
    gradient: "from-indigo-600/25 to-blue-600/25",
    border: "border-indigo-500/30",
    title: "AP Test Prep",
    desc: "FRQ grader, MCQ practice & full AP exam simulator",
    page: "APTesting",
    darkAccent: "text-blue-300",
    lightAccent: "text-blue-700",
  },
  {
    emoji: "🎙️",
    gradient: "from-pink-600/25 to-rose-600/25",
    border: "border-pink-500/30",
    title: "Voice Brain Dump",
    desc: "Speak your notes — AI turns them into flashcards",
    page: "BrainDump",
    darkAccent: "text-pink-300",
    lightAccent: "text-pink-700",
  },
  {
    emoji: "⏱️",
    gradient: "from-orange-600/25 to-amber-600/25",
    border: "border-orange-500/30",
    title: "Group Pomodoro",
    desc: "Focus alongside friends in real-time study sessions",
    page: "Pomodoro",
    darkAccent: "text-amber-300",
    lightAccent: "text-amber-700",
  },
  {
    emoji: "🔁",
    gradient: "from-emerald-600/25 to-teal-600/25",
    border: "border-emerald-500/30",
    title: "Spaced Repetition",
    desc: "SM-2 algorithm schedules reviews so you never forget",
    page: "SpacedRepetition",
    darkAccent: "text-emerald-300",
    lightAccent: "text-emerald-700",
  },
  {
    emoji: "🎁",
    gradient: "from-violet-600/25 to-blue-600/25",
    border: "border-violet-500/30",
    title: "Earn Free AI Credits",
    desc: "Complete surveys via CPX Research → earn AI uses",
    page: "Surveys",
    darkAccent: "text-violet-300",
    lightAccent: "text-violet-700",
  },
];

function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export default function SurveyBanner() {
  return null;
}