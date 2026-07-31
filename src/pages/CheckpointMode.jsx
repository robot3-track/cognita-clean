import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Flag, Loader2, Check, X, Trophy, RotateCcw, ChevronDown, ChevronUp, Download } from "lucide-react";
import DeckPicker from "@/components/DeckPicker";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LatexRenderer from "@/components/LatexRenderer";
import confetti from "canvas-confetti";
import { exportTestPdf } from "@/utils/exportTestPdf";

function buildQuestions(cards) {
  if (cards.length < 4) return [];
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.map((card, i) => {
    const wrongOptions = cards.filter(c => c.id !== card.id).sort(() => Math.random() - 0.5).slice(0, 3).map(c => c.back);
    const options = [...wrongOptions, card.back].sort(() => Math.random() - 0.5);
    return { question: card.front, options, correct: options.indexOf(card.back), explanation: `The correct answer is: ${card.back}` };
  });
}

export default function CheckpointMode() {
  const params = new URLSearchParams(window.location.search);
  const deckId = params.get("deck_id");

  const [deck, setDeck] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!deckId) return;
    Promise.all([
      db.entities.Deck.filter({ id: deckId }),
      db.entities.Flashcard.filter({ deck_id: deckId }),
    ]).then(([d, c]) => {
      setDeck(d[0]);
      setQuestions(buildQuestions(c));
      setLoading(false);
    });
  }, [deckId]);

  const submit = async () => {
    setSubmitted(true);
    const correct = questions.filter((q, i) => answers[i] === q.correct).length;
    const pct = correct / questions.length;
    if (pct >= 0.8) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    if (navigator.vibrate) navigator.vibrate(pct >= 0.8 ? [100, 50, 100, 50, 200] : 100);
    const user = await db.auth.me();
    await db.entities.StudySession.create({
      deck_id: deckId, session_type: "practice_test",
      cards_reviewed: questions.length, cards_correct: correct,
      duration_minutes: Math.max(1, Math.round((Date.now() - startTime) / 60000)),
      quiz_score: Math.round(pct * 100), quiz_total: questions.length,
      user_email: user?.email || "",
    });
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (loading && deckId) return <div className="min-h-screen flex items-center justify-center" style={bgStyle}><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>;
  if (!deckId) return <DeckPicker targetPage="CheckpointMode" title="Checkpoint Mode" />;
  if (questions.length < 4) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="text-center">
        <p className="font-bold mb-2">Need at least 4 cards for Checkpoint Mode</p>
        <Link to={createPageUrl(`Study?deck_id=${deckId}`)}><button className="text-violet-400 text-sm">← Back to deck</button></Link>
      </div>
    </div>
  );

  if (submitted) {
    const correct = questions.filter((q, i) => answers[i] === q.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    const encouragement = score >= 90 ? "🏆 Outstanding! You're exam-ready!" : score >= 75 ? "🎯 Great work! Review the missed ones and you'll ace it." : score >= 60 ? "💪 Solid effort. Focus on the red ones and retry." : "📚 Keep studying — this is great practice for finding gaps!";
    return (
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8 rounded-3xl p-8" style={cardStyle}>
            <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <div className="text-5xl font-black mb-2 text-violet-400">{score}%</div>
            <p className="text-lg font-bold mb-1">{correct}/{questions.length} correct</p>
            <p className="text-sm mb-3" style={mutedStyle}>{encouragement}</p>
            <div className="flex gap-3 justify-center mt-4">
              <Link to={createPageUrl(`Study?deck_id=${deckId}`)}>
                <button className="px-5 py-2.5 rounded-2xl text-sm font-semibold" style={cardStyle}>← Back to Deck</button>
              </Link>
              <button onClick={() => { setAnswers({}); setSubmitted(false); setQuestions(q => [...q].sort(() => Math.random() - 0.5)); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-sm font-semibold transition-all">
                <RotateCcw className="w-4 h-4" /> Retry
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correct;
              return (
                <div key={i} className={`rounded-2xl overflow-hidden border ${isCorrect ? "border-emerald-500/20" : "border-red-500/20"}`}
                  style={{ background: isCorrect ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)" }}>
                  <button onClick={() => setExpandedQ(expandedQ === i ? null : i)} className="w-full flex items-center gap-3 p-4 text-left">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                    <p className="text-sm font-medium flex-1 text-left">{i + 1}. <LatexRenderer text={q.question} /></p>
                    {expandedQ === i ? <ChevronUp className="w-4 h-4 shrink-0" style={mutedStyle} /> : <ChevronDown className="w-4 h-4 shrink-0" style={mutedStyle} />}
                  </button>
                  {expandedQ === i && (
                    <div className="px-4 pb-4 space-y-1.5">
                      {q.options.map((opt, j) => (
                        <div key={j} className={`px-3 py-2 rounded-xl text-xs ${j === q.correct ? "bg-emerald-500/20 text-emerald-300" : answers[i] === j && j !== q.correct ? "bg-red-500/20 text-red-300" : ""}`}
                          style={j !== q.correct && answers[i] !== j ? { ...cardStyle, opacity: 0.5 } : {}}>
                          <LatexRenderer text={opt} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const answered = Object.keys(answers).length;
  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl(`Study?deck_id=${deckId}`)}><button className="text-sm font-medium" style={mutedStyle}>← Back</button></Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportTestPdf({ title: `${deck?.title || "Checkpoint"} — Practice Test`, deckTitle: deck?.title, questions: questions.map(q => ({ ...q, type: "multiple_choice" })), includeAnswerKey: false })}
              className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
            <span className="text-sm font-medium" style={mutedStyle}>{answered}/{questions.length} answered</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/15 flex items-center justify-center">
            <Flag className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-black text-lg">Checkpoint Mode</h1>
            <p className="text-xs" style={mutedStyle}>{deck?.title} · Comprehensive test</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {questions.map((q, i) => (
            <div key={i} className="rounded-3xl p-5" style={cardStyle}>
              <p className="font-semibold text-sm mb-3">{i + 1}. <LatexRenderer text={q.question} /></p>
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <button key={j} onClick={() => setAnswers(prev => ({ ...prev, [i]: j }))}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${answers[i] === j ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "hover:bg-white/[0.03]"}`}
                    style={{ borderColor: answers[i] === j ? "" : "var(--app-border)" }}
                  >
                    <LatexRenderer text={opt} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={submit} disabled={answered < questions.length}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black py-4 rounded-2xl font-bold transition-all">
          <Flag className="w-4 h-4" /> Submit Checkpoint ({answered}/{questions.length})
        </button>
      </div>
    </div>
  );
}