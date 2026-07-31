import { db } from '@/lib/firebase';

import { useState, useRef, useEffect } from "react";

import { Mic, MicOff, Loader2, Sparkles, Check, BookOpen } from "lucide-react";
import { canUseAi, incrementAiUsage } from "../components/aiUsageLimit";
import { useTranslation } from "../hooks/useTranslation";
import { callAI } from "../lib/lynxApi";

export default function BrainDump() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null); // { summary, flashcards: [{front, back}] }
  const [selectedDeck, setSelectedDeck] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    db.auth.me().then(async (me) => {
      setUser(me);
      const d = await db.entities.Deck.filter({ created_by: me.email }, "-updated_date", 20);
      setDecks(d);
    });
    return () => recognitionRef.current?.stop();
  }, []);

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Your browser doesn't support voice recognition. Try Chrome on desktop.");
      return;
    }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
    let final = transcript;
    recognition.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) { final += t + " "; }
        else { interim = t; }
      }
      setTranscript(final + interim);
    };
    recognition.onend = () => {
      // Restart automatically unless user explicitly stopped
      if (recognitionRef.current && recognitionRef.current._shouldKeepGoing) {
        try { recognition.start(); } catch {}
      } else {
        setRecording(false);
      }
    };
    recognition._shouldKeepGoing = true;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current._shouldKeepGoing = false;
      recognitionRef.current.stop();
    }
    setRecording(false);
  };

  const processWithAI = async () => {
    if (!transcript.trim()) return;
    if (!canUseAi(user?.email)) {
      alert("You've reached your daily AI limit. Complete a survey to earn more credits!");
      return;
    }
    setProcessing(true);
    incrementAiUsage(user?.email);
    const resp = await callAI({
      prompt: `A student just did a voice brain dump about what they learned. Clean up the transcript (remove filler words like "um", "uh", fix grammar), write a clean structured summary, and generate 3-5 high-quality flashcards from the content.\n\nTranscript: "${transcript}"\n\nReturn JSON with "summary" (string, 2-4 sentences) and "flashcards" (array of {front, back}).`,
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          flashcards: { type: "array", items: { type: "object", properties: { front: { type: "string" }, back: { type: "string" } } } }
        }
      },
      feature: "brain_dump",
    });
    setResult(resp);
    setProcessing(false);
  };

  const saveFlashcards = async () => {
    if (!result?.flashcards?.length || !selectedDeck) return;
    setSaving(true);
    await db.entities.Flashcard.bulkCreate(
      result.flashcards.map(c => ({ front: c.front, back: c.back, deck_id: selectedDeck, author_email: user?.email }))
    );
    const deck = decks.find(d => d.id === selectedDeck);
    if (deck) {
      await db.entities.Deck.update(selectedDeck, { card_count: (deck.card_count || 0) + result.flashcards.length });
    }
    setSaving(false);
    setSaved(true);
  };

  const reset = () => {
    setTranscript("");
    setResult(null);
    setSaved(false);
    setSelectedDeck("");
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/15 flex items-center justify-center">
            <Mic className="w-5 h-5 text-pink-400" />
          </div>
          <h1 className="text-2xl font-black">{t('brainDumpTitle')}</h1>
        </div>
        <p className="text-sm mb-8" style={mutedStyle}>{t('brainDumpDesc')}</p>

        {/* Record button */}
        <div className="rounded-3xl p-8 text-center mb-6" style={cardStyle}>
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${recording ? "bg-red-500 hover:bg-red-400 animate-pulse" : "bg-pink-500 hover:bg-pink-400"}`}
          >
            {recording ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
          </button>
          <p className="font-semibold text-sm">{recording ? t('recordingTapToStop') : t('tapToSpeak')}</p>
          {recording && (
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 bg-red-400 rounded-full animate-bounce" style={{ height: `${8 + Math.random() * 12}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
        </div>

        {/* Transcript */}
        {(transcript || recording) && (
          <div className="rounded-3xl p-5 mb-4" style={cardStyle}>
            <p className="text-xs font-semibold mb-2" style={mutedStyle}>{t('transcript')}</p>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              rows={5}
              placeholder={t('transcriptPlaceholder')}
              className="w-full text-sm outline-none resize-none bg-transparent"
              style={{ color: "var(--app-text)" }}
            />
          </div>
        )}

        {transcript && !result && (
          <button
            onClick={processWithAI}
            disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 disabled:opacity-40 text-white py-4 rounded-2xl font-semibold transition-all mb-4"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {processing ? t('aiIsProcessing') : t('processWithAI')}
          </button>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-3xl p-5" style={cardStyle}>
              <p className="text-xs font-semibold mb-2 text-violet-400">{t('aiSummary')}</p>
              <p className="text-sm leading-relaxed">{result.summary}</p>
            </div>

            {result.flashcards?.length > 0 && (
              <div className="rounded-3xl p-5" style={cardStyle}>
                <p className="text-xs font-semibold mb-3 text-pink-400">{t('suggestedFlashcards')} ({result.flashcards.length})</p>
                <div className="space-y-3 mb-4">
                  {result.flashcards.map((card, i) => (
                    <div key={i} className="rounded-2xl p-3" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                      <p className="text-xs font-semibold">{card.front}</p>
                      <p className="text-xs mt-1" style={mutedStyle}>{card.back}</p>
                    </div>
                  ))}
                </div>

                {!saved ? (
                  <div className="space-y-3">
                    <select
                      value={selectedDeck}
                      onChange={e => setSelectedDeck(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                    >
                      <option value="">{t('saveToDeck')}</option>
                      {decks.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                    </select>
                    <button
                      onClick={saveFlashcards}
                      disabled={!selectedDeck || saving}
                      className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white py-3 rounded-2xl font-semibold text-sm transition-all"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                      {t('saveFlashcardsToDeck')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm justify-center py-2">
                    <Check className="w-4 h-4" /> {t('flashcardsSaved')}
                  </div>
                )}
              </div>
            )}

            <button onClick={reset} className="w-full py-3 rounded-2xl text-sm font-semibold transition-all" style={cardStyle}>
              {t('startNewBrainDump')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}