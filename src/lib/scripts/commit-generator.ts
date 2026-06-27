/**
 * Script-based Commit Generator
 * Creates realistic commits without AI integration
 */

export interface CommitMessage {
  message: string;
  type: "feat" | "fix" | "docs" | "style" | "refactor" | "test" | "chore";
}

const commitTemplates: Record<string, CommitMessage[]> = {
  "node-rest-api": [
    { message: "feat: add JWT authentication middleware", type: "feat" },
    { message: "feat: implement user registration endpoint", type: "feat" },
    { message: "feat: add password hashing with bcrypt", type: "feat" },
    { message: "fix: resolve CORS issues in production", type: "fix" },
    { message: "docs: update API documentation", type: "docs" },
    { message: "feat: add rate limiting middleware", type: "feat" },
    { message: "refactor: improve error handling", type: "refactor" },
    { message: "test: add unit tests for auth module", type: "test" },
    { message: "feat: implement refresh token logic", type: "feat" },
    { message: "fix: handle edge cases in user input", type: "fix" },
    { message: "chore: update dependencies", type: "chore" },
    { message: "feat: add request validation", type: "feat" },
    { message: "docs: add deployment guide", type: "docs" },
    { message: "refactor: optimize database queries", type: "refactor" },
    { message: "feat: add user profile management", type: "feat" },
  ],
  "python-utility": [
    { message: "feat: add CLI argument parsing", type: "feat" },
    { message: "feat: implement file processing logic", type: "feat" },
    { message: "fix: handle file encoding issues", type: "fix" },
    { message: "docs: update usage examples", type: "docs" },
    { message: "feat: add logging configuration", type: "feat" },
    { message: "refactor: improve error messages", type: "refactor" },
    { message: "test: add integration tests", type: "test" },
    { message: "feat: add progress indicators", type: "feat" },
    { message: "fix: resolve memory leak", type: "fix" },
    { message: "chore: upgrade to Python 3.11", type: "chore" },
    { message: "feat: add configuration file support", type: "feat" },
    { message: "docs: add contributing guidelines", type: "docs" },
  ],
  "portfolio": [
    { message: "feat: add project showcase section", type: "feat" },
    { message: "feat: implement dark mode toggle", type: "feat" },
    { message: "fix: responsive design issues", type: "fix" },
    { message: "style: improve typography", type: "style" },
    { message: "feat: add contact form", type: "feat" },
    { message: "refactor: optimize images", type: "refactor" },
    { message: "test: add component tests", type: "test" },
    { message: "feat: add skills section", type: "feat" },
    { message: "docs: update README", type: "docs" },
    { message: "fix: navigation menu bug", type: "fix" },
    { message: "feat: add social media links", type: "feat" },
    { message: "chore: upgrade Next.js", type: "chore" },
    { message: "style: improve color scheme", type: "style" },
    { message: "feat: add blog section", type: "feat" },
    { message: "refactor: improve SEO", type: "refactor" },
  ],
  "nlp-toolkit": [
    { message: "feat: implement sentiment analysis", type: "feat" },
    { message: "feat: add text tokenization", type: "feat" },
    { message: "fix: handle edge cases in NLP", type: "fix" },
    { message: "docs: add API documentation", type: "docs" },
    { message: "feat: add named entity recognition", type: "feat" },
    { message: "refactor: improve model performance", type: "refactor" },
    { message: "test: add accuracy tests", type: "test" },
    { message: "feat: add language detection", type: "feat" },
    { message: "fix: memory optimization", type: "fix" },
    { message: "chore: update NLTK version", type: "chore" },
    { message: "feat: add text classification", type: "feat" },
    { message: "docs: add usage examples", type: "docs" },
    { message: "refactor: optimize preprocessing", type: "refactor" },
  ],
  "cache-store": [
    { message: "feat: implement TTL support", type: "feat" },
    { message: "feat: add LRU eviction policy", type: "feat" },
    { message: "fix: thread safety issues", type: "fix" },
    { message: "docs: add performance benchmarks", type: "docs" },
    { message: "feat: add cache statistics", type: "feat" },
    { message: "refactor: improve memory usage", type: "refactor" },
    { message: "test: add concurrency tests", type: "test" },
    { message: "feat: add persistent storage option", type: "feat" },
    { message: "fix: resolve cache expiration bug", type: "fix" },
    { message: "chore: add type hints", type: "chore" },
    { message: "feat: add cache warming", type: "feat" },
    { message: "docs: add architecture diagram", type: "docs" },
  ],
  "delivery-api": [
    { message: "feat: implement delivery tracking", type: "feat" },
    { message: "feat: add route optimization", type: "feat" },
    { message: "fix: handle location updates", type: "fix" },
    { message: "docs: add API endpoints", type: "docs" },
    { message: "feat: add real-time updates", type: "feat" },
    { message: "refactor: improve database schema", type: "refactor" },
    { message: "test: add integration tests", type: "test" },
    { message: "feat: add delivery status workflow", type: "feat" },
    { message: "fix: resolve concurrency issues", type: "fix" },
    { message: "chore: add monitoring", type: "chore" },
    { message: "feat: add delivery analytics", type: "feat" },
    { message: "docs: add deployment guide", type: "docs" },
  ],
  "calorie-tracker": [
    { message: "feat: add meal logging", type: "feat" },
    { message: "feat: implement calorie calculation", type: "feat" },
    { message: "fix: chart rendering issues", type: "fix" },
    { message: "style: improve UI design", type: "style" },
    { message: "feat: add nutrition database", type: "feat" },
    { message: "refactor: optimize state management", type: "refactor" },
    { message: "test: add component tests", type: "test" },
    { message: "feat: add goal tracking", type: "feat" },
    { message: "fix: local storage persistence", type: "fix" },
    { message: "chore: upgrade dependencies", type: "chore" },
    { message: "feat: add weekly reports", type: "feat" },
    { message: "docs: add user guide", type: "docs" },
  ],
  "react-dashboard": [
    { message: "feat: add analytics dashboard", type: "feat" },
    { message: "feat: implement data visualization", type: "feat" },
    { message: "fix: responsive layout issues", type: "fix" },
    { message: "style: improve color scheme", type: "style" },
    { message: "feat: add dark mode", type: "feat" },
    { message: "refactor: optimize chart performance", type: "refactor" },
    { message: "test: add unit tests", type: "test" },
    { message: "feat: add export functionality", type: "feat" },
    { message: "fix: data loading issues", type: "fix" },
    { message: "chore: add linter", type: "chore" },
    { message: "feat: add custom widgets", type: "feat" },
    { message: "docs: add component docs", type: "docs" },
  ],
  "devops-pipeline": [
    { message: "feat: add CI/CD pipeline", type: "feat" },
    { message: "feat: implement Docker containerization", type: "feat" },
    { message: "fix: deployment issues", type: "fix" },
    { message: "docs: add infrastructure docs", type: "docs" },
    { message: "feat: add Kubernetes deployment", type: "feat" },
    { message: "refactor: optimize build process", type: "refactor" },
    { message: "test: add pipeline tests", type: "test" },
    { message: "feat: add monitoring", type: "feat" },
    { message: "fix: environment configuration", type: "fix" },
    { message: "chore: add security scanning", type: "chore" },
    { message: "feat: add auto-scaling", type: "feat" },
    { message: "docs: add runbook", type: "docs" },
  ],
  "mobile-app": [
    { message: "feat: add mobile navigation", type: "feat" },
    { message: "feat: implement offline support", type: "feat" },
    { message: "fix: iOS compatibility issues", type: "fix" },
    { message: "style: improve mobile UI", type: "style" },
    { message: "feat: add push notifications", type: "feat" },
    { message: "refactor: optimize app performance", type: "refactor" },
    { message: "test: add E2E tests", type: "test" },
    { message: "feat: add biometric auth", type: "feat" },
    { message: "fix: Android permissions", type: "fix" },
    { message: "chore: upgrade React Native", type: "chore" },
    { message: "feat: add deep linking", type: "feat" },
    { message: "docs: add mobile guide", type: "docs" },
  ],
};

export function generateCommits(templateName: string, count: number = 20): CommitMessage[] {
  const templates = commitTemplates[templateName] || commitTemplates["node-rest-api"];
  const commits: CommitMessage[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    commits.push({
      ...template,
      message: `${template.message} (#${i + 1})`
    });
  }
  
  return commits;
}

export function generateCommitPlan(templateName: string, count: number = 20, username?: string, email?: string): Array<{ repo: string; date: string; path: string; content: string; message: string; author?: { name: string; email: string } }> {
  const commits = generateCommits(templateName, count);
  const dates = generateCommitDates(new Date(), count);
  const repoName = `${templateName}-1`;
  
  return commits.map((commit, index) => {
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
      repo: repoName,
      date: dates[index].toISOString(),
      path: `gitglow_contributions/commit_${index}_${uniqueId}.md`,
      content: `# Commit ${index + 1}\n\nGenerated contribution commit for ${templateName}.`,
      message: commit.message,
      author: username && email ? { name: username, email } : undefined,
    };
  });
}

export function generateCommitDates(baseDate: Date, count: number): Date[] {
  const dates: Date[] = [];
  const now = baseDate;
  const usedDateKeys = new Map<string, number>(); // Track date -> commit count

  // Calculate distribution across 2-3 years (730-1095 days) - more realistic
  const totalDays = Math.floor(Math.random() * 365) + 730; // Between 2 and 3 years
  console.log(`[v0] Generating ${count} commits over ${totalDays} days (${Math.round(totalDays/365)} years)`);
  
  // Ensure we spread commits across different months and years
  const targetDays = Math.max(Math.floor(count / 2), Math.min(count, 200)); // More days for longer range
  
  // Generate days with better distribution
  const selectedDays = new Set<number>();
  
  // First, ensure we have commits in different months and years
  const months = new Set<number>();
  const years = new Set<number>();
  let attempts = 0;
  
  while (selectedDays.size < targetDays && attempts < 20000) {
    const daysAgo = Math.floor(Math.random() * totalDays);
    const candidateDate = new Date(now);
    candidateDate.setDate(candidateDate.getDate() - daysAgo);
    
    // Skip weekends sometimes, but not always
    const dayOfWeek = candidateDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (Math.random() > 0.3) { // 30% chance for weekend commits
        attempts++;
        continue;
      }
    }
    
    selectedDays.add(daysAgo);
    months.add(candidateDate.getMonth());
    years.add(candidateDate.getFullYear());
    attempts++;
  }
  
  // If we don't have enough months or years, add some more
  while (months.size < 12 && selectedDays.size < targetDays) {
    const randomMonth = Math.floor(Math.random() * 12);
    const daysAgo = Math.floor(Math.random() * 30) + (randomMonth * 30) + (Math.floor(Math.random() * 2) * 365); // Add random year
    if (daysAgo < totalDays) {
      selectedDays.add(daysAgo);
      months.add(randomMonth);
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      years.add(d.getFullYear());
    }
  }
  while (years.size < 2 && selectedDays.size < targetDays) {
    const daysAgo = Math.floor(Math.random() * 365) + 365; // At least 1 year ago
    if (daysAgo < totalDays) {
      selectedDays.add(daysAgo);
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      years.add(d.getFullYear());
    }
  }
  
  // Convert days ago to actual dates
  const sortedDays = Array.from(selectedDays).sort((a, b) => a - b);
  
  sortedDays.forEach(daysAgo => {
    if (dates.length >= count) return;
    
    const candidateDate = new Date(now);
    candidateDate.setDate(candidateDate.getDate() - daysAgo);
    
    // Check if we already have commits on this day
    const dateKey = candidateDate.toISOString().split('T')[0];
    const existingCommits = usedDateKeys.get(dateKey) || 0;
    
    if (existingCommits >= 3) { // Max 3 commits per day
      return;
    }
    
    // Random time during work hours (8 AM - 6 PM) to look realistic
    const hours = Math.floor(Math.random() * 10) + 8;
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    candidateDate.setHours(hours, minutes, seconds);
    
    dates.push(candidateDate);
    usedDateKeys.set(dateKey, existingCommits + 1);
  });
  
  // If we still need more commits, add extra commits to existing days
  while (dates.length < count) {
    const randomIndex = Math.floor(Math.random() * dates.length);
    const existingDate = dates[randomIndex];
    
    const newDate = new Date(existingDate);
    // Add a small time offset (1-60 minutes)
    newDate.setMinutes(newDate.getMinutes() + Math.floor(Math.random() * 60) + 1);
    
    dates.push(newDate);
  }

  console.log(`[v0] Generated dates from ${dates[0].toISOString()} to ${dates[dates.length-1].toISOString()}`);
  // Sort the dates in chronological order
  return dates.sort((a, b) => a.getTime() - b.getTime());
}