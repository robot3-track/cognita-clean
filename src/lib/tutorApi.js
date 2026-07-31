import { db } from '@/lib/firebase';

/**
 * AI Tutor service — powers the AI Tutors page.
 * Uses the same multi-provider fallback chain as lynxApi but isolated here
 * to keep lynxApi.js from growing too large.
 */

import {
  LYNX_API_KEY, LYNX_BASE_URL, LYNX_MODEL, LYNX_FALLBACK_MODELS, isLynxEnabled,
  GEMINI_API_KEY, GEMINI_BASE_URL,
  COHERE_API_KEY, COHERE_MODEL, COHERE_BASE_URL,
} from "./lynxApi";
import { incrementAiUsage } from "@/components/aiUsageLimit";

async function logAIUsage(provider, feature, promptLength, success = true) {
  try {
    let userEmail = "";
    try { userEmail = (await db.auth.me())?.email || ""; } catch {}
    await db.entities.AIUsageLog.create({
      user_email: userEmail, provider,
      feature: feature || "ai_tutor",
      prompt_length: promptLength || 0, success,
    });
  } catch {}
}

/**
 * Send a message to an AI tutor. Counts against the daily AI usage limit.
 * @param {string} userEmail - for usage tracking
 * @param {string} tutorSystemPrompt - tutor persona & subject context
 * @param {Array} history - [{role: "user"|"assistant", content: string}]
 * @param {string} userMessage - latest user message
 * @returns {Promise<string>} - AI reply text
 */
export async function callTutor({ userEmail, tutorSystemPrompt, history = [], userMessage }) {
  // Count towards daily AI limit
  incrementAiUsage(userEmail, false, 0.5);

  const messages = [
    { role: "system", content: tutorSystemPrompt },
    ...history,
    { role: "user", content: userMessage },
  ];
  const feature = "ai_tutor";

  // 1. Try Lynx
  if (isLynxEnabled()) {
    const modelsToTry = [LYNX_MODEL, ...LYNX_FALLBACK_MODELS];
    for (const model of modelsToTry) {
      try {
        const res = await fetch(`${LYNX_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${LYNX_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) { logAIUsage("lynx", feature, userMessage.length, true); return content; }
      } catch {}
    }
    logAIUsage("lynx", feature, userMessage.length, false);
  }

  // 2. Try Gemini
  try {
    const geminiMessages = history.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    geminiMessages.push({ role: "user", parts: [{ text: userMessage }] });
    const res = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: tutorSystemPrompt }] },
        contents: geminiMessages,
        generationConfig: { candidateCount: 1, maxOutputTokens: 4096, temperature: 0.75 },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) { logAIUsage("gemini", feature, userMessage.length, true); return content; }
    }
    logAIUsage("gemini", feature, userMessage.length, false);
  } catch {}

  // 3. Try Cohere
  try {
    const cohereMessages = [
      { role: "system", content: tutorSystemPrompt },
      ...history.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
      { role: "user", content: userMessage },
    ];
    const res = await fetch(COHERE_BASE_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${COHERE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ stream: false, model: COHERE_MODEL, messages: cohereMessages }),
    });
    if (res.ok) {
      const data = await res.json();
      const content = data?.message?.content?.[0]?.text;
      if (content) { logAIUsage("cohere", feature, userMessage.length, true); return content; }
    }
    logAIUsage("cohere", feature, userMessage.length, false);
  } catch {}

  // 4. Claude via Base44 (final fallback)
  try {
    const fullPrompt = `${tutorSystemPrompt}\n\n${history.map(m => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`).join("\n")}\nStudent: ${userMessage}\nTutor:`;
    const result = await db.integrations.Core.InvokeLLM({ prompt: fullPrompt, model: "claude_sonnet_4_6" });
    logAIUsage("claude", feature, userMessage.length, true);
    return typeof result === "string" ? result : JSON.stringify(result);
  } catch {
    logAIUsage("claude", feature, userMessage.length, false);
  }

  throw new Error("All AI providers failed. Please try again.");
}