import { db } from '@/lib/firebase';

import { useState } from "react";
import { MessageSquarePlus, Send, CheckCircle2, Star } from "lucide-react";

import { useTranslation } from "../hooks/useTranslation";

export default function FeedbackWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!message.trim()) return;
    setSending(true);
    let userEmail = "", userName = "";
    try { const me = await db.auth.me(); userEmail = me.email; userName = me.full_name || ""; } catch {}
    await db.entities.Feedback.create({
      user_email: userEmail,
      user_name: userName,
      message: message.trim(),
      rating: rating || undefined,
      page: window.location.pathname,
    });
    setSent(true);
    setSending(false);
    setTimeout(() => { setSent(false); setOpen(false); setMessage(""); setRating(0); }, 2500);
  };

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--app-border)" }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold opacity-50 hover:opacity-80 transition-all"
          style={cardStyle}
        >
          <MessageSquarePlus className="w-4 h-4" /> {t('sendFeedback')}
        </button>
      ) : sent ? (
        <div className="flex flex-col items-center gap-2 py-6 rounded-2xl" style={cardStyle}>
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          <p className="font-bold text-sm">{t('feedbackThanks')}</p>
        </div>
      ) : (
        <div className="rounded-2xl p-4 space-y-3" style={cardStyle}>
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm">{t('sendFeedback')}</p>
            <button onClick={() => setOpen(false)} className="text-xs opacity-40 hover:opacity-70 px-2 py-1 rounded-lg" style={{ color: "var(--app-text)" }}>✕</button>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs mr-1" style={mutedStyle}>{t('ratingLabel')}:</span>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                <Star className={`w-5 h-5 ${rating >= s ? "text-amber-400 fill-amber-400" : "text-amber-400/30"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="What's on your mind? Bugs, suggestions, compliments..."
            rows={3}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
            style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
          />
          <button
            onClick={submit}
            disabled={!message.trim() || sending}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            <Send className="w-3.5 h-3.5" /> {sending ? t('feedbackSending') : t('feedbackSend')}
          </button>
        </div>
      )}
    </div>
  );
}