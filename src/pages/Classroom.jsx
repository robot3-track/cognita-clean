import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Plus, Copy, Check, Trash2, Loader2,
  GraduationCap, Hash, Gamepad2, Search, X,
  ChevronLeft, Play, Layers, ExternalLink,
  UserPlus, LogOut, FolderOpen, Calendar, BarChart2,
  ClipboardCheck, Clock, CheckCircle2, AlertCircle, FolderPlus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
function genId() {
  return Math.random().toString(36).slice(2, 10);
}

const CLASS_COLORS = ["#7c3aed","#2563eb","#059669","#dc2626","#d97706","#0891b2","#be185d","#0f766e"];

// ── Class Card ────────────────────────────────────────────────────────────────
function ClassCard({ cls, isTeacher, onClick }) {
  const color = cls.color || CLASS_COLORS[0];
  const assignmentCount = (cls.assignments || []).length;
  const resourceCount = (cls.resource_deck_ids || []).length;
  return (
    <div onClick={onClick} className="rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all shadow-sm" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
      <div className="h-20 flex items-end px-5 pb-3 relative" style={{ background: `linear-gradient(135deg, ${color}dd, ${color}77)` }}>
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/30 text-white">{isTeacher ? "Teacher" : "Student"}</span>
        </div>
        <h3 className="font-black text-white text-base leading-tight drop-shadow">{cls.name}</h3>
      </div>
      <div className="px-5 py-3">
        {cls.subject && <p className="text-xs font-semibold opacity-60 mb-1">{cls.subject}</p>}
        <p className="text-xs opacity-40">
          {isTeacher ? `${(cls.student_emails||[]).length} students` : `Teacher: ${cls.teacher_name||cls.teacher_email}`}
          {" · "}{assignmentCount} assigned · {resourceCount} resources
        </p>
      </div>
    </div>
  );
}

// ── Progress Tab ──────────────────────────────────────────────────────────────
function ProgressTab({ cls, allDecks, color }) {
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assignedDeckIds = (cls.assignments || []).map(a => a.deck_id);
    if (assignedDeckIds.length === 0 || (cls.student_emails||[]).length === 0) {
      setSessions([]);
      setLoading(false);
      return;
    }
    db.entities.StudySession.list("-created_date").then(all => {
      const relevant = all.filter(s =>
        (cls.student_emails||[]).includes(s.user_email) &&
        assignedDeckIds.includes(s.deck_id)
      );
      setSessions(relevant);
      setLoading(false);
    });
  }, [cls.id]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin opacity-40" /></div>;

  const assignments = cls.assignments || [];
  const students = cls.student_emails || [];

  if (assignments.length === 0) return (
    <div className="text-center py-16 opacity-30">
      <BarChart2 className="w-10 h-10 mx-auto mb-3" />
      <p className="font-bold">No assignments yet</p>
      <p className="text-xs mt-1">Assign decks from the Decks tab to track student progress</p>
    </div>
  );

  // Build completion matrix: for each assignment, which students have a session?
  return (
    <div className="space-y-4">
      <p className="text-xs opacity-40">{students.length} student{students.length!==1?"s":""} · {assignments.length} assignment{assignments.length!==1?"s":""}</p>
      {assignments.map(a => {
        const deck = allDecks[a.deck_id];
        const studentsWhoStudied = new Set((sessions||[]).filter(s => s.deck_id === a.deck_id).map(s => s.user_email));
        const due = a.due_date ? new Date(a.due_date) : null;
        const overdue = due && new Date() > due;
        const completedCount = students.filter(e => studentsWhoStudied.has(e)).length;
        const pct = students.length > 0 ? Math.round((completedCount / students.length) * 100) : 0;

        return (
          <div key={a.id} className="rounded-2xl p-5" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-sm">{a.title || deck?.title || a.deck_id}</p>
                {a.folder && <p className="text-xs opacity-40">📁 {a.folder}</p>}
                {due && (
                  <p className={`text-xs flex items-center gap-1 mt-0.5 ${overdue ? "text-red-400" : "opacity-40"}`}>
                    <Clock className="w-3 h-3" /> Due {due.toLocaleDateString()}
                    {overdue && " (overdue)"}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-black" style={{ color }}>{pct}%</p>
                <p className="text-xs opacity-40">{completedCount}/{students.length} started</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: "var(--app-bg)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
            {/* Per-student breakdown */}
            {students.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {students.map(email => {
                  const done = studentsWhoStudied.has(email);
                  return (
                    <div key={email} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${done ? "bg-emerald-500/10 text-emerald-400" : overdue ? "bg-red-500/10 text-red-400" : "opacity-40"}`} style={!done && !overdue ? { background: "var(--app-bg)" } : {}}>
                      {done ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span className="max-w-[80px] truncate">{email.split("@")[0]}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Classroom Detail View ─────────────────────────────────────────────────────
function ClassroomDetail({ cls, user, myDecks, allDecks, onUpdate, onBack, onDelete }) {
  const navigate = useNavigate();
  const isTeacher = cls.teacher_email === user?.email;
  const [tab, setTab] = useState("stream");
  const [deckSearch, setDeckSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Folder management
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [movingDeck, setMovingDeck] = useState(null); // deck_id being moved

  // Add student directly
  const [addInput, setAddInput] = useState("");
  const [addMode, setAddMode] = useState("email"); // "email" | "name"
  const [addingStudent, setAddingStudent] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [transferEmail, setTransferEmail] = useState("");
  const [transferring, setTransferring] = useState(false);

  // Assign modal
  const [assigningDeck, setAssigningDeck] = useState(null); // deck object
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("");
  const [assignFolder, setAssignFolder] = useState("");
  const [assignMode, setAssignMode] = useState("flashcards");

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };
  const color = cls.color || CLASS_COLORS[0];

  const folders = cls.folders || [];
  const deckFolders = cls.deck_folders || {};
  const resources = (cls.resource_deck_ids || []);
  const assignments = cls.assignments || [];

  // ── resource management ──
  const toggleResource = async (deckId) => {
    const current = resources;
    const newIds = current.includes(deckId) ? current.filter(id => id !== deckId) : [...current, deckId];
    setSaving(true);
    const updated = await db.entities.ClassroomClass.update(cls.id, { resource_deck_ids: newIds });
    onUpdate(updated);
    setSaving(false);
  };

  const removeResource = async (deckId) => {
    const newIds = resources.filter(id => id !== deckId);
    // Also remove from deck_folders
    const newFolders = { ...deckFolders };
    delete newFolders[deckId];
    const updated = await db.entities.ClassroomClass.update(cls.id, { resource_deck_ids: newIds, deck_folders: newFolders });
    onUpdate(updated);
  };

  // ── folder management ──
  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const updated = await db.entities.ClassroomClass.update(cls.id, { folders: [...folders, newFolderName.trim()] });
    onUpdate(updated);
    setNewFolderName("");
    setShowFolderInput(false);
  };

  const moveDeckToFolder = async (deckId, folder) => {
    const newFolderMap = { ...deckFolders, [deckId]: folder };
    const updated = await db.entities.ClassroomClass.update(cls.id, { deck_folders: newFolderMap });
    onUpdate(updated);
    setMovingDeck(null);
  };

  // ── assignment ──
  const openAssign = (deck) => {
    setAssigningDeck(deck);
    setAssignTitle(deck.title);
    setAssignDueDate("");
    setAssignFolder(deckFolders[deck.id] || "");
    setAssignMode("flashcards");
  };

  const submitAssignment = async () => {
    if (!assigningDeck) return;
    const newAssignment = {
      id: genId(),
      deck_id: assigningDeck.id,
      title: assignTitle || assigningDeck.title,
      due_date: assignDueDate,
      folder: assignFolder,
      assigned_at: new Date().toISOString(),
      required_mode: assignMode,
    };
    const updated = await db.entities.ClassroomClass.update(cls.id, {
      assignments: [...assignments, newAssignment],
      resource_deck_ids: resources.includes(assigningDeck.id) ? resources : [...resources, assigningDeck.id],
    });
    onUpdate(updated);

    // Notify all students
    const dueStr = assignDueDate ? ` — due ${new Date(assignDueDate).toLocaleDateString()}` : "";
    const notifPromises = (cls.student_emails || []).map(email =>
      db.entities.AppNotification.create({
        recipient_email: email,
        title: `📚 New Assignment in ${cls.name}`,
        message: `"${assignTitle || assigningDeck.title}" has been assigned${dueStr}. Tap to study.`,
        icon: "📚",
        link: `/Classroom?open_class=${cls.id}`,
        read: false,
      })
    );
    await Promise.all(notifPromises);

    setAssigningDeck(null);
  };

  const removeAssignment = async (assignId) => {
    const updated = await db.entities.ClassroomClass.update(cls.id, {
      assignments: assignments.filter(a => a.id !== assignId),
    });
    onUpdate(updated);
  };

  // load users lazily when People tab is opened
  const loadUsers = async () => {
    if (usersLoaded) return;
    const users = await db.entities.User.list("-created_date");
    setAllUsers(users);
    setUsersLoaded(true);
  };

  // ── people ──
  const addStudentByEmail = async (email) => {
    const e = (email || addInput).trim().toLowerCase();
    if (!e) return;
    if ((cls.student_emails||[]).includes(e)) { alert("Already in class"); return; }
    setAddingStudent(true);
    const updated = await db.entities.ClassroomClass.update(cls.id, {
      student_emails: [...(cls.student_emails||[]), e],
    });
    onUpdate(updated);
    setAddInput("");
    setAddingStudent(false);
  };

  const transferOwnership = async () => {
    const newOwner = transferEmail.trim().toLowerCase();
    if (!newOwner) return;
    if (!window.confirm(`Transfer ownership to ${newOwner}? You will lose teacher access.`)) return;
    setTransferring(true);
    const updated = await db.entities.ClassroomClass.update(cls.id, {
      teacher_email: newOwner,
      teacher_name: allUsers.find(u => u.email === newOwner)?.full_name || newOwner,
    });
    onUpdate(updated);
    setTransferring(false);
    onBack(); // current user is no longer teacher
  };

  const removeStudent = async (email) => {
    const updated = await db.entities.ClassroomClass.update(cls.id, {
      student_emails: (cls.student_emails||[]).filter(e => e !== email),
    });
    onUpdate(updated);
  };

  const leaveClass = async () => {
    if (!window.confirm("Leave this class?")) return;
    await db.entities.ClassroomClass.update(cls.id, {
      student_emails: (cls.student_emails||[]).filter(e => e !== user.email),
    });
    onBack();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(cls.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMyDecks = myDecks.filter(d =>
    !deckSearch || d.title.toLowerCase().includes(deckSearch.toLowerCase())
  );

  // Group resources by folder
  const resourcesByFolder = {};
  const unfolderedResources = [];
  resources.forEach(id => {
    const folder = deckFolders[id];
    if (folder) {
      if (!resourcesByFolder[folder]) resourcesByFolder[folder] = [];
      resourcesByFolder[folder].push(id);
    } else {
      unfolderedResources.push(id);
    }
  });

  // Load users when switching to people tab
  useEffect(() => {
    if (tab === "people") loadUsers();
  }, [tab]);

  const tabs = isTeacher
    ? [{ id: "stream", label: "Stream" }, { id: "decks", label: "Decks" }, { id: "assignments", label: `Assignments (${assignments.length})` }, { id: "progress", label: "Progress" }, { id: "people", label: "People" }, { id: "settings", label: "Settings" }]
    : [{ id: "stream", label: "Stream" }, { id: "decks", label: "Assigned" }];

  const ResourceDeckRow = ({ deckId, showFolder = true }) => {
    const deck = allDecks[deckId];
    const folder = deckFolders[deckId];
    const isAssigned = assignments.some(a => a.deck_id === deckId);
    if (!deck) return null;
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl group" style={{ background: "var(--app-bg)" }}>
        <div className="w-4 h-4 rounded shrink-0" style={{ background: deck.color || "#4F46E5" }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{deck.title}</p>
          <p className="text-xs opacity-40">{deck.card_count||0} cards{folder && showFolder ? ` · 📁 ${folder}` : ""}</p>
        </div>
        {isAssigned && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10">assigned</span>}
        {isTeacher && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={() => setMovingDeck(movingDeck === deckId ? null : deckId)} className="p-1.5 rounded-lg hover:bg-white/10 transition-all" title="Move to folder">
              <FolderOpen className="w-3.5 h-3.5 text-violet-400" />
            </button>
            <button onClick={() => openAssign(deck)} className="p-1.5 rounded-lg hover:bg-white/10 transition-all" title="Assign with due date">
              <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button onClick={() => removeResource(deckId)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/50 hover:text-red-400 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {movingDeck === deckId && isTeacher && (
          <div className="absolute right-4 z-10 rounded-xl shadow-xl py-1 min-w-[140px]" style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }}>
            <button onClick={() => moveDeckToFolder(deckId, "")} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5">No folder</button>
            {folders.map(f => (
              <button key={f} onClick={() => moveDeckToFolder(deckId, f)} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5">📁 {f}</button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-28" style={bgStyle}>
      {/* Header */}
      <div className="relative h-32 sm:h-40 flex items-end px-6 pb-5" style={{ background: `linear-gradient(135deg, ${color}ee, ${color}77)` }}>
        <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-xl bg-black/20 text-white hover:bg-black/30 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white drop-shadow">{cls.name}</h1>
          {cls.subject && <p className="text-sm text-white/70 mt-0.5">{cls.subject}</p>}
          {cls.description && <p className="text-xs text-white/60 mt-0.5">{cls.description}</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b overflow-x-auto px-2" style={{ borderColor: "var(--app-border)", background: "var(--app-surface)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap shrink-0 ${tab === t.id ? "border-violet-500 text-violet-400" : "border-transparent opacity-50 hover:opacity-80"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* ── STREAM ── */}
        {tab === "stream" && (
          <div className="space-y-4">
            {isTeacher && (
              <div className="rounded-2xl p-5" style={cardStyle}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold opacity-40 uppercase tracking-wider mb-1">Class Code</p>
                    <p className="text-2xl font-black tracking-widest font-mono" style={{ color }}>{cls.join_code}</p>
                    <p className="text-xs opacity-40 mt-1">Share with students to join</p>
                  </div>
                  <button onClick={copyCode} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: `${color}22`, color }}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}

            {/* Live game */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-amber-400">Live Quiz Game</p>
                  <p className="text-xs opacity-50">{isTeacher ? "Host a Kahoot-style quiz for your class" : "Join a live quiz game"}</p>
                </div>
                <Link to={createPageUrl(`ClassroomGame?class_id=${cls.id}`)}>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-white transition-all">
                    <Play className="w-3.5 h-3.5" /> {isTeacher ? "Host" : "Join"}
                  </button>
                </Link>
              </div>
            </div>

            {/* Active assignments */}
            {assignments.length > 0 && (
              <div className="rounded-2xl p-5" style={cardStyle}>
                <p className="font-bold text-sm mb-3">Active Assignments ({assignments.length})</p>
                <div className="space-y-2">
                  {assignments.map(a => {
                    const deck = allDecks[a.deck_id];
                    const due = a.due_date ? new Date(a.due_date) : null;
                    const overdue = due && new Date() > due;
                    return (
                      <div key={a.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "var(--app-bg)" }}>
                        <div className="w-4 h-4 rounded shrink-0" style={{ background: deck?.color || "#4F46E5" }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{a.title || deck?.title}</p>
                          {due && <p className={`text-xs flex items-center gap-1 ${overdue ? "text-red-400" : "opacity-40"}`}><Clock className="w-3 h-3" /> Due {due.toLocaleDateString()}</p>}
                        </div>
                        {!isTeacher && (
                          <Link to={createPageUrl(`Study?deck_id=${a.deck_id}`)}>
                            <button className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all" style={{ background: `${color}20`, color }}>
                              Study →
                            </button>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resources preview */}
            {resources.length > 0 && (
              <div className="rounded-2xl p-5" style={cardStyle}>
                <p className="font-bold text-sm mb-3">Class Resources ({resources.length})</p>
                <div className="space-y-1.5">
                  {resources.slice(0, 5).map(id => {
                    const deck = allDecks[id];
                    if (!deck) return null;
                    return (
                      <Link key={id} to={createPageUrl(`Study?deck_id=${id}`)}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:opacity-80 transition-all" style={{ background: "var(--app-bg)" }}>
                          <div className="w-3.5 h-3.5 rounded shrink-0" style={{ background: deck.color || "#4F46E5" }} />
                          <span className="text-xs font-medium flex-1 truncate">{deck.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-30" />
                        </div>
                      </Link>
                    );
                  })}
                  {resources.length > 5 && <p className="text-xs opacity-30 text-center py-1">+{resources.length - 5} more in Decks tab</p>}
                </div>
              </div>
            )}

            {!isTeacher && (
              <button onClick={leaveClass} className="flex items-center gap-1.5 text-xs text-red-400 opacity-50 hover:opacity-100 transition-all">
                <LogOut className="w-3.5 h-3.5" /> Leave class
              </button>
            )}
          </div>
        )}

        {/* ── DECKS / RESOURCES TAB ── */}
        {tab === "decks" && (
          <div className="space-y-5">
            {isTeacher && (
              <div className="rounded-2xl p-5" style={cardStyle}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-sm">Add Resources</p>
                  {saving && <span className="text-xs text-violet-400">Saving…</span>}
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
                  <input value={deckSearch} onChange={e => setDeckSearch(e.target.value)} placeholder="Search your decks + public decks…" className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {filteredMyDecks.map(deck => {
                    const added = resources.includes(deck.id);
                    return (
                      <button key={deck.id} onClick={() => toggleResource(deck.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs transition-all`}
                        style={{ background: added ? `${color}15` : "var(--app-bg)", border: `1px solid ${added ? color+"40" : "var(--app-border)"}` }}>
                        <div className="w-4 h-4 rounded shrink-0" style={{ background: deck.color || "#4F46E5" }} />
                        <span className="flex-1 truncate font-medium">{deck.title}</span>
                        <span className="opacity-40 shrink-0">{deck.card_count||0} cards</span>
                        {added ? <Check className="w-4 h-4 shrink-0" style={{ color }} /> : <Plus className="w-4 h-4 opacity-30 shrink-0" />}
                      </button>
                    );
                  })}
                  {filteredMyDecks.length === 0 && <p className="text-xs text-center py-4 opacity-30">No decks found</p>}
                </div>
              </div>
            )}

            {/* Folder management */}
            {isTeacher && resources.length > 0 && (
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold opacity-40 uppercase tracking-widest flex-1">Folders</p>
                {showFolderInput ? (
                  <div className="flex items-center gap-2">
                    <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => e.key === "Enter" && createFolder()} placeholder="Folder name" autoFocus className="px-3 py-1.5 rounded-xl text-xs outline-none w-32" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
                    <button onClick={createFolder} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 text-white">Add</button>
                    <button onClick={() => setShowFolderInput(false)} className="p-1.5 rounded-xl opacity-40 hover:opacity-80"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <button onClick={() => setShowFolderInput(true)} className="flex items-center gap-1.5 text-xs font-semibold opacity-50 hover:opacity-100 transition-all">
                    <FolderPlus className="w-3.5 h-3.5" /> New Folder
                  </button>
                )}
              </div>
            )}

            {/* Resources grouped by folder */}
            {resources.length === 0 ? (
              <div className="text-center py-16 opacity-30">
                <Layers className="w-10 h-10 mx-auto mb-3" />
                <p className="font-bold">{isTeacher ? "No resources yet" : "No resources"}</p>
                <p className="text-xs mt-1">{isTeacher ? "Add decks above to build your class library" : "Your teacher hasn't added any resources yet"}</p>
              </div>
            ) : (
              <div className="space-y-4 relative">
                {/* Unfoldered */}
                {unfolderedResources.length > 0 && (
                  <div>
                    {folders.length > 0 && <p className="text-xs font-bold opacity-30 mb-2 uppercase tracking-wider">No Folder</p>}
                    <div className="space-y-1.5">
                      {unfolderedResources.map(id => <ResourceDeckRow key={id} deckId={id} showFolder={false} />)}
                    </div>
                  </div>
                )}
                {/* Folders */}
                {folders.map(folder => {
                  const folderDecks = resourcesByFolder[folder] || [];
                  return (
                    <div key={folder}>
                      <div className="flex items-center gap-2 mb-2">
                        <FolderOpen className="w-4 h-4 text-amber-400" />
                        <p className="text-sm font-bold">{folder}</p>
                        <span className="text-xs opacity-40">({folderDecks.length})</span>
                        {isTeacher && (
                          <button onClick={async () => {
                            // Remove folder, unassign decks from it
                            const newMap = { ...deckFolders };
                            folderDecks.forEach(id => delete newMap[id]);
                            const updated = await db.entities.ClassroomClass.update(cls.id, { folders: folders.filter(f => f !== folder), deck_folders: newMap });
                            onUpdate(updated);
                          }} className="ml-auto p-1 rounded-lg text-red-400/40 hover:text-red-400 transition-all">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-1.5 pl-2 border-l-2" style={{ borderColor: "rgba(251,191,36,0.3)" }}>
                        {folderDecks.length === 0 ? (
                          <p className="text-xs opacity-30 py-2 pl-2">Empty folder — move decks here from hover menu</p>
                        ) : (
                          folderDecks.map(id => <ResourceDeckRow key={id} deckId={id} showFolder={false} />)
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ASSIGNMENTS TAB (teacher only) ── */}
        {tab === "assignments" && isTeacher && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={cardStyle}>
              <p className="font-bold text-sm mb-1">Assign a Deck</p>
              <p className="text-xs opacity-40 mb-3">Pick from your class resources and set a due date. Students will see it on their stream.</p>
              {resources.length === 0 ? (
                <p className="text-xs opacity-40">Add resources first from the Decks tab, then assign them here.</p>
              ) : (
                <div className="space-y-2">
                  {resources.map(id => {
                    const deck = allDecks[id];
                    if (!deck) return null;
                    const alreadyAssigned = assignments.some(a => a.deck_id === id);
                    return (
                      <div key={id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "var(--app-bg)" }}>
                        <div className="w-4 h-4 rounded shrink-0" style={{ background: deck.color || "#4F46E5" }} />
                        <span className="text-sm font-medium flex-1 truncate">{deck.title}</span>
                        {alreadyAssigned && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">assigned</span>}
                        <button onClick={() => openAssign(deck)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all" style={{ background: `${color}20`, color }}>
                          <ClipboardCheck className="w-3.5 h-3.5" /> {alreadyAssigned ? "Re-assign" : "Assign"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {assignments.length > 0 && (
              <div className="rounded-2xl p-5" style={cardStyle}>
                <p className="font-bold text-sm mb-3">Current Assignments ({assignments.length})</p>
                <div className="space-y-2">
                  {assignments.map(a => {
                    const deck = allDecks[a.deck_id];
                    const due = a.due_date ? new Date(a.due_date) : null;
                    const overdue = due && new Date() > due;
                    return (
                      <div key={a.id} className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: "var(--app-bg)" }}>
                        <div className="w-4 h-4 rounded shrink-0" style={{ background: deck?.color || "#4F46E5" }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{a.title || deck?.title}</p>
                          <div className="flex items-center gap-2 text-xs opacity-40">
                            {a.folder && <span>📁 {a.folder}</span>}
                            {due && <span className={`flex items-center gap-1 ${overdue ? "text-red-400 opacity-100" : ""}`}><Clock className="w-3 h-3" />{due.toLocaleDateString()}</span>}
                            <span>Assigned {new Date(a.assigned_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button onClick={() => removeAssignment(a.id)} className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROGRESS TAB (teacher only) ── */}
        {tab === "progress" && isTeacher && (
          <ProgressTab cls={cls} allDecks={allDecks} color={color} />
        )}

        {/* ── PEOPLE TAB (teacher only) ── */}
        {tab === "people" && isTeacher && (
          <div className="space-y-4">
            {/* Add student */}
            <div className="rounded-2xl p-5" style={cardStyle}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-sm">Add Student</p>
                <div className="flex rounded-xl overflow-hidden border text-xs font-semibold" style={{ borderColor: "var(--app-border)" }}>
                  <button onClick={() => setAddMode("email")} className={`px-3 py-1.5 transition-all ${addMode === "email" ? "bg-violet-600 text-white" : "opacity-50 hover:opacity-80"}`}>By Email</button>
                  <button onClick={() => { setAddMode("name"); loadUsers(); }} className={`px-3 py-1.5 transition-all ${addMode === "name" ? "bg-violet-600 text-white" : "opacity-50 hover:opacity-80"}`}>By Name</button>
                </div>
              </div>

              {addMode === "email" ? (
                <div className="flex gap-2">
                  <input value={addInput} onChange={e => setAddInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addStudentByEmail()} placeholder="student@email.com" className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
                  <button onClick={() => addStudentByEmail()} disabled={!addInput.trim() || addingStudent} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-all">
                    {addingStudent ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Add
                  </button>
                </div>
              ) : (
                <div>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
                    <input value={addInput} onChange={e => setAddInput(e.target.value)} placeholder="Search by name or email…" className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
                  </div>
                  {!usersLoaded ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin opacity-40" /></div>
                  ) : (
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {allUsers
                        .filter(u => u.email !== user?.email && u.email !== cls.teacher_email && !(cls.student_emails||[]).includes(u.email))
                        .filter(u => !addInput || u.full_name?.toLowerCase().includes(addInput.toLowerCase()) || u.email.toLowerCase().includes(addInput.toLowerCase()))
                        .slice(0, 20)
                        .map(u => (
                          <button key={u.id} onClick={() => addStudentByEmail(u.email)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-white/5 transition-all" style={{ background: "var(--app-bg)" }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: color + "aa" }}>
                              {(u.full_name || u.email)[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{u.full_name || u.email}</p>
                              {u.full_name && <p className="text-xs opacity-40 truncate">{u.email}</p>}
                            </div>
                            <UserPlus className="w-3.5 h-3.5 opacity-30" />
                          </button>
                        ))
                      }
                      {usersLoaded && allUsers.filter(u => u.email !== user?.email && u.email !== cls.teacher_email && !(cls.student_emails||[]).includes(u.email) && (!addInput || u.full_name?.toLowerCase().includes(addInput.toLowerCase()) || u.email.toLowerCase().includes(addInput.toLowerCase()))).length === 0 && (
                        <p className="text-xs text-center py-4 opacity-30">No users found</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs opacity-30 mt-3">Or share the class code: <span className="font-mono font-bold">{cls.join_code}</span></p>
            </div>

            {/* Student list */}
            <div className="rounded-2xl p-5" style={cardStyle}>
              <p className="font-bold text-sm mb-3">Students ({(cls.student_emails||[]).length})</p>
              {(cls.student_emails||[]).length === 0 ? (
                <div className="text-center py-8 opacity-30">
                  <UserPlus className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-xs">No students yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(cls.student_emails||[]).map(email => {
                    const u = allUsers.find(u => u.email === email);
                    return (
                      <div key={email} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "var(--app-bg)" }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: color + "aa" }}>
                          {email[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          {u?.full_name && <p className="text-sm font-semibold truncate">{u.full_name}</p>}
                          <p className={`truncate ${u?.full_name ? "text-xs opacity-40" : "text-sm"}`}>{email}</p>
                        </div>
                        <button onClick={() => removeStudent(email)} className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && isTeacher && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={cardStyle}>
              <p className="font-bold text-sm mb-4">Class Settings</p>
              <div className="space-y-3">
                {[["Class Name", "name"], ["Subject", "subject"], ["Description", "description"]].map(([label, field]) => (
                  <div key={field}>
                    <label className="text-xs font-bold opacity-50 block mb-1">{label}</label>
                    <input defaultValue={cls[field] || ""} onBlur={async e => { const updated = await db.entities.ClassroomClass.update(cls.id, { [field]: e.target.value }); onUpdate(updated); }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-2">Class Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {CLASS_COLORS.map(c => (
                      <button key={c} onClick={async () => { const updated = await db.entities.ClassroomClass.update(cls.id, { color: c }); onUpdate(updated); }}
                        className="w-8 h-8 rounded-full transition-all hover:scale-110" style={{ background: c, outline: cls.color === c ? `3px solid ${c}` : "none", outlineOffset: 2 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Transfer Ownership */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <p className="font-bold text-sm text-amber-400 mb-1">Transfer Ownership</p>
              <p className="text-xs opacity-50 mb-3">Hand over teacher control to another user. You will lose teacher access immediately.</p>
              <div className="flex gap-2">
                <input
                  value={transferEmail}
                  onChange={e => setTransferEmail(e.target.value)}
                  placeholder="new-teacher@email.com"
                  list="transfer-suggestions"
                  className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                />
                <datalist id="transfer-suggestions">
                  {(cls.student_emails||[]).map(e => <option key={e} value={e} />)}
                </datalist>
                <button onClick={transferOwnership} disabled={!transferEmail.trim() || transferring}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 disabled:opacity-40 transition-all">
                  {transferring ? <Loader2 className="w-4 h-4 animate-spin" /> : "Transfer"}
                </button>
              </div>
              <p className="text-xs opacity-30 mt-2">Tip: existing students appear as suggestions.</p>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <p className="font-bold text-sm text-red-400 mb-2">Danger Zone</p>
              <button onClick={() => { if (window.confirm("Delete this class permanently?")) onDelete(cls.id); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                <Trash2 className="w-4 h-4" /> Delete Class
              </button>
            </div>
          </div>
        )}

        {/* Student: assigned decks view */}
        {tab === "decks" && !isTeacher && (
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="text-center py-16 opacity-30">
                <ClipboardCheck className="w-10 h-10 mx-auto mb-3" />
                <p className="font-bold">No assignments yet</p>
                <p className="text-xs mt-1">Your teacher hasn't assigned any decks yet</p>
              </div>
            ) : (
              assignments.map(a => {
                const deck = allDecks[a.deck_id];
                const due = a.due_date ? new Date(a.due_date) : null;
                const overdue = due && new Date() > due;
                return (
                  <div key={a.id} className="rounded-2xl p-4" style={cardStyle}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${deck?.color || "#4F46E5"}22` }}>
                        <div className="w-4 h-4 rounded" style={{ background: deck?.color || "#4F46E5" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{a.title || deck?.title}</p>
                        <p className="text-xs opacity-40">{deck?.card_count||0} cards{a.folder ? ` · 📁 ${a.folder}` : ""}</p>
                        {due && (
                          <p className={`text-xs flex items-center gap-1 mt-1 ${overdue ? "text-red-400" : "opacity-40"}`}>
                            <Calendar className="w-3 h-3" /> Due {due.toLocaleDateString()}{overdue ? " — Overdue!" : ""}
                          </p>
                        )}
                      </div>
                      {(() => {
                        const modeMap = { write: "WriteMode", checkpoint: "CheckpointMode", quiz: `Study?deck_id=${a.deck_id}&tab=quiz`, spaced: "SpacedRepetition", flashcards: `Study?deck_id=${a.deck_id}` };
                        const modePage = a.required_mode && a.required_mode !== "flashcards" && a.required_mode !== "quiz"
                          ? `${modeMap[a.required_mode]}?deck_id=${a.deck_id}`
                          : (modeMap[a.required_mode] || `Study?deck_id=${a.deck_id}`);
                        return (
                          <Link to={createPageUrl(modePage)}>
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all" style={{ background: `${color}20`, color }}>
                              <Play className="w-3.5 h-3.5" />
                              {a.required_mode && a.required_mode !== "flashcards" ? a.required_mode.charAt(0).toUpperCase() + a.required_mode.slice(1) : "Study"}
                            </button>
                          </Link>
                        );
                      })()}
                    </div>
                    {a.required_mode && a.required_mode !== "flashcards" && (
                      <div className="mt-2 ml-13 text-xs px-2 py-1 rounded-lg inline-flex items-center gap-1" style={{ background: `${color}15`, color }}>
                        📋 Required mode: <span className="font-bold">{a.required_mode}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            {resources.length > 0 && (
              <div className="rounded-2xl p-4" style={cardStyle}>
                <p className="font-bold text-sm mb-3">Class Resources</p>
                <div className="space-y-1.5">
                  {resources.map(id => {
                    const deck = allDecks[id];
                    if (!deck) return null;
                    return (
                      <Link key={id} to={createPageUrl(`Study?deck_id=${id}`)}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:opacity-80 transition-all" style={{ background: "var(--app-bg)" }}>
                          <div className="w-3.5 h-3.5 rounded shrink-0" style={{ background: deck.color || "#4F46E5" }} />
                          <span className="text-xs font-medium flex-1 truncate">{deck.title}</span>
                          <span className="text-xs opacity-30">{deck.card_count||0} cards</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── ASSIGN MODAL ── */}
      {assigningDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setAssigningDeck(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl" style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-base">Assign Deck</h2>
              <button onClick={() => setAssigningDeck(null)} className="p-1.5 rounded-lg opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3 mb-4 px-3 py-2.5 rounded-xl" style={{ background: "var(--app-bg)" }}>
              <div className="w-4 h-4 rounded shrink-0" style={{ background: assigningDeck.color || "#4F46E5" }} />
              <span className="text-sm font-medium truncate">{assigningDeck.title}</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Assignment Title</label>
                <input value={assignTitle} onChange={e => setAssignTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Due Date (optional)</label>
                <input type="date" value={assignDueDate} onChange={e => setAssignDueDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Required Study Mode</label>
                <select value={assignMode} onChange={e => setAssignMode(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}>
                  <option value="flashcards">Flashcards (any mode)</option>
                  <option value="write">Write Mode (type answers)</option>
                  <option value="checkpoint">Checkpoint (practice test)</option>
                  <option value="quiz">Quiz Mode</option>
                  <option value="spaced">Spaced Repetition</option>
                </select>
                <p className="text-[10px] opacity-40 mt-1">Students will be directed to this mode when they tap Study.</p>
              </div>
              {folders.length > 0 && (
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-1">Folder (optional)</label>
                  <select value={assignFolder} onChange={e => setAssignFolder(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}>
                    <option value="">No folder</option>
                    {folders.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              )}
            </div>
            <button onClick={submitAssignment} className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all" style={{ background: color }}>
              <ClipboardCheck className="w-4 h-4" /> Assign to Class
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Classroom Page ───────────────────────────────────────────────────────
export default function Classroom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [myDecks, setMyDecks] = useState([]);
  const [allDecks, setAllDecks] = useState({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState(CLASS_COLORS[0]);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [activeClass, setActiveClass] = useState(null);
  const [quickGameCode, setQuickGameCode] = useState("");
  const openClassId = new URLSearchParams(window.location.search).get("open_class");

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };

  useEffect(() => {
    const load = async () => {
      const me = await db.auth.me();
      setUser(me);
      const [cls, allD] = await Promise.all([
        db.entities.ClassroomClass.list("-created_date", 100),
        db.entities.Deck.list("-updated_date"),
      ]);
      const myCls = cls.filter(c => c.teacher_email === me.email || (c.student_emails||[]).includes(me.email));
      setClasses(myCls);
      // Auto-open class from notification link
      if (openClassId) {
        const target = myCls.find(c => c.id === openClassId);
        if (target) setActiveClass(target);
      }
      const myD = allD.filter(d => d.created_by === me.email || d.author_email === me.email);
      const publicD = allD.filter(d => d.is_public && !myD.find(md => md.id === d.id));
      setMyDecks([...myD, ...publicD]);
      const deckMap = {};
      allD.forEach(d => { deckMap[d.id] = d; });
      setAllDecks(deckMap);
      setLoading(false);
    };
    load();
  }, []);

  const createClass = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const cls = await db.entities.ClassroomClass.create({
      name: newName.trim(), subject: newSubject.trim(), description: newDesc.trim(),
      join_code: genCode(), teacher_email: user.email, teacher_name: user.full_name || user.email,
      student_emails: [], resource_deck_ids: [], assigned_deck_ids: [], assignments: [], folders: [], deck_folders: {},
      color: newColor,
    });
    setClasses(prev => [cls, ...prev]);
    setNewName(""); setNewSubject(""); setNewDesc(""); setNewColor(CLASS_COLORS[0]);
    setCreating(false); setShowCreate(false);
    setActiveClass(cls);
  };

  const joinClass = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    const allClasses = await db.entities.ClassroomClass.list("-created_date", 500);
    const cls = allClasses.find(c => c.join_code === joinCode.trim().toUpperCase());
    if (!cls) { alert("Class not found. Check the code and try again."); setJoining(false); return; }
    if ((cls.student_emails||[]).includes(user.email)) { alert("You're already in this class!"); setJoining(false); return; }
    const updated = await db.entities.ClassroomClass.update(cls.id, { student_emails: [...(cls.student_emails||[]), user.email] });
    setClasses(prev => { const exists = prev.find(c => c.id === updated.id); return exists ? prev.map(c => c.id === updated.id ? updated : c) : [...prev, updated]; });
    setJoinCode(""); setJoining(false); setShowJoin(false);
    setActiveClass(updated);
  };

  const handleUpdate = (updated) => {
    setClasses(prev => prev.map(c => c.id === updated.id ? updated : c));
    setActiveClass(updated);
  };

  const handleDelete = async (id) => {
    await db.entities.ClassroomClass.delete(id);
    setClasses(prev => prev.filter(c => c.id !== id));
    setActiveClass(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={bgStyle}><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>;

  if (activeClass) {
    const current = classes.find(c => c.id === activeClass.id) || activeClass;
    return <ClassroomDetail cls={current} user={user} myDecks={myDecks} allDecks={allDecks} onUpdate={handleUpdate} onBack={() => setActiveClass(null)} onDelete={handleDelete} />;
  }

  const myClasses = classes.filter(c => c.teacher_email === user?.email);
  const joinedClasses = classes.filter(c => c.teacher_email !== user?.email);

  return (
    <div className="min-h-screen pb-28" style={bgStyle}>
      <div className="px-6 py-8 border-b" style={{ borderColor: "var(--app-border)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/15 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-black">Classroom</h1>
              <p className="text-xs opacity-40">Organize decks, assign work, track progress</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowJoin(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-white/5" style={{ borderColor: "var(--app-border)" }}>
              <Hash className="w-4 h-4" /> Join
            </button>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all">
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Quick game join */}
        <div className="rounded-2xl p-4 mb-6 flex items-center gap-4" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <Gamepad2 className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-400">Join Live Game</p>
            <p className="text-xs opacity-50">Enter a 5-digit code to join a live quiz</p>
          </div>
          <input value={quickGameCode} onChange={e => setQuickGameCode(e.target.value.toUpperCase())} maxLength={5} placeholder="XXXXX" className="w-24 px-3 py-2 rounded-xl text-sm outline-none font-mono font-bold tracking-widest text-center" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
          <button onClick={() => navigate(createPageUrl(`ClassroomGame?code=${quickGameCode}`))} disabled={quickGameCode.length < 5} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-all">Go →</button>
        </div>

        {classes.length === 0 && (
          <div className="text-center py-20 rounded-3xl" style={cardStyle}>
            <GraduationCap className="w-14 h-14 mx-auto mb-4 opacity-10" />
            <p className="font-black text-lg mb-2">No classes yet</p>
            <p className="text-sm opacity-40 mb-6">Create a class to organize decks, assign work, and track student progress.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all"><Plus className="w-4 h-4" /> Create a Class</button>
              <button onClick={() => setShowJoin(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-white/5" style={{ borderColor: "var(--app-border)" }}><Hash className="w-4 h-4" /> Join with Code</button>
            </div>
          </div>
        )}

        {myClasses.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Classes I Teach</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myClasses.map(cls => <ClassCard key={cls.id} cls={cls} isTeacher={true} onClick={() => setActiveClass(cls)} />)}
            </div>
          </div>
        )}

        {joinedClasses.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Classes I'm In</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedClasses.map(cls => <ClassCard key={cls.id} cls={cls} isTeacher={false} onClick={() => setActiveClass(cls)} />)}
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-3xl p-6 shadow-2xl" style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg">Create a Class</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Class name (required)" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              <input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject (e.g. AP Biology)" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              <div>
                <p className="text-xs font-semibold opacity-50 mb-2">Class Color</p>
                <div className="flex gap-2 flex-wrap">
                  {CLASS_COLORS.map(c => <button key={c} onClick={() => setNewColor(c)} className="w-8 h-8 rounded-full transition-all hover:scale-110" style={{ background: c, outline: newColor === c ? `3px solid ${c}` : "none", outlineOffset: 2 }} />)}
                </div>
              </div>
            </div>
            <button onClick={createClass} disabled={!newName.trim() || creating} className="w-full mt-5 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition-all">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Class
            </button>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowJoin(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl" style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg">Join a Class</h2>
              <button onClick={() => setShowJoin(false)} className="p-1.5 rounded-lg opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm opacity-50 mb-4">Enter the 6-character code your teacher shared.</p>
            <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={6} className="w-full px-4 py-4 rounded-xl text-center text-2xl font-black font-mono outline-none tracking-widest mb-4" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
            <button onClick={joinClass} disabled={joinCode.length < 6 || joining} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition-all">
              {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />} Join Class
            </button>
          </div>
        </div>
      )}
    </div>
  );
}