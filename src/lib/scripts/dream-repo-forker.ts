/**
 * Script-based Dream Repo Forking System
 * Forks and enhances repos from other GitHub users
 */

export interface DreamRepo {
  url: string;
  owner: string;
  repo: string;
  description?: string;
}

export function parseGitHubUrl(url: string): DreamRepo | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  return {
    url,
    owner: match[1],
    repo: match[2],
  };
}

export function validateDreamRepos(urls: string[]): { valid: DreamRepo[]; invalid: string[] } {
  const valid: DreamRepo[] = [];
  const invalid: string[] = [];
  
  urls.forEach(url => {
    const parsed = parseGitHubUrl(url);
    if (parsed) {
      valid.push(parsed);
    } else {
      invalid.push(url);
    }
  });
  
  return { valid, invalid };
}

export function generateForkInstructions(repos: DreamRepo[]): string {
  const instructions = repos.map((repo, index) => {
    return `
## Fork ${index + 1}: ${repo.owner}/${repo.repo}

\`\`\`bash
# Fork the repository
gh repo fork ${repo.owner}/${repo.repo} --clone

# Navigate to the forked repo
cd ${repo.repo}

# Add premium README
cat > README.md << 'EOF'
# ${repo.repo}

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

This is a forked repository enhanced with premium documentation and styling.

## Features

- Original functionality preserved
- Enhanced documentation
- Premium README styling
- MIT License

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Contributing

Contributions are welcome!

## License

MIT License - see LICENSE file for details
EOF

# Add MIT License if not present
if [ ! -f LICENSE ]; then
  cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
fi

# Commit changes
git add README.md LICENSE
git commit -m "docs: add premium README and MIT license"

# Push to your fork
git push origin main
\`\`\`
`;
  }).join('\n');
  
  return instructions;
}

export function generateRepoDescription(repo: DreamRepo, goal: string): string {
  const descriptions = {
    job: `Enhanced fork of ${repo.owner}/${repo.repo} with premium documentation and professional styling`,
    opensource: `Community-enhanced fork of ${repo.owner}/${repo.repo} with improved documentation`,
    portfolio: `Showcase fork of ${repo.owner}/${repo.repo} with premium styling and documentation`,
    learning: `Learning fork of ${repo.owner}/${repo.repo} with enhanced documentation for study`,
  };
  
  return descriptions[goal as keyof typeof descriptions] || descriptions.job;
}

export function calculateForkComplexity(repos: DreamRepo[]): {
  totalRepos: number;
  estimatedTime: string;
  recommendations: string[];
} {
  const totalRepos = repos.length;
  const estimatedMinutes = totalRepos * 5; // 5 minutes per repo
  
  let estimatedTime = `${estimatedMinutes} minutes`;
  if (estimatedMinutes > 60) {
    estimatedTime = `${Math.floor(estimatedMinutes / 60)} hours ${estimatedMinutes % 60} minutes`;
  }
  
  const recommendations: string[] = [];
  if (totalRepos === 0) {
    recommendations.push("Consider adding 1-2 dream repos to showcase your interests");
  } else if (totalRepos < 3) {
    recommendations.push("You can add more repos to reach the maximum of 5");
  } else {
    recommendations.push("Great selection! You have a good variety of repos");
  }
  
  return {
    totalRepos,
    estimatedTime,
    recommendations,
  };
}