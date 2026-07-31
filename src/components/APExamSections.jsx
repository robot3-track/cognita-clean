import { useState, useEffect, useRef } from "react";
import { PenLine, Loader2, CheckCircle2, ChevronDown, ChevronUp, MoreHorizontal, Bookmark, BookmarkCheck } from "lucide-react";
import StimulusRenderer from "./APStimulusRenderer";

// ── FRQ visual resolver — returns a visual component or null based on title/stimulus
function FRQVisual({ frq }) {
  const t = (frq.title || "").toLowerCase();
  const s = (frq.stimulus || "").toLowerCase();
  const desc = frq.stimulus_image_description || "";

  // Japan population pyramid
  if (t.includes("japan population pyramid") || s.includes("japan population pyramid") || desc.toLowerCase().includes("japan")) {
    return <StimulusRenderer q={{ diagram_type: "population_pyramid", stimulus_image_description: "japan" }} isDark={false} muted="rgba(0,0,0,0.5)" text="#1a1a2e" />;
  }
  // Milk & Pork maps
  if ((t.includes("milk") && t.includes("pork")) || (s.includes("cow's milk") && s.includes("pork"))) {
    return <FRQMapImage
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Cow_milk_production_by_country.png/1200px-Cow_milk_production_by_country.png"
      alt="Global Milk and Pork Production Maps, 2018 (FAO)"
      caption="Map 1 (Cow's Milk): High production in USA, Brazil, EU, India, China, Russia. Map 2 (Pork): High in USA, Brazil, EU, China. Low/absent in Middle East, North Africa, South Asia."
      source="Food and Agriculture Organization (FAO), 2018"
    />;
  }
  // Saskatchewan & Finland
  if ((t.includes("saskatchewan") || s.includes("saskatchewan")) || (t.includes("finland") && t.includes("political"))) {
    return <FRQMapImage
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Saskatchewan_map.png/640px-Saskatchewan_map.png"
      alt="Map 1: Saskatchewan, Canada. Map 2: Finland municipalities."
      caption="Map 1 (Saskatchewan): Rural municipalities, cities. Saskatoon (largest city), Regina (provincial capital). Map 2 (Finland): Municipalities within EU context. Helsinki (capital), Tampere (2nd largest)."
      source="Statistics Canada / ESRI Data Partners"
    />;
  }
  // Asian ethnic neighborhoods in LA
  if ((t.includes("asian ethnic") && t.includes("los angeles")) || (s.includes("los angeles county") && s.includes("asian"))) {
    return <FRQMapImage
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Los_Angeles_County_location_map.svg/800px-Los_Angeles_County_location_map.svg.png"
      alt="Selected Asian Ethnic Neighborhoods in Los Angeles County, California"
      caption="Chinese: San Gabriel Valley cluster (Alhambra, Arcadia, Monterey Park). Korean: Koreatown (central). Japanese: Gardena/Torrance (SW). Filipino: Panorama City, Carson/Long Beach."
      source="U.S. Census Bureau"
    />;
  }
  // Washington DC metro
  if ((t.includes("washington") && (t.includes("metro") || t.includes("metrorail"))) || (s.includes("metrorail") && s.includes("washington"))) {
    return <FRQMapImage
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Washington_Metro_Map.svg/800px-Washington_Metro_Map.svg.png"
      alt="Washington D.C. Metro Area — Metrorail System and Political Jurisdictions"
      caption="WMATA Metrorail crossing DC, Maryland (Montgomery & Prince Georges Counties), and Virginia (Arlington, Fairfax, Alexandria). Reagan National Airport in Arlington."
      source="WMATA / ESRI Data Partners"
    />;
  }
  // Metacities / world cities
  if (t.includes("metacities") || (s.includes("metacities") && s.includes("world cities"))) {
    return <FRQMapImage
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/World_cities_by_size.svg/1200px-World_cities_by_size.svg.png"
      alt="Metacities and Top-Tier World Cities, 2020"
      caption="Metacities (pop >20M): Delhi, Mumbai, Shanghai, Tokyo, Beijing, Dhaka, Cairo, Mexico City, São Paulo. World cities: NYC, London, Paris, Hong Kong, Singapore."
      source="United Nations, 2020"
    />;
  }
  // Sahel / Pastoral Nomadism
  if (t.includes("sahel") || s.includes("sahel") || (t.includes("pastoral") && s.includes("pastoral"))) {
    return <FRQMapImage
      src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Sahel_Map-Africa_rough.png"
      alt="Pastoral Nomadism in the Sahel Region of Africa"
      caption="Sahel belt: Mauritania, Senegal, Mali, Burkina Faso, Niger, Chad, Sudan. Migration routes move seasonally north (wet season) and south (dry season)."
      source="Food and Agriculture Organization (FAO)"
    />;
  }
  // Boston biotech
  if (t.includes("boston") && (t.includes("biotech") || t.includes("high-technology") || t.includes("medical"))) {
    return <FRQMapImage
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boston_metro_area_map.png/800px-Boston_metro_area_map.png"
      alt="Boston/Providence Medical & Biotechnology Cluster"
      caption="Boston/Cambridge core: Harvard, MIT, Moderna, Harvard Medical School. Route 128 beltway: biotech R&D firms. I-495 ring: medical equipment manufacturers. UMass Medical (Worcester), Brown Med School (Providence)."
      source="National Institutes of Health"
    />;
  }
  // Silk Road / trade routes
  if (t.includes("silk road") || s.includes("silk road") || (t.includes("trade") && s.includes("trade routes"))) {
    return <FRQMapImage
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Silk_Road_Trade_%28c.1200_CE%29.jpg/1280px-Silk_Road_Trade_%28c.1200_CE%29.jpg"
      alt="Major Silk Road Trade Routes c. 1200 CE"
      caption="Overland Silk Road: China → Central Asia → Tabriz → Constantinople → Venice. Maritime: Guangzhou → Indian Ocean → Arabia. Trans-Saharan: Timbuktu → Morocco/Cairo."
      source="Adapted from Janet Abu-Lughod / Wikimedia Commons"
    />;
  }
  // Demographic Transition Model data table
  if (t.includes("demographic transition") || s.includes("demographic transition model")) {
    return <StimulusRenderer q={{ diagram_type: "dtm" }} isDark={false} muted="rgba(0,0,0,0.5)" text="#1a1a2e" />;
  }
  return null;
}

// Simple map image display for FRQs
function FRQMapImage({ src, alt, caption, source }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="mb-2">
      <img src={src} alt={alt} onError={() => setFailed(true)}
        className="w-full rounded-lg object-contain"
        style={{ maxHeight: 300, background: "#f0f4f8", border: "1px solid rgba(0,0,0,0.1)" }} />
      {caption && <p className="text-xs mt-1 font-medium" style={{ color: "#374151", fontFamily: "system-ui" }}>{caption}</p>}
      {source && <p className="text-xs italic mt-0.5 text-right" style={{ color: "#6b7280", fontFamily: "system-ui" }}>Source: {source}</p>}
    </div>
  );
}

// FRQ stimulus block — shows visual then text
// Uses StimulusRenderer for visual detection so all map/diagram logic is unified
function FRQStimulusBlock({ frq, text, muted }) {
  const visual = FRQVisual({ frq });
  const hasStimulus = frq.stimulus || frq.stimulus_image_description || frq.map_description || frq.diagram_type;
  if (!hasStimulus && !visual) return null;

  // If FRQVisual found something, show it + optional stimulus text
  if (visual) {
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.09)" }}>
        <div className="p-4" style={{ background: "#f0f4f8" }}>
          {visual}
        </div>
        {frq.stimulus && (
          <div className="p-5 text-sm leading-relaxed" style={{ background: "#f8f9fa", fontFamily: "Georgia, serif", lineHeight: "1.8", color: text }}>
            {frq.stimulus}
          </div>
        )}
      </div>
    );
  }

  // Fall back to StimulusRenderer which handles all visual detection
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.09)" }}>
      <div className="p-5" style={{ background: "#f8f9fa" }}>
        <StimulusRenderer q={frq} isDark={false} muted={muted} text={text} />
      </div>
    </div>
  );
}

export function SectionBreakScreen({ subject, mcqCount, frqCount, onContinue, onExit }) {
  const [countdown, setCountdown] = useState(10);
  useEffect(() => {
    const t = setInterval(() => setCountdown(c => { if (c <= 1) clearInterval(t); return Math.max(0, c - 1); }), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: "#f8f9fa", fontFamily: "system-ui", color: "#1a1a2e" }}>
      <div className="max-w-lg w-full mx-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-6">
          <PenLine className="w-8 h-8 text-white" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black text-white mb-4" style={{ background: "#1a56db" }}>AP©</span>
        <h1 className="text-3xl font-black mb-2">Section I Complete</h1>
        <p className="text-base opacity-60 mb-6">You have completed all {mcqCount} multiple choice questions.</p>
        <div className="rounded-2xl p-6 mb-6 text-left" style={{ background: "white", border: "1px solid rgba(0,0,0,0.1)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="font-black text-base">Section II — Free Response</p>
              <p className="text-sm opacity-50">{subject}</p>
            </div>
          </div>
          <div className="space-y-1.5 text-sm opacity-60">
            <p>📝 {frqCount} free response question{frqCount !== 1 ? "s" : ""}</p>
            <p>✍️ Write complete responses addressing all parts</p>
            <p>📐 Show all work for quantitative questions</p>
          </div>
        </div>
        <button onClick={onContinue} className="w-full py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 mb-3" style={{ background: "#1a56db" }}>
          Begin Section II — Free Response {countdown > 0 && <span className="text-sm opacity-70">({countdown}s)</span>}
        </button>
        <button onClick={onExit} className="text-sm opacity-40 hover:opacity-70 transition-all">Exit exam</button>
      </div>
    </div>
  );
}

// ── AP Classroom FRQ Interface — two-pane College Board style ─────────────────
export function APFRQInterface({ frqQuestions, subject, frqResponses, setFrqResponses, onSubmit, onExit, grading }) {
  const [currentFRQ, setCurrentFRQ] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerHidden, setTimerHidden] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [marked, setMarked] = useState({});
  const [navOpen, setNavOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [splitPct, setSplitPct] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef(null);
  const moreMenuRef = useRef(null);
  const timerRef = useRef(null);
  const timerHiddenRef = useRef(false);

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
      // Snap to 25%, 50%, 75% if within 3%
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

  // ~25 min per FRQ
  const EXAM_TOTAL = frqQuestions.length * 25 * 60;

  useEffect(() => { timerHiddenRef.current = timerHidden; }, [timerHidden]);

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!showMoreMenu) return;
    const handler = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setShowMoreMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMoreMenu]);

  const timeRemaining = Math.max(0, EXAM_TOTAL - seconds);
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const frq = frqQuestions[currentFRQ];
  const bg = "#ffffff";
  const border = "rgba(0,0,0,0.12)";
  const text = "#1a1a2e";
  const muted = "rgba(0,0,0,0.5)";
  const headerBg = "#f0f0f0";

  // Total points for this FRQ
  const totalPts = frq?.parts?.reduce((s, p) => s + (p.points || 0), 0) || null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: bg, color: text, fontFamily: "Georgia, serif" }}>

      {/* ── Top Header ── */}
      <div className="flex items-center px-4 py-2 shrink-0 gap-3" style={{ background: headerBg, borderBottom: `1px solid ${border}` }}>
        {/* Directions toggle */}
        <button onClick={() => setShowDirections(d => !d)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-all hover:bg-black/10"
          style={{ color: text, fontFamily: "system-ui" }}>
          Directions <ChevronDown className={`w-3 h-3 transition-transform ${showDirections ? "rotate-180" : ""}`} />
        </button>
        <span className="text-xs font-semibold flex-1 truncate" style={{ color: muted, fontFamily: "system-ui" }}>
          Section II — Free Response · {subject}
        </span>

        {/* Timer */}
        <div className="flex items-center gap-2 shrink-0">
          {timerHidden
            ? <span className="text-xl font-black tabular-nums text-gray-400" style={{ fontFamily: "system-ui" }}>--:--</span>
            : <span className={`text-xl font-black tabular-nums ${timeRemaining < 300 ? "text-red-600" : ""}`} style={{ fontFamily: "system-ui" }}>{fmt(timeRemaining)}</span>
          }
          <button onClick={() => setTimerHidden(h => !h)}
            className="text-xs px-3 py-1 rounded-full border font-semibold transition-all hover:bg-black/10"
            style={{ color: "#1a56db", borderColor: "#1a56db", fontFamily: "system-ui" }}>
            {timerHidden ? "Show" : "Hide"}
          </button>
        </div>

        {/* Three-dot menu */}
        <div className="relative shrink-0" ref={moreMenuRef}>
          <button onClick={() => setShowMoreMenu(m => !m)}
            className={`p-1.5 rounded transition-all ${showMoreMenu ? "bg-black/10" : "hover:bg-black/10 opacity-60 hover:opacity-100"}`}>
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMoreMenu && (
            <div className="absolute right-0 top-8 w-44 rounded-xl shadow-2xl py-1 z-50 border"
              style={{ background: "#ffffff", borderColor: border, fontFamily: "system-ui" }}>
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
                <button onClick={() => { setZoom(1); setShowMoreMenu(false); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-gray-400 hover:bg-gray-100 transition-all">
                  Reset zoom
                </button>
              )}
            </div>
          )}
        </div>

        <span className="px-3 py-1 rounded text-xs font-black text-white shrink-0" style={{ background: "#1a56db", fontFamily: "system-ui" }}>AP©</span>
      </div>

      {/* Directions dropdown */}
      {showDirections && (
        <div className="px-6 py-3 text-sm border-b" style={{ background: headerBg, borderColor: border, fontFamily: "system-ui", color: muted }}>
          <strong style={{ color: text }}>Directions:</strong> Write your response in the space provided for each part. For full credit, address each part of the question completely using complete sentences. Show all work where applicable. Use specific evidence to support your answers.
        </div>
      )}

      {/* ── Two-pane main area ── */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">

        {/* Left pane — FRQ prompt & stimulus */}
        <div className="overflow-y-auto p-8" style={{ borderRight: `1px solid ${border}`, width: `${splitPct}%`, minWidth: "25%", maxWidth: "75%" }}>
          {frq && (
            <div className="space-y-5 max-w-prose" style={{ fontSize: `${zoom}em`, transformOrigin: "top left" }}>
              <p className="text-xs font-black uppercase tracking-widest" style={{ fontFamily: "system-ui", color: muted }}>
                Question {currentFRQ + 1} of {frqQuestions.length}
                {totalPts !== null && <span className="ml-3 normal-case font-semibold">({totalPts} points)</span>}
              </p>

              {/* Stimulus block — image + text. Always render; component decides internally if there's anything to show */}
              <FRQStimulusBlock frq={frq} text={text} muted={muted} />

              {/* FRQ title / prompt */}
              <p className="text-base font-bold leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                {frq.prompt || frq.title}
              </p>

              {/* Parts listed on left as read-only context */}
              {frq.parts?.map((part, pi) => (
                <div key={pi} className="space-y-1.5">
                  <p className="text-sm font-bold" style={{ fontFamily: "system-ui" }}>
                    ({part.label}) <span className="font-normal opacity-60 text-xs ml-1">{part.points} pt{part.points !== 1 ? "s" : ""}</span>
                  </p>
                  <p className="text-sm leading-relaxed" style={{ lineHeight: "1.75" }}>{part.question}</p>
                </div>
              ))}

              {(!frq.parts || frq.parts.length === 0) && (
                <p className="text-xs opacity-40" style={{ fontFamily: "system-ui" }}>Write your response in the right panel.</p>
              )}
            </div>
          )}
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

        {/* Right pane — response writing area */}
        <div className="overflow-y-auto p-8 flex flex-col gap-5" style={{ flex: 1 }}>
          {frq && (
            <div style={{ fontSize: `${zoom}em`, transformOrigin: "top left" }}>
              {/* Mark for review */}
              <div className="flex items-center justify-between" style={{ fontFamily: "system-ui" }}>
                <button
                  onClick={() => setMarked(prev => ({ ...prev, [currentFRQ]: !prev[currentFRQ] }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded border-2 text-sm font-semibold transition-all ${marked[currentFRQ] ? "border-amber-400 bg-amber-400/10 text-amber-500" : "border-gray-300 hover:border-gray-400"}`}
                  style={{ borderStyle: "dashed", color: marked[currentFRQ] ? undefined : muted }}>
                  {marked[currentFRQ] ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  Mark for Review
                </button>
              </div>

              {/* Per-part textareas or single textarea */}
              {frq.parts?.length > 0 ? (
                <div className="space-y-5">
                  {frq.parts.map((part, pi) => (
                    <div key={pi}>
                      <div className="flex items-center justify-between mb-2" style={{ fontFamily: "system-ui" }}>
                        <span className="text-sm font-black">Part ({part.label})</span>
                        <span className="text-xs font-semibold opacity-50">{part.points} point{part.points !== 1 ? "s" : ""}</span>
                      </div>
                      <textarea
                        value={frqResponses[`${currentFRQ}_${pi}`] || ""}
                        onChange={e => setFrqResponses(prev => ({ ...prev, [`${currentFRQ}_${pi}`]: e.target.value }))}
                        placeholder={`Part (${part.label}): ${part.question?.slice(0, 80)}...`}
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
                        style={{ border: "1px solid rgba(0,0,0,0.18)", fontFamily: "Georgia, serif", color: text, background: "#fdfcfb", lineHeight: "1.8" }}
                      />
                      <p className="text-[10px] mt-0.5 text-right" style={{ color: muted, fontFamily: "system-ui" }}>
                        {(frqResponses[`${currentFRQ}_${pi}`] || "").length} chars
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <textarea
                    value={frqResponses[`${currentFRQ}_0`] || ""}
                    onChange={e => setFrqResponses(prev => ({ ...prev, [`${currentFRQ}_0`]: e.target.value }))}
                    placeholder="Write your complete response here..."
                    rows={18}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
                    style={{ border: "1px solid rgba(0,0,0,0.18)", fontFamily: "Georgia, serif", color: text, background: "#fdfcfb", lineHeight: "1.8" }}
                  />
                  <p className="text-[10px] mt-0.5 text-right" style={{ color: muted, fontFamily: "system-ui" }}>
                    {(frqResponses[`${currentFRQ}_0`] || "").length} chars
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex items-center px-6 py-3 shrink-0 gap-3" style={{ background: headerBg, borderTop: `1px solid ${border}`, fontFamily: "system-ui" }}>
        <button onClick={() => setCurrentFRQ(i => Math.max(0, i - 1))} disabled={currentFRQ === 0}
          className="px-4 py-2 rounded text-sm font-semibold border disabled:opacity-30 transition-all hover:bg-black/10"
          style={{ border: `1px solid ${border}`, color: text }}>
          Back
        </button>

        {/* Question nav pill */}
        <button onClick={() => setNavOpen(o => !o)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{ background: "#e0e0e0", color: text }}>
          Question {currentFRQ + 1} of {frqQuestions.length}
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${navOpen ? "" : "rotate-180"}`} />
        </button>

        {currentFRQ < frqQuestions.length - 1 ? (
          <button onClick={() => setCurrentFRQ(i => i + 1)}
            className="px-4 py-2 rounded text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "#1a56db" }}>
            Next
          </button>
        ) : (
          <button onClick={onSubmit} disabled={grading}
            className="flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold text-white disabled:opacity-50 transition-all hover:opacity-90"
            style={{ background: "#16a34a" }}>
            {grading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {grading ? "Grading..." : "Submit & Get AP Score"}
          </button>
        )}

        <div className="flex-1 flex justify-end">
          <button onClick={() => setShowExitConfirm(true)} className="text-xs opacity-40 hover:opacity-80 transition-all">✕ Exit</button>
        </div>
      </div>

      {/* FRQ nav overlay */}
      {navOpen && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-2xl shadow-2xl p-4 z-10 w-64"
          style={{ background: "#ffffff", border: `1px solid ${border}`, fontFamily: "system-ui" }}>
          <p className="text-xs font-bold mb-3" style={{ color: muted }}>FREE RESPONSE QUESTIONS</p>
          <div className="flex flex-wrap gap-2">
            {frqQuestions.map((_, i) => (
              <button key={i} onClick={() => { setCurrentFRQ(i); setNavOpen(false); }}
                className="w-10 h-10 rounded text-xs font-bold flex items-center justify-center transition-all"
                style={{
                  background: i === currentFRQ ? "#1a56db" : "#f0f0f0",
                  color: i === currentFRQ ? "white" : text,
                  border: `1px solid ${border}`,
                }}>
                {i + 1}
                {marked[i] && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 w-80 shadow-2xl" style={{ background: "#ffffff", fontFamily: "system-ui" }}>
            <h3 className="font-black text-base mb-2" style={{ color: text }}>Exit Exam?</h3>
            <p className="text-sm mb-5" style={{ color: muted }}>Your FRQ responses will be lost. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50 transition-all"
                style={{ border: `1px solid ${border}`, color: text }}>
                Keep Writing
              </button>
              <button onClick={() => { setShowExitConfirm(false); onExit ? onExit() : onSubmit(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-all">
                Exit & Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}