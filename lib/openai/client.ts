const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

// Cheapest currently-active GPT-5 tier (verified against OpenAI's own docs
// at build time — see conversation notes; do not "helpfully" swap this for
// an older model name from training data without re-checking
// platform.openai.com/docs/pricing, since model IDs and pricing tiers
// change over time). More than sufficient for a short FAQ system prompt
// plus a few turns of history.
const MODEL = "gpt-5-nano";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class OpenAiError extends Error {}

/**
 * Minimal fetch-based wrapper — deliberately no SDK dependency for a
 * single-endpoint integration. Throws OpenAiError on any failure; callers
 * must catch this and never forward the raw error (or the API key) to the
 * client.
 */
export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new OpenAiError("OPENAI_API_KEY is not set.");
  }

  const res = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_completion_tokens: 800,
      // GPT-5 models spend part of max_completion_tokens on hidden
      // "reasoning tokens" before producing visible output — verified
      // empirically that with our system prompt's length, the default
      // effort consumed the entire budget on reasoning and left nothing
      // for the actual answer (an empty completion). This is a simple FAQ
      // task with no multi-step reasoning need, so "minimal" is both
      // correct and cheaper.
      reasoning_effort: "minimal",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new OpenAiError(`OpenAI API responded with ${res.status}: ${body.slice(0, 500)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new OpenAiError("OpenAI API returned an empty completion.");
  }

  return content.trim();
}
