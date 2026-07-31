import { db } from '@/lib/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, HelpCircle, ArrowLeft, Home, Compass, AlertCircle } from "lucide-react";

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.substring(1) || "unknown";

  const { data: authData, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        // Updated to reflect native firebase database integration configurations
        const user = await db.auth.me();
        return { user, isAuthenticated: true };
      } catch (error) {
        return { user: null, isAuthenticated: false };
      }
    }
  });

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Background Ambient Glow Effects matching Cognita style Matrix */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-8">
        
        {/* Academic Twist Graphic Display: Floating 404 Flashcard */}
        <div className="relative mx-auto w-48 h-32 bg-gradient-to-br from-violet-600/20 to-slate-900 border border-violet-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xl shadow-violet-950/40 transform -rotate-2 hover:rotate-0 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-widest text-violet-400 uppercase bg-violet-500/10 px-2 py-0.5 rounded-md">Flashcard #404</span>
            <HelpCircle className="w-4 h-4 text-violet-400 opacity-60 group-hover:animate-bounce" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">404</h1>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Term: Page Misplaced</p>
          </div>
        </div>

        {/* Main Content Card Layout */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl text-center">
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <Compass className="w-5 h-5 text-violet-400 animate-spin [animation-duration:8s]" />
              Page not found..
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              We tried hard finding what you needed, but <span className="font-mono text-violet-400 bg-violet-500/5 border border-violet-500/10 px-1.5 py-0.5 rounded text-[11px]">/{pageName}</span> does not exist or has graduated to another route.
            </p>
          </div>

          {/* Core Interactive Twist Section */}
          <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Study Break Strategy</span>
            <p className="text-[11px] text-slate-400 italic leading-relaxed">
              "Mistakes are proof that you are trying. Take a short breath, clear your cache, and let's get back to mastering those topics!"
            </p>
          </div>

          {/* Admin Context Banner */}
          {isFetched && authData?.isAuthenticated && authData?.user?.role === 'admin' && (
            <div className="p-4 bg-amber-500/[0.02] rounded-xl border border-amber-500/20 text-left flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-amber-500">Developer Diagnostic Notice</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  This route configuration isn't implemented in the project matrix routing tree yet. Ask the AI agent to plug it into <code className="text-amber-400/90 font-mono">App.jsx</code>.
                </p>
              </div>
            </div>
          )}

          {/* Action Navigation Matrix */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded-xl transition-all shadow-sm group active:scale-[0.98]"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Go Back</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all shadow-md shadow-violet-950/50 group active:scale-[0.98]"
            >
              <Home className="w-3.5 h-3.5 opacity-80" />
              <span>Return Home</span>
            </button>
          </div>

        </div>

        {/* Minimal Platform Signature Footer */}
        <div className="text-center text-[10px] text-slate-600 font-medium tracking-wide flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-violet-500 opacity-60" />
          <span>Cognita Study is built by Yohan Chang</span>
        </div>

      </div>
    </div>
  );
}