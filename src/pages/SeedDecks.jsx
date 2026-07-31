import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Sparkles, Loader2, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

const DEVELOPER_EMAILS = [
  "yychang100@student.hbuhsd.edu",
  "iychang@uci.edu",
  "ivanychang@gmail.com",
  "yohanyinyuchang@gmail.com",
  "waynechangfamily@gmail.com",
  "yohanychang@gmail.com",
];

const DECK_TOPICS = [
  // Science
  { title: "Cell Biology", subject: "Biology", color: "#10B981", desc: "Cell structure, organelles, and functions" },
  { title: "Human Anatomy", subject: "Biology", color: "#EF4444", desc: "Body systems, organs, and functions" },
  { title: "Genetics & DNA", subject: "Biology", color: "#8B5CF6", desc: "Heredity, genes, chromosomes, and mutations" },
  { title: "Photosynthesis & Respiration", subject: "Biology", color: "#22C55E", desc: "Energy processes in living things" },
  { title: "Ecosystems & Environment", subject: "Biology", color: "#84CC16", desc: "Food webs, biomes, and ecology" },
  { title: "Chemistry Basics", subject: "Chemistry", color: "#F59E0B", desc: "Atoms, molecules, elements, and bonds" },
  { title: "Periodic Table Elements", subject: "Chemistry", color: "#FB923C", desc: "Key elements, symbols, and properties" },
  { title: "Physics: Forces & Motion", subject: "Physics", color: "#3B82F6", desc: "Newton's laws, velocity, acceleration" },
  { title: "Physics: Electricity & Magnetism", subject: "Physics", color: "#EAB308", desc: "Circuits, fields, and electromagnetic principles" },
  { title: "Astronomy & Space", subject: "Science", color: "#7C3AED", desc: "Solar system, stars, galaxies, and universe" },
  // History
  { title: "World War II", subject: "History", color: "#6B7280", desc: "Key events, leaders, battles, and outcomes" },
  { title: "American Revolution", subject: "US History", color: "#DC2626", desc: "Causes, events, and founding of the USA" },
  { title: "Ancient Rome", subject: "History", color: "#D97706", desc: "Republic, empire, culture, and decline" },
  { title: "Cold War", subject: "History", color: "#1D4ED8", desc: "US-USSR tensions, key events, and the Space Race" },
  { title: "French Revolution", subject: "History", color: "#2563EB", desc: "Causes, phases, key figures, and impact" },
  { title: "Ancient Egypt", subject: "History", color: "#B45309", desc: "Pharaohs, culture, religion, and monuments" },
  { title: "World War I", subject: "History", color: "#374151", desc: "Causes, trench warfare, key battles, aftermath" },
  { title: "Civil Rights Movement", subject: "US History", color: "#7C3AED", desc: "Leaders, events, legislation, and impact" },
  // Math
  { title: "Algebra Fundamentals", subject: "Mathematics", color: "#6366F1", desc: "Variables, equations, and algebraic thinking" },
  { title: "Geometry Basics", subject: "Mathematics", color: "#14B8A6", desc: "Shapes, angles, theorems, and proofs" },
  { title: "Trigonometry", subject: "Mathematics", color: "#F97316", desc: "Sine, cosine, tangent, and identities" },
  { title: "Statistics & Probability", subject: "Mathematics", color: "#06B6D4", desc: "Data analysis, distributions, and chance" },
  { title: "Calculus Concepts", subject: "Mathematics", color: "#8B5CF6", desc: "Limits, derivatives, integrals, and applications" },
  // Computer Science
  { title: "Python Programming", subject: "Computer Science", color: "#3B82F6", desc: "Syntax, data types, loops, functions" },
  { title: "Data Structures", subject: "Computer Science", color: "#6D28D9", desc: "Arrays, trees, graphs, and complexity" },
  { title: "Web Development HTML/CSS", subject: "Computer Science", color: "#EC4899", desc: "Tags, selectors, layouts, and responsive design" },
  { title: "Algorithms", subject: "Computer Science", color: "#0EA5E9", desc: "Sorting, searching, recursion, and Big O" },
  // Languages
  { title: "Spanish: Basics", subject: "Spanish", color: "#EF4444", desc: "Common vocabulary, greetings, and phrases" },
  { title: "French: Basics", subject: "French", color: "#1D4ED8", desc: "Common vocabulary, greetings, and phrases" },
  { title: "Japanese: Hiragana & Katakana", subject: "Japanese", color: "#EC4899", desc: "Japanese phonetic alphabets and basic words" },
  { title: "Latin Roots & Vocabulary", subject: "Latin", color: "#92400E", desc: "Common Latin roots and English derivatives" },
  // English / Literature
  { title: "Literary Terms & Devices", subject: "English", color: "#A855F7", desc: "Metaphor, irony, alliteration, and more" },
  { title: "English Grammar", subject: "English", color: "#10B981", desc: "Parts of speech, punctuation, sentence structure" },
  { title: "SAT Vocabulary", subject: "SAT Prep", color: "#7C3AED", desc: "High-frequency SAT words with definitions" },
  // Social Studies
  { title: "US Government & Civics", subject: "Government", color: "#1E40AF", desc: "Branches of government, Constitution, rights" },
  { title: "World Geography", subject: "Geography", color: "#059669", desc: "Countries, capitals, continents, and landmarks" },
  { title: "Economics Basics", subject: "Economics", color: "#D97706", desc: "Supply, demand, markets, and economic concepts" },
  { title: "Philosophy: Key Concepts", subject: "Philosophy", color: "#4B5563", desc: "Major philosophers, schools of thought, ethics" },
  // Health & Psychology
  { title: "Psychology Fundamentals", subject: "Psychology", color: "#DB2777", desc: "Brain, behavior, theories, and famous studies" },
  { title: "Nutrition & Health", subject: "Health", color: "#16A34A", desc: "Macronutrients, vitamins, diet, and wellness" },
];

export default function SeedDecks() {
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(null); // null=loading, true/false

  useEffect(() => {
    db.auth.me().then(me => {
      setAuthorized(DEVELOPER_EMAILS.includes(me.email));
    }).catch(() => setAuthorized(false));
  }, []);

  const seedAll = async () => {
    setSeeding(true);
    setProgress([]);
    setError(null);
    setDone(false);

    let me;
    try { me = await db.auth.me(); } catch (e) { setError("Not logged in"); setSeeding(false); return; }

    for (let i = 0; i < DECK_TOPICS.length; i++) {
      const topic = DECK_TOPICS[i];
      setProgress(prev => [...prev, { topic: topic.title, status: "generating" }]);

      try {
        const resp = await db.integrations.Core.InvokeLLM({
          prompt: `Create exactly 25 high-quality, educational flashcards for the topic: "${topic.title}" (${topic.desc}).\n\nMake the cards varied: mix definitions, key facts, cause-and-effect, people/events, and conceptual questions. Make them genuinely useful for students.\n\nReturn JSON only.`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              cards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    front: { type: "string" },
                    back: { type: "string" }
                  }
                }
              }
            }
          }
        });

        const cards = resp?.cards || [];
        if (cards.length > 0) {
          const deck = await db.entities.Deck.create({
            title: topic.title,
            subject: topic.subject,
            description: topic.desc,
            color: topic.color,
            card_count: cards.length,
            is_public: true,
            author_name: "Cognita",
            author_email: me.email,
          });
          await db.entities.Flashcard.bulkCreate(
            cards.map(c => ({ front: c.front, back: c.back, deck_id: deck.id, author_email: me.email }))
          );
          setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: "done", count: cards.length } : p));
        } else {
          setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: "error" } : p));
        }
      } catch {
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: "error" } : p));
      }
    }
    setDone(true);
    setSeeding(false);
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (authorized === null) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
    </div>
  );

  if (!authorized) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={bgStyle}>
      <ShieldAlert className="w-12 h-12 text-red-400" />
      <h1 className="text-2xl font-black">Access Denied</h1>
      <p className="text-sm text-center" style={mutedStyle}>This page is restricted to developers only.</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-3" />
          <h1 className="text-3xl font-black mb-2">Seed Starter Decks</h1>
          <p className="text-sm" style={mutedStyle}>Generate {DECK_TOPICS.length} public starter decks with 25 AI-generated cards each. This will use AI credits and take a few minutes.</p>
        </div>

        {!seeding && !done && (
          <div className="text-center">
            <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
              <p className="text-sm mb-4" style={mutedStyle}><strong>Topics:</strong> Biology, Chemistry, Physics, History, Math, Computer Science, Languages, English, Social Studies, Psychology, and more.</p>
              <p className="text-xs text-emerald-400 font-semibold mb-2">✅ Developer mode — 0 AI credits charged. Takes ~5–10 minutes. Run once only.</p>
            </div>
            <button
              onClick={seedAll}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-lg transition-all"
            >
              🚀 Generate All {DECK_TOPICS.length} Decks
            </button>
          </div>
        )}

        {(seeding || done) && (
          <div className="space-y-2">
            {done && (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <p className="font-bold text-emerald-400">All decks generated successfully!</p>
              </div>
            )}
            {progress.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={cardStyle}>
                {p.status === "generating" && <Loader2 className="w-4 h-4 text-violet-400 animate-spin shrink-0" />}
                {p.status === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {p.status === "error" && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                <span className="text-sm font-medium flex-1">{p.topic}</span>
                {p.status === "done" && <span className="text-xs text-emerald-400">{p.count} cards</span>}
                {p.status === "generating" && <span className="text-xs" style={mutedStyle}>generating...</span>}
                {p.status === "error" && <span className="text-xs text-red-400">failed</span>}
              </div>
            ))}
            {seeding && progress.length < DECK_TOPICS.length && (
              <div className="flex items-center gap-3 p-3 rounded-xl opacity-40" style={cardStyle}>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span className="text-sm">{DECK_TOPICS.length - progress.length} more to go...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}