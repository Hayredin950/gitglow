// This script tests the EXACT date logic from GitGlow!

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// EXACT generateCommitDates from src/lib/scripts/commit-generator.ts!
function generateCommitDates(baseDate: Date, count: number): Date[] {
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

// Helper to run commands
function runCommand(cmd: string, cwd: string) {
  console.log(`[TEST] Running: ${cmd} (in ${cwd})`);
  return execSync(cmd, { cwd, encoding: "utf8", stdio: "pipe" });
}

// Small test of the commit generation
console.log("=== TESTING generateCommitDates ===");
const testDates = generateCommitDates(new Date(), 10);
console.log("\nGenerated 10 dates (ISO and local time):");
testDates.forEach((d, i) => {
  console.log(`${i+1}. ISO: ${d.toISOString()}, Local: ${d.toLocaleString()}`);
});

console.log("\n=== TESTING DATE PERSISTENCE IN GIT ===");
const testOwner = "testuser";
const testRepo = "gitglow-test-dates-" + Date.now();
const tempDir = path.join(process.cwd(), testRepo);

try {
  // Initialize temp git repo
  console.log(`[TEST] Creating temp dir: ${tempDir}`);
  fs.mkdirSync(tempDir, { recursive: true });
  
  console.log("[TEST] Initializing git repo...");
  runCommand("git init", tempDir);
  runCommand(`git config user.name "${testOwner}"`, tempDir);
  runCommand(`git config user.email "${testOwner}@users.noreply.github.com"`, tempDir);
  
  console.log("\n[TEST] Creating 5 test commits with backdated dates:");
  for (let i = 0; i < 5; i++) {
    const commitDate = testDates[i];
    const fileName = `test-commit-${i}.md`;
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, `# Test Commit ${i+1}\nDate: ${commitDate.toISOString()}\n`);
    
    console.log(`[TEST] Committing ${fileName} with date: ${commitDate.toISOString()}`);
    runCommand(`git add ${fileName}`, tempDir);
    
    const commitEnv = {
      ...process.env,
      GIT_AUTHOR_DATE: commitDate.toISOString(),
      GIT_COMMITTER_DATE: commitDate.toISOString()
    };
    
    execSync(`git commit -m "Test commit ${i+1} (${commitDate.toLocaleDateString()})"`, {
      cwd: tempDir,
      env: commitEnv,
      encoding: "utf8",
      stdio: "pipe"
    });
  }
  
  console.log("\n=== VERIFYING GIT LOG DATES ===");
  console.log(runCommand("git log --format='%h | %an | %ai | %s'", tempDir));
  
} finally {
  // Cleanup
  console.log("\n[TEST] Cleaning up...");
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {
    console.warn("Failed to clean up temp dir:", e);
  }
}
