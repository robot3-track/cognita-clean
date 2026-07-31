import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import { PenLine, ChevronRight, Check, X, Loader2 } from "lucide-react";
import DeckPicker from "@/components/DeckPicker";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LatexRenderer from "@/components/LatexRenderer";
import confetti from "canvas-confetti";
import LanguageKeyboard, { detectLanguage } from "@/components/LanguageKeyboard";

const STOP = new Set(["the","a","an","is","are","was","were","be","been","have","has","had","do","does","did","will","would","could","should","to","of","in","for","on","with","at","by","from","as","that","this","it","not","but","and","or"]);

function checkSimilarity(userAnswer, correctAnswer) {
  const norm = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  const ua = norm(userAnswer);
  const ca = norm(correctAnswer);
  if (!ua) return false;
  if (ua === ca) return true;
  if (ca.length > 3 && (ca.includes(ua) || ua.includes(ca))) return true;
  const caWords = ca.split(/\s+/).filter(w => w.length > 2 && !STOP.has(w));
  const uaSet = new Set(ua.split(/\s+/));
  if (caWords.length === 0) return false;
  const matched = caWords.filter(w => uaSet.has(w) || ua.includes(w));
  return matched.length / caWords.length >= 0.6;
}

export default function WriteMode() {
  const params = new URLSearchParams(window.location.search);
  const deckId = params.get("deck_id");

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null); // null | "correct" | "incorrect"
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!deckId) return;
    Promise.all([
      db.entities.Deck.filter({ id: deckId }),
      db.entities.Flashcard.filter({ deck_id: deckId }),
    ]).then(([d, c]) => {
      setDeck(d[0]);
      setCards(c.sort(() => Math.random() - 0.5));
      setLoading(false);
    });
  }, [deckId]);

  const submit = () => {
    if (!answer.trim()) return;
    const card = cards[currentIndex];
    const correct = checkSimilarity(answer, card.back);
    setResult(correct ? "correct" : "incorrect");
    setShowAnswer(true);
    if (correct) {
      setScore(s => s + 1);
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    }
  };

  const next = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(i => i + 1);
      setAnswer("");
      setResult(null);
      setShowAnswer(false);
    } else {
      setDone(true);
      const pct = score / cards.length;
      if (pct >= 0.8) confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (loading && deckId) return <div className="min-h-screen flex items-center justify-center" style={bgStyle}><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>;
  if (!deckId) return <DeckPicker targetPage="WriteMode" title="Write Mode" />;
  if (!loading && cards.length === 0) return <div className="min-h-screen flex items-center justify-center" style={bgStyle}><p style={mutedStyle}>No cards found. <Link to={createPageUrl("Decks")} className="text-violet-400">Go to Decks</Link></p></div>;

  if (done) {
    const pct = Math.round((score / cards.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
        <div className="max-w-sm w-full text-center rounded-3xl p-8" style={cardStyle}>
          <div className="text-5xl font-black mb-2 text-violet-400">{pct}%</div>
          <p className="text-lg font-bold mb-1">{score}/{cards.length} correct</p>
          <p className="text-sm mb-2" style={mutedStyle}>{pct >= 80 ? "🎉 Excellent work!" : pct >= 60 ? "👍 Good effort! Keep practicing." : "📚 Keep studying — you'll get there!"}</p>
          <p className="text-xs mb-6 italic" style={mutedStyle}>Semantic matching was used — conceptual understanding matters more than exact spelling.</p>
          <div className="flex gap-3">
            <Link to={createPageUrl(`Study?deck_id=${deckId}`)} className="flex-1">
              <button className="w-full py-3 rounded-2xl text-sm font-semibold" style={cardStyle}>← Back</button>
            </Link>
            <button onClick={() => { setCurrentIndex(0); setAnswer(""); setResult(null); setShowAnswer(false); setScore(0); setDone(false); setCards(c => [...c].sort(() => Math.random() - 0.5)); }}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-2xl text-sm font-semibold transition-all">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];
  const detectedLang = detectLanguage(card?.back);

  const handleKey = (char) => {
    setAnswer(prev => prev + char);
    inputRef.current?.focus();
  };
  const handleBackspace = () => {
    setAnswer(prev => prev.slice(0, -1));
    inputRef.current?.focus();
  };
  const handleSpace = () => {
    setAnswer(prev => prev + " ");
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl(`Study?deck_id=${deckId}`)}><button className="text-sm font-medium" style={mutedStyle}>← Back</button></Link>
          <span className="text-sm" style={mutedStyle}>{currentIndex + 1}/{cards.length} · {score} correct</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-pink-500/15 flex items-center justify-center">
            <PenLine className="w-4 h-4 text-pink-400" />
          </div>
          <h1 className="font-black text-lg">Write Mode</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 ml-auto">Semantic AI Matching</span>
        </div>

        <div className="rounded-3xl p-8 min-h-40 flex items-center justify-center text-center mb-5" style={cardStyle}>
          <p className="text-xl font-semibold"><LatexRenderer text={card.front} /></p>
        </div>

        <input
          ref={inputRef}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !showAnswer && submit()}
          placeholder="Type your answer..."
          disabled={showAnswer}
          className={`w-full px-4 py-4 rounded-2xl text-sm outline-none mb-4 transition-all ${result === "correct" ? "border-2 border-emerald-500/50 bg-emerald-500/5" : result === "incorrect" ? "border-2 border-red-500/50 bg-red-500/5" : ""}`}
          style={{ background: "var(--app-surface)", border: result ? "" : "1px solid var(--app-border)", color: "var(--app-text)" }}
          autoFocus
        />

        {detectedLang && !showAnswer && (
          <LanguageKeyboard
            lang={detectedLang}
            onKey={handleKey}
            onBackspace={handleBackspace}
            onSpace={handleSpace}
          />
        )}

        {showAnswer && (
          <div className={`rounded-2xl p-4 mb-4 ${result === "correct" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
            <div className="flex items-center gap-2 mb-2">
              {result === "correct" ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
              <span className={`text-sm font-bold ${result === "correct" ? "text-emerald-400" : "text-red-400"}`}>
                {result === "correct" ? "Correct!" : "Not quite"}
              </span>
            </div>
            <p className="text-xs" style={mutedStyle}>Correct answer: <span className="font-semibold" style={{ color: "var(--app-text)" }}><LatexRenderer text={card.back} /></span></p>
          </div>
        )}

        {!showAnswer ? (
          <button onClick={submit} disabled={!answer.trim()} className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-4 rounded-2xl font-semibold transition-all">
            Check Answer
          </button>
        ) : (
          <button onClick={next} className="w-full bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all">
            {currentIndex < cards.length - 1 ? <><span>Next Card</span><ChevronRight className="w-4 h-4" /></> : <><Check className="w-4 h-4" /><span>Finish</span></>}
          </button>
        )}
      </div>
    </div>
  );
}