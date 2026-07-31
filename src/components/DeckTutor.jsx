import { useState, useRef, useEffect } from "react";
import { Send, X, Loader2, Sparkles } from "lucide-react";
import { incrementAiUsage, canUseAi } from "./aiUsageLimit";
import { callAI } from "@/lib/lynxApi";
import ChatMessage from "./ChatMessage";

export default function DeckTutor({ deck, cards, user, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hi! I'm your AI tutor for **${deck?.title}**. I know all ${cards?.length || 0} cards in this deck. Ask me anything — to quiz you, explain concepts, or help you understand tricky parts!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const send = async () => {
    if (!input.trim() || loading) return;
    if (!canUseAi(user?.email)) {
      setMessages(prev => [...prev, { role: "assistant", content: "You've reached your daily AI limit. Come back tomorrow or earn more credits!" }]);
      return;
    }

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    incrementAiUsage(user?.email);

    const cardSummary = cards.slice(0, 60).map(c => `Q: ${c.front}\nA: ${c.back}`).join("\n\n");
    const history = newMessages.map(m => `${m.role === "user" ? "User" : "Tutor"}: ${m.content}`).join("\n");

    const response = await callAI({
      prompt: `You are an expert AI tutor for the flashcard deck titled "${deck?.title}". 
Here are the flashcards in this deck:
${cardSummary}

Conversation so far:
${history}

Help the user learn this material. You can quiz them, explain concepts, give mnemonics, break down hard topics, or answer questions. Be encouraging and concise.`,
      feature: "deck_tutor",
    });

    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--app-border)", background: "var(--app-surface)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">AI Tutor</p>
            <p className="text-xs" style={mutedStyle}>{deck?.title}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl opacity-50 hover:opacity-80 transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-violet-600 text-white rounded-br-sm" : "rounded-bl-sm"}`}
              style={msg.role !== "user" ? cardStyle : {}}
            >
              <ChatMessage content={msg.content} />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={cardStyle}>
              <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t shrink-0" style={{ borderColor: "var(--app-border)" }}>
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask your tutor anything..."
            className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-4 py-3 rounded-2xl transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}