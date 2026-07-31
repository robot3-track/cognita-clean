import { useState } from "react";
import { 
  Settings2, X, Check, TrendingUp, GraduationCap, 
  Layers, Globe, BarChart3, Compass 
} from "lucide-react";

const LAYOUT_KEY = "cognita_home_layout";

export const DEFAULT_LAYOUT = {
  showTrending: true,
  showMyClasses: true,
  showRecentDecks: true,
  showCommunityDecks: true,
  showLiveCounters: true,
  showTools: true,
};

export function getHomeLayout() {
  try {
    return { ...DEFAULT_LAYOUT, ...JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}") };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export function saveHomeLayout(layout) {
  localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
}

const WIDGETS = [
  { key: "showTrending", label: "Trending Decks", icon: TrendingUp },
  { key: "showMyClasses", label: "My Classes", icon: GraduationCap },
  { key: "showRecentDecks", label: "Recent Decks", icon: Layers },
  { key: "showCommunityDecks", label: "Community Decks", icon: Globe },
  { key: "showLiveCounters", label: "Study Stats", icon: BarChart3 },
  { key: "showTools", label: "All Tools", icon: Compass },
];

export default function HomeLayoutCustomizer({ layout, onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (key) => {
    const next = { ...layout, [key]: !layout[key] };
    onChange(next);
    saveHomeLayout(next);
  };

  return (
    <div className="relative z-[90]">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all opacity-70 hover:opacity-100"
        style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
        title="Customize home layout"
      >
        <Settings2 className="w-3.5 h-3.5" />
        <span>Customize</span>
      </button>

      {open && (
        <>
          {/* Backdrop layer elevated to click away above everything */}
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          
          {/* Main customized layout menu context box */}
          <div className="absolute right-0 top-full mt-1.5 z-[100] rounded-2xl shadow-2xl w-60 sm:w-64 max-w-[calc(100vw-2rem)] origin-top-right py-3 px-3 transition-all"
            style={{ background: "var(--app-surface-solid, var(--app-surface))", border: "1px solid var(--app-border)", color: "var(--app-text)" }}>
            
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-bold text-slate-400">Show / hide sections</span>
              <button onClick={() => setOpen(false)} className="opacity-40 hover:opacity-80 text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5">
              {WIDGETS.map(({ key, label, icon: IconComponent }) => (
                <button 
                  key={key} 
                  onClick={() => toggle(key)}
                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-colors hover:bg-white/5 text-left text-xs font-semibold"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-950/40 border border-slate-800/40 flex items-center justify-center text-slate-400">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1 text-slate-200 font-medium">{label}</span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${layout[key] ? "bg-violet-500 text-white" : "bg-white/10"}`}>
                    {layout[key] && <Check className="w-2.5 h-2.5" />}
                  </div>
                </button>
              ))}
            </div>
            
          </div>
        </>
      )}
    </div>
  );
}