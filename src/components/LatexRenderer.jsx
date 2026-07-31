import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Renders text that may contain LaTeX: $$block$$ or $inline$
export default function LatexRenderer({ text, className = "" }) {
  if (!text) return null;

  const parts = [];
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", content: text.slice(last, match.index) });
    }
    const val = match[0];
    if (val.startsWith("$$")) {
      parts.push({ type: "block", content: val.slice(2, -2).trim() });
    } else {
      parts.push({ type: "inline", content: val.slice(1, -1).trim() });
    }
    last = match.index + val.length;
  }
  if (last < text.length) {
    parts.push({ type: "text", content: text.slice(last) });
  }

  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.type === "block") {
          return (
            <span key={i} className="block my-2">
              <BlockMath math={p.content} />
            </span>
          );
        }
        if (p.type === "inline") {
          return <InlineMath key={i} math={p.content} />;
        }
        return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{p.content}</span>;
      })}
    </span>
  );
}