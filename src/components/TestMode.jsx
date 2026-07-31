import { db } from '@/lib/firebase';
import { useState, useEffect, useRef } from "react";
import { incrementAiUsage } from "./aiUsageLimit";
import { callAI } from "@/lib/lynxApi";
import { Loader2, Check, X, ArrowRight, BookmarkCheck, Download } from "lucide-react";
import { exportTestPdf } from "@/utils/exportTestPdf";
import LanguageKeyboard, { detectLanguage } from "./LanguageKeyboard";
import { useTranslation } from "../hooks/useTranslation";
import LatexRenderer from "@/components/LatexRenderer";

function buildPrompt(cards = [], config = {}) {
  const { questionCount = 5, answerWith = "both", questionTypes = [] } = config;
  if (!cards.length || !questionTypes.length) return "";

  const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, Math.min(cards.length, questionCount * 2));

  let cardLines;
  if (answerWith === "answer") {
    cardLines = shuffled.map(c => `Term: "${c?.front || ''}" | Definition: "${c?.back || ''}"`).join("\n");
  } else if (answerWith === "question") {
    cardLines = shuffled.map(c => `Definition: "${c?.back || ''}" | Term: "${c?.front || ''}"`).join("\n");
  } else {
    cardLines = shuffled.map((c, i) =>
      i % 2 === 0
        ? `Term: "${c?.front || ''}" | Definition: "${c?.back || ''}"`
        : `Definition: "${c?.back || ''}" | Term: "${c?.front || ''}"`
    ).join("\n");
  }

  const typeInstructions = questionTypes.map(t => {
    if (t === "true_false") return `- true_false: A statement the student marks as True or False. Include "statement" and "is_true" (boolean).`;
    if (t === "multiple_choice") return `- multiple_choice: Include "question", "options" (4 strings), "correct" (index 0-3).`;
    if (t === "matching") return `- matching: Include "pairs" (array of {left, right} objects, 4-6 pairs). No "question" needed.`;
    if (t === "written") return `- written: Include "question" and "correct_answer" (the expected answer string).`;
    return "";
  }).join("\n");

  return `Create exactly ${questionCount} test questions from the following flashcard material.
Distribute question types proportionally among: ${questionTypes.join(", ")}.

Flashcard material:
${cardLines}

Return JSON with a "questions" array. Each item has a "type" field (one of: ${questionTypes.join(", ")}) and:
${typeInstructions}

All questions must test knowledge of the provided material only.`;
}

function MatchingQuestion({ q, answer, onAnswer, t }) {
  const pairs = q?.pairs || [];
  const [rightOptions] = useState(() => [...pairs.map(p => p?.right || "")].sort(() => Math.random() - 0.5));
  const current = answer || {};

  const handleChange = (left, right) => {
    const updated = { ...current, [left]: right };
    onAnswer(updated);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold opacity-60">{t('matchEachTerm') || "Match each term:"}</p>
      {pairs.map((p, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
            {p?.left}
          </div>
          <span className="text-sm opacity-40">→</span>
          <select
            value={current[p?.left] || ""}
            onChange={e => handleChange(p?.left, e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
            style={{ 
              background: "var(--app-bg)", 
              border: `1px solid ${current[p?.left] ? "rgba(139,92,246,0.5)" : "var(--app-border)"}`, 
              color: current[p?.left] ? "rgb(196,181,253)" : "var(--app-text-muted)", 
              colorScheme: "dark" 
            }}
          >
            <option value="">{t('choose') || "Choose"}...</option>
            {rightOptions.map((r, j) => (
              <option key={j} value={r}>{r}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function gradeAnswers(questions = [], answers = {}) {
  let correct = 0;
  questions.forEach((q, i) => {
    const ans = answers[i];
    if (!q) return;
    if (q.type === "multiple_choice") {
      if (ans === q.correct) correct++;
    } else if (q.type === "true_false") {
      if (ans === q.is_true) correct++;
    } else if (q.type === "matching") {
      const pairs = q.pairs || [];
      const allMatch = pairs.length > 0 && pairs.every(p => ans?.[p?.left] === p?.right);
      if (allMatch) correct++;
    } else if (q.type === "written") {
      const expected = (q.correct_answer || "").toLowerCase().trim();
      const given = (ans || "").toLowerCase().trim();
      if (given && (given === expected || expected.includes(given) || given.includes(expected))) correct++;
    }
  });
  return correct;
}

function isQuestionAnswered(q, ans) {
  if (!q || ans === undefined || ans === null) return false;
  if (q.type === "matching") {
    const pairs = q.pairs || [];
    return pairs.length > 0 && pairs.every(p => ans[p?.left]);
  }
  if (q.type === "written") return String(ans || "").trim().length > 0;
  return true;
}

function WrittenQuestion({ q, answer, onAnswer }) {
  const textareaRef = useRef(null);
  const lang = detectLanguage(q?.correct_answer || "");

  const handleKey = (char) => {
    onAnswer((answer || "") + char);
    textareaRef.current?.focus();
  };
  const handleBackspace = () => {
    onAnswer((answer || "").slice(0, -1));
    textareaRef.current?.focus();
  };
  const handleSpace = () => {
    onAnswer((answer || "") + " ");
    textareaRef.current?.focus();
  };

  return (
    <>
      <p className="font-semibold text-sm mb-3"><LatexRenderer text={q?.question || ""} /></p>
      <textarea
        ref={textareaRef}
        value={answer || ""}
        onChange={e => onAnswer(e.target.value)}
        placeholder="Type your answer..."
        rows={2}
        className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none mb-2"
        style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
      />
      {lang && (
        <LanguageKeyboard
          lang={lang}
          onKey={handleKey}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
        />
      )}
    </>
  );
}

export default function TestMode({ cards = [], deck, user, config, onExit }) {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  useEffect(() => {
    generate();
  }, [cards, config]);

  const generate = async () => {
    if (!cards || cards.length === 0 || !config || !config.questionTypes) {
      setErrorMsg("Missing or invalid configuration data.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    startTime.current = Date.now();

    try {
      // Isolate usage tracking
      try {
        await incrementAiUsage(user?.email, false, 0.5);
      } catch (usageError) {
        console.error("Non-fatal usage tracker error caught:", usageError);
      }

      // Reverting to direct callAI. Your lynxApi file automatically falls back
      // down its chain (Lynx -> Gemini -> Cohere -> Big Pickle -> Claude -> Base44)
      // when Lynx yields 502 status errors!
      const resp = await callAI({
        prompt: buildPrompt(cards, config),
        feature: "test_mode",
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  question: { type: "string" },
                  statement: { type: "string" },
                  is_true: { type: "boolean" },
                  options: { type: "array", items: { type: "string" } },
                  correct: { type: "number" },
                  correct_answer: { type: "string" },
                  pairs: { type: "array", items: { type: "object", properties: { left: { type: "string" }, right: { type: "string" } } } },
                },
                required: ["type"]
              }
            }
          },
          required: ["questions"]
        }
      });

      let parsedData = resp;
      if (typeof resp === "string") {
        parsedData = JSON.parse(resp);
      }

      if (parsedData?.questions && Array.isArray(parsedData.questions)) {
        setQuestions(parsedData.questions);
      } else {
        throw new Error("Invalid question structure parsed from API");
      }
    } catch (err) {
      console.error("Test generation failed:", err);
      setErrorMsg(t?.('errorGeneratingTest') || "Failed to generate test questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ADDED: The missing submit function that was causing the ReferenceError crash
  const submit = () => {
    setSubmitted(true);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={bgStyle}>
      <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      <p className="font-semibold">{t?.('generatingTest') || "Generating your test..."}</p>
    </div>
  );

  if (errorMsg) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" style={bgStyle}>
      <p className="text-red-400 font-semibold">{errorMsg}</p>
      <div className="flex gap-3">
        <button onClick={generate} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all">
          Retry
        </button>
        <button onClick={onExit} className="px-5 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: "var(--app-border)" }}>
          {t?.('back') || "Go Back"}
        </button>
      </div>
    </div>
  );

  if (submitted) {
    const correct = gradeAnswers(questions, answers);
    const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    return (
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-xl mx-auto">
          <div className="text-center rounded-3xl p-8 mb-6" style={cardStyle}>
            <BookmarkCheck className="w-12 h-12 mx-auto mb-3 text-violet-400" />
            <div className="text-5xl font-black text-violet-400 mb-1">{score}%</div>
            <p className="font-bold">{correct}/{questions.length} {t?.('correct') || "Correct"}</p>
            <p className="text-sm mt-1" style={mutedStyle}>
              {score >= 80 ? t?.('excellentWork') : score >= 60 ? t?.('goodEffort') : t?.('keepPracticing')}
            </p>
          </div>
          <div className="space-y-4 mb-6">
            {questions.map((q, i) => {
              if (!q) return null;
              const ans = answers[i];
              let isCorrect = false;
              if (q.type === "multiple_choice") isCorrect = ans === q.correct;
              else if (q.type === "true_false") isCorrect = ans === q.is_true;
              else if (q.type === "matching") isCorrect = (q.pairs || []).every(p => ans?.[p?.left] === p?.right);
              else if (q.type === "written") {
                const expected = (q.correct_answer || "").toLowerCase().trim();
                const given = (ans || "").toLowerCase().trim();
                isCorrect = given && (given === expected || expected.includes(given) || given.includes(expected));
              }
              return (
                <div key={i} className="rounded-2xl p-4" style={cardStyle}>
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect
                      ? <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      : <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                    <p className="text-sm font-semibold">
                      {q.type === "true_false" ? <LatexRenderer text={q.statement || ""} /> : q.type === "matching" ? "Matching" : <LatexRenderer text={q.question || ""} />}
                    </p>
                  </div>
                  {q.type === "multiple_choice" && (
                    <div className="space-y-1">
                      {(q.options || []).map((opt, j) => (
                        <div key={j} className={`px-3 py-1.5 rounded-lg text-xs ${j === q.correct ? "bg-emerald-500/15 text-emerald-400" : ans === j && j !== q.correct ? "bg-red-500/15 text-red-400" : ""}`}
                          style={j !== q.correct && !(ans === j) ? { color: "var(--app-text-muted)" } : {}}>
                          <LatexRenderer text={opt || ""} />
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === "true_false" && (
                    <p className="text-xs mt-1" style={mutedStyle}>
                      Correct: <strong>{q.is_true ? "True" : "False"}</strong> · You: <strong>{ans === undefined ? "—" : ans ? "True" : "False"}</strong>
                    </p>
                  )}
                  {q.type === "written" && (
                    <div className="text-xs mt-1 space-y-0.5">
                      <p style={mutedStyle}>Your answer: <strong>{ans || "—"}</strong></p>
                      <p className="text-emerald-400">Correct: <strong><LatexRenderer text={q.correct_answer || ""} /></strong></p>
                    </div>
                  )}
                  {q.type === "matching" && (
                    <div className="text-xs mt-1 space-y-1">
                      {(q.pairs || []).map((p, j) => (
                        <div key={j} className="flex gap-2">
                          <span style={mutedStyle}>{p?.left} →</span>
                          <span className={ans?.[p?.left] === p?.right ? "text-emerald-400" : "text-red-400"}>{ans?.[p?.left] || "—"}</span>
                          {ans?.[p?.left] !== p?.right && <span className="text-emerald-400">(✓ {p?.right})</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => exportTestPdf({ title: `${deck?.title || "Practice"} — Test`, deckTitle: deck?.title, questions, includeAnswerKey: true })}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm border transition-all text-violet-400 hover:bg-violet-500/10"
              style={{ border: "1px solid rgba(139,92,246,0.4)" }}
            >
              <Download className="w-4 h-4" /> Export PDF + Key
            </button>
            <button onClick={onExit} className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-2xl font-bold transition-all">
              <ArrowRight className="w-4 h-4" /> {t?.('backToDeck') || "Back to Deck"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter((q, i) => isQuestionAnswered(q, answers[i])).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onExit} className="text-sm font-medium" style={mutedStyle}>← {t?.('back') || "Back"}</button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportTestPdf({ title: `${deck?.title || "Practice"} — Test`, deckTitle: deck?.title, questions, includeAnswerKey: false })}
              className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
            <span className="text-sm font-semibold" style={mutedStyle}>{answeredCount}/{questions.length} {t?.('answered') || "Answered"}</span>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          {questions.map((q, i) => {
            if (!q || !q.type) return null;
            return (
              <div key={i} className="rounded-2xl p-4" style={cardStyle}>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide opacity-50">
                  {q.type.replace("_", " ")} · Q{i + 1}
                </p>

                {q.type === "multiple_choice" && (
                  <>
                    <p className="font-semibold text-sm mb-3"><LatexRenderer text={q.question || ""} /></p>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, j) => (
                        <button key={j} onClick={() => setAnswers(prev => ({ ...prev, [i]: j }))}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all ${answers[i] === j ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "hover:bg-white/[0.03]"}`}
                          style={{ borderColor: answers[i] === j ? "" : "var(--app-border)" }}>
                          <LatexRenderer text={opt || ""} />
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {q.type === "true_false" && (
                  <>
                    <p className="font-semibold text-sm mb-3"><LatexRenderer text={q.statement || ""} /></p>
                    <div className="flex gap-3">
                      {[true, false].map(val => (
                        <button key={String(val)} onClick={() => setAnswers(prev => ({ ...prev, [i]: val }))}
                          className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-all ${answers[i] === val ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "opacity-60 hover:opacity-90"}`}
                          style={{ borderColor: answers[i] === val ? "" : "var(--app-border)" }}>
                          {val ? "True" : "False"}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {q.type === "matching" && (
                  <MatchingQuestion
                    q={q}
                    answer={answers[i]}
                    onAnswer={val => setAnswers(prev => ({ ...prev, [i]: val }))}
                    t={t}
                  />
                )}

                {q.type === "written" && (
                  <WrittenQuestion
                    q={q}
                    answer={answers[i] || ""}
                    onAnswer={val => setAnswers(prev => ({ ...prev, [i]: val }))}
                  />
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={submit}
          disabled={!allAnswered || questions.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-4 rounded-2xl font-bold transition-all"
        >
          <Check className="w-4 h-4" /> {t?.('submitTest') || "Submit Test"}
        </button>
      </div>
    </div>
  );
}