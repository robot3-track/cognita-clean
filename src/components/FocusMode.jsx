import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

const SOUNDS = [
  { id: "off", label: "Off" },
  { id: "white", label: "White Noise" },
  { id: "brown", label: "Brown Noise" },
  { id: "rain", label: "Rain" },
];

function createWhiteNoise(ctx) {
  const bufferSize = 4096;
  const node = ctx.createScriptProcessor(bufferSize, 1, 1);
  node.onaudioprocess = e => {
    const out = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;
  };
  return node;
}

function createBrownNoise(ctx) {
  const bufferSize = 4096;
  let lastOut = 0;
  const node = ctx.createScriptProcessor(bufferSize, 1, 1);
  node.onaudioprocess = e => {
    const out = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      out[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = out[i];
      out[i] *= 3.5;
    }
  };
  return node;
}

function createRain(ctx) {
  // Rain = filtered white noise
  const bufferSize = 4096;
  const node = ctx.createScriptProcessor(bufferSize, 1, 1);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2000;
  filter.Q.value = 0.5;
  node.onaudioprocess = e => {
    const out = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = (Math.random() * 2 - 1) * 0.6;
  };
  node.connect(filter);
  return { node, filter };
}

export default function FocusMode() {
  const [active, setActive] = useState("off");
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const gainRef = useRef(null);

  const stopSound = () => {
    nodesRef.current.forEach(n => { try { n.disconnect(); } catch {} });
    nodesRef.current = [];
    if (gainRef.current) { try { gainRef.current.disconnect(); } catch {} gainRef.current = null; }
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
  };

  const playSound = (id) => {
    stopSound();
    if (id === "off") return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    if (id === "white") {
      const node = createWhiteNoise(ctx);
      node.connect(gain);
      nodesRef.current = [node];
    } else if (id === "brown") {
      const node = createBrownNoise(ctx);
      node.connect(gain);
      nodesRef.current = [node];
    } else if (id === "rain") {
      const { node, filter } = createRain(ctx);
      filter.connect(gain);
      nodesRef.current = [node, filter];
    }
  };

  const select = (id) => {
    setActive(id);
    playSound(id);
    setOpen(false);
  };

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => () => stopSound(), []);

  const isOn = active !== "off";
  const cardStyle = { background: "var(--app-surface-solid, #1e1e2e)", border: "1px solid var(--app-border)" };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isOn ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : "opacity-50 hover:opacity-80"}`}
        style={!isOn ? { background: "var(--app-surface)", border: "1px solid var(--app-border)" } : {}}
        title="Focus Mode"
      >
        {isOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        {isOn ? active.charAt(0).toUpperCase() + active.slice(1) : "Focus"}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 rounded-2xl shadow-2xl z-50 p-3 min-w-[180px]" style={cardStyle}>
          <p className="text-xs font-bold mb-2 px-1 opacity-50">Ambient Sound</p>
          {SOUNDS.map(s => (
            <button key={s.id} onClick={() => select(s.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all mb-0.5 ${active === s.id ? "bg-teal-500/20 text-teal-400" : "hover:bg-white/5 opacity-70"}`}
            >
              <Music className="w-3.5 h-3.5" />
              {s.label}
            </button>
          ))}
          {isOn && (
            <div className="px-2 pt-2 mt-1 border-t" style={{ borderColor: "var(--app-border)" }}>
              <p className="text-xs mb-1 opacity-50">Volume</p>
              <input type="range" min={0} max={1} step={0.05} value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}