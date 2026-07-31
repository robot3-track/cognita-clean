import { useState, useEffect } from "react";
import { X, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VALUES = [100, 200, 300, 400, 500];
const COLORS = [
  "from-blue-800 to-blue-900",
  "from-indigo-800 to-indigo-900",
  "from-violet-800 to-violet-900",
  "from-purple-800 to-purple-900",
  "from-blue-700 to-blue-800",
];

function buildBoard(cards) {
  // Group cards into up to 5 categories of 5 questions each
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  const categories = [];
  const chunkSize = 5;
  for (let i = 0; i < Math.min(shuffled.length, 25); i += chunkSize) {
    const chunk = shuffled.slice(i, i + chunkSize);
    if (chunk.length < 2) break;
    // Use the first card's front as a loose "category" name — or just label them
    categories.push({
      name: `Category ${categories.length + 1}`,
      clues: chunk.map((card, j) => ({
        value: VALUES[j] || (j + 1) * 100,
        question: card.back, // the answer = "question" in jeopardy
        answer: card.front,  // the term = "answer" in jeopardy
        card,
        used: false,
      })),
    });
  }
  return categories;
}

export default function JeopardyGame({ cards, onExit }) {
  const [board, setBoard] = useState(null);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null); // { catIdx, clueIdx }
  const [phase, setPhase] = useState("board"); // board | clue | reveal | done
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null); // correct | wrong
  const [allUsed, setAllUsed] = useState(false);

  useEffect(() => {
    if (cards.length >= 4) {
      setBoard(buildBoard(cards));
    }
  }, []);

  if (!board) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a1a3e", color: "white" }}>
      <p className="text-white/50">Need at least 4 cards to play Jeopardy.</p>
    </div>
  );

  const selectClue = (catIdx, clueIdx) => {
    const clue = board[catIdx].clues[clueIdx];
    if (clue.used) return;
    setSelected({ catIdx, clueIdx });
    setUserAnswer("");
    setFeedback(null);
    setPhase("clue");
  };

  const submitAnswer = () => {
    if (!selected || !userAnswer.trim()) return;
    const clue = board[selected.catIdx].clues[selected.clueIdx];
    // Flexible match: check if user's answer contains the key term (case insensitive)
    const correct = clue.answer.toLowerCase().split(/\s+/).some(word =>
      word.length > 3 && userAnswer.toLowerCase().includes(word)
    ) || userAnswer.toLowerCase().trim() === clue.answer.toLowerCase().trim();

    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore(s => s + clue.value);
    else setScore(s => s - clue.value);
    setPhase("reveal");
  };

  const closeClue = () => {
    const newBoard = board.map((cat, ci) => ({
      ...cat,
      clues: cat.clues.map((clue, li) =>
        ci === selected.catIdx && li === selected.clueIdx ? { ...clue, used: true } : clue
      ),
    }));
    setBoard(newBoard);
    setSelected(null);
    setPhase("board");
    setFeedback(null);
    // Check if all used
    const allDone = newBoard.every(cat => cat.clues.every(c => c.used));
    if (allDone) setAllUsed(true);
  };

  if (allUsed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#0a0a2e", color: "white" }}>
        <div className="text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black mb-2">Final Score</h2>
          <p className={`text-5xl font-black mb-6 ${score >= 0 ? "text-amber-400" : "text-red-400"}`}>${score.toLocaleString()}</p>
          <div className="space-y-3">
            <button onClick={() => { setBoard(buildBoard(cards)); setScore(0); setAllUsed(false); setPhase("board"); }}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all">
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
            <button onClick={onExit} className="w-full py-3 rounded-2xl text-sm font-semibold text-white/60 hover:text-white">← All Games</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0a2e", color: "white" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
        <button onClick={onExit} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        <div className="text-center">
          <p className="text-xs text-white/50 font-semibold tracking-widest uppercase">Jeopardy ❓</p>
          <p className={`text-xl font-black ${score >= 0 ? "text-amber-400" : "text-red-400"}`}>${score.toLocaleString()}</p>
        </div>
        <div className="w-8" />
      </div>

      {/* Board */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)` }}>
          {/* Category headers */}
          {board.map((cat, ci) => (
            <div key={ci} className="rounded-xl p-2 text-center text-[10px] font-black uppercase tracking-wide text-white/80 min-h-[48px] flex items-center justify-center"
              style={{ background: "rgba(30,30,120,0.8)" }}>
              {cat.name}
            </div>
          ))}
          {/* Clues */}
          {VALUES.map((val, vi) =>
            board.map((cat, ci) => {
              const clue = cat.clues[vi];
              if (!clue) return <div key={`${ci}-${vi}`} />;
              return (
                <motion.button
                  key={`${ci}-${vi}`}
                  onClick={() => selectClue(ci, vi)}
                  whileTap={{ scale: 0.95 }}
                  disabled={clue.used}
                  className={`rounded-xl min-h-[52px] flex items-center justify-center font-black text-lg transition-all
                    ${clue.used ? "opacity-20 cursor-default" : "hover:brightness-110 active:scale-95"}`}
                  style={{ background: clue.used ? "rgba(30,30,100,0.3)" : "rgba(30,30,180,0.8)", border: "1px solid rgba(100,100,255,0.3)" }}
                >
                  {clue.used ? "" : <span className="text-amber-400">${clue.value}</span>}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Clue Modal */}
      <AnimatePresence>
        {phase !== "board" && selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: "rgba(0,0,5,0.92)" }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{ background: "rgba(20,20,180,0.95)", border: "2px solid rgba(100,150,255,0.5)" }}
            >
              {(() => {
                const clue = board[selected.catIdx].clues[selected.clueIdx];
                return (
                  <div className="p-6 text-center">
                    <p className="text-amber-400 font-black text-2xl mb-1">${clue.value}</p>
                    <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{board[selected.catIdx].name}</p>
                    <div className="rounded-2xl p-5 mb-5 text-white font-semibold text-base leading-relaxed" style={{ background: "rgba(0,0,60,0.6)" }}>
                      {clue.question}
                    </div>

                    {phase === "clue" && (
                      <>
                        <p className="text-xs text-white/40 mb-2">What is...</p>
                        <input
                          value={userAnswer}
                          onChange={e => setUserAnswer(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && submitAnswer()}
                          placeholder="Type your answer..."
                          autoFocus
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none text-white mb-3"
                          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => { setPhase("board"); setSelected(null); }} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white/50 hover:text-white" style={{ background: "rgba(255,255,255,0.05)" }}>
                            Skip
                          </button>
                          <button onClick={submitAnswer} disabled={!userAnswer.trim()}
                            className="flex-1 py-3 rounded-2xl text-sm font-bold bg-blue-500 hover:bg-blue-400 disabled:opacity-40 transition-all">
                            Submit
                          </button>
                        </div>
                      </>
                    )}

                    {phase === "reveal" && (
                      <div className="space-y-3">
                        <div className={`flex items-center justify-center gap-2 text-lg font-black ${feedback === "correct" ? "text-emerald-400" : "text-red-400"}`}>
                          {feedback === "correct" ? <><CheckCircle2 className="w-6 h-6" /> Correct! +${clue.value}</> : <><XCircle className="w-6 h-6" /> Incorrect! -${clue.value}</>}
                        </div>
                        <p className="text-sm text-white/70">Correct answer: <span className="font-bold text-white">{clue.answer}</span></p>
                        <button onClick={closeClue} className="w-full py-3 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 transition-all">
                          Continue →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}