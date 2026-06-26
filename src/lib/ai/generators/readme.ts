import { defaultModel, gatewayModel, generateText, streamText } from "@/lib/ai/client";
import type { GitHubProfile } from "@/types/github";
import type { UserIntake } from "@/types/polish";
import { getAvatarURL } from "@/lib/avatars";

function buildStaticReadme(profile: GitHubProfile, intake: UserIntake): string {
  const { fullName, skills, goal, location, website } = intake;
  const tone = (intake as any).tone || "professional";
  const username = profile.login;
  const skillIcons = skills.slice(0, 8).map(s => s.toLowerCase().replace(/[^a-z0-9]/g, "")).join(",");
  const goalLine = goal === "job"
    ? "🚀 Open to new opportunities"
    : goal === "opensource"
    ? "🌍 Contributing to open source"
    : goal === "portfolio"
    ? "💼 Showcasing my work"
    : "📚 Always learning";
  const toneEmoji = tone === "hacker" ? "⚡" : tone === "casual" ? "👋" : "👨‍💻";
  
  return `<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=${encodeURIComponent(fullName)}&fontSize=50&fontAlignY=35&animation=twinkling)

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=${encodeURIComponent(goalLine)};${encodeURIComponent("Skills: " + skills.slice(0, 3).join(" • "))};${encodeURIComponent("Let's build something great!")})](https://git.io/typing-svg)

</div>

## ${toneEmoji} About Me

\`\`\`json
{
  "name": "${fullName}",
  "username": "${username}",
  "skills": ${JSON.stringify(skills.slice(0, 6))},
  "goal": "${goalLine}"${location ? `,\n  "location": "${location}"` : ""}${website ? `,\n  "website": "${website}"` : ""}
}
\`\`\`

## 🛠️ Tech Stack

[![Skills](https://skillicons.dev/icons?i=${skillIcons}&theme=dark)](https://skillicons.dev)

## 📊 GitHub Stats

<div align="center">

![Stats](https://github-readme-stats.vercel.app/api?username=${username}&theme=tokyonight&show_icons=true&hide_border=true&count_private=true)
![Streak](https://streak-stats.demolab.com?user=${username}&theme=tokyonight&hide_border=true)
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=tokyonight&layout=compact&hide_border=true)

</div>

## 📈 Activity

![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=tokyo-night&hide_border=true)

## 🏆 Trophies

![Trophies](https://github-profile-trophy.vercel.app/?username=${username}&theme=dracula&column=4&margin-w=8)

---

<div align="center">

[![Polished by GitGlow](https://img.shields.io/badge/Polished%20by-GitGlow%20✨-3B82F6?style=flat-square)](https://gitglow-pi.vercel.app)

</div>

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer)
`;
}

export async function generateProfileReadme(
  profile: GitHubProfile,
  intake: UserIntake
): Promise<string> {
  const { fullName, skills, goal } = intake;
  const tone = (intake as any).tone || "professional";
  const username = profile.login;

  const skillsStr = skills.join(", ");
  const toneDesc =
    tone === "professional"
      ? "clean, professional, impressive to Fortune 500 recruiters"
      : tone === "hacker"
      ? "hacker/cyberpunk aesthetic, cool and technical"
      : "friendly, approachable, casual dev community feel";

  const goalDesc =
    goal === "job"
      ? "landing a software engineering job at a top company"
      : goal === "opensource"
      ? "contributing to open source projects"
      : goal === "portfolio"
      ? "showcasing their portfolio and projects"
      : "learning and growing as a developer";

  const message = `Generate a beautiful GitHub profile README.md for ${fullName} (GitHub: ${username}).

Context:
- Skills: ${skillsStr}
- Goal: ${goalDesc}
- Tone: ${toneDesc}
- Location: ${profile.location ?? "not specified"}

Requirements (use ALL of these):
1. Animated wave header using capsule-render: https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=${encodeURIComponent(fullName)}&fontSize=50&fontAlignY=35&animation=twinkling
2. Typing SVG: https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&multiline=true&width=600&lines=...personalized+lines...
3. About Me section as a JSON code block (creative, fun)
4. Skill icons from: https://skillicons.dev/icons?i=COMMA_SEPARATED_SKILLS (use actual icon IDs)
5. GitHub Stats: https://github-readme-stats.vercel.app/api?username=${username}&theme=tokyonight&show_icons=true&hide_border=true&count_private=true
6. GitHub Streak: https://streak-stats.demolab.com?user=${username}&theme=tokyonight&hide_border=true
7. Top Languages: https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=tokyonight&layout=compact&hide_border=true
8. Activity graph: https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=tokyo-night&hide_border=true
9. Trophies: https://github-profile-trophy.vercel.app/?username=${username}&theme=dracula&column=4&margin-w=8
10. A "Powered by GitGlow ✨" badge at the bottom: [![Polished by GitGlow](https://img.shields.io/badge/Polished%20by-GitGlow%20✨-3B82F6?style=flat-square)](https://gitglow.dev)
11. Wave footer with capsule-render type=waving section=footer

Output ONLY the raw markdown, no explanation, no code fences around the whole thing.`;

  try {
    const response = await generateText({
      model: defaultModel,
      prompt: message,
      system: `You are an expert GitHub profile designer who creates stunning profile READMEs that get developers hired at top tech companies. You know every widget, badge, and trick to make a profile stand out. You generate complete, production-ready markdown that looks amazing on GitHub. All image URLs must be real, working URLs using the services listed.`,
    });
    return response.text;
  } catch (err) {
    console.error("[v0] README generation error:", err);
    throw new Error("Failed to generate README");
  }
}

export async function* streamProfileReadme(
  profile: GitHubProfile,
  intake: UserIntake
): AsyncGenerator<string> {
  const { fullName, skills, goal } = intake;
  const tone = (intake as any).tone || "professional";
  const username = profile.login;
  const skillsStr = skills.join(", ");

  if (!username || !fullName) {
    throw new Error("Invalid profile data: missing username or fullName");
  }

  const README_SYSTEM = `You are an expert GitHub profile designer. Generate stunning profile READMEs that get developers hired. Output ONLY raw markdown, no explanations.`;
  const README_PROMPT = `Generate a beautiful GitHub profile README for ${fullName} (username: ${username}). Skills: ${skillsStr}. Goal: ${goal}. Tone: ${tone}. Include: wave header (capsule-render), typing SVG, about-me JSON block, skill icons (skillicons.dev), GitHub stats, streak, top languages, activity graph, trophies, GitGlow badge at bottom, wave footer. Use tokyonight theme throughout. Output raw markdown only.`;

  // Try primary model first; fall back to gateway, then static template
  let streamResult;
  try {
    streamResult = await streamText({ model: defaultModel, system: README_SYSTEM, prompt: README_PROMPT });
  } catch (primaryErr) {
    console.error("[v0] README primary error, trying gateway:", primaryErr);
    try {
      streamResult = await streamText({ model: gatewayModel, system: README_SYSTEM, prompt: README_PROMPT });
    } catch (gatewayErr) {
      console.error("[v0] README gateway error, using static template:", gatewayErr);
      yield buildStaticReadme(profile, intake);
      return;
    }
  }

  let contentGenerated = false;
  for await (const chunk of streamResult.textStream) {
    contentGenerated = true;
    yield chunk;
  }

  if (!contentGenerated) {
    yield buildStaticReadme(profile, intake);
  }
}
