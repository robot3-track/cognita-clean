import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import { Loader2, Trophy, CheckCircle, Play, ChevronRight, Crown, Zap } from "lucide-react";
import { incrementAiUsage, canUseAi } from "../components/aiUsageLimit";

function genGameCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

export default function ClassroomGame() {
  const params = new URLSearchParams(window.location.search);
  const classId = params.get("class_id");
  const prefilledCode = params.get("code") || "";

  const [user, setUser] = useState(null);
  const [classData, setClassData] = useState(null);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [game, setGame] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [myAnswer, setMyAnswer] = useState(null);
  const [phase, setPhase] = useState("lobby"); // lobby | question | results | end
  const [timeLeft, setTimeLeft] = useState(20);
  const [generating, setGenerating] = useState(false);
  const [joinGameCode, setJoinGameCode] = useState(prefilledCode);
  const [joining, setJoining] = useState(false);
  const timerRef = useRef(null);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  useEffect(() => {
    const load = async () => {
      const me = await db.auth.me();
      setUser(me);
      const allDecks = await db.entities.Deck.list("-updated_date", 200);
      const ownDecks = allDecks.filter(d => d.created_by === me.email || d.author_email === me.email);
      const publicDecks = allDecks.filter(d => d.is_public && !ownDecks.find(od => od.id === d.id));
      const myDecks = [...ownDecks, ...publicDecks];

      if (classId) {
        const allClasses = await db.entities.ClassroomClass.list("-created_date", 100);
        const cls = allClasses.find(c => c.id === classId);
        setClassData(cls || null);
        if (cls?.assigned_deck_ids?.length) {
          const assigned = allDecks.filter(d => cls.assigned_deck_ids.includes(d.id));
          setDecks(assigned.length > 0 ? assigned : myDecks);
        } else {
          setDecks(myDecks);
        }
      }
    };
    load();
  }, [classId]);

  // Subscribe to game changes — use gameId ref to avoid stale closure
  const gameRef = useRef(null);
  useEffect(() => { gameRef.current = game; }, [game]);

  useEffect(() => {
    if (!game?.id) return;
    const unsub = db.entities.ClassroomGame.subscribe((event) => {
      if (event.id !== game.id || event.type !== "update") return;
      const prev = gameRef.current;
      setGame(event.data);
      // Advance when question changes OR game becomes active for first time
      if (
        event.data.status === "active" &&
        (event.data.current_question !== prev?.current_question || prev?.status !== "active")
      ) {
        setMyAnswer(null);
        setPhase("question");
        startTimer();
      }
      if (event.data.status === "ended") {
        setPhase("end");
      }
    });
    const unsubAnswers = db.entities.ClassroomGameAnswer.subscribe((event) => {
      if (event.data?.game_id === game.id) {
        setAnswers(prev => {
          const filtered = prev.filter(a => !(a.player_email === event.data.player_email && a.question_index === event.data.question_index));
          return [...filtered, event.data];
        });
      }
    });
    return () => { unsub(); unsubAnswers(); };
  }, [game?.id]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); setPhase("results"); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const createGame = async () => {
    if (!selectedDeck || !canUseAi(user?.email)) return;
    setGenerating(true);
    incrementAiUsage(user?.email, false, 1);
    const cards = await db.entities.Flashcard.filter({ deck_id: selectedDeck.id });
    const sample = cards.sort(() => Math.random() - 0.5).slice(0, 15);
    const cardText = sample.map(c => `Q: ${c.front}\nA: ${c.back}`).join("\n\n");
    const resp = await db.integrations.Core.InvokeLLM({
      prompt: `Create 10 fun multiple-choice quiz questions based on these flashcards for a classroom game:\n\n${cardText}\n\nReturn JSON with "questions" array. Each: "question" (string), "options" (4 strings), "correct" (index 0-3).`,
      response_json_schema: {
        type: "object",
        properties: {
          questions: { type: "array", items: { type: "object", properties: { question: { type: "string" }, options: { type: "array", items: { type: "string" } }, correct: { type: "number" } } } }
        }
      }
    });
    const newGame = await db.entities.ClassroomGame.create({
      code: genGameCode(),
      deck_id: selectedDeck.id,
      deck_title: selectedDeck.title,
      host_email: user.email,
      host_name: user.full_name || user.email,
      status: "waiting",
      current_question: 0,
      questions: resp?.questions || [],
      player_emails: [user.email],
      player_names: [user.full_name || user.email],
    });
    setGame(newGame);
    setPhase("lobby");
    setGenerating(false);
  };

  const joinGame = async () => {
    if (!joinGameCode.trim()) return;
    setJoining(true);
    const allGames = await db.entities.ClassroomGame.list("-created_date", 200);
    const g = allGames.find(gm => gm.code === joinGameCode.trim().toUpperCase());
    if (!g) { alert("Game not found! Check the code and try again."); setJoining(false); return; }
    if (g.status === "ended") { alert("This game has ended."); setJoining(false); return; }
    const updated = await db.entities.ClassroomGame.update(g.id, {
      player_emails: [...new Set([...(g.player_emails || []), user.email])],
      player_names: [...new Set([...(g.player_names || []), user.full_name || user.email])],
    });
    // Load existing answers
    const existingAnswers = await db.entities.ClassroomGameAnswer.filter({ game_id: g.id });
    setAnswers(existingAnswers);
    setGame(updated);
    setPhase(updated.status === "active" ? "question" : "lobby");
    if (updated.status === "active") startTimer();
    setJoining(false);
  };

  const startGame = async () => {
    const updated = await db.entities.ClassroomGame.update(game.id, { status: "active", current_question: 0 });
    setGame(updated);
    setPhase("question");
    startTimer();
  };

  const submitAnswer = async (idx) => {
    if (myAnswer !== null) return;
    setMyAnswer(idx);
    const q = game.questions[game.current_question];
    clearInterval(timerRef.current);
    await db.entities.ClassroomGameAnswer.create({
      game_id: game.id,
      player_email: user.email,
      player_name: user.full_name || user.email,
      question_index: game.current_question,
      answer_index: idx,
      is_correct: idx === q.correct,
      time_ms: (20 - timeLeft) * 1000,
    });
    setPhase("results");
  };

  const nextQuestion = async () => {
    const next = game.current_question + 1;
    if (next >= game.questions.length) {
      await db.entities.ClassroomGame.update(game.id, { status: "ended" });
      setPhase("end");
    } else {
      await db.entities.ClassroomGame.update(game.id, { current_question: next });
      setMyAnswer(null);
      setPhase("question");
      startTimer();
    }
  };

  // Scoreboard
  const scoreMap = {};
  answers.forEach(a => {
    if (!scoreMap[a.player_email]) scoreMap[a.player_email] = { name: a.player_name, score: 0 };
    if (a.is_correct) scoreMap[a.player_email].score += 1;
  });
  const scoreboard = Object.values(scoreMap).sort((a, b) => b.score - a.score);

  const isHost = user && game?.host_email === user.email;

  if (generating) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={bgStyle}>
      <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      <p className="font-semibold">Generating game questions...</p>
    </div>
  );

  // --- NO GAME YET ---
  if (!game) return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black">Class Game</h1>
        </div>

        {/* Join existing game */}
        <div className="rounded-2xl p-5 mb-4" style={cardStyle}>
          <h2 className="font-bold text-sm mb-3">Join a Game</h2>
          <div className="flex gap-2">
            <input value={joinGameCode} onChange={e => setJoinGameCode(e.target.value.toUpperCase())} maxLength={5} placeholder="XXXXX" className="flex-1 px-3 py-2 rounded-xl text-sm outline-none font-mono font-bold tracking-widest text-center" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
            <button onClick={joinGame} disabled={joinGameCode.length < 5 || joining} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-all">
              {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
            </button>
          </div>
        </div>

        {/* Host game — show deck picker even without a class */}
        {(decks.length > 0 || !classId) && (
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h2 className="font-bold text-sm mb-3">Host a New Game</h2>
            {!classId && decks.length === 0 && (
              <p className="text-xs mb-3" style={mutedStyle}>You need to create a deck first in "My Decks", then come back to host a game.</p>
            )}
            <div className="space-y-2 mb-4">
              {decks.map(d => (
                <button key={d.id} onClick={() => setSelectedDeck(d)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all border ${selectedDeck?.id === d.id ? "border-violet-500/50 bg-violet-500/10" : "hover:bg-white/[0.03]"}`}
                  style={{ borderColor: selectedDeck?.id === d.id ? "" : "var(--app-border)" }}>
                  <div className="w-5 h-5 rounded-lg shrink-0" style={{ background: d.color || "#4F46E5" }} />
                  <span className="font-medium flex-1 truncate">{d.title}</span>
                  {selectedDeck?.id === d.id && <CheckCircle className="w-4 h-4 text-violet-400 shrink-0" />}
                </button>
              ))}
            </div>
            <button onClick={createGame} disabled={!selectedDeck} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white py-3 rounded-xl text-sm font-semibold transition-all">
              <Play className="w-4 h-4" /> Generate & Host Game
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const currentQ = game.questions?.[game.current_question];

  // --- LOBBY ---
  if (phase === "lobby") return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="max-w-sm w-full text-center">
        <div className="rounded-3xl p-8 mb-4" style={cardStyle}>
          <Zap className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-black mb-1">{game.deck_title}</h2>
          <p className="text-sm mb-4" style={mutedStyle}>Share this code to invite players</p>
          <div className="text-5xl font-black tracking-[0.2em] text-violet-400 mb-4">{game.code}</div>
          <p className="text-sm font-medium mb-1">{(game.player_emails || []).length} player{(game.player_emails || []).length !== 1 ? "s" : ""} joined</p>
          <div className="flex flex-wrap gap-1.5 justify-center mt-2">
            {(game.player_names || []).map((name, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400">{name}</span>
            ))}
          </div>
        </div>
        {isHost && (
          <button onClick={startGame} disabled={(game.player_emails || []).length < 1} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white py-4 rounded-2xl font-bold text-base transition-all">
            <Play className="w-5 h-5" /> Start Game!
          </button>
        )}
        {!isHost && <p className="text-sm" style={mutedStyle}>Waiting for the host to start…</p>}
      </div>
    </div>
  );

  // --- QUESTION ---
  if (phase === "question" && currentQ) {
    const colors = ["bg-red-500/20 border-red-500/40 text-red-300", "bg-blue-500/20 border-blue-500/40 text-blue-300", "bg-yellow-500/20 border-yellow-500/40 text-yellow-300", "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"];
    return (
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold" style={mutedStyle}>Question {game.current_question + 1} / {game.questions.length}</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black border-4 ${timeLeft > 10 ? "border-emerald-500 text-emerald-400" : timeLeft > 5 ? "border-amber-500 text-amber-400" : "border-red-500 text-red-400"}`}>
              {timeLeft}
            </div>
          </div>
          <div className="rounded-3xl p-6 mb-6 text-center" style={cardStyle}>
            <p className="text-lg font-bold">{currentQ.question}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => (
              <button key={i} onClick={() => submitAnswer(i)} disabled={myAnswer !== null}
                className={`p-4 rounded-2xl text-left font-semibold text-sm border-2 transition-all ${myAnswer === i ? colors[i] + " scale-[0.97]" : `${colors[i]} hover:scale-[1.02] active:scale-[0.97]`} ${myAnswer !== null && myAnswer !== i ? "opacity-40" : ""}`}>
                <span className="font-black mr-2">{["A", "B", "C", "D"][i]}.</span> {opt}
              </button>
            ))}
          </div>
          {myAnswer !== null && (
            <p className="text-center text-sm mt-4 font-medium" style={mutedStyle}>Answer submitted! Waiting for timer…</p>
          )}
        </div>
      </div>
    );
  }

  // --- RESULTS ---
  if (phase === "results" && currentQ) {
    const qAnswers = answers.filter(a => a.question_index === game.current_question);
    const correctCount = qAnswers.filter(a => a.is_correct).length;
    return (
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <div className="rounded-3xl p-6 mb-4 text-center" style={cardStyle}>
            <p className="text-base font-bold mb-2">{currentQ.question}</p>
            <p className="text-sm text-emerald-400 font-semibold">✓ {currentQ.options[currentQ.correct]}</p>
            <p className="text-xs mt-2" style={mutedStyle}>{correctCount}/{qAnswers.length} players correct</p>
          </div>
          <div className="rounded-2xl p-4 mb-6" style={cardStyle}>
            <p className="text-xs font-semibold mb-3" style={mutedStyle}>Leaderboard</p>
            {scoreboard.slice(0, 10).map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 py-1.5">
                <span className="w-5 text-xs font-black" style={i === 0 ? { color: "#f59e0b" } : mutedStyle}>#{i + 1}</span>
                {i === 0 && <Crown className="w-4 h-4 text-amber-400 shrink-0" />}
                <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
                <span className="text-sm font-black text-violet-400">{p.score} pts</span>
              </div>
            ))}
          </div>
          {isHost && (
            <button onClick={nextQuestion} className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-2xl font-bold transition-all">
              {game.current_question + 1 < game.questions.length ? <><ChevronRight className="w-5 h-5" /> Next Question</> : "End Game 🏆"}
            </button>
          )}
          {!isHost && <p className="text-center text-sm" style={mutedStyle}>Waiting for host to continue…</p>}
        </div>
      </div>
    );
  }

  // --- END ---
  if (phase === "end") return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="max-w-sm w-full text-center">
        <div className="rounded-3xl p-8" style={cardStyle}>
          <Trophy className="w-14 h-14 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Game Over!</h2>
          <p className="text-sm mb-6" style={mutedStyle}>Final Leaderboard</p>
          {scoreboard.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: "var(--app-border)" }}>
              <span className="w-6 text-sm font-black" style={i === 0 ? { color: "#f59e0b" } : mutedStyle}>#{i + 1}</span>
              {i === 0 && <Crown className="w-4 h-4 text-amber-400" />}
              <span className="flex-1 text-sm font-semibold text-left truncate">{p.name}</span>
              <span className="font-black text-violet-400">{p.score} / {game.questions.length}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return null;
}