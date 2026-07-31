import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { CalendarDays, Loader2, Sparkles, Check, ChevronDown, ChevronUp, Save, Trash2, List } from "lucide-react";
import { canUseAi, incrementAiUsage } from "../components/aiUsageLimit";
import { useTranslation } from "../hooks/useTranslation";
import StudyCalendar from "../components/StudyCalendar";
import { callAI } from "../lib/lynxApi";

const STORAGE_KEY = "cognita_study_roadmap";

export default function StudyRoadmap() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [publicDecks, setPublicDecks] = useState([]);
  const [deckSource, setDeckSource] = useState("mine"); // "mine" | "community"
  const [selectedDeck, setSelectedDeck] = useState("");
  const [examDate, setExamDate] = useState("");
  const [customText, setCustomText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [expandedDay, setExpandedDay] = useState(0);
  const [completed, setCompleted] = useState({});
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [view, setView] = useState("roadmap"); // "roadmap" | "calendar"

  useEffect(() => {
    db.auth.me().then(async (me) => {
      setUser(me);
      const [mine, community] = await Promise.all([
        db.entities.Deck.filter({ created_by: me.email }, "-updated_date", 50),
        db.entities.Deck.filter({ is_public: true }, "-updated_date", 50),
      ]);
      setDecks(mine);
      setPublicDecks(community);
    });
    // Load saved roadmaps from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSavedRoadmaps(saved);
    } catch {}
  }, []);

  const generate = async () => {
    if (!examDate) return;
    if (!canUseAi(user?.email)) {
      alert("You've reached your daily AI limit. Come back tomorrow or earn more credits via Surveys!");
      return;
    }
    setGenerating(true);
    incrementAiUsage(user?.email);

    const today = new Date();
    const exam = new Date(examDate);
    const daysUntilExam = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));
    const allDecks = [...decks, ...publicDecks];
    const deck = allDecks.find(d => d.id === selectedDeck);
    const deckInfo = deck ? `Flashcard deck: "${deck.title}" with ${deck.card_count || 0} cards.` : "";
    const textInfo = customText.trim() ? `Additional content: ${customText.slice(0, 500)}` : "";

    const resp = await callAI({
      prompt: `Create a ${Math.min(daysUntilExam, 14)}-day study roadmap for a student who has ${daysUntilExam} days until their exam.
${deckInfo}
${textInfo}
Generate a day-by-day plan. Each day should have specific, actionable tasks mixing different study methods.
Keep days concise — 2-4 tasks per day maximum.`,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          days: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "number" },
                date_label: { type: "string" },
                theme: { type: "string" },
                tasks: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      },
      feature: "study_roadmap",
    });

    setRoadmap(resp);
    setExpandedDay(0);
    setCompleted({});
    setGenerating(false);
  };

  const toggleTask = (dayIdx, taskIdx) => {
    const key = `${dayIdx}-${taskIdx}`;
    setCompleted(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveRoadmap = () => {
    if (!roadmap) return;
    const entry = { ...roadmap, savedAt: new Date().toISOString(), examDate };
    const updated = [entry, ...savedRoadmaps].slice(0, 10);
    setSavedRoadmaps(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteSaved = (idx) => {
    const updated = savedRoadmaps.filter((_, i) => i !== idx);
    setSavedRoadmaps(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const loadSaved = (entry) => {
    setRoadmap(entry);
    setExamDate(entry.examDate || "");
    setExpandedDay(0);
    setCompleted({});
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-2xl font-black">{t('roadmap')}</h1>
        </div>
        <p className="text-sm mb-5" style={mutedStyle}>Tell us your exam date and the AI will build a day-by-day study plan for you.</p>

        {/* View toggle */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
          <button
            onClick={() => setView("roadmap")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${view === "roadmap" ? "bg-violet-600 text-white" : "opacity-50 hover:opacity-80"}`}
          >
            <List className="w-4 h-4" /> AI Roadmap
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${view === "calendar" ? "bg-blue-600 text-white" : "opacity-50 hover:opacity-80"}`}
          >
            <CalendarDays className="w-4 h-4" /> Calendar
          </button>
        </div>

        {view === "calendar" && (
          <StudyCalendar roadmapDays={roadmap?.days || []} examDate={examDate} />
        )}

        {view === "roadmap" && !roadmap && (
          <div className="rounded-3xl p-6 mb-6 space-y-4" style={cardStyle}>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={mutedStyle}>{t('examDateLabel')} *</label>
              <input
                type="date"
                value={examDate}
                min={todayStr}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={mutedStyle}>{t('deckOptionalLabel')} (optional)</label>
              {/* Source toggle */}
              <div className="flex gap-1 p-1 rounded-xl mb-2" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                <button
                  onClick={() => { setDeckSource("mine"); setSelectedDeck(""); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${deckSource === "mine" ? "bg-violet-600 text-white" : "opacity-50 hover:opacity-80"}`}
                >My Decks</button>
                <button
                  onClick={() => { setDeckSource("community"); setSelectedDeck(""); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${deckSource === "community" ? "bg-blue-600 text-white" : "opacity-50 hover:opacity-80"}`}
                >Community</button>
              </div>
              <select
                value={selectedDeck}
                onChange={e => setSelectedDeck(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
              >
                <option value="">-- Select a deck --</option>
                {(deckSource === "mine" ? decks : publicDecks).map(d => (
                  <option key={d.id} value={d.id}>{d.title} ({d.card_count || 0} cards){deckSource === "community" && d.author_name ? ` · ${d.author_name}` : ""}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={mutedStyle}>{t('whatAreYouStudying')}</label>
              <textarea
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="e.g. AP Biology Chapter 4-8, Calculus derivatives and integrals..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
              />
            </div>

            <button
              onClick={generate}
              disabled={!examDate || generating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 text-white py-4 rounded-2xl font-semibold transition-all"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? t('buildingRoadmap') : t('generateRoadmapBtn')}
            </button>
          </div>
        )}

        {/* Saved roadmaps */}
        {view === "roadmap" && !roadmap && savedRoadmaps.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold mb-2" style={mutedStyle}>{t('savedRoadmaps')}</h3>
            <div className="space-y-2">
              {savedRoadmaps.map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl p-3" style={cardStyle}>
                  <button onClick={() => loadSaved(r)} className="flex-1 text-left">
                    <p className="text-sm font-semibold">{r.title}</p>
                    <p className="text-xs" style={mutedStyle}>Exam: {r.examDate} · Saved {new Date(r.savedAt).toLocaleDateString()}</p>
                  </button>
                  <button onClick={() => deleteSaved(i)} className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "roadmap" && roadmap && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg">{roadmap.title}</h2>
              <div className="flex items-center gap-2">
                <button onClick={saveRoadmap} className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
                  <Save className="w-3.5 h-3.5" /> {t('save')}
                </button>
                <button onClick={() => setRoadmap(null)} className="text-xs text-violet-400 hover:text-violet-300">{t('newPlanBtn')}</button>
              </div>
            </div>
            <div className="space-y-3">
              {roadmap.days?.map((day, dayIdx) => {
                const completedTasks = day.tasks?.filter((_, tIdx) => completed[`${dayIdx}-${tIdx}`]).length || 0;
                const allDone = completedTasks === day.tasks?.length;
                return (
                  <div key={dayIdx} className="rounded-2xl overflow-hidden" style={cardStyle}>
                    <button
                      onClick={() => setExpandedDay(expandedDay === dayIdx ? -1 : dayIdx)}
                      className="w-full flex items-center gap-3 p-4 text-left"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black ${allDone ? "bg-emerald-500/20 text-emerald-400" : "bg-violet-500/15 text-violet-400"}`}>
                        {allDone ? <Check className="w-4 h-4" /> : day.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{day.date_label}</p>
                        <p className="text-xs" style={mutedStyle}>{day.theme} · {completedTasks}/{day.tasks?.length} done</p>
                      </div>
                      {expandedDay === dayIdx ? <ChevronUp className="w-4 h-4 shrink-0" style={mutedStyle} /> : <ChevronDown className="w-4 h-4 shrink-0" style={mutedStyle} />}
                    </button>
                    {expandedDay === dayIdx && (
                      <div className="px-4 pb-4 space-y-2">
                        {day.tasks?.map((task, tIdx) => {
                          const key = `${dayIdx}-${tIdx}`;
                          const done = completed[key];
                          return (
                            <button key={tIdx} onClick={() => toggleTask(dayIdx, tIdx)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${done ? "opacity-50" : "hover:opacity-80"}`}
                              style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}
                            >
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${done ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}>
                                {done && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <p className={`text-xs font-medium ${done ? "line-through" : ""}`}>{task}</p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}