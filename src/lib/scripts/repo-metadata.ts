/**
 * Script-based Repo Metadata Generator
 * Adds description, MIT license, and premium README to repos
 */

import type { UserIntake } from "@/types/polish";
import { generatePremiumReadme } from "./readme-generator";

export interface RepoMetadata {
  name: string;
  description: string;
  homepage?: string;
  license: string;
  topics: string[];
  readme: string;
}

export function generateRepoMetadata(
  templateName: string,
  intake: UserIntake,
  index: number
): RepoMetadata {
  const { skills, goal, fullName } = intake;
  
  // Generate repo name based on template
  const repoName = `${templateName}-${index + 1}`;
  
  // Generate description based on goal and skills
  const skillString = skills.slice(0, 3).join(", ");
  const descriptions = {
    job: `Professional ${templateName} project showcasing ${skillString} skills - Built for excellence`,
    opensource: `Open source ${templateName} with ${skillString} - Community driven development`,
    portfolio: `Creative ${templateName} featuring ${skillString} - Portfolio showcase project`,
    learning: `Educational ${templateName} implementation with ${skillString} - Learning project`,
  };
  
  // Generate topics from skills
  const topics = skills.slice(0, 5).map(s => s.toLowerCase().replace(/[^a-z0-9]/g, ""));
  
  return {
    name: repoName,
    description: descriptions[goal as keyof typeof descriptions] || descriptions.job,
    homepage: intake.website,
    license: "MIT",
    topics,
    readme: generateTemplateReadme(templateName, intake, index),
  };
}

export function generateTemplateReadme(
  templateName: string,
  intake: UserIntake,
  index: number
): string {
  const { fullName, skills, goal, theme } = intake;
  const skillString = skills.slice(0, 4).join(", ");
  
  return `# ${templateName.charAt(0).toUpperCase() + templateName.slice(1)} ${index + 1}

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/${fullName}/${templateName}-${index + 1}?style=social)](https://github.com/${fullName}/${templateName}-${index + 1}/stargazers)
[![Forks](https://img.shields.io/github/forks/${fullName}/${templateName}-${index + 1}?style=social)](https://github.com/${fullName}/${templateName}-${index + 1}/network/members)

## Description

A premium ${templateName} project built with ${skillString}. This project demonstrates professional development practices and clean code architecture.

## Features

- ⚡ Modern and performant
- 🎨 Beautifully designed
- 📚 Well documented
- 🔧 Easy to configure
- 🚀 Production ready

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/${fullName}/${templateName}-${index + 1}.git

# Navigate to the project
cd ${templateName}-${index + 1}

# Install dependencies
npm install
\`\`\`

## Usage

\`\`\`bash
# Start the development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
\`\`\`

## Tech Stack

${skills.map(skill => `- **${skill}**`).join('\n')}

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**${fullName}**

## Show Your Support

If this project helped you, give it a ⭐!

---

Built with ❤️ by ${fullName}
`;
}

export function generateMITLicense(fullName: string): string {
  return `MIT License

Copyright (c) ${new Date().getFullYear()} ${fullName}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
}

export function generateRepoUpdateCommands(metadata: RepoMetadata): string {
  return `
# Update repository metadata
gh repo edit ${metadata.name} \\
  --description "${metadata.description}" \\
  --homepage "${metadata.homepage || ''}" \\
  --license ${metadata.license}

# Add topics
gh repo edit ${metadata.name} --add-topic ${metadata.topics.join(' --add-topic ')}

# Create README
cat > README.md << 'EOF'
${metadata.readme}
EOF

# Create LICENSE
cat > LICENSE << 'EOF'
${generateMITLicense(metadata.name.split('-')[0])}
EOF

# Commit changes
git add README.md LICENSE
git commit -m "docs: add premium README and MIT license"
git push origin main
`;
}

export function validateRepoMetadata(metadata: RepoMetadata): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!metadata.name || metadata.name.trim().length === 0) {
    errors.push("Repository name is required");
  }
  
  if (!metadata.description || metadata.description.trim().length === 0) {
    errors.push("Description is required");
  }
  
  if (metadata.description && metadata.description.length > 280) {
    errors.push("Description is too long (max 280 characters)");
  }
  
  if (!metadata.license) {
    errors.push("License is required");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}