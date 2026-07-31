import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";

import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { incrementAiUsage } from "../components/aiUsageLimit";
import { generateQuizFromCards } from "../lib/lynxApi";
import { ChevronLeft, ChevronRight, Check, Brain, Target, Loader2, Plus, Trash2, Edit3, Save, BookmarkCheck, Bookmark, FolderOpen, Folder, Shuffle, Gamepad2, Type, RefreshCw, PenLine, Flag, AlertTriangle, ClipboardList, Globe, Lock } from "lucide-react";
import DyslexiaToolbar from "@/components/DyslexiaToolbar";
import DeckCoverPicker from "@/components/DeckCoverPicker";
import LatexRenderer from "../components/LatexRenderer";
import FocusMode from "../components/FocusMode";
import AdaptiveLearnMode from "../components/AdaptiveLearnMode";
import DeckTutor from "../components/DeckTutor";
import TTSButton from "../components/TTSButton";
import TestSetup from "../components/TestSetup";
import TestMode from "../components/TestMode";
import VerifyRequestButton from "../components/VerifyRequestButton";

export default function Study() {
  const { t } = useTranslation();
  const params = new URLSearchParams(window.location.search);
  const deckId = params.get("deck_id");

  const [user, setUser] = useState(null);
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deckRating, setDeckRating] = useState(null);
  const [deckTrending, setDeckTrending] = useState(0);
  const [mode, setMode] = useState("menu"); // menu, flashcards, review-needed, quiz
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardStatuses, setCardStatuses] = useState({}); // cardId -> 'studied' or 'need_to_study'
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({}); // questionIndex -> selectedOptionIndex
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizCount, setQuizCount] = useState(10);
  const [showQuizCountPicker, setShowQuizCountPicker] = useState(false);
  const [sessionStart, setSessionStart] = useState(null);
  
  // Inline modification editing states
  const [editingCard, setEditingCard] = useState(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");
  const [addingCard, setAddingCard] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  
  // Deck Level Meta States
  const [editingDeckTitle, setEditingDeckTitle] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [editingFolder, setEditingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [editingSubject, setEditingSubject] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [descText, setDescText] = useState("");
  
  const [showDoneChoice, setShowDoneChoice] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [studyCards, setStudyCards] = useState([]);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [showTutor, setShowTutor] = useState(false);
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  const [showTestSetup, setShowTestSetup] = useState(false);
  const [testConfig, setTestConfig] = useState(null);
  
  const [reportingCard, setReportingCard] = useState(null);
  const [reportReason, setReportReason] = useState("");
  
  const [editingCardDesc, setEditingCardDesc] = useState(null);
  const [editDescText, setEditDescText] = useState("");
  
  const [cardDrafts, setCardDrafts] = useState([]);
  const [draftSubmitted, setDraftSubmitted] = useState(false);
  
  const [dyslexiaFont, setDyslexiaFont] = useState("inherit");
  const [dyslexiaSize, setDyslexiaSize] = useState("1rem");

  useEffect(() => {
    // GUARDRAIL: Intercept literal "undefined" or missing parameter values early
    if (!deckId || deckId === "undefined" || deckId === "null") {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const me = await db.auth.me();
        setUser(me);

        let targetDeck = null;
        let targetCards = [];

        // Step 1: Attempt standard collection lookups
        try {
          const [d, c] = await Promise.all([
            db.entities.Deck.filter({ id: deckId }),
            db.entities.Flashcard.filter({ deck_id: deckId }),
          ]);
          targetDeck = d[0] || null;
          targetCards = c || [];
        } catch (e) {
          console.warn("Direct point lookup intercepted exceptions, launching fallback scans...");
        }

        // Step 2: Adaptive ID structure scan matching layout configurations
        if (!targetDeck) {
          const userEmail = me?.email || "";
          const [byCreator, byAuthor] = await Promise.all([
            db.entities.Deck.filter({ created_by: userEmail }, "-updated_date", 500),
            db.entities.Deck.filter({ author_email: userEmail }, "-updated_date", 500),
          ]);
          
          const combinedDecks = [...byCreator, ...byAuthor];
          targetDeck = combinedDecks.find(d => d.id === deckId || d._id === deckId);

          if (targetDeck) {
            const actualId = targetDeck.id || targetDeck._id;
            targetCards = await db.entities.Flashcard.filter({ deck_id: actualId });
          }
        }

        if (!targetDeck) {
          setLoading(false);
          return;
        }

        const activeDeckId = targetDeck.id || targetDeck._id;

        setDeck(targetDeck);
        setCards(targetCards);
        setStudyCards(targetCards);
        setFolderName(targetDeck.folder || "");

        // Fetch dependent data using the confirmed deck ID string safely
        const [quizzes, allRatings, sessions] = await Promise.all([
          db.entities.Quiz.filter({ deck_id: activeDeckId }),
          db.entities.DeckRating.filter({ deck_id: activeDeckId }),
          db.entities.StudySession.filter({ deck_id: activeDeckId }),
        ]);

        setSavedQuizzes(quizzes.filter(q => q.questions?.length > 0));
        
        const drafts = await db.entities.CardDraft.filter({ deck_id: activeDeckId });
        setCardDrafts(drafts.filter(dr => dr.status === "pending"));

        if (allRatings.length > 0) {
          const avg = allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length;
          setDeckRating({ avg, count: allRatings.length });
        }

        const todaySessions = sessions.filter(s => s.created_date?.slice(0, 10) === today);
        setDeckTrending(todaySessions.length);
      } catch (err) {
        console.error("Critical session loading failure:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [deckId]);

  const isAuthor = user && deck && (deck.created_by === user.email || deck.author_email === user.email);

  useEffect(() => {
    const handleKey = (e) => {
      if (mode !== "flashcards" && mode !== "review-needed") return;
      const activeCards = mode === "review-needed"
        ? studyCards.filter(c => cardStatuses[c.id || c._id] === "need_to_study")
        : studyCards;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (!flipped) { setFlipped(true); } else { handleFlashcardNext(); }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex > 0) { setCurrentIndex(i => i - 1); setFlipped(false); }
      } else if (e.key === "ArrowUp" || e.key === "g") {
        e.preventDefault();
        const card = activeCards[currentIndex];
        if (card) markCard(card.id || card._id, "studied");
      } else if (e.key === "ArrowDown" || e.key === "b") {
        e.preventDefault();
        const card = activeCards[currentIndex];
        if (card) markCard(card.id || card._id, "need_to_study");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, flipped, currentIndex, studyCards, cardStatuses]);

  const startFlashcards = () => {
    const ordered = shuffle ? [...cards].sort(() => Math.random() - 0.5) : [...cards];
    setStudyCards(ordered);
    setCurrentIndex(0); setFlipped(false); setCardStatuses({});
    setShowDoneChoice(false); setSessionStart(Date.now()); setMode("flashcards");
  };

  const startReviewNeeded = () => {
    setCurrentIndex(0); setFlipped(false); setShowDoneChoice(false); setMode("review-needed");
  };

  const loadSavedQuiz = (quiz) => {
    const qs = (quiz.questions || []).map(q => ({
      question: q.question, options: q.options,
      correct: q.options.indexOf(q.correct_answer), explanation: q.explanation || "",
    }));
    setQuizQuestions(qs); setQuizAnswers({}); setQuizSubmitted(false);
    setSessionStart(Date.now()); setMode("quiz");
  };

  const startQuizFlow = () => setShowQuizCountPicker(true);

  const startQuiz = async () => {
    setShowQuizCountPicker(false); setGeneratingQuiz(true); setMode("quiz");
    incrementAiUsage(user?.email, false, 0.5);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffled.slice(0, Math.min(shuffled.length, quizCount * 2));
    const resp = await generateQuizFromCards({ cards: selectedCards, count: quizCount, feature: "quiz_generation" });
    setQuizQuestions(resp?.questions || []); setQuizAnswers({}); setQuizSubmitted(false);
    setSessionStart(Date.now()); setGeneratingQuiz(false);
  };

  const submitQuiz = async () => {
    setQuizSubmitted(true);
    const correct = quizQuestions.filter((q, i) => quizAnswers[i] === q.correct).length;
    const score = Math.round((correct / quizQuestions.length) * 100);
    const duration = sessionStart ? Math.round((Date.now() - sessionStart) / 60000) : 0;
    await db.entities.StudySession.create({
      deck_id: deck.id || deck._id || deckId, session_type: "quiz", cards_reviewed: quizQuestions.length,
      cards_correct: correct, duration_minutes: duration, quiz_score: score,
      quiz_total: quizQuestions.length, user_email: user?.email || "",
    });
  };

  const saveQuiz = async () => {
    const correct = quizQuestions.filter((q, i) => quizAnswers[i] === q.correct).length;
    const score = Math.round((correct / quizQuestions.length) * 100);
    const saved = await db.entities.Quiz.create({
      title: `${deck?.title} Quiz — ${new Date().toLocaleDateString()}`, deck_id: deck.id || deck._id || deckId,
      questions: quizQuestions.map((q) => ({
        question: q.question, options: q.options,
        correct_answer: q.options[q.correct], explanation: q.explanation || "",
      })),
      score, completed: true, type: "multiple_choice",
    });
    setSavedQuizzes(prev => [saved, ...prev]);
  };

  const endFlashcardSession = async () => {
    if (!sessionStart) { setMode("menu"); return; }
    const duration = Math.round((Date.now() - sessionStart) / 60000);
    await db.entities.StudySession.create({
      deck_id: deck.id || deck._id || deckId, session_type: "flashcards",
      cards_reviewed: currentIndex + 1, duration_minutes: Math.max(1, duration), user_email: user?.email || "",
    });
    setMode("menu");
  };

  const markCard = (cardId, status) => setCardStatuses(prev => ({ ...prev, [cardId]: status }));

  const handleFlashcardNext = () => {
    const activeCards = mode === "review-needed"
      ? studyCards.filter(c => cardStatuses[c.id || c._id] === "need_to_study") : studyCards;
    if (currentIndex < activeCards.length - 1) {
      setCurrentIndex(i => i + 1); setFlipped(false);
    } else {
      const needCount = Object.values(cardStatuses).filter(s => s === "need_to_study").length;
      if (mode === "flashcards" && needCount > 0) { setShowDoneChoice(true); }
      else { endFlashcardSession(); }
    }
  };

  const saveEdit = async () => {
    if (!editingCard) return;
    const targetId = editingCard.id || editingCard._id;
    await db.entities.Flashcard.update(targetId, { front: editFront, back: editBack, description: editingCard.description });
    setCards(prev => prev.map(c => (c.id === targetId || c._id === targetId) ? { ...c, front: editFront, back: editBack } : c));
    setEditingCard(null);
  };

  const saveCardDesc = async (cardId) => {
    await db.entities.Flashcard.update(cardId, { description: editDescText.trim() });
    setCards(prev => prev.map(c => (c.id === cardId || c._id === cardId) ? { ...c, description: editDescText.trim() } : c));
    setEditingCardDesc(null);
  };

  const submitReport = async (card) => {
    if (!reportReason.trim()) return;
    const cardIsAuthor = user && (card.created_by === user.email || card.author_email === user.email);
    if (cardIsAuthor) {
      await db.entities.Flashcard.update(card.id || card._id, { difficulty: "hard" });
    }
    const ownerEmail = deck?.author_email || deck?.created_by;
    if (ownerEmail && ownerEmail !== user?.email) {
      await db.entities.AppNotification.create({
        recipient_email: ownerEmail,
        title: "⚠️ Card Reported",
        message: `A card in "${deck?.title}" was reported: "${card.front.slice(0, 60)}..." — Reason: ${reportReason.trim().slice(0, 100)}`,
        icon: "flag",
        read: false,
      });
    }
    setReportingCard(null); setReportReason("");
    alert(t('thankYouReport'));
  };

  const deleteCard = async (id) => {
    setCards(prev => prev.filter(c => c.id !== id && c._id !== id));
    await db.entities.Flashcard.delete(id);
    const currentDeckId = deck.id || deck._id || deckId;
    await db.entities.Deck.update(currentDeckId, { card_count: cards.length - 1 });
    setDeck(prev => ({ ...prev, card_count: (prev?.card_count || 1) - 1 }));
  };

  const addCard = async () => {
    if (!newFront.trim() || !newBack.trim()) return;
    const currentDeckId = deck.id || deck._id || deckId;
    if (isAuthor) {
      const card = await db.entities.Flashcard.create({
        deck_id: currentDeckId, front: newFront.trim(), back: newBack.trim(), author_email: user?.email || "",
      });
      setCards(prev => [...prev, card]);
      await db.entities.Deck.update(currentDeckId, { card_count: cards.length + 1 });
      setDeck(prev => ({ ...prev, card_count: (prev?.card_count || 0) + 1 }));
    } else {
      const draft = await db.entities.CardDraft.create({
        deck_id: currentDeckId,
        front: newFront.trim(),
        back: newBack.trim(),
        submitter_email: user?.email || "",
        submitter_name: user?.full_name || user?.email || "",
        status: "pending",
      });
      const ownerEmail = deck?.created_by || deck?.author_email;
      if (ownerEmail) {
        db.entities.AppNotification.create({
          recipient_email: ownerEmail,
          title: "📝 New Card Suggestion",
          message: `${user?.full_name || user?.email} suggested a card for "${deck?.title}": "${newFront.trim().slice(0, 60)}"`,
          icon: "bell",
          read: false,
        }).catch(() => {});
      }
      setDraftSubmitted(true);
      setTimeout(() => setDraftSubmitted(false), 3000);
    }
    setNewFront(""); setNewBack(""); setAddingCard(false);
  };

  const approveDraft = async (draft) => {
    const currentDeckId = deck.id || deck._id || deckId;
    const card = await db.entities.Flashcard.create({
      deck_id: currentDeckId, front: draft.front, back: draft.back, author_email: draft.submitter_email,
    });
    await db.entities.CardDraft.update(draft.id || draft._id, { status: "approved" });
    await db.entities.Deck.update(currentDeckId, { card_count: cards.length + 1 });
    setDeck(prev => ({ ...prev, card_count: (prev?.card_count || 0) + 1 }));
    setCards(prev => [...prev, card]);
    setCardDrafts(prev => prev.filter(d => d.id !== draft.id && d._id !== draft.id));
    db.entities.AppNotification.create({
      recipient_email: draft.submitter_email,
      title: "✅ Card Approved!",
      message: `Your suggested card was approved for "${deck?.title}": "${draft.front.slice(0, 60)}"`,
      icon: "bell", read: false,
    }).catch(() => {});
  };

  const rejectDraft = async (draft) => {
    await db.entities.CardDraft.update(draft.id || draft._id, { status: "rejected" });
    setCardDrafts(prev => prev.filter(d => d.id !== draft.id && d._id !== draft.id));
    db.entities.AppNotification.create({
      recipient_email: draft.submitter_email,
      title: "❌ Card Not Approved",
      message: `Your suggested card for "${deck?.title}" was not approved: "${draft.front.slice(0, 60)}"`,
      icon: "bell", read: false,
    }).catch(() => {});
  };

  const saveDeckTitle = async () => {
    if (!newDeckTitle.trim()) return;
    await db.entities.Deck.update(deck.id || deck._id || deckId, { title: newDeckTitle.trim() });
    setDeck(prev => ({ ...prev, title: newDeckTitle.trim() })); setEditingDeckTitle(false);
  };

  const saveFolder = async () => {
    await db.entities.Deck.update(deck.id || deck._id || deckId, { folder: folderName.trim() });
    setDeck(prev => ({ ...prev, folder: folderName.trim() })); setEditingFolder(false);
  };

  const saveSubject = async () => {
    await db.entities.Deck.update(deck.id || deck._id || deckId, { subject: subjectName.trim() });
    setDeck(prev => ({ ...prev, subject: subjectName.trim() })); setEditingSubject(false);
  };

  const saveDesc = async () => {
    await db.entities.Deck.update(deck.id || deck._id || deckId, { description: descText.trim() });
    setDeck(prev => ({ ...prev, description: descText.trim() })); setEditingDesc(false);
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)", fontFamily: dyslexiaFont, fontSize: dyslexiaSize };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const toggleVisibility = async () => {
    const newVal = !deck.is_public;
    await db.entities.Deck.update(deck.id || deck._id || deckId, { is_public: newVal });
    setDeck(prev => ({ ...prev, is_public: newVal }));
  };

  const isTeacherOrAdmin = user && (
    user.role === "admin" ||
    (user.email && user.email.endsWith("@hbuhsd.edu") && !user.email.endsWith("@student.hbuhsd.edu"))
  );

  const toggleVerified = async () => {
    const newVal = !deck.is_verified;
    const currentDeckId = deck.id || deck._id || deckId;
    await db.entities.Deck.update(currentDeckId, { is_verified: newVal, verified_by: newVal ? user.email : null });
    setDeck(prev => ({ ...prev, is_verified: newVal, verified_by: newVal ? user.email : null }));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  if (!deck) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <p style={mutedStyle}>Deck not found.</p>
    </div>
  );

  // --- FLASHCARD / REVIEW-NEEDED MODE ---
  if (mode === "flashcards" || mode === "review-needed") {
    const activeCards = mode === "review-needed"
      ? studyCards.filter(c => cardStatuses[c.id || c._id] === "need_to_study") : studyCards;
    const card = activeCards[currentIndex];

    if (!card) return (
      <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
        <div className="text-center p-8">
          <Check className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <p className="font-bold text-lg mb-2">{t('allCaughtUp')}</p>
          <button onClick={endFlashcardSession} className="px-6 py-3 rounded-2xl font-semibold text-sm bg-violet-600 text-white mt-4">{t('backToDeckBtn')}</button>
        </div>
      </div>
    );

    if (showDoneChoice) {
      const needCount = Object.values(cardStatuses).filter(s => s === "need_to_study").length;
      return (
        <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
          <div className="max-w-sm w-full text-center rounded-3xl p-8" style={cardStyle}>
            <BookmarkCheck className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-black mb-2">{t('sessionComplete')}</h2>
            <p className="text-sm mb-6" style={mutedStyle}>
              {needCount} {t('needToStudy')}
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={startReviewNeeded} className="w-full flex items-center justify-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 py-3 rounded-2xl font-semibold text-sm transition-all hover:bg-amber-500/30">
                <Bookmark className="w-4 h-4" /> {t('reviewNeedToStudy')} ({needCount})
              </button>
              <button onClick={endFlashcardSession} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-semibold text-sm transition-all">
                <Check className="w-4 h-4" /> {t('doneImGood')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentStatus = cardStatuses[card.id || card._id];
    return (
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={endFlashcardSession} className="text-sm font-medium" style={mutedStyle}>← {t('back')}</button>
            <span className="text-sm font-medium" style={mutedStyle}>
              {mode === "review-needed" && <span className="text-amber-400 mr-2">{t('reviewMode')}</span>}
              {currentIndex + 1} / {activeCards.length}
              {shuffle && <span className="ml-2 text-violet-400">🔀</span>}
            </span>
          </div>
          <div onClick={() => setFlipped(!flipped)} className="rounded-3xl p-10 min-h-64 flex items-center justify-center cursor-pointer transition-all mb-4 text-center select-none relative" style={cardStyle}>
            <p className="text-xl font-semibold leading-relaxed">
              <LatexRenderer text={flipped ? card?.back : card?.front} />
            </p>
            <div className="absolute bottom-3 right-3">
              <TTSButton text={flipped ? card?.back : card?.front} />
            </div>
          </div>
          <p className="text-xs text-center mb-4" style={mutedStyle}>{flipped ? t('answer') : t('tapToReveal')} · {t('navigateHint')}</p>
          <div className="flex gap-3 mb-4">
            <button onClick={() => markCard(card.id || card._id, "studied")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all border ${currentStatus === "studied" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "border-transparent opacity-50 hover:opacity-80"}`}
              style={currentStatus !== "studied" ? cardStyle : {}}>
              <Check className="w-4 h-4" /> {t('studied')}
            </button>
            <button onClick={() => markCard(card.id || card._id, "need_to_study")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all border ${currentStatus === "need_to_study" ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "border-transparent opacity-50 hover:opacity-80"}`}
              style={currentStatus !== "need_to_study" ? cardStyle : {}}>
              <Bookmark className="w-4 h-4" /> {t('needToStudy')}
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setCurrentIndex(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={currentIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm disabled:opacity-30 transition-all" style={cardStyle}>
              <ChevronLeft className="w-4 h-4" /> {t('prev')}
            </button>
            <button onClick={handleFlashcardNext}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all ${currentIndex < activeCards.length - 1 ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}>
              {currentIndex < activeCards.length - 1
                ? <><span>{t('next')}</span><ChevronRight className="w-4 h-4" /></>
                : <><Check className="w-4 h-4" /><span>{t('done')}</span></>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ MODE ---
  if (mode === "quiz") {
    if (generatingQuiz) return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={bgStyle}>
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        <p className="font-semibold">{t('generatingQuiz')}</p>
      </div>
    );

    if (quizSubmitted) {
      const correct = quizQuestions.filter((q, i) => quizAnswers[i] === q.correct).length;
      const score = Math.round((correct / quizQuestions.length) * 100);
      return (
        <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8 rounded-3xl p-8" style={cardStyle}>
              <div className="text-5xl font-black mb-2 text-violet-400">{score}%</div>
              <p className="text-lg font-bold mb-1">{correct}/{quizQuestions.length} {t('correct')}</p>
              <p className="text-sm" style={mutedStyle}>{score >= 80 ? t('excellentWork') : score >= 60 ? t('goodEffort') : t('keepPracticing')}</p>
            </div>
            <div className="space-y-4 mb-6">
              {quizQuestions.map((q, i) => (
                <div key={i} className="rounded-3xl p-5" style={cardStyle}>
                  <p className="font-semibold text-sm mb-3">{i + 1}. <LatexRenderer text={q.question} /></p>
                  <div className="space-y-2">
                    {q.options.map((opt, j) => (
                      <div key={j} className={`px-4 py-2.5 rounded-xl text-sm ${j === q.correct ? "bg-emerald-500/20 text-emerald-400" : quizAnswers[i] === j && j !== q.correct ? "bg-red-500/20 text-red-400" : ""}`}
                        style={j !== q.correct && !(quizAnswers[i] === j) ? cardStyle : {}}><LatexRenderer text={opt} /></div>
                    ))}
                  </div>
                  {q.explanation && <p className="text-xs mt-3" style={mutedStyle}>{q.explanation}</p>}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={saveQuiz} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-violet-600/20 border border-violet-500/30 text-violet-400 transition-all hover:bg-violet-600/30">
                <BookmarkCheck className="w-4 h-4" /> {t('saveQuiz')}
              </button>
              <button onClick={() => setMode("menu")} className="flex-1 py-3 rounded-2xl font-semibold text-sm" style={cardStyle}>← {t('backToDeck')}</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setMode("menu")} className="text-sm font-medium" style={mutedStyle}>← {t('back')}</button>
            <span className="text-sm" style={mutedStyle}>{Object.keys(quizAnswers).length}/{quizQuestions.length} {t('answered')}</span>
          </div>
          <div className="space-y-4 mb-6">
            {quizQuestions.map((q, i) => (
              <div key={i} className="rounded-3xl p-5" style={cardStyle}>
                <p className="font-semibold text-sm mb-3">{i + 1}. <LatexRenderer text={q.question} /></p>
                <div className="space-y-2">
                  {q.options.map((opt, j) => (
                    <button key={j} onClick={() => setQuizAnswers(prev => ({ ...prev, [i]: j }))}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all ${quizAnswers[i] === j ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "hover:bg-white/[0.03]"}`}
                      style={{ borderColor: quizAnswers[i] === j ? "" : "var(--app-border)" }}>
                      <LatexRenderer text={opt} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < quizQuestions.length}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-4 rounded-2xl font-semibold transition-all">
            <Check className="w-4 h-4" /> {t('submitQuiz')}
          </button>
        </div>
      </div>
    );
  }

  // --- QUIZ COUNT PICKER ---
  if (showQuizCountPicker) {
    const presets = [5, 10, 15, 20, 25].filter(n => n < cards.length);
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
        <div className="max-w-sm w-full rounded-3xl p-8" style={cardStyle}>
          <h2 className="text-xl font-black mb-2">{t('quizSettings')}</h2>
          <p className="text-sm mb-6" style={mutedStyle}>{t('howManyQ')}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {presets.map(n => (
              <button key={n} onClick={() => setQuizCount(n)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-all ${quizCount === n ? "bg-violet-500/20 border-violet-500/50 text-violet-400" : ""}`}
                style={quizCount !== n ? { borderColor: "var(--app-border)" } : {}}>{n}</button>
            ))}
            <button onClick={() => setQuizCount(cards.length)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-all ${quizCount === cards.length ? "bg-violet-500/20 border-violet-500/50 text-violet-400" : ""}`}
              style={quizCount !== cards.length ? { borderColor: "var(--app-border)" } : {}}>
              {t('allCards')} ({cards.length})
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowQuizCountPicker(false)} className="flex-1 py-3 rounded-2xl font-semibold text-sm" style={cardStyle}>{t('cancel')}</button>
            <button onClick={startQuiz} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-2xl font-semibold text-sm transition-all">
              {t('startQuiz')} ({quizCount}q)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ADAPTIVE LEARN MODE ---
  if (adaptiveMode) return (
    <AdaptiveLearnMode cards={cards} deck={deck} user={user} onExit={() => setAdaptiveMode(false)} />
  );

  // --- AI TUTOR MODE ---
  if (showTutor) return (
    <DeckTutor deck={deck} cards={cards} user={user} onClose={() => setShowTutor(false)} />
  );

  // --- TEST SETUP ---
  if (showTestSetup) return (
    <TestSetup cards={cards} onCancel={() => setShowTestSetup(false)} onStart={(cfg) => { setTestConfig(cfg); setShowTestSetup(false); }} />
  );

  // --- TEST MODE ---
  if (testConfig) return (
    <TestMode cards={cards} deck={deck} user={user} config={testConfig} onExit={() => setTestConfig(null)} />
  );

  // --- MENU MODE ---
  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <DyslexiaToolbar onFontChange={(f, s) => { setDyslexiaFont(f); setDyslexiaSize(s); }} />
          <div className="flex gap-2">
            <button onClick={() => setShowTutor(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all">
              <span></span> {t('aiTutor')}
            </button>
            <FocusMode />
          </div>
        </div>

        <div className="flex items-start gap-4 mb-8">
          <DeckCoverPicker deck={deck} isAuthor={isAuthor} onUpdate={upd => setDeck(prev => ({ ...prev, ...upd }))} />
          
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              {isAuthor && editingDeckTitle ? (
                <div className="flex gap-2 items-center">
                  <input value={newDeckTitle} onChange={e => setNewDeckTitle(e.target.value)} className="flex-1 px-3 py-1.5 rounded-xl text-sm font-black outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} autoFocus />
                  <button onClick={saveDeckTitle} className="bg-violet-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"><Save className="w-3 h-3" />{t('save')}</button>
                  <button onClick={() => setEditingDeckTitle(false)} className="text-xs px-2 py-1.5 rounded-lg" style={cardStyle}>✕</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-black truncate">{deck?.title}</h1>
                  {isAuthor && <button onClick={() => { setNewDeckTitle(deck?.title || ""); setEditingDeckTitle(true); }} className="p-1 opacity-60 hover:opacity-100"><Edit3 className="w-3.5 h-3.5" /></button>}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 items-center mb-3">
              {isAuthor && editingFolder ? (
                <div className="flex gap-1 items-center">
                  <input value={folderName} onChange={e => setFolderName(e.target.value)} placeholder="Folder" className="px-2 py-1 rounded-lg text-xs outline-none w-28" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }} />
                  <button onClick={saveFolder} className="bg-amber-500 text-black px-2 py-1 rounded-lg text-xs font-bold"><Check className="w-3 h-3" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/5 px-2 py-1 rounded-lg border border-amber-500/10">
                  <Folder className="w-3.5 h-3.5" />
                  <span>{deck?.folder || "Unassigned"}</span>
                  {isAuthor && <button onClick={() => setEditingFolder(true)} className="opacity-60 hover:opacity-100 ml-0.5">✏️</button>}
                </div>
              )}

              {isAuthor && editingSubject ? (
                <div className="flex gap-1 items-center">
                  <input value={subjectName} onChange={e => setSubjectName(e.target.value)} placeholder="Subject" className="px-2 py-1 rounded-lg text-xs outline-none w-28" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }} />
                  <button onClick={saveSubject} className="bg-violet-600 text-white px-2 py-1 rounded-lg text-xs font-semibold"><Check className="w-3 h-3" /></button>
                </div>
              ) : deck?.subject && (
                <div className="flex items-center gap-1.5 text-xs text-violet-400 bg-violet-500/5 px-2 py-1 rounded-lg border border-violet-500/10">
                  <span>{deck.subject}</span>
                  {isAuthor && <button onClick={() => { setSubjectName(deck.subject || ""); setEditingSubject(true); }} className="opacity-60 hover:opacity-100 ml-0.5">✏️</button>}
                </div>
              )}

              {isAuthor && (
                <button onClick={toggleVisibility} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${deck.is_public ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/20" : "opacity-60 hover:opacity-100"}`} style={deck.is_public ? {} : cardStyle}>
                  {deck.is_public ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{deck.is_public ? "Public" : "Private"}</span>
                </button>
              )}

              {isTeacherOrAdmin && (
                <button onClick={toggleVerified} className={`text-xs px-2 py-1 rounded-lg border transition-all ${deck.is_verified ? "bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold" : "opacity-50 hover:opacity-100"}`} style={deck.is_verified ? {} : cardStyle}>
                  {deck.is_verified ? "✓ Verified District Deck" : "Verify Deck"}
                </button>
              )}

              {!isTeacherOrAdmin && deck.is_verified && (
                <div className="text-xs px-2 py-1 rounded-lg border bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold flex items-center gap-1">
                  <span>🛡️ Verified</span>
                </div>
              )}
              
              {!deck.is_verified && <VerifyRequestButton deck={deck} user={user} />}
            </div>

            {isAuthor && editingDesc ? (
              <div className="space-y-1.5 mt-2">
                <textarea value={descText} onChange={e => setDescText(e.target.value)} placeholder="Description notes..." rows={2} className="w-full px-3 py-2 rounded-xl text-xs outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
                <div className="flex gap-1.5">
                  <button onClick={saveDesc} className="bg-violet-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"><Save className="w-3 h-3" />Save Description</button>
                  <button onClick={() => setEditingDesc(false)} className="text-xs px-2 py-1 rounded-lg" style={cardStyle}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 mt-1.5">
                <p className="text-xs leading-relaxed max-w-md" style={mutedStyle}>{deck?.description || "No description provided."}</p>
                {isAuthor && <button onClick={() => { setDescText(deck?.description || ""); setEditingDesc(true); }} className="opacity-50 hover:opacity-100 text-xs mt-0.5">✏️</button>}
              </div>
            )}

            {deckRating && (
              <div className="text-xs mt-2 font-bold text-amber-400 flex items-center gap-1">
                <span>⭐ {deckRating.avg.toFixed(1)}</span>
                <span style={mutedStyle}>({deckRating.count} reviews)</span>
              </div>
            )}
            
            {deckTrending > 0 && (
              <div className="text-[11px] font-semibold text-violet-400 mt-1 flex items-center gap-1">
                <span>🔥 {deckTrending} sessions completed today</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel Menu Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button onClick={startFlashcards} disabled={cards.length === 0}
            className="flex flex-col items-center justify-center p-5 rounded-3xl transition-all border border-violet-500/10 bg-gradient-to-b from-violet-600/10 to-violet-600/5 hover:from-violet-600/20 text-center group disabled:opacity-40">
            <Brain className="w-7 h-7 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm text-white">{t('Flashcards')}</span>
            <span className="text-[11px] mt-0.5" style={mutedStyle}>{cards.length} {t('cards available')}</span>
          </button>

          <button onClick={startQuizFlow} disabled={cards.length < 3}
            className="flex flex-col items-center justify-center p-5 rounded-3xl transition-all border border-blue-500/10 bg-gradient-to-b from-blue-600/10 to-blue-600/5 hover:from-blue-600/20 text-center group disabled:opacity-40">
            <Target className="w-7 h-7 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm text-white">{t('Practice Quiz')}</span>
            <span className="text-[11px] mt-0.5" style={mutedStyle}>AI generated multiple choice</span>
          </button>

          <button onClick={() => setAdaptiveMode(true)} disabled={cards.length === 0}
            className="flex flex-col items-center justify-center p-4 rounded-3xl text-center transition-all hover:bg-white/[0.02] border disabled:opacity-40" style={cardStyle}>
            <Gamepad2 className="w-5 h-5 text-emerald-400 mb-1.5" />
            <span className="font-bold text-xs">Adaptive Learn</span>
            <span className="text-[10px] opacity-50">Spaced repetition flow</span>
          </button>

          <button onClick={() => setShowTestSetup(true)} disabled={cards.length === 0}
            className="flex flex-col items-center justify-center p-4 rounded-3xl text-center transition-all hover:bg-white/[0.02] border disabled:opacity-40" style={cardStyle}>
            <ClipboardList className="w-5 h-5 text-amber-400 mb-1.5" />
            <span className="font-bold text-xs">Exam Simulator</span>
            <span className="text-[10px] opacity-50">Custom testing setups</span>
          </button>

          <Link to={createPageUrl(`WriteMode?deck_id=${deckId}`)} className="contents">
            <div className="flex flex-col items-center gap-3 py-6 rounded-3xl font-semibold text-sm transition-all hover:opacity-90 cursor-pointer" style={cardStyle}>
              <PenLine className="w-7 h-7 text-pink-400" />{t('writeMode')}
            </div>
          </Link>

          <Link to={createPageUrl(`CheckpointMode?deck_id=${deckId}`)} className="contents">
            <div className="flex flex-col items-center gap-3 py-6 rounded-3xl font-semibold text-sm transition-all hover:opacity-90 cursor-pointer" style={cardStyle}>
              <Flag className="w-7 h-7 text-amber-400" />{t('checkpoint')}
            </div>
          </Link>
        </div>

        {/* Controls Option Checkbox Area */}
        {cards.length > 0 && (
          <div className="flex items-center gap-4 mb-6 px-4 py-2.5 rounded-2xl bg-black/10 border border-white/5 justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none text-white">
              <input type="checkbox" checked={shuffle} onChange={e => setShuffle(e.target.checked)} className="rounded accent-violet-600" />
              <Shuffle className="w-3.5 h-3.5 text-violet-400 inline" /> Shuffle decks order sequence
            </label>
          </div>
        )}

        {/* Saved Quizzes Secondary Shelf */}
        {savedQuizzes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-wider mb-3 opacity-60 flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-violet-400" /> Saved Session Quizzes ({savedQuizzes.length})
            </h3>
            <div className="space-y-2">
              {savedQuizzes.map((q) => (
                <div key={q.id || q._id} className="p-3 rounded-xl border flex items-center justify-between text-xs transition-all hover:border-white/10" style={cardStyle}>
                  <div>
                    <p className="font-bold text-white">{q.title}</p>
                    <p className="text-[10px] opacity-50">{(q.questions || []).length} questions · Last Score: {q.score || 0}%</p>
                  </div>
                  <button onClick={() => loadSavedQuiz(q)} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-all">Launch Quiz</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions / Drafts Management for Authors */}
        {isAuthor && cardDrafts.length > 0 && (
          <div className="mb-8 p-4 bg-violet-600/5 rounded-3xl border border-violet-500/20">
            <h3 className="text-xs font-black uppercase tracking-wider mb-3 text-violet-400 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4" /> Suggested Card Submissions ({cardDrafts.length})
            </h3>
            <div className="space-y-3">
              {cardDrafts.map((dr) => (
                <div key={dr.id || dr._id} className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                  <div className="text-xs">
                    <span className="font-bold text-white">Front:</span> <LatexRenderer text={dr.front} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white">Back:</span> <LatexRenderer text={dr.back} />
                  </div>
                  <p className="text-[10px]" style={mutedStyle}>Suggested by: {dr.submitter_name} ({dr.submitter_email})</p>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => approveDraft(dr)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1">✓ Approve</button>
                    <button onClick={() => rejectDraft(dr)} className="px-3 py-1 bg-white/5 hover:bg-red-500/20 text-red-400 text-[11px] font-medium rounded-lg">Dismiss</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Interactive Cards Collection Workspace Drawer */}
        <div className="border-t border-white/5 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white">{t('Cards', { count: cards.length })}</h3>
            
            {!addingCard && (
              <button onClick={() => setAddingCard(true)} className="flex items-center gap-1 text-xs font-bold text-violet-400 bg-violet-500/5 border border-violet-500/10 px-3 py-1.5 rounded-xl transition-all hover:bg-violet-500/10">
                <Plus className="w-3.5 h-3.5" /> {isAuthor ? t('Add Card') : "Suggest Card"}
              </button>
            )}
          </div>

          {addingCard && (
            <div className="rounded-2xl p-4 mb-4 space-y-3" style={cardStyle}>
              <h4 className="text-xs font-bold text-white">{isAuthor ? "Add New Flashcard" : "Suggest a Flashcard"}</h4>
              <input value={newFront} onChange={e => setNewFront(e.target.value)} placeholder={t('frontPlaceholder')} className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              <input value={newBack} onChange={e => setNewBack(e.target.value)} placeholder={t('backPlaceholder')} className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              
              {draftSubmitted && <p className="text-xs font-bold text-emerald-400">✓ Suggestion sent successfully to deck owner!</p>}
              
              <div className="flex gap-2">
                <button onClick={addCard} disabled={!newFront.trim() || !newBack.trim()} className="flex items-center gap-1 bg-violet-600 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <Plus className="w-3 h-3" /> {isAuthor ? t('addCardLabel') : "Submit Suggestion"}
                </button>
                <button onClick={() => setAddingCard(false)} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={cardStyle}>{t('cancel')}</button>
              </div>
            </div>
          )}

          {cards.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-black/10 border border-dashed border-white/5">
              <p className="text-xs" style={mutedStyle}>No flashcards present in this index pool stack yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((c, idx) => {
                const currentCardId = c.id || c._id;
                const cardIsAuthor = user && (c.created_by === user.email || c.author_email === user.email);
                
                return (
                  <div key={currentCardId || idx} className="rounded-2xl p-4 space-y-3 transition-all border border-white/5 hover:border-white/10" style={cardStyle}>
                    {editingCard && (editingCard.id === currentCardId || editingCard._id === currentCardId) ? (
                      <div className="space-y-3">
                        <input value={editFront} onChange={e => setEditFront(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-black/30 border border-white/10 outline-none text-white" />
                        <input value={editBack} onChange={e => setEditBack(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-black/30 border border-white/10 outline-none text-white" />
                        <div className="flex gap-1.5">
                          <button onClick={saveEdit} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"><Save className="w-3.5 h-3.5" />Save</button>
                          <button onClick={() => setEditingCard(null)} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={cardStyle}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 text-xs font-bold text-white space-y-1">
                            <div className="flex gap-2"><span className="opacity-40 select-none">Q:</span> <LatexRenderer text={c.front} /></div>
                            <div className="flex gap-2 text-violet-300 font-medium"><span className="opacity-40 text-white select-none">A:</span> <LatexRenderer text={c.back} /></div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <TTSButton text={`${c.front} ... Answer: ${c.back}`} />

                            {isAuthor || cardIsAuthor ? (
                              <>
                                <button onClick={() => { setEditingCard(c); setEditFront(c.front); setEditBack(c.back); }} className="p-1 opacity-50 hover:opacity-100 transition-opacity" title="Edit Card"><Edit3 className="w-3.5 h-3.5 text-blue-400" /></button>
                                <button onClick={() => deleteCard(currentCardId)} className="p-1 opacity-50 hover:opacity-100 transition-opacity" title="Delete Card"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                              </>
                            ) : (
                              <button onClick={() => setReportingCard(c)} className="p-1 opacity-40 hover:opacity-100 transition-opacity text-amber-400" title="Flag/Report Error"><Flag className="w-3.5 h-3.5" /></button>
                            )}
                          </div>
                        </div>

                        {/* Extended Description Metadata Layer for Flashcards */}
                        {(editingCardDesc === currentCardId) ? (
                          <div className="mt-2 space-y-2">
                            <textarea value={editDescText} onChange={e => setEditDescText(e.target.value)} placeholder="Context, hints, reference links..." rows={2} className="w-full px-3 py-1.5 rounded-xl text-[11px] bg-black/40 border border-white/10 outline-none text-white" />
                            <div className="flex gap-1">
                              <button onClick={() => saveCardDesc(currentCardId)} className="bg-violet-600 text-white px-2 py-1 rounded-md text-[10px] font-semibold">Save Info</button>
                              <button onClick={() => setEditingCardDesc(null)} className="text-[10px] px-2 py-1 rounded-md" style={cardStyle}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 pt-2 border-t border-white/[0.02] flex items-start gap-1">
                            <p className="text-[11px] italic opacity-60 flex-1">{c.description || "No additional information provided."}</p>
                            {(isAuthor || cardIsAuthor) && <button onClick={() => { setEditingCardDesc(currentCardId); setEditDescText(c.description || ""); }} className="text-[9px] px-1.5 py-0.5 rounded opacity-40 hover:opacity-100 bg-white/5">✏️ Info</button>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reporting / Flagging Context Modal View */}
                    {reportingCard && (reportingCard.id === currentCardId || reportingCard._id === currentCardId) && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                        <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Report issue with this flashcard:</p>
                        <input value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="e.g., Typo, Incorrect answer, Formatting broke" className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-black/40 border border-white/10 outline-none text-white font-medium" />
                        <div className="flex gap-1.5">
                          <button onClick={() => submitReport(c)} className="bg-amber-500 text-black px-2.5 py-1 rounded-md text-[10px] font-bold">Submit Report</button>
                          <button onClick={() => setReportingCard(null)} className="text-[10px] px-2.5 py-1 rounded-md text-white bg-white/5">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}