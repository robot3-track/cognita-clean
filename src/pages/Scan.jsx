import { db } from '@/lib/firebase';
import { useState, useRef, useEffect } from "react";
import { Camera, Upload, Sparkles, Loader2, X, BookOpen, Target, Brain, CheckCircle2, Globe, FileJson, Database, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { canUseAi, incrementAiUsage, getRemainingAiUses } from "../components/aiUsageLimit";
import { callAI } from "@/lib/lynxApi";

const ACTIONS = [
  { id: "flashcards", icon: Brain, label: "Create Flashcards", desc: "Generate study cards from content", color: "from-violet-500 to-purple-600" },
  { id: "quiz", icon: Target, label: "Make a Quiz", desc: "Turn material into practice questions", color: "from-blue-500 to-cyan-600" },
  { id: "summary", icon: BookOpen, label: "Summarize", desc: "Get a clean summary of notes", color: "from-emerald-500 to-teal-600" },
];

export default function Scan() {
  const [subTab, setSubTab] = useState("image"); // image | url | json | bulk | notes
  const [notesText, setNotesText] = useState("");
  const [notesCount, setNotesCount] = useState(10);
  const [notesProcessing, setNotesProcessing] = useState(false);
  const [notesSaved, setNotesSaved] = useState(null);
  const [notesDeckTitle, setNotesDeckTitle] = useState("");
  const [bulkTopic, setBulkTopic] = useState("");
  const [bulkCount, setBulkCount] = useState(20);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkSaved, setBulkSaved] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedAction, setSelectedAction] = useState("flashcards");
  const [flashcardCount, setFlashcardCount] = useState(10);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [savedDeck, setSavedDeck] = useState(null);
  const [savingDeck, setSavingDeck] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [limitError, setLimitError] = useState(null);
  const [deckCoverUrl, setDeckCoverUrl] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [importingJson, setImportingJson] = useState(false);
  const fileRef = useRef(null);
  const jsonRef = useRef(null);

  useEffect(() => {
    db.auth.me().then(u => setUserEmail(u?.email)).catch(() => {});
  }, []);

  // Helper utility executing file upload over local proxy route
  const executeLocalUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Upload request failed');
    return await response.json();
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

      // Assign the verified base64 string state matching your scan component code configuration
      setDeckCoverUrl(localBase64Url);
    } catch (err) {
      console.error("Image loading execution failed:", err);
      
      // Resilient inline fallback implementation
      try {
        const fallbackReader = new FileReader();
        fallbackReader.onloadend = () => {
          if (typeof fallbackReader.result === 'string') {
            setDeckCoverUrl(fallbackReader.result);
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

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setResult(null);
    setSavedDeck(null);
    
    // WORKAROUND: Read as local base64 instead of uploading to Firebase
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCapturedImage(ev.target.result);
      setUploading(false); // Done processing locally immediately
    };
    reader.readAsDataURL(file);
  };

  const handleJsonImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportingJson(true);
    const text = await file.text();
    const data = JSON.parse(text);
    const user = await db.auth.me();
    const deck = await db.entities.Deck.create({
      title: data.title || "Imported Deck",
      subject: data.subject || "",
      description: data.description || "",
      color: data.color || "#4F46E5",
      card_count: (data.cards || []).length,
      author_name: user.full_name || "",
      author_email: user.email || "",
    });
    if (data.cards?.length > 0) {
      await db.entities.Flashcard.bulkCreate(
        data.cards.map(c => ({ front: c.front, back: c.back, difficulty: c.difficulty || "medium", deck_id: deck.id, author_email: user.email }))
      );
    }
    setSavedDeck(deck);
    setImportingJson(false);
    e.target.value = "";
  };

  const processImage = async () => {
    if (!capturedImage) return; // Change from uploadedUrl to capturedImage
    if (!canUseAi(userEmail)) { setLimitError("You've reached your AI credit limit for today!"); return; }
    setLimitError(null);
    setProcessing(true);
    setResult(null);
    setSavedDeck(null);
    incrementAiUsage(userEmail);
    let prompt = "";
    if (selectedAction === "flashcards") {
      prompt = `Look at this image of study material and create ${flashcardCount} high-quality flashcards from the content.\nFormat each flashcard EXACTLY on its own line like:\n**Q:** [question] A: [answer]\nMake questions that test real understanding.`;
    } else if (selectedAction === "quiz") {
      prompt = `Look at this image of study material and create a 10-question multiple choice quiz.\nFormat as:\nQ1. [question]\nA) option  B) option  C) option  D) option\nAnswer: [correct option letter]\n[brief explanation]\n\nRepeat for each question.`;
    } else {
      prompt = `Look at this image of study material and provide a clear, comprehensive summary. Organize with bullet points and key takeaways.`;
    }
    
    // WORKAROUND: Pass the local base64 image data string directly to the AI
    const response = await callAI({ prompt, file_urls: [capturedImage], feature: "scan_image" });
    setResult(response);
    setProcessing(false);
    if (selectedAction === "flashcards") setDeckTitle("");
  };

  const processUrl = async () => {
    if (!websiteUrl.trim()) return;
    if (!canUseAi(userEmail)) { setLimitError("You've reached your AI credit limit for today!"); return; }
    setLimitError(null);
    setProcessing(true);
    setResult(null);
    setSavedDeck(null);
    incrementAiUsage(userEmail);

    const quizlet = websiteUrl.includes("quizlet.com");

    if (quizlet) {
      try {
        const conversation = await db.agents.createConversation({ agent_name: "quizlet_extractor" });

        let actionInstruction = "";
        if (selectedAction === "flashcards") {
          actionInstruction = `Extract up to ${flashcardCount} term-definition pairs and format each on its own line exactly as:\n**Q:** [term] A: [definition]`;
        } else if (selectedAction === "quiz") {
          actionInstruction = `Extract the terms and create a 10-question multiple choice quiz.\nFormat:\nQ1. [question]\nA) option  B) option  C) option  D) option\nAnswer: [correct letter]`;
        } else {
          actionInstruction = `List all the vocabulary terms and their definitions from this set.`;
        }

        const finalConversation = await db.agents.addMessage(conversation, {
          role: "user",
          content: `Quizlet URL: ${websiteUrl}\n\n${actionInstruction}`,
        });

        let poll = finalConversation;
        for (let i = 0; i < 30; i++) {
          await new Promise(r => setTimeout(r, 2000));
          poll = await db.agents.getConversation(finalConversation.id);
          const lastMsg = poll.messages?.[poll.messages.length - 1];
          if (lastMsg?.role === "assistant" && lastMsg?.content) break;
        }

        const lastMsg = poll.messages?.[poll.messages.length - 1];
        if (lastMsg?.content) {
          setResult(lastMsg.content);
          setProcessing(false);
          return;
        }
      } catch {}

      setResult("Could not load this Quizlet set. Try copying the terms manually and using the AI Bulk tab instead.");
      setProcessing(false);
      return;
    }

    let prompt = "";
    if (selectedAction === "flashcards") {
      prompt = `Search for the main core details at this URL and extract its data, then create ${flashcardCount} high-quality flashcards.\nURL: ${websiteUrl}\n\nFormat each flashcard EXACTLY on its own line like:\n**Q:** [question] A: [answer]`;
    } else if (selectedAction === "quiz") {
      prompt = `Search the page content at this URL: ${websiteUrl}\n\nExtract the data context, then create a 10-question multiple choice quiz.\n\nFormat as:\nQ1. [question]\nA) option  B) option  C) option  D) option\nAnswer: [correct option letter]`;
    } else {
      prompt = `Read the information available at this URL: ${websiteUrl}\n\nProvide a clear, comprehensive summary.`;
    }
    
    // Fixed: Stripped invalid 'add_context_from_internet' param to match callAI structure
    const response = await callAI({ prompt, feature: "scan_url" });
    setResult(response);
    setProcessing(false);
  };

  const saveAsFlashcards = async () => {
    if (!result) return;
    setSavingDeck(true);
    const lines = result.split("\n");
    const cards = [];
    for (const line of lines) {
      if (line.includes("**Q:**") || line.includes("Q:")) {
        const parts = line.split(/A:|Answer:/i);
        if (parts.length >= 2) {
          const front = parts[0].replace(/\*\*Q:\*\*|Q:/g, "").trim();
          const back = parts[1].replace(/\*\*/g, "").trim();
          if (front && back) cards.push({ front, back });
        }
      }
    }
    if (cards.length > 0) {
      const user = await db.auth.me();
      const finalTitle = deckTitle.trim() || (subTab === "url" ? "Website Material" : "Scanned Material");
      
      const deckData = {
        title: finalTitle,
        card_count: cards.length,
        author_name: user?.full_name || "",
        author_email: user?.email || "",
      };

      if (subTab === "url" && websiteUrl) {
        deckData.source_text = websiteUrl;
      }
      if (deckCoverUrl) {
        deckData.cover_image_url = deckCoverUrl;
      }

      // 1. Create the deck and ensure we capture the returned instance safely
      const deck = await db.entities.Deck.create(deckData);
      
      // CRITICAL FIX: Ensure deck exists and has a valid identifier (e.g., deck.id or deck._id)
      const targetDeckId = deck?.id || deck?._id;
      
      if (!targetDeckId) {
        console.error("Deck was created but no valid ID was returned by the database:", deck);
        setSavingDeck(false);
        return;
      }

      // 2. Bulk create the cards tied explicitly to that verified ID
      await db.entities.Flashcard.bulkCreate(
        cards.map(c => ({ 
          ...c, 
          deck_id: targetDeckId, 
          author_email: user?.email || "" 
        }))
      );

      // 3. Save the correct reference to state
      setSavedDeck(deck);

      // 4. IF YOU ARE NAVIGATING HERE, USE THE VERIFIED ID:
      // navigate(`/decks/${targetDeckId}`); 
    }
    setSavingDeck(false);
  };

  const reset = () => {
    setCapturedImage(null); setUploadedUrl(null); setResult(null); setSavedDeck(null);
    setWebsiteUrl(""); setDeckTitle(""); setDeckCoverUrl(null);
  };

  // Change !!uploadedUrl to !!capturedImage
  const canProcess = subTab === "image" ? !!capturedImage : !!websiteUrl.trim();

  const runBulkImport = async () => {
    if (!bulkTopic.trim()) return;
    if (!canUseAi(userEmail)) { setLimitError("You've reached your AI credit limit for today!"); return; }
    setLimitError(null);
    setBulkProcessing(true);
    setBulkSaved(null);
    incrementAiUsage(userEmail);
    
    // Fixed: Removed custom direct flag attributes to respect callAI's signature
    const resp = await callAI({
      prompt: `You are an expert educator. Create ${bulkCount} high-quality flashcards about the topic: "${bulkTopic}".\n\nUse your knowledge to construct accurate, up-to-date information about this topic.\n\nReturn a JSON object with:\n- "title": a good deck title\n- "cards": array of {"front": question/term, "back": answer/definition}\n\nMake the cards educational, accurate, and cover the topic comprehensively from basics to advanced.`,
      feature: "scan_bulk",
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          cards: { type: "array", items: { type: "object", properties: { front: { type: "string" }, back: { type: "string" } } } }
        }
      }
    });
    if (resp?.cards?.length > 0) {
      const user = await db.auth.me();
      const deck = await db.entities.Deck.create({
        title: resp.title || bulkTopic,
        card_count: resp.cards.length,
        author_name: user.full_name || "",
        author_email: user.email || "",
      });
      await db.entities.Flashcard.bulkCreate(resp.cards.map(c => ({ front: c.front, back: c.back, deck_id: deck.id, author_email: user.email })));
      setBulkSaved(deck);
    }
    setBulkProcessing(false);
  };

  const runNotesImport = async () => {
    if (!notesText.trim()) return;
    if (!canUseAi(userEmail)) { setLimitError("You've reached your AI credit limit for today!"); return; }
    setLimitError(null);
    setNotesProcessing(true);
    setNotesSaved(null);
    incrementAiUsage(userEmail);
    const resp = await callAI({
      prompt: `You are an expert educator. Read the following notes/text and create ${notesCount} high-quality flashcards from the content.\n\nNotes:\n${notesText}\n\nReturn a JSON object with:\n- "title": a concise deck title based on the notes\n- "cards": array of {"front": question or term, "back": answer or definition}\n\nMake cards that test real understanding of the material.`,
      feature: "scan_notes",
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          cards: { type: "array", items: { type: "object", properties: { front: { type: "string" }, back: { type: "string" } } } }
        }
      }
    });
    if (resp?.cards?.length > 0) {
      const user = await db.auth.me();
      const title = notesDeckTitle.trim() || resp.title || "My Notes";
      const deck = await db.entities.Deck.create({
        title,
        card_count: resp.cards.length,
        author_name: user.full_name || "",
        author_email: user.email || "",
        source_text: notesText.slice(0, 500),
      });
      await db.entities.Flashcard.bulkCreate(resp.cards.map(c => ({ front: c.front, back: c.back, deck_id: deck.id, author_email: user.email })));
      setNotesSaved(deck);
    }
    setNotesProcessing(false);
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-400 mb-4">
            <Camera className="w-3.5 h-3.5" />
            Scan & Learn
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Scan & Import</h1>
          <p className="text-sm" style={mutedStyle}>Scan images, URLs, or import JSON decks</p>
        </div>

        {/* Sub-tabs */}
        <div className="grid grid-cols-5 gap-1 p-1.5 rounded-2xl mb-6" style={cardStyle}>
          {[
            { id: "image", icon: Camera, label: "Image" },
            { id: "url", icon: Globe, label: "URL" },
            { id: "notes", icon: FileText, label: "Notes" },
            { id: "bulk", icon: Database, label: "AI Bulk" },
            { id: "json", icon: FileJson, label: "JSON" },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id}
              onClick={() => { setSubTab(id); reset(); setBulkSaved(null); setNotesSaved(null); }}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                subTab === id
                  ? id === "json" ? "bg-gradient-to-r from-emerald-600/60 to-teal-600/60 text-white border border-emerald-500/30"
                  : id === "bulk" ? "bg-gradient-to-r from-orange-600/60 to-amber-600/60 text-white border border-orange-500/30"
                  : id === "notes" ? "bg-gradient-to-r from-lime-600/60 to-green-600/60 text-white border border-lime-500/30"
                  : "bg-gradient-to-r from-violet-600/60 to-blue-600/60 text-white border border-violet-500/30"
                  : ""
              }`}
              style={subTab !== id ? mutedStyle : {}}
            >
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        {/* NOTES TAB */}
        {subTab === "notes" && (
          <div className="rounded-3xl p-6" style={cardStyle}>
            <div className="text-center mb-6">
              <FileText className="w-10 h-10 text-lime-400 mx-auto mb-3" />
              <h2 className="font-bold text-lg mb-1">Notes to Flashcards</h2>
              <p className="text-sm" style={mutedStyle}>Paste your notes or type anything, and AI will convert it into flashcards.</p>
            </div>
            {notesSaved ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <p className="font-bold text-center">{notesSaved.title} — {notesSaved.card_count} cards created!</p>
                <Link to={createPageUrl(`Study?deck_id=${notesSaved.id}`)}>
                  <button className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all">Study Now →</button>
                </Link>
                <button onClick={() => { setNotesSaved(null); setNotesText(""); setNotesDeckTitle(""); }} className="text-sm" style={mutedStyle}>Convert more notes</button>
              </div>
            ) : notesProcessing ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
                <p className="font-semibold">AI is converting your notes...</p>
                <p className="text-xs" style={mutedStyle}>This may take 10–20 seconds</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-2" style={mutedStyle}>Your Notes / Text</label>
                  <textarea
                    value={notesText}
                    onChange={e => setNotesText(e.target.value)}
                    placeholder="Paste your notes, textbook content, class notes, study material... anything you want to turn into flashcards."
                    rows={8}
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                    style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                  />
                  {notesText && <p className="text-xs mt-1 text-right" style={mutedStyle}>{notesText.length} characters</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-2" style={mutedStyle}>Deck Title (optional)</label>
                  <input
                    value={notesDeckTitle}
                    onChange={e => setNotesDeckTitle(e.target.value)}
                    placeholder="e.g. Chapter 5 Notes, Biology Exam Prep..."
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                    style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-2" style={mutedStyle}>Number of flashcards: {notesCount}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[5, 10, 15, 20, 30, 50].map(n => (
                      <button key={n} onClick={() => setNotesCount(n)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${notesCount === n ? "bg-lime-500/20 border-lime-500/50 text-lime-400" : ""}`}
                        style={notesCount !== n ? { borderColor: "var(--app-border)" } : {}}>{n}</button>
                    ))}
                  </div>
                  <input type="range" min={5} max={100} step={5} value={notesCount} onChange={e => setNotesCount(Number(e.target.value))} className="w-full" />
                </div>
                {limitError && <p className="text-red-400 text-sm font-medium">{limitError}</p>}
                <button
                  onClick={runNotesImport}
                  disabled={!notesText.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all disabled:opacity-40 bg-gradient-to-r from-lime-600 to-green-500 hover:from-lime-500 hover:to-green-400"
                >
                  <Sparkles className="w-5 h-5" /> Convert {notesCount} Cards from Notes
                </button>
                <p className="text-xs text-center" style={mutedStyle}>Uses 1 AI credit</p>
              </div>
            )}
          </div>
        )}

        {/* BULK AI IMPORT TAB */}
        {subTab === "bulk" && (
          <div className="rounded-3xl p-6" style={cardStyle}>
            <div className="text-center mb-6">
              <Database className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h2 className="font-bold text-lg mb-1">AI Bulk Import</h2>
              <p className="text-sm" style={mutedStyle}>Type any topic and AI will search the web to generate a complete flashcard deck.</p>
            </div>
            {bulkSaved ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <p className="font-bold text-center">{bulkSaved.title} — {bulkSaved.card_count} cards created!</p>
                <Link to={createPageUrl(`Study?deck_id=${bulkSaved.id}`)}>
                  <button className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all">Study Now →</button>
                </Link>
                <button onClick={() => { setBulkSaved(null); setBulkTopic(""); }} className="text-sm" style={mutedStyle}>Import another topic</button>
              </div>
            ) : bulkProcessing ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                <p className="font-semibold">AI is searching & generating cards...</p>
                <p className="text-xs" style={mutedStyle}>This may take 10-20 seconds</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-2" style={mutedStyle}>Topic / Subject</label>
                  <input
                    value={bulkTopic}
                    onChange={e => setBulkTopic(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && runBulkImport()}
                    placeholder="e.g. World War II, Photosynthesis, JavaScript basics..."
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                    style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-2" style={mutedStyle}>Number of cards: {bulkCount}</label>
                  <div className="flex flex-wrap gap-2">
                    {[10, 20, 30, 50].map(n => (
                      <button key={n} onClick={() => setBulkCount(n)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${bulkCount === n ? "bg-amber-500/20 border-amber-500/50 text-amber-400" : ""}`}
                        style={bulkCount !== n ? { borderColor: "var(--app-border)" } : {}}>{n}</button>
                    ))}
                  </div>
                </div>
                {limitError && <p className="text-red-400 text-sm font-medium">{limitError}</p>}
                <button
                  onClick={runBulkImport}
                  disabled={!bulkTopic.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all disabled:opacity-40 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400"
                >
                  <Sparkles className="w-5 h-5" /> Generate {bulkCount} Cards from Web
                </button>
                <p className="text-xs text-center" style={mutedStyle}>Uses 1 AI credit · searches the web for accurate info</p>
              </div>
            )}
          </div>
        )}

        {/* JSON TAB */}
        {subTab === "json" && (
          <div className="text-center py-10 rounded-3xl" style={cardStyle}>
            <FileJson className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="font-bold text-lg mb-2">Import JSON Deck</h2>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={mutedStyle}>
              Upload a .json deck file (exported from Cognita or compatible format). No AI needed — instant import!
            </p>
            {importingJson ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="text-sm font-medium">Importing deck...</p>
              </div>
            ) : savedDeck ? (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <p className="font-bold">Imported: {savedDeck.title}</p>
                <Link to={createPageUrl(`Study?deck_id=${savedDeck.id}`)}>
                  <button className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all">Study Now →</button>
                </Link>
                <button onClick={() => { setSavedDeck(null); }} className="text-sm" style={mutedStyle}>Import another</button>
              </div>
            ) : (
              <>
                <input ref={jsonRef} type="file" accept=".json" className="hidden" onChange={handleJsonImport} />
                <button onClick={() => jsonRef.current?.click()}
                  className="flex items-center gap-2 mx-auto px-8 py-4 rounded-2xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all">
                  <Upload className="w-5 h-5" /> Choose JSON File
                </button>
              </>
            )}
          </div>
        )}

        {/* IMAGE TAB */}
        {subTab === "image" && (
          <>
            {!capturedImage ? (
              <div onClick={() => fileRef.current?.click()}
                className="rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all mb-6 hover:border-violet-500/50"
                style={{ borderColor: "var(--app-border)", minHeight: 220 }}>
                {uploading ? (
                  <div className="flex flex-col items-center gap-3 px-6 text-center">
                    <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                    <p className="font-semibold text-sm">Uploading your image...</p>
                    <p className="text-xs" style={mutedStyle}>This may take a moment on mobile 📱</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 px-6 text-center">
                    <Camera className="w-10 h-10 opacity-30" />
                    <p className="font-semibold text-sm">Tap to upload image</p>
                    <p className="text-xs" style={mutedStyle}>Supports photos, screenshots, PDF pages</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden mb-6" style={cardStyle}>
                <img src={capturedImage} alt="Scanned material" className="w-full max-h-72 object-contain" />
                {uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 rounded-3xl">
                    <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
                    <p className="text-white text-sm font-semibold">Uploading...</p>
                  </div>
                )}
                {!uploading && (
                  <button onClick={reset} className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-colors flex items-center justify-center text-white/70 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />
          </>
        )}

        {/* URL TAB */}
        {subTab === "url" && !result && (
          <div className="mb-6">
            <div className="relative mb-4">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
              <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://quizlet.com/... or any webpage URL"
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none"
                style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
            </div>
            {websiteUrl.includes("quizlet.com") ? (
              <p className="text-xs text-violet-400 font-medium">✓ Quizlet detected — AI will extract terms from this specific set</p>
            ) : (
              <p className="text-xs" style={mutedStyle}>Paste any webpage URL — AI will read the content and create study material.</p>
            )}
          </div>
        )}

        {/* Action selection (image/url only) */}
        {subTab !== "json" && subTab !== "bulk" && subTab !== "notes" && canProcess && !processing && !result && (
          <div>
            <p className="text-sm font-semibold mb-3" style={mutedStyle}>What do you want to do with this?</p>
            <div className="grid grid-cols-1 gap-3 mb-4">
              {ACTIONS.map(action => (
                <button key={action.id} onClick={() => setSelectedAction(action.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selectedAction === action.id ? "border-violet-500/40 bg-violet-500/10" : "hover:bg-white/[0.03]"}`}
                  style={{ borderColor: selectedAction === action.id ? "" : "var(--app-border)" }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p className="text-xs" style={mutedStyle}>{action.desc}</p>
                  </div>
                  {selectedAction === action.id && <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" />}
                </button>
              ))}
            </div>
            {selectedAction === "flashcards" && (
              <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
                <p className="text-sm font-semibold mb-2" style={mutedStyle}>Number of flashcards (max 200)</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[5, 10, 20, 30, 50, 75, 100, 150, 200].map(n => (
                    <button key={n} onClick={() => setFlashcardCount(n)}
                      className={`px-3 py-1.5 rounded-xl font-semibold text-sm border transition-all ${flashcardCount === n ? "bg-violet-500/20 border-violet-500/50 text-violet-400" : ""}`}
                      style={flashcardCount !== n ? { borderColor: "var(--app-border)" } : {}}>{n}</button>
                  ))}
                </div>
                <input type="range" min={5} max={200} step={5} value={flashcardCount} onChange={e => setFlashcardCount(Number(e.target.value))} className="w-full" />
              </div>
            )}
            {limitError && <p className="text-red-400 text-sm text-center mb-2 font-medium">{limitError}</p>}
            {userEmail && getRemainingAiUses(userEmail) !== Infinity && (
              <p className="text-xs text-center mb-2" style={{ color: "var(--app-text-muted)" }}>
                {getRemainingAiUses(userEmail)} AI credits remaining today
              </p>
            )}
            <button onClick={subTab === "image" ? processImage : processUrl}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white py-4 rounded-2xl font-semibold transition-all">
              <Sparkles className="w-5 h-5" /> Process with AI
            </button>
          </div>
        )}

        {/* Processing */}
        {processing && subTab !== "notes" && (
          <div className="text-center py-16 rounded-3xl" style={cardStyle}>
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
            <p className="font-semibold mb-1">
              {websiteUrl.includes("quizlet.com") ? "Agent is fetching your Quizlet set..." : "Analyzing your material..."}
            </p>
            <p className="text-sm" style={mutedStyle}>
              {websiteUrl.includes("quizlet.com") ? "Searching the web for the exact set — may take 15–30s" : "This may take a few seconds"}
            </p>
          </div>
        )}

        {/* Result */}
        {result && subTab !== "notes" && (
          <div>
            <div className="rounded-3xl p-6 mb-4" style={cardStyle}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className="font-bold text-sm">AI Result</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={mutedStyle}>{result}</p>
              </div>
            </div>
            {selectedAction === "flashcards" && !savedDeck && (
              <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
                <p className="text-sm font-semibold mb-2" style={mutedStyle}>Name your flashcard deck</p>
                <input value={deckTitle} onChange={e => setDeckTitle(e.target.value)}
                  placeholder={subTab === "url" ? "Website Material" : "Scanned Material"}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none mb-3"
                  style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
                <p className="text-xs font-semibold mb-1.5" style={mutedStyle}>Cover Image (optional)</p>
                {deckCoverUrl ? (
                  <div className="flex items-center gap-2">
                    <img src={deckCoverUrl} alt="cover" className="h-14 rounded-xl object-cover" />
                    <button onClick={() => setDeckCoverUrl(null)} className="text-xs text-red-400 font-semibold">Remove</button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border w-fit hover:bg-violet-500/10 transition-all" style={{ borderColor: "var(--app-border)" }}>
                    {uploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploadingCover ? "Uploading..." : "Upload Cover"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              {selectedAction === "flashcards" && !savedDeck && (
                <button onClick={saveAsFlashcards} disabled={savingDeck}
                  className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-3 rounded-2xl font-semibold text-sm transition-all">
                  {savingDeck ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                  Save as Deck
                </button>
              )}
              {savedDeck && (
                <Link to={createPageUrl(`Study?deck_id=${savedDeck.id}`)} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-semibold text-sm transition-all">
                    <CheckCircle2 className="w-4 h-4" /> Study Now →
                  </button>
                </Link>
              )}
              <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all" style={cardStyle}>
                {subTab === "image" ? <><Camera className="w-4 h-4" /> Scan Another</> : <><Globe className="w-4 h-4" /> New URL</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}