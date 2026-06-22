export interface GitHubProfile {
  id: string;
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  location: string | null;
  blog: string | null;
  company: string | null;
  email: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface Repository {
  id: string;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  has_readme: boolean;
  has_license: boolean;
  updated_at: string | null;
  html_url: string;
}
