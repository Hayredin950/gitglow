import { defaultModel, gatewayModel, generateText } from "@/lib/ai/client";
import type { UserIntake } from "@/types/polish";

const BIO_SYSTEM = `You are an expert at writing premium, recruiter-optimized GitHub bios that impress hiring managers at top tech companies. Max 160 characters. No quotes. Use emojis strategically. Focus on: specific tech stack, current impact, and career trajectory. Make it memorable and professional.`;

export async function generateBio(intake: UserIntake): Promise<string> {
  const { fullName, skills, goal, location } = intake;
  const tone = (intake as any).tone || "professional";
  
  const goalMapping: Record<string, string> = {
    job: "Actively seeking software engineering roles",
    opensource: "Open source contributor building impactful tools",
    portfolio: "Full-stack developer shipping production code",
    learning: "Software engineer passionate about clean code"
  };
  
  const goalText = goalMapping[goal] || goalMapping.learning;
  const topSkills = skills.slice(0, 4).join(" • ");
  const locationText = location ? ` 📍 ${location}` : "";
  
  const prompt = `Write a premium GitHub bio for ${fullName}. 
Top skills: ${topSkills}
Career focus: ${goalText}
Location: ${location || "Remote"}
Tone: ${tone}

Requirements:
- Lead with strongest technical skill
- Include current impact or what you're building
- Add career trajectory (seeking, contributing, etc.)
- Max 160 characters
- Make it impressive to FAANG recruiters
- Output ONLY the bio text, no quotes`;

  try {
    const response = await generateText({ model: defaultModel, system: BIO_SYSTEM, prompt });
    return response.text.trim().slice(0, 160);
  } catch (primaryErr) {
    console.error("[v0] Bio primary error, trying gateway:", primaryErr);
    try {
      const response = await generateText({ model: gatewayModel, system: BIO_SYSTEM, prompt });
      return response.text.trim().slice(0, 160);
    } catch (err) {
      console.error("[v0] Bio gateway error:", err);
      const goalText = goal === "job" ? "Seeking SWE roles" : goal === "opensource" ? "Open source maintainer" : goal === "portfolio" ? "Shipping production apps" : "Building scalable solutions";
      const loc = location ? ` 📍 ${location}` : "";
      const topSkill = skills[0] || "Full-stack";
      return `${topSkill} developer • ${goalText}${loc}`.slice(0, 160);
    }
  }
}
