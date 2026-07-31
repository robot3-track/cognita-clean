import { useState } from "react";

// Score descriptions matching College Board language
const SCORE_INFO = {
  5: {
    label: "Extremely well qualified",
    desc: "Most U.S. colleges accept your score for credit and placement.",
    college: "Eligible for credit and advanced placement at virtually all colleges",
    color: "#1a56db",
    ring: "#1a56db",
  },
  4: {
    label: "Well qualified",
    desc: "Most U.S. colleges accept your score for credit and placement.",
    college: "Eligible for credit at most colleges and universities",
    color: "#1a56db",
    ring: "#1a56db",
  },
  3: {
    label: "Qualified",
    desc: "Many U.S. colleges grant credit or advanced placement for this score.",
    college: "Many colleges grant credit — check your school's AP policy",
    color: "#f59e0b",
    ring: "#f59e0b",
  },
  2: {
    label: "Possibly qualified",
    desc: "Some colleges may grant credit. Keep studying for a higher score.",
    college: "Limited college credit — consider retaking the exam",
    color: "#ef4444",
    ring: "#ef4444",
  },
  1: {
    label: "No recommendation",
    desc: "This score does not qualify for college credit at most institutions.",
    college: "Most colleges do not grant credit for a score of 1",
    color: "#ef4444",
    ring: "#ef4444",
  },
};

// Building icons SVG (college campus illustration)
function CampusIllustration() {
  return (
    <svg viewBox="0 0 280 80" className="w-full max-w-xs mx-auto" fill="none">
      {/* Left building */}
      <rect x="10" y="35" width="40" height="45" rx="2" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
      <rect x="18" y="45" width="8" height="10" rx="1" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      <rect x="32" y="45" width="8" height="10" rx="1" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      <rect x="24" y="60" width="12" height="20" rx="1" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      {/* Flag on left */}
      <line x1="30" y1="35" x2="30" y2="20" stroke="#9ca3af" strokeWidth="1.5"/>
      <polygon points="30,20 42,24 30,28" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      
      {/* Center main building (largest) */}
      <rect x="80" y="20" width="120" height="60" rx="2" fill="none" stroke="#6b7280" strokeWidth="2"/>
      {/* Columns */}
      {[98, 112, 126, 140, 154, 168, 182].map((x, i) => (
        <rect key={i} x={x} y="55" width="5" height="25" rx="1" fill="none" stroke="#6b7280" strokeWidth="1.5"/>
      ))}
      {/* Triangular pediment */}
      <polygon points="80,20 140,2 200,20" fill="none" stroke="#6b7280" strokeWidth="2"/>
      {/* Center door */}
      <rect x="130" y="60" width="20" height="20" rx="2" fill="none" stroke="#6b7280" strokeWidth="1.5"/>
      {/* Windows row */}
      {[90, 112, 158, 180].map((x, i) => (
        <rect key={i} x={x} y="28" width="14" height="14" rx="1" fill="none" stroke="#6b7280" strokeWidth="1"/>
      ))}
      {/* Dome */}
      <path d="M125,20 Q140,8 155,20" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
      <circle cx="140" cy="8" r="3" fill="none" stroke="#6b7280" strokeWidth="1.5"/>
      
      {/* Right building */}
      <rect x="230" y="35" width="40" height="45" rx="2" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
      <rect x="238" y="45" width="8" height="10" rx="1" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      <rect x="252" y="45" width="8" height="10" rx="1" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      <rect x="244" y="60" width="12" height="20" rx="1" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      {/* Flag on right */}
      <line x1="250" y1="35" x2="250" y2="20" stroke="#9ca3af" strokeWidth="1.5"/>
      <polygon points="250,20 262,24 250,28" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      
      {/* Trees */}
      <circle cx="65" cy="55" r="8" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      <line x1="65" y1="63" x2="65" y2="75" stroke="#9ca3af" strokeWidth="1.5"/>
      <circle cx="215" cy="55" r="8" fill="none" stroke="#9ca3af" strokeWidth="1"/>
      <line x1="215" y1="63" x2="215" y2="75" stroke="#9ca3af" strokeWidth="1.5"/>
      
      {/* Ground line */}
      <line x1="0" y1="80" x2="280" y2="80" stroke="#d1d5db" strokeWidth="1"/>
    </svg>
  );
}

// Circular score display
function ScoreCircle({ score }) {
  const info = SCORE_INFO[score] || SCORE_INFO[1];
  const circumference = 2 * Math.PI * 52;
  const fillPct = score / 5;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
          {/* Background circle */}
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
          {/* Score arc */}
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={info.ring}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${circumference * fillPct} ${circumference}`}
          />
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400" style={{ fontSize: "9px", letterSpacing: "0.12em" }}>YOUR SCORE</span>
          <span className="text-5xl font-black leading-none" style={{ color: "#1a1a2e" }}>{score}</span>
        </div>
      </div>
    </div>
  );
}

export default function APScoreResult({ score, subject, mcqPct, frqScore, onRetake, onClose }) {
  const [showDetails, setShowDetails] = useState(false);
  const info = SCORE_INFO[score] || SCORE_INFO[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" style={{ fontFamily: "system-ui" }}>
        {/* AP Classroom header bar */}
        <div className="flex items-center px-5 py-3 border-b border-gray-200" style={{ background: "#f8f9fa" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center font-black text-white text-xs" style={{ background: "#1a56db" }}>AP</div>
            <span className="font-bold text-sm text-gray-700">{subject || "AP Exam"}</span>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 text-lg font-bold leading-none">×</button>
        </div>

        <div className="px-6 py-8 flex flex-col items-center text-center space-y-5">
          {/* Score circle */}
          <ScoreCircle score={score} />

          {/* Campus illustration */}
          <div className="w-full py-2">
            <CampusIllustration />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800 leading-relaxed">{info.desc}</p>
            {score >= 3 && (
              <p className="text-xs text-gray-500">{info.college}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="w-full space-y-2.5">
            <button
              onClick={() => setShowDetails(d => !d)}
              className="w-full py-3 rounded-2xl border-2 font-bold text-sm transition-all hover:bg-gray-50"
              style={{ borderColor: "#1a1a2e", color: "#1a1a2e" }}
            >
              {showDetails ? "Hide Details" : "View Score Details"}
            </button>

            {showDetails && (
              <div className="rounded-2xl p-4 text-left space-y-2" style={{ background: "#f8f9fa", border: "1px solid #e5e7eb" }}>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Score Breakdown</p>
                {mcqPct != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MCQ Section</span>
                    <span className="font-bold text-gray-800">{mcqPct}%</span>
                  </div>
                )}
                {frqScore && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">FRQ Section</span>
                    <span className="font-bold text-gray-800">{frqScore}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-1 border-t border-gray-200">
                  <span className="text-gray-600">AP Qualification</span>
                  <span className="font-bold" style={{ color: info.color }}>{info.label}</span>
                </div>
              </div>
            )}

            <a
              href="https://apstudents.collegeboard.org/getting-credit-placement/search-policies"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm font-semibold underline py-1"
              style={{ color: "#1a56db" }}
            >
              Find College Credit
            </a>
            <button onClick={() => { setShowDetails(false); }} className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1 underline">
              About your score
            </button>
          </div>

          {onRetake && (
            <button onClick={onRetake} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Take another exam →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}