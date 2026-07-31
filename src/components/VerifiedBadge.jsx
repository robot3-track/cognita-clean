/**
 * VerifiedBadge — Meta-style blue verified badge (scalloped circle + checkmark)
 * Usage: <VerifiedBadge />
 */
export default function VerifiedBadge({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      title="Verified deck"
      style={{ display: "inline-block", flexShrink: 0 }}
    >
      {/* Scalloped badge shape */}
      <path
        d="M11 1l2.09 3.26L17 3l.5 4.09L21 9l-2.5 3.5L21 16l-3.5 1.41L17 21l-3.91-.74L11 23l-2.09-2.74L5 21l-.5-4.09L1 15l2.5-3.5L1 8l3.5-1.41L5 3l3.91.74L11 1z"
        fill="#1877F2"
      />
      {/* Checkmark */}
      <path
        d="M7.5 11l2.5 2.5 5-5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}