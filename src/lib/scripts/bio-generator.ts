/**
 * Script-based Bio Generator
 * Generates premium bio and location without AI integration
 */

import type { UserIntake } from "@/types/polish";

export function generatePremiumBio(intake: UserIntake): string {
  const { fullName, skills, goal, currentRole, company } = intake;
  const skillString = skills.slice(0, 2).join(" & ");
  
  const bios = {
    job: `${fullName} | ${currentRole || 'Software Engineer'} @ ${company || 'Tech Company'} | ${skillString} | Building the future`,
    opensource: `${fullName} | Open Source Contributor | ${skillString} | Making tech accessible`,
    portfolio: `${fullName} | Full Stack Developer | ${skillString} | Crafting digital experiences`,
    learning: `${fullName} | Lifelong Learner | ${skillString} | Always growing`,
  };
  
  return bios[goal as keyof typeof bios] || bios.job;
}

export function generatePremiumLocation(intake: UserIntake): string {
  const { goal, skills } = intake;
  
  const locations = {
    job: "San Francisco, CA",
    opensource: "Worldwide",
    portfolio: "New York, NY", 
    learning: "Remote",
  };
  
  return locations[goal as keyof typeof locations] || "Remote";
}