import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, ChevronRight, BookmarkCheck, Highlighter, MoreHorizontal } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

const STORAGE_KEY = "cognita_ap_showcase_seen_v2";

// Mini mockup of the AP exam interface
function APExamMockup() {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 text-left select-none scale-95" style={{ fontFamily: "Georgia, serif", background: "#ffffff", color: "#1a1a2e" }}>
      {/* Header */}
      <div className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-200 gap-3" style={{ fontFamily: "system-ui" }}>
        <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 px-2 py-1 rounded hover:bg-gray-200">
          Directions <span className="ml-0.5">▾</span>
        </button>
        <span className="text-xs text-gray-500 flex-1">Section I, Part A — AP Human Geography</span>
        <span className="text-base font-black tabular-nums text-gray-800">24:37</span>
        <button className="text-xs text-blue-600 border border-blue-400 px-2 py-0.5 rounded-full font-semibold">Hide</button>
        <button className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
          <Highlighter className="w-3 h-3" /> Highlights
        </button>
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </div>

      {/* Two pane */}
      <div className="flex" style={{ minHeight: 180 }}>
        {/* Left: stimulus */}
        <div className="w-1/2 p-4 border-r border-gray-200 text-xs leading-relaxed" style={{ fontFamily: "Georgia, serif", color: "#1a1a2e" }}>
          <p className="font-bold text-xs mb-2" style={{ fontFamily: "system-ui" }}>Questions 1–3 refer to the following data.</p>
          <div className="rounded overflow-hidden border border-gray-300 text-xs mb-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-2 py-1 text-left font-semibold border border-gray-300">Country</th>
                  <th className="px-2 py-1 text-left font-semibold border border-gray-300">TFR</th>
                  <th className="px-2 py-1 text-left font-semibold border border-gray-300">CDR</th>
                  <th className="px-2 py-1 text-left font-semibold border border-gray-300">% Urban</th>
                </tr>
              </thead>
              <tbody>
                {[["Niger","6.9","9","17%"],["India","2.1","7","35%"],["Brazil","1.7","6","87%"],["Japan","1.2","11","92%"]].map(([c,t,d,u],i)=>(
                  <tr key={c} className={i%2===0?"bg-white":"bg-gray-50"}>
                    <td className="px-2 py-1 border border-gray-300">{c}</td>
                    <td className="px-2 py-1 border border-gray-300">{t}</td>
                    <td className="px-2 py-1 border border-gray-300">{d}</td>
                    <td className="px-2 py-1 border border-gray-300">{u}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-right text-[9px]">— UN World Population Prospects, 2023</p>
        </div>

        {/* Right: question */}
        <div className="w-1/2 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between" style={{ fontFamily: "system-ui" }}>
            <button className="flex items-center gap-1.5 px-3 py-1 rounded border-2 border-dashed border-amber-400 bg-amber-50 text-amber-600 text-xs font-semibold">
              <BookmarkCheck className="w-3 h-3" /> Mark for Review
            </button>
            <span className="px-2 py-0.5 rounded text-[10px] font-black text-white bg-blue-700">AP©</span>
          </div>
          <p className="text-xs leading-relaxed">According to the table, which country's data BEST supports the conclusion that it has completed the epidemiological transition and entered Stage 5 of the DTM?</p>
          <div className="space-y-1.5">
           {["Niger, because its high TFR drives rapid natural increase", "India, because its TFR has fallen to replacement level", "Brazil, because high urbanization correlates with low fertility", "Japan, because its CDR exceeds its implied CBR, suggesting natural decrease"].map((opt, j) => (
             <div key={j} className={`flex items-start gap-2 px-2.5 py-1.5 rounded border text-xs ${j===3?"border-blue-500 bg-blue-50":"border-gray-200"}`} style={{ fontFamily: "system-ui" }}>
               <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 ${j===3?"border-blue-500 bg-blue-500 text-white":"border-gray-300 text-gray-500"}`}>
                 {["A","B","C","D"][j]}
               </span>
               <span style={{ color: j===3?"#1a56db":"#1a1a2e" }}>{opt}</span>
             </div>
           ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center px-4 py-2 bg-gray-100 border-t border-gray-200 gap-3" style={{ fontFamily: "system-ui" }}>
        <span className="flex-1 text-xs text-gray-500">Student Name</span>
        <button className="px-3 py-1.5 rounded border border-gray-300 text-xs font-semibold text-gray-700">Back</button>
        <button className="px-4 py-1.5 rounded text-xs font-bold bg-gray-200 text-gray-800 flex items-center gap-1">
          Question 1 of 10 <span>▲</span>
        </button>
        <button className="px-3 py-1.5 rounded text-xs font-bold text-white bg-blue-700">Next</button>
      </div>
    </div>
  );
}

export default function APShowcaseBanner() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // AP showcase banner permanently disabled
    setVisible(false);
  }, []);

  // Auto-dismiss when user navigates to APTesting
  useEffect(() => {
    if (location.pathname === "/APTesting" || location.pathname.startsWith("/APTesting")) {
      localStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    }
  }, [location.pathname]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const goToAP = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    navigate(createPageUrl("APTesting"));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full z-[80] flex items-center gap-2 px-3"
          style={{ background: "linear-gradient(90deg, #1e1b4b, #1e3a8a)", borderBottom: "1px solid rgba(99,102,241,0.4)", height: 40, minHeight: 40, maxHeight: 40, overflow: "hidden" }}
        >
          <GraduationCap className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
          <span className="text-xs font-black text-white shrink-0">AP Test Prep</span>
          <span className="text-xs text-white/40 truncate flex-1 hidden sm:block">· MCQ, FRQ &amp; full exam simulation</span>
          <div className="flex-1 sm:hidden" />
          <button
            onClick={goToAP}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
          >
            Try it <ChevronRight className="w-3 h-3" />
          </button>
          <button onClick={dismiss} className="shrink-0 p-1 rounded hover:bg-white/10 transition-all text-white/50 hover:text-white">
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}