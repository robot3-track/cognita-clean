import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";
import { Play, Download, Save, Trash2, Copy, Check, ChevronDown, Code2, Terminal, RefreshCw, Loader2 } from "lucide-react";

import { callAI } from "@/lib/lynxApi";
import CodeSandboxAI from "@/components/CodeSandboxAI";

const LANGUAGES = [
  { id: "html", label: "HTML", ext: "html", color: "from-orange-500 to-red-500" },
  { id: "python", label: "Python", ext: "py", color: "from-blue-500 to-cyan-500" },
  { id: "cpp", label: "C++", ext: "cpp", color: "from-violet-500 to-indigo-500" },
];

const STARTERS = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Page</title>
  <style>
    body { font-family: sans-serif; background: #0f0f1a; color: #e2e8f0; padding: 2rem; }
    h1 { color: #a78bfa; }
    button { background: #7c3aed; color: white; border: none; padding: 0.5rem 1.2rem; border-radius: 8px; cursor: pointer; font-size: 1rem; }
    button:hover { background: #6d28d9; }
  </style>
</head>
<body>
  <h1>Hello, Cognita!</h1>
  <p>Edit this HTML and click <strong>Run</strong> to see it live.</p>
  <button onclick="alert('Hello!')">Click me</button>
</body>
</html>`,

  python: `# Python Sandbox (simulated via Pyodide in-browser)
print("Hello from Python!")

# Try some calculations
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum of {numbers} = {total}")

# Fibonacci
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=" ")
        a, b = b, a + b
    print()

print("Fibonacci sequence:")
fib(10)
`,

  cpp: `// C++ Sandbox (simulated — output shown below)
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;

    vector<int> nums = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int n : nums) sum += n;
    cout << "Sum: " << sum << endl;

    // Simple loop
    for (int i = 1; i <= 5; i++) {
        cout << i << " * " << i << " = " << i * i << endl;
    }

    return 0;
}
`,
};

// ── Pyodide Python runner (loads once) ───────────────────────────────────────
let pyodideInstance = null;
let pyodideLoading = false;
let pyodideCallbacks = [];

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) {
    return new Promise((resolve) => pyodideCallbacks.push(resolve));
  }
  pyodideLoading = true;
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  pyodideInstance = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
  pyodideCallbacks.forEach(cb => cb(pyodideInstance));
  pyodideCallbacks = [];
  return pyodideInstance;
}

async function runPython(code) {
  const pyodide = await getPyodide();
  const output = [];
  pyodide.setStdout({ batched: (s) => output.push(s) });
  pyodide.setStderr({ batched: (s) => output.push("⚠️ " + s) });
  await pyodide.runPythonAsync(code);
  return output.join("\n") || "(no output)";
}

// ── C++ simulated interpreter (basic) ────────────────────────────────────────
function simulateCpp(code) {
  const lines = [];
  // Extract cout << "..." << endl; and cout << expr;
  const coutRegex = /cout\s*<<\s*((?:(?:"[^"]*"|[^;,<>]+)(?:\s*<<\s*)?)+)\s*(?:<<\s*endl\s*)?;/g;
  let match;
  while ((match = coutRegex.exec(code)) !== null) {
    let parts = match[1].split("<<").map(s => s.trim()).filter(s => s && s !== "endl");
    let line = parts.map(p => {
      if (p.startsWith('"') && p.endsWith('"')) return p.slice(1, -1);
      if (p === "endl") return "";
      // try to evaluate simple expressions
      try {
        // replace i*i pattern etc.
        return String(Function(`"use strict"; return (${p})`)());
      } catch {
        return p;
      }
    }).join("");
    lines.push(line);
  }
  if (lines.length === 0) {
    return "⚠️ C++ simulation: Only basic cout << \"...\" << endl; statements are shown.\nFor full C++ execution, a backend compiler is required.\n\nYour code compiled successfully (simulated).";
  }
  return lines.join("\n");
}

export default function CodeSandbox() {
  const [lang, setLang] = useState("html");
  const [code, setCode] = useState(STARTERS["html"]);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [loadingPy, setLoadingPy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [user, setUser] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const iframeRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => {});
    // Load saved snippets from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("cognita_code_snippets") || "[]");
      setSavedSnippets(saved);
    } catch {}

    // Read URL params from Chat smart-navigate
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt");
    if (prompt) {
      window.history.replaceState({}, "", window.location.pathname);
      generateCodeFromPrompt(prompt);
    }
  }, []);

  const generateCodeFromPrompt = async (prompt) => {
    setAiGenerating(true);
    setOutput("⏳ Generating code from your request...");
    const result = await callAI({
      prompt: `Generate working code for the following request. Choose the best language (html, python, or cpp). Return ONLY the raw code, no explanation, no markdown fences.\n\nRequest: ${prompt}`,
      feature: "code_sandbox_generate",
    });
    // Detect language from content
    let detectedLang = "html";
    if (result.includes("print(") || result.includes("def ") || result.includes("import ")) detectedLang = "python";
    else if (result.includes("#include") || result.includes("cout")) detectedLang = "cpp";
    setLang(detectedLang);
    setCode(result.trim());
    setOutput("✅ Code generated! Click Run to execute.");
    setAiGenerating(false);
  };

  // Tab key support in textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const handler = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newVal = code.substring(0, start) + "  " + code.substring(end);
        setCode(newVal);
        setTimeout(() => { el.selectionStart = el.selectionEnd = start + 2; }, 0);
      }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [code]);

  const switchLang = (newLang) => {
    setLang(newLang);
    setCode(STARTERS[newLang]);
    setOutput("");
  };

  const runCode = async () => {
    setRunning(true);
    setOutput("");
    try {
      if (lang === "html") {
        // Inject into iframe
        if (iframeRef.current) {
          iframeRef.current.srcdoc = code;
        }
        setOutput("✅ HTML rendered in preview above.");
      } else if (lang === "python") {
        setLoadingPy(true);
        setOutput("⏳ Loading Python runtime (first run takes ~10s)...");
        const result = await runPython(code);
        setOutput(result);
        setLoadingPy(false);
      } else if (lang === "cpp") {
        // Simulate C++ output
        const result = simulateCpp(code);
        setOutput(result);
      }
    } catch (err) {
      setOutput("❌ Error: " + (err.message || String(err)));
      setLoadingPy(false);
    }
    setRunning(false);
  };

  const downloadCode = () => {
    const currentLang = LANGUAGES.find(l => l.id === lang);
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cognita_code.${currentLang.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveSnippet = () => {
    if (!saveName.trim()) return;
    const snippet = { id: Date.now(), name: saveName.trim(), lang, code, createdAt: new Date().toISOString() };
    const updated = [snippet, ...savedSnippets].slice(0, 20);
    setSavedSnippets(updated);
    localStorage.setItem("cognita_code_snippets", JSON.stringify(updated));
    setSaveName("");
    setShowSaveModal(false);
  };

  const loadSnippet = (snippet) => {
    setLang(snippet.lang);
    setCode(snippet.code);
    setOutput("");
    setShowSaved(false);
  };

  const deleteSnippet = (id) => {
    const updated = savedSnippets.filter(s => s.id !== id);
    setSavedSnippets(updated);
    localStorage.setItem("cognita_code_snippets", JSON.stringify(updated));
  };

  const currentLang = LANGUAGES.find(l => l.id === lang);
  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen pb-20" style={bgStyle}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 flex-wrap" style={{ background: "var(--app-nav-bg)", borderBottom: "1px solid var(--app-border)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-base">Code Sandbox</span>
          {aiGenerating && (
            <span className="flex items-center gap-1.5 text-xs text-violet-400 font-semibold ml-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI generating...
            </span>
          )}
        </div>

        {/* Language selector */}
        <div className="flex gap-1.5">
          {LANGUAGES.map(l => (
            <button key={l.id} onClick={() => switchLang(l.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${lang === l.id ? `bg-gradient-to-r ${l.color} text-white` : "opacity-50 hover:opacity-80"}`}
              style={lang !== l.id ? cardStyle : {}}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Saved snippets */}
          <button onClick={() => setShowSaved(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={cardStyle}>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSaved ? "rotate-180" : ""}`} />
            Saved ({savedSnippets.length})
          </button>
          {/* Copy */}
          <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80" style={cardStyle}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          {/* Save */}
          <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80" style={cardStyle}>
            <Save className="w-3.5 h-3.5" /> Save
          </button>
          {/* Download */}
          <button onClick={downloadCode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80" style={cardStyle}>
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          {/* Run */}
          <button onClick={runCode} disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all">
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            Run
          </button>
        </div>
      </div>

      {/* Saved snippets dropdown */}
      {showSaved && (
        <div className="mx-4 mt-2 rounded-2xl overflow-hidden" style={cardStyle}>
          {savedSnippets.length === 0 ? (
            <p className="px-4 py-3 text-sm" style={mutedStyle}>No saved snippets yet.</p>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--app-border)" }}>
              {savedSnippets.map(s => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{s.name}</p>
                    <p className="text-xs" style={mutedStyle}>{s.lang.toUpperCase()} · {new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => loadSnippet(s)} className="text-xs font-bold text-violet-400 hover:text-violet-300 px-2 py-1 rounded-lg transition-all">Load</button>
                  <button onClick={() => deleteSnippet(s.id)} className="text-xs font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setShowSaveModal(false)}>
          <div className="w-full max-w-xs rounded-3xl p-6" style={{ background: "#1a1033", border: "1px solid rgba(139,92,246,0.3)" }} onClick={e => e.stopPropagation()}>
            <h2 className="font-black text-base mb-4">Save Snippet</h2>
            <input value={saveName} onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveSnippet()}
              placeholder="Snippet name..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-3"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
              autoFocus />
            <div className="flex gap-2">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold opacity-50 hover:opacity-80 transition-all" style={cardStyle}>Cancel</button>
              <button onClick={saveSnippet} disabled={!saveName.trim()} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-40 transition-all">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] overflow-hidden">
        {/* Editor panel */}
        <div className="flex-1 flex flex-col min-h-0 border-r" style={{ borderColor: "var(--app-border)" }}>
          <div className="flex items-center gap-2 px-4 py-2 shrink-0" style={{ borderBottom: "1px solid var(--app-border)" }}>
            <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${currentLang.color}`} />
            <span className="text-xs font-bold" style={mutedStyle}>editor.{currentLang.ext}</span>
            <button onClick={() => setCode(STARTERS[lang])} className="ml-auto text-xs opacity-40 hover:opacity-70 flex items-center gap-1 transition-all">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full p-4 text-sm font-mono outline-none resize-none"
            style={{ background: "#0a0a14", color: "#e2e8f0", lineHeight: "1.6", tabSize: 2 }}
          />
        </div>

        {/* Output panel */}
        <div className="flex-1 flex flex-col min-h-0 lg:max-w-[50%]">
          {/* HTML preview */}
          {lang === "html" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 px-4 py-2 shrink-0" style={{ borderBottom: "1px solid var(--app-border)" }}>
                <Terminal className="w-3.5 h-3.5" style={mutedStyle} />
                <span className="text-xs font-bold" style={mutedStyle}>Preview</span>
              </div>
              <iframe
                ref={iframeRef}
                title="HTML Preview"
                className="flex-1 w-full bg-white"
                sandbox="allow-scripts allow-modals"
                srcDoc={`<!DOCTYPE html><html><body style="background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:#374151;"><p style="opacity:0.4">Click Run ▶ to preview your HTML</p></body></html>`}
              />
            </div>
          )}

          {/* Console output (Python / C++) */}
          {lang !== "html" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 px-4 py-2 shrink-0" style={{ borderBottom: "1px solid var(--app-border)" }}>
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold" style={mutedStyle}>Console Output</span>
                {lang === "python" && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full text-blue-300" style={{ background: "rgba(59,130,246,0.1)" }}>
                    Powered by Pyodide
                  </span>
                )}
                {lang === "cpp" && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full text-violet-300" style={{ background: "rgba(139,92,246,0.1)" }}>
                    Simulated output
                  </span>
                )}
              </div>
              <pre className="flex-1 p-4 text-sm font-mono overflow-auto" style={{ background: "#050510", color: "#4ade80", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {output || <span style={{ color: "rgba(255,255,255,0.2)" }}>Click Run ▶ to execute your code...</span>}
              </pre>
            </div>
          )}

          {/* Note for C++ */}
          {lang === "cpp" && (
            <div className="px-4 py-2.5 text-[11px] shrink-0" style={{ borderTop: "1px solid var(--app-border)", color: "rgba(255,255,255,0.3)" }}>
              ⚡ C++ output is simulated (cout statements). For full compilation, download your code and run with a local compiler (g++).
            </div>
          )}

          {/* AI Code Helper */}
          <CodeSandboxAI lang={lang} code={code} user={user} />
        </div>
      </div>
    </div>
  );
}