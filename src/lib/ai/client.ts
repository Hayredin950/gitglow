// Using Vercel AI Gateway for all model requests
// This provides better reliability, caching, and fallback support
// The AI Gateway automatically handles:
// - Request routing and optimization
// - Rate limiting and retries
// - Model availability and fallbacks
// - Usage analytics and monitoring

export const defaultModel = "anthropic/claude-3-5-sonnet";

// Export a function for generating text that uses the gateway
export async function generateText(prompt: string, system: string = "") {
  const { generateText } = await import("ai");
  
  return generateText({
    model: defaultModel,
    system,
    prompt,
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}
