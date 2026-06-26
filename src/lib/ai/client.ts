import { generateText, streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { gateway } from "@ai-sdk/gateway";

// Primary provider: Anthropic direct (reads ANTHROPIC_API_KEY + ANTHROPIC_BASE_URL from env)
const anthropic = createAnthropic();
export const defaultModel = anthropic("claude-3-5-sonnet-20241022");

// Fallback via Vercel AI Gateway (reads AI_GATEWAY_API_KEY from env)
export const gatewayModel = gateway("anthropic/claude-3-5-sonnet");

export { generateText, streamText };
