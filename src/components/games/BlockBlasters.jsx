import { useState, useEffect, useRef } from "react";
import { X, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const ROUND_TIME = 20; // seconds per question

export default function BlockBlasters({ cards, onExit }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [feedback, setFeedback] = useState(null); // { idx, correct }
  const [gameOver, setGameOver] = useState(false);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);

  const buildOptions = (card, allCards) => {
    const correctAnswer = card.back.trim();
    const others = allCards.filter(c => c.id !== card.id && c.back.trim() !== correctAnswer);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    const distractors = [];
    const seen = new Set([correctAnswer.toLowerCase()]);
    for (const c of shuffled) {
      const val = c.back.trim();
      if (!seen.has(val.toLowerCase())) {
        seen.add(val.toLowerCase());
        distractors.push(val);
      }
      if (distractors.length >= 3) break;
    }
    return [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
  };

  const nextCard = (remaining, allCards) => {
    if (remaining.length === 0) { setGameOver(true); return; }
    const [card, ...rest] = remaining;
    setQueue(rest);
    setCurrent(card);
    setOptions(buildOptions(card, allCards));
    setTimeLeft(ROUND_TIME);
    setFeedback(null);
    setAnswered(false);
  };

  useEffect(() => {
    if (cards.length < 4) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    nextCard(shuffled, cards);
  }, []);

  useEffect(() => {
    if (gameOver || answered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setFeedback({ idx: -1, correct: false });
          setAnswered(true);
          setStreak(0);
          setTimeout(() => nextCard(queue, cards), 1200);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, answered, gameOver]);

  const handleAnswer = (opt, idx) => {
    if (answered || !current) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    const correct = opt === current.back;
    setFeedback({ idx, correct });
    if (correct) {
      const timeBonus = Math.round((timeLeft / ROUND_TIME) * 100);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const streakBonus = newStreak >= 3 ? 50 : 0;
      setScore(s => s + 100 + timeBonus + streakBonus);
    } else {
      setStreak(0);
    }
    setTimeout(() => nextCard(queue, cards), 1200);
  };

  const timePct = timeLeft / ROUND_TIME;
  const timerColor = timePct > 0.5 ? "bg-emerald-500" : timePct > 0.25 ? "bg-amber-500" : "bg-red-500";

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
        <div className="text-center max-w-sm w-full">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-3xl font-black mb-2">Block Blasters Done!</h2>
          <p className="text-5xl font-black text-orange-400 mb-2">{score.toLocaleString()}</p>
          <p className="text-sm mb-8" style={{ color: "var(--app-text-muted)" }}>Best streak: {streak} 🔥</p>
          <div className="space-y-3">
            <button onClick={() => {
              const shuffled = [...cards].sort(() => Math.random() - 0.5);
              setScore(0); setStreak(0); setGameOver(false);
              nextCard(shuffled, cards);
            }} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold">
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
            <button onClick={onExit} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>← All Games</button>
          </div>
        </div>
      </div>
    );
  }

  if (!current) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)" }}>
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 50%, #1a0a00 100%)", color: "white" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
        <button onClick={onExit} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        <div className="text-center">
          <p className="text-xs text-white/60">Block Blasters 💥</p>
          <p className="text-white font-black">{score.toLocaleString()} pts</p>
        </div>
        <div className="flex items-center gap-1 text-orange-400 font-bold text-sm">
          🔥 {streak}
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-white/10">
        <div className={`h-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timePct * 100}%` }} />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center">
          <p className="text-xs text-white/50 mb-2 font-semibold uppercase tracking-widest">What does this mean?</p>
          <div className="rounded-3xl px-8 py-6 text-center text-xl font-black shadow-2xl" style={{ background: "rgba(255,100,0,0.15)", border: "1px solid rgba(255,100,0,0.4)" }}>
            {current.front}
          </div>
          <p className="text-sm text-white/40 mt-2">{timeLeft}s</p>
        </div>

        {/* Answer blocks */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {options.map((opt, i) => {
            const isFeedback = feedback !== null;
            const isCorrect = opt === current.back;
            const wasSelected = feedback?.idx === i;
            let blockStyle = "bg-white/10 hover:bg-white/20 border-white/20";
            if (isFeedback && isCorrect) blockStyle = "bg-emerald-600/80 border-emerald-400";
            else if (isFeedback && wasSelected && !isCorrect) blockStyle = "bg-red-600/80 border-red-400";
            else if (isFeedback) blockStyle = "bg-white/5 border-white/10 opacity-50";

            return (
              <motion.button
                key={i}
                onClick={() => handleAnswer(opt, i)}
                whileTap={{ scale: 0.95 }}
                className={`rounded-2xl p-4 text-sm font-semibold text-center leading-snug border transition-all ${blockStyle}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 text-center text-xs text-white/30">
        {cards.length - queue.length - 1} / {cards.length} cards
      </div>
    </div>
  );
}