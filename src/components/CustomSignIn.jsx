import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  GraduationCap,
  Scan,
  Volume2,
  Flame,
  Gamepad2,
  School,
  FileSpreadsheet,
  Users,
  CheckCircle2
} from "lucide-react";

const AD_FEATURES = [
  { icon: Sparkles, title: "AI Flashcards", desc: "Generate full decks from any text, link, or picture in seconds." },
  { icon: GraduationCap, title: "80+ AI Tutors", desc: "Get targeted help across high school, AP, and college courses." },
  { icon: Scan, title: "Scan & Learn", desc: "Capture notes or textbook pages to create study decks instantly." },
  { icon: Volume2, title: "Audio & Video Lessons", desc: "Convert your flashcard decks into narrated audio and video." },
  { icon: Flame, title: "Streaks & Badges", desc: "Build consistent habits with daily streaks, rewards, and rankings." },
  { icon: Gamepad2, title: "Interactive Games", desc: "Study with Term Invaders, Block Blasters, Jeopardy, and Matching." },
  { icon: School, title: "Classroom Mode", desc: "Set up classes, assign decks, and organize live study sessions." },
  { icon: FileSpreadsheet, title: "AP Exam Practice", desc: "Practice with realistic multiple-choice and free-response questions." },
  { icon: Users, title: "Study Groups", desc: "Share decks, chat, and review study materials with classmates." },
  { icon: CheckCircle2, title: "100% Free", desc: "Every feature is completely free forever. Created by a student." },
];

function FeatureCarousel() {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  const start = () => {
    timer.current = setInterval(() => setIdx(i => (i + 1) % AD_FEATURES.length), 4000);
  };
  useEffect(() => { start(); return () => clearInterval(timer.current); }, []);

  const go = (dir) => {
    clearInterval(timer.current);
    setIdx(i => (i + dir + AD_FEATURES.length) % AD_FEATURES.length);
    start();
  };

  const f = AD_FEATURES[idx];
  const IconComponent = f.icon;

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 relative overflow-hidden min-h-[130px] flex flex-col justify-between shadow-md">
      <div className="flex items-start gap-3.5 pr-12">
        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0 select-none">
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-sm text-slate-100">{f.title}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          {AD_FEATURES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => { clearInterval(timer.current); setIdx(i); start(); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-5 bg-violet-500" : "w-1.5 bg-slate-700 hover:bg-slate-600"}`} 
            />
          ))}
        </div>
        
        <div className="flex gap-1">
          <button onClick={() => go(-1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/50">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => go(1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/50">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomSignIn() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("social");

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoadingAuth]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    try {
      await db.auth.signInWithEmail(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await db.auth.signUpWithEmail(email, password);
      localStorage.setItem("cognita_new_user", "1");
      db.integrations.Core.SendEmail({
        to: email,
        from_name: "Cognita",
        subject: "Welcome to Cognita!",
        body: `Hi there!\n\nYou've successfully created your Cognita account.\n\n— The Cognita Team`,
      }).catch(() => {});
      window.location.href = "/";
    } catch (err) {
      setError(err?.message || "Could not create account. The email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const handleProvider = async (provider) => {
    if (provider === "google") {
      setLoading(true);
      setError("");
      try {
        await db.auth.signInWithGoogle();
        window.location.href = "/";
      } catch (err) {
        console.error("Google Sign-In error:", err);
        if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized domain')) {
          setError("Domain not authorized in Firebase settings.");
        } else if (err?.code === 'auth/popup-closed-by-user') {
          setError("Sign-in popup was closed before completing.");
        } else if (err?.code === 'auth/popup-blocked') {
          setError("Pop-up blocked by browser. Please allow popups for this site.");
        } else {
          setError(err?.message || "Google Sign-In failed.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError(`${provider} login is not configured.`);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans antialiased selection:bg-violet-500/30">
      
      {/* LEFT PANEL: Clean Showcase Area (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[44%] bg-slate-900 border-r border-slate-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="z-10 w-full flex-1 flex flex-col justify-center items-center my-8 space-y-8 max-w-lg mx-auto">
          <div className="relative w-full flex items-center justify-center select-none max-h-[400px] xl:max-h-[460px]">
            <img 
              src="/signin.png" 
              alt="Cognita Preview" 
              className="w-full h-auto max-h-full object-contain drop-shadow-2xl rounded-lg"
            />
          </div>

          <div className="w-full">
            <FeatureCarousel />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Sign-in Workspace */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-8 relative bg-slate-950 min-h-screen">
        <div className="w-full max-w-[380px] space-y-6">
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                alt="Cognita" 
                className="w-9 h-9 object-contain rounded-lg border border-slate-800 p-1 bg-slate-900" 
              />
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">Cognita</span>
                <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded px-1.5 py-0.5 uppercase tracking-wider">Free</span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-white">
                {mode === "signup" ? "Create an account" : mode === "signin" ? "Welcome back" : "Sign in to Cognita"}
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your AI-powered study companion. Always free.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl">
            
            {/* SOCIAL MODE */}
            {mode === "social" && (
              <div className="space-y-4">
                <button 
                  onClick={() => handleProvider("google")} 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 h-11 rounded-lg font-medium text-xs text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span>{loading ? "Connecting..." : "Continue with Google"}</span>
                </button>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <div className="relative flex items-center py-1">
                  <div className="flex-1 border-t border-slate-800" />
                  <span className="px-3 text-[11px] font-medium text-slate-500">or</span>
                  <div className="flex-1 border-t border-slate-800" />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button 
                    onClick={() => { setMode("signin"); setError(""); }}
                    className="h-10 rounded-lg text-xs font-medium transition-all border border-slate-700/60 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => { setMode("signup"); setError(""); }}
                    className="h-10 rounded-lg text-xs font-medium transition-all bg-violet-600 hover:bg-violet-500 text-white"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {/* EMAIL SIGN IN */}
            {mode === "signin" && (
              <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="you@example.com" 
                      autoComplete="email" 
                      required
                      className="w-full pl-9 pr-3 h-10 rounded-lg text-xs border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="••••••••" 
                      autoComplete="current-password" 
                      required
                      className="w-full pl-9 pr-9 h-10 rounded-lg text-xs border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-all" 
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-10 rounded-lg font-medium text-xs bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-all mt-1"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? "Signing in..." : "Sign In"}</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => { setMode("social"); setError(""); }} className="text-slate-400 hover:text-slate-200">← Back</button>
                  <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="text-violet-400 hover:text-violet-300">Need an account?</button>
                </div>
              </form>
            )}

            {/* EMAIL SIGN UP */}
            {mode === "signup" && (
              <form onSubmit={handleEmailSignUp} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="you@example.com" 
                      autoComplete="email" 
                      required
                      className="w-full pl-9 pr-3 h-10 rounded-lg text-xs border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="At least 6 characters" 
                      autoComplete="new-password" 
                      required
                      className="w-full pl-9 pr-9 h-10 rounded-lg text-xs border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-all" 
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      placeholder="Re-enter password" 
                      autoComplete="new-password" 
                      required
                      className="w-full pl-9 pr-3 h-10 rounded-lg text-xs border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-all" 
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-10 rounded-lg font-medium text-xs bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-all mt-1"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? "Creating account..." : "Sign Up"}</span>
                </button>

                <div className="text-center pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => { setMode("social"); setError(""); }} className="text-xs text-slate-400 hover:text-slate-200">← Back to options</button>
                </div>
              </form>
            )}

          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-500">
            Made by Yohan Chang • Marina High School • 2026
          </div>

        </div>
      </div>

    </div>
  );
}
