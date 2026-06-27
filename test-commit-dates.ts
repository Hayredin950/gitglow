import { generateCommitDates } from "./src/lib/scripts/commit-generator";

console.log("Testing commit date generation...");
const dates = generateCommitDates(new Date(), 10);
console.log("Generated dates:");
dates.forEach((d, i) => {
  console.log(`${i+1}.`, d.toISOString(), "→", d.toLocaleString());
});
