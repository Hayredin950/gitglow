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
  branch = "main"
) {
  const octokit = createOctokit(token);

  // Get existing SHA if file exists (needed for updates)
  let sha: string | undefined;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (!Array.isArray(data) && "sha" in data) sha = data.sha;
  } catch {
    // File doesn't exist yet — first push
  }

  const encoded = Buffer.from(content, "utf-8").toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: encoded,
    sha,
    branch,
  });
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
  await octokit.users.updateAuthenticated(fields);
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
