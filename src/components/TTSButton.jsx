import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Detect script/language from text content
function detectLang(text) {
  if (!text) return "en-US";
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return "ja-JP"; // Japanese
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh-CN";              // Chinese
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko-KR";              // Korean
  if (/[\u0600-\u06FF]/.test(text)) return "ar-SA";              // Arabic
  if (/[\u0400-\u04FF]/.test(text)) return "ru-RU";              // Russian
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN";              // Hindi
  if (/[\u0370-\u03FF]/.test(text)) return "el-GR";              // Greek
  if (/[\u0E00-\u0E7F]/.test(text)) return "th-TH";              // Thai
  // Latin-based language hints from common words
  if (/\b(le|la|les|de|du|un|une|est|et|je|tu|il|nous|vous|ils)\b/i.test(text)) return "fr-FR";
  if (/\b(el|la|los|las|de|del|un|una|es|y|que|en|se|no)\b/i.test(text)) return "es-ES";
  if (/\b(der|die|das|ein|ist|und|ich|du|wir|sie|nicht|mit)\b/i.test(text)) return "de-DE";
  if (/\b(il|lo|la|gli|le|un|una|è|e|di|che|non|con)\b/i.test(text)) return "it-IT";
  if (/\b(o|a|os|as|de|do|da|um|uma|é|e|que|em|não)\b/i.test(text)) return "pt-BR";
  return "en-US";
}

// Pick best matching voice for a language code
function getBestVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(v => v.lang === lang) ||
    voices.find(v => v.lang.startsWith(lang.split("-")[0])) ||
    null
  );
}

export default function TTSButton({ text, lang, className = "" }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const resolvedLang = lang || detectLang(text);

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = resolvedLang;
      utterance.rate = 0.9;

      // Try to find a matching voice
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find(v => v.lang === resolvedLang) ||
        voices.find(v => v.lang.startsWith(resolvedLang.split("-")[0]));
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    // Voices may not be loaded yet on first call
    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
      // Fallback: some browsers never fire the event, speak anyway after short delay
      setTimeout(() => {
        if (!speaking) doSpeak();
      }, 500);
    }
  };

  if (!window.speechSynthesis) return null;

  return (
    <button
      onClick={speak}
      title={speaking ? "Stop" : `Read aloud (${lang || detectLang(text)})`}
      className={`flex items-center justify-center rounded-lg transition-all hover:opacity-100 ${speaking ? "opacity-100 text-violet-400" : "opacity-40 hover:opacity-70"} ${className}`}
      style={{ minWidth: 28, minHeight: 28 }}
    >
      {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
}