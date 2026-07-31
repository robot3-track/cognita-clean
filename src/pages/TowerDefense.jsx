import { db } from '@/lib/firebase';

import { useState, useEffect, useRef, useCallback } from "react";

import { useTranslation } from "../hooks/useTranslation";
import { Loader2, Trophy, Play, RotateCcw, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import BlockBlasters from "../components/games/BlockBlasters";
import JeopardyGame from "../components/games/JeopardyGame";

const BACKGROUNDS = [
  { id: "space", label: "🌌 Space", bg: "bg-gradient-to-b from-slate-950 to-indigo-950", track: "rgba(99,102,241,0.3)", enemy: "🛸", hero: "🏰" },
  { id: "forest", label: "🌲 Forest", bg: "bg-gradient-to-b from-green-950 to-emerald-900", track: "rgba(34,197,94,0.3)", enemy: "👾", hero: "🏯" },
  { id: "desert", label: "🏜️ Desert", bg: "bg-gradient-to-b from-amber-900 to-orange-950", track: "rgba(251,191,36,0.3)", enemy: "🦂", hero: "⛩️" },
  { id: "ocean", label: "🌊 Ocean", bg: "bg-gradient-to-b from-blue-950 to-cyan-900", track: "rgba(6,182,212,0.3)", enemy: "🐙", hero: "🗼" },
  { id: "volcano", label: "🌋 Volcano", bg: "bg-gradient-to-b from-red-950 to-orange-900", track: "rgba(239,68,68,0.3)", enemy: "🔥", hero: "🏛️" },
];

// Much slower speeds — old level 1 is now the final level
const LEVEL_CONFIG = [
  { level: 1, speed: 12000, count: 3, label: "Rookie" },
  { level: 2, speed: 10000, count: 4, label: "Apprentice" },
  { level: 3, speed: 8500,  count: 5, label: "Warrior" },
  { level: 4, speed: 7000,  count: 6, label: "Champion" },
  { level: 5, speed: 5500,  count: 7, label: "Master" },
  { level: 6, speed: 4000,  count: 8, label: "Legend" },
  { level: 7, speed: 3000,  count: 9, label: "Mythic" },
  { level: 8, speed: 2200, count: 10, label: "Godlike" },
];

function getConfig(lvl) {
  return LEVEL_CONFIG[Math.min(lvl - 1, LEVEL_CONFIG.length - 1)];
}

const GAME_MODES = [
  {
    id: "invaders",
    emoji: "🛡️",
    title: "Term Invaders",
    desc: "Defend your base — answer before the enemy reaches you!",
    color: "from-violet-600/20 to-indigo-600/20",
    border: "border-violet-500/30",
    accent: "text-violet-400",
  },
  {
    id: "blasters",
    emoji: "💥",
    title: "Block Blasters",
    desc: "Match the answer — blast the correct block before time's up!",
    color: "from-orange-600/20 to-red-600/20",
    border: "border-orange-500/30",
    accent: "text-orange-400",
  },
  {
    id: "jeopardy",
    emoji: "❓",
    title: "Jeopardy",
    desc: "Pick a category & value — answer in the form of a question!",
    color: "from-blue-600/20 to-cyan-600/20",
    border: "border-blue-500/30",
    accent: "text-blue-400",
  },
  {
    id: "matching",
    emoji: "🃏",
    title: "Matching Game",
    desc: "Drag-and-drop terms to their definitions — race against the clock!",
    color: "from-amber-600/20 to-yellow-600/20",
    border: "border-amber-500/30",
    accent: "text-amber-400",
    external: true,
    page: "MatchingGame",
  },
  {
    id: "scramble",
    emoji: "🔀",
    title: "Word Scramble",
    desc: "Unscramble the letters to reveal the correct answer — hints available!",
    color: "from-emerald-600/20 to-teal-600/20",
    border: "border-emerald-500/30",
    accent: "text-emerald-400",
    external: true,
    page: "WordScramble",
  },
];

export default function TowerDefense() {
  const { t } = useTranslation();
  const params = new URLSearchParams(window.location.search);
  const deckIdParam = params.get("deck_id");

  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState(deckIdParam || "");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameMode, setGameMode] = useState(null); // null = hub
  const [gameState, setGameState] = useState("setup");
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [startLevel, setStartLevel] = useState(1);
  const [cardCount, setCardCount] = useState(20);
  const [gameCards, setGameCards] = useState([]);

  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [options, setOptions] = useState([]);
  const [fallingPct, setFallingPct] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [cardsLeft, setCardsLeft] = useState(0);
  const [scores, setScores] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const fallingTimer = useRef(null);
  const fallingStart = useRef(null);
  const cardQueueRef = useRef([]);
  const isAnswering = useRef(false);
  const livesRef = useRef(5);

  useEffect(() => {
    db.auth.me().then(async (me) => {
      setUser(me);
      const d = await db.entities.Deck.list("-updated_date", 50);
      setDecks(d);
      if (!deckIdParam && d.length > 0) setSelectedDeckId(d[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedDeckId) return;
    db.entities.Flashcard.filter({ deck_id: selectedDeckId }).then(c => setCards(c));
  }, [selectedDeckId]);

  useEffect(() => {
    if (!selectedDeckId || gameState !== "leaderboard") return;
    db.entities.TowerDefenseScore.filter({ deck_id: selectedDeckId }).then(s => {
      setScores(s.sort((a, b) => b.score - a.score).slice(0, 10));
    });
  }, [selectedDeckId, gameState]);

  const buildOptions = useCallback((card, allCards) => {
    // Filter out the current card and any cards whose back is identical to the correct answer
    const correctAnswer = card.back.trim();
    const others = allCards.filter(c => c.id !== card.id && c.back.trim() !== correctAnswer);
    // Shuffle and pick up to 3 unique distractors
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
    // Pad with generic fallbacks if not enough unique distractors
    return [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
  }, []);

  const clearFalling = () => {
    if (fallingTimer.current) clearInterval(fallingTimer.current);
    fallingTimer.current = null;
  };

  const showNextCard = useCallback((levelCards, idx, lvl, allCards) => {
    if (idx >= levelCards.length) {
      setLevelComplete(true);
      setCurrentCard(null);
      clearFalling();
      return;
    }
    const card = levelCards[idx];
    setCurrentCard({ card, idx, levelCards, lvl, allCards });
    setOptions(buildOptions(card, allCards));
    setFallingPct(0);
    setFeedback(null);
    isAnswering.current = false;

    clearFalling();
    const cfg = getConfig(lvl);
    fallingStart.current = Date.now();
    fallingTimer.current = setInterval(() => {
      const pct = Math.min(1, (Date.now() - fallingStart.current) / cfg.speed);
      setFallingPct(pct);
      if (pct >= 1 && !isAnswering.current) {
        isAnswering.current = true;
        clearFalling();
        setFeedback({ correct: false });
        const next = livesRef.current - 1;
        livesRef.current = next;
        setLives(next);
        if (next <= 0) {
          setGameState("gameover");
        } else {
          setTimeout(() => {
            setFeedback(null);
            showNextCard(levelCards, idx + 1, lvl, allCards);
          }, 800);
        }
      }
    }, 50);
  }, [buildOptions]);

  const startGame = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, Math.min(cardCount, cards.length));
    setGameCards(shuffled);
    cardQueueRef.current = [...shuffled];
    setLevel(startLevel);
    livesRef.current = 5;
    setLives(5);
    setScore(0);
    setScoreSubmitted(false);
    setGameState("levelIntro");
  };

  const beginLevel = (lvl, queue) => {
    const cfg = getConfig(lvl);
    const levelCards = queue.slice(0, cfg.count);
    cardQueueRef.current = queue.slice(cfg.count);
    setCardsLeft(levelCards.length);
    setGameState("playing");
    isAnswering.current = false;
    showNextCard(levelCards, 0, lvl, cards);
  };

  const handleAnswer = (opt) => {
    if (isAnswering.current || !currentCard) return;
    isAnswering.current = true;
    clearFalling();
    const { card, idx, levelCards, lvl, allCards } = currentCard;
    const correct = opt === card.back;
    setFeedback({ correct });
    if (correct) {
      const timeBonus = Math.round((1 - fallingPct) * 50);
      setScore(prev => prev + 100 + timeBonus);
      setCardsLeft(prev => prev - 1);
    } else {
      const next = livesRef.current - 1;
      livesRef.current = next;
      setLives(next);
      if (next <= 0) {
        setGameState("gameover");
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      showNextCard(levelCards, idx + 1, lvl, allCards);
    }, correct ? 600 : 900);
  };

  useEffect(() => {
    if (levelComplete) {
      const remaining = cardQueueRef.current;
      const nextLvl = level + 1;
      if (remaining.length === 0) {
        setGameState("gameover");
      } else {
        setLevel(nextLvl);
        setGameState("break");
      }
      setLevelComplete(false);
    }
  }, [levelComplete, level]);

  const submitScore = async () => {
    if (!user || scoreSubmitted) return;
    setSubmitting(true);
    const existing = await db.entities.TowerDefenseScore.filter({ deck_id: selectedDeckId });
    const myScore = existing.find(s => s.user_email === user.email);
    const deck = decks.find(d => d.id === selectedDeckId);
    if (myScore) {
      if (score > myScore.score) {
        await db.entities.TowerDefenseScore.update(myScore.id, { score, level_reached: level, cards_used: gameCards.length, deck_title: deck?.title || "" });
      }
    } else {
      await db.entities.TowerDefenseScore.create({
        user_email: user.email, user_name: user.full_name || user.email.split("@")[0],
        deck_id: selectedDeckId, deck_title: deck?.title || "",
        score, level_reached: level, cards_used: gameCards.length,
      });
    }
    setSubmitting(false);
    setScoreSubmitted(true);
  };

  useEffect(() => { return () => clearFalling(); }, []);

  const bgObj = bg;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)" }}>
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  // ── GAME HUB ──
  if (!gameMode) {
    return (
      <div className="min-h-screen px-6 py-10 pb-28" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-1">🎮 Study Games</h1>
            <p className="text-sm" style={{ color: "var(--app-text-muted)" }}>Pick a game mode and a deck to play</p>
          </div>

          {/* Deck picker */}
          <div className="rounded-2xl p-4 mb-6" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--app-text-muted)" }}>Select Deck</p>
            <select value={selectedDeckId} onChange={e => setSelectedDeckId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}>
              {decks.map(d => <option key={d.id} value={d.id}>{d.title} ({d.card_count || 0} cards)</option>)}
            </select>
            {cards.length < 4 && selectedDeckId && (
              <p className="text-xs text-red-400 mt-1">Need at least 4 cards. This deck has {cards.length}.</p>
            )}
          </div>

          {/* Game mode cards */}
          <div className="space-y-3">
            {GAME_MODES.map(mode => {
              const inner = (
                <div className={`w-full flex items-center gap-4 rounded-2xl p-5 text-left transition-all hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r ${mode.color} border ${mode.border} ${cards.length < 4 ? "opacity-40 pointer-events-none" : ""}`}>
                  <span className="text-4xl">{mode.emoji}</span>
                  <div className="flex-1">
                    <p className={`font-black text-base ${mode.accent}`}>{mode.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--app-text-muted)" }}>{mode.desc}</p>
                  </div>
                  <Play className={`w-5 h-5 shrink-0 ${mode.accent}`} />
                </div>
              );
              if (mode.external) {
                return (
                  <Link key={mode.id} to={createPageUrl(`${mode.page}?deck_id=${selectedDeckId}`)}>
                    {inner}
                  </Link>
                );
              }
              return (
                <button key={mode.id} onClick={() => { setGameMode(mode.id); setGameState("setup"); }} disabled={cards.length < 4} className="w-full text-left">
                  {inner}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── BLOCK BLASTERS ──
  if (gameMode === "blasters") {
    return <BlockBlasters cards={cards} decks={decks} selectedDeckId={selectedDeckId} user={user} onExit={() => setGameMode(null)} />;
  }

  // ── JEOPARDY ──
  if (gameMode === "jeopardy") {
    return <JeopardyGame cards={cards} decks={decks} selectedDeckId={selectedDeckId} user={user} onExit={() => setGameMode(null)} />;
  }

  // ── TERM INVADERS ──

  if (gameState === "leaderboard") {
    const deck = decks.find(d => d.id === selectedDeckId);
    return (
      <div className="min-h-screen px-6 py-10" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setGameState("setup")} className="flex items-center gap-1 text-sm mb-6 opacity-60 hover:opacity-100">← {t('back')}</button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-black">{t('leaderboardTitle')}</h1>
              <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>{deck?.title}</p>
            </div>
          </div>
          {scores.length === 0 ? (
            <div className="text-center py-16 rounded-3xl" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm" style={{ color: "var(--app-text-muted)" }}>No scores yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((s, i) => (
                <div key={s.id} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
                  <span className={`text-lg font-black w-8 shrink-0 ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-400" : "opacity-50"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{s.user_name}</p>
                    <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>Level {s.level_reached} · {s.cards_used} cards</p>
                  </div>
                  <span className={`text-sm font-black ${s.user_email === user?.email ? "text-violet-400" : ""}`}>{s.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={startGame} className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white py-4 rounded-2xl font-bold text-sm">
            <Play className="w-4 h-4" /> {t('startGame2')}
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "setup") {
    return (
      <div className="min-h-screen px-6 py-10" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setGameMode(null)} className="flex items-center gap-1 text-sm mb-4 opacity-60 hover:opacity-100">← All Games</button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="text-2xl font-black">{t('termInvaders')}</h1>
              <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>{t('termInvadersDesc')}</p>
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <div className="rounded-2xl p-4" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--app-text-muted)" }}>{t('selectBackground')}</p>
              <div className="grid grid-cols-5 gap-2">
                {BACKGROUNDS.map(b => (
                  <button key={b.id} onClick={() => setBg(b)}
                    className={`py-3 rounded-xl text-lg transition-all ${bg.id === b.id ? "ring-2 ring-violet-500 scale-110" : "opacity-70 hover:opacity-100"}`}
                    style={{ background: "var(--app-bg)" }}>
                    {b.label.split(" ")[0]}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2 font-medium text-violet-400">{bg.label}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--app-text-muted)" }}>{t('selectLevel')}</p>
              <div className="flex flex-wrap gap-2">
                {LEVEL_CONFIG.map(lc => (
                  <button key={lc.level} onClick={() => setStartLevel(lc.level)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${startLevel === lc.level ? "bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/50" : "opacity-60 hover:opacity-100"}`}
                    style={startLevel !== lc.level ? { background: "var(--app-bg)", border: "1px solid var(--app-border)" } : {}}>
                    L{lc.level} {lc.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--app-text-muted)" }}>{t('cardCount')}: <span className="text-violet-400">{Math.min(cardCount, cards.length)}</span></p>
              <input type="range" min={4} max={Math.min(60, Math.max(4, cards.length))} value={cardCount}
                onChange={e => setCardCount(Number(e.target.value))} className="w-full" />
              {cards.length < 4 && <p className="text-xs text-red-400 mt-1">Need at least 4 cards. This deck has {cards.length}.</p>}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setGameState("leaderboard")}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
              <Trophy className="w-4 h-4 text-amber-400" /> {t('viewLeaderboard')}
            </button>
            <button onClick={startGame} disabled={cards.length < 4}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 text-white py-3 rounded-2xl font-bold text-sm transition-all">
              <Play className="w-4 h-4" /> {t('startGame2')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "levelIntro") {
    const lcfg = getConfig(level);
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgObj.bg}`}>
        <div className="text-center text-white max-w-sm px-6">
          <div className="text-8xl mb-4 animate-bounce">{bgObj.hero}</div>
          <h2 className="text-4xl font-black mb-2">{t('level')} {level}</h2>
          <p className="text-lg font-semibold text-white/80 mb-1">{lcfg.label}</p>
          <p className="text-sm text-white/60 mb-8">{lcfg.count} enemies incoming</p>
          <div className="flex gap-2 justify-center mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-2xl ${i < lives ? "" : "opacity-20"}`}>❤️</span>
            ))}
          </div>
          <button onClick={() => beginLevel(level, cardQueueRef.current)}
            className="px-10 py-4 bg-white text-black font-black rounded-2xl text-lg hover:scale-105 transition-all">
            {t('startGame')} →
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "break") {
    const lcfg = getConfig(level);
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgObj.bg}`}>
        <div className="text-center text-white max-w-sm px-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black mb-2">Level {level - 1} Complete!</h2>
          <p className="text-lg text-white/70 mb-2">{t('score')}: <span className="text-amber-400 font-black">{score.toLocaleString()}</span></p>
          <p className="text-sm text-white/50 mb-8">Get ready for Level {level} — {lcfg.label}</p>
          <div className="flex gap-2 justify-center mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-2xl ${i < lives ? "" : "opacity-20"}`}>❤️</span>
            ))}
          </div>
          <button onClick={() => setGameState("levelIntro")}
            className="px-10 py-4 bg-white text-black font-black rounded-2xl text-lg hover:scale-105 transition-all">
            Next Level →
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "gameover") {
    const victory = lives > 0;
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 ${bgObj.bg}`}>
        <div className="w-full max-w-sm text-center text-white">
          <div className="text-7xl mb-4">{victory ? "🏆" : "💀"}</div>
          <h2 className="text-3xl font-black mb-2">{victory ? "Victory!" : t('gameOver')}</h2>
          <p className="text-white/70 mb-1">{t('level')}: <span className="font-bold">{level}</span></p>
          <div className="text-5xl font-black text-amber-400 mb-6">{score.toLocaleString()}</div>
          <div className="flex gap-2 justify-center mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-2xl ${i < lives ? "" : "opacity-20"}`}>❤️</span>
            ))}
          </div>
          <div className="space-y-3">
            {!scoreSubmitted ? (
              <button onClick={submitScore} disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-4 rounded-2xl text-sm transition-all">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
                {t('submitScore')}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold py-3">✓ {t('newHighScore')}</div>
            )}
            <button onClick={() => setGameState("leaderboard")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-amber-400"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <Trophy className="w-4 h-4" /> {t('viewLeaderboard')}
            </button>
            <button onClick={startGame}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-2xl font-semibold text-sm transition-all">
              <RotateCcw className="w-4 h-4" /> {t('playAgain')}
            </button>
            <button onClick={() => { setGameMode(null); setGameState("setup"); }}
              className="w-full py-3 rounded-2xl font-semibold text-sm text-white/50 hover:text-white/80 transition-all">
              ← All Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PLAYING
  const progressPct = gameCards.length > 0 ? (gameCards.length - cardQueueRef.current.length) / gameCards.length : 0;
  const cfg = getConfig(level);

  return (
    <div className={`min-h-screen flex flex-col select-none ${bgObj.bg}`}>
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { clearFalling(); setGameMode(null); setGameState("setup"); }} className="text-white/60 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-base ${i < lives ? "" : "opacity-20"}`}>❤️</span>
            ))}
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/60">{t('level')} {level} · {cfg.label}</p>
          <p className="text-white font-black text-sm">{score.toLocaleString()} pts</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">{cardsLeft} left</p>
          <div className="w-16 h-1.5 rounded-full bg-white/20 mt-0.5">
            <div className="h-full bg-violet-400 rounded-full transition-all" style={{ width: `${progressPct * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-full h-20 rounded-full" style={{ background: bgObj.track, filter: "blur(20px)" }} />
        </div>
        {currentCard && (
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ top: `${fallingPct * 55}%`, zIndex: 10 }}>
            <span className="text-5xl drop-shadow-lg">{bgObj.enemy}</span>
            <div className="mt-2 px-4 py-2 rounded-2xl max-w-[200px] text-center text-sm font-bold text-white shadow-xl"
              style={{ background: "rgba(0,0,0,0.7)", border: `1px solid ${bgObj.track}` }}>
              {currentCard.card.front}
            </div>
          </div>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-5xl drop-shadow-lg">{bgObj.hero}</span>
          {currentCard && (
            <div className="mt-2 w-32 h-2 rounded-full bg-white/20 overflow-hidden">
              <div className={`h-full rounded-full transition-none ${fallingPct > 0.7 ? "bg-red-500" : fallingPct > 0.4 ? "bg-amber-400" : "bg-emerald-400"}`}
                style={{ width: `${fallingPct * 100}%` }} />
            </div>
          )}
        </div>
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className={`text-6xl font-black animate-bounce ${feedback.correct ? "text-emerald-400" : "text-red-500"}`}>
              {feedback.correct ? "✓" : "✗"}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}>
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt)}
              className={`py-3 px-3 rounded-2xl text-xs font-semibold text-white text-center transition-all leading-snug
                ${feedback ? (opt === currentCard?.card.back ? "bg-emerald-600 ring-2 ring-emerald-400" : "bg-white/10") : "bg-white/15 hover:bg-white/25"}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}