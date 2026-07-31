import { db } from '@/lib/firebase';

import { useState } from "react";

import { callAI } from "@/lib/lynxApi";
import { FlaskConical, Loader2, ArrowRight, RotateCcw } from "lucide-react";
import { incrementAiUsage } from "../components/aiUsageLimit";

const EXAMPLES = [
  "H2 + O2 -> H2O",
  "CH4 + O2 -> CO2 + H2O",
  "Fe + O2 -> Fe2O3",
  "Al + HCl -> AlCl3 + H2",
  "C3H8 + O2 -> CO2 + H2O",
  "KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2",
  "Na + H2O -> NaOH + H2",
];

export default function ChemBalance() {
  const [equation, setEquation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const balance = async () => {
    const eq = equation.trim();
    if (!eq) return;
    setLoading(true);
    setResult(null);
    try {
      const user = await db.auth.me();
      incrementAiUsage(user?.email, false, 0.5);
      const resp = await callAI({
        feature: "chem_balance",
        prompt: `Balance the following chemical equation: "${eq}"

Return a JSON object with:
- balanced: the fully balanced equation as a string (use proper coefficients, e.g. "2H₂ + O₂ → 2H₂O")
- reactants: array of objects {formula, coefficient, name} for each reactant
- products: array of objects {formula, coefficient, name} for each product
- type: reaction type (e.g. "Combustion", "Synthesis", "Decomposition", "Single Displacement", "Double Displacement", "Redox")
- explanation: brief step-by-step explanation of how it was balanced (2-4 sentences)
- notes: any important chemistry notes about this reaction (optional, 1-2 sentences)

Use subscript numbers in formulas (H₂O not H2O). If the equation is invalid or cannot be balanced, set balanced to null and explanation to an error message.`,
        response_json_schema: {
          type: "object",
          properties: {
            balanced: { type: "string" },
            reactants: { type: "array", items: { type: "object", properties: { formula: { type: "string" }, coefficient: { type: "number" }, name: { type: "string" } } } },
            products: { type: "array", items: { type: "object", properties: { formula: { type: "string" }, coefficient: { type: "number" }, name: { type: "string" } } } },
            type: { type: "string" },
            explanation: { type: "string" },
            notes: { type: "string" },
          }
        }
      });
      setResult(resp);
    } catch {
      setResult({ balanced: null, explanation: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  const typeColors = {
    "Combustion": "bg-orange-500/15 text-orange-400",
    "Synthesis": "bg-blue-500/15 text-blue-400",
    "Decomposition": "bg-red-500/15 text-red-400",
    "Single Displacement": "bg-violet-500/15 text-violet-400",
    "Double Displacement": "bg-purple-500/15 text-purple-400",
    "Redox": "bg-emerald-500/15 text-emerald-400",
    "default": "bg-slate-500/15 text-slate-400",
  };

  return (
    <div className="min-h-screen pb-16 px-4 py-8" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Chemical Equation Balancer</h1>
            <p className="text-xs" style={mutedStyle}>Balance any chemical equation using AI</p>
          </div>
        </div>

        {/* Input */}
        <div className="rounded-3xl p-5 mb-4" style={cardStyle}>
          <label className="text-xs font-bold mb-2 block" style={mutedStyle}>Enter equation (use -&gt; or → for arrow)</label>
          <textarea
            value={equation}
            onChange={e => setEquation(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), balance())}
            placeholder="e.g. H2 + O2 -> H2O"
            rows={2}
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none mb-3"
            style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)", fontFamily: "monospace" }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setEquation(""); setResult(null); }}
              className="p-2.5 rounded-xl hover:opacity-80 transition-all"
              style={cardStyle}
            >
              <RotateCcw className="w-4 h-4" style={mutedStyle} />
            </button>
            <button
              onClick={balance}
              disabled={!equation.trim() || loading}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white py-3 rounded-2xl font-bold text-sm transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
              {loading ? "Balancing..." : "Balance Equation"}
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="mb-6">
          <p className="text-xs font-bold mb-2" style={mutedStyle}>Examples</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => { setEquation(ex); setResult(null); }}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium hover:opacity-80 transition-all"
                style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {result.balanced ? (
              <>
                {/* Balanced equation display */}
                <div className="rounded-3xl p-5" style={{ ...cardStyle, borderColor: "rgba(52,211,153,0.3)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Balanced Equation</p>
                    {result.type && (
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${typeColors[result.type] || typeColors.default}`}>
                        {result.type}
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-black text-center py-3 rounded-2xl"
                    style={{ background: "var(--app-bg)", border: "1px solid rgba(52,211,153,0.2)", color: "var(--app-text)", fontFamily: "monospace", letterSpacing: "0.03em" }}>
                    {result.balanced}
                  </p>
                </div>

                {/* Reactants & Products */}
                {(result.reactants?.length > 0 || result.products?.length > 0) && (
                  <div className="rounded-3xl p-5" style={cardStyle}>
                    <p className="text-xs font-bold mb-3" style={mutedStyle}>Breakdown</p>
                    <div className="flex gap-3 items-start">
                      {/* Reactants */}
                      <div className="flex-1 space-y-2">
                        <p className="text-xs font-semibold text-blue-400">Reactants</p>
                        {result.reactants?.map((r, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                            {r.coefficient > 1 && <span className="text-amber-400 font-black text-sm">{r.coefficient}</span>}
                            <div>
                              <p className="text-sm font-bold" style={{ fontFamily: "monospace" }}>{r.formula}</p>
                              {r.name && <p className="text-[10px]" style={mutedStyle}>{r.name}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <ArrowRight className="w-5 h-5 mt-7 shrink-0 text-emerald-400" />
                      {/* Products */}
                      <div className="flex-1 space-y-2">
                        <p className="text-xs font-semibold text-emerald-400">Products</p>
                        {result.products?.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                            {p.coefficient > 1 && <span className="text-amber-400 font-black text-sm">{p.coefficient}</span>}
                            <div>
                              <p className="text-sm font-bold" style={{ fontFamily: "monospace" }}>{p.formula}</p>
                              {p.name && <p className="text-[10px]" style={mutedStyle}>{p.name}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {result.explanation && (
                  <div className="rounded-3xl p-5" style={cardStyle}>
                    <p className="text-xs font-bold mb-2" style={mutedStyle}>How it was balanced</p>
                    <p className="text-sm leading-relaxed">{result.explanation}</p>
                    {result.notes && (
                      <div className="mt-3 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)", color: "rgb(251,191,36)" }}>
                        💡 {result.notes}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl p-4 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {result.explanation || "Could not balance this equation. Check your input and try again."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}