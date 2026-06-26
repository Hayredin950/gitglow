import { generateText, streamText } from "ai";
import { gateway } from "@ai-sdk/gateway";

export const defaultModel = gateway("anthropic/claude-3-5-sonnet");
export const gatewayModel = defaultModel;

export { generateText, streamText };
