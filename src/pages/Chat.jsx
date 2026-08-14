import { db } from '@/lib/firebase';
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { Link, useNavigate } from "react-router-dom";

import {
  Send, Plus, Trash2, MessageSquare, Loader2, Sparkles, ChevronLeft,
  Layers, Target, Code2, Mic, Paperclip, X,
  FolderOpen, Folder, Edit3, Check, ChevronDown, ChevronRight, Square, Volume2, MicOff
} from "lucide-react";
import ChatMessage from "../components/ChatMessage";
import { createPageUrl } from "@/utils";
import { canUseAi, incrementAiUsage, initAiCredits } from "../components/aiUsageLimit";
import { callAI } from "@/lib/lynxApi";
import { generateImageWithMistralFallbacks } from "@/lib/mistralAPI";

const COGNITA_SYSTEM_PROMPT_VOICE =
  "You are Cognita, a friendly AI study assistant in voice conversation mode. " +
  "Keep all responses short (1-3 sentences), conversational, and warm. " +
  "Do NOT use markdown, bullet points, or LaTeX — speak in plain natural language. " +
  "Be encouraging and helpful. If asked a complex question, give a brief answer and offer to go deeper.";

const ALL_SUGGESTIONS = [
  "Explain photosynthesis", "Help me with calculus", "Create 15 flashcards for WW2", "Quiz me on Python",
  "Summarize the French Revolution", "Explain Newton's laws", "Help me study for biology",
  "What is the Pythagorean theorem?", "Explain DNA replication", "Help with essay writing",
  "Explain supply and demand", "How does photosynthesis work?", "Create 20 flashcards for Spanish verbs",
  "Explain the water cycle", "Help with algebra", "Summarize Romeo and Juliet",
];

function getShuffledSuggestions() {
  const arr = [...ALL_SUGGESTIONS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 4);
}

// Helper to detect if prompt is asking for image generation
const isImageGenerationRequest = (text) => {
  const prompt = text.toLowerCase().trim();
  const imageKeywords = [
    "generate an image", "generate image", "generate an img", "generate img",
    "create an image", "create image", "create an img", "create img",
    "draw an image", "draw a picture", "draw", "draw a", "draw an",
    "make an image", "make a picture", "make an img",
    "paint a picture", "paint an image", "paint a",
    "generate a picture", "create a picture",
    "image of", "picture of", "photo of", "illustration of"
  ];

  return imageKeywords.some((keyword) => prompt.includes(keyword));
};

// Extract number of flashcards requested from user message
function extractCardCount(text) {
  const match = text.match(/\b(\d+)\s*(flash\s*cards?|cards?)\b/i) ||
    text.match(/\b(make|create|generate)\s+(\d+)\b/i);
  if (match) {
    const n = parseInt(match[1] || match[2]);
    if (n >= 1 && n <= 200) return n;
  }
  return 10; // default
}

/**
 * Recursively cleans properties with undefined values from an object or array
 * to prevent Firestore from crashing during updates.
 */
function sanitizeForFirestore(obj) {
  if (obj === undefined) return null;
  if (obj === null) return null;
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  
  return obj;
}

// ─── Image With Loading Spinner Component ──────────────────────────────────
function ChatImageWithLoader({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative my-3 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/20 flex justify-center items-center min-h-[220px]">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 backdrop-blur-sm z-10">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          <p className="text-xs text-violet-300 font-medium">Loading image...</p>
        </div>
      )}
      <img
        src={src}
        alt={alt || "Generated AI Image"}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          console.error("Image failed to load:", src);
        }}
        className={`w-full h-auto max-h-[450px] object-contain rounded-2xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default function Chat() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [folders, setFolders] = useState({}); // { folderName: [sessionId] }
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [user, setUser] = useState(null);
  const [limitError, setLimitError] = useState(null);
  const [converting, setConverting] = useState(false);
  const [smartActions, setSmartActions] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [suggestions] = useState(() => getShuffledSuggestions());
  const [attachedFiles, setAttachedFiles] = useState([]); // [{name, url}]
  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachedDecks, setAttachedDecks] = useState([]); // [{id, title, cards}]
  const [userDecks, setUserDecks] = useState([]);
  const [showDeckPicker, setShowDeckPicker] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [mode, setMode] = useState("chat"); // "chat" | "voice"
  const [isRecording, setIsRecording] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const dictationRef = useRef(null);
  const liveSpeechRef = useRef("");
  const navigate = useNavigate();

  // Synchronous execution lock and AbortController to fix double answering & allow cancellation
  const isGeneratingRef = useRef(false);
  const abortControllerRef = useRef(null);

  const detectSmartActions = (combinedText, userPrompt) => {
    const lower = combinedText.toLowerCase();
    const actions = {};
    if (/```[\w]*\n[\s\S]+?```/.test(combinedText)) actions.code = true;
    if (/\b(generate|create|make|produce)\b.{0,40}\b(audio|podcast|narration|recording)\b/.test(lower)) actions.audio = true;
    if (/\b(generate|create|make|produce)\b.{0,40}\b(video|lesson video)\b/.test(lower)) actions.video = true;
    if (/\b(flashcard|flash card|study card|term|definition)\b/.test(lower) ||
      /\b(make|create|generate)\b.{0,30}\b(flashcard|flash card|cards?)\b/.test(lower)) actions.flashcards = true;
    if (/\b(quiz|test|mcq|multiple choice)\b/.test(lower)) actions.quiz = true;
    if (Object.keys(actions).length > 0) return { ...actions, userPrompt };
    return null;
  };

  const handleSmartNavigate = (type, userPrompt) => {
    if (type === "code") navigate(createPageUrl("CodeSandbox") + `?prompt=${encodeURIComponent(userPrompt)}`);
    else {
      const mediaType = type === "video" ? "video" : "audio";
      navigate(createPageUrl("Media") + `?prompt=${encodeURIComponent(userPrompt)}&type=${mediaType}`);
    }
  };

  useEffect(() => {
    db.auth.me().then(u => {
      setUser(u);
      initAiCredits(u?.email);
      loadSessions(u);
    }).catch(() => {
      loadSessions(null);
    });

    // Load user decks for attachment
    db.entities.Deck.list("-updated_date", 50).then(d => setUserDecks(d)).catch(() => {});
    // Load folders from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("cognita_chat_folders") || "{}");
      setFolders(saved);
    } catch {}

    return () => {
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
      if (dictationRef.current) try { dictationRef.current.stop(); } catch {}
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveFolders = (newFolders) => {
    setFolders(newFolders);
    localStorage.setItem("cognita_chat_folders", JSON.stringify(newFolders));
  };

  // Filter session history privately per user
  const loadSessions = async (currentUser) => {
    setLoadingSessions(true);
    const u = currentUser || user || await db.auth.me().catch(() => null);
    const email = u?.email;

    let s = await db.entities.ChatSession.list("-updated_date", 100).catch(() => []);
    if (email) {
      s = s.filter(sess => sess.user_email === email || sess.created_by === email);
    } else {
      s = [];
    }

    setSessions(s);
    if (s.length > 0 && !activeSession) selectSession(s[0]);
    setLoadingSessions(false);
  };

  const selectSession = (session) => {
    if (isGeneratingRef.current) stopGeneration();
    if (isDictating && dictationRef.current) {
      try { dictationRef.current.stop(); } catch {}
      setIsDictating(false);
    }
    setActiveSession(session);
    setMessages(session.messages || []);
    setSmartActions(null);
    setAttachedFiles([]);
    setAttachedDecks([]);
  };

  const newChat = async () => {
    if (isGeneratingRef.current) stopGeneration();
    if (isDictating && dictationRef.current) {
      try { dictationRef.current.stop(); } catch {}
      setIsDictating(false);
    }

    const currentUser = user || await db.auth.me().catch(() => null);
    const email = currentUser?.email || "";

    const session = await db.entities.ChatSession.create({
      title: "New Chat",
      messages: [],
      user_email: email,
      created_by: email
    });
    setSessions(prev => [session, ...prev]);
    setActiveSession(session);
    setMessages([]);
    setSmartActions(null);
    setAttachedFiles([]);
    setAttachedDecks([]);
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSession?.id === id) { setActiveSession(null); setMessages([]); }
    await db.entities.ChatSession.delete(id);
    const newF = { ...folders };
    Object.keys(newF).forEach(k => { newF[k] = newF[k].filter(sid => sid !== id); });
    saveFolders(newF);
  };

  const startRename = (session, e) => {
    e.stopPropagation();
    setRenamingId(session.id);
    setRenameValue(session.title);
  };

  const submitRename = async (session) => {
    if (!renameValue.trim()) return;
    const safePayload = sanitizeForFirestore({ title: renameValue.trim() });
    await db.entities.ChatSession.update(session.id, safePayload);
    setSessions(prev => prev.map(s => s.id === session.id ? { ...s, title: renameValue.trim() } : s));
    if (activeSession?.id === session.id) setActiveSession(prev => ({ ...prev, title: renameValue.trim() }));
    setRenamingId(null);
  };

  const addToFolder = (sessionId, folderName) => {
    const newF = { ...folders };
    if (!newF[folderName]) newF[folderName] = [];
    if (!newF[folderName].includes(sessionId)) newF[folderName] = [...newF[folderName], sessionId];
    saveFolders(newF);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newF = { ...folders, [newFolderName.trim()]: [] };
    saveFolders(newF);
    setNewFolderName("");
    setShowFolderInput(false);
  };

  // File upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      setAttachedFiles(prev => [...prev, { name: file.name, url: file_url }]);
    } catch {}
    setUploadingFile(false);
    e.target.value = "";
  };

  // Attach deck
  const handleAttachDeck = async (deck) => {
    if (attachedDecks.find(d => d.id === deck.id)) { setShowDeckPicker(false); return; }
    const cards = await db.entities.Flashcard.filter({ deck_id: deck.id }, "-created_date", 50);
    setAttachedDecks(prev => [...prev, { id: deck.id, title: deck.title, cards }]);
    setShowDeckPicker(false);
  };

  // Build context from attachments
  const buildAttachmentContext = () => {
    let ctx = "";
    if (attachedDecks.length > 0) {
      attachedDecks.forEach(deck => {
        ctx += `\n\n[Attached Flashcard Deck: "${deck.title}"]\n`;
        deck.cards.slice(0, 40).forEach((c, i) => { ctx += `${i + 1}. Q: ${c.front} | A: ${c.back}\n`; });
      });
    }
    return ctx;
  };

  // Abruptly cancel AI request
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isGeneratingRef.current = false;
    setLoading(false);
    setConverting(false);
    setVoiceStatus("⏹️ Stopped by user.");
  };

  const sendMessage = async () => {
    if (isDictating && dictationRef.current) {
      try { dictationRef.current.stop(); } catch {}
      setIsDictating(false);
    }
    // Synchronous check prevents double answering race conditions
    if (isGeneratingRef.current || !input.trim() || loading) return;
    setLimitError(null);
    if (!canUseAi(user?.email)) { setLimitError("You've reached your AI uses for today. Come back tomorrow!"); return; }

    isGeneratingRef.current = true;
    setLoading(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const currentUser = user || await db.auth.me().catch(() => null);
    const email = currentUser?.email || "";

    let session = activeSession;
    if (!session) {
      session = await db.entities.ChatSession.create({
        title: input.slice(0, 40),
        messages: [],
        user_email: email,
        created_by: email
      });
      setSessions(prev => [session, ...prev]);
      setActiveSession(session);
    }

    const userPrompt = input.trim();
    const userMsg = { role: "user", content: userPrompt, files: attachedFiles.length > 0 ? attachedFiles : undefined };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    const currentFiles = [...attachedFiles];
    setAttachedFiles([]);
    setAttachedDecks([]);

    try {
      incrementAiUsage(user?.email);

      // --- Intercept image generation requests ---
      if (isImageGenerationRequest(userPrompt)) {
        const imageUrl = await generateImageWithMistralFallbacks({
          prompt: userPrompt,
          signal: abortController.signal
        });

        if (abortController.signal.aborted) return;

        const aiMsg = {
          role: "assistant",
          content: "Here is the image you requested:",
          imageUrl: imageUrl,
        };

        const finalMessages = [...newMessages, aiMsg];
        setMessages(finalMessages);

        const updatedTitle = session.title === "New Chat" ? userMsg.content.slice(0, 40) : session.title;
        const safePayload = sanitizeForFirestore({ messages: finalMessages, title: updatedTitle });
        const updated = await db.entities.ChatSession.update(session.id, safePayload);
        setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
        setActiveSession(updated);
        return;
      }

      // --- Standard Text / Chat Response ---
      const history = newMessages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
      const deckContext = buildAttachmentContext();
      const fileNote = currentFiles.length > 0 ? `\n\n[User attached ${currentFiles.length} file(s): ${currentFiles.map(f => f.name).join(", ")}]` : "";

      const response = await callAI({
        prompt: `Conversation history:\n${history}${deckContext}${fileNote}\n\nProvide a helpful, clear, and comprehensive response. Use standard LaTeX for math expressions ($...$ for inline or $$...$$ for block formulas). Use fenced code blocks for code snippets.`,
        feature: "chat",
        file_urls: currentFiles.length > 0 ? currentFiles.map(f => f.url) : undefined,
        signal: abortController.signal
      });

      if (abortController.signal.aborted) return;

      const aiMsg = { role: "assistant", content: response };
      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);
      const detected = detectSmartActions(response + " " + userMsg.content, userMsg.content);
      setSmartActions(detected);

      if (detected?.audio && !detected?.video) handleSmartNavigate("audio", userMsg.content);
      else if (detected?.video) handleSmartNavigate("video", userMsg.content);

      const updatedTitle = session.title === "New Chat" ? userMsg.content.slice(0, 40) : session.title;
      const safePayload = sanitizeForFirestore({ messages: finalMessages, title: updatedTitle });
      const updated = await db.entities.ChatSession.update(session.id, safePayload);
      setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
      setActiveSession(updated);
    } catch (err) {
      if (err.name === 'AbortError' || abortController.signal.aborted) {
        console.log("Request cancelled by user");
      } else {
        console.error("AI Error:", err);
      }
    } finally {
      isGeneratingRef.current = false;
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const convertToFlashcards = async (requestedCount = 10) => {
    if (messages.length === 0 || converting || isGeneratingRef.current) return;
    if (!canUseAi(user?.email)) { setLimitError("You've reached your AI uses for today."); return; }
    
    isGeneratingRef.current = true;
    setConverting(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      incrementAiUsage(user?.email);
      const history = messages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
      const lastUserMsg = messages.filter(m => m.role === "user").slice(-1)[0]?.content || "";
      const count = extractCardCount(lastUserMsg) || requestedCount;
      const resp = await callAI({
        prompt: `Based on this chat conversation, create exactly ${count} high-quality flashcards covering the key concepts discussed.\n\nConversation:\n${history}\n\nReturn JSON with a "cards" array, each card having "front" (question/term) and "back" (answer/explanation). Format math formulas with $...$ or $$...$$. Create exactly ${count} cards.`,
        feature: "chat_to_flashcards",
        response_json_schema: { type: "object", properties: { cards: { type: "array", items: { type: "object", properties: { front: { type: "string" }, back: { type: "string" } } } } } },
        signal: abortController.signal
      });
      if (abortController.signal.aborted) return;
      const cards = resp?.cards || [];
      if (cards.length > 0) {
        const deck = await db.entities.Deck.create({ title: `Chat: ${activeSession?.title || "Study Session"}`, card_count: cards.length, author_name: user?.full_name || "", author_email: user?.email || "" });
        await db.entities.Flashcard.bulkCreate(cards.map(c => ({ ...c, deck_id: deck.id })));
        navigate(createPageUrl(`Study?deck_id=${deck.id}`));
      }
    } catch (err) {
      if (err.name !== 'AbortError' && !abortController.signal.aborted) console.error(err);
    } finally {
      isGeneratingRef.current = false;
      setConverting(false);
      abortControllerRef.current = null;
    }
  };

  const convertToQuiz = async () => {
    if (messages.length === 0 || converting || isGeneratingRef.current) return;
    if (!canUseAi(user?.email)) { setLimitError("You've reached your AI uses for today."); return; }
    
    isGeneratingRef.current = true;
    setConverting(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      incrementAiUsage(user?.email);
      const history = messages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
      const resp = await callAI({
        prompt: `Based on this chat conversation, create a 10-question multiple choice quiz.\n\nConversation:\n${history}\n\nReturn JSON with a "questions" array. Each question: "question", "options" (4 strings), "correct" (index 0-3), "explanation". Use $...$ or $$...$$ for LaTeX math.`,
        feature: "chat_to_quiz",
        response_json_schema: { type: "object", properties: { questions: { type: "array", items: { type: "object", properties: { question: { type: "string" }, options: { type: "array", items: { type: "string" } }, correct: { type: "number" }, explanation: { type: "string" } } } } } },
        signal: abortController.signal
      });
      if (abortController.signal.aborted) return;
      const questions = resp?.questions || [];
      if (questions.length > 0) {
        await db.entities.Quiz.create({ title: `Chat Quiz: ${activeSession?.title || "Study Session"}`, questions: questions.map(q => ({ question: q.question, options: q.options, correct_answer: q.options[q.correct], explanation: q.explanation || "" })), completed: false, type: "multiple_choice" });
      }
      const aiMsg = { role: "assistant", content: `✅ Created a ${questions.length}-question quiz from our conversation! Find it in your Progress page.` };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      if (err.name !== 'AbortError' && !abortController.signal.aborted) console.error(err);
    } finally {
      isGeneratingRef.current = false;
      setConverting(false);
      abortControllerRef.current = null;
    }
  };

  // Toggle voice dictation directly into text input box
  const toggleDictation = () => {
    if (isDictating) {
      if (dictationRef.current) {
        try { dictationRef.current.stop(); } catch {}
        dictationRef.current = null;
      }
      setIsDictating(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice dictation is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      dictationRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let baseInput = input;
      
      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput((baseInput ? baseInput + " " : "") + transcript.trim());
      };

      recognition.onerror = () => {
        setIsDictating(false);
      };

      recognition.onend = () => {
        setIsDictating(false);
      };

      recognition.start();
      setIsDictating(true);
    } catch (err) {
      console.error("Could not start dictation:", err);
      setIsDictating(false);
    }
  };

  // Voice mode
  const startVoiceRecord = async () => {
    if (isRecording || isGeneratingRef.current) return;
    
    liveSpeechRef.current = "";
    setVoiceStatus("🎙️ Requesting microphone…");
    setIsRecording(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let hasWebSpeech = false;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let interimText = "";
          let finalText = "";
          for (let i = 0; i < event.results.length; i++) {
            const transcriptChunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalText += transcriptChunk + " ";
            } else {
              interimText += transcriptChunk;
            }
          }
          const currentTranscript = (finalText + interimText).trim();
          if (currentTranscript) {
            liveSpeechRef.current = currentTranscript;
            setVoiceStatus(`🎙️ Hearing: "${currentTranscript.slice(0, 50)}${currentTranscript.length > 50 ? '...' : ''}"`);
          }
        };

        recognition.start();
        hasWebSpeech = true;
        setVoiceStatus("🔴 Listening… release to send");
      } catch (err) {
        console.warn("Web Speech API fallback:", err);
      }
    }

    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioChunksRef.current = [];

        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";

        const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
        mediaRecorderRef.current = mr;
        mr.ondataavailable = e => { if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data); };
        mr.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          handleVoiceStopProcessing(mimeType || "audio/webm");
        };
        mr.start(100);
      } catch (err) {
        if (!hasWebSpeech) {
          setVoiceStatus("❌ Microphone permission error: " + err.message);
          setIsRecording(false);
        }
      }
    } else if (!hasWebSpeech) {
      setVoiceStatus("❌ Microphone not supported");
      setIsRecording(false);
    }
  };

  const stopVoiceRecord = () => {
    if (!isRecording) return;
    
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      handleVoiceStopProcessing("");
    }
  };

  const handleVoiceStopProcessing = async (mimeType) => {
    if (audioChunksRef.current.length === 0 && !liveSpeechRef.current) {
      setVoiceStatus("No audio captured. Try speaking again.");
      setIsRecording(false);
      return;
    }

    setVoiceStatus("⏳ Processing speech…");
    isGeneratingRef.current = true;
    setLoading(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let finalTranscript = liveSpeechRef.current.trim();

    if (!finalTranscript && audioChunksRef.current.length > 0) {
      try {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const { file_url } = await db.integrations.Core.UploadFile({ file: blob });
        if (abortController.signal.aborted) return;
        const resp = await db.integrations.Core.TranscribeAudio({ audio_url: file_url });
        
        let backendText = typeof resp === 'string' ? resp : (resp?.text || resp?.transcript || resp?.result || "");
        if (backendText) finalTranscript = backendText.trim();
      } catch (e) {
        console.warn("Server audio transcription fallback failed:", e);
      }
    }

    if (!finalTranscript) {
      setVoiceStatus("Could not understand audio. Try again.");
      isGeneratingRef.current = false;
      setLoading(false);
      setIsRecording(false);
      return;
    }

    setVoiceTranscript(finalTranscript);
    setVoiceStatus(`" ${finalTranscript} "`);

    const currentUser = user || await db.auth.me().catch(() => null);
    const email = currentUser?.email || "";

    let session = activeSession;
    if (!session) {
      session = await db.entities.ChatSession.create({
        title: "Voice Chat",
        messages: [],
        user_email: email,
        created_by: email
      });
      setSessions(prev => [session, ...prev]);
      setActiveSession(session);
    }

    const userMsg = { role: "user", content: finalTranscript, voice: true };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);

    try {
      incrementAiUsage(user?.email);
      const history = newMsgs.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
      const response = await callAI({
        prompt: `${history}\n\nRespond warmly, concisely, and conversationally. Keep your reply under 3 sentences when possible.`,
        feature: "voice_chat",
        systemPrompt: COGNITA_SYSTEM_PROMPT_VOICE,
        signal: abortController.signal
      });

      if (abortController.signal.aborted) return;

      const aiMsg = { role: "assistant", content: response, voice: true };
      const finalMsgs = [...newMsgs, aiMsg];
      setMessages(finalMsgs);
      setVoiceStatus("🔊 Speaking response…");

      try {
        const { url } = await db.integrations.Core.GenerateSpeech({ text: response.slice(0, 2000), voice: "river" });
        const audio = new Audio(url);
        audio.onended = () => setVoiceStatus("✅ Ready — hold mic to speak again");
        audio.onerror = () => speakFallback(response);
        await audio.play();
      } catch {
        speakFallback(response);
      }

      const safePayload = sanitizeForFirestore({
        messages: finalMsgs,
        title: session.title === "New Chat" || session.title === "Voice Chat" ? finalTranscript.slice(0, 40) : session.title,
      });
      await db.entities.ChatSession.update(session.id, safePayload);
      setSessions(prev => prev.map(s => s.id === session.id ? { ...s, messages: finalMsgs } : s));
    } catch (err) {
      if (err.name !== 'AbortError' && !abortController.signal.aborted) {
        console.error("Voice error:", err);
        setVoiceStatus("❌ Error: " + (err.message || "Unknown error"));
      }
    } finally {
      isGeneratingRef.current = false;
      setLoading(false);
      setIsRecording(false);
      abortControllerRef.current = null;
    }
  };

  const speakFallback = (text) => {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      const utt = new SpeechSynthesisUtterance(text.slice(0, 600));
      utt.rate = 0.95;
      utt.pitch = 1;
      const voices = synth.getVoices();
      const preferred = voices.find(v => v.lang?.startsWith("en") && v.name.includes("Female")) || voices.find(v => v.lang?.startsWith("en"));
      if (preferred) utt.voice = preferred;
      utt.onend = () => setVoiceStatus("✅ Ready — hold mic to speak again");
      synth.speak(utt);
    }
  };

  const sessionItem = (s, inDrawer = false) => (
    <div
      key={s.id}
      onClick={() => { selectSession(s); if (inDrawer) setMobileDrawerOpen(false); }}
      className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${activeSession?.id === s.id ? "bg-violet-600/20 border border-violet-500/30 text-violet-300 font-semibold" : "hover:bg-white/5 opacity-70 hover:opacity-100"}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <MessageSquare className="w-4 h-4 shrink-0" />
        {renamingId === s.id ? (
          <input
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitRename(s)}
            onClick={e => e.stopPropagation()}
            autoFocus
            className="bg-black/30 text-xs px-2 py-1 rounded border border-violet-500/50 outline-none w-full text-white"
          />
        ) : (
          <span className="text-xs truncate">{s.title || "Untitled Chat"}</span>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
        <button onClick={e => startRename(s, e)} className="text-violet-400/70 hover:text-violet-400 p-1"><Edit3 className="w-3 h-3" /></button>
        <button onClick={e => deleteSession(s.id, e)} className="text-red-400/70 hover:text-red-400 p-1"><Trash2 className="w-3 h-3" /></button>
      </div>
    </div>
  );

  const sidebarContent = (inDrawer = false) => (
    <>
      <div className="p-4 border-b space-y-2.5" style={{ borderColor: "var(--app-border)" }}>
        {!inDrawer && (
          <Link to={createPageUrl("Home")}>
            <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium opacity-60 hover:opacity-100 transition-all" style={{ color: "var(--app-text)" }}>
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
            </button>
          </Link>
        )}
        <button onClick={() => { newChat(); if (inDrawer) setMobileDrawerOpen(false); }} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white px-4 py-3 rounded-2xl font-semibold text-sm transition-all shadow-md shadow-violet-900/20">
          <Plus className="w-4 h-4" /> {t('newChat') || "New Chat"}
        </button>

        {showFolderInput ? (
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => e.key === "Enter" && createFolder()} placeholder="Folder name…" className="flex-1 bg-transparent text-xs outline-none px-2" />
            <button onClick={createFolder} className="text-violet-400 p-1 hover:bg-white/10 rounded-lg shrink-0"><Check className="w-3.5 h-3.5" /></button>
            <button onClick={() => setShowFolderInput(false)} className="opacity-50 p-1 hover:bg-white/10 rounded-lg shrink-0"><X className="w-3.5 h-3.5" /></button>
          </div>
        ) : (
          <button onClick={() => setShowFolderInput(true)} className="w-full flex items-center justify-center gap-1.5 border border-white/10 hover:bg-white/5 px-3 py-2 rounded-xl text-xs opacity-70 transition-all">
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" /> New Folder
          </button>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="p-3 border-b" style={{ borderColor: "var(--app-border)" }}>
        <div className="flex bg-black/20 p-1 rounded-2xl border border-white/5">
          <button onClick={() => setMode("chat")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${mode === "chat" ? "bg-violet-600 text-white shadow-md" : "opacity-60 hover:opacity-100"}`}>
            <MessageSquare className="w-3.5 h-3.5" /> Text
          </button>
          <button onClick={() => setMode("voice")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${mode === "voice" ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md" : "opacity-60 hover:opacity-100"}`}>
            <Mic className="w-3.5 h-3.5" /> Voice
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {loadingSessions ? (
          <div className="flex items-center justify-center py-8 text-xs opacity-40"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-xs opacity-40">No chat history yet</div>
        ) : (
          <>
            {/* Folder list */}
            {Object.keys(folders).map(folderName => {
              const folderSessionIds = folders[folderName] || [];
              const isExpanded = expandedFolders[folderName];
              const folderSessions = sessions.filter(s => folderSessionIds.includes(s.id));
              return (
                <div key={folderName} className="mb-2">
                  <div onClick={() => setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }))} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer text-xs font-bold text-amber-400/90">
                    <div className="flex items-center gap-2 truncate">
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{folderName}</span>
                      <span className="text-[10px] opacity-50">({folderSessions.length})</span>
                    </div>
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </div>
                  {isExpanded && (
                    <div className="pl-3 space-y-1 border-l border-amber-500/20 ml-3 my-1">
                      {folderSessions.map(s => sessionItem(s, inDrawer))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Unassigned sessions */}
            {sessions.filter(s => !Object.values(folders).flat().includes(s.id)).map(s => (
              <div key={s.id} className="relative group/item">
                <div className="flex items-center gap-0.5">
                  <div className="flex-1 min-w-0">{sessionItem(s, inDrawer)}</div>
                  {Object.keys(folders).length > 0 && (
                    <div className="opacity-0 group-hover/item:opacity-100 transition-all flex flex-col gap-0.5 pr-1 shrink-0">
                      {Object.keys(folders).map(fn => (
                        <button key={fn} onClick={e => { e.stopPropagation(); addToFolder(s.id, fn); }} title={`Move to ${fn}`} className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/30 border border-amber-500/20 transition-all truncate max-w-[54px]">
                          📁 {fn}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="flex" style={{ height: "calc(100dvh - 60px)", background: "var(--app-bg)", color: "var(--app-text)" }}>
      {/* Sidebar desktop */}
      <div className="w-64 hidden md:flex flex-col shrink-0 border-r" style={{ borderColor: "var(--app-border)", background: "var(--app-surface)" }}>
        {sidebarContent(false)}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-20 blur-[100px]" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 100%)" }} />

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b shrink-0 relative z-10" style={{ borderColor: "var(--app-border)", background: "var(--app-surface)" }}>
          <div className="flex items-center gap-2.5">
            <button onClick={() => setMobileDrawerOpen(true)} className="flex items-center justify-center rounded-xl p-2 bg-white/5 border border-white/10">
              <MessageSquare className="w-4 h-4 text-violet-400" />
            </button>
            <span className="font-bold text-sm truncate max-w-[150px]">{activeSession?.title || "Cognita AI"}</span>
          </div>
          <button onClick={newChat} className="bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-xl text-xs flex items-center gap-1 font-semibold transition-all">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm">
            <div className="w-72 h-full flex flex-col border-r" style={{ background: "var(--app-surface)", borderColor: "var(--app-border)" }}>
              <div className="p-3 border-b flex justify-between items-center" style={{ borderColor: "var(--app-border)" }}>
                <span className="font-bold text-sm">Chats & Folders</span>
                <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
              </div>
              {sidebarContent(true)}
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
          </div>
        )}

        {/* Limit error alert */}
        {limitError && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between shrink-0 relative z-20">
            <span>{limitError}</span>
            <button onClick={() => setLimitError(null)} className="ml-2 hover:opacity-100 opacity-60"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* VOICE MODE UI */}
        {mode === "voice" ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative z-10 max-w-3xl mx-auto w-full">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-500 flex items-center justify-center mb-6 shadow-2xl shadow-violet-900/50 animate-pulse">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Voice Conversation Mode</h2>
                  <p className="text-sm max-w-xs opacity-60 leading-relaxed">Press and hold the mic to speak. Cognita will listen and answer smoothly.</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-3`}>
                  {msg.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/30">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-5 py-3.5 text-sm rounded-3xl ${msg.role === "user" ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-sm shadow-md" : "border rounded-bl-sm shadow-sm"}`} style={msg.role !== "user" ? { background: "var(--app-surface)", borderColor: "var(--app-border)" } : {}}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Voice controls */}
            <div className="p-6 border-t flex flex-col items-center justify-center gap-4 shrink-0 relative z-20" style={{ borderColor: "var(--app-border)", background: "var(--app-surface)" }}>
              {voiceStatus && <p className="text-xs font-semibold text-violet-300 text-center animate-fade-in">{voiceStatus}</p>}
              <div className="flex items-center gap-4">
                <button
                  onMouseDown={startVoiceRecord}
                  onMouseUp={stopVoiceRecord}
                  onTouchStart={startVoiceRecord}
                  onTouchEnd={stopVoiceRecord}
                  disabled={loading}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${isRecording ? "bg-red-500 scale-110 shadow-red-900/50 animate-pulse" : "bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 hover:scale-105 shadow-violet-900/40 text-white"}`}
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
              </div>
              <p className="text-[11px] opacity-40">Hold button to speak, release to send</p>
            </div>
          </div>
        ) : (
          /* CHAT TEXT MODE UI */
          <>
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 relative z-10 max-w-4xl mx-auto w-full">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-2xl shadow-violet-900/50">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                    Hi {user?.full_name?.split(' ')[0] || 'there'}, what are we studying?
                  </h2>
                  <p className="text-sm md:text-base max-w-md opacity-60 mb-8 leading-relaxed">
                    {t('askCognitaDesc') || "Ask complex questions, summarize notes, solve problems, or create custom flashcard decks."}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-xl">
                    {suggestions.map(s => (
                      <button key={s} onClick={() => setInput(s)} className="px-4 py-2 rounded-full text-xs md:text-sm font-medium border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all shadow-sm">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-3`}>
                  {msg.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/30 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[85%] md:max-w-[80%] px-5 py-4 text-sm md:text-base leading-relaxed ${msg.role === "user" ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white rounded-3xl rounded-br-sm shadow-md" : "rounded-3xl rounded-bl-sm border shadow-sm"}`} style={msg.role !== "user" ? { background: "var(--app-surface)", borderColor: "var(--app-border)" } : {}}>
                    
                    {/* User Attached Files */}
                    {msg.files && msg.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3 pb-2 border-b border-white/20">
                        {msg.files.map((f, fi) => (
                          <div key={fi} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-black/20 text-white/90">
                            <Paperclip className="w-3 h-3" /> {f.name}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Generated Image rendering */}
                    {msg.imageUrl ? (
                      <div>
                        <p className="mb-2 font-medium">{msg.content}</p>
                        <ChatImageWithLoader src={msg.imageUrl} alt="Generated AI visual content" />
                      </div>
                    ) : msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <ChatMessage content={msg.content} />
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/30">
                    <Sparkles className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="p-4 rounded-3xl border text-xs flex items-center gap-2 opacity-70" style={{ background: "var(--app-surface)", borderColor: "var(--app-border)" }}>
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" /> Thinking & generating response...
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar section */}
            <div className="p-4 border-t relative z-20 max-w-4xl mx-auto w-full" style={{ borderColor: "var(--app-border)" }}>
              {/* Deck picker modal */}
              {showDeckPicker && (
                <div className="absolute bottom-full mb-2 left-4 right-4 p-3 rounded-2xl bg-black/90 border border-white/20 shadow-2xl backdrop-blur-xl max-h-48 overflow-y-auto space-y-1 z-30">
                  <div className="flex justify-between items-center mb-2 px-1 text-xs font-bold opacity-60">
                    <span>Select deck to attach</span>
                    <button onClick={() => setShowDeckPicker(false)}><X className="w-3.5 h-3.5" /></button>
                  </div>
                  {userDecks.length === 0 ? (
                    <div className="text-xs opacity-40 p-2">No decks found</div>
                  ) : (
                    userDecks.map(deck => (
                      <div key={deck.id} onClick={() => handleAttachDeck(deck)} className="p-2 rounded-xl hover:bg-white/10 cursor-pointer text-xs flex items-center justify-between transition-all">
                        <span className="font-semibold truncate">{deck.title}</span>
                        <span className="text-[10px] opacity-50 shrink-0">{deck.card_count || 0} cards</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Attachments pills */}
              {(attachedFiles.length > 0 || attachedDecks.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-2 px-1">
                  {attachedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-sm">
                      <Paperclip className="w-3.5 h-3.5" /> {f.name}
                      <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} className="hover:text-white ml-1"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  {attachedDecks.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm">
                      <Layers className="w-3.5 h-3.5" /> {d.title} ({d.cards.length} cards)
                      <button onClick={() => setAttachedDecks(prev => prev.filter((_, j) => j !== i))} className="hover:text-white ml-1"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* Smart action buttons */}
              {messages.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 px-1">
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => convertToFlashcards()} disabled={converting || loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-all shadow-sm">
                      {converting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />} Create Flashcards
                    </button>
                    <button onClick={() => convertToQuiz()} disabled={converting || loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all shadow-sm">
                      {converting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />} Generate Quiz
                    </button>
                  </div>
                </div>
              )}

              {/* Main input card */}
              <div
                className={`rounded-3xl border p-2 flex items-end gap-2 transition-all ${isDictating ? "border-red-500/50 ring-2 ring-red-500/20" : "focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/10"}`}
                style={{ background: "var(--app-surface)", borderColor: isDictating ? undefined : "var(--app-border)" }}
              >
                <input ref={fileInputRef} type="file" accept="image/*,.pdf,.txt,.docx" className="hidden" onChange={handleFileUpload} />

                <div className="flex items-center gap-1 pb-1">
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploadingFile} title="Attach file" className="p-2 rounded-full hover:bg-white/5 opacity-60 hover:opacity-100 transition-all text-violet-300">
                    {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setShowDeckPicker(prev => !prev)} title="Attach flashcard deck" className="p-2 rounded-full hover:bg-white/5 opacity-60 hover:opacity-100 transition-all text-blue-300">
                    <Layers className="w-4 h-4" />
                  </button>
                  <button onClick={toggleDictation} title={isDictating ? "Stop voice dictation" : "Voice dictation"} className={`p-2 rounded-full transition-all ${isDictating ? "bg-red-500/20 text-red-400 animate-pulse" : "hover:bg-white/5 opacity-60 hover:opacity-100 text-amber-300"}`}>
                    {isDictating ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={isDictating ? "Listening... speak now..." : "Ask Cognita anything..."}
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none resize-none py-2.5 px-1 leading-relaxed max-h-32 placeholder:opacity-40 font-normal"
                  style={{ color: "var(--app-text)" }}
                />

                <div className="pb-1">
                  {loading || converting ? (
                    <button
                      onClick={stopGeneration}
                      title="Stop generating"
                      className="flex items-center gap-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 px-3.5 py-2 rounded-full text-xs font-semibold transition-all animate-pulse shrink-0"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" /> Stop
                    </button>
                  ) : (
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || loading}
                      className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-30 text-white p-2.5 rounded-full transition-all shadow-md shadow-violet-900/30 shrink-0 flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-center opacity-40 mt-2 font-medium">Cognita AI can make mistakes. Verify important study details.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
