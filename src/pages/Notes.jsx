import { db } from '@/lib/firebase';

import { useState, useEffect, useRef, useCallback } from "react";

import {
  Plus, Trash2, Search, Pin, FileText, Bold, Italic, Underline,
  List, ListOrdered, AlignLeft, Heading1, Heading2,
  Loader2, ChevronLeft, Sparkles, Layers, X,
  Indent, Outdent, Download
} from "lucide-react";
import { callAI } from "@/lib/lynxApi";

const COLORS = ["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#ec4899","#06b6d4","#64748b"];

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function countWords(text) {
  return text.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
}

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const editorRef = useRef(null);
  const saveTimer = useRef(null);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  useEffect(() => {
    db.entities.Note.list("-updated_date", 100).then(data => {
      setNotes(data);
      if (data.length > 0) setActiveId(data[0].id);
      setLoading(false);
    });
  }, []);

  const activeNote = notes.find(n => n.id === activeId);

  // Sync editor content when active note changes
  useEffect(() => {
    if (editorRef.current && activeNote) {
      if (editorRef.current.innerHTML !== activeNote.content) {
        editorRef.current.innerHTML = activeNote.content || "";
      }
    }
  }, [activeId]);

  const saveNote = useCallback(async (id, updates) => {
    setSaving(true);
    const updated = await db.entities.Note.update(id, updates);
    setNotes(prev => prev.map(n => n.id === id ? updated : n));
    setSaving(false);
  }, []);

  const scheduleSave = useCallback((content) => {
    if (!activeId) return;
    clearTimeout(saveTimer.current);
    // Optimistically update local state immediately
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, content, word_count: countWords(content) } : n));
    saveTimer.current = setTimeout(() => {
      saveNote(activeId, { content, word_count: countWords(content) });
    }, 1200);
  }, [activeId, saveNote]);

  const createNote = async () => {
    const note = await db.entities.Note.create({ title: "Untitled Document", content: "", word_count: 0 });
    setNotes(prev => [note, ...prev]);
    setActiveId(note.id);
    setTimeout(() => { if (editorRef.current) { editorRef.current.innerHTML = ""; editorRef.current.focus(); } }, 100);
  };

  const deleteNote = async (id) => {
    await db.entities.Note.delete(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeId === id) setActiveId(notes.find(n => n.id !== id)?.id || null);
  };

  const updateTitle = (id, title) => {
    clearTimeout(saveTimer.current);
    setNotes(prev => prev.map(n => n.id === id ? { ...n, title } : n));
    saveTimer.current = setTimeout(() => saveNote(id, { title }), 800);
  };

  const togglePin = async (id) => {
    const note = notes.find(n => n.id === id);
    const updated = await db.entities.Note.update(id, { pinned: !note.pinned });
    setNotes(prev => prev.map(n => n.id === id ? updated : n));
  };

  const updateColor = async (color) => {
    await saveNote(activeId, { color });
    setShowColorPicker(false);
  };

  const execCmd = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    scheduleSave(editorRef.current?.innerHTML || "");
  };

  // Handle Tab/Shift+Tab for nested lists
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        document.execCommand("outdent", false, null);
      } else {
        document.execCommand("indent", false, null);
      }
      scheduleSave(editorRef.current?.innerHTML || "");
    }
  };

  // Download note as PDF via print dialog
  const downloadAsPdf = () => {
    if (!activeNote) return;
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${activeNote.title || "Note"}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; color: #111; line-height: 1.7; font-size: 14px; }
    h1 { font-size: 2rem; font-weight: 900; margin-bottom: 0.25rem; }
    h2 { font-size: 1.4rem; font-weight: 800; margin: 1rem 0 0.3rem; }
    p { margin: 0.4rem 0; }
    ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
    ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
    ul ul { list-style: circle; }
    ul ul ul { list-style: square; }
    li { margin: 0.2rem 0; }
    b, strong { font-weight: 700; }
    i, em { font-style: italic; }
    u { text-decoration: underline; }
    .meta { color: #888; font-size: 11px; margin-bottom: 2rem; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>${activeNote.title || "Untitled"}</h1>
  <div class="meta">${formatDate(activeNote.updated_date)} · ${activeNote.word_count || 0} words</div>
  ${activeNote.content || ""}
</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  // ── Convert note to flashcards ──────────────────────────────────────────────
  const [converting, setConverting] = useState(false);
  const [convertResult, setConvertResult] = useState(null); // { deckId, count }
  const [convertError, setConvertError] = useState(null);

  const convertToFlashcards = async () => {
    if (!activeNote) return;
    const plainText = (activeNote.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (plainText.length < 30) { setConvertError("Note is too short to generate flashcards."); return; }
    setConverting(true);
    setConvertResult(null);
    setConvertError(null);
    const res = await callAI({
      prompt: `Convert the following study notes into flashcards. Extract the key concepts, definitions, and facts. 
Return JSON: { "cards": [ { "front": "term or question", "back": "definition or answer" } ] }
Generate 5-15 cards. Be concise on the front, thorough on the back.
Notes:
${plainText.slice(0, 4000)}`,
      response_json_schema: {
        type: "object",
        properties: { cards: { type: "array", items: { type: "object", properties: { front: { type: "string" }, back: { type: "string" } } } } }
      },
      feature: "notes_to_flashcards",
    });
    const cards = res?.cards || [];
    if (cards.length === 0) { setConvertError("No flashcards could be generated."); setConverting(false); return; }
    // Create deck
    const deck = await db.entities.Deck.create({
      title: `${activeNote.title || "Notes"} — Flashcards`,
      description: `Auto-generated from note: ${activeNote.title}`,
      color: activeNote.color || "#8b5cf6",
      card_count: cards.length,
      author_name: "Me",
      is_public: false,
    });
    // Create cards
    await db.entities.Flashcard.bulkCreate(cards.map(c => ({ deck_id: deck.id, front: c.front, back: c.back, difficulty: "medium" })));
    setConvertResult({ deckId: deck.id, count: cards.length });
    setConverting(false);
  };

  const filtered = notes
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || (n.content || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.updated_date) - new Date(a.updated_date));

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={bgStyle}>
      <Loader2 className="w-6 h-6 animate-spin opacity-40" />
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={bgStyle}>
      {/* ── SIDEBAR ── */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} shrink-0 flex flex-col transition-all duration-300 border-r`}
        style={{ borderColor: "var(--app-border)", background: "var(--app-surface)" }}>

        <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0" style={{ borderColor: "var(--app-border)" }}>
          <FileText className="w-4 h-4 text-violet-400 shrink-0" />
          <span className="font-black text-sm flex-1">My Notes</span>
          <button onClick={createNote} className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-all">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-3 py-2 shrink-0 border-b" style={{ borderColor: "var(--app-border)" }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={mutedStyle} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none"
              style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filtered.length === 0 && (
            <p className="text-xs text-center py-8 opacity-30">No notes yet</p>
          )}
          {filtered.map(note => (
            <div key={note.id} onClick={() => setActiveId(note.id)}
              className={`group flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-1 ${activeId === note.id ? "bg-violet-500/10" : "hover:bg-white/5"}`}>
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: note.color || "#8b5cf6" }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{note.title || "Untitled"}</p>
                <p className="text-[10px] mt-0.5 opacity-40">{formatDate(note.updated_date)} · {note.word_count || 0} words</p>
              </div>
              {note.pinned && <Pin className="w-3 h-3 shrink-0 opacity-40 mt-0.5" />}
            </div>
          ))}
        </div>

        <div className="px-3 py-2 border-t shrink-0" style={{ borderColor: "var(--app-border)" }}>
          <p className="text-[10px] opacity-30">{notes.length} document{notes.length !== 1 ? "s" : ""}</p>
        </div>
      </aside>

      {/* ── MAIN EDITOR ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-4 py-2 border-b shrink-0 flex-wrap" style={{ borderColor: "var(--app-border)", background: "var(--app-surface)" }}>
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-50 hover:opacity-100 mr-1">
            <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} />
          </button>

          {activeNote && (
            <>
              {/* Formatting buttons */}
              {[
                { icon: Bold, cmd: "bold", title: "Bold" },
                { icon: Italic, cmd: "italic", title: "Italic" },
                { icon: Underline, cmd: "underline", title: "Underline" },
              ].map(({ icon: Icon, cmd, title }) => (
                <button key={cmd} onClick={() => execCmd(cmd)} title={title}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}

              <div className="w-px h-4 mx-1 opacity-20" style={{ background: "var(--app-text)" }} />

              <button onClick={() => execCmd("formatBlock", "h1")} title="Heading 1"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd("formatBlock", "h2")} title="Heading 2"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd("formatBlock", "p")} title="Paragraph"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                <AlignLeft className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 mx-1 opacity-20" style={{ background: "var(--app-text)" }} />

              <button onClick={() => execCmd("insertUnorderedList")} title="Bullet list"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                <List className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd("insertOrderedList")} title="Numbered list"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd("indent")} title="Indent (Tab)"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                <Indent className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd("outdent")} title="Outdent (Shift+Tab)"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                <Outdent className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 mx-1 opacity-20" style={{ background: "var(--app-text)" }} />

              {/* Color picker */}
              <div className="relative">
                <button onClick={() => setShowColorPicker(o => !o)} title="Note color"
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: activeNote.color || "#8b5cf6" }} />
                </button>
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 p-2 rounded-xl shadow-xl z-50 flex gap-1.5 flex-wrap w-28"
                    style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
                    {COLORS.map(c => (
                      <button key={c} onClick={() => updateColor(c)}
                        className="w-5 h-5 rounded-full transition-transform hover:scale-110 ring-2 ring-transparent hover:ring-white/30"
                        style={{ background: c }} />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1" />

              <button onClick={() => togglePin(activeId)} title="Pin note"
                className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${activeNote.pinned ? "opacity-100 text-violet-400" : "opacity-40 hover:opacity-80"}`}>
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button onClick={downloadAsPdf} title="Download as PDF"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deleteNote(activeId)} title="Delete note"
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-all opacity-50 hover:opacity-100">
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 mx-1 opacity-20" style={{ background: "var(--app-text)" }} />

              {/* Convert to flashcards */}
              <button
                onClick={convertToFlashcards}
                disabled={converting}
                title="Convert note to flashcards"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-violet-400 hover:bg-violet-500/10 disabled:opacity-40 transition-all"
              >
                {converting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {converting ? "Generating..." : "→ Flashcards"}
              </button>

              {saving && <span className="text-[10px] opacity-30 ml-1">Saving…</span>}
            </>
          )}
        </div>

        {/* Convert result banner */}
        {convertResult && (
          <div className="flex items-center gap-3 px-5 py-2.5 text-sm" style={{ background: "rgba(139,92,246,0.1)", borderBottom: "1px solid rgba(139,92,246,0.2)" }}>
            <Layers className="w-4 h-4 text-violet-400 shrink-0" />
            <span className="text-violet-300 font-semibold flex-1">✓ Created {convertResult.count} flashcards!</span>
            <a href={`/Study?deck_id=${convertResult.deckId}`} className="text-xs font-bold text-violet-400 underline hover:text-violet-300">Study now →</a>
            <button onClick={() => setConvertResult(null)} className="opacity-40 hover:opacity-80"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
        {convertError && (
          <div className="flex items-center gap-3 px-5 py-2.5 text-sm" style={{ background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.2)" }}>
            <span className="text-red-400 flex-1">{convertError}</span>
            <button onClick={() => setConvertError(null)} className="opacity-40 hover:opacity-80"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* Editor area */}
        {activeNote ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-8 py-8">
              {/* Title */}
              <input
                value={activeNote.title || ""}
                onChange={e => updateTitle(activeId, e.target.value)}
                placeholder="Document title…"
                className="w-full text-3xl font-black mb-1 outline-none bg-transparent placeholder-opacity-20"
                style={{ color: "var(--app-text)" }}
              />
              <p className="text-xs mb-6 opacity-30">
                {formatDate(activeNote.updated_date)} · {activeNote.word_count || 0} words
              </p>

              {/* Rich text editor */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => scheduleSave(editorRef.current?.innerHTML || "")}
                onKeyDown={handleKeyDown}
                className="outline-none min-h-[60vh] text-sm leading-relaxed prose-notes"
                style={{ color: "var(--app-text)" }}
                data-placeholder="Start writing…"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
            <FileText className="w-16 h-16 mb-4" />
            <p className="font-bold text-lg mb-1">No document open</p>
            <p className="text-sm">Create a new document to get started</p>
            <button onClick={createNote} className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-violet-600 hover:bg-violet-500 transition-all opacity-100">
              <Plus className="w-4 h-4" /> New Document
            </button>
          </div>
        )}
      </div>

      <style>{`
        .prose-notes h1 { font-size: 1.75rem; font-weight: 900; margin: 1rem 0 0.5rem; }
        .prose-notes h2 { font-size: 1.3rem; font-weight: 800; margin: 0.875rem 0 0.4rem; }
        .prose-notes p { margin: 0.4rem 0; }
        .prose-notes ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-notes ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-notes ul ul { list-style: circle; }
        .prose-notes ul ul ul { list-style: square; }
        .prose-notes ol ol { list-style: lower-alpha; }
        .prose-notes li { margin: 0.2rem 0; }
        .prose-notes b, .prose-notes strong { font-weight: 700; }
        .prose-notes i, .prose-notes em { font-style: italic; }
        .prose-notes u { text-decoration: underline; }
        [contenteditable]:empty:before { content: attr(data-placeholder); opacity: 0.25; pointer-events: none; }
      `}</style>
    </div>
  );
}