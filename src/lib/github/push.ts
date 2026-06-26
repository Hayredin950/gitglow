import { createOctokit } from "./client";

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
  committer?: { name: string; email: string }
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
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: encoded,
      sha,
      branch,
      ...(committer ? { committer, author: committer } : {}),
    });
    console.log(`[v0] Successfully pushed ${path} to ${owner}/${repo}`);
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
