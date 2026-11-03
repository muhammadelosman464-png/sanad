"use client";

/**
 * StatCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Animated count-up statistic card used on the /impact page.
 * Uses an IntersectionObserver + requestAnimationFrame for the count-up.
 * Design: glassmorphism, soft gradient border, humanitarian palette.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  /** Numeric value to count up to */
  value: number;
  /** Suffix appended after the number, e.g. "+" or " hrs" */
  suffix?: string;
  /** Prefix prepended before the number, e.g. "$" */
  prefix?: string;
  /** Label below the number */
  label: string;
  /** Sub-label / descriptor */
  description: string;
  /** Tailwind gradient stop classes for the icon background */
  iconGradient?: string;
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Number of decimal places for display (default 0) */
  decimals?: number;
}

/* ─── Count-up hook ──────────────────────────────────────────────────────── */

function useCountUp(target: number, decimals: number, enabled: boolean) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const duration = 2000; // ms
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, decimals, enabled]);

  return current;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function StatCard({
  icon: Icon,
  value,
  suffix = "",
  prefix = "",
  label,
  description,
  iconGradient = "from-brand-500 to-brand-600",
  delay = 0,
  decimals = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  /* Intersection observer — start count-up once visible */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const displayValue = useCountUp(value, decimals, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="relative rounded-3xl p-px overflow-hidden group"
    >
      {/* Gradient border ring */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-400/40 via-rose-400/20 to-amber-400/30 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card body */}
      <div className="relative rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Count-up number */}
        <div className="flex items-end gap-1">
          {prefix && (
            <span className="text-2xl font-bold text-slate-500 dark:text-slate-400 mb-0.5">
              {prefix}
            </span>
          )}
          <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
            {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString()}
          </span>
          {suffix && (
            <span className="text-xl font-bold text-brand-500 mb-0.5">{suffix}</span>
          )}
        </div>

        {/* Label */}
        <div>
          <p className="font-bold text-slate-800 dark:text-white text-base leading-tight">
            {label}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
