/**
 * Script-based Contribution Generator
 * Generates 400+ GitHub contributions without AI integration
 */

import { generateCommits, generateCommitDates } from './commit-generator';

export interface ContributionPlan {
  templateName: string;
  commits: number;
  startDate: Date;
  endDate: Date;
}

export function generateContributionPlan(
  templates: string[],
  targetContributions: number = 400
): ContributionPlan[] {
  const plans: ContributionPlan[] = [];
  const commitsPerTemplate = Math.ceil(targetContributions / templates.length);
  const now = new Date();
  
  // Generate plans for each template
  templates.forEach((template, index) => {
    const commits = Math.min(commitsPerTemplate, targetContributions - plans.reduce((sum, p) => sum + p.commits, 0));
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 90); // Start 90 days ago
    
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() - (index * 10)); // Stagger end dates
    
    plans.push({
      templateName: template,
      commits,
      startDate,
      endDate,
    });
  });
  
  return plans;
}

export function generateDailyContributions(
  plan: ContributionPlan
): { date: Date; count: number }[] {
  const contributions: { date: Date; count: number }[] = [];
  const totalDays = Math.ceil((plan.endDate.getTime() - plan.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const commits = generateCommits(plan.templateName, plan.commits);
  const dates = generateCommitDates(plan.endDate, plan.commits);
  
  // Group commits by date
  const dateMap = new Map<string, number>();
  dates.forEach((date) => {
    const dateStr = date.toISOString().split('T')[0];
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
  });
  
  // Convert to array and fill in missing days
  let currentDate = new Date(plan.startDate);
  while (currentDate <= plan.endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    contributions.push({
      date: new Date(currentDate),
      count: dateMap.get(dateStr) || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return contributions;
}

export function calculateTotalContributions(plans: ContributionPlan[]): number {
  return plans.reduce((sum, plan) => sum + plan.commits, 0);
}

export function generateContributionGraph(
  contributions: { date: Date; count: number }[]
): string[][] {
  // Generate a 7x52 grid (days of week x weeks of year)
  const grid: string[][] = Array(7).fill(null).map(() => Array(52).fill('0'));
  
  contributions.forEach(({ date, count }) => {
    const dayOfWeek = date.getDay();
    const weekOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    if (weekOfYear >= 0 && weekOfYear < 52 && dayOfWeek >= 0 && dayOfWeek < 7) {
      grid[dayOfWeek][weekOfYear] = count > 0 ? '1' : '0';
    }
  });
  
  return grid;
}

export function validateContributionTarget(
  plans: ContributionPlan[],
  target: number
): { valid: boolean; actual: number; message: string } {
  const actual = calculateTotalContributions(plans);
  
  if (actual < target) {
    return {
      valid: false,
      actual,
      message: `Generated ${actual} contributions, below target of ${target}`,
    };
  }
  
  return {
    valid: true,
    actual,
    message: `Successfully generated ${actual} contributions`,
  };
}