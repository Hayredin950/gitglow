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

  // Project-specific commit messages for more realism
  const projectMessages: Record<string, string[]> = {
    "node-rest-api": [
      "feat: implement JWT authentication middleware",
      "fix: resolve race condition in user creation",
      "feat: add rate limiting to API endpoints",
      "refactor: extract database queries to repository layer",
      "docs: update API documentation with new endpoints",
      "fix: handle MongoDB connection errors gracefully",
      "feat: add refresh token rotation",
      "style: format code with Prettier",
      "chore: upgrade Express to latest version",
      "test: add integration tests for auth flow",
      "feat: implement request validation middleware",
      "fix: resolve CORS issues in production",
      "refactor: separate routes into modules",
      "docs: add environment variable documentation",
      "feat: add pagination to user list endpoint",
      "fix: handle malformed JSON in request body",
      "chore: update dependencies for security",
      "feat: add logging with Winston",
      "refactor: improve error handling consistency",
      "fix: resolve memory leak in data processing",
    ],
    "python-utility": [
      "feat: add new CLI command for file processing",
      "fix: resolve argument parsing issue",
      "feat: implement progress bar for long operations",
      "refactor: extract configuration to separate module",
      "docs: update usage examples in README",
      "fix: handle file permission errors",
      "feat: add colored output support",
      "style: apply Black formatting",
      "chore: update Click dependency",
      "test: add unit tests for helper functions",
      "feat: implement retry logic for network requests",
      "fix: resolve encoding issues with special characters",
      "refactor: simplify command structure",
      "docs: add troubleshooting section",
      "feat: add configuration file support",
      "fix: handle interrupt signals gracefully",
      "chore: update requirements.txt",
      "feat: add verbose logging mode",
      "refactor: improve error messages",
      "fix: resolve path handling on Windows",
    ],
    "portfolio": [
      "feat: add project gallery with filtering",
      "fix: resolve responsive design issues on mobile",
      "feat: implement dark mode toggle",
      "refactor: extract components to separate files",
      "docs: update deployment instructions",
      "fix: handle missing project images",
      "feat: add contact form validation",
      "style: improve Tailwind class organization",
      "chore: upgrade Next.js to latest version",
      "test: add component tests with Jest",
      "feat: implement SEO optimization",
      "fix: resolve hydration errors",
      "refactor: create reusable UI components",
      "docs: add component documentation",
      "feat: add smooth scroll behavior",
      "fix: resolve accessibility issues",
      "chore: optimize bundle size",
      "feat: add animation with Framer Motion",
      "refactor: improve state management",
      "fix: resolve navigation bugs",
    ],
    "nlp-toolkit": [
      "feat: add sentiment analysis pipeline",
      "fix: resolve tokenization issues with emojis",
      "feat: implement named entity recognition",
      "refactor: optimize text processing performance",
      "docs: add API documentation for analyzer",
      "fix: handle empty input gracefully",
      "feat: add language detection support",
      "style: format code with Black",
      "chore: update NLTK data models",
      "test: add accuracy tests for classifiers",
      "feat: implement text summarization",
      "fix: resolve memory issues with large texts",
      "refactor: create modular pipeline stages",
      "docs: add usage examples for each feature",
      "feat: add custom tokenizer support",
      "fix: handle encoding issues",
      "chore: update scikit-learn dependency",
      "feat: add batch processing support",
      "refactor: improve error handling",
      "fix: resolve model loading issues",
    ],
    "cache-store": [
      "feat: implement LRU eviction policy",
      "fix: resolve thread safety issues",
      "feat: add cache statistics tracking",
      "refactor: optimize memory usage",
      "docs: add performance benchmarks",
      "fix: handle TTL expiration correctly",
      "feat: add cache persistence option",
      "style: improve code readability",
      "chore: add type hints",
      "test: add concurrency tests",
      "feat: implement cache warming",
      "fix: resolve key collision issues",
      "refactor: separate cache logic from storage",
      "docs: add configuration guide",
      "feat: add cache event listeners",
      "fix: handle memory pressure",
      "chore: optimize for Python 3.11",
      "feat: add distributed cache support",
      "refactor: improve cleanup logic",
      "fix: resolve serialization issues",
    ],
  };

  const defaultMessages = [
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
    
    // Use project-specific messages for more realism
    const projectMsgs = projectMessages[project.name] || defaultMessages;
    const msg = projectMsgs[Math.floor(Math.random() * projectMsgs.length)];

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
