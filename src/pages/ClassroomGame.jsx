import { db } from '@/lib/firebase';
import { useState, useEffect, useRef } from "react";
import { Loader2, Trophy, CheckCircle, Play, ChevronRight, Crown, Zap } from "lucide-react";
import { incrementAiUsage, canUseAi } from "../components/aiUsageLimit";

function genGameCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

// Custom typography engine that translates raw LaTeX text sequences into readable symbols safely
function renderTextWithLatex(text = "") {
  if (!text) return "";
  
  let cleanText = text.replace(/\\\\/g, "\\");

  const replacements = [
    { regex: /\\cos/g, value: "cos" },
    { regex: /\\sin/g, value: "sin" },
    { regex: /\\tan/g, value: "tan" },
    { regex: /\\cot/g, value: "cot" },
    { regex: /\\pm/g, value: "±" },
    { regex: /\\mp/g, value: "∓" },
    { regex: /\\theta/g, value: "θ" },
    { regex: /\\pi/g, value: "π" },
    { regex: /\\sqrt/g, value: "√" },
    { regex: /\\left\(/g, value: "(" },
    { regex: /\\right\)/g, value: ")" },
    { regex: /\^2/g, value: "²" },
    { regex: /\^3/g, value: "³" }
  ];

  replacements.forEach(item => {
    cleanText = cleanText.replace(item.regex, item.value);
  });

  // Handle fractional syntax transformations: \frac{a}{b} -> (a/b)
  cleanText = cleanText.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1/$2)");
  cleanText = cleanText.replace(/\{([^}]+)\}/g, "$1");
  cleanText = cleanText.replace(/\$/g, "");

  if (text.includes("\\") || text.includes("$") || text.includes("^")) {
    return (
      <span 
        className="font-serif italic text-amber-300 font-medium tracking-wide px-0.5"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {cleanText}
      </span>
    );
  }

  return cleanText;
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
  
  // Dynamic display state tracks if the active index timer expired locally
  const [localTimerQuestionFinished, setLocalTimerQuestionFinished] = useState(null);
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
      if (!me) return;

      const allDecks = await db.entities.Deck.list("-updated_date", 200);
      const ownDecks = allDecks.filter(d => 
        (d.created_by && d.created_by.toLowerCase() === me.email.toLowerCase()) || 
        (d.author_email && d.author_email.toLowerCase() === me.email.toLowerCase())
      );
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
      } else {
        setDecks(myDecks);
      }
    };
    load();
  }, [classId]);

  const gameRef = useRef(null);
  useEffect(() => { 
    gameRef.current = game; 
  }, [game]);

  // LIVE PIPELINE SUBSCRIPTION: Ensures real-time alignment across all player screens
  useEffect(() => {
    if (!game?.id) return;
    
    const unsub = db.entities.ClassroomGame.subscribe((event) => {
      if (event.id !== game.id || event.type !== "update") return;
      
      const prev = gameRef.current;
      const updatedData = {
        ...prev,
        ...event.data,
        questions: event.data.questions || prev?.questions || [],
        player_emails: event.data.player_emails || prev?.player_emails || [],
        player_names: event.data.player_names || prev?.player_names || []
      };
      
      setGame(updatedData);
      
      // Auto-unlock client view interfaces instantly when the question index increments
      if (updatedData.status === "active") {
        if (!prev || prev.status !== "active" || updatedData.current_question !== prev.current_question) {
          setMyAnswer(null);
          setLocalTimerQuestionFinished(null);
          startTimer();
        }
      }
    });

    // Populate live submission response instances instantly
    const unsubAnswers = db.entities.ClassroomGameAnswer.subscribe((event) => {
      if (event.data?.game_id === game.id) {
        setAnswers(prev => {
          const filtered = prev.filter(a => !(a.player_email === event.data.player_email && a.question_index === event.data.question_index));
          return [...filtered, event.data];
        });
      }
    });

    return () => { 
      unsub(); 
      unsubAnswers(); 
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [game?.id]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { 
          clearInterval(timerRef.current); 
          if (gameRef.current) {
            setLocalTimerQuestionFinished(gameRef.current.current_question);
          }
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateLocalFallbackQuestions = (cards) => {
    const list = [...cards];
    const totalQuestions = Math.min(list.length, 10);
    const questions = [];

    for (let i = 0; i < totalQuestions; i++) {
      const currentCard = list[i];
      const questionText = `What is the correct match for: "${currentCard.front}"?`;
      const otherAnswers = list.filter(c => c.id !== currentCard.id).map(c => c.back || "Alternative option");
      const shuffledOthers = otherAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
      
      while (shuffledOthers.length < 3) {
        shuffledOthers.push(`Incorrect option ${shuffledOthers.length + 1}`);
      }

      const correctIdx = Math.floor(Math.random() * 4);
      const options = [...shuffledOthers];
      options.splice(correctIdx, 0, currentCard.back || "Correct option definition");

      questions.push({
        question: questionText,
        options: options,
        correct: correctIdx
      });
    }
    return questions;
  };

  const createGame = async () => {
    if (!selectedDeck) return;
    setGenerating(true);
    
    let finalQuestions = [];
    let cards = [];
    
    try {
      cards = await db.entities.Flashcard.filter({ deck_id: selectedDeck.id });
      if (!cards || cards.length === 0) {
        alert("This deck has no flashcards. Add some cards before hosting a game.");
        setGenerating(false);
        return;
      }
    } catch (e) {
      alert("Failed to read deck items.");
      setGenerating(false);
      return;
    }

    if (canUseAi(user?.email)) {
      try {
        const sample = [...cards].sort(() => Math.random() - 0.5).slice(0, 15);
        const cardText = sample.map(c => `[FRONT]: ${c.front || 'N/A'} -> [BACK]: ${c.back || 'N/A'}`).join("\n");
        
        incrementAiUsage(user?.email, false, 1);

        const resp = await db.integrations.Core.InvokeLLM({
          prompt: `You are a classroom trivia engine. Build 10 multiple-choice questions based on this raw source material:\n\n<source_material>\n${cardText}\n</source_material>\n\nStrict Output Rules:\n1. Output exactly 10 question objects.\n2. Do not insert double backslashes into math expressions. Use single backslashes like \\cos or \\frac.`,
          response_json_schema: {
            type: "object",
            properties: {
              questions: { 
                type: "array", 
                items: { 
                  type: "object", 
                  properties: { 
                    question: { type: "string" }, 
                    options: { type: "array", items: { type: "string" } }, 
                    correct: { type: "number" } 
                  },
                  required: ["question", "options", "correct"]
                } 
              }
            },
            required: ["questions"]
          }
        });

        if (resp?.questions && Array.isArray(resp.questions) && resp.questions.length > 0) {
          finalQuestions = resp.questions;
        }
      } catch (aiError) {
        console.warn("AI fallback initiated:", aiError);
      }
    }

    if (!finalQuestions || finalQuestions.length === 0) {
      finalQuestions = generateLocalFallbackQuestions(cards);
    }

    try {
      const newGame = await db.entities.ClassroomGame.create({
        code: genGameCode(),
        deck_id: selectedDeck.id,
        deck_title: selectedDeck.title,
        host_email: user.email,
        host_name: user.full_name || user.email,
        status: "waiting",
        current_question: 0,
        questions: finalQuestions,
        player_emails: [user.email],
        player_names: [user.full_name || user.email],
      });
      
      setGame(newGame);
      setLocalTimerQuestionFinished(null);
    } catch (err) {
      alert("Error initializing classroom game records.");
    } finally {
      setGenerating(false);
    }
  };

  const joinGame = async () => {
    if (!joinGameCode.trim()) return;
    setJoining(true);
    try {
      const allGames = await db.entities.ClassroomGame.list("-created_date", 200);
      const g = allGames.find(gm => gm.code === joinGameCode.trim().toUpperCase());
      if (!g) { 
        alert("Game not found! Check the code."); 
        return; 
      }
      if (g.status === "ended") { 
        alert("This game has ended."); 
        return; 
      }
      
      const nextEmails = [...new Set([...(g.player_emails || []), user.email])];
      const nextNames = [...new Set([...(g.player_names || []), user.full_name || user.email])];

      const updated = await db.entities.ClassroomGame.update(g.id, {
        player_emails: nextEmails,
        player_names: nextNames,
      });
      
      const existingAnswers = await db.entities.ClassroomGameAnswer.filter({ game_id: g.id });
      setAnswers(existingAnswers);
      
      setGame({
        ...g,
        ...updated,
        questions: g.questions || [],
        player_emails: nextEmails,
        player_names: nextNames
      });
      
      setLocalTimerQuestionFinished(null);
      if (updated.status === "active") startTimer();
    } catch (err) {
      alert("Error joining game.");
    } finally {
      setJoining(false);
    }
  };

  const startGame = async () => {
    if (!game || !game.questions || game.questions.length === 0) return;
    
    const updated = await db.entities.ClassroomGame.update(game.id, { 
      status: "active", 
      current_question: 0 
    });
    
    setGame({
      ...game,
      ...updated,
      questions: game.questions
    });
    setMyAnswer(null);
    setLocalTimerQuestionFinished(null);
    startTimer();
  };

  const submitAnswer = async (idx) => {
    if (myAnswer !== null) return;
    setMyAnswer(idx);
    const q = game.questions[game.current_question];
    
    await db.entities.ClassroomGameAnswer.create({
      game_id: game.id,
      player_email: user.email,
      player_name: user.full_name || user.email,
      question_index: game.current_question,
      answer_index: idx,
      is_correct: idx === q.correct,
      time_ms: (20 - timeLeft) * 1000,
    });
  };

  const nextQuestion = async () => {
    const next = game.current_question + 1;
    if (next >= game.questions.length) {
      const updated = await db.entities.ClassroomGame.update(game.id, { status: "ended" });
      setGame({ ...game, ...updated, questions: game.questions });
    } else {
      const updated = await db.entities.ClassroomGame.update(game.id, { current_question: next });
      setGame({ ...game, ...updated, questions: game.questions });
      setMyAnswer(null);
      setLocalTimerQuestionFinished(null);
      startTimer();
    }
  };

  // BROADCAST STATE PARSER: Resolves active route layouts explicitly using data metrics
  let derivedPhase = "lobby";
  if (game) {
    if (game.status === "waiting") derivedPhase = "lobby";
    else if (game.status === "ended") derivedPhase = "end";
    else if (game.status === "active") {
      if (localTimerQuestionFinished === game.current_question || timeLeft === 0) {
        derivedPhase = "results";
      } else {
        derivedPhase = "question";
      }
    }
  }

  // Calculate scores securely
  const scoreMap = {};
  answers.forEach(a => {
    if (!scoreMap[a.player_email]) scoreMap[a.player_email] = { name: a.player_name, score: 0 };
    if (a.is_correct) scoreMap[a.player_email].score += 1;
  });
  const scoreboard = Object.values(scoreMap).sort((a, b) => b.score - a.score);

  const isHost = user && game?.host_email === user.email;
  
  // ROSTER RECONCILIATION FIX: Safely computes true participant volume across historical and real-time arrays
  const activePlayersCount = Math.max(
    (game?.player_names || []).filter(name => !name.includes(game?.host_name || "HOST_GUARD_BLOCK")).length,
    new Set(answers.map(a => a.player_email)).size,
    (game?.player_emails || []).length > 1 ? (game?.player_emails || []).length - 1 : 0,
    0
  );

  if (generating) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={bgStyle}>
      <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      <p className="font-semibold text-sm">Setting up classroom trivia deck...</p>
    </div>
  );

  // --- HUB PRE-GAME SELECTION ---
  if (!game) return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Class Game</h1>
        </div>

        <div className="rounded-2xl p-5" style={cardStyle}>
          <h2 className="font-bold text-sm mb-3">Join a Game</h2>
          <div className="flex gap-2">
            <input 
              value={joinGameCode} 
              onChange={e => setJoinGameCode(e.target.value.toUpperCase())} 
              maxLength={5} 
              placeholder="XXXXX" 
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none font-mono font-bold tracking-widest text-center" 
              style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} 
            />
            <button 
              onClick={joinGame} 
              disabled={joinGameCode.length < 5 || joining} 
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white rounded-xl text-sm font-bold transition-all shrink-0"
            >
              {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-5" style={cardStyle}>
          <h2 className="font-bold text-sm mb-3">Host a New Game</h2>
          {decks.length === 0 && (
            <p className="text-xs mb-3" style={mutedStyle}>No decks found. Please create a flashcard deck first to host a game.</p>
          )}
          <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-1">
            {decks.map(d => (
              <button key={d.id} onClick={() => setSelectedDeck(d)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all border ${selectedDeck?.id === d.id ? "border-violet-500 bg-violet-500/10" : "hover:bg-white/[0.03]"}`}
                style={{ borderColor: selectedDeck?.id === d.id ? "" : "var(--app-border)" }}>
                <div className="w-5 h-5 rounded-lg shrink-0" style={{ background: d.color || "#4F46E5" }} />
                <span className="font-semibold flex-1 truncate">{d.title}</span>
                {selectedDeck?.id === d.id && <CheckCircle className="w-4 h-4 text-violet-400 shrink-0" />}
              </button>
            ))}
          </div>
          <button 
            onClick={createGame} 
            disabled={!selectedDeck} 
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-3.5 rounded-xl text-sm font-bold transition-all"
          >
            <Play className="w-4 h-4" /> Generate & Host Game
          </button>
        </div>
      </div>
    </div>
  );

  const currentQ = game.questions?.[game.current_question];

  // --- LOBBY WAITING SCREEN ---
  if (derivedPhase === "lobby") return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="max-w-md w-full text-center space-y-4">
        <div className="rounded-3xl p-8" style={cardStyle}>
          <Zap className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-black mb-1">{game.deck_title}</h2>
          <p className="text-xs mb-6" style={mutedStyle}>Share this code to invite players</p>
          <div className="text-5xl font-black tracking-[0.2em] text-violet-400 mb-6 font-mono pl-[0.2em]">{game.code}</div>
          <p className="text-sm font-bold mb-3">{activePlayersCount} player{activePlayersCount !== 1 ? "s" : ""} joined</p>
          <div className="flex flex-wrap gap-1.5 justify-center max-h-36 overflow-y-auto p-1">
            {(game.player_names || []).filter(n => n !== game.host_name).map((name, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">{name}</span>
            ))}
          </div>
        </div>
        {isHost && (
          <button 
            onClick={startGame} 
            disabled={activePlayersCount < 1}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-base transition-all shadow-lg"
          >
            <Play className="w-5 h-5" /> Start Game!
          </button>
        )}
        {!isHost && <p className="text-sm animate-pulse text-amber-400 font-bold">Waiting for the host to start...</p>}
      </div>
    </div>
  );

  // --- ACTIVE LIVE QUESTION INTERFACE ---
  if (derivedPhase === "question") {
    if (!currentQ) return null;
    const colors = [
      "bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20", 
      "bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20", 
      "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20", 
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
    ];
    const currentQAnswers = answers.filter(a => a.question_index === game.current_question);

    return (
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={mutedStyle}>Question {game.current_question + 1} of {game.questions.length}</span>
            <div className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10" style={mutedStyle}>
              {currentQAnswers.length} of {activePlayersCount} answers submitted
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-black border-4 ${timeLeft > 10 ? "border-emerald-500 text-emerald-400" : timeLeft > 5 ? "border-amber-500 text-amber-400" : "border-red-500 text-red-400 animate-pulse"}`}>
              {timeLeft}
            </div>
          </div>
          <div className="rounded-3xl p-8 text-center min-h-[140px] flex flex-col items-center justify-center bg-slate-900 border border-slate-800" style={cardStyle}>
            <div className="text-2xl leading-relaxed font-semibold">
              {renderTextWithLatex(currentQ.question)}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options.map((opt, i) => (
              <button key={i} onClick={() => submitAnswer(i)} disabled={myAnswer !== null || isHost}
                className={`p-6 rounded-2xl text-left font-semibold text-base border-2 transition-all ${myAnswer === i ? "bg-violet-600 border-violet-500 text-white scale-[0.98]" : colors[i]} ${(myAnswer !== null && myAnswer !== i) || isHost ? "opacity-40 select-none" : ""}`}>
                <span className="font-black mr-2 text-xs opacity-75">{["A", "B", "C", "D"][i]}.</span>
                {renderTextWithLatex(opt)}
              </button>
            ))}
          </div>
          {myAnswer !== null && !isHost && (
            <p className="text-center text-xs animate-pulse text-emerald-400 font-semibold mt-4">Answer locked! Waiting for timer...</p>
          )}
          {isHost && (
            <p className="text-center text-xs text-amber-400 font-semibold mt-4">Hosting Mode — Monitoring Student Submissions</p>
          )}
        </div>
      </div>
    );
  }

  // --- TIME-UP ROUND REVIEW RESULTS SCREEN ---
  if (derivedPhase === "results" && currentQ) {
    const qAnswers = answers.filter(a => a.question_index === game.current_question);
    const correctCount = qAnswers.filter(a => a.is_correct).length;
    return (
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-xl mx-auto space-y-6">
          <div className="rounded-3xl p-6 text-center space-y-4 bg-slate-900 border border-slate-800" style={cardStyle}>
            <div className="text-lg font-bold text-slate-300">
              {renderTextWithLatex(currentQ.question)}
            </div>
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold text-base shadow-inner">
              Correct Answer: {renderTextWithLatex(currentQ.options[currentQ.correct])}
            </div>
            <p className="text-sm font-semibold text-violet-300">{correctCount} of {Math.max(activePlayersCount, qAnswers.length)} players got this right</p>
          </div>
          <div className="rounded-2xl p-5" style={cardStyle}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={mutedStyle}>Leaderboard</p>
            <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-1">
              {scoreboard.length === 0 ? (
                <p className="text-xs py-4 text-center" style={mutedStyle}>No student answers recorded yet this session.</p>
              ) : (
                scoreboard.slice(0, 10).map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3 py-3">
                    <span className="w-6 text-xs font-black" style={i === 0 ? { color: "#f59e0b" } : mutedStyle}>#{i + 1}</span>
                    {i === 0 && <Crown className="w-4 h-4 text-amber-400 shrink-0" />}
                    <span className="flex-1 text-sm font-semibold truncate">{p.name}</span>
                    <span className="text-sm font-black text-violet-400">{p.score} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>
          {isHost && (
            <button 
              onClick={nextQuestion} 
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-2xl font-bold transition-all shadow-md"
            >
              {game.current_question + 1 < game.questions.length ? <><ChevronRight className="w-5 h-5" /> Next Question</> : "End Game"}
            </button>
          )}
          {!isHost && (
            <p className="text-center text-xs animate-pulse" style={mutedStyle}>Waiting for the host to prompt the next slide...</p>
          )}
        </div>
      </div>
    );
  }

  // --- FINAL SCORES SUMMARY VIEW ---
  if (derivedPhase === "end") return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="max-w-md w-full text-center space-y-4">
        <div className="rounded-3xl p-8" style={cardStyle}>
          <Trophy className="w-14 h-14 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-1">Game Over!</h2>
          <p className="text-xs mb-6" style={mutedStyle}>Final Standings</p>
          <div className="divide-y divide-white/5 max-h-72 overflow-y-auto p-1">
            {scoreboard.length === 0 ? (
              <p className="text-xs py-4" style={mutedStyle}>No responses logged inside final performance index metrics.</p>
            ) : (
              scoreboard.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 py-3">
                  <span className="w-6 text-sm font-black" style={i === 0 ? { color: "#f59e0b" } : mutedStyle}>#{i + 1}</span>
                  {i === 0 && <Crown className="w-4 h-4 text-amber-400 shrink-0" />}
                  <span className="flex-1 text-sm font-bold text-left truncate">{p.name}</span>
                  <span className="font-black text-violet-400 text-sm">{p.score} / {game.questions.length}</span>
                </div>
              ))
            )}
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="w-full py-3.5 bg-white/5 border border-white/10 text-sm font-bold rounded-2xl hover:bg-white/10 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  return null;
}
