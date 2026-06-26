import { defaultModel, generateText } from "@/lib/ai/client";
import type { UserIntake } from "@/types/polish";

export async function generateBio(intake: UserIntake): Promise<string> {
  const { fullName, skills, goal, tone, location } = intake;

  try {
    const response = await generateText({
      model: defaultModel,
      system: `You are an expert at writing punchy, recruiter-optimized GitHub bios. Max 160 characters. No quotes. Include emojis sparingly. Focus on what they build and their goal.`,
      prompt: `Write a GitHub bio for ${fullName}. Skills: ${skills.slice(0, 4).join(", ")}. Goal: ${goal}. Tone: ${tone}. Location: ${location ?? "not specified"}. Max 160 chars. Output only the bio text.`,
    });

    return response.text.trim().slice(0, 160);
  } catch (err) {
    console.error("[v0] Bio generation error:", err);
    // Fallback bio
    return `${fullName} • ${skills.slice(0, 2).join(" • ")} • ${goal}`;
  }
}
