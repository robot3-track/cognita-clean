import { db } from '@/lib/firebase';
import { useState } from "react";
import { Loader2, Zap, Image as ImageIcon } from "lucide-react";

import {
  callLynxDirect, isLynxEnabled, setLynxEnabled,
  LYNX_BASE_URL, LYNX_MODEL, LYNX_API_KEY,
  OPENROUTER_API_KEY, OPENROUTER_MODEL,
  GEMINI_API_KEY, GEMINI_BASE_URL, GEMINI_MODEL,
  CLAUDE_API_KEY, CLAUDE_MODEL, callClaudeDirect,
  COHERE_API_KEY, COHERE_MODEL, COHERE_BASE_URL,
  JSON2VIDEO_API_KEY, JSON2VIDEO_MONTHLY_LIMIT,
  BIG_PICKLE_API_KEY, BIG_PICKLE_BASE_URL, BIG_PICKLE_MODEL,
  GROQ_API_KEY, GROQ_BASE_URL, GROQ_MODEL,
  NVIDIA_API_KEY,
  HACKCLUB_API_KEY, HACKCLUB_BASE_URL, HACKCLUB_DEFAULT_MODEL
} from "@/lib/lynxApi";

import {
  MISTRAL_API_KEY, MISTRAL_BASE_URL, MISTRAL_MODEL,
  callMistralDirect, generateImageWithMistralFallbacks
} from "@/lib/mistralAPI";

import Json2VideoTestPanel from "./Json2VideoTestPanel";

export default function LynxApiPanel({ cardStyle, mutedStyle }) {
  const [enabled, setEnabledState] = useState(() => isLynxEnabled());
  const [testPrompt, setTestPrompt] = useState("What is your name and who made you?");

  const [lynxResult, setLynxResult] = useState(""); const [lynxTesting, setLynxTesting] = useState(false); const [lynxError, setLynxError] = useState("");
  const [hackclubResult, setHackclubResult] = useState(""); const [hackclubTesting, setHackclubTesting] = useState(false); const [hackclubError, setHackclubError] = useState("");
  const [openRouterResult, setOpenRouterResult] = useState(""); const [openRouterTesting, setOpenRouterTesting] = useState(false); const [openRouterError, setOpenRouterError] = useState("");
  const [nvidiaResult, setNvidiaResult] = useState(""); const [nvidiaTesting, setNvidiaTesting] = useState(false); const [nvidiaError, setNvidiaError] = useState("");
  const [bigPickleResult, setBigPickleResult] = useState(""); const [bigPickleTesting, setBigPickleTesting] = useState(false); const [bigPickleError, setBigPickleError] = useState("");
  const [geminiResult, setGeminiResult] = useState(""); const [geminiTesting, setGeminiTesting] = useState(false); const [geminiError, setGeminiError] = useState("");
  const [cohereResult, setCohereResult] = useState(""); const [cohereTesting, setCohereTesting] = useState(false); const [cohereError, setCohereError] = useState("");
  const [claudeResult, setClaudeResult] = useState(""); const [claudeTesting, setClaudeTesting] = useState(false); const [claudeError, setClaudeError] = useState("");
  const [groqResult, setGroqResult] = useState(""); const [groqTesting, setGroqTesting] = useState(false); const [groqError, setGroqError] = useState("");
  const [mistralResult, setMistralResult] = useState(""); const [mistralTesting, setMistralTesting] = useState(false); const [mistralError, setMistralError] = useState("");
  const [mistralImageResult, setMistralImageResult] = useState(""); const [mistralImageTesting, setMistralImageTesting] = useState(false); const [mistralImageError, setMistralImageError] = useState("");
  const [base44Result, setBase44Result] = useState(""); const [base44Testing, setBase44Testing] = useState(false); const [base44Error, setBase44Error] = useState("");

  const toggle = (val) => { setEnabledState(val); setLynxEnabled(val); };

  const runLynxTest = async () => {
    setLynxTesting(true); setLynxResult(""); setLynxError("");
    try { const r = await callLynxDirect({ prompt: testPrompt }); setLynxResult(r); }
    catch (err) { setLynxError(err?.message || "Request failed."); }
    finally { setLynxTesting(false); }
  };

  const runHackClubTest = async () => {
    setHackclubTesting(true); setHackclubResult(""); setHackclubError("");
    try {
      const res = await fetch("/api/hackclub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: HACKCLUB_DEFAULT_MODEL || "anthropic/claude-opus-5",
          messages: [{ role: "user", content: testPrompt }]
        }),
      });
      if (!res.ok) throw new Error(`Hack Club API error: ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) setHackclubResult(content); else throw new Error("No response from Hack Club");
    } catch (err) { setHackclubError(err?.message || "Request failed."); }
    finally { setHackclubTesting(false); }
  };

  const runOpenRouterTest = async () => {
    setOpenRouterTesting(true); setOpenRouterResult(""); setOpenRouterError("");
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin || "http://localhost:5173",
          "X-Title": "Cognita Study Platform",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [{ role: "user", content: testPrompt }]
        }),
      });
      if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) setOpenRouterResult(content); else throw new Error("No response from OpenRouter");
    } catch (err) { setOpenRouterError(err?.message || "Request failed."); }
    finally { setOpenRouterTesting(false); }
  };

  const runNvidiaTest = async () => {
    setNvidiaTesting(true); setNvidiaResult(""); setNvidiaError("");
    try {
      const res = await fetch("/api/nvidia", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: testPrompt }]
        }),
      });
      if (!res.ok) throw new Error(`Nvidia API error: ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) setNvidiaResult(content); else throw new Error("No response from Nvidia");
    } catch (err) { setNvidiaError(err?.message || "Request failed."); }
    finally { setNvidiaTesting(false); }
  };

  const runBigPickleTest = async () => {
    setBigPickleTesting(true); setBigPickleResult(""); setBigPickleError("");
    try {
      const res = await fetch("/api/bigpickle", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BIG_PICKLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: BIG_PICKLE_MODEL,
          messages: [{ role: "user", content: testPrompt }]
        }),
      });
      if (!res.ok) throw new Error(`Big Pickle API error: ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) setBigPickleResult(content); else throw new Error("No response from Big Pickle");
    } catch (err) { setBigPickleError(err?.message || "Request failed."); }
    finally { setBigPickleTesting(false); }
  };

  const runGeminiTest = async () => {
    setGeminiTesting(true); setGeminiResult(""); setGeminiError("");
    try {
      const res = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: testPrompt }] }], generationConfig: { candidateCount: 1, maxOutputTokens: 512, temperature: 0.7 } }),
      });
      if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
      const data = await res.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) setGeminiResult(content); else throw new Error("No response from Gemini");
    } catch (err) { setGeminiError(err?.message || "Request failed."); }
    finally { setGeminiTesting(false); }
  };

  const runCohereTest = async () => {
    setCohereTesting(true); setCohereResult(""); setCohereError("");
    try {
      const res = await fetch(COHERE_BASE_URL, {
        method: "POST", headers: { Authorization: `Bearer ${COHERE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: COHERE_MODEL, messages: [{ role: "user", content: testPrompt }] }),
      });
      if (!res.ok) throw new Error(`Cohere API error: ${res.status}`);
      const data = await res.json();
      const content = data?.message?.content?.[0]?.text;
      if (content) setCohereResult(content); else throw new Error("No response from Cohere");
    } catch (err) { setCohereError(err?.message || "Request failed."); }
    finally { setCohereTesting(false); }
  };

  const runClaudeTest = async () => {
    setClaudeTesting(true); setClaudeResult(""); setClaudeError("");
    try { const r = await callClaudeDirect({ prompt: testPrompt }); setClaudeResult(r); }
    catch (err) { setClaudeError(err?.message || "Request failed."); }
    finally { setClaudeTesting(false); }
  };

  const runGroqTest = async () => {
    setGroqTesting(true); setGroqResult(""); setGroqError("");
    try {
      const res = await fetch(GROQ_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "user", content: testPrompt }],
        }),
      });
      if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) setGroqResult(content);
      else throw new Error("No response from Groq");
    } catch (err) { setGroqError(err?.message || "Request failed."); }
    finally { setGroqTesting(false); }
  };

  const runMistralTextTest = async () => {
    setMistralTesting(true); setMistralResult(""); setMistralError("");
    try {
      if (typeof callMistralDirect === "function") {
        const r = await callMistralDirect({ prompt: testPrompt });
        setMistralResult(typeof r === "object" ? JSON.stringify(r, null, 2) : r);
      } else {
        const res = await fetch(`${MISTRAL_BASE_URL || "https://api.mistral.ai/v1"}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MISTRAL_MODEL || "mistral-small-latest",
            messages: [{ role: "user", content: testPrompt }],
          }),
        });
        if (!res.ok) throw new Error(`Mistral API error: ${res.status}`);
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) setMistralResult(content);
        else throw new Error("No response from Mistral");
      }
    } catch (err) { setMistralError(err?.message || "Request failed."); }
    finally { setMistralTesting(false); }
  };

  const runMistralImageTest = async () => {
    setMistralImageTesting(true); setMistralImageResult(""); setMistralImageError("");
    try {
      const imageUrl = await generateImageWithMistralFallbacks({ prompt: testPrompt });
      if (imageUrl) setMistralImageResult(imageUrl);
      else throw new Error("No image returned.");
    } catch (err) { setMistralImageError(err?.message || "Request failed."); }
    finally { setMistralImageTesting(false); }
  };

  const runBase44Test = async () => {
    setBase44Testing(true); setBase44Result(""); setBase44Error("");
    try { const r = await db.integrations.Core.InvokeLLM({ prompt: testPrompt }); setBase44Result(typeof r === "object" ? JSON.stringify(r, null, 2) : r); }
    catch (err) { setBase44Error(err?.message || "Request failed."); }
    finally { setBase44Testing(false); }
  };

  const ResultBox = ({ result, error, color }) => {
    const isImage = typeof result === "string" && (
      result.startsWith("blob:") || 
      result.startsWith("data:image/") || 
      result.startsWith("http") && /\.(png|jpe?g|webp|gif)$/i.test(result) ||
      result.includes("pollinations.ai")
    );

    return (
      <>
        {error && (
          <div className="rounded-xl p-3 mb-2" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-xs text-red-400">❌ {error}</p>
          </div>
        )}
        {result && (
          <div className="rounded-xl p-3" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
            <p className={`text-[10px] font-bold mb-1 ${color}`}>✅ Responded</p>
            {isImage ? (
              <div className="mt-1 rounded-lg overflow-hidden border border-amber-500/20">
                <img src={result} alt="Mistral Generated AI" className="w-full max-h-64 object-cover" />
              </div>
            ) : (
              <p className="text-xs whitespace-pre-wrap">{result}</p>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="font-black text-lg mb-1 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> AI Provider Chain
        </h2>
        <p className="text-sm mb-4" style={mutedStyle}>
          Multi-tier fallback: <strong>Lynx → Hack Club → OpenRouter → NVIDIA → Big Pickle → Gemini → Cohere → Claude → Groq → Mistral</strong>.
        </p>

        <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.25)" }}>
          <p className="text-xs font-bold text-amber-400 mb-2">⚡ Routing Logic</p>
          <ul className="text-xs space-y-1" style={mutedStyle}>
            <li>1️⃣ <strong>Lynx API</strong> — default for all text & JSON calls (with timezone injection)</li>
            <li>2️⃣ <strong>Hack Club API</strong> — 1st fallback for proxy text & dynamic model calls</li>
            <li>3️⃣ <strong>OpenRouter API</strong> — 2nd priority fallback (GPT-4o standard)</li>
            <li>4️⃣ <strong>NVIDIA NIM API</strong> — 3rd fallback (Llama 3.1 8B Instruct - Fast)</li>
            <li>5️⃣ <strong>Big Pickle API</strong> — 4th fallback · free beta · 200k context window</li>
            <li>6️⃣ <strong>Gemini API</strong> — fallback for text, JSON, vision & internet search</li>
            <li>7️⃣ <strong>Cohere API</strong> — fallback for text & JSON (command-r-plus)</li>
            <li>8️⃣ <strong>Claude API</strong> — fallback (claude_sonnet_4_6)</li>
            <li>9️⃣ <strong>Groq API</strong> — high-speed fallback provider</li>
            <li>🔟 <strong>Mistral AI</strong> — direct module from <code>lib/mistralAPI</code> (text + image fallbacks)</li>
            <li>1️⃣1️⃣ <strong>Base44</strong> — final fallback (internet/vision use this after Gemini)</li>
            <li className="text-violet-300 mt-1">🎬 <strong>Media chain:</strong> Gemini → Lynx → Cohere → Claude → Base44</li>
            <li className="text-blue-300">🌐 <strong>Vision/Internet</strong> — Gemini first, then Base44</li>
            <li className="text-pink-300 mt-1">🎬 <strong>JSON2Video</strong> — renders real MP4 videos; 1 video/month free (admins unlimited)</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => toggle(true)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${enabled ? "bg-amber-500 text-black" : "opacity-50 hover:opacity-80"}`} style={!enabled ? { background: "var(--app-surface)", border: "1px solid var(--app-border)" } : {}}>
            ⚡ Lynx + chain (default)
          </button>
          <button onClick={() => toggle(false)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!enabled ? "bg-violet-600 text-white" : "opacity-50 hover:opacity-80"}`} style={enabled ? { background: "var(--app-surface)", border: "1px solid var(--app-border)" } : {}}>
            🧠 Base44 only
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "⚡ Lynx API", color: "text-amber-400", lines: [`URL: ${LYNX_BASE_URL}`, `Primary: ${LYNX_MODEL}`, `Key: ${LYNX_API_KEY.slice(0, 20)}…`] },
            { label: "🚩 Hack Club API", color: "text-red-400", lines: [`URL: ${HACKCLUB_BASE_URL || "ai.hackclub.com/proxy/v1"}`, `Model: ${HACKCLUB_DEFAULT_MODEL || "qwen/qwen3.8-max"}`, `Key: ${(HACKCLUB_API_KEY || "").slice(0, 20)}…`, "Use: 1st priority fallback"] },
            { label: "🌐 OpenRouter API", color: "text-fuchsia-400", lines: [`URL: openrouter.ai/api/v1`, `Model: ${OPENROUTER_MODEL}`, `Key: ${(OPENROUTER_API_KEY || "").slice(0, 20)}…`, "Use: 2nd priority fallback"] },
            { label: "🟩 NVIDIA API", color: "text-green-500", lines: [`URL: /api/nvidia (via proxy)`, `Models: meta/llama-3.1-8b-instruct`, `Key: ${(NVIDIA_API_KEY || "").slice(0, 20)}…`, "Proxied via Vercel (CORS bypass)"] },
            { label: "🥒 Big Pickle API", color: "text-emerald-400", lines: [`URL: /api/bigpickle (via proxy)`, `Model: ${BIG_PICKLE_MODEL}`, `Key: ${(BIG_PICKLE_API_KEY || "").slice(0, 20)}…`, "Proxied via Vercel (CORS bypass)"] },
            { label: "🔵 Gemini API", color: "text-blue-400", lines: [`URL: generativelanguage.googleapis.com`, `Model: ${GEMINI_MODEL}`, `Key: ${(GEMINI_API_KEY || "").slice(0, 20)}…`] },
            { label: "🟢 Cohere API", color: "text-teal-400", lines: [`URL: api.cohere.ai/v1/chat`, `Model: ${COHERE_MODEL}`, `Key: ${(COHERE_API_KEY || "").slice(0, 20)}…`, "Use: 7th fallback"] },
            { label: "🟠 Claude API", color: "text-orange-400", lines: [`URL: api.anthropic.com/v1/messages`, `Model: ${CLAUDE_MODEL}`, `Key: ${(CLAUDE_API_KEY || "").slice(0, 20)}…`, "Use: 8th fallback"] },
            { label: "🚀 Groq API", color: "text-red-400", lines: [`URL: ${GROQ_BASE_URL}`, `Model: ${GROQ_MODEL}`, `Key: ${(GROQ_API_KEY || "").slice(0, 20)}…`, "Use: 9th fallback"] },
            { label: "🦊 Mistral API & Images", color: "text-orange-500", lines: [`URL: ${MISTRAL_BASE_URL}`, `Model: ${MISTRAL_MODEL}`, `Key: ${(MISTRAL_API_KEY || "").slice(0, 20)}…`, "Source: @/lib/mistralAPI"] },
            { label: "🧠 Base44 API", color: "text-violet-400", lines: ["Provider: Base44 InvokeLLM", "Tier: final fallback", "Use: internet search · vision"] },
            { label: "🎬 JSON2Video API", color: "text-pink-400", lines: [`URL: api.json2video.com/v2/movies`, `Key: ${(JSON2VIDEO_API_KEY || "").slice(0, 20)}…`, `Monthly limit: ${JSON2VIDEO_MONTHLY_LIMIT}/user`, "Admins: unlimited"] },
          ].map(({ label, color, lines }) => (
            <div key={label} className="rounded-xl p-4" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
              <p className={`text-xs font-bold mb-2 ${color}`}>{label}</p>
              <div className="space-y-1 text-xs font-mono">
                {lines.map((l, i) => {
                  const [k, ...v] = l.split(": ");
                  return v.length ? <div key={i}><span className="opacity-50">{k}: </span>{v.join(": ")}</div> : <div key={i} className="opacity-50">{l}</div>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6" style={cardStyle}>
        <h3 className="font-bold text-sm mb-1">🧪 API Connection Tests</h3>
        <p className="text-xs mb-3" style={mutedStyle}>Test each provider individually.</p>
        <textarea value={testPrompt} onChange={e => setTestPrompt(e.target.value)} rows={2}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-4"
          style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "⚡ Lynx", fn: runLynxTest, loading: lynxTesting, result: lynxResult, error: lynxError, bg: "bg-amber-500 hover:bg-amber-400 text-black", color: "text-amber-400" },
            { label: "🚩 Hack Club", fn: runHackClubTest, loading: hackclubTesting, result: hackclubResult, error: hackclubError, bg: "bg-red-500 hover:bg-red-400 text-white", color: "text-red-400" },
            { label: "🌐 OpenRouter", fn: runOpenRouterTest, loading: openRouterTesting, result: openRouterResult, error: openRouterError, bg: "bg-fuchsia-600 hover:bg-fuchsia-500 text-white", color: "text-fuchsia-400" },
            { label: "🟩 NVIDIA", fn: runNvidiaTest, loading: nvidiaTesting, result: nvidiaResult, error: nvidiaError, bg: "bg-green-600 hover:bg-green-500 text-white", color: "text-green-500" },
            { label: "🥒 Big Pickle", fn: runBigPickleTest, loading: bigPickleTesting, result: bigPickleResult, error: bigPickleError, bg: "bg-emerald-600 hover:bg-emerald-500 text-white", color: "text-emerald-400" },
            { label: "🔵 Gemini", fn: runGeminiTest, loading: geminiTesting, result: geminiResult, error: geminiError, bg: "bg-blue-600 hover:bg-blue-500 text-white", color: "text-blue-400" },
            { label: "🟢 Cohere", fn: runCohereTest, loading: cohereTesting, result: cohereResult, error: cohereError, bg: "text-white", color: "text-teal-400", style: { background: "rgb(13,148,136)" } },
            { label: "🟠 Claude", fn: runClaudeTest, loading: claudeTesting, result: claudeResult, error: claudeError, bg: "bg-orange-600 hover:bg-orange-500 text-white", color: "text-orange-400" },
            { label: "🚀 Groq", fn: runGroqTest, loading: groqTesting, result: groqResult, error: groqError, bg: "bg-red-600 hover:bg-red-500 text-white", color: "text-red-400" },
            { label: "🦊 Mistral Text", fn: runMistralTextTest, loading: mistralTesting, result: mistralResult, error: mistralError, bg: "bg-orange-500 hover:bg-orange-400 text-white", color: "text-orange-500" },
            { label: "🖼️ Mistral Image", fn: runMistralImageTest, loading: mistralImageTesting, result: mistralImageResult, error: mistralImageError, bg: "bg-amber-600 hover:bg-amber-500 text-white", color: "text-amber-400", icon: ImageIcon },
            { label: "🧠 Firebase AI", fn: runBase44Test, loading: base44Testing, result: base44Result, error: base44Error, bg: "bg-violet-600 hover:bg-violet-500 text-white", color: "text-violet-400" },
          ].map(({ label, fn, loading, result, error, bg, color, style, icon: Icon = Zap }) => (
            <div key={label}>
              <button onClick={fn} disabled={loading || !testPrompt.trim()}
                className={`w-full flex items-center justify-center gap-2 disabled:opacity-40 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all mb-3 ${bg}`}
                style={style}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                {loading ? "Testing..." : label}
              </button>
              <ResultBox result={result} error={error} color={color} />
            </div>
          ))}
        </div>
      </div>

      <Json2VideoTestPanel cardStyle={cardStyle} mutedStyle={mutedStyle} />
    </div>
  );
}
