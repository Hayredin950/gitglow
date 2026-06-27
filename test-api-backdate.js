import { Octokit } from "octokit";
import dotenv from "dotenv";

dotenv.config();

// Test script to verify GitHub API backdating works
const octokit = new Octokit({ auth: process.env.TEST_GITHUB_TOKEN || "" });
const OWNER = process.env.TEST_GITHUB_OWNER || "YOUR_USERNAME";
const REPO = "gitglow-test-backdate-" + Date.now();

async function testBackdatedCommit() {
  try {
    console.log("Creating test repo:", REPO);
    await octokit.repos.createForAuthenticatedUser({
      name: REPO,
      description: "Test repo for GitGlow backdated commits",
      private: false,
      auto_init: false
    });
    console.log("Repo created");

    // Wait a bit
    await new Promise(r => setTimeout(r, 2000));

    // Create first commit with backdated date
    const testDate = new Date();
    testDate.setMonth(testDate.getMonth() - 2); // 2 months ago
    testDate.setDate(testDate.getDate() - Math.floor(Math.random() * 10));

    console.log("Pushing backdated commit with date:", testDate.toISOString());

    const content = Buffer.from("# Test Backdated Commit\n\nThis is a test for GitGlow!" , "utf8").toString("base64");

    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: "README.md",
      message: "Test backdated commit",
      content: content,
      author: {
        name: "Test User",
        email: "test@example.com",
        date: testDate.toISOString()
      },
      committer: {
        name: "Test User",
        email: "test@example.com",
        date: testDate.toISOString()
      },
      branch: "main"
    });

    console.log("✅ Backdated commit pushed successfully!");
    console.log("Check it here:", `https://github.com/${OWNER}/${REPO}`);
  } catch (error) {
    console.error("❌ Error testing backdate:", error.response?.data || error.message);
  }
}

testBackdatedCommit();
