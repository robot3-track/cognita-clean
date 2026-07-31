import { db } from '@/lib/firebase';

// Mobile full-screen announcement popup
// Shows on 2nd+ login, dismissed permanently per banner per device
import { useState, useEffect } from "react";

import { X, Megaphone } from "lucide-react";
import { TYPE_CONFIG } from "./DevAnnouncementBanner";

const POPUP_SHOWN_KEY = "cognita_popup_shown_banners";
const LOGIN_COUNT_KEY = "cognita_login_count";

function getLoginCount() {
  try { return parseInt(localStorage.getItem(LOGIN_COUNT_KEY) || "0"); } catch { return 0; }
}
function incrementLoginCount() {
  try {
    const c = getLoginCount() + 1;
    localStorage.setItem(LOGIN_COUNT_KEY, String(c));
    return c;
  } catch { return 1; }
}
function getShownIds() {
  try { return new Set(JSON.parse(localStorage.getItem(POPUP_SHOWN_KEY) || "[]")); } catch { return new Set(); }
}
function markShown(id) {
  try {
    const ids = getShownIds();
    ids.add(id);
    localStorage.setItem(POPUP_SHOWN_KEY, JSON.stringify([...ids]));
  } catch {}
}

export default function AnnouncementPopup() {
  const [banner, setBanner] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on mobile
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    // Track login count - increment once per page session
    const sessionKey = "cognita_popup_session_counted";
    let loginCount = getLoginCount();
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      loginCount = incrementLoginCount();
    }

    // Only show on 2nd login or later
    if (loginCount < 2) return;

    // Fetch active banners and find one not yet shown
    db.entities.AnnouncementBanner.filter({ active: true }).then(banners => {
      const shown = getShownIds();
      const unseen = banners.filter(b => !shown.has(b.id));
      if (unseen.length > 0) {
        // Show the most recent unseen banner
        const b = unseen.sort((a, b2) => new Date(b2.created_date) - new Date(a.created_date))[0];
        setBanner(b);
        setVisible(true);
      }
    }).catch(() => {});
  }, []);

  const dismiss = () => {
    if (banner) markShown(banner.id);
    setVisible(false);
  };

  if (!visible || !banner) return null;

  const cfg = TYPE_CONFIG[banner.type] || TYPE_CONFIG.info;
  const { Icon } = cfg;

  return (
    <div
      className="md:hidden fixed inset-0 z-[200] flex flex-col items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "var(--app-surface)", border: `2px solid ${cfg.border}` }}
      >
        {/* Colored top bar */}
        <div className="h-2 w-full" style={{ background: cfg.border }} />

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
              <Megaphone className="w-5 h-5" style={{ color: cfg.darkText }} />
            </div>
            <div>
              <p className="font-black text-base" style={{ color: "var(--app-text)" }}>Announcement</p>
              <p className="text-xs opacity-50" style={{ color: "var(--app-text)" }}>
                {banner.type?.charAt(0).toUpperCase() + banner.type?.slice(1)} notice
              </p>
            </div>
            <button
              onClick={dismiss}
              className="ml-auto p-2 rounded-xl opacity-60 hover:opacity-100 transition-all"
              style={{ background: "var(--app-bg)" }}
            >
              <X className="w-5 h-5" style={{ color: "var(--app-text)" }} />
            </button>
          </div>

          <p
            className="text-sm leading-relaxed mb-5"
            style={{ color: "var(--app-text)" }}
          >
            {banner.message}
          </p>

          {banner.link && banner.link.trim() && (
            <a
              href={banner.link.startsWith("http") ? banner.link : `https://${banner.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm font-semibold underline mb-4"
              style={{ color: cfg.darkText }}
            >
              Learn more →
            </a>
          )}

          <button
            onClick={dismiss}
            className="w-full py-3 rounded-2xl font-bold text-sm transition-all"
            style={{ background: cfg.bg, color: cfg.darkText, border: `1px solid ${cfg.border}` }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}