import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ClipboardList, Lightbulb, Flag, BarChart3, ChevronRight, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";

const PREP_OPTIONS = [
  {
    title: "AP® Exam Practice",
    subtitle: "Advanced Placement",
    desc: "Simulated FRQ, MCQ, and full-length exam modules for 25+ AP subjects.",
    tag: "AP® Official Standards",
    icon: ClipboardList,
    color: "from-blue-700 via-indigo-600 to-violet-700",
    page: "APTesting",
    cta: "Start Practice",
  },
  {
    title: "AP® Scoring Tips & Strategies",
    subtitle: "Excellence & Strategy",
    desc: "Expert rubric breakdowns, scoring guides, and high-yield study notes.",
    tag: "Rubrics & Guides",
    icon: Lightbulb,
    color: "from-amber-500 via-orange-600 to-amber-700",
    page: "APTips",
    cta: "View Strategies",
  },
  {
    title: "State Assessment Prep",
    subtitle: "Standardized Testing",
    desc: "State-aligned practice modules and standardized benchmark assessments.",
    tag: "State Standards",
    icon: Flag,
    color: "from-emerald-600 via-teal-600 to-cyan-700",
    page: "StateTestPrep",
    cta: "Begin Module",
  },
  {
    title: "iReady Diagnostic Prep",
    subtitle: "Adaptive Learning",
    desc: "Targeted skill reinforcement for iReady Math and Reading diagnostics.",
    tag: "Diagnostic Prep",
    icon: BarChart3,
    color: "from-violet-600 via-purple-600 to-indigo-700",
    page: "iReadyPrep",
    cta: "Take Diagnostic",
  },
];

export default function ExamPrep() {
  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen pb-28 px-4 sm:px-6 py-10" style={bgStyle}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section (College Board Portal Style) */}
        <div className="rounded-3xl p-6 sm:p-8 border shadow-sm relative overflow-hidden" style={cardStyle}>
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Assessment & Testing Center</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--app-text)]">
                  Exam Preparation Portal
                </h1>
                <p className="text-xs sm:text-sm mt-1" style={mutedStyle}>
                  Select a standardized assessment track to begin targeted practice and diagnostic evaluations.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 self-start sm:self-auto">
                <ShieldCheck className="w-4 h-4" />
                <span>2026 Curriculum Aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Options Grid (Fixed Button Spacing & Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PREP_OPTIONS.map(({ title, subtitle, desc, tag, icon: Icon, color, page, cta }) => (
            <Link key={page} to={createPageUrl(page)} className="group block h-full">
              <div
                className="h-full flex flex-col justify-between rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-500/40 relative overflow-hidden"
                style={cardStyle}
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/15" style={mutedStyle}>
                      {tag}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div>
                    <p className="text-[11px] font-bold tracking-wider uppercase text-blue-400 mb-0.5">{subtitle}</p>
                    <h3 className="font-extrabold text-base text-[var(--app-text)] group-hover:text-blue-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs mt-2 leading-relaxed" style={mutedStyle}>
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Bottom Action CTA Row */}
                <div className="pt-5 mt-4 border-t border-dashed flex items-center justify-between" style={{ borderColor: "var(--app-border)" }}>
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {cta} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
