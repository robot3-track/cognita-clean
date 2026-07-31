import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Zap, ClipboardList, Activity, RefreshCw } from "lucide-react";

export default function UsageTab({ users, apSessions, sessions, cardStyle, mutedStyle, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);
  const [aiLogs, setAiLogs] = useState([]);

  useEffect(() => {
    // Load AIUsageLog for full coverage (includes unrestricted dev accounts + Gemini code helper)
    db.entities.AIUsageLog.list("-created_date", 2000).then(data => setAiLogs(data));
    // Live updates
    const unsub = db.entities.AIUsageLog.subscribe((event) => {
      if (event.type === "create") setAiLogs(prev => [event.data, ...prev]);
      else if (event.type === "update") setAiLogs(prev => prev.map(l => l.id === event.id ? event.data : l));
      else if (event.type === "delete") setAiLogs(prev => prev.filter(l => l.id !== event.id));
    });
    return unsub;
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    db.entities.AIUsageLog.list("-created_date", 2000).then(data => setAiLogs(data));
    setRefreshing(false);
  };

  // Auto-refresh every 30s when tab is visible
  useEffect(() => {
    const interval = setInterval(() => {
      onRefresh();
      db.entities.AIUsageLog.list("-created_date", 2000).then(data => setAiLogs(data));
    }, 30000);
    return () => clearInterval(interval);
  }, [onRefresh]);

  // Build AI events from AIUsageLog (source of truth — covers all users including unrestricted devs)
  const allAiEvents = aiLogs.map(log => ({
    date: log.created_date,
    user_email: log.user_email || "unknown",
    user_name: log.user_email || "unknown",
    feature: log.feature,
    provider: log.provider,
    success: log.success,
    amount: 1,
  }));

  // Also merge credit_history for users who have it (for backwards-compat display)
  const creditEvents = [];
  users.forEach(u => {
    if (!u.credit_history) return;
    try {
      const hist = JSON.parse(u.credit_history);
      hist.forEach(entry => {
        if (entry.type === "ai_use") {
          creditEvents.push({ ...entry, user_email: u.email, user_name: u.full_name || u.email });
        }
      });
    } catch {}
  });

  // Per-user AI totals — from AIUsageLog (most complete)
  const aiByUser = {};
  allAiEvents.forEach(e => {
    if (!aiByUser[e.user_email]) aiByUser[e.user_email] = { name: e.user_name, total: 0 };
    aiByUser[e.user_email].total += 1;
  });
  const aiUserList = Object.entries(aiByUser).sort((a, b) => b[1].total - a[1].total);

  // AP session breakdowns
  const apByType = { frq: 0, mcq: 0, exam: 0 };
  const apBySubject = {};
  apSessions.forEach(s => {
    apByType[s.type] = (apByType[s.type] || 0) + 1;
    apBySubject[s.subject] = (apBySubject[s.subject] || 0) + 1;
  });
  const apSubjectList = Object.entries(apBySubject).sort((a, b) => b[1] - a[1]);

  // Study session type breakdown
  const sessionByType = {};
  sessions.forEach(s => {
    const type = s.session_type || "flashcards";
    sessionByType[type] = (sessionByType[type] || 0) + 1;
  });

  const today = new Date().toISOString().slice(0, 10);
  const aiToday = allAiEvents.filter(e => e.date?.slice(0, 10) === today).length;
  const apToday = apSessions.filter(s => s.created_date?.slice(0, 10) === today).length;
  const sessionsToday = sessions.filter(s => s.created_date?.slice(0, 10) === today).length;

  // Feature breakdown from AIUsageLog
  const byFeature = {};
  allAiEvents.forEach(e => {
    const k = e.feature || "unknown";
    byFeature[k] = (byFeature[k] || 0) + 1;
  });
  const featureList = Object.entries(byFeature).sort((a, b) => b[1] - a[1]);

  // Provider breakdown
  const byProvider = {};
  allAiEvents.forEach(e => {
    const p = e.provider || "unknown";
    byProvider[p] = (byProvider[p] || 0) + 1;
  });
  const providerList = Object.entries(byProvider).sort((a, b) => b[1] - a[1]);
  const providerColors = {
    lynx: "#f59e0b",
    gemini: "#3b82f6",
    claude: "#f97316",
    cohere: "#10b981",
    firebase: "#8b5cf6",
    unknown: "#6b7280",
  };

  // Flashcard/quiz/test feature grouping
  const flashcardFeatures = ["quiz_generation", "flashcard_generation", "test_generation", "chat_to_flashcards", "chat_to_quiz", "scan", "scan_flashcards"];
  const flashcardAiTotal = allAiEvents.filter(e => flashcardFeatures.some(f => (e.feature || "").includes(f))).length;
  const flashcardAiToday = allAiEvents.filter(e => e.date?.slice(0, 10) === today && flashcardFeatures.some(f => (e.feature || "").includes(f))).length;

  // Exam-specific AI usage
  const examFeatures = ["ap_testing", "ap_frq", "ap_mcq", "ap_exam", "state_test", "iready", "exam_prep", "practice_test"];
  const examAiTotal = allAiEvents.filter(e => examFeatures.some(f => (e.feature || "").includes(f) || (e.feature || "").includes("test") || (e.feature || "").includes("exam"))).length;
  const examAiToday = allAiEvents.filter(e => e.date?.slice(0, 10) === today && examFeatures.some(f => (e.feature || "").includes(f) || (e.feature || "").includes("test") || (e.feature || "").includes("exam"))).length;

  return (
    <div className="space-y-5">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={mutedStyle}>Auto-refreshes every 30s</p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh Now"}
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "AI Uses (total)", value: allAiEvents.length, icon: "⚡", color: "text-violet-400" },
          { label: "AI Uses (today)", value: aiToday, icon: "🤖", color: "text-violet-400" },
          { label: "AP Sessions", value: apSessions.length, icon: "📋", color: "text-blue-400" },
          { label: "AP Today", value: apToday, icon: "📝", color: "text-blue-400" },
          { label: "Exam AI Uses (total)", value: examAiTotal, icon: "🎯", color: "text-orange-400" },
          { label: "Exam AI (today)", value: examAiToday, icon: "📐", color: "text-orange-400" },
          { label: "Quiz/Flashcard AI (total)", value: flashcardAiTotal, icon: "🃏", color: "text-cyan-400" },
          { label: "Quiz/Flashcard AI (today)", value: flashcardAiToday, icon: "📊", color: "text-cyan-400" },
          { label: "Study Sessions", value: sessions.length, icon: "⏱️", color: "text-emerald-400" },
          { label: "Sessions Today", value: sessionsToday, icon: "📅", color: "text-emerald-400" },
          { label: "Unique AI Users", value: aiUserList.length, icon: "👥", color: "text-amber-400" },
          { label: "AP Subjects Used", value: apSubjectList.length, icon: "🎓", color: "text-pink-400" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={cardStyle}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs" style={mutedStyle}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI Usage Log */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-400" /> AI Usage Log — Live (most recent {Math.min(allAiEvents.length, 100)})
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold text-emerald-400" style={{ background: "rgba(16,185,129,0.15)" }}>● LIVE</span>
        </h2>
        {allAiEvents.length === 0 ? (
          <p className="text-xs" style={mutedStyle}>No AI usage recorded yet.</p>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {allAiEvents.slice(0, 100).map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs" style={{ background: "var(--app-bg)" }}>
                <span className="font-mono text-violet-400 shrink-0">{e.date ? new Date(e.date).toLocaleString() : "—"}</span>
                <span className="flex-1 truncate font-medium">{e.user_email?.split("@")[0] || "—"}</span>
                <span className="shrink-0 font-mono text-[10px]" style={mutedStyle}>{e.feature || "—"}</span>
                <span className={`px-2 py-0.5 rounded-lg font-bold shrink-0 text-[10px] ${e.provider === "lynx" ? "bg-amber-500/15 text-amber-400" : e.provider === "gemini" ? "bg-blue-500/15 text-blue-400" : e.provider === "claude" ? "bg-orange-500/15 text-orange-400" : "bg-violet-500/15 text-violet-400"}`}>
                  {e.provider === "lynx" ? "⚡" : e.provider === "gemini" ? "🔵" : e.provider === "claude" ? "🟠" : "🧠"} {e.provider}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature usage breakdown */}
      {featureList.length > 0 && (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h2 className="font-bold text-sm mb-3">🎯 AI Calls by Feature (all providers)</h2>
          <div className="space-y-2">
            {featureList.map(([feature, count]) => (
              <div key={feature} className="flex items-center gap-3 text-xs">
                <span className="font-mono flex-1 truncate" style={mutedStyle}>{feature}</span>
                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "var(--app-bg)" }}>
                  <div className="h-full rounded-full bg-violet-500" style={{ width: `${(count / featureList[0][1]) * 100}%` }} />
                </div>
                <span className="font-black text-violet-400 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provider breakdown */}
      {providerList.length > 0 && (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h2 className="font-bold text-sm mb-3">🔌 AI Calls by Provider</h2>
          <div className="space-y-2">
            {providerList.map(([provider, count]) => (
              <div key={provider} className="flex items-center gap-3 text-xs">
                <span className="w-16 font-mono font-bold shrink-0" style={{ color: providerColors[provider] || "#8b5cf6" }}>
                  {provider}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--app-bg)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(count / providerList[0][1]) * 100}%`, background: providerColors[provider] || "#8b5cf6" }} />
                </div>
                <span className="font-black w-10 text-right" style={{ color: providerColors[provider] || "#8b5cf6" }}>{count}</span>
                <span className="w-10 text-right" style={mutedStyle}>{Math.round((count / allAiEvents.length) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top AI users */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h2 className="font-bold text-sm mb-3">🏆 Top AI Users — all time (incl. unrestricted)</h2>
        <div className="space-y-2">
          {aiUserList.slice(0, 15).map(([email, { name, total }], i) => (
            <div key={email} className="flex items-center gap-3 text-xs">
              <span className="w-5 font-black" style={mutedStyle}>#{i + 1}</span>
              <span className="flex-1 truncate font-medium">{email}</span>
              <span className="font-black text-violet-400">{total} calls</span>
            </div>
          ))}
          {aiUserList.length === 0 && <p className="text-xs" style={mutedStyle}>No data yet.</p>}
        </div>
      </div>

      {/* AP + Study session breakdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-400" /> AP Sessions by Type
          </h2>
          <div className="space-y-2">
            {[["FRQ", "frq", "text-amber-400"], ["MCQ", "mcq", "text-blue-400"], ["Full Exam", "exam", "text-emerald-400"]].map(([label, key, color]) => (
              <div key={key} className="flex items-center gap-3 text-sm">
                <span className="flex-1 font-medium">{label}</span>
                <span className={`font-black ${color}`}>{apByType[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5" style={cardStyle}>
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-pink-400" /> Study Session Types
          </h2>
          <div className="space-y-2">
            {Object.entries(sessionByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3 text-sm">
                <span className="flex-1 font-medium capitalize">{type}</span>
                <span className="font-black text-emerald-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AP by subject */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h2 className="font-bold text-sm mb-3">📚 AP Sessions by Subject</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {apSubjectList.map(([subject, count]) => (
            <div key={subject} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs" style={{ background: "var(--app-bg)" }}>
              <span className="font-medium truncate flex-1">{subject}</span>
              <span className="font-black text-blue-400 ml-2">{count}</span>
            </div>
          ))}
          {apSubjectList.length === 0 && <p className="text-xs col-span-3" style={mutedStyle}>No AP sessions yet.</p>}
        </div>
      </div>

      {/* Raw AP session log */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h2 className="font-bold text-sm mb-3">📋 Recent AP Sessions</h2>
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {apSessions.slice(0, 50).map(s => (
            <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs" style={{ background: "var(--app-bg)" }}>
              <span className="font-mono shrink-0" style={mutedStyle}>{new Date(s.created_date).toLocaleString()}</span>
              <span className="flex-1 truncate">{s.user_email}</span>
              <span className="px-2 py-0.5 rounded-lg font-bold shrink-0" style={{
                background: s.type === "exam" ? "rgba(16,185,129,0.15)" : s.type === "frq" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)",
                color: s.type === "exam" ? "#34d399" : s.type === "frq" ? "#fbbf24" : "#93c5fd"
              }}>{s.type?.toUpperCase()}</span>
              <span className="shrink-0 font-medium truncate max-w-[100px]">{s.subject}</span>
              {s.ap_score && <span className="font-black text-violet-400 shrink-0">AP {s.ap_score}</span>}
              {s.mcq_pct != null && !s.ap_score && <span className="font-bold text-emerald-400 shrink-0">{s.mcq_pct}%</span>}
            </div>
          ))}
          {apSessions.length === 0 && <p className="text-xs" style={mutedStyle}>No AP sessions yet.</p>}
        </div>
      </div>
    </div>
  );
}