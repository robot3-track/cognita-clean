import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";
import { Gift, Trophy, Sparkles, RefreshCw } from "lucide-react";
import { getServerCredits } from "@/components/userCredits";

export default function RewardHistory() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all"); // all | survey | ai_use | daily_reset
  const [totalBonus, setTotalBonus] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);

  const loadData = async () => {
    const u = await db.auth.me();
    setUser(u);
    // Use server as source of truth for all history — no IP-based localStorage
    const { surveyBonus: serverBonus, history: serverHist } = await getServerCredits();
    const sorted = [...serverHist].sort((a, b) => new Date(a.date) - new Date(b.date));
    setHistory(sorted);
    setTotalBonus(serverBonus);
    // Today's usage from server history
    const today = new Date().toISOString().slice(0, 10);
    const todayUses = sorted.filter(h => h.type === "ai_use" && h.date?.slice(0, 10) === today)
      .reduce((sum, h) => sum + Math.abs(h.amount || 1), 0);
    setTotalUsed(todayUses);
  };

  useEffect(() => {
    loadData();
    const handler = () => loadData();
    window.addEventListener("ai_usage_update", handler);
    return () => window.removeEventListener("ai_usage_update", handler);
  }, []);

  const filtered = filter === "all"
    ? history
    : history.filter(h => h.type === filter);

  const displayed = [...filtered].reverse();

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const iconFor = (type) => {
    if (type === "survey_reward") return <Gift className="w-4 h-4 text-emerald-400" />;
    if (type === "ai_use") return <Sparkles className="w-4 h-4 text-violet-400" />;
    if (type === "daily_reset") return <RefreshCw className="w-4 h-4 text-blue-400" />;
    return <Gift className="w-4 h-4 text-gray-400" />;
  };

  const bgFor = (type) => {
    if (type === "survey_reward") return "bg-emerald-500/15";
    if (type === "ai_use") return "bg-violet-500/15";
    if (type === "daily_reset") return "bg-blue-500/15";
    return "bg-gray-500/15";
  };

  const labelFor = (type) => {
    if (type === "survey_reward") return "Survey Reward";
    if (type === "ai_use") return "AI Use";
    if (type === "daily_reset") return "Daily Reset";
    return "Event";
  };

  const amountFor = (entry) => {
    if (entry.type === "daily_reset") return null;
    const n = entry.amount;
    if (n > 0) return <span className="text-sm font-black text-emerald-400">+{n}</span>;
    if (n < 0) return <span className="text-sm font-black text-violet-400">{n}</span>;
    return null;
  };

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Reward History</h1>
            <p className="text-sm" style={mutedStyle}>Survey credits, AI usage & resets</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl p-4 text-center" style={cardStyle}>
            <p className="text-2xl font-black text-emerald-400">+{totalBonus}</p>
            <p className="text-[10px] mt-0.5 font-medium" style={mutedStyle}>Bonus Credits</p>
          </div>
          <div className="rounded-2xl p-4 text-center" style={cardStyle}>
            <p className="text-2xl font-black text-violet-400">{totalUsed}</p>
            <p className="text-[10px] mt-0.5 font-medium" style={mutedStyle}>Used Today</p>
          </div>
          <div className="rounded-2xl p-4 text-center" style={cardStyle}>
            <p className="text-2xl font-black text-blue-400">{history.filter(h => h.type === "survey_reward").length}</p>
            <p className="text-[10px] mt-0.5 font-medium" style={mutedStyle}>Survey Rewards</p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "survey_reward", label: "Surveys" },
            { key: "ai_use", label: "AI Uses" },
            { key: "daily_reset", label: "Resets" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${filter === f.key ? "bg-violet-500/20 border-violet-500/40 text-violet-400" : "opacity-60 hover:opacity-80"}`}
              style={filter !== f.key ? { borderColor: "var(--app-border)" } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* History list */}
        {displayed.length === 0 ? (
          <div className="rounded-3xl p-10 text-center" style={cardStyle}>
            <Trophy className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-semibold text-sm">No records yet</p>
            <p className="text-xs mt-1" style={mutedStyle}>Complete surveys or use AI to see history here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl p-4" style={cardStyle}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bgFor(item.type)}`}>
                  {iconFor(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{labelFor(item.type)}</p>
                  <p className="text-xs mt-0.5" style={mutedStyle}>
                    {item.note || new Date(item.date).toLocaleString()}
                  </p>
                  {item.note && <p className="text-[10px] mt-0.5" style={mutedStyle}>{new Date(item.date).toLocaleString()}</p>}
                </div>
                {amountFor(item) && (
                  <div className="shrink-0">{amountFor(item)}</div>
                )}
                {item.type === "daily_reset" && (
                  <div className="shrink-0">
                    <span className="text-xs font-semibold text-blue-400">↺ Reset</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs mt-6" style={mutedStyle}>
          History is stored on your account — available on all your devices.
        </p>
      </div>
    </div>
  );
}