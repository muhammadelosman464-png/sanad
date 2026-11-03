"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import ServicesGrid from "@/components/sections/ServicesGrid";
import FeaturesSection from "@/components/sections/FeaturesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import CTASection from "@/components/sections/CTASection";

/**
 * Sanad (سَنَد) — Main Landing Page
 *
 * Search state is lifted here so HeroSection and ServicesGrid
 * share the same searchTerm: typing in the hero search bar
 * instantly filters the services grid below.
 *
 * Section order:
 *   1. Hero     — Humanitarian mission & search
 *   2. Services — 13 humanitarian service cards (filterable)
 *   3. Features — How it works / trust pillars
 *   4. Social Proof — Family testimonials
 *   5. Pricing  — Lemon Squeezy subscription plans
 *   6. CTA      — Emotional closing call-to-action
 */
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = (event: Event) => setSearchTerm((event as CustomEvent<string>).detail);
    window.addEventListener("sanad-search", handler);
    return () => window.removeEventListener("sanad-search", handler);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ServicesGrid searchTerm={searchTerm} />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}
