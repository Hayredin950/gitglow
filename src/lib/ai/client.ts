import { createAnthropic } from "@ai-sdk/anthropic";

// Using Vercel AI Gateway via Anthropic provider
// This provides better reliability, caching, and fallback support
// The AI Gateway automatically handles:
// - Request routing and optimization
// - Rate limiting and retries
// - Model availability and fallbacks
// - Usage analytics and monitoring

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const defaultModel = anthropic("claude-3-5-sonnet");
