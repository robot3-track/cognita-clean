import { db } from '@/lib/firebase';

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCourse } from "@/lib/courseData";
import { callAI } from "@/lib/lynxApi";
import {
  CheckCircle, PlayCircle, ChevronLeft, Award, Loader2,
  Lock, Clock, AlertTriangle, CheckCircle2, XCircle, Menu, Home
} from "lucide-react";
import CourseCertificate from "@/components/CourseCertificate";

const PASS_SCORE = 80;
const RETAKE_COOLDOWN_MINUTES = 10;

// ── YouTube IFrame API video player with completion detection ─────────────────
let ytApiLoaded = false;
let ytApiCallbacks = [];

function loadYTApi(cb) {
  if (window.YT && window.YT.Player) { cb(); return; }
  ytApiCallbacks.push(cb);
  if (ytApiLoaded) return;
  ytApiLoaded = true;
  window.onYouTubeIframeAPIReady = () => {
    ytApiCallbacks.forEach(fn => fn());
    ytApiCallbacks = [];
  };
  const s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);
}

function YoutubePlayer({ videoId, onCompleted, alreadyCompleted }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [status, setStatus] = useState(alreadyCompleted ? "done" : "idle"); // idle | playing | done | error
  const timerRef = useRef(null);

  const destroyPlayer = useCallback(() => {
    clearInterval(timerRef.current);
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setStatus(alreadyCompleted ? "done" : "idle");
  }, [alreadyCompleted]);

  useEffect(() => {
    const containerId = `yt-player-${videoId}`;
    if (containerRef.current) containerRef.current.id = containerId;

    destroyPlayer();

    loadYTApi(() => {
      if (!containerRef.current) return;
      const containerId2 = containerRef.current.id;
      playerRef.current = new window.YT.Player(containerId2, {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: () => { setStatus(alreadyCompleted ? "done" : "idle"); },
          onError: (e) => {
            // Error codes: 2=invalid id, 5=html5 error, 100=not found, 101/150=embedding disabled
            console.warn("YouTube player error:", e.data);
            setStatus("error");
          },
          onStateChange: (e) => {
            const YT = window.YT;
            if (e.data === YT.PlayerState.PLAYING) {
              setStatus("playing");
              // Poll: check if near the end every 3s
              clearInterval(timerRef.current);
              timerRef.current = setInterval(() => {
                try {
                  const duration = playerRef.current.getDuration();
                  const current = playerRef.current.getCurrentTime();
                  // Mark complete if within last 10 seconds OR > 90% watched
                  if (duration > 0 && (duration - current < 10 || current / duration > 0.9)) {
                    clearInterval(timerRef.current);
                    setStatus("done");
                    onCompleted();
                  }
                } catch {}
              }, 3000);
            }
            if (e.data === YT.PlayerState.ENDED) {
              clearInterval(timerRef.current);
              setStatus("done");
              onCompleted();
            }
            if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.BUFFERING) {
              clearInterval(timerRef.current);
            }
          },
        },
      });
    });

    return () => { destroyPlayer(); };
  }, [videoId]);

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9", background: "#000" }}>
      <div ref={containerRef} className="w-full h-full" />
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 gap-3">
          <p className="text-red-400 font-bold text-sm">Video unavailable (embedding disabled by uploader)</p>
          <p className="text-xs opacity-50 text-center px-4">This video can't be embedded. Click below to watch on YouTube, then mark as watched manually.</p>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-all"
          >
            Watch on YouTube ↗
          </a>
        </div>
      )}
      {status === "done" && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <CheckCircle2 className="w-3.5 h-3.5" /> Watched
        </div>
      )}
    </div>
  );
}

// ── Quiz Question ─────────────────────────────────────────────────────────────
function QuizQuestion({ q, idx, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    onAnswer(i === q.correct);
  };
  return (
    <div className="rounded-2xl p-5 mb-3" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
      <p className="font-semibold text-sm mb-3" style={{ color: "var(--app-text)" }}>{idx + 1}. {q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => choose(i)}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all ${
              selected !== null
                ? i === q.correct ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                  : selected === i ? "border-red-500/50 bg-red-500/10 text-red-500 dark:text-red-300" : "opacity-30"
                : "cursor-pointer"
            }`}
            style={selected === null ? { borderColor: "var(--app-border)", color: "var(--app-text)" } : {}}>
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && q.explanation && (
        <p className="text-xs mt-3 italic" style={{ color: "var(--app-muted)" }}>{q.explanation}</p>
      )}
    </div>
  );
}

// ── Module Quiz Panel ─────────────────────────────────────────────────────────
function ModuleQuizPanel({ mod, courseColor, onQuizPassed, quizScores }) {
  const [state, setState] = useState("idle"); // idle | loading | active | submitted
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [retakeUnlockAt, setRetakeUnlockAt] = useState(null);
  const [tick, setTick] = useState(0);

  const retakeKey = `quiz_retake_${mod.id}`;
  const storedScore = quizScores?.[mod.id];
  const passed = storedScore >= PASS_SCORE;

  useEffect(() => {
    const stored = localStorage.getItem(retakeKey);
    if (stored) setRetakeUnlockAt(parseInt(stored));
    const iv = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(iv);
  }, [mod.id]);

  const now = Date.now();
  const canRetake = !retakeUnlockAt || now >= retakeUnlockAt;
  const retakeMins = retakeUnlockAt ? Math.ceil((retakeUnlockAt - now) / 60000) : 0;

  const startQuiz = async () => {
    setState("loading");
    setAnswers([]);
    setScore(null);
    const resp = await callAI({
      feature: "course_quiz",
      prompt: `Create 5 multiple-choice quiz questions for the lesson "${mod.title}" covering: "${mod.summary}". Test genuine understanding. Return JSON: {"questions":[{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}]}`,
      response_json_schema: {
        type: "object",
        properties: {
          questions: { type: "array", items: { type: "object", properties: { question: { type: "string" }, options: { type: "array", items: { type: "string" } }, correct: { type: "number" }, explanation: { type: "string" } } } }
        }
      }
    });
    setQuestions(resp.questions || []);
    setState("active");
  };

  const submitQuiz = () => {
    const correct = answers.filter(Boolean).length;
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setState("submitted");
    if (pct >= PASS_SCORE) {
      onQuizPassed(mod.id, pct);
      localStorage.removeItem(retakeKey);
    } else {
      const unlockAt = Date.now() + RETAKE_COOLDOWN_MINUTES * 60 * 1000;
      localStorage.setItem(retakeKey, String(unlockAt));
      setRetakeUnlockAt(unlockAt);
    }
  };

  if (passed) return (
    <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      <div><p className="text-sm font-bold text-emerald-500">Quiz Passed ✓</p><p className="text-xs" style={{ color: "var(--app-muted)" }}>Score: {storedScore}%</p></div>
    </div>
  );

  if (state === "idle") return (
    <div className="rounded-2xl p-5" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm" style={{ color: "var(--app-text)" }}>Quiz Required — {PASS_SCORE}% to pass</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--app-muted)" }}>Retakes allowed after a {RETAKE_COOLDOWN_MINUTES}-minute cooldown.</p>
        </div>
      </div>
      {storedScore !== undefined && storedScore < PASS_SCORE && (
        <div className="mb-3 p-3 rounded-xl text-xs" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
          Last attempt: {storedScore}%{!canRetake && ` — Retake in ${retakeMins}m`}
        </div>
      )}
      <button onClick={startQuiz} disabled={!canRetake}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-40"
        style={{ background: canRetake ? courseColor : "#4b5563" }}>
        {!canRetake ? <><Clock className="w-4 h-4" /> Retake in {retakeMins}m</> : <><PlayCircle className="w-4 h-4" /> {storedScore !== undefined ? "Retake Quiz" : "Take Quiz"}</>}
      </button>
    </div>
  );

  if (state === "loading") return (
    <div className="flex items-center gap-3 py-6 text-sm" style={{ color: "var(--app-muted)" }}>
      <Loader2 className="w-5 h-5 animate-spin" /> Generating quiz with AI...
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-base" style={{ color: "var(--app-text)" }}>Module Quiz</h3>
        <span className="text-xs" style={{ color: "var(--app-muted)" }}>{answers.length}/{questions.length} answered</span>
      </div>
      {questions.map((q, i) => (
        <QuizQuestion key={i} q={q} idx={i} onAnswer={(correct) => setAnswers(prev => [...prev, correct])} />
      ))}
      {state === "active" && answers.length === questions.length && (
        <button onClick={submitQuiz} className="w-full py-3 rounded-2xl font-bold text-sm text-white mt-2" style={{ background: courseColor }}>
          Submit Quiz
        </button>
      )}
      {state === "submitted" && score !== null && (
        <div className={`rounded-2xl p-5 text-center mt-2 ${score >= PASS_SCORE ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
          <div className={`text-4xl font-black mb-1 ${score >= PASS_SCORE ? "text-emerald-400" : "text-red-400"}`}>{score}%</div>
          {score >= PASS_SCORE
            ? <><CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" /><p className="text-sm font-bold text-emerald-400">Passed! Module complete.</p></>
            : <><XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" /><p className="text-sm font-bold text-red-400">Need {PASS_SCORE}% to pass — retake in {RETAKE_COOLDOWN_MINUTES}min</p></>
          }
        </div>
      )}
    </div>
  );
}

// ── Main CourseView (full-screen standalone) ──────────────────────────────────
export default function CourseView() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");
  const course = getCourse(courseId);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [showCert, setShowCert] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!course) return;
    db.auth.me().then(async me => {
      setUser(me);
      const records = await db.entities.CourseProgress.filter({ user_email: me.email, course_id: courseId });
      let rec;
      if (records.length > 0) { rec = records[0]; }
      else {
        rec = await db.entities.CourseProgress.create({
          user_email: me.email, course_id: courseId,
          completed_lessons: [], completed_quizzes: [], quiz_scores: {},
          completed: false, enrolled_at: new Date().toISOString(),
        });
      }
      setProgress(rec);
      setActiveModule(course.modules[0].id);
    }).catch(() => {});
  }, [courseId]);

  const markLessonWatched = useCallback(async (moduleId) => {
    if (!progress) return;
    const completed = progress.completed_lessons || [];
    if (completed.includes(moduleId)) return;
    setSaving(true);
    const updated = await db.entities.CourseProgress.update(progress.id, { completed_lessons: [...completed, moduleId] });
    setProgress(updated);
    setSaving(false);
  }, [progress]);

  const handleQuizPassed = useCallback(async (moduleId, score) => {
    if (!progress) return;
    const completedQuizzes = progress.completed_quizzes || [];
    const quizScores = { ...(progress.quiz_scores || {}), [moduleId]: score };
    const nextQuizzes = completedQuizzes.includes(moduleId) ? completedQuizzes : [...completedQuizzes, moduleId];
    setSaving(true);
    const updated = await db.entities.CourseProgress.update(progress.id, { completed_quizzes: nextQuizzes, quiz_scores: quizScores });
    setProgress(updated);
    setSaving(false);
    const allModIds = course.modules.map(m => m.id);
    const allWatched = allModIds.every(id => (updated.completed_lessons || []).includes(id));
    const allPassed = allModIds.every(id => (updated.completed_quizzes || []).includes(id));
    if (allWatched && allPassed && !updated.completed) {
      const final = await db.entities.CourseProgress.update(progress.id, {
        completed: true, certificate_issued: true, certificate_issued_at: new Date().toISOString(),
      });
      setProgress(final);
      setShowCert(true);
    }
  }, [progress, course]);

  if (!course) return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      <div className="text-center">
        <p className="font-bold mb-2">Course not found.</p>
        <Link to="/Courses" className="text-violet-500 text-sm">← Back to Courses</Link>
      </div>
    </div>
  );

  const completedLessons = progress?.completed_lessons || [];
  const completedQuizzes = progress?.completed_quizzes || [];
  const quizScores = progress?.quiz_scores || {};
  const totalModules = course.modules.length;
  const overallPct = totalModules > 0 ? Math.round((completedLessons.length / totalModules) * 100) : 0;
  const activeModuleData = course.modules.find(m => m.id === activeModule);
  const lessonWatched = activeModule && completedLessons.includes(activeModule);
  const quizPassed = activeModule && completedQuizzes.includes(activeModule);
  const isModuleLocked = (idx) => idx > 0 && !completedQuizzes.includes(course.modules[idx - 1].id);

  return (
    <div className="fixed inset-0 z-[9999] flex overflow-hidden" style={{ background: "var(--app-bg)", color: "var(--app-text)", fontFamily: "system-ui, sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-0 overflow-hidden"} shrink-0 flex flex-col transition-all duration-300 border-r overflow-y-auto`}
        style={{ borderColor: "var(--app-border)", background: "var(--app-nav-bg)" }}
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--app-border)" }}>
          <img src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" alt="Cognita" className="w-7 h-7 rounded-lg object-cover shrink-0" />
          <span className="font-black text-base tracking-tight" style={{ color: "var(--app-text)" }}>Cognita Learn</span>
        </div>

        <div className="flex flex-col gap-1 px-3 mt-3 shrink-0">
          <Link to="/Courses">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all opacity-60 hover:opacity-100" style={{ color: "var(--app-text)" }}>
              <ChevronLeft className="w-3.5 h-3.5" /> All Courses
            </button>
          </Link>
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all opacity-60 hover:opacity-100" style={{ color: "var(--app-text)" }}>
            <Home className="w-3.5 h-3.5" /> Back to App
          </button>
        </div>

        {/* Course header in sidebar */}
        <div className="px-4 mt-4 pb-3 border-b shrink-0" style={{ borderColor: "var(--app-border)" }}>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-2xl">{course.emoji}</span>
            <p className="text-sm font-black leading-tight" style={{ color: "var(--app-text)" }}>{course.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--app-border)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${overallPct}%`, background: course.color }} />
            </div>
            <span className="text-[10px] font-bold shrink-0" style={{ color: course.color }}>{overallPct}%</span>
          </div>
        </div>

        {/* Module list */}
        <div className="px-3 mt-3 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: "var(--app-muted)" }}>Modules</p>
          <div className="space-y-1">
            {course.modules.map((mod, i) => {
              const watched = completedLessons.includes(mod.id);
              const qPassed = completedQuizzes.includes(mod.id);
              const isActive = activeModule === mod.id;
              const locked = isModuleLocked(i);
              return (
                <button key={mod.id} onClick={() => !locked && setActiveModule(mod.id)} disabled={locked}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${locked ? "opacity-25 cursor-not-allowed" : ""}`}
                  style={{
                    background: isActive ? `${course.color}18` : "transparent",
                    outline: isActive ? `1px solid ${course.color}40` : "none",
                  }}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black ${qPassed ? "bg-emerald-500/20 text-emerald-500" : watched ? "bg-amber-500/15 text-amber-500" : ""}`}
                    style={!watched && !qPassed ? { background: "var(--app-surface)", color: "var(--app-muted)" } : {}}>
                    {locked ? <Lock className="w-3 h-3" /> : qPassed ? <CheckCircle className="w-3.5 h-3.5" /> : watched ? "▶" : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight truncate" style={{ color: "var(--app-text)" }}>{mod.title}</p>
                    {qPassed && <p className="text-[10px] text-emerald-500">✓ {quizScores[mod.id]}%</p>}
                    {watched && !qPassed && <p className="text-[10px] text-amber-500">Quiz required</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {progress?.completed && (
          <button onClick={() => setShowCert(s => !s)}
            className="mx-3 mb-4 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-500 transition-all hover:opacity-90 shrink-0"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)" }}>
            <Award className="w-3.5 h-3.5" /> View Certificate
          </button>
        )}
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b shrink-0" style={{ borderColor: "var(--app-border)", background: "var(--app-nav-bg)" }}>
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1.5 rounded-lg transition-all opacity-60 hover:opacity-100" style={{ color: "var(--app-text)" }}>
            <Menu className="w-4 h-4" />
          </button>
          {activeModuleData && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: "var(--app-text)" }}>{activeModuleData.title}</p>
              <p className="text-xs truncate" style={{ color: "var(--app-muted)" }}>{course.title}</p>
            </div>
          )}
          {saving && <Loader2 className="w-4 h-4 animate-spin shrink-0" style={{ color: "var(--app-muted)" }} />}
        </div>

        <div className="flex-1 overflow-y-auto">
          {showCert && progress?.completed && (
            <div className="p-6 border-b" style={{ borderColor: "var(--app-border)" }}>
              <CourseCertificate course={course} userName={user?.full_name || user?.email || "Student"} issuedAt={progress?.certificate_issued_at} />
            </div>
          )}

          {activeModuleData ? (
            <div className="flex flex-col">
              {/* Video player */}
              <YoutubePlayer
                key={activeModuleData.videoId}
                videoId={activeModuleData.videoId}
                alreadyCompleted={lessonWatched}
                onCompleted={() => markLessonWatched(activeModuleData.id)}
              />

              <div className="px-6 py-5">
                <h2 className="font-black text-lg mb-1" style={{ color: "var(--app-text)" }}>{activeModuleData.title}</h2>
                <p className="text-sm mb-4" style={{ color: "var(--app-muted)" }}>{activeModuleData.summary}</p>

                {!lessonWatched && (
                  <button onClick={() => markLessonWatched(activeModuleData.id)}
                    className="mb-5 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all opacity-70 hover:opacity-100"
                    style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Mark as Watched Manually
                  </button>
                )}

                {lessonWatched && !quizPassed && (
                  <div className="mb-4 flex items-center gap-2 text-xs text-amber-500 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Complete the quiz below to unlock the next module.
                  </div>
                )}

                {lessonWatched && (
                  <ModuleQuizPanel
                    mod={activeModuleData}
                    courseColor={course.color}
                    onQuizPassed={handleQuizPassed}
                    quizScores={quizScores}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full py-32" style={{ color: "var(--app-muted)" }}>
              <div className="text-center opacity-30">
                <PlayCircle className="w-12 h-12 mx-auto mb-3" />
                <p>Select a module to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}