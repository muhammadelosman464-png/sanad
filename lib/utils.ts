import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — Merge Tailwind classes intelligently.
 * Combines clsx (conditional class logic) with tailwind-merge
 * (deduplication of conflicting Tailwind utilities).
 *
 * @example
 *   cn("px-4 py-2", isActive && "bg-brand-500", "py-3")
 *   // → "px-4 bg-brand-500 py-3"  (py-2 deduplicated)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * formatPrice — Format a numeric amount as a currency string.
 *
 * @example
 *   formatPrice(4900, "USD")  // → "$49.00"
 *   formatPrice(4900, "EUR")  // → "€49.00"
 */
export function formatPrice(
  amountInCents: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);
}

/**
 * truncate — Truncate a string to a max length and append ellipsis.
 */
export function truncate(str: string, maxLength: number = 80): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength).trimEnd()}…`;
}

/**
 * sleep — Promise-based delay helper for async flows.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * isRTL — Returns true if the given language code uses RTL layout.
 */
export function isRTL(lang: string): boolean {
  return lang === "ar" || lang === "he" || lang === "fa" || lang === "ur";
}

/**
 * generateOrderId — Generate a random human-readable order reference.
 *
 * @example
 *   generateOrderId()  // → "SND-7A3F2B"
 */
export function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const id = Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
  return `SND-${id}`;
}
