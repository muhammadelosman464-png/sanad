"use client";

/**
 * RoundUpDonation
 * ─────────────────────────────────────────────────────────────────────────────
 * Micro-donation "round-up" checkbox for the checkout/order flow.
 *
 * • Calculates the round-up amount from the order total.
 * • If the natural round-up is < $0.10, it rounds to the next dollar + 1
 *   to avoid insignificant amounts.
 * • Animated expand/collapse of the impact message when checked.
 * • "What is this?" expandable tooltip / info section.
 * • Calls onChange(donate: boolean, amount: number) so the parent can
 *   update the order total.
 *
 * Design: warm humanitarian palette, glassmorphism, RTL-safe.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/utils";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface RoundUpDonationProps {
  /** The base order total in dollars, e.g. 48.50 */
  orderTotal: number;
  /** Called whenever the user toggles or the donation amount changes */
  onChange: (donate: boolean, donationAmount: number) => void;
}

/* ─── Helper ─────────────────────────────────────────────────────────────── */

function calcRoundUp(total: number): { roundedUp: number; donation: number } {
  let ceil = Math.ceil(total);
  let donation = parseFloat((ceil - total).toFixed(2));
  // Avoid tiny cents — bump up one more dollar
  if (donation < 0.1) {
    ceil += 1;
    donation = parseFloat((ceil - total).toFixed(2));
  }
  return { roundedUp: ceil, donation };
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function RoundUpDonation({
  orderTotal,
  onChange,
}: RoundUpDonationProps) {
  const { language } = useLanguage();
  const checkboxId = useId();
  const [checked, setChecked] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const { roundedUp, donation } = calcRoundUp(orderTotal);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setChecked(val);
    onChange(val, donation);
  };

  /* ── Translations ─────────────────────────────────────────────────────── */
  const T = {
    checkboxLabel:
      language === "ar"
        ? `أكمل مبلغ طلبك من ${formatPrice(orderTotal)} إلى ${formatPrice(roundedUp)} وتبرّع بـ ${formatPrice(donation)} لدعم عائلة بلا أقارب في الغربة.`
        : language === "tr"
        ? `Siparişinizi ${formatPrice(orderTotal)}'dan ${formatPrice(roundedUp)}'a yuvarlayın ve ${formatPrice(donation)}'ı yurt dışında akrabası olmayan bir aileye bağışlayın.`
        : `Round up your ${formatPrice(orderTotal)} order to ${formatPrice(roundedUp)} and donate ${formatPrice(donation)} to support a family without expat relatives.`,
    impactMsg:
      language === "ar"
        ? `🤍 شكراً لك! تبرعك بـ ${formatPrice(donation)} قد يعني وجبة دافئة لأسرة محتاجة.`
        : language === "tr"
        ? `🤍 Teşekkürler! ${formatPrice(donation)} bağışınız, ihtiyaç sahibi bir aileye sıcak bir öğün anlamına gelebilir.`
        : `🤍 Thank you! Your ${formatPrice(donation)} donation could mean a warm meal for a family in need.`,
    whatIsThis:
      language === "ar"
        ? "ما هذا؟"
        : language === "tr"
        ? "Bu nedir?"
        : "What is this?",
    infoText:
      language === "ar"
        ? "ميزة التبرع التلقائي تتيح لك تقريب مبلغ طلبك لأقرب دولار والتبرع بالفرق لصالح عائلات لا يملك أفرادها أقارب في الغربة يدعمونهم. يتم تحويل 100% من التبرعات مباشرةً."
        : language === "tr"
        ? "Otomatik bağış özelliği, sipariş tutarınızı en yakın dolara yuvarlayarak farkı yurt dışında akrabası olmayan ailelere bağışlamanızı sağlar. Bağışların %100'ü doğrudan aktarılır."
        : "The round-up feature lets you donate the spare change from your order to families who have no relatives abroad to support them. 100% of donations are transferred directly.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-rose-200 dark:border-rose-800/40 bg-rose-50/60 dark:bg-rose-900/10 overflow-hidden"
    >
      {/* ── Main checkbox row ─────────────────────────────────────────── */}
      <label
        htmlFor={checkboxId}
        className="flex items-start gap-3 px-5 py-4 cursor-pointer group"
      >
        {/* Custom checkbox */}
        <div className="relative mt-0.5 shrink-0">
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              checked
                ? "bg-rose-500 border-rose-500"
                : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-rose-400"
            }`}
          >
            {checked && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            )}
          </div>
        </div>

        {/* Heart icon + label */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Heart
              className={`w-4 h-4 transition-colors ${
                checked ? "text-rose-500 fill-rose-500" : "text-slate-400"
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
              {language === "ar"
                ? "تبرع صغير، أثر كبير"
                : language === "tr"
                ? "Küçük Bağış, Büyük Etki"
                : "Micro-Donation"}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {T.checkboxLabel}
          </p>
        </div>
      </label>

      {/* ── Animated impact message ───────────────────────────────────── */}
      <AnimatePresence>
        {checked && (
          <motion.div
            key="impact"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-3">
              <div className="rounded-xl bg-rose-100 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 px-4 py-3">
                <p className="text-sm text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
                  {T.impactMsg}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── "What is this?" expandable info ──────────────────────────── */}
      <div className="border-t border-rose-200 dark:border-rose-800/40">
        <button
          type="button"
          onClick={() => setInfoOpen((o) => !o)}
          className="flex items-center gap-2 w-full px-5 py-3 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>{T.whatIsThis}</span>
          {infoOpen ? (
            <ChevronUp className="w-3.5 h-3.5 ms-auto" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 ms-auto" />
          )}
        </button>

        <AnimatePresence>
          {infoOpen && (
            <motion.div
              key="info"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {T.infoText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
