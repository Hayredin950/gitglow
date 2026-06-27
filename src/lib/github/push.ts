import { createOctokit } from "./client";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Helper to run shell commands
function runCommand(cmd: string, cwd: string) {
  try {
    console.log(`[v0] RUN: ${cmd} (in ${cwd})`);
    const result = execSync(cmd, { cwd, encoding: "utf8", stdio: "pipe" });
    console.log(`[v0] SUCCESS:`, result);
    return result;
  } catch (error) {
    console.error(`[v0] ERROR RUNNING: ${cmd}`, error);
    const err = error as any; // Type guard
    if (err.stdout) console.error(`[v0] STDOUT:`, err.stdout);
    if (err.stderr) console.error(`[v0] STDERR:`, err.stderr);
    throw error;
  }
}

// New: Push commits using local git repo (more reliable for backdating)
export async function pushCommitsWithLocalGit(
  token: string,
  owner: string,
  repo: string,
  commits: Array<{
    path: string;
    content: string;
    message: string;
    authorName: string;
    authorEmail: string;
    date: string; // ISO date string
  }>,
  branch: string = "main",
  emit?: (step: string, detail: string, progress: number, total: number) => void,
  totalSteps?: number
): Promise<number> {
  const tempDir = path.join(process.cwd(), `gitglow-${repo}-${Date.now()}`);
  console.log(`[v0] Using temp dir: ${tempDir}`);
  
  try {
    // Cleanup if already exists
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
    
    // Initialize repo
    console.log(`[v0] git init`);
    runCommand("git init", tempDir);
    const firstCommit = commits[0];
    const gitUserName = firstCommit?.authorName || owner;
    const gitUserEmail = firstCommit?.authorEmail || `${owner}@users.noreply.github.com`;
    console.log(`[v0] Setting git config user.name="${gitUserName}", user.email="${gitUserEmail}"`);
    runCommand(`git config user.name "${gitUserName}"`, tempDir);
    runCommand(`git config user.email "${gitUserEmail}"`, tempDir);

    // Calculate and emit date range
    if (commits.length > 0) {
      const sortedDates = [...commits].map(c => new Date(c.date)).sort((a,b) => a.getTime()-b.getTime());
      const startDate = sortedDates[0];
      const endDate = sortedDates[sortedDates.length - 1];
      const dateRangeStr = `${startDate.getFullYear()}-${String(startDate.getMonth()+1).padStart(2,'0')}-${String(startDate.getDate()).padStart(2,'0')} → ${endDate.getFullYear()}-${String(endDate.getMonth()+1).padStart(2,'0')}-${String(endDate.getDate()).padStart(2,'0')}`;
      console.log(`[v0] Commit date range: ${dateRangeStr}`);
      if (emit && totalSteps) {
        emit("commits", `Date range: ${dateRangeStr}`, 0, totalSteps);
      }
    }

    // Create each commit
    for (let i = 0; i < commits.length; i++) {
      const commit = commits[i];
      const filePath = path.join(tempDir, commit.path);
      const dirPath = path.dirname(filePath);
      
      // Create directory if needed
      try { fs.mkdirSync(dirPath, { recursive: true }); } catch (e) {}
      
      fs.writeFileSync(filePath, commit.content, "utf-8");

      // Stage
      runCommand(`git add "${commit.path}"`, tempDir);

      // Commit with date and committer info
              const commitEnv = {
                ...process.env,
                GIT_AUTHOR_NAME: firstCommit?.authorName || owner,
                GIT_AUTHOR_EMAIL: firstCommit?.authorEmail || `${owner}@users.noreply.github.com`,
                GIT_AUTHOR_DATE: commit.date,
                GIT_COMMITTER_NAME: firstCommit?.authorName || owner,
                GIT_COMMITTER_EMAIL: firstCommit?.authorEmail || `${owner}@users.noreply.github.com`,
                GIT_COMMITTER_DATE: commit.date
              };
              
              execSync(`git commit -m "${commit.message.replace(/"/g, '\\"')}"`, {
                cwd: tempDir,
                env: commitEnv,
                encoding: "utf8",
                stdio: "pipe"
              });
      
      // Emit progress if we have emit
      if (emit && totalSteps) {
        emit("commits", `Created commit ${i+1}/${commits.length} in ${repo}`, i+1, totalSteps);
      }
      
      console.log(`[v0] Committed ${i+1}/${commits.length} (${commit.date})`);
    }

    // Push to GitHub
    console.log(`[v0] Adding remote origin and pushing...`);
    const remoteUrl = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;
    runCommand(`git remote add origin "${remoteUrl}"`, tempDir);
    runCommand(`git branch -M ${branch}`, tempDir);
    
    console.log(`[v0] Running git push -u origin ${branch} --force`);
    try {
      const pushOutput = runCommand(`git push -u origin ${branch} --force`, tempDir);
      console.log(`[v0] Push successful:`, pushOutput);
    } catch (pushError) {
      const err = pushError as any;
      console.error(`[v0] Git push FAILED for repo ${repo}:`, err);
      if (err.stderr) console.error(`[v0] Stderr:`, err.stderr);
      if (err.stdout) console.error(`[v0] Stdout:`, err.stdout);
      throw pushError;
    }

    console.log(`[v0] Successfully pushed ${commits.length} commits to ${owner}/${repo}`);
    return commits.length;
  } catch (error) {
    console.error(`[v0] ERROR in pushCommitsWithLocalGit:`, error);
    throw error;
  } finally {
    // Cleanup
    try {
      console.log(`[v0] Cleaning up temp dir: ${tempDir}`);
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.warn(`[v0] Cleanup failed:`, e);
    }
  }
}

export async function createRepo(
  token: string,
  name: string,
  description: string,
  isPrivate = false
) {
  const octokit = createOctokit(token);
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name,
    description,
    private: isPrivate,
    auto_init: false,
  });
  return data;
}

export async function pushFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch = "main",
  committer?: { name: string; email: string },
  authorDate?: string
) {
  const octokit = createOctokit(token);

  if (!path || path.trim() === "") {
    throw new Error("Invalid file path: cannot be empty");
  }

  // Get existing SHA if file exists (needed for updates)
  let sha: string | undefined;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (!Array.isArray(data) && "sha" in data) sha = data.sha;
  } catch (err) {
    // File doesn't exist yet — first push
    const errMsg = err instanceof Error ? err.message : "";
    if (!errMsg.includes("404") && !errMsg.includes("Not Found")) {
      console.warn(`[v0] Warning fetching existing file at ${path}:`, errMsg);
    }
  }

  const encoded = Buffer.from(content, "utf-8").toString("base64");

  try {
    const params: any = {
      owner,
      repo,
      path,
      message,
      content: encoded,
      sha,
      branch,
    };
    
    if (committer) {
      params.committer = committer;
      params.author = committer;
    }
    
    // Add author AND committer date if provided (for backdated commits)
    // Both are needed for GitHub to properly show commits on the contribution graph
    if (authorDate) {
      params.author = {
        ...(params.author || {}),
        date: authorDate,
      };
      params.committer = {
        ...(params.committer || {}),
        date: authorDate,
      };
    }
    
    await octokit.repos.createOrUpdateFileContents(params);
    console.log(`[v0] Successfully pushed ${path} to ${owner}/${repo}${authorDate ? ` (date: ${authorDate})` : ''}`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    if (errMsg.includes("422") || errMsg.includes("Unprocessable Entity")) {
      throw new Error(`Invalid content or file path '${path}': ${errMsg}`);
    } else if (errMsg.includes("403") || errMsg.includes("Forbidden")) {
      throw new Error(`Permission denied to push to ${owner}/${repo}: ${errMsg}`);
    } else if (errMsg.includes("401") || errMsg.includes("Unauthorized")) {
      throw new Error(`Invalid GitHub token: ${errMsg}`);
    }
    throw new Error(`Failed to push ${path}: ${errMsg}`);
  }
}

export async function initRepoWithReadme(
  token: string,
  owner: string,
  repo: string,
  readmeContent: string
) {
  const octokit = createOctokit(token);
  const encoded = Buffer.from(readmeContent, "utf-8").toString("base64");
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: "README.md",
    message: "Initial commit",
    content: encoded,
  });
}

export async function setRepoTopics(
  token: string,
  owner: string,
  repo: string,
  topics: string[]
) {
  const octokit = createOctokit(token);
  await octokit.repos.replaceAllTopics({ owner, repo, names: topics });
}

export async function updateProfile(
  token: string,
  fields: { name?: string; bio?: string; location?: string; blog?: string }
) {
  const octokit = createOctokit(token);
  try {
    const result = await octokit.users.updateAuthenticated(fields);
    console.log("[v0] Profile updated successfully");
    return result;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    if (errMsg.includes("403") || errMsg.includes("Forbidden") || errMsg.includes("Requires authentication")) {
      console.warn(`[v0] Profile update requires 'user' scope (not available with current token). Bio and location won't be updated.`);
      // Don't throw — this is optional
      return null;
    }
    console.error(`[v0] Profile update error: ${errMsg}`);
    throw new Error(`Failed to update profile: ${errMsg}`);
  }
}

export async function repoExists(
  token: string,
  owner: string,
  repo: string
): Promise<boolean> {
  const octokit = createOctokit(token);
  try {
    await octokit.repos.get({ owner, repo });
    return true;
  } catch {
    return false;
  }
}

export async function createBranch(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  fromBranch = "main"
) {
  const octokit = createOctokit(token);
  
  // Get the SHA of the latest commit on the base branch
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${fromBranch}`,
  });
  
  // Create the new branch
  const { data } = await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branch}`,
    sha: refData.object.sha,
  });
  
  return data;
}

export async function createPullRequest(
  token: string,
  owner: string,
  repo: string,
  title: string,
  body: string,
  head: string,
  base = "main"
) {
  const octokit = createOctokit(token);
  
  const { data } = await octokit.pulls.create({
    owner,
    repo,
    title,
    body,
    head,
    base,
  });
  
  return data;
}

export async function mergePullRequest(
  token: string,
  owner: string,
  repo: string,
  pullNumber: number
) {
  const octokit = createOctokit(token);
  
  const { data } = await octokit.pulls.merge({
    owner,
    repo,
    pull_number: pullNumber,
    commit_title: `Merge PR #${pullNumber}`,
    commit_message: "Automated merge for badge earning",
    merge_method: "squash",
  });
  
  return data;
}

export async function deleteBranch(
  token: string,
  owner: string,
  repo: string,
  branch: string
) {
  const octokit = createOctokit(token);
  
  await octokit.git.deleteRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
}

export async function deleteRepo(
  token: string,
  owner: string,
  repo: string
) {
  const octokit = createOctokit(token);
  
  await octokit.repos.delete({
    owner,
    repo,
  });
}

export async function enableBranchProtection(
  token: string,
  owner: string,
  repo: string,
  branch = "main"
) {
  const octokit = createOctokit(token);
  
  try {
    await octokit.repos.updateBranchProtection({
      owner,
      repo,
      branch,
      required_status_checks: null,
      enforce_admins: false,
      required_pull_request_reviews: null,
      restrictions: null,
      allow_force_pushes: true,
      allow_deletions: true,
    });
    console.log(`[v0] Branch protection enabled for ${branch} in ${owner}/${repo}`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    console.warn(`[v0] Failed to enable branch protection: ${errMsg}`);
    // Don't throw - branch protection is optional
  }
}
