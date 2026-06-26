export interface UserIntake {
  // Basic Info
  fullName: string;
  email: string;
  location?: string;
  website?: string;
  
  // Professional
  currentRole?: string;
  company?: string;
  experience?: string;
  
  // Skills & Goals
  skills: string[];
  goal: "job" | "opensource" | "portfolio" | "learning";
  targetRole?: string;
  
  // Social
  linkedin?: string;
  twitter?: string;
  
  // Styling
  avatar: "professional" | "creative" | "classic";
  theme: "tokyo-night" | "dracula" | "gradient" | "minimal";
  
  // Templates (user can choose up to 5)
  selectedTemplates: string[];
  
  // Dream Repos (up to 5 repos to fork)
  dreamRepos: string[];
  
  // Contribution targets
  targetContributions: number;
  targetRepos: number;
  
  // Script-based approach flag
  scriptBased?: boolean;
}

export interface ScoreBreakdown {
  profile: number;
  readme: number;
  repositories: number;
  contributions: number;
  social: number;
  total: number;
}

export interface Weakness {
  category: string;
  issue: string;
  impact: "high" | "medium" | "low";
}

export interface GenerationEvent {
  type:
    | "analyze_complete"
    | "plan_complete"
    | "readme_chunk"
    | "bio_complete"
    | "project_complete"
    | "commits_planned"
    | "generate_complete"
    | "error";
  data: Record<string, unknown>;
}

export interface DeployEvent {
  type: "step" | "progress" | "complete" | "error";
  step?: string;
  detail?: string;
  progress?: number;
  total?: number;
  error?: string;
}

export interface ProjectSpec {
  name: string;
  description: string;
  language: string;
  framework?: string;
  type: "web-app" | "cli" | "library" | "api" | "mobile";
}

export interface GeneratedProject {
  name: string;
  description: string;
  topics: string[];
  files: Record<string, string>;
  language?: string;
  category?: string;
  type?: string;
}

export interface CommitPlan {
  repo: string;
  date: string;
  path: string;
  content: string;
  message: string;
}
