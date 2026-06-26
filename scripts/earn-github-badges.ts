#!/usr/bin/env node
/**
 * GitHub Achievement Badge Automation Script
 * 
 * This script helps earn GitHub achievement badges by:
 * - YOLO: Merge a PR without review
 * - Pull Shark: Create multiple PRs
 * - Quickdraw: Merge a PR quickly after creation
 * 
 * Usage:
 *   npx tsx scripts/earn-github-badges.ts --token YOUR_GITHUB_TOKEN --username YOUR_USERNAME
 */

import { execSync } from 'child_process';
import { setTimeout } from 'timers/promises';

interface BadgeConfig {
  name: string;
  description: string;
  enabled: boolean;
}

const BADGES: BadgeConfig[] = [
  {
    name: 'YOLO',
    description: 'Merge a PR without review',
    enabled: true
  },
  {
    name: 'Pull Shark',
    description: 'Create multiple PRs (need 5+ for badge)',
    enabled: true
  },
  {
    name: 'Quickdraw',
    description: 'Merge a PR quickly after creation',
    enabled: true
  }
];

function exec(command: string, cwd?: string, env?: Record<string, string>): string {
  try {
    return execSync(command, { 
      cwd, 
      encoding: 'utf-8',
      stdio: 'pipe',
      env: env ? { ...process.env, ...env } : undefined
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}`);
  }
}

async function createAndMergePR(
  token: string,
  username: string,
  repoName: string,
  prNumber: number
): Promise<void> {
  const timestamp = Date.now();
  const branchName = `badge-${prNumber}-${timestamp}`;
  
  console.log(`\n📝 Creating PR #${prNumber} for badge earning...`);
  
  // Create branch
  exec(`git checkout -b ${branchName}`);
  
  // Make a change
  exec(`echo "Badge automation PR #${prNumber}" >> BADGE_LOG.md`);
  exec(`git add BADGE_LOG.md`);
  exec(`git commit -m "feat: badge automation PR #${prNumber}"`);
  exec(`git push origin ${branchName}`);
  
  // Create PR
  const prTitle = `Badge Automation PR #${prNumber}`;
  const prBody = `Automated PR for GitHub badge earning\n\nThis PR is part of badge automation.`;
  
  exec(`gh pr create --title "${prTitle}" --body "${prBody}" --base main --head ${branchName}`, undefined, {
    GITHUB_TOKEN: token
  });
  
  console.log(`✅ PR #${prNumber} created`);
  
  // Small delay for Quickdraw badge (merge quickly)
  await setTimeout(2000);
  
  // Merge PR immediately for YOLO badge (without review)
  exec(`gh pr merge --squash --delete-branch --admin`, undefined, {
    GITHUB_TOKEN: token
  });
  
  console.log(`🎉 PR #${prNumber} merged (YOLO + Quickdraw badges triggered!)`);
  
  // Switch back to main
  exec(`git checkout main`);
}

async function earnBadges(token: string, username: string): Promise<void> {
  console.log('🏆 Starting GitHub Badge Automation...');
  console.log(`👤 User: ${username}`);
  console.log(`🎯 Target badges: ${BADGES.filter(b => b.enabled).map(b => b.name).join(', ')}`);
  
  const tempRepoName = `badge-helper-${Date.now()}`;
  const tempDir = `/tmp/${tempRepoName}`;
  
  try {
    // Create temporary directory
    exec(`mkdir -p ${tempDir}`);
    process.chdir(tempDir);
    
    // Initialize git repo
    exec('git init -b main');
    exec(`git config user.name "${username}"`);
    exec(`git config user.email "${username}@users.noreply.github.com"`);
    
    // Create initial commit
    exec('echo "# Badge Helper" > README.md');
    exec('git add .');
    exec('git commit -m "feat: initialize badge helper repo"');
    
    // Create GitHub repo
    console.log(`\n📦 Creating temporary repo: ${username}/${tempRepoName}`);
    exec(`gh repo create ${tempRepoName} --public --source=. --remote=origin --push`, undefined, {
      GITHUB_TOKEN: token
    });
    
    // Create and merge PRs for badges
    const prCount = 5; // Need 5+ for Pull Shark badge
    
    for (let i = 1; i <= prCount; i++) {
      await createAndMergePR(token, username, tempRepoName, i);
      
      // Delay between PRs to avoid rate limiting
      if (i < prCount) {
        console.log(`⏳ Waiting before next PR...`);
        await setTimeout(3000);
      }
    }
    
    console.log(`\n✨ Badge automation complete!`);
    console.log(`🎉 Badges earned: YOLO, Pull Shark, Quickdraw`);
    console.log(`\n📝 Note: Badges may take up to 24 hours to appear on your profile`);
    console.log(`🗑️  Temporary repo ${username}/${tempRepoName} can be deleted manually`);
    
  } catch (error) {
    console.error('❌ Error during badge automation:', error);
    throw error;
  }
}

// CLI interface
const args = process.argv.slice(2);
const tokenArg = args.find(arg => arg.startsWith('--token='));
const usernameArg = args.find(arg => arg.startsWith('--username='));

if (!tokenArg || !usernameArg) {
  console.error('Usage: npx tsx scripts/earn-github-badges.ts --token=YOUR_TOKEN --username=YOUR_USERNAME');
  process.exit(1);
}

const token = tokenArg.split('=')[1];
const username = usernameArg.split('=')[1];

earnBadges(token, username)
  .then(() => {
    console.log('\n✅ Badge automation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Badge automation failed:', error);
    process.exit(1);
  });
