import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Loader2, Mail, RefreshCw } from "lucide-react";

const TYPE_COLORS = {
  verification: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  resend_verification: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  notification: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  other: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

export default function EmailLogsTab({ cardStyle, mutedStyle }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await db.entities.EmailLog.list("-created_date", 200);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    const unsubscribe = db.entities.EmailLog.subscribe((event) => {
      if (event.type === "create") {
        setLogs(prev => [event.data, ...prev]);
      } else if (event.type === "update") {
        setLogs(prev => prev.map(l => l.id === event.id ? event.data : l));
      } else if (event.type === "delete") {
        setLogs(prev => prev.filter(l => l.id !== event.id));
      }
    });
    return unsubscribe;
  }, []);

  const sent = logs.filter(l => l.status !== "failed").length;
  const failed = logs.filter(l => l.status === "failed").length;

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Sent", value: logs.length, color: "text-violet-400" },
          { label: "Successful", value: sent, color: "text-emerald-400" },
          { label: "Failed", value: failed, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center" style={cardStyle}>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs mt-1" style={mutedStyle}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm flex items-center gap-2"><Mail className="w-4 h-4 text-violet-400" /> Email Log (last 200)</h2>
          <button onClick={fetchLogs} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold opacity-60 hover:opacity-100 transition-all" style={{ border: "1px solid var(--app-border)" }}>
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        {logs.length === 0 && (
          <p className="text-sm text-center py-8" style={mutedStyle}>No emails logged yet. They'll appear here when users register or request codes.</p>
        )}

        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold truncate">{log.to_email}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${TYPE_COLORS[log.type] || TYPE_COLORS.other}`}>
                    {log.type?.replace("_", " ")}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${log.status === "failed" ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>
                    {log.status || "sent"}
                  </span>
                </div>
                {log.subject && <p className="text-xs mt-0.5" style={mutedStyle}>{log.subject}</p>}
                {log.error_message && <p className="text-xs mt-0.5 text-red-400">{log.error_message}</p>}
              </div>
              <span className="text-[10px] shrink-0" style={mutedStyle}>{new Date(log.created_date).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}