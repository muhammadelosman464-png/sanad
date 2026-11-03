/**
 * /checkout-success
 * ---------------------------------------------------------------------------
 * Update 3: Beautiful post-payment success page.
 * Shown after router.push('/checkout-success') from ServiceDetailsModal.
 * ---------------------------------------------------------------------------
 */

import type { Metadata } from "next";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Support Sent! | Sanad (سَنَد)",
  description: "Your family support has been sent successfully via Sanad.",
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />;
}
