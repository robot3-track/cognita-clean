import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Loader2, ShieldCheck } from "lucide-react";

export default function VerifyRequestButton({ deck, user, cardStyle, mutedStyle }) {
  const [status, setStatus] = useState(null); // null | "pending" | "sent"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!deck?.id || !user?.email) return;
    db.entities.PendingApproval.filter({ deck_id: deck.id, requester_email: user.email }, "-created_date", 1)
      .then(results => {
        if (results.length > 0) setStatus(results[0].status || "pending");
      })
      .catch(() => {});
  }, [deck?.id, user?.email]);

  const requestVerification = async () => {
    setLoading(true);
    await db.entities.PendingApproval.create({
      deck_id: deck.id,
      deck_title: deck.title,
      requester_email: user.email,
      requester_name: user.full_name || user.email,
      type: "verify_deck",
      status: "pending",
    });
    setStatus("pending");
    setLoading(false);
  };

  if (status === "pending") {
    return (
      <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-amber-400"
        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
        <Loader2 className="w-4 h-4 animate-spin" />
        Verification request pending review by admins
      </div>
    );
  }

  if (status === "approved") {
    return null; // already verified
  }

  return (
    <button
      onClick={requestVerification}
      disabled={loading}
      className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
      style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa" }}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
      Request Verified Badge
    </button>
  );
}