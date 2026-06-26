/**
 * Script-based Orchestrator
 * Main coordinator for script-based GitGlow without AI integration
 */

import type { UserIntake } from "@/types/polish";
import type { GitHubProfile } from "@/types/github";
import { generatePremiumReadme } from "./readme-generator";
import { generateProfileUpdate, generateProfileCommands, validateProfileUpdate } from "./profile-styler";
import { generateContributionPlan, validateContributionTarget } from "./contribution-generator";
import { validateDreamRepos, generateForkInstructions, calculateForkComplexity } from "./dream-repo-forker";
import { generateRepoMetadata, generateRepoUpdateCommands, validateRepoMetadata } from "./repo-metadata";
import { generateCommits, generateCommitDates } from "./commit-generator";
import { generateBadgeAutomationPlan } from "./badge-automation";

export interface ScriptGenerationResult {
  success: boolean;
  profileUpdate?: {
    bio: string;
    location: string;
    commands: string;
  };
  readme?: string;
  contributionPlan?: {
    plans: any[];
    totalContributions: number;
    validation: any;
  };
  dreamRepos?: {
    valid: any[];
    invalid: string[];
    instructions: string;
    complexity: any;
  };
  repoMetadata?: {
    repos: any[];
    commands: string[];
  };
  badgeAutomation?: {
    badges: any[];
    commands: string[];
    repoName: string;
    estimatedTime: string;
  };
  errors: string[];
}

export function generateScriptBasedProfile(
  profile: GitHubProfile,
  intake: UserIntake
): ScriptGenerationResult {
  const errors: string[] = [];
  const result: ScriptGenerationResult = {
    success: true,
    errors,
  };

  try {
    // 1. Generate Profile Update
    const profileUpdate = generateProfileUpdate(intake);
    const profileValidation = validateProfileUpdate(profileUpdate);
    
    if (!profileValidation.valid) {
      errors.push(...profileValidation.errors);
      result.success = false;
    } else {
      result.profileUpdate = {
        bio: profileUpdate.bio,
        location: profileUpdate.location,
        commands: generateProfileCommands(profileUpdate),
      };
    }

    // 2. Generate Premium README
    result.readme = generatePremiumReadme(profile, intake);

    // 3. Generate Contribution Plan
    if (intake.selectedTemplates && intake.selectedTemplates.length > 0) {
      const contributionPlan = generateContributionPlan(
        intake.selectedTemplates,
        intake.targetContributions
      );
      
      const totalContributions = contributionPlan.reduce((sum, plan) => sum + plan.commits, 0);
      const validation = validateContributionTarget(contributionPlan, intake.targetContributions);
      
      if (!validation.valid) {
        errors.push(validation.message);
      }
      
      result.contributionPlan = {
        plans: contributionPlan,
        totalContributions,
        validation,
      };
    }

    // 4. Process Dream Repos
    if (intake.dreamRepos && intake.dreamRepos.length > 0) {
      const { valid, invalid } = validateDreamRepos(intake.dreamRepos);
      
      if (invalid.length > 0) {
        errors.push(`Invalid repo URLs: ${invalid.join(', ')}`);
      }
      
      // Get user email from profile or use default
      const userEmail = profile.email || `${profile.login}@users.noreply.github.com`;
      const instructions = generateForkInstructions(valid, profile.login, userEmail);
      const complexity = calculateForkComplexity(valid);
      
      result.dreamRepos = {
        valid,
        invalid,
        instructions,
        complexity,
      };
    }

    // 5. Generate Repo Metadata for Templates
    if (intake.selectedTemplates && intake.selectedTemplates.length > 0) {
      const repos: any[] = [];
      const commands: string[] = [];
      
      // Get user email from profile or use default
      const userEmail = profile.email || `${profile.login}@users.noreply.github.com`;
      
      intake.selectedTemplates.forEach((template, index) => {
        const metadata = generateRepoMetadata(template, intake, index, profile.login);
        const validation = validateRepoMetadata(metadata);
        
        if (!validation.valid) {
          errors.push(`Repo ${index + 1}: ${validation.errors.join(', ')}`);
        } else {
          repos.push(metadata);
          commands.push(generateRepoUpdateCommands(metadata, profile.login, userEmail));
        }
      });
      
      result.repoMetadata = {
        repos,
        commands,
      };
    }

    // 6. Generate Badge Automation Plan
    const badgePlan = generateBadgeAutomationPlan(profile.login);
    result.badgeAutomation = badgePlan;

    // Check if we have enough repos
    const totalRepos = (intake.selectedTemplates?.length || 0) + (intake.dreamRepos?.length || 0);
    if (totalRepos < 5) {
      errors.push(`Total repos (${totalRepos}) is below target of 5. Add more templates or dream repos.`);
    }

  } catch (error) {
    result.success = false;
    errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
  }

  return result;
}

export function generateExecutionScript(result: ScriptGenerationResult): string {
  const script: string[] = [];
  
  script.push(`#!/bin/bash`);
  script.push(`# GitGlow Script-based Profile Generator`);
  script.push(`# Generated automatically - Premium GitHub Profile Transformation`);
  script.push(``);
  script.push(`set -e`);
  script.push(``);
  
  // Profile update commands
  if (result.profileUpdate?.commands) {
    script.push(`# Update GitHub Profile`);
    script.push(result.profileUpdate.commands);
    script.push(``);
  }
  
  // Update profile README
  if (result.readme) {
    script.push(`# Update Profile README`);
    script.push(`gh api user --method PATCH -f "bio=<README.md"`);
    script.push(``);
  }
  
  // Dream repos forking
  if (result.dreamRepos?.instructions) {
    script.push(`# Fork Dream Repos`);
    script.push(result.dreamRepos.instructions);
    script.push(``);
  }
  
  // Create template repos
  if (result.repoMetadata?.commands) {
    script.push(`# Create Template Repos`);
    result.repoMetadata.commands.forEach((commands, index) => {
      script.push(`# Template ${index + 1}`);
      script.push(commands);
    });
  }
  
  // Badge automation
  if (result.badgeAutomation?.commands) {
    script.push(`# GitHub Achievement Badge Automation`);
    script.push(`echo "🏆 Setting up GitHub achievement badge automation..."`);
    script.push(...result.badgeAutomation.commands);
    script.push(``);
  }
  
  script.push(`echo "✨ Profile transformation complete!"`);
  script.push(`echo "🎉 Your GitHub profile is now premium styled!"`);
  
  return script.join('\n');
}

export function generateSummary(result: ScriptGenerationResult): string {
  const summary: string[] = [];
  
  summary.push(`# GitGlow Profile Transformation Summary`);
  summary.push(``);
  
  if (result.profileUpdate) {
    summary.push(`## Profile Update`);
    summary.push(`- Bio: ${result.profileUpdate.bio}`);
    summary.push(`- Location: ${result.profileUpdate.location}`);
    summary.push(``);
  }
  
  if (result.contributionPlan) {
    summary.push(`## Contribution Plan`);
    summary.push(`- Total Contributions: ${result.contributionPlan.totalContributions}`);
    summary.push(`- Templates: ${result.contributionPlan.plans.length}`);
    summary.push(`- Status: ${result.contributionPlan.validation.valid ? '✅ Valid' : '❌ Invalid'}`);
    summary.push(``);
  }
  
  if (result.dreamRepos) {
    summary.push(`## Dream Repos`);
    summary.push(`- Valid Repos: ${result.dreamRepos.valid.length}`);
    summary.push(`- Invalid URLs: ${result.dreamRepos.invalid.length}`);
    summary.push(`- Estimated Time: ${result.dreamRepos.complexity.estimatedTime}`);
    summary.push(``);
  }
  
  if (result.repoMetadata) {
    summary.push(`## Template Repos`);
    summary.push(`- Repos to Create: ${result.repoMetadata.repos.length}`);
    summary.push(`- All include MIT License and Premium README`);
    summary.push(`- All commits will use your GitHub identity`);
    summary.push(``);
  }
  
  if (result.badgeAutomation) {
    summary.push(`## GitHub Achievement Badges`);
    summary.push(`- Badges to Earn: ${result.badgeAutomation.badges.map(b => b.name).join(', ')}`);
    summary.push(`- Estimated Time: ${result.badgeAutomation.estimatedTime}`);
    summary.push(`- Includes YOLO, Pull Shark, and Quickdraw badges`);
    summary.push(``);
  }
  
  if (result.errors.length > 0) {
    summary.push(`## Warnings/Errors`);
    result.errors.forEach(error => {
      summary.push(`- ⚠️ ${error}`);
    });
    summary.push(``);
  }
  
  summary.push(`## Status`);
  summary.push(result.success ? '✅ Ready to execute' : '❌ Please fix errors before proceeding');
  
  return summary.join('\n');
}