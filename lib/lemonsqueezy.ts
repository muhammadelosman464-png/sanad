/**
 * Lemon Squeezy Integration Helper (Placeholder for Subscriptions & One-time checkout)
 */

export interface CheckoutOptions {
  variantId: string;
  userEmail?: string;
  userName?: string;
  customData?: Record<string, string>;
}

export function openLemonSqueezyCheckout({ variantId, userEmail, userName, customData }: CheckoutOptions) {
  // If window.createLemonSqueezy is initialized via Lemon.js
  if (typeof window !== "undefined" && (window as unknown as { LemonSqueezy?: { Url?: { Open: (url: string) => void } } }).LemonSqueezy) {
    const lemon = (window as unknown as { LemonSqueezy: { Url: { Open: (url: string) => void } } }).LemonSqueezy;
    const checkoutUrl = `https://sanad.lemonsqueezy.com/buy/${variantId}?checkout[email]=${encodeURIComponent(userEmail || "")}`;
    lemon.Url.Open(checkoutUrl);
    return;
  }

  // Fallback direct redirection
  const baseCheckout = process.env.NEXT_PUBLIC_LEMONSQUEEZY_AFFILIATE_URL || "https://sanad.lemonsqueezy.com/checkout";
  const url = new URL(baseCheckout);
  if (variantId) url.searchParams.set("variant", variantId);
  if (userEmail) url.searchParams.set("email", userEmail);
  if (userName) url.searchParams.set("name", userName);

  if (typeof window !== "undefined") {
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }
}
