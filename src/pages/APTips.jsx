import { db } from '@/lib/firebase';

import { useState } from "react";
import { callAI } from "@/lib/lynxApi"
import { Loader2, Search, BookOpen, Target, AlertTriangle, PenLine, Calendar, HelpCircle, Home, BarChart3, BookMarked, ClipboardList } from "lucide-react";
import { incrementAiUsage } from "../components/aiUsageLimit";

const ALL_TIPS = {
  "AP Biology": {
    exam_format: "Section I: 60 MCQ (90 min) + Section II: 6 FRQ (90 min). Total: 3 hours.",
    scoring: "MCQ = 50%, FRQ = 50%. Score of 3 typically accepted for credit at most colleges.",
    key_topics: ["Natural selection & evolution", "Cellular respiration & photosynthesis", "Gene expression & regulation", "Cell communication & signal transduction", "Meiosis & heredity", "Ecology & energy flow", "CRISPR & biotechnology", "Population genetics (Hardy-Weinberg)"],
    study_tips: ["Use the CED (Course & Exam Description) — every testable topic is listed", "Practice data-analysis questions — they appear every year", "Draw and label diagrams for every major process", "Connect evolution to every single unit", "Do official College Board FRQs from past exams", "Memorize the major molecules: ATP, NADH, NADPH", "Use flashcards for vocab — precise terminology is graded"],
    common_mistakes: ["Writing 'DNA to RNA to protein' instead of using 'transcription' and 'translation'", "Confusing mitosis and meiosis stages", "Not referencing provided graphs or data in FRQs", "Forgetting units on quantitative answers", "Mixing up substrate-level vs. oxidative phosphorylation"],
    frq_tips: ["Always define your terms before using them", "Reference specific data from any provided graphs", "Use directional language: 'increases', 'decreases', 'activates'", "Structure answers in labeled parts matching the question", "For 'describe' vs 'explain' — explain = include mechanism"],
    week_before: ["Review the CED big ideas and enduring understandings", "Redo 2 full past FRQ sets under timed conditions", "Memorize Hardy-Weinberg, chi-square, and water potential equations", "Get 8 hours of sleep the night before"],
  },
  "AP Chemistry": {
    exam_format: "Section I: 60 MCQ (90 min) + Section II: 7 FRQ (105 min). Total: 3 hrs 15 min.",
    scoring: "MCQ = 50%, FRQ = 50%. Score of 4–5 usually required for college credit.",
    key_topics: ["Atomic structure & electron configuration", "Intermolecular forces & states of matter", "Stoichiometry & limiting reagents", "Equilibrium & Le Châtelier's principle", "Acids, bases & buffer systems", "Thermodynamics (ΔH, ΔS, ΔG)", "Kinetics & reaction mechanisms", "Electrochemistry (galvanic/electrolytic cells)"],
    study_tips: ["Memorize polyatomic ions and their charges early", "Balance equations before starting any calculation", "Know how to use ICE tables for equilibrium problems", "Practice unit conversions with dimensional analysis", "Work through every reaction type: synthesis, decomposition, combustion, redox", "Know how to interpret phase diagrams", "Understand Hess's Law and Born-Haber cycles"],
    common_mistakes: ["Forgetting to convert to moles before calculating", "Mixing up Kc and Kp expressions", "Not writing net ionic equations when asked", "Calculating ΔG without proper sign conventions", "Ignoring significant figures on free response"],
    frq_tips: ["Show all work — partial credit is given for correct reasoning", "Label units on every numerical answer", "For 'justify' answers, include both a claim and reasoning", "Electrochemistry FRQs always include cell notation — practice it", "Draw Lewis structures neatly and include formal charges when asked"],
    week_before: ["Review the equation sheet — know what every equation means", "Practice 3–4 full FRQ sets from past exams", "Focus weak areas: whichever unit lost you the most points", "Sleep well — rested minds solve multi-step problems better"],
  },
  "AP Physics 1": {
    exam_format: "Section I: 50 MCQ (90 min) + Section II: 5 FRQ (90 min). Total: 3 hours.",
    scoring: "MCQ = 50%, FRQ = 50%. Score of 3 commonly accepted.",
    key_topics: ["Kinematics (1D and 2D motion)", "Newton's laws & free body diagrams", "Work, energy & power", "Momentum & impulse", "Rotational motion & torque", "Simple harmonic motion", "Waves & sound", "Electric charge, force & circuits"],
    study_tips: ["Draw free body diagrams for every force problem", "Practice kinematics until equations become instinctive", "Use energy conservation as your first approach to motion problems", "Understand rotational analogs: torque ↔ force, moment of inertia ↔ mass", "Study experimental design — it appears in FRQs every year"],
    common_mistakes: ["Forgetting to include all forces in free body diagrams", "Using energy methods when dynamics is needed", "Confusing period and frequency", "Not using vector components for angled forces", "Mixing up elastic and inelastic collision rules"],
    frq_tips: ["The experimental design FRQ always asks you to identify variables", "Justify claims with equations and reasoning", "Label all axes, units, and data points on any graph you draw", "For circuits, use Kirchhoff's laws systematically"],
    week_before: ["Do 2 full practice exams from the College Board", "Review all formula sheet items", "Focus heavily on FRQ practice, especially experimental design"],
  },
  "AP Calculus AB": {
    exam_format: "Section I: 45 MCQ (1h45m) + Section II: 6 FRQ (1h30m). Calculator allowed on part of each section.",
    scoring: "MCQ = 50%, FRQ = 50%. Score of 3 gets credit at many colleges.",
    key_topics: ["Limits & continuity", "Definition of the derivative", "Differentiation rules (chain, product, quotient)", "Implicit differentiation & related rates", "Mean Value Theorem & curve sketching", "Riemann sums & definite integrals", "Fundamental Theorem of Calculus (both parts)", "Differential equations & slope fields"],
    study_tips: ["Know the FTC cold — it appears in every FRQ set", "Memorize all standard derivatives and antiderivatives", "Practice related rates with diagrams", "Master u-substitution for integration", "Work through accumulation problems", "Show all steps — partial credit is generous"],
    common_mistakes: ["Forgetting the +C on indefinite integrals", "Using the wrong form of FTC", "Confusing where a function is increasing vs where its derivative is positive", "Losing points by not providing units in applied problems"],
    frq_tips: ["Write justifications using correct mathematical language", "For graph analysis FRQs, state the condition and conclusion separately", "Calculator FRQs: store exact values — don't round mid-problem", "Area/volume problems: set up the integral fully before evaluating"],
    week_before: ["Redo 2 complete released FRQ sets timed", "Review accumulation / table FRQ types", "Make sure you know your calculator's integral and derivative functions"],
  },
  "AP Calculus BC": {
    exam_format: "Section I: 45 MCQ (1h45m) + Section II: 6 FRQ (1h30m). Includes all AB content plus BC-only topics.",
    scoring: "MCQ = 50%, FRQ = 50%. BC also gives an AB subscore.",
    key_topics: ["All AP Calculus AB topics", "Integration by parts & partial fractions", "Improper integrals", "Series convergence tests (ratio, comparison, integral)", "Taylor & Maclaurin series", "Parametric equations & polar coordinates", "Logistic growth & Euler's method"],
    study_tips: ["Master all AB content first — it's 60%+ of the exam", "Know all series convergence tests and when each applies", "Taylor series: memorize sin, cos, e^x, and 1/(1-x)", "Practice Lagrange error bound — it appears almost every year", "Parametric derivatives: know dy/dx and d²y/dx²"],
    common_mistakes: ["Forgetting to check the endpoint for interval of convergence", "Using the wrong test for series convergence", "Not stating the center when writing a Taylor series", "Losing signs in integration by parts"],
    frq_tips: ["Series FRQs always appear — know how to show work for radius of convergence", "Taylor polynomial FRQs: write the polynomial explicitly", "For parametric motion, know speed = √((dx/dt)² + (dy/dt)²)"],
    week_before: ["Focus practice on series — most BC-specific points come from here", "Redo official BC FRQ sets from the last 5 years", "Make sure AB fundamentals are automatic"],
  },
  "AP Statistics": {
    exam_format: "Section I: 40 MCQ (90 min) + Section II: 6 FRQ including 1 investigative task (90 min). Total: 3 hours.",
    scoring: "MCQ = 50%, FRQ = 50%. Score of 3 accepted at many schools.",
    key_topics: ["Describing distributions (SOCS)", "Regression & correlation", "Sampling methods & experimental design", "Probability rules & conditional probability", "Binomial & geometric distributions", "Sampling distributions & CLT", "Confidence intervals", "Significance tests (z, t, chi-square)"],
    study_tips: ["Always describe distributions using SOCS (Shape, Outliers, Center, Spread)", "Learn to distinguish observational study from experiment", "Know when to use z vs t distributions", "Practice writing out all 4 steps of hypothesis tests every time", "Understand the logic of p-values"],
    common_mistakes: ["Saying correlation implies causation", "Forgetting to state H₀ and Hₐ in proper notation", "Not checking conditions for inference", "Interpreting confidence level incorrectly"],
    frq_tips: ["Always check conditions before inference", "Conclusions must be in context", "Write out all 4 steps for every test: conditions, hypotheses, test stat, conclusion", "For regression FRQs, interpret slope and intercept in context"],
    week_before: ["Practice writing complete inference procedures", "Review chi-square tests", "Re-read your conclusion sentences for proper statistical language"],
  },
  "AP US History": {
    exam_format: "Section I: 55 MCQ (55 min) + 3 SAQ (40 min) | Section II: 1 DBQ (60 min) + 1 LEQ (40 min). Total: ~3h15m.",
    scoring: "MCQ = 40%, SAQ = 20%, DBQ = 25%, LEQ = 15%. Score of 3 commonly accepted.",
    key_topics: ["Colonialism & the founding era (Periods 1–3)", "Expansion, sectionalism & Civil War (Periods 4–5)", "Industrialization & Progressivism (Period 6)", "World Wars & New Deal (Period 7)", "Cold War & civil rights (Period 8)", "Post-1980 America (Period 9)", "Historical causation & comparison", "Primary source analysis (HAPP)"],
    study_tips: ["Use HAPP for every document: Historical context, Audience, Purpose, Point of view", "Periods 3–8 are the most heavily tested", "Learn turning points, not just dates", "Practice writing thesis statements with complexity", "DBQ: use at least 6 of 7 documents AND add outside evidence"],
    common_mistakes: ["Describing instead of analyzing documents", "Missing the complexity requirement in the DBQ thesis", "Not situating documents in broader historical context", "Running out of time on the DBQ"],
    frq_tips: ["DBQ thesis must make a historically defensible claim with nuance", "Contextualization must be a full paragraph", "SAQ: answer in full sentences", "LEQ: topic sentences should directly answer the prompt"],
    week_before: ["Write 2 timed DBQs and get feedback", "Review the rubric for DBQ and LEQ", "Memorize at least one specific example per period"],
  },
  "AP World History": {
    exam_format: "Section I: 55 MCQ (55 min) + 3 SAQ (40 min) | Section II: 1 DBQ (60 min) + 1 LEQ (40 min). Total: ~3h15m.",
    scoring: "MCQ = 40%, SAQ = 20%, DBQ = 25%, LEQ = 15%. Score of 3 accepted at many colleges.",
    key_topics: ["Trade networks (Silk Roads, Indian Ocean)", "Land-based empires 1450–1750", "Columbian Exchange & Atlantic slave trade", "Enlightenment & revolutions", "Imperialism & industrialization", "World Wars & Cold War", "Decolonization & independence movements", "Globalization & 21st century"],
    study_tips: ["Focus on 1200–present — earlier periods not covered", "Know major trade routes and what moved along them", "Compare empires across regions", "HAPP for every document", "Practice writing thesis statements that make an argument"],
    common_mistakes: ["Focusing only on European history — it's a global exam", "Forgetting to address all parts of the prompt", "DBQ: not using outside evidence beyond the documents"],
    frq_tips: ["DBQ: cite the document by number AND use specific content from it", "Contextualization should connect to a broader pattern at least 200 years before the prompt", "SAQ answers must be specific — name people, events, and dates"],
    week_before: ["Write at least 1 timed DBQ", "Review turning points in each period", "Know the DBQ/LEQ rubric"],
  },
  "AP Psychology": {
    exam_format: "Section I: 100 MCQ (70 min) + Section II: 2 FRQ (50 min). Total: 2 hours.",
    scoring: "MCQ = 66.7%, FRQ = 33.3%. Score of 3 accepted at most colleges.",
    key_topics: ["Biological bases of behavior (neurons, brain)", "Sensation & perception", "States of consciousness & sleep", "Learning (classical & operant conditioning)", "Memory models & forgetting", "Cognition & language", "Developmental psychology", "Social psychology (conformity, obedience, attribution)"],
    study_tips: ["Know the famous studies: Milgram, Zimbardo, Pavlov, Bandura", "Use the biopsychosocial model to connect units", "Flashcards work especially well for psych vocabulary", "Know the difference between positive/negative reinforcement AND punishment", "Social psychology concepts appear heavily"],
    common_mistakes: ["Confusing negative reinforcement with punishment", "Mixing up classical and operant conditioning", "Not knowing the difference between correlation and causation"],
    frq_tips: ["FRQs always ask you to apply concepts to a scenario — define then apply", "Use the exact vocabulary from the course", "Concept application FRQ: define the term, then explain how it applies", "Don't skip parts — each sub-part is worth points"],
    week_before: ["Do at least 100 practice MCQ questions", "Review all major studies and what they demonstrated", "Memorize the neurotransmitters and their functions"],
  },
  "AP Macroeconomics": {
    exam_format: "Section I: 60 MCQ (70 min) + Section II: 3 FRQ (60 min). Total: 2h10m.",
    scoring: "MCQ = 66.7%, FRQ = 33.3%. Score of 3 commonly accepted.",
    key_topics: ["Supply & demand basics", "GDP, unemployment & CPI", "Aggregate supply & aggregate demand (AS-AD model)", "Fiscal policy (government spending & taxation)", "Money market & monetary policy", "Loanable funds market", "Balance of payments & exchange rates", "Economic growth & productivity"],
    study_tips: ["Master all major graphs: AS-AD, money market, loanable funds, foreign exchange", "Know the multiplier effects for fiscal and monetary policy", "Understand the short-run/long-run distinction in AS-AD shifts", "Practice drawing and shifting graphs for every policy scenario"],
    common_mistakes: ["Shifting the wrong curve", "Confusing fiscal and monetary policy tools", "Not labeling axes and points on drawn graphs"],
    frq_tips: ["Graph FRQs: always label axes, curves, original and new equilibrium", "State the direction of change explicitly", "Connect policy to real GDP, price level, and unemployment"],
    week_before: ["Practice drawing all major graphs from memory", "Review official released FRQs for the last 5 years", "Know every policy tool of the Fed cold"],
  },
  "AP Human Geography": {
    exam_format: "Section I: 60 MCQ (60 min) + Section II: 3 FRQ (75 min). Total: ~2h15m.",
    scoring: "MCQ = 50%, FRQ = 50%. Score of 3 accepted at some colleges.",
    key_topics: ["Geographic thinking (scale, maps, spatial analysis)", "Population distribution & demographic transition model", "Migration theories & patterns", "Cultural diffusion (relocation, expansion, contagious, hierarchical)", "Political geography (state, nation, boundaries, devolution)", "Agricultural types & origins (von Thünen model)", "Urban models (Burgess, Hoyt, multiple nuclei, Latin America)", "Development indicators (HDI, GII, GNI)"],
    study_tips: ["Know ALL major models and theories by name, diagram, and critique", "Geography is very vocabulary-heavy — make flashcards for every key term", "Practice applying models to real-world examples", "Know the demographic transition model stages 1–5 and what drives each", "Learn map types: choropleth, dot distribution, proportional symbol, isoline"],
    common_mistakes: ["Confusing the DTM stages", "Not giving enough specificity in FRQ answers", "Mixing up contagious vs hierarchical vs relocation diffusion", "Describing a map instead of analyzing the spatial pattern"],
    frq_tips: ["Each FRQ part is typically 2–4 points — be concise and specific", "Define geographic terms before applying them", "Use real-world examples: name specific countries, cities, or regions", "For 'explain' prompts, give cause-and-effect, not just description"],
    week_before: ["Review all models: DTM, epidemiologic transition, Burgess, Hoyt, Weber, von Thünen", "Practice writing FRQs using real examples", "Review maps of world regions"],
  },
  "AP Environmental Science": {
    exam_format: "Section I: 80 MCQ (90 min) + Section II: 3 FRQ (70 min). Total: ~2h40m.",
    scoring: "MCQ = 60%, FRQ = 40%. Score of 3 accepted at some colleges.",
    key_topics: ["Earth systems & resources", "The living world (ecosystems, biodiversity)", "Population ecology & human impacts", "Land & water use", "Energy resources & consumption", "Atmospheric pollution & climate change", "Aquatic & terrestrial pollution", "Global change & sustainability policy"],
    study_tips: ["Know the nitrogen, carbon, phosphorus, and water cycles in detail", "Learn major environmental laws: Clean Air Act, Clean Water Act, ESA, CERCLA", "Practice math problems: population growth, energy calculations", "Understand energy tiers: primary productivity, trophic efficiency (10% rule)"],
    common_mistakes: ["Confusing eutrophication mechanism", "Not knowing specific environmental legislation", "Mixing up El Niño and La Niña effects", "Forgetting units in math FRQs"],
    frq_tips: ["Calculate questions: show all work and include units", "Identify the source, impact, and solution structure", "Policy FRQs: name specific laws or international agreements"],
    week_before: ["Review all major environmental legislation", "Practice 2–3 math FRQs from past exams", "Know the greenhouse effect and feedback loops cold"],
  },
  "AP Computer Science A": {
    exam_format: "Section I: 40 MCQ (90 min) + Section II: 4 FRQ (90 min). Total: 3 hours. Language: Java.",
    scoring: "MCQ = 50%, FRQ = 50%. Score of 3–4 accepted at many schools.",
    key_topics: ["Primitive types, operators & expressions", "Boolean logic & control flow", "Writing classes (constructors, instance variables, methods)", "Inheritance & polymorphism", "Arrays and ArrayLists", "2D arrays", "Recursion", "Searching & sorting algorithms"],
    study_tips: ["Practice Java by hand — the exam requires tracing code without running it", "Know every ArrayList method: add, remove, get, set, size", "Understand == vs .equals() for Strings", "Trace recursive methods step by step"],
    common_mistakes: ["Using == instead of .equals() to compare Strings", "Off-by-one errors in array traversals", "Confusing static and instance methods"],
    frq_tips: ["FRQ 1: Methods and Control Structures", "FRQ 2: Classes — write a complete class", "FRQ 3: Array/ArrayList — practice traversal patterns", "FRQ 4: 2D array — double for-loops"],
    week_before: ["Trace at least 10 past FRQs by hand", "Practice writing a complete class from scratch in under 20 minutes"],
  },
  "AP English Language": {
    exam_format: "Section I: 45 MCQ (60 min) + Section II: 3 FRQ — Synthesis, Rhetorical Analysis, Argument (2h15m). Total: 3h15m.",
    scoring: "MCQ = 45%, FRQ = 55%. Score of 3 accepted at many colleges.",
    key_topics: ["Rhetorical situation (SOAPS)", "Rhetorical appeals: ethos, pathos, logos", "Rhetorical devices & style analysis", "Evidence-based argumentation", "Synthesis essay (source integration)", "Rhetorical analysis essay", "Argument essay (no sources needed)"],
    study_tips: ["Read nonfiction essays, op-eds, and speeches weekly", "Practice identifying rhetorical devices quickly", "Synthesis: use sources to support your own argument", "Rhetorical analysis: focus on choices the author makes AND the effect"],
    common_mistakes: ["Just listing rhetorical devices without explaining their effect", "Synthesis essay: only summarizing sources", "Weak thesis statements that merely restate the topic"],
    frq_tips: ["Thesis must make a specific, arguable claim", "Rhetorical analysis: discuss how the device contributes to the author's purpose", "Synthesis: cite sources by source letter: '(Source C)'"],
    week_before: ["Write one timed practice of each essay type", "Review the scoring rubric", "Read one op-ed per day for rhetorical analysis practice"],
  },
  "AP English Literature": {
    exam_format: "Section I: 55 MCQ (60 min) + Section II: 3 FRQ — Poetry Analysis, Prose Analysis, Literary Argument (2h). Total: 3 hours.",
    scoring: "MCQ = 45%, FRQ = 55%. Score of 3–4 typically accepted.",
    key_topics: ["Close reading of poetry (imagery, structure, tone, diction)", "Prose fiction analysis", "Theme identification & development", "Figurative language (metaphor, symbol, irony)", "Narrator & point of view", "Literary argument", "Complexity & ambiguity in literature"],
    study_tips: ["Practice reading unfamiliar poetry quickly", "Build a list of 5–6 well-read novels for the open-question FRQ", "Annotate while reading: circle diction choices, mark shifts in tone", "The open essay (Q3): choose the work that best fits the prompt"],
    common_mistakes: ["Summarizing the plot instead of analyzing literary choices", "Choosing an overly simple work for Q3", "Vague thesis statements"],
    frq_tips: ["Poetry FRQ: address at least 3 literary elements and connect each to meaning", "Q3 thesis should name the work, author, and a specific literary claim"],
    week_before: ["Read one poem and write a 10-minute analysis daily", "Practice 2 full timed FRQ responses", "Finalize your Q3 book list"],
  },
};

const PREMADE_SUBJECTS = new Set(Object.keys(ALL_TIPS));

const AP_SUBJECTS = [
  "AP Biology", "AP Chemistry", "AP Physics 1", "AP Physics 2",
  "AP Environmental Science", "AP Calculus AB", "AP Calculus BC",
  "AP Statistics", "AP Computer Science A", "AP Computer Science Principles",
  "AP US History", "AP World History", "AP European History", "AP US Government",
  "AP Comparative Government", "AP Human Geography", "AP Psychology", "AP Macroeconomics",
  "AP Microeconomics", "AP English Language", "AP English Literature", "AP Spanish Language",
  "AP French Language", "AP Japanese Language", "AP Art History",
];

const SECTION_CONFIG = [
  { key: "key_topics", label: "Key Topics", Icon: Target, color: "#1a56db", bg: "#eff6ff" },
  { key: "study_tips", label: "Study Strategies", Icon: BookOpen, color: "#7c3aed", bg: "#f5f3ff" },
  { key: "common_mistakes", label: "Common Mistakes", Icon: AlertTriangle, color: "#d97706", bg: "#fffbeb" },
  { key: "frq_tips", label: "FRQ Tips", Icon: PenLine, color: "#059669", bg: "#f0fdf4" },
  { key: "week_before", label: "Final Week Checklist", Icon: Calendar, color: "#dc2626", bg: "#fef2f2" },
];

// AP Classroom-style sidebar nav item
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex flex-col items-center gap-1 py-3 px-2 transition-all hover:bg-blue-50"
      style={{ color: active ? "#1a56db" : "#6b7280", borderRight: active ? "3px solid #1a56db" : "3px solid transparent" }}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-semibold leading-tight text-center">{label}</span>
    </button>
  );
}

// Circular progress ring
function ProgressRing({ value, max, color, label, size = 100 }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const pct = max > 0 ? value / max : 0;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${circumference * pct} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black" style={{ color: "#1a1a2e" }}>{value}/{max}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
        <span className="text-xs text-gray-600 font-medium">{label}</span>
      </div>
    </div>
  );
}

export default function APTips() {
  const [selectedSubject, setSelectedSubject] = useState("AP Human Geography");
  const [searchQ, setSearchQ] = useState("");
  const [tips, setTips] = useState(ALL_TIPS["AP Human Geography"] || null);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [customQ, setCustomQ] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [customLoading, setCustomLoading] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  const selectSubject = async (subject) => {
    setSelectedSubject(subject);
    setExpandedSection(null);
    setCustomQ("");
    setCustomAnswer("");

    if (ALL_TIPS[subject]) {
      setTips(ALL_TIPS[subject]);
      return;
    }

    setLoading(true);
    setTips(null);
    try {
      const user = await db.auth.me();
      incrementAiUsage(user?.email, false, 1);
      
      // Fixed: Updated to use standard callAI layout
      const resp = await callAI({
        feature: "ap_tips_generation",
        prompt: `You are an expert AP exam tutor. Provide comprehensive exam tips for ${subject}. Return JSON with: exam_format, key_topics (array), study_tips (array), common_mistakes (array), frq_tips (array), week_before (array), scoring (string).`,
        response_json_schema: {
          type: "object",
          properties: {
            exam_format: { type: "string" },
            key_topics: { type: "array", items: { type: "string" } },
            study_tips: { type: "array", items: { type: "string" } },
            common_mistakes: { type: "array", items: { type: "string" } },
            frq_tips: { type: "array", items: { type: "string" } },
            week_before: { type: "array", items: { type: "string" } },
            scoring: { type: "string" },
          }
        }
      });
      setTips(resp);
    } catch (err) { 
      console.error(err);
      setTips(null); 
    }
    setLoading(false);
  };

  const askCustom = async () => {
    if (!customQ.trim() || !selectedSubject) return;
    setCustomLoading(true);
    setCustomAnswer("");
    try {
      const user = await db.auth.me();
      incrementAiUsage(user?.email, false, 0.5);
      
      // Fixed: Updated to use standard callAI layout
      const resp = await callAI({
        feature: "ap_tips_custom_ask",
        prompt: `You are an AP exam expert for ${selectedSubject}. Answer this student question concisely: "${customQ.trim()}". Keep to 3-5 sentences focused on exam success.`,
      });
      
      setCustomAnswer(typeof resp === "string" ? resp : resp?.text || JSON.stringify(resp));
    } catch (err) {
      console.error(err);
      setCustomAnswer("Failed to generate an answer. Please check your connection and try again.");
    }
    setCustomLoading(false);
  };

  const filtered = AP_SUBJECTS.filter(s => s.toLowerCase().includes(searchQ.toLowerCase()));

  // Mock stats for the dashboard view
  const topicCount = tips?.key_topics?.length || 0;
  const tipCount = tips?.study_tips?.length || 0;
  const mistakeCount = tips?.common_mistakes?.length || 0;
  const frqCount = tips?.frq_tips?.length || 0;

  return (
    <div className="min-h-screen flex" style={{ background: "#ffffff", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1a1a2e" }}>
      {/* ── Left sidebar — AP Classroom style ── */}
      <div className="flex flex-col shrink-0" style={{ width: 64, background: "#1a56db", paddingTop: 12 }}>
        {/* Logo */}
        <div className="flex flex-col items-center pb-4 mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-white text-sm" style={{ background: "rgba(255,255,255,0.2)" }}>AP</div>
        </div>
        {/* Nav items */}
        {[
          { id: "dashboard", icon: Home, label: "Dashboard" },
          { id: "assignments", icon: ClipboardList, label: "Tips" },
          { id: "guide", icon: BookMarked, label: "Guide" },
          { id: "reports", icon: BarChart3, label: "Reports" },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className="flex flex-col items-center gap-1 py-3 px-1 transition-all"
            style={{ color: activeNav === item.id ? "white" : "rgba(255,255,255,0.55)", background: activeNav === item.id ? "rgba(255,255,255,0.15)" : "transparent" }}
          >
            <item.icon className="w-5 h-5" />
            <span style={{ fontSize: "9px", fontWeight: 600 }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ── Secondary sidebar — subject list ── */}
      <div className="flex flex-col shrink-0" style={{ width: 200, borderRight: "1px solid #e5e7eb", background: "#f9fafb" }}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <p className="font-black text-xs uppercase tracking-wider text-gray-500 mb-3">AP Exam Tips</p>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search subject..."
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none border border-gray-200 bg-white"
            />
          </div>
        </div>
        {/* Subject list */}
        <div className="flex-1 overflow-y-auto py-2">
          {filtered.map(subj => (
            <button
              key={subj}
              onClick={() => selectSubject(subj)}
              className="w-full text-left px-4 py-2.5 text-xs font-medium transition-all hover:bg-blue-50"
              style={{
                color: selectedSubject === subj ? "#1a56db" : "#374151",
                background: selectedSubject === subj ? "#eff6ff" : "transparent",
                borderLeft: selectedSubject === subj ? "3px solid #1a56db" : "3px solid transparent",
              }}
            >
              {subj}
              {PREMADE_SUBJECTS.has(subj) && <span className="ml-1 text-[9px] text-green-500 font-bold">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200" style={{ background: "white" }}>
          <h1 className="font-black text-lg">{selectedSubject || "AP Exam Tips"}</h1>
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-xs font-bold hover:bg-gray-50">?</button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "#f59e0b" }}>A</div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-sm text-gray-500">Loading tips for {selectedSubject}...</p>
          </div>
        )}

        {tips && !loading && (
          <div className="px-8 py-6">
            {/* Exam info banner */}
            {(tips.exam_format || tips.scoring) && (
              <div className="rounded-xl p-4 mb-6 flex flex-wrap gap-6" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                {tips.exam_format && (
                  <div>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Exam Format</p>
                    <p className="text-sm text-blue-800">{tips.exam_format}</p>
                  </div>
                )}
                {tips.scoring && (
                  <div>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Scoring</p>
                    <p className="text-sm text-blue-800">{tips.scoring}</p>
                  </div>
                )}
              </div>
            )}

            {/* Progress rings row — like AP Classroom dashboard */}
            <div className="flex flex-wrap gap-8 mb-8 px-4 py-6 rounded-2xl" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
              <ProgressRing value={topicCount} max={8} color="#1a56db" label="Key Topics" />
              <ProgressRing value={tipCount} max={8} color="#f59e0b" label="Study Tips" />
              <ProgressRing value={mistakeCount} max={6} color="#7c3aed" label="Watch Outs" />
              <ProgressRing value={frqCount} max={5} color="#059669" label="FRQ Tips" />
            </div>

            {/* My To-Do List style tip sections */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-sm text-gray-500 uppercase tracking-wider">Study Checklist</h2>
              </div>

              {/* Section header row */}
              <div className="rounded-t-xl overflow-hidden border border-gray-200">
                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase" style={{ background: "#f3f4f6" }}>
                  No Due Date
                </div>
                {SECTION_CONFIG.map((sec, idx) => {
                  const items = tips[sec.key];
                  if (!items?.length) return null;
                  const isLast = idx === SECTION_CONFIG.length - 1;
                  return (
                    <div key={sec.key} className={`border-t border-gray-200 ${isLast ? "rounded-b-xl overflow-hidden" : ""}`}>
                      <button
                        onClick={() => setExpandedSection(expandedSection === sec.key ? null : sec.key)}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-gray-50 text-left"
                      >
                        {/* Icon badge */}
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: sec.bg }}>
                          <sec.Icon className="w-4 h-4" style={{ color: sec.color }} />
                        </div>
                        <span className="flex-1 text-sm font-semibold text-gray-700">{sec.label}</span>
                        <span className="text-xs text-gray-400 mr-2">{items.length} items</span>
                        {/* Begin-style button */}
                        <span className="px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
                          style={{ borderColor: sec.color, color: sec.color }}>
                          {expandedSection === sec.key ? "Close" : "View"}
                        </span>
                        <span className="text-gray-300 ml-1">×</span>
                      </button>
                      {expandedSection === sec.key && (
                        <div className="px-4 pb-4 pt-1 space-y-2" style={{ background: "#f9fafb" }}>
                          {items.map((item, i) => (
                            <div key={i} className="flex gap-3 items-start">
                              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5" style={{ borderColor: sec.color }}>
                                <span className="text-[9px] font-black" style={{ color: sec.color }}>{i + 1}</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ask a question panel — "Review Recent Results" style */}
            <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200" style={{ background: "#f9fafb" }}>
                <span className="font-black text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5" /> Ask an Expert
                </span>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer">0.5 credits</span>
              </div>
              <div className="p-4">
                {!customAnswer ? (
                  <div className="flex gap-2">
                    <input
                      value={customQ}
                      onChange={e => setCustomQ(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && askCustom()}
                      placeholder={`Ask anything about ${selectedSubject}...`}
                      className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200"
                    />
                    <button
                      onClick={askCustom}
                      disabled={!customQ.trim() || customLoading}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all hover:opacity-90"
                      style={{ background: "#1a56db" }}
                    >
                      {customLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ask"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{customAnswer}</p>
                    <button onClick={() => { setCustomAnswer(""); setCustomQ(""); }} className="text-xs text-blue-600 font-semibold hover:underline">Ask another question</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!tips && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#eff6ff" }}>
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-bold text-gray-700 mb-1">Select a subject to view tips</p>
            <p className="text-sm text-gray-400">Choose an AP course from the left panel to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}