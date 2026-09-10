import { db } from '@/lib/firebase';

import { useEffect, useRef } from "react";

const SAVE_INTERVAL_MS = 60 * 1000;
const MIN_SAVE_MINUTES = 0.5;

export function useAppTimeTracker(pageName) {
  const startTimeRef = useRef(null);
  const accumulatedSecondsRef = useRef(0);
  const saveTimerRef = useRef(null);
  const userEmailRef = useRef(null);

  useEffect(() => {
    db.auth.me().then(me => {
      userEmailRef.current = me?.email || null;
    }).catch(() => {});
  }, []);

  const saveAccumulatedTime = async () => {
    if (!userEmailRef.current) return;
    if (startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      accumulatedSecondsRef.current += elapsed;
      startTimeRef.current = Date.now();
    }
    const minutes = accumulatedSecondsRef.current / 60;
    if (minutes < MIN_SAVE_MINUTES) return;
    const roundedMinutes = Math.round(minutes);
    accumulatedSecondsRef.current = 0;
    try {
      await db.entities.StudySession.create({
        user_email: userEmailRef.current,
        session_type: "browsing",
        duration_minutes: roundedMinutes,
        cards_reviewed: 0,
        cards_correct: 0,
      });
    } catch {}
  };

  useEffect(() => {
    if (!pageName || pageName === "Home") return;

    startTimeRef.current = Date.now();
    accumulatedSecondsRef.current = 0;

    saveTimerRef.current = setInterval(() => {
      saveAccumulatedTime();
    }, SAVE_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (startTimeRef.current) {
          accumulatedSecondsRef.current += (Date.now() - startTimeRef.current) / 1000;
          startTimeRef.current = null;
        }
      } else {
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(saveTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      saveAccumulatedTime();
    };
  }, [pageName]);
}