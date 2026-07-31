import { db } from '@/lib/firebase';
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { canUseAi, incrementAiUsage, getRemainingAiUses, initAiCredits } from "../components/aiUsageLimit";
import { callAI } from "@/lib/lynxApi";

import { 
  Plus, Layers, Globe, Lock, Trash2, BookOpen, Loader2, Sparkles, 
  ArrowRight, FolderOpen, Folder, Copy, GitMerge, Download, Upload, 
  Edit3, FolderPlus, X, Check, Search, SlidersHorizontal, Info 
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PullToRefresh from "@/components/PullToRefresh";

const COLORS = ["#4F46E5", "#7C3AED", "#2563EB", "#0891B2", "#059669", "#D97706", "#DC2626", "#DB2777"];

export default function Decks() {
  const { t } = useTranslation();
  
  // Core Operational States
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  
  // New / Edit Deck Form Fields
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [newFolder, setNewFolder] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [cardCount, setCardCount] = useState(10);
  
  // Advanced Navigation, Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated_date"); 
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Folder Management Modal/Control States
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [targetDeckForFolder, setTargetDeckForFolder] = useState(null);
  const [folderManagementInput, setFolderManagementInput] = useState("");
  
  // Functional Operations States
  const [generating, setGenerating] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [limitError, setLimitError] = useState(null);
  const [mergeMode, setMergeMode] = useState(false);
  const [mergeSelected, setMergeSelected] = useState([]);
  const [merging, setMerging] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Image Upload Parameters
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  const jsonImportRef = useRef(null);

  // ─── ID RESOLVER HELPERS (Guarantees fallback protection) ──────────────────
  const safelyExtractId = (obj) => {
    if (!obj) return null;
    return obj._id || obj.id || (obj.id?.toString()) || null;
  };

  const normalizeDeckObject = (deck) => {
    const verifiedId = safelyExtractId(deck);
    if (!verifiedId) return deck;
    return {
      ...deck,
      id: verifiedId,
      _id: verifiedId
    };
  };

  // ─── COVER IMAGE UPLOADER ──────────────────────────────────────────────────
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    
    try {
      const reader = new FileReader();
      
      const localBase64Url = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read local file asset'));
        reader.readAsDataURL(file);
      });

      // Assign the verified base64 layout string state natively
      setCoverImageUrl(localBase64Url);
    } catch (err) {
      console.error("Image loading execution failed:", err);
      
      // Resilient inline structural fallback wrapper block
      try {
        const fallbackReader = new FileReader();
        fallbackReader.onloadend = () => {
          if (typeof fallbackReader.result === 'string') {
            setCoverImageUrl(fallbackReader.result);
          }
        };
        fallbackReader.readAsDataURL(file);
      } catch (nestedErr) {
        console.error("Ultimate fallback state layer broken:", nestedErr);
      }
    } finally {
      setUploadingCover(false);
    }
  };

  // ─── LOAD DECKS (Uses dual filtering array collection matches) ──────────────
  const loadDecks = useCallback(async () => {
    try {
      setLoading(true);
      const me = await db.auth.me();
      setUserEmail(me?.email);
      if (me?.email) {
        initAiCredits(me.email);
      }
      
      const [byCreator, byAuthor] = await Promise.all([
        db.entities.Deck.filter({ created_by: me.email }, "-updated_date", 500),
        db.entities.Deck.filter({ author_email: me.email }, "-updated_date", 500),
      ]);
      
      const seen = new Set();
      const merged = [];
      
      for (const d of [...byCreator, ...byAuthor]) {
        const verifiedId = safelyExtractId(d);
        if (verifiedId && !seen.has(verifiedId)) { 
          seen.add(verifiedId); 
          merged.push(normalizeDeckObject(d)); 
        }
      }
      
      setDecks(merged);
    } catch (error) {
      console.error("Error synchronizing local data stores with remote database:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadDecks(); 
  }, [loadDecks]);

  // ─── SAVE / EDIT DECK MUTATIONS ───────────────────────────────────────────
  const saveDeck = async () => {
    if (!newTitle.trim()) return;
    if (sourceText.trim() && !canUseAi(userEmail)) {
      setLimitError("You've reached your 5 AI uses for today. Come back tomorrow!");
      return;
    }
    
    setLimitError(null);
    setCreating(true);
    const me = await db.auth.me();

    try {
      if (editingDeck) {
        const targetEditId = safelyExtractId(editingDeck);
        const updated = await db.entities.Deck.update(targetEditId, {
          title: newTitle.trim(),
          subject: newSubject.trim(),
          description: newDescription.trim(),
          color: newColor,
          folder: newFolder.trim() || null,
          cover_image_url: coverImageUrl,
          updated_date: new Date().toISOString()
        });
        
        setDecks(prev => prev.map(d => {
          const dId = safelyExtractId(d);
          return (dId === targetEditId) ? normalizeDeckObject({ ...d, ...updated }) : d;
        }));
      } else {
        const createdDeck = await db.entities.Deck.create({
          title: newTitle.trim(),
          subject: newSubject.trim(),
          description: newDescription.trim(),
          color: newColor,
          folder: newFolder.trim() || null,
          card_count: 0,
          author_name: me.full_name || "",
          author_email: me.email || "",
          created_by: me.email || "", 
          cover_image_url: coverImageUrl || "",
          is_public: false,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        });

        const verifiedId = safelyExtractId(createdDeck);
        let finalCardCount = 0;

        if (sourceText.trim() && verifiedId) {
          incrementAiUsage(userEmail);
          setGenerating(true);
          
          const resp = await callAI({
            prompt: `Create exactly ${cardCount} high-quality flashcards from the following text. Return ONLY a JSON array of objects with "front" and "back" fields.\n\nText:\n${sourceText}`,
            feature: "deck_generate",
            response_json_schema: {
              type: "object",
              properties: { 
                cards: { 
                  type: "array", 
                  items: { 
                    type: "object", 
                    properties: { 
                      front: { type: "string" }, 
                      back: { type: "string" } 
                    },
                    required: ["front", "back"]
                  } 
                } 
              }
            }
          });
          
          const cards = resp?.cards || [];
          if (cards.length > 0) {
            await db.entities.Flashcard.bulkCreate(cards.map(c => ({ 
              ...c, 
              deck_id: verifiedId,
              difficulty: "medium",
              created_date: new Date().toISOString()
            })));
            
            await db.entities.Deck.update(verifiedId, { 
              card_count: cards.length, 
              source_text: sourceText.trim() 
            });
            finalCardCount = cards.length;
          }
          setGenerating(false);
        }

        const deckStateObject = normalizeDeckObject({
          ...createdDeck,
          card_count: finalCardCount
        });

        setDecks(prev => [deckStateObject, ...prev]);
      }
      
      resetFormState();
    } catch (err) {
      console.error("Failed to commit updates to backend collection schemas:", err);
    } finally {
      setCreating(false);
    }
  };

  const startEditDeck = (deck, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingDeck(deck);
    setNewTitle(deck.title || "");
    setNewSubject(deck.subject || "");
    setNewDescription(deck.description || "");
    setNewColor(deck.color || COLORS[0]);
    setNewFolder(deck.folder || "");
    setCoverImageUrl(deck.cover_image_url || null);
    setSourceText(""); 
    setShowNew(true);
  };

  const resetFormState = () => {
    setNewTitle("");
    setNewSubject("");
    setNewDescription("");
    setSourceText("");
    setNewFolder("");
    setNewColor(COLORS[0]);
    setCoverImageUrl(null);
    setShowNew(false);
    setEditingDeck(null);
    setLimitError(null);
  };

  const togglePublic = async (deck, e) => {
    e.preventDefault();
    e.stopPropagation();
    const targetId = safelyExtractId(deck);
    if (!targetId) return;
    try {
      const updated = await db.entities.Deck.update(targetId, { is_public: !deck.is_public });
      setDecks(prev => prev.map(d => (safelyExtractId(d) === targetId) ? { ...d, is_public: updated.is_public } : d));
    } catch (err) {
      console.error("Public metadata state setting mutation crashed:", err);
    }
  };

  const deleteDeck = async (id) => {
    if (!id) return;
    try {
      setDecks(prev => prev.filter(d => safelyExtractId(d) !== id));
      await db.entities.Deck.delete(id);
      
      const associatedCards = await db.entities.Flashcard.filter({ deck_id: id });
      for (const card of associatedCards) {
        const cId = safelyExtractId(card);
        if (cId) await db.entities.Flashcard.delete(cId);
      }
    } catch (err) {
      console.error("Failed downstream recursive record drops during deck erasure:", err);
    } finally {
      setConfirmDelete(null);
    }
  };

  // ─── JSON EXPORT / IMPORT PIPELINES ────────────────────────────────────────
  const exportDeckJson = async (deck, e) => {
    e.preventDefault(); 
    e.stopPropagation();
    const deckId = safelyExtractId(deck);
    if (!deckId) return;
    try {
      const cards = await db.entities.Flashcard.filter({ deck_id: deckId });
      const data = { 
        title: deck.title, 
        subject: deck.subject, 
        description: deck.description, 
        color: deck.color, 
        folder: deck.folder,
        cards: cards.map(c => ({ front: c.front, back: c.back, difficulty: c.difficulty || "medium" })) 
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); 
      a.href = url; 
      a.download = `${deck.title.replace(/[^a-z0-9]/gi, "_")}_backup.json`; 
      a.click();
      URL.revokeObjectURL(url);
    } catch(err) {
      console.error("Error formatting outgoing package structures:", err);
    }
  };

  const importDeckJson = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const me = await db.auth.me();
      
      const createdDeck = await db.entities.Deck.create({ 
        title: data.title || "Imported Deck", 
        subject: data.subject || "", 
        description: data.description || "", 
        color: data.color || "#4F46E5", 
        folder: data.folder || null,
        card_count: (data.cards || []).length, 
        author_name: me.full_name || "", 
        author_email: me.email || "",
        created_by: me.email || "", 
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      });
      
      const deck = normalizeDeckObject(createdDeck);
      const verifiedId = safelyExtractId(deck);
      
      if (data.cards?.length > 0 && verifiedId) {
        await db.entities.Flashcard.bulkCreate(data.cards.map(c => ({ 
          front: c.front, 
          back: c.back, 
          difficulty: c.difficulty || "medium", 
          deck_id: verifiedId, 
          author_email: me.email,
          created_date: new Date().toISOString()
        })));
      }
      
      setDecks(prev => [deck, ...prev]);
    } catch (err) {
      console.error("Parsing exception captured while extracting layouts:", err);
      alert("Invalid JSON format detected.");
    } finally {
      e.target.value = "";
    }
  };

  // ─── CLONE / DUPLICATE OPERATIONS ──────────────────────────────────────────
  const duplicateDeck = async (deck, e) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceDeckId = safelyExtractId(deck);
    if (!sourceDeckId) return;
    try {
      const me = await db.auth.me();
      const cards = await db.entities.Flashcard.filter({ deck_id: sourceDeckId });
      
      const createdDeck = await db.entities.Deck.create({
        title: `${deck.title} (Copy)`,
        subject: deck.subject || "",
        description: deck.description || "",
        color: deck.color || "#4F46E5",
        folder: deck.folder || null,
        card_count: cards.length,
        author_name: me.full_name || "",
        author_email: me.email || "",
        created_by: me.email || "", 
        is_public: false,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      });
      
      const fullClonedDeck = normalizeDeckObject(createdDeck);
      const verifiedId = safelyExtractId(fullClonedDeck);
      
      if (cards.length > 0 && verifiedId) {
        await db.entities.Flashcard.bulkCreate(cards.map(c => ({ 
          front: c.front, 
          back: c.back, 
          deck_id: verifiedId, 
          author_email: me.email,
          difficulty: c.difficulty || "medium",
          created_date: new Date().toISOString()
        })));
      }
      
      setDecks(prev => [fullClonedDeck, ...prev]);
    } catch (err) {
      console.error("Duplicate operations pipeline met fatal crash states:", err);
    }
  };

  // ─── MERGE MULTIPLE COLLECTIONS ────────────────────────────────────────────
  const mergeDecks = async () => {
    if (mergeSelected.length < 2) return;
    setMerging(true);
    
    try {
      const me = await db.auth.me();
      const selectedDecks = decks.filter(d => mergeSelected.includes(safelyExtractId(d)));
      const allCards = [];
      
      for (const d of selectedDecks) {
        const dId = safelyExtractId(d);
        if (dId) {
          const cards = await db.entities.Flashcard.filter({ deck_id: dId });
          allCards.push(...cards);
        }
      }
      
      const mergedTitle = selectedDecks.map(d => d.title).join(" + ");
      const createdDeck = await db.entities.Deck.create({
        title: mergedTitle.length > 50 ? `${mergedTitle.substring(0, 47)}...` : mergedTitle,
        subject: selectedDecks[0].subject || "Merged Collections",
        description: `Combined collection of: ${selectedDecks.map(d => d.title).join(', ')}`,
        color: selectedDecks[0].color || "#4F46E5",
        card_count: allCards.length,
        author_name: me.full_name || "",
        author_email: me.email || "",
        created_by: me.email || "", 
        is_public: false,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      });
      
      const fullMergedDeck = normalizeDeckObject(createdDeck);
      const verifiedId = safelyExtractId(fullMergedDeck);
      
      if (allCards.length > 0 && verifiedId) {
        await db.entities.Flashcard.bulkCreate(allCards.map(c => ({ 
          front: c.front, 
          back: c.back, 
          deck_id: verifiedId, 
          author_email: me.email,
          difficulty: c.difficulty || "medium",
          created_date: new Date().toISOString()
        })));
      }
      
      setDecks(prev => [fullMergedDeck, ...prev]);
      setMergeMode(false);
      setMergeSelected([]);
    } catch (err) {
      console.error("Aggregation compilation operations chain aborted:", err);
    } finally {
      setMerging(false);
    }
  };

  // ─── FOLDER SORTING MIGRATION FUNCTIONS ─────────────────────────────────────
  const applyFolderAssignment = async () => {
    if (!targetDeckForFolder) return;
    const targetId = safelyExtractId(targetDeckForFolder);
    if (!targetId) return;
    
    try {
      const updatedFolder = folderManagementInput.trim() || null;
      await db.entities.Deck.update(targetId, { folder: updatedFolder });
      
      setDecks(prev => prev.map(d => (safelyExtractId(d) === targetId) ? { ...d, folder: updatedFolder } : d));
      setShowFolderModal(false);
      setTargetDeckForFolder(null);
      setFolderManagementInput("");
    } catch (err) {
      console.error("Folder update configuration dropped unexpectedly:", err);
    }
  };

  // ─── SEARCH / FILTERS ARCHITECTURE ──────────────────────────────────────────
  const allSubjects = Array.from(new Set(decks.map(d => d.subject).filter(Boolean)));

  const filteredAndSortedDecks = decks
    .filter(deck => {
      const matchSearch = deck.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deck.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deck.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubject = selectedSubjectFilter === "all" || deck.subject === selectedSubjectFilter;
      return matchSearch && matchSubject;
    })
    .sort((a, b) => {
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "card_count") return (b.card_count || 0) - (a.card_count || 0);
      return new Date(b.updated_date || 0) - new Date(a.updated_date || 0);
    });

  const bgStyle = { background: "var(--app-bg, #0f0f12)", color: "var(--app-text, #ffffff)" };
  const cardStyle = { background: "var(--app-surface, #18181c)", border: "1px solid var(--app-border, #26262b)" };
  const mutedStyle = { color: "var(--app-text-muted, #a1a1aa)" };

  return (
    <PullToRefresh onRefresh={loadDecks}>
      <div className="min-h-screen pb-32 px-4 sm:px-6 py-6 sm:py-10" style={bgStyle}>
        <div className="max-w-4xl mx-auto">
          
          {/* Main Top Header Block Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">{t('myDecks')}</h1>
              <p className="text-sm" style={mutedStyle}>
                {decks.length} {t('Decks')} · {decks.reduce((acc, curr) => acc + (curr.card_count || 0), 0)} Total Cards
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <input ref={jsonImportRef} type="file" accept=".json" className="hidden" onChange={importDeckJson} />
              
              <button
                onClick={() => { jsonImportRef.current?.click(); }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all opacity-70 hover:opacity-100"
                style={cardStyle}
                title="Import via JSON"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Import</span>
              </button>

              <button
                onClick={() => { setMergeMode(m => !m); setMergeSelected([]); }}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-xs transition-all border ${
                  mergeMode ? "text-amber-400 border-amber-500/40 bg-amber-500/10" : "opacity-70 hover:opacity-100"
                }`}
                style={mergeMode ? {} : cardStyle}
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>{mergeMode ? t('cancel') : t('mergeDecksBtn')}</span>
              </button>
              
              <button
                onClick={() => {
                  resetFormState();
                  setShowNew(true);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-lg shadow-violet-600/10"
              >
                <Plus className="w-4 h-4" /> {t('newDeck')}
              </button>
            </div>
          </div>

          {/* Search Engine Control Panel */}
          <div className="rounded-2xl p-3 mb-6 space-y-3" style={cardStyle}>
            <div className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2 border border-white/5">
              <Search className="w-4 h-4 opacity-40 shrink-0" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search decks by title, subject, or descriptions..."
                className="bg-transparent w-full outline-none text-xs text-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="opacity-40 hover:opacity-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button 
                onClick={() => setShowAdvancedFilters(f => !f)} 
                className={`p-1 rounded transition-all ${showAdvancedFilters ? "text-violet-400 bg-white/5" : "opacity-40"}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {showAdvancedFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
                <div>
                  <label className="block text-[11px] mb-1 opacity-60">Filter Subject Domain</label>
                  <select
                    value={selectedSubjectFilter}
                    onChange={e => setSelectedSubjectFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg outline-none border border-white/10"
                    style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
                  >
                    <option value="all">All Available Subjects</option>
                    {allSubjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] mb-1 opacity-60">Sort Presentation Hierarchy</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg outline-none border border-white/10"
                    style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
                  >
                    <option value="updated_date">Recently Modified</option>
                    <option value="title">Alphabetical Title</option>
                    <option value="card_count">Card Quantity Size</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Form Drawer: Create/Edit Multi-functional Form Container */}
          {showNew && (
            <div className="rounded-3xl p-5 sm:p-6 mb-6 relative overflow-hidden shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200 border-2" style={{...cardStyle, borderColor: newColor + "40"}}>
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: newColor }} />
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  {editingDeck ? <Edit3 className="w-4 h-4 text-violet-400" /> : <Plus className="w-4 h-4 text-violet-400" />}
                  {editingDeck ? `Edit Deck Configuration` : t('createDeck')}
                </h3>
                <button onClick={resetFormState} className="p-1 opacity-50 hover:opacity-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input id="deck-cover-creation-file" type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  <label htmlFor="deck-cover-creation-file" className="w-full sm:w-20 h-24 sm:h-20 rounded-2xl border border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-black/20 hover:bg-black/40 transition-all shrink-0 border-white/10 group">
                    {uploadingCover ? (
                      <Loader2 className="w-5 h-5 animate-spin opacity-50" />
                    ) : coverImageUrl ? (
                      <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4 opacity-40 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] opacity-40 mt-1 uppercase tracking-wider font-bold">Image</span>
                      </>
                    )}
                  </label>
                  
                  <div className="flex-1 space-y-3">
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="Enter Deck title character sequence *"
                      className="w-full px-4 py-2.5 rounded-xl text-xs outline-none border border-white/5 font-semibold"
                      style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        value={newSubject}
                        onChange={e => setNewSubject(e.target.value)}
                        placeholder="Subject (e.g. Physics, Law)"
                        className="w-full px-3 py-2 rounded-xl text-xs outline-none border border-white/5"
                        style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
                      />
                      <input
                        value={newFolder}
                        onChange={e => setNewFolder(e.target.value)}
                        placeholder="Folder categorization"
                        className="w-full px-3 py-2 rounded-xl text-xs outline-none border border-white/5"
                        style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
                      />
                    </div>
                  </div>
                </div>

                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Provide short structural deck description notes (optional)..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl text-xs outline-none resize-none border border-white/5"
                  style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
                />

                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider mb-2 opacity-50">Theme Color Assignment Identity</p>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewColor(color)}
                        className={`w-6 h-6 rounded-full transition-all border border-black/40 relative ${
                          newColor === color ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0f0f12] scale-110" : "opacity-60 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {newColor === color && <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {!editingDeck && (
                  <div className="border-t border-white/5 pt-3 mt-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      <p className="text-xs font-semibold">AI Synthesizer Framework (Optional)</p>
                    </div>
                    <textarea
                      value={sourceText}
                      onChange={e => setSourceText(e.target.value)}
                      placeholder="Paste text, notes chapters, or reading blocks, and the AI will auto-populate cards."
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl text-xs outline-none resize-none border border-white/5"
                      style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
                    />
                    
                    {sourceText.trim() && (
                      <div className="mt-2 p-3 bg-black/20 rounded-xl space-y-2 border border-white/5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span style={mutedStyle}>Generate Quantity Count:</span>
                          <span className="font-bold text-violet-400">{cardCount} Cards</span>
                        </div>
                        <input
                          type="range" min={5} max={100} step={5}
                          value={cardCount}
                          onChange={e => setCardCount(Number(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-600"
                        />
                      </div>
                    )}
                  </div>
                )}

                {limitError && <p className="text-red-400 text-xs font-medium bg-red-500/10 p-2 rounded-lg">{limitError}</p>}

                {userEmail && sourceText.trim() && getRemainingAiUses(userEmail) !== Infinity && (
                  <p className="text-[11px] flex items-center gap-1 opacity-50">
                    <Info className="w-3 h-3" />
                    {getRemainingAiUses(userEmail)} AI queries remaining for today.
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={resetFormState} className="flex-1 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-all hover:bg-white/5">
                    {t('cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={saveDeck}
                    disabled={creating || !newTitle.trim() || uploadingCover}
                    className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-violet-600/20"
                  >
                    {creating || generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : editingDeck ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {generating ? "Synthesizing Cards..." : editingDeck ? "Commit Changes" : t('createDeck')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Merge Action Banner */}
          {mergeMode && (
            <div className="rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 border animate-pulse" style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.3)" }}>
              <div className="flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-amber-500" />
                <p className="text-xs sm:text-sm text-amber-400 font-semibold">
                  {mergeSelected.length < 2 ? `Select at least ${2 - mergeSelected.length} more deck(s) to combine` : `${mergeSelected.length} Decks Chosen for Merge`}
                </p>
              </div>
              <button
                onClick={mergeDecks}
                disabled={mergeSelected.length < 2 || merging}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
              >
                {merging && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Combine Decks
              </button>
            </div>
          )}

          {/* Core Collection Presentation Grid Container */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-2">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
              <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Accessing Records Storage</p>
            </div>
          ) : filteredAndSortedDecks.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-dashed border-white/10" style={cardStyle}>
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-20 text-violet-400" />
              <p className="font-bold text-sm mb-1">{searchQuery || selectedSubjectFilter !== "all" ? "No matching criteria records found" : t('noCards')}</p>
              <p className="text-xs max-w-xs mx-auto" style={mutedStyle}>Try broadening filter selections or instantiate a fresh master document deck directly.</p>
            </div>
          ) : (() => {
            const folders = {};
            const noFolder = [];
            
            filteredAndSortedDecks.forEach(deck => {
              if (deck.folder) {
                if (!folders[deck.folder]) folders[deck.folder] = [];
                folders[deck.folder].push(deck);
              } else {
                noFolder.push(deck);
              }
            });

            const RenderDeckCard = ({ deck }) => {
              const currentDeckId = safelyExtractId(deck);
              const isSelectedForMerge = mergeSelected.includes(currentDeckId);
              
              if (mergeMode) {
                return (
                  <div
                    onClick={() => setMergeSelected(prev => isSelectedForMerge ? prev.filter(id => id !== currentDeckId) : [...prev, currentDeckId])}
                    className={`flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all border ${
                      isSelectedForMerge ? "border-amber-500 bg-amber-500/10 scale-[0.99]" : "hover:border-white/10"
                    }`}
                    style={cardStyle}
                  >
                    <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: deck.color || "#4F46E5" }}>
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate text-white">{deck.title}</p>
                      <p className="text-[10px] mt-0.5" style={mutedStyle}>{deck.card_count || 0} items populated</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelectedForMerge ? "bg-amber-500 border-amber-500" : "border-white/20"
                    }`}>
                      {isSelectedForMerge && <span className="text-black text-[10px] font-black">✓</span>}
                    </div>
                  </div>
                );
              }

              return (
                <div className="rounded-2xl overflow-hidden group border border-white/5 hover:border-white/10 transition-all duration-200 flex flex-col justify-between" style={cardStyle}>
                  {/* FIXED: The target routing string is strictly passed through the verified ID resolver to avoid hitting "undefined" router values */}
                  <Link to={createPageUrl(`Study?deck_id=${currentDeckId}`)} className="block p-4 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center overflow-hidden border border-black/40 relative" style={{ background: deck.color || "#4F46E5" }}>
                        {deck.cover_image_url ? (
                          <img src={deck.cover_image_url} alt="cover image" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-white" />
                        )}
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-black" style={{ backgroundColor: deck.color }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {deck.subject && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase bg-white/5 border border-white/5 text-violet-300">
                              {deck.subject}
                            </span>
                          )}
                          <span className="text-[10px]" style={mutedStyle}>{deck.card_count || 0} cards</span>
                        </div>
                        <h4 className="font-bold text-xs mt-1 text-white truncate group-hover:text-violet-400 transition-colors">{deck.title}</h4>
                        {deck.description && (
                          <p className="text-[10px] mt-0.5 line-clamp-2" style={mutedStyle}>{deck.description}</p>
                        )}
                      </div>
                      
                      <ArrowRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>
                  </Link>

                  {/* Quick Controls Row */}
                  <div className="flex items-center gap-1 px-3 pb-3 pt-1 border-t border-white/5 bg-black/10">
                    <button
                      onClick={(e) => exportDeckJson(deck, e)}
                      className="p-1.5 rounded-lg text-[10px] font-medium transition-all bg-white/5 hover:bg-white/10 flex items-center gap-1"
                      title="Download local JSON copy"
                    >
                      <Download className="w-3 h-3 opacity-60" /> Export
                    </button>
                    
                    <button
                      onClick={(e) => duplicateDeck(deck, e)}
                      className="p-1.5 rounded-lg text-[10px] font-medium transition-all bg-white/5 hover:bg-white/10 flex items-center gap-1"
                      title="Clone collection struct"
                    >
                      <Copy className="w-3 h-3 opacity-60" /> Clone
                    </button>
                    
                    <button
                      onClick={(e) => togglePublic(deck, e)}
                      className={`p-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 ${
                        deck.is_public ? "text-emerald-400 bg-emerald-500/10" : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {deck.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3 opacity-60" />}
                      {deck.is_public ? "Public" : "Private"}
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setTargetDeckForFolder(deck);
                        setFolderManagementInput(deck.folder || "");
                        setShowFolderModal(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400/80 hover:text-amber-400 transition-all ml-auto"
                      title="Configure folder sorting assignment"
                    >
                      <FolderPlus className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => startEditDeck(deck, e)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400/80 hover:text-blue-400 transition-all"
                      title="Edit structural info fields"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(deck); }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 opacity-60 hover:opacity-100 transition-all"
                      title="Erase entire collection database rows"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-8 animate-in fade-in duration-300">
                {Object.entries(folders).map(([folderName, folderDecks]) => (
                  <div key={folderName} className="space-y-3">
                    <div className="flex items-center gap-2 px-1 py-0.5 bg-amber-500/5 rounded-lg border border-amber-500/10 w-fit">
                      <FolderOpen className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider">{folderName}</span>
                      <span className="text-[10px] opacity-40 px-1 bg-white/5 rounded">{(folderDecks).length}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3 border-l-2 border-amber-500/20">
                      {folderDecks.map(deck => <RenderDeckCard key={safelyExtractId(deck)} deck={deck} />)}
                    </div>
                  </div>
                ))}
                
                {noFolder.length > 0 && (
                  <div className="space-y-3">
                    {Object.keys(folders).length > 0 && (
                      <div className="flex items-center gap-2 px-1 opacity-50">
                        <Folder className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">Unassigned Items</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {noFolder.map(deck => <RenderDeckCard key={safelyExtractId(deck)} deck={deck} />)}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Interactive Modal Viewport Layer: Folder Designation Editor */}
          {showFolderModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-sm rounded-2xl p-5 border border-white/15" style={cardStyle}>
                <h3 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-amber-400" /> Assign Sorting Folder
                </h3>
                <p className="text-[11px] mb-4" style={mutedStyle}>
                  Specify a folder name for &ldquo;{targetDeckForFolder?.title}&rdquo;. Matches combine automatically. Clear field to drop assignment.
                </p>
                
                <input 
                  type="text"
                  value={folderManagementInput}
                  onChange={e => setFolderManagementInput(e.target.value)}
                  placeholder="e.g. Midterms, Sem-2, Language Study"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/10 outline-none text-white mb-4 font-semibold"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowFolderModal(false); setTargetDeckForFolder(null); }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 hover:bg-white/10 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFolderAssignment}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/10"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Downstream Drop Safety Dialog Confirmation Interface */}
          <ConfirmDialog
            open={!!confirmDelete}
            title="Delete Deck Forever?"
            message={`Are you completely certain you want to delete"${confirmDelete?.title}"? This action is not reversable.`}
            confirmText="Confirm"
            onConfirm={() => deleteDeck(safelyExtractId(confirmDelete))}
            onCancel={() => setConfirmDelete(null)}
          />

        </div>
      </div>
    </PullToRefresh>
  );
}