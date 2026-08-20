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

const HUMOROUS_MESSAGES = [
  "Creating study splines and caffeinating AI models... lol",
  "Negotiating with your upcoming midterms... gl",
  "Formatting rich-text equations. Please don't divide by zero...",
  "Bribing the servers with digital index cards...",
  "Uploading database information to save your data and your grades...",
  "Compressing 80+ academic subjects into clean UI pixels...",
  "Making sure our automated tutors have read their textbooks..."
];

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
  const [jokeIndex, setJokeIndex] = useState(0);
  const [minTimerDone, setMinTimerDone] = useState(false);

  useEffect(() => {
    if (step !== 1) return;
    const interval = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % HUMOROUS_MESSAGES.length);
    }, 2200);
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
      const timer = setTimeout(() => {
        setMinTimerDone(true);
      }, 5000);
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
        className="fixed inset-0 z-[99999] flex items-center justify-center font-sans antialiased select-none overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-[140px] pointer-events-none" />

        <div className="w-full max-w-lg bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col justify-between min-h-[460px]">
          
          {step === 1 && (
            <motion.div 
              className="flex flex-col items-center justify-center text-center my-auto py-8 space-y-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative">
                <img 
                  src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                  alt="Cognita Logo" 
                  className="w-16 h-16 rounded-2xl border border-slate-800 shadow-xl relative z-10 p-2 bg-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                  Welcome to Cognita
                </h1>
                <p className="text-xs font-semibold text-violet-400">
                  Setting up your workspace
                </p>
              </div>

              <div className="h-10 px-4 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={jokeIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-slate-400 italic max-w-xs leading-relaxed"
                  >
                    "{HUMOROUS_MESSAGES[jokeIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-950/60 text-slate-300">
                <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                <span className="text-[11px] font-medium tracking-wide">Loading platform resources...</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              className="flex flex-col justify-between flex-1 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">Step 1 of 2</span>
                <h2 className="text-2xl font-bold tracking-tight text-white">How will you use Cognita?</h2>
                <p className="text-xs text-slate-400">Select your role so we can configure your initial dashboard layout.</p>
              </div>

              <div className="space-y-2.5">
                {ROLES.map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected 
                          ? "bg-violet-950/30 border-violet-500/80 shadow-md" 
                          : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected ? "bg-violet-500/20 border-violet-400/50 text-violet-300" : "bg-slate-800/60 border-slate-700/50 text-slate-400"
                        }`}>
                          <RoleIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-slate-200">{role.title}</p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{role.desc}</p>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-all ${
                        isSelected ? "bg-violet-600 border-violet-400 text-white" : "border-slate-700 bg-slate-900"
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  disabled={!selectedRole}
                  onClick={savePreferencesAndContinue}
                  className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/15"
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setStep(2)} 
                    className="p-1 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">Step 2 of 2</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Choose your starting point</h2>
                <p className="text-xs text-slate-400">Launch directly into a feature or proceed to your overview dashboard.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedRole === "educator" ? (
                  <div 
                    onClick={() => handleTourAction("Classroom")}
                    className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 hover:border-violet-500/50 cursor-pointer transition-all group flex flex-col justify-between h-28"
                  >
                    <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-200 group-hover:text-violet-300 transition-colors flex items-center gap-1">
                        <span>Setup Classroom</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Create classes and manage rosters.</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => handleTourAction("Scan")}
                    className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 hover:border-violet-500/50 cursor-pointer transition-all group flex flex-col justify-between h-28"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-200 group-hover:text-rose-300 transition-colors flex items-center gap-1">
                        <span>Import Notes</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Convert images or text to flashcards.</p>
                    </div>
                  </div>
                )}

                <div 
                  onClick={() => handleTourAction("Chat")}
                  className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 hover:border-violet-500/50 cursor-pointer transition-all group flex flex-col justify-between h-28"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-200 group-hover:text-blue-300 transition-colors flex items-center gap-1">
                      <span>AI Assistant</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Ask questions or generate study summaries.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={completeOnboarding}
                  className="w-full h-11 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>Go to Main Dashboard</span>
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500">
              Cognita Platform • Yohan Chang • Marina High School
            </p>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
