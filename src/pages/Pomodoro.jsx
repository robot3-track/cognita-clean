import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import { Timer, Play, Pause, RotateCcw, Coffee, Zap, Users } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const FOCUS_MIN = 25;
const BREAK_MIN = 5;
const DEEP_WORK_SESSIONS = 4; // 4 pomodoros = ~2 hours = bonus credits

export default function Pomodoro() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [mySession, setMySession] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [phase, setPhase] = useState("focus"); // focus | break
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [totalFocusMin, setTotalFocusMin] = useState(0);
  const [bonusEarned, setBonusEarned] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    db.auth.me().then(async (me) => {
      setUser(me);
      const existing = await db.entities.PomodoroSession.filter({ user_email: me.email });
      if (existing.length > 0) {
        setMySession(existing[0]);
        setSessionCount(existing[0].session_count || 0);
        setTotalFocusMin(existing[0].total_focus_minutes || 0);
      }
    });

    const unsub = db.entities.PomodoroSession.subscribe(() => {
      db.entities.PomodoroSession.filter({ status: "focusing" }).then(setActiveSessions);
    });
    db.entities.PomodoroSession.filter({ status: "focusing" }).then(setActiveSessions);
    return unsub;
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            handlePhaseEnd();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, phase]);

  const handlePhaseEnd = async () => {
    setRunning(false);
    if (phase === "focus") {
      const newCount = sessionCount + 1;
      const newTotal = totalFocusMin + FOCUS_MIN;
      setSessionCount(newCount);
      setTotalFocusMin(newTotal);
      await updateServerSession("break", newCount, newTotal);

      // Reward bonus credits after DEEP_WORK_SESSIONS pomodoros
      if (newCount % DEEP_WORK_SESSIONS === 0 && !bonusEarned) {
        setBonusEarned(true);
        const { addSurveyBonus } = await import("../components/aiUsageLimit");
        addSurveyBonus(user.email, 2, "Deep work bonus (2-hour focus block)");
      }

      setPhase("break");
      setSecondsLeft(BREAK_MIN * 60);
    } else {
      setPhase("focus");
      setSecondsLeft(FOCUS_MIN * 60);
      await updateServerSession("idle", sessionCount, totalFocusMin);
    }
  };

  const updateServerSession = async (status, count, totalMin) => {
    if (!user) return;
    const data = { user_email: user.email, user_name: user.full_name || user.email, status, session_count: count, total_focus_minutes: totalMin };
    if (mySession) {
      const updated = await db.entities.PomodoroSession.update(mySession.id, data);
      setMySession(updated);
    } else {
      const created = await db.entities.PomodoroSession.create(data);
      setMySession(created);
    }
  };

  const toggle = async () => {
    if (!running) {
      await updateServerSession("focusing", sessionCount, totalFocusMin);
    } else {
      await updateServerSession("idle", sessionCount, totalFocusMin);
    }
    setRunning(r => !r);
  };

  const reset = async () => {
    setRunning(false);
    setPhase("focus");
    setSecondsLeft(FOCUS_MIN * 60);
    await updateServerSession("idle", sessionCount, totalFocusMin);
  };

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");
  const totalSeconds = phase === "focus" ? FOCUS_MIN * 60 : BREAK_MIN * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const sessionsToBonus = DEEP_WORK_SESSIONS - (sessionCount % DEEP_WORK_SESSIONS);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/15 flex items-center justify-center">
            <Timer className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">{t('pomodoroTitle')}</h1>
            <p className="text-xs" style={mutedStyle}>{t('pomodoroStudyWith')}</p>
          </div>
        </div>

        {/* Timer */}
        <div className="rounded-3xl p-8 text-center mb-6" style={cardStyle}>
          <div className={`text-xs font-bold mb-4 px-3 py-1 rounded-full inline-block ${phase === "focus" ? "bg-orange-500/15 text-orange-400" : "bg-emerald-500/15 text-emerald-400"}`}>
            {phase === "focus" ? t('focusTimeLabel') : t('breakTimeLabel')}
          </div>

          {/* Circular progress */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="50" cy="50" r="44" fill="none"
                stroke={phase === "focus" ? "#f97316" : "#10b981"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black tabular-nums">{mins}:{secs}</span>
              <span className="text-xs mt-1" style={mutedStyle}>{phase === "focus" ? t('focusing') : t('onBreak')}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={reset} className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all opacity-60 hover:opacity-100" style={cardStyle}>
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={toggle}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all font-bold ${running ? "bg-red-500/20 border border-red-500/30 text-red-400" : "bg-orange-500 hover:bg-orange-400 text-white"}`}
            >
              {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold" style={cardStyle}>
              <Coffee className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl p-4 text-center" style={cardStyle}>
            <p className="text-2xl font-black text-orange-400">{sessionCount}</p>
            <p className="text-xs" style={mutedStyle}>{t('pomodoroSessions')}</p>
          </div>
          <div className="rounded-2xl p-4 text-center" style={cardStyle}>
            <p className="text-2xl font-black text-violet-400">{totalFocusMin}</p>
            <p className="text-xs" style={mutedStyle}>{t('pomodoroMinutesFocused')}</p>
          </div>
          <div className="rounded-2xl p-4 text-center" style={cardStyle}>
            <p className="text-2xl font-black text-emerald-400">{sessionsToBonus}</p>
            <p className="text-xs" style={mutedStyle}>{t('pomodoroToBonus')}</p>
          </div>
        </div>

        {bonusEarned && (
          <div className="rounded-2xl p-4 mb-6 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold text-emerald-400">{t('pomodoroDeepWorkBonus')}</p>
          </div>
        )}

        {/* Study Room */}
        <div className="rounded-3xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-sm">{t('studyRoomLabel')}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400">{activeSessions.length} {t('focusingNow')}</span>
          </div>
          {activeSessions.length === 0 ? (
            <p className="text-xs text-center py-4" style={mutedStyle}>{t('noOneFocusing')}</p>
          ) : (
            <div className="space-y-2">
              {activeSessions.map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-sm font-medium">{s.user_name || s.user_email}</p>
                  <span className="text-xs ml-auto" style={mutedStyle}>{s.session_count} sessions</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}