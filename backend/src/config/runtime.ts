import "dotenv/config";

export function tokenSecret(name: "ACCESS_TOKEN_SECRET" | "REFRESH_TOKEN_SECRET"): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`${name} is required`);
  return value;
}

// Return names only. Never include environment values in responses or logs.
export function runtimeConfigIssues(): string[] {
  const issues: string[] = [];
  for (const name of ["ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"] as const) {
    if (!process.env[name]?.trim()) issues.push(name);
  }
  if (process.env.VERCEL && (process.env.UNICONNECT_LOCAL_QA === "1" || process.env.UNICONNECT_LOCAL_APP === "1")) {
    issues.push("LOCAL_DATABASE_FLAGS_NOT_ALLOWED");
  }
  if (process.env.UNICONNECT_LOCAL_QA !== "1" && process.env.UNICONNECT_LOCAL_APP !== "1") {
    try {
      const url = new URL(process.env.DATABASE_URL || "");
      if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.hostname) issues.push("DATABASE_URL");
    } catch { issues.push("DATABASE_URL"); }
  }
  return issues;
}
