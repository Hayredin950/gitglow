export interface UserIntake {
  fullName: string;
  email: string;
  goal: "job" | "opensource" | "portfolio" | "learning";
  skills: string[];
  projectIdea?: string;
  tone: "professional" | "casual" | "hacker";
  location?: string;
  website?: string;
  avatar: "professional" | "creative" | "classic";
  useTemplate: boolean;
  templateName?: "node-rest-api" | "python-utility" | "portfolio" | "nlp-toolkit" | "cache-store" | "delivery-api" | "calorie-tracker";
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
}

export interface CommitPlan {
  repo: string;
  date: string;
  path: string;
  content: string;
  message: string;
}
