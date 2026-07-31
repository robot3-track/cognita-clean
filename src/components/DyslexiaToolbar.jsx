import { useState } from "react";
import { Volume2, Type, ChevronDown } from "lucide-react";

const FONTS = [
  { label: "Default", value: "inherit" },
  { label: "OpenDyslexic", value: "'OpenDyslexic', sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Comic Sans", value: "'Comic Sans MS', cursive" },
  { label: "Lexie Readable", value: "'Lexie Readable', Arial, sans-serif" },
];

const SIZES = [
  { label: "Normal", value: "1rem" },
  { label: "Large", value: "1.15rem" },
  { label: "X-Large", value: "1.3rem" },
];

/**
 * DyslexiaToolbar — lets users pick a reading-friendly font, size, and TTS audio.
 * Pass `text` to enable "Read Aloud" button.
 * Pass `onFontChange(fontFamily, fontSize)` to apply font to parent.
 */
export default function DyslexiaToolbar({ text, onFontChange }) {
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState(FONTS[0]);
  const [size, setSize] = useState(SIZES[0]);
  const [speaking, setSpeaking] = useState(false);

  const apply = (newFont, newSize) => {
    // Apply directly to document root so it affects all text
    document.documentElement.style.setProperty("--dyslexia-font", newFont.value);
    document.documentElement.style.setProperty("--dyslexia-size", newSize.value);
    if (onFontChange) onFontChange(newFont.value, newSize.value);
  };

  const selectFont = (f) => { setFont(f); apply(f, size); };
  const selectSize = (s) => { setSize(s); apply(font, s); };

  const readAloud = () => {
    if (!text) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.slice(0, 5000));
    utt.rate = 0.9; utt.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === "en-US" || v.name.includes("Samantha"));
    if (preferred) utt.voice = preferred;
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
    setSpeaking(true);
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      {/* Font/Accessibility menu */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/10"
        style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "rgb(167,139,250)" }}
        title="Dyslexia-friendly font & size"
      >
        <Type className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Accessibility</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Read Aloud */}
      {text && (
        <button
          onClick={readAloud}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${speaking ? "bg-violet-600 text-white" : "hover:bg-white/10"}`}
          style={!speaking ? { background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "rgb(167,139,250)" } : {}}
          title={speaking ? "Stop reading" : "Read aloud"}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{speaking ? "Stop" : "Read Aloud"}</span>
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 rounded-2xl shadow-2xl p-4 min-w-52"
          style={{ background: "var(--app-surface-solid, var(--app-surface))", border: "1px solid var(--app-border)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--app-text-muted)" }}>Font</p>
          <div className="space-y-1 mb-3">
            {FONTS.map(f => (
              <button key={f.value} onClick={() => selectFont(f)}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all ${font.value === f.value ? "bg-violet-500/20 text-violet-400" : "hover:bg-white/5"}`}
                style={{ fontFamily: f.value }}>
                {f.label} — Sample Aa
              </button>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--app-text-muted)" }}>Size</p>
          <div className="flex gap-1">
            {SIZES.map(s => (
              <button key={s.value} onClick={() => selectSize(s)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${size.value === s.value ? "bg-violet-500/20 text-violet-400" : "hover:bg-white/5"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}