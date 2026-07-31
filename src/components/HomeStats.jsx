import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Clock, BookOpen, TrendingUp } from "lucide-react";

export default function HomeStats() {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalReviewed, setTotalReviewed] = useState(0);

  const loadStats = async () => {
    const sessions = await db.entities.StudySession.list("-created_date", 500);
    const mins = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const reviewed = sessions.reduce((sum, s) => sum + (s.cards_reviewed || 0), 0);
    setTotalMinutes(mins);
    setTotalReviewed(reviewed);
  };

  useEffect(() => {
    loadStats();
    const unsub = db.entities.StudySession.subscribe((event) => {
      loadStats();
    });
    return unsub;
  }, []);

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="mb-8">
      <h2 className="font-bold text-sm mb-3" style={mutedStyle}>Community Impact</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-4 text-center" style={cardStyle}>
          <Clock className="w-5 h-5 mx-auto mb-2 text-violet-400" />
          <p className="text-2xl font-black text-violet-400">{totalMinutes.toLocaleString()}</p>
          <p className="text-[10px] mt-1" style={mutedStyle}>Minutes Studied</p>
        </div>
        <div className="rounded-2xl p-4 text-center" style={cardStyle}>
          <BookOpen className="w-5 h-5 mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-black text-blue-400">{totalReviewed.toLocaleString()}</p>
          <p className="text-[10px] mt-1" style={mutedStyle}>Cards Reviewed</p>
        </div>
        <div className="rounded-2xl p-4 text-center" style={cardStyle}>
          <TrendingUp className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
          <p className="text-2xl font-black text-emerald-400">+15%</p>
          <p className="text-[10px] mt-1" style={mutedStyle}>Avg Score Increase</p>
        </div>
      </div>
      <p className="text-[10px] mt-2 text-center" style={{ ...mutedStyle, opacity: 0.5 }}>
        A study of Cognita users reported a 15% average increase in test and quiz scores.
      </p>
    </div>
  );
}