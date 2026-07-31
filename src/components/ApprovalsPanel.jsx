import { db } from '@/lib/firebase';

import { useState } from "react";

import { CheckCircle2, XCircle, Loader2, Clock, UserCheck } from "lucide-react";

export default function ApprovalsPanel({ approvals, onUpdate, cardStyle, mutedStyle }) {
  const [updating, setUpdating] = useState(null);
  const [rejectReason, setRejectReason] = useState({});

  const setStatus = async (record, status) => {
    setUpdating(record.id);
    const updated = await db.entities.PendingApproval.update(record.id, {
      status,
      reviewed_by: "admin",
      rejection_reason: status === "rejected" ? (rejectReason[record.id] || "") : undefined,
    });
    onUpdate(updated);
    setUpdating(null);
  };

  const pending = approvals.filter(a => a.status === "pending");
  const reviewed = approvals.filter(a => a.status !== "pending");

  const statusColor = {
    pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    approved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    rejected: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pending.length, color: "text-amber-400" },
          { label: "Approved", value: approvals.filter(a => a.status === "approved").length, color: "text-emerald-400" },
          { label: "Rejected", value: approvals.filter(a => a.status === "rejected").length, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center" style={cardStyle}>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs mt-1" style={mutedStyle}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending section */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h2 className="font-black text-lg mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          Pending Approvals
          {pending.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-lg text-xs font-black bg-amber-500/20 text-amber-400">{pending.length}</span>
          )}
        </h2>

        {pending.length === 0 && (
          <div className="text-center py-10">
            <UserCheck className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
            <p className="font-bold mb-1">All caught up!</p>
            <p className="text-sm" style={mutedStyle}>No pending approvals.</p>
          </div>
        )}

        <div className="space-y-4">
          {pending.map(a => (
            <div key={a.id} className="rounded-2xl p-4" style={{ background: "var(--app-bg)", border: "2px solid rgba(245,158,11,0.3)" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-black text-base">{a.user_email}</p>
                  {a.user_name && <p className="text-xs mt-0.5" style={mutedStyle}>{a.user_name}</p>}
                  <p className="text-xs mt-1" style={mutedStyle}>Requested: {new Date(a.created_date).toLocaleString()}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${statusColor.pending}`}>pending</span>
              </div>
              <input
                value={rejectReason[a.id] || ""}
                onChange={e => setRejectReason(prev => ({ ...prev, [a.id]: e.target.value }))}
                placeholder="Rejection reason (optional)"
                className="w-full px-3 py-2 rounded-xl text-xs outline-none mb-3"
                style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setStatus(a, "approved")}
                  disabled={updating === a.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 disabled:opacity-40 transition-all"
                >
                  {updating === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Approve
                </button>
                <button
                  onClick={() => setStatus(a, "rejected")}
                  disabled={updating === a.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-40 transition-all"
                >
                  {updating === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />} Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviewed section */}
      {reviewed.length > 0 && (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h3 className="font-bold text-sm mb-3">Previously Reviewed ({reviewed.length})</h3>
          <div className="space-y-2">
            {reviewed.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{a.user_email}</p>
                  {a.rejection_reason && <p className="text-[10px] text-red-400 mt-0.5">{a.rejection_reason}</p>}
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${statusColor[a.status] || ""}`}>{a.status}</span>
                <button
                  onClick={() => setStatus(a, "pending")}
                  className="text-[10px] px-2 py-1 rounded-lg opacity-50 hover:opacity-100 transition-all font-semibold"
                  style={{ border: "1px solid var(--app-border)" }}
                >
                  Reset
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}