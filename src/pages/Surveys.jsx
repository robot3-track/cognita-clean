import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import { addSurveyBonus } from "@/components/aiUsageLimit";
import { addSurveyBonusServer } from "@/components/userCredits";
import { useTranslation } from "../hooks/useTranslation";
import { Gift, Loader2, CheckCircle } from "lucide-react";

const APP_ID = "32113";

export default function Surveys() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rewardCount, setRewardCount] = useState(0);
  const [justRewarded, setJustRewarded] = useState(false);
  const rewarded = useRef(new Set());

  useEffect(() => {
    db.auth.me().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Poll SurveyCredit entity for server-granted credits (CPX postback)
  useEffect(() => {
    if (!user) return;
    let active = true;
    const poll = async () => {
      if (!active) return;
      try {
        // Fetch ALL credits for user regardless of applied flag to avoid missing any
        const credits = await db.entities.SurveyCredit.filter({ user_email: user.email });
        for (const credit of credits) {
          const uid = credit.id;
          if (rewarded.current.has(uid)) continue;
          if (credit.applied) { rewarded.current.add(uid); continue; } // already applied, just mark seen
          rewarded.current.add(uid);
          const amount = Math.ceil(parseFloat(credit.amount) || 1);
          // Mark applied first to prevent double-crediting
          await db.entities.SurveyCredit.update(credit.id, { applied: true });
          // Credit both server and local cache
          await addSurveyBonusServer(amount, credit.reason || "Survey reward");
          addSurveyBonus(user.email, amount, credit.reason || "Survey reward");
          setRewardCount(prev => prev + amount);
          setJustRewarded(amount);
          setTimeout(() => setJustRewarded(false), 5000);
        }
      } catch (err) { console.error("Survey poll error", err); }
      if (active) setTimeout(poll, 8000); // poll every 8s instead of 15s
    };
    poll();
    return () => { active = false; };
  }, [user]);

  // Also listen for iframe postMessage (CPX in-page events)
  useEffect(() => {
    const handler = (e) => {
      try {
        const raw = e.data;
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (!data) return;

        const isComplete =
          data.status === "survey_completed" ||
          data.message === "survey_completed" ||
          data.event === "survey_completed" ||
          data.event === "cpx_survey_completed" ||
          (data.type === "cpx" && (data.event === "completed" || data.event === "survey_completed")) ||
          data.cpx_event === "survey_completed" ||
          (e.origin?.includes("cpx-research.com") && (data.completed || data.survey_completed));

        const isScreenout =
          data.status === "survey_screenout" ||
          data.message === "survey_screenout" ||
          data.event === "survey_screenout" ||
          data.cpx_event === "survey_screenout" ||
          (e.origin?.includes("cpx-research.com") && data.screenout);

        if (isComplete || isScreenout) {
          const uid = data.transaction_id || data.survey_id || data.cpx_uid || ("msg_" + Date.now());
          if (rewarded.current.has(uid)) return;
          rewarded.current.add(uid);
          if (user?.email) {
            const credits = isScreenout ? 1 : Math.max(1, Math.round(parseFloat(data.reward || data.points || data.payout || 5) || 5));
            addSurveyBonus(user.email, credits, isScreenout ? "Screenout partial reward" : "Survey completed");
            setRewardCount(prev => prev + credits);
            setJustRewarded(isScreenout ? `screenout +${credits}` : credits);
            setTimeout(() => setJustRewarded(false), 4000);
          }
        }
      } catch {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [user]);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const postbackBase = "https://cognita-base-v16.db.app";
  const iframeSrc = user
    ? `https://offers.cpx-research.com/index.php?app_id=${APP_ID}&ext_user_id=${encodeURIComponent(user.id)}&username=${encodeURIComponent(user.full_name || "")}&email=${encodeURIComponent(user.email)}&subid_1=${encodeURIComponent(user.email)}&subid_2=cognita&secure_hash=&postback_url=${encodeURIComponent(postbackBase + '/file?status={status}&trans_id={trans_id}&user_id={user_id}&sub_id={subid}&sub_id_2={subid_2}&amount_local={amount_local}&amount_usd={amount_usd}&offer_id={offer_ID}&hash={secure_hash}&ip_click={ip_click}')}`
    : null;

  return (
    <div className="min-h-screen pb-28" style={bgStyle}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://media.base44.com/images/public/69b097f35579053a78af47a3/1a62591a3_images.png"
            alt="CPX Research"
            className="h-10 object-contain"
            onError={e => { e.target.style.display = "none"; }}
          />
          <div>
            <h1 className="text-2xl font-black tracking-tight">{t('surveysTitle')}</h1>
            <p className="text-sm" style={mutedStyle}>{t('surveysDesc')}</p>
          </div>
        </div>

        {/* Reward info card */}
        <div className="rounded-3xl p-5 mb-6 flex items-center gap-4" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{t('earnCredits')}</p>
            <p className="text-xs mt-0.5" style={mutedStyle}>{t('surveysDesc')}</p>
          </div>
          {rewardCount > 0 && (
            <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
              +{rewardCount} {t('earnedTodayLabel')}
            </div>
          )}
        </div>

        {/* Reward toast */}
        {justRewarded && (
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-4 bg-emerald-500/15 border border-emerald-500/30">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold text-emerald-400">{t('surveysTitle')} +{justRewarded}!</p>
          </div>
        )}

        {/* CPX not-yet-set-up notice */}
        <div className="rounded-2xl p-4 mb-4 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30">
          <span className="text-xl shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-bold text-amber-400">Survey credits temporarily unavailable</p>
            <p className="text-xs mt-1 text-amber-300/80">The CPX Research survey integration has not been fully configured yet. Surveys may appear but <strong>no credits will be awarded</strong> at this time. Check back soon — we'll remove this notice once it's live.</p>
          </div>
        </div>

        {/* Powered by CPX */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", ...mutedStyle }}>
            Powered by CPX Research — Trusted survey platform
          </span>
        </div>

        {/* Survey iframe */}
        <div className="rounded-3xl overflow-hidden" style={cardStyle}>
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
          ) : (
            <iframe
              src={iframeSrc}
              width="100%"
              frameBorder="0"
              height="2000px"
              title="CPX Research Surveys"
              allow="clipboard-write"
            />
          )}
        </div>

        <p className="text-center text-xs mt-4" style={mutedStyle}>
          {t('surveysAutoReward')}
        </p>
      </div>
    </div>
  );
}