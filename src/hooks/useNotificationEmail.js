import { db } from '@/lib/firebase';

import { useEffect } from "react";

const EMAILED_KEY = "cognita_emailed_notifs";
const APP_URL = window.location.origin;

function getEmailedIds() {
  try { return new Set(JSON.parse(localStorage.getItem(EMAILED_KEY) || "[]")); }
  catch { return new Set(); }
}

function markEmailed(id) {
  const ids = getEmailedIds();
  ids.add(id);
  localStorage.setItem(EMAILED_KEY, JSON.stringify([...ids].slice(-200)));
}

export function useNotificationEmail(user) {
  useEffect(() => {
    if (!user?.email) return;

    const unsubscribe = db.entities.AppNotification.subscribe(async (event) => {
      if (event.type !== "create") return;
      const notif = event.data;
      if (notif.recipient_email !== user.email) return;
      if (notif.read) return;

      const emailed = getEmailedIds();
      if (emailed.has(event.id)) return;

      markEmailed(event.id);

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#ffffff;">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
      <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#2563eb);display:flex;align-items:center;justify-content:center;font-size:18px;">✨</div>
      <span style="font-size:20px;font-weight:900;letter-spacing:-0.5px;">Cognita</span>
    </div>

    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;margin-bottom:20px;">
      <div style="font-size:18px;margin-bottom:6px;">${notif.icon || "🔔"} ${notif.title}</div>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">${notif.message}</p>
    </div>

    <a href="${notif.link ? APP_URL + notif.link : APP_URL}" style="display:block;text-align:center;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#ffffff;font-size:15px;font-weight:700;padding:14px 24px;border-radius:14px;text-decoration:none;margin-bottom:24px;">
      ${notif.icon === "message" ? "Open Group Chat →" : "View in Cognita →"}
    </a>

    <p style="font-size:12px;color:rgba(255,255,255,0.25);text-align:center;margin:0;">
      You received this because you have a new notification on Cognita.
    </p>
  </div>
</body>
</html>`;

      await db.integrations.Core.SendEmail({
        to: user.email,
        subject: `${notif.icon || "🔔"} ${notif.title} — Cognita`,
        body: html,
      });
    });

    return unsubscribe;
  }, [user?.email]);
}