import { db } from '@/lib/firebase';
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "../hooks/useTranslation";

import { BarChart3, Clock, Target, Brain, Trophy, Loader2, ClipboardList, Flag, Edit3, Save } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import PullToRefresh from "@/components/PullToRefresh";
import { format, subDays } from "date-fns";

export default function Progress() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [goalMinutes, setGoalMinutes] = useState(30);
  const [goalCards, setGoalCards] = useState(20);
  const [editingGoals, setEditingGoals] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(30);
  const [tempCards, setTempCards] = useState(20);
  const [savingGoals, setSavingGoals] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const me = await db.auth.me();
      setUser(me);
      if (!me) {
        setLoading(false);
        return;
      }

      const gm = me.study_goal_minutes || 30;
      const gc = me.study_goal_cards || 20;
      setGoalMinutes(gm); setTempMinutes(gm);
      setGoalCards(gc); setTempCards(gc);

      // Fetch ALL study sessions associated with the user without 500 limits
      const [byEmail, byCreated] = await Promise.all([
        db.entities.StudySession.filter({ user_email: me.email }).catch(() => []),
        db.entities.StudySession.filter({ created_by: me.email }).catch(() => [])
      ]);

      // Deduplicate sessions by ID and sort descending by date
      const sessionMap = new Map();
      [...byEmail, ...byCreated].forEach(s => {
        if (s && s.id) {
          sessionMap.set(s.id, s);
        }
      });

      const allSessions = Array.from(sessionMap.values()).sort((a, b) => {
        return new Date(b.created_date || 0) - new Date(a.created_date || 0);
      });

      setSessions(allSessions);
    } catch (err) {
      console.error("Error loading progress sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Live subscription for study session changes
  useEffect(() => {
    let unsub;
    db.auth.me().then(me => {
      if (!me) return;
      unsub = db.entities.StudySession.subscribe((event) => {
        if (event.type === "create") {
          const s = event.data;
          if (s && (s.user_email === me.email || s.created_by === me.email)) {
            setSessions(prev => {
              if (prev.some(x => x.id === s.id)) return prev;
              return [s, ...prev];
            });
          }
        } else if (event.type === "update") {
          setSessions(prev => prev.map(x => x.id === event.id ? { ...x, ...event.data } : x));
        } else if (event.type === "delete") {
          setSessions(prev => prev.filter(x => x.id !== event.id));
        }
      });
    }).catch(() => {});

    return () => unsub?.();
  }, []);

  const saveGoals = async () => {
    setSavingGoals(true);
    await db.auth.updateMe({ study_goal_minutes: tempMinutes, study_goal_cards: tempCards });
    setGoalMinutes(tempMinutes);
    setGoalCards(tempCards);
    setEditingGoals(false);
    setSavingGoals(false);
  };

  useEffect(() => { loadData(); }, [loadData]);

  // Calculations for all-time stats
  const totalMinutes = sessions.reduce((a, s) => a + Number(s.duration_minutes || 0), 0);
  const studyMinutes = sessions.filter(s => s.session_type !== "browsing").reduce((a, s) => a + Number(s.duration_minutes || 0), 0);
  const browsingMinutes = sessions.filter(s => s.session_type === "browsing").reduce((a, s) => a + Number(s.duration_minutes || 0), 0);
  const totalCards = sessions.filter(s => s.session_type !== "browsing").reduce((a, s) => a + Number(s.cards_reviewed || 0), 0);
  
  const quizSessions = sessions.filter(s => s.session_type === "quiz" && s.quiz_score != null);
  const testSessions = sessions.filter(s => s.session_type === "practice_test" && s.quiz_score != null);
  const allScoredSessions = [...quizSessions, ...testSessions];
  
  const avgScore = allScoredSessions.length > 0
    ? Math.round(allScoredSessions.reduce((a, s) => a + Number(s.quiz_score || 0), 0) / allScoredSessions.length)
    : 0;

  // Last 7 days chart data
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const day = subDays(new Date(), 6 - i);
    const dayStr = format(day, "yyyy-MM-dd");
    const daySessions = sessions.filter(s => s.created_date?.startsWith(dayStr));
    return {
      day: format(day, "EEE"),
      minutes: daySessions.reduce((a, s) => a + Number(s.duration_minutes || 0), 0),
      studyMinutes: daySessions.filter(s => s.session_type !== "browsing").reduce((a, s) => a + Number(s.duration_minutes || 0), 0),
      browsingMinutes: daySessions.filter(s => s.session_type === "browsing").reduce((a, s) => a + Number(s.duration_minutes || 0), 0),
    };
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaySessions = sessions.filter(s => s.created_date?.startsWith(todayStr));
  const todayMinutes = todaySessions.reduce((a, s) => a + Number(s.duration_minutes || 0), 0);
  const todayCards = todaySessions.filter(s => s.session_type !== "browsing").reduce((a, s) => a + Number(s.cards_reviewed || 0), 0);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  return (
    <PullToRefresh onRefresh={loadData}>
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black tracking-tight mb-2">{t('progress')}</h1>
          <p className="text-sm mb-4" style={mutedStyle}>{t('progressDesc')}</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[["overview", "Overview", BarChart3], ["goals", "Daily Goals", Flag]].map(([id, label, Icon]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === id ? "bg-violet-500/20 text-violet-400" : "opacity-50 hover:opacity-80"}`}
                style={tab !== id ? cardStyle : {}}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {tab === "goals" ? (
            <div className="space-y-5">
              <div className="rounded-3xl p-6" style={cardStyle}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-sm">Today's Progress</h2>
                  <span className="text-xs" style={mutedStyle}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /><span className="text-sm font-semibold">Study Time</span></div>
                      <span className={`text-sm font-bold ${todayMinutes >= goalMinutes ? "text-emerald-400" : ""}`}>{todayMinutes} / {goalMinutes} min</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--app-bg)" }}>
                      <div className="h-full rounded-full transition-all duration-700 bg-blue-500" style={{ width: `${Math.min(100, (todayMinutes / goalMinutes) * 100)}%` }} />
                    </div>
                    {todayMinutes >= goalMinutes && <p className="text-xs text-emerald-400 mt-1 font-semibold">✓ Goal reached!</p>}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><Brain className="w-4 h-4 text-violet-400" /><span className="text-sm font-semibold">Cards Reviewed</span></div>
                      <span className={`text-sm font-bold ${todayCards >= goalCards ? "text-emerald-400" : ""}`}>{todayCards} / {goalCards} cards</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--app-bg)" }}>
                      <div className="h-full rounded-full transition-all duration-700 bg-violet-500" style={{ width: `${Math.min(100, (todayCards / goalCards) * 100)}%` }} />
                    </div>
                    {todayCards >= goalCards && <p className="text-xs text-emerald-400 mt-1 font-semibold">✓ Goal reached!</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-6" style={cardStyle}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-sm">Set Daily Goals</h2>
                  {!editingGoals && (
                    <button onClick={() => setEditingGoals(true)} className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                  )}
                </div>
                {editingGoals ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold mb-2 block" style={mutedStyle}>Daily Study Time (minutes)</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min="5" max="240" step="5" value={tempMinutes} onChange={e => setTempMinutes(+e.target.value)} className="flex-1" />
                        <span className="text-sm font-bold w-16 text-right">{tempMinutes} min</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-2 block" style={mutedStyle}>Daily Cards to Review</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min="5" max="200" step="5" value={tempCards} onChange={e => setTempCards(+e.target.value)} className="flex-1" />
                        <span className="text-sm font-bold w-16 text-right">{tempCards} cards</span>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setEditingGoals(false)} className="flex-1 py-2.5 rounded-2xl text-sm font-semibold" style={cardStyle}>Cancel</button>
                      <button onClick={saveGoals} disabled={savingGoals} className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-2.5 rounded-2xl text-sm font-semibold transition-all">
                        {savingGoals ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Goals
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl p-4" style={{ background: "var(--app-bg)" }}>
                      <Clock className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-2xl font-black text-blue-400">{goalMinutes}m</p>
                      <p className="text-xs mt-0.5" style={mutedStyle}>Daily study time</p>
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: "var(--app-bg)" }}>
                      <Brain className="w-5 h-5 text-violet-400 mb-2" />
                      <p className="text-2xl font-black text-violet-400">{goalCards}</p>
                      <p className="text-xs mt-0.5" style={mutedStyle}>Cards per day</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Live indicator */}
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium" style={mutedStyle}>Live updated · All-time totals</span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: Clock, color: "text-blue-400", label: t('timeStudied'), value: studyMinutes >= 60 ? `${Math.floor(studyMinutes/60)}h ${Math.round(studyMinutes%60)}m` : `${Math.round(studyMinutes)}m` },
                  { icon: Brain, color: "text-violet-400", label: t('cardsReviewed'), value: totalCards.toLocaleString() },
                  { icon: Target, color: "text-amber-400", label: t('avgQuizScore'), value: avgScore > 0 ? `${avgScore}%` : "—" },
                  { icon: Trophy, color: "text-emerald-400", label: t('quizzesTaken'), value: quizSessions.length },
                  { icon: ClipboardList, color: "text-pink-400", label: "Tests Taken", value: testSessions.length },
                  { icon: Clock, color: "text-cyan-400", label: "Total Sessions", value: sessions.length },
                ].map(({ icon: Icon, color, label, value }) => (
                  <div key={label} className="rounded-3xl p-5" style={cardStyle}>
                    <Icon className={`w-5 h-5 ${color} mb-3`} />
                    <p className="text-2xl font-black">{value}</p>
                    <p className="text-xs mt-1" style={mutedStyle}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Weekly chart */}
              <div className="rounded-3xl p-6 mb-6" style={cardStyle}>
                <h2 className="font-bold text-sm mb-5">{t('studyTimeLast7')}</h2>
                {last7.every(d => d.minutes === 0) ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-10" />
                    <p className="text-sm" style={mutedStyle}>{t('noSessionsYet')}</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={last7} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--app-text-muted)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--app-text-muted)" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, fontSize: 12 }}
                        labelStyle={{ color: "var(--app-text)" }}
                        formatter={(v) => [`${v} min`, "Study Time"]}
                      />
                      <Bar dataKey="minutes" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Avg Score Progress Bar */}
              {allScoredSessions.length > 0 && (
                <div className="rounded-3xl p-5 mb-6" style={cardStyle}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-sm">Average Score</h2>
                    <span className={`text-xl font-black ${avgScore >= 80 ? "text-emerald-400" : avgScore >= 60 ? "text-amber-400" : "text-red-400"}`}>{avgScore}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--app-bg)" }}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${avgScore >= 80 ? "bg-emerald-500" : avgScore >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                  <p className="text-xs mt-2" style={mutedStyle}>
                    Based on {allScoredSessions.length} quiz{allScoredSessions.length !== 1 ? "zes" : ""} & test{allScoredSessions.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}

              {/* Test History */}
              {testSessions.length > 0 && (
                <div className="rounded-3xl p-5 mb-6" style={cardStyle}>
                  <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-pink-400" /> Test History
                  </h2>
                  <div className="space-y-3">
                    {testSessions.slice(0, 10).map(s => (
                      <div key={s.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <ClipboardList className="w-4 h-4 text-pink-400 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Practice Test</p>
                            <p className="text-xs" style={mutedStyle}>{s.cards_reviewed} questions · {s.duration_minutes || 0}m · {s.created_date ? format(new Date(s.created_date), "MMM d, yyyy") : ""}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${s.quiz_score >= 80 ? "text-emerald-400" : s.quiz_score >= 60 ? "text-amber-400" : "text-red-400"}`}>{s.quiz_score}%</p>
                          <p className="text-xs" style={mutedStyle}>{s.cards_correct}/{s.quiz_total} correct</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent sessions */}
              {sessions.length > 0 && (
                <div className="rounded-3xl p-5" style={cardStyle}>
                  <h2 className="font-bold text-sm mb-4">{t('recentSessions')}</h2>
                  <div className="space-y-3">
                    {sessions.slice(0, 10).map(s => (
                      <div key={s.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {s.session_type === "practice_test"
                            ? <ClipboardList className="w-4 h-4 text-pink-400 shrink-0" />
                            : s.session_type === "quiz"
                            ? <Target className="w-4 h-4 text-amber-400 shrink-0" />
                            : <Brain className="w-4 h-4 text-violet-400 shrink-0" />}
                          <div>
                            <p className="text-sm font-medium capitalize">{s.session_type?.replace(/_/g, " ")}</p>
                            <p className="text-xs" style={mutedStyle}>{s.created_date ? format(new Date(s.created_date), "MMM d") : ""}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {s.quiz_score != null && <p className="text-sm font-bold text-amber-400">{s.quiz_score}%</p>}
                          <p className="text-xs" style={mutedStyle}>{s.duration_minutes || 0}m</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PullToRefresh>
  );
}
