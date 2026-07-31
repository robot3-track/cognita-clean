import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ClipboardList, Lightbulb, Flag, BarChart3, ChevronRight } from "lucide-react";

const PREP_OPTIONS = [
  {
    title: "AP Exam Prep",
    desc: "FRQ, MCQ, and full exam simulation for 25+ AP subjects",
    icon: ClipboardList,
    color: "from-violet-600 to-indigo-600",
    page: "APTesting",
  },
  {
    title: "AP Exam Tips",
    desc: "Expert pre-written strategies and tips for 15+ AP subjects",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-600",
    page: "APTips",
  },
  {
    title: "State Test Prep",
    desc: "Practice for state standardized tests and assessments",
    icon: Flag,
    color: "from-blue-600 to-cyan-600",
    page: "StateTestPrep",
  },
  {
    title: "iReady Diagnostic Prep",
    desc: "Prepare for the iReady Math and Reading diagnostics",
    icon: BarChart3,
    color: "from-emerald-600 to-teal-600",
    page: "iReadyPrep",
  },
];

export default function ExamPrep() {
  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2">Exam Prep</h1>
          <p className="text-sm" style={mutedStyle}>Choose your exam type to start practicing</p>
        </div>

        <div className="space-y-3">
          {PREP_OPTIONS.map(({ title, desc, icon: Icon, color, page }) => (
            <Link key={page} to={createPageUrl(page)}>
              <div
                className="flex items-center gap-4 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md"
                style={cardStyle}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{title}</p>
                  <p className="text-xs mt-0.5" style={mutedStyle}>{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-30 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}