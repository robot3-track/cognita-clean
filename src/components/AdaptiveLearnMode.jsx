import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";
import { Brain, Check, X, Trophy } from "lucide-react";

import LatexRenderer from "./LatexRenderer";

// Adaptive learn: tracks difficulty, re-shows hard cards more often
export default function AdaptiveLearnMode({ cards, deck, user, onExit }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [scores, setScores] = useState({}); // card.id -> {correct, incorrect}
  const [round, setRound] = useState(1);
  const [done, setDone] = useState(false);
  const [sessionStart] = useState(Date.now());

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  useEffect(() => {
    buildQueue(cards, {});
  }, [cards]);

  const buildQueue = (allCards, currentScores) => {
    // Cards with more incorrect answers appear more often
    const q = [];
    allCards.forEach(c => {
      const s = currentScores[c.id] || { correct: 0, incorrect: 0 };
      const weight = s.incorrect > 0 ? Math.max(1, s.incorrect) : 1;
      if (s.correct < 2) { // need 2 correct to "graduate"
        for (let i = 0; i < weight; i++) q.push(c);
      }
    });
    // Shuffle
    const shuffled = q.sort(() => Math.random() - 0.5);
    if (shuffled.length === 0) {
      setDone(true);
      return;
    }
    setQueue(shuffled);
    setCurrent(shuffled[0]);
    setFlipped(false);
  };

  const answer = async (correct) => {
    if (!current) return;
    const newScores = {
      ...scores,
      [current.id]: {
        correct: (scores[current.id]?.correct || 0) + (correct ? 1 : 0),
        incorrect: (scores[current.id]?.incorrect || 0) + (correct ? 0 : 1),
      }
    };
    setScores(newScores);

    const remaining = queue.slice(1);
    if (remaining.length === 0) {
      // Check if all cards graduated
      const notDone = cards.filter(c => (newScores[c.id]?.correct || 0) < 2);
      if (notDone.length === 0) {
        setDone(true);
        const duration = Math.round((Date.now() - sessionStart) / 60000);
        await db.entities.StudySession.create({
          deck_id: deck.id,
          session_type: "flashcards",
          cards_reviewed: cards.length,
          cards_correct: cards.length,
          duration_minutes: Math.max(1, duration),
          user_email: user?.email || "",
        });
      } else {
        setRound(r => r + 1);
        buildQueue(notDone, newScores);
      }
    } else {
      setQueue(remaining);
      setCurrent(remaining[0]);
      setFlipped(false);
    }
  };

  const mastered = cards.filter(c => (scores[c.id]?.correct || 0) >= 2).length;
  const progress = Math.round((mastered / cards.length) * 100);

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="max-w-sm w-full text-center rounded-3xl p-8" style={cardStyle}>
        <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black mb-2">Mastered!</h2>
        <p className="text-sm mb-2" style={mutedStyle}>You've mastered all {cards.length} cards in {round} round{round !== 1 ? "s" : ""}.</p>
        <button onClick={onExit} className="w-full mt-6 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-2xl font-semibold text-sm">
          Back to Deck
        </button>
      </div>
    </div>
  );

  if (!current) return null;

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="text-sm font-medium" style={mutedStyle}>← Back</button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium" style={mutedStyle}>Round {round} · {mastered}/{cards.length} mastered</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full mb-6 overflow-hidden" style={{ background: "var(--app-surface)" }}>
          <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Brain className="w-4 h-4 text-violet-400" />
          </div>
          <span className="text-sm font-semibold text-violet-400">Adaptive Learn</span>
        </div>

        <div
          onClick={() => setFlipped(f => !f)}
          className="rounded-3xl p-10 min-h-64 flex items-center justify-center cursor-pointer transition-all mb-4 text-center select-none"
          style={cardStyle}
        >
          <p className="text-xl font-semibold leading-relaxed">
            <LatexRenderer text={flipped ? current.back : current.front} />
          </p>
        </div>
        <p className="text-xs text-center mb-6" style={mutedStyle}>{flipped ? "Answer" : "Tap to reveal"}</p>

        {flipped && (
          <div className="flex gap-3">
            <button
              onClick={() => answer(false)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm bg-red-500/15 border border-red-500/30 text-red-400 transition-all hover:bg-red-500/25"
            >
              <X className="w-4 h-4" /> Still Learning
            </button>
            <button
              onClick={() => answer(true)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 transition-all hover:bg-emerald-500/25"
            >
              <Check className="w-4 h-4" /> Got It!
            </button>
          </div>
        )}

        {/* Card stats */}
        {scores[current.id] && (
          <p className="text-xs text-center mt-4" style={mutedStyle}>
            This card: {scores[current.id].correct} correct, {scores[current.id].incorrect} missed
          </p>
        )}
      </div>
    </div>
  );
}