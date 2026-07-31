import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Loader2, Zap } from "lucide-react";
import { JSON2VIDEO_API_KEY, JSON2VIDEO_BASE_URL, JSON2VIDEO_MONTHLY_LIMIT, renderVideoWithJson2Video } from "@/lib/lynxApi";

const STATUS_COLORS = {
  submitted: "text-blue-400 bg-blue-500/10",
  done: "text-emerald-400 bg-emerald-500/10",
  cors_error: "text-red-400 bg-red-500/10",
  submit_failed: "text-red-400 bg-red-500/10",
  render_failed: "text-orange-400 bg-orange-500/10",
  timeout: "text-amber-400 bg-amber-500/10",
};

export default function Json2VideoTestPanel({ cardStyle, mutedStyle }) {
  const [testing, setTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);

  const loadAttempts = async () => {
    try {
      const logs = await db.entities.AIUsageLog.list("-created_date", 300);
      setAttempts(logs.filter(l => l.feature?.startsWith("json2video")));
    } catch {}
    setLoadingAttempts(false);
  };

  useEffect(() => { loadAttempts(); }, []);

  const runTest = async () => {
    setTesting(true);
    setStatusMsg("Building minimal test payload...");
    setResult(null);
    setError("");

    // Minimal test payload: single scene, text only, HD low quality (fastest)
    const testPayload = {
      resolution: "hd",
      quality: "low",
      cache: false,
      scenes: [{
        comment: "DevDashboard connectivity test",
        "background-color": "#1a1a2e",
        elements: [{
          type: "text",
          text: "JSON2Video Test — Cognita AI Studio",
          duration: 5,
          settings: {
            "font-family": "Roboto",
            "font-size": "48px",
            "font-weight": "700",
            "font-color": "#a78bfa",
            "text-align": "center",
            "vertical-position": "center",
            "horizontal-position": "center",
          },
        }],
      }],
    };

    try {
      setStatusMsg("Submitting to JSON2Video API...");
      const videoUrl = await renderVideoWithJson2Video(testPayload, (msg) => setStatusMsg(msg));
      setResult(videoUrl);
      await loadAttempts();
    } catch (err) {
      setError(err?.message || "Unknown error");
      await loadAttempts();
    } finally {
      setTesting(false);
      setStatusMsg("");
    }
  };

  return (
    <div className="rounded-2xl p-6" style={cardStyle}>
      <h3 className="font-black text-base mb-1 flex items-center gap-2">
        🎬 JSON2Video API Test & Attempts
      </h3>
      <p className="text-sm mb-4" style={mutedStyle}>
        Send a minimal render job to JSON2Video. Tracks all attempts (submit, done, CORS errors, failures) in the log below.
      </p>

      {/* API info */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
        <p className="text-xs font-bold mb-2 text-pink-400">📋 API Details</p>
        <div className="space-y-1 text-xs font-mono">
          <div><span className="opacity-50">URL: </span>{JSON2VIDEO_BASE_URL}</div>
          <div><span className="opacity-50">Key: </span>{JSON2VIDEO_API_KEY.slice(0, 20)}…</div>
          <div><span className="opacity-50">Monthly limit: </span>{JSON2VIDEO_MONTHLY_LIMIT} video/user</div>
          <div className="mt-2 text-amber-400 text-[10px]">
            ⚠️ JSON2Video API may block direct browser requests due to CORS. If CORS is confirmed, a backend proxy is needed.
          </div>
        </div>
      </div>

      <button
        onClick={runTest}
        disabled={testing}
        className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all mb-4"
      >
        {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        {testing ? (statusMsg || "Testing...") : "🎬 Run JSON2Video Test"}
      </button>

      {error && (
        <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <p className="text-xs font-bold text-red-400 mb-1">❌ Error</p>
          <p className="text-xs text-red-300 font-mono whitespace-pre-wrap">{error}</p>
          {error.includes("CORS") && (
            <p className="text-xs text-amber-400 mt-2">
              💡 CORS block confirmed — the browser cannot reach JSON2Video directly. A Base44 backend function proxy is needed.
            </p>
          )}
        </div>
      )}

      {result && (
        <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <p className="text-xs font-bold text-emerald-400 mb-2">✅ Render complete!</p>
          <a href={result} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 underline break-all">{result}</a>
          <video src={result} controls className="w-full mt-3 rounded-xl" style={{ maxHeight: 220 }} />
        </div>
      )}

      {/* Attempt history */}
      <div>
        <p className="text-xs font-bold mb-2 opacity-50">Attempt Log ({attempts.length})</p>
        {loadingAttempts ? (
          <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
        ) : attempts.length === 0 ? (
          <p className="text-xs opacity-30">No attempts yet. Run a test or generate a video on the Media page.</p>
        ) : (
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {attempts.slice(0, 30).map(a => {
              const stage = a.feature?.replace("json2video_", "") || "?";
              return (
                <div key={a.id} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${STATUS_COLORS[stage] || "text-violet-400 bg-violet-500/10"}`}>
                    {stage}
                  </span>
                  <span className="text-xs flex-1 truncate font-mono opacity-60">{a.user_email?.split("@")[0] || "—"}</span>
                  <span className="text-[10px] opacity-40 shrink-0">{new Date(a.created_date).toLocaleTimeString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}