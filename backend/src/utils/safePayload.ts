export function safePayload(value: any): any {
  if (Array.isArray(value)) return value.map(safePayload);
  if (!value || typeof value !== "object" || value instanceof Date) return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== "password")
    .map(([key, item]) => [key, safePayload(item)]));
}
