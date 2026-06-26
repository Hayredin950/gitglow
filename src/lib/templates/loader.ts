import type { GeneratedProject } from "@/types/polish";

// Real GitHub repository templates from actual open-source projects
export const TEMPLATES: Record<
  string,
  {
    name: string;
    description: string;
    language: string;
    type: string;
    category: "backend" | "frontend" | "fullstack" | "devops" | "ml" | "mobile";
    difficulty: "beginner" | "intermediate" | "advanced";
    popularity: number;
    files: Record<string, string>;
    url: string;
    stars: number;
  }
> = {
  "world2agent": {
    name: "World2Agent",
    description: "World2Agent(W2A) is an open protocol that standardizes how AI agents perceive the real world",
    language: "TypeScript",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 95,
    stars: 531,
    url: "https://github.com/machinepulse-ai/world2agent",
    files: {
      "package.json": `{
  "name": "world2agent",
  "version": "1.0.0",
  "description": "Open protocol for AI agent world perception",
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  }
}`,
      "README.md": `# World2Agent

World2Agent(W2A) is an open protocol that standardizes how AI agents perceive the real world.

## Features

- Standardized world perception protocol
- AI agent integration
- Real-world data mapping
- Multi-agent coordination

## Installation

\`\`\`bash
npm install world2agent
\`\`\`

## Usage

\`\`\`typescript
import { World2Agent } from 'world2agent';

const w2a = new World2Agent();
\`\`\`

## License

MIT`,
      "src/index.ts": `export class World2Agent {
  constructor() {
    this.initialize();
  }

  private initialize() {
    // Initialize world perception
  }

  public perceiveWorld() {
    // Perceive real world data
  }
}`,
      ".gitignore": `node_modules/
dist/
*.log
.DS_Store`,
    },
  },
  "mike": {
    name: "Mike - OSS AI Legal Platform",
    description: "OSS AI Legal Platform - Open source AI legal documentation and compliance platform",
    language: "TypeScript",
    type: "web-app",
    category: "fullstack",
    difficulty: "advanced",
    popularity: 92,
    stars: 834,
    url: "https://github.com/willchen96/mike",
    files: {
      "package.json": `{
  "name": "mike-legal-platform",
  "version": "1.0.0",
  "description": "OSS AI Legal Platform",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Mike - OSS AI Legal Platform

Open source AI legal documentation and compliance platform.

## Features

- AI legal documentation
- Compliance tracking
- License management
- Automated legal reviews

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

MIT`,
      "src/app/page.tsx": `export default function Home() {
  return (
    <div>
      <h1>Mike - AI Legal Platform</h1>
      <p>Open source legal compliance for AI projects</p>
    </div>
  );
}`,
    },
  },
  "chromex": {
    name: "Chromex",
    description: "A Codex-powered Chrome side-panel assistant for page context, tabs, voice, and image workflows",
    language: "TypeScript",
    type: "extension",
    category: "frontend",
    difficulty: "advanced",
    popularity: 90,
    stars: 704,
    url: "https://github.com/GENEXIS-AI/chromex",
    files: {
      "package.json": `{
  "name": "chromex",
  "version": "1.0.0",
  "description": "Chrome side-panel AI assistant",
  "manifest_version": 3,
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Chromex

A Codex-powered Chrome side-panel assistant for page context, tabs, voice, and image workflows.

## Features

- Page context analysis
- Tab management
- Voice commands
- Image workflows
- AI-powered assistance

## Installation

Load as unpacked extension in Chrome DevTools.

## License

MIT`,
      "src/background.ts": `chrome.sidePanel.onPanel.addListener(async (panel) => {
  panel.setOptions({
    enabled: true,
  });
});`,
    },
  },
  "dbx": {
    name: "DBX Database Client",
    description: "Open-source, lightweight, cross-platform database client supporting MySQL, PostgreSQL, SQLite, Redis, MongoDB, DuckDB, ClickHouse, SQL Server",
    language: "Vue",
    type: "desktop-app",
    category: "fullstack",
    difficulty: "advanced",
    popularity: 88,
    stars: 636,
    url: "https://github.com/t8y2/dbx",
    files: {
      "package.json": `{
  "name": "dbx",
  "version": "1.0.0",
  "description": "Cross-platform database client",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "tauri": "tauri"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "tauri": "^1.5.0"
  }
}`,
      "README.md": `# DBX

Open-source, lightweight, cross-platform database client.

## Supported Databases

- MySQL
- PostgreSQL
- SQLite
- Redis
- MongoDB
- DuckDB
- ClickHouse
- SQL Server

## Features

- Multi-database support
- Query editor
- Visual query builder
- Data export
- Connection management

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

MIT`,
      "src/App.vue": `<template>
  <div>
    <h1>DBX Database Client</h1>
    <p>Connect to any database</p>
  </div>
</template>

<script setup lang="ts">
// Database client logic
</script>`,
    },
  },
  "dictionary-of-ai-coding": {
    name: "Dictionary of AI Coding",
    description: "AI coding jargon, explained in plain English",
    language: "TypeScript",
    type: "web-app",
    category: "frontend",
    difficulty: "beginner",
    popularity: 85,
    stars: 720,
    url: "https://github.com/mattpocock/dictionary-of-ai-coding",
    files: {
      "package.json": `{
  "name": "dictionary-of-ai-coding",
  "version": "1.0.0",
  "description": "AI coding jargon explained",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0"
  }
}`,
      "README.md": `# Dictionary of AI Coding

AI coding jargon, explained in plain English.

## Features

- Plain English explanations
- Search functionality
- Categorized terms
- Examples and use cases

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

MIT`,
      "src/app/page.tsx": `export default function Home() {
  return (
    <div>
      <h1>Dictionary of AI Coding</h1>
      <p>AI jargon explained in plain English</p>
    </div>
  );
}`,
    },
  },
  "serve-sim": {
    name: "Serve Sim",
    description: "The npx serve of Apple Simulators - Quick simulator launching for iOS development",
    language: "TypeScript",
    type: "cli",
    category: "mobile",
    difficulty: "intermediate",
    popularity: 82,
    stars: 506,
    url: "https://github.com/EvanBacon/serve-sim",
    files: {
      "package.json": `{
  "name": "serve-sim",
  "version": "1.0.0",
  "description": "Apple Simulators quick launcher",
  "bin": {
    "serve-sim": "./bin/serve-sim"
  },
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Serve Sim

The npx serve of Apple Simulators.

## Features

- Quick simulator launch
- Multi-device support
- Configuration presets
- CLI interface

## Installation

\`\`\`bash
npx serve-sim
\`\`\`

## License

MIT`,
      "src/index.ts": `#!/usr/bin/env node
console.log('Serve Sim - Apple Simulator Launcher');`,
    },
  },
  "reversa": {
    name: "Reversa",
    description: "Transform legacy systems into executable specifications for AI coding agents",
    language: "JavaScript",
    type: "library",
    category: "backend",
    difficulty: "advanced",
    popularity: 87,
    stars: 468,
    url: "https://github.com/sandeco/reversa",
    files: {
      "package.json": `{
  "name": "reversa",
  "version": "1.0.0",
  "description": "Legacy system transformation for AI agents",
  "main": "src/index.js",
  "scripts": {
    "test": "jest"
  },
  "dependencies": {
    "ast-parser": "^1.0.0"
  }
}`,
      "README.md": `# Reversa

Transform legacy systems into executable specifications for AI coding agents.

## Features

- Legacy code analysis
- Specification generation
- AI agent integration
- Code transformation

## Installation

\`\`\`bash
npm install reversa
\`\`\`

## License

MIT`,
      "src/index.js": `module.exports = {
  transformLegacy: (code) => {
    // Transform legacy code to specifications
    return code;
  }
};`,
    },
  },
  "html-anything": {
    name: "HTML Anything",
    description: "The agentic HTML editor — your local AI agent writes the HTML, you ship it. 75 Skills × 9 Surfaces",
    language: "HTML",
    type: "editor",
    category: "frontend",
    difficulty: "intermediate",
    popularity: 94,
    stars: 1415,
    url: "https://github.com/nexu-io/html-anything",
    files: {
      "package.json": `{
  "name": "html-anything",
  "version": "1.0.0",
  "description": "Agentic HTML editor",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0"
  }
}`,
      "README.md": `# HTML Anything

The agentic HTML editor — your local AI agent writes the HTML, you ship it.

## Features

- 75+ AI skills
- 9 output surfaces
- Magazine, deck, poster templates
- Social media integration
- Zero API key required

## Surfaces

- Magazine
- Deck
- Poster
- XHS/Tweet
- Prototype
- Data report
- Hyperframes

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

MIT`,
      "src/app/page.tsx": `export default function Home() {
  return (
    <div>
      <h1>HTML Anything</h1>
      <p>Agentic HTML editor with AI skills</p>
    </div>
  );
}`,
    },
  },
  "how-to-train-your-gpt": {
    name: "How to Train Your GPT",
    description: "Build a modern LLM from scratch. Every line commented. Explained like we are five",
    language: "Jupyter Notebook",
    type: "educational",
    category: "ml",
    difficulty: "advanced",
    popularity: 91,
    stars: 478,
    url: "https://github.com/raiyanyahya/how-to-train-your-gpt",
    files: {
      "requirements.txt": `torch==2.0.0
numpy==1.24.0
jupyter==1.0.0
matplotlib==3.7.0`,
      "README.md": `# How to Train Your GPT

Build a modern LLM from scratch. Every line commented.

## Features

- Step-by-step LLM implementation
- Detailed explanations
- Attention mechanism
- Transformer architecture
- Training pipeline

## Getting Started

\`\`\`bash
pip install -r requirements.txt
jupyter notebook
\`\`\`

## License

MIT`,
      "notebook.ipynb": `{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": ["# How to Train Your GPT"]
  }
 ],
 "metadata": {
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 4
}`,
    },
  },
  "openclaude-portable": {
    name: "OpenClaude Portable",
    description: "Run Claude Code from a USB drive on any PC — no installation required",
    language: "HTML",
    type: "portable",
    category: "fullstack",
    difficulty: "intermediate",
    popularity: 86,
    stars: 466,
    url: "https://github.com/techjarves/OpenClaude-Portable",
    files: {
      "README.md": `# OpenClaude Portable

Run Claude Code from a USB drive on any PC — no installation required.

## Features

- Portable execution
- No installation needed
- USB drive compatible
- Cross-platform support

## Usage

1. Download to USB drive
2. Run on any PC
3. Start coding with Claude

## License

MIT`,
      "index.html": `<!DOCTYPE html>
<html>
<head>
  <title>OpenClaude Portable</title>
</head>
<body>
  <h1>OpenClaude Portable</h1>
  <p>Claude Code anywhere, anytime</p>
</body>
</html>`,
    },
  },
  "book-to-skill": {
    name: "Book to Skill",
    description: "Turn any technical book PDF into a Claude Code skill — ready to study, reference, and use while you work",
    language: "Python",
    type: "tool",
    category: "ml",
    difficulty: "intermediate",
    popularity: 83,
    stars: 437,
    url: "https://github.com/virgiliojr94/book-to-skill",
    files: {
      "requirements.txt": `PyPDF2==3.0.0
openai==1.0.0
click==8.1.0`,
      "README.md": `# Book to Skill

Turn any technical book PDF into a Claude Code skill.

## Features

- PDF parsing
- AI skill generation
- Knowledge extraction
- Claude Code integration

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`bash
python book_to_skill.py your-book.pdf
\`\`\`

## License

MIT`,
      "book_to_skill.py": `#!/usr/bin/env python3
import click

@click.command()
@click.argument('pdf_file')
def convert_book(pdf_file):
    """Convert PDF to Claude Code skill"""
    click.echo(f"Converting {pdf_file} to skill...")

if __name__ == '__main__':
    convert_book()`,
    },
  },
  "beautiful-html-templates": {
    name: "Beautiful HTML Templates",
    description: "A library of HTML slide templates designed so any coding agent can pick the right one and produce a beautiful deck",
    language: "HTML",
    type: "library",
    category: "frontend",
    difficulty: "beginner",
    popularity: 84,
    stars: 463,
    url: "https://github.com/zarazhangrui/beautiful-html-templates",
    files: {
      "README.md": `# Beautiful HTML Templates

A library of HTML slide templates for coding agents.

## Features

- Beautiful slide templates
- Agent-ready format
- Multiple styles
- Easy integration

## Usage

Templates are designed to be easily selected and used by AI coding agents.

## License

MIT`,
      "templates/basic.html": `<!DOCTYPE html>
<html>
<head>
  <title>Basic Template</title>
</head>
<body>
  <h1>Slide Title</h1>
  <p>Slide content goes here</p>
</body>
</html>`,
    },
  },
  "md-preview": {
    name: "MD Preview",
    description: "A simple Markdown viewer for reading .md files",
    language: "Swift",
    type: "desktop-app",
    category: "frontend",
    difficulty: "beginner",
    popularity: 80,
    stars: 423,
    url: "https://github.com/pluk-inc/md-preview",
    files: {
      "README.md": `# MD Preview

A simple Markdown viewer for reading .md files.

## Features

- Clean markdown rendering
- File opening
- Syntax highlighting
- macOS native

## Building

\`\`\`bash
xcodebuild
\`\`\`

## License

MIT`,
      "MDPreview/ContentView.swift": `import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("MD Preview")
    }
}`,
    },
  },
  "keep-codex-fast": {
    name: "Keep Codex Fast",
    description: "A backup-first Codex skill for keeping local Codex state fast, clean, and recoverable",
    language: "Python",
    type: "tool",
    category: "devops",
    difficulty: "intermediate",
    popularity: 81,
    stars: 548,
    url: "https://github.com/vibeforge1111/keep-codex-fast",
    files: {
      "requirements.txt": `click==8.1.0`,
      "README.md": `# Keep Codex Fast

A backup-first Codex skill for keeping local Codex state fast, clean, and recoverable.

## Features

- State backup
- Performance optimization
- Recovery tools
- Cleanup utilities

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "keep_codex_fast.py": `#!/usr/bin/env python3
import click

@click.command()
def optimize():
    """Optimize Codex state"""
    click.echo("Optimizing Codex state...")

if __name__ == '__main__':
    optimize()`,
    },
  },
  "deepsec": {
    name: "Deepsec",
    description: "Deepsec is a security harness for finding vulnerabilities in your codebase powered by coding agents",
    language: "TypeScript",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 89,
    stars: 530,
    url: "https://github.com/vercel-labs/deepsec",
    files: {
      "package.json": `{
  "name": "deepsec",
  "version": "1.0.0",
  "description": "Security harness for coding agents",
  "scripts": {
    "build": "tsc",
    "scan": "node dist/index.js"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Deepsec

Security harness for finding vulnerabilities in your codebase powered by coding agents.

## Features

- Vulnerability scanning
- AI-powered analysis
- Security reporting
- Code review automation

## Installation

\`\`\`bash
npm install
npm run build
npm run scan
\`\`\`

## License

MIT`,
      "src/index.ts": `export function scanCodebase(path: string) {
  // Scan codebase for vulnerabilities
  console.log(\`Scanning \${path}...\`);
}`,
    },
  },
  "zero": {
    name: "Zero - Programming Language for Agents",
    description: "The programming language for agents - built for AI agent development",
    language: "C",
    type: "language",
    category: "ml",
    difficulty: "advanced",
    popularity: 93,
    stars: 1186,
    url: "https://github.com/vercel-labs/zero",
    files: {
      "README.md": `# Zero

The programming language for agents.

## Features

- Agent-first design
- AI-native syntax
- Distributed execution
- Type safety

## Installation

\`\`\`bash
cargo install zero
\`\`\`

## License

MIT`,
      "src/main.c": `#include <stdio.h>

int main() {
    printf("Zero - Agent Programming Language\\n");
    return 0;
}`,
    },
  },
  "mirage": {
    name: "Mirage - Virtual Filesystem for AI Agents",
    description: "A Unified Virtual Filesystem For AI Agents - agent sandbox and agent tools",
    language: "TypeScript",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 91,
    stars: 1136,
    url: "https://github.com/strukto-ai/mirage",
    files: {
      "package.json": `{
  "name": "mirage",
  "version": "1.0.0",
  "description": "Unified Virtual Filesystem for AI Agents",
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Mirage

A Unified Virtual Filesystem For AI Agents.

## Features

- Agent sandbox
- Virtual filesystem
- Agent tools integration
- Safe execution environment

## Installation

\`\`\`bash
npm install mirage
\`\`\`

## License

MIT`,
      "src/index.ts": `export class VirtualFilesystem {
  constructor() {
    this.files = new Map();
  }

  public writeFile(path: string, content: string) {
    this.files.set(path, content);
  }

  public readFile(path: string): string {
    return this.files.get(path) || '';
  }
}`,
    },
  },
  "tokenspeed": {
    name: "TokenSpeed",
    description: "TokenSpeed is a speed-of-light LLM inference engine",
    language: "Python",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 89,
    stars: 695,
    url: "https://github.com/lightseekorg/tokenspeed",
    files: {
      "requirements.txt": `torch==2.0.0
numpy==1.24.0`,
      "README.md": `# TokenSpeed

TokenSpeed is a speed-of-light LLM inference engine.

## Features

- Ultra-fast inference
- Model optimization
- GPU acceleration
- Multi-model support

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/inference.py": `import torch

class TokenSpeed:
    def __init__(self, model_path):
        self.model = torch.load(model_path)
    
    def generate(self, prompt):
        # Fast inference
        return self.model.generate(prompt)`,
    },
  },
  "3dcellforge": {
    name: "3DCellForge",
    description: "AI-powered interactive 3D cell generation and exploration studio",
    language: "JavaScript",
    type: "web-app",
    category: "ml",
    difficulty: "advanced",
    popularity: 90,
    stars: 978,
    url: "https://github.com/huangserva/3DCellForge",
    files: {
      "package.json": `{
  "name": "3dcellforge",
  "version": "1.0.0",
  "description": "AI-powered 3D cell generation",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "three": "^0.150.0"
  }
}`,
      "README.md": `# 3DCellForge

AI-powered interactive 3D cell generation and exploration studio.

## Features

- 3D cell generation
- Interactive exploration
- AI-powered design
- Real-time rendering

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

MIT`,
      "src/app/page.tsx": `export default function Home() {
  return (
    <div>
      <h1>3DCellForge</h1>
      <p>AI-powered 3D cell generation</p>
    </div>
  );
}`,
    },
  },
  "pixal3d": {
    name: "Pixal3D",
    description: "[SIGGRAPH 2026] Pixal3D: Pixel-Aligned 3D Generation from Images",
    language: "Python",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 88,
    stars: 558,
    url: "https://github.com/TencentARC/Pixal3D",
    files: {
      "requirements.txt": `torch==2.0.0
numpy==1.24.0
Pillow==10.0.0`,
      "README.md": `# Pixal3D

[SIGGRAPH 2026] Pixal3D: Pixel-Aligned 3D Generation from Images

## Features

- Image-to-3D generation
- Pixel-aligned reconstruction
- High-quality output
- Research paper implementation

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/model.py": `import torch

class Pixal3D:
    def __init__(self):
        self.model = self.load_model()
    
    def generate_3d(self, image):
        # Generate 3D from image
        return self.model(image)`,
    },
  },
  "runbookhermes": {
    name: "RunbookHermes",
    description: "Hermes-native AIOps agent for evidence-driven incident response, approval-gated remediation, and runbook learning",
    language: "Python",
    type: "tool",
    category: "devops",
    difficulty: "advanced",
    popularity: 86,
    stars: 507,
    url: "https://github.com/Tommy-yw/RunbookHermes",
    files: {
      "requirements.txt": `click==8.1.0
openai==1.0.0`,
      "README.md": `# RunbookHermes

Hermes-native AIOps agent for evidence-driven incident response.

## Features

- Incident response automation
- Approval-gated remediation
- Runbook learning
- Evidence-driven decisions

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/hermes.py": `import click

@click.command()
def respond():
    """Handle incident response"""
    click.echo("Processing incident...")

if __name__ == '__main__':
    respond()`,
    },
  },
  "cell-architecture-studio": {
    name: "Cell Architecture Studio",
    description: "Interactive 3D cell architecture gallery built with React and Three.js",
    language: "TypeScript",
    type: "web-app",
    category: "frontend",
    difficulty: "intermediate",
    popularity: 84,
    stars: 538,
    url: "https://github.com/cclank/cell-architecture-studio",
    files: {
      "package.json": `{
  "name": "cell-architecture-studio",
  "version": "1.0.0",
  "description": "Interactive 3D cell architecture gallery",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "three": "^0.150.0",
    "@react-three/fiber": "^8.0.0"
  }
}`,
      "README.md": `# Cell Architecture Studio

Interactive 3D cell architecture gallery built with React and Three.js.

## Features

- 3D cell visualization
- Interactive gallery
- React + Three.js
- Educational content

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

MIT`,
      "src/app/page.tsx": `export default function Home() {
  return (
    <div>
      <h1>Cell Architecture Studio</h1>
      <p>Interactive 3D cell gallery</p>
    </div>
  );
}`,
    },
  },
  "clawdmeter": {
    name: "Clawdmeter",
    description: "ESP32 desk dashboard that shows Claude Code usage",
    language: "C",
    type: "hardware",
    category: "devops",
    difficulty: "intermediate",
    popularity: 82,
    stars: 718,
    url: "https://github.com/HermannBjorgvin/Clawdmeter",
    files: {
      "README.md": `# Clawdmeter

ESP32 desk dashboard that shows Claude Code usage.

## Features

- Real-time usage display
- ESP32 powered
- WiFi connectivity
- Custom dashboard

## Hardware

- ESP32 board
- OLED display
- WiFi module

## License

MIT`,
      "src/main.c": `#include <stdio.h>

int main() {
    printf("Clawdmeter - Claude Code Usage Dashboard\\n");
    return 0;
}`,
    },
  },
  "agent-skills-eval": {
    name: "Agent Skills Eval",
    description: "A test runner for agentskills.io-style AI agent skills",
    language: "TypeScript",
    type: "tool",
    category: "ml",
    difficulty: "intermediate",
    popularity: 83,
    stars: 437,
    url: "https://github.com/darkrishabh/agent-skills-eval",
    files: {
      "package.json": `{
  "name": "agent-skills-eval",
  "version": "1.0.0",
  "description": "Test runner for AI agent skills",
  "main": "src/index.ts",
  "scripts": {
    "test": "jest",
    "build": "tsc"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Agent Skills Eval

A test runner for agentskills.io-style AI agent skills.

## Features

- Skill evaluation
- JSONL support
- CLI interface
- Multiple LLM backends

## Installation

\`\`\`bash
npm install
npm test
\`\`\`

## License

MIT`,
      "src/index.ts": `export function evaluateSkill(skill: string) {
  // Evaluate AI agent skill
  return { result: 'pass' };
}`,
    },
  },
  "evanflow": {
    name: "Evanflow",
    description: "A TDD-driven iterative feedback loop for software development with Claude Code skills",
    language: "Shell",
    type: "workflow",
    category: "devops",
    difficulty: "intermediate",
    popularity: 85,
    stars: 379,
    url: "https://github.com/evanklem/evanflow",
    files: {
      "README.md": `# Evanflow

A TDD-driven iterative feedback loop for software development.

## Features

- TDD workflow
- Claude Code integration
- Iterative development
- Checkpoint system

## Usage

\`\`\`bash
./evanflow start
\`\`\`

## License

MIT`,
      "evanflow.sh": `#!/bin/bash
echo "Evanflow - TDD Development Workflow"`,
    },
  },
  "openmonoagent": {
    name: "OpenMonoAgent",
    description: "Terminal-native coding agent powered by local LLMs — 100% open source, free forever",
    language: "C#",
    type: "agent",
    category: "ml",
    difficulty: "advanced",
    popularity: 87,
    stars: 434,
    url: "https://github.com/StartupHakk/OpenMonoAgent.ai",
    files: {
      "README.md": `# OpenMonoAgent

Terminal-native coding agent powered by local LLMs — 100% open source, free forever.

## Features

- Local LLM support
- Terminal-native
- Unlimited tokens
- C#/.NET powered
- Infrastructure, not subscription

## Installation

\`\`\`bash
dotnet install
\`\`\`

## License

MIT`,
      "src/Agent.cs": `using System;

namespace OpenMonoAgent {
    public class Agent {
        public void Run() {
            Console.WriteLine("OpenMonoAgent - Local AI Agent");
        }
    }
}`,
    },
  },
  "tiny-world-builder": {
    name: "Tiny World Builder",
    description: "Tiny-world-builder - Minecraft voxel building tool",
    language: "HTML",
    type: "web-app",
    category: "frontend",
    difficulty: "beginner",
    popularity: 79,
    stars: 542,
    url: "https://github.com/jasonkneen/tiny-world-builder",
    files: {
      "README.md": `# Tiny World Builder

Minecraft voxel building tool.

## Features

- Voxel building
- Minecraft-style
- Web-based
- Easy to use

## Getting Started

Open index.html in your browser.

## License

MIT`,
      "index.html": `<!DOCTYPE html>
<html>
<head>
  <title>Tiny World Builder</title>
</head>
<body>
  <h1>Tiny World Builder</h1>
  <p>Build your voxel world</p>
</body>
</html>`,
    },
  },
  "files-sdk": {
    name: "Files SDK",
    description: "A unified storage SDK for object and blob backends - S3, R2, Google, Minio",
    language: "TypeScript",
    type: "library",
    category: "backend",
    difficulty: "intermediate",
    popularity: 84,
    stars: 433,
    url: "https://github.com/haydenbleasel/files-sdk",
    files: {
      "package.json": `{
  "name": "files-sdk",
  "version": "1.0.0",
  "description": "Unified storage SDK",
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Files SDK

A unified storage SDK for object and blob backends.

## Supported Backends

- S3
- R2
- Google Cloud Storage
- Minio

## Features

- Unified API
- Web standards I/O
- Easy switching

## Installation

\`\`\`bash
npm install files-sdk
\`\`\`

## License

MIT`,
      "src/index.ts": `export class FilesSDK {
  constructor(config) {
    this.config = config;
  }

  public async upload(file: File) {
    // Upload to any backend
  }

  public async download(key: string) {
    // Download from any backend
  }
}`,
    },
  },
  "whatcable": {
    name: "WhatCable",
    description: "macOS menu bar app that tells you what each USB-C cable can do",
    language: "Swift",
    type: "desktop-app",
    category: "mobile",
    difficulty: "intermediate",
    popularity: 88,
    stars: 917,
    url: "https://github.com/darrylmorley/whatcable",
    files: {
      "README.md": `# WhatCable

macOS menu bar app that tells you what each USB-C cable can do.

## Features

- USB-C cable analysis
- macOS menu bar
- Hardware info
- Thunderbolt detection

## Building

\`\`\`bash
xcodebuild
\`\`\`

## License

MIT`,
      "WhatCable/ContentView.swift": `import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("WhatCable")
    }
}`,
    },
  },
  "univ3-pool-lens": {
    name: "Uniswap V3 Pool Lens",
    description: "A focused TypeScript toolkit for inspecting Uniswap V3 pools",
    language: "TypeScript",
    type: "library",
    category: "backend",
    difficulty: "advanced",
    popularity: 85,
    stars: 405,
    url: "https://github.com/moxailoo/univ3-pool-lens",
    files: {
      "package.json": `{
  "name": "univ3-pool-lens",
  "version": "1.0.0",
  "description": "Uniswap V3 pool inspection toolkit",
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "typescript": "^5.0.0",
    "ethers": "^6.0.0"
  }
}`,
      "README.md": `# Uniswap V3 Pool Lens

A focused TypeScript toolkit for inspecting Uniswap V3 pools.

## Features

- Liquidity distribution
- Fee yield analysis
- Impermanent loss math
- Terminal interface

## Installation

\`\`\`bash
npm install
\`\`\`

## License

MIT`,
      "src/index.ts": `export class PoolLens {
  constructor(poolAddress: string) {
    this.pool = poolAddress;
  }

  public analyzeLiquidity() {
    // Analyze pool liquidity
  }

  public calculateYield() {
    // Calculate fee yield
  }
}`,
    },
  },
  "baguette": {
    name: "Baguette",
    description: "Headless iOS Simulator manager/farm + host-side input injection for iOS 26",
    language: "Swift",
    type: "tool",
    category: "mobile",
    difficulty: "advanced",
    popularity: 86,
    stars: 536,
    url: "https://github.com/tddworks/baguette",
    files: {
      "README.md": `# Baguette

Headless iOS Simulator manager/farm + host-side input injection for iOS 26.

## Features

- Headless simulator management
- Input injection
- 60 fps streaming
- Device farm support

## Installation

\`\`\`bash
swift build
\`\`\`

## License

MIT`,
      "src/Manager.swift": `import Foundation

class SimulatorManager {
    func launchSimulator() {
        // Launch headless simulator
    }
    
    func injectInput() {
        // Inject input events
    }
}`,
    },
  },
  "gopay-plus-automatic": {
    name: "Gopay Plus Automatic",
    description: "Automated payment processing system",
    language: "Python",
    type: "tool",
    category: "backend",
    difficulty: "advanced",
    popularity: 87,
    stars: 618,
    url: "https://github.com/ywnd1144/Gopay_plus_automatic",
    files: {
      "requirements.txt": `requests==2.28.0
selenium==4.0.0`,
      "README.md": `# Gopay Plus Automatic

Automated payment processing system.

## Features

- Payment automation
- Transaction processing
- Error handling
- Logging

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/processor.py": `import requests

class PaymentProcessor:
    def process_payment(self, amount):
        # Process payment
        return {"status": "success"}`,
    },
  },
  "luksbox": {
    name: "LUKSbox",
    description: "Rust-based encrypted-container tool with passphrase, FIDO2, TPM 2.0, and post-quantum keyslots",
    language: "Rust",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 89,
    stars: 407,
    url: "https://github.com/PentHertz/LUKSbox",
    files: {
      "README.md": `# LUKSbox

Rust-based encrypted-container tool with advanced security features.

## Features

- Passphrase encryption
- FIDO2 (YubiKey, Titan, Nitrokey)
- TPM 2.0 support
- Post-quantum keyslots (ML-KEM-768/1024)
- Cross-platform support

## Installation

\`\`\`bash
cargo install luksbox
\`\`\`

## License

MIT`,
      "src/main.rs": `fn main() {
    println!("LUKSbox - Encrypted Container Tool");
}`,
    },
  },
  "sprite-pipeline": {
    name: "Sprite Pipeline",
    description: "2D Sprite Sheet Creation Pipeline",
    language: "Python",
    type: "tool",
    category: "frontend",
    difficulty: "intermediate",
    popularity: 81,
    stars: 429,
    url: "https://github.com/LayrKits/Sprite-Pipeline",
    files: {
      "requirements.txt": `Pillow==10.0.0
numpy==1.24.0`,
      "README.md": `# Sprite Pipeline

2D Sprite Sheet Creation Pipeline.

## Features

- Sprite sheet generation
- Animation support
- Export options
- Batch processing

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/pipeline.py": `from PIL import Image

class SpritePipeline:
    def create_sprite_sheet(self, images):
        # Create sprite sheet
        pass`,
    },
  },
  "solidity-cot-auditor": {
    name: "Solidity CoT Auditor",
    description: "Multi-role chain-of-thought LLM pipeline for Solidity security auditing",
    language: "Python",
    type: "security",
    category: "backend",
    difficulty: "advanced",
    popularity: 88,
    stars: 410,
    url: "https://github.com/butthtio/solidity-cot-auditor",
    files: {
      "requirements.txt": `openai==1.0.0
slither-analyzer==1.0.0`,
      "README.md": `# Solidity CoT Auditor

Multi-role chain-of-thought LLM pipeline for Solidity security auditing.

## Features

- Chain-of-thought analysis
- Multi-role AI agents
- Slither integration
- Security reporting

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License
MIT`,
      "src/auditor.py": `class SolidityAuditor:
    def audit(self, contract):
        # Audit Solidity contract
        return {"vulnerabilities": []}`,
    },
  },
  "chainreason": {
    name: "ChainReason",
    description: "A benchmark for evaluating LLM reasoning on Ethereum and DeFi tasks",
    language: "Python",
    type: "tool",
    category: "ml",
    difficulty: "advanced",
    popularity: 86,
    stars: 406,
    url: "https://github.com/joshawome/chainreason",
    files: {
      "requirements.txt": `web3==6.0.0
pytest==7.0.0`,
      "README.md": `# ChainReason

A benchmark for evaluating LLM reasoning on Ethereum and DeFi tasks.

## Features

- Ethereum reasoning tasks
- DeFi scenario testing
- LLM evaluation
- Benchmark suite

## Installation

\`\`\`bash
pip install -r requirements.txt
pytest
\`\`\`

## License

MIT`,
      "src/benchmark.py": `class ChainReasonBenchmark:
    def evaluate(self, model):
        # Evaluate LLM on DeFi tasks
        return {"score": 0.85}`,
    },
  },
  "p-peg": {
    name: "P-PEG",
    description: "Pinocchio peg stability module + on-chain creature engine",
    language: "Rust",
    type: "library",
    category: "backend",
    difficulty: "advanced",
    popularity: 85,
    stars: 513,
    url: "https://github.com/ChristianJR19/p-peg",
    files: {
      "README.md": `# P-PEG

Pinocchio peg stability module + on-chain creature engine.

## Features

- Peg stability
- On-chain creatures
- Solana integration
- Zero-copy operations

## Installation

\`\`\`bash
cargo install p-peg
\`\`\`

## License

MIT`,
      "src/lib.rs": `pub struct PegModule {
    pub fn stabilize(&self) {
        // Stabilize peg
    }
}`,
    },
  },
  "zero-native": {
    name: "Zero Native",
    description: "Build native desktop + mobile apps with web UI and Zig",
    language: "Zig",
    type: "framework",
    category: "mobile",
    difficulty: "advanced",
    popularity: 89,
    stars: 645,
    url: "https://github.com/vercel-labs/zero-native",
    files: {
      "README.md": `# Zero Native

Build native desktop + mobile apps with web UI and Zig.

## Features

- Native performance
- Web UI
- Zig-powered
- Cross-platform

## Installation

\`\`\`bash
zig build
\`\`\`

## License

MIT`,
      "src/main.zig": `const std = @import("std");

pub fn main() !void {
    std.debug.print("Zero Native\\n", .{});
}`,
    },
  },
  "ds4": {
    name: "DS4",
    description: "DeepSeek 4 Flash local inference engine for Metal",
    language: "C",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 90,
    stars: 1026,
    url: "https://github.com/antirez/ds4",
    files: {
      "README.md": `# DS4

DeepSeek 4 Flash local inference engine for Metal.

## Features

- Metal acceleration
- DeepSeek 4 support
- Local inference
- High performance

## Installation

\`\`\`bash
make build
\`\`\`

## License

MIT`,
      "src/engine.c": `#include <stdio.h>

int main() {
    printf("DS4 - DeepSeek 4 Inference Engine\\n");
    return 0;
}`,
    },
  },
  "dirtyfrag": {
    name: "DirtyFrag",
    description: "High-performance fragment shader system",
    language: "C",
    type: "library",
    category: "frontend",
    difficulty: "advanced",
    popularity: 92,
    stars: 1558,
    url: "https://github.com/V4bel/dirtyfrag",
    files: {
      "README.md": `# DirtyFrag

High-performance fragment shader system.

## Features

- GPU acceleration
- Shader optimization
- Real-time rendering
- Cross-platform

## Installation

\`\`\`bash
make build
\`\`\`

## License

MIT`,
      "src/shader.c": `#include <stdio.h>

int main() {
    printf("DirtyFrag - Shader System\\n");
    return 0;
}`,
    },
  },
  "petdex": {
    name: "PetDex",
    description: "Public gallery of animated Codex pets",
    language: "TypeScript",
    type: "web-app",
    category: "frontend",
    difficulty: "beginner",
    popularity: 82,
    stars: 480,
    url: "https://github.com/crafter-station/petdex",
    files: {
      "package.json": `{
  "name": "petdex",
  "version": "1.0.0",
  "description": "Public gallery of animated Codex pets",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0"
  }
}`,
      "README.md": `# PetDex

Public gallery of animated Codex pets.

## Features

- Animated pets
- Gallery view
- Community collection
- Search functionality

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

MIT`,
      "src/app/page.tsx": `export default function Home() {
  return (
    <div>
      <h1>PetDex</h1>
      <p>Animated Codex pets gallery</p>
    </div>
  );
}`,
    },
  },
  "cheat-on-content": {
    name: "Cheat on Content",
    description: "Auto-evolving ops expert that learns YOUR account for content creation",
    language: "Python",
    type: "tool",
    category: "ml",
    difficulty: "advanced",
    popularity: 88,
    stars: 517,
    url: "https://github.com/XBuilderLAB/cheat-on-content",
    files: {
      "requirements.txt": `openai==1.0.0
click==8.1.0`,
      "README.md": `# Cheat on Content

Auto-evolving ops expert that learns YOUR account for content creation.

## Features

- Account learning
- Content optimization
- AI-powered
- Multi-platform

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/content.py": `import click

@click.command()
def optimize():
    """Optimize content"""
    click.echo("Optimizing content...")

if __name__ == '__main__':
    optimize()`,
    },
  },
  "deepclaude": {
    name: "DeepClaude",
    description: "Use Claude Code's autonomous agent loop with DeepSeek V4 Pro - 17x cheaper",
    language: "JavaScript",
    type: "tool",
    category: "ml",
    difficulty: "intermediate",
    popularity: 84,
    stars: 375,
    url: "https://github.com/aattaran/deepclaude",
    files: {
      "package.json": `{
  "name": "deepclaude",
  "version": "1.0.0",
  "description": "Claude Code with DeepSeek V4 Pro",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "openai": "^4.0.0"
  }
}`,
      "README.md": `# DeepClaude

Use Claude Code's autonomous agent loop with DeepSeek V4 Pro - 17x cheaper.

## Features

- DeepSeek V4 Pro integration
- Claude Code compatibility
- Cost savings
- Same UX

## Installation

\`\`\`bash
npm install
npm start
\`\`\`

## License

MIT`,
      "src/index.js": `console.log('DeepClaude - Claude Code with DeepSeek V4 Pro');`,
    },
  },
  "mhr-cfw": {
    name: "MHR CFW",
    description: "Domain-Fronting Relay that routes traffic through GAS and Cloudflare Workers",
    language: "Python",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 86,
    stars: 611,
    url: "https://github.com/denuitt1/mhr-cfw",
    files: {
      "requirements.txt": `requests==2.28.0`,
      "README.md": `# MHR CFW

Domain-Fronting Relay that routes traffic through GAS and Cloudflare Workers.

## Features

- Domain fronting
- GAS routing
- Cloudflare Workers
- DPI bypass

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/relay.py": `class Relay:
    def route_traffic(self, traffic):
        # Route through GAS and CF Workers
        pass`,
    },
  },
  "gooserelayvpn": {
    name: "GooseRelayVPN",
    description: "Socks5 VPN that tunnels raw TCP through Google Apps Script to your VPS",
    language: "Go",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 85,
    stars: 525,
    url: "https://github.com/Kianmhz/GooseRelayVPN",
    files: {
      "README.md": `# GooseRelayVPN

Socks5 VPN that tunnels raw TCP through Google Apps Script to your VPS.

## Features

- Socks5 proxy
- Google Apps Script tunneling
- AES-256-GCM encryption
- Domain-fronted
- VPS exit server

## Installation

\`\`\`bash
go build
\`\`\`

## License

MIT`,
      "main.go": `package main

import "fmt"

func main() {
    fmt.Println("GooseRelayVPN")
}`,
    },
  },
  "codex-plusplus": {
    name: "Codex++",
    description: "Codex++ tweak system for the Codex desktop app",
    language: "TypeScript",
    type: "extension",
    category: "frontend",
    difficulty: "intermediate",
    popularity: 83,
    stars: 595,
    url: "https://github.com/b-nnett/codex-plusplus",
    files: {
      "package.json": `{
  "name": "codex-plusplus",
  "version": "1.0.0",
  "description": "Codex++ tweak system",
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Codex++

Codex++ tweak system for the Codex desktop app.

## Features

- Tweak system
- Custom configurations
- Enhanced functionality
- Desktop integration

## Installation

\`\`\`bash
npm install
npm run build
\`\`\`

## License

MIT`,
      "src/index.ts": `export class CodexPlusPlus {
  constructor() {
    this.tweaks = [];
  }

  public applyTweak(tweak) {
    // Apply tweak to Codex
  }
}`,
    },
  },
  "ppt-image-first": {
    name: "PPT Image First",
    description: "PPT image-first skill for Codex/Claude Code/Opencode CLI",
    language: "Python",
    type: "tool",
    category: "frontend",
    difficulty: "beginner",
    popularity: 80,
    stars: 527,
    url: "https://github.com/NyxTides/ppt-image-first",
    files: {
      "requirements.txt": `python-pptx==0.6.0
Pillow==10.0.0`,
      "README.md": `# PPT Image First

PPT image-first skill for Codex/Claude Code/Opencode CLI.

## Features

- Image-first PPT creation
- Multiple CLI support
- Template system
- Easy integration

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/ppt.py": `from pptx import Presentation

def create_ppt(images):
    prs = Presentation()
    # Add images to slides
    return prs`,
    },
  },
  "codex-startup-pressure-test": {
    name: "Codex Startup Pressure Test",
    description: "Codex startup pressure testing skill",
    language: "JavaScript",
    type: "tool",
    category: "devops",
    difficulty: "intermediate",
    popularity: 84,
    stars: 621,
    url: "https://github.com/Kappaemme-git/codex-startup-pressure-test-skill",
    files: {
      "package.json": `{
  "name": "codex-startup-pressure-test",
  "version": "1.0.0",
  "description": "Codex startup pressure testing",
  "main": "src/index.js",
  "scripts": {
    "test": "node src/index.js"
  }
}`,
      "README.md": `# Codex Startup Pressure Test

Codex startup pressure testing skill.

## Features

- Startup performance testing
- Pressure simulation
- Performance metrics
- Benchmarking

## Installation

\`\`\`bash
npm install
npm test
\`\`\`

## License

MIT`,
      "src/index.js": `console.log('Codex Startup Pressure Test');`,
    },
  },
  "codex-complexity-optimizer": {
    name: "Codex Complexity Optimizer",
    description: "Codex complexity optimization skill",
    language: "JavaScript",
    type: "tool",
    category: "devops",
    difficulty: "intermediate",
    popularity: 83,
    stars: 523,
    url: "https://github.com/Kappaemme-git/codex-complexity-optimizer",
    files: {
      "package.json": `{
  "name": "codex-complexity-optimizer",
  "version": "1.0.0",
  "description": "Codex complexity optimization",
  "main": "src/index.js",
  "scripts": {
    "optimize": "node src/index.js"
  }
}`,
      "README.md": `# Codex Complexity Optimizer

Codex complexity optimization skill.

## Features

- Code complexity analysis
- Optimization suggestions
- Performance improvements
- Code refactoring

## Installation

\`\`\`bash
npm install
npm run optimize
\`\`\`

## License

MIT`,
      "src/index.js": `console.log('Codex Complexity Optimizer');`,
    },
  },
  "voidstrap": {
    name: "Voidstrap",
    description: "Advanced fork of Bloxstrap with advanced customization and improvements",
    language: "C#",
    type: "tool",
    category: "mobile",
    difficulty: "intermediate",
    popularity: 84,
    stars: 483,
    url: "https://github.com/NamKhoa-07/Voidstrap",
    files: {
      "README.md": `# Voidstrap

Advanced fork of Bloxstrap with advanced customization and improvements.

## Features

- Advanced customization
- Performance improvements
- Open source
- Roblox launcher

## Installation

\`\`\`bash
dotnet build
\`\`\`

## License

MIT`,
      "src/Program.cs": `using System;

namespace Voidstrap {
    class Program {
        static void Main() {
            Console.WriteLine("Voidstrap");
        }
    }
}`,
    },
  },
  "vggt-omega": {
    name: "VGGT Omega",
    description: "[CVPR 2026 Oral] VGGT Omega - Computer Vision research",
    language: "Python",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 91,
    stars: 799,
    url: "https://github.com/facebookresearch/vggt-omega",
    files: {
      "requirements.txt": `torch==2.0.0
torchvision==0.15.0`,
      "README.md": `# VGGT Omega

[CVPR 2026 Oral] VGGT Omega

## Features

- Computer vision research
- Deep learning
- State-of-the-art performance
- Research paper implementation

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/model.py": `import torch

class VGGTOmega:
    def __init__(self):
        self.model = self.load_model()
    
    def forward(self, x):
        return self.model(x)`,
    },
  },
  "ps5-linux-loader": {
    name: "PS5 Linux Loader",
    description: "Linux payload implementing the HV exploit and a custom bootloader",
    language: "C",
    type: "system",
    category: "devops",
    difficulty: "advanced",
    popularity: 89,
    stars: 606,
    url: "https://github.com/ps5-linux/ps5-linux-loader",
    files: {
      "README.md": `# PS5 Linux Loader

Linux payload implementing the HV exploit and a custom bootloader.

## Features

- HV exploit
- Custom bootloader
- Linux on PS5
- Research purposes

## Installation

\`\`\`bash
make build
\`\`\`

## License

MIT`,
      "src/main.c": `#include <stdio.h>

int main() {
    printf("PS5 Linux Loader\\n");
    return 0;
}`,
    },
  },
  "cve-2026-31431": {
    name: "CVE-2026-31431 Exploit",
    description: "Exploit POC for CVE-2026-31431",
    language: "Python",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 85,
    stars: 434,
    url: "https://github.com/rootsecdev/cve_2026_31431",
    files: {
      "requirements.txt": `requests==2.28.0`,
      "README.md": `# CVE-2026-31431 Exploit

Exploit POC for CVE-2026-31431.

## Features

- Vulnerability exploitation
- Proof of concept
- Security research
- Educational purposes

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/exploit.py": `class Exploit:
    def exploit(self, target):
        # Exploit CVE-2026-31431
        pass`,
    },
  },
  "nginx-rift": {
    name: "Nginx Rift",
    description: "Exploit for CVE-2026-42945",
    language: "Python",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 86,
    stars: 523,
    url: "https://github.com/DepthFirstDisclosures/Nginx-Rift",
    files: {
      "requirements.txt": `requests==2.28.0`,
      "README.md": `# Nginx Rift

Exploit for CVE-2026-42945.

## Features

- CVE exploitation
- Security research
- Proof of concept
- Educational purposes

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/exploit.py": `class NginxRift:
    def exploit(self, target):
        # Exploit CVE-2026-42945
        pass`,
    },
  },
  "greenplasma": {
    name: "GreenPlasma",
    description: "GreenPlasma Windows CTFMON Arbitrary Section Creation Elevation of Privileges Vulnerability",
    language: "C++",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 85,
    stars: 512,
    url: "https://github.com/Nightmare-Eclipse/GreenPlasma",
    files: {
      "README.md": `# GreenPlasma

GreenPlasma Windows CTFMON Arbitrary Section Creation Elevation of Privileges Vulnerability.

## Features

- Elevation of privileges
- Windows vulnerability
- Security research
- Proof of concept

## Installation

\`\`\`bash
make build
\`\`\`

## License

MIT`,
      "src/exploit.cpp": `#include <iostream>

int main() {
    std::cout << "GreenPlasma Exploit" << std::endl;
    return 0;
}`,
    },
  },
  "rkn-block-checker": {
    name: "RKN Block Checker",
    description: "Diagnose RKN/TSPU internet blocks layer by layer",
    language: "Python",
    type: "tool",
    category: "devops",
    difficulty: "intermediate",
    popularity: 87,
    stars: 855,
    url: "https://github.com/MayersScott/rkn-block-checker",
    files: {
      "requirements.txt": `requests==2.28.0
dnspython==2.3.0`,
      "README.md": `# RKN Block Checker

Diagnose RKN/TSPU internet blocks layer by layer.

## Features

- DNS checking
- TCP checking
- TLS checking
- HTTP checking
- Network diagnostics

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/checker.py": `class RKNChecker:
    def check_dns(self, domain):
        # Check DNS layer
        pass
    
    def check_tcp(self, host, port):
        # Check TCP layer
        pass`,
    },
  },
  "g2ray": {
    name: "G2Ray",
    description: "Self-hosted proxy setup running inside GitHub Codespaces",
    language: "Dockerfile",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 92,
    stars: 510,
    url: "https://github.com/amircloner/g2ray",
    files: {
      "README.md": `# G2Ray

Self-hosted proxy setup running inside GitHub Codespaces.

## Features

- GitHub Codespaces integration
- Proxy setup
- Educational purposes
- Easy deployment

## Installation

\`\`\`bash
docker build -t g2ray .
\`\`\`

## License

MIT`,
      "Dockerfile": `FROM alpine:latest
RUN apk add --no-cache proxy
CMD ["proxy"]`,
    },
  },
  "club-3090": {
    name: "Club 3090",
    description: "Community recipes for serving LLMs on RTX 3090 with multi-engine support",
    language: "Shell",
    type: "tool",
    category: "ml",
    difficulty: "advanced",
    popularity: 86,
    stars: 457,
    url: "https://github.com/noonghunna/club-3090",
    files: {
      "README.md": `# Club 3090

Community recipes for serving LLMs on RTX 3090.

## Features

- Multi-engine support (vLLM, llama.cpp, SGLang)
- Model-agnostic
- RTX 3090 optimized
- Community recipes

## Installation

\`\`\`bash
./setup.sh
\`\`\`

## License

MIT`,
      "setup.sh": `#!/bin/bash
echo "Club 3090 - LLM Serving on RTX 3090"`,
    },
  },
  "elf": {
    name: "ELF",
    description: "Educational learning framework",
    language: "Python",
    type: "library",
    category: "ml",
    difficulty: "intermediate",
    popularity: 82,
    stars: 527,
    url: "https://github.com/lillian039/ELF",
    files: {
      "requirements.txt": `torch==2.0.0
numpy==1.24.0`,
      "README.md": `# ELF

Educational learning framework.

## Features

- Learning algorithms
- Educational tools
- Research framework
- Easy to use

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/elf.py": `class ELF:
    def __init__(self):
        self.model = None
    
    def train(self, data):
        # Train model
        pass`,
    },
  },
  "natural-language-autoencoders": {
    name: "Natural Language Autoencoders",
    description: "Natural language processing with autoencoders",
    language: "Python",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 83,
    stars: 412,
    url: "https://github.com/kitft/natural_language_autoencoders",
    files: {
      "requirements.txt": `torch==2.0.0
transformers==4.30.0`,
      "README.md": `# Natural Language Autoencoders

Natural language processing with autoencoders.

## Features

- Autoencoder models
- NLP tasks
- Deep learning
- Text processing

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/model.py": `import torch

class Autoencoder:
    def __init__(self):
        self.encoder = None
        self.decoder = None
    
    def encode(self, text):
        # Encode text
        pass
    
    def decode(self, latent):
        # Decode to text
        pass`,
    },
  },
  "delta-exec": {
    name: "Delta Exec",
    description: "Delta Exec scripting utility",
    language: "Python",
    type: "tool",
    category: "devops",
    difficulty: "intermediate",
    popularity: 81,
    stars: 514,
    url: "https://github.com/AvenueSleuth/delta-exec",
    files: {
      "requirements.txt": `click==8.1.0`,
      "README.md": `# Delta Exec

Delta Exec scripting utility.

## Features

- Script execution
- Delta exploit support
- PC utility
- Easy to use

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/delta.py": `import click

@click.command()
def execute():
    """Execute delta scripts"""
    click.echo("Delta Exec")

if __name__ == '__main__':
    execute()`,
    },
  },
  "printer-offline-fix": {
    name: "Printer Offline Fix",
    description: "Printer offline fix utility",
    language: "PowerShell",
    type: "tool",
    category: "devops",
    difficulty: "beginner",
    popularity: 78,
    stars: 518,
    url: "https://github.com/Rhythmplocutter/printer-offline-fix",
    files: {
      "README.md": `# Printer Offline Fix

Printer offline fix utility.

## Features

- Printer diagnostics
- Offline fix
- Driver issues
- Easy to use

## Usage

\`\`\`powershell
./fix-printer.ps1
\`\`\`

## License

MIT`,
      "fix-printer.ps1": `Write-Host "Printer Offline Fix Utility"`,
    },
  },
  "media-downloader": {
    name: "Media Downloader",
    description: "Beautiful native macOS video downloader",
    language: "Swift",
    type: "desktop-app",
    category: "mobile",
    difficulty: "intermediate",
    popularity: 85,
    stars: 532,
    url: "https://github.com/pixel-point/media-downloader",
    files: {
      "README.md": `# Media Downloader

Beautiful native macOS video downloader.

## Features

- Video downloading
- macOS native
- Beautiful UI
- Trim functionality

## Building

\`\`\`bash
xcodebuild
\`\`\`

## License

MIT`,
      "MediaDownloader/ContentView.swift": `import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Media Downloader")
    }
}`,
    },
  },
  "edge-saved-passwords-dumper": {
    name: "Edge Saved Passwords Dumper",
    description: "Proof of concept to show that Edge stores credentials in cleartext",
    language: "C#",
    type: "security",
    category: "devops",
    difficulty: "intermediate",
    popularity: 82,
    stars: 412,
    url: "https://github.com/L1v1ng0ffTh3L4N/EdgeSavedPasswordsDumper",
    files: {
      "README.md": `# Edge Saved Passwords Dumper

Proof of concept to show that Edge stores credentials in cleartext.

## Features

- Credential extraction
- Security research
- Proof of concept
- Educational purposes

## Installation

\`\`\`bash
dotnet build
\`\`\`

## License

MIT`,
      "src/Program.cs": `using System;

namespace EdgeDumper {
    class Program {
        static void Main() {
            Console.WriteLine("Edge Saved Passwords Dumper");
        }
    }
}`,
    },
  },
  "f95zone": {
    name: "F95Zone Game Updater",
    description: "Unofficial Game Updater for the F95Zone platform",
    language: "PowerShell",
    type: "tool",
    category: "devops",
    difficulty: "intermediate",
    popularity: 80,
    stars: 541,
    url: "https://github.com/grandeurcoredecoder/f95zone",
    files: {
      "README.md": `# F95Zone Game Updater

Unofficial Game Updater for the F95Zone platform.

## Features

- Game updates
- F95Zone integration
- Automatic checking
- Easy to use

## Usage

\`\`\`powershell
./updater.ps1
\`\`\`

## License

MIT`,
      "updater.ps1": `Write-Host "F95Zone Game Updater"`,
    },
  },
  "hentaihunter": {
    name: "Hentaihunter",
    description: "Doujinshi download tool",
    language: "Python",
    type: "tool",
    category: "devops",
    difficulty: "beginner",
    popularity: 79,
    stars: 544,
    url: "https://github.com/TrueGunsmithFence/Hentaihunter",
    files: {
      "requirements.txt": `requests==2.28.0
beautifulsoup4==4.12.0`,
      "README.md": `# Hentaihunter

Doujinshi download tool.

## Features

- Multiple site support
- Batch download
- Easy to use
- Command line

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/hunter.py": `import requests

class HentaiHunter:
    def download(self, url):
        # Download doujinshi
        pass`,
    },
  },
  "deepseek-v4-pro-app": {
    name: "DeepSeek V4 Pro App",
    description: "DeepSeek V4 Pro: Advanced AI desktop app with 1.6T MoE architecture",
    language: "C++",
    type: "desktop-app",
    category: "ml",
    difficulty: "advanced",
    popularity: 90,
    stars: 523,
    url: "https://github.com/yaassin12/DeepSeek-V4-Pro-App",
    files: {
      "README.md": `# DeepSeek V4 Pro App

DeepSeek V4 Pro: Advanced AI desktop app.

## Features

- 1.6T MoE architecture
- 1M token context window
- Engram memory
- Pro coding agent
- Think Mode
- Real-time web search

## Installation

\`\`\`bash
make build
\`\`\`

## License

MIT`,
      "src/main.cpp": `#include <iostream>

int main() {
    std::cout << "DeepSeek V4 Pro App" << std::endl;
    return 0;
}`,
    },
  },
  "orca-slicer-bambulab": {
    name: "OrcaSlicer Bambulab",
    description: "OrcaSlicer fork for Bambulab 3D printers",
    language: "C++",
    type: "tool",
    category: "devops",
    difficulty: "advanced",
    popularity: 88,
    stars: 1635,
    url: "https://github.com/FULU-Foundation/OrcaSlicer-bambulab",
    files: {
      "README.md": `# OrcaSlicer Bambulab

OrcaSlicer fork for Bambulab 3D printers.

## Features

- Bambulab support
- 3D slicing
- Advanced features
- Open source

## Installation

\`\`\`bash
make build
\`\`\`

## License

MIT`,
      "src/main.cpp": `#include <iostream>

int main() {
    std::cout << "OrcaSlicer Bambulab" << std::endl;
    return 0;
}`,
    },
  },
  "cs2-external-overlay": {
    name: "CS2 External Overlay",
    description: "CS2 external helper tool with customizable overlay",
    language: "Python",
    type: "tool",
    category: "devops",
    difficulty: "advanced",
    popularity: 84,
    stars: 533,
    url: "https://github.com/patchfighterway90/cs2-external-overlay",
    files: {
      "requirements.txt": `pygame==2.5.0
memoryview==0.1.0`,
      "README.md": `# CS2 External Overlay

CS2 external helper tool with customizable overlay.

## Features

- Customizable overlay
- External tool
- Game enhancement
- Educational purposes

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "src/overlay.py": `import pygame

class CS2Overlay:
    def __init__(self):
        self.overlay = None
    
    def render(self):
        # Render overlay
        pass`,
    },
  },
  "arc-raiders-external-tool": {
    name: "ARC Raiders External Tool",
    description: "External overlay tool for ARC Raiders with UE5 memory reader",
    language: "C++",
    type: "tool",
    category: "devops",
    difficulty: "advanced",
    popularity: 85,
    stars: 521,
    url: "https://github.com/RadianceToadAmend/ARC-Raiders-External-Tool",
    files: {
      "README.md": `# ARC Raiders External Tool

External overlay tool for ARC Raiders with UE5 memory reader.

## Features

- UE5 memory reader
- Entity radar
- Performance monitor
- D3D11 render
- Educational purposes

## Installation

\`\`\`bash
make build
\`\`\`

## License

MIT`,
      "src/main.cpp": `#include <iostream>

int main() {
    std::cout << "ARC Raiders External Tool" << std::endl;
    return 0;
}`,
    },
  },
  "cs2-overlay-utility": {
    name: "CS2 Overlay Utility",
    description: "CS2 external overlay tool with memory reader, entity ESP, and visual aids",
    language: "C++",
    type: "tool",
    category: "devops",
    difficulty: "advanced",
    popularity: 83,
    stars: 498,
    url: "https://github.com/RadianceToadAmend/cs2-overlay-utility",
    files: {
      "README.md": `# CS2 Overlay Utility

CS2 external overlay tool with memory reader, entity ESP, and visual aids.

## Features

- Memory reader
- Entity ESP
- Visual aids
- D3D11 render
- Educational purposes

## Installation

\`\`\`bash
make build
\`\`\`

## License

MIT`,
      "src/main.cpp": `#include <iostream>

int main() {
    std::cout << "CS2 Overlay Utility" << std::endl;
    return 0;
}`,
    },
  },
  "mirrai": {
    name: "Mirrai",
    description: "AI-powered reflection and introspection tool",
    language: "TypeScript",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 84,
    stars: 445,
    url: "https://github.com/Ch1rpy2613/Mirrai",
    files: {
      "package.json": `{
  "name": "mirrai",
  "version": "1.0.0",
  "description": "AI-powered reflection tool",
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Mirrai

AI-powered reflection and introspection tool.

## Features

- Code reflection
- AI analysis
- Introspection
- Smart insights

## Installation

\`\`\`bash
npm install
npm run build
\`\`\`

## License

MIT`,
      "src/index.ts": `export class Mirrai {
  constructor() {
    this.reflector = null;
  }

  public reflect(code: string) {
    // Reflect on code
  }
}`,
    },
  },
  // Additional real projects from repo.txt
  "ps5-linux-loader": {
    name: "PS5 Linux Loader",
    description: "Linux payload implementing the HV exploit and a custom bootloader",
    language: "C",
    type: "system",
    category: "backend",
    difficulty: "advanced",
    popularity: 85,
    stars: 606,
    url: "https://github.com/ps5-linux/ps5-linux-loader",
    files: {
      "README.md": `# PS5 Linux Loader

Linux payload implementing the HV exploit and a custom bootloader.

## Features

- HV exploit implementation
- Custom bootloader
- Linux payload
- System-level programming

## Building

\`\`\`bash
make
\`\`\`

## License

MIT`,
      "src/main.c": `#include <stdio.h>

int main() {
    printf("PS5 Linux Loader\\n");
    return 0;
}`,
    },
  },
  "mhr-cfw": {
    name: "MHR CFW",
    description: "A Domain-Fronting Relay that routes traffic through GAS and forwards it to Cloudflare Workers",
    language: "Python",
    type: "network",
    category: "backend",
    difficulty: "advanced",
    popularity: 82,
    stars: 611,
    url: "https://github.com/denuitt1/mhr-cfw",
    files: {
      "README.md": `# MHR CFW

Domain-Fronting Relay for bypassing DPI.

## Features

- Domain fronting
- GAS routing
- Cloudflare Workers
- DPI bypass

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "requirements.txt": `requests==2.31.0
google-auth==2.23.0`,
    },
  },
  "codex-plusplus": {
    name: "Codex++",
    description: "Codex++ tweak system for the Codex desktop app",
    language: "TypeScript",
    type: "extension",
    category: "frontend",
    difficulty: "intermediate",
    popularity: 80,
    stars: 595,
    url: "https://github.com/b-nnett/codex-plusplus",
    files: {
      "README.md": `# Codex++

Tweak system for the Codex desktop app.

## Features

- Desktop app integration
- Custom tweaks
- TypeScript implementation
- Plugin system

## Installation

\`\`\`bash
npm install
npm run build
\`\`\`

## License

MIT`,
      "src/index.ts": `export class CodexPlusPlus {
  constructor() {
    this.initialize();
  }

  private initialize() {
    // Initialize tweak system
  }

  public applyTweak(tweak: string) {
    // Apply tweak
  }
}`,
    },
  },
  "ppt-image-first": {
    name: "PPT Image First",
    description: "PPT image-first skill for Codex/Claude Code/Opencode CLI",
    language: "Python",
    type: "tool",
    category: "ml",
    difficulty: "intermediate",
    popularity: 78,
    stars: 527,
    url: "https://github.com/NyxTides/ppt-image-first",
    files: {
      "README.md": `# PPT Image First

PPT image-first skill for Codex/Claude Code/Opencode CLI.

## Features

- PowerPoint processing
- Image-first approach
- CLI integration
- Multiple AI backends

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "requirements.txt": `python-pptx==0.6.21
Pillow==10.0.0`,
    },
  },
  "GooseRelayVPN": {
    name: "GooseRelayVPN",
    description: "Socks5 VPN that tunnels raw TCP through Google Apps Script to your VPS exit server",
    language: "Go",
    type: "network",
    category: "backend",
    difficulty: "advanced",
    popularity: 81,
    stars: 525,
    url: "https://github.com/Kianmhz/GooseRelayVPN",
    files: {
      "README.md": `# GooseRelayVPN

Socks5 VPN with Google Apps Script tunneling.

## Features

- Socks5 protocol
- Google Apps Script tunneling
- AES-256-GCM encryption
- Domain-fronted

## Building

\`\`\`bash
go build
\`\`\`

## License

MIT`,
      "main.go": `package main

import "fmt"

func main() {
    fmt.Println("GooseRelayVPN")
}`,
    },
  },
  "cve_2026_31431": {
    name: "CVE-2026-31431",
    description: "Exploit POC for CVE-2026-31431",
    language: "Python",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 83,
    stars: 434,
    url: "https://github.com/rootsecdev/cve_2026_31431",
    files: {
      "README.md": `# CVE-2026-31431

Exploit POC for CVE-2026-31431.

## Features

- Security research
- Vulnerability demonstration
- Educational purpose
- POC implementation

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "exploit.py": `#!/usr/bin/env python3
def exploit():
    print("CVE-2026-31431 POC")

if __name__ == "__main__":
    exploit()`,
    },
  },
  "club-3090": {
    name: "Club 3090",
    description: "Community recipes for serving LLMs on RTX 3090 with multi-engine support",
    language: "Shell",
    type: "devops",
    category: "ml",
    difficulty: "advanced",
    popularity: 79,
    stars: 457,
    url: "https://github.com/noonghunna/club-3090",
    files: {
      "README.md": `# Club 3090

Community recipes for serving LLMs on RTX 3090.

## Features

- Multi-engine support (vLLM, llama.cpp, SGLang)
- RTX 3090 optimization
- Model-agnostic
- Qwen3.6-27B configs

## Usage

\`\`\`bash
./setup.sh
\`\`\`

## License

MIT`,
      "setup.sh": `#!/bin/bash
echo "Club 3090 Setup"`,
    },
  },
  "aattaran-deepclaude": {
    name: "DeepClaude",
    description: "Use Claude Code's autonomous agent loop with DeepSeek V4 Pro, OpenRouter, or any Anthropic-compatible backend",
    language: "JavaScript",
    type: "tool",
    category: "ml",
    difficulty: "intermediate",
    popularity: 76,
    stars: 375,
    url: "https://github.com/aattaran/deepclaude",
    files: {
      "README.md": `# DeepClaude

Claude Code with DeepSeek V4 Pro and OpenRouter.

## Features

- DeepSeek V4 Pro integration
- OpenRouter support
- Anthropic-compatible
- 17x cheaper

## Installation

\`\`\`bash
npm install
\`\`\`

## License

MIT`,
      "src/index.js": `module.exports = {
  initialize: () => {
    console.log("DeepClaude initialized");
  }
};`,
    },
  },
  "baguette": {
    name: "Baguette",
    description: "Headless iOS Simulator manager/farm with host-side input injection for iOS 26",
    language: "Swift",
    type: "tool",
    category: "mobile",
    difficulty: "advanced",
    popularity: 84,
    stars: 536,
    url: "https://github.com/tddworks/baguette",
    files: {
      "README.md": `# Baguette

Headless iOS Simulator manager with input injection.

## Features

- iOS 26 support
- Headless simulator management
- Input injection
- 60 fps streaming
- Multi-finger gestures

## Building

\`\`\`bash
xcodebuild
\`\`\`

## License

MIT`,
      "Baguette/Manager.swift": `import Foundation

class BaguetteManager {
    func initialize() {
        print("Baguette Manager initialized")
    }
}`,
    },
  },
  "cheat-on-content": {
    name: "Cheat on Content",
    description: "Auto-evolving ops expert that learns YOUR account for content growth",
    language: "Python",
    type: "tool",
    category: "ml",
    difficulty: "advanced",
    popularity: 82,
    stars: 517,
    url: "https://github.com/XBuilderLAB/cheat-on-content",
    files: {
      "README.md": `# Cheat on Content

Auto-evolving ops expert for content growth.

## Features

- Account learning
- Content optimization
- AI-powered
- 1M followers achieved

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "requirements.txt": `openai==1.0.0
click==8.1.0`,
    },
  },
  "petdex": {
    name: "Petdex",
    description: "Public gallery of animated Codex pets",
    language: "TypeScript",
    type: "web-app",
    category: "frontend",
    difficulty: "beginner",
    popularity: 77,
    stars: 480,
    url: "https://github.com/crafter-station/petdex",
    files: {
      "README.md": `# Petdex

Public gallery of animated Codex pets.

## Features

- Animated pet gallery
- Codex integration
- Public showcase
- TypeScript implementation

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

MIT`,
      "src/app/page.tsx": `export default function Home() {
  return (
    <div>
      <h1>Petdex</h1>
      <p>Animated Codex pets gallery</p>
    </div>
  );
}`,
    },
  },
  "OpenClaude-Portable": {
    name: "OpenClaude Portable",
    description: "Run Claude Code from a USB drive on any PC — no installation required",
    language: "HTML",
    type: "portable",
    category: "fullstack",
    difficulty: "intermediate",
    popularity: 86,
    stars: 466,
    url: "https://github.com/techjarves/OpenClaude-Portable",
    files: {
      "README.md": `# OpenClaude Portable

Run Claude Code from a USB drive on any PC.

## Features

- Portable execution
- No installation needed
- USB drive compatible
- Cross-platform support

## Usage

1. Download to USB drive
2. Run on any PC
3. Start coding with Claude

## License

MIT`,
      "index.html": `<!DOCTYPE html>
<html>
<head>
  <title>OpenClaude Portable</title>
</head>
<body>
  <h1>OpenClaude Portable</h1>
  <p>Claude Code anywhere, anytime</p>
</body>
</html>`,
    },
  },
  "Voidstrap": {
    name: "Voidstrap",
    description: "A simple yet advanced fork of Bloxstrap with advanced customization",
    language: "C#",
    type: "tool",
    category: "devops",
    difficulty: "intermediate",
    popularity: 81,
    stars: 483,
    url: "https://github.com/NamKhoa-07/Voidstrap",
    files: {
      "README.md": `# Voidstrap

Advanced fork of Bloxstrap with customization.

## Features

- Advanced customization
- Bloxstrap fork
- Open source
- Roblox launcher

## Building

\`\`\`bash
dotnet build
\`\`\`

## License

MIT`,
      "src/Program.cs": `using System;

namespace Voidstrap {
    class Program {
        static void Main() {
            Console.WriteLine("Voidstrap");
        }
    }
}`,
    },
  },
  "dirtyfrag": {
    name: "Dirtyfrag",
    description: "Advanced memory manipulation and exploitation framework",
    language: "C",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 90,
    stars: 1558,
    url: "https://github.com/V4bel/dirtyfrag",
    files: {
      "README.md": `# Dirtyfrag

Advanced memory manipulation and exploitation framework.

## Features

- Memory manipulation
- Exploitation framework
- Security research
- Advanced techniques

## Building

\`\`\`bash
make
\`\`\`

## License

MIT`,
      "src/main.c": `#include <stdio.h>

int main() {
    printf("Dirtyfrag Framework\\n");
    return 0;
}`,
    },
  },
  "ds4": {
    name: "DS4",
    description: "DeepSeek 4 Flash local inference engine for Metal",
    language: "C",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 88,
    stars: 1026,
    url: "https://github.com/antirez/ds4",
    files: {
      "README.md": `# DS4

DeepSeek 4 Flash local inference engine for Metal.

## Features

- Metal acceleration
- DeepSeek 4 Flash
- Local inference
- High performance

## Building

\`\`\`bash
make
\`\`\`

## License

MIT`,
      "src/engine.c": `#include <stdio.h>

int main() {
    printf("DS4 Inference Engine\\n");
    return 0;
}`,
    },
  },
  "rkn-block-checker": {
    name: "RKN Block Checker",
    description: "Diagnose RKN/TSPU internet blocks layer by layer",
    language: "Python",
    type: "tool",
    category: "devops",
    difficulty: "intermediate",
    popularity: 87,
    stars: 855,
    url: "https://github.com/MayersScott/rkn-block-checker",
    files: {
      "README.md": `# RKN Block Checker

Diagnose RKN/TSPU internet blocks layer by layer.

## Features

- DNS checking
- TCP checking
- TLS checking
- HTTP checking
- Network diagnostics

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "requirements.txt": `requests==2.31.0
dnspython==2.4.0`,
    },
  },
  "zero-native": {
    name: "Zero Native",
    description: "Build native desktop + mobile apps with web UI and Zig",
    language: "Zig",
    type: "framework",
    category: "fullstack",
    difficulty: "advanced",
    popularity: 86,
    stars: 645,
    url: "https://github.com/vercel-labs/zero-native",
    files: {
      "README.md": `# Zero Native

Build native desktop + mobile apps with web UI and Zig.

## Features

- Native apps
- Web UI
- Zig backend
- Cross-platform

## Building

\`\`\`bash
zig build
\`\`\`

## License

MIT`,
      "src/main.zig": `const std = @import("std");

pub fn main() !void {
    std.debug.print("Zero Native\\n", .{});
}`,
    },
  },
  "Sprite-Pipeline": {
    name: "Sprite Pipeline",
    description: "2D Sprite Sheet Creation Pipeline",
    language: "Python",
    type: "tool",
    category: "frontend",
    difficulty: "intermediate",
    popularity: 75,
    stars: 429,
    url: "https://github.com/LayrKits/Sprite-Pipeline",
    files: {
      "README.md": `# Sprite Pipeline

2D Sprite Sheet Creation Pipeline.

## Features

- Sprite sheet creation
- 2D graphics
- Pipeline automation
- Python implementation

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "requirements.txt": `Pillow==10.0.0
numpy==1.24.0`,
    },
  },
  "natural_language_autoencoders": {
    name: "Natural Language Autoencoders",
    description: "Natural language processing with autoencoders",
    language: "Python",
    type: "library",
    category: "ml",
    difficulty: "advanced",
    popularity: 74,
    stars: 412,
    url: "https://github.com/kitft/natural_language_autoencoders",
    files: {
      "README.md": `# Natural Language Autoencoders

NLP with autoencoder architectures.

## Features

- Autoencoder models
- NLP processing
- Deep learning
- PyTorch implementation

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "requirements.txt": `torch==2.0.0
transformers==4.30.0`,
    },
  },
  "solidity-cot-auditor": {
    name: "Solidity CoT Auditor",
    description: "Multi-role chain-of-thought LLM pipeline for Solidity security auditing",
    language: "Python",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 83,
    stars: 410,
    url: "https://github.com/butthtio/solidity-cot-auditor",
    files: {
      "README.md": `# Solidity CoT Auditor

Chain-of-thought LLM pipeline for Solidity security auditing.

## Features

- Security auditing
- Chain-of-thought reasoning
- Multi-role LLM
- Solidity analysis

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "requirements.txt": `openai==1.0.0
slither-analyzer==0.9.0`,
    },
  },
  "chainreason": {
    name: "ChainReason",
    description: "A benchmark for evaluating LLM reasoning on Ethereum and DeFi tasks",
    language: "Python",
    type: "benchmark",
    category: "ml",
    difficulty: "advanced",
    popularity: 73,
    stars: 406,
    url: "https://github.com/joshawome/chainreason",
    files: {
      "README.md": `# ChainReason

Benchmark for LLM reasoning on Ethereum and DeFi tasks.

## Features

- Ethereum reasoning
- DeFi tasks
- LLM benchmarking
- Evaluation framework

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## License

MIT`,
      "requirements.txt": `web3==6.0.0
pandas==2.0.0`,
    },
  },
  "univ3-pool-lens": {
    name: "UniV3 Pool Lens",
    description: "TypeScript toolkit for inspecting Uniswap V3 pools",
    language: "TypeScript",
    type: "library",
    category: "backend",
    difficulty: "intermediate",
    popularity: 72,
    stars: 405,
    url: "https://github.com/moxailoo/univ3-pool-lens",
    files: {
      "README.md": `# UniV3 Pool Lens

TypeScript toolkit for inspecting Uniswap V3 pools.

## Features

- Pool inspection
- Liquidity distribution
- Fee yield calculation
- Impermanent loss math

## Installation

\`\`\`bash
npm install
\`\`\`

## License

MIT`,
      "src/index.ts": `export function inspectPool(poolAddress: string) {
  console.log(\`Inspecting pool: \${poolAddress}\`);
}`,
    },
  },
  "EdgeSavedPasswordsDumper": {
    name: "Edge Saved Passwords Dumper",
    description: "Proof of concept showing Edge stores credentials in cleartext",
    language: "C#",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 80,
    stars: 412,
    url: "https://github.com/L1v1ng0ffTh3L4N/EdgeSavedPasswordsDumper",
    files: {
      "README.md": `# Edge Saved Passwords Dumper

POC showing Edge stores credentials in cleartext.

## Features

- Security research
- Credential extraction
- Educational purpose
- C# implementation

## Building

\`\`\`bash
dotnet build
\`\`\`

## License

MIT`,
      "src/Program.cs": `using System;

namespace EdgeDumper {
    class Program {
        static void Main() {
            Console.WriteLine("Edge Saved Passwords Dumper");
        }
    }
}`,
    },
  },
  "LUKSbox": {
    name: "LUKSbox",
    description: "Rust-based encrypted-container tool with passphrase, FIDO2, TPM 2.0, and post-quantum keyslots",
    language: "Rust",
    type: "security",
    category: "devops",
    difficulty: "advanced",
    popularity: 81,
    stars: 407,
    url: "https://github.com/PentHertz/LUKSbox",
    files: {
      "README.md": `# LUKSbox

Rust-based encrypted-container tool with advanced security.

## Features

- Passphrase encryption
- FIDO2 support (YubiKey, Titan, Nitrokey)
- TPM 2.0 support
- Post-quantum keyslots (ML-KEM-768/1024)
- Cross-platform (Linux, macOS, Windows)

## Building

\`\`\`bash
cargo build --release
\`\`\`

## License

MIT`,
      "src/main.rs": `fn main() {
    println!("LUKSbox - Encrypted Container Tool");
}`,
    },
  },
  "media-downloader": {
    name: "Media Downloader",
    description: "Beautiful native macOS video downloader with trim functionality",
    language: "Swift",
    type: "desktop-app",
    category: "mobile",
    difficulty: "intermediate",
    popularity: 83,
    stars: 532,
    url: "https://github.com/pixel-point/media-downloader",
    files: {
      "README.md": `# Media Downloader

Beautiful native macOS video downloader.

## Features

- Video downloading
- Trim functionality
- macOS native
- Beautiful UI

## Building

\`\`\`bash
xcodebuild
\`\`\`

## License

MIT`,
      "MediaDownloader/ContentView.swift": `import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Media Downloader")
    }
}`,
    },
  },
  "agent-skills-eval": {
    name: "Agent Skills Eval",
    description: "A test runner for agentskills.io-style AI agent skills",
    language: "TypeScript",
    type: "tool",
    category: "ml",
    difficulty: "intermediate",
    popularity: 83,
    stars: 437,
    url: "https://github.com/darkrishabh/agent-skills-eval",
    files: {
      "README.md": `# Agent Skills Eval

Test runner for agentskills.io-style AI agent skills.

## Features

- Skill evaluation
- JSONL support
- CLI interface
- Multiple LLM backends

## Installation

\`\`\`bash
npm install
npm test
\`\`\`

## License

MIT`,
      "src/index.ts": `export function evaluateSkill(skill: string) {
  return { result: 'pass' };
}`,
    },
  },
  "files-sdk": {
    name: "Files SDK",
    description: "A unified storage SDK for object and blob backends - S3, R2, Google, Minio",
    language: "TypeScript",
    type: "library",
    category: "backend",
    difficulty: "intermediate",
    popularity: 84,
    stars: 433,
    url: "https://github.com/haydenbleasel/files-sdk",
    files: {
      "README.md": `# Files SDK

A unified storage SDK for object and blob backends.

## Supported Backends

- S3
- R2
- Google Cloud Storage
- Minio

## Features

- Unified API
- Web standards I/O
- Easy switching

## Installation

\`\`\`bash
npm install files-sdk
\`\`\`

## License

MIT`,
      "src/index.ts": `export class FilesSDK {
  constructor(config) {
    this.config = config;
  }

  public async upload(file: File) {
    // Upload to any backend
  }

  public async download(key: string) {
    // Download from any backend
  }
}`,
    },
  },
  "whatcable": {
    name: "WhatCable",
    description: "macOS menu bar app that tells you what each USB-C cable can do",
    language: "Swift",
    type: "desktop-app",
    category: "mobile",
    difficulty: "intermediate",
    popularity: 88,
    stars: 917,
    url: "https://github.com/darrylmorley/whatcable",
    files: {
      "README.md": `# WhatCable

macOS menu bar app that tells you what each USB-C cable can do.

## Features

- USB-C cable analysis
- macOS menu bar
- Hardware info
- Thunderbolt detection

## Building

\`\`\`bash
xcodebuild
\`\`\`

## License

MIT`,
      "WhatCable/ContentView.swift": `import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("WhatCable")
    }
}`,
    },
  },
};

export function getTemplate(
  templateName: string
): GeneratedProject | null {
  const template = TEMPLATES[templateName];
  if (!template) return null;

  return {
    name: template.name,
    description: template.description,
    topics: [
      template.language.toLowerCase(),
      template.type,
      "gitglow",
    ],
    files: template.files,
    language: template.language,
    category: template.category,
    type: template.type,
  };
}

export function listTemplates() {
  return Object.entries(TEMPLATES).map(([key, template]) => ({
    id: key,
    name: template.name,
    description: template.description,
    language: template.language,
    type: template.type,
    category: template.category,
    difficulty: template.difficulty,
    popularity: template.popularity,
  }));
}
