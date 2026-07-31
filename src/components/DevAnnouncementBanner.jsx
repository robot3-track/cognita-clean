import { db } from '@/lib/firebase';

// Shows active announcement banners to ALL users (read-only display)
// The admin panel for creating/managing banners lives in DevDashboard.
import { useState, useEffect } from "react";

import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";

const isDark = () => document.documentElement.classList.contains("dark");

export const TYPE_CONFIG = {
  info:    { bg: "rgba(59,130,246,0.12)",  lightBg: "rgb(219,234,254)",  border: "rgba(59,130,246,0.35)",  lightBorder: "rgb(147,197,253)", darkText: "rgb(147,197,253)", lightText: "rgb(29,78,216)",   Icon: Info },
  warning: { bg: "rgba(245,158,11,0.12)",  lightBg: "rgb(254,243,199)",  border: "rgba(245,158,11,0.35)",  lightBorder: "rgb(252,211,77)",  darkText: "rgb(252,211,77)",  lightText: "rgb(120,53,15)",   Icon: AlertTriangle },
  error:   { bg: "rgba(239,68,68,0.12)",   lightBg: "rgb(254,226,226)",  border: "rgba(239,68,68,0.35)",   lightBorder: "rgb(252,165,165)", darkText: "rgb(252,165,165)", lightText: "rgb(153,27,27)",   Icon: AlertTriangle },
  success: { bg: "rgba(16,185,129,0.12)",  lightBg: "rgb(209,250,229)",  border: "rgba(16,185,129,0.35)",  lightBorder: "rgb(110,231,183)", darkText: "rgb(110,231,183)", lightText: "rgb(6,78,59)",     Icon: CheckCircle },
};

function getTextColor(cfg) {
  return isDark() ? cfg.darkText : cfg.lightText;
}

function getBg(cfg) {
  return isDark() ? cfg.bg : cfg.lightBg;
}

function getBorder(cfg) {
  return isDark() ? cfg.border : cfg.lightBorder;
}

export default function DevAnnouncementBanner() {
  const [banners, setBanners] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    db.entities.AnnouncementBanner.filter({ active: true }).then(setBanners).catch(() => {});
    try { setDismissed(new Set(JSON.parse(localStorage.getItem("cognita_dismissed_banners") || "[]"))); } catch {}
  }, []);

  const dismiss = (id) => {
    setDismissed(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("cognita_dismissed_banners", JSON.stringify([...next]));
      return next;
    });
  };

  const visible = banners.filter(b => !dismissed.has(b.id));
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col">
      {visible.map(b => {
        const cfg = TYPE_CONFIG[b.type] || TYPE_CONFIG.info;
        const { Icon } = cfg;
        return (
          <div key={b.id} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium" style={{ background: getBg(cfg), borderBottom: `1px solid ${getBorder(cfg)}`, color: getTextColor(cfg) }}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">
              {b.message}
              {b.link && b.link.trim() && (
                <a
                  href={b.link.startsWith("http") ? b.link : `https://${b.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline font-bold opacity-80 hover:opacity-100"
                  onClick={e => e.stopPropagation()}
                >
                  Learn more →
                </a>
              )}
            </span>
            <button onClick={() => dismiss(b.id)} className="opacity-60 hover:opacity-100 transition-all shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}