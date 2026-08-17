import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import { incrementAiUsage } from "../components/aiUsageLimit";
import { callAI } from "../lib/lynxApi";
import { PenLine, Target, ClipboardList, Loader2, ChevronLeft, CheckCircle2, XCircle, Sparkles, ChevronDown, ChevronUp, RotateCcw, History, Trash2, Code2, Upload, Bookmark, BookmarkCheck, ChevronRight, MoreHorizontal, Highlighter, X, BookOpen } from "lucide-react";
import APScoreResult from "../components/APScoreResult";
import { getPremadeMCQ, getPremadeFRQ, hasPremade, getPremadeMCQCount } from "../lib/apPremadeQuestions";
import { gradeAPFRQ } from "../lib/apFrqGrader";
import { SectionBreakScreen, APFRQInterface } from "../components/APExamSections";
import StimulusRenderer from "../components/APStimulusRenderer";

// Real AP exam MCQ counts per subject
const AP_MCQ_COUNTS = {
  "AP Biology": 60,
  "AP Chemistry": 60,
  "AP Physics 1": 50,
  "AP Physics 2": 50,
  "AP Physics C": 35,
  "AP Calculus AB": 45,
  "AP Calculus BC": 45,
  "AP Statistics": 40,
  "AP US History": 55,
  "AP World History": 55,
  "AP European History": 55,
  "AP US Government": 55,
  "AP Comparative Government": 55,
  "AP English Language": 45,
  "AP English Literature": 55,
  "AP Psychology": 100,
  "AP Macroeconomics": 60,
  "AP Microeconomics": 60,
  "AP Computer Science A": 40,
  "AP Computer Science Principles": 70,
  "AP Environmental Science": 80,
  "AP Human Geography": 60,
  "AP Spanish Language": 65,
  "AP French Language": 65,
  "AP Japanese Language": 65,
};

// Subjects where graphs/tables/data are very common on the real exam
const DATA_HEAVY_SUBJECTS = new Set([
  "AP Biology", "AP Chemistry", "AP Physics 1", "AP Physics 2", "AP Physics C",
  "AP Calculus AB", "AP Calculus BC", "AP Statistics", "AP Environmental Science",
  "AP Macroeconomics", "AP Microeconomics", "AP Psychology",
]);

// Geography/social science subjects where maps and regional descriptions apply
const GEO_SUBJECTS = new Set([
  "AP Human Geography", "AP Environmental Science", "AP US History",
  "AP World History", "AP European History", "AP Comparative Government",
]);

// Build a deeply specific subject context string for the AI prompt
function getSubjectContext(subject) {
  const contexts = {
    "AP Human Geography": `You are writing questions at the level of the ACTUAL AP Human Geography exam. 
Include questions referencing: DTM (Demographic Transition Model) with specific countries at each stage (e.g., Niger at Stage 2, Japan at Stage 5), 
population pyramids for real cities/countries (Tokyo, Lagos, Cairo, Mexico City, Bangladesh), 
gravity model using real city pairs (NYC-LA, London-Paris), 
Von Thünen model with labeled rings, Christaller's Central Place Theory, 
urban models (Burgess, Hoyt, multiple nuclei) applied to Chicago, Los Angeles, 
world maps showing HDI choropleth data, infant mortality by region, 
migration patterns (push/pull factors with real examples: Syrian refugees, US-Mexico migration), 
agricultural regions (wheat belt, corn belt, rice paddies in Southeast Asia), 
language diffusion (Romance languages from Latin, Swahili in East Africa),
core-periphery model with named countries, world systems theory.
For maps: describe a choropleth, dot-distribution, or flow map using REAL geographic data.`,
    "AP Environmental Science": `Include questions on: real biomes mapped globally, 
ENSO effects on Peru/Australia, deforestation rates in Amazon (Brazil) with actual data, 
carbon cycle with real atmospheric CO2 ppm values (~420 ppm current), 
endangered species by specific ecosystem, 
acid rain effects in northeastern US/Canada,
population growth data for specific developing nations,
energy consumption per capita tables comparing USA vs China vs Germany.`,
    "AP US History": `Include stimulus from REAL primary sources: 
Declaration of Independence excerpts, Federalist No. 10 (Madison), 
Lincoln-Douglas debates, FDR's Four Freedoms speech, MLK Letter from Birmingham Jail, 
political cartoons from specific historical eras with artist attribution,
tables of economic data (GDP, unemployment) during Great Depression vs New Deal,
maps showing westward expansion, Civil War battle lines, Jim Crow-era segregation patterns.`,
    "AP World History": `Use primary sources from: Mongol Empire expansion maps, 
Silk Road trade route maps with named cities (Samarkand, Chang'an, Baghdad), 
colonial-era maps of Africa (Berlin Conference 1884-85), 
demographic data tables for Black Death mortality by European region,
graphs of global trade volume during first/second industrial revolutions,
excerpts from Ibn Battuta, Marco Polo, or other historical travelers.`,
    "AP Psychology": `Include real psychological studies: Milgram obedience study (Yale, 1961), 
Asch conformity experiments, Bandura's Bobo doll study,
Pavlov's dog experiments with labeled stimulus-response diagrams,
graphs of normal distribution of IQ scores (mean=100, SD=15),
bar charts of results from memory recall experiments (serial position effect),
tables comparing DSM-5 diagnostic criteria for specific disorders.`,
    "AP Macroeconomics": `Use real economic data: 
US GDP growth rate graphs (2008 recession, 2020 COVID drop, recovery),
Phillips Curve showing US inflation vs unemployment data by decade,
AD-AS model diagrams for specific economic scenarios,
table of real federal funds rate history (near-zero 2009-2015, hikes 2022-2023),
money multiplier calculations with real reserve requirement percentages,
comparative advantage tables using real countries (China/US manufacturing).`,
    "AP Statistics": `Use realistic datasets with named real-world contexts:
SAT score distributions for specific states, 
clinical trial data (vaccine efficacy percentages with sample sizes),
regression analysis of real variables (GDP vs life expectancy across countries),
contingency tables with actual survey data,
z-scores and p-values from described experiments,
sampling distributions with specific n values.`,
    "AP Biology": `Use real experimental data:
Hardy-Weinberg equilibrium calculations with specific allele frequencies,
enzyme activity graphs showing temperature/pH optima (pepsin at pH 2, amylase at pH 7),
population ecology data (logistic growth of deer in Yellowstone),
DNA sequence alignment tables,
phylogenetic trees with real species (Homo sapiens, Pan troglodytes, Gorilla gorilla),
cellular respiration rate tables at different O2 concentrations.`,
    "AP Chemistry": `Include real data:
titration curves for strong acid/strong base (0.1M HCl vs 0.1M NaOH),
solubility product tables for real compounds (Ksp of BaSO4 = 1.1×10⁻¹⁰),
reaction rate tables with actual concentration data,
phase diagrams for real substances (water, CO2),
electrochemical cell potential calculations with real half-reactions,
thermodynamic data tables (ΔH°f, ΔG°f, S° values).`,
  };
  if (subject === "AP Japanese Language") {
    return `You are writing AP Japanese Language exam content. CRITICAL RULES:
- ALL text must be entirely in Japanese (hiragana, katakana, kanji). Do NOT include any English translations, romaji, or explanations in parentheses.
- Questions, answer options, stimuli, and explanations must all be written in Japanese only.
- Follow the actual AP Japanese Language exam format:
  * Reading comprehension: include a Japanese essay or article passage (読解) and ask questions about content, vocabulary, and nuance entirely in Japanese
  * Mock text message / email (メッセージ・メール): a realistic Japanese text message or email exchange, followed by comprehension and inference questions in Japanese
  * Speaking practice prompts (スピーキング): structured prompts asking the student to describe, explain, or give opinions on topics in Japanese (describe your school life, express an opinion about technology, etc.) — framed entirely in Japanese
  * FRQs: written response questions asking students to write emails, essays, or responses to Japanese prompts — entirely in Japanese
- Vocabulary and grammar should reflect N3–N2 JLPT level (intermediate–upper intermediate), appropriate for AP Japanese.
- Do NOT use English anywhere in the content.`;
  }
  return contexts[subject] || `Use real-world data, named locations, actual statistics, and scenarios grounded in the specific curriculum of ${subject}. Reference real events, people, places, and measurements.`;
}

// ─── AP Classroom MCQ Interface (College Board style) ────────────────────────
function APMCQInterface({ questions, subject, onSubmit, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [eliminated, setEliminated] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  // Hide timer
  const [timerHidden, setTimerHidden] = useState(false);
  const [fiveMinAlert, setFiveMinAlert] = useState(false);
  const EXAM_TOTAL = questions.length * 90;
  const timerHiddenRef = useRef(false);

  // Draggable divider
  const [splitPct, setSplitPct] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const onDividerMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMove = (ev) => {
      if (!isDragging.current || !containerRef.current) return;
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const rect = containerRef.current.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      const snaps = [25, 50, 75];
      const snapped = snaps.find(s => Math.abs(raw - s) < 3);
      setSplitPct(Math.min(75, Math.max(25, snapped !== undefined ? snapped : raw)));
    };
    const onUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  };

  // Highlights & Notes panel
  const [showHighlights, setShowHighlights] = useState(false);
  const [highlights, setHighlights] = useState([]); // { id, qIdx, text, color, note }
  const [noteInput, setNoteInput] = useState(""); // for the active highlight
  const [activeHighlightId, setActiveHighlightId] = useState(null);
  const [highlightColor, setHighlightColor] = useState("#fde68a");
  const leftPaneRef = useRef(null);

  // Three-dot menu
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);
  const [lineReaderOn, setLineReaderOn] = useState(false);
  const [lineReaderY, setLineReaderY] = useState(200);
  const [zoom, setZoom] = useState(1);

  // Exit confirmation
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => { timerHiddenRef.current = timerHidden; }, [timerHidden]);

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds(s => {
      const next = s + 1;
      const remaining = EXAM_TOTAL - next;
      if (remaining === 300 && timerHiddenRef.current) {
        setTimerHidden(false);
        setFiveMinAlert(true);
        setTimeout(() => setFiveMinAlert(false), 4000);
      }
      return next;
    }), 1000);
    return () => clearInterval(timerRef.current);
  }, [EXAM_TOTAL]);

  // Close more menu on outside click
  useEffect(() => {
    if (!showMoreMenu) return;
    const handler = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMoreMenu]);

  const timeRemaining = Math.max(0, EXAM_TOTAL - seconds);
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const q = questions[currentIdx];

  const toggleEliminate = (optIdx) => {
    setEliminated(prev => {
      const set = new Set(prev[currentIdx] || []);
      set.has(optIdx) ? set.delete(optIdx) : set.add(optIdx);
      return { ...prev, [currentIdx]: set };
    });
  };

  // Highlight selected text in the left pane
  const handleHighlight = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const selectedText = sel.toString().trim();
    if (!selectedText) return;
    const newHL = { id: Date.now(), qIdx: currentIdx, text: selectedText, color: highlightColor, note: "" };
    setHighlights(prev => [...prev, newHL]);
    setActiveHighlightId(newHL.id);
    setNoteInput("");
    sel.removeAllRanges();
  };

  const updateHighlightNote = (id, note) => {
    setHighlights(prev => prev.map(h => h.id === id ? { ...h, note } : h));
  };

  const deleteHighlight = (id) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
    if (activeHighlightId === id) setActiveHighlightId(null);
  };

  const currentHighlights = highlights.filter(h => h.qIdx === currentIdx);

  const bg = "#ffffff";
  const border = "rgba(0,0,0,0.12)";
  const text = "#1a1a2e";
  const muted = "rgba(0,0,0,0.5)";
  const headerBg = "#f0f0f0";

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: bg, color: text, fontFamily: "Georgia, serif" }}>

      {/* ── 5-minute alert banner ── */}
      {fiveMinAlert && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg animate-bounce"
          style={{ background: "#dc2626", fontFamily: "system-ui" }}>
          ⏰ 5 minutes remaining!
        </div>
      )}

      {/* ── Top Header ── */}
      <div className="flex items-center px-4 py-2 shrink-0" style={{ background: headerBg, borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-4 flex-1">
          <button onClick={() => setShowDirections(d => !d)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-all hover:bg-black/10"
            style={{ color: text, fontFamily: "system-ui" }}>
            Directions <ChevronDown className={`w-3 h-3 transition-transform ${showDirections ? "rotate-180" : ""}`} />
          </button>
          <span className="text-xs font-semibold" style={{ color: muted, fontFamily: "system-ui" }}>Section I, Part A — {subject}</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          {timerHidden ? (
            <span className="text-xl font-black tabular-nums text-gray-400" style={{ fontFamily: "system-ui" }}>--:--</span>
          ) : (
            <span className={`text-xl font-black tabular-nums ${timeRemaining < 300 ? "text-red-600" : ""}`} style={{ fontFamily: "system-ui" }}>
              {fmt(timeRemaining)}
            </span>
          )}
          <button
            onClick={() => setTimerHidden(h => !h)}
            className="text-xs px-3 py-1 rounded-full border font-semibold transition-all hover:bg-black/10"
            style={{ color: "#1a56db", borderColor: "#1a56db", fontFamily: "system-ui" }}>
            {timerHidden ? "Show" : "Hide"}
          </button>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end" style={{ fontFamily: "system-ui" }}>
          {/* Highlights & Notes */}
          <button
            onClick={() => setShowHighlights(h => !h)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all px-2 py-1 rounded ${showHighlights ? "bg-yellow-100 text-yellow-700" : "opacity-60 hover:opacity-100"}`}>
            <Highlighter className="w-3.5 h-3.5" /> Highlights &amp; Notes
          </button>

          {/* Three-dot menu */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(m => !m)}
              className={`p-1.5 rounded transition-all ${showMoreMenu ? "bg-black/10" : "hover:bg-black/10 opacity-60 hover:opacity-100"}`}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-8 w-52 rounded-xl shadow-2xl py-1 z-50 border"
                style={{ background: "#ffffff", borderColor: border, fontFamily: "system-ui" }}>
                {/* Line Reader */}
                <button
                  onClick={() => { setLineReaderOn(r => !r); setShowMoreMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 transition-all">
                  <span className="text-base">📏</span>
                  <span>{lineReaderOn ? "Hide" : "Show"} Line Reader</span>
                  {lineReaderOn && <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">ON</span>}
                </button>
                {/* Zoom controls */}
                <div className="flex items-center gap-2 px-4 py-2.5 text-sm">
                  <span className="text-base">🔍</span>
                  <span className="flex-1">Zoom</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setZoom(z => Math.max(0.8, Math.round((z - 0.1) * 10) / 10))}
                      className="w-6 h-6 rounded flex items-center justify-center font-bold hover:bg-gray-200 transition-all text-gray-700">−</button>
                    <span className="text-xs font-bold w-8 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(1.5, Math.round((z + 0.1) * 10) / 10))}
                      className="w-6 h-6 rounded flex items-center justify-center font-bold hover:bg-gray-200 transition-all text-gray-700">+</button>
                  </div>
                </div>
                {zoom !== 1 && (
                  <button onClick={() => setZoom(1)}
                    className="w-full text-left px-4 py-1.5 text-xs text-gray-400 hover:bg-gray-100 transition-all">
                    Reset zoom to 100%
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Directions dropdown */}
      {showDirections && (
        <div className="px-6 py-3 text-sm border-b" style={{ background: headerBg, borderColor: border, fontFamily: "system-ui", color: muted }}>
          <strong style={{ color: text }}>Directions:</strong> The questions or incomplete statements below are each followed by four suggested answers or completions. Select the one that is best in each case and then fill in the corresponding circle on the answer sheet.
        </div>
      )}

      {/* Highlights & Notes sidebar */}
      {showHighlights && (
        <div className="fixed right-0 top-10 bottom-12 w-72 z-40 flex flex-col shadow-2xl border-l"
          style={{ background: "#fffdf0", borderColor: "#fde68a", fontFamily: "system-ui" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#fde68a" }}>
            <span className="font-bold text-sm text-amber-700 flex items-center gap-1.5"><Highlighter className="w-3.5 h-3.5" /> Highlights &amp; Notes</span>
            <button onClick={() => setShowHighlights(false)} className="p-1 rounded hover:bg-amber-100"><X className="w-3.5 h-3.5 text-amber-600" /></button>
          </div>
          {/* Color picker */}
          <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: "#fde68a" }}>
            <span className="text-xs text-amber-700 font-semibold">Color:</span>
            {["#fde68a", "#bbf7d0", "#bfdbfe", "#fecaca", "#e9d5ff"].map(c => (
              <button key={c} onClick={() => setHighlightColor(c)}
                className="w-5 h-5 rounded-full transition-all hover:scale-110"
                style={{ background: c, outline: highlightColor === c ? "2px solid #92400e" : "none", outlineOffset: 1 }} />
            ))}
          </div>
          <div className="px-4 py-2 border-b" style={{ borderColor: "#fde68a" }}>
            <p className="text-xs text-amber-700">Select text in the passage on the left, then click <strong>Add Highlight</strong>.</p>
            <button onClick={handleHighlight}
              className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ background: "#92400e" }}>
              <Highlighter className="w-3 h-3" /> Add Highlight
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {currentHighlights.length === 0 ? (
              <p className="text-xs text-amber-600 text-center py-6 opacity-60">No highlights on this question yet.</p>
            ) : (
              currentHighlights.map(hl => (
                <div key={hl.id} className="rounded-lg p-2.5 border" style={{ background: hl.color, borderColor: "#d97706" }}>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="text-xs font-semibold text-amber-900 leading-snug flex-1">"{hl.text}"</p>
                    <button onClick={() => deleteHighlight(hl.id)} className="shrink-0 p-0.5 rounded hover:bg-black/10"><X className="w-3 h-3 text-amber-700" /></button>
                  </div>
                  {activeHighlightId === hl.id ? (
                    <div>
                      <textarea
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                        placeholder="Add a note..."
                        rows={2}
                        className="w-full text-xs px-2 py-1 rounded border outline-none resize-none"
                        style={{ borderColor: "#d97706", background: "rgba(255,255,255,0.7)" }}
                      />
                      <button onClick={() => { updateHighlightNote(hl.id, noteInput); setActiveHighlightId(null); }}
                        className="mt-1 text-xs font-bold text-amber-800 hover:text-amber-900">Save note</button>
                    </div>
                  ) : (
                    <div>
                      {hl.note && <p className="text-xs text-amber-800 italic mt-0.5">{hl.note}</p>}
                      <button onClick={() => { setActiveHighlightId(hl.id); setNoteInput(hl.note); }}
                        className="text-[10px] text-amber-700 hover:underline mt-0.5">
                        {hl.note ? "Edit note" : "+ Add note"}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Main two-pane area ── */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
        {/* Line Reader overlay */}
        {lineReaderOn && (
          <div
            className="absolute inset-x-0 z-30 pointer-events-none"
            style={{ top: 0, bottom: 0 }}
          >
            {/* Dark overlay above the reader line */}
            <div className="absolute inset-x-0 top-0 pointer-events-auto cursor-ns-resize"
              style={{ height: lineReaderY - 16, background: "rgba(0,0,0,0.25)" }}
              onMouseMove={e => { if (e.buttons === 1) setLineReaderY(e.clientY - 120); }} />
            {/* The bright reader strip */}
            <div className="absolute inset-x-0 pointer-events-auto cursor-ns-resize"
              style={{ top: lineReaderY - 16, height: 32, background: "rgba(255,251,205,0.95)", borderTop: "2px solid #fbbf24", borderBottom: "2px solid #fbbf24" }}
              onMouseMove={e => { if (e.buttons === 1) setLineReaderY(e.clientY - 120); }}
              onMouseDown={e => setLineReaderY(e.clientY - 120)} />
            {/* Dark overlay below */}
            <div className="absolute inset-x-0 bottom-0 pointer-events-auto cursor-ns-resize"
              style={{ top: lineReaderY + 16, background: "rgba(0,0,0,0.25)" }}
              onMouseMove={e => { if (e.buttons === 1) setLineReaderY(e.clientY - 120); }} />
          </div>
        )}

        {/* Left pane: passage / stimulus */}
        <div ref={leftPaneRef} className="overflow-y-auto p-8" style={{ borderRight: `1px solid ${border}`, width: `${splitPct}%`, minWidth: "25%", maxWidth: "75%" }}>
          <div style={{ fontSize: `${zoom}em`, transformOrigin: "top left" }}>
            <StimulusRenderer q={q} isDark={false} muted={muted} text={text} />
          </div>
        </div>

        {/* Draggable divider */}
        <div
          onMouseDown={onDividerMouseDown}
          className="w-2 flex items-center justify-center shrink-0 cursor-col-resize select-none group"
          style={{ background: border }}
        >
          <div className="w-4 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ background: "#c0c0c0" }}>
            <div className="flex flex-col gap-0.5">
              <div className="w-0.5 h-1.5 rounded-full" style={{ background: muted }} />
              <div className="w-0.5 h-1.5 rounded-full" style={{ background: muted }} />
              <div className="w-0.5 h-1.5 rounded-full" style={{ background: muted }} />
            </div>
          </div>
        </div>

        {/* Right pane: question + choices */}
        <div className="overflow-y-auto p-8 flex flex-col gap-5" style={{ flex: 1 }}>
          <div style={{ fontSize: `${zoom}em`, transformOrigin: "top left" }}>
          {/* Mark for Review */}
          <div className="flex items-center justify-between" style={{ fontFamily: "system-ui" }}>
            <button
              onClick={() => setMarked(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }))}
              className={`flex items-center gap-2 px-4 py-2 rounded border-2 text-sm font-semibold transition-all ${marked[currentIdx] ? "border-amber-400 bg-amber-400/10 text-amber-500" : "border-gray-300 hover:border-gray-400"}`}
              style={{ borderStyle: "dashed", color: marked[currentIdx] ? undefined : muted }}
            >
              {marked[currentIdx] ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              Mark for Review
            </button>
            <span className="px-3 py-1 rounded text-xs font-black text-white" style={{ background: "#1a56db", fontFamily: "system-ui" }}>AP©</span>
          </div>

          <p className="text-sm leading-relaxed" style={{ lineHeight: "1.75" }}>{q.question}</p>

          <div className="space-y-2.5">
            {q.options.map((opt, j) => {
              const isSelected = answers[currentIdx] === j;
              const isElim = (eliminated[currentIdx] || new Set()).has(j);
              return (
                <div key={j} className="flex items-stretch gap-2">
                  <button
                    onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: j }))}
                    disabled={isElim}
                    className="flex-1 flex items-start gap-3 px-4 py-3 rounded border text-sm text-left transition-all hover:opacity-90"
                    style={{
                      border: `1px solid ${isSelected ? "#1a56db" : border}`,
                      background: isSelected ? "rgba(26,86,219,0.08)" : "transparent",
                      opacity: isElim ? 0.3 : 1,
                      textDecoration: isElim ? "line-through" : "none",
                      color: text,
                      fontFamily: "system-ui",
                    }}
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{
                        borderColor: isSelected ? "#1a56db" : border,
                        background: isSelected ? "#1a56db" : "transparent",
                        color: isSelected ? "white" : text,
                      }}>
                      {LETTERS[j]}
                    </span>
                    <span>{opt}</span>
                  </button>
                  <button
                    onClick={() => toggleEliminate(j)}
                    className="shrink-0 w-8 flex items-center justify-center rounded border text-xs transition-all hover:opacity-80"
                    style={{
                      border: `1px solid ${border}`,
                      color: isElim ? "#ef4444" : muted,
                      background: isElim ? "rgba(239,68,68,0.05)" : "transparent",
                    }}
                    title="Eliminate option"
                  >
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: isElim ? "#ef4444" : muted, fontSize: "9px", fontFamily: "system-ui" }}>
                      {isElim ? "✕" : LETTERS[j]}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex items-center px-6 py-3 shrink-0" style={{ background: headerBg, borderTop: `1px solid ${border}`, fontFamily: "system-ui" }}>
        <div className="flex-1 text-sm font-semibold" style={{ color: muted }} />

        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
            className="px-4 py-2 rounded text-sm font-semibold border disabled:opacity-30 transition-all hover:bg-black/10"
            style={{ border: `1px solid ${border}`, color: text }}>
            Back
          </button>

          <button onClick={() => setNavOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{ background: "#e0e0e0", color: text }}>
            Question {currentIdx + 1} of {questions.length}
            <ChevronUp className={`w-3.5 h-3.5 transition-transform ${navOpen ? "" : "rotate-180"}`} />
          </button>

          {currentIdx < questions.length - 1 ? (
            <button onClick={() => setCurrentIdx(i => i + 1)}
              className="px-4 py-2 rounded text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#1a56db" }}>
              Next
            </button>
          ) : (
            <button onClick={() => onSubmit(answers)}
              className="px-4 py-2 rounded text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#16a34a" }}>
              Submit
            </button>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          <button onClick={() => setShowExitConfirm(true)} className="text-xs opacity-40 hover:opacity-80 transition-all">✕ Exit</button>
        </div>
      </div>

      {/* Question nav overlay */}
      {navOpen && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-2xl shadow-2xl p-4 z-10 w-80"
          style={{ background: "#ffffff", border: `1px solid ${border}`, fontFamily: "system-ui" }}>
          <p className="text-xs font-bold mb-3" style={{ color: muted }}>QUESTIONS</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, i) => (
              <button key={i} onClick={() => { setCurrentIdx(i); setNavOpen(false); }}
                className="w-9 h-9 rounded text-xs font-bold flex items-center justify-center transition-all relative"
                style={{
                  background: i === currentIdx ? "#1a56db" : answers[i] !== undefined ? "#e8f0fe" : "#f0f0f0",
                  color: i === currentIdx ? "white" : text,
                  border: `1px solid ${border}`,
                }}>
                {i + 1}
                {marked[i] && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400" />}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-3 text-[10px]" style={{ color: muted }}>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Current</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Marked</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background: "#e8f0fe", border: `1px solid ${border}` }} /> Answered</span>
          </div>
        </div>
      )}

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 w-80 shadow-2xl" style={{ background: "#ffffff", fontFamily: "system-ui" }}>
            <h3 className="font-black text-base mb-2" style={{ color: text }}>Exit Exam?</h3>
            <p className="text-sm mb-5" style={{ color: muted }}>Your progress and answered questions will be lost. Are you sure you want to exit?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50 transition-all"
                style={{ border: `1px solid ${border}`, color: text }}>
                Keep Testing
              </button>
              <button onClick={onBack}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-all">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const AP_SUBJECTS = [
  "AP Biology", "AP Chemistry", "AP Physics 1", "AP Physics 2", "AP Physics C",
  "AP Calculus AB", "AP Calculus BC", "AP Statistics",
  "AP US History", "AP World History", "AP European History", "AP US Government", "AP Comparative Government",
  "AP English Language", "AP English Literature",
  "AP Psychology", "AP Macroeconomics", "AP Microeconomics",
  "AP Computer Science A", "AP Computer Science Principles",
  "AP Environmental Science", "AP Human Geography",
  "AP Spanish Language", "AP French Language", "AP Japanese Language",
];

const LETTERS = ["A", "B", "C", "D", "E"];

// ─── FRQ Maker / Grader ───────────────────────────────────────────────────────
function FRQTool({ user, onSave }) {
  const [subject, setSubject] = useState(AP_SUBJECTS[0]);
  const [customSubject, setCustomSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [frq, setFrq] = useState(null);
  const [userResponse, setUserResponse] = useState("");
  const [grading, setGrading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [frqMode, setFrqMode] = useState("premade"); // "premade" | "ai" | "custom"
  const [examMode, setExamMode] = useState(false);
  const [frqResponses, setFrqResponses] = useState({});
  const [showScore, setShowScore] = useState(false);

  const cardStyle = { background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", color: "#1a1a2e" };
  const mutedStyle = { color: "rgba(0,0,0,0.55)" };

  const effectiveSubject = frqMode === "custom" ? (customSubject || subject) : subject;
  const subjectHasPremadeFRQ = hasPremade(subject) && getPremadeFRQ(subject)?.length > 0;

  const loadPremadeFRQ = () => {
    const frqs = getPremadeFRQ(subject);
    if (!frqs || frqs.length === 0) return;
    const picked = frqs[Math.floor(Math.random() * frqs.length)];
    const parts = (picked.parts || []).map(p => ({ ...p, label: p.label || p.part || "?", part: p.label || p.part || "?" }));
    const total = parts.reduce((s, p) => s + (p.points || 1), 0) || 7;
    const examFRQ = {
      question: (picked.prompt || picked.title || "") + "\n\n" + parts.map(p => `(${p.label}) [${p.points||1} pt] ${p.question}`).join("\n\n"),
      total_points: total,
      rubric: Object.fromEntries(parts.map(p => [p.label, { points: p.points||1, criteria: p.rubric || p.question }])),
      prompt: picked.prompt || picked.title || "",
      stimulus: picked.stimulus || null,
      parts,
    };
    setFrq(examFRQ);
    setUserResponse("");
    setFrqResponses({});
    setFeedback(null);
    setSaved(false);
    setShowScore(false);
    setExamMode(true);
  };

  const generateFRQ = async () => {
    setGenerating(true);
    setFrq(null);
    setUserResponse("");
    setFeedback(null);
    setSaved(false);
    incrementAiUsage(user?.email, false, 1);
    const isJapanese = effectiveSubject === "AP Japanese Language";
    
    const res = await callAI({
      feature: "ap_frq",
      prompt: isJapanese
        ? `あなたはAP日本語・文化（AP Japanese Language and Culture）の試験問題を作成しています。
以下のAP日本語試験の形式に従って、問題を生成してください。全て日本語で記述し、英語は一切使用しないでください。

以下のいずれかの形式を使用してください（または組み合わせてください）：
1. 読解問題（エッセイや記事を読んで、内容・語彙・ニュアンスについての質問に答える）
2. メッセージ・メール（日本語のテキストメッセージやメールのやり取りを読んで、質問に答える）
3. スピーキング練習（日本語で意見や説明を述べるプロンプト）
4. 自由記述（日本語でメール・エッセイ・返信を書く）

JSONで以下を返してください：
- "question": 完全な問題文（日本語のみ）
- "total_points": 配点合計
- "rubric": キー "a", "b", "c" それぞれに { "points": 数字, "criteria": 採点基準（日本語） }`
        : `Generate a realistic AP-style Free Response Question (FRQ) for ${effectiveSubject}${topic ? ` about: ${topic}` : ""}. 
      The question should be multi-part (a, b, c) and match the difficulty and format of the actual AP exam. Include a point rubric.
      Return JSON with:
      - "question": the full FRQ text with parts labeled (a), (b), (c)
      - "total_points": total points available
      - "rubric": object with keys "a", "b", "c" each containing { "points": number, "criteria": string }`,
      response_json_schema: {
        type: "object",
        properties: {
          question: { type: "string" },
          total_points: { type: "number" },
          rubric: { type: "object" },
        }
      }
    });
    
    // Convert AI-generated FRQ to exam format
    if (res) {
      // Build parts array from rubric for APFRQInterface compatibility
      const rubricParts = res.rubric ? Object.entries(res.rubric).map(([label, info]) => ({
        label,
        question: info?.criteria || "",
        points: info?.points || 0,
        rubric: info?.criteria || "",
      })) : [];
      setFrq({
        ...res,
        prompt: res.question,
        stimulus: null,
        parts: rubricParts,
      });
      setExamMode(true);
      setFrqResponses({});
    }
    setGenerating(false);
  };

  const gradeFRQ = async (responseText) => {
    const resp = responseText || userResponse;
    if (!resp.trim() || !frq) return;
    setGrading(true);
    setFeedback(null);
    const res = await gradeAPFRQ({ frq, responseText: resp, subject: effectiveSubject, userEmail: user?.email });
    setFeedback(res);
    setGrading(false);
    setExamMode(false);
    if (res) setShowScore(true);
    // Auto-save
    if (res && user?.email) {
      await db.entities.APSession.create({
        user_email: user.email,
        type: "frq",
        subject: effectiveSubject,
        frq_score_str: `${res.score}/${res.total}`,
        session_data: JSON.stringify({
          frqQuestion: (frq?.question || frq?.prompt || "")?.slice(0, 400),
          userResponse: (responseText || userResponse)?.slice(0, 800),
          score: res.score,
          total: res.total,
          overall_feedback: res.overall_feedback?.slice(0, 500),
          parts: res.parts?.map(p => ({ part: p.part, earned: p.earned, possible: p.possible, feedback: p.feedback?.slice(0, 200) })),
        }),
      });
      onSave();
      setSaved(true);
    }
  };

  // Handle submission from APFRQInterface
  const handleExamSubmit = () => {
    // Compile all responses
    const compiled = frq?.parts?.length
      ? frq.parts.map((p, pi) => frqResponses[`0_${pi}`] || "").join("\n\n")
      : (frqResponses["0_0"] || "");
    setUserResponse(compiled);
    gradeFRQ(compiled);
  };

  const pct = feedback ? Math.round((feedback.score / feedback.total) * 100) : 0;
  const frqPredictedScore = pct >= 75 ? 5 : pct >= 50 ? 4 : pct >= 41 ? 3 : pct >= 20 ? 2 : 1;

  // If FRQ is loaded and in exam mode, show the fullscreen FRQ interface
  if (examMode && frq) {
    return (
      <APFRQInterface
        frqQuestions={[frq]}
        subject={effectiveSubject}
        frqResponses={frqResponses}
        setFrqResponses={setFrqResponses}
        onSubmit={handleExamSubmit}
        onExit={() => { setExamMode(false); setFrq(null); setFrqResponses({}); setSaved(false); }}
        grading={grading}
      />
    );
  }

  // Show feedback review after grading
  if (feedback && !examMode) {
    return (
      <div className="space-y-4">
        {showScore && (
          <APScoreResult
            score={frqPredictedScore}
            subject={effectiveSubject}
            frqScore={`${feedback.score}/${feedback.total}`}
            onClose={() => setShowScore(false)}
            onRetake={() => { setShowScore(false); setFrq(null); setFeedback(null); setSaved(false); }}
          />
        )}
        {/* FRQ Detailed Feedback */}
        <div className="rounded-lg p-5 border bg-white" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-gray-800">FRQ Results</h3>
            <span className="text-2xl font-black" style={{ color: feedback.score / feedback.total >= 0.75 ? "#059669" : feedback.score / feedback.total >= 0.5 ? "#d97706" : "#dc2626" }}>
              {feedback.score}/{feedback.total}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {feedback.parts?.map((part, i) => (
              <div key={i} className="rounded-lg p-3 border" style={{ background: "#f8f9fa", borderColor: "rgba(0,0,0,0.08)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-gray-700">Part ({part.part})</span>
                  <span className="font-black text-sm" style={{ color: part.earned === part.possible ? "#059669" : part.earned > 0 ? "#d97706" : "#dc2626" }}>{part.earned}/{part.possible} pts</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{part.feedback}</p>
                {part.strong_points && <p className="text-xs mt-1.5 text-emerald-600">✓ {part.strong_points}</p>}
                {part.improvements && <p className="text-xs mt-1 text-amber-600">↑ {part.improvements}</p>}
              </div>
            ))}
          </div>
          {feedback.overall_feedback && (
            <div className="rounded-lg p-3 border mb-4" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <p className="text-xs font-semibold text-blue-700 mb-1">Overall Feedback</p>
              <p className="text-xs text-blue-800 leading-relaxed">{feedback.overall_feedback}</p>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setShowScore(true)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#1a56db" }}>
              View AP Score
            </button>
            <button onClick={() => { setFrq(null); setFeedback(null); setSaved(false); setShowScore(false); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50 transition-all text-gray-600"
              style={{ borderColor: "rgba(0,0,0,0.15)" }}>
              New FRQ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><PenLine className="w-4 h-4 text-pink-400" /> FRQ Practice</h3>
        <div className="space-y-3">
          {/* Mode selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "premade", label: "Premade", icon: "📋", sub: "Free · Official style" },
              { id: "ai", label: "AI Generated", icon: "✨", sub: "1 credit · Unique" },
              { id: "custom", label: "Custom Subject", icon: "✏️", sub: "Any topic" },
            ].map(m => (
              <button key={m.id} onClick={() => setFrqMode(m.id)}
                className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-xs font-semibold transition-all ${frqMode === m.id ? "border-pink-500/50 bg-pink-500/10 text-pink-400" : ""}`}
                style={frqMode !== m.id ? { borderColor: "var(--app-border)" } : {}}>
                <span className="text-base">{m.icon}</span>
                <span>{m.label}</span>
                <span className="text-[9px] font-normal opacity-60">{m.sub}</span>
              </button>
            ))}
          </div>

          {/* Subject selector (premade and ai modes) */}
          {frqMode !== "custom" && (
            <div>
              <label className="text-xs font-semibold mb-1 block" style={mutedStyle}>Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "#f8f9fa", border: "1px solid rgba(0,0,0,0.15)", color: "#1a1a2e" }}>
                {AP_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {frqMode === "premade" && !subjectHasPremadeFRQ && (
                <p className="text-[10px] mt-1 text-amber-400">No premade FRQs for this subject — switch to AI Generated.</p>
              )}
            </div>
          )}

          {/* Custom subject input */}
          {frqMode === "custom" && (
            <div>
              <label className="text-xs font-semibold mb-1 block" style={mutedStyle}>Subject / Course Name</label>
              <input value={customSubject} onChange={e => setCustomSubject(e.target.value)}
                placeholder="e.g. AP Environmental Science, IB History, Pre-Calculus..."
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "#f8f9fa", border: "1px solid rgba(0,0,0,0.15)", color: "#1a1a2e" }} />
            </div>
          )}

          {/* Topic (ai and custom modes) */}
          {frqMode !== "premade" && (
            <div>
              <label className="text-xs font-semibold mb-1 block" style={mutedStyle}>Specific Topic (optional)</label>
              <input value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="e.g. cellular respiration, derivatives, WWII causes..."
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "#f8f9fa", border: "1px solid rgba(0,0,0,0.15)", color: "#1a1a2e" }} />
            </div>
          )}

          <button
            onClick={frqMode === "premade" ? loadPremadeFRQ : generateFRQ}
            disabled={generating || (frqMode === "premade" && !subjectHasPremadeFRQ) || (frqMode === "custom" && !customSubject.trim())}
            className="w-full flex items-center justify-center gap-2 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: frqMode === "premade" ? "#059669" : "#db2777" }}>
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : frqMode === "premade" ? <BookOpen className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Generating FRQ..." : frqMode === "premade" ? "Load Premade FRQ" : "Generate FRQ (1 credit)"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AP MCQ Practice ──────────────────────────────────────────────────────────
function MCQTool({ user, onSave }) {
  const [subject, setSubject] = useState(AP_SUBJECTS[0]);
  const [count, setCount] = useState(20);
  const [questions, setQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [generating, setGenerating] = useState(false);
  const [expandedExpl, setExpandedExpl] = useState({});
  const [saved, setSaved] = useState(false);
  const [examMode, setExamMode] = useState(false);
  const [mode, setMode] = useState("premade"); // "premade" | "ai"
  const [showScore, setShowScore] = useState(false);
  const [finalPredictedScore, setFinalPredictedScore] = useState(null);
  const [finalPct, setFinalPct] = useState(null);

  const cardStyle = { background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", color: "#1a1a2e" };
  const mutedStyle = { color: "rgba(0,0,0,0.55)" };
  const subjectHasPremade = hasPremade(subject);

  const startPremade = () => {
    const qs = getPremadeMCQ(subject, count);
    if (!qs || qs.length === 0) return;
    setQuestions(qs);
    setSubmitted(false);
    setSubmittedAnswers({});
    setExpandedExpl({});
    setSaved(false);
    setExamMode(true);
  };

  const generateAI = async () => {
    setGenerating(true);
    setQuestions([]);
    setSubmitted(false);
    setSubmittedAnswers({});
    setExpandedExpl({});
    setSaved(false);
    const totalOnRealExam = AP_MCQ_COUNTS[subject] || 45;
    const isDataSubject = DATA_HEAVY_SUBJECTS.has(subject);
    const isGeoSubject = GEO_SUBJECTS.has(subject);
    const subjectContext = getSubjectContext(subject);
    
    const res = await callAI({
      feature: "ap_mcq",
      prompt: `You are writing EXACTLY ${count} multiple choice questions for ${subject}. You MUST return exactly ${count} questions — no more, no less.

SUBJECT-SPECIFIC CONTEXT (follow this precisely):
${subjectContext}

STIMULUS RULES — every question MUST have exactly one stimulus type:
${isDataSubject
  ? `- ~35%: chart_data — line or bar graph with REAL numeric data (named axes, real units, realistic values for ${subject})\n- ~35%: table_data — data table with REAL values (specific countries, cities, measurements, years)\n- ~30%: stimulus — experimental setup, scenario, or excerpt (3-6 sentences with real context)`
  : isGeoSubject
  ? `- ~15%: chart_data — demographic/economic graphs (DTM stages, urbanization trends, remittance data)
- ~20%: table_data — comparative data tables with named countries/regions and real statistics
- ~35%: map_description — IMPORTANT: choose the correct visual for the topic:
    * Population topics (DTM, age structure, fertility): use "population pyramid" in description — e.g. "A population pyramid for Niger (2022) showing a wide base at ages 0-4 (male 8.2%, female 7.9%) narrowing sharply at age 15, representing Stage 2 of the DTM with high TFR of 6.9"
    * Agricultural land use (Von Thünen, bid rent): use "von thunen" or "thunen" in description — e.g. "A Von Thünen model diagram showing concentric rings around a central market: innermost ring = dairy/market gardening, then forestry, then grain crops, outermost = ranching"
    * Urban models (Burgess, Hoyt): use "burgess" or "concentric zone" in description
    * Geographic distributions (TFR by country, HDI, language families, migration flows): describe a choropleth or flow map with specific named countries and color coding
    * NEVER describe a "world map" for population pyramid topics — use pyramid description instead
- ~30%: stimulus — primary source excerpt, policy text, or scenario passage (4-8 sentences with real attribution)`
  : `- ~20%: table_data — comparison/data tables with named real examples\n- ~10%: chart_data — graphs where relevant to ${subject}\n- ~70%: stimulus — primary source quote, document excerpt, or scenario (4-8 sentences with real source attribution)`
}

COGNITIVE COMPLEXITY RULES (College Board level — most questions must be Apply/Analyze/Evaluate):
- Questions must require multi-step inference.
- Distractors must be HIGHLY plausible.
- Mix of easy (20%), medium (50%), and hard (30%) difficulties.
- Vary topics evenly across the FULL ${subject} curriculum (${totalOnRealExam} questions on real exam).
- Use REAL named places, real data values, real people/events.

Return JSON with "questions" array. Each question object:
- "question", "stimulus" (null if chart/table/map present), "stimulus_source", "stimulus_header"
- "options": EXACTLY 4 strings, no letter prefix
- "correct": integer 0-3
- "explanation": 2-3 sentence AP-level explanation
- "skill": specific AP skill or unit
- "difficulty": "easy" | "medium" | "hard"
- "table_data": null OR { "headers": string[], "rows": string[][] }
- "chart_data": null OR { "type": "bar"|"line", "title": string, "data": [{...}], "x_key": string, "y_keys": string[], "x_label": string, "y_label": string }
- "map_description": null OR detailed text description of a real geographic map`,
      response_json_schema: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                stimulus: { type: "string" },
                stimulus_source: { type: "string" },
                stimulus_header: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correct: { type: "number" },
                explanation: { type: "string" },
                skill: { type: "string" },
                difficulty: { type: "string" },
                table_data: { type: "object" },
                chart_data: { type: "object" },
                map_description: { type: "string" },
              }
            }
          }
        }
      }
    });
    setQuestions(res?.questions || []);
    setGenerating(false);
    setExamMode(true);
  };

  const handleSubmit = async (answers) => {
    setSubmittedAnswers(answers);
    setSubmitted(true);
    setExamMode(false);
    const correct = questions.filter((q, i) => answers[i] === q.correct).length;
    const pct = Math.round((correct / questions.length) * 100);
    const predicted = pct >= 75 ? 5 : pct >= 50 ? 4 : pct >= 41 ? 3 : pct >= 20 ? 2 : 1;
    setFinalPct(pct);
    setFinalPredictedScore(predicted);
    setShowScore(true);
    if (user?.email) {
      await db.entities.APSession.create({
        user_email: user.email,
        type: "mcq",
        subject,
        mcq_pct: pct,
        session_data: JSON.stringify({
          answers,
          questions: questions.map(q => ({ question: q.question?.slice(0, 200), correct: q.correct, skill: q.skill, explanation: q.explanation?.slice(0, 300) })),
        }),
      });
      onSave();
      setSaved(true);
    }
  };

  // Show exam interface
  if (examMode && questions.length > 0) {
    return <APMCQInterface questions={questions} subject={subject} onSubmit={handleSubmit} onBack={() => { setExamMode(false); setQuestions([]); }} />;
  }

  const correct = questions.filter((q, i) => submittedAnswers[i] === q.correct).length;
  const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
  const scoreColor = pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-red-400";
  const predictedScore = pct >= 75 ? 5 : pct >= 50 ? 4 : pct >= 41 ? 3 : pct >= 20 ? 2 : 1;
  const apScoreColor = { 5: "text-emerald-400", 4: "text-blue-400", 3: "text-amber-400", 2: "text-orange-400", 1: "text-red-400" };

  return (
    <div className="space-y-4">
      {showScore && finalPredictedScore != null && (
        <APScoreResult
          score={finalPredictedScore}
          subject={subject}
          mcqPct={finalPct}
          onClose={() => setShowScore(false)}
          onRetake={() => { setShowScore(false); setQuestions([]); setSubmitted(false); setSaved(false); setFinalPredictedScore(null); }}
        />
      )}
      {!submitted && (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-blue-400" /> AP MCQ Practice</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={mutedStyle}>Subject</label>
              <select value={subject} onChange={e => { setSubject(e.target.value); setMode(hasPremade(e.target.value) ? "premade" : "ai"); }}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "#f8f9fa", border: "1px solid rgba(0,0,0,0.15)", color: "#1a1a2e" }}>
                {AP_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <p className="text-xs mt-1" style={mutedStyle}>
                Real AP exam: <strong>{AP_MCQ_COUNTS[subject] || 45} MCQs</strong>
                {DATA_HEAVY_SUBJECTS.has(subject) && " · Graphs & tables included"}
                {subjectHasPremade && <span className="text-emerald-400"> · {getPremadeMCQCount(subject)} premade questions available</span>}
              </p>
            </div>

            {/* Question count slider: 20–60 */}
            <div>
              <label className="text-xs font-semibold mb-2 block" style={mutedStyle}>
                Question Count: <span className="text-blue-400 font-black">{count}</span>
              </label>
              <input type="range" min={20} max={60} step={5} value={count} onChange={e => setCount(Number(e.target.value))}
                className="w-full accent-blue-500" />
              <div className="flex justify-between text-[10px] mt-0.5" style={mutedStyle}>
                <span>20 (quick)</span><span>40 (standard)</span><span>60 (full)</span>
              </div>
            </div>

            {/* Mode selector */}
            <div>
              <label className="text-xs font-semibold mb-2 block" style={mutedStyle}>Question Source</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("premade")}
                  disabled={!subjectHasPremade}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-all disabled:opacity-30 ${mode === "premade" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : ""}`}
                  style={mode !== "premade" ? { borderColor: "var(--app-border)" } : {}}>
                  <BookOpen className="w-4 h-4" />
                  <span>Premade</span>
                  <span className="text-[9px] font-normal opacity-70">Free · AP Classroom style</span>
                </button>
                <button
                  onClick={() => setMode("ai")}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-all ${mode === "ai" ? "border-violet-500/50 bg-violet-500/10 text-violet-400" : ""}`}
                  style={mode !== "ai" ? { borderColor: "var(--app-border)" } : {}}>
                  <Sparkles className="w-4 h-4" />
                  <span>AI Generated</span>
                  <span className="text-[9px] font-normal opacity-70">Uses 1 credit · Unique each time</span>
                </button>
              </div>
              {!subjectHasPremade && mode === "premade" && (
                <p className="text-[10px] mt-1.5 text-amber-400">No premade bank yet for this subject — using AI generation.</p>
              )}
            </div>

            <button
              onClick={mode === "premade" && subjectHasPremade ? startPremade : generateAI}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: mode === "premade" && subjectHasPremade ? "#059669" : "#2563eb" }}>
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "premade" && subjectHasPremade ? <BookOpen className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {generating ? `Generating ${count} questions...` : mode === "premade" && subjectHasPremade ? `Start ${count}-Question Premade Set` : `Generate ${count} AI Questions (1 credit)`}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={cardStyle}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-800">{correct}/{questions.length} correct · {pct}%</p>
                {saved && <p className="text-xs text-emerald-500 mt-0.5">✓ Saved to review history</p>}
              </div>
              <button onClick={() => setShowScore(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: "#1a56db" }}>
                View AP Score
              </button>
            </div>
            <button onClick={() => { setQuestions([]); setSubmitted(false); setSaved(false); setShowScore(false); setFinalPredictedScore(null); }} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
              <RotateCcw className="w-4 h-4" /> New Set
            </button>
          </div>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const isRight = submittedAnswers[i] === q.correct;
              return (
                <div key={i} className="rounded-2xl p-4" style={cardStyle}>
                  <div className="flex items-start gap-2 mb-2">
                    {isRight ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                    <p className="text-sm leading-relaxed">{q.question}</p>
                  </div>
                  <div className="space-y-1.5 ml-6">
                    {q.options.map((opt, j) => {
                      let cls = "opacity-30";
                      if (j === q.correct) cls = "text-emerald-400";
                      else if (submittedAnswers[i] === j) cls = "text-red-400";
                      return <div key={j} className={`flex items-center gap-2 text-xs ${cls}`}><span className="font-bold w-4">({LETTERS[j]})</span><span>{opt}</span></div>;
                    })}
                  </div>
                  {q.explanation && (<div className="mt-2 ml-6"><button onClick={() => setExpandedExpl(prev => ({ ...prev, [i]: !prev[i] }))} className="text-[10px] font-semibold text-violet-400 flex items-center gap-1">{expandedExpl[i] ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />} Explanation</button>{expandedExpl[i] && <p className="text-xs mt-1 leading-relaxed text-gray-500">{q.explanation}</p>}</div>)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AP Exam Simulator ────────────────────────────────────────────────────────
function ExamSimulator({ user, onSave }) {
  const [subject, setSubject] = useState(AP_SUBJECTS[0]);
  const [mcqCount, setMcqCount] = useState(20);
  const [mode, setMode] = useState("premade");
  const [phase, setPhase] = useState("setup");
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [frqQuestions, setFrqQuestions] = useState([]);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [frqResponses, setFrqResponses] = useState({});
  const [results, setResults] = useState(null);
  const [grading, setGrading] = useState(false);
  const [showMcqReview, setShowMcqReview] = useState(false);
  const [expandedExpl, setExpandedExpl] = useState({});
  const [showScoreResult, setShowScoreResult] = useState(false);
  
  // Mobile Tab State for Results View: 'summary' | 'mcq' | 'frq'
  const [mobileTab, setMobileTab] = useState("summary");

  const cardStyle = { background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", color: "#1a1a2e" };
  const mutedStyle = { color: "rgba(0,0,0,0.55)" };
  const subjectHasPremade = hasPremade(subject);

  const startPremadeExam = () => {
    const qs = getPremadeMCQ(subject, mcqCount);
    const premadeFRQs = getPremadeFRQ(subject);
    if (!qs || qs.length === 0) { startAIExam(); return; }
    setMcqQuestions(qs);
    const frqs = premadeFRQs ? premadeFRQs.map(f => ({
      prompt: f.title || f.prompt,
      stimulus: f.stimulus,
      parts: (f.parts || []).map(p => ({ ...p, label: p.label || p.part || "?", part: p.label || p.part || "?" }))
    })) : [];
    setFrqQuestions(frqs);
    setPhase("mcq");
  };

  const startAIExam = async () => {
    setPhase("generating");
    incrementAiUsage(user?.email, false, 3);
    const isDataSubject = DATA_HEAVY_SUBJECTS.has(subject);
    const isGeoSubject = GEO_SUBJECTS.has(subject);
    
    const [mcqRes, frqRes] = await Promise.all([
      callAI({
        feature: "ap_exam_mcq",
        prompt: `Write EXACTLY ${mcqCount} AP-exam-level MCQs for ${subject}. ${getSubjectContext(subject)}
STIMULUS: ${isDataSubject ? "~35% chart_data, ~35% table_data, ~30% stimulus" : isGeoSubject ? "~15% chart_data, ~20% table_data, ~35% map_description (use 'population pyramid' for age/DTM topics, 'von thunen'/'thunen' for agricultural models, 'burgess' for urban models, choropleth maps for geographic distributions — NEVER use a world map for pyramid topics), ~30% stimulus" : "~20% table_data, ~10% chart_data, ~70% stimulus"}.
Mix: 20% easy, 50% medium, 30% hard. REAL data/named places.
Return JSON "questions": question, stimulus, stimulus_source, stimulus_header, options(4), correct(0-3), explanation, skill, difficulty, table_data, chart_data, map_description.`,
        response_json_schema: { 
          type: "object", 
          properties: { 
            questions: { type: "array", items: { type: "object" } } 
          } 
        }
      }),
      callAI({
        feature: "ap_exam_frq",
        prompt: `Generate 2 official AP-style FRQs for ${subject}. Multi-part (a,b,c), College Board difficulty.
Return JSON "frqs": prompt, parts(array of items)`,
        response_json_schema: {
          type: "object",
          properties: {
            frqs: { type: "array", items: { type: "object" } }
          }
        }
      })
    ]);
    
    setMcqQuestions(mcqRes?.questions || []);
    setFrqQuestions(frqRes?.frqs || []);
    setPhase("mcq");
  };

  const startExam = () => (mode === "premade" && subjectHasPremade) ? startPremadeExam() : startAIExam();

  const gradeExam = async () => {
    setGrading(true);
    incrementAiUsage(user?.email, false, 1);
    const mcqCorrect = mcqQuestions.filter((q, i) => mcqAnswers[i] === q.correct).length;
    const mcqPct = mcqQuestions.length > 0 ? Math.round((mcqCorrect / mcqQuestions.length) * 100) : 0;

    const compiledResponses = frqQuestions.map((frq, fi) => {
      if (frq.parts?.length) {
        return frq.parts.map((p, pi) => frqResponses[`${fi}_${pi}`] || "").join("\n\n");
      }
      return frqResponses[`${fi}_0`] || "";
    });

    const frqGrade = await callAI({
      feature: "ap_exam_grade",
      prompt: `Grade these AP ${subject} FRQ responses. For each FRQ give a score out of 10 and 2-3 sentences of specific feedback.
${frqQuestions.map((frq, i) => `FRQ ${i+1}: ${frq.prompt || frq.title}\nStudent response: ${compiledResponses[i] || "(no response)"}`).join("\n\n")}
Return JSON "frqs" array, each: { "score": number (0-10), "feedback": string }`,
      response_json_schema: { type: "object", properties: { frqs: { type: "array", items: { type: "object" } } } }
    });

    const frqTotal = (frqGrade?.frqs || []).reduce((s, f) => s + (f.score || 0), 0);
    const frqMax = frqQuestions.length * 10;
    const composite = Math.round((mcqPct * 0.5) + ((frqTotal / frqMax) * 50));
    const apScore = composite >= 75 ? 5 : composite >= 50 ? 4 : composite >= 41 ? 3 : composite >= 20 ? 2 : 1;

    const r = { mcqCorrect, mcqTotal: mcqQuestions.length, mcqPct, frqGrades: frqGrade?.frqs || [], frqTotal, frqMax, composite, apScore };
    setResults(r);
    setGrading(false);
    setPhase("results");
    setShowScoreResult(true);

    if (user?.email) {
      await db.entities.APSession.create({
        user_email: user.email, type: "exam", subject, ap_score: apScore, mcq_pct: mcqPct,
        frq_score_str: `${frqTotal}/${frqMax}`,
        session_data: JSON.stringify({
          results: r,
          frqSummary: frqQuestions.map((frq, i) => ({ prompt: frq.prompt || frq.title, response: compiledResponses[i]?.slice(0, 500) || "" })),
          frqGrades: frqGrade?.frqs || [],
          mcqSummary: mcqQuestions.map((q, i) => ({ question: q.question?.slice(0, 200), correct: q.correct, answered: mcqAnswers[i], skill: q.skill })),
        }),
      });
      onSave();
    }
  };

  const reset = () => { 
    setPhase("setup"); 
    setMcqQuestions([]); 
    setFrqQuestions([]); 
    setMcqAnswers({}); 
    setFrqResponses({}); 
    setResults(null); 
    setShowMcqReview(false); 
    setExpandedExpl({});
    setMobileTab("summary");
  };

  // Fullscreen phases
  if (phase === "mcq" && mcqQuestions.length > 0) {
    return <APMCQInterface questions={mcqQuestions} subject={subject}
      onSubmit={(answers) => { setMcqAnswers(answers); setPhase("section_break"); }}
      onBack={() => setPhase("setup")} />;
  }
  if (phase === "section_break") {
    return <SectionBreakScreen subject={subject} mcqCount={mcqQuestions.length} frqCount={frqQuestions.length}
      onContinue={() => setPhase("frq")} onExit={reset} />;
  }
  if (phase === "frq" && frqQuestions.length > 0) {
    return <APFRQInterface frqQuestions={frqQuestions} subject={subject}
      frqResponses={frqResponses} setFrqResponses={setFrqResponses}
      onSubmit={gradeExam} onExit={reset} grading={grading} />;
  }

  // Helper renderers for results
  const renderSummarySection = () => (
    <div className="space-y-4">
      <div className="rounded-lg p-4 md:p-6 text-center border" style={{ background: "#f5f3ff", borderColor: "#ddd6fe" }}>
        <p className="text-xs font-semibold mb-2 text-gray-500">Predicted AP Score</p>
        <div className="text-6xl md:text-7xl font-black mb-2" style={{ color: { 5: "#059669", 4: "#1a56db", 3: "#d97706", 2: "#ea580c", 1: "#dc2626" }[results.apScore] || "#7c3aed" }}>
          {results.apScore}
        </div>
        <p className="text-sm font-bold mb-1 text-gray-700">
          {results.apScore >= 4 ? "Qualified for College Credit" : results.apScore === 3 ? "Possibly Qualified" : "Needs Improvement"}
        </p>
        <p className="text-xs text-gray-500">Composite: {results.composite}/100</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 text-center" style={cardStyle}>
          <p className="text-xs" style={mutedStyle}>MCQ Score</p>
          <p className="text-xl md:text-2xl font-black text-blue-400">{results.mcqPct}%</p>
          <p className="text-xs" style={mutedStyle}>{results.mcqCorrect}/{results.mcqTotal} correct</p>
        </div>
        <div className="rounded-2xl p-4 text-center" style={cardStyle}>
          <p className="text-xs" style={mutedStyle}>FRQ Score</p>
          <p className="text-xl md:text-2xl font-black text-pink-400">{results.frqTotal}/{results.frqMax}</p>
          <p className="text-xs" style={mutedStyle}>{Math.round((results.frqTotal / results.frqMax) * 100)}%</p>
        </div>
      </div>
    </div>
  );

  const renderFrqFeedbackSection = () => (
    <div className="space-y-3">
      {results.frqGrades.map((g, i) => (
        <div key={i} className="rounded-lg p-4 border bg-white" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-sm text-gray-700">FRQ {i + 1} — AI Feedback</p>
            <span className="font-black text-base md:text-lg" style={{ color: g.score >= 7 ? "#059669" : g.score >= 5 ? "#d97706" : "#dc2626" }}>
              {g.score}/10
            </span>
          </div>
          <p className="text-xs leading-relaxed text-gray-500">{g.feedback}</p>
        </div>
      ))}
    </div>
  );

  const renderMcqReviewSection = () => (
    <div className="space-y-3">
      {mcqQuestions.map((q, i) => (
        <div key={i} className="rounded-lg p-3.5 md:p-4 bg-white border" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
          <p className="text-xs font-semibold mb-1 text-gray-400">Q{i + 1}{q.difficulty ? ` · ${q.difficulty}` : ""}</p>
          <p className="text-xs md:text-sm mb-3 leading-relaxed text-gray-700">{q.question}</p>
          <div className="space-y-1.5">
            {(q.options || []).map((opt, j) => {
              let cls = "border opacity-40 text-gray-400";
              if (j === q.correct) cls = "border-emerald-500 bg-emerald-50 text-emerald-700 opacity-100";
              else if (mcqAnswers[i] === j) cls = "border-red-400 bg-red-50 text-red-600 opacity-100";
              return (
                <div key={j} className={`flex items-start md:items-center gap-2.5 px-3 py-2 rounded-xl text-xs border ${cls}`}
                  style={{ borderColor: (j !== q.correct && mcqAnswers[i] !== j) ? "var(--app-border)" : undefined }}>
                  <span className="font-bold w-4 shrink-0 font-mono">({LETTERS[j]})</span>
                  <span className="break-words flex-1">{opt}</span>
                  {j === q.correct && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0 mt-0.5 md:mt-0" />}
                  {mcqAnswers[i] === j && j !== q.correct && <XCircle className="w-3.5 h-3.5 text-red-400 ml-auto shrink-0 mt-0.5 md:mt-0" />}
                </div>
              );
            })}
          </div>
          {q.explanation && (
            <div className="mt-2">
              <button onClick={() => setExpandedExpl(prev => ({ ...prev, [i]: !prev[i] }))}
                className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors py-1">
                {expandedExpl[i] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} Explanation
              </button>
              {expandedExpl[i] && <p className="mt-2 text-xs leading-relaxed rounded-xl p-3 text-gray-500" style={{ background: "#f8f9fa" }}>{q.explanation}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 max-w-full overflow-hidden px-1 sm:px-0">
      {phase === "setup" && (
        <div className="rounded-2xl p-4 md:p-5" style={cardStyle}>
          <h3 className="font-bold text-sm mb-1 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-violet-400" /> Full AP Exam Simulation</h3>
          <p className="text-xs mb-4" style={mutedStyle}>Section I (MCQ) + Section II (FRQ) → predicted AP score 1–5</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={mutedStyle}>Subject</label>
              <select value={subject} onChange={e => { setSubject(e.target.value); setMode(hasPremade(e.target.value) ? "premade" : "ai"); }}
                className="w-full px-3 py-2.5 rounded-xl text-xs md:text-sm outline-none touch-manipulation"
                style={{ background: "#f8f9fa", border: "1px solid rgba(0,0,0,0.15)", color: "#1a1a2e" }}>
                {AP_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* MCQ count slider */}
            <div>
              <label className="text-xs font-semibold mb-1 block" style={mutedStyle}>
                Section I: <span className="text-violet-400 font-black">{mcqCount} MCQs</span>
              </label>
              <input type="range" min={20} max={60} step={5} value={mcqCount} onChange={e => setMcqCount(Number(e.target.value))}
                className="w-full accent-violet-500 h-2 touch-none" />
              <div className="flex justify-between text-[10px] mt-0.5" style={mutedStyle}>
                <span>20</span><span>40</span><span>60</span>
              </div>
            </div>

            {/* Mode selector */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMode("premade")} disabled={!subjectHasPremade}
                className={`flex flex-col items-center justify-center gap-1 px-2 md:px-3 py-2.5 md:py-3 rounded-xl border text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-30 ${mode === "premade" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600" : ""}`}
                style={mode !== "premade" ? { borderColor: "rgba(0,0,0,0.1)" } : {}}>
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Premade</span>
                <span className="text-[9px] opacity-70">Free · Official</span>
              </button>
              <button onClick={() => setMode("ai")}
                className={`flex flex-col items-center justify-center gap-1 px-2 md:px-3 py-2.5 md:py-3 rounded-xl border text-xs font-semibold transition-all active:scale-[0.98] ${mode === "ai" ? "border-violet-500/50 bg-violet-500/10 text-violet-600" : ""}`}
                style={mode !== "ai" ? { borderColor: "rgba(0,0,0,0.1)" } : {}}>
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>AI Generated</span>
                <span className="text-[9px] opacity-70">3 credits · Unique</span>
              </button>
            </div>

            <div className="rounded-xl p-3 text-xs space-y-1 text-gray-500" style={{ background: "#f0f0f0" }}>
              <p>📝 Section I: {mcqCount} MCQs{DATA_HEAVY_SUBJECTS.has(subject) ? " (graphs & tables)" : ""}</p>
              <p>✍️ Section II: 2 Free Response Questions</p>
              <p>🎯 Predicted AP Score 1–5 with detailed feedback</p>
              {mode === "ai" && <p>⚡ Uses 3 AI credits</p>}
              {mode === "premade" && subjectHasPremade && <p>✅ Free — no AI credits used</p>}
            </div>
            <button onClick={startExam}
              className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold text-xs md:text-sm active:scale-[0.99] transition-all touch-manipulation"
              style={{ background: mode === "premade" && subjectHasPremade ? "#059669" : "#7c3aed" }}>
              {mode === "premade" && subjectHasPremade ? <BookOpen className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {mode === "premade" && subjectHasPremade ? "Start Premade Exam" : "Generate AI Exam (3 credits)"}
            </button>
          </div>
        </div>
      )}

      {phase === "generating" && (
        <div className="rounded-2xl p-8 md:p-10 text-center" style={cardStyle}>
          <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-violet-500 animate-spin mx-auto mb-3" />
          <p className="font-semibold text-sm md:text-base">Building your {subject} exam...</p>
          <p className="text-xs mt-1" style={mutedStyle}>Generating {mcqCount} MCQs + 2 FRQs</p>
        </div>
      )}

      {phase === "results" && results && showScoreResult && (
        <APScoreResult
          score={results.apScore}
          subject={subject}
          mcqPct={results.mcqPct}
          frqScore={`${results.frqTotal}/${results.frqMax}`}
          onClose={() => setShowScoreResult(false)}
          onRetake={reset}
        />
      )}

      {phase === "results" && results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-emerald-500 font-medium">✓ Saved to history</p>
            {!showScoreResult && (
              <button onClick={() => setShowScoreResult(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all active:scale-95"
                style={{ background: "#7c3aed" }}>
                View AP Score
              </button>
            )}
          </div>

          {/* MOBILE NAVIGATION TABS */}
          <div className="md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm pt-1 pb-2">
            <div className="flex rounded-xl bg-gray-100 p-1 border text-xs font-bold gap-1" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <button
                onClick={() => setMobileTab("summary")}
                className={`flex-1 py-2 rounded-lg transition-all text-center touch-manipulation ${mobileTab === "summary" ? "bg-white text-violet-600 shadow-sm" : "text-gray-500"}`}
              >
                Summary
              </button>
              <button
                onClick={() => setMobileTab("frq")}
                className={`flex-1 py-2 rounded-lg transition-all text-center touch-manipulation ${mobileTab === "frq" ? "bg-white text-violet-600 shadow-sm" : "text-gray-500"}`}
              >
                FRQ Grades
              </button>
              <button
                onClick={() => setMobileTab("mcq")}
                className={`flex-1 py-2 rounded-lg transition-all text-center touch-manipulation ${mobileTab === "mcq" ? "bg-white text-violet-600 shadow-sm" : "text-gray-500"}`}
              >
                MCQs
              </button>
            </div>
          </div>

          {/* MOBILE CONTENT DISPLAY */}
          <div className="md:hidden">
            {mobileTab === "summary" && renderSummarySection()}
            {mobileTab === "frq" && renderFrqFeedbackSection()}
            {mobileTab === "mcq" && renderMcqReviewSection()}
          </div>

          {/* DESKTOP CONTENT DISPLAY */}
          <div className="hidden md:block space-y-4">
            {renderSummarySection()}
            {renderFrqFeedbackSection()}
            
            <button onClick={() => setShowMcqReview(o => !o)}
              className="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-semibold transition-all hover:bg-gray-50" style={cardStyle}>
              <span>Review MCQ Answers & Explanations</span>
              {showMcqReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showMcqReview && renderMcqReviewSection()}
          </div>

          <button onClick={reset} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs md:text-sm active:scale-[0.99] transition-all touch-manipulation" style={cardStyle}>
            <RotateCcw className="w-4 h-4" /> Take Another Exam
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Session Review Panel ─────────────────────────────────────────────────────
function ReviewHistory({ user, refreshKey }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [expandedMcq, setExpandedMcq] = useState({});

  const cardStyle = { background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", color: "#1a1a2e" };
  const mutedStyle = { color: "rgba(0,0,0,0.55)" };

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    db.entities.APSession.filter({ user_email: user.email }, "-created_date", 50)
      .then(s => { setSessions(s); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user?.email, refreshKey]);

  const deleteSession = async (id) => {
    await db.entities.APSession.delete(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const typeLabel = { frq: "FRQ", mcq: "MCQ", exam: "Exam" };
  const typeColorStyle = {
    frq:  { color: "#db2777", background: "#fdf2f8", border: "1px solid #fbcfe8" },
    mcq:  { color: "#1a56db", background: "#eff6ff", border: "1px solid #bfdbfe" },
    exam: { color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ddd6fe" },
  };
  const apScoreColors = { 5: "#059669", 4: "#1a56db", 3: "#d97706", 2: "#ea580c", 1: "#dc2626" };
  const innerBg = "#f8f9fa";
  const innerBorder = "1px solid rgba(0,0,0,0.08)";

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>;
  if (sessions.length === 0) return (
    <div className="text-center py-14 rounded-lg border bg-white" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
      <History className="w-10 h-10 mx-auto mb-3 text-gray-300" />
      <p className="font-bold mb-1 text-gray-700">No sessions yet</p>
      <p className="text-sm text-gray-500">Complete an FRQ, MCQ set, or full exam to see your history here.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {sessions.map(s => {
        const data = s.session_data ? (() => { try { return JSON.parse(s.session_data); } catch { return null; } })() : null;
        const isOpen = expanded === s.id;
        const tStyle = typeColorStyle[s.type] || typeColorStyle.frq;
        return (
          <div key={s.id} className="rounded-lg overflow-hidden bg-white border" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
            {/* Header row */}
            <button className="w-full flex items-center gap-3 px-5 py-4 text-left transition-all hover:bg-gray-50"
              onClick={() => setExpanded(isOpen ? null : s.id)}>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style={tStyle}>{typeLabel[s.type] || s.type}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-gray-800">{s.subject}</p>
                <p className="text-xs text-gray-400">{new Date(s.created_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
              <div className="text-right shrink-0">
                {s.type === "exam" && s.ap_score && <p className="text-xl font-black" style={{ color: apScoreColors[s.ap_score] || "#7c3aed" }}>{s.ap_score}</p>}
                {s.type === "mcq" && s.mcq_pct != null && <p className="text-lg font-black text-blue-600">{s.mcq_pct}%</p>}
                {s.type === "frq" && s.frq_score_str && <p className="text-lg font-black text-pink-600">{s.frq_score_str}</p>}
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
            </button>

            {/* Expanded review */}
            {isOpen && data && (
              <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <div className="pt-4" />

                {/* FRQ review (new compact format) */}
                {s.type === "frq" && (
                  <>
                    {data.frqQuestion && (
                      <div>
                        <p className="text-xs font-semibold mb-2 text-pink-600">FRQ Question</p>
                        <div className="text-xs leading-relaxed whitespace-pre-wrap rounded-lg p-3 text-gray-700" style={{ background: innerBg, border: innerBorder }}>{data.frqQuestion}</div>
                      </div>
                    )}
                    {data.userResponse && (
                      <div>
                        <p className="text-xs font-semibold mb-2 text-gray-500">Your Response</p>
                        <div className="text-xs leading-relaxed whitespace-pre-wrap rounded-lg p-3 text-gray-600" style={{ background: innerBg, border: innerBorder }}>{data.userResponse}</div>
                      </div>
                    )}
                    {(data.score != null) && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-purple-600">AI Grading — {data.score}/{data.total}</p>
                        {data.parts?.map((part, pi) => (
                          <div key={pi} className="rounded-lg p-3 space-y-1" style={{ background: innerBg, border: innerBorder }}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-gray-700">Part ({part.part})</span>
                              <span className="text-xs font-bold" style={{ color: part.earned === part.possible ? "#059669" : part.earned > 0 ? "#d97706" : "#dc2626" }}>{part.earned}/{part.possible}</span>
                            </div>
                            <p className="text-xs text-gray-500">{part.feedback}</p>
                          </div>
                        ))}
                        {data.overall_feedback && (
                          <div className="rounded-lg p-3" style={{ background: innerBg, border: innerBorder }}>
                            <p className="text-xs font-semibold mb-1 text-gray-500">Overall Feedback</p>
                            <p className="text-xs leading-relaxed text-gray-700">{data.overall_feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* MCQ review */}
                {s.type === "mcq" && data.questions && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-blue-600">{data.questions.length} Questions · {s.mcq_pct}% correct</p>
                    {data.questions.map((q, i) => {
                      const userAnswer = data.answers?.[i];
                      const isCorrect = userAnswer === q.correct;
                      return (
                        <div key={i} className="rounded-lg p-3 space-y-2" style={{ background: innerBg, border: innerBorder }}>
                          <div className="flex items-start gap-2">
                            {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />}
                            <p className="text-xs font-medium leading-relaxed text-gray-700">{q.question}</p>
                          </div>
                          {q.explanation && (
                            <div>
                              <button onClick={() => setExpandedMcq(prev => ({ ...prev, [`${s.id}_${i}`]: !prev[`${s.id}_${i}`] }))}
                                className="text-[10px] font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">
                                {expandedMcq[`${s.id}_${i}`] ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                                Explanation
                              </button>
                              {expandedMcq[`${s.id}_${i}`] && <p className="text-xs mt-1 leading-relaxed text-gray-500">{q.explanation}</p>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Exam review */}
                {s.type === "exam" && data.results && (
                  <div className="space-y-4">
                    <div className="text-center rounded-lg p-4 border" style={{ background: "#f5f3ff", borderColor: "#ddd6fe" }}>
                      <p className="text-xs text-gray-500 mb-1">Predicted AP Score</p>
                      <div className="text-5xl font-black" style={{ color: apScoreColors[data.results.apScore] || "#7c3aed" }}>{data.results.apScore}</div>
                      <p className="text-xs mt-1 text-gray-500">MCQ: {data.results.mcqPct}% · FRQ: {data.results.frqTotal}/{data.results.frqMax}</p>
                    </div>
                    {data.frqGrades?.map((g, i) => (
                      <div key={i} className="rounded-lg p-3" style={{ background: innerBg, border: innerBorder }}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-xs text-gray-700">FRQ {i + 1} Feedback</p>
                          <span className="font-black text-sm" style={{ color: g.score >= 7 ? "#059669" : g.score >= 5 ? "#d97706" : "#dc2626" }}>{g.score}/10</span>
                        </div>
                        <p className="text-xs text-gray-500">{g.feedback}</p>
                      </div>
                    ))}
                    {data.mcqSummary && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">{data.mcqSummary.length} MCQ Answers</p>
                        <div className="space-y-1.5">
                          {data.mcqSummary.map((q, i) => {
                            const isCorrect = q.answered === q.correct;
                            return (
                              <div key={i} className="flex items-start gap-2 rounded-lg p-2" style={{ background: innerBg, border: innerBorder }}>
                                {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />}
                                <p className="text-xs text-gray-600 leading-relaxed">{q.question}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button onClick={() => deleteSession(s.id)}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete this session
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── AP CS Code Project Grader ───────────────────────────────────────────────
const CS_SUBJECTS = ["AP Computer Science A", "AP Computer Science Principles", "Other CS / Coding Class"];

function CodeProjectGrader({ user, onSave }) {
  const [subject, setSubject] = useState(CS_SUBJECTS[0]);
  const [projectDesc, setProjectDesc] = useState("");
  const [code, setCode] = useState("");
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const fileRef = useRef(null);

  const cardStyle = { background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", color: "#1a1a2e" };
  const mutedStyle = { color: "rgba(0,0,0,0.55)" };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileUploading(true);
    const text = await file.text();
    setCode(text.slice(0, 8000));
    setFileUploading(false);
  };

  const grade = async () => {
    if (!code.trim() && !projectDesc.trim()) return;
    setGrading(true);
    setResult(null);
    incrementAiUsage(user?.email, false, 2);
    const res = await callAI({ feature: "ap_cs_grader",
      prompt: `You are an AP Computer Science exam grader. Grade this student's coding project on the AP exam scale (1–5).

Subject: ${subject}
Project Description / Purpose: ${projectDesc || "(not provided)"}
Code Submitted:
\`\`\`
${code.slice(0, 6000)}
\`\`\`

Evaluate based on the AP CS rubric criteria:
1. Program Function & Purpose (does it work as described?)
2. Data Abstraction (meaningful use of lists/data structures)
3. Managing Complexity (how the data structure manages complexity)
4. Procedural Abstraction (student-developed procedures/functions)
5. Algorithm Implementation (sequencing, selection, iteration)
6. Testing (would the code handle different inputs?)

Return JSON:
{
  "ap_score": number (1-5),
  "composite": number (0-100),
  "criteria": [
    { "name": string, "score": number (0-4), "max": 4, "feedback": string }
  ],
  "strengths": string,
  "improvements": string,
  "overall_feedback": string
}`,
      response_json_schema: {
        type: "object",
        properties: {
          ap_score: { type: "number" },
          composite: { type: "number" },
          criteria: { type: "array", items: { type: "object" } },
          strengths: { type: "string" },
          improvements: { type: "string" },
          overall_feedback: { type: "string" },
        }
      }
    });
    setResult(res);
    setGrading(false);
    if (res && user?.email) {
      await db.entities.APSession.create({
        user_email: user.email,
        type: "frq",
        subject,
        frq_score_str: `AP Score: ${res.ap_score}/5`,
        session_data: JSON.stringify({ projectDesc: projectDesc.slice(0, 200), ap_score: res.ap_score, composite: res.composite, strengths: res.strengths?.slice(0, 300), improvements: res.improvements?.slice(0, 300), overall_feedback: res.overall_feedback?.slice(0, 500) }),
      });
      onSave();
    }
  };

  const apScoreColor = { 5: "text-emerald-400", 4: "text-blue-400", 3: "text-amber-400", 2: "text-orange-400", 1: "text-red-400" };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Code2 className="w-4 h-4 text-cyan-400" /> AP CS Code Project Grader</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={mutedStyle}>Subject / Class</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none text-gray-800"
              style={{ background: "#f8f9fa", border: "1px solid rgba(0,0,0,0.15)" }}>
              {CS_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block text-gray-500">Project Description / Purpose (optional)</label>
            <input value={projectDesc} onChange={e => setProjectDesc(e.target.value)}
              placeholder="What does your program do? What problem does it solve?"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none text-gray-800"
              style={{ background: "#f8f9fa", border: "1px solid rgba(0,0,0,0.15)" }} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-500">Your Code</label>
              <button onClick={() => fileRef.current?.click()} disabled={fileUploading}
                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors disabled:opacity-40">
                {fileUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                Upload file
              </button>
              <input ref={fileRef} type="file" accept=".py,.java,.js,.cpp,.c,.cs,.txt" className="hidden" onChange={handleFile} />
            </div>
            <textarea value={code} onChange={e => setCode(e.target.value)}
              placeholder="Paste your code here, or upload a .py / .java / .js / .cpp file above..."
              rows={12}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none font-mono text-gray-800"
              style={{ background: "#f8f9fa", border: "1px solid rgba(0,0,0,0.15)" }} />
            <p className="text-[10px] mt-1" style={mutedStyle}>{code.length} / 8000 characters</p>
          </div>
          <button onClick={grade} disabled={grading || (!code.trim() && !projectDesc.trim())}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm transition-all">
            {grading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {grading ? "Grading your project..." : "Grade My Project (AP Scale 1–5)"}
          </button>
          <p className="text-[10px] text-center" style={mutedStyle}>Uses 2 AI credits · Results saved to your history</p>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="rounded-2xl p-6 text-center" style={{ ...cardStyle, background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.3)" }}>
            <p className="text-xs font-semibold mb-2" style={mutedStyle}>Predicted AP Score</p>
            <div className={`text-7xl font-black ${apScoreColor[result.ap_score] || "text-violet-400"} mb-2`}>{result.ap_score}</div>
            <p className="text-sm font-bold mb-1">{result.ap_score >= 4 ? "Excellent — College Credit Likely" : result.ap_score === 3 ? "Passing — Possibly Qualified" : "Needs Improvement"}</p>
            <p className="text-xs" style={mutedStyle}>Composite: {result.composite}/100</p>
          </div>

          {result.criteria?.length > 0 && (
            <div className="space-y-2">
              {result.criteria.map((c, i) => (
                <div key={i} className="rounded-2xl p-4" style={cardStyle}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm">{c.name}</p>
                    <span className={`font-black text-base ${c.score >= c.max * 0.75 ? "text-emerald-400" : c.score >= c.max * 0.5 ? "text-amber-400" : "text-red-400"}`}>{c.score}/{c.max}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "rgba(0,0,0,0.1)" }}>
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${(c.score / c.max) * 100}%` }} />
                  </div>
                  <p className="text-xs" style={mutedStyle}>{c.feedback}</p>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl p-4 space-y-3" style={cardStyle}>
            {result.strengths && <div><p className="text-xs font-semibold text-emerald-400 mb-1">✓ Strengths</p><p className="text-xs leading-relaxed" style={mutedStyle}>{result.strengths}</p></div>}
            {result.improvements && <div><p className="text-xs font-semibold text-amber-400 mb-1">↑ Areas to Improve</p><p className="text-xs leading-relaxed" style={mutedStyle}>{result.improvements}</p></div>}
            {result.overall_feedback && <div><p className="text-xs font-semibold mb-1" style={mutedStyle}>Overall Feedback</p><p className="text-sm leading-relaxed">{result.overall_feedback}</p></div>}
          </div>

          <button onClick={() => { setResult(null); setCode(""); setProjectDesc(""); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all" style={cardStyle}>
            <RotateCcw className="w-4 h-4" /> Grade Another Project
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TOOL_META = {
  frq:  { color: "#db2777", label: "FRQ Practice",        desc: "Official-style free response with AP grading" },
  mcq:  { color: "#1a56db", label: "MCQ Practice",        desc: "Authentic multiple choice in AP Classroom format" },
  exam: { color: "#7c3aed", label: "Full Practice Exam",  desc: "Section I + II with predicted AP score 1–5" },
  code: { color: "#0891b2", label: "AP CS Code Grader",   desc: "Submit your project for AP rubric scoring" },
};

export default function APTesting() {
  const [user, setUser] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [tab, setTab] = useState("practice");
  const [historyRefresh, setHistoryRefresh] = useState(0);

  useEffect(() => { db.auth.me().then(setUser).catch(() => {}); }, []);

  const handleSave = () => setHistoryRefresh(r => r + 1);

  const apBg = "#f8f9fa";
  const apBorder = "rgba(0,0,0,0.1)";
  const apText = "#1a1a2e";
  const apMuted = "rgba(0,0,0,0.5)";
  const apBlue = "#1a56db";

  return (
    <div className="min-h-screen" style={{ background: apBg, color: apText, fontFamily: "system-ui, sans-serif" }}>

      {/* AP Classroom-style top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 border-b" style={{ background: "#ffffff", borderColor: apBorder, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded flex items-center justify-center font-black text-white text-xs shrink-0" style={{ background: apBlue }}>AP</div>
          <span className="font-bold text-sm" style={{ color: apText }}>AP Classroom</span>
        </div>
        {activeTool && (
          <>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold" style={{ color: apBlue }}>{TOOL_META[activeTool]?.label}</span>
          </>
        )}
        <div className="ml-auto flex items-center gap-3">
          {activeTool && (
            <button onClick={() => setActiveTool(null)}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded border transition-all hover:bg-gray-50"
              style={{ borderColor: apBorder, color: apMuted }}>
              <ChevronLeft className="w-3.5 h-3.5" /> My AP
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8 pb-28">

        {/* Practice selection */}
        {!activeTool && (
          <>
            {/* Tab bar */}
            <div className="flex border-b mb-6" style={{ borderColor: apBorder }}>
              {[{ id: "practice", label: "Practice" }, { id: "history", label: "Score History" }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px"
                  style={{
                    borderBottomColor: tab === t.id ? apBlue : "transparent",
                    color: tab === t.id ? apBlue : apMuted,
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "practice" && (
              <>
                <h1 className="text-2xl font-black mb-1" style={{ color: apText }}>AP Test Preparation</h1>
                <p className="text-sm mb-6" style={{ color: apMuted }}>College Board–style practice for every AP subject</p>

                <div className="grid gap-3 mb-8">
                  {Object.entries(TOOL_META).map(([id, tool]) => (
                    <button key={id} onClick={() => setActiveTool(id)}
                      className="w-full flex items-center gap-4 px-5 py-4 bg-white border text-left transition-all hover:shadow-md hover:border-blue-200 rounded-lg"
                      style={{ borderColor: apBorder }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white text-base font-black"
                        style={{ background: tool.color }}>
                        {id === "frq" ? "FRQ" : id === "mcq" ? "MCQ" : id === "exam" ? "📋" : "{ }"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color: apText }}>{tool.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: apMuted }}>{tool.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-30 shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="border rounded-lg p-4 bg-white" style={{ borderColor: apBorder }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: apMuted }}>Supported Subjects ({AP_SUBJECTS.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {AP_SUBJECTS.map(s => (
                      <span key={s} className="text-[10px] px-2.5 py-1 rounded-full border font-medium" style={{ borderColor: apBorder, color: apMuted, background: "#f8f9fa" }}>{s}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "history" && <ReviewHistory user={user} refreshKey={historyRefresh} />}
          </>
        )}

        {/* Active tools */}
        {activeTool === "frq"  && <FRQTool user={user} onSave={handleSave} />}
        {activeTool === "mcq"  && <MCQTool user={user} onSave={handleSave} />}
        {activeTool === "exam" && <ExamSimulator user={user} onSave={handleSave} />}
        {activeTool === "code" && <CodeProjectGrader user={user} onSave={handleSave} />}
      </div>
    </div>
  );
}
