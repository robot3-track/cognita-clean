import { useState, useEffect } from "react";
import { Moon, Sun, Monitor, Bell, Shield, Lock, Globe, Eye, Server, UserCheck } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export const THEME_KEY = "cognita_theme";
const NOTIF_KEY = "cognita_notifications";
const NOTIF_LAST_KEY = "cognita_notif_last";

export function applyTheme(theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && prefersDark);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.documentElement.classList.toggle("dark", isDark);
  // Apply CSS vars for light/dark
  if (isDark) {
    document.documentElement.style.setProperty("--app-bg", "#0a0a0f");
    document.documentElement.style.setProperty("--app-surface", "rgba(255,255,255,0.04)");
    document.documentElement.style.setProperty("--app-surface-solid", "#16161f");
    document.documentElement.style.setProperty("--app-border", "rgba(255,255,255,0.08)");
    document.documentElement.style.setProperty("--app-text", "#ffffff");
    document.documentElement.style.setProperty("--app-text-muted", "rgba(255,255,255,0.4)");
    document.documentElement.style.setProperty("--app-nav-bg", "rgba(10,10,15,0.95)");
  } else {
    /* Warm stone light mode — natural, easy on the eyes, professional */
    document.documentElement.style.setProperty("--app-bg", "#FAFAF9");          /* warm off-white */
    document.documentElement.style.setProperty("--app-surface", "rgba(28,25,23,0.05)");  /* subtle warm tint */
    document.documentElement.style.setProperty("--app-surface-solid", "#F5F5F4"); /* stone-100 */
    document.documentElement.style.setProperty("--app-border", "rgba(28,25,23,0.10)");   /* warm border */
    document.documentElement.style.setProperty("--app-text", "#1C1917");         /* stone-900 */
    document.documentElement.style.setProperty("--app-text-muted", "#78716C");   /* stone-500 */
    document.documentElement.style.setProperty("--app-nav-bg", "rgba(250,250,249,0.97)"); /* nav bar */
  }
}

function scheduleWeeklyNotification() {
  if (!("Notification" in window)) return;
  const last = localStorage.getItem(NOTIF_LAST_KEY);
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  if (!last || now - parseInt(last) >= oneWeek) {
    if (Notification.permission === "granted") {
      new Notification("Cognita Study Reminder 📚", {
        body: "You haven't studied this week yet! Open Cognita to keep your streak going.",
        icon: "/favicon.ico",
      });
      localStorage.setItem(NOTIF_LAST_KEY, String(now));
    }
  }
}

export default function Settings() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "system");
  const [notifications, setNotifications] = useState(() => localStorage.getItem(NOTIF_KEY) === "true");
  const [notifPermission, setNotifPermission] = useState(() =>
    "Notification" in window ? Notification.permission : "denied"
  );

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, String(notifications));
    if (notifications) scheduleWeeklyNotification();
  }, [notifications]);

  const handleNotificationToggle = async () => {
    if (!("Notification" in window)) {
      return; // Not supported
    }
    if (!notifications) {
      if (Notification.permission === "denied") return;
      if (Notification.permission === "default") {
        try {
          const perm = await Notification.requestPermission();
          setNotifPermission(perm);
          if (perm !== "granted") return;
        } catch (e) {
          return;
        }
      }
      setNotifications(true);
    } else {
      setNotifications(false);
    }
  };

  const themeOptions = [
    { value: "light", label: t('lightMode'), icon: Sun },
    { value: "dark", label: t('darkMode'), icon: Moon },
    { value: "system", label: t('systemMode'), icon: Monitor },
  ];

  return (
    <div className="min-h-screen px-6 py-12 max-w-lg mx-auto pb-28" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      <h1 className="text-3xl font-black tracking-tight mb-8">{t('settingsTitle')}</h1>

      {/* Appearance */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-3 px-1" style={{ color: "var(--app-text-muted)" }}>{t('appearance')}</h2>
        <div className="rounded-3xl p-5" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
          <p className="text-sm mb-4" style={{ color: "var(--app-text-muted)" }}>{t('screenMode')}</p>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl border text-sm font-medium transition-all ${
                  theme === value
                    ? "bg-violet-600/20 border-violet-500/50 text-violet-500"
                    : "opacity-50 hover:opacity-80"
                }`}
                style={theme !== value ? { border: "1px solid var(--app-border)" } : {}}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-3 px-1" style={{ color: "var(--app-text-muted)" }}>{t('notifications')}</h2>
        <div className="rounded-3xl" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" style={{ color: "var(--app-text-muted)" }} />
              <div>
                <span className="text-sm font-medium">{t('weeklyReminders')}</span>
                {notifPermission === "denied" && (
                  <p className="text-xs text-red-400 mt-0.5">{t('notificationsBlocked')}</p>
                )}
                {notifications && notifPermission === "granted" && (
                  <p className="text-xs text-emerald-500 mt-0.5">{t('reminderEnabled')}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleNotificationToggle}
              disabled={notifPermission === "denied"}
              className={`w-11 h-6 rounded-full transition-colors relative disabled:opacity-40 ${notifications && notifPermission === "granted" ? "bg-violet-600" : "bg-black/10 dark:bg-white/10"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notifications && notifPermission === "granted" ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-3 px-1" style={{ color: "var(--app-text-muted)" }}>{t('privacySecurity')}</h2>

        {/* Full privacy statement */}
        <div className="rounded-3xl p-5 mb-3" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.08))", border: "1px solid rgba(139,92,246,0.2)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-sm text-violet-400">Cognita Privacy Commitment</h3>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--app-text-muted)" }}>
            Cognita is built with your privacy as a first principle. We collect only the minimum information required to provide our service — your email address for authentication and the study content you create. We never sell, rent, share, or monetize your personal data with any third party, advertiser, or data broker.
          </p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--app-text-muted)" }}>
            Your flashcards, notes, chat history, and quiz results are stored securely and are only accessible by you. When you use AI features, your prompts are processed to generate a response and are not used to train any AI model or retained beyond your session.
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--app-text-muted)" }}>
            Public decks you voluntarily share are visible to the community. You can make any deck private at any time. We do not display targeted advertising or use behavioral tracking. Analytics we collect are limited to aggregate, anonymized usage patterns to improve the product — never tied to your identity.
          </p>
        </div>

        <div className="rounded-3xl divide-y" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderColor: "var(--app-border)" }}>
          {[
            { icon: Lock, color: "text-blue-400", title: "End-to-end secure storage", desc: "All your data is stored with industry-standard encryption at rest and in transit (TLS 1.3). Only you can access your personal study content." },
            { icon: Eye, color: "text-emerald-400", title: "No hidden tracking", desc: "We do not use third-party ad trackers, fingerprinting, or behavioral profiling. No pixel tags. No cross-site tracking." },
            { icon: UserCheck, color: "text-violet-400", title: "You own your data", desc: "Your content belongs to you. You can delete your decks, chats, and sessions at any time. We honor your right to be forgotten." },
            { icon: Server, color: "text-amber-400", title: "AI usage stays yours", desc: "Prompts sent to our AI are used only to generate your response. They are not stored for model training or shared with AI providers beyond the immediate request." },
            { icon: Globe, color: "text-pink-400", title: "No data sold — ever", desc: "We will never sell, license, or trade your personal information. Our business model is built on your subscription, not your data." },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="flex items-start gap-4 px-5 py-4">
              <Icon className={`w-4 h-4 ${color} mt-0.5 shrink-0`} />
              <div>
                <p className="text-sm font-medium mb-1">{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--app-text-muted)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-3 px-1" style={{ color: "var(--app-text-muted)" }}>About</h2>
        <div className="rounded-3xl px-5 py-4" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
          <p className="text-sm" style={{ color: "var(--app-text-muted)" }}>Cognita v1.6.0</p>
          <p className="text-xs mt-1" style={{ color: "var(--app-text-muted)", opacity: 0.5 }}>© 2026 Cognita. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
}