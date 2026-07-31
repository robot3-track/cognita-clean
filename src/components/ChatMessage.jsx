import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";

// Recursively walk react children, applying LaTeX rendering to string leaves
function walkChildren(children) {
  if (children === null || children === undefined) return null;
  if (typeof children === "string") return <LatexInline text={children} />;
  if (Array.isArray(children)) return children.map((c, i) => <React.Fragment key={i}>{walkChildren(c)}</React.Fragment>);
  return children;
}

// Pre-process AI output: convert \[...\] → $$...$$ and \(...\) → $...$
function normalizeLatex(text) {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `$$${m}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => `$${m}$`);
}

// Renders a single string that may have $...$ or $$...$$ LaTeX
function LatexInline({ text }) {
  if (!text || typeof text !== "string") return <>{text}</>;
  const normalized = normalizeLatex(text);
  // Quick check to avoid expensive split when no math present
  if (!normalized.includes("$")) return <>{normalized}</>;

  const parts = [];
  const regex = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g;
  const textToProcess = normalized;
  let last = 0;
  let match;
  while ((match = regex.exec(textToProcess)) !== null) {
    if (match.index > last) parts.push({ t: "text", v: textToProcess.slice(last, match.index) });
    const block = match[0].startsWith("$$");
    const inner = block ? match[0].slice(2, -2).trim() : match[0].slice(1, -1).trim();
    parts.push({ t: block ? "block" : "inline", v: inner });
    last = match.index + match[0].length;
  }
  if (last < textToProcess.length) parts.push({ t: "text", v: textToProcess.slice(last) });

  return (
    <>
      {parts.map((p, i) =>
        p.t === "block" ? (
          <span key={i} className="block my-2">
            <BlockMath math={p.v} />
          </span>
        ) : p.t === "inline" ? (
          <InlineMath key={i} math={p.v} />
        ) : (
          <React.Fragment key={i}>{p.v}</React.Fragment>
        )
      )}
    </>
  );
}

const mdComponents = {
  p({ children }) { return <p className="mb-2 last:mb-0 leading-relaxed">{walkChildren(children)}</p>; },
  strong({ children }) { return <strong className="font-bold">{walkChildren(children)}</strong>; },
  em({ children }) { return <em>{walkChildren(children)}</em>; },
  li({ children }) { return <li className="my-0.5">{walkChildren(children)}</li>; },
  ul({ children }) { return <ul className="list-disc ml-4 my-2">{children}</ul>; },
  ol({ children }) { return <ol className="list-decimal ml-4 my-2">{children}</ol>; },
  h1({ children }) { return <h1 className="text-lg font-bold mt-3 mb-1">{walkChildren(children)}</h1>; },
  h2({ children }) { return <h2 className="text-base font-bold mt-3 mb-1">{walkChildren(children)}</h2>; },
  h3({ children }) { return <h3 className="text-sm font-bold mt-2 mb-1">{walkChildren(children)}</h3>; },
  code({ inline, children }) {
    const str = String(children).replace(/\n$/, "");
    if (inline) return <code className="px-1 py-0.5 rounded text-xs font-mono bg-white/10">{str}</code>;
    return <pre className="rounded-xl p-3 my-2 overflow-x-auto text-xs bg-white/5 font-mono"><code>{str}</code></pre>;
  },
  blockquote({ children }) { return <blockquote className="border-l-2 border-violet-400 pl-3 my-2 opacity-80">{children}</blockquote>; },
};

export default function ChatMessage({ content }) {
  return (
    <div className="text-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown components={mdComponents}>{content || ""}</ReactMarkdown>
    </div>
  );
}