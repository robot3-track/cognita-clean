import { db } from '@/lib/firebase';


async function logAIUsage(provider, feature, promptLength, success = true) {
  try {
    let userEmail = "";
    try { userEmail = (await db.auth.me())?.email || ""; } catch {}
    await db.entities.AIUsageLog.create({
      user_email: userEmail,
      provider,
      feature: feature || "unknown",
      prompt_length: promptLength || 0,
      success,
    });
  } catch {}
}

// ─── API Keys & Config (Loaded from Environment Variables) ───────────────────
export const LYNX_API_KEY = import.meta.env.VITE_LYNX_API_KEY || "";
export const LYNX_BASE_URL = import.meta.env.VITE_LYNX_BASE_URL || "https://api.lynxbytss.net/v1";
export const LYNX_MODEL = import.meta.env.VITE_LYNX_MODEL || "lynx-5.2-scout";
export const LYNX_FALLBACK_MODELS = ["lynx-4.1-scout"];
export const LYNX_ENABLED_KEY = "cognita_use_lynx_api";

export const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
export const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "openrouter/free";

export const BIG_PICKLE_API_KEY = import.meta.env.VITE_BIG_PICKLE_API_KEY || "";
export const BIG_PICKLE_BASE_URL = import.meta.env.VITE_BIG_PICKLE_BASE_URL || "https://opencode.ai/zen/v1";
export const BIG_PICKLE_MODEL = import.meta.env.VITE_BIG_PICKLE_MODEL || "opencode/big-pickle";

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
export const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.6-flash";
export const GEMINI_VISION_MODEL = import.meta.env.VITE_GEMINI_VISION_MODEL || "gemini-3.6-flash";
export const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY || "";
export const NVIDIA_BASE_URL = import.meta.env.VITE_NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

// Optimized lightweight, ultra-fast NVIDIA models
const NVIDIA_GENERAL_MODELS = [
  "meta/llama-3.1-8b-instruct",
  "mistralai/mistral-7b-instruct-v0.3",
  "meta/llama-3.3-70b-instruct" // Kept as a heavy fallback option at the end
];

const NVIDIA_CODE_MODELS = [
  "qwen/qwen2.5-coder-7b-instruct",
  "qwen/qwen2.5-coder-32b-instruct",
  "meta/llama-3.1-8b-instruct"
];

export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
export const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_MODEL = "openai/gpt-oss-20b"; // Blazing fast & reliable

// Imagen 3 for scene image generation
export const IMAGEN_MODEL = "imagen-3.0-generate-002";
export const IMAGEN_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict`;

// ─── JSON2Video API ───────────────────────────────────────────────────────────
export const JSON2VIDEO_API_KEY = import.meta.env.VITE_JSON2VIDEO_API_KEY || "";
export const JSON2VIDEO_BASE_URL = "https://api.json2video.com/v2/movies";
export const JSON2VIDEO_MONTHLY_LIMIT = 1;

// ─── Cohere API ───────────────────────────────────────────────────────────────
export const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY || "";
export const COHERE_MODEL = import.meta.env.VITE_COHERE_MODEL || "command-r-plus-08-2024";
export const COHERE_BASE_URL = "https://api.cohere.com/v2/chat";

// ─── Claude via Anthropic API ─────────────────────────────────────────────────
export const VERCEL_AI_KEY = import.meta.env.VITE_VERCEL_AI_KEY || "";
export const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || "";
export const CLAUDE_MODEL = import.meta.env.VITE_CLAUDE_MODEL || "claude-opus-4-5";
export const CLAUDE_GATEWAY_URL = "https://api.anthropic.com/v1/messages";

// Lynx is ENABLED by default. Only disabled if explicitly set to "false".
export function isLynxEnabled() {
  const stored = localStorage.getItem(LYNX_ENABLED_KEY);
  return stored !== "false";
}

export function setLynxEnabled(val) {
  localStorage.setItem(LYNX_ENABLED_KEY, val ? "true" : "false");
}

const COGNITA_SYSTEM_PROMPT =
  "You are Cognita, an intelligent AI study assistant built into the Cognita learning platform — a comprehensive tool designed to help students of all levels learn more effectively. " +
  "Your mission is to make learning accessible, engaging, and personalized. You assist with homework, exam prep, concept explanations, flashcard and quiz creation, study plans, essay writing, math, science, history, languages, coding, and any academic subject. " +
  "You adapt your teaching style to each student: breaking down complex ideas into simple steps, using analogies, real-world examples, and encouraging questions. " +
  "You celebrate progress, provide motivational support, and guide students to think critically rather than just giving them answers. " +
  "You are powered by the Cognita AI engine. You are Cognita — never claim to be ChatGPT, GPT, OpenAI, Claude, Gemini, Cohere, or any other AI. " +
  "If you aren't given the proper resources or information to answer a prompt, you should clearly let the user know instead of making up answers or a prompt respones. " +
  "Never respond with incomplete responses or user checks such as user safety:safe . " +
  "Always be warm, encouraging, concise, and academically rigorous.\n\n" +
  "CAPABILITIES: You have broad knowledge across all academic subjects. When asked about current events, recent data, or real-time information, state clearly what you know up to your training cutoff and note if information may have changed. " +
  "For web searches: if a user explicitly asks you to 'search the web' or 'look up' something, do your best with your existing knowledge and note that live internet access varies by session — but provide the best possible answer from your training. " +
  "For flashcard creation: when a user asks to 'create N flashcards', always create exactly that number of flashcards as requested. Default is 10 if no number specified. if you don't see the resource the user wants to provide you, tell the user to clarify or use a different source instead of making up information. Never make up information. " +
  "For quiz creation: generate exactly the number of questions asked. " +
  "For study plans: create specific, actionable day-by-day plans with concrete tasks. " +
  "For code: always use proper markdown fenced code blocks.\n\n" +
  "TEST PREP FORMATTING RULES (AP exams, SAT, ACT, state tests):\n" +
  "- Always number questions clearly: 1., 2., 3. etc.\n" +
  "- For multiple choice: label options (A), (B), (C), (D) on separate lines.\n" +
  "- For FRQ/free-response: use clear section headers and numbered parts.\n" +
  "- After answering, provide a brief explanation or rationale.\n" +
  "- For stimulus-based questions: quote the relevant stimulus text before asking the question.\n\n" +
  "FORMATTING RULES (follow strictly):\n" +
  "- For ALL mathematical expressions, use LaTeX. Inline math: $expression$. Block/display math: $$expression$$.\n" +
  "- For ALL mathematical expressions, use LaTeX with $$ signs to represent math. DO NOT WRITE LATEX FORM WITHOUT $$ signs clearly indicating it.\n" +
  "- Examples: write $x^2 + y^2 = z^2$ for inline, $$\\int_0^\\infty e^{-x} dx = 1$$ for block equations.\n" +
  "- NEVER write raw math without LaTeX delimiters. NEVER use Unicode math symbols like ², ³, √ instead of LaTeX.\n" +
  "- For code, always use markdown fenced code blocks with the language name, e.g. ```python ... ```.\n" +
  "- Use markdown headings (##), bullet lists (-), and **bold** text for structure.\n" +
  "- Keep responses concise and well-structured. Use bullet points for lists of items.";

const COGNITA_CODE_SYSTEM_PROMPT =
  "You are Cognita Code Assistant, an expert programming tutor and coder embedded in the Cognita learning platform. " +
  "You specialize in helping students write, debug, understand, and improve code across all languages. " +
  "You explain concepts clearly, fix bugs step-by-step, suggest best practices, and teach coding fundamentals. " +
  "You are powered by the Cognita AI engine. Never claim to be any other AI. " +
  "When showing code, always use markdown fenced code blocks with the language name. " +
  "For math, use $inline$ or $$block$$ LaTeX. Keep answers focused, practical, and beginner-friendly.";

/**
 * Direct Claude call — routed via Base44 InvokeLLM (Anthropic blocks direct browser requests due to CORS)
 */
export async function callClaudeDirect({ prompt, systemPrompt, feature, max_tokens } = {}) {
  if (!prompt?.trim()) throw new Error("Prompt is required for Claude");
  const sysPrompt = systemPrompt || COGNITA_CODE_SYSTEM_PROMPT;
  const fullPrompt = `${sysPrompt}\n\n${prompt}`;
  const result = await db.integrations.Core.InvokeLLM({
    prompt: fullPrompt,
    model: "claude_sonnet_4_6",
  });
  logAIUsage("claude", feature || "claude_direct", prompt?.length, true);
  return result;
}

/**
 * Direct Gemini call — used as primary for coding tasks.
 */
export async function callGeminiDirect({ prompt, systemPrompt, response_json_schema, feature } = {}) {
  const sysPrompt = systemPrompt || COGNITA_CODE_SYSTEM_PROMPT;
  const res = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${sysPrompt}\n\n${prompt}` }],
        },
      ],
      generationConfig: {
        candidateCount: 1,
        maxOutputTokens: 8192,
        temperature: 0.5,
        ...(response_json_schema ? { responseMimeType: "application/json" } : {}),
      },
    }),
  });
  if (!res.ok) {
    logAIUsage("gemini", feature || "code_sandbox_ai", prompt?.length, false);
    throw new Error(`Gemini API error: ${res.status}`);
  }
  const data = await res.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    logAIUsage("gemini", feature || "code_sandbox_ai", prompt?.length, false);
    throw new Error("No content from Gemini");
  }
  logAIUsage("gemini", feature || "code_sandbox_ai", prompt?.length, true);
  if (response_json_schema) return JSON.parse(content);
  return content;
}

/**
 * Helper: fetch a URL and return base64 data (for Gemini vision).
 */
async function fetchImageAsBase64(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  });
}

/**
 * Call Lynx API — tries primary model then fallback models on 502/503
 */
async function tryLynx({ enhancedPrompt, systemPrompt, response_json_schema, feature }) {
  if (!isLynxEnabled()) return null;
  const userContent = response_json_schema
    ? `${enhancedPrompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown fences, no explanation, no text before or after the JSON object.`
    : enhancedPrompt;

  const modelsToTry = [LYNX_MODEL, ...LYNX_FALLBACK_MODELS];

  for (const model of modelsToTry) {
    let res;
    try {
      res = await fetch(`${LYNX_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${LYNX_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          response_format: response_json_schema ? { type: "json_object" } : undefined,
          messages: [
            { role: "system", content: systemPrompt || COGNITA_SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
        }),
      });
    } catch {
      continue; // network error, try next model
    }
    // On any error status, try next model
    if (!res.ok) { continue; }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) { logAIUsage("lynx", feature, enhancedPrompt?.length, false); return null; }
    if (response_json_schema) {
      try {
        let cleaned = content.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
        try { logAIUsage("lynx", feature, enhancedPrompt?.length, true); return JSON.parse(cleaned); } catch {}
        const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
        if (jsonMatch) { logAIUsage("lynx", feature, enhancedPrompt?.length, true); return JSON.parse(jsonMatch[1]); }
        logAIUsage("lynx", feature, enhancedPrompt?.length, false); return null;
      } catch { logAIUsage("lynx", feature, enhancedPrompt?.length, false); return null; }
    }
    logAIUsage("lynx", feature, enhancedPrompt?.length, true);
    return content;
  }

  // All Lynx models failed
  logAIUsage("lynx", feature, enhancedPrompt?.length, false);
  return null;
}

async function tryOpenRouter({ enhancedPrompt, systemPrompt, response_json_schema, feature }) {
  if (!OPENROUTER_API_KEY) return null;

  const userContent = response_json_schema
    ? `${enhancedPrompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown fences, no explanation, no text before or after the JSON object.`
    : enhancedPrompt;

  let res;
  try {
    res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "http://localhost:5173",
        "X-Title": "Cognita Study Platform"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        response_format: response_json_schema ? { type: "json_object" } : undefined,
        messages: [
          { role: "system", content: systemPrompt || COGNITA_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
    });
  } catch (err) {
    // Network or preflight CORS error
    logAIUsage("openrouter", feature, enhancedPrompt?.length, false);
    return null;
  }

  if (!res.ok) {
    // 429, 405, or other HTTP error codes
    logAIUsage("openrouter", feature, enhancedPrompt?.length, false);
    return null;
  }

  try {
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      logAIUsage("openrouter", feature, enhancedPrompt?.length, false);
      return null;
    }

    if (response_json_schema) {
      try {
        // Safely using hex codes (\x60) for backticks to prevent markdown glitches
        const cleanRegexStart = new RegExp("^\\x60\\x60\\x60(?:json)?\\s*", "im");
        const cleanRegexEnd = new RegExp("\\s*\\x60\\x60\\x60\\s*$", "im");
        let cleaned = content.replace(cleanRegexStart, "").replace(cleanRegexEnd, "").trim();
        
        try { 
          logAIUsage("openrouter", feature, enhancedPrompt?.length, true); 
          return JSON.parse(cleaned); 
        } catch {}
        
        const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
        if (jsonMatch) { 
          logAIUsage("openrouter", feature, enhancedPrompt?.length, true); 
          return JSON.parse(jsonMatch[1]); 
        }
        logAIUsage("openrouter", feature, enhancedPrompt?.length, false); 
        return null;
      } catch { 
        logAIUsage("openrouter", feature, enhancedPrompt?.length, false); 
        return null; 
      }
    }

    logAIUsage("openrouter", feature, enhancedPrompt?.length, true);
    return content;
  } catch (err) {
    // Handles unexpected response JSON formatting or parsing exceptions safely
    logAIUsage("openrouter", feature, enhancedPrompt?.length, false);
    return null;
  }
}

async function tryNvidia({ enhancedPrompt, systemPrompt, response_json_schema, feature }) {
  // Use model selections based on feature
  const isCode = feature === "code_sandbox_ai" || feature === "code_helper";
  const candidateModels = isCode ? NVIDIA_CODE_MODELS : NVIDIA_GENERAL_MODELS;

  const userContent = response_json_schema
    ? `${enhancedPrompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown fences, no explanation, no text before or after the JSON object.`
    : enhancedPrompt;

  for (const model of candidateModels) {
    try {
      // Call your Vercel serverless endpoint instead of calling NVIDIA directly
      const res = await fetch("/api/nvidia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          temperature: 0.7,
          ...(response_json_schema ? { response_format: { type: "json_object" } } : {}),
          messages: [
            { role: "system", content: systemPrompt || COGNITA_SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
        }),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) continue;

      // ==========================================
      // BULLETPROOF JSON PARSING (NO COMPLEX REGEX)
      // ==========================================
      if (response_json_schema) {
        let cleaned = content.trim();
        
        // Safely strip starting markdown code blocks
        if (cleaned.startsWith("```")) {
          const firstNewline = cleaned.indexOf("\n");
          if (firstNewline !== -1) {
            cleaned = cleaned.substring(firstNewline + 1).trim();
          }
        }
        
        // Safely strip ending markdown code blocks
        if (cleaned.endsWith("```")) {
          cleaned = cleaned.substring(0, cleaned.length - 3).trim();
        }

        try { 
          // Attempt 1: Direct Parse
          const parsed = JSON.parse(cleaned);
          logAIUsage("nvidia", feature, enhancedPrompt?.length, true); 
          return parsed; 
        } catch (e1) {
          // Attempt 2: Fallback to finding the first { and last }
          try {
            const firstBrace = content.indexOf("{");
            const lastBrace = content.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              const jsonString = content.substring(firstBrace, lastBrace + 1);
              const parsed = JSON.parse(jsonString);
              logAIUsage("nvidia", feature, enhancedPrompt?.length, true);
              return parsed;
            }
          } catch (e2) {
            // Both attempts failed
          }
        }
        
        // Move to next model if JSON parsing fails
        continue;
      }

      // Standard text response
      logAIUsage("nvidia", feature, enhancedPrompt?.length, true);
      return content;
    } catch {
      // Network or fetch error, move to next model
      continue;
    }
  }

  logAIUsage("nvidia", feature, enhancedPrompt?.length, false);
  return null;
}

/**
 * Call Groq API — ultra-fast LPU open-source inference
 */
async function tryGroq({ enhancedPrompt, systemPrompt, response_json_schema, feature }) {
  if (!GROQ_API_KEY) return null;

  const userContent = response_json_schema
    ? `${enhancedPrompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown fences, no explanation, no text before or after the JSON object.`
    : enhancedPrompt;

  let res;
  try {
    res = await fetch(GROQ_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        response_format: response_json_schema ? { type: "json_object" } : undefined,
        messages: [
          { role: "system", content: systemPrompt || COGNITA_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.7,
      }),
    });
  } catch (err) {
    logAIUsage("groq", feature, enhancedPrompt?.length, false);
    return null;
  }

  if (!res.ok) {
    logAIUsage("groq", feature, enhancedPrompt?.length, false);
    return null;
  }

  try {
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      logAIUsage("groq", feature, enhancedPrompt?.length, false);
      return null;
    }

    if (response_json_schema) {
      try {
        const cleanRegexStart = new RegExp("^\\x60\\x60\\x60(?:json)?\\s*", "im");
        const cleanRegexEnd = new RegExp("\\s*\\x60\\x60\\x60\\s*$", "im");
        let cleaned = content.replace(cleanRegexStart, "").replace(cleanRegexEnd, "").trim();
        
        try { 
          logAIUsage("groq", feature, enhancedPrompt?.length, true); 
          return JSON.parse(cleaned); 
        } catch {}
        
        const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
        if (jsonMatch) { 
          logAIUsage("groq", feature, enhancedPrompt?.length, true); 
          return JSON.parse(jsonMatch[1]); 
        }
        logAIUsage("groq", feature, enhancedPrompt?.length, false); 
        return null;
      } catch { 
        logAIUsage("groq", feature, enhancedPrompt?.length, false); 
        return null; 
      }
    }

    logAIUsage("groq", feature, enhancedPrompt?.length, true);
    return content;
  } catch (err) {
    logAIUsage("groq", feature, enhancedPrompt?.length, false);
    return null;
  }
}
/**
 * Call Big Pickle API via InvokeLLM proxy (direct browser fetch blocked by CORS).
 * Uses Base44 as a server-side proxy to reach opencode.ai/zen/v1.
 */
async function tryBigPickle({ enhancedPrompt, systemPrompt, response_json_schema, feature }) {
  if (!BIG_PICKLE_API_KEY) return null;
  const sysPrompt = systemPrompt || COGNITA_SYSTEM_PROMPT;
  const userContent = response_json_schema
    ? `${enhancedPrompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown fences, no explanation, no text before or after the JSON object.`
    : enhancedPrompt;

  try {
    const res = await fetch("/api/bigpickle", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BIG_PICKLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: BIG_PICKLE_MODEL,
        temperature: 0.7,
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!res.ok) {
      logAIUsage("bigpickle", feature, enhancedPrompt?.length, false);
      return null;
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content?.trim()) {
      logAIUsage("bigpickle", feature, enhancedPrompt?.length, false);
      return null;
    }

    if (response_json_schema) {
      try {
        let cleaned = content.trim();

        // Strip leading markdown block (e.g. ```json)
        if (cleaned.startsWith("```")) {
          const firstNewLine = cleaned.indexOf("\n");
          if (firstNewLine !== -1) {
            cleaned = cleaned.slice(firstNewLine + 1);
          } else {
            cleaned = cleaned.replace(/^```[a-zA-Z]*/, "");
          }
        }

        // Strip trailing markdown block
        if (cleaned.endsWith("```")) {
          cleaned = cleaned.slice(0, -3);
        }

        cleaned = cleaned.trim();

        // Direct JSON attempt
        try {
          logAIUsage("bigpickle", feature, enhancedPrompt?.length, true);
          return JSON.parse(cleaned);
        } catch {}

        // Fallback: extract substring between first '{' and last '}'
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const jsonSubstring = cleaned.slice(firstBrace, lastBrace + 1);
          logAIUsage("bigpickle", feature, enhancedPrompt?.length, true);
          return JSON.parse(jsonSubstring);
        }

        logAIUsage("bigpickle", feature, enhancedPrompt?.length, false);
        return null;
      } catch {
        logAIUsage("bigpickle", feature, enhancedPrompt?.length, false);
        return null;
      }
    }

    logAIUsage("bigpickle", feature, enhancedPrompt?.length, true);
    return content;
  } catch {
    logAIUsage("bigpickle", feature, enhancedPrompt?.length, false);
    return null;
  }
}

/**
 * Call Gemini API
 */
async function tryGemini({ enhancedPrompt, systemPrompt, response_json_schema, feature }) {
  if (!GEMINI_API_KEY) return null;
  // When JSON needed, explicitly instruct Gemini to output clean JSON matching the schema
  const userText = response_json_schema
    ? `${systemPrompt || COGNITA_SYSTEM_PROMPT}\n\n${enhancedPrompt}\n\nIMPORTANT: Respond with ONLY a valid JSON object matching this schema: ${JSON.stringify(response_json_schema)}. No markdown fences, no explanation, no text before or after the JSON.`
    : `${systemPrompt || COGNITA_SYSTEM_PROMPT}\n\n${enhancedPrompt}`;
  const res = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig: { candidateCount: 1, maxOutputTokens: 8192, temperature: 0.7, ...(response_json_schema ? { responseMimeType: "application/json" } : {}) },
    }),
  });
  if (!res.ok) { logAIUsage("gemini", feature, enhancedPrompt?.length, false); return null; }
  const data = await res.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) { logAIUsage("gemini", feature, enhancedPrompt?.length, false); return null; }
  if (response_json_schema) {
    try {
      let cleaned = content.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
      try { logAIUsage("gemini", feature, enhancedPrompt?.length, true); return JSON.parse(cleaned); } catch {}
      const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
      if (jsonMatch) { logAIUsage("gemini", feature, enhancedPrompt?.length, true); return JSON.parse(jsonMatch[1]); }
      logAIUsage("gemini", feature, enhancedPrompt?.length, false); return null;
    } catch { logAIUsage("gemini", feature, enhancedPrompt?.length, false); return null; }
  }
  logAIUsage("gemini", feature, enhancedPrompt?.length, true);
  return content;
}

/**
 * Call Cohere API
 */
async function tryCohere({ enhancedPrompt, systemPrompt, response_json_schema, feature }) {
  if (!COHERE_API_KEY) return null;
  // When JSON is needed, prepend explicit instruction so Cohere outputs clean JSON
  const userContent = response_json_schema
    ? `${enhancedPrompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown fences, no explanation, no text before or after the JSON object.`
    : enhancedPrompt;
  const res = await fetch(COHERE_BASE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${COHERE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      stream: false,
      model: COHERE_MODEL,
      messages: [
        { role: "system", content: systemPrompt || COGNITA_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    }),
  });
  if (!res.ok) { logAIUsage("cohere", feature, enhancedPrompt?.length, false); return null; }
  const data = await res.json();
  const content = data?.message?.content?.[0]?.text;
  if (!content) { logAIUsage("cohere", feature, enhancedPrompt?.length, false); return null; }
  if (response_json_schema) {
    try {
      // Strip markdown fences and find first {...} block
      let cleaned = content.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
      try { logAIUsage("cohere", feature, enhancedPrompt?.length, true); return JSON.parse(cleaned); } catch {}
      const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
      if (jsonMatch) { logAIUsage("cohere", feature, enhancedPrompt?.length, true); return JSON.parse(jsonMatch[1]); }
      logAIUsage("cohere", feature, enhancedPrompt?.length, false); return null;
    } catch { logAIUsage("cohere", feature, enhancedPrompt?.length, false); return null; }
  }
  logAIUsage("cohere", feature, enhancedPrompt?.length, true);
  return content;
}

/**
 * Call Claude via Base44 InvokeLLM (avoids CORS — Anthropic blocks direct browser requests)
 */
async function tryClaude({ enhancedPrompt, systemPrompt, response_json_schema, feature }) {
  try {
    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\n${enhancedPrompt}`
      : `${COGNITA_SYSTEM_PROMPT}\n\n${enhancedPrompt}`;
    const result = await db.integrations.Core.InvokeLLM({
      prompt: fullPrompt,
      model: "claude_sonnet_4_6",
      ...(response_json_schema ? { response_json_schema } : {}),
    });
    logAIUsage("claude", feature, enhancedPrompt?.length, true);
    return result;
  } catch (err) {
    console.warn("Claude (via Base44) failed:", err?.message);
    logAIUsage("claude", feature, enhancedPrompt?.length, false);
    return null;
  }
}

/**
 * Universal AI call — Lynx → Gemini → Cohere → Claude → Base44
 *
 * For CODE HELPER: Cohere → Lynx → Gemini → Claude → Base44
 * For internet/vision requests: Gemini first (only provider supporting both)
 */
export async function callAI({ prompt, response_json_schema, add_context_from_internet, file_urls, model, systemPrompt, feature } = {}) {
  let enhancedPrompt = prompt;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (feature === "chat" || feature === "chat_to_flashcards" || feature === "chat_to_quiz" || feature === "voice_chat") {
    enhancedPrompt = `[User Timezone: ${timezone}]\n\n${prompt}`;
  }

  const needsInternet = !!add_context_from_internet;
  const needsVision = !!(file_urls && file_urls.length > 0);

  // If internet search or vision → Gemini first
  // If internet search or vision, Gemini first then fall back to other providers like Lynx etc.
  if (needsInternet || needsVision) {
    // 1. Try Gemini first (Best natively for both web search and vision)
    if (GEMINI_API_KEY) {
      try {
        const visionModel = needsVision ? GEMINI_VISION_MODEL : GEMINI_MODEL;
        const bodyParts = [{ text: `${systemPrompt || COGNITA_SYSTEM_PROMPT}\n\n${enhancedPrompt}` }];
        if (needsVision) {
          for (const url of file_urls) {
            try {
              const b64 = await fetchImageAsBase64(url);
              bodyParts.push({ inlineData: { mimeType: "image/jpeg", data: b64 } });
            } catch {}
          }
        }
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${visionModel}:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: bodyParts }],
            ...(needsInternet ? { tools: [{ googleSearch: {} }] } : {}),
            generationConfig: { candidateCount: 1, maxOutputTokens: 8192, temperature: 0.7, ...(response_json_schema ? { responseMimeType: "application/json" } : {}) },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            logAIUsage("gemini", feature, enhancedPrompt?.length, true);
            if (response_json_schema) { try { return JSON.parse(content); } catch {} }
            else return content;
          }
        }
        logAIUsage("gemini", feature, enhancedPrompt?.length, false);
      } catch (err) {
        console.warn("Gemini search/vision failed:", err?.message);
        logAIUsage("gemini", feature, enhancedPrompt?.length, false);
      }
    }

    // ─── GEMINI FAILED OR DISABLED ───
    // Fallback pipeline for Vision/Internet tasks using your other providers:
    const args = { enhancedPrompt, systemPrompt, response_json_schema, feature };

    // 2. Try Lynx
    try {
      const rLynx = await tryLynx(args);
      if (rLynx != null) return rLynx;
    } catch (e) { console.warn("Lynx fallback failed for vision/internet:", e?.message); }

    try {
      const rGroq = await tryGroq(args);
      if (rGroq != null) return rGroq;
    } catch (e) { console.warn("Groq fallback failed:", e?.message); }

    // Try Nvidia
    try {
      const rNvidia = await tryNvidia(args);
      if (rNvidia != null) return rNvidia;
    } catch (e) { console.warn("Nvidia fallback failed:", e?.message); }

    // 2.5 Try OpenRouter
    try {
      const rOR = await tryOpenRouter(args);
      if (rOR != null) return rOR;
    } catch (e) { console.warn("OpenRouter fallback failed:", e?.message); }

    // 3. Try Cohere
    try {
      const rCohere = await tryCohere(args);
      if (rCohere != null) return rCohere;
    } catch (e) { console.warn("Cohere fallback failed for vision/internet:", e?.message); }

    // 4. Try Big Pickle
    try {
      const rPickle = await tryBigPickle(args);
      if (rPickle != null) return rPickle;
    } catch (e) { console.warn("Big Pickle fallback failed for vision/internet:", e?.message); }

    // 5. Try Claude
    try {
      const rClaude = await tryClaude(args);
      if (rClaude != null) return rClaude;
    } catch (e) { console.warn("Claude fallback failed for vision/internet:", e?.message); }

    // 6. Base44 Final Absolute Fallback
    const result = await db.integrations.Core.InvokeLLM({
      prompt: enhancedPrompt,
      ...(response_json_schema ? { response_json_schema } : {}),
      ...(add_context_from_internet ? { add_context_from_internet } : {}),
      ...(file_urls ? { file_urls } : {}),
      ...(model ? { model } : {}),
    });
    logAIUsage("base44_fallback", feature, enhancedPrompt?.length, true);
    return result;
  }

  const args = { enhancedPrompt, systemPrompt, response_json_schema, feature };

  // Code helper uses Cohere first, then Lynx
  const isCodeFeature = feature === "code_sandbox_ai" || feature === "code_helper";
  
  if (isCodeFeature) {
    // Cohere → Lynx → Nvidia → Gemini → Big Pickle → Claude → Base44
    const r1 = await tryCohere(args).catch(() => null);
    if (r1 != null) return r1;
    const r2 = await tryLynx(args).catch(() => null);
    if (r2 != null) return r2;
    const rOR = await tryOpenRouter(args).catch(() => null);
    if (rOR != null) return rOR;
    const rNvidia = await tryNvidia(args).catch(() => null); // <-- ADD HERE
    if (rNvidia != null) return rNvidia;
    const r3 = await tryGemini(args).catch(() => null);
    if (r3 != null) return r3;
  } else {
    // Standard: Lynx → OpenRouter → Groq → Gemini → Cohere → Big Pickle → Claude → Base44
    const rGroq = await tryGroq(args).catch(() => null); // <-- Added Groq 3rd in line
    if (rGroq != null) return rGroq;
    const r1 = await tryLynx(args).catch(() => null);
    if (r1 != null) return r1;
    const rOR = await tryOpenRouter(args).catch(() => null);
    if (rOR != null) return rOR;
    const rNvidia = await tryNvidia(args).catch(() => null); // Nvidia update! let's go
    if (rNvidia != null) return rNvidia;
    const r3 = await tryCohere(args).catch(() => null);
    if (r3 != null) return r3;
    const r2 = await tryGemini(args).catch(() => null);
    if (r2 != null) return r2;
  }

  // Shared fallbacks: Big Pickle, Claude, Base44
  const r4 = await tryBigPickle(args).catch(() => null);
  if (r4 != null) return r4;
  const r5 = await tryClaude(args).catch(() => null);
  if (r5 != null) return r5;

  // Base44 final fallback
  const result = await db.integrations.Core.InvokeLLM({
    prompt: enhancedPrompt,
    ...(response_json_schema ? { response_json_schema } : {}),
    ...(add_context_from_internet ? { add_context_from_internet } : {}),
    ...(file_urls ? { file_urls } : {}),
    ...(model ? { model } : {}),
  });
  logAIUsage("gemini", feature, enhancedPrompt?.length, true);
  return result;
}

/**
 * Direct Lynx call — tries primary then fallback models. Used for explicit Lynx tests.
 */
export async function callLynxDirect({ prompt, systemPrompt } = {}) {
  const modelsToTry = [LYNX_MODEL, ...LYNX_FALLBACK_MODELS];
  let lastError = null;

  for (const model of modelsToTry) {
    let res;
    try {
      res = await fetch(`${LYNX_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LYNX_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt || COGNITA_SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
        }),
      });
    } catch (err) {
      lastError = err;
      continue;
    }
    if (!res.ok) {
      lastError = new Error(`Lynx ${model} returned ${res.status} ${res.statusText}`);
      continue; // try next model on ANY error status
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) { lastError = new Error(`No content from ${model}`); continue; }
    return `[${model}] ${content}`;
  }

  throw lastError || new Error("All Lynx models failed (502/503)");
}

/**
 * Generate a scene image using Gemini Imagen 3 directly first, then Base44 GenerateImage as fallback.
 * Returns a public URL string or null on failure.
 */
export async function generateSceneImage({ prompt } = {}) {
  if (!prompt) return null;

  // Try Gemini Imagen 3 directly (no base44 LLM needed)
  try {
    const res = await fetch(`${IMAGEN_BASE_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
      const mimeType = data?.predictions?.[0]?.mimeType || "image/png";
      if (b64) {
        // Upload b64 image via base44 UploadFile so we get a hosted URL
        const blob = await fetch(`data:${mimeType};base64,${b64}`).then(r => r.blob());
        const { file_url } = await db.integrations.Core.UploadFile({ file: blob });
        if (file_url) return file_url;
      }
    }
  } catch (err) {
    console.warn("Imagen 3 direct failed:", err?.message);
  }

  // Fallback: Base44 GenerateImage
  try {
    const result = await db.integrations.Core.GenerateImage({ prompt });
    const url = result?.url || null;
    if (!url) console.warn("GenerateImage: no URL returned", result);
    return url;
  } catch (err) {
    console.warn("GenerateImage error:", err?.message);
    return null;
  }
}

/**
 * Generate a scene image via Imagen 3. Returns { url, type: "image" }.
 * Note: Veo (video generation) requires Vertex AI service account auth which is
 * not available from the browser. We use Imagen for high-quality scene images instead.
 */
export async function generateSceneMedia({ prompt } = {}) {
  const imageUrl = await generateSceneImage({ prompt });
  return { url: imageUrl || null, type: "image" };
}

// Legacy compat
export const generateVeoVideo = generateSceneMedia;

// ─── File Upload ──────────────────────────────────────────────────────────────
/**
 * Upload a file and return its public URL.
 * Wraps Base44's UploadFile integration — works from browser with no backend needed.
 */
export async function uploadFile(file) {
  const { file_url } = await db.integrations.Core.UploadFile({ file });
  return file_url;
}

/**
 * Extract text content from an uploaded file (PDF, image, doc, csv, xlsx, json, html).
 * Returns extracted text string or null.
 */
export async function extractTextFromFile(file) {
  const file_url = await uploadFile(file);
  const result = await db.integrations.Core.ExtractDataFromUploadedFile({
    file_url,
    json_schema: { type: "object", properties: { content: { type: "string" } } },
  });
  return result?.output?.content || null;
}

// ─── Audio Transcription ──────────────────────────────────────────────────────
/**
 * Transcribe an audio file to text using Whisper via db.
 * Supported formats: ogg, oga, mp3, wav, webm, m4a, mp4, mpeg, mpga, flac. Max 25MB.
 * Returns transcript string or null.
 */
export async function transcribeAudio(file) {
  const audio_url = await uploadFile(file);
  const transcript = await db.integrations.Core.TranscribeAudio({ audio_url });
  return transcript || null;
}

// ─── Speech Synthesis ─────────────────────────────────────────────────────────
/**
 * Generate TTS audio from text and return a playable MP3 URL.
 * Uses Base44 GenerateSpeech (stored, shareable). Falls back to browser SpeechSynthesis.
 * voice options: 'river' (calm), 'honey' (warm), 'sunny' (bright), 'storm' (formal), 'spark' (energetic)
 */
export async function generateSpeech(text, { voice = "river", language_code } = {}) {
  try {
    const result = await db.integrations.Core.GenerateSpeech({
      text: text.slice(0, 5000),
      voice,
      ...(language_code ? { language_code } : {}),
    });
    return result?.url || null;
  } catch (err) {
    console.warn("GenerateSpeech failed:", err?.message);
    return null;
  }
}

/**
 * Speak text using browser SpeechSynthesis (no cost, instant, no storage).
 * Returns the utterance so caller can cancel it.
 */
export function speakText(text, { rate = 0.95, pitch = 1.05, onEnd } = {}) {
  if (!window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text.slice(0, 5000));
  utt.rate = rate;
  utt.pitch = pitch;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Google US English") || v.lang === "en-US");
  if (preferred) utt.voice = preferred;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
  return utt;
}

/**
 * Generate a quiz from flashcards — routes through full AI chain with proper logging.
 * Returns parsed JSON { questions: [...] } or throws.
 */
export async function generateQuizFromCards({ cards, count = 10, feature = "quiz_generation" } = {}) {
  const cardText = cards.map(c => `Q: ${c.front}\nA: ${c.back}`).join("\n\n");
  const prompt =
    `Create a ${count}-question AP-exam-style multiple choice quiz based on these flashcards:\n\n${cardText}\n\n` +
    `STRICT REQUIREMENTS — follow every rule exactly:\n` +
    `1. ANSWER POSITION — THIS IS CRITICAL: You MUST deliberately spread correct answers across all 4 indexes. For ${count} questions, distribute like this: roughly ${Math.round(count/4)} questions with correct=0, ${Math.round(count/4)} with correct=1, ${Math.round(count/4)} with correct=2, ${Math.round(count/4)} with correct=3. Shuffle this intentionally. If you find yourself defaulting to index 0 or 1 repeatedly, STOP and fix it. The final list must NOT have more than 35% of answers at any single position.\n` +
    `2. TRICKY DISTRACTORS: All 3 wrong answers must be deviously plausible — use common misconceptions, reversed cause/effect, off-by-one facts, terms that sound similar, or statements that are true in a different context. A well-prepared student should still pause before choosing.\n` +
    `3. QUESTION SOPHISTICATION: Mix question styles — (a) "Which is NOT correct", (b) scenario-based application, (c) cause-and-effect, (d) compare/contrast two concepts, (e) "What would happen if..." inference. Avoid straightforward definition recall.\n` +
    `4. EQUAL OPTION LENGTHS — CRITICAL: All 4 answer choices must be the same approximate length (within 5 words of each other). The correct answer must NEVER be noticeably longer, more specific, or more complete than the distractors. Pad distractors to match length. Remove qualifying detail from correct answers if needed. Students must not be able to guess by picking the most thorough-sounding option.\n` +
    `5. NO ABSURD DISTRACTORS: Every wrong answer must be something a real student could believe is correct.\n` +
    `6. COMPLEXITY: At least 40% of questions should involve multi-step reasoning or application rather than direct recall.\n\n` +
    `Return JSON with a "questions" array. Each question has: "question" (string), "options" (array of exactly 4 strings), "correct" (index 0-3 — MUST be evenly distributed), "explanation" (string explaining why the correct answer is right AND why the top 2 most tempting wrong answers are wrong).`;
  const schema = {
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correct: { type: "number" },
            explanation: { type: "string" },
          },
        },
      },
    },
  };
  const result = await callAI({ prompt, response_json_schema: schema, feature });
  if (typeof result === "object" && result?.questions) return result;
  // Try to parse if string returned
  const parsed = typeof result === "string" ? JSON.parse(result) : result;
  return parsed;
}

/**
 * Generate flashcards from text — routes through full AI chain with proper logging.
 * Returns parsed JSON { flashcards: [{front, back}] } or throws.
 */
export async function generateFlashcardsFromText({ text, count = 10, feature = "flashcard_generation" } = {}) {
  const prompt =
    `Create exactly ${count} flashcards from the following content:\n\n${text}\n\n` +
    `Return JSON with a "flashcards" array. Each flashcard has "front" (question/term) and "back" (answer/definition). ` +
    `Cover the most important concepts. Be concise and clear.`;
  const schema = {
    type: "object",
    properties: {
      flashcards: {
        type: "array",
        items: {
          type: "object",
          properties: { front: { type: "string" }, back: { type: "string" } },
        },
      },
    },
  };
  const result = await callAI({ prompt, response_json_schema: schema, feature });
  if (typeof result === "object" && result?.flashcards) return result;
  const parsed = typeof result === "string" ? JSON.parse(result) : result;
  return parsed;
}

/**
 * Generate a practice test from flashcards (mixed types) with proper logging.
 */
export async function generateTestFromCards({ cards, config = {}, feature = "test_generation" } = {}) {
  const { mc = 10, written = 5, truefalse = 5 } = config;
  const cardText = cards.map(c => `Q: ${c.front}\nA: ${c.back}`).join("\n\n");
  const prompt =
    `Create a rigorous AP-exam-style practice test from these flashcards:\n\n${cardText}\n\n` +
    `Generate:\n` +
    `- ${mc} multiple choice questions (4 options, mark correct index 0-3)\n` +
    `- ${truefalse} true/false questions\n` +
    `- ${written} short answer questions\n\n` +
    `STRICT REQUIREMENTS for multiple choice — follow every rule:\n` +
    `1. ANSWER POSITION — CRITICAL: Deliberately spread correct answers. For ${mc} MC questions, target ~${Math.round(mc/4)} each at indexes 0, 1, 2, and 3. Do NOT cluster answers at index 0 or 1. If you catch yourself putting correct=0 or correct=1 repeatedly, STOP and redistribute. No single index should exceed 35% of MC questions.\n` +
    `2. TRICKY DISTRACTORS: All 3 wrong answers must be deviously plausible — reversed cause/effect, off-by-one facts, similar-sounding terms, partially true statements. A well-prepared student should genuinely pause before choosing.\n` +
    `3. QUESTION SOPHISTICATION: Mix styles — "Which is NOT correct", scenario-based application, cause-effect, compare/contrast two concepts, inference questions. Avoid straight definition recall.\n` +
    `4. EQUAL OPTION LENGTHS — CRITICAL: All 4 choices must be roughly the same length (within 5 words). The correct answer must NEVER be longer, more specific, or more complete than the distractors. Pad distractors, trim correct answers. Students must not guess by choosing the most thorough-sounding option.\n\n` +
    `For true/false: Use tricky statements — subtle factual errors, misconceptions, or statements that are almost-but-not-quite true. Avoid obvious facts or clearly absurd statements. Mix true and false roughly 50/50.\n` +
    `For short answer: Require explanation, comparison, or analysis — not just definitions. Ask "why", "how", "what would happen if", or "compare X and Y".\n\n` +
    `Return JSON: { "mc": [{question, options, correct, explanation}], "tf": [{question, answer (bool), explanation}], "written": [{question, answer}] }`;
  const schema = {
    type: "object",
    properties: {
      mc: { type: "array", items: { type: "object" } },
      tf: { type: "array", items: { type: "object" } },
      written: { type: "array", items: { type: "object" } },
    },
  };
  const result = await callAI({ prompt, response_json_schema: schema, feature });
  if (typeof result === "object") return result;
  return JSON.parse(result);
}

// ─── JSON2Video ───────────────────────────────────────────────────────────────

/**
 * Check how many JSON2Video videos this user has generated this calendar month.
 * Uses GeneratedMedia records with type="video" and file_url set (indicates a real rendered video).
 */
export async function getMonthlyVideoCount(userEmail) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  try {
    const records = await db.entities.GeneratedMedia.list("-created_date", 200);
    return records.filter(r =>
      (r.created_by === userEmail || r.created_by_id === userEmail) &&
      r.type === "video" &&
      r.file_url &&
      r.created_date >= startOfMonth
    ).length;
  } catch {
    return 0;
  }
}

/**
 * Log a JSON2Video attempt to AIUsageLog for DevDashboard tracking.
 */
async function logJson2VideoAttempt(status, details = "") {
  try {
    let userEmail = "";
    try { userEmail = (await db.auth.me())?.email || ""; } catch {}
    await db.entities.AIUsageLog.create({
      user_email: userEmail,
      provider: "json2video",
      feature: `json2video_${status}`,
      prompt_length: details.length,
      success: status === "done",
    });
  } catch {}
}

/**
 * Submit a video render job to JSON2Video and poll until complete.
 * Uses Base44 backend integration with internet context to bypass CORS restrictions.
 * Returns the CDN MP4 URL on success, throws on error.
 */
export async function renderVideoWithJson2Video(payload, onStatus) {
  const notify = (msg) => { if (onStatus) onStatus(msg); };

  if (!JSON2VIDEO_API_KEY) {
    throw new Error("JSON2Video API key is missing in environment settings.");
  }

  notify("Submitting render job to JSON2Video…");
  const payloadStr = JSON.stringify(payload);
  console.log("[JSON2Video] Submitting payload size:", payloadStr.length);

  // ── 1. Submit Render Job via Backend Integration Proxy ─────────────────────
  let projectId;
  const submitPrompt = `Send an HTTP POST request to endpoint "${JSON2VIDEO_BASE_URL}".
Headers:
  x-api-key: ${JSON2VIDEO_API_KEY}
  Content-Type: application/json

Body:
${payloadStr}

Return the exact JSON response returned by the JSON2Video endpoint.`;

  try {
    const submitResult = await db.integrations.Core.InvokeLLM({
      prompt: submitPrompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          project: { type: "string" },
          error: { type: "string" },
          message: { type: "string" },
        },
      },
    });

    console.log("[JSON2Video] Submit response:", submitResult);

    // Parse response
    const resObj = typeof submitResult === "string" ? JSON.parse(submitResult) : submitResult;
    projectId = resObj?.project;

    if (!resObj?.success || !projectId) {
      const errMsg = resObj?.error || resObj?.message || JSON.stringify(resObj);
      await logJson2VideoAttempt("submit_failed", errMsg);
      throw new Error(`JSON2Video submission failed: ${errMsg}`);
    }
  } catch (err) {
    await logJson2VideoAttempt("submit_error", err.message);
    throw new Error(`Failed to submit video render job: ${err.message}`);
  }

  await logJson2VideoAttempt("submitted", `project=${projectId}`);
  notify(`Render job submitted (Project ID: ${projectId}). Waiting for render…`);

  // ── 2. Poll Render Status Every 8 Seconds (Up to 5 Minutes) ───────────────
  for (let i = 0; i < 38; i++) {
    await new Promise(r => setTimeout(r, 8000));
    notify(`Rendering video… (${Math.round((i + 1) * 8)}s elapsed)`);

    const pollPrompt = `Send an HTTP GET request to "${JSON2VIDEO_BASE_URL}?project=${projectId}".
Headers:
  x-api-key: ${JSON2VIDEO_API_KEY}

Return the exact JSON status response.`;

    try {
      const pollResult = await db.integrations.Core.InvokeLLM({
        prompt: pollPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            movie: {
              type: "object",
              properties: {
                status: { type: "string" },
                url: { type: "string" },
                error: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      });

      const resObj = typeof pollResult === "string" ? JSON.parse(pollResult) : pollResult;
      const movie = resObj?.movie;
      console.log("[JSON2Video] Poll status:", movie?.status, movie?.url);

      if (!movie) continue;

      if (movie.status === "done") {
        const videoUrl = movie.url;
        if (!videoUrl) throw new Error("Render complete, but no video URL returned.");
        await logJson2VideoAttempt("done", `project=${projectId} url=${videoUrl}`);
        notify("Video render complete!");
        return videoUrl;
      }

      if (movie.status === "error" || movie.status === "timeout") {
        const errMsg = movie.error || movie.message || movie.status;
        await logJson2VideoAttempt("render_failed", `project=${projectId} err=${errMsg}`);
        throw new Error(`JSON2Video rendering failed: ${errMsg}`);
      }
    } catch (e) {
      if (e.message.includes("rendering failed") || e.message.includes("no video URL")) {
        throw e;
      }
      console.warn("[JSON2Video] Retrying status check:", e?.message);
    }
  }

  await logJson2VideoAttempt("timeout", `project=${projectId}`);
  throw new Error("JSON2Video render timed out after 5 minutes.");
}

/**
 * Build a JSON2Video movie payload matching JSON2Video v2 schema specifications.
 */
export function buildJson2VideoPayload(scriptData, imageUrls = []) {
  const scenes = scriptData?.scenes || [];
  const bgColors = ["#1a1a2e", "#16213e", "#0f3460", "#1b1f3b", "#12112e"];

  const builtScenes = scenes.map((scene, i) => {
    const sceneNum = scene.scene_number || i + 1;
    const headline = (scene.on_screen_text || `Scene ${sceneNum}`).slice(0, 80);
    const narration = (scene.narration_segment || "").slice(0, 400);
    const bg = bgColors[i % bgColors.length];
    const imageUrl = imageUrls[i] || null;

    const elements = [];

    // Background image element
    if (imageUrl) {
      elements.push({
        type: "image",
        src: imageUrl,
        duration: -2,
        width: 1920,
        height: 1080,
        "z-index": -1,
      });
    }

    // Top-left Scene Counter Header
    elements.push({
      type: "text",
      text: `Scene ${sceneNum} / ${scenes.length}`,
      duration: -2,
      "z-index": 1,
      settings: {
        "font-family": "Roboto",
        "font-size": "22px",
        "font-weight": "700",
        "font-color": "#c4b5fd",
        "vertical-position": "top",
        "horizontal-position": "left",
      },
    });

    // Main Headline Banner
    elements.push({
      type: "text",
      text: headline,
      duration: -2,
      "z-index": 2,
      settings: {
        "font-family": "Roboto",
        "font-size": "52px",
        "font-weight": "900",
        "font-color": "#ffffff",
        "text-align": "center",
        "background-color": "rgba(0,0,0,0.6)",
        "vertical-position": "bottom",
        "horizontal-position": "center",
      },
    });

    // TTS Voice Narration
    if (narration) {
      elements.push({
        type: "voice",
        text: narration,
        voice: "en-US-EmmaMultilingualNeural",
        model: "azure",
        duration: -1,
      });
    }

    return {
      comment: `Scene ${sceneNum}: ${headline}`,
      "background-color": bg,
      elements,
    };
  });

  return {
    resolution: "full-hd",
    quality: "high",
    cache: false,
    scenes: builtScenes,
  };
}

// System prompt specifically for media generation, teaching all providers the exact format.
const MEDIA_SYSTEM_PROMPT =
  "You are Cognita Media Generator. You create educational audio narration scripts and structured video scripts for students. " +
  "CRITICAL RULES:\n" +
  "- For AUDIO: Return a plain text narration script ONLY. No JSON, no headers, no extra formatting. Just the spoken words.\n" +
  "- For VIDEO: Return ONLY valid JSON (no markdown, no code fences, no explanation outside the JSON). " +
  "The JSON must have exactly these keys: " +
  '{ "title": string, "narration": string, "scenes": [ { "scene_number": number, "duration": string, "visual_description": string, "narration_segment": string, "on_screen_text": string } ] }. ' +
  "Always include exactly 5 scenes. Never wrap JSON in ```json``` blocks. Output raw JSON only.\n" +
  "- Be educational, clear, and engaging. Write for a student audience.";

/**
 * Robustly parse JSON from AI response — strips markdown fences and finds first {...} block.
 */
function extractJSON(content) {
  if (!content) throw new Error("Empty content");
  let cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try { return JSON.parse(cleaned); } catch {}
  const match = cleaned.match(/(\{[\s\S]*\})/);
  if (match) return JSON.parse(match[1]);
  throw new Error("No valid JSON found in response");
}

/**
 * Media Generation Chain.
 * For VIDEO scripts: Gemini first (best JSON compliance), then Lynx → Cohere → Claude → Base44
 * For AUDIO narration: Lynx first → Gemini → Cohere → Claude → Base44
 */
export async function callAIForMedia({ prompt, response_json_schema, feature } = {}) {
  const isVideo = !!response_json_schema;

  const tryLynxMedia = async () => {
    if (!isLynxEnabled()) throw new Error("Lynx disabled");
    const modelsToTry = [LYNX_MODEL, ...LYNX_FALLBACK_MODELS];
    let lastErr = new Error("All Lynx models failed");
    for (const model of modelsToTry) {
      let res;
      try {
        res = await fetch(`${LYNX_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${LYNX_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            response_format: isVideo ? { type: "json_object" } : undefined,
            messages: [{ role: "system", content: MEDIA_SYSTEM_PROMPT }, { role: "user", content: prompt }],
          }),
        });
      } catch (e) { lastErr = e; continue; }
      if (!res.ok) { lastErr = new Error(`Lynx ${model} ${res.status}`); continue; }
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("No content");
      return isVideo ? extractJSON(content) : content;
    }
    throw lastErr;
  };

  const tryGeminiMedia = async () => {
    const geminiPrompt = isVideo
      ? `${MEDIA_SYSTEM_PROMPT}\n\n${prompt}\n\nIMPORTANT: Output ONLY raw JSON. No markdown fences. No explanation. Start your response with { and end with }.`
      : `${MEDIA_SYSTEM_PROMPT}\n\n${prompt}`;
    const res = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: geminiPrompt }] }],
        generationConfig: { candidateCount: 1, maxOutputTokens: 8192, temperature: 0.6, ...(isVideo ? { responseMimeType: "application/json" } : {}) },
      }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("No content");
    return isVideo ? extractJSON(content) : content;
  };

  const tryClaudeMedia = async () => {
    const result = await db.integrations.Core.InvokeLLM({
      prompt: `${MEDIA_SYSTEM_PROMPT}\n\n${prompt}`,
      model: "claude_sonnet_4_6",
      ...(isVideo ? { response_json_schema: { type: "object", properties: { title: { type: "string" }, narration: { type: "string" }, scenes: { type: "array" } } } } : {}),
    });
    if (!result) throw new Error("No content");
    return isVideo ? (typeof result === "object" ? result : extractJSON(result)) : result;
  };

  const tryCohereMedia = async () => {
    const coherePrompt = isVideo
      ? `${prompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown fences, no explanation. Start with { and end with }.`
      : prompt;
    const res = await fetch(COHERE_BASE_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${COHERE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ stream: false, model: COHERE_MODEL, messages: [{ role: "system", content: MEDIA_SYSTEM_PROMPT }, { role: "user", content: coherePrompt }] }),
    });
    if (!res.ok) throw new Error(`Cohere ${res.status}`);
    const data = await res.json();
    const content = data?.message?.content?.[0]?.text;
    if (!content) throw new Error("No content");
    return isVideo ? extractJSON(content) : content;
  };

  // Order: video → Gemini first; audio → Lynx first
  const orderedProviders = isVideo
    ? [["gemini", tryGeminiMedia], ["lynx", tryLynxMedia], ["cohere", tryCohereMedia], ["claude", tryClaudeMedia]]
    : [["lynx", tryLynxMedia], ["gemini", tryGeminiMedia], ["cohere", tryCohereMedia], ["claude", tryClaudeMedia]];

  for (const [name, fn] of orderedProviders) {
    try {
      const result = await fn();
      logAIUsage(name, feature, prompt?.length, true);
      return result;
    } catch (err) {
      console.warn(`${name} media failed:`, err?.message);
      logAIUsage(name, feature, prompt?.length, false);
    }
  }

  // Base44 last resort
  try {
    const result = await db.integrations.Core.InvokeLLM({
      prompt: `${MEDIA_SYSTEM_PROMPT}\n\n${prompt}`,
      ...(response_json_schema ? { response_json_schema } : {}),
    });
    logAIUsage("gemini", feature, prompt?.length, true);
    return result;
  } catch (err) {
    console.error("All media generation providers failed:", err?.message);
    throw new Error("All AI providers failed. Please try again.");
  }
}
