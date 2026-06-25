import { anthropic } from "@/lib/ai/client";
import type { UserIntake } from "@/types/polish";

export async function generateBio(intake: UserIntake): Promise<string> {
  const { fullName, skills, goal, tone, location } = intake;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 256,
    system: `You are an expert at writing punchy, recruiter-optimized GitHub bios. Max 160 characters. No quotes. Include emojis sparingly. Focus on what they build and their goal.`,
    messages: [
      {
        role: "user",
        content: `Write a GitHub bio for ${fullName}. Skills: ${skills.slice(0, 4).join(", ")}. Goal: ${goal}. Tone: ${tone}. Location: ${location ?? "not specified"}. Max 160 chars. Output only the bio text.`,
      },
    ],
  });

  const block = response.content[0];
  const bio = block.type === "text" ? block.text.trim() : "";
  return bio.slice(0, 160);
}
