import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, GraduationCap, School, BookOpen, 
  ArrowRight, Check, Loader2, ArrowLeft, Play, Camera, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const SPLASH_KEY = "cognita_welcome_seen_v8";
const PREF_ROLE_KEY = "cognita_user_role";

// Legacy key fallbacks to check if user has visited previously
const LEGACY_KEYS = [
  "cognita_welcome_seen_v7",
  "cognita_welcome_seen_v6",
  "cognita_new_user"
];

const LOADING_STATUSES = [
  "Setting up workspace settings...",
  "Syncing recent study materials...",
  "Loading formulas and formatting options...",
  "Preparing study tools...",
  "Optimizing dashboard components...",
  "Checking local storage configuration..."
];

const ROLES = [
  { 
    id: "highschool", 
    title: "High School Student", 
    desc: "AP prep, study groups, and flashcard tools", 
    icon: School 
  },
  { 
    id: "college", 
    title: "College / University", 
    desc: "Notes, complex topic breakdowns, and study sets", 
    icon: GraduationCap 
  },
  { 
    id: "educator", 
    title: "Educator / Teacher", 
    desc: "Classroom management, student rosters, and materials", 
    icon: BookOpen 
  }
];

export default function WelcomeSplash({ isBackendLoading }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1); 
  const [selectedRole, setSelectedRole] = useState("");
  const [statusIndex, setStatusIndex] = useState(0);
  const [minTimerDone, setMinTimerDone] = useState(false);

  // Status text ticker during step 1
  useEffect(() => {
    if (step !== 1) return;
    
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [step]);

  // Check initial visibility state
  useEffect(() => {
    const hasSeenSplash = 
      localStorage.getItem(SPLASH_KEY) || 
      LEGACY_KEYS.some((key) => localStorage.getItem(key));

    if (!hasSeenSplash) {
      setVisible(true);
      
      const timer = setTimeout(() => {
        setMinTimerDone(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Progress to step 2 once minimum display time & backend load complete
  useEffect(() => {
    if (visible && step === 1 && minTimerDone && !isBackendLoading) {
      setStep(2);
    }
  }, [isBackendLoading, minTimerDone, visible, step]);

  const handleSaveRole = () => {
    if (selectedRole) {
      localStorage.setItem(PREF_ROLE_KEY, selectedRole);
      window.dispatchEvent(new Event("cognita_role_changed"));
    }
    setStep(3);
  };

  const handleFinish = () => {
    localStorage.setItem(SPLASH_KEY, "1");
    setVisible(false);
  };

  const handleNavigate = (path) => {
    localStorage.setItem(SPLASH_KEY, "1");
    setVisible(false);
    navigate(createPageUrl(path));
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center font-sans antialiased select-none overflow-hidden bg-slate-950 text-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-xl px-6 py-8 flex flex-col h-full md:h-auto md:max-h-[85vh] justify-between relative z-10">
          
          {/* Step 1: Initial Loader */}
          {step === 1 && (
            <motion.div 
              className="flex flex-col items-center justify-center text-center flex-1 my-auto space-y-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl animate-pulse" />
                <img 
                  src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                  alt="Cognita" 
                  className="w-16 h-16 rounded-2xl border border-slate-800/60 shadow-2xl relative z-10 p-1.5 bg-slate-900/50 backdrop-blur-md"
                />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Welcome to Cognita
                </h1>
                <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                  Preparing your workspace
                </p>
              </div>

              <div className="min-h-[36px] px-6 flex items-center justify-center">
                <p className="text-xs text-slate-400 font-medium transition-all duration-200 max-w-xs">
                  {LOADING_STATUSES[statusIndex]}
                </p>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-sm">
                <Loader2 className="w-3.5 h-3.5 text-slate-200 animate-spin" />
                <span className="text-[11px] font-semibold tracking-wide text-slate-300 uppercase">Loading...</span>
              </div>
            </motion.div>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <motion.div 
              className="flex flex-col justify-center flex-1 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-semibold tracking-wider text-violet-400 uppercase bg-violet-500/10 px-2.5 py-1 rounded-md">
                  Setup
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
                  What best describes your role?
                </h2>
                <p className="text-xs text-slate-400">
                  This helps customize your default options and navigation.
                </p>
              </div>

              <div className="space-y-2.5">
                {ROLES.map((role) => {
                  const IconComponent = role.icon;
                  const isSelected = selectedRole === role.id;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                        isSelected 
                          ? "bg-violet-600/10 border-violet-500/80 shadow-md shadow-violet-500/5" 
                          : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected ? "bg-violet-500/20 border-violet-400 text-violet-300" : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-200">{role.title}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{role.desc}</p>
                        </div>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? "bg-violet-600 border-violet-400 text-white" : "border-slate-700 bg-slate-950"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedRole}
                  onClick={handleSaveRole}
                  className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-600/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Quick Start / Navigation Cards */}
          {step === 3 && (
            <motion.div 
              className="flex flex-col justify-center flex-1 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <button 
                    type="button"
                    onClick={() => setStep(2)} 
                    className="p-1 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-semibold tracking-wider text-violet-400 uppercase bg-violet-500/10 px-2.5 py-1 rounded-md">
                    Ready
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
                  Get Started
                </h2>
                <p className="text-xs text-slate-400">
                  Pick a feature to try or head directly to your main dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedRole === "educator" ? (
                  <button 
                    type="button"
                    onClick={() => handleNavigate("Classroom")}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-violet-500/50 hover:bg-slate-900/80 text-left transition-all group flex flex-col justify-between h-32"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-slate-200 group-hover:text-violet-300 transition-colors flex items-center gap-1">
                        <span>Classroom Setup</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Manage student groups, assignments, and class materials.</p>
                    </div>
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => handleNavigate("Scan")}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-violet-500/50 hover:bg-slate-900/80 text-left transition-all group flex flex-col justify-between h-32"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-slate-200 group-hover:text-rose-300 transition-colors flex items-center gap-1">
                        <span>Scan Notes</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Convert documents or raw text into structured study decks.</p>
                    </div>
                  </button>
                )}

                <button 
                  type="button"
                  onClick={() => handleNavigate("Chat")}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-violet-500/50 hover:bg-slate-900/80 text-left transition-all group flex flex-col justify-between h-32"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-200 group-hover:text-blue-300 transition-colors flex items-center gap-1">
                      <span>Study Assistant</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Ask questions, generate practice quizzes, or summarize topics.</p>
                  </div>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Go to Dashboard</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center border-t border-slate-900 pt-4 shrink-0">
            <p className="text-[10px] text-slate-500 font-medium">
              Cognita • Yohan Chang • Marina High School • 2026
            </p>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
