/**
 * GitHub Achievement Badge Automation
 * Generates plans and commands for earning GitHub achievement badges
 */

export interface BadgeConfig {
  name: string;
  description: string;
  enabled: boolean;
  prCount?: number;
}

export interface BadgeAutomationPlan {
  badges: BadgeConfig[];
  commands: string[];
  repoName: string;
  estimatedTime: string;
}

export function generateBadgeAutomationPlan(
  username: string,
  enabledBadges: string[] = ['YOLO', 'Pull Shark', 'Quickdraw']
): BadgeAutomationPlan {
  const allBadges: BadgeConfig[] = [
    {
      name: 'YOLO',
      description: 'Merge a PR without review',
      enabled: enabledBadges.includes('YOLO')
    },
    {
      name: 'Pull Shark',
      description: 'Create multiple PRs (need 5+ for badge)',
      enabled: enabledBadges.includes('Pull Shark'),
      prCount: 5
    },
    {
      name: 'Quickdraw',
      description: 'Merge a PR quickly after creation',
      enabled: enabledBadges.includes('Quickdraw')
    },
    {
      name: 'Pair Extraordinaire',
      description: 'Co-author commits with others',
      enabled: enabledBadges.includes('Pair Extraordinaire')
    }
  ];

  const activeBadges = allBadges.filter(b => b.enabled);
  const repoName = `badge-helper-${Date.now()}`;
  const commands: string[] = [];

  // Generate setup commands
  commands.push(`# GitHub Badge Automation Setup`);
  commands.push(`TEMP_DIR="/tmp/${repoName}"`);
  commands.push(`mkdir -p "$TEMP_DIR"`);
  commands.push(`cd "$TEMP_DIR"`);
  commands.push(``);
  commands.push(`# Initialize git repo with user's identity`);
  commands.push(`git init -b main`);
  commands.push(`git config user.name "${username}"`);
  commands.push(`git config user.email "${username}@users.noreply.github.com"`);
  commands.push(``);
  commands.push(`# Create initial commit`);
  commands.push(`echo "# Badge Helper Repo" > README.md`);
  commands.push(`git add .`);
  commands.push(`git commit -m "feat: initialize badge helper repo"`);
  commands.push(``);
  commands.push(`# Create GitHub repo`);
  commands.push(`gh repo create ${repoName} --public --source=. --remote=origin --push`);
  commands.push(``);

  // Generate PR creation and merge commands
  const prCount = activeBadges.find(b => b.name === 'Pull Shark')?.prCount || 5;
  
  for (let i = 1; i <= prCount; i++) {
    const timestamp = Date.now() + (i * 1000);
    const branchName = `badge-${i}-${timestamp}`;
    
    commands.push(`# Create and merge PR #${i}`);
    commands.push(`git checkout -b ${branchName}`);
    commands.push(`echo "Badge automation PR #${i}" >> BADGE_LOG.md`);
    commands.push(`git add BADGE_LOG.md`);
    commands.push(`git commit -m "feat: badge automation PR #${i}"`);
    commands.push(`git push origin ${branchName}`);
    commands.push(``);
    commands.push(`# Create PR`);
    commands.push(`gh pr create --title "Badge Automation PR #${i}" --body "Automated PR for GitHub badge earning" --base main --head ${branchName}`);
    commands.push(``);
    commands.push(`# Wait briefly for Quickdraw badge`);
    commands.push(`sleep 2`);
    commands.push(``);
    commands.push(`# Merge PR immediately for YOLO badge (without review)`);
    commands.push(`gh pr merge --squash --delete-branch --admin`);
    commands.push(`git checkout main`);
    commands.push(``);
    
    if (i < prCount) {
      commands.push(`# Delay between PRs to avoid rate limiting`);
      commands.push(`sleep 3`);
      commands.push(``);
    }
  }

  commands.push(`echo "✨ Badge automation complete!"`);
  commands.push(`echo "🎉 Badges earned: ${activeBadges.map(b => b.name).join(', ')}"`);
  commands.push(`echo "📝 Note: Badges may take up to 24 hours to appear on your profile"`);
  commands.push(`echo "🗑️  Temporary repo ${username}/${repoName} can be deleted manually"`);

  return {
    badges: activeBadges,
    commands,
    repoName,
    estimatedTime: `${prCount * 10 + 30} seconds` // ~10s per PR + 30s setup
  };
}

export function generateBadgeInstructions(username: string): string {
  const plan = generateBadgeAutomationPlan(username);
  
  const instructions: string[] = [];
  instructions.push(`# GitHub Achievement Badge Automation`);
  instructions.push(``);
  instructions.push(`This script will help you earn the following GitHub achievement badges:`);
  instructions.push(``);
  
  plan.badges.forEach(badge => {
    instructions.push(`- **${badge.name}**: ${badge.description}`);
  });
  
  instructions.push(``);
  instructions.push(`## Prerequisites`);
  instructions.push(`- GitHub CLI (gh) installed and authenticated`);
  instructions.push(`- Write access to your GitHub account`);
  instructions.push(``);
  instructions.push(`## Execution`);
  instructions.push(`Run the following commands in your terminal:`);
  instructions.push(``);
  instructions.push(`\`\`\`bash`);
  instructions.push(plan.commands.join('\n'));
  instructions.push(`\`\`\``);
  instructions.push(``);
  instructions.push(`## Important Notes`);
  instructions.push(`- Badges may take up to 24 hours to appear on your profile`);
  instructions.push(`- The temporary repo can be deleted after earning badges`);
  instructions.push(`- This creates real PRs and merges on your GitHub account`);
  
  return instructions.join('\n');
}