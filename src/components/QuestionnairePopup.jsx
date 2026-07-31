import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

const DISMISSED_KEY = "cognita_questionnaire_dismissed";
const SESSION_CHECKED_KEY = "cognita_questionnaire_checked";

export default function QuestionnairePopup({ user }) {
  const [questionnaire, setQuestionnaire] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    // Only check once per browser session to avoid rate limiting
    if (sessionStorage.getItem(SESSION_CHECKED_KEY)) return;
    sessionStorage.setItem(SESSION_CHECKED_KEY, "1");
    loadQuestionnaire();
  }, [user]);

  const loadQuestionnaire = async () => {
    // Only show after user has logged in 3+ times
    const loginEvents = await db.entities.UserLoginEvent.filter({ user_email: user.email });
    if (loginEvents.length < 3) return;

    const dismissed = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
    const all = await db.entities.Questionnaire.filter({ active: true }, "-created_date", 10);
    
    // Find one the user hasn't answered yet
    const responses = await db.entities.QuestionnaireResponse.filter({ user_email: user.email });
    const answeredIds = new Set(responses.map(r => r.questionnaire_id));
    
    const pending = all.find(q => !answeredIds.has(q.id) && !dismissed.includes(q.id));
    if (pending) {
      setQuestionnaire(pending);
      setVisible(true);
    }
  };

  const dismiss = () => {
    const dismissed = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
    if (questionnaire) dismissed.push(questionnaire.id);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
    setVisible(false);
  };

  const submit = async () => {
    setSubmitting(true);
    await db.entities.QuestionnaireResponse.create({
      questionnaire_id: questionnaire.id,
      user_email: user.email,
      answers: Object.entries(answers).map(([question_id, value]) => ({ question_id, value })),
    });
    setSubmitted(true);
    setTimeout(() => setVisible(false), 2000);
    setSubmitting(false);
  };

  const updateAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  if (!questionnaire) return null;

  const questions = questionnaire.questions || [];
  const allAnswered = questions.every(q => answers[q.id]?.toString().trim());

  return (
    <AnimatePresence>
      {visible && (
        <>
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" onClick={dismiss} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md rounded-3xl shadow-2xl pointer-events-auto overflow-hidden"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div>
                  <p className="text-xs font-bold text-violet-400 mb-1">📋 Quick Survey</p>
                  <h2 className="text-lg font-black">{questionnaire.title}</h2>
                  {questionnaire.description && (
                    <p className="text-sm mt-1 opacity-60">{questionnaire.description}</p>
                  )}
                </div>
                <button onClick={dismiss} className="p-1.5 rounded-xl hover:bg-white/10 transition-all opacity-50 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitted ? (
                <div className="px-6 pb-8 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="font-bold text-emerald-400">Thank you for your response!</p>
                </div>
              ) : (
                <div className="px-6 pb-6 space-y-5 max-h-[60vh] overflow-y-auto">
                  {questions.map((q, i) => (
                    <div key={q.id || i}>
                      <p className="text-sm font-semibold mb-2">{i + 1}. {q.text}</p>
                      {q.type === "text" && (
                        <textarea
                          value={answers[q.id] || ""}
                          onChange={e => updateAnswer(q.id, e.target.value)}
                          placeholder="Your answer..."
                          rows={2}
                          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                          style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                        />
                      )}
                      {q.type === "multiple_choice" && (
                        <div className="space-y-2">
                          {(q.options || []).map((opt, j) => (
                            <button
                              key={j}
                              onClick={() => updateAnswer(q.id, opt)}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                answers[q.id] === opt
                                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/40"
                                  : "border hover:opacity-80"
                              }`}
                              style={answers[q.id] !== opt ? { border: "1px solid var(--app-border)", background: "var(--app-bg)" } : {}}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                      {q.type === "rating" && (
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(n => (
                            <button
                              key={n}
                              onClick={() => updateAnswer(q.id, n)}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                answers[q.id] === n
                                  ? "bg-violet-500 text-white"
                                  : "border hover:opacity-80"
                              }`}
                              style={answers[q.id] !== n ? { border: "1px solid var(--app-border)", background: "var(--app-bg)" } : {}}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={submit}
                    disabled={!allAnswered || submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-40 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
                  >
                    {submitting ? "Submitting..." : <><Send className="w-4 h-4" /> Submit</>}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}