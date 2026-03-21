const KEY = "sneakerauth_free_checks";
const MAX_FREE = 3;

export function getFreeCheckCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(KEY) || "0", 10);
}

export function incrementFreeCheck(): void {
  if (typeof window === "undefined") return;
  const count = getFreeCheckCount();
  localStorage.setItem(KEY, String(count + 1));
}

export function hasFreesRemaining(): boolean {
  return getFreeCheckCount() < MAX_FREE;
}

export function getFreesRemaining(): number {
  return Math.max(0, MAX_FREE - getFreeCheckCount());
}

export function resetFreeChecks(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
