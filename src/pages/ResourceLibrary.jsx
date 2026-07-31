import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { BookOpen, Loader2, Search, Sparkles, ArrowRight, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { canUseAi, incrementAiUsage } from "../components/aiUsageLimit";

const SUBJECTS = [
  { label: "Mathematics", emoji: "📐", topics: ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry", "Linear Algebra"] },
  { label: "Sciences", emoji: "🔬", topics: ["Biology", "Chemistry", "Physics", "Anatomy", "Environmental Science", "Biochemistry"] },
  { label: "History", emoji: "🏛️", topics: ["US History", "World History", "Ancient History", "Modern History", "Economics History"] },
  { label: "Languages", emoji: "🌍", topics: ["Spanish Vocabulary", "French Vocabulary", "German Vocabulary", "Japanese", "Mandarin", "Latin"] },
  { label: "Computer Science", emoji: "💻", topics: ["Python", "JavaScript", "Data Structures", "Algorithms", "SQL", "Machine Learning"] },
  { label: "Medicine & Health", emoji: "🩺", topics: ["Pharmacology", "Anatomy & Physiology", "Medical Terminology", "Nursing", "MCAT Prep"] },
  { label: "Law", emoji: "⚖️", topics: ["Constitutional Law", "Contract Law", "Criminal Law", "Civil Procedure", "Torts"] },
  { label: "Business", emoji: "💼", topics: ["Accounting", "Marketing", "Economics", "Finance", "Management", "Business Ethics"] },
  { label: "SAT / ACT Prep", emoji: "📝", topics: ["SAT Math", "SAT Reading", "ACT Science", "ACT English", "Vocabulary"] },
  { label: "AP Courses", emoji: "🎓", topics: ["AP Biology", "AP Chemistry", "AP US History", "AP Calculus AB", "AP Psychology", "AP English"] },
];

export default function ResourceLibrary() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [openSubject, setOpenSubject] = useState(null);
  const [generating, setGenerating] = useState(null);
  const [generatedDecks, setGeneratedDecks] = useState({});
  const [savedDecks, setSavedDecks] = useState({});

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => {});
  }, []);

  const generateDeck = async (topic) => {
    if (generating || !canUseAi(user?.email)) return;
    setGenerating(topic);
    incrementAiUsage(user?.email, false, 1);

    const resp = await db.integrations.Core.InvokeLLM({
      prompt: `Create 20 high-quality flashcards for the topic: "${topic}". These should be useful for studying and cover the most important concepts, terms, and facts.

Return JSON with:
- "title": deck title (string)
- "description": brief description (string)  
- "cards": array of 20 objects each with "front" (question/term) and "back" (answer/definition)`,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          cards: { type: "array", items: { type: "object", properties: { front: { type: "string" }, back: { type: "string" } } } }
        }
      }
    });

    setGeneratedDecks(prev => ({ ...prev, [topic]: resp }));
    setGenerating(null);
  };

  const saveDeck = async (topic) => {
    const data = generatedDecks[topic];
    if (!data || savedDecks[topic]) return;
    const deck = await db.entities.Deck.create({
      title: data.title,
      description: data.description,
      subject: topic,
      card_count: data.cards.length,
      author_name: "Cognita Resource Library",
      author_email: user?.email || "",
      is_public: false,
    });
    await db.entities.Flashcard.bulkCreate(data.cards.map(c => ({ ...c, deck_id: deck.id, author_email: user?.email || "" })));
    setSavedDecks(prev => ({ ...prev, [topic]: deck }));
  };

  const filtered = search.trim()
    ? SUBJECTS.map(s => ({ ...s, topics: s.topics.filter(t => t.toLowerCase().includes(search.toLowerCase())) })).filter(s => s.topics.length > 0)
    : SUBJECTS;

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-2xl font-black">Resource Library</h1>
        </div>
        <p className="text-sm mb-6" style={mutedStyle}>Browse hundreds of subject topics — click any to instantly generate a free AI-powered flashcard deck.</p>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
          />
        </div>

        <div className="space-y-3">
          {filtered.map(subject => (
            <div key={subject.label} className="rounded-2xl overflow-hidden" style={cardStyle}>
              <button
                onClick={() => setOpenSubject(openSubject === subject.label ? null : subject.label)}
                className="w-full flex items-center gap-3 p-4 text-left transition-all hover:opacity-90"
              >
                <span className="text-2xl">{subject.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">{subject.label}</p>
                  <p className="text-xs" style={mutedStyle}>{subject.topics.length} topics</p>
                </div>
                {openSubject === subject.label
                  ? <ChevronUp className="w-4 h-4 shrink-0" style={mutedStyle} />
                  : <ChevronDown className="w-4 h-4 shrink-0" style={mutedStyle} />}
              </button>

              {openSubject === subject.label && (
                <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subject.topics.map(topic => {
                    const generated = generatedDecks[topic];
                    const saved = savedDecks[topic];
                    const isGenerating = generating === topic;
                    return (
                      <div key={topic} className="rounded-2xl p-4" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="w-4 h-4 text-violet-400 shrink-0" />
                          <p className="font-semibold text-sm">{topic}</p>
                        </div>

                        {saved ? (
                          <Link to={createPageUrl(`Study?deck_id=${saved.id}`)}>
                            <button className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-emerald-600/30">
                              <ArrowRight className="w-3.5 h-3.5" /> Study Now
                            </button>
                          </Link>
                        ) : generated ? (
                          <div className="space-y-2">
                            <p className="text-xs" style={mutedStyle}>{generated.cards?.length} cards ready</p>
                            <button
                              onClick={() => saveDeck(topic)}
                              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-xl text-xs font-semibold transition-all"
                            >
                              Save to My Decks
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => generateDeck(topic)}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-60"
                          >
                            {isGenerating
                              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                              : <><Sparkles className="w-3.5 h-3.5" /> Generate 20 Cards</>}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}