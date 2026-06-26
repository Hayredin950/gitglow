/**
 * Script-based Profile Styling
 * Creates premium GitHub profile styling without AI integration
 */

import type { UserIntake } from "@/types/polish";
import { generatePremiumBio, generatePremiumLocation } from "./bio-generator";

export interface ProfileUpdate {
  bio: string;
  location: string;
  name: string;
  blog?: string;
  twitterUsername?: string;
  linkedin?: string;
  company?: string;
}

export function generateProfileUpdate(intake: UserIntake): ProfileUpdate {
  const {
    fullName,
    website,
    twitter,
    linkedin,
    company,
  } = intake;
  
  // Parse Twitter username from URL
  let twitterUsername: string | undefined;
  if (twitter) {
    const match = twitter.match(/twitter\.com\/([^\/]+)/);
    if (match) twitterUsername = match[1];
  }
  
  // Parse LinkedIn from URL
  let linkedinUrl: string | undefined;
  if (linkedin) {
    linkedinUrl = linkedin;
  }
  
  return {
    bio: generatePremiumBio(intake),
    location: generatePremiumLocation(intake),
    name: fullName,
    blog: website,
    twitterUsername,
    linkedin: linkedinUrl,
    company,
  };
}

export function generateProfileCommands(update: ProfileUpdate): string {
  const commands: string[] = [];
  
  commands.push(`# Update GitHub Profile`);
  commands.push(`gh api user --method PATCH -f "bio=${update.bio}"`);
  commands.push(`gh api user --method PATCH -f "location=${update.location}"`);
  commands.push(`gh api user --method PATCH -f "name=${update.name}"`);
  
  if (update.blog) {
    commands.push(`gh api user --method PATCH -f "blog=${update.blog}"`);
  }
  
  if (update.twitterUsername) {
    commands.push(`gh api user --method PATCH -f "twitter_username=${update.twitterUsername}"`);
  }
  
  if (update.company) {
    commands.push(`gh api user --method PATCH -f "company=${update.company}"`);
  }
  
  return commands.join('\n');
}

export function validateProfileUpdate(update: ProfileUpdate): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!update.name || update.name.trim().length === 0) {
    errors.push("Name is required");
  }
  
  if (!update.bio || update.bio.trim().length === 0) {
    errors.push("Bio is required");
  }
  
  if (update.bio && update.bio.length > 160) {
    errors.push("Bio is too long (max 160 characters)");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function generateProfilePreview(update: ProfileUpdate): string {
  return `
## Profile Preview

**Name:** ${update.name}
**Bio:** ${update.bio}
**Location:** ${update.location}
**Company:** ${update.company || 'Not specified'}
**Website:** ${update.blog || 'Not specified'}
**Twitter:** ${update.twitterUsername ? `@${update.twitterUsername}` : 'Not specified'}
**LinkedIn:** ${update.linkedin || 'Not specified'}
`;
}