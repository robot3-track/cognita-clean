import { Shield, Lock, Eye, Server, AlertTriangle, Users, Key, RefreshCw, ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const MEASURES = [
  {
    icon: Lock,
    color: "from-emerald-600 to-teal-600",
    title: "Authentication & Session Security",
    points: [
      "All user authentication is safely routed through Firebase Authentication's secure token ecosystem — no raw passwords pass through or are saved by Cognita.",
      "Sessions use cryptographically signed JSON Web Tokens (JWT) managed securely by the Firebase SDK client-side.",
      "Email verification filters can be configured before full system data mutations are allowed.",
      "Suspicious accounts can be immediately disabled or revoked via the Firebase Admin portal.",
    ],
  },
  {
    icon: Server,
    color: "from-blue-600 to-cyan-600",
    title: "Data Storage & Encryption",
    points: [
      "All operational structured entries are stored in Google Cloud Firestore with standard automatic encryption at rest (AES-256).",
      "All connections to the Firebase server nodes are fully encrypted in transit via TLS 1.2+.",
      "Flashcard decks and conversational logs are isolated by default — hidden from other nodes unless explicitly public flagged by their author.",
      "Media attachments, source files, and asset imports are housed securely in Firebase Cloud Storage using time-scoped, access-controlled URLs.",
    ],
  },
  {
    icon: Eye,
    color: "from-violet-600 to-purple-600",
    title: "Firestore Security Rules",
    points: [
      "Granular backend authorization rules are written directly into Firestore configurations to prevent perimeter tampering.",
      "Users can only read, update, or delete records where their logged-in token matches the target document ownership matrix.",
      "Flashcards, analytical profiles, and chat streams are completely user-scoped and secure against cross-tenant extraction.",
      "Public community study materials are readable globally but remain structurally locked down against unauthorized edits.",
    ],
  },
  {
    icon: Users,
    color: "from-pink-600 to-rose-600",
    title: "Server-Side Validation",
    points: [
      "All requests to database references require valid authorization vectors certified by Google authentication tokens.",
      "Ownership verification is executed server-side at the database layer before any change request is finalized.",
      "User emails and unique user identifiers (UID) are mapped directly against the verified session identity to eliminate identity spoofing.",
      "Unauthenticated connections are automatically dropped at the network edge for all non-public pathways.",
    ],
  },
  {
    icon: Key,
    color: "from-amber-600 to-orange-600",
    title: "Third-Party Integrations",
    points: [
      "AI components communicate safely via secure API routers (OpenAI, Gemini). Prompts and returns are not saved beyond active generation runtimes.",
      "Survey rewards are integrated via CPX Research. Cognita checks for verified callback parameters—no raw survey questionnaires are retained.",
      "File uploads are hosted directly on native Firebase Storage cells without relaying data channels to secondary analytics platforms.",
      "No programmatic advertising SDKs are loaded that could monitor or parse your custom study configurations.",
    ],
  },
  {
    icon: AlertTriangle,
    color: "from-red-600 to-orange-600",
    title: "Abuse Prevention",
    points: [
      "AI transaction credits are enforced client-side and verified server-side through transactional integrity routines.",
      "Protective rate-limits are embedded within system endpoints to block bad actors and scanning crawlers.",
      "Public text layers and flashcard materials remain under continuous administration review for community safety compliance.",
      "Accounts detected attempting reverse-engineering procedures can be blacklisted immediately at the Firebase root level.",
    ],
  },
  {
    icon: RefreshCw,
    color: "from-slate-600 to-gray-600",
    title: "Ongoing Security Practices",
    points: [
      "Firestore security configurations and access matrices are regularly validated with every structural migration.",
      "No critical secrets, service account credentials, or API secret structures are baked into the production client bundle.",
      "Environment flags and cloud configuration tokens are isolated inside secure server deployment parameters.",
      "Core application loops are systematically updated to ensure the platform remains defended against rising threats.",
    ],
  },
];

export default function SecurityPractices() {
  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen pb-28 px-5 py-12" style={bgStyle}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Security Practices</h1>
          <p className="text-sm" style={mutedStyle}>How Cognita protects your data and your users</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Link to={createPageUrl("TermsAndConditions")}>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                <FileText className="w-3.5 h-3.5" /> Terms &amp; Conditions <ChevronRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>

        {/* Summary callout */}
        <div className="rounded-2xl p-5 mb-8 border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-sm leading-relaxed" style={mutedStyle}>
            Cognita is built using Google Firebase's secure cloud ecosystem with{" "}
            <strong style={{ color: "var(--app-text)" }}>Firestore Security Rules guarding every database entity</strong>,{" "}
            <strong style={{ color: "var(--app-text)" }}>TLS-encrypted data in transit</strong>, and{" "}
            <strong style={{ color: "var(--app-text)" }}>AES-256 server-side encryption at rest</strong>. User data is private by default and never shared with unauthorized third parties.
          </p>
        </div>

        {/* Security sections */}
        <div className="space-y-5">
          {MEASURES.map(({ icon: Icon, color, title, points }) => (
            <div key={title} className="rounded-2xl p-6" style={cardStyle}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                  <Icon className="text-white w-[18px] h-[18px]" />
                </div>
                <h2 className="font-bold text-sm">{title}</h2>
              </div>
              <ul className="space-y-2">
                {points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={mutedStyle}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs" style={mutedStyle}>
            For security concerns or vulnerability disclosures, contact us via the in-app feedback widget.
          </p>
        </div>
      </div>
    </div>
  );
}