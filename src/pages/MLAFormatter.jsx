import { useState } from "react";
import { callAI } from "@/lib/lynxApi";
import { Plus, Loader2, Copy, Check, BookOpen, X } from "lucide-react";

export default function MLAFormatter() {
  const [sources, setSources] = useState([{ url: "", extra: "" }]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const addSource = () => setSources(s => [...s, { url: "", extra: "" }]);
  const removeSource = (i) => setSources(s => s.filter((_, idx) => idx !== i));
  const updateSource = (i, field, val) => setSources(s => s.map((src, idx) => idx === i ? { ...src, [field]: val } : src));

  const generate = async () => {
    const validSources = sources.filter(s => s.url.trim());
    if (validSources.length === 0) return;
    setLoading(true);
    setResult("");

    const prompt = `You are an expert MLA citation formatter. Format the following sources into proper MLA 9th edition citations. 

For each source, use what you know about MLA formatting for web sources, books, articles, etc. to produce a correctly formatted MLA 9th edition Works Cited entry. If additional info is provided, use it to fill in any missing fields (author, publisher, date, etc.).

Rules:
- Use MLA 9th edition format (Works Cited page style)
- Hanging indent format (first line flush, subsequent lines indented — indicate with a tab character at start of continuation lines)
- Alphabetize by author's last name or title if no author
- Include access date for web sources in format: Accessed DD Mon. YYYY
- Use proper punctuation and italics markers (*title*)

Sources to cite:
${validSources.map((s, i) => `Source ${i + 1}:\nURL: ${s.url}${s.extra ? `\nAdditional info: ${s.extra}` : ""}`).join("\n\n")}

Return ONLY the formatted Works Cited entries as a plain text block, one per line (use blank line between entries). Start with a "Works Cited" header. Do not wrap inside a markdown code block or JSON structure.`;

    // Fixed callAI parameters to follow the standard `{ feature, prompt }` payload layout
    const response = await callAI({ 
      feature: "mla_formatter", 
      prompt 
    });
    
    setResult(typeof response === "string" ? response : response?.text || JSON.stringify(response));
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">MLA Citation Maker</h1>
            <p className="text-sm opacity-50">MLA 8th/9th Edition — Works Cited Generator</p>
          </div>
        </div>

        <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
          <p className="text-xs font-bold mb-3 uppercase tracking-wider opacity-40">Sources</p>
          <div className="space-y-3">
            {sources.map((src, i) => (
              <div key={i} className="rounded-xl p-3 space-y-2" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold opacity-40 shrink-0 w-6">#{i + 1}</span>
                  <input
                    value={src.url}
                    onChange={e => updateSource(i, "url", e.target.value)}
                    placeholder="URL or website link *"
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                  />
                  {sources.length > 1 && (
                    <button onClick={() => removeSource(i)} className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 shrink-0" />
                  <input
                    value={src.extra}
                    onChange={e => updateSource(i, "extra", e.target.value)}
                    placeholder="Optional: author name, publication date, page numbers, publisher..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={addSource} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold opacity-60 hover:opacity-100 transition-all" style={{ border: "1px solid var(--app-border)" }}>
              <Plus className="w-3.5 h-3.5" /> Add Source
            </button>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !sources.some(s => s.url.trim())}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold text-sm transition-all mb-6"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
          {loading ? "Generating MLA Citations..." : "Generate MLA Citations"}
        </button>

        {loading && (
          <div className="rounded-2xl p-6 text-center" style={cardStyle}>
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-2" />
            <p className="text-sm opacity-50">Fetching source info and formatting citations...</p>
          </div>
        )}

        {result && !loading && (
          <div className="rounded-2xl p-5" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm">Works Cited</p>
              <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all">
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
              </button>
            </div>
            <div className="rounded-xl p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
              {result}
            </div>
            <p className="text-xs mt-3 opacity-40">* Review citations for accuracy. AI-generated citations should always be verified.</p>
          </div>
        )}
      </div>
    </div>
  );
}