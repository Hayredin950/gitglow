import { createOctokit } from "./client";

export interface ScopeInfo {
  hasRepoAccess: boolean;
  hasUserWrite: boolean;
  allScopes: string[];
  missingCritical: string[];
}

/**
 * Validates that the GitHub token has the necessary scopes for deployment
 */
export async function validateTokenScopes(token: string): Promise<ScopeInfo> {
  try {
    const octokit = createOctokit(token);
    
    // Get authenticated user to check token validity
    const { headers } = await octokit.request("GET /user");
    
    // GitHub returns the scopes in the x-oauth-scopes header
    const scopesHeader = headers["x-oauth-scopes"] || "";
    const allScopes = scopesHeader
      .split(", ")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log("[v0] Token scopes:", allScopes);

    const hasRepoAccess = allScopes.includes("repo") || allScopes.includes("public_repo");
    const hasUserWrite = allScopes.includes("user");

    const missingCritical: string[] = [];
    if (!hasRepoAccess) {
      missingCritical.push("repo");
    }

    return {
      hasRepoAccess,
      hasUserWrite,
      allScopes,
      missingCritical,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[v0] Token validation failed:", msg);
    throw new Error(`Invalid GitHub token: ${msg}`);
  }
}

/**
 * Checks if the token has sufficient scopes for the operation
 */
export function checkScopesForDeploy(scopeInfo: ScopeInfo): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (scopeInfo.missingCritical.length > 0) {
    throw new Error(`Token missing critical scopes: ${scopeInfo.missingCritical.join(", ")}`);
  }

  if (!scopeInfo.hasUserWrite) {
    warnings.push("⚠️ Token lacks 'user' scope: profile bio update will be skipped (optional)");
  }

  return {
    isValid: scopeInfo.missingCritical.length === 0,
    warnings,
  };
}
