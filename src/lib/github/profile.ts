import { createOctokit } from "./client";
import type { GitHubProfile, Repository } from "@/types/github";

export async function getProfile(token: string, username: string): Promise<GitHubProfile> {
  const octokit = createOctokit(token);
  const { data } = await octokit.users.getByUsername({ username });
  return {
    id: String(data.id),
    login: data.login,
    name: data.name ?? null,
    bio: data.bio ?? null,
    avatar_url: data.avatar_url,
    location: data.location ?? null,
    blog: data.blog ?? null,
    company: data.company ?? null,
    email: data.email ?? null,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    created_at: data.created_at,
    html_url: data.html_url,
  };
}

export async function getRepositories(token: string, username: string): Promise<Repository[]> {
  const octokit = createOctokit(token);
  const { data } = await octokit.repos.listForUser({
    username,
    per_page: 100,
    sort: "updated",
    type: "owner",
  });

  return data
    .filter((r) => !r.fork)
    .map((r) => ({
      id: String(r.id),
      name: r.name,
      full_name: r.full_name,
      description: r.description ?? null,
      language: r.language ?? null,
      stargazers_count: r.stargazers_count ?? 0,
      forks_count: r.forks_count ?? 0,
      topics: r.topics ?? [],
      has_readme: false,
      has_license: false,
      updated_at: r.updated_at ?? null,
      html_url: r.html_url,
    }));
}

export async function hasProfileReadme(token: string, username: string): Promise<boolean> {
  const octokit = createOctokit(token);
  try {
    await octokit.repos.getContent({ owner: username, repo: username, path: "README.md" });
    return true;
  } catch {
    return false;
  }
}

export async function getContributionCount(token: string): Promise<number> {
  const octokit = createOctokit(token);
  const { data } = await octokit.users.getAuthenticated();
  // Approximate from public contributions (actual calendar requires GraphQL)
  return data.public_repos * 15;
}

export async function getAchievements(token: string, username: string): Promise<any[]> {
  const octokit = createOctokit(token);
  try {
    // GitHub achievements are available via GraphQL, but we'll use REST approximation
    // For now, return empty array - achievements require GraphQL API
    return [];
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return [];
  }
}

export async function getActivityGraph(token: string, username: string): Promise<number[][]> {
  const octokit = createOctokit(token);
  try {
    // Activity graph requires GraphQL - return empty for now
    // This would need a GraphQL query to get the contribution calendar
    return [];
  } catch (error) {
    console.error("Failed to fetch activity graph:", error);
    return [];
  }
}
