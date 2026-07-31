import { db } from '@/lib/firebase';

// Tracks time the user spends browsing the app (non-Home pages)
// Saves accumulated minutes to StudySession with session_type "browsing"
import { useEffect, useRef } from "react";

const SAVE_INTERVAL_MS = 60 * 1000; // save every 60 seconds
const MIN_SAVE_MINUTES = 0.5; // only save if at least 30 seconds accumulated

export function useAppTimeTracker(pageName) {
  const startTimeRef = useRef(null);
  const accumulatedSecondsRef = useRef(0);
  const saveTimerRef = useRef(null);
  const userEmailRef = useRef(null);

  // Fetch user email once
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
    // Don't track Home page
    if (!pageName || pageName === "Home") return;

    startTimeRef.current = Date.now();
    accumulatedSecondsRef.current = 0;

    // Save periodically
    saveTimerRef.current = setInterval(() => {
      saveAccumulatedTime();
    }, SAVE_INTERVAL_MS);

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause: accumulate elapsed time, stop counting
        if (startTimeRef.current) {
          accumulatedSecondsRef.current += (Date.now() - startTimeRef.current) / 1000;
          startTimeRef.current = null;
        }
      } else {
        // Resume: restart timer
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(saveTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Save remaining time on unmount
      saveAccumulatedTime();
    };
  }, [pageName]);
}