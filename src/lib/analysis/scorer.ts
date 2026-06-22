import type { GitHubProfile, Repository } from "@/types/github";
import type { ScoreBreakdown, Weakness } from "@/types/polish";

export function calculatePolishScore(
  profile: GitHubProfile,
  repos: Repository[],
  hasReadme: boolean,
  contributionCount: number
): ScoreBreakdown {
  const profileScore = scoreProfile(profile);
  const readmeScore = scoreReadme(hasReadme);
  const reposScore = scoreRepos(repos);
  const contribScore = scoreContributions(contributionCount);
  const socialScore = scoreSocial(profile);

  return {
    profile: profileScore,
    readme: readmeScore,
    repositories: reposScore,
    contributions: contribScore,
    social: socialScore,
    total: profileScore + readmeScore + reposScore + contribScore + socialScore,
  };
}

function scoreProfile(profile: GitHubProfile): number {
  let score = 0;
  if (profile.avatar_url && !profile.avatar_url.includes("identicons")) score += 5;
  if (profile.bio && profile.bio.length > 20) score += 7;
  if (profile.location) score += 3;
  if (profile.blog) score += 3;
  if (profile.name) score += 2;
  return Math.min(score, 20);
}

function scoreReadme(hasReadme: boolean): number {
  // Full credit given to human review — we can only check existence
  return hasReadme ? 20 : 0;
}

function scoreRepos(repos: Repository[]): number {
  if (repos.length === 0) return 0;
  let score = 0;
  const nonFork = repos.filter((r) => r.name !== r.name); // all are non-fork (filtered upstream)
  if (repos.length >= 3) score += 8;
  else if (repos.length >= 1) score += 4;

  const withDesc = repos.filter((r) => r.description).length;
  score += Math.min((withDesc / repos.length) * 8, 8);

  const withTopics = repos.filter((r) => r.topics.length > 0).length;
  score += Math.min((withTopics / repos.length) * 5, 5);

  const withLang = repos.filter((r) => r.language).length;
  score += Math.min((withLang / repos.length) * 4, 4);

  void nonFork;
  return Math.min(score, 25);
}

function scoreContributions(count: number): number {
  if (count >= 300) return 20;
  if (count >= 200) return 17;
  if (count >= 100) return 14;
  if (count >= 50) return 10;
  if (count >= 20) return 6;
  if (count >= 5) return 3;
  return 0;
}

function scoreSocial(profile: GitHubProfile): number {
  let score = 0;
  if (profile.followers >= 50) score += 5;
  else if (profile.followers >= 10) score += 3;
  else if (profile.followers >= 1) score += 1;
  if (profile.following >= 5) score += 2;
  score += Math.min(3, Math.floor(profile.public_repos / 5));
  return Math.min(score, 10);
}

export function identifyWeaknesses(
  profile: GitHubProfile,
  repos: Repository[],
  hasReadme: boolean,
  contributionCount: number
): Weakness[] {
  const weaknesses: Weakness[] = [];

  if (!hasReadme) {
    weaknesses.push({
      category: "Profile README",
      issue: "No profile README — recruiters see a blank homepage",
      impact: "high",
    });
  }
  if (!profile.bio || profile.bio.length < 10) {
    weaknesses.push({
      category: "Bio",
      issue: "Missing or too short bio",
      impact: "high",
    });
  }
  if (repos.length < 3) {
    weaknesses.push({
      category: "Projects",
      issue: `Only ${repos.length} public repo(s) — need 3+ to show range`,
      impact: "high",
    });
  }
  if (contributionCount < 100) {
    weaknesses.push({
      category: "Contribution Graph",
      issue: "Sparse contribution graph signals inactivity",
      impact: "high",
    });
  }
  if (!profile.location) {
    weaknesses.push({
      category: "Profile",
      issue: "No location set",
      impact: "low",
    });
  }
  if (!profile.blog) {
    weaknesses.push({
      category: "Profile",
      issue: "No website or portfolio link",
      impact: "medium",
    });
  }
  const noDesc = repos.filter((r) => !r.description).length;
  if (noDesc > 0) {
    weaknesses.push({
      category: "Repositories",
      issue: `${noDesc} repo(s) have no description`,
      impact: "medium",
    });
  }

  return weaknesses;
}
