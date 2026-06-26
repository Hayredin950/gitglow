// Using Vercel AI Gateway for all model requests
// The Vercel AI Gateway provides:
// - Request routing and optimization through edge network
// - Automatic rate limiting and retries
// - Model availability and fallbacks
// - Usage analytics and monitoring
// - Cost optimization across providers

import { generateText, streamText } from "ai";

// The Vercel AI Gateway recognizes model strings in format: "provider/model-name"
// Example: "anthropic/claude-3-5-sonnet"
export const defaultModel = "anthropic/claude-3-5-sonnet";

// Optional: Export direct generation functions if needed
export { generateText, streamText };
