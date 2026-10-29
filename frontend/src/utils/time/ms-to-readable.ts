import { formatDuration, intervalToDuration } from "date-fns";

export function msToReadable(ms: number): string {
  const duration = intervalToDuration({ start: 0, end: ms });
  return formatDuration(duration, {
    format: ["days", "hours", "minutes", "seconds"],
  });
}

export function msToReadableShortened(ms: number) {
  const duration = intervalToDuration({ start: 0, end: ms });

  const parts: string[] = [];
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  if (duration.seconds) parts.push(`${duration.seconds}s`);

  return parts.join(" ");
}
