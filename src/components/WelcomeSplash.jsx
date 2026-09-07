import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const SPLASH_KEY = "cognita_welcome_seen_v8";
const PREF_ROLE_KEY = "cognita_user_role";

const Icons = {
  School: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m4 6 8-4 8 4" />
      <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
      <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" />
      <path d="M18 5v17" />
      <path d="M6 5v17" />
      <circle cx="12" cy="9" r="2" />
    </svg>
  ),
  GraduationCap: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  BookOpen: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  ArrowRight: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  ArrowLeft: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  ),
  Check: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Camera: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  Users: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Sparkles: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
    </svg>
  )
};

const ROLES = [
  { 
    id: "highschool", 
    title: "High School Student", 
    desc: "AP exam simulations, study groups, and tailored flashcards", 
    icon: Icons.School 
  },
  { 
    id: "college", 
    title: "College / University", 
    desc: "In-depth concept breakdowns, research tools, and sandboxes", 
    icon: Icons.GraduationCap 
  },
  { 
    id: "educator", 
    title: "Educator / Instructor", 
    desc: "Classroom rosters, assignment distribution, and analytics", 
    icon: Icons.BookOpen 
  },
];

export default function WelcomeSplash({ isBackendLoading }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  
  const [step, setStep] = useState(1); 
  const [selectedRole, setSelectedRole] = useState("");
  const [minTimerDone, setMinTimerDone] = useState(false);

  useEffect(() => {
    const alreadySeen = 
      localStorage.getItem(SPLASH_KEY) ||
      localStorage.getItem("cognita_welcome_seen_v7") ||
      localStorage.getItem("cognita_welcome_seen_v6") ||
      localStorage.getItem("cognita_new_user");

    if (!alreadySeen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setMinTimerDone(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (visible && step === 1 && minTimerDone && !isBackendLoading) {
      setStep(2);
    }
  }, [isBackendLoading, minTimerDone, visible, step]);

  const savePreferencesAndContinue = () => {
    if (selectedRole) {
      localStorage.setItem(PREF_ROLE_KEY, selectedRole);
      window.dispatchEvent(new Event("cognita_role_changed"));
    }
    setStep(3);
  };

  const completeOnboarding = () => {
    localStorage.setItem(SPLASH_KEY, "1");
    setVisible(false);
  };

  const handleTourAction = (pageName) => {
    localStorage.setItem(SPLASH_KEY, "1");
    setVisible(false);
    navigate(createPageUrl(pageName));
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[99999] flex items-center justify-center font-sans antialiased select-none overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 text-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative z-10 flex flex-col justify-between min-h-[380px]">
          
          {step === 1 && (
            <motion.div 
              className="flex flex-col items-center justify-center text-center my-auto py-6 space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 p-2 flex items-center justify-center shadow-inner">
                <img 
                  src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                  alt="Cognita Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>

              <div className="space-y-1">
                <h1 className="text-base font-semibold tracking-tight text-slate-100">
                  Welcome to Cognita
                </h1>
                <p className="text-xs text-slate-400">
                  Initializing environment...
                </p>
              </div>

              {/* Minimalist pulse ring loader (replaced template neon progress bar) */}
              <div className="pt-2 flex justify-center items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              className="flex flex-col justify-between flex-1 space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">01 / Role</span>
                <h2 className="text-base font-semibold tracking-tight text-slate-100">How will you use Cognita?</h2>
                <p className="text-xs text-slate-400">Select your account setup to adapt tools.</p>
              </div>

              <div className="space-y-2">
                {ROLES.map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                        isSelected 
                          ? "bg-indigo-950/40 border-indigo-500/80 text-slate-100 shadow-sm" 
                          : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-300" : "bg-slate-800 border-slate-700/60 text-slate-400"
                        }`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-xs text-slate-200">{role.title}</p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{role.desc}</p>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                        isSelected ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-700 bg-slate-900/50"
                      }`}>
                        {isSelected && <Icons.Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  disabled={!selectedRole}
                  onClick={savePreferencesAndContinue}
                  className="w-full h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue</span>
                  <Icons.ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              className="flex flex-col justify-between flex-1 space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <button 
                    onClick={() => setStep(2)} 
                    className="p-1 rounded-md border border-slate-800 bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Icons.ArrowLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">02 / Action</span>
                </div>
                <h2 className="text-base font-semibold tracking-tight text-slate-100">Choose a starting point</h2>
                <p className="text-xs text-slate-400">Launch directly into a tool or enter your dashboard.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedRole === "educator" ? (
                  <div 
                    onClick={() => handleTourAction("Classroom")}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-800/30 hover:bg-slate-800/70 hover:border-indigo-500/40 cursor-pointer transition-all group flex flex-col justify-between h-24"
                  >
                    <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Icons.Users className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-xs text-slate-200 group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                        <span>Setup Classroom</span>
                        <Icons.ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Manage rosters and classes.</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => handleTourAction("Scan")}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-800/30 hover:bg-slate-800/70 hover:border-indigo-500/40 cursor-pointer transition-all group flex flex-col justify-between h-24"
                  >
                    <div className="w-6 h-6 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Icons.Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-xs text-slate-200 group-hover:text-rose-300 transition-colors flex items-center justify-between">
                        <span>Import Notes</span>
                        <Icons.ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Convert notes to flashcards.</p>
                    </div>
                  </div>
                )}

                <div 
                  onClick={() => handleTourAction("Chat")}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-800/30 hover:bg-slate-800/70 hover:border-indigo-500/40 cursor-pointer transition-all group flex flex-col justify-between h-24"
                >
                  <div className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Icons.Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs text-slate-200 group-hover:text-sky-300 transition-colors flex items-center justify-between">
                      <span>Study Assistant</span>
                      <Icons.ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ask questions and review.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={completeOnboarding}
                  className="w-full h-9 rounded-lg bg-slate-100 hover:bg-white text-slate-900 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>Open Dashboard</span>
                  <Icons.ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-5 pt-3 border-t border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-500 tracking-tight">
              Cognita Platform • Marina High School
            </p>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
