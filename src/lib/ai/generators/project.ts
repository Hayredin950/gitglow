import { anthropic } from "@/lib/ai/client";
import type { ProjectSpec, GeneratedProject } from "@/types/polish";

export async function generateProject(
  spec: ProjectSpec,
  ownerName: string
): Promise<GeneratedProject> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 8192,
    system: `You are a senior software engineer who writes clean, production-quality code. Generate complete, working project files. Return ONLY a JSON object with this structure:
{
  "name": "repo-name",
  "description": "one-line description",
  "topics": ["tag1", "tag2"],
  "files": {
    "path/to/file.ext": "full file content here",
    ...
  }
}
Every file should have real, working content. Include README.md, LICENSE (MIT), .gitignore, and the actual code files.`,
    messages: [
      {
        role: "user",
        content: `Generate a complete ${spec.type} project:
Name: ${spec.name}
Description: ${spec.description}
Language: ${spec.language}
Framework: ${spec.framework ?? "none"}
Owner: ${ownerName}

Include 5-10 files with real working code. The project must be impressive for a portfolio.
Add MIT LICENSE with owner name "${ownerName}".
Add proper .gitignore.
README must have: badges, description, features list, installation steps, usage, tech stack.
Return valid JSON only.`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("No text response from AI");

  // Extract JSON from the response (handle markdown code fences)
  const text = block.text.trim();
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/) ?? null;
  const jsonStr = jsonMatch ? jsonMatch[1] : text;

  let project: GeneratedProject;
  try {
    project = JSON.parse(jsonStr) as GeneratedProject;
  } catch {
    throw new Error(`Failed to parse project JSON: ${jsonStr.slice(0, 200)}`);
  }

  // Validate project structure
  if (!project.name || typeof project.name !== "string") {
    throw new Error("Invalid project: missing or invalid 'name' field");
  }
  if (!project.description || typeof project.description !== "string") {
    throw new Error("Invalid project: missing or invalid 'description' field");
  }
  if (!project.files || typeof project.files !== "object") {
    throw new Error("Invalid project: missing 'files' object");
  }

  // Validate file paths and sanitize
  const validFiles: Record<string, string> = {};
  for (const [path, content] of Object.entries(project.files)) {
    if (!path || typeof path !== "string" || path.trim() === "") {
      console.warn("[v0] Skipping file with invalid path");
      continue;
    }
    if (typeof content !== "string") {
      console.warn(`[v0] Skipping file ${path} with non-string content`);
      continue;
    }
    validFiles[path] = content;
  }

  if (Object.keys(validFiles).length === 0) {
    throw new Error("Project has no valid files");
  }

  project.files = validFiles;
  project.topics = Array.isArray(project.topics) ? project.topics : [];

  return project;
}

export function inferProjectFromSkills(
  skills: string[],
  projectIdea?: string
): ProjectSpec {
  const skillLower = skills.map((s) => s.toLowerCase());

  if (projectIdea) {
    // Use what the user described
    return {
      name: slugify(projectIdea),
      description: projectIdea,
      language: skills[0] ?? "Python",
      type: "web-app",
    };
  }

  // Pick best project type from skill set
  if (skillLower.some((s) => ["react", "next", "vue", "angular"].includes(s))) {
    return {
      name: "portfolio-site",
      description: "Personal developer portfolio with project showcase",
      language: "TypeScript",
      framework: "React",
      type: "web-app",
    };
  }
  if (skillLower.some((s) => ["node", "express", "fastapi", "django"].includes(s))) {
    return {
      name: "rest-api-boilerplate",
      description: "Production-ready REST API with auth, validation, and Docker",
      language: skillLower.includes("python") ? "Python" : "JavaScript",
      framework: skillLower.includes("python") ? "FastAPI" : "Express",
      type: "api",
    };
  }
  if (skillLower.some((s) => ["python"].includes(s))) {
    return {
      name: "automation-toolkit",
      description: "Collection of Python automation scripts for everyday tasks",
      language: "Python",
      type: "cli",
    };
  }

  return {
    name: "dev-tools",
    description: "A collection of useful developer utilities and scripts",
    language: skills[0] ?? "Python",
    type: "cli",
  };
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
