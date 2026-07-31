import { useState, useCallback, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";

// ── Modes ──────────────────────────────────────────────────────────────────
const TABS = ["CALC", "GRAPH", "TABLE"];

// ── Expression evaluator ───────────────────────────────────────────────────
function evalExpr(expr, angleMode = "RAD", x = null) {
  try {
    let e = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/%/g, "/100")
      .replace(/\^/g, "**");

    // Substitute x before adding implicit multiplication so we don't mangle function names
    if (x !== null) {
      // Replace standalone x (not inside function names like "exp", "max")
      e = e.replace(/(?<![a-zA-Z])x(?![a-zA-Z])/g, `(${x})`);
    }

    // Substitute constants
    e = e.replace(/π/g, `(${Math.PI})`);
    // Replace bare 'e' not followed by ** or digits (avoid replacing "e" in "exp" etc.)
    e = e.replace(/(?<![a-zA-Z])e(?!\*\*|[a-zA-Z0-9])/g, `(${Math.E})`);

    const toRad = angleMode === "DEG" ? `(Math.PI/180)*` : "";

    // Replace trig/math functions
    e = e
      .replace(/asin\(/g, angleMode === "DEG" ? `(180/Math.PI)*Math.asin(` : `Math.asin(`)
      .replace(/acos\(/g, angleMode === "DEG" ? `(180/Math.PI)*Math.acos(` : `Math.acos(`)
      .replace(/atan\(/g, angleMode === "DEG" ? `(180/Math.PI)*Math.atan(` : `Math.atan(`)
      .replace(/sin\(/g, `Math.sin(${toRad}`)
      .replace(/cos\(/g, `Math.cos(${toRad}`)
      .replace(/tan\(/g, `Math.tan(${toRad}`)
      .replace(/ln\(/g, "Math.log(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/sqrt\(/g, "Math.sqrt(");

    // Implicit multiplication:
    // 2x(already replaced) → 2*(...)  e.g. "2(3.14)" → "2*(3.14)"
    // number followed by ( → number*(
    e = e.replace(/(\d)\s*\(/g, "$1*(");
    // ) followed by number → )*number
    e = e.replace(/\)\s*(\d)/g, ")*$1");
    // ) followed by ( → )*(
    e = e.replace(/\)\s*\(/g, ")*(");
    // number followed by Math. → number*Math.
    e = e.replace(/(\d)\s*(Math\.)/g, "$1*$2");
    // ) followed by Math. → )*Math.
    e = e.replace(/\)\s*(Math\.)/g, ")*$1");

     
    const result = new Function("return " + e)();
    if (!isFinite(result) || isNaN(result)) return NaN;
    return parseFloat(result.toPrecision(12));
  } catch {
    return NaN;
  }
}

function formatResult(val) {
  if (isNaN(val)) return "Error";
  const s = val.toString();
  if (s.length > 14) return parseFloat(val.toPrecision(10)).toString();
  return s;
}

// ── Button grid (normal + 2nd) ─────────────────────────────────────────────
const BTN_ROWS = [
  [
    { n: "2nd",  s: null,    c: "second" },
    { n: "MODE", s: null,    c: "mode"   },
    { n: "DEL",  s: "INS",   c: "del"    },
    { n: "GRPH", s: "TABLE", c: "graph"  },
    { n: "STAT", s: null,    c: "fn"     },
  ],
  [
    { n: "x²",   s: "√(",    c: "fn" },
    { n: "x⁻¹",  s: "x³",   c: "fn" },
    { n: "sin(", s: "asin(", c: "fn" },
    { n: "cos(", s: "acos(", c: "fn" },
    { n: "tan(", s: "atan(", c: "fn" },
  ],
  [
    { n: "^",    s: "π",     c: "op" },
    { n: "log(", s: "10^",   c: "fn" },
    { n: "ln(",  s: "e^(",   c: "fn" },
    { n: "(",    s: "{",     c: "paren" },
    { n: ")",    s: "}",     c: "paren" },
  ],
  [
    { n: "7",  s: null, c: "num" },
    { n: "8",  s: null, c: "num" },
    { n: "9",  s: null, c: "num" },
    { n: "÷",  s: null, c: "op"  },
    { n: "×",  s: null, c: "op"  },
  ],
  [
    { n: "4",  s: null, c: "num" },
    { n: "5",  s: null, c: "num" },
    { n: "6",  s: null, c: "num" },
    { n: "-",  s: null, c: "op"  },
    { n: "+",  s: null, c: "op"  },
  ],
  [
    { n: "1",   s: null, c: "num" },
    { n: "2",   s: null, c: "num" },
    { n: "3",   s: null, c: "num" },
    { n: "x",   s: "e", c: "fn"  },
    { n: "Ans", s: null, c: "fn" },
  ],
  [
    { n: "0",   s: null,  c: "num"   },
    { n: ".",   s: null,  c: "num"   },
    { n: "(-)", s: "π",   c: "num"   },
    { n: "%",   s: "abs(", c: "fn"  },
    { n: "=",   s: null,  c: "equal" },
  ],
];

const BTN_COLORS = {
  second: "bg-yellow-500 text-black",
  mode:   "bg-slate-600 text-white",
  del:    "bg-red-700 text-white",
  graph:  "bg-blue-700 text-white",
  fn:     "bg-slate-700 text-cyan-300",
  op:     "bg-slate-700 text-violet-300",
  paren:  "bg-slate-700 text-amber-300",
  num:    "bg-slate-800 text-white",
  equal:  "bg-blue-600 text-white",
  mode_btn: "bg-slate-600 text-white",
};

// ── Graph component ─────────────────────────────────────────────────────────
const GRAPH_COLORS = ["#60a5fa", "#f472b6", "#34d399", "#fb923c", "#a78bfa"];

function GraphView({ exprs, angleMode }) {
  const canvasRef = useRef(null);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [traceX, setTraceX] = useState(null);
  const [dragging, setDragging] = useState(false);
  const lastPos = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const toCanvasX = (x) => ((x - xMin) / (xMax - xMin)) * W;
    const toCanvasY = (y) => H - ((y - yMin) / (yMax - yMin)) * H;
    const fromCanvasX = (cx) => xMin + (cx / W) * (xMax - xMin);

    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    const stepX = Math.pow(10, Math.floor(Math.log10(xMax - xMin)) - 1);
    const stepY = Math.pow(10, Math.floor(Math.log10(yMax - yMin)) - 1);
    for (let gx = Math.ceil(xMin / stepX) * stepX; gx <= xMax; gx += stepX) {
      const cx = toCanvasX(gx);
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    }
    for (let gy = Math.ceil(yMin / stepY) * stepY; gy <= yMax; gy += stepY) {
      const cy = toCanvasY(gy);
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    const ax = toCanvasX(0);
    const ay = toCanvasY(0);
    ctx.beginPath(); ctx.moveTo(ax, 0); ctx.lineTo(ax, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.stroke();

    // Axis labels
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "10px monospace";
    [xMin, Math.round((xMin + xMax) / 2), xMax].forEach(v => {
      ctx.fillText(v, toCanvasX(v) + 2, ay - 4);
    });
    [yMin, Math.round((yMin + yMax) / 2), yMax].forEach(v => {
      if (v !== 0) ctx.fillText(v, ax + 4, toCanvasY(v) + 3);
    });

    // Plot each function
    exprs.forEach((expr, idx) => {
      if (!expr.trim()) return;
      ctx.strokeStyle = GRAPH_COLORS[idx % GRAPH_COLORS.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      for (let px = 0; px <= W; px++) {
        const x = fromCanvasX(px);
        const y = evalExpr(expr, angleMode, x);
        if (isNaN(y) || !isFinite(y)) { started = false; continue; }
        const cy = toCanvasY(y);
        if (!started) { ctx.moveTo(px, cy); started = true; }
        else ctx.lineTo(px, cy);
      }
      ctx.stroke();
    });

    // Trace cursor (for first non-empty expr)
    if (traceX !== null) {
      exprs.forEach((expr, idx) => {
        if (!expr.trim()) return;
        const y = evalExpr(expr, angleMode, traceX);
        if (!isNaN(y)) {
          const cx = toCanvasX(traceX);
          const cy = toCanvasY(y);
          const color = GRAPH_COLORS[idx % GRAPH_COLORS.length];
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(0,0,0,0.85)";
          ctx.fillRect(cx + 8, cy - 18 - idx * 16, 130, 16);
          ctx.fillStyle = color;
          ctx.font = "10px monospace";
          ctx.fillText(`Y${idx+1}: x=${traceX.toFixed(2)} y=${y.toFixed(3)}`, cx + 11, cy - 6 - idx * 16);
        }
      });
    }
  }, [exprs, xMin, xMax, yMin, yMax, angleMode, traceX]);

  useEffect(() => { draw(); }, [draw]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const x = xMin + (px / canvasRef.current.width) * (xMax - xMin);
    setTraceX(prev => prev !== null && Math.abs(prev - x) < 0.5 ? null : x);
  };

  const handleMouseDown = (e) => { setDragging(true); lastPos.current = { x: e.clientX, y: e.clientY }; };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    const rx = (xMax - xMin) / canvasRef.current.getBoundingClientRect().width;
    const ry = (yMax - yMin) / canvasRef.current.getBoundingClientRect().height;
    setXMin(p => p - dx * rx); setXMax(p => p - dx * rx);
    setYMin(p => p + dy * ry); setYMax(p => p + dy * ry);
  };
  const handleMouseUp = () => setDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.87;
    const cx = (xMin + xMax) / 2; const cy = (yMin + yMax) / 2;
    setXMin(cx - (cx - xMin) * factor); setXMax(cx + (xMax - cx) * factor);
    setYMin(cy - (cy - yMin) * factor); setYMax(cy + (yMax - cy) * factor);
  };

  const resetView = () => { setXMin(-10); setXMax(10); setYMin(-10); setYMax(10); setTraceX(null); };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        {[[-5,5], [-10,10], [-20,20]].map(([lo, hi]) => (
          <button key={lo} onClick={() => { setXMin(lo); setXMax(hi); setYMin(lo); setYMax(hi); }}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-700 text-white hover:bg-slate-600">
            [{lo},{hi}]
          </button>
        ))}
        <button onClick={resetView} className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-600 text-white hover:bg-slate-500 flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <span className="text-xs text-slate-400 self-center">Scroll=zoom · Drag=pan · Click=trace</span>
      </div>
      <canvas
        ref={canvasRef}
        width={360} height={280}
        className="rounded-2xl w-full cursor-crosshair"
        style={{ imageRendering: "crisp-edges" }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[["Xmin", xMin, setXMin], ["Xmax", xMax, setXMax], ["Ymin", yMin, setYMin], ["Ymax", yMax, setYMax]].map(([label, val, setter]) => (
          <label key={label} className="flex items-center gap-1 text-slate-300">
            <span className="w-10 shrink-0 font-bold text-cyan-400">{label}</span>
            <input type="number" value={val} onChange={e => setter(Number(e.target.value))}
              className="flex-1 bg-slate-800 rounded-lg px-2 py-1 text-white outline-none border border-slate-600 focus:border-blue-500 w-0" />
          </label>
        ))}
      </div>
    </div>
  );
}

// ── Table component ─────────────────────────────────────────────────────────
function TableView({ expr, angleMode }) {
  const [start, setStart] = useState(-5);
  const [step, setStep]   = useState(1);

  const rows = [];
  for (let i = 0; i < 20; i++) {
    const x = parseFloat((start + i * step).toPrecision(10));
    const y = evalExpr(expr, angleMode, x);
    rows.push({ x, y });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <label className="flex-1 flex items-center gap-2 text-xs text-slate-300">
          <span className="font-bold text-cyan-400 w-12">TblStart</span>
          <input type="number" value={start} onChange={e => setStart(Number(e.target.value))}
            className="flex-1 bg-slate-800 rounded-lg px-2 py-1 text-white outline-none border border-slate-600 focus:border-blue-500" />
        </label>
        <label className="flex-1 flex items-center gap-2 text-xs text-slate-300">
          <span className="font-bold text-cyan-400 w-8">ΔTbl</span>
          <input type="number" value={step} step="0.1" onChange={e => setStep(Number(e.target.value))}
            className="flex-1 bg-slate-800 rounded-lg px-2 py-1 text-white outline-none border border-slate-600 focus:border-blue-500" />
        </label>
      </div>
      <div className="rounded-2xl overflow-hidden border border-slate-700">
        <div className="grid grid-cols-2 bg-slate-700 text-cyan-300 font-bold text-xs px-4 py-2">
          <span>X</span><span>Y1</span>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
          {rows.map(({ x, y }, i) => (
            <div key={i} className={`grid grid-cols-2 text-xs px-4 py-1.5 font-mono border-b border-slate-800 ${i % 2 === 0 ? "bg-slate-900" : "bg-slate-800/50"}`}>
              <span className="text-white">{x}</span>
              <span className={isNaN(y) ? "text-red-400" : "text-amber-300"}>{isNaN(y) ? "ERROR" : formatResult(y)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Calculator ─────────────────────────────────────────────────────────
export default function Calculator() {
  const [display, setDisplay]           = useState("0");
  const [ans, setAns]                   = useState("0");
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [secondMode, setSecondMode]     = useState(false);
  const [angleMode, setAngleMode]       = useState("DEG"); // DEG or RAD
  const [activeTab, setActiveTab]       = useState("CALC");
  const [graphExpr, setGraphExpr]       = useState("sin(x)");
  const [graphExprs, setGraphExprs]     = useState(["sin(x)", "", ""]);
  const [history, setHistory]           = useState([]);

  const press = useCallback((raw) => {
    const val = secondMode && BTN_ROWS.flat().find(b => b.n === raw)?.s
      ? BTN_ROWS.flat().find(b => b.n === raw).s
      : raw;

    // Handle 2nd toggle
    if (raw === "2nd") { setSecondMode(p => !p); return; }
    setSecondMode(false);

    if (val === "MODE") { setAngleMode(p => p === "DEG" ? "RAD" : "DEG"); return; }
    if (val === "GRPH" || val === "TABLE") { setActiveTab(val === "GRPH" ? "GRAPH" : "TABLE"); return; }

    if (val === "DEL" || val === "⌫") {
      setDisplay(prev => prev === "Error" ? "0" : prev.length > 1 ? prev.slice(0, -1) : "0");
      setJustEvaluated(false);
      return;
    }
    if (val === "C" || val === "INS") {
      setDisplay("0");
      setJustEvaluated(false);
      return;
    }
    if (val === "=") {
      const result = evalExpr(display, angleMode);
      const res = formatResult(result);
      setHistory(h => [{ expr: display, result: res }, ...h].slice(0, 10));
      setAns(res);
      setDisplay(res);
      setJustEvaluated(true);
      return;
    }
    if (val === "Ans") {
      setDisplay(prev => (prev === "0" || justEvaluated) ? ans : prev + ans);
      setJustEvaluated(false);
      return;
    }

    const isOperator = ["+", "-", "×", "÷", "^", "%"].includes(val);
    const appendsOpen = val.endsWith("(") || val === "(";

    // After evaluation: operator continues, anything else starts fresh
    if (justEvaluated && !isOperator) {
      setDisplay(val === "." ? "0." : val === "(-)" ? "-" : val);
      setJustEvaluated(false);
      return;
    }
    if (justEvaluated && isOperator) {
      setDisplay(display + val);
      setJustEvaluated(false);
      return;
    }

    // Smart 0 replacement
    if (val === "(-)" ) {
      setDisplay(prev => prev === "0" ? "-" : prev + "(-");
      return;
    }

    setDisplay(prev => {
      // If display shows Error, start fresh
      const base = prev === "Error" ? "0" : prev;
      // If display is just "0" and input is not an operator/dot/paren/function
      if (base === "0" && !isOperator && val !== "." && val !== ")" && !appendsOpen) {
        return val;
      }
      // Shorthand: x² → append ^2
      if (val === "x²") return base + "^2";
      if (val === "x⁻¹") return base + "^(-1)";
      if (val === "x³") return base + "^3";
      if (val === "10^") return base + "10^(";
      if (val === "e^(") return base + "e^(";
      if (val === "STAT") return base; // placeholder
      return base + val;
    });
    setJustEvaluated(false);
  }, [display, ans, justEvaluated, secondMode, angleMode]);

  // Keyboard support — with multi-char shortcut buffering
  const keyBuffer = useRef("");
  const keyBufferTimer = useRef(null);

  useEffect(() => {
    const SHORTCUTS = [
      { seq: "asin", out: "asin(" },
      { seq: "acos", out: "acos(" },
      { seq: "atan", out: "atan(" },
      { seq: "sin",  out: "sin("  },
      { seq: "cos",  out: "cos("  },
      { seq: "tan",  out: "tan("  },
      { seq: "log",  out: "log("  },
      { seq: "ln",   out: "ln("   },
      { seq: "as",   out: "asin(" },
      { seq: "ac",   out: "acos(" },
      { seq: "at",   out: "atan(" },
      { seq: "pi",   out: "π"     },
      { seq: "s",    out: "sin("  },
      { seq: "c",    out: "cos("  },
      { seq: "t",    out: "tan("  },
    ];

    const flushBuffer = (buf) => {
      // Try to match a shortcut from the buffer
      const match = SHORTCUTS.find(sc => buf.endsWith(sc.seq));
      if (match) {
        // Remove the typed shortcut chars from display and insert the function
        setDisplay(prev => {
          const trimmed = prev.slice(0, prev.length - (match.seq.length - 1)); // keep all but the shortcut letters (last char already not appended)
          return trimmed === "" ? match.out : trimmed + match.out;
        });
      }
      keyBuffer.current = "";
    };

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const key = e.key;

      // Numeric / operator keys — clear buffer and handle directly
      if (key >= "0" && key <= "9") { keyBuffer.current = ""; press(key); return; }
      if (key === ".") { keyBuffer.current = ""; press("."); return; }
      if (key === "+") { keyBuffer.current = ""; press("+"); return; }
      if (key === "-") { keyBuffer.current = ""; press("-"); return; }
      if (key === "*") { keyBuffer.current = ""; press("×"); return; }
      if (key === "/") { e.preventDefault(); keyBuffer.current = ""; press("÷"); return; }
      if (key === "^") { keyBuffer.current = ""; press("^"); return; }
      if (key === "%") { keyBuffer.current = ""; press("%"); return; }
      if (key === "(") { keyBuffer.current = ""; press("("); return; }
      if (key === ")") { keyBuffer.current = ""; press(")"); return; }
      if (key === "=")  { e.preventDefault(); keyBuffer.current = ""; press("="); return; }
      if (key === "Enter") { e.preventDefault(); keyBuffer.current = ""; press("="); return; }
      if (key === "Backspace") { keyBuffer.current = ""; press("DEL"); return; }
      if (key === "Escape") { keyBuffer.current = ""; setDisplay("0"); setJustEvaluated(false); return; }

      // Single-letter shortcuts that don't need buffering
      if (key === "e") { keyBuffer.current = ""; setDisplay(prev => (prev === "0" || prev === "Error" || justEvaluated) ? "e" : prev + "e"); setJustEvaluated(false); return; }
      if (key === "x") { keyBuffer.current = ""; setDisplay(prev => (prev === "0" || prev === "Error" || justEvaluated) ? "x" : prev + "x"); setJustEvaluated(false); return; }

      // Multi-char shortcut buffering for letter keys
      if (/^[a-zA-Z]$/.test(key)) {
        clearTimeout(keyBufferTimer.current);
        keyBuffer.current += key;
        const buf = keyBuffer.current;

        // Check for exact match
        const exact = SHORTCUTS.find(sc => sc.seq === buf);
        if (exact) {
          // Remove the buffered chars from display (they weren't appended yet) and insert function
          setDisplay(prev => {
            const base = (prev === "0" || prev === "Error") ? "" : prev;
            return base + exact.out;
          });
          setJustEvaluated(false);
          keyBuffer.current = "";
          return;
        }

        // Check if any shortcut still starts with the buffer (partial match — wait)
        const partial = SHORTCUTS.some(sc => sc.seq.startsWith(buf));
        if (partial) {
          // Flush after 600ms if no more keys come
          keyBufferTimer.current = setTimeout(() => {
            // No match found — just type the letters literally
            const letters = keyBuffer.current;
            keyBuffer.current = "";
            setDisplay(prev => (prev === "0" ? letters : prev + letters));
          }, 600);
        } else {
          // No match at all — flush as literal text
          setDisplay(prev => (prev === "0" ? buf : prev + buf));
          keyBuffer.current = "";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(keyBufferTimer.current);
    };
  }, [press, justEvaluated]);

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-3"
      style={{ background: "#111827", color: "white", fontFamily: "monospace" }}>

      {/* TI-84 shell */}
      <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700"
        style={{ background: "#1a1f2e" }}>

        {/* Brand bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900">
          <span className="text-xs font-black text-blue-400 tracking-widest">TI-84 PLUS</span>
          <div className="flex gap-2">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${activeTab === tab ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${angleMode === "DEG" ? "bg-amber-600 text-black" : "bg-cyan-600 text-black"}`}>
            {angleMode}
          </span>
        </div>

        {/* Screen */}
        <div className="mx-3 mt-2 mb-3 rounded-xl overflow-hidden border-2 border-slate-600"
          style={{ background: "#0a1628", minHeight: 180 }}>

          {activeTab === "CALC" && (
            <div className="p-3">
              {/* History */}
              <div className="space-y-0.5 mb-2">
                {history.slice(0, 3).map((h, i) => (
                  <div key={i} className="flex justify-between text-[10px] text-slate-500">
                    <span className="truncate max-w-[160px]">{h.expr}</span>
                    <span className="text-slate-400 ml-2 shrink-0">{h.result}</span>
                  </div>
                ))}
              </div>
              {/* Current display */}
              <div className="text-right">
                <p className="text-[10px] text-slate-400 mb-0.5">Ans={ans}</p>
                <p className="text-2xl font-black text-white break-all leading-tight min-h-[2rem]">
                  {display}
                </p>
              </div>
              {/* Second mode indicator */}
              {secondMode && (
                <div className="mt-1 text-[10px] text-yellow-400 font-bold text-right">2nd ▲</div>
              )}
            </div>
          )}

          {activeTab === "GRAPH" && (
            <div className="p-3">
              {graphExprs.map((expr, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold shrink-0" style={{ color: GRAPH_COLORS[idx % GRAPH_COLORS.length] }}>Y{idx+1}=</span>
                  <input
                    value={expr}
                    onChange={e => { const next = [...graphExprs]; next[idx] = e.target.value; setGraphExprs(next); }}
                    className="flex-1 bg-transparent text-white text-xs outline-none border-b pb-0.5"
                    style={{ borderColor: `${GRAPH_COLORS[idx % GRAPH_COLORS.length]}80` }}
                    placeholder={idx === 0 ? "e.g. sin(x)" : ""}
                  />
                </div>
              ))}
              <GraphView exprs={graphExprs} angleMode={angleMode} />
            </div>
          )}

          {activeTab === "TABLE" && (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-cyan-400 font-bold">Y1=</span>
                <input value={graphExprs[0]} onChange={e => { const next = [...graphExprs]; next[0] = e.target.value; setGraphExprs(next); }}
                  className="flex-1 bg-transparent text-white text-xs outline-none border-b border-cyan-400/50 focus:border-cyan-400 pb-0.5"
                  placeholder="e.g. x^2" />
              </div>
              <TableView expr={graphExprs[0]} angleMode={angleMode} />
            </div>
          )}
        </div>

        {/* Button grid */}
        <div className="px-3 pb-4 space-y-1.5">
          {BTN_ROWS.map((row, ri) => (
            <div key={ri} className="grid grid-cols-5 gap-1.5">
              {row.map((btn) => {
                const active = secondMode && btn.s;
                const label = active ? btn.s : btn.n;
                let cls = BTN_COLORS[btn.c] || "bg-slate-800 text-white";
                if (btn.n === "2nd" && secondMode) cls = "bg-yellow-400 text-black";
                if (btn.n === "=" ) cls = "bg-blue-600 text-white";
                return (
                  <div key={btn.n} className="flex flex-col items-center">
                    {btn.s && (
                      <span className={`text-[8px] font-bold mb-0.5 leading-none ${secondMode ? "text-yellow-400" : "text-slate-500"}`}>
                        {btn.s}
                      </span>
                    )}
                    <button
                      onClick={() => press(btn.n)}
                      className={`w-full rounded-lg py-2 text-[11px] font-bold transition-all active:scale-90 hover:brightness-110 ${cls}`}
                    >
                      {btn.n === "DEL" ? "DEL" : btn.n === "⌫" ? "⌫" : label === btn.n ? btn.n : btn.n}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3">Press 2nd to access yellow functions · MODE toggles DEG/RAD</p>
      <p className="text-xs text-slate-600 mt-1">⌨️ Keyboard: 0-9 · +-*/^%() · Enter=calc · Backspace=del · Esc=clear · s=sin( · as/ac/at=arcsin/cos/tan · log · ln · e · x</p>
    </div>
  );
}