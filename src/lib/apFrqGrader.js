import { db } from '@/lib/firebase';
import { incrementAiUsage } from "../components/aiUsageLimit";
import { callAI } from "./lynxApi"; // Import the standardized LLM provider chain

// AP-style FRQ grader using College Board rubric guidelines
export async function gradeAPFRQ({ frq, responseText, subject, userEmail }) {
  incrementAiUsage(userEmail, false, 1);

  const partsRubric = frq.parts?.length
    ? frq.parts.map(p => `Part (${p.label || p.part || '?'}) [${p.points || 1} pt]: ${p.question}\nRubric: ${p.rubric || p.question}`).join("\n\n")
    : (frq.question || "");

  const res = await callAI({
    feature: "ap_frq_grader",
    prompt: `You are an official AP exam reader grading exactly as the College Board does. Grade each part holistically — award the point if the student demonstrates the required concept, even if wording differs from the rubric.

Subject: ${subject}
FRQ: ${frq.prompt || frq.question || ""}

RUBRIC (1 pt per part unless stated otherwise):
${partsRubric}

Student Response:
${responseText}

AP GRADING RULES:
- "Describe" = identify + basic characteristic (no causal reasoning required)
- "Explain" = identify + causal mechanism/connection (must show WHY, not just WHAT)
- "Define" = provide the essential meaning of the concept
- "Compare" = must address BOTH things being compared
- "Degree" questions require: explicit degree statement (low/moderate/high) AND explanation
- Do NOT penalize for extra information unless it contradicts the answer
- Award credit generously for correct knowledge expressed in student's own words

Return JSON:
- "score": total points earned
- "total": total points possible
- "parts": array of { "part": "A/B/C...", "earned": 0 or 1 (or stated max), "possible": 1, "feedback": "AP-style explanation of why points were/were not earned", "strong_points": "what was accurate", "improvements": "what rubric criteria was missing" }
- "overall_feedback": 2-3 sentences of College Board-style guidance`,
    response_json_schema: {
      type: "object",
      properties: {
        score: { type: "number" },
        total: { type: "number" },
        parts: { 
          type: "array", 
          items: { 
            type: "object",
            properties: {
              part: { type: "string" },
              earned: { type: "number" },
              possible: { type: "number" },
              feedback: { type: "string" },
              strong_points: { type: "string" },
              improvements: { type: "string" }
            }
          } 
        },
        overall_feedback: { type: "string" },
      }
    }
  });

  return res;
}