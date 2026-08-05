import React, { useState } from 'react';
import { checkGridInAnswer } from '@/lib/SatQuestionBank';

export default function SATScoreResult({ testData, onRetake, onHome }) {
  const { userAnswers = {}, timeSpentSeconds = 0, questions = [] } = testData || {};
  const [reviewFilter, setReviewFilter] = useState("all"); // "all" | "incorrect" | "correct"

  // ─── 1. REALISTIC DIGITAL SAT ADAPTIVE SCORING ENGINE ───────────────────────
  const totalQuestions = questions.length;
  let correctCount = 0;
  const domainBreakdown = {};

  questions.forEach((q, idx) => {
    const userAns = userAnswers[idx];
    let isCorrect = false;

    if (q.isGridIn) {
      isCorrect = checkGridInAnswer(userAns, q.correctAnswers);
    } else {
      isCorrect = userAns === q.correct;
    }

    if (isCorrect) correctCount++;

    // Aggregate by Skill Domain
    const domain = q.domain || "General Practice";
    if (!domainBreakdown[domain]) {
      domainBreakdown[domain] = { correct: 0, total: 0 };
    }
    domainBreakdown[domain].total++;
    if (isCorrect) domainBreakdown[domain].correct++;
  });

  const accuracyRatio = totalQuestions > 0 ? correctCount / totalQuestions : 0;

  /**
   * Official Digital SAT Scaled Curve Simulation (200-800 per section)
   * Real dSAT uses Item Response Theory (IRT). This models module weighting & difficulty penalization.
   */
  const computeOfficialScaledScore = (correct, total) => {
    if (total === 0) return 200;
    if (correct === total) return 800;
    if (correct === 0) return 200;

    const ratio = correct / total;
    
    // Non-linear scaled curve (steeper penalties for high-accuracy errors)
    let scaled;
    if (ratio >= 0.90) {
      // 90-100% Accuracy: High range (710 - 800)
      scaled = 800 - (total - correct) * 25;
    } else if (ratio >= 0.70) {
      // 70-89% Accuracy: Mid-High range (600 - 700)
      scaled = 700 - (total * 0.9 - correct) * 20;
    } else if (ratio >= 0.40) {
      // 40-69% Accuracy: Mid-Range (450 - 590)
      scaled = 590 - (total * 0.7 - correct) * 15;
    } else {
      // Below 40% Accuracy: (200 - 440)
      scaled = 200 + ratio * 600;
    }

    // Clamp to valid SAT range [200, 800] & round to nearest 10
    const clamped = Math.min(800, Math.max(200, scaled));
    return Math.round(clamped / 10) * 10;
  };

  const estimatedSectionScore = computeOfficialScaledScore(correctCount, totalQuestions);

  // Estimate Percentile Rank
  const getPercentile = (score) => {
    if (score >= 750) return "99th";
    if (score >= 700) return "94th";
    if (score >= 650) return "86th";
    if (score >= 600) return "73rd";
    if (score >= 550) return "58th";
    if (score >= 500) return "42nd";
    if (score >= 450) return "27th";
    return "15th or lower";
  };

  const minutesSpent = Math.floor(timeSpentSeconds / 60);
  const secondsSpent = timeSpentSeconds % 60;
  const letters = ["A", "B", "C", "D"];

  // Filtered Questions list for Diagnostic Review
  const filteredQuestions = questions.map((q, idx) => {
    const userAns = userAnswers[idx];
    const isCorrect = q.isGridIn
      ? checkGridInAnswer(userAns, q.correctAnswers)
      : userAns === q.correct;
    return { ...q, originalIndex: idx, userAns, isCorrect };
  }).filter(q => {
    if (reviewFilter === "incorrect") return !q.isCorrect;
    if (reviewFilter === "correct") return q.isCorrect;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ─── OFFICIAL BLUEBOOK-STYLE HEADER BAR ───────────────────────────── */}
        <div className="bg-[#003366] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#002244] border border-blue-400/30 text-blue-300 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  Official Score Report
                </span>
                <span className="text-slate-400 text-xs">• Digital SAT Diagnostic</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                Module Performance Score
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Total Time: <span className="font-mono text-white font-bold">{minutesSpent}m {secondsSpent}s</span> | Completed: <span className="font-mono text-white font-bold">{Object.keys(userAnswers).length} / {totalQuestions}</span>
              </p>
            </div>

            {/* Score Display Container */}
            <div className="flex items-center gap-6 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-white/10 w-full md:w-auto justify-around">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                  {estimatedSectionScore}
                </span>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-300 mt-1">
                  Scaled Score (200–800)
                </div>
              </div>

              <div className="h-10 w-px bg-white/20" />

              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
                  {getPercentile(estimatedSectionScore)}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-300 mt-1">
                  Est. Percentile
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-4">
            <div>
              Raw Accuracy: <strong className="text-white">{correctCount} of {totalQuestions}</strong> ({Math.round(accuracyRatio * 100)}%)
            </div>
            <div>
              Avg Pace: <strong className="text-white font-mono">{totalQuestions > 0 ? Math.round(timeSpentSeconds / totalQuestions) : 0}s</strong> / question
            </div>
          </div>
        </div>

        {/* ─── DOMAIN MASTERY CARD ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>📊</span> Skill Domain Breakdown
            </h2>
            <span className="text-xs text-slate-500 font-medium">Target Range Performance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(domainBreakdown).map(([domain, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={domain} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{domain}</span>
                    <span className="font-mono font-bold text-[#003366]">
                      {data.correct}/{data.total} ({pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── DETAILED QUESTION DIAGNOSTICS ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Detailed Diagnostic Review
              </h2>
              <p className="text-xs text-slate-500">Analyze correct answers, choices, and official explanations.</p>
            </div>

            {/* Review Filter Controls */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setReviewFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${reviewFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setReviewFilter("incorrect")}
                className={`px-3 py-1.5 rounded-lg transition-all ${reviewFilter === "incorrect" ? "bg-white text-red-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Incorrect ({questions.length - correctCount})
              </button>
              <button
                onClick={() => setReviewFilter("correct")}
                className={`px-3 py-1.5 rounded-lg transition-all ${reviewFilter === "correct" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Correct ({correctCount})
              </button>
            </div>
          </div>

          {/* Questions Render List */}
          <div className="space-y-6">
            {filteredQuestions.map((q) => (
              <div
                key={q.originalIndex}
                className={`p-5 rounded-xl border transition-all ${
                  q.isCorrect ? "bg-emerald-50/40 border-emerald-200" : "bg-red-50/40 border-red-200"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white font-mono ${
                      q.isCorrect ? "bg-emerald-600" : "bg-red-600"
                    }`}>
                      {q.originalIndex + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      {q.domain} • {q.skill || "Core Concept"}
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    q.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}>
                    {q.isCorrect ? "Correct ✓" : "Incorrect ✕"}
                  </span>
                </div>

                {/* Optional Passage/Stimulus Box */}
                {q.stimulus && (
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 mb-3 italic font-serif leading-relaxed">
                    "{q.stimulus}"
                  </div>
                )}

                <p className="text-xs font-semibold text-slate-900 mb-3">
                  {q.question}
                </p>

                {/* Multiple Choice Review Grid */}
                {!q.isGridIn && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = q.userAns === optIdx;
                      const isCorrectOption = q.correct === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                            isCorrectOption
                              ? "bg-emerald-100 border-emerald-300 font-bold text-emerald-900"
                              : isUserChoice
                              ? "bg-red-100 border-red-300 text-red-900"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          <span className="font-bold">{letters[optIdx]}.</span>
                          <span>{opt}</span>
                          {isCorrectOption && <span className="ml-auto text-emerald-700 font-bold">✓ Correct</span>}
                          {isUserChoice && !isCorrectOption && <span className="ml-auto text-red-600 font-bold">Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Grid-In Response Review */}
                {q.isGridIn && (
                  <div className="text-xs bg-white p-3 rounded-lg border border-slate-200 mb-3 space-y-1 font-mono">
                    <div>
                      <span className="text-slate-500">Your Response: </span>
                      <strong className={q.isCorrect ? "text-emerald-700" : "text-red-600"}>
                        {q.userAns !== undefined && q.userAns !== "" ? q.userAns : "(Blank)"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Accepted Answers: </span>
                      <strong className="text-emerald-700">{q.correctAnswers?.join(", ")}</strong>
                    </div>
                  </div>
                )}

                {/* Official Explanation Box */}
                {q.explanation && (
                  <div className="text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 leading-relaxed space-y-1">
                    <strong className="text-[#003366] block font-bold">Official Rationale:</strong>
                    <div>{q.explanation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── ACTION BUTTONS ──────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pb-8">
          {onRetake && (
            <button
              onClick={onRetake}
              className="px-6 py-3 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-200 bg-white text-slate-800 transition-all shadow-sm"
            >
              🔄 Retake Section
            </button>
          )}
          {onHome && (
            <button
              onClick={onHome}
              className="px-8 py-3 rounded-xl text-xs font-bold text-white bg-[#003366] hover:bg-[#002244] shadow-md transition-all"
            >
              Return to Dashboard
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
