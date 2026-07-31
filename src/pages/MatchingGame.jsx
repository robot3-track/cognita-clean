import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import { Loader2, RotateCcw, Trophy, ArrowLeft, Timer, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MatchingGame() {
  const params = new URLSearchParams(window.location.search);
  const deckId = params.get("deck_id");

  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);
  const lockRef = useRef(false);

  useEffect(() => {
    if (!deckId) { setLoading(false); return; }
    const load = async () => {
      const [d, c] = await Promise.all([
        db.entities.Deck.filter({ id: deckId }),
        db.entities.Flashcard.filter({ deck_id: deckId }),
      ]);
      setDeck(d[0] || null);
      setCards(c);
      setLoading(false);
    };
    load();
    return () => clearInterval(timerRef.current);
  }, [deckId]);

  const startGame = () => {
    // Take up to 8 cards for a 4x4 grid (16 tiles)
    const selected = cards.slice(0, 8);
    const gameTiles = [];
    selected.forEach((card, i) => {
      gameTiles.push({ id: `f-${i}`, text: card.front, pairId: i, type: "front" });
      gameTiles.push({ id: `b-${i}`, text: card.back, pairId: i, type: "back" });
    });
    // Shuffle
    for (let i = gameTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameTiles[i], gameTiles[j]] = [gameTiles[j], gameTiles[i]];
    }
    setTiles(gameTiles);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setTimer(0);
    setStarted(true);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  };

  const handleTileClick = (index) => {
    if (lockRef.current) return;
    if (flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      lockRef.current = true;
      const [a, b] = newFlipped;
      if (tiles[a].pairId === tiles[b].pairId) {
        // Match!
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setFlipped([]);
        lockRef.current = false;
        if (newMatched.length === tiles.length) {
          setGameWon(true);
          clearInterval(timerRef.current);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  if (!deck || cards.length < 2) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={bgStyle}>
      <p className="font-bold text-lg mb-2">Choose a deck to play</p>
      <p className="text-sm mb-6" style={mutedStyle}>Browse public decks and pick one to start a matching game.</p>
      <Link to={createPageUrl("PublicDecks")}>
        <button className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">Browse Decks</button>
      </Link>
    </div>
  );

  if (gameWon) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="max-w-sm w-full text-center rounded-3xl p-8" style={cardStyle}>
        <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black mb-2">You Won!</h2>
        <p className="text-sm mb-1" style={mutedStyle}>Completed in {moves} moves</p>
        <p className="text-sm mb-6" style={mutedStyle}>Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</p>
        <div className="flex gap-3">
          <button onClick={startGame} className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-2xl font-semibold text-sm transition-all">
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
          <Link to={createPageUrl(`Study?deck_id=${deckId}`)} className="flex-1">
            <button className="w-full py-3 rounded-2xl font-semibold text-sm" style={cardStyle}>Back to Deck</button>
          </Link>
        </div>
      </div>
    </div>
  );

  if (!started) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="max-w-sm w-full text-center rounded-3xl p-8" style={cardStyle}>
        <Zap className="w-12 h-12 text-violet-400 mx-auto mb-4" />
        <h2 className="text-xl font-black mb-2">Matching Game</h2>
        <p className="font-semibold text-sm mb-1">{deck.title}</p>
        <p className="text-sm mb-6" style={mutedStyle}>Match flashcard fronts with their backs!</p>
        <button onClick={startGame} className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white py-3 rounded-2xl font-semibold text-sm transition-all">
          Start Game
        </button>
        <Link to={createPageUrl(`Study?deck_id=${deckId}`)} className="block mt-3">
          <button className="w-full py-3 rounded-2xl font-semibold text-sm" style={cardStyle}>
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to Deck
          </button>
        </Link>
      </div>
    </div>
  );

  const cols = tiles.length <= 8 ? 2 : tiles.length <= 12 ? 3 : 4;

  return (
    <div className="min-h-screen pb-28 px-4 py-6" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link to={createPageUrl(`Study?deck_id=${deckId}`)}>
            <button className="text-sm font-medium flex items-center gap-1" style={mutedStyle}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </Link>
          <div className="flex items-center gap-4 text-sm" style={mutedStyle}>
            <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</span>
            <span>{moves} moves</span>
          </div>
          <button onClick={startGame} className="p-2 rounded-xl opacity-50 hover:opacity-100 transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {tiles.map((tile, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(i);
            const isMatched = matched.includes(i);
            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(i)}
                className={`rounded-2xl p-3 min-h-[80px] flex items-center justify-center text-center transition-all text-xs font-semibold leading-tight ${
                  isMatched ? "bg-emerald-500/20 border-emerald-500/30" : isFlipped ? "bg-violet-500/20 border-violet-500/30" : "hover:opacity-80"
                }`}
                style={!isFlipped && !isMatched ? { ...cardStyle, cursor: "pointer" } : { border: "1px solid" }}
              >
                {isFlipped || isMatched ? (
                  <span className={isMatched ? "text-emerald-400" : "text-violet-300"}>{tile.text}</span>
                ) : (
                  <span style={{ opacity: 0.15 }}>?</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}