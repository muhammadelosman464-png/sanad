"use client";

/**
 * LiveSocialProofFeed
 * ─────────────────────────────────────────────────────────────────────────────
 * Auto-scrolling anonymous activity feed fixed to the bottom-start of the
 * viewport. Each "proof event" fades in from below, shows for ~5 s, then
 * exits upward — cycling continuously from a shuffled pool.
 *
 * Design: glass-morphism card, soft rose/brand palette, fully RTL-safe.
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBasket,
  Flame,
  Sun,
  Stethoscope,
  Gift,
  Flower2,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// ── Types ──────────────────────────────────────────────────────────────────

interface ProofEvent {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  cityFrom: { en: string; ar: string; tr: string };
  cityTo: { en: string; ar: string; tr: string };
  service: { en: string; ar: string; tr: string };
  minutesAgo: number;
}

// ── Static seed data (will be shuffled at runtime) ─────────────────────────

const SEED_EVENTS: Omit<ProofEvent, "id" | "minutesAgo">[] = [
  {
    icon: ShoppingBasket,
    iconColor: "text-amber-500",
    cityFrom: { en: "Berlin", ar: "برلين", tr: "Berlin" },
    cityTo: { en: "Aleppo", ar: "حلب", tr: "Halep" },
    service: { en: "Food Basket", ar: "سلة غذائية", tr: "Gıda Kolisi" },
  },
  {
    icon: Sun,
    iconColor: "text-yellow-500",
    cityFrom: { en: "Istanbul", ar: "إسطنبول", tr: "İstanbul" },
    cityTo: { en: "Damascus", ar: "دمشق", tr: "Şam" },
    service: { en: "Solar Panel", ar: "لوح طاقة شمسية", tr: "Güneş Paneli" },
  },
  {
    icon: Flame,
    iconColor: "text-red-500",
    cityFrom: { en: "Dubai", ar: "دبي", tr: "Dubai" },
    cityTo: { en: "Idlib", ar: "إدلب", tr: "İdlib" },
    service: { en: "Heating Fuel", ar: "محروقات تدفئة", tr: "Isınma Yakıtı" },
  },
  {
    icon: Stethoscope,
    iconColor: "text-emerald-500",
    cityFrom: { en: "London", ar: "لندن", tr: "Londra" },
    cityTo: { en: "Beirut", ar: "بيروت", tr: "Beyrut" },
    service: { en: "Medical Care", ar: "رعاية طبية", tr: "Tıbbi Bakım" },
  },
  {
    icon: Flower2,
    iconColor: "text-pink-500",
    cityFrom: { en: "Paris", ar: "باريس", tr: "Paris" },
    cityTo: { en: "Homs", ar: "حمص", tr: "Humus" },
    service: { en: "Flower Bouquet", ar: "باقة ورد", tr: "Çiçek Buketi" },
  },
  {
    icon: Gift,
    iconColor: "text-purple-500",
    cityFrom: { en: "Stockholm", ar: "ستوكهولم", tr: "Stockholm" },
    cityTo: { en: "Mosul", ar: "الموصل", tr: "Musul" },
    service: { en: "Gift Box", ar: "صندوق هدايا", tr: "Hediye Kutusu" },
  },
  {
    icon: UtensilsCrossed,
    iconColor: "text-brand-500",
    cityFrom: { en: "Amsterdam", ar: "أمستردام", tr: "Amsterdam" },
    cityTo: { en: "Gaza", ar: "غزة", tr: "Gazze" },
    service: { en: "Restaurant Meal", ar: "وجبة مطعم", tr: "Restoran Yemeği" },
  },
  {
    icon: ShoppingBasket,
    iconColor: "text-amber-500",
    cityFrom: { en: "Riyadh", ar: "الرياض", tr: "Riyad" },
    cityTo: { en: "Deir ez-Zor", ar: "دير الزور", tr: "Deir ez-Zor" },
    service: { en: "Food Basket", ar: "سلة غذائية", tr: "Gıda Kolisi" },
  },
  {
    icon: Sun,
    iconColor: "text-yellow-500",
    cityFrom: { en: "Toronto", ar: "تورنتو", tr: "Toronto" },
    cityTo: { en: "Aden", ar: "عدن", tr: "Aden" },
    service: { en: "Solar System", ar: "منظومة طاقة شمسية", tr: "Güneş Sistemi" },
  },
  {
    icon: Stethoscope,
    iconColor: "text-emerald-500",
    cityFrom: { en: "Munich", ar: "ميونيخ", tr: "Münih" },
    cityTo: { en: "Sanaa", ar: "صنعاء", tr: "Sana" },
    service: { en: "Medicine Pack", ar: "حزمة أدوية", tr: "İlaç Paketi" },
  },
];

// Shuffle helper
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Generate a unique id
let _uid = 0;
const uid = () => `proof-${++_uid}-${Math.random().toString(36).slice(2, 6)}`;

// ── Component ──────────────────────────────────────────────────────────────

const DISPLAY_MS = 5000; // how long each card shows
const INTERVAL_MS = 4500; // how often a new card replaces it

export default function LiveSocialProofFeed() {
  const { language } = useLanguage();
  const [current, setCurrent] = useState<ProofEvent | null>(null);
  const poolRef = useRef<Omit<ProofEvent, "id" | "minutesAgo">[]>([]);
  const indexRef = useRef(0);

  // Build shuffled pool once on mount
  useEffect(() => {
    poolRef.current = shuffle(SEED_EVENTS);
  }, []);

  // Rotate through pool events
  useEffect(() => {
    const show = () => {
      const pool = poolRef.current;
      if (!pool.length) return;
      const template = pool[indexRef.current % pool.length];
      indexRef.current += 1;

      const event: ProofEvent = {
        ...template,
        id: uid(),
        minutesAgo: Math.floor(Math.random() * 8) + 1,
      };
      setCurrent(event);

      // Auto-dismiss after DISPLAY_MS
      const dismiss = setTimeout(() => setCurrent(null), DISPLAY_MS);
      return dismiss;
    };

    // Stagger first appearance by 3 s so the hero loads first
    const initial = setTimeout(() => {
      const d = show();
      const interval = setInterval(() => {
        if (d) clearTimeout(d);
        show();
      }, INTERVAL_MS);
      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(initial);
  }, []);

  if (!current) return null;

  const Icon = current.icon;
  const from =
    language === "ar"
      ? current.cityFrom.ar
      : language === "tr"
      ? current.cityFrom.tr
      : current.cityFrom.en;
  const to =
    language === "ar"
      ? current.cityTo.ar
      : language === "tr"
      ? current.cityTo.tr
      : current.cityTo.en;
  const svc =
    language === "ar"
      ? current.service.ar
      : language === "tr"
      ? current.service.tr
      : current.service.en;

  const label =
    language === "ar"
      ? `شخص ما في ${from} أرسل "${svc}" إلى ${to}`
      : language === "tr"
      ? `${from}'dan biri ${to}'a "${svc}" gönderdi`
      : `Someone in ${from} just sent a "${svc}" to ${to}`;

  const ago =
    language === "ar"
      ? `منذ ${current.minutesAgo} دقيقة`
      : language === "tr"
      ? `${current.minutesAgo} dakika önce`
      : `${current.minutesAgo}m ago`;

  return (
    <div
      className="fixed bottom-24 start-6 z-40 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="pointer-events-auto max-w-[280px] flex items-start gap-3 p-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-rose-500/5"
        >
          {/* Service icon bubble */}
          <div
            className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ${current.iconColor}`}
          >
            <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
          </div>

          <div className="min-w-0">
            {/* Live dot + label */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {language === "ar" ? "مباشر" : language === "tr" ? "Canlı" : "Live"}
              </span>
            </div>

            {/* Message */}
            <p className="text-[12px] leading-snug font-medium text-slate-800 dark:text-slate-100">
              {label}
            </p>

            {/* Location + time */}
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {from} → {to} · {ago}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
