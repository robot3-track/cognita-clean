import React, { useState, useEffect } from 'react';
import { getSatQuestions } from '@/lib/SatQuestionBank';
import SATScoreResult from '@/components/SATScoreResult';
import { callAI } from '@/lib/lynxApi';

// ─── SAT SUBJECT CONTEXT PROMPT GENERATOR ─────────────────────────────────────
function getSatSubjectContext(section) {
  if (section === "rw") {
    return `You are writing questions for the official Digital SAT Reading and Writing section.
CRITICAL REQUIREMENT FOR READING & WRITING: Every single question MUST include a "stimulus" field containing a realistic college-level reading passage, paragraph, or student note set (100–150 words) that the question refers to. Never leave "stimulus" empty or null for Reading & Writing questions.
- Information and Ideas: Central ideas, details, inferences, command of evidence (textual & quantitative).
- Craft and Structure: Words in context, text structure & purpose, cross-text connections.
- Expression of Ideas: Rhetorical synthesis and transitions.
- Standard English Conventions: Grammar, punctuation, structure.`;
  }
  return `You are writing questions for the official Digital SAT Math section. 
For math questions, "stimulus" can be null or contain an optional word problem scenario description if applicable.
- Algebra, Advanced Math, Problem-Solving and Data Analysis, Geometry and Trigonometry.`;
}

// ─── ROBUST JSON EXTRACTION HELPER ──────────────────────────────────────────
function extractJsonArray(rawResponse) {
  if (!rawResponse) {
    throw new Error("Received empty response from callAI.");
  }

  if (typeof rawResponse === 'object') {
    if (Array.isArray(rawResponse)) return rawResponse;
    const possibleArray = Object.values(rawResponse).find(val => Array.isArray(val));
    if (possibleArray && possibleArray.length > 0) return possibleArray;
    if (rawResponse.question && rawResponse.options) return [rawResponse];
  }

  if (typeof rawResponse === 'string') {
    const trimmed = rawResponse.trim();

    try {
      const directParsed = JSON.parse(trimmed);
      if (Array.isArray(directParsed)) return directParsed;
      if (typeof directParsed === 'object' && directParsed !== null) {
        const possibleArray = Object.values(directParsed).find(val => Array.isArray(val));
        if (possibleArray) return possibleArray;
        return [directParsed];
      }
    } catch (e) {}

    let cleaned = trimmed
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .trim();

    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      let arrayString = arrayMatch[0].replace(/,\s*([\]}])/g, '$1');
      try {
        const parsed = JSON.parse(arrayString);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (parseErr) {}
    }

    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        let objectString = objectMatch[0].replace(/,\s*([\]}])/g, '$1');
        const parsedObj = JSON.parse(objectString);
        if (Array.isArray(parsedObj.questions)) return parsedObj.questions;
        if (Array.isArray(parsedObj.data)) return parsedObj.data;
        return [parsedObj];
      } catch (e) {}
    }
  }

  throw new Error("Could not extract a valid JSON array from AI output.");
}

export default function SATExamInterface({
  questions: initialQuestions = [],
  section: initialSection = "rw",
  timeLimitMinutes: initialTimeLimit = 32,
  onSubmit,
  onBack
}) {
  // ─── TRANSITION / SETUP STATE ─────────────────────────────────────────────
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedSection, setSelectedSection] = useState(initialSection);
  const [questionCount, setQuestionCount] = useState(27);
  const [customTimeLimit, setCustomTimeLimit] = useState(initialTimeLimit);
  const [isUntimed, setIsUntimed] = useState(false);
  const [activeTab, setActiveTab] = useState('practice');
  
  // AI Generation & Source Controls
  const [questionSource, setQuestionSource] = useState("ai"); // "ai" | "premade"
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState(null);

  // ─── ACTIVE EXAM SESSION STATE ────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [eliminatedOptions, setEliminatedOptions] = useState({});
  const [crossOutActive, setCrossOutActive] = useState(false);

  // Mobile View Switcher State
  const [mobileActiveTab, setMobileActiveTab] = useState("stimulus");

  // Modals & Timers
  const [timeLeft, setTimeLeft] = useState(32 * 60);
  const [showTimer, setShowTimer] = useState(true);
  const [showGridModal, setShowGridModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [showRefModal, setShowRefModal] = useState(false);

  // ─── PERSISTENT SCORE HISTORY STATE ────────────────────────────────────────
  const [scoreHistory, setScoreHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("sat_exam_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sat_exam_history", JSON.stringify(scoreHistory));
    } catch (e) {}
  }, [scoreHistory]);

  const handleSectionSelect = (sec) => {
    setSelectedSection(sec);
    if (sec === "rw") {
      setQuestionCount(27);
      setCustomTimeLimit(32);
    } else {
      setQuestionCount(22);
      setCustomTimeLimit(35);
    }
  };

  // ─── LYNX API GENERATION ROUTINE ──────────────────────────────────────────
  const fetchAiQuestionsFromLynx = async (section, count) => {
    const isRw = section === "rw";
    const subjectContext = getSatSubjectContext(section);

    const prompt = `${subjectContext}

Generate exactly ${count} original multiple-choice questions for the Digital SAT ${isRw ? "Reading and Writing" : "Math"} section.

Return ONLY a valid JSON object matching the requested schema. No markdown formatting.

Requirements:
1. For Reading and Writing, the "stimulus" field MUST contain the reference reading passage or text snippet being analyzed.
2. "correct" MUST be an integer from 0 to 3 representing the 0-indexed position of the correct choice in "options".
3. "options" MUST contain exactly 4 text strings.`;

    const satSchema = {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              domain: { type: "string" },
              skill: { type: "string" },
              stimulus: { type: "string" },
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correct: { type: "number" }
            },
            required: ["domain", "skill", "stimulus", "question", "options", "correct"]
          }
        }
      },
      required: ["questions"]
    };

    const rawResult = await callAI({
      prompt: prompt,
      response_json_schema: satSchema,
      feature: "sat_practice_generation"
    });

    if (!rawResult) {
      throw new Error("Empty response received from callAI routine.");
    }

    const parsedQuestions = extractJsonArray(rawResult);

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error("Invalid response format: No questions extracted from AI output.");
    }

    return parsedQuestions;
  };

  // Safe Exam Initialization Routine
  const handleStartExam = async () => {
    setAiError(null);
    let fetchedQuestions = [];

    if (initialQuestions && initialQuestions.length > 0) {
      fetchedQuestions = initialQuestions.slice(0, questionCount);
    } else if (questionSource === "ai") {
      setIsLoadingAi(true);
      try {
        fetchedQuestions = await fetchAiQuestionsFromLynx(selectedSection, questionCount);
      } catch (err) {
        console.error("AI API generation failed. Falling back to offline question bank:", err);
        setAiError("AI generation failed or output invalid format. Loaded offline question bank instead.");
        fetchedQuestions = getSatQuestions(selectedSection, questionCount);
      } finally {
        setIsLoadingAi(false);
      }
    } else {
      fetchedQuestions = getSatQuestions(selectedSection, questionCount);
    }

    setQuestions(fetchedQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlagged({});
    setEliminatedOptions({});
    setCrossOutActive(false);
    setTimeLeft(customTimeLimit * 60);
    setShowTimer(true);
    setIsConfiguring(false);
    setIsFinished(false);
    setMobileActiveTab("stimulus");
  };

  const currentQ = questions[currentIndex] || {};
  const isMath = selectedSection === "math";

  useEffect(() => {
    if (currentQ.stimulus || currentQ.table_data) {
      setMobileActiveTab("stimulus");
    } else {
      setMobileActiveTab("question");
    }
  }, [currentIndex, currentQ]);

  useEffect(() => {
    if (isConfiguring || isUntimed || isFinished) return;

    if (timeLeft <= 300 && !showTimer) {
      setShowTimer(true);
    }

    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isConfiguring, isUntimed, showTimer, isFinished]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOptionSelect = (optionIdx) => {
    if (crossOutActive) {
      setEliminatedOptions(prev => {
        const qElim = prev[currentIndex] || [];
        const nextElim = qElim.includes(optionIdx)
          ? qElim.filter(i => i !== optionIdx)
          : [...qElim, optionIdx];
        return { ...prev, [currentIndex]: nextElim };
      });
    } else {
      setUserAnswers(prev => ({ ...prev, [currentIndex]: optionIdx }));
    }
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleFinalSubmit = () => {
    const timeSpentSeconds = isUntimed ? 0 : (customTimeLimit * 60) - timeLeft;
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const total = questions.length || 1;
    const percentage = Math.round((correctCount / total) * 100);
    const estimatedSatScore = Math.round(200 + (correctCount / total) * 600);

    const historyEntry = {
      id: Date.now(),
      date: new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      section: selectedSection === "rw" ? "Reading & Writing" : "Math",
      score: estimatedSatScore,
      correctCount,
      totalQuestions: total,
      percentage,
      timeSpentSeconds
    };

    setScoreHistory(prev => [historyEntry, ...prev]);

    const payload = {
      userAnswers,
      timeSpentSeconds,
      questions
    };

    if (onSubmit) {
      onSubmit(payload);
    }
    setIsFinished(true);
  };

  const clearHistory = () => {
    setScoreHistory([]);
    localStorage.removeItem("sat_exam_history");
  };

  const letters = ["A", "B", "C", "D"];

  if (isFinished) {
    return (
      <SATScoreResult
        testData={{
          userAnswers,
          timeSpentSeconds: isUntimed ? 0 : (customTimeLimit * 60) - timeLeft,
          questions
        }}
        onRetake={() => {
          setIsFinished(false);
          handleStartExam();
        }}
        onHome={() => {
          setIsFinished(false);
          setIsConfiguring(true);
          if (onBack) onBack();
        }}
      />
    );
  }

  if (isConfiguring) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans">
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#003366] text-white font-black text-xs px-2 py-1 rounded tracking-tight">
              SAT
            </div>
            <span className="font-bold text-sm text-slate-800 tracking-tight">Digital SAT Prep</span>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Exit Practice
            </button>
          )}
        </header>

        <div className="max-w-4xl w-full mx-auto px-4 py-8 flex-1 flex flex-col">
          <div className="flex justify-center border-b border-slate-200 mb-8">
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-6 py-2.5 text-sm font-semibold transition-all relative ${
                activeTab === 'practice'
                  ? "text-[#003366] border-b-2 border-[#003366]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => setActiveTab('scoreHistory')}
              className={`px-6 py-2.5 text-sm font-semibold transition-all relative ${
                activeTab === 'scoreHistory'
                  ? "text-[#003366] border-b-2 border-[#003366]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Score History
            </button>
          </div>

          {activeTab === 'scoreHistory' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-2xl mx-auto w-full">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-lg">Exam Score History</h2>
                {scoreHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {scoreHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm">No recent exam history available.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {scoreHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-slate-200 rounded-xl bg-slate-50/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">{item.score} <span className="text-xs font-normal text-slate-400">/ 800</span></span>
                          <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {item.section}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700 block">
                          {item.percentage}% Accuracy
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.correctCount} of {item.totalQuestions} Correct
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto w-full space-y-6">
              <div className="text-center space-y-1 mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Digital SAT Test Preparation
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  College Board–style practice with curated premade questions or AI-generated sets
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Configure Practice Session
                </h4>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Question Source</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setQuestionSource("premade")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        questionSource === "premade"
                          ? "border-[#003366] bg-blue-50/70 text-[#003366] ring-1 ring-[#003366]"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Offline Question Bank</span>
                        {questionSource === "premade" && <span className="text-xs font-bold">✓</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Curated SAT practice questions</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuestionSource("ai")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        questionSource === "ai"
                          ? "border-[#003366] bg-blue-50/70 text-[#003366] ring-1 ring-[#003366]"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">AI Generated Session</span>
                        {questionSource === "ai" && <span className="text-xs font-bold">✓</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Generated via callAI fallback chain</p>
                    </button>
                  </div>
                </div>

                {aiError && (
                  <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                    {aiError}
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Select Section</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSectionSelect("rw")}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedSection === "rw"
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Reading & Writing (27 Qs • 32m)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSectionSelect("math")}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedSection === "math"
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Math Section (22 Qs • 35m)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Module Length</span>
                  <div className="flex flex-wrap gap-2">
                    {[5, 10, 15, selectedSection === "rw" ? 27 : 22].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          questionCount === count
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {count} Questions
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">Timer Mode</span>
                    <button
                      type="button"
                      onClick={() => setIsUntimed(!isUntimed)}
                      className="text-xs font-semibold text-[#003366] hover:underline"
                    >
                      {isUntimed ? "Enable Timer" : "Switch to Untimed Mode"}
                    </button>
                  </div>

                  {!isUntimed ? (
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="1"
                        value={customTimeLimit}
                        onChange={(e) => setCustomTimeLimit(Number(e.target.value))}
                        className="w-full accent-[#003366] cursor-pointer"
                      />
                      <span className="font-mono text-xs font-bold min-w-[60px] text-right text-slate-800">
                        {customTimeLimit} mins
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 italic text-center">
                      Untimed Diagnostic Mode Enabled
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleStartExam}
                  disabled={isLoadingAi}
                  className="w-full py-3 rounded-xl bg-[#003366] hover:bg-blue-900 text-white font-bold text-xs transition-all shadow-sm mt-4 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoadingAi ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Generating via callAI Fallback Chain...</span>
                    </>
                  ) : (
                    <span>Start Practice Test →</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Ensure passage panel renders if AI references text or if stimulus is provided
  const stimulusText = currentQ.stimulus || (selectedSection === "rw" ? `[Reading Passage for Question ${currentIndex + 1}]\n\nRead the following text carefully to determine the correct response to the question on the right panel.` : null);
  const hasStimulus = Boolean(stimulusText || currentQ.table_data);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 select-none">
      <header className="bg-[#003366] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsConfiguring(true)}
            className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded text-slate-200 transition-colors"
          >
            ← Exit
          </button>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <h1 className="font-bold text-xs sm:text-sm tracking-wide hidden sm:block">
            {isMath ? "Section 2: Math" : "Section 1: Reading and Writing"}
          </h1>
        </div>

        {!isUntimed && (
          <div className="flex items-center gap-3">
            {showTimer && (
              <span className={`font-mono font-bold text-sm sm:text-base tracking-wider px-2.5 py-0.5 rounded border ${
                timeLeft <= 300
                  ? "bg-red-950 text-red-400 border-red-600 animate-pulse"
                  : "bg-black/30 border-white/10 text-white"
              }`}>
                {formatTime(timeLeft)}
              </span>
            )}
            {timeLeft > 300 && (
              <button
                onClick={() => setShowTimer(!showTimer)}
                className="text-[11px] uppercase font-semibold text-slate-300 hover:text-white underline decoration-dotted"
              >
                {showTimer ? "Hide" : "Show"}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {isMath && (
            <>
              <button
                onClick={() => setShowCalcModal(true)}
                className="text-xs font-bold bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded transition-all"
              >
                🧮 <span className="hidden sm:inline">Calculator</span>
              </button>
              <button
                onClick={() => setShowRefModal(true)}
                className="text-xs font-bold bg-slate-700 hover:bg-slate-600 px-2.5 py-1.5 rounded transition-all"
              >
                📐 <span className="hidden sm:inline">Reference</span>
              </button>
            </>
          )}

          <button
            onClick={() => setCrossOutActive(!crossOutActive)}
            className={`text-xs font-bold px-2.5 py-1.5 rounded border transition-all ${
              crossOutActive
                ? "bg-amber-500 border-amber-400 text-slate-950 font-black"
                : "bg-white/10 border-white/20 hover:bg-white/20 text-slate-200"
            }`}
          >
            Strikethrough <s>x</s>
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-3 font-semibold">
          <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded text-xs font-mono">
            {currentIndex + 1}
          </span>
          <span>of {questions.length} Questions</span>
        </div>

        {hasStimulus && (
          <div className="flex md:hidden bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
            <button
              onClick={() => setMobileActiveTab("stimulus")}
              className={`px-2.5 py-1 rounded-md transition-all ${mobileActiveTab === "stimulus" ? "bg-[#003366] text-white shadow-sm" : "text-slate-600"}`}
            >
              Passage
            </button>
            <button
              onClick={() => setMobileActiveTab("question")}
              className={`px-2.5 py-1 rounded-md transition-all ${mobileActiveTab === "question" ? "bg-[#003366] text-white shadow-sm" : "text-slate-600"}`}
            >
              Question
            </button>
          </div>
        )}

        <button
          onClick={toggleFlag}
          className={`flex items-center gap-1.5 font-bold px-2.5 py-1 rounded transition-colors ${
            flagged[currentIndex]
              ? "bg-red-100 text-red-700 border border-red-300"
              : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          <span>🚩</span>
          <span className="hidden sm:inline">{flagged[currentIndex] ? "Marked" : "Mark for Review"}</span>
        </button>
      </div>

      <main className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-3 sm:p-4 gap-4">
        <div className={`w-full md:w-1/2 bg-white border border-slate-200 rounded-xl p-5 overflow-y-auto shadow-sm ${
          hasStimulus ? (mobileActiveTab === "stimulus" ? "block" : "hidden md:block") : "hidden md:block"
        }`}>
          {stimulusText ? (
            <div className="text-xs sm:text-sm leading-relaxed text-slate-800 space-y-3 font-serif whitespace-pre-line">
              {stimulusText}
            </div>
          ) : currentQ.table_data ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100">
                    {currentQ.table_data.headers?.map((h, i) => (
                      <th key={i} className="border border-slate-200 p-2 text-left font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentQ.table_data.rows?.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="border border-slate-200 p-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
              No passage text provided for this item.
            </div>
          )}
        </div>

        <div className={`w-full ${hasStimulus ? "md:w-1/2" : "md:w-full"} bg-white border border-slate-200 rounded-xl p-5 overflow-y-auto shadow-sm flex flex-col justify-between ${
          !hasStimulus || mobileActiveTab === "question" ? "block" : "hidden md:flex"
        }`}>
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-[#003366] font-bold text-[10px] uppercase px-2.5 py-1 rounded border border-blue-200">
                {currentQ.domain || "SAT Domain"}
              </span>
              {currentQ.skill && <span className="text-slate-400 text-xs truncate">• {currentQ.skill}</span>}
            </div>

            <h2 className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h2>

            {currentQ.options && (
              <div className="space-y-2 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  const isEliminated = (eliminatedOptions[currentIndex] || []).includes(optIdx);

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 relative ${
                        isEliminated
                          ? "opacity-30 bg-slate-50 border-slate-200 line-through"
                          : isSelected
                          ? "border-[#003366] bg-blue-50/80 text-slate-900 ring-2 ring-[#003366]/20 font-medium"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border ${
                        isSelected
                          ? "bg-[#003366] border-[#003366] text-white"
                          : "border-slate-300 bg-slate-100 text-slate-600"
                      }`}>
                        {letters[optIdx]}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <button
          onClick={() => setShowGridModal(true)}
          className="text-xs font-bold text-[#003366] bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-2"
        >
          <span>Grid</span>
          <span className="bg-[#003366] text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-mono">
            {Object.keys(userAnswers).length}
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 sm:px-5 py-2 rounded-xl text-xs font-bold border border-slate-300 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-5 sm:px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#003366] hover:bg-[#002244] shadow-md transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="px-5 sm:px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all"
            >
              Submit Section
            </button>
          )}
        </div>
      </footer>

      {showGridModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Question Navigator</h3>
              <button onClick={() => setShowGridModal(false)} className="text-slate-400 text-lg">✕</button>
            </div>

            <div className="grid grid-cols-5 gap-2.5 max-h-80 overflow-y-auto p-1">
              {questions.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== "";
                const isCurrent = idx === currentIndex;
                const isFlagged = flagged[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowGridModal(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-bold relative flex items-center justify-center border transition-all ${
                      isCurrent
                        ? "border-[#003366] ring-2 ring-[#003366]/30 bg-blue-50 text-[#003366]"
                        : isAnswered
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute top-1 right-1 text-[9px]">🚩</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowGridModal(false)}
              className="w-full mt-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCalcModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Calculator</h3>
              <button onClick={() => setShowCalcModal(false)} className="text-slate-400 text-lg">✕</button>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Integrated scientific and graphing tools available for Math sections.
            </p>
            <button
              onClick={() => setShowCalcModal(false)}
              className="w-full py-2 bg-[#003366] text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showRefModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">SAT Reference Sheet</h3>
              <button onClick={() => setShowRefModal(false)} className="text-slate-400 text-lg">✕</button>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <p>• Area of Circle = $\pi r^2$</p>
              <p>• Circumference of Circle = $2\pi r$</p>
              <p>• Area of Rectangle = $lw$</p>
              <p>• Area of Triangle = $\frac{1}{2}bh$</p>
              <p>• Pythagorean Theorem: $a^2 + b^2 = c^2$</p>
            </div>
            <button
              onClick={() => setShowRefModal(false)}
              className="w-full mt-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
