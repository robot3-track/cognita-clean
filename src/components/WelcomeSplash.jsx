import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, School, BookOpen, 
  ArrowRight, Check, ArrowLeft, Camera, Users, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const SPLASH_KEY = "cognita_welcome_seen_v8";
const PREF_ROLE_KEY = "cognita_user_role";

const ROLES = [
  { 
    id: "highschool", 
    title: "High School Student", 
    desc: "AP exam simulations, study groups, and tailored flashcard decks", 
    icon: School 
  },
  { 
    id: "college", 
    title: "College / University", 
    desc: "In-depth concept breakdowns, research tools, and sandboxes", 
    icon: GraduationCap 
  },
  { 
    id: "educator", 
    title: "Educator / Instructor", 
    desc: "Classroom rosters, assignment distribution, and analytics", 
    icon: BookOpen 
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
      }, 5500);
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
        className="fixed inset-0 z-[99999] flex items-center justify-center font-sans antialiased select-none overflow-y-auto bg-[#070A0F]/80 backdrop-blur-sm text-slate-100 p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-full max-w-sm bg-[#121721] border border-slate-800/80 rounded-lg p-6 shadow-2xl relative z-10 flex flex-col justify-between min-h-[400px]">
          
          {step === 1 && (
            <motion.div 
              className="flex flex-col items-center justify-center text-center my-auto py-8 space-y-6"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-12 h-12 rounded-md bg-[#18202E] border border-slate-800 p-2 flex items-center justify-center">
                <img 
                  src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                  alt="Cognita Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>

              <div className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight text-white font-sans">
                  Welcome to Cognita
                </h1>
                <p className="text-xs text-slate-400 font-sans">
                  Preparing your workspace...
                </p>
              </div>

              <div className="w-40 h-1 bg-[#1A2231] rounded-full overflow-hidden relative mt-2">
                <div 
                  className="absolute inset-y-0 bg-violet-500 rounded-full"
                  style={{
                    animation: "loading-bar 1.8s ease-in-out infinite"
                  }}
                />
                <style>{`
                  @keyframes loading-bar {
                    0% { left: -35%; width: 35%; }
                    50% { left: 35%; width: 45%; }
                    100% { left: 100%; width: 35%; }
                  }
                `}</style>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              className="flex flex-col justify-between flex-1 space-y-6"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">Step 1 of 2</span>
                <h2 className="text-lg font-semibold tracking-tight text-white">How will you use Cognita?</h2>
                <p className="text-xs text-slate-400 leading-relaxed">Select your primary role to customize your workspace.</p>
              </div>

              <div className="space-y-2">
                {ROLES.map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-3 rounded-md border transition-colors flex items-center justify-between ${
                        isSelected 
                          ? "bg-violet-950/30 border-violet-500/70 text-white" 
                          : "bg-[#18202E]/60 border-slate-800/80 hover:bg-[#18202E] hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${
                          isSelected ? "bg-violet-500/20 border-violet-400/40 text-violet-300" : "bg-slate-800/60 border-slate-700/50 text-slate-400"
                        }`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-xs">{role.title}</p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{role.desc}</p>
                        </div>
                      </div>

                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? "bg-violet-600 border-violet-500 text-white" : "border-slate-700 bg-slate-900"
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  disabled={!selectedRole}
                  onClick={savePreferencesAndContinue}
                  className="w-full h-9 rounded-md bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              className="flex flex-col justify-between flex-1 space-y-6"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <button 
                    onClick={() => setStep(2)} 
                    className="p-1 rounded border border-slate-800 bg-[#18202E] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">Step 2 of 2</span>
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-white">Choose a starting point</h2>
                <p className="text-xs text-slate-400 leading-relaxed">Jump directly into a core tool or open your dashboard.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedRole === "educator" ? (
                  <div 
                    onClick={() => handleTourAction("Classroom")}
                    className="p-3 rounded-md border border-slate-800 bg-[#18202E]/60 hover:bg-[#18202E] hover:border-violet-500/50 cursor-pointer transition-colors group flex flex-col justify-between h-24"
                  >
                    <div className="w-6 h-6 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-xs text-slate-200 group-hover:text-violet-300 transition-colors flex items-center justify-between">
                        <span>Setup Classroom</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Manage rosters and classes.</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => handleTourAction("Scan")}
                    className="p-3 rounded-md border border-slate-800 bg-[#18202E]/60 hover:bg-[#18202E] hover:border-violet-500/50 cursor-pointer transition-colors group flex flex-col justify-between h-24"
                  >
                    <div className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-xs text-slate-200 group-hover:text-rose-300 transition-colors flex items-center justify-between">
                        <span>Import Notes</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Convert notes to flashcards.</p>
                    </div>
                  </div>
                )}

                <div 
                  onClick={() => handleTourAction("Chat")}
                  className="p-3 rounded-md border border-slate-800 bg-[#18202E]/60 hover:bg-[#18202E] hover:border-violet-500/50 cursor-pointer transition-colors group flex flex-col justify-between h-24"
                >
                  <div className="w-6 h-6 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs text-slate-200 group-hover:text-blue-300 transition-colors flex items-center justify-between">
                      <span>Study Assistant</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ask questions and review.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={completeOnboarding}
                  className="w-full h-9 rounded-md bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-5 pt-3 border-t border-slate-800/60 text-center">
            <p className="text-[10px] text-slate-500 font-sans">
              Cognita Platform • Marina High School
            </p>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
