import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  X
} from "lucide-react";

export default function CustomSignIn() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("signin");
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoadingAuth]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) { 
      setError("Please enter your email and password."); 
      return; 
    }
    setLoading(true); 
    setError("");
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
    if (!email || !password) { 
      setError("Please fill in all fields."); 
      return; 
    }
    if (password !== confirmPassword) { 
      setError("Passwords do not match."); 
      return; 
    }
    if (password.length < 6) { 
      setError("Password must be at least 6 characters."); 
      return; 
    }
    setLoading(true); 
    setError("");
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

  const toggleMode = (newMode) => {
    setMode(newMode);
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B0F17] text-slate-100 font-sans antialiased">
      <div className="hidden lg:flex lg:w-[50%] xl:w-[55%] h-screen sticky top-0 bg-[#070A0F] border-r border-slate-800/60 p-8 flex-col justify-center items-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center select-none p-4">
          <img 
            src="/signin.png" 
            alt="Cognita Preview" 
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative bg-[#0B0F17] min-h-screen">
        <div className="w-full max-w-[340px] space-y-8">
          
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-2">
              <img 
                src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                alt="Cognita" 
                className="w-8 h-8 object-contain rounded bg-slate-900 border border-slate-800 p-0.5" 
              />
              <span className="font-semibold text-lg tracking-tight text-white font-sans">Cognita Study</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-white font-sans">
                {mode === "signup" ? "Create an account" : "Sign in to your account"}
              </h1>
              <p className="text-xs text-slate-400 font-sans">
                Built by students, for students.
              </p>
            </div>
          </div>

          <div className="space-y-5 font-sans">
            <button 
              onClick={() => handleProvider("google")} 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 h-10 rounded-md font-medium text-xs text-slate-200 bg-[#141A25] hover:bg-[#1C2433] border border-slate-800 transition-colors disabled:opacity-50"
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

            <div className="relative flex items-center py-1">
              <div className="flex-1 border-t border-slate-800/80" />
              <span className="px-3 text-[10px] font-medium tracking-wider text-slate-500 uppercase">Or continue with</span>
              <div className="flex-1 border-t border-slate-800/80" />
            </div>

            <form onSubmit={mode === "signup" ? handleEmailSignUp : handleEmailSignIn} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="you@example.com" 
                    autoComplete="email" 
                    required
                    className="w-full pl-9 pr-3 h-10 rounded-md text-xs border border-slate-800 bg-[#121721] text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors" 
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
                    placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"} 
                    autoComplete={mode === "signup" ? "new-password" : "current-password"} 
                    required
                    className="w-full pl-9 pr-9 h-10 rounded-md text-xs border border-slate-800 bg-[#121721] text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors" 
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      placeholder="Re-enter password" 
                      autoComplete="new-password" 
                      required
                      className="w-full pl-9 pr-3 h-10 rounded-md text-xs border border-slate-800 bg-[#121721] text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors" 
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-10 rounded-md font-medium text-xs bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-colors pt-0.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{loading ? (mode === "signup" ? "Creating account..." : "Signing in...") : (mode === "signup" ? "Create Account" : "Sign In")}</span>
              </button>
            </form>

            <div className="text-center pt-2">
              {mode === "signin" ? (
                <p className="text-xs text-slate-400">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => toggleMode("signup")} className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-2">
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Already have an account?{" "}
                  <button type="button" onClick={() => toggleMode("signin")} className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-2">
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 text-center text-xs text-slate-500 pt-4 border-t border-slate-800/60 font-sans">
            <div>Made by Yohan Chang • Marina High School • 2026</div>
            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
              <button 
                onClick={() => setActiveModal("privacy")} 
                className="hover:text-slate-200 transition-colors underline underline-offset-2"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveModal("terms")} 
                className="hover:text-slate-200 transition-colors underline underline-offset-2"
              >
                Terms & Conditions
              </button>
              <span>•</span>
              <a 
                href="mailto:yohanychang@gmail.com" 
                className="hover:text-slate-200 transition-colors underline underline-offset-2"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm font-sans">
          <div className="bg-[#121721] border border-slate-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4 text-xs text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {activeModal === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeModal === "privacy" && (
              <div className="space-y-3 leading-relaxed">
                <p><strong>Effective Date:</strong> August 20, 2026</p>
                <p>
                  Cognita Study ("we", "our", or "us") respects your privacy. This Privacy Policy details our data collection and processing practices strictly limited to core service functionality.
                </p>
                <p><strong>1. Data Collection & Usage Purpose</strong><br />
                  We only collect essential user authentication information (email addresses, credential tokens) and user-generated study content (flashcards, notes, study progress). This data is processed strictly for core user functionality, account identification, and service delivery.
                </p>
                <p><strong>2. Third-Party Sharing & Commercial Use</strong><br />
                  We do not sell, rent, monetize, or trade your personal information or user data with third-party advertisers, data brokers, or marketing entities. Data is only transferred to secure authentication and cloud providers (e.g., Firebase) to facilitate platform access.
                </p>
                <p><strong>3. Data Security & Retention</strong><br />
                  We utilize standard, secure web encryption techniques to safeguard your content. Your stored information is retained solely while your account remains active or as needed to maintain application services.
                </p>
              </div>
            )}

            {activeModal === "terms" && (
              <div className="space-y-3 leading-relaxed">
                <p><strong>Effective Date:</strong> August 20, 2026</p>
                <p>
                  By logging into or accessing Cognita Study, you agree to comply with these terms.
                </p>
                <p><strong>1. Service Overview & Usage</strong><br />
                  Cognita Study provides free web-based study tools. Users agree to utilize the application solely for educational and non-commercial purposes.
                </p>
                <p><strong>2. User Accounts & Data Ownership</strong><br />
                  You retain ownership of study material you create. You are responsible for protecting your account credentials. We reserve the right to suspend or remove accounts violating security standards or creating unauthorized platform load.
                </p>
                <p><strong>3. Limitation of Liability</strong><br />
                  The service is provided "as is" without warranty. We hold no liability for service interruptions, data loss, or reliance on study materials generated within the app.
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-md font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
