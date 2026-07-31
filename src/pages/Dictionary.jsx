import { db } from '@/lib/firebase';

import { useState } from "react";

import { Search, Loader2, BookOpen, Volume2, Globe } from "lucide-react";
import { incrementAiUsage } from "../components/aiUsageLimit";

const SUPPORTED_LANGS = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "la", label: "Latin", flag: "🏛️" },
];

export default function Dictionary() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("en");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const selectedLang = SUPPORTED_LANGS.find(l => l.code === lang) || SUPPORTED_LANGS[0];

  const lookup = async () => {
    const word = query.trim();
    if (!word) return;
    setLoading(true);
    setError("");
    setResult(null);

    // English: use free dictionary API
    if (lang === "en") {
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
        if (!res.ok) {
          // Fallback to AI for English too if not found
          await aiLookup(word);
          return;
        }
        const data = await res.json();
        setResult({ source: "api", data: data[0] });
      } catch {
        await aiLookup(word);
      }
      setLoading(false);
      return;
    }

    // All other languages: use AI
    await aiLookup(word);
    setLoading(false);
  };

  const aiLookup = async (word) => {
    const langLabel = selectedLang.label;
    try {
      const user = await db.auth.me();
      incrementAiUsage(user?.email, false, 0.5);
      const resp = await db.integrations.Core.InvokeLLM({
        prompt: `You are a multilingual dictionary. Look up the ${langLabel} word or phrase: "${word}"

Return a JSON object with:
- word: the word as given
- pronunciation: pronunciation guide or phonetic spelling (IPA if possible)
- origin: language origin / etymology (1 sentence)
- meanings: array of objects, each with:
  - partOfSpeech: string (noun, verb, adjective, etc.)
  - definitions: array of strings (up to 4 definitions)
  - examples: array of example sentences in ${langLabel} (with English translation in parentheses if not English)
  - synonyms: array of synonyms in ${langLabel}
- translation_en: English translation (if not English)
- notes: any important usage notes

If the word does not exist in ${langLabel}, set meanings to empty array and add a note explaining it.`,
        response_json_schema: {
          type: "object",
          properties: {
            word: { type: "string" },
            pronunciation: { type: "string" },
            origin: { type: "string" },
            meanings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  partOfSpeech: { type: "string" },
                  definitions: { type: "array", items: { type: "string" } },
                  examples: { type: "array", items: { type: "string" } },
                  synonyms: { type: "array", items: { type: "string" } },
                }
              }
            },
            translation_en: { type: "string" },
            notes: { type: "string" },
          }
        }
      });
      setResult({ source: "ai", data: resp });
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const speak = (text) => {
    window.speechSynthesis?.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    window.speechSynthesis?.speak(utt);
  };

  const partColors = {
    noun: "bg-blue-500/15 text-blue-400",
    verb: "bg-violet-500/15 text-violet-400",
    adjective: "bg-amber-500/15 text-amber-400",
    adverb: "bg-emerald-500/15 text-emerald-400",
    default: "bg-white/10 text-white/60",
  };

  // Render for English API result
  const renderApiResult = (data) => (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black">{data.word}</h2>
            {data.phonetics?.find(p => p.text) && (
              <p className="text-sm mt-1" style={mutedStyle}>{data.phonetics.find(p => p.text)?.text}</p>
            )}
          </div>
          <button onClick={() => speak(data.word)} className="p-3 rounded-2xl bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 transition-all">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      {data.meanings?.map((meaning, mi) => (
        <div key={mi} className="rounded-3xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${partColors[meaning.partOfSpeech] || partColors.default}`}>
              {meaning.partOfSpeech}
            </span>
          </div>
          <div className="space-y-3">
            {meaning.definitions?.slice(0, 4).map((def, di) => (
              <div key={di}>
                <p className="text-sm leading-relaxed">
                  <span className="opacity-40 font-bold mr-2">{di + 1}.</span>
                  {def.definition}
                </p>
                {def.example && (
                  <p className="text-xs mt-1 italic pl-5" style={mutedStyle}>"{def.example}"</p>
                )}
              </div>
            ))}
          </div>
          {meaning.synonyms?.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--app-border)" }}>
              <p className="text-xs font-bold mb-2" style={mutedStyle}>Synonyms</p>
              <div className="flex flex-wrap gap-1.5">
                {meaning.synonyms.slice(0, 8).map(s => (
                  <button key={s} onClick={() => { setQuery(s); setTimeout(lookup, 100); }}
                    className="px-3 py-1 rounded-xl text-xs font-medium hover:opacity-80 transition-all"
                    style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Render for AI result (all languages)
  const renderAiResult = (data) => (
    <div className="space-y-4">
      <div className="rounded-3xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black">{data.word}</h2>
            {data.pronunciation && (
              <p className="text-sm mt-0.5 font-mono" style={mutedStyle}>{data.pronunciation}</p>
            )}
            {data.translation_en && (
              <p className="text-sm mt-1 text-violet-400 font-semibold">= {data.translation_en}</p>
            )}
            {data.origin && (
              <p className="text-xs mt-1" style={mutedStyle}>Etymology: {data.origin}</p>
            )}
          </div>
          <button onClick={() => speak(data.word)} className="p-3 rounded-2xl bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 transition-all">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {data.meanings?.map((meaning, mi) => (
        <div key={mi} className="rounded-3xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${partColors[meaning.partOfSpeech] || partColors.default}`}>
              {meaning.partOfSpeech}
            </span>
          </div>
          <div className="space-y-3">
            {meaning.definitions?.slice(0, 4).map((def, di) => (
              <div key={di}>
                <p className="text-sm leading-relaxed">
                  <span className="opacity-40 font-bold mr-2">{di + 1}.</span>{def}
                </p>
              </div>
            ))}
          </div>
          {meaning.examples?.length > 0 && (
            <div className="mt-3 space-y-1">
              {meaning.examples.slice(0, 2).map((ex, i) => (
                <p key={i} className="text-xs italic pl-1" style={mutedStyle}>"{ex}"</p>
              ))}
            </div>
          )}
          {meaning.synonyms?.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--app-border)" }}>
              <p className="text-xs font-bold mb-2" style={mutedStyle}>Synonyms</p>
              <div className="flex flex-wrap gap-1.5">
                {meaning.synonyms.slice(0, 8).map(s => (
                  <button key={s} onClick={() => { setQuery(s); }}
                    className="px-3 py-1 rounded-xl text-xs font-medium hover:opacity-80 transition-all"
                    style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {data.notes && (
        <div className="rounded-2xl px-4 py-3 text-xs" style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)", color: "rgb(251,191,36)" }}>
          💡 {data.notes}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-16 px-4 py-8" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-violet-400" />
          <h1 className="text-2xl font-black">Dictionary</h1>
        </div>

        {/* Language picker */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {SUPPORTED_LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setResult(null); setError(""); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${lang === l.code ? "bg-violet-600 text-white" : "hover:opacity-80"}`}
              style={lang !== l.code ? { background: "var(--app-surface)", border: "1px solid var(--app-border)" } : {}}
            >
              <span>{l.flag}</span> {l.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookup()}
              placeholder={`Search in ${selectedLang.label}...`}
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
            />
          </div>
          <button
            onClick={lookup}
            disabled={!query.trim() || loading}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-5 py-3 rounded-2xl font-semibold text-sm transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Look up"}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl p-4 text-sm text-red-400 mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </div>
        )}

        {result && (
          result.source === "api" ? renderApiResult(result.data) : renderAiResult(result.data)
        )}

        {!result && !error && !loading && (
          <div className="text-center py-16">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p style={mutedStyle} className="text-sm">Select a language and search for a word</p>
          </div>
        )}
      </div>
    </div>
  );
}