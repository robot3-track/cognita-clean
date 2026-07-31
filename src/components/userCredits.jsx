import { db } from '@/lib/firebase';

// Cross-device AI credits & history stored on the User entity

export async function getServerCredits() {
  try {
    const me = await db.auth.me();
    return {
      surveyBonus: me.survey_bonus || 0,
      history: me.credit_history ? JSON.parse(me.credit_history) : [],
    };
  } catch { return { surveyBonus: 0, history: [] }; }
}

export async function addSurveyBonusServer(amount = 5, note = "Survey reward") {
  try {
    const me = await db.auth.me();
    const current = me.survey_bonus || 0;
    const history = me.credit_history ? JSON.parse(me.credit_history) : [];
    history.push({ type: "survey_reward", amount: +amount, note, date: new Date().toISOString() });
    // Keep last 500 entries
    if (history.length > 500) history.splice(0, history.length - 500);
    await db.auth.updateMe({
      survey_bonus: Math.round((current + amount) * 100) / 100,
      credit_history: JSON.stringify(history),
    });
    window.dispatchEvent(new Event("ai_usage_update"));
  } catch {}
}

export async function recordAiUseServer(amount = 1) {
  try {
    const me = await db.auth.me();
    const history = me.credit_history ? JSON.parse(me.credit_history) : [];
    history.push({ type: "ai_use", amount: -amount, date: new Date().toISOString() });
    if (history.length > 500) history.splice(0, history.length - 500);
    await db.auth.updateMe({ credit_history: JSON.stringify(history) });
  } catch {}
}