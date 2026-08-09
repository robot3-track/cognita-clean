// src/pages/Media.jsx
import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import {
  Mic, Loader2, Play, Pause, Square, Trash2, Sparkles,
  Download, Search, Globe, Lock, Upload, Type, Layers,
  ChevronDown, ChevronUp, BookOpen, Wand2, X, CheckCircle2,
  AudioLines, Clapperboard, Info, MessageSquare, GraduationCap, Image as ImageIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { canUseAi, incrementAiUsage } from "../components/aiUsageLimit";
import { callAIForMedia, generateSceneImage, buildJson2VideoPayload, renderVideoWithJson2Video } from "../lib/lynxApi";
import { generateImageWithMistralFallbacks } from "../lib/mistralAPI";
import VideoPlayer from "../components/VideoPlayer";
import { useTranslation } from "../hooks/useTranslation";

const ENCODED_RESTRICTED_WORDS = [
  "bnNmdw==",     
  "bmFrZWQ=",       
  "bnVkZQ==",       
  "ZXhwbGljaXQ=",   
  "c2V4",         
  "cG9ybg==",     
  "Ymxvb2Q=",       
  "Z29yZQ==",      
  "a2lsbA==",      
  "dmlvbGVuY2U=",   
  "c3VpY2lkZQ==",  
  "c2VsZi1oYXJt",   
  "d2VhcG9u",       
  "ZHJ1Zw==",       
  "aWxsZWdhbA=="    
];

function checkPromptSafety(promptText) {
  if (!promptText) return { isSafe: true, matchedKeywords: [] };
  const normalized = promptText.toLowerCase();
  const matched = [];

  for (const encodedWord of ENCODED_RESTRICTED_WORDS) {
    try {
      const decodedWord = atob(encodedWord).toLowerCase();
      if (decodedWord && normalized.includes(decodedWord)) {
        matched.push(decodedWord);
      }
    } catch {}
  }

  return {
    isSafe: matched.length === 0,
    matchedKeywords: matched
  };
}

async function logFlaggedPrompt(prompt, matchedKeywords) {
  try {
    let userEmail = "";
    try { userEmail = (await db.auth.me())?.email || ""; } catch {}

    await db.entities.AIUsageLog.create({
      user_email: userEmail,
      provider: "mistral",
      feature: "image_generation_flagged",
      prompt_length: prompt?.length || 0,
      success: false,
      error: `FLAGGED_INAPPROPRIATE: Matched [${matchedKeywords.join(", ")}] in prompt: "${prompt}"`,
      created_date: new Date().toISOString()
    });
  } catch (err) {
    console.warn("Failed to log flagged prompt:", err);
  }
}

// ─── How It Works Steps ──────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    icon: BookOpen,
    title: "Add your material",
    desc: "Paste notes, upload a PDF/image, or pick a flashcard deck you already have.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Wand2,
    title: "AI builds your lesson",
    desc: "Cognita writes a structured script and generates a polished audio, video, or image lesson.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Play,
    title: "Play & share",
    desc: "Listen anywhere, download the script, or share your lesson with the community.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const PROMPTS_AUDIO = [
  "Explain the causes of World War I as a 5-minute podcast",
  "Summarize the key concepts of cellular respiration",
  "Break down Newton's three laws of motion for a beginner",
  "Give me a study guide audio for the US Constitution",
];

const PROMPTS_VIDEO = [
  "Create a video lesson on the water cycle with key visuals",
  "Explain photosynthesis step-by-step as a video",
  "Make a video covering the timeline of the Cold War",
  "Visual lesson on solving quadratic equations",
];

const PROMPTS_IMAGE = [
  "Generate an image of an apple",
  "Generate an image of a car",
  "Generate an image of a growing plant",
  "Generate an image of a stool",
];

export default function Media() {
  const { t } = useTranslation();
  const [mediaList, setMediaList] = useState([]);
  const [publicMedia, setPublicMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("audio"); // "audio", "video", "image"
  const [sourceText, setSourceText] = useState("");
  const [playing, setPlaying] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [limitError, setLimitError] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [tab, setTab] = useState("mine");
  const [search, setSearch] = useState("");
  const [sourceType, setSourceType] = useState("text");
  const [decks, setDecks] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [videoGenStatus, setVideoGenStatus] = useState("");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadMedia();
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  // Read URL params from Chat smart-navigate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt");
    const mediaType = params.get("type");
    if (prompt) {
      setShowForm(true);
      setSourceText(prompt);
      setTitle(prompt.slice(0, 60));
      setType(mediaType === "video" ? "video" : mediaType === "image" ? "image" : "audio");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const loadMedia = async () => {
    const me = await db.auth.me();
    const email = me?.email || "";
    setUserEmail(email);
    const [allMedia, myDecks] = await Promise.all([
      db.entities.GeneratedMedia.list("-created_date", 300).catch(() => []),
      db.entities.Deck.list("-updated_date", 100).catch(() => []),
    ]);
    const mine = allMedia.filter(m => m.created_by === email || m.created_by_id === email);
    const community = allMedia.filter(m => m.is_public);
    setMediaList(mine);
    setPublicMedia(community);
    setDecks(myDecks);
    setLoading(false);
  };

  const handleFileExtract = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setExtracting(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    const result = await db.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: { type: "object", properties: { content: { type: "string" } } },
    });
    setSourceText(result?.output?.content || "");
    setExtracting(false);
  };

  const loadDeckText = async (deckId) => {
    if (!deckId) return;
    setSelectedDeckId(deckId);
    const cards = await db.entities.Flashcard.filter({ deck_id: deckId }, "-created_date", 200);
    setSourceText(cards.map(c => `${c.front}: ${c.back}`).join("\n"));
  };

  const applyPrompt = (p) => {
    setTitle(p.slice(0, 80));
    setSourceText(p);
  };

  const createMedia = async () => {
    if (!title.trim() || !sourceText.trim()) return;

    // Moderate content for inappropriate keywords when generating images
    if (type === "image") {
      const combinedPrompt = `${title} ${sourceText}`;
      const safety = checkPromptSafety(combinedPrompt);

      if (!safety.isSafe) {
        await logFlaggedPrompt(sourceText, safety.matchedKeywords);
        setLimitError("Your prompt contains inappropriate or restricted keywords. This request has been flagged for review.");
        return;
      }
    }

    if (!canUseAi(userEmail)) {
      setLimitError("You've reached your daily AI uses. Come back tomorrow!");
      return;
    }
    setLimitError(null);
    incrementAiUsage(userEmail);
    setCreating(true);

    try {
      if (type === "audio") {
        const script = await callAIForMedia({
          prompt: `You are a knowledgeable tutor. Create a clear, engaging 5-minute audio narration script based on the following material. Write naturally for listening, with clear structure. Make it informative and educational:\n\n${sourceText}`,
          feature: "media_audio",
        });
        const media = await db.entities.GeneratedMedia.create({
          title: title.trim(), type: "audio", status: "ready", script,
          source_text: sourceText.trim(), is_public: isPublic,
        });
        setMediaList(prev => [media, ...prev]);
        if (isPublic) setPublicMedia(prev => [media, ...prev]);

      } else if (type === "image") {
        // ── IMAGE GENERATION ──
        setVideoGenStatus("🎨 Generating AI study diagram...");
        const imageUrl = await generateImageWithMistralFallbacks({
          prompt: `${title}: ${sourceText}`,
          feature: "media_image",
        });

        setVideoGenStatus("");

        const media = await db.entities.GeneratedMedia.create({
          title: title.trim(),
          type: "image",
          status: "ready",
          file_url: imageUrl,
          source_text: sourceText.trim(),
          script: `Prompt: ${sourceText.trim()}`,
          is_public: isPublic,
        });
        setMediaList(prev => [media, ...prev]);
        if (isPublic) setPublicMedia(prev => [media, ...prev]);

      } else {
        // ── VIDEO GENERATION ──
        setVideoGenStatus("✍️ Writing video script with AI...");
        const scriptData = await callAIForMedia({
          prompt: `Create a detailed educational video script about the following topic. Structure it with exactly 5 scenes.\n\nReturn JSON with:\n- "title": video title\n- "narration": full narration text\n- "scenes": array of 5 objects each with: "scene_number" (1-5), "duration" ("~1 minute"), "visual_description" (detailed description for image generation, no text in scene), "narration_segment" (spoken text, max 400 chars), "on_screen_text" (key text under 60 chars)\n\nMaterial:\n${sourceText}`,
          response_json_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              narration: { type: "string" },
              scenes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    scene_number: { type: "number" },
                    duration: { type: "string" },
                    visual_description: { type: "string" },
                    narration_segment: { type: "string" },
                    on_screen_text: { type: "string" },
                  },
                },
              },
            },
          },
          feature: "media_video",
        });

        const sceneList = scriptData?.scenes || [];
        const bgColors = ["#1a1a2e", "#16213e", "#0f3460", "#1b1f3b", "#12112e"];

        const fullScript = `[VIDEO: ${scriptData?.title || title}]\n\n${sceneList.map(s => `=== SCENE ${s.scene_number} ===\n[ON-SCREEN]: ${s.on_screen_text}\n[NARRATION]: ${s.narration_segment}\n`).join("\n")}\n--- FULL NARRATION ---\n${scriptData?.narration || ""}`;

        let finalFileUrl = null;
        let imageResults = [];
        try {
          setVideoGenStatus("🎬 Rendering video with JSON2Video (AI voice + scenes)...");
          const j2vPayload = buildJson2VideoPayload(scriptData, []);
          finalFileUrl = await renderVideoWithJson2Video(j2vPayload, (msg) => setVideoGenStatus(`🎬 ${msg}`));
        } catch (j2vErr) {
          console.warn("JSON2Video render failed:", j2vErr?.message);
          setVideoGenStatus("🎨 JSON2Video unavailable — generating scene images for slideshow...");
          imageResults = await Promise.all(
            sceneList.map(async (s, i) => {
              try {
                const imgPrompt = `Educational illustration, cinematic 16:9 landscape, no text or words: ${s.visual_description || s.on_screen_text || `Scene ${i + 1}`}. Clean, modern, vibrant colors, professional quality.`;
                const url = await generateSceneImage({ prompt: imgPrompt });
                return url || null;
              } catch {
                return null;
              }
            })
          );
          await new Promise(r => setTimeout(r, 500));
        }

        const slideshowScenes = sceneList.map((s, i) => ({
          scene_number: s.scene_number || i + 1,
          bg_color: bgColors[i % bgColors.length],
          image_url: imageResults[i] || null,
          on_screen_text: s.on_screen_text || `Scene ${i + 1}`,
          narration_segment: s.narration_segment || "",
          visual_description: s.visual_description || "",
        }));

        setVideoGenStatus("");

        const media = await db.entities.GeneratedMedia.create({
          title: title.trim(),
          type: "video",
          status: "ready",
          script: fullScript,
          source_text: sourceText.trim(),
          video_scenes_json: JSON.stringify(slideshowScenes),
          full_narration: scriptData?.narration || "",
          file_url: finalFileUrl || undefined,
          is_public: isPublic,
        });
        setMediaList(prev => [media, ...prev]);
        if (isPublic) setPublicMedia(prev => [media, ...prev]);
      }
    } catch (err) {
      console.error("Media generation error:", err);
      setVideoGenStatus("");
    } finally {
      setCreating(false);
    }
    setTitle(""); setSourceText(""); setIsPublic(false); setShowForm(false);
  };

  const playAudio = (item) => {
    if (!window.speechSynthesis) return;
    if (playing === item.id) { window.speechSynthesis.cancel(); setPlaying(null); return; }
    window.speechSynthesis.cancel();
    const text = item.full_narration || item.script || "";
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 5000));
    utterance.rate = 0.95; utterance.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Google US English") || v.lang === "en-US");
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => setPlaying(null);
    utterance.onerror = () => setPlaying(null);
    window.speechSynthesis.speak(utterance);
    setPlaying(item.id);
  };

  const downloadScript = (item) => {
    const blob = new Blob([item.script || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${item.title}_script.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const deleteMedia = async (id) => {
    setMediaList(prev => prev.filter(m => m.id !== id));
    await db.entities.GeneratedMedia.delete(id);
  };

  const togglePublic = async (item) => {
    const updated = await db.entities.GeneratedMedia.update(item.id, { is_public: !item.is_public });
    setMediaList(prev => prev.map(m => m.id === item.id ? updated : m));
    if (!item.is_public) setPublicMedia(prev => [updated, ...prev]);
    else setPublicMedia(prev => prev.filter(m => m.id !== item.id));
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };
  const filteredPublic = search.trim() ? publicMedia.filter(m => m.title?.toLowerCase().includes(search.toLowerCase())) : publicMedia;
  const displayList = tab === "mine" ? mediaList : filteredPublic;

  const renderMediaCard = (item, isOwner = false) => (
    <div key={item.id} className="rounded-3xl p-5" style={cardStyle}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.type === "audio" ? "bg-violet-500/15" : item.type === "image" ? "bg-emerald-500/15" : "bg-blue-500/15"}`}>
            {item.type === "audio" ? (
              <AudioLines className="w-5 h-5 text-violet-400" />
            ) : item.type === "image" ? (
              <ImageIcon className="w-5 h-5 text-emerald-400" />
            ) : (
              <Clapperboard className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">{item.title}</p>
            <p className="text-xs mt-0.5" style={mutedStyle}>
              {item.type === "audio" ? "Audio Lesson · ~5 min" : item.type === "image" ? "AI Study Image" : "Video Lesson · ~5 min"}
              {!isOwner && item.created_by && <span> · {item.created_by.split("@")[0]}</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-1 items-center shrink-0">
          {isOwner && (
            <button onClick={() => togglePublic(item)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${item.is_public ? "bg-emerald-500/20 text-emerald-400" : "opacity-40 hover:opacity-70"}`}
              style={item.is_public ? {} : { border: "1px solid var(--app-border)" }}>
              {item.is_public ? "Public" : "Private"}
            </button>
          )}
          {isOwner && item.script && (
            <button onClick={() => downloadScript(item)} className="p-2 rounded-xl opacity-30 hover:opacity-80 transition-all" title="Download script">
              <Download className="w-4 h-4" />
            </button>
          )}
          {isOwner && (
            <button onClick={() => deleteMedia(item.id)} className="p-2 rounded-xl opacity-30 hover:opacity-80 text-red-400 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Render Image */}
      {item.type === "image" && item.file_url && (
        <div className="rounded-2xl overflow-hidden mb-4 border border-white/10 bg-black/40 flex justify-center">
          <img
            src={item.file_url}
            alt={item.title}
            className="max-h-96 w-full object-contain"
          />
        </div>
      )}

      {/* Video player */}
      {item.type === "video" && item.file_url ? (
        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "#000" }}>
          <video
            src={item.file_url}
            controls
            playsInline
            className="w-full"
            style={{ maxHeight: 360, display: "block" }}
          />
        </div>
      ) : item.type === "video" ? (
        <VideoPlayer item={item} />
      ) : null}

      {/* Script preview */}
      {item.type !== "image" && item.script && (
        <>
          <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={mutedStyle}>
            {(item.full_narration || item.script).slice(0, 220)}…
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => playAudio(item)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${playing === item.id ? "bg-amber-500/20 text-amber-400" : "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25"}`}
            >
              {playing === item.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {playing === item.id ? "Pause" : "Play Narration"}
            </button>
            {playing === item.id && (
              <button onClick={() => { window.speechSynthesis?.cancel(); setPlaying(null); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                <Square className="w-3.5 h-3.5" /> Stop
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-28" style={bgStyle}>
      {/* ── Hero header ── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 60%, #0c0a1e 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 20%, #2563eb 0%, transparent 50%)" }} />
        <div className="relative max-w-2xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">AI Studio</h1>
              <p className="text-sm text-white/60">Turn your notes into audio, video, & image lessons</p>
            </div>
          </div>

          <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-md">
            Paste your study material, pick a deck, or upload a file — and Cognita generates polished media you can study anywhere.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setShowForm(true); setType("audio"); }}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <Mic className="w-4 h-4" /> Create Audio
            </button>
            <button
              onClick={() => { setShowForm(true); setType("video"); }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <Clapperboard className="w-4 h-4" /> Create Video
            </button>
            <button
              onClick={() => { setShowForm(true); setType("image"); }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <ImageIcon className="w-4 h-4" /> Generate Image
            </button>
            <Link to="/Chat">
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border border-white/20">
                <MessageSquare className="w-4 h-4" /> AI Chat
              </button>
            </Link>
            <button
              onClick={() => setShowHowItWorks(h => !h)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <Info className="w-4 h-4" /> How it works
              {showHowItWorks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* How it works expandable */}
          {showHowItWorks && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i} className="rounded-2xl p-4 bg-white/5 backdrop-blur border border-white/10">
                  <div className={`w-8 h-8 rounded-xl ${step.bg} flex items-center justify-center mb-3`}>
                    <step.icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* ── Creation form ── */}
        {showForm && (
          <div className="rounded-3xl p-6 mb-8" style={cardStyle}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-lg">New Lesson</h3>
              <button onClick={() => { setShowForm(false); setVideoGenStatus(""); }} className="p-2 rounded-xl opacity-40 hover:opacity-80 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2 mb-5 p-1 rounded-2xl" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
              {[
                { id: "audio", label: "Audio Lesson", icon: AudioLines, color: "bg-violet-600" },
                { id: "video", label: "Video Lesson", icon: Clapperboard, color: "bg-blue-600" },
                { id: "image", label: "AI Image", icon: ImageIcon, color: "bg-emerald-600" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setType(opt.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${type === opt.id ? `${opt.color} text-white` : "opacity-50 hover:opacity-80"}`}>
                  <opt.icon className="w-4 h-4" /> {opt.label}
                </button>
              ))}
            </div>

            {/* Prompt suggestions */}
            <div className="mb-4">
              <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={mutedStyle}>
                <Sparkles className="w-3 h-3" /> Try these prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {(type === "audio" ? PROMPTS_AUDIO : type === "image" ? PROMPTS_IMAGE : PROMPTS_VIDEO).map((p, i) => (
                  <button key={i} onClick={() => applyPrompt(p)}
                    className="text-xs px-3 py-1.5 rounded-xl transition-all hover:opacity-90 font-medium"
                    style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                    {p.length > 45 ? p.slice(0, 45) + "…" : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={type === "image" ? "Image Title (e.g. 'Human Heart Diagram')" : "Lesson title (e.g. 'The Water Cycle')"}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none mb-3"
              style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
            />

            {/* Source type tabs */}
            <div className="flex gap-1 mb-3 p-1 rounded-2xl" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
              {[
                ["text", "Paste Text", Type],
                ["file", "Upload File", Upload],
                ["deck", "From Deck", Layers],
              ].map(([id, label, Icon]) => (
                <button key={id}
                  onClick={() => { setSourceType(id); setSourceText(""); setSelectedDeckId(""); setUploadedFile(null); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${sourceType === id ? "bg-violet-600 text-white" : "opacity-50 hover:opacity-80"}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* Source inputs */}
            {sourceType === "text" && (
              <textarea
                value={sourceText}
                onChange={e => setSourceText(e.target.value)}
                placeholder={type === "audio"
                  ? "Paste your notes, a chapter summary, or describe what topic you want explained…"
                  : type === "image"
                  ? "Describe the diagram or image you want to generate in detail..."
                  : "Paste your study material, key concepts, or describe the video topic…"}
                rows={6}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none mb-3"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
              />
            )}

            {sourceType === "file" && (
              <div className="mb-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-violet-500/50 transition-all"
                  style={{ borderColor: "var(--app-border)" }}
                >
                  {extracting ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                      <p className="text-sm" style={mutedStyle}>Extracting text from file…</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <p className="text-sm font-semibold">{uploadedFile.name}</p>
                      <p className="text-xs text-emerald-400">{sourceText.length} characters extracted</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 opacity-30" />
                      <p className="text-sm font-semibold">Drop a file or click to browse</p>
                      <p className="text-xs" style={mutedStyle}>PDF, image, Word doc, or text file</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx" onChange={e => handleFileExtract(e.target.files[0])} />
                </div>
              </div>
            )}

            {sourceType === "deck" && (
              <div className="mb-3">
                <select
                  value={selectedDeckId}
                  onChange={e => loadDeckText(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none mb-2"
                  style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                >
                  <option value="">Choose one of your decks…</option>
                  {decks.map(d => <option key={d.id} value={d.id}>{d.title} ({d.card_count || 0} cards)</option>)}
                </select>
                {sourceText && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {sourceText.split("\n").length} cards loaded as source material
                  </div>
                )}
                {decks.length === 0 && (
                  <p className="text-xs" style={mutedStyle}>You don't have any decks yet. Create flashcards first!</p>
                )}
              </div>
            )}

            {/* Public toggle */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setIsPublic(p => !p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${isPublic ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "opacity-50 hover:opacity-80"}`}
                style={!isPublic ? { borderColor: "var(--app-border)" } : {}}
              >
                {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                {isPublic ? "Public" : "Private"}
              </button>
              <p className="text-xs" style={mutedStyle}>{isPublic ? "Others can discover & view this item" : "Only visible to you"}</p>
            </div>

            {/* Status / limit notices */}
            {videoGenStatus && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-3 bg-blue-500/10 text-blue-400 text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" /> {videoGenStatus}
              </div>
            )}
            {limitError && <p className="text-red-400 text-sm font-medium mb-3">{limitError}</p>}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setVideoGenStatus(""); }} className="flex-1 py-3 rounded-2xl text-sm font-semibold" style={cardStyle}>Cancel</button>
              <button
                onClick={createMedia}
                disabled={creating || !title.trim() || !sourceText.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 text-white py-3 rounded-2xl text-sm font-bold transition-all"
              >
                {creating
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> {type === "image" ? "Generating..." : type === "video" ? "Rendering…" : "Generating…"}</>
                  : <><Sparkles className="w-4 h-4" /> Generate {type === "audio" ? "Audio" : type === "image" ? "Image" : "Video"}</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "mine", label: "My Studio", icon: Lock },
            { id: "community", label: "Community", icon: Globe },
          ].map(t2 => (
            <button key={t2.id} onClick={() => setTab(t2.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t2.id ? "bg-violet-500/20 text-violet-400" : "opacity-50 hover:opacity-80"}`}
              style={tab !== t2.id ? cardStyle : {}}>
              <t2.icon className="w-3.5 h-3.5" /> {t2.label}
            </button>
          ))}
        </div>

        {/* Community search */}
        {tab === "community" && (
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search community lessons & study material…"
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
            />
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-20 rounded-3xl" style={cardStyle}>
            {tab === "mine" ? (
              <>
                <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>
                <p className="font-black text-lg mb-2">Your studio is empty</p>
                <p className="text-sm mb-6" style={mutedStyle}>Create your first audio, video, or image lesson from any study material.</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button onClick={() => { setShowForm(true); setType("audio"); }}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
                    <Mic className="w-4 h-4" /> Create Audio
                  </button>
                  <button onClick={() => { setShowForm(true); setType("video"); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
                    <Clapperboard className="w-4 h-4" /> Create Video
                  </button>
                  <button onClick={() => { setShowForm(true); setType("image"); }}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
                    <ImageIcon className="w-4 h-4" /> Generate Image
                  </button>
                </div>
              </>
            ) : (
              <>
                <Globe className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="font-semibold mb-1" style={mutedStyle}>No public lessons yet</p>
                <p className="text-sm" style={{ ...mutedStyle, opacity: 0.6 }}>Be the first to share one!</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayList.map(item => renderMediaCard(item, tab === "mine"))}
          </div>
        )}
      </div>
    </div>
  );
}
