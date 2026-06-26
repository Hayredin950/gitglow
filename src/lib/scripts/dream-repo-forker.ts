/**
 * Script-based Dream Repo Forking System
 * Forks and enhances repos from other GitHub users
 */
import { createOctokit } from "@/lib/github/client";
import type { RestEndpointMethodTypes } from "@octokit/rest";

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

export function generateForkInstructions(repos: DreamRepo[], username: string, email: string): string {
  const currentYear = new Date().getFullYear();
  const instructions = repos.map((repo, index) => {
    return `
## Fork ${index + 1}: ${repo.owner}/${repo.repo}

\`\`\`bash
# Fork the repository
gh repo fork ${repo.owner}/${repo.repo} --clone

# Navigate to the forked repo
cd ${repo.repo}

# Configure git user to use YOUR identity (not the original repo owner)
git config user.name "${username}"
git config user.email "${email}"

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
  cat > LICENSE << EOF
MIT License

Copyright (c) ${currentYear} ${username}

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

# Commit changes with YOUR identity
git add README.md LICENSE
git commit -m "docs: add premium README and MIT license"

# Push to your fork
git push origin main
\`\`\`
`;
  }).join('\n');
  
  return instructions;
}

/**
 * Fork a repository using GitHub API */
export async function forkRepo(
  token: string,
  repoOwner: string,
  repoName: string
): Promise<string> {
  const octokit = createOctokit(token);
  const { data } = await octokit.repos.createFork({
    owner: repoOwner,
    repo: repoName,
  });
  return data.full_name;
}

export interface Committer {
  name: string;
  email: string;
}

/**
 * Get a file from a repository */
async function getRepoFile(
  token: string,
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  const octokit = createOctokit(token);
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    if ("content" in data && data.content) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get repo default branch
 */
async function getRepoDefaultBranch(
  token: string,
  owner: string,
  repo: string
): Promise<string> {
  const octokit = createOctokit(token);
  const { data } = await octokit.repos.get({
    owner,
    repo,
  });
  return data.default_branch;
}

/**
 * Create a branch with changes and commit it
 */
export async function enhanceFork(
  token: string,
  owner: string,
  repo: string,
  fullName: string,
  committer?: Committer
) {
  const octokit = createOctokit(token);
  const defaultBranch = await getRepoDefaultBranch(token, owner, repo);

  // Get current SHA from default branch
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
  });

  // Create a new branch for the enhancement
  const branchName = `enhance-profile-${Date.now()}`;
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: refData.object.sha,
  });

  const tree: RestEndpointMethodTypes["git"]["createTree"]["parameters"]["tree"] = [];

  // Check if LICENSE exists
  const existingLicense = await getRepoFile(token, owner, repo, "LICENSE");
  if (!existingLicense) {
    const licenseContent = `MIT License

Copyright (c) ${new Date().getFullYear()} ${fullName}

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
`;
    tree.push({
      path: "LICENSE",
      mode: "100644",
      type: "blob",
      content: licenseContent,
    });
  }

  // Create a simple README addition
  const existingReadme = await getRepoFile(token, owner, repo, "README.md");
  const readmeContent = existingReadme || `# ${repo}

Forked from ${repo}

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

This is an enhanced fork of ${owner}/${repo}.
`;
  tree.push({
    path: "README.md",
    mode: "100644",
    type: "blob",
    content: readmeContent,
  });

  // Create tree
  const { data: treeData } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: refData.object.sha,
    tree,
  });

  // Create commit with user's email and username if provided
  const commitParams: any = {
    owner,
    repo,
    message: "docs: enhance repo",
    tree: treeData.sha,
    parents: [refData.object.sha],
  };
  
  if (committer) {
    commitParams.author = committer;
    commitParams.committer = committer;
  }
  
  const { data: commitData } = await octokit.git.createCommit(commitParams);

  // Update branch
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
    sha: commitData.sha,
  });

  // Create PR (only if we have committer info to ensure proper authorship)
  if (committer) {
    await octokit.pulls.create({
      owner,
      repo,
      title: "Enhance repo for portfolio",
      head: branchName,
      base: defaultBranch,
      body: "This PR adds a LICENSE and updates the README to make it portfolio-ready.",
    });
  } else {
    // If no committer info, just merge the branch directly
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
      sha: commitData.sha,
    });
  }

  return branchName;
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