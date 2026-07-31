import { CheckCircle2, Sparkles, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const ALL_FEATURES = [
  "Unlimited AI flashcard generation",
  "Unlimited practice quizzes",
  "AI chatbot tutor",
  "Upload PDFs & documents",
  "Unlimited decks",
  "AI Audio Summaries (podcast-style)",
  "AI Video Lessons from your notes",
  "Advanced analytics & progress tracking",
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-16 pb-28">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free — No credit card needed
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            Everything is <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">free</span>
          </h1>
          <p className="text-white/40 text-lg max-w-md mx-auto">All features are available to every Cognita user at no cost. No paywalls, no limits.</p>
        </div>

        {/* Single free plan card */}
        <div className="bg-gradient-to-br from-violet-900/30 to-blue-900/30 border border-violet-500/30 rounded-3xl p-8 mb-8">
          <div className="mb-6">
            <div className="text-violet-300 text-sm font-semibold uppercase tracking-wider mb-2">Free — Forever</div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-6xl font-black">$0</span>
              <span className="text-white/30 mb-2">/month</span>
            </div>
            <p className="text-white/40 text-sm">Full access to every feature, always.</p>
          </div>
          <ul className="space-y-3 mb-8">
            {ALL_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">{f}</span>
              </li>
            ))}
          </ul>
          <Link to={createPageUrl("Chat")}>
            <button className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-6 py-3.5 rounded-2xl font-semibold transition-all shadow-xl shadow-violet-900/40">
              Start Studying Now
            </button>
          </Link>
        </div>

        {/* Privacy assurance */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Your data is never shared</h3>
            <p className="text-white/30 text-sm leading-relaxed">We do not sell, rent, or share your personal data or study materials with any third parties. Your content stays completely private and is only used to power your own study sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}