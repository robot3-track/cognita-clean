import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Loader2, ChevronRight, Check, X, RotateCcw, Type } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const STOP_WORDS = new Set(['a','an','the','is','are','was','were','be','been','being','of','in','on','to','for','with','by','at','from','and','or','but','that','this','it','as','so']);

function getGameAnswer(back) {
  // Extract key terms by removing stop words, keep up to 2 meaningful words
  const words = back.trim().split(/\s+/);
  const meaningful = words.filter(w => !STOP_WORDS.has(w.toLowerCase().replace(/[^a-z]/g, '')));
  if (meaningful.length === 0) return words.slice(0, 2).join(' ');
  // If answer is already 1-2 words, use as-is
  if (words.length <= 2) return back.trim();
  // Use first 2 meaningful words
  return meaningful.slice(0, 2).join(' ');
}

function scrambleWord(word) {
  const arr = word.trim().split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  return result === word.trim() && word.length > 1 ? scrambleWord(word) : result;
}

export default function WordScramble() {
  const params = new URLSearchParams(window.location.search);
  const deckId = params.get("deck_id");

  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null); // null | "correct" | "wrong"
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [d, c] = await Promise.all([
        db.entities.Deck.filter({ id: deckId }),
        db.entities.Flashcard.filter({ deck_id: deckId }),
      ]);
      const shuffled = [...c].sort(() => Math.random() - 0.5);
      setDeck(d[0] || null);
      setCards(shuffled);
      if (shuffled[0]) setScrambled(scrambleWord(getGameAnswer(shuffled[0].back)));
      setLoading(false);
    };
    if (deckId) load();
  }, [deckId]);

  const currentCard = cards[index];

  const checkAnswer = () => {
    if (!input.trim()) return;
    const correct = input.trim().toLowerCase() === getGameAnswer(currentCard.back).toLowerCase();
    setResult(correct ? "correct" : "wrong");
    if (correct) setScore(s => s + 1);
  };

  const revealAnswer = () => {
    setResult("wrong");
    setShowAnswer(true);
  };

  const next = () => {
    if (index + 1 >= cards.length) {
      setDone(true);
      return;
    }
    const nextCard = cards[index + 1];
    setIndex(i => i + 1);
    setScrambled(scrambleWord(getGameAnswer(nextCard.back)));
    setInput("");
    setResult(null);
    setShowAnswer(false);
    setShowHint(false);
  };

  const restart = () => {
    const reshuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(reshuffled);
    setIndex(0);
    setScrambled(scrambleWord(getGameAnswer(reshuffled[0].back)));
    setInput("");
    setResult(null);
    setScore(0);
    setDone(false);
    setShowAnswer(false);
    setShowHint(false);
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  if (cards.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="text-center">
        <p className="font-semibold mb-4" style={mutedStyle}>No cards in this deck</p>
        <Link to={createPageUrl(`Study?deck_id=${deckId}`)}>
          <button className="px-6 py-3 bg-violet-600 text-white rounded-2xl font-semibold text-sm">← Back to Deck</button>
        </Link>
      </div>
    </div>
  );

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="max-w-sm w-full text-center rounded-3xl p-8" style={cardStyle}>
        <div className="text-5xl font-black text-emerald-400 mb-2">{Math.round((score / cards.length) * 100)}%</div>
        <p className="font-bold text-lg mb-1">{score}/{cards.length} correct</p>
        <p className="text-sm mb-6" style={mutedStyle}>{score === cards.length ? "Perfect score! 🎉" : score >= cards.length * 0.7 ? "Great job!" : "Keep practicing!"}</p>
        <div className="flex flex-col gap-3">
          <button onClick={restart} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-semibold text-sm">
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
          <Link to={createPageUrl(`Study?deck_id=${deckId}`)}>
            <button className="w-full py-3 rounded-2xl font-semibold text-sm" style={cardStyle}>← Back to Deck</button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to={createPageUrl(`Study?deck_id=${deckId}`)}>
            <button className="text-sm font-medium" style={mutedStyle}>← Back</button>
          </Link>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-sm">Word Scramble</span>
          </div>
          <span className="text-sm font-medium" style={mutedStyle}>{index + 1}/{cards.length}</span>
        </div>

        {/* Score bar */}
        <div className="w-full h-1.5 rounded-full mb-6" style={{ background: "var(--app-border)" }}>
          <div className="h-1.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${((index) / cards.length) * 100}%` }} />
        </div>

        {/* Clue */}
        <div className="rounded-3xl p-6 mb-4 text-center" style={cardStyle}>
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={mutedStyle}>Question</p>
          <p className="text-lg font-bold">{currentCard.front}</p>
        </div>

        {/* Scrambled word */}
        <div className="rounded-3xl p-6 mb-4 text-center bg-emerald-500/5 border border-emerald-500/20">
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider text-emerald-400">Unscramble the answer</p>
          <div className="flex flex-wrap justify-center gap-2">
            {scrambled.split("").map((char, i) => (
              <span key={i} className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold text-lg bg-emerald-500/20 text-emerald-300">
                {char === " " ? "·" : char}
              </span>
            ))}
          </div>
          {showHint && (
            <p className="text-xs mt-3 text-amber-400">Hint: starts with <span className="font-bold">"{getGameAnswer(currentCard.back)[0]}"</span></p>
          )}
        </div>

        {/* Input */}
        {result === null ? (
          <div className="mb-4">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && checkAnswer()}
              placeholder="Type the unscrambled answer..."
              autoFocus
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none mb-3"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowHint(h => !h)}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all"
                style={cardStyle}
              >
                💡 Hint
              </button>
              <button
                onClick={revealAnswer}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all text-amber-400"
                style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}
              >
                Show Answer
              </button>
              <button
                onClick={checkAnswer}
                disabled={!input.trim()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white py-3 rounded-2xl font-semibold text-sm transition-all"
              >
                Check
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl p-5 mb-4 text-center ${result === "correct" ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
            {result === "correct" ? (
              <><Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" /><p className="font-bold text-emerald-400">Correct! 🎉</p></>
            ) : (
              <>
                <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="font-bold text-red-400 mb-1">{showAnswer ? "Answer revealed" : "Not quite!"}</p>
                <p className="text-sm" style={mutedStyle}>Answer: <span className="font-semibold text-red-300">{getGameAnswer(currentCard.back)}</span></p>
              </>
            )}
          </div>
        )}

        {result !== null && (
          <button
            onClick={next}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-2xl font-semibold transition-all"
          >
            {index + 1 < cards.length ? <><span>Next</span><ChevronRight className="w-4 h-4" /></> : <><Check className="w-4 h-4" /><span>See Results</span></>}
          </button>
        )}
      </div>
    </div>
  );
}