import type { GeneratedProject, CommitPlan } from "@/types/polish";

export type { CommitPlan };

export function generateCommitSchedule(
  projects: GeneratedProject[],
  targetCount = 200
): CommitPlan[] {
  const plans: CommitPlan[] = [];
  const now = new Date();
  const yearAgo = new Date(now);
  yearAgo.setFullYear(now.getFullYear() - 1);

  const totalDays = Math.floor((now.getTime() - yearAgo.getTime()) / 86400000);

  // Pick random days with realistic distribution (more on weekdays)
  const activeDays = pickActiveDays(totalDays, targetCount);

  const messages = [
    "fix: resolve edge case in data processing",
    "feat: add input validation",
    "refactor: simplify helper functions",
    "docs: update README with examples",
    "style: improve code formatting",
    "fix: handle null values correctly",
    "feat: improve error messages",
    "chore: update dependencies",
    "docs: add JSDoc comments",
    "fix: correct logic bug",
    "feat: add configuration options",
    "refactor: extract utility functions",
    "test: add edge case coverage",
    "fix: improve performance",
    "feat: add logging support",
    "docs: update installation guide",
    "fix: handle empty input gracefully",
    "refactor: clean up unused code",
    "feat: add new feature flag",
    "fix: resolve async race condition",
  ];

  for (let i = 0; i < activeDays.length; i++) {
    const daysBack = activeDays[i];
    const date = new Date(now.getTime() - daysBack * 86400000);
    const hour = 9 + Math.floor(Math.random() * 10); // 9am-7pm
    const min = Math.floor(Math.random() * 60);
    date.setHours(hour, min, 0, 0);

    const project = projects[i % projects.length];
    const fileKeys = Object.keys(project.files);
    const fileKey = fileKeys[Math.floor(Math.random() * fileKeys.length)] ?? "CHANGELOG.md";
    const msg = messages[Math.floor(Math.random() * messages.length)];

    // For CHANGELOG-style commits, append a dev log entry
    const content =
      fileKey === "CHANGELOG.md"
        ? appendChangelog(project.files[fileKey] ?? "", date, msg)
        : project.files[fileKey] ?? `# ${project.name}\n\nUpdated on ${date.toISOString().slice(0, 10)}\n`;

    plans.push({
      repo: project.name,
      date: date.toISOString(),
      path: fileKey,
      content,
      message: msg,
    });
  }

  return plans;
}

function pickActiveDays(totalDays: number, target: number): number[] {
  const days = new Set<number>();
  let attempts = 0;

  while (days.size < target && attempts < target * 10) {
    attempts++;
    const day = Math.floor(Math.random() * totalDays);
    const date = new Date(Date.now() - day * 86400000);
    const dow = date.getDay(); // 0=Sun, 6=Sat

    // Weekdays 3x more likely
    if (dow === 0 || dow === 6) {
      if (Math.random() > 0.3) continue;
    }
    days.add(day);
  }

  return Array.from(days).sort((a, b) => b - a); // newest first
}

function appendChangelog(existing: string, date: Date, note: string): string {
  const dateStr = date.toISOString().slice(0, 10);
  const entry = `\n## [${dateStr}]\n- ${note}\n`;
  if (!existing.trim()) {
    return `# Changelog\n\nAll notable changes to this project will be documented here.\n${entry}`;
  }
  return existing + entry;
}
