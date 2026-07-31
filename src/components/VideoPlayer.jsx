import { useState, useRef, useEffect } from "react";
import { Play, Pause, Square, ChevronLeft, ChevronRight, Download, Loader2, Video } from "lucide-react";

function parseSceneNarrations(script) {
  if (!script) return [];
  const segments = [];
  const parts = script.split(/=== SCENE \d+/);
  for (let i = 1; i < parts.length; i++) {
    const narMatch = parts[i].match(/\[NARRATION\]:\s*([\s\S]*?)(?:===|---|$)/);
    segments.push(narMatch ? narMatch[1].trim() : "");
  }
  return segments;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = test;
    }
  }
  if (line.trim()) lines.push(line.trim());
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return lines.length;
}

async function loadImage(url) {
  return new Promise((res) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = url;
  });
}

function isVideoUrl(url) {
  if (!url) return false;
  return url.startsWith("data:video/") || url.includes(".mp4") || url.includes(".webm") || url.includes("videoUri") || url.includes("gcsUri");
}

function isImageUrl(url) {
  if (!url) return false;
  // Accept data URLs, common extensions, AND Base44/CDN URLs (which may not have extensions)
  return url.startsWith("data:image/") || url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg") || url.includes(".webp") || url.startsWith("https://");
}

function drawOverlays(ctx, sceneNumber, totalScenes, onScreenText, narText, progress, W, H) {
  const grad = ctx.createLinearGradient(0, H * 0.55, 0, H);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.88)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, H * 0.55, W, H * 0.45);

  const alpha = Math.min(1, progress * 3);
  ctx.fillStyle = `rgba(99,102,241,${0.85 * alpha})`;
  ctx.fillRect(24, 24, 130, 36);
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.fillText(`Scene ${sceneNumber} / ${totalScenes}`, 36, 47);

  if (onScreenText) {
    const textAlpha = Math.min(1, progress * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.95 * textAlpha})`;
    ctx.font = `bold ${W > 800 ? 28 : 20}px system-ui, sans-serif`;
    ctx.fillText(onScreenText.slice(0, 60), 30, H - 90);
  }

  if (narText) {
    ctx.fillStyle = `rgba(220,220,220,${Math.min(1, progress * 2)})`;
    ctx.font = `${W > 800 ? 17 : 13}px system-ui, sans-serif`;
    wrapText(ctx, narText.slice(0, 160), 30, H - 58, W - 60, 22);
  }

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, H - 4, W, 4);
  ctx.fillStyle = "rgba(139,92,246,0.8)";
  ctx.fillRect(0, H - 4, W * ((sceneNumber - 1 + progress) / totalScenes), 4);
}

function drawTransition(ctx, fromImg, toImg, progress, W, H, fromColor, toColor) {
  ctx.clearRect(0, 0, W, H);
  // Blend background colors
  ctx.globalAlpha = 1;
  ctx.fillStyle = toColor || fromColor || "#0a0a1a";
  ctx.fillRect(0, 0, W, H);
  if (fromImg) { ctx.globalAlpha = 1 - progress; ctx.drawImage(fromImg, 0, 0, W, H); }
  if (toImg) { ctx.globalAlpha = progress; ctx.drawImage(toImg, 0, 0, W, H); }
  ctx.globalAlpha = 1;
}

// For Veo video / Imagen image scenes — scene-by-scene player with narration
function VeoScenePlayer({ scenes, narrations, getSceneOnScreen }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const autoAdvanceRef = useRef(null);
  const scene = scenes[sceneIdx];
  // Prefer video_url, fall back to image_url (Imagen base64 or URL)
  const videoUrl = scene?.video_url && isVideoUrl(scene.video_url) ? scene.video_url : null;
  const imageUrl = scene?.image_url || null;
  const mediaUrl = videoUrl || imageUrl;
  const isVideo = !!videoUrl;
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };

  const speakNarration = (idx) => {
    window.speechSynthesis?.cancel();
    const text = narrations[idx] || "";
    if (!text) return;
    const utt = new SpeechSynthesisUtterance(text.slice(0, 600));
    utt.rate = 0.95;
    const voices = window.speechSynthesis?.getVoices() || [];
    const preferred = voices.find(v => v.name.includes("Samantha") || v.lang === "en-US");
    if (preferred) utt.voice = preferred;
    window.speechSynthesis?.speak(utt);
  };

  const stopAutoAdvance = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    window.speechSynthesis?.cancel();
  };

  const goTo = (idx) => {
    stopAutoAdvance();
    setSceneIdx(idx);
    if (isPlaying) {
      setTimeout(() => {
        videoRef.current?.play();
        speakNarration(idx);
        // Auto-advance for image scenes after ~12s
        const sceneIsVideo = !!(scenes[idx]?.video_url && isVideoUrl(scenes[idx].video_url));
        if (!sceneIsVideo) {
          autoAdvanceRef.current = setTimeout(() => {
            if (idx + 1 < scenes.length) goTo(idx + 1);
            else setIsPlaying(false);
          }, 12000);
        }
      }, 100);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAutoAdvance();
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setTimeout(() => {
        videoRef.current?.play();
        speakNarration(sceneIdx);
        if (!isVideo) {
          autoAdvanceRef.current = setTimeout(() => {
            if (sceneIdx + 1 < scenes.length) goTo(sceneIdx + 1);
            else setIsPlaying(false);
          }, 12000);
        }
      }, 100);
    }
  };

  useEffect(() => {
    return () => stopAutoAdvance();
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={cardStyle}>
      <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
        {isVideo ? (
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            playsInline
            controls={false}
            className="w-full h-full object-cover"
            style={{ display: "block" }}
            onEnded={() => {
              if (sceneIdx + 1 < scenes.length) goTo(sceneIdx + 1);
              else setIsPlaying(false);
            }}
          />
        ) : imageUrl ? (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={`Scene ${sceneIdx + 1}`}
            className="w-full h-full object-cover"
            style={{ display: "block", background: "#0a0a1a" }}
            onError={e => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${scene?.bg_color || "#1a1a2e"} 0%, #0a0a1a 100%)` }}>
            <div className="text-center text-white opacity-40">
              <Video className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-semibold">{scene?.on_screen_text || `Scene ${sceneIdx + 1}`}</p>
            </div>
          </div>
        )}

        {/* Overlay: scene number + media type badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="bg-indigo-500/80 text-white text-xs font-bold px-3 py-1 rounded-lg">
            Scene {sceneIdx + 1} / {scenes.length}
          </div>
          <div className="text-white text-xs font-bold px-2 py-1 rounded-lg bg-violet-500/60">
            Imagen
          </div>
        </div>

        {/* Play/pause overlay button */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className={`w-14 h-14 rounded-full bg-black/50 flex items-center justify-center transition-all group-hover:bg-black/70 ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
            {isPlaying ? <Pause className="w-6 h-6 text-white ml-0" /> : <Play className="w-6 h-6 text-white ml-1" />}
          </div>
        </button>

        {scene?.on_screen_text && (
          <div className="absolute bottom-10 left-0 right-0 px-4 pointer-events-none">
            <p className="text-white font-bold text-lg drop-shadow-lg">{scene.on_screen_text}</p>
          </div>
        )}
        {narrations[sceneIdx] && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pointer-events-none">
            <p className="text-white/90 text-sm line-clamp-2">{narrations[sceneIdx]}</p>
          </div>
        )}
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div className="h-full bg-violet-500 transition-all" style={{ width: `${((sceneIdx + 1) / scenes.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2 p-3">
        <button onClick={() => goTo(Math.max(0, sceneIdx - 1))} disabled={sceneIdx === 0} className="p-2 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 flex gap-1 justify-center">
          {scenes.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === sceneIdx ? "bg-violet-500 w-6" : "bg-white/20 w-3"}`}
            />
          ))}
        </div>
        <button onClick={() => goTo(Math.min(scenes.length - 1, sceneIdx + 1))} disabled={sceneIdx === scenes.length - 1} className="p-2 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function VideoPlayer({ item }) {
  const scenes = (() => {
    try { return item.video_scenes_json ? JSON.parse(item.video_scenes_json) : []; } catch { return []; }
  })();

  const narrations = scenes.map(s => s.narration_segment || "").some(n => n)
    ? scenes.map(s => s.narration_segment || "")
    : parseSceneNarrations(item.script);

  const getSceneOnScreen = (idx) => {
    if (scenes[idx]?.on_screen_text) return scenes[idx].on_screen_text;
    if (!item.script) return "";
    const parts = item.script.split(/=== SCENE \d+/);
    if (!parts[idx + 1]) return "";
    const m = parts[idx + 1].match(/\[ON-SCREEN\]:\s*(.*)/);
    return m ? m[1].trim() : "";
  };

  // Use scene player if scenes exist (even without images — VeoScenePlayer handles missing gracefully)
  const hasGeneratedMedia = scenes.length > 0;

  if (hasGeneratedMedia) {
    return <VeoScenePlayer scenes={scenes} narrations={narrations} getSceneOnScreen={getSceneOnScreen} />;
  }

  // Fallback: canvas-based player for scenes without generated media
  return <CanvasVideoPlayer item={item} scenes={scenes} narrations={narrations} getSceneOnScreen={getSceneOnScreen} />;
}

function CanvasVideoPlayer({ item, scenes, narrations, getSceneOnScreen }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const playStateRef = useRef(false);
  const sceneImagesRef = useRef([]);
  const currentSceneRef = useRef(0);

  const W = 1280, H = 720;
  const SCENE_DURATION = 12000;
  const TRANSITION_DURATION = 800;
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };

  useEffect(() => {
    // Draw first scene after first paint
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => drawStaticScene(0, 1));
    });
    // Load any scene images then redraw
    Promise.all(scenes.map(s => s.image_url ? loadImage(s.image_url) : Promise.resolve(null)))
      .then(imgs => { sceneImagesRef.current = imgs; drawStaticScene(currentSceneRef.current, 1); });
    return () => cancelAnimationFrame(raf);
  }, []);

  const drawStaticScene = (idx, progress = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    // Use scene bg_color if available, otherwise gradient
    const bgColor = scenes[idx]?.bg_color || null;
    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);
      // Subtle radial glow
      const grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
      grd.addColorStop(0, "rgba(124,58,237,0.15)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, W, H);
    }
    const img = sceneImagesRef.current[idx];
    if (img) { ctx.globalAlpha = 1; ctx.drawImage(img, 0, 0, W, H); }
    drawOverlays(ctx, idx + 1, scenes.length, getSceneOnScreen(idx), narrations[idx] || "", progress, W, H);
  };

  const animateTransition = (fromIdx, toIdx, onDone) => {
    const canvas = canvasRef.current;
    if (!canvas) { onDone(); return; }
    const ctx = canvas.getContext("2d");
    const fromImg = sceneImagesRef.current[fromIdx];
    const toImg = sceneImagesRef.current[toIdx];
    const fromColor = scenes[fromIdx]?.bg_color || "#0a0a1a";
    const toColor = scenes[toIdx]?.bg_color || "#0a0a1a";
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / TRANSITION_DURATION, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      drawTransition(ctx, fromImg, toImg, eased, W, H, fromColor, toColor);
      drawOverlays(ctx, toIdx + 1, scenes.length, getSceneOnScreen(toIdx), narrations[toIdx] || "", eased, W, H);
      if (t < 1) { animRef.current = requestAnimationFrame(tick); }
      else { drawStaticScene(toIdx, 1); onDone(); }
    };
    animRef.current = requestAnimationFrame(tick);
  };

  const speakScene = (idx) => {
    window.speechSynthesis?.cancel();
    const text = narrations[idx] || item.full_narration?.slice(idx * 300, (idx + 1) * 300) || "";
    if (!text) return;
    const utt = new SpeechSynthesisUtterance(text.slice(0, 600));
    utt.rate = 0.95;
    const voices = window.speechSynthesis?.getVoices() || [];
    const preferred = voices.find(v => v.name.includes("Samantha") || v.lang === "en-US");
    if (preferred) utt.voice = preferred;
    window.speechSynthesis?.speak(utt);
  };

  const updateScene = (idx) => {
    currentSceneRef.current = idx;
    setCurrentScene(idx);
  };

  const stopAll = () => {
    cancelAnimationFrame(animRef.current);
    clearTimeout(animRef._timer);
    window.speechSynthesis?.cancel();
    playStateRef.current = false;
    setPlaying(false);
  };

  useEffect(() => () => stopAll(), []);

  const playFromScene = (startIdx) => {
    playStateRef.current = true;
    setPlaying(true);
    let idx = startIdx;
    const playNext = () => {
      if (!playStateRef.current) return;
      updateScene(idx);
      drawStaticScene(idx, 1);
      speakScene(idx);
      animRef._timer = setTimeout(() => {
        if (!playStateRef.current) return;
        const nextIdx = idx + 1;
        if (nextIdx >= scenes.length) { stopAll(); updateScene(0); drawStaticScene(0, 1); return; }
        animateTransition(idx, nextIdx, () => { idx = nextIdx; playNext(); });
      }, SCENE_DURATION);
    };
    playNext();
  };

  const togglePlay = () => {
    if (playing) { stopAll(); drawStaticScene(currentScene, 1); }
    else { playFromScene(currentScene); }
  };

  const goScene = (dir) => {
    const next = Math.max(0, Math.min(scenes.length - 1, currentScene + dir));
    if (playing) {
      clearTimeout(animRef._timer);
      cancelAnimationFrame(animRef.current);
      window.speechSynthesis?.cancel();
      animateTransition(currentScene, next, () => {
        updateScene(next);
        speakScene(next);
        let idx = next;
        animRef._timer = setTimeout(function loop() {
          if (!playStateRef.current) return;
          const nextIdx = idx + 1;
          if (nextIdx >= scenes.length) { stopAll(); updateScene(0); drawStaticScene(0, 1); return; }
          animateTransition(idx, nextIdx, () => { idx = nextIdx; updateScene(idx); speakScene(idx); animRef._timer = setTimeout(loop, SCENE_DURATION); });
        }, SCENE_DURATION);
      });
    } else {
      animateTransition(currentScene, next, () => updateScene(next));
    }
  };

  const downloadAsVideo = async () => {
    if (!scenes.length || recording) return;
    setRecording(true);
    setRecordProgress(0);
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4000000 });
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${item.title}.webm`; a.click();
      URL.revokeObjectURL(url);
      setRecording(false); setRecordProgress(0);
    };
    recorder.start(100);
    const HOLD_MS = 6000, TRANS_MS = 1000, FRAME_MS = 1000 / 30;
    for (let i = 0; i < scenes.length; i++) {
      setRecordProgress(Math.round((i / scenes.length) * 95));
      const img = await loadImage(scenes[i]?.image_url);
      const prevImg = i > 0 ? await loadImage(scenes[i - 1]?.image_url) : null;
      if (i > 0) {
        const transFrames = Math.ceil(TRANS_MS / FRAME_MS);
        for (let f = 0; f < transFrames; f++) {
          const t = f / transFrames;
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          drawTransition(ctx, prevImg, img, eased, W, H, scenes[i-1]?.bg_color, scenes[i]?.bg_color);
          drawOverlays(ctx, i + 1, scenes.length, getSceneOnScreen(i), narrations[i] || "", eased, W, H);
          await new Promise(r => setTimeout(r, FRAME_MS));
        }
      }
      const holdFrames = Math.ceil(HOLD_MS / FRAME_MS);
      for (let f = 0; f < holdFrames; f++) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = scenes[i]?.bg_color || "#0a0a1a";
        ctx.fillRect(0, 0, W, H);
        if (img) ctx.drawImage(img, 0, 0, W, H);
        drawOverlays(ctx, i + 1, scenes.length, getSceneOnScreen(i), narrations[i] || "", 1, W, H);
        await new Promise(r => setTimeout(r, FRAME_MS));
      }
    }
    setRecordProgress(99);
    await new Promise(r => setTimeout(r, 200));
    recorder.stop();
  };

  if (!scenes.length) return null;

  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={cardStyle}>
      <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
        <canvas ref={canvasRef} width={W} height={H} className="w-full h-full object-cover" style={{ display: "block" }} />
        {playing && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-semibold pointer-events-none">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> PLAYING
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 p-3">
        <button onClick={() => goScene(-1)} disabled={currentScene === 0} className="p-2 rounded-xl disabled:opacity-20 transition-all hover:bg-white/10">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={togglePlay} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold flex-1 justify-center transition-all ${playing ? "bg-amber-500/20 text-amber-400" : "bg-violet-500/20 text-violet-400"}`}>
          {playing ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Play</>}
        </button>
        <button onClick={() => goScene(1)} disabled={currentScene === scenes.length - 1} className="p-2 rounded-xl disabled:opacity-20 transition-all hover:bg-white/10">
          <ChevronRight className="w-4 h-4" />
        </button>
        {playing && (
          <button onClick={stopAll} className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
            <Square className="w-4 h-4" />
          </button>
        )}
        <button onClick={downloadAsVideo} disabled={recording} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 transition-all" title="Download as video">
          {recording ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {recording ? `${recordProgress}%` : "Export"}
        </button>
      </div>
      {recording && (
        <div className="px-3 pb-3">
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${recordProgress}%` }} />
          </div>
          <p className="text-xs mt-1 text-center" style={{ color: "var(--app-text-muted)" }}>Rendering... {recordProgress}%</p>
        </div>
      )}
    </div>
  );
}