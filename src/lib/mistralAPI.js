// @ts-nocheck
// src/lib/mistralApi.js

import { db } from "@/lib/firebase";

export const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || "";
export const MISTRAL_BASE_URL = "https://api.mistral.ai/v1";
export const MISTRAL_MODEL = "mistral-small-latest";

/**
 * Helper to record usage logs in Firebase (Matching lynxApi user resolution)
 */
async function logAIUsage(provider, feature, promptLength = 0, success = true, error = null) {
  try {
    let userEmail = "";
    try {
      userEmail = (await db.auth.me())?.email || "";
    } catch {}

    await db.entities.AIUsageLog.create({
      user_email: userEmail,
      provider: provider || "mistral",
      feature: feature || "unknown",
      prompt_length: promptLength || 0,
      success,
      ...(error ? { error: String(error) } : {}),
    });
  } catch (err) {
    console.warn("[Mistral API] Failed to log AI usage:", err);
  }
}

/**
 * Text Completion Call (Used by LynxApiPanel text tests & chat)
 */
export async function callMistralDirect({ prompt, signal, feature = "mistral_direct" }) {
  const promptLength = prompt?.length || 0;

  if (!MISTRAL_API_KEY) {
    const err = new Error("VITE_MISTRAL_API_KEY is missing.");
    await logAIUsage("mistral", feature, promptLength, false, err.message);
    throw err;
  }

  try {
    const res = await fetch(`${MISTRAL_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
      signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Mistral API HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("No text returned from Mistral.");

    // Log Successful Call
    await logAIUsage("mistral", feature, promptLength, true);

    return content;
  } catch (err) {
    // Log Failed Call
    await logAIUsage("mistral", feature, promptLength, false, err?.message || err);
    throw err;
  }
}

/**
 * Primary Generator: Attempts to call Mistral Agent API (requires a custom agentId).
 */
async function generateWithMistralAgent({ prompt, agentId = null, signal }) {
  if (!MISTRAL_API_KEY) {
    throw new Error("VITE_MISTRAL_API_KEY is missing.");
  }

  if (!agentId) {
    throw new Error("No valid Mistral Agent ID configured.");
  }

  const conversationBody = {
    inputs: prompt,
    agent_id: agentId,
  };

  const response = await fetch(`${MISTRAL_BASE_URL}/conversations/start`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversationBody),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Extract file_id from response outputs
  let fileId = null;
  const outputs = data?.outputs || [];

  for (const output of outputs) {
    const contentList = output?.content || [];
    for (const chunk of contentList) {
      if (chunk.type === "tool_file" || chunk.file_id) {
        fileId = chunk.file_id;
        break;
      }
    }
    if (fileId) break;
  }

  if (!fileId) {
    throw new Error("Mistral did not return an image file_id.");
  }

  // Fetch the actual image binary
  const fileResponse = await fetch(`${MISTRAL_BASE_URL}/files/${fileId}/content`, {
    method: "GET",
    headers: { Authorization: `Bearer ${MISTRAL_API_KEY}` },
    signal,
  });

  if (!fileResponse.ok) {
    throw new Error(`Mistral File API HTTP ${fileResponse.status}`);
  }

  const blob = await fileResponse.blob();
  return URL.createObjectURL(blob);
}

/**
 * Backup Generator: Pollinations AI Failsafe
 */
async function generateWithPublicFallback({ prompt, signal }) {
  const encoded = encodeURIComponent(prompt);
  const randomSeed = Math.floor(Math.random() * 10000000);
  const timestamp = Date.now();

  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${randomSeed}&nocache=${timestamp}`;
}

/**
 * Main Exported Function for Image Generation with Fallbacks
 */
export async function generateImageWithMistralFallbacks({
  prompt,
  customAgentId = null,
  signal,
  feature = "image_generation",
}) {
  const promptLength = prompt?.length || 0;
  const providers = [];

  // Only attempt Mistral Agent call if an explicit Agent ID is provided
  if (customAgentId) {
    providers.push({
      name: "Mistral Agent",
      fn: () => generateWithMistralAgent({ prompt, agentId: customAgentId, signal }),
    });
  }

  // Fallback Public Generator
  providers.push({
    name: "Pollinations Public Generator",
    fn: () => generateWithPublicFallback({ prompt, signal }),
  });

  let errors = [];

  for (const provider of providers) {
    if (signal?.aborted) throw new Error("AbortError");

    try {
      console.log(`[Image Generation] Trying: ${provider.name}...`);
      const resultUrl = await provider.fn();
      if (resultUrl) {
        console.log(`[Image Generation] Success with: ${provider.name}`);

        // Log successful call using current logged-in user
        await logAIUsage("mistral", feature, promptLength, true);

        return resultUrl;
      }
    } catch (err) {
      if (err.name === "AbortError" || signal?.aborted) throw err;
      console.warn(`[Fallback Warning] ${provider.name} failed:`, err.message);
      errors.push(`${provider.name}: ${err.message}`);
    }
  }

  // Record failed call
  const failureMsg = `All image generation options failed.\nDetails:\n${errors.join("\n")}`;
  await logAIUsage("mistral", feature, promptLength, false, failureMsg);

  throw new Error(failureMsg);
}
