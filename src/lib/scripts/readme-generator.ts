/**
 * Script-based README Generator
 * Creates premium styled READMEs without AI integration
 */

import type { UserIntake } from "@/types/polish";
import type { GitHubProfile } from "@/types/github";
import { getAvatarURL } from "@/lib/avatars";

export function generatePremiumReadme(
  profile: GitHubProfile,
  intake: UserIntake
): string {
  const {
    fullName,
    skills,
    goal,
    location,
    website,
    avatar,
    theme,
    currentRole,
    company,
    linkedin,
    twitter,
    targetRole
  } = intake;

  const username = profile.login;
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarURL = getAvatarURL(avatar, initials);

  // Theme configurations
  const themes = {
    "tokyo-night": {
      bg: "0a0a0a",
      text: "ffffff",
      accent: "7aa2f7",
      card: "1a1b26"
    },
    "dracula": {
      bg: "282a36",
      text: "f8f8f2",
      accent: "bd93f9",
      card: "44475a"
    },
    "gradient": {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      text: "ffffff",
      accent: "ffffff",
      card: "rgba(255,255,255,0.1)"
    },
    "minimal": {
      bg: "ffffff",
      text: "333333",
      accent: "3B82F6",
      card: "f8f9fa"
    }
  };

  const currentTheme = themes[theme] || themes["tokyo-night"];

  // Goal-based headers
  const goalHeaders = {
    job: "🚀 Full Stack Developer | Open to Opportunities",
    opensource: "🌍 Open Source Enthusiast | Building Together",
    portfolio: "💼 Creative Developer | Showcasing Projects",
    learning: "📚 Lifelong Learner | Growing Every Day"
  };

  const skillIcons = skills.slice(0, 8).map(s => 
    s.toLowerCase().replace(/[^a-z0-9]/g, "")
  ).join(",");

  // Social links section
  const socialLinks = [];
  if (linkedin) socialLinks.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](${linkedin})`);
  if (twitter) socialLinks.push(`[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2)](${twitter})`);
  if (website) socialLinks.push(`[![Website](https://img.shields.io/badge/Website-Visit-green)](${website})`);

  return `
<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=250&section=header&text=${encodeURIComponent(fullName)}&fontSize=60&fontAlignY=40&animation=twinkling)

<img src="${avatarURL}" alt="Profile Avatar" width="140" height="140" style="border-radius: 50%; border: 5px solid ${currentTheme.accent}; margin: 25px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&duration=3500&pause=1200&color=${currentTheme.accent}&center=true&vCenter=true&width=700&lines=${encodeURIComponent(goalHeaders[goal])};${encodeURIComponent(currentRole || "Software Developer")}${company ? `;@${company}` : ""};${encodeURIComponent("Let's build something amazing!")})](https://git.io/typing-svg)

${socialLinks.length > 0 ? `
<div align="center">

${socialLinks.join("  ")}

</div>
` : ""}

</div>

## 👨‍💻 About Me

\`\`\`json
{
  "name": "${fullName}",
  "username": "${username}",
  "role": "${currentRole || "Software Developer"}",
  "location": "${location || "Global"}",
  "skills": ${JSON.stringify(skills.slice(0, 6))},
  "goal": "${goal}",
  "target": "${targetRole || "Excellence"}"${website ? `,\n  "website": "${website}"` : ""}${linkedin ? `,\n  "linkedin": "${linkedin}"` : ""}
}
\`\`\`

## 🛠️ Tech Stack

[![Skills](https://skillicons.dev/icons?i=${skillIcons}&theme=dark&perline=4)](https://skillicons.dev)

## 📊 GitHub Stats

<div align="center">

![Stats](https://github-readme-stats.vercel.app/api?username=${username}&theme=${theme === "dracula" ? "dracula" : "tokyonight"}&show_icons=true&hide_border=true&count_private=true&include_all_commits=true)
![Streak](https://streak-stats.demolab.com?user=${username}&theme=${theme === "dracula" ? "dracula" : "tokyonight"}&hide_border=true)
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=${theme === "dracula" ? "dracula" : "tokyonight"}&layout=compact&hide_border=true)

</div>

## 📈 Activity Graph

![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${theme === "dracula" ? "dracula" : "tokyo-night"}&hide_border=true&area=true)

## 🏆 Achievements

![Trophies](https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme === "dracula" ? "dracula" : "tokyonight"}&column=4&margin-w=8&no-frame=true)

## 🎯 Current Focus

${goal === "job" ? `
- 🔍 Actively seeking ${targetRole || "software engineering"} opportunities
- 📚 Continuously learning new technologies
- 💡 Building innovative projects
- 🤝 Open to collaborations
` : goal === "opensource" ? `
- 🌍 Contributing to open source projects
- 🐛 Fixing bugs and improving documentation
- 💡 Sharing knowledge with the community
- 🤝 Mentoring other developers
` : goal === "portfolio" ? `
- 💼 Showcasing creative projects
- 🎨 Designing beautiful user experiences
- ⚡ Building performant applications
- 🚀 Launching innovative solutions
` : `
- 📚 Learning new technologies
- 🛠️ Building side projects
- 🤝 Networking with developers
- 💡 Exploring new ideas
`}

## 📫 Let's Connect

${company ? `**Currently at:** ${company}  \n` : ""}
${location ? `**Based in:** ${location}  \n` : ""}
${targetRole ? `**Interested in:** ${targetRole} roles  \n` : ""}

---

<div align="center">

[![Polished by GitGlow](https://img.shields.io/badge/Polished%20by-GitGlow%20✨-3B82F6?style=flat-square)](https://gitglow-pi.vercel.app)
${socialLinks.length > 0 ? socialLinks[0] : ""}

**✨ Thank you for visiting! Feel free to reach out.**

</div>

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer)
`;
}