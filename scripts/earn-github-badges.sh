#!/bin/bash
# GitHub Achievement Badge Automation Script
# Earns YOLO, Pull Shark, and Quickdraw badges automatically

set -e

TOKEN="${1}"
USERNAME="${2}"

if [ -z "$TOKEN" ] || [ -z "$USERNAME" ]; then
  echo "Usage: ./scripts/earn-github-badges.sh GITHUB_TOKEN USERNAME"
  exit 1
fi

echo "🏆 Starting GitHub Badge Automation..."
echo "👤 User: $USERNAME"
echo "🎯 Target badges: YOLO, Pull Shark, Quickdraw"

# Create temporary repo
TIMESTAMP=$(date +%s)
TEMP_REPO="badge-helper-$TIMESTAMP"
TEMP_DIR="/tmp/$TEMP_REPO"

mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Initialize git repo
git init -b main
git config user.name "$USERNAME"
git config user.email "$USERNAME@users.noreply.github.com"

# Create initial commit
echo "# Badge Helper" > README.md
git add .
git commit -m "feat: initialize badge helper repo"

# Create GitHub repo
echo "📦 Creating temporary repo: $USERNAME/$TEMP_REPO"
export GITHUB_TOKEN="$TOKEN"
gh repo create "$TEMP_REPO" --public --source=. --remote=origin --push

# Create and merge PRs for badges
PR_COUNT=5  # Need 5+ for Pull Shark badge

for i in $(seq 1 $PR_COUNT); do
  echo ""
  echo "📝 Creating PR #$i for badge earning..."
  
  # Create branch
  BRANCH_NAME="badge-$i-$TIMESTAMP"
  git checkout -b "$BRANCH_NAME"
  
  # Make a change
  echo "Badge automation PR #$i" >> BADGE_LOG.md
  git add BADGE_LOG.md
  git commit -m "feat: badge automation PR #$i"
  git push origin "$BRANCH_NAME"
  
  # Create PR
  gh pr create --title "Badge Automation PR #$i" --body "Automated PR for GitHub badge earning" --base main --head "$BRANCH_NAME"
  echo "✅ PR #$i created"
  
  # Small delay for Quickdraw badge
  sleep 2
  
  # Merge PR immediately for YOLO badge
  gh pr merge --squash --delete-branch --admin
  echo "🎉 PR #$i merged (YOLO + Quickdraw badges triggered!)"
  
  # Switch back to main
  git checkout main
  
  # Delay between PRs
  if [ $i -lt $PR_COUNT ]; then
    echo "⏳ Waiting before next PR..."
    sleep 3
  fi
done

echo ""
echo "✨ Badge automation complete!"
echo "🎉 Badges earned: YOLO, Pull Shark, Quickdraw"
echo ""
echo "📝 Note: Badges may take up to 24 hours to appear on your profile"
echo "🗑️  Temporary repo $USERNAME/$TEMP_REPO can be deleted manually:"
echo "   gh repo delete $TEMP_REPO --yes"
