"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShoppingBasket,
  Flame,
  Sun,
  Stethoscope,
  Gift,
  Flower2,
  UtensilsCrossed,
  CheckCircle2,
  ShieldCheck,
  HandHeart,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * HeroBackground — Elegant CSS-only humanitarian background.
 * Flowing organic gradients that evoke warmth, connection, and compassion.
 * No heavy 3D libraries, zero lag, fully theme-aware.
 */
function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/*
       * Update 5: Logo watermark background.
       * The logo.jpeg is placed as a full-cover background image at very low
       * opacity so it reads as an elegant faint watermark.
       * REMINDER: Place logo.jpeg in /public/logo.jpeg
       */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.07] dark:opacity-[0.04] scale-110"
        style={{ backgroundImage: "url('/logo.jpeg')" }}
      />

      {/* Heavy overlay ensures text readability in both light and dark modes */}
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/92 transition-colors duration-700" />

      {/* Base warm gradient layered on top */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-rose-50/30 to-white/80 dark:from-slate-950/0 dark:via-slate-900/0 dark:to-slate-950/0 transition-colors duration-700" />

      {/* Large soft organic blobs — connection & warmth */}
      <div className="absolute top-[-8%] start-[-10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-rose-300/25 via-amber-200/20 to-transparent dark:from-rose-500/10 dark:via-amber-500/5 dark:to-transparent blur-[80px] animate-pulse-slow" />
      <div className="absolute bottom-[-5%] end-[-8%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-tl from-brand-300/20 via-sky-200/15 to-transparent dark:from-brand-500/10 dark:via-sky-500/5 dark:to-transparent blur-[90px] animate-pulse-slow [animation-delay:2s]" />
      <div className="absolute top-[40%] start-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-gradient-to-tr from-emerald-200/15 via-teal-100/10 to-transparent dark:from-emerald-500/5 dark:via-teal-500/3 dark:to-transparent blur-[70px] animate-pulse-slow [animation-delay:4s]" />

      {/* SVG — Abstract joining hands / connection arcs */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.03]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Flowing curves that symbolize connection, bridge, embrace */}
        <path
          d="M0,400 C200,150 400,650 600,400 C800,150 1000,650 1200,400"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-brand-600 dark:text-brand-400"
        />
        <path
          d="M0,350 C250,100 450,600 650,350 C850,100 1050,600 1200,350"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="text-rose-500 dark:text-rose-400"
        />
        <path
          d="M0,450 C150,200 350,700 550,450 C750,200 950,700 1200,450"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-amber-500 dark:text-amber-400"
        />
        {/* Gentle circles — nodes of connection */}
        <circle cx="300" cy="300" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-400" />
        <circle cx="900" cy="500" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-rose-400" />
        <circle cx="600" cy="400" r="120" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-amber-400" />
      </svg>

      {/* Subtle radial overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,white_85%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,13,22,0.9)_85%)]" />
    </div>
  );
}

interface HeroSectionProps {
  /** Callback fired on every keystroke — lifts search term to parent page */
  onSearch?: (term: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const { t, language, direction } = useLanguage();
  // authOpen removed — guests can browse freely; auth is triggered only at "Order Now"
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = (event: Event) => {
      const nextQuery = (event as CustomEvent<string>).detail;
      setSearchQuery(nextQuery);
      onSearch?.(nextQuery);
    };
    window.addEventListener("sanad-search", handler);
    return () => window.removeEventListener("sanad-search", handler);
  }, [onSearch]);

  const categories = [
    {
      id: "food",
      icon: ShoppingBasket,
      name: language === "ar" ? "سلال غذائية" : language === "tr" ? "Gıda Kolileri" : "Food Baskets",
    },
    {
      id: "fuel",
      icon: Flame,
      name: language === "ar" ? "محروقات وتدفئة" : language === "tr" ? "Yakıt ve Isınma" : "Fuel & Heating",
    },
    {
      id: "solar",
      icon: Sun,
      name: language === "ar" ? "طاقة شمسية" : language === "tr" ? "Güneş Enerjisi" : "Solar Energy",
    },
    {
      id: "health",
      icon: Stethoscope,
      name: language === "ar" ? "خدمات صحية" : language === "tr" ? "Sağlık Hizmeti" : "Health & Medical",
    },
    {
      id: "gifts",
      icon: Gift,
      name: language === "ar" ? "هدايا وعطورات" : language === "tr" ? "Hediye ve Parfüm" : "Gifts & Perfumes",
    },
    {
      id: "flowers",
      icon: Flower2,
      name: language === "ar" ? "باقات ورد" : language === "tr" ? "Çiçek Buketleri" : "Flower Bouquets",
    },
    {
      id: "meals",
      icon: UtensilsCrossed,
      name: language === "ar" ? "وجبات ومطاعم" : language === "tr" ? "Yemek Siparişi" : "Meals & Delivery",
    },
  ];

  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Elegant humanitarian CSS background */}
      <HeroBackground />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Trust pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg shadow-rose-500/5 backdrop-blur-md mb-8"
        >
          <div className="p-1 rounded-full bg-rose-500/10 text-rose-500">
            <HandHeart className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t("heroBadge")}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15] mb-6"
        >
          <span className="block">{t("heroTitle1")}</span>
          <span className="block bg-gradient-to-r from-rose-600 via-amber-500 to-brand-500 dark:from-rose-400 dark:via-amber-300 dark:to-brand-300 bg-clip-text text-transparent">
            {t("heroTitle2")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-10"
        >
          {t("heroSubtitle")}
        </motion.p>

        {/* Search Bar — open to all guests, no auth block on typing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-rose-600/5 backdrop-blur-xl mb-8 flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex items-center gap-3 w-full px-3 py-2">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            {/*
             * FIX (Update 5): Guests can freely type and search.
             * Auth is only required when clicking "Order Now" on a service card.
             * This input has NO onClick handler that opens AuthModal.
             */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder={
                language === "ar"
                  ? "ابحث عن خدمة..."
                  : language === "tr"
                  ? "Hizmet ara..."
                  : "Search for a service..."
              }
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              aria-label="Search services"
            />
          </div>
          {/* The "Send Support" button scrolls to #services — no login required */}
          <a
            href="#services"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-brand-600 hover:from-rose-700 hover:to-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shrink-0 transition"
          >
            <span>{t("heroCtaPrimary")}</span>
            <ArrowIcon className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Quick Category Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-14"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSearchQuery(cat.name)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition shadow-sm hover:scale-105 hover:border-rose-300 dark:hover:border-rose-600"
              >
                <Icon className="w-3.5 h-3.5 text-rose-500" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Trust metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200/60 dark:border-slate-800/60"
        >
          <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold">
            <Heart className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{t("statUsers")}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t("statProviders")}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
            <span>{t("statEscrow")}</span>
          </div>
        </motion.div>
      </div>

      {/* Auth modal is no longer triggered from HeroSection — ServiceDetailsModal handles it */}
    </section>
  );
}
