import { db } from '@/lib/firebase';

// AI Usage Limiter — account-based, server-synced, 20 credits/day

import { addSurveyBonusServer, recordAiUseServer } from "./userCredits";

const EXEMPT_EMAIL = "yychang100@student.hbuhsd.edu";
const THIEN_EMAIL = "thiennguyentran2006@gmail.com"; // Thien gets 15 credits/day
const DAILY_REPLENISH = 8;

function getDailyReplenish(email) {
  if (email === THIEN_EMAIL) return 15;
  return DAILY_REPLENISH;
}

export function dispatchUsageUpdate() {
  window.dispatchEvent(new Event("ai_usage_update"));
}

// ─── Helper: Get Current User Document Reference ──────────────────────────────
async function getUserRecord(email) {
  if (!email) return null;
  const users = await db.entities.User.filter({ email: email });
  return users.length > 0 ? users[0] : null;
}

// ─── Local cache (for synchronous reads) ─────────────────────────────────────

function getCacheKey(email) {
  return `ai_credits_cache_${email}`;
}

function getCachedCredits(email) {
  if (!email) return 0;
  const val = localStorage.getItem(getCacheKey(email));
  return val !== null ? parseFloat(val) : DAILY_REPLENISH;
}

function setCachedCredits(email, amount) {
  if (!email) return;
  localStorage.setItem(getCacheKey(email), String(Math.max(0, Math.round(amount * 100) / 100)));
}

// ─── Usage History (local log) ────────────────────────────────────────────────

function getHistoryKey(email) {
  return `ai_usage_history_${email}`;
}

export function getUsageHistory(email) {
  if (!email) return [];
  try { return JSON.parse(localStorage.getItem(getHistoryKey(email)) || "[]"); }
  catch { return []; }
}

function appendHistory(email, entry) {
  if (!email) return;
  const hist = getUsageHistory(email);
  hist.push({ ...entry, date: new Date().toISOString() });
  if (hist.length > 1000) hist.splice(0, hist.length - 1000);
  localStorage.setItem(getHistoryKey(email), JSON.stringify(hist));
}

// ─── Init: sync from server + daily replenish ────────────────────────────────

export async function initAiCredits(email) {
  if (!email || email === EXEMPT_EMAIL) return;
  try {
    const me = await getUserRecord(email);
    if (!me) return;

    const today = new Date().toISOString().slice(0, 10);
    const replenishAmount = getDailyReplenish(email);
    let credits = me.ai_credits ?? replenishAmount;
    const lastReplenish = me.ai_credits_last_replenish || "";

    // Daily replenish: only if new day AND credits < replenishAmount
    if (lastReplenish !== today && credits < replenishAmount) {
      credits = replenishAmount;
      await db.entities.User.update(me.id, {
        ai_credits: credits,
        ai_credits_last_replenish: today,
      });
    } else if (lastReplenish !== today) {
      // Update replenish date even if no refill needed
      await db.entities.User.update(me.id, { ai_credits_last_replenish: today });
    }

    // Also add any pending survey bonuses
    const surveyCredits = await db.entities.SurveyCredit.filter({ user_email: email, applied: false });
    let bonusTotal = 0;
    for (const credit of surveyCredits) {
      bonusTotal += credit.amount;
      await db.entities.SurveyCredit.update(credit.id, { applied: true });
    }
    if (bonusTotal > 0) {
      credits += bonusTotal;
      await db.entities.User.update(me.id, { ai_credits: credits });
    }

    setCachedCredits(email, credits);
    dispatchUsageUpdate();
  } catch (err) {
    console.error("Error initializing AI credits:", err);
  }
}

// ─── Core Usage ──────────────────────────────────────────────────────────────

export function canUseAi(email, isUnlimited = false) {
  if (!email) return false;
  if (isUnlimited || email === EXEMPT_EMAIL) return true;
  return getCachedCredits(email) > 0;
}

export function incrementAiUsage(email, isUnlimited = false, amount = 1) {
  if (!email || isUnlimited || email === EXEMPT_EMAIL) return;
  const current = getCachedCredits(email);
  const next = Math.max(0, current - amount);
  setCachedCredits(email, next);
  appendHistory(email, { type: "ai_use", amount: -amount });
  dispatchUsageUpdate();

  // Push to server Firestore safely via User Entity
  getUserRecord(email).then(me => {
    if (me) {
      db.entities.User.update(me.id, { ai_credits: next }).catch(() => {});
    }
  }).catch(() => {});
  
  recordAiUseServer(amount).catch(() => {});
}

export function getRemainingAiUses(email, isUnlimited = false) {
  if (!email) return 0;
  if (isUnlimited || email === EXEMPT_EMAIL) return Infinity;
  return getCachedCredits(email);
}

export function getAiUsageCount(email) {
  if (!email) return 0;
  return Math.max(0, DAILY_REPLENISH - getCachedCredits(email));
}

export function getTotalLimit(email) {
  return DAILY_REPLENISH + getSurveyBonus(email);
}

// ─── Survey Bonus ────────────────────────────────────────────────────────────

function getSurveyBonusKey(email) {
  return `ai_survey_bonus_${email}`;
}

export function getSurveyBonus(email) {
  if (!email) return 0;
  return parseFloat(localStorage.getItem(getSurveyBonusKey(email)) || "0");
}

export function addSurveyBonus(email, amount = 5, note = "Survey reward") {
  if (!email) return;
  const key = getSurveyBonusKey(email);
  const current = getSurveyBonus(email);
  localStorage.setItem(key, String(Math.round((current + amount) * 100) / 100));
  
  // Also add to cached credits
  const credCurrent = getCachedCredits(email);
  const nextCredits = credCurrent + amount;
  setCachedCredits(email, nextCredits);
  appendHistory(email, { type: "survey_reward", amount: +amount, note });
  dispatchUsageUpdate();
  addSurveyBonusServer(amount, note).catch(() => {});
  
  // Sync credits to server safely via User Entity
  getUserRecord(email).then(me => {
    if (me) {
      db.entities.User.update(me.id, { ai_credits: nextCredits }).catch(() => {});
    }
  }).catch(() => {});
}

// ─── Legacy sync (backwards compat) ──────────────────────────────────────────

export async function syncBonusFromServer(email) {
  if (!email) return;
  await initAiCredits(email);
}

export async function checkServerCredits(email) {
  if (!email) return;
  await initAiCredits(email);
}

export async function hasUnlimitedAccess(email) {
  if (!email || email === EXEMPT_EMAIL) return true;
  try {
    const records = await db.entities.UpgradeDetection.filter({ user_email: email });
    return records.length > 0 && records[0].unlimited_access === true;
  } catch { return false; }
}