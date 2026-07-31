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
  { icon: Sparkles, title: "AI-Powered Flashcards", desc: "Generate entire decks from any text, URL, or photo in seconds." },
  { icon: GraduationCap, title: "80+ AI Tutors", desc: "Personal tutors for every AP, high school, and college subject." },
  { icon: Scan, title: "Scan & Learn", desc: "Point your camera at notes or textbooks — cards are made instantly." },
  { icon: Volume2, title: "Audio & Video Lessons", desc: "Turn any deck into a full AI-narrated audio or video lesson." },
  { icon: Flame, title: "Daily Streaks & Badges", desc: "Stay motivated with streaks, achievements, and a leaderboard." },
  { icon: Gamepad2, title: "Study Games", desc: "Term Invaders, Block Blasters, Jeopardy, Matching — learn while playing." },
  { icon: School, title: "Classroom Mode", desc: "Teachers can create classes, assign decks, and run live quizzes." },
  { icon: FileSpreadsheet, title: "AP & Exam Prep", desc: "Realistic AP MCQ + FRQ simulation with auto-scoring." },
  { icon: Users, title: "Study Groups", desc: "Chat, share decks, and study together in real time." },
  { icon: CheckCircle2, title: "Totally Free", desc: "Every feature, forever free. No paywalls. Built by a student." },
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
    <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-6 relative overflow-hidden min-h-[140px] flex flex-col justify-between shadow-xl">
      <div className="flex items-start gap-4 pr-12">
        <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0 select-none">
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-sm text-slate-100 tracking-tight">{f.title}</p>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">{f.desc}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          {AD_FEATURES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => { clearInterval(timer.current); setIdx(i); start(); }}
              className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-violet-500" : "w-1.5 bg-slate-700 hover:bg-slate-600"}`} 
            />
          ))}
        </div>
        
        <div className="flex gap-1.5">
          <button onClick={() => go(-1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => go(1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/50">
            <ChevronRight className="w-4 h-4" />
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
      
      {/* Style Injection for custom breathing/pulse shadow glow on desktop mockup */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dynamicGlow {
          0%, 100% { filter: drop-shadow(0 25px 40px rgba(139, 92, 246, 0.45)) drop-shadow(0 4px 12px rgba(59, 130, 246, 0.2)); transform: scale(1); }
          50% { filter: drop-shadow(0 30px 60px rgba(139, 92, 246, 0.7)) drop-shadow(0 8px 24px rgba(59, 130, 246, 0.35)); transform: scale(1.012); }
        }
        .alive-glow {
          animation: dynamicGlow 6s ease-in-out infinite;
          transition: all 0.5s ease-out;
        }
      `}} />

      {/* LEFT PANEL: Clean Product Branding & Showcase Side Drawer (Hidden completely on mobile) */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[44%] bg-slate-900 border-r border-slate-850 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/40 pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Product Visual Mockups & Feature Presentation Stack */}
        <div className="z-10 w-full flex-1 flex flex-col justify-center items-center my-8 space-y-8 w-full max-w-lg mx-auto">
          <div className="relative w-full flex items-center justify-center select-none max-h-[400px] xl:max-h-[460px] overflow-visible">
            <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-violet-600/10 to-blue-500/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <img 
              src="/signin.png" 
              alt="Cognita Interfaces Mockup" 
              className="w-full h-auto max-h-full object-contain alive-glow"
            />
          </div>

          <div className="w-full">
            <FeatureCarousel />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Mobile & Desktop Credentials Workspace Envelope */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-8 relative bg-slate-950 min-h-screen">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-[390px] space-y-6">
          
          {/* Top Integrated Branding Block (Responsive layout: Left-aligned on Desktop, Centered on Mobile) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            
            {/* Native Application Identity Header Badge */}
            <div className="flex items-center gap-3">
              <img 
                src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                alt="Cognita" 
                className="w-10 h-10 object-contain rounded-xl border border-slate-800 p-1 bg-slate-900 shadow-md" 
              />
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white">Cognita</span>
                <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded px-1.5 py-0.5 uppercase tracking-wide">Free</span>
              </div>
            </div>

            {/* Core Display Typography */}
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black tracking-tight text-white">
                {mode === "signup" ? "Get started instantly" : mode === "signin" ? "Sign in with email" : "Welcome back"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-semibold tracking-wide leading-snug">
                Your powerful AI-Study Companion. For Free Forever. No Strings Attached.
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {mode === "signup" ? "Initialize a secure workspace account to log into study modules." : "Access saved datasets, interactive sessions, and specialized configurations."}
              </p>
            </div>
          </div>

          {/* Main Workspace Interactive Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
            
            {/* SOCIAL CAPABILITY OPTIONS */}
            {mode === "social" && (
              <div className="space-y-4">
                <button 
                  onClick={() => handleProvider("google")} 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 h-12 rounded-xl font-bold text-xs text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 transition-all active:scale-[0.99] shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span>{loading ? "Verifying Provider..." : "Continue with Google"}</span>
                </button>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-red-300 leading-relaxed font-medium">{error}</span>
                  </div>
                )}

                <div className="relative flex items-center py-2.5">
                  <div className="flex-1 border-t border-slate-850" />
                  <span className="px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">or custom credentials</span>
                  <div className="flex-1 border-t border-slate-850" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { setMode("signin"); setError(""); }}
                    className="h-11 rounded-xl text-xs font-bold transition-all border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-300"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => { setMode("signup"); setError(""); }}
                    className="h-11 rounded-xl text-xs font-bold transition-all bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/10"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {/* EMAIL SIGN IN ACCORDION */}
            {mode === "signin" && (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="name@domain.com" 
                      autoComplete="email" 
                      required
                      className="w-full pl-10 pr-4 h-11 rounded-xl text-xs outline-none border border-slate-800 bg-slate-950 text-slate-200 placeholder-slate-600 focus:border-violet-500 focus:bg-slate-900/40 transition-all font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="••••••••" 
                      autoComplete="current-password" 
                      required
                      className="w-full pl-10 pr-11 h-11 rounded-xl text-xs outline-none border border-slate-800 bg-slate-950 text-slate-200 placeholder-slate-600 focus:border-violet-500 focus:bg-slate-900/40 transition-all font-medium" 
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-red-300 leading-relaxed font-medium">{error}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-11 rounded-xl font-bold text-xs transition-all bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/10"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? "Authenticating..." : "Sign In"}</span>
                </button>

                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-850 font-semibold">
                  <button type="button" onClick={() => { setMode("social"); setError(""); }} className="text-slate-400 hover:text-white transition-colors">← Other Options</button>
                  <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="text-violet-400 hover:text-violet-300 transition-colors">Create account →</button>
                </div>
              </form>
            )}

            {/* EMAIL SIGN UP ACCORDION */}
            {mode === "signup" && (
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="name@domain.com" 
                      autoComplete="email" 
                      required
                      className="w-full pl-10 pr-4 h-11 rounded-xl text-xs outline-none border border-slate-800 bg-slate-950 text-slate-200 placeholder-slate-600 focus:border-violet-500 focus:bg-slate-900/40 transition-all font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="Minimum 6 characters" 
                      autoComplete="new-password" 
                      required
                      className="w-full pl-10 pr-11 h-11 rounded-xl text-xs outline-none border border-slate-800 bg-slate-950 text-slate-200 placeholder-slate-600 focus:border-violet-500 focus:bg-slate-900/40 transition-all font-medium" 
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      placeholder="Repeat chosen password" 
                      autoComplete="new-password" 
                      required
                      className="w-full pl-10 pr-4 h-11 rounded-xl text-xs outline-none border border-slate-800 bg-slate-950 text-slate-200 placeholder-slate-600 focus:border-violet-500 focus:bg-slate-900/40 transition-all font-medium" 
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-red-300 leading-relaxed font-medium">{error}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-11 rounded-xl font-bold text-xs transition-all bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/10"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? "Creating Account..." : "Register"}</span>
                </button>

                <div className="text-center pt-3 border-t border-slate-850">
                  <button type="button" onClick={() => { setMode("social"); setError(""); }} className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors">← Back to Login Options</button>
                </div>
              </form>
            )}

          </div>

          {/* Unified Footer Credit Element */}
          <div className="text-center text-[11px] text-slate-600 font-medium tracking-wide">
            Made by Yohan Chang • Marina High School • 2026
          </div>

        </div>
      </div>

    </div>
  );
}