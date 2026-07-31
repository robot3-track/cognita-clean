import { useState } from "react";
import { ClipboardList, Hash, ArrowLeftRight, ToggleLeft, List, Rows, PenLine, X, Sparkles } from "lucide-react";

const QUESTION_TYPES = [
  { id: "true_false", label: "True / False", icon: ToggleLeft, color: "text-amber-400" },
  { id: "multiple_choice", label: "Multiple Choice", icon: List, color: "text-blue-400" },
  { id: "matching", label: "Matching", icon: Rows, color: "text-emerald-400" },
  { id: "written", label: "Written", icon: PenLine, color: "text-pink-400" },
];

export default function TestSetup({ cards, onStart, onCancel }) {
  const maxCards = cards.length;
  const [questionCount, setQuestionCount] = useState(Math.min(20, maxCards));
  const [answerWith, setAnswerWith] = useState("answer"); // "answer" | "question" | "both"
  const [selectedTypes, setSelectedTypes] = useState(["multiple_choice"]);

  const toggleType = (id) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(t => t !== id) : prev) : [...prev, id]
    );
  };

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-violet-400" />
            <h2 className="text-2xl font-black">Test Setup</h2>
          </div>
          <button onClick={onCancel} className="p-2 rounded-xl opacity-50 hover:opacity-100 transition-all"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-5">
          {/* Question Count */}
          <div className="rounded-2xl p-4" style={cardStyle}>
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-violet-400" />
              <span className="font-semibold text-sm">Number of Questions</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={maxCards}
                value={questionCount}
                onChange={e => setQuestionCount(Number(e.target.value))}
                className="flex-1 accent-violet-500"
              />
              <span className="text-xl font-black text-violet-400 w-12 text-right">{questionCount}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={mutedStyle}>1</span>
              <span className="text-xs" style={mutedStyle}>{maxCards} (all cards)</span>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {[5, 10, 20, maxCards].filter((n, i, arr) => n <= maxCards && arr.indexOf(n) === i).map(n => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${questionCount === n ? "bg-violet-500/20 border-violet-500/40 text-violet-400" : ""}`}
                  style={questionCount !== n ? { borderColor: "var(--app-border)" } : {}}
                >
                  {n === maxCards ? `All (${n})` : n}
                </button>
              ))}
            </div>
          </div>

          {/* Answer With */}
          <div className="rounded-2xl p-4" style={cardStyle}>
            <div className="flex items-center gap-2 mb-3">
              <ArrowLeftRight className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-sm">Answer With</span>
            </div>
            <div className="flex gap-2">
              {[
                { id: "answer", label: "Definition" },
                { id: "question", label: "Term" },
                { id: "both", label: "Both" },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAnswerWith(opt.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${answerWith === opt.id ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "opacity-60 hover:opacity-90"}`}
                  style={answerWith !== opt.id ? { borderColor: "var(--app-border)" } : {}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={mutedStyle}>
              {answerWith === "answer" ? "Questions show the term, you answer with the definition." :
               answerWith === "question" ? "Questions show the definition, you answer with the term." :
               "Mix of both directions."}
            </p>
          </div>

          {/* Question Types */}
          <div className="rounded-2xl p-4" style={cardStyle}>
            <p className="font-semibold text-sm mb-3">Question Types</p>
            <div className="grid grid-cols-2 gap-2">
              {QUESTION_TYPES.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => toggleType(id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypes.includes(id) ? "border-violet-500/40 bg-violet-500/10" : "opacity-50 hover:opacity-80"}`}
                  style={!selectedTypes.includes(id) ? { borderColor: "var(--app-border)" } : {}}
                >
                  <Icon className={`w-4 h-4 ${selectedTypes.includes(id) ? color : ""}`} />
                  <span>{label}</span>
                  {selectedTypes.includes(id) && <span className="ml-auto text-violet-400">✓</span>}
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={mutedStyle}>Select one or more types to include.</p>
          </div>

          <button
            onClick={() => onStart({ questionCount, answerWith, questionTypes: selectedTypes })}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-2xl font-bold text-sm transition-all"
          >
            <Sparkles className="w-4 h-4" /> Start Test
          </button>
        </div>
      </div>
    </div>
  );
}