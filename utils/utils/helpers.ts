/** * Generates fallback initials for an avatar based on a full name.
 *
 * @param name - The full name of the user.
 * @returns A string containing the initials for the avatar fallback.
 */

export function avatarFallbackName(name: string): string {
  const names = name.split(" ");
  if (names.length === 0) return "";

  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

export const throttle = (
  func: (...args: unknown[]) => void,
  limit: number,
): ((...args: unknown[]) => void) => {
  let lastFunc: null | ReturnType<typeof setTimeout> = null;
  let lastRan: null | number = null;

  return function (this: unknown, ...args: unknown[]) {
    if (lastRan === null) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      if (lastFunc !== null) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(
        () => {
          if (Date.now() - (lastRan as number) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - (lastRan as number)),
      );
    }
  };
};

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function getInitials(
  name: null | string | undefined,
  count?: number,
): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase());

  return count && count > 0
    ? initials.slice(0, count).join("")
    : initials.join("");
}

export function uid(): string {
  return (Date.now() + Math.floor(Math.random() * 1000)).toString();
}
