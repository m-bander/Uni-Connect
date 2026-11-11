// PostgreSQL/connection error codes are useful; messages and query parameters can contain secrets.
export function reportServerError(operation: string, error: unknown) {
  const codes = new Set<string>();
  let current = error;
  for (let depth = 0; depth < 5 && current && typeof current === "object"; depth++) {
    const item = current as { code?: unknown; cause?: unknown };
    if (typeof item.code === "string" && /^[A-Z0-9_]{2,40}$/.test(item.code)) codes.add(item.code);
    current = item.cause;
  }
  console.error(JSON.stringify({ operation, codes: [...codes] }));
}
