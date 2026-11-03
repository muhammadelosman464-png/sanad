/**
 * /impact — Transparency & Impact Dashboard
 * ─────────────────────────────────────────────────────────────────────────────
 * Showcases Sanad's humanitarian reach for university professors, donors, and
 * partner NGOs. Features:
 *  • 3 animated count-up Stat Cards
 *  • Recharts Area Chart (6-month aid growth)
 *  • Testimonial from a beneficiary family
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Metadata } from "next";
import ImpactPageClient from "./ImpactPageClient";

export const metadata: Metadata = {
  title: "Impact Dashboard | Sanad (سَنَد)",
  description:
    "See the real-world humanitarian impact Sanad has delivered — families supported, local partners active, and aid growth over time.",
};

export default function ImpactPage() {
  return <ImpactPageClient />;
}
