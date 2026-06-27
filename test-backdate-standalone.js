#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Helper function to run shell commands
function runCommand(cmd, cwd) {
  console.log("Running command:", cmd);
  return execSync(cmd, { cwd, encoding: "utf8", stdio: "inherit" });
}

// Generate dates like GitGlow does
function generateCommitDates(baseDate, count) {
  const dates = [];
  const now = baseDate;
  
  const totalDays = Math.floor(Math.random() * 365) + 730; // 2-3 years total
  console.log(`Generating ${count} commits over ${totalDays} days (${Math.round(totalDays/365)} years)`);
  
  const targetDays = Math.max(Math.floor(count / 2), Math.min(count, 200));
  const selectedDays = new Set();
  
  // First pass: get some days spread out
  let attempts = 0;
  while (selectedDays.size < targetDays && attempts < 20000) {
    const daysAgo = Math.floor(Math.random() * totalDays);
    const candidateDate = new Date(now);
    candidateDate.setDate(candidateDate.getDate() - daysAgo);
    
    // Skip some weekends for realism
    const dayOfWeek = candidateDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (Math.random() > 0.3) {
        attempts++;
        continue;
      }
    }
    selectedDays.add(daysAgo);
    attempts++;
  }
  
  // Convert to date objects
  const sortedDays = Array.from(selectedDays).sort((a,b) => a - b);
  const usedDateKeys = new Map();
  
  sortedDays.forEach(daysAgo => {
    if (dates.length >= count) return;
    const candidateDate = new Date(now);
    candidateDate.setDate(candidateDate.getDate() - daysAgo);
    
    const dateKey = candidateDate.toISOString().split('T')[0];
    const existing = usedDateKeys.get(dateKey) || 0;
    if (existing >=3) return;
    
    // Random work hour time
    const hours = Math.floor(Math.random()*10) +8;
    candidateDate.setHours(hours, Math.floor(Math.random()*60), Math.floor(Math.random()*60));
    dates.push(candidateDate);
    usedDateKeys.set(dateKey, existing +1);
  });
  
  // Fill in extras
  while (dates.length < count) {
    const randomIndex = Math.floor(Math.random() * dates.length);
    const newDate = new Date(dates[randomIndex]);
    newDate.setMinutes(newDate.getMinutes() + Math.floor(Math.random()*60)+1);
    dates.push(newDate);
  }
  
  return dates.sort((a,b) => a.getTime() - b.getTime());
}

// Push commits using local Git (exact same as GitGlow)
async function pushTestCommits() {
  // 1. Make sure you're logged in with `gh auth login`
  try {
    console.log("Checking GitHub auth...");
    runCommand("gh auth status", process.cwd());
  } catch (e) {
    console.error("❌ Not logged in to GitHub! Run `gh auth login` first.");
    return;
  }
  
  // 2. Get your username
  const usernameRaw = execSync("gh api user --jq .login", { cwd: process.cwd(), encoding: "utf8" });
  const username = usernameRaw.trim();
  console.log("\n✅ Logged in as:", username);
  
  // 3. Create a test repo
  const repoName = "gitglow-backdate-test-" + Date.now();
  console.log("\nCreating test repo:", repoName);
  runCommand(`gh repo create ${repoName} --private --description "GitGlow Test Backdated Commits"`, process.cwd());
  
  // Wait a sec for repo to be ready
  await new Promise(r => setTimeout(r, 3000));
  
  // 4. Generate test commits (20 commits)
  const dates = generateCommitDates(new Date(), 20);
  console.log("\nGenerated test dates:");
  dates.forEach((d, i) => console.log(`${i+1}.`, d.toLocaleString()));
  
  const tempDir = path.join(process.cwd(), "gitglow-tmp-test-" + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });
  console.log("\nUsing temp directory:", tempDir);
  
  try {
    // Initialize repo
    runCommand("git init", tempDir);
    runCommand(`git config user.name "${username}"`, tempDir);
    runCommand(`git config user.email "${username}@users.noreply.github.com"`, tempDir);
    
    // Make each commit
    for (let i=0; i < dates.length; i++) {
      const commitDate = dates[i];
      const filePath = path.join(tempDir, `gitglow-test-${i}.md`);
      fs.writeFileSync(filePath, `# Test Commit ${i+1}\nDate: ${commitDate.toISOString()}\nThis is a test commit for GitGlow!\n`);
      
      runCommand(`git add "gitglow-test-${i}.md"`, tempDir);
      
      const commitEnv = {
        ...process.env,
        GIT_AUTHOR_DATE: commitDate.toISOString(),
        GIT_COMMITTER_DATE: commitDate.toISOString()
      };
      
      execSync(`git commit -m "feat: test commit ${i+1}"`, {
        cwd: tempDir,
        env: commitEnv,
        stdio: "inherit"
      });
    }
    
    // Push it up!
    console.log("\nPushing to GitHub...");
    const remoteUrl = `https://github.com/${username}/${repoName}.git`;
    runCommand(`git remote add origin "${remoteUrl}"`, tempDir);
    runCommand("git branch -M main", tempDir);
    runCommand("git push -u origin main --force", tempDir);
    
    console.log("\n✅ Done! Check your commits here:");
    console.log(`https://github.com/${username}/${repoName}`);
    console.log("\nAnd your contribution graph in a few minutes!");
    
  } finally {
    // Cleanup temp dir
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.warn("\nFailed to clean up temp dir:", tempDir);
    }
  }
}

pushTestCommits().catch(console.error);
