import { db } from '@/lib/firebase';

import { useEffect, useRef } from "react";

const RATE_KEY = "cognita_act_log";
const FLAGGED_KEY = "cognita_flagged";

// Thresholds
const THRESHOLDS = {
  ai_requests_per_minute: 15,       // >15 AI calls in 60s
  deck_creates_per_minute: 10,      // >10 decks created in 60s
  flashcard_creates_per_minute: 60, // >60 cards in 60s
};

function getLog() {
  try { return JSON.parse(localStorage.getItem(RATE_KEY) || "{}"); }
  catch { return {}; }
}

function saveLog(log) {
  localStorage.setItem(RATE_KEY, JSON.stringify(log));
}

export function recordActivity(type) {
  const now = Date.now();
  const log = getLog();
  if (!log[type]) log[type] = [];
  log[type] = [...log[type].filter(t => now - t < 60000), now];
  saveLog(log);
  return log[type].length;
}

async function suspendUser(user, trigger, details) {
  const alreadyFlagged = localStorage.getItem(FLAGGED_KEY) === user.email;
  if (alreadyFlagged) return;
  localStorage.setItem(FLAGGED_KEY, user.email);
  await db.entities.SuspendedUser.create({
    user_email: user.email,
    reason: `Automated suspension: suspicious activity detected`,
    trigger,
    details,
    status: "suspended",
  });
  // Notify admin
  await db.integrations.Core.SendEmail({
    to: "yohanyinyuchang@gmail.com",
    subject: `⚠️ Suspicious Activity — ${user.email}`,
    body: `<p>User <strong>${user.email}</strong> has been automatically suspended.</p>
<p><strong>Trigger:</strong> ${trigger}</p>
<p><strong>Details:</strong> ${details}</p>
<p>Review in the <a href="${window.location.origin}/DevDashboard">Dev Dashboard → Moderation tab</a>.</p>`,
  });
}

export function useSuspiciousActivity(user) {
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!user?.email || checkedRef.current) return;
    checkedRef.current = true;

    // Subscribe to entity creates to detect bursts
    const unsubDecks = db.entities.Deck.subscribe(event => {
      if (event.type !== "create") return;
      if (event.data?.created_by !== user.email) return;
      const count = recordActivity("deck_creates_per_minute");
      if (count > THRESHOLDS.deck_creates_per_minute) {
        suspendUser(user, "deck_create_burst",
          `Created ${count} decks within 60 seconds.`);
      }
    });

    const unsubCards = db.entities.Flashcard.subscribe(event => {
      if (event.type !== "create") return;
      if (event.data?.created_by !== user.email && event.data?.author_email !== user.email) return;
      const count = recordActivity("flashcard_creates_per_minute");
      if (count > THRESHOLDS.flashcard_creates_per_minute) {
        suspendUser(user, "flashcard_create_burst",
          `Created ${count} flashcards within 60 seconds.`);
      }
    });

    return () => { unsubDecks(); unsubCards(); };
  }, [user?.email]);
}