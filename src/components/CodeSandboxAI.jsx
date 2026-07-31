import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { callGeminiDirect, callAI } from "@/lib/lynxApi";
import { canUseAi, incrementAiUsage } from "./aiUsageLimit";
import ChatMessage from "./ChatMessage";

const STORAGE_KEY = "cognita_sandbox_ai_uses";
const MAX_DAILY = 3;

function getSandboxUsesToday() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const today = new Date().toDateString();
    return data.date === today ? (data.count || 0) : 0;
  } catch { return 0; }
}

function incrementSandboxUses() {
  try {
    const today = new Date().toDateString();
    const count = getSandboxUsesToday() + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count }));
  } catch {}
}

// System prompt is now defined in lynxApi.js (COGNITA_CODE_SYSTEM_PROMPT) — Gemini is primary for coding.

export default function CodeSandboxAI({ lang, code, user }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const sandboxUses = getSandboxUsesToday();
  const remaining = MAX_DAILY - sandboxUses;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setError(null);

    // Check sandbox daily limit
    if (sandboxUses >= MAX_DAILY) {
      setError(`You've used all ${MAX_DAILY} Code AI chats for today. Come back tomorrow!`);
      return;
    }
    // Check global AI credits
    if (!canUseAi(user?.email)) {
      setError("You've reached your daily AI credit limit. Come back tomorrow!");
      return;
    }

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    incrementSandboxUses();
    incrementAiUsage(user?.email);

    const history = newMessages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
    const contextPrompt = `The user is coding in ${lang.toUpperCase()}. Here is their current code:\n\`\`\`${lang}\n${code}\n\`\`\`\n\nConversation:\n${history}\n\nProvide a helpful, concise response.`;

    // Gemini 3.5 Flash is primary for coding; fallback to general callAI
    let response;
    try {
      response = await callGeminiDirect({ prompt: contextPrompt });
    } catch {
      response = await callAI({ prompt: contextPrompt, feature: "code_sandbox_ai" });
    }

    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  const usesLeft = MAX_DAILY - getSandboxUsesToday();

  return (
    <div className="flex flex-col" style={{ borderTop: "1px solid var(--app-border)" }}>
      {/* Toggle bar */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all hover:opacity-90 shrink-0"
        style={{ background: "var(--app-surface)", color: "var(--app-text)" }}
      >
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <span>AI Code Helper</span>
        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: usesLeft > 0 ? "rgba(139,92,246,0.15)" : "rgba(239,68,68,0.15)", color: usesLeft > 0 ? "rgb(167,139,250)" : "rgb(248,113,113)" }}>
          {usesLeft}/{MAX_DAILY} today
        </span>
        <span className="ml-auto opacity-40">{open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}</span>
      </button>

      {open && (
        <div className="flex flex-col" style={{ height: 280, background: "var(--app-bg)" }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <Sparkles className="w-6 h-6 mb-2 text-violet-400" />
                <p className="text-xs">Ask me anything about your code!</p>
                <p className="text-[10px] mt-1">e.g. "Debug my code", "Explain this", "Add a feature"</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-1.5`}>
                {msg.role !== "user" && (
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm"
                    : "rounded-bl-sm border"
                }`} style={msg.role !== "user" ? { background: "var(--app-surface)", borderColor: "var(--app-border)" } : {}}>
                  <ChatMessage content={msg.content} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-1.5">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="px-3 py-2 rounded-xl rounded-bl-sm border" style={{ background: "var(--app-surface)", borderColor: "var(--app-border)" }}>
                  <div className="flex gap-1 items-center">
                    <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 shrink-0" style={{ borderTop: "1px solid var(--app-border)" }}>
            {error && <p className="text-[10px] text-red-400 mb-1.5 font-medium">{error}</p>}
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={e => { setInput(e.target.value); setError(null); }}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={usesLeft <= 0 ? "Daily limit reached" : "Ask about your code..."}
                disabled={usesLeft <= 0}
                className="flex-1 px-3 py-1.5 rounded-xl text-xs outline-none disabled:opacity-40"
                style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || usesLeft <= 0}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white p-1.5 rounded-xl transition-all shrink-0"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}