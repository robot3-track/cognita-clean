import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Sparkles, GraduationCap, School, BookOpen, 
  ArrowRight, Check, Loader2, ArrowLeft, Play, Camera, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const SPLASH_KEY = "cognita_welcome_seen_v8";
const PREF_ROLE_KEY = "cognita_user_role";

const HUMOROUS_MESSAGES = [
  "Reticulating study splines and caffeinating AI models...",
  "Negotiating with your upcoming midterms...",
  "Formatting rich-text equations. Please don't divide by zero...",
  "Bribing the servers with digital index cards...",
  "Scanning the cosmic database for optimal test-prep vectors...",
  "Compressing 80+ academic subjects into clean UI pixels...",
  "Making sure our automated tutors have read their textbooks..."
];

export default function WelcomeSplash({ isBackendLoading }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  
  // Steps: 1: Heavy Signin-Style Loader, 2: Role Selection, 3: Dynamic Tour Entry
  const [step, setStep] = useState(1); 
  const [selectedRole, setSelectedRole] = useState("");
  const [jokeIndex, setJokeIndex] = useState(0);
  const [minTimerDone, setMinTimerDone] = useState(false);

  // Cycle funny messages to keep them entertained
  useEffect(() => {
    if (step !== 1) return;
    const interval = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % HUMOROUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    const alreadySeen = 
      localStorage.getItem(SPLASH_KEY) ||
      localStorage.getItem("cognita_welcome_seen_v7") ||
      localStorage.getItem("cognita_welcome_seen_v6") ||
      localStorage.getItem("cognita_new_user");

    if (!alreadySeen) {
      setVisible(true);
      // Enforce absolute minimum 5-second loading time to prevent downstream application lag
      const timer = setTimeout(() => {
        setMinTimerDone(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Check both real data status and our safety 5s stopwatch buffer
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
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center font-sans antialiased select-none overflow-hidden bg-slate-950 text-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Signin-style Vibrant Background Ambient Glow Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-xl px-6 py-8 flex flex-col h-full md:h-auto md:max-h-[85vh] justify-between relative z-10">
          
          {/* Step 1: Matching Signin Page Loader Layout */}
          {step === 1 && (
            <motion.div 
              className="flex flex-col items-center justify-center text-center flex-1 my-auto space-y-7"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl animate-pulse" />
                <img 
                  src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                  alt="Cognita Logo" 
                  className="w-16 h-16 rounded-2xl border border-slate-800/60 shadow-2xl relative z-10 p-1.5 bg-slate-900/50 backdrop-blur-md"
                />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Welcome to Cognita
                </h1>
                <p className="text-[11px] font-bold text-violet-400 uppercase tracking-widest">
                  Setting up your personalized space!
                </p>
              </div>

              {/* Subtitle Humorous Engine */}
              <div className="min-h-[40px] px-8 flex items-center justify-center">
                <p className="text-xs text-slate-400 italic font-medium transition-all duration-300 max-w-xs">
                  "{HUMOROUS_MESSAGES[jokeIndex]}"
                </p>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-sm">
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                <span className="text-[10px] font-bold tracking-wide text-slate-300 uppercase">Loading application...</span>
              </div>
            </motion.div>
          )}

          {/* Step 2: Role Preference Selection */}
          {step === 2 && (
            <motion.div 
              className="flex flex-col justify-center flex-1 space-y-8"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-bold tracking-widest text-violet-400 uppercase bg-violet-500/10 px-2.5 py-1 rounded-md">Step 1 of 2</span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">How will you use Cognita?</h2>
                <p className="text-xs sm:text-sm font-medium text-slate-400">We'll tailor your quick actions based on your selection.</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: "highschool", title: "High School Student", desc: "AP exam simulations, study group access & flashcards", icon: School },
                  { id: "college", title: "College / University Student", desc: "Complex concept breakdowns, reference matrices & sandboxes", icon: GraduationCap },
                  { id: "educator", title: "Educator / Teacher", desc: "Create classrooms, manage rosters, and distribute modules", icon: BookOpen },
                ].map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                        isSelected 
                          ? "bg-violet-600/10 border-violet-500 shadow-lg shadow-violet-500/5" 
                          : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected ? "bg-violet-500/20 border-violet-400 text-violet-400" : "bg-slate-800 border-slate-700 text-slate-400 group-hover:text-slate-200"
                        }`}>
                          <RoleIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-200">{role.title}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{role.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? "bg-violet-500 border-violet-400 text-white scale-110" : "border-slate-700 bg-slate-950"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  disabled={!selectedRole}
                  onClick={savePreferencesAndContinue}
                  className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/20 group active:scale-[0.99]"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Customized Action Cards */}
          {step === 3 && (
            <motion.div 
              className="flex flex-col justify-center flex-1 space-y-6"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <button 
                    onClick={() => setStep(2)} 
                    className="p-1 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold tracking-widest text-violet-400 uppercase bg-violet-500/10 px-2.5 py-1 rounded-md">Setup Ready</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-3">Explore Your Learning Grid</h2>
                <p className="text-xs sm:text-sm font-medium text-slate-400">Jump straight into your primary feature point or view your dashboard overview.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Dynamically Swap Left Panel if Role is Teacher / Educator */}
                {selectedRole === "educator" ? (
                  <div 
                    onClick={() => handleTourAction("Classroom")}
                    className="p-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/20 hover:border-violet-500/40 cursor-pointer transition-all duration-200 group flex flex-col justify-between h-32"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-200 group-hover:text-violet-400 transition-colors flex items-center gap-1">
                        <span>Setup Classroom</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Create classes, track shared work, and register new active user spots.</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => handleTourAction("Scan")}
                    className="p-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/20 hover:border-violet-500/40 cursor-pointer transition-all duration-200 group flex flex-col justify-between h-32"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-200 group-hover:text-rose-400 transition-colors flex items-center gap-1">
                        <span>Try AI Import</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Turn images or source text parameters into flashcards instantly.</p>
                    </div>
                  </div>
                )}

                <div 
                  onClick={() => handleTourAction("Chat")}
                  className="p-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/20 hover:border-violet-500/40 cursor-pointer transition-all duration-200 group flex flex-col justify-between h-32"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-1">
                      <span>Launch AI Chat</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Ask conversational units anything or generate simple summaries.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2.5">
                <button
                  onClick={completeOnboarding}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Go to My Dashboard</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Persistent Footer Text Signature */}
          <div className="mt-8 text-center border-t border-slate-900 pt-4 shrink-0">
            <p className="text-[10px] font-medium tracking-wide text-slate-500">
              Cognita Platform • Created by Yohan Chang • Marina High School • 2026
            </p>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}