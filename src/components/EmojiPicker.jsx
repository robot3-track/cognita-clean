const EMOJIS = [
  "😀","😂","🥹","😍","🤔","😭","😎","🤗","😅","🥰",
  "👍","👎","❤️","🔥","💯","🎉","👏","💪","✅","❌",
  "📚","🧠","🎯","⭐","🏆","💡","🙏","👀","💬","🎓",
  "😤","🤯","😴","🫡","🤝","✨","🫶","💀","🗿","👾",
];

export default function EmojiPicker({ onSelect, onClose }) {
  return (
    <div
      className="absolute bottom-full left-0 mb-2 p-3 rounded-2xl shadow-2xl z-30"
      style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }}
      onClick={e => e.stopPropagation()}
    >
      <div className="grid grid-cols-8 gap-1">
        {EMOJIS.map(e => (
          <button
            key={e}
            onClick={() => { onSelect(e); onClose(); }}
            className="text-xl hover:scale-125 transition-transform w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}