export function formatDate(value: string | number | null | undefined): string {
  if (value == null) return "Unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatDateTime(
  value: string | number | null | undefined
): string {
  if (value == null) return "Unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function daysUntil(
  value: string | number | null | undefined
): number | null {
  if (value == null) return null;

  const target = new Date(value)
  if (Number.isNaN(target.getTime())) return null;

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diffMs = startOfTarget.getTime() - startOfToday.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 *24));
}

export function isExpiringSoon(
  value: string | number | null | undefined,
  thresholdDays = 90
): boolean {
  const days = daysUntil(value);
  if (days === null) return false;

  // Don't highlight domains that are in the past for some reason
  return days >= 0 && days <= thresholdDays;
}